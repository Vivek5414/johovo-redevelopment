# JOHOVO website data model notes

**Status:** Current catalog/admin tables are implemented by existing
migrations. The operational entities and proposed additions below are design
notes, not migrations or functionality.

## Domain model and relationships

```text
Supabase Auth user 1 ── 0..1 Admin profile
Collection         1 ── many Categories
Category           1 ── many Products
Product            1 ── many Product images
Product            1 ── many Product videos
Product            1 ── many Marketplace purchase links
Customer           0..1 ── many Enquiries
Product            0..1 ── many Enquiries
Customer           0..1 ── many Purchase records
Purchase record    1 ── many Purchase items
Product            1 ── many Purchase items
Customer/enquiry/purchase 1 ── many Follow-ups (optional association)
Admin profile      1 ── many created/updated records
```

Products can have a `johovo` or `iyalmooligai` product identity. Collections
are catalog groupings under the single JOHOVO website, not separate sites.
Initial planned collections are IyalMooligai Herbal Care, IyalMooligai
Wellness Foods, and IyalMooligai Cold Pressed Oils. Publish only client-
approved herbal products initially; keep other collection/product records
unpublished until approved content is supplied.

## Current implemented tables

The initial migration currently defines:

- **`admin_profiles`** — one-to-one with `auth.users`; ID, display name,
  active flag, and timestamps. Only active administrators may manage catalog
  records; account creation/invitation is handled through the authorized
  Supabase Auth process.
- **`categories`** — name, unique URL-safe slug, optional description, active
  or archived status, display order, and timestamps. Collection association
  is not currently represented in the migration.
- **`products`** — required category, name, unique URL-safe slug, optional
  unique SKU and descriptions, draft/published/archived status,
  `published_at`, display order, creator/updater IDs, and timestamps. A
  published product requires a publication timestamp.
- **`product_media`** — one table for image/video records; product, media type,
  upload/YouTube/Instagram source, storage or external URL, optional thumbnail,
  title, description, alt text, ordering, primary-image flag, creator, and
  timestamps. The database permits at most one primary image per product.
- **`product_purchase_links`** — product, Amazon/Flipkart marketplace, HTTPS
  URL, optional label, active flag, display order, and timestamps.
- **Storage buckets** — private draft and approved product media buckets.

The second migration adds a required `brand_identity` on products, defaulting
to `johovo`, constrained to `johovo` or `iyalmooligai`.

No product or category seed data is included. The current schema does not yet
enforce the 100-product limit, represent named collections, or include customer,
enquiry, purchase, or follow-up tables.

**Migration verification note:** In the initial migration, the approved-media
storage policy's `WITH CHECK` clause refers to bucket `product-media-public`,
while the created bucket and its `USING` clause use
`product-media-approved`. Verify and correct this policy before relying on
administrator writes to the approved-media bucket. This is a migration
follow-up; no application or migration files were changed as part of this
documentation update.

## Proposed collection and catalog additions

- **`collections`** — stable ID, name, unique slug, optional approved
  description, status (draft/published/archived), display order, timestamps,
  and creator/updater references.
- Add a required collection reference to **`categories`** (or an explicit
  product-to-collection relation if products may belong to multiple
  collections; this choice is unresolved).
- Keep **`products`** associated with a category and retain its product
  identity. Recommended fields include approved display name, slug, SKU,
  short and full descriptions, publication status/timestamp, display order,
  and audit references. Do not add product facts or price values unless the
  client supplies them and confirms display requirements.
- Support up to 100 products. Enforce the agreed interpretation in server
  validation and, if required, at the database boundary to prevent concurrent
  admin actions from exceeding the limit. The current migration has no such
  enforcement.
- Unapproved collections/products remain drafts and are excluded from all
  public reads. Publication requires an active parent collection/category,
  approved content, and the required approved media/content checks agreed with
  the client.

## Proposed media model and validation

The current `product_media` can remain a unified table or be separated into
logical product image and product video entities. The implementation should
preserve the following semantics:

- **Product images:** product association, storage bucket/path, alt text,
  optional caption/title, ordering, and a single optional primary image.
- **Product videos:** product association, upload or supported YouTube/
  Instagram URL, title, description, thumbnail, ordering, and publication
  approval state.
- Keep original client media intact; generate derivatives only when approved
  and do not replace the source. Never publish draft/unapproved assets.
- Validate uploads server-side: authenticated active admin, allowed file
  type based on content (not only extension), size/duration limits, safe
  storage path, and ownership. Exact limits remain to be agreed.
- Validate external URLs as HTTPS and allowlist supported provider hosts and
  URL patterns. Do not accept arbitrary embeds.
- Validate alt text and metadata lengths; escape output and avoid treating
  user-provided metadata as trusted markup.

## Proposed customer and operations entities

### `customers`

- ID, name, legitimately provided email/phone/contact preferences, optional
  notes, timestamps, and creator/updater references.
- Store only data necessary for the agreed customer-management purpose.
  Customer identity/contact fields must not be inferred from marketplace
  transactions or scraped.
