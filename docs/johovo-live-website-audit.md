# JOHOVO live website audit and migration inventory

**Audit date:** 10 November 2026  
**Primary source:** <https://johovo.in/>  
**Scope:** Public pages and public WordPress/WooCommerce endpoints only. No
admin or customer-account data was accessed. The live site was not modified.

The expanded route audit, exact product copy, public review inventory, new
asset manifest, and migrated media paths are documented in
[`docs/migration/`](./migration/website-audit.md). That set supersedes this
report where the expanded audit has later or more detailed coverage.

## Executive findings

- **63 public content routes inspected in the expanded audit:** 19 standard
  pages, 8 product URLs, 6 product-category URLs, 4 video-product posts, 1
  brand route, 22 product-tag archives, and 3 author archives. See
  `docs/migration/website-audit.md` for the full route inventory and pagination
  caveats.
- **8 published product entries found:** 6 named products and 2 entries named
  `demo 1` and `demo 3`. The two demos are not treated as genuine products and
  must not be published in the replacement catalogue.
- **6 named product candidates:** 2 explicitly branded IyalMooligai, 3 Rose
  products, and the JOHOVO Orange Face Pack. The Rose Lotion title uses
  “Johova”; verify its product-brand spelling.
- **18 product/gallery images downloaded and verified**, plus 10 IyalMooligai
  hair-oil ingredient illustrations and 2 ambiguous tomato illustrations.
  All 30 image files are under `public/images/products/`; the two ambiguous
  images are marked as unverified, not approved ingredient assets.
- **3 video files copied:** 2 media URLs embedded on product pages and 1
  hair-oil-named video found on the `demo 3` page whose product association is
  unverified. MP4 container structure was verified; browser playback decoding
  was not.
- **11 public customer comments found** on the two IyalMooligai products:
  five on Hair Oil and six on Face Pack. The pages/API report zero average
  rating while reporting non-zero review counts. Public text and displayed
  names are preserved for audit only in
  `docs/migration/reviews-inventory.md`; no review was added to the catalogue.
  Authenticity and republishing rights remain unverified.
- **No product records have been published or populated into the catalogue.**
  Prices are old live-page observations, product claims need review, and
  source ownership/accuracy requires client verification.
- No Supabase configuration, database, migrations, production policies,
  checkout, or payment functionality was changed.

## Audit method and coverage

The public WordPress sitemap index and child sitemaps were used to enumerate
pages, products, video posts, and category routes. Public WordPress product and
taxonomy endpoints and the WooCommerce Store API were used to cross-check
slugs, product names, SKUs, prices, sizes, images, categories, ratings, and
review counts. Product pages and their visible media were checked individually.
All routes listed below returned HTTP 200 at inspection, including account and
affiliate routes; their authenticated/private content was not accessed.

### Public page routes inspected

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
| Affiliate Dashboard (duplicate route) | <https://johovo.in/affiliate-dashboard-2/> |

### Category and brand routes inspected

| Source category | URL | Public taxonomy count | Audit note |
|---|---|---:|---|
| Hair Care | <https://johovo.in/product-category/hair-care/> | 1 | Parent of Hair Oil |
| Hair Oil | <https://johovo.in/product-category/hair-care/hair-oil/> | 1 | IyalMooligai Hair Oil |
| Face Care | <https://johovo.in/product-category/face-care/> | 1 | Parent of Face Pack |
| Face Pack | <https://johovo.in/product-category/face-care/facepack/> | 1 | IyalMooligai face-pack candidate |
| Makeup | <https://johovo.in/product-category/makeup/> | 5 | Includes both demos and misclassified skin/body products |
| Trending (`tranding` source slug) | <https://johovo.in/product-category/tranding/> | 1 | Rose Body Scrub |
| JOHOVO brand | <https://johovo.in/brand/johovo/> | 3 | Brand count does not reconcile to named products |

Counts are WooCommerce taxonomy counts, not counts of unique approved
products. Parent/child categories overlap.

### Video-post routes inspected

