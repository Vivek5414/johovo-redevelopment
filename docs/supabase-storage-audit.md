# Supabase storage and schema audit

**Review date:** 10 November 2026  
**Scope:** Repository migrations and current Supabase helpers only  
**Execution:** Source review only. No database connection, migrations, policy
changes, application changes, or environment values were accessed.

## Executive summary

The approved product-media bucket is named `product-media-approved` and is
created as private. Its administrator policy has a bucket-name mismatch:
`USING` checks the created bucket, but `WITH CHECK` checks the nonexistent
`product-media-public` name. Consequently, active administrators cannot insert
objects into the approved bucket through this policy, and updates to approved
objects fail their post-update check. Deletes of an administrator's own
approved-bucket objects remain permitted by the policy's `USING` condition.

The draft bucket policy consistently restricts all operations to the active
administrator's own user-ID folder. The migration does not configure upload
size or MIME-type restrictions. Current public media reads are row-scoped to
approved uploaded media attached to published products in active categories;
the migrations contain no customer table or customer relationship to expose.

These are conclusions about repository SQL. The deployed Supabase project's
actual bucket settings and policies may differ and were not inspected.

## Current configuration

Two migrations are present:

- [`20261110130000_initial_catalog_and_admin.sql`](../supabase/migrations/20261110130000_initial_catalog_and_admin.sql)
- [`20261110143500_product_brand_identity.sql`](../supabase/migrations/20261110143500_product_brand_identity.sql)

The initial migration creates:

- `product-media-drafts` and `product-media-approved` as private buckets
  (`public = false`).
- `product_media` metadata for uploaded images/videos and supported external
  video URLs.
- A partial unique index limiting each product to one primary image.
- Active-admin checks using `private.is_active_admin()` and storage object
  paths rooted at the authenticated admin's user ID.
- A public storage SELECT policy conditional on an approved-bucket object
  being referenced by uploaded product media for a published product in an
  active category.

The second migration only adds a constrained product brand identity; it does
not change storage.

The existing server/browser Supabase helpers use the publishable key and
validated public Supabase URL. No service-role key is read by these helpers.
No upload implementation exists in the inspected source, so application-level
upload authorization, content inspection, size checks, and serving behavior
cannot yet be verified.

## Storage policy behavior by operation

Storage policies are in the initial migration:

- Draft administrator policy: lines 233–244, `FOR ALL`.
- Approved administrator policy: lines 246–257, `FOR ALL`.
- Public approved-media policy: lines 259–275, `FOR SELECT`.

The actual approved bucket is declared at line 230 as
`product-media-approved`. In the approved administrator policy, `USING` at
line 249 checks `product-media-approved`, while `WITH CHECK` at line 254
checks `product-media-public`. Those names do not match.

| Operation | Draft bucket | Approved bucket |
|---|---|---|
| SELECT | Active admin can read objects under their own UID folder. Anonymous/public read is not granted by this draft policy. | Public SELECT policy allows reads only for approved objects linked to published products in active categories. Active admins can also read objects under their own UID folder via the admin `FOR ALL` policy. |
| INSERT | Active admin only, under their own UID folder. | Denied by the current admin policy: inserted row must satisfy `WITH CHECK`, which requires the wrong bucket name. |
| UPDATE | Active admin only; both old and resulting rows must remain within their own UID folder and the draft bucket. | Existing row must satisfy `USING` (own UID folder and approved bucket), but resulting row must satisfy the wrong bucket name in `WITH CHECK`; therefore updates fail. |
| DELETE | Active admin only, under their own UID folder. | Active admin can delete their own approved-bucket objects because DELETE uses the matching `USING` condition; DELETE does not apply the `WITH CHECK` clause. This can leave product metadata referencing a missing object. |

PostgreSQL combines permissive policies with OR semantics for applicable
operations. The public SELECT policy does not grant INSERT, UPDATE, or DELETE.
The review did not inspect any policies installed directly in a hosted project
or policies outside the two repository migrations.

## Findings and recommended corrections

### 1. Approved-bucket write policy uses inconsistent names

**Finding:** The policy's `WITH CHECK` bucket condition is
`product-media-public`; the migration creates only
`product-media-approved`.

**Impact:** Approved-bucket INSERT and UPDATE operations fail through this
policy. DELETE remains allowed for the owning active admin, so administrators
may be able to remove an approved object but be unable to upload its
replacement or update it. This also risks broken product media references.