- Restrict reads/writes to active, authorized admins; apply retention,
  deletion, and export policies once approved.

### `enquiries`

- ID, optional customer and product references, source (website, WhatsApp, or
  admin-entered/other approved source), requester name/contact as supplied,
  message, consent/notice version and timestamp where required, status,
  assigned admin, handling notes, and timestamps.
- Validate required fields, email/phone formats when supplied, message size,
  allowed status/source values, product reference, and anti-spam controls.
- Public form submissions may create an enquiry through a narrowly scoped
  server-side operation; anonymous users must never read or update enquiries.
  Admin access is role-authorized and audited.

### `purchase_records` and `purchase_items`

- **Purchase record:** ID, optional customer reference, source (website,
  Amazon, Flipkart, WhatsApp, or another approved/manual source), external
  reference if legitimately available, purchase date, currency/amount only
  when supplied, status, admin notes, creator, and timestamps.
- **Purchase item:** purchase ID, product reference, quantity, and any
  transaction-time values needed for reporting if approved. Preserve a
  snapshot for historical correctness only after price/currency requirements
  are decided.
- Validate source/status enums, positive quantities, amount/currency formats,
  product existence, and association consistency.
- Purchases are entered manually unless a future authorized marketplace
  integration is separately approved. Customer linkage is optional. Do not
  assume Amazon/Flipkart provide private customer phone numbers.
- Customer/purchase data is private to authorized admins; no public reads.

### `follow_ups`

- ID, optional customer, enquiry, and/or purchase references; due date/time,
  status, follow-up type, assigned admin, outcome/notes, creator, and
  timestamps.
- Require a due date and valid status; enforce that at least one tracked
  customer/enquiry/purchase subject is associated. Validate all references
  and restrict records to authorized admin access.

## Validation and integrity requirements

- Validate every write on the server with existing Zod; database constraints
  remain the final integrity boundary.
- Normalize and validate URL-safe slugs; enforce uniqueness and protect
  published slug changes with an agreed redirect policy.
- Enforce category/collection/product status transitions and required approved
  fields before publication.
- Validate marketplace links as HTTPS and confirm the hostname belongs to
  Amazon or Flipkart before saving or rendering.
- Apply length/type/range limits to all user-controlled fields; never trust
  browser-only validation.
- Prevent cross-record mismatches (for example, an enquiry or purchase item
  referencing a product outside the relevant approved catalog).
- Apply rate limiting, spam mitigation, and privacy/consent controls to public
  enquiry forms before launch.
- Use safe deletion/archive behavior so historical purchases and enquiries do
  not lose integrity; define retention/anonymization with the client.

## Access control and RLS

- **Anonymous visitors:** read only published products, active categories and
  collections, approved media, and active marketplace links. May submit
  validated enquiries through a restricted server endpoint but cannot read
  stored enquiries, customers, purchases, follow-ups, or admin data.
- **Authenticated non-admin users:** no operational/admin access by default.
- **Active admins:** catalog and media management according to assigned
  permissions. Customer, enquiry, purchase, and follow-up access is limited to
  explicitly authorized operational roles; record sensitive reads/writes in
  an audit trail where required.
- **Supabase Auth/service role:** disable public sign-up for admin identities.
  Never expose a service-role key to client code; use it only in a server-only,
  narrowly scoped operation if required.
- Apply least-privilege SQL grants and RLS to every table and storage object.
  Test anonymous, authenticated non-admin, and active-admin access against the
  actual Supabase project before launch.

## Environment and dependencies

Existing packages include Next.js, React, TypeScript, `@supabase/ssr`,
`@supabase/supabase-js`, and Zod. No new packages are requested or required
for this documentation update.

`.env.example` documents:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Optional server-only `SUPABASE_SERVICE_ROLE_KEY` placeholder

Keep actual values in environment configuration, not source control. The
Supabase URL and publishable key are parsed with Zod by the existing helper.
The Supabase project is not configured in this workspace.

## Open questions before implementation

1. Does the 100-product maximum count drafts and archived records, or only
   active/published catalog products? Is the limit shared across all three
   collections?
2. Are products restricted to one category and one collection, or may a
   product appear in multiple categories/collections?
3. What is the approved list of initially publishable herbal products, with
   their category/collection assignments, descriptions, ingredients, claims,
   prices, logos, images, and videos?
4. What image/video upload size, format, duration, and retention limits apply?
5. What customer/enquiry fields, consent wording, privacy policy, access roles,
   data-retention periods, and deletion/export processes are required?
6. Which currency, order statuses, purchase fields, and historical price
   behavior should be recorded?
7. What is the additional charge and billing basis for products beyond 100?
8. When does the one-month free bug-support period begin, and how are bugs
   distinguished from changes or new features?
9. What event starts the one-year source-code handover period, and are there
   any conditions beyond the stated one-year timing?
10. Which hosting/domain/Supabase environments are provided, and what are the
    deployment acceptance criteria?

Confirm these decisions before translating this proposal into migrations,
server actions, and admin/public interfaces.
