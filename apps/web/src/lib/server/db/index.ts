import { drizzle } from "drizzle-orm/postgres-js";
// Use postgres/cf for Cloudflare Workers compatibility (HTTP-based instead of TCP)
import postgres from "postgres/cf";
import * as schema from "./schema";
import { DATABASE_URL } from "$env/static/private";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// For query purposes - use prepare: false for serverless environments
const queryClient = postgres(DATABASE_URL, { prepare: false });
export const db = drizzle(queryClient, { schema });

// Export type for use in services
export type Database = typeof db;