**Recommended correction:** Change the approved policy's write check to use
the actual approved bucket name, and verify INSERT, UPDATE, DELETE, and
cross-user denial behavior with anon, authenticated non-admin, active admin,
and inactive admin identities in a non-production Supabase environment.
Consider an explicit delete workflow that also handles or prevents orphaned
`product_media` references.

**Location:** Initial migration lines 246–257.

### 2. Upload file size and MIME-type limits are absent

**Finding:** Bucket creation sets only ID, name, and `public = false`. It does
not set `file_size_limit` or `allowed_mime_types`. The SQL schema also does not
bind uploaded object MIME types to `media_type`.

**Impact:** The migrations do not impose file size or MIME allowlists. A
malicious or accidental upload could consume storage or contain content that
the UI does not expect. Existing deployed bucket settings could differ, but
cannot be confirmed from repository files.

**Recommended correction:** Agree per-type formats, maximum image/video size,
video duration, and quotas. Configure matching bucket restrictions and add
server-side validation of actual file content (not only filename or
client-supplied content type), file size, media type, and video duration.
Retain active-admin authorization and safe storage-path checks. Treat bucket
limits as defense in depth, not a substitute for application checks.

### 3. Product-media metadata checks are incomplete for external sources

**Finding:** The database requires external video URLs to start with HTTPS,
but does not constrain them to YouTube or Instagram hosts. Product media
metadata such as title, description, and alt text is publicly selectable for
published products.

**Recommended correction:** Validate provider hosts and supported URL forms
server-side and in database constraints where appropriate. Ensure public
metadata fields contain only approved product content; do not put customer
contact information or private operational notes in media fields.

## Public media and customer-data exposure

The public storage SELECT policy matches an approved object to
`product_media.storage_bucket` and `storage_path`, then requires the associated
product to be published and its category active. The `product_media` table's
public SELECT policy also limits rows to published products and filters
uploaded media to the approved bucket. The storage bucket is private, but the
SELECT policy intentionally grants qualifying reads to `anon` and
`authenticated`; private bucket status does not make rows covered by that
policy private from those roles.

The current migrations contain no customer, enquiry, or purchase tables, and
product media has no customer foreign key. Therefore, the reviewed public
media policies do not currently expose customer records through a declared
relationship. This cannot guarantee that uploaded imagery or administrator-
entered public metadata contains no personal information. Review media and
metadata before publication. Keep future customer/contact data in separate
private tables with separate RLS policies, never in object paths or public
media metadata.

The repository does not yet include media-rendering code, so whether the
private-bucket objects are rendered through authenticated requests or
appropriately scoped signed URLs remains unverified. Ensure any public
delivery mechanism checks publication status and does not create long-lived
or unrestricted access to draft objects.

## Existing table relationships and gaps

Currently present relationships:

- `admin_profiles.id` references `auth.users.id`.
- `products.category_id` references `categories.id`.
- Product media and purchase links reference `products.id`.
- Product creator/updater and media creator references point to
  `admin_profiles.id`.

Gaps relative to the planned application:

- No `collections` table or collection/category relationship exists.
- Categories have no creator/updater references.
- Purchase links have no admin audit references.
- No customer, enquiry, purchase record/item, or follow-up tables exist.
- No relationship from future enquiries to customers/products, purchases to
  customers/items/products, or follow-ups to customers/enquiries/purchases
  exists yet.
- Media bucket/path columns are constrained to allowed bucket names but are
  not foreign-key relationships to actual storage objects. Object deletion
  can leave metadata dangling.
- Thumbnails have bucket/path metadata but no integrity check that the
  referenced object exists or is approved for the corresponding product.

These are scope/model gaps, not evidence that corresponding data is currently
exposed.

## Decisions requiring client approval

1. Accepted image formats, maximum image file size, and whether animated
   formats are allowed.
2. Accepted video formats, maximum file size and duration, and whether
   directly uploaded videos are required in addition to supported external
   video links.
3. Whether draft uploads can be shared among administrators or must remain
   restricted to the uploader's UID folder.
4. Whether deleting an approved asset should be blocked while published
   product media references it, or should unpublish/replace the reference
   atomically.
5. Publication approval workflow and who can move assets from draft to
   approved storage.
6. Whether product categories belong to exactly one collection or can be
   shared across collections.
7. Retention and deletion rules for future customer, enquiry, purchase, and
   follow-up data.

## Review limitations and approval gate

This report is based solely on repository files. No credentials, environment
values, production database, remote Supabase configuration, or live policies
were accessed. No migration or policy was applied. Do not proceed with policy
corrections until the client approves the recommended changes and required
media constraints.
