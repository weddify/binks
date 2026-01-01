import { auth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  /* TEMPORARILY DISABLED TO FIX CLOUDFLARE DEPLOYMENT
  // Fetch current session from Better Auth
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  // Make session and user available on server
  if (session) {
    // Cast user to include our custom fields
    event.locals.session = session.session as App.Locals["session"];
    event.locals.user = {
      ...session.user,
      role: (session.user as { role?: string }).role || "customer",
    } as App.Locals["user"];
  } else {
    event.locals.session = null;
    event.locals.user = null;
  }

  // Let better-auth handle auth routes
  return svelteKitHandler({ event, resolve, auth, building });
  */
  return resolve(event);
};
