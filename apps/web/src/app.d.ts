// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// Extended user type with custom fields
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  phone?: string | null;
  role: "customer" | "admin";
  banned?: boolean;
  banReason?: string | null;
  banExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ExtendedSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  impersonatedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace App {
    interface Error {
      message: string;
      code?: string;
    }

    interface Locals {
      user: ExtendedUser | null;
      session: ExtendedSession | null;
    }

    interface PageData {
      user?: ExtendedUser | null;
      session?: ExtendedSession | null;
    }

    // interface PageState {}
    // interface Platform {}
  }
}

export {};
