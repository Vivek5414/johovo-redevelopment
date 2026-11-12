# JOHOVO website

Responsive Next.js App Router website for the unified JOHOVO brand.
IyalMooligai is presented as a three-category health and wellness sub-brand.
Only the verified herbal hair oil and face pack are currently offered; healthy
snacks and cold pressed oils are shown as upcoming collections until confirmed
product records are available.
PDF-derived snack and oil details are informational previews with no purchase
actions. Benefit, promotional, SEO, and packaging claims remain marked for
review, and the confidential source PDF is kept outside the public assets.

The public catalogue currently uses verified migrated source snapshots rather
than a product database. Neon is used for upload metadata, while existing admin
authentication uses Supabase. No product or category data has been migrated
between these systems.

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
