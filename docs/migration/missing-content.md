# Missing, unclear, and unverified source content

**Scope:** public JOHOVO source content checked 2026-11-10. Missing means not found in inspected public product pages or APIs; it does not mean the information does not exist elsewhere.

## Product data gaps

| Product | Missing or unclear information |
|---|---|
| Orange Face Pack – Johovo | SKU; validated net quantity; complete formula; safety/storage/expiry; product video; current price validity; category assignment (source says Makeup). |
| Premium Rose Moisturizing Body Lotion – Johova | SKU; net quantity; verified formula; validated safety/storage/expiry (source displays gibberish placeholder values); whether “Johova” is intended; whether Tomato Pulp is actually an ingredient; current price validity. |
| Premium Rose Body Wash – Johovo | SKU; meaningful short/full copy (source values are `hiii` and `huh7890i09i9`); verified formula, size, benefits, directions, safety, storage, expiry; whether Tomato Pulp content/image belongs to it; current price validity. |
| Premium Rose Body Scrub – Johovo | SKU; meaningful full description, ingredients, benefits, usage, safety, storage, expiry; clarify 240ml Store API value against page’s trailing `100`/bundle offers; current price validity. |
| IyalMooligai Herbal Hair Oil | Confirm SKU `JHCHO101`; canonical ingredients (10 named labels versus 9 visible illustrations); complete directions and safety/storage/expiry; confirm claims, review authenticity/rights, and whether Hair Oil-named video belongs to product; current price validity. |
| IyalMooligai Herbal Face Pack Test | Confirm customer-facing name (source contains `Test`); resolve `210mg` versus gallery filename `210G`; complete ingredients and directions; verify patch-test, sensitive-skin, pregnancy/child use, storage, and nine-month expiry statements; confirm review authenticity/rights and source claims; current price validity. |
| demo 1 | Product identity, SKU, approved image/copy, and whether it is genuine; excluded pending client confirmation. |
| demo 3 | Product identity, SKU, approved image/copy, and whether it is genuine; reused product images and placeholder content. Hair-oil-named video association is unverified. |

## Site-wide inconsistencies and approval requirements

- Product taxonomy is inconsistent with product type (Makeup/Trending assignments for face/body products). The brand archive count of 3 also does not reconcile with the named entries.
- “Johova” is used in the Rose Lotion title while the domain/company brand is JOHOVO.
- Historical sale prices, coupon promotions, bundle prices, discount badges, shipping threshold, delivery estimates, and return windows must not be treated as currently approved.
- Delivery page has `[insert countries/regions]`; FAQ phone number `+91 784573369` differs from other displayed numbers. Confirm business contact details.
- Terms refer to `www.johovo.com`, not the audited `johovo.in`. Legal and privacy text requires review.
- About page history, sustainability, product efficacy, safety, “natural/chemical-free”, and suitability claims were not independently verified. No certifications or product benefits were independently verified.
- The 11 public reviews have no exposed numeric per-review ratings/locations; store average is 0 for each product despite non-zero comment counts. Public display does not establish consent/rights to republish.

## Asset and media gaps

- 18 product/gallery images, 10 hair-oil ingredient illustrations, and 7 homepage banner/slider images were copied and image-decoded successfully.
- Two Tomato Pulp illustrations are the same source URL and SHA-256 file, shown on both Lotion and Body Wash. Product association is unverified; they remain explicitly marked as such.
- No separately identified Face Pack ingredient image was found. Ingredient illustrations exist for Hair Oil only.
- Two product-page videos have observed associations: one shared by Hair Oil and Body Wash, and one on Body Wash. A third Hair-Oil-named MP4 is attached to demo 3 and has unverified product association.
- The three MP4s exist locally and have valid MP4 container structure; the integrated browser could not decode/play them (`networkState: 3`), so playback was not verified. Treat them as downloaded source media, not confirmed playable media.
- Four video-product posts did not expose usable video media. Unrelated smartwatch media on the public Video page was excluded.
- No confirmed missing product/gallery image URL was encountered among the six named products. Demos are excluded and their reused photos are not migrated as demo assets.

## Route/access caveats

- 22 tag archives and 3 author archives returned HTTP 200; author archives showed “Nothing Found”. Tag archives use a common custom layout; they yielded no additional product records.
- Public Store API reports 8 total products and 1 page. Direct probes for shop page 2 and Makeup category page 2 ended with a connection-close error, so those pagination URLs could not be independently inspected. No additional product pages are indicated by the API count.
- Account, cart, checkout, and affiliate routes were inspected only as public pages/shells. No authentication was attempted and no private customer/order information was accessed.
