import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { order } from "./order";

// ============================================
// Payment Table
// ============================================
export const payment = pgTable(
  "payment",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),

    // Payment Gateway
    gateway: text("gateway").notNull().default("pakasir"), // 'pakasir' | 'manual'
    gatewayOrderId: text("gateway_order_id"),

    // Method: 'qris' | 'bni_va' | 'bri_va' | 'cimb_niaga_va' | etc
    method: text("method").notNull(),
    methodName: text("method_name"), // Human readable: "QRIS", "BNI Virtual Account"

    // Payment Details
    amount: integer("amount").notNull(),
    fee: integer("fee").notNull().default(0),
    totalAmount: integer("total_amount").notNull(),

    // Payment Number (QR String or VA Number)
    paymentNumber: text("payment_number"),

    // Status: 'pending' | 'awaiting' | 'completed' | 'failed' | 'expired' | 'cancelled'
    status: text("status").notNull().default("pending"),

    // Timestamps
    expiresAt: timestamp("expires_at"),
    paidAt: timestamp("paid_at"),

    // Webhook Data (raw response from gateway)
    webhookData: jsonb("webhook_data"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("payment_order_id_idx").on(table.orderId),
    index("payment_status_idx").on(table.status),
    index("payment_gateway_order_id_idx").on(table.gatewayOrderId),
  ]
);

// Types
export type Payment = typeof payment.$inferSelect;
export type NewPayment = typeof payment.$inferInsert;
