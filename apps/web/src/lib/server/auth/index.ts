import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "../db/schema";
import { env } from "$env/dynamic/private";

// Get env vars with fallbacks
const BETTER_AUTH_SECRET = env.BETTER_AUTH_SECRET || "default-secret-change-me";
const BETTER_AUTH_URL = env.BETTER_AUTH_URL || "http://localhost:5173";
const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET || "";

export const auth = betterAuth({
  // Database configuration with Drizzle
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),

  // Base URL for redirects
  baseURL: BETTER_AUTH_URL,

  // Secret for signing tokens
  secret: BETTER_AUTH_SECRET,

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production with email configured
    autoSignIn: true,
  },

  // Social providers
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      enabled: !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET),
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // User configuration
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false, // Don't allow user to set role on signup
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  // Plugins
  plugins: [
    admin({
      impersonationSessionDuration: 60 * 60, // 1 hour
    }),
  ],

  // Rate limiting
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 100, // 100 requests per minute
  },
});

// Export types for use in the app
export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
