import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

// ============================================
// Site Settings Table (key-value store)
// ============================================
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Types
export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;
