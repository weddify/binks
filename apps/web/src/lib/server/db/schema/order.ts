import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { product } from "./product";

// ============================================
// Order Table
// ============================================
export const order = pgTable(
  "order",
  {
    id: text("id").primaryKey(), // Format: INV-YYYYMMDD-XXXXX
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),

    // Guest checkout info
    buyerEmail: text("buyer_email").notNull(),
    buyerPhone: text("buyer_phone"),
    buyerName: text("buyer_name"),

    // Amounts (in smallest currency unit - IDR)
    subtotal: integer("subtotal").notNull(),
    discount: integer("discount").notNull().default(0),
    serviceFee: integer("service_fee").notNull().default(0),
    uniqueCode: integer("unique_code").notNull().default(0), // for VA payment matching
    total: integer("total").notNull(),

    // Coupon
    couponId: text("coupon_id"), // FK added manually to avoid circular deps
    couponCode: text("coupon_code"),

    // Status: 'pending' | 'awaiting_payment' | 'paid' | 'processing' | 'completed' | 'failed' | 'expired' | 'cancelled' | 'refunded'
    status: text("status").notNull().default("pending"),

    // Expiry
    expiresAt: timestamp("expires_at"),

    // Metadata
    notes: text("notes"),
    adminNotes: text("admin_notes"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("order_user_id_idx").on(table.userId),
    index("order_status_idx").on(table.status),
    index("order_created_at_idx").on(table.createdAt),
    index("order_buyer_email_idx").on(table.buyerEmail),
  ]
);

// ============================================
// Order Item Table
// ============================================
export const orderItem = pgTable(
  "order_item",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "restrict" }),

    // Snapshot at purchase time
    productTitle: text("product_title").notNull(),
    productImage: text("product_image"),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull().default(1),
    totalPrice: integer("total_price").notNull(),

    // Delivery status: 'pending' | 'processing' | 'delivered' | 'failed'
    deliveryStatus: text("delivery_status").notNull().default("pending"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("order_item_order_id_idx").on(table.orderId),
    index("order_item_product_id_idx").on(table.productId),
  ]
);

// Types
export type Order = typeof order.$inferSelect;
export type NewOrder = typeof order.$inferInsert;

export type OrderItem = typeof orderItem.$inferSelect;
export type NewOrderItem = typeof orderItem.$inferInsert;
