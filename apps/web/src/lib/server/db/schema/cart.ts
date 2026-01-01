import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { product } from "./product";

// ============================================
// Cart Item Table (for logged-in users)
// ============================================
export const cartItem = pgTable(
  "cart_item",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("cart_item_user_id_idx").on(table.userId),
    index("cart_item_product_id_idx").on(table.productId),
  ]
);

// Types
export type CartItem = typeof cartItem.$inferSelect;
export type NewCartItem = typeof cartItem.$inferInsert;
