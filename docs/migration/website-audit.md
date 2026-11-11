# JOHOVO public website audit

**Audit date:** 2026-11-10  
**Primary source:** <https://johovo.in/>  
**Scope:** Publicly reachable website pages and unauthenticated WordPress/WooCommerce endpoints only. No account sign-in, private customer data, or live-site changes.

## Coverage

The public sitemap index, child sitemaps, homepage navigation, product/category endpoints, public product pages, media, and public policy pages were reviewed. **63 sitemap/content routes were inspected:** 19 standard pages, 8 product pages, 6 product-category pages, 4 video-product posts, 1 brand archive, 22 product-tag archives, and 3 author archives. These are route counts, not unique products.

| Route group | Count | Inspection notes |
|---|---:|---|
| Standard pages | 19 | Includes homepage, shop, about, policies, contact/support-related pages, account/cart/checkout, and affiliate routes. Public shells only were reviewed for account routes. |
| Products | 8 | Six named product candidates plus `demo 1` and `demo 3`; all are itemized in [product-inventory.md](./product-inventory.md). |
| Product categories | 6 | Hair Care, Hair Oil, Face Care, Face Pack, Makeup, and source slug `tranding` (displayed as Trending). Parent and child counts overlap. |
| Video-product posts | 4 | Three duplicate-titled Rose Body Scrub posts and one numeric-slug post; none exposed a usable product video source. |
| Brand archives | 1 | JOHOVO brand archive; its count does not reconcile with the named products. |
| Product-tag archives | 22 | All returned HTTP 200. They use a common custom page layout; no additional product records were discovered there. |
| Author archives | 3 | All returned HTTP 200 and showed “Nothing Found”; no additional content discovered. |

### Standard page routes

| Page | URL |
|---|---|
| Homepage | <https://johovo.in/> |
| Shop | <https://johovo.in/shop/> |
| Cart | <https://johovo.in/cart/> |
| Checkout | <https://johovo.in/checkout/> |
| My Account | <https://johovo.in/my-account/> |
| Wishlist | <https://johovo.in/my-wishlist/> |
| Reviews | <https://johovo.in/reviews/> |
| Woo Reviews | <https://johovo.in/woo-reviews/> |
| Video | <https://johovo.in/video/> |
| Delivery Policy | <https://johovo.in/delivery-policy/> |
| Refund Policy | <https://johovo.in/refund-policy/> |
| Return Policy | <https://johovo.in/return-policy/> |
| Privacy Policy | <https://johovo.in/privacy-policy/> |
| Terms and Conditions | <https://johovo.in/terms-and-conditions/> |
| About Us | <https://johovo.in/about-us/> |
| FAQ | <https://johovo.in/faq/> |
| Affiliate Dashboard | <https://johovo.in/affiliate-dashboard/> |
| Affiliate Login/Register | <https://johovo.in/affiliate-login-register/> |
| Affiliate Dashboard (duplicate) | <https://johovo.in/affiliate-dashboard-2/> |

### Product-category, video, and brand routes

- Categories: <https://johovo.in/product-category/hair-care/>, <https://johovo.in/product-category/hair-care/hair-oil/>, <https://johovo.in/product-category/face-care/>, <https://johovo.in/product-category/face-care/facepack/>, <https://johovo.in/product-category/makeup/>, and <https://johovo.in/product-category/tranding/>.
- Video-product posts: <https://johovo.in/video_product/3924/>, <https://johovo.in/video_product/premium-rose-body-scrub-johovo/>, <https://johovo.in/video_product/premium-rose-body-scrub-johovo-2/>, and <https://johovo.in/video_product/4085/>.
- Brand: <https://johovo.in/brand/johovo/>.

### Product-tag routes

All 22 returned HTTP 200. Tags are source taxonomy labels, not verified claims:

`herbal-hair-oil`, `ayurvedic-hair-oil`, `homemade-hair-oil`, `bhringaraj-hair-oil`, `rosemary-hair-oil`, `antidandruff-hair-oil`, `hair-growth-hair-oil`, `herbal-face-pack`, `natural-skincare`, `ayurvedic-face-pack`, `sensitive-skin-friendly`, `chemical-free`, `natural-ingredients`, `skin-nourishment`, `rejuvenating-face-pack`, `glowing-skin`, `radiant-skin`, `healthy-skin`, `organic-skincare`, `face-pack-for-all-skin-types`, `traditional-ayurvedic-skincare`, and `gentle-skincare`.

### Author archives

- <https://johovo.in/author/6369727717/>
- <https://johovo.in/author/johovo/>
- <https://johovo.in/author/johovoo/>

The first archive identifies the public author display name “Adhavan Rajadurai”; all three pages displayed “Nothing Found”. No further author data was collected.

## Catalog, homepage, and navigation findings

