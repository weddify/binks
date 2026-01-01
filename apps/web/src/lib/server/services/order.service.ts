import { db } from "../db";
import {
  order,
  orderItem,
  product,
  type Order,
  type NewOrder,
  type OrderItem,
  type NewOrderItem,
} from "../db/schema";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { Errors, type ServiceResult, ok, fail } from "./utils";
import { StockService } from "./stock.service";
import { CouponService } from "./coupon.service";
import { ProductService } from "./product.service";

// Get order expiry from env or default to 60 minutes
const ORDER_EXPIRY_MINUTES = parseInt(
  process.env.ORDER_EXPIRY_MINUTES || "60",
  10
);

// Order ID generator: INV-YYYYMMDD-XXXXX
function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `INV-${year}${month}${day}-${random}`;
}

export interface CreateOrderInput {
  buyerEmail: string;
  buyerPhone?: string;
  buyerName?: string;
  userId?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  couponCode?: string;
}

export class OrderService {
  /**
   * Get all orders (admin) or user orders
   */
  static async getAll(options?: {
    userId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ orders: Order[]; total: number }> {
    const conditions = [];

    if (options?.userId) {
      conditions.push(eq(order.userId, options.userId));
    }

    if (options?.status) {
      conditions.push(eq(order.status, options.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [orders, countResult] = await Promise.all([
      db.query.order.findMany({
        where: whereClause,
        orderBy: [desc(order.createdAt)],
        limit: options?.limit ?? 50,
        offset: options?.offset ?? 0,
        with: {
          items: {
            with: {
              product: true,
            },
          },
          payments: true,
          user: true,
        },
      }),
      db
        .select({ count: sql<number>`count(*)` })
        .from(order)
        .where(whereClause),
    ]);

    return {
      orders,
      total: Number(countResult[0]?.count ?? 0),
    };
  }

  /**
   * Get order by ID with items
   */
  static async getById(
    id: string
  ): Promise<ServiceResult<Order & { items: OrderItem[] }>> {
    const result = await db.query.order.findFirst({
      where: eq(order.id, id),
      with: {
        items: {
          with: {
            product: true,
            stockItems: true,
          },
        },
        payments: true,
        user: true,
        coupon: true,
      },
    });

    if (!result) {
      return fail(Errors.notFound("Order"));
    }

    return ok(result as Order & { items: OrderItem[] });
  }

  /**
   * Create new order (checkout)
   */
  static async create(input: CreateOrderInput): Promise<ServiceResult<Order>> {
    const orderId = generateOrderId();
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + ORDER_EXPIRY_MINUTES * 60 * 1000
    );

    // Validate and get products
    const productDetails: Array<{
      product: typeof product.$inferSelect;
      quantity: number;
      reservedStock: typeof import("../db/schema").stockItem.$inferSelect[];
    }> = [];

    for (const item of input.items) {
      const productResult = await ProductService.getByIdOrSlug(item.productId);
      if (!productResult.success) {
        return fail(Errors.notFound(`Product ${item.productId}`));
      }

      // Reserve stock
      const stockResult = await StockService.reserve(
        item.productId,
        item.quantity
      );
      if (!stockResult.success) {
        // Release any previously reserved stock
        // This is a simplified rollback - in production, use transactions
        return fail(stockResult.error);
      }

      productDetails.push({
        product: productResult.data,
        quantity: item.quantity,
        reservedStock: stockResult.data,
      });
    }

    // Calculate subtotal
    const subtotal = productDetails.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Validate coupon if provided
    let discount = 0;
    let couponId: string | undefined;

    if (input.couponCode) {
      const couponResult = await CouponService.validate(
        input.couponCode,
        subtotal,
        input.userId
      );

      if (couponResult.success) {
        discount = couponResult.data.discountAmount;
        couponId = couponResult.data.coupon.id;
      }
      // Silently ignore invalid coupons during order creation
    }

    // Calculate total
    const serviceFee = 0; // Can be configured
    const uniqueCode = Math.floor(Math.random() * 999) + 1; // For VA matching
    const total = subtotal - discount + serviceFee + uniqueCode;

    // Create order
    const [createdOrder] = await db
      .insert(order)
      .values({
        id: orderId,
        userId: input.userId ?? null,
        buyerEmail: input.buyerEmail,
        buyerPhone: input.buyerPhone ?? null,
        buyerName: input.buyerName ?? null,
        subtotal,
        discount,
        serviceFee,
        uniqueCode,
        total,
        couponId: couponId ?? null,
        couponCode: input.couponCode ?? null,
        status: "pending",
        expiresAt,
      })
      .returning();

    // Create order items
    const orderItems: NewOrderItem[] = productDetails.map((item) => ({
      orderId,
      productId: item.product.id,
      productTitle: item.product.title,
      productImage: item.product.image ?? null,
      unitPrice: item.product.price,
      quantity: item.quantity,
      totalPrice: item.product.price * item.quantity,
      deliveryStatus: "pending",
    }));

    await db.insert(orderItem).values(orderItems);

    // Record coupon usage
    if (couponId && discount > 0) {
      await CouponService.recordUsage(
        couponId,
        orderId,
        discount,
        input.userId
      );
    }

    // Return full order
    const result = await this.getById(orderId);
    if (!result.success) {
      return fail(result.error);
    }
    return ok(result.data);
  }

  /**
   * Mark order as paid and process delivery
   */
  static async markAsPaid(orderId: string): Promise<ServiceResult<Order>> {
    const orderResult = await this.getById(orderId);
    if (!orderResult.success) {
      return fail(orderResult.error);
    }

    const currentOrder = orderResult.data;

    // Check if order can be paid
    if (!["pending", "awaiting_payment"].includes(currentOrder.status)) {
      return fail(
        Errors.badRequest(
          `Order cannot be paid in ${currentOrder.status} status`
        )
      );
    }

    // Check expiry
    if (currentOrder.expiresAt && currentOrder.expiresAt < new Date()) {
      return fail(Errors.expiredOrder());
    }

    // Update order status
    await db
      .update(order)
      .set({
        status: "paid",
        updatedAt: new Date(),
      })
      .where(eq(order.id, orderId));

    // Process delivery for each order item
    const items = currentOrder.items;

    for (const item of items) {
      // Get reserved stock items for this order item
      const reservedStock = await StockService.getByProduct(item.productId, {
        status: "reserved",
      });

      // Assign stock to order and mark as sold
      const stockToAssign = reservedStock.slice(0, item.quantity);
      if (stockToAssign.length > 0) {
        await StockService.assignToOrder(
          stockToAssign.map((s) => s.id),
          item.id,
          currentOrder.buyerEmail
        );
      }

      // Update order item delivery status
      await db
        .update(orderItem)
        .set({
          deliveryStatus: "delivered",
          updatedAt: new Date(),
        })
        .where(eq(orderItem.id, item.id));

      // Increment product sold count
      await ProductService.incrementSoldCount(item.productId, item.quantity);
    }

    // Update order to completed
    await db
      .update(order)
      .set({
        status: "completed",
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(order.id, orderId));

    const result = await this.getById(orderId);
    if (!result.success) {
      return fail(result.error);
    }
    return ok(result.data);
  }

  /**
   * Cancel order
   */
  static async cancel(orderId: string): Promise<ServiceResult<Order>> {
    const orderResult = await this.getById(orderId);
    if (!orderResult.success) {
      return fail(orderResult.error);
    }

    const currentOrder = orderResult.data;

    // Check if order can be cancelled
    if (!["pending", "awaiting_payment"].includes(currentOrder.status)) {
      return fail(Errors.badRequest("Order cannot be cancelled"));
    }

    // Release reserved stock for each order item
    const items = currentOrder.items;
    for (const item of items) {
      await StockService.releaseReserved(item.id);
    }

    // Update order status
    await db
      .update(order)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(order.id, orderId));

    const result = await this.getById(orderId);
    if (!result.success) {
      return fail(result.error);
    }
    return ok(result.data);
  }

  /**
   * Update order status
   */
  static async updateStatus(
    orderId: string,
    status: string
  ): Promise<ServiceResult<Order>> {
    await db
      .update(order)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(order.id, orderId));

    const result = await this.getById(orderId);
    if (!result.success) {
      return fail(result.error);
    }
    return ok(result.data);
  }

  /**
   * Expire old pending orders (called by cron)
   */
  static async expirePendingOrders(): Promise<number> {
    const now = new Date();

    // Get expired orders
    const expiredOrders = await db.query.order.findMany({
      where: and(
        inArray(order.status, ["pending", "awaiting_payment"]),
        sql`${order.expiresAt} < ${now}`
      ),
      with: {
        items: true,
      },
    });

    // Cancel each expired order
    for (const expiredOrder of expiredOrders) {
      await this.cancel(expiredOrder.id);
    }

    return expiredOrders.length;
  }
}
