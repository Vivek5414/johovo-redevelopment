# JOHOVO product inventory

**Source:** public JOHOVO product pages and public WordPress/WooCommerce APIs, checked 2026-11-10.  
**Status:** original public product records are migrated to the structured source catalogue. Six named source products are treated as genuine product candidates; two explicitly named demo entries are preserved for provenance but excluded from the genuine-product count. Source claims and prices are historical source data, not current-price assurances.

## Discovered entries

| Source name | Source URL | Brand as observed | SKU | Source category | Regular / sale price observed | Discount | Size / variation | Reviews (count / rating) | Migration status |
|---|---|---|---|---|---:|---:|---|---|---|
| Orange Face Pack – Johovo | <https://johovo.in/product/johovo-premium-orange-face-pack-brighten-and-nourish-your-skin/> | JOHOVO | Missing in public Store API | Makeup | ₹399 / ₹200 | Source listing | No structured size; page has 1/2/3 pack offers | 0 / 0 | Migrated; product content and image references preserved |
| Premium Rose Moisturizing Body Lotion – Johova | <https://johovo.in/product/premium-rose-moisturizing-body-lotion-johova/> | JOHOVO site; title says Johova | Missing in public Store API | Makeup | ₹500 / ₹150 | Source listing | Not specified | 0 / 0 | Migrated; title discrepancy preserved |
| Premium Rose Body Wash – Johovo | <https://johovo.in/product/premium-rose-body-wash-johovo/> | JOHOVO | Missing in public Store API | Makeup | ₹499 / ₹499 | None shown | No verified size; Store API has `new: hi` attribute | 0 / 0 | Migrated; placeholder copy preserved verbatim |
| Premium Rose Body Scrub – Johovo | <https://johovo.in/product/premium-rose-body-scrub-johovo/> | JOHOVO | Missing in public Store API | Trending (`tranding`) | ₹1,000 / ₹400 | Source listing | Store API says 240ml; page has unexplained “100” and pack options | 0 / 0 | Migrated; unit and content discrepancy preserved |
| JOHOVO™ IyalMooligai™ Herbal Hair Oil | <https://johovo.in/product/johovo-iyalmooligai-herbal-hair-oil/> | IyalMooligai; Store API brand taxonomy says JOHOVO | `JHCHO101` | Hair Care → Hair Oil | ₹840 / ₹720 | Source listing | 240ml shown on source page; no Store API size attribute | 5 / 0 | Migrated; source and rating discrepancy preserved |
| JOHOVO™ IyalMooligai™ Herbal Face Pack Test | <https://johovo.in/product/johovo-iyalmooligai-herbal-face-pack/> | IyalMooligai; Store API brand taxonomy says JOHOVO | `JHFP201` | Face Care → Face Pack | ₹840 / ₹720 | Source listing | Page says 210mg; gallery filenames say 210G | 6 / 0 | Migrated; source name/unit and rating discrepancy preserved |
| demo 1 | <https://johovo.in/product/demo-1/> | Unverified/demo | Unavailable | Makeup | ₹500 / ₹150 | 70% badge | Template has 1/2/3 pack offers | 0 / 0 | Demo; exclude from verified catalogue |
| demo 3 | <https://johovo.in/product/demo-3/> | Unverified/demo | Unavailable | Makeup | ₹499 / ₹150 | 70% badge | Template has 1/2/3 pack offers | 0 / 0 | Demo; exclude from verified catalogue; video association unverified |

Prices are the Store API values observed on the audit date and are shown in INR; exact raw minor-unit values remain in `src/lib/catalog/migrated-products.json`. Sale validity is not confirmed. Badge/discount values are not calculated or normalized during migration.

The source migration is available through the typed reader in
`src/lib/migration/migrated-content.ts`. It retains the full raw WordPress
content HTML and Store API response alongside normalized product, category,
image, video, review, price, variation, and missing-field records.

## Product record details

### Orange Face Pack – Johovo

