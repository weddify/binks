import { db } from "../db";
import {
  stockItem,
  product,
  type StockItem,
  type NewStockItem,
} from "../db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";
import { Errors, type ServiceResult, ok, fail } from "./utils";
import { ProductService } from "./product.service";

export class StockService {
  /**
   * Get stock items for a product
   */
  static async getByProduct(
    productId: string,
    options?: {
      status?: "available" | "reserved" | "sold";
      limit?: number;
      offset?: number;
    }
  ): Promise<StockItem[]> {
    const conditions = [eq(stockItem.productId, productId)];

    if (options?.status) {
      conditions.push(eq(stockItem.status, options.status));
    }

    return await db.query.stockItem.findMany({
      where: and(...conditions),
      limit: options?.limit ?? 50,
      offset: options?.offset ?? 0,
    });
  }

  /**
   * Bulk add stock items
   */
  static async bulkAdd(
    productId: string,
    items: Array<{
      credentials: Record<string, string>;
    }>
  ): Promise<ServiceResult<StockItem[]>> {
    // Verify product exists
    const productResult = await ProductService.getByIdOrSlug(productId);
    if (!productResult.success) {
      return fail(Errors.notFound("Product"));
    }

    const stockItems = items.map((item) => ({
      productId,
      credentials: item.credentials,
      status: "available" as const,
    }));

    const created = await db.insert(stockItem).values(stockItems).returning();

    // Update product stock count
    await ProductService.updateStockCount(productId);

    return ok(created);
  }

  /**
   * Reserve stock items for an order
   */
  static async reserve(
    productId: string,
    quantity: number
  ): Promise<ServiceResult<StockItem[]>> {
    // Get available stock items
    const available = await db.query.stockItem.findMany({
      where: and(
        eq(stockItem.productId, productId),
        eq(stockItem.status, "available")
      ),
      limit: quantity,
    });

    if (available.length < quantity) {
      return fail(Errors.insufficientStock(productId));
    }

    const ids = available.map((item) => item.id);

    // Reserve the items
    await db
      .update(stockItem)
      .set({
        status: "reserved",
        reservedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(inArray(stockItem.id, ids));

    // Update product stock count
    await ProductService.updateStockCount(productId);

    return ok(available);
  }

  /**
   * Assign stock items to an order item and mark as sold
   */
  static async assignToOrder(
    stockItemIds: string[],
    orderItemId: string,
    buyerEmail: string
  ): Promise<ServiceResult<void>> {
    await db
      .update(stockItem)
      .set({
        status: "sold",
        orderItemId,
        buyerEmail,
        soldAt: new Date(),
        reservedAt: null,
        updatedAt: new Date(),
      })
      .where(inArray(stockItem.id, stockItemIds));

    return ok(undefined);
  }

  /**
   * Release reserved stock (e.g., on order cancellation)
   */
  static async releaseReserved(
    orderItemId: string
  ): Promise<ServiceResult<void>> {
    const items = await db.query.stockItem.findMany({
      where: eq(stockItem.orderItemId, orderItemId),
    });

    if (items.length === 0) {
      return ok(undefined);
    }

    const ids = items.map((item) => item.id);
    const productId = items[0].productId;

    await db
      .update(stockItem)
      .set({
        status: "available",
        orderItemId: null,
        buyerEmail: null,
        reservedAt: null,
        soldAt: null,
        updatedAt: new Date(),
      })
      .where(inArray(stockItem.id, ids));

    // Update product stock count
    await ProductService.updateStockCount(productId);

    return ok(undefined);
  }

  /**
   * Get credentials for an order item
   */
  static async getCredentials(orderItemId: string): Promise<StockItem[]> {
    return await db.query.stockItem.findMany({
      where: and(
        eq(stockItem.orderItemId, orderItemId),
        eq(stockItem.status, "sold")
      ),
    });
  }

  /**
   * Update single stock item
   */
  static async update(
    id: string,
    data: Partial<NewStockItem>
  ): Promise<ServiceResult<StockItem>> {
    const [updated] = await db
      .update(stockItem)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(stockItem.id, id))
      .returning();

    if (!updated) {
      return fail(Errors.notFound("Stock item"));
    }

    return ok(updated);
  }

  /**
   * Delete stock item
   */
  static async delete(id: string): Promise<ServiceResult<void>> {
    const item = await db.query.stockItem.findFirst({
      where: eq(stockItem.id, id),
    });

    if (!item) {
      return fail(Errors.notFound("Stock item"));
    }

    if (item.status === "sold") {
      return fail(Errors.badRequest("Cannot delete sold stock item"));
    }

    await db.delete(stockItem).where(eq(stockItem.id, id));

    // Update product stock count
    await ProductService.updateStockCount(item.productId);

    return ok(undefined);
  }
}
