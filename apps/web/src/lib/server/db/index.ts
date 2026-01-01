import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { DATABASE_URL } from "$env/static/private";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Use Pool for connection pooling in serverless environments
const pool = new Pool({
  connectionString: DATABASE_URL,
  // SSL required for Supabase
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

// Export type for use in services
export type Database = typeof db;
