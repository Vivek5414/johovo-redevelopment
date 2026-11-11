# JOHOVO website development plan

**Status:** Documentation updated for the confirmed scope. This document does
not authorize or represent implementation of the remaining features.

## Confirmed brand and product scope

- One unified JOHOVO website. JOHOVO is the main company and website identity.
- Preserve the original colourful JOHOVO trademark logo exactly as supplied.
  Do not redraw, recolour, crop, distort, or approximate it.
- IyalMooligai is the herbal product sub-brand under JOHOVO. Use its approved
  logo on relevant herbal product cards, banners, and product detail pages.
  It is not a separate website.
- Use JOHOVO pink, yellow, cyan, green, and purple as shared brand accents.
  Herbal product sections use forest green, natural green, cream, and soft
  yellow. Define brand colours in global CSS variables; do not hardcode them in
  individual components.
- The catalogue is designed for up to 100 products. Additional products are
  subject to additional charges; the rate and charging basis must be agreed
  before accepting products above the included limit.
- Planned collections:
  1. IyalMooligai Herbal Care.
  2. IyalMooligai Wellness Foods.
  3. IyalMooligai Cold Pressed Oils.
- Initially publish only herbal products approved by the client and backed by
  approved content and assets. Keep other products and collections
  unpublished until the client supplies and approves their content.
- Do not invent product names, images, descriptions, prices, ingredients,
  benefits, reviews, certifications, or health claims.

## Functional scope

- Public catalogue, product categories, and individual product detail pages.
- Product image galleries and videos, with admin-managed uploaded media and
  supported external video links.
- Product-specific Amazon and Flipkart purchase links.
- Product-specific WhatsApp enquiry links and general/product enquiry forms.
- Admin authentication and product/category/media management.
- Customer records, manually recorded purchase records, enquiry management,
  and follow-up tracking.
- No internal cart or checkout is included in this scope. Do not assume
  marketplace orders disclose private customer contact information.

## Current project structure and technical foundation

The existing project is a Next.js App Router application with TypeScript,
React, CSS Modules, global CSS variables, and Supabase client/server helpers.
Existing Supabase packages and Zod are already in `package.json`; do not
install new packages without separate approval. Tailwind CSS is not used.

Current source organization:

```text
src/
  app/                 # App Router homepage and admin login/dashboard
  components/          # Site header and reusable brand components
  lib/
    auth/              # Admin authorization helpers
    brand/             # Product brand identities
    supabase/          # Validated env, browser and server clients
  app/globals.css      # Global CSS variables and reset
supabase/
  migrations/          # Initial catalog/admin schema and brand identity
docs/
  implementation-plan.md
  database-schema.md
```

The products/catalogue, enquiry, customer, purchase, and follow-up screens and
their operational database tables are not yet implemented. The current schema
has admin profiles, categories, products, product media, and purchase links.
The `brand_identity` column supports `johovo` and `iyalmooligai`; the three
named collections and a 100-product rule are scope requirements, not yet
enforced by the current migrations.

### Supabase, environment and validation

- Existing dependencies: `next`, `react`, `react-dom`, `typescript`,
  `@supabase/ssr`, `@supabase/supabase-js`, and `zod`, plus existing lint/type
  tooling. No installation is planned for this documentation update.
- `.env.example` lists `NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and
  `NEXT_PUBLIC_WHATSAPP_NUMBER`. A server-only `SUPABASE_SERVICE_ROLE_KEY`
  placeholder is commented out and must remain secret if a server operation
  requires it.
- Current Supabase URL and publishable-key validation uses Zod. Validate
  submitted form data, URLs, product fields, and upload metadata on the server
  with Zod or equivalent existing validation.
- Do not commit `.env.local`, credentials, service-role keys, or other
  environment secrets. Never expose a service-role key to browser code.
- A production Supabase project is not configured in the workspace. Apply
  migrations and verify policies in the intended project before launch.

## Fifteen-working-day implementation schedule

The schedule below is a target sequence of 15 working days after project
start prerequisites are met. Client review/approval delays, late content, and
external platform setup may shift the calendar; obtain client approval at the
listed checkpoints before publishing.

| Working day(s) | Work and checkpoint |
|---|---|
| 1 | Confirm approved product list, collection/category assignments, acceptance criteria, supplied assets, and access prerequisites. |
| 2 | Finalize data model, privacy/retention decisions, publication rules, and Supabase access policies. |
| 3 | Prepare Supabase migrations and server-side validation for catalog entities; apply and verify schema in the approved environment. |
| 4 | Implement collection/category and product listing data access, including the 100-product limit behavior agreed with the client. |
| 5 | Implement catalogue and category browsing; keep unapproved collections unpublished. |
| 6 | Implement product detail pages and responsive image galleries using approved assets only. |
| 7 | Implement product video associations, metadata, thumbnails, and supported external video links. |
| 8 | Implement Amazon, Flipkart, and WhatsApp links with server-side URL validation and approved destinations. |
| 9 | Implement general and product-specific enquiry forms, validation, consent handling, and protected persistence. |
| 10 | Implement admin product, category/collection, and media management with authorization. |
| 11 | Implement customer records and manually entered purchase records with optional customer association. |
| 12 | Implement enquiry management and follow-up tracking with role-protected access. |
| 13 | Verify access policies, input/media validation, responsive behavior, accessibility basics, and error handling. |
| 14 | Client review and acceptance testing against the approved products/content; resolve in-scope defects. |
| 15 | Production readiness checks, deployment/configuration handoff, completion confirmation, and source-code handover timing recorded. |

The client must supply complete approved content and feedback in time for this
target. Do not publish content while its approval is pending.

## Client responsibilities

The client is responsible for:

- Supplying original JOHOVO and IyalMooligai logo assets and usage guidance.
- Supplying and approving product names, product-to-collection/category
  assignments, descriptions, ingredients, claims, prices (if displayed),
  images, videos, and alt-text guidance.
- Identifying which herbal products are approved for initial publication.
- Supplying valid Amazon/Flipkart listing URLs and the WhatsApp contact
  destination.
- Supplying business contact details, enquiry/privacy/consent wording, data
  retention requirements, and applicable legal/policy text.
- Providing authorized Supabase, hosting/domain, and administrator access
  through an agreed secure process; not sending secrets in source files.
- Reviewing deliverables and returning consolidated approvals/feedback
  promptly, and confirming acceptance at the scheduled checkpoints.
- Ensuring they have rights to provide all logos, product media, and copy.

## Commercial and support terms to record

- **Payment:** 50% advance and 50% after completion.
- **Included catalogue size:** Up to 100 products. Additional products incur
  additional charges; the amount and billing basis are to be agreed before
  work on products over the limit.
- **Bug support:** One month of free bug support. Define the start date and
  what qualifies as a bug versus a change request in the final agreement.
- **Source-code handover:** Source code is handed over after one year, subject
  to the final agreement. The event that starts the one-year period and any
  conditions on handover require confirmation in writing.

This plan records the requested terms but is not a substitute for a signed
commercial agreement.

## Outstanding implementation inputs

See [database-schema.md](./database-schema.md) for the proposed entities,
relationships, validation requirements, and access model. Before implementation,
resolve the open questions at the end of that document and supply the assets,
content, contact details, operational policies, and hosting/database access.