- <https://johovo.in/video_product/3924/>
- <https://johovo.in/video_product/premium-rose-body-scrub-johovo/>
- <https://johovo.in/video_product/premium-rose-body-scrub-johovo-2/>
- <https://johovo.in/video_product/4085/>

These are public blog/video-post routes, not a reliable product video
inventory: three are duplicate-titled Rose Body Scrub posts, one has no useful
title, and none exposed a video source on the inspected page. The separate
Video page includes unrelated third-party smartwatch promotional content; it
was not migrated.

## Site-wide observations

### Homepage, header, navigation, and footer

- The homepage title is “JOHOVO – JOHOVO where beauty products”.
- The header includes category/brand navigation, Makeup, Fashion, Beauty Blog,
  search, login/register, cart, and wishlist links. The homepage contains
  promotional banners including “SUMMER SALE” (20% code) and “SUMMER10”
  (extra 10%); validity is unverified and neither offer should be reused as
  current.
- The homepage lists the six named products and both demo entries. `demo 1`
  and `demo 3` appear more than once in the captured homepage headings.
- The site presents “Best Prices & Offers”, “Wide Assortment”, and “Easy
  Returns” blocks and a general Johovo Cosmetics description. These statements
  are source copy, not independently verified company facts.
- The public site identifies itself as Johovo Cosmetics and includes a
  disclaimer that it is not linked to Johovo.com. The Terms page itself
  repeatedly refers to `www.johovo.com` even though the audited site is
  `johovo.in`; this is a domain inconsistency to resolve.
- No verified street/business address was established in this audit.

### Company and contact information

The About page describes skincare, haircare, lip care, body care, herbal-based
products, sustainability, and a company history. These are unverified claims
and should be client-approved before reuse.

Public pages show these business contact details:

- `support@johovo.in`
- `johovo33@gmail.com`
- `+91 7845873369` (also rendered as `+91-7845873369`)
- `+91 91765 13323`
- FAQ text also contains `+91 784573369`, a different/possibly mistyped
  number. Confirm the authoritative contact details.

### Public policies and support pages

- **Delivery:** the source says standard delivery in India takes 3–7 business
  days, express takes 1–3 days at extra cost, and international delivery takes
  7–14 days to `[insert countries/regions]`. Free standard shipping above
  ₹999 is stated. The placeholder and current policy validity require review.
- **Refund/return:** the pages state a 7–10 business-day return window,
  original packaging/unused-product requirements, and customer-paid return
  shipping (return page). Refund, wallet-credit, exchange, non-returnable
  product, and RMA conditions differ in phrasing between pages. Confirm one
  approved policy.
- **Privacy:** describes personal, payment, browsing, and order data
  collection, third-party sharing, security, and user rights. The actual
  implementation and legal adequacy were not audited.
- **Terms:** contains a mismatched `.com` domain. Terms/legal text should be
  reviewed before migration.
- **FAQ/reviews:** public routes exist; review routes include empty, invalid,
  or generic content. No account/private information was accessed.

## Product inventory

Product data below reflects the inspected public pages/API on the audit date.
Prices are observations, **not approved/current selling prices**. The Store
API represents INR amounts in minor units; this report renders those as
rupees. Marketing and health/efficacy/safety claims are paraphrased rather
than republished verbatim and require client/legal review.

