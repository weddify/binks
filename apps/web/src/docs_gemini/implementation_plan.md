# Phase 2: Backend Integration & Logic

## Goal Description

Transition the Binks application from a static frontend with mock data to a fully functional dynamic application powered by **Supabase**. This includes setting up Authentication, Database Schema, and integrating real data fetching.

## User Review Required

> [!IMPORTANT] > **Supabase Project**: I need to know if I should create a **NEW** Supabase project named `binks` or if you have an existing one to use.
> **Auth Methods**: I am planning to implement **Email/Password** login first. Let me know if you want to prioritize Telegram login immediately.

## Proposed Changes

### Configuration

#### [NEW] [src/lib/supabase.ts](file:///e:/web-apps/binks/apps/web/src/lib/supabase.ts)

- Initialize `createClient` using `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`.

#### [MODIFY] [src/app.d.ts](file:///e:/web-apps/binks/apps/web/src/app.d.ts)

- Add `SupabaseClient` and `Session` types to `Locals`.

### Database Schema (Supabase)

I will apply the following schema via SQL migrations:

1.  **profiles** (extends `auth.users`)

    - `id` (uuid, references auth.users)
    - `full_name` (text)
    - `role` (text: 'admin' | 'customer')
    - `whatsapp` (text)

2.  **categories**

    - `id` (uuid)
    - `title` (text)
    - `slug` (text, unique)
    - `icon` (text)
    - `image` (text)
    - `description` (text)

3.  **products**

    - `id` (uuid)
    - `slug` (text, unique)
    - `title` (text)
    - `category_id` (uuid)
    - `description` (text)
    - `price` (int)
    - `stock` (int)
    - `image` (text)
    - `is_instant_delivery` (boolean)

4.  **product_credentials** (Stock)
    - `id` (uuid)
    - `product_id` (uuid)
    - `content` (text/json - email/pass/pin)
    - `is_sold` (boolean)
    - `order_id` (uuid, nullable)

### Authentication

#### [MODIFY] [src/routes/login/+page.svelte](file:///e:/web-apps/binks/apps/web/src/routes/login/+page.svelte)

- Connect "Login" button to `supabase.auth.signInWithPassword`.
- Handle errors and redirect to `/dashboard` or `/admin`.

#### [MODIFY] [src/routes/register/+page.svelte](file:///e:/web-apps/binks/apps/web/src/routes/register/+page.svelte)

- Connect registration form to `supabase.auth.signUp`.

### Data Integration

#### [MODIFY] [src/routes/+page.svelte](file:///e:/web-apps/binks/apps/web/src/routes/+page.svelte)

- Replace mock `products` import with `PageData` loaded from Supabase.
- Add `src/routes/+page.server.ts` to fetch products.

#### [MODIFY] [src/routes/product/[slug]/+page.svelte](file:///e:/web-apps/binks/apps/web/src/routes/product/[slug]/+page.svelte)

- Fetch specific product details from DB.

## Verification Plan

### Automated Tests

- None planned for this phase (manual verification preferred for rapid UI/Auth integration).

### Manual Verification

1.  **Auth**:
    - Sign up a new user -> Check Supabase `auth.users` table.
    - Login with new user -> Check redirection and session state.
2.  **Data**:
    - Run Migration -> Check Tables exist in Dashboard.
    - Seed Data -> Check "Netflix" etc. appear on Homepage.
3.  **Admin**:
    - Create Product in Admin Panel -> Verify it appears in DB and Homepage.
