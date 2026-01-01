import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { order } from "./order";

// ============================================
// Coupon Table
// ============================================
export const coupon = pgTable(
  "coupon",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    code: text("code").notNull().unique(),

    // Discount type: 'PERCENTAGE' | 'FIXED'
    type: text("type").notNull(),
    value: integer("value").notNull(),
    maxDiscount: integer("max_discount"), // Max discount for percentage type
    minPurchase: integer("min_purchase"), // Minimum order amount

    // Usage limits
    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").notNull().default(0),
    usagePerUser: integer("usage_per_user").default(1),

    // Validity
    startsAt: timestamp("starts_at"),
    expiresAt: timestamp("expires_at"),
    isActive: boolean("is_active").notNull().default(true),

    // Restrictions (optional - for specific products/categories)
    applicableCategories: jsonb("applicable_categories").$type<string[]>(),
    applicableProducts: jsonb("applicable_products").$type<string[]>(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("coupon_code_idx").on(table.code),
    index("coupon_is_active_idx").on(table.isActive),
  ]
);

// ============================================
// Coupon Usage Table
// ============================================
export const couponUsage = pgTable(
  "coupon_usage",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    couponId: text("coupon_id")
      .notNull()
      .references(() => coupon.id, { onDelete: "cascade" }),
    orderId: text("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    discountAmount: integer("discount_amount").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("coupon_usage_coupon_id_idx").on(table.couponId),
    index("coupon_usage_user_id_idx").on(table.userId),
  ]
);

// Types
export type Coupon = typeof coupon.$inferSelect;
export type NewCoupon = typeof coupon.$inferInsert;

export type CouponUsage = typeof couponUsage.$inferSelect;
export type NewCouponUsage = typeof couponUsage.$inferInsert;