- **ID / slug:** `2020` / `johovo-premium-orange-face-pack-brighten-and-nourish-your-skin`
- **Original URL:** <https://johovo.in/product/johovo-premium-orange-face-pack-brighten-and-nourish-your-skin/>
- **SKU:** not exposed in inspected public fields.
- **Category:** Makeup (source); face-care assignment is a product-type inference, not an approved taxonomy.
- **Prices:** regular ₹399; sale ₹200; price validity requires confirmation.
- **Size/variation:** no verified product size. Detail page includes 1/2/3 pack offers; their terms were not confirmed as product sizes.
- **Ingredients:** source says pure orange peels; no complete formula was found.
- **Benefits/claims:** source claims brightening, dark-spot/hyperpigmentation reduction, moisturising, exfoliation, and general quality/sustainability benefits. These require substantiation and client/regulatory review.
- **Usage:** source instructs mixing with water or rose water, applying to face/neck while avoiding eyes, leaving 15–20 minutes or until dry, rinsing with lukewarm water, patting dry, and regular use.
- **Safety, storage, expiry:** no product-specific information found.
- **Images:** `public/images/migrated/johovo/orange-face-pack/orange-face-pack-main.jpg` and `.../orange-face-pack-gallery.jpg`; no separate ingredient image or product video found.
- **Reviews:** none found; API reports 0.
- **Original short description:**

```text
JOHOVO Premium Orange Face Pack is a natural and effective solution for glowing skin. This face pack contains pure orange peels that help to brighten and nourish your skin, leaving it soft, smooth, and radiant.
```

- **Original full description (public product content):**

```text
JOHOVO Premium Orange Face Pack is a natural and effective solution for glowing skin. This face pack contains pure orange peels that help to brighten and nourish your skin, leaving it soft, smooth, and radiant.
Importance of Orange Face Pack
Orange face packs are known for their ability to:
Brighten and even out skin tone
Reduce dark spots and hyperpigmentation
Nourish and moisturize the skin
Exfoliate and remove dead skin cells
Benefits of JOHOVO Premium Orange Face Pack
Brightens skin: Pure orange peels help to brighten and even out skin tone.
Reduces dark spots: Orange peels have natural bleaching properties that help to reduce dark spots and hyperpigmentation.
Nourishes and moisturizes: Orange peels are rich in vitamin C and antioxidants that help to nourish and moisturize the skin.
Exfoliates and removes dead skin cells: The gentle abrasive nature of orange peels helps to exfoliate and remove dead skin cells.
Key Ingredients:
Pure Orange Peels: Rich in vitamin C and antioxidants, orange peels help to brighten and nourish the skin.
Unique Selling Points:
100% natural: Our face pack is made with 100% pure orange peels, making it a natural and effective solution for glowing skin.
No harsh chemicals: Our face pack is free from harsh chemicals, making it an excellent alternative to traditional skincare products.
How to Use Our Product?
Mix the face pack with water or rose water to form a paste.
Apply the paste to your face and neck, avoiding the eye area.
Leave the face pack on for 15-20 minutes, or until it dries.
Rinse off with lukewarm water and pat dry.
Use regularly for best results.
Why Buy From JOHOVO?
Quality guarantee: We’re committed to delivering high-quality products that meet your expectations.
Natural and effective: Our products are made with natural ingredients and are designed to be effective and safe for all skin types.
Sustainable practices: We’re dedicated to reducing our environmental footprint and promoting sustainable practices throughout our operations.
Customer satisfaction: We’re passionate about delivering exceptional customer experiences and ensuring that you’re completely satisfied with your purchase.
```

### Premium Rose Moisturizing Body Lotion – Johova

