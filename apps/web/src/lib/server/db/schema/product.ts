import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { category } from "./category";

// ============================================
// Product Group Table
// ============================================
export const productGroup = pgTable(
  "product_group",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    categoryId: text("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    image: text("image"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("product_group_category_id_idx").on(table.categoryId)]
);

// ============================================
// Product Table
// ============================================
export const product = pgTable(
  "product",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    groupId: text("group_id")
      .notNull()
      .references(() => productGroup.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: integer("price").notNull(), // in smallest currency unit (IDR)
    originalPrice: integer("original_price"),
    image: text("image"),

    // Discount
    discountType: text("discount_type"), // 'PERCENTAGE' | 'FIXED' | null
    discountValue: integer("discount_value"),
    discountValidUntil: timestamp("discount_valid_until"),

    // Product Info
    warranty: text("warranty"),
    warrantyPolicy: text("warranty_policy"),
    instructions: jsonb("instructions").$type<string[]>(),
    additionalNotes: text("additional_notes"),

    // Delivery
    instantDelivery: boolean("instant_delivery").notNull().default(true),
    deliveryMethod: text("delivery_method").notNull().default("auto"), // 'auto' | 'manual'

    // Stats (cached, updated via triggers/cron)
    stockCount: integer("stock_count").notNull().default(0),
    soldCount: integer("sold_count").notNull().default(0),

    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("product_group_id_idx").on(table.groupId),
    index("product_slug_idx").on(table.slug),
    index("product_is_active_idx").on(table.isActive),
  ]
);

// Types
export type ProductGroup = typeof productGroup.$inferSelect;
export type NewProductGroup = typeof productGroup.$inferInsert;

export type Product = typeof product.$inferSelect;
export type NewProduct = typeof product.$inferInsert;