| Source title | Original product URL | Brand/category assessment | SKU | Observed price | Size/variation | Public review data |
|---|---|---|---|---|---|---|
| Orange Face Pack – Johovo | <https://johovo.in/product/johovo-premium-orange-face-pack-brighten-and-nourish-your-skin/> | JOHOVO; source taxonomy Makeup, likely Face Care by product type | Missing | ₹399 regular / ₹200 sale | No product size returned; page template shows 1/2/3 pack offers | 0 reviews; 0 rating |
| Premium Rose Moisturizing Body Lotion – Johova | <https://johovo.in/product/premium-rose-moisturizing-body-lotion-johova/> | JOHOVO site, but product name says “Johova”; Makeup taxonomy, likely Body Care | Missing | ₹500 / ₹150 | Not specified | 0 / 0 |
| Premium Rose Body Wash – Johovo | <https://johovo.in/product/premium-rose-body-wash-johovo/> | JOHOVO; Makeup taxonomy, likely Body Care | Missing | ₹499 / ₹499 | No verified size; Store API has unrelated `new: hi` attribute | 0 / 0 |
| Premium Rose Body Scrub – Johovo | <https://johovo.in/product/premium-rose-body-scrub-johovo/> | JOHOVO; Trending taxonomy, likely Body Care | Missing | ₹1,000 / ₹400 | Store API says 240ml; page has unclear trailing “100” and pack-bundle offers | 0 / 0 |
| JOHOVO™ IyalMooligai™ Herbal Hair Oil | <https://johovo.in/product/johovo-iyalmooligai-herbal-hair-oil/> | IyalMooligai; Hair Care / Hair Oil | `JHCHO101` | ₹840 / ₹720 | 240ml | 5 comments; API rating 0 |
| JOHOVO™ IyalMooligai™ Herbal Face Pack Test | <https://johovo.in/product/johovo-iyalmooligai-herbal-face-pack/> | IyalMooligai; Face Care / Face Pack | `JHFP201` | ₹840 / ₹720 | Page says 210mg; gallery filename says 210G. Unit discrepancy. | 6 comments; API rating 0 |
| demo 1 | <https://johovo.in/product/demo-1/> | Demo; Makeup taxonomy; exclude | Missing | ₹500 / ₹150 | Template shows 1/2/3 pack offers | 0 / 0 |
| demo 3 | <https://johovo.in/product/demo-3/> | Demo; Makeup taxonomy; exclude; content and media appear cross-associated | Missing | ₹499 / ₹150 | Template shows 1/2/3 pack offers | 0 / 0 |

### Detailed named product audit

#### Orange Face Pack – Johovo

- **Source URL:** <https://johovo.in/product/johovo-premium-orange-face-pack-brighten-and-nourish-your-skin/>
- **SKU:** not exposed in inspected page or Store API.
- **Category:** public taxonomy is Makeup; product type indicates face pack.
  Confirm category assignment with client.
- **Short description:** the source describes an orange-peel face pack for
  nourishing and brightening skin.
- **Full description audit:** source copy lists brightening, dark-spot,
  moisturising, exfoliation, and general quality/sustainability assertions.
  These cosmetic efficacy and “100% natural/no harsh chemicals” claims need
  substantiation and approval.
- **Ingredients:** source specifies pure orange peels; no complete formula
  disclosed.
- **Usage:** source instructs mixing with water or rose water, applying to
  face/neck while avoiding eyes, leaving 15–20 minutes, rinsing, and regular
  use. Verify before republishing.
- **Safety/storage/expiry:** no product-specific information found.
- **Images:** main `orange-face-pack-main.jpg`; gallery
  `orange-face-pack-gallery.jpg`.
- **Ingredient images/videos/reviews:** no ingredient image or product video
  found; no public reviews found.
- **Price:** ₹399 regular/₹200 sale observed; validity requires confirmation.

#### Premium Rose Moisturizing Body Lotion – Johova

- **Source URL:** <https://johovo.in/product/premium-rose-moisturizing-body-lotion-johova/>
- **SKU:** not exposed.
- **Category/brand:** Makeup taxonomy; Body Care is a likely product-type
  mapping. “Johova” in the product name conflicts with the JOHOVO parent
  identity and the `johovo.in` domain.
- **Short description:** no short description returned.
- **Full description audit:** source discusses hydration, elasticity, soothing,
  fragrance, and ingredient/“natural” claims. These claims require review.
- **Ingredients:** text mentions rose extracts, coconut oil, shea butter, olive
  oil, and hyaluronic acid. The separate ingredient section labels a tomato
  image/“Tomato Pulp”; that image/content appears unrelated and must not be
  attributed to the lotion without confirmation.
- **Usage:** source says to apply after bathing, massage until absorbed, and
  use regularly; verify before republishing.
- **Safety/storage/expiry:** the source section contains “Kids Safe: uiuiuii”
  and “Expiry: kbk c c hc hc hc”; both are unusable placeholder/gibberish
  values. No validated storage direction found.
