import { db } from "../db";
import { coupon, couponUsage, type Coupon, type NewCoupon } from "../db/schema";
import { eq, and, gte, lte, or, isNull, sql } from "drizzle-orm";
import { Errors, type ServiceResult, ok, fail } from "./utils";

export class CouponService {
  /**
   * Get all coupons (admin)
   */
  static async getAll(options?: {
    includeInactive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Coupon[]> {
    const conditions = [];

    if (!options?.includeInactive) {
      conditions.push(eq(coupon.isActive, true));
    }

    return await db.query.coupon.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      limit: options?.limit ?? 50,
      offset: options?.offset ?? 0,
      orderBy: (coupon, { desc }) => [desc(coupon.createdAt)],
    });
  }

  /**
   * Get coupon by ID
   */
  static async getById(id: string): Promise<ServiceResult<Coupon>> {
    const result = await db.query.coupon.findFirst({
      where: eq(coupon.id, id),
      with: {
        usages: true,
      },
    });

    if (!result) {
      return fail(Errors.notFound("Coupon"));
    }

    return ok(result);
  }

  /**
   * Validate and get coupon by code
   */
  static async validate(
    code: string,
    orderTotal: number,
    userId?: string
  ): Promise<ServiceResult<{ coupon: Coupon; discountAmount: number }>> {
    const now = new Date();

    const result = await db.query.coupon.findFirst({
      where: and(
        eq(coupon.code, code.toUpperCase()),
        eq(coupon.isActive, true)
      ),
    });

    if (!result) {
      return fail(Errors.invalidCoupon("Code not found"));
    }

    // Check validity period
    if (result.startsAt && result.startsAt > now) {
      return fail(Errors.invalidCoupon("Coupon not yet active"));
    }

    if (result.expiresAt && result.expiresAt < now) {
      return fail(Errors.invalidCoupon("Coupon has expired"));
    }

    // Check usage limit
    if (result.usageLimit && result.usageCount >= result.usageLimit) {
      return fail(Errors.invalidCoupon("Coupon usage limit reached"));
    }

    // Check minimum purchase
    if (result.minPurchase && orderTotal < result.minPurchase) {
      return fail(
        Errors.invalidCoupon(`Minimum purchase is ${result.minPurchase}`)
      );
    }

    // Check user usage limit
    if (userId && result.usagePerUser) {
      const userUsageCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(couponUsage)
        .where(
          and(
            eq(couponUsage.couponId, result.id),
            eq(couponUsage.userId, userId)
          )
        );

      if (Number(userUsageCount[0]?.count ?? 0) >= result.usagePerUser) {
        return fail(Errors.invalidCoupon("You have already used this coupon"));
      }
    }

    // Calculate discount
    let discountAmount: number;
    if (result.type === "PERCENTAGE") {
      discountAmount = Math.floor((orderTotal * result.value) / 100);
      if (result.maxDiscount && discountAmount > result.maxDiscount) {
        discountAmount = result.maxDiscount;
      }
    } else {
      discountAmount = result.value;
    }

    // Ensure discount doesn't exceed order total
    if (discountAmount > orderTotal) {
      discountAmount = orderTotal;
    }

    return ok({ coupon: result, discountAmount });
  }

  /**
   * Record coupon usage
   */
  static async recordUsage(
    couponId: string,
    orderId: string,
    discountAmount: number,
    userId?: string
  ): Promise<ServiceResult<void>> {
    // Create usage record
    await db.insert(couponUsage).values({
      couponId,
      orderId,
      userId: userId ?? null,
      discountAmount,
    });

    // Increment usage count
    await db
      .update(coupon)
      .set({
        usageCount: sql`${coupon.usageCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(coupon.id, couponId));

    return ok(undefined);
  }

  /**
   * Create coupon
   */
  static async create(data: NewCoupon): Promise<ServiceResult<Coupon>> {
    // Normalize code to uppercase
    const code = data.code.toUpperCase();

    // Check if code exists
    const existing = await db.query.coupon.findFirst({
      where: eq(coupon.code, code),
    });

    if (existing) {
      return fail(Errors.conflict("Coupon code already exists"));
    }

    const [created] = await db
      .insert(coupon)
      .values({
        ...data,
        code,
      })
      .returning();

    return ok(created);
  }

  /**
   * Update coupon
   */
  static async update(
    id: string,
    data: Partial<NewCoupon>
  ): Promise<ServiceResult<Coupon>> {
    const existing = await db.query.coupon.findFirst({
      where: eq(coupon.id, id),
    });

    if (!existing) {
      return fail(Errors.notFound("Coupon"));
    }

    // If code is being updated, check for conflicts
    if (data.code && data.code.toUpperCase() !== existing.code) {
      const codeExists = await db.query.coupon.findFirst({
        where: eq(coupon.code, data.code.toUpperCase()),
      });

      if (codeExists) {
        return fail(Errors.conflict("Coupon code already exists"));
      }
    }

    const [updated] = await db
      .update(coupon)
      .set({
        ...data,
        code: data.code ? data.code.toUpperCase() : existing.code,
        updatedAt: new Date(),
      })
      .where(eq(coupon.id, id))
      .returning();

    return ok(updated);
  }

  /**
   * Delete coupon
   */
  static async delete(id: string): Promise<ServiceResult<void>> {
    await db.delete(coupon).where(eq(coupon.id, id));
    return ok(undefined);
  }

  /**
   * Toggle coupon active status
   */
  static async toggleActive(id: string): Promise<ServiceResult<Coupon>> {
    const existing = await db.query.coupon.findFirst({
      where: eq(coupon.id, id),
    });

    if (!existing) {
      return fail(Errors.notFound("Coupon"));
    }

    const [updated] = await db
      .update(coupon)
      .set({
        isActive: !existing.isActive,
        updatedAt: new Date(),
      })
      .where(eq(coupon.id, id))
      .returning();

    return ok(updated);
  }
}
