# JOHOVO content and media migration summary

**Migration snapshot:** 2026-11-10  
**Primary source:** <https://johovo.in/>  
**Scope:** Public website content and media copied into a structured source-data archive, with six non-demo products integrated into the JOHOVO homepage, source-listed category pages, catalogue, product detail pages, and enquiry paths. The original design system and logo assets are retained; no database, Supabase, checkout, or live-site changes were made.

## Results

1. **Products migrated:** 6 named products are included as source products. Two explicitly named demo records are retained separately in the source snapshot and excluded from the genuine-product count.
2. **Pages migrated:** source-rendered main-content HTML snapshots and media references were captured for all 63 inventoried public routes; all 63 returned HTTP 200. This includes 19 standard pages, 8 product pages, 6 category archives, 22 tag archives, 1 brand archive, 4 video-product pages, and 3 empty author archives. Exact WordPress API page content is separately preserved for all 19 standard pages. Product details for 6 named products and 2 demo records are preserved as structured product data.
3. **Product categories:** 6 source categories (Hair Care, Hair Oil, Face Care, Face Pack, Makeup, Trending) and 22 product tags are stored with original IDs, names, hierarchy, and URLs.
4. **Images downloaded:** The initial migration copied 44 files into `public/images/migrated/`: 18 product/gallery images, 10 Hair Oil ingredient illustrations, 2 ambiguous Tomato Pulp illustrations, 9 homepage/shop banners, the source-site logo and icon, and 3 third-party widget icons embedded on product pages. After cleanup, 33 remain: 8 obsolete banners and all 3 unused third-party widget icons were removed. All 44 files decoded in the integrated browser before cleanup. Thirty-six responsive thumbnail URLs map to their local full-resolution source image; redundant thumbnail files were not duplicated.
5. **Videos migrated:** 3 MP4 files copied under `public/videos/migrated/`; all have valid MP4 container structure, and all 3 public source URLs returned HTTP 200 with `video/mp4` content on verification. Browser playback decoding was unsuccessful. The source records 3 product-page associations across 2 unique files (one associated with both Hair Oil and Body Wash); the third MP4 is associated only with demo 3 and remains unverified.
6. **Reviews migrated:** 11 publicly visible comments are preserved as structured product review records and in [reviews-inventory.md](./reviews-inventory.md): 5 Hair Oil and 6 Face Pack. Displayed names, dates, exact HTML text, public URLs, null/unavailable ratings, and null/unavailable locations are preserved. Source average rating is zero despite non-zero review counts.
7. **Missing assets:** 11 source contexts had no downloadable file URL: 6 category thumbnails, 1 Face Pack ingredient image, and 4 video-product post media items. No named product's main or gallery image is missing from the migration.
8. **Inaccessible/unclear content:** the public custom video-product REST endpoint returned 404; the four visible video-post routes had no usable media source. Shop page 2 and Makeup category page 2 requests closed unexpectedly, though the Store API reports all 8 products on a single page. See [missing-content.md](./missing-content.md).
9. **Duplicate media:** the two product-specific Tomato Pulp illustration files for Body Lotion and Body Wash are byte-identical (same SHA-256). Both are retained at their product-specific paths because the source displayed them in both contexts; neither is treated as a verified ingredient.
10. **Public frontend integration:** all 6 named products appear in the searchable and price-sortable `/products` catalogue and have static `/products/[productSlug]` pages. All 6 source categories have browsable pages and homepage links. All 18 product photographs and 10 source ingredient illustrations are associated with their products; available galleries, source descriptions, videos, and all 11 captured reviews are displayed where applicable. Source prices remain clearly marked as unconfirmed, and unavailable ratings are not inferred.
11. **Homepage and navigation:** the home page uses original product photography and includes source categories, all 6 products, the IyalMooligai introduction, the 10 source ingredient illustrations, 3 observed product-video associations, all 11 review texts, and contact/enquiry paths. The desktop header has direct navigation and visible live product search; the responsive menu and search remain available on small screens. No placeholder/future collections are shown.
12. **Contact and purchase links:** the public source policy provides JOHOVO contact details, including a general WhatsApp number; the contact and product enquiry forms prepare a product-specific message for the user to open and send. Form data is not stored by this frontend. No Amazon or Flipkart links were present in product records, so those options are not shown. No checkout or payment functionality was added.
13. **Informational pages:** About, FAQ, privacy, terms, delivery, return, and refund pages render their archived public text with notices that policies and contact details may need current confirmation.
14. **Admin boundary:** the existing admin authentication remains unchanged. The current Supabase migrations contain catalog/admin-profile tables but no enquiry, customer, order, or follow-up tables; the admin dashboard is still a setup placeholder. No admin record-management workflow is claimed or implemented, and no Supabase schema or policy was changed.

## Structured migration data

- [migrated-content.ts](../../src/lib/migration/migrated-content.ts) defines and validates the TypeScript migration data reader.
- [migrated-products.json](../../src/lib/catalog/migrated-products.json) preserves exact WordPress content HTML, storefront price fields (including raw minor units), SKUs, source categories/tags, variations, related-product availability, image/video source associations, public comments, missing-field indicators, and migration timestamps.
- [public-pages.json](../../src/lib/migration/public-pages.json) preserves all 19 public WordPress page bodies and metadata.
- [source-taxonomies.json](../../src/lib/migration/source-taxonomies.json) preserves categories, tags, brand taxonomy, route inventory, and unavailable archive/API notes.
- [public-route-snapshots.json](../../src/lib/migration/public-route-snapshots.json) preserves rendered main-content HTML for all 63 public routes and the source header/footer HTML and links.
- [asset-manifest.json](./asset-manifest.json) maps every downloaded or missing asset context to source URL, local path, association, format, and status.

Source values are retained as observed; no descriptions, prices, unit discrepancies, claims, review wording, or ratings were silently corrected. No new customer information was added beyond fields publicly displayed by the source.

## Validation

- Asset manifest JSON parsed; every local path with a downloaded or derivative-mapped status exists.
- All 44 imported images decoded at non-zero dimensions before cleanup; the 33 retained migration images remain available.
- All 3 MP4 files passed container structure validation; playback remains unverified.
- A runtime validation harness successfully parsed the product, page, taxonomy, and route-snapshot archives.
- `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- All 6 generated product routes returned HTTP 200; a demo product route returned HTTP 404.
- All 30 unique local image/video paths used by genuine products exist and are served locally. No missing product-image paths were found.
- Homepage layouts were checked at 320px, 375px, 390px, 768px, 1024px, 1440px, and 1920px with no horizontal overflow. Search suggestions, query-based product filtering, contact-form WhatsApp message preparation, and all public product/category/policy routes were checked in the production build.

## Integration boundary

Marketplace purchase URLs were unavailable in the source snapshot. The WhatsApp enquiry action uses the general contact number captured in the source policy and requires the visitor to open and send the prepared message. Product, image, and video management remain excluded from the admin panel. Customer/order/enquiry/follow-up record management requires an approved database schema and policies; those Supabase changes were intentionally not made in this frontend phase.

All 18 downloaded images belonging to the six named products and all 10 downloaded Hair Oil ingredient illustrations are used in the catalogue, galleries, or product-information sections. The two Tomato Pulp illustrations remain archived but are not presented as ingredients because their product association is ambiguous. Eight outdated source banners and all three unrelated Meesho widget icons were removed after confirming they had no active local references. The remaining legacy homepage banner is retained because a source component still references it.