- **Images:** `rose-body-lotion-main.png`; ambiguous tomato illustration saved
  as `unverified-tomato-ingredient-lotion.avif`.
- **Videos/reviews:** none found.
- **Price:** ₹500/₹150 observed; validity requires confirmation.

#### Premium Rose Body Wash – Johovo

- **Source URL:** <https://johovo.in/product/premium-rose-body-wash-johovo/>
- **SKU:** not exposed.
- **Category:** Makeup taxonomy; likely Body Care based on source title. Confirm.
- **Short/full description:** source short text is “hiii”; full description is
  `huh7890i09i9`. Treat as placeholder content, not product copy.
- **Ingredients:** source ingredient section repeats Tomato Pulp text and the
  same tomato image seen on the Lotion page. This is inconsistent with the
  Body Wash title; do not present it as verified formula information.
- **Benefits/usage/safety/storage/expiry:** no usable product-specific content
  found.
- **Sizes:** no verified size. The Store API `new: hi` attribute is not a
  usable size. Page-level bundle options are not evidence of product size.
- **Images:** `rose-body-wash-main.png`; ambiguous tomato illustration saved
  as `unverified-tomato-ingredient-body-wash.avif`.
- **Videos:** two MP4 URLs are embedded on the product page. One is also
  embedded on the Herbal Hair Oil page; the second appears only on this Body
  Wash page.
- **Reviews:** none found.
- **Price:** ₹499 observed with no sale price; validity requires confirmation.

#### Premium Rose Body Scrub – Johovo

- **Source URL:** <https://johovo.in/product/premium-rose-body-scrub-johovo/>
- **SKU:** not exposed.
- **Category:** source taxonomy is Trending, not a product-type category.
  Body Care is a likely client-approved mapping.
- **Short/full description:** page includes “hi” and states no full
  description; no meaningful product description found.
- **Ingredients/benefits/usage/safety/storage/expiry:** not supplied in usable
  form.
- **Size/price:** Store API returns 240ml; page price is ₹1,000 regular/₹400
  current, plus an unclear trailing “100” and multi-pack template pricing.
  Confirm unit and price.
- **Images:** `rose-body-scrub-main.png`.
- **Videos/reviews:** no product-page video source or reviews found. Three
  duplicate-titled video-product posts exist, but no video was embedded.

#### JOHOVO™ IyalMooligai™ Herbal Hair Oil

- **Source URL:** <https://johovo.in/product/johovo-iyalmooligai-herbal-hair-oil/>
- **SKU/category/size:** `JHCHO101`; Hair Oil; 240ml.
- **Short description audit:** source describes a herbal/oil blend and claims
  nourishment, protection, hair growth, reduced dandruff/itchiness, and
  improved appearance. These health/efficacy claims need review.
- **Full description audit:** source discusses Ayurvedic tradition and
  hair-growth/hair-fall/texture outcomes; claims require client/regulatory
  review.
- **Ingredients listed:** Bhringaraj, Rosemary, Amla, Neem, Coconut Oil,
  Henna, Ashwagandha, Hibiscus, Betel Vine, and Small Onion. Ten ingredient
  labels and illustrations are present; confirm the canonical formula.
- **Benefits:** source makes ingredient-specific hair growth, dandruff,
  irritation, hair-strength, and hair-fall claims; all need substantiation.
- **Usage/safety/storage/expiry:** no complete, verified directions or
  safety/storage/expiry information captured for this product.
- **Images:** six gallery images and ten named ingredient illustrations
  migrated to `public/images/products/iyalmooligai/hair-oil/`.
- **Videos:** shared MP4 `whatsapp-product-video-2025-05-18.mp4` appears on this
  page and Body Wash. A separate video with Hair Oil in its filename appears
  on the `demo 3` page; its product relation is unverified.
- **Reviews:** five public comments, no numeric rating exposed; the API
  average is 0 despite the comments. Review reuse requires client permission
  and privacy/rights review.
- **Price:** ₹840/₹720 observed; validity requires confirmation.

#### JOHOVO™ IyalMooligai™ Herbal Face Pack Test