- **ID / slug:** `2990` / `premium-rose-moisturizing-body-lotion-johova`
- **Original URL:** <https://johovo.in/product/premium-rose-moisturizing-body-lotion-johova/>
- **SKU:** not exposed.
- **Brand/category:** title spelling “Johova” conflicts with JOHOVO; source category is Makeup. Body Care is only a likely type mapping.
- **Prices:** regular ₹500; sale ₹150; price validity requires confirmation.
- **Size/variation:** not specified.
- **Ingredients:** text mentions rose extracts, coconut oil, shea butter, olive oil, and hyaluronic acid. Tomato Pulp is also shown in an ingredient section with an image, but its association appears inconsistent; do not treat it as a verified ingredient.
- **Benefits/claims:** hydration, elasticity, soothing, fragrance, “100% natural”, no harsh chemicals, and suitability for all skin types are source claims requiring approval.
- **Usage:** source says apply after bathing/showering, massage until absorbed, and use regularly.
- **Safety/storage/expiry:** source displays `Kids Safe: uiuiuii` and `Expiry: kbk c c hc hc hc`; these are unusable placeholder/gibberish strings. No validated storage direction found.
- **Images:** `public/images/migrated/johovo/rose-body-lotion/rose-body-lotion-main.png`; ambiguous tomato illustration at `.../unverified-tomato-ingredient-lotion.avif`.
- **Reviews/videos:** none found.
- **Original short description:** no short description returned.
- **Original full description (public product content):**

```text
Rose moisturizing body lotions are known for their ability to:
● Hydrate and nourish the skin
● Improve skin elasticity and firmness
● Soothe and calm dry, irritated skin
● Leave a pleasant fragrance on the skin
Benefits of JOHOVO Premium Rose Moisturizing Body Lotion
● Long-lasting hydration: The body lotion provides long-lasting hydration to the skin, leaving it feeling soft, smooth, and supple.
● Improves skin elasticity: The rose extracts and natural ingredients in the body lotion help to improve skin elasticity and firmness.
● Soothes and calms: The rose extracts have a soothing and calming effect on the skin, reducing inflammation and irritation.
● Pleasant fragrance: The body lotion leaves a pleasant fragrance on the skin, making you feel fresh and confident.
Key Ingredients
● Rose Extracts: Rich in antioxidants and vitamins, rose extracts help to nourish and moisturize the skin.
● Natural Ingredients: The body lotion contains natural ingredients like coconut oil, shea butter, and olive oil that help to moisturize and nourish the skin.
● Hydrating Agents: The body lotion contains hydrating agents like hyaluronic acid that help to lock in moisture and provide long-lasting hydration.
Unique Selling Points
● 100% natural: Our body lotion is made with 100% natural ingredients, making it a safe and effective solution for hydrating and nourishing the skin.
● No harsh chemicals: Our body lotion is free from harsh chemicals, making it an excellent alternative to traditional body lotions.
● Suitable for all skin types: Our body lotion is gentle enough for all skin types, including sensitive skin.
How to Use Our Product?
● Apply the body lotion to your skin after bathing or showering.
● Massage the lotion into your skin until fully absorbed.
● Use regularly for best results.
Why Buy From JOHOVO?
● Quality guarantee: We’re committed to delivering high-quality products that meet your expectations.
● Natural and effective: Our products are made with natural ingredients and are designed to be effective and safe for all skin types.
● Sustainable practices: We’re dedicated to reducing our environmental footprint and promoting sustainable practices throughout our operations.
● Customer satisfaction: We’re passionate about delivering exceptional customer experiences and ensuring that you’re completely satisfied with your purchase.
```

### Premium Rose Body Wash – Johovo

- **ID / slug:** `2993` / `premium-rose-body-wash-johovo`
- **Original URL:** <https://johovo.in/product/premium-rose-body-wash-johovo/>
- **SKU:** not exposed. Source category Makeup. No verified size; Store API attribute is `new: hi`, not a usable size.
- **Prices:** regular and sale ₹499; validity requires confirmation.
- **Original short description:** `hiii`
- **Original full description:** `huh7890i09i9`
- **Ingredients:** page repeats Tomato Pulp text/image from the Lotion page; association is questionable and is not accepted as a verified formula.
- **Benefits, usage, safety, storage, expiry:** no usable product-specific information found.
- **Images:** `public/images/migrated/johovo/rose-body-wash/rose-body-wash-main.png`; ambiguous tomato illustration at `.../unverified-tomato-ingredient-body-wash.avif`.
- **Videos:** shared 2025-05-18 video and a 2025-05-30 video are embedded; see [asset-manifest.json](./asset-manifest.json).
- **Reviews:** none found.

