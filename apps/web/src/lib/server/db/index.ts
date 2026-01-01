import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { DATABASE_URL } from "$env/static/private";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// For query purposes
const queryClient = postgres(DATABASE_URL);
export const db = drizzle(queryClient, { schema });

// Export type for use in services
export type Database = typeof db;
