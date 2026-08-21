# Brainstrain '26

Website for **Brainstrain '26**, the inter-collegiate literary fest hosted by the Literary and
Debating Society, GCT Coimbatore. Built with React + Vite + Tailwind CSS v4, backed entirely by
**Supabase** (Postgres + Auth + Row Level Security) — no Google Forms/Sheets anywhere in the flow.

## Stack

- **Frontend:** React 19, React Router, Tailwind CSS v4
- **Backend/DB:** Supabase (Postgres, Auth, Row Level Security)
- **Registration writes** go through a single Postgres RPC (`register_for_event`) so a
  registration + its team + its members are created atomically, with server-side re-validation of
  registration-open/deadline/team-size even if the client is bypassed.

## Project structure

```
src/
  components/        shared UI (Navbar, Footer, NeonButton, EventCard, CountdownTimer, ...)
  components/admin/  admin-only UI (AdminLayout, StatCard, Modal, Badge)
  context/           AuthContext (Supabase session + role)
  data/              static team roster + event image map
  lib/supabaseClient.js
  pages/             public pages (Home, Events, EventDetail, Team, Register, Login)
  pages/admin/       admin dashboard pages
supabase/
  schema.sql         tables, RLS policies, helper functions, the registration RPC
  seed.sql           starter catalogue of the 10 fest events
```

## 1. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
3. In **Project Settings → API**, copy the **Project URL** and **anon public key**.

## 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

These are safe to expose in the frontend — the anon key only has the access granted by the RLS
policies in `schema.sql`. Never put your Supabase **service_role** key in frontend code.

## 3. Create your first admin

There is no hardcoded admin email anywhere in the code. Roles live in the database
(`public.users.role`, either `'user'` or `'admin'`), so the first admin has to be created once,
by you, directly in Supabase:

1. In the Supabase dashboard: **Authentication → Users → Add user** — create an account with the
   organiser's email + a password (mark email as confirmed).
   - A `public.users` row is auto-created for them (via trigger) with `role = 'user'`.
2. In the **SQL editor**, promote that account:
   ```sql
   update public.users set role = 'admin' where email = 'organiser@example.com';
   ```
3. Sign in at `/login` with that email/password — you'll land on `/admin/dashboard`.

Repeat step 2 for any other organiser accounts you create later.

## 4. Run the project

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Route map

| Route | Access |
| --- | --- |
| `/`, `/events`, `/events/:slug`, `/team`, `/register` | Public |
| `/login` | Public (admin sign-in) |
| `/admin`, `/admin/dashboard`, `/admin/events`, `/admin/registrations`, `/admin/teams`, `/admin/participants` | Admin only |

Admin routes are protected on the client (`ProtectedRoute` checks the Supabase session + the
`role` column) **and** on the database (Row Level Security policies on every table only grant
`admin`-role reads/writes; anonymous visitors can only call the `register_for_event` RPC). Route
protection is not just a hidden nav link — direct API calls are blocked by RLS regardless of what
the frontend does.

## Notes

- Event poster art lives in `src/assets/events/*.png` (bundled at build time) — `events.image_url`
  stores the matching key (e.g. `"adzap"`), resolved via `src/data/eventImages.js`. Swap in a real
  Supabase Storage URL later if you want organiser-uploaded posters; `resolveEventImage` already
  falls back to treating any `http(s)://` value as a direct URL.
- The "Our Team" roster (`src/data/teamData.js`) is static content, matching the Figma design —
  it isn't meant to change often enough to warrant a database table + admin UI.
