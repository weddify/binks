import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";

// ============================================
// Category Table (self-referencing for hierarchy)
// ============================================
export const category = pgTable(
  "category",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    image: text("image"),
    icon: text("icon"), // lucide icon name
    parentId: text("parent_id"), // Self-reference handled manually
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("category_parent_id_idx").on(table.parentId),
    index("category_slug_idx").on(table.slug),
  ]
);

// Types
export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;
