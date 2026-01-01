import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { product } from "./product";

// ============================================
// Stock Item Table (Digital Credentials)
// ============================================
export const stockItem = pgTable(
  "stock_item",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    productId: text("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),

    // Credential Data (encrypted at rest recommended)
    credentials: jsonb("credentials").notNull().$type<{
      email?: string;
      password?: string;
      pin?: string;
      code?: string;
      [key: string]: string | undefined;
    }>(),

    // Status: 'available' | 'reserved' | 'sold'
    status: text("status").notNull().default("available"),

    // Assignment
    orderItemId: text("order_item_id"), // FK added after order.ts is created
    reservedAt: timestamp("reserved_at"),
    soldAt: timestamp("sold_at"),
    buyerEmail: text("buyer_email"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("stock_item_product_id_idx").on(table.productId),
    index("stock_item_status_idx").on(table.status),
    index("stock_item_order_item_id_idx").on(table.orderItemId),
  ]
);

// Types
export type StockItem = typeof stockItem.$inferSelect;
export type NewStockItem = typeof stockItem.$inferInsert;
