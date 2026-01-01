import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

// ============================================
// CMS Page Table
// ============================================
export const page = pgTable("page", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(), // HTML content
  excerpt: text("excerpt"),

  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),

  // Publishing
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),

  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Types
export type Page = typeof page.$inferSelect;
export type NewPage = typeof page.$inferInsert;