### Premium Rose Body Scrub – Johovo

- **ID / slug:** `2995` / `premium-rose-body-scrub-johovo`
- **Original URL:** <https://johovo.in/product/premium-rose-body-scrub-johovo/>
- **SKU:** not exposed. Source category Trending (`tranding`); Body Care is only a likely type mapping.
- **Prices:** regular ₹1,000; sale ₹400; 60% sale badge observed, validity requires confirmation.
- **Size/variation:** Store API returns 240ml. The page also shows an unexplained trailing `100` and pack/bundle options; confirm the sellable unit.
- **Original short description:** `hi`
- **Full description:** empty in public product content.
- **Ingredients, benefits, usage, safety, storage, expiry:** no usable product-specific information found.
- **Images:** `public/images/migrated/johovo/rose-body-scrub/rose-body-scrub-main.png`.
- **Videos/reviews:** no usable product video or public reviews found; three duplicate-titled video-product posts expose no video source.

### JOHOVO™ IyalMooligai™ Herbal Hair Oil

- **ID / slug:** `4120` / `johovo-iyalmooligai-herbal-hair-oil`
- **Original URL:** <https://johovo.in/product/johovo-iyalmooligai-herbal-hair-oil/>
- **SKU/category/size:** `JHCHO101` (from the earlier public source audit), Hair Care → Hair Oil, 240ml.
- **Prices:** regular ₹840; sale ₹720; source badge says 14%, validity requires confirmation.
- **Original short description:**

```text
JOHOVO™ IyalMooligai™ Herbal Hair Oil is a carefully crafted blend of natural herbs and oils designed to nourish and protect your hair. Our unique formula promotes healthy hair growth, reduces dandruff and itchiness, and leaves your locks soft, shiny, and manageable.
```

- **Original full description:**

```text
JOHOVO™ IyalMooligai™ Herbal Hair Oil is a meticulously formulated blend of natural herbs and oils, carefully selected to provide comprehensive hair care. Our unique formula is deeply rooted in ancient Ayurvedic traditions, which emphasize the importance of natural ingredients and holistic approaches to health and beauty. This synergy of traditional wisdom and modern expertise creates a product that not only nourishes and strengthens your hair but also enhances its natural beauty.
The Power of Ayurveda
Ayurveda, the ancient Indian system of medicine, recognizes the importance of hair care as an integral part of overall well-being. Our hair oil is inspired by these timeless principles, combining the finest herbs and oils to create a product that promotes healthy hair growth, prevents hair fall, and improves the overall texture and appearance of your hair.
```

- **Ingredients shown in source illustrations/labels:** Bhringaraj, Rosemary, Amla, Neem, Coconut Oil, Henna, Ashwagandha, Hibiscus, Betel Vine, and Small Onion. Ten labels are named; the visible section was previously observed to have nine illustrations. This is not a verified formula.
- **Benefits/claims:** hair growth, reduced hair fall/dandruff/itchiness, hair strength, texture, and appearance. These are source claims, not established product facts; client/regulatory review required.
- **Usage, safety, storage, expiry:** no complete verified directions found.
- **Images:** six gallery images and ten source ingredient illustrations are under `public/images/migrated/iyalmooligai/herbal-hair-oil/`.
- **Videos:** 2025-05-18 video appears on this page and Body Wash. The hair-oil-named MP4 is attached to demo 3; its association is unverified.
- **Reviews:** 5 public comments; no numeric rating per review. Store API average is 0.

### JOHOVO™ IyalMooligai™ Herbal Face Pack Test

