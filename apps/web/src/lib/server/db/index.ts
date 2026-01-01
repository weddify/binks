import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";

const DATABASE_URL = env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Use Neon serverless driver (HTTP-based, works with any PostgreSQL including Supabase)
const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });

// Export type for use in services
export type Database = typeof db;