- **Source URL:** <https://johovo.in/product/johovo-iyalmooligai-herbal-face-pack/>
- **SKU/category:** `JHFP201`; Face Pack, under Face Care.
- **Name discrepancy:** the live title ends in “Test”; confirm intended
  customer-facing product name before publishing.
- **Short/full description audit:** source describes a herbal/Ayurvedic
  face-pack and claims cleansing, moisturising, acne/blemish reduction,
  complexion brightening, and soothing effects. These efficacy claims need
  substantiation and approval.
- **Ingredients:** no actual ingredient list found on the detail page.
- **Usage:** no usable directions found.
- **Safety/storage/expiry:** source says to patch test; claims suitability for
  sensitive skin, pregnancy safety, and use by children over 3; storage away
  from sunlight at room temperature; expiry nine months after manufacture.
  Treat all safety/age/pregnancy/expiry claims as unverified pending formula
  and regulatory review. Source text contains “hrbal” typo.
- **Images:** seven gallery images migrated to
  `public/images/products/iyalmooligai/face-pack/`. No separate ingredient
  image was found.
- **Reviews:** six public comments, API rating 0. The product page displays
  “0 ratings” with six reviews, which is an explicit discrepancy. Do not
  republish comments until permitted and verified.
- **Price/size:** ₹840/₹720 observed. Page says 210mg, while image filename
  contains `210G`; confirm unit/pack size.

### Demo entries (exclude from public catalogue)

- **demo 1:** <https://johovo.in/product/demo-1/> — source title and
  description are demo text; price template shows ₹500/₹150 and bundle
  options; images are reused Rose Body Wash/Scrub photos. Excluded from
  product-image migration and publication.
- **demo 3:** <https://johovo.in/product/demo-3/> — source title and
  description are demo text; price template shows ₹499/₹150 and bundle
  options; images are reused Rose Lotion/Body Scrub/Body Wash photos; it has
  unrelated placeholder safety and usage text. A video named for IyalMooligai
  Hair Oil is embedded on this page and is preserved separately as an
  unverified association. Excluded from public catalogue.

## Image asset inventory

All listed image files were downloaded from their original public URLs and
verified to exist locally. Product images are not published by this audit.
Source alt text was generally blank or generic; descriptive local filenames
do not imply verified alt-text approval.

