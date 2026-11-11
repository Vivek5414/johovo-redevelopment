# JOHOVO website

Responsive Next.js App Router foundation for the unified JOHOVO website.
IyalMooligai is reserved for relevant approved herbal products within this
site.
There are no product or category records in the workspace yet, so the public
catalogue intentionally shows an empty state instead of invented products.

Neither original logo was supplied with the project files. Until they are
provided, brand components use plain text labels; do not redraw or alter either
logo.

## Requirements

- Node.js 20.9 or later (Node.js 22 LTS recommended).
- npm.
- A Supabase project for administrator authentication, PostgreSQL, and Storage.

## Local setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Copy `.env.example` to `.env.local` and add the Supabase project URL and
   publishable key. Never expose a service-role key to browser code.
3. Apply the migrations in `supabase/migrations/` to the intended Supabase
   project using the Supabase CLI or an approved database deployment process.
4. Disable public sign-up in Supabase Auth. Create administrator accounts
   through an authorized process and provision an active `admin_profiles` row.
5. Start the development server:

   ```powershell
   npm run dev
   ```

   Open `http://localhost:3000`.

## Validation

```powershell
npm run lint
npm run typecheck
npm run build
npm audit
```

See [docs/README.md](./docs/README.md) for the audit, scope, proposed data
model, and implementation roadmap.
