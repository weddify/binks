import { createAuthClient } from "better-auth/svelte";
import { adminClient } from "better-auth/client/plugins";

// Use the app URL from window location in browser
const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5173";

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient()],
});

// Re-export useful hooks and methods
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