| Product/asset | Local file(s) | Original source URL(s) |
|---|---|---|
| Orange Face Pack | `public/images/products/orange-face-pack/orange-face-pack-main.jpg`; `public/images/products/orange-face-pack/orange-face-pack-gallery.jpg` | <https://johovo.in/wp-content/uploads/2025/05/1000094299.jpg>; <https://johovo.in/wp-content/uploads/2025/05/1000094819-scaled.jpg> |
| Rose Body Lotion | `public/images/products/rose-body-lotion/rose-body-lotion-main.png` | <https://johovo.in/wp-content/uploads/2025/05/1000099436.png> |
| Rose Body Wash | `public/images/products/rose-body-wash/rose-body-wash-main.png` | <https://johovo.in/wp-content/uploads/2025/05/1000099437.png> |
| Rose Body Scrub | `public/images/products/rose-body-scrub/rose-body-scrub-main.png` | <https://johovo.in/wp-content/uploads/2025/05/1000099438.png> |
| IyalMooligai Herbal Hair Oil gallery 1–6 | `public/images/products/iyalmooligai/hair-oil/herbal-hair-oil-main.png`; `herbal-hair-oil-gallery-02.png` through `herbal-hair-oil-gallery-06.png` | <https://johovo.in/wp-content/uploads/2025/08/JOHOVO-HO_1200px_001.png>; <https://johovo.in/wp-content/uploads/2025/08/JOHOVO-HO_1200px_004.png>; <https://johovo.in/wp-content/uploads/2025/08/JOHOVO-HO_1200px_005.png>; <https://johovo.in/wp-content/uploads/2025/08/JOHOVO-HO_1200px_006.png>; <https://johovo.in/wp-content/uploads/2025/08/JOHOVO-HO_1200px_007.png>; <https://johovo.in/wp-content/uploads/2025/08/JOHOVO-HO_1200px_008.png> |
| Hair Oil ingredient illustrations | `public/images/products/iyalmooligai/hair-oil/bhringaraj-ingredient.png`; `rosemary-ingredient.png`; `amla-ingredient.png`; `neem-ingredient.png`; `coconut-oil-ingredient.png`; `henna-ingredient.png`; `ashwagandha-ingredient.png`; `hibiscus-ingredient.png`; `betel-vine-ingredient.png`; `small-onion-ingredient.png` | <https://johovo.in/wp-content/uploads/2025/08/Bhringaraj.png>; <https://johovo.in/wp-content/uploads/2025/08/Rosemary.png>; <https://johovo.in/wp-content/uploads/2025/08/Amla.png>; <https://johovo.in/wp-content/uploads/2025/08/Neem.png>; <https://johovo.in/wp-content/uploads/2025/08/Coconut-Oil.png>; <https://johovo.in/wp-content/uploads/2025/08/Henna.png>; <https://johovo.in/wp-content/uploads/2025/08/Ashwagandha.png>; <https://johovo.in/wp-content/uploads/2025/08/Hibiscus.png>; <https://johovo.in/wp-content/uploads/2025/08/Betel-Leaves.png>; <https://johovo.in/wp-content/uploads/2025/08/Small-Onion.png> |
| IyalMooligai Herbal Face Pack gallery 1–7 | `public/images/products/iyalmooligai/face-pack/herbal-face-pack-main.png`; `herbal-face-pack-gallery-02.png` through `herbal-face-pack-gallery-07.png` | <https://johovo.in/wp-content/uploads/2025/08/JOHOVO_FP-BIG-210G_AMAZON-PICS_002.png>; <https://johovo.in/wp-content/uploads/2025/08/JOHOVO_FP-BIG-210G_AMAZON-PICS_005.png>; <https://johovo.in/wp-content/uploads/2025/08/JOHOVO_FP-BIG-210G_AMAZON-PICS_006.png>; <https://johovo.in/wp-content/uploads/2025/08/JOHOVO_FP-BIG-210G_AMAZON-PICS_007.png>; <https://johovo.in/wp-content/uploads/2025/08/JOHOVO_FP-BIG-210G_AMAZON-PICS_008.png>; <https://johovo.in/wp-content/uploads/2025/08/JOHOVO_FP-BIG-210G_AMAZON-PICS_010.png>; <https://johovo.in/wp-content/uploads/2025/08/JOHOVO_FP-BIG-210G_AMAZON-PICS_009.png> |
| Ambiguous Tomato Pulp illustration (Lotion section) | `public/images/products/rose-body-lotion/unverified-tomato-ingredient-lotion.avif` | <https://johovo.in/wp-content/uploads/2025/05/top_view_ripe_fresh_tomatoes_with_water_drops_black_background_1_88d8075c5a.avif> |
| Ambiguous Tomato Pulp illustration (Body Wash section) | `public/images/products/rose-body-wash/unverified-tomato-ingredient-body-wash.avif` | <https://johovo.in/wp-content/uploads/2025/05/top_view_ripe_fresh_tomatoes_with_water_drops_black_background_1_88d8075c5a.avif> |

**Counts:** 18 product/gallery images, 10 ingredient illustrations, and 2
unverified ingredient-section illustrations = 30 local image files. No product
image URL in the listed product galleries was missing at download time.

## Video inventory

| Local file | Original URL | Page association | Status |
|---|---|---|---|
| `public/videos/johovo/whatsapp-product-video-2025-05-18.mp4` | <https://johovo.in/wp-content/uploads/2025/05/WhatsApp-Video-2025-05-18-at-02.40.46_b411177b.mp4> | Embedded on Herbal Hair Oil and Rose Body Wash pages | Downloaded; shared association is source-observed |
| `public/videos/johovo/whatsapp-product-video-2025-05-30.mp4` | <https://johovo.in/wp-content/uploads/2025/08/WhatsApp-Video-2025-05-30-at-02.10.03_44d719d9.mp4> | Embedded on Rose Body Wash page | Downloaded |
| `public/videos/unverified/iyalmooligai-hair-oil-unverified-demo-association.mp4` | <https://johovo.in/wp-content/uploads/2025/08/JOHOVO-IyalMooligai-Herbal-Hair-Oil.mp4> | Embedded on `demo 3` page | Downloaded for audit; do not publish until association is confirmed |