- **ID / slug:** `4142` / `johovo-iyalmooligai-herbal-face-pack`
- **Original URL:** <https://johovo.in/product/johovo-iyalmooligai-herbal-face-pack/>
- **SKU/category:** `JHFP201` (from the earlier public source audit), Face Care → Face Pack.
- **Name discrepancy:** source title includes `Test`; confirm the customer-facing name.
- **Prices:** regular ₹840; sale ₹720; source badge says 14%, validity requires confirmation.
- **Size discrepancy:** product page says `210mg`; gallery filenames include `210G`. Do not normalize the unit without client verification.
- **Original short description:**

```text
Nourish, rejuvenate, and protect your skin with JOHOVO™ IyalMooligai™ Herbal Face Pack, a natural blend of herbs and ingredients inspired by ancient Ayurvedic traditions. Suitable for all skin types, including sensitive skin, this face pack helps to achieve radiant, healthy-looking skin. Free from harsh chemicals, artificial fragrances, and dyes.
```

- **Original full description:**

```text
Unlock Your Natural Glow
Discover the power of nature with JOHOVO™ IyalMooligai™ Herbal Face Pack, a carefully crafted blend of natural herbs and ingredients that effectively elevates your daily skincare routine. The result of dedicated research and development, this face pack is designed to nourish, rejuvenate, and protect your skin, giving you a radiant and healthy glow.
Inspired by ancient Ayurvedic traditions, JOHOVO™ IyalMooligai™ Herbal Face Pack is free from harsh chemicals, artificial fragrances, and dyes, making it suitable for all skin types, including sensitive skin. Experience the best of nature’s goodness for your skin and unlock your natural beauty!
Benefits
– Deep Cleansing: JOHOVO™ IyalMooligai™ Herbal Face Pack helps to deep cleanse the skin, removing dirt, impurities, and excess oil.
– Nourishes and Moisturizes: The pack’s natural ingredients help to nourish and moisturize the skin, leaving it soft, smooth, and supple.
– Reduces Acne and Blemishes: The antibacterial and anti-inflammatory properties of the herbs help to control acne, reduce blemishes, and prevent future breakouts.
– Brightens Complexion: Regular use of the face pack helps to brighten the complexion, reduce dark spots, and promote even skin tone.
– Soothes and Calms: The pack’s soothing and calming properties help to reduce redness, inflammation, and irritation, leaving skin feeling cool and refreshed.
```

- **Ingredients:** no complete ingredient list found in public product text. Do not infer ingredients from the illustrations or claims.
- **Benefits/claims:** the source makes cleansing, acne/blemish reduction, brightening, and soothing claims; approval/substantiation required.
- **Usage:** no usable directions found.
- **Safety/storage/expiry:** page also displays patch-test, sensitive-skin, pregnancy/child use, storage away from sunlight at room temperature, and nine-month expiry statements; all require verification. Source includes a `hrbal` typo.
- **Images:** seven gallery files under `public/images/migrated/iyalmooligai/herbal-face-pack/`; no separate ingredient image identified.
- **Reviews:** 6 public comments; no numeric rating per review. Store API average is 0.

### Demo entries (exclude from verified catalogue)

- **demo 1**, ID 4082, <https://johovo.in/product/demo-1/>: public short/full source text is `demo`; source taxonomy Makeup. Images are reused Rose Body Wash/Scrub photos. Price template shows ₹500/₹150 and bundle options. No genuine product identity was established.
- **demo 3**, ID 4084, <https://johovo.in/product/demo-3/>: public short/full source text is `hhb`; source taxonomy Makeup. Images are reused Lotion/Scrub/Body Wash photos, with placeholder safety/usage text. Price template shows ₹499/₹150 and bundle options. Hair-Oil-named video is embedded on this page, but association is unverified.

## Shared migration notes

- Prices are historical observations from the public Store API; do not use them as current approved prices.
- Source taxonomy and product titles may be inaccurate. Product-type assignments above are not client-approved.
- Claims involving health, efficacy, safety, natural/chemical-free status, environmental practices, or suitability require client and regulatory review.
- Source comments are documented separately and are not cleared for republication.
- No record was inserted into the Next.js catalogue. Demo records remain excluded.
