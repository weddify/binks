import { db } from "../db";
import {
  product,
  productGroup,
  type Product,
  type NewProduct,
  type ProductGroup,
  type NewProductGroup,
} from "../db/schema";
import { eq, ilike, and, or, asc, desc, sql } from "drizzle-orm";
import { Errors, type ServiceResult, ok, fail } from "./utils";

export class ProductService {
  // ============================================
  // Product Group Operations
  // ============================================

  /**
   * Get all product groups with products
   */
  static async getAllGroups(categoryId?: string): Promise<ProductGroup[]> {
    const conditions = [];

    if (categoryId) {
      conditions.push(eq(productGroup.categoryId, categoryId));
    }
    conditions.push(eq(productGroup.isActive, true));

    return await db.query.productGroup.findMany({
      where: and(...conditions),
      orderBy: [asc(productGroup.sortOrder)],
      with: {
        products: {
          where: eq(product.isActive, true),
          orderBy: [asc(product.sortOrder)],
        },
        category: true,
      },
    });
  }

  /**
   * Create product group
   */
  static async createGroup(
    data: NewProductGroup
  ): Promise<ServiceResult<ProductGroup>> {
    const [created] = await db.insert(productGroup).values(data).returning();
    return ok(created);
  }

  /**
   * Update product group
   */
  static async updateGroup(
    id: string,
    data: Partial<NewProductGroup>
  ): Promise<ServiceResult<ProductGroup>> {
    const existing = await db.query.productGroup.findFirst({
      where: eq(productGroup.id, id),
    });

    if (!existing) {
      return fail(Errors.notFound("Product group"));
    }

    const [updated] = await db
      .update(productGroup)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(productGroup.id, id))
      .returning();

    return ok(updated);
  }

  /**
   * Delete product group
   */
  static async deleteGroup(id: string): Promise<ServiceResult<void>> {
    await db.delete(productGroup).where(eq(productGroup.id, id));
    return ok(undefined);
  }

  // ============================================
  // Product Operations
  // ============================================

  /**
   * Get all products with optional filters
   */
  static async getAll(options?: {
    search?: string;
    categoryId?: string;
    groupId?: string;
    includeInactive?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: "price" | "sold" | "created" | "name";
    sortOrder?: "asc" | "desc";
  }): Promise<{ products: Product[]; total: number }> {
    const conditions = [];

    if (!options?.includeInactive) {
      conditions.push(eq(product.isActive, true));
    }

    if (options?.search) {
      conditions.push(
        or(
          ilike(product.title, `%${options.search}%`),
          ilike(product.description, `%${options.search}%`),
          ilike(product.slug, `%${options.search}%`)
        )
      );
    }

    if (options?.groupId) {
      conditions.push(eq(product.groupId, options.groupId));
    }

    // Sort configuration
    const sortMap = {
      price: product.price,
      sold: product.soldCount,
      created: product.createdAt,
      name: product.title,
    };
    const sortColumn = sortMap[options?.sortBy ?? "created"];
    const sortFn = options?.sortOrder === "asc" ? asc : desc;

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [products, countResult] = await Promise.all([
      db.query.product.findMany({
        where: whereClause,
        orderBy: [sortFn(sortColumn)],
        limit: options?.limit ?? 50,
        offset: options?.offset ?? 0,
        with: {
          group: {
            with: {
              category: true,
            },
          },
        },
      }),
      db
        .select({ count: sql<number>`count(*)` })
        .from(product)
        .where(whereClause),
    ]);

    return {
      products,
      total: Number(countResult[0]?.count ?? 0),
    };
  }

  /**
   * Get product by ID or slug
   */
  static async getByIdOrSlug(
    idOrSlug: string
  ): Promise<ServiceResult<Product>> {
    const result = await db.query.product.findFirst({
      where: or(eq(product.id, idOrSlug), eq(product.slug, idOrSlug)),
      with: {
        group: {
          with: {
            category: true,
          },
        },
        stockItems: true,
      },
    });

    if (!result) {
      return fail(Errors.notFound("Product"));
    }

    return ok(result);
  }

  /**
   * Create product
   */
  static async create(data: NewProduct): Promise<ServiceResult<Product>> {
    // Check if slug exists
    const existing = await db.query.product.findFirst({
      where: eq(product.slug, data.slug),
    });

    if (existing) {
      return fail(Errors.conflict("Product with this slug already exists"));
    }

    const [created] = await db.insert(product).values(data).returning();
    return ok(created);
  }

  /**
   * Update product
   */
  static async update(
    id: string,
    data: Partial<NewProduct>
  ): Promise<ServiceResult<Product>> {
    const existing = await db.query.product.findFirst({
      where: eq(product.id, id),
    });

    if (!existing) {
      return fail(Errors.notFound("Product"));
    }

    // If slug is being updated, check for conflicts
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await db.query.product.findFirst({
        where: eq(product.slug, data.slug),
      });

      if (slugExists) {
        return fail(Errors.conflict("Product with this slug already exists"));
      }
    }

    const [updated] = await db
      .update(product)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(product.id, id))
      .returning();

    return ok(updated);
  }

  /**
   * Delete product
   */
  static async delete(id: string): Promise<ServiceResult<void>> {
    await db.delete(product).where(eq(product.id, id));
    return ok(undefined);
  }

  /**
   * Update stock count (called after stock changes)
   */
  static async updateStockCount(productId: string): Promise<void> {
    const stockCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(db._.fullSchema.stockItem)
      .where(
        and(
          eq(db._.fullSchema.stockItem.productId, productId),
          eq(db._.fullSchema.stockItem.status, "available")
        )
      );

    await db
      .update(product)
      .set({ stockCount: Number(stockCount[0]?.count ?? 0) })
      .where(eq(product.id, productId));
  }

  /**
   * Increment sold count
   */
  static async incrementSoldCount(
    productId: string,
    quantity: number
  ): Promise<void> {
    await db
      .update(product)
      .set({
        soldCount: sql`${product.soldCount} + ${quantity}`,
      })
      .where(eq(product.id, productId));
  }
}