Two additional video-product posts duplicate the Rose Body Scrub title but
expose no video media. The Video page also references an unrelated
`cdn.shopify.com` smartwatch video; it was not copied.

## Review audit

The public comments endpoint returned 5 Hair Oil comments and 6 Face Pack
comments. Other named-product products returned no public comments. The two
IyalMooligai product pages and Store API report 0 average rating while showing
5 and 6 reviews respectively; individual numeric ratings were not available
from the public endpoint inspected. Exact returned public text, display
names, and dates are documented in
`docs/migration/reviews-inventory.md` for audit traceability only. Obtain
client confirmation of rights, consent, attribution, and authenticity before
republishing. Do not use the review counts as ratings.

## Catalogue/data discrepancies requiring client decision

1. The source lists two demo products publicly; confirm they are not genuine
   before removing them from the new public catalogue (this audit excludes
   them pending confirmation).
2. The Rose Body Lotion title says “Johova”, unlike the JOHOVO identity.
3. The Orange Face Pack is categorized as Makeup, not Face Care.
4. Rose Lotion and Body Wash are categorized as Makeup; Rose Body Scrub is
   categorized as Trending. Product-type assignments need confirmation.
5. Brand taxonomy says JOHOVO has 3 items, which does not reconcile with the
   displayed named products and IyalMooligai titles.
6. The Herbal Face Pack title includes “Test”; size is shown as 210mg while
   image filenames state 210G.
7. Rose Body Scrub reports 240ml in the Store API, while the page has an
   unexplained trailing “100” and multi-pack price table.
8. Rose Body Wash contains unusable placeholder description/attribute data.
   Both Lotion and Body Wash have a tomato “ingredient” illustration and
   Tomato Pulp section; verify whether this is accidental duplicated content.
9. IyalMooligai Hair Oil text and image set list ten ingredient labels, while
   the visible section has nine illustrations; verify canonical formula and
   count.
10. Hair Oil and Face Pack have 5/6 comments but zero average rating; verify
    the reviews and source rating calculation.
11. The source footer/page content and Terms refer to both `johovo.in` and
    `johovo.com`. Terms also identify `www.johovo.com` as the website.
12. Contact phone numbers differ between Delivery/Refund/FAQ pages.
13. Prices, sale percentages, bundle prices, coupons, free-shipping threshold,
    delivery estimates, and return windows were observed but may be stale.
14. The Hair Oil-named video is attached to the `demo 3` page; verify whether
    it belongs to Herbal Hair Oil.

## Product model and publication boundary

`src/lib/catalog/product.ts` defines the typed product structure requested for
the new catalogue: identity, brand, SKU, category, descriptions, prices,
currency, sizes, product/ingredient images, ingredients, benefits, usage,
safety, storage, expiry, videos, reviews, rating/count, source URL, approval
state, publication state, and migration notes. Missing values are nullable.

`src/lib/catalog/herbal-care.ts` remains an empty product dataset. Records may
be added only after client review; public filters require both
`approvalStatus: "client-approved"` and `publicationStatus: "published"`.
Downloaded source media is not itself approval to publish associated claims,
prices, reviews, or product pages.

## Next actions (pending client approval)

- Confirm product names, brand spelling, category assignments, genuine/demo
  status, and Face Pack unit.
- Approve current prices, sizes, product descriptions, ingredient lists, and
  all health/safety/efficacy/age/pregnancy claims.
- Confirm each product image/video association and provide alt text.
- Resolve the Tomato Pulp image/content mismatch and Hair Oil ingredient count.
- Confirm whether public customer reviews may be republished, with attribution
  and ratings.
- Confirm authoritative business contact and shipping/return/privacy/terms
  content.
- After approval, create product records as drafts, validate paths and detail
  routes, and only then publish approved records.