- The public WooCommerce Store API returned **8 products on 1 page**. No additional product pagination was indicated (`X-WP-Total: 8`, `X-WP-TotalPages: 1`).
- Shop page 2 and Makeup category page 2 probes were attempted but the connection closed unexpectedly. Because the public API reports only one product page, no additional products were indicated; those pagination URLs could not be independently confirmed.
- Homepage header/footer links include About Us, Shop, Video, Login/Register, cart, wishlist, account orders/profile, privacy, and eight product links (including two demos). The homepage presents banners and featured/product tiles. Current coupon/discount language was not treated as valid for future use.
- Homepage promotional image files have been copied to `public/images/migrated/johovo/promotional/`; the logo and site icon were excluded from the product/media migration.
- Category taxonomy is inconsistent with product type: Orange Face Pack and Rose Lotion/Body Wash appear under Makeup; Rose Body Scrub appears under Trending. Hair Oil and Face Pack are in their expected source categories.
- The JOHOVO brand archive reports 3 products; that count does not reconcile with the named product pages.
- Two demo products are exposed in homepage/shop content and have placeholder copy/images. They are excluded from the verified-product count and should remain unpublished unless confirmed.

## Company and support content

The About page describes skincare, haircare, lip care, body care, herbal products, sustainability, and company history. These are source statements and have not been independently verified.

Public contact strings found:

- `support@johovo.in`
- `johovo33@gmail.com`
- `+91 7845873369` / `+91-7845873369`
- `+91 91765 13323`
- FAQ also shows `+91 784573369`, a different/possibly mistyped number.

No verified business/street address was established. Confirm which email and phone are authoritative before reuse.

## Policies and visible offers

- **Delivery:** source states 3–7 business days standard delivery in India, 1–3 days express at extra cost, and 7–14 days international delivery to `[insert countries/regions]`; free standard shipping above ₹999 is stated. The placeholder and current policy validity need review.
- **Refund/returns:** source pages refer to a 7–10 business-day return window, unused/original-packaging conditions, and customer-paid return shipping. Refund, wallet-credit, exchange, exclusions, and RMA conditions differ between pages.
- **Privacy:** describes personal, payment, browsing, and order data collection, third-party sharing, security, and user rights. Legal adequacy and actual implementation were not assessed.
- **Terms:** the terms repeatedly reference `www.johovo.com`, although this audit is for `johovo.in`.
- **Promotions:** homepage includes “SUMMER SALE” / 20% code and “SUMMER10” extra 10% copy. Validity is unknown; do not reuse as current offers.
- **Policies, shipping thresholds, offers, and pricing are source observations only**, not approved customer-facing terms.

## Product media and videos

The migration contains 44 downloaded images: 18 product/gallery images, 10 hair-oil ingredient illustrations, 2 ambiguous tomato illustrations repeated on Lotion and Body Wash, 9 homepage/shop banners, 2 source-site brand graphics, and 3 third-party widget icons embedded on product pages. Thirty-six responsive image-derivative URLs are mapped to their downloaded full-resolution originals. Three videos were copied. The exact source-to-local mapping and status for each file is in [asset-manifest.json](./asset-manifest.json).

The public-site logo and icon were copied into separate migration paths
without modifying the already approved logo files. No category image URL was
supplied by the public category API for any of the six categories.
The six category-image omissions, one absent Face Pack ingredient image, and
four video-product posts without media URLs are recorded as missing-asset
entries in the manifest.

The two tomato illustration files have identical SHA-256 content and the same original URL. They are retained under both source page associations but explicitly marked unverified; they must not be represented as confirmed product ingredients. The Hair Oil-named MP4 is embedded on `demo 3`, not the Herbal Hair Oil product page, and remains unverified for product association. A separate public Video page includes unrelated smartwatch promotional media, which was not copied.

Four video-product routes have no usable video media. The visible product video links were:

- <https://johovo.in/wp-content/uploads/2025/05/WhatsApp-Video-2025-05-18-at-02.40.46_b411177b.mp4> — shown on Herbal Hair Oil and Rose Body Wash.
- <https://johovo.in/wp-content/uploads/2025/08/WhatsApp-Video-2025-05-30-at-02.10.03_44d719d9.mp4> — shown on Rose Body Wash.
- <https://johovo.in/wp-content/uploads/2025/08/JOHOVO-IyalMooligai-Herbal-Hair-Oil.mp4> — embedded on `demo 3`; association unverified.

## Review data and publication boundary

The public comments endpoint returned 5 comments for Hair Oil and 6 for Face Pack. The full public text and display names are preserved in [reviews-inventory.md](./reviews-inventory.md), for audit only. Neither endpoint supplied a numeric per-review rating or public location. The API reports zero average rating despite non-zero comment counts. Public visibility does not establish authenticity, consent, or rights to republish.

No product cards or routes were wired into the visible UI in this data-only
phase. The six named products, two demo entries, all 19 standard page records,
taxonomy/archive metadata, source media references, and 11 public comments are
preserved in the migration data files. No database, Supabase policy, checkout,
or payment behavior was changed.
