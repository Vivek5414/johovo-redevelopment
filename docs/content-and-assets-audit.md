# Brand assets and product-content audit

**Updated:** 10 November 2026

## Workspace findings

- The current project is a Next.js App Router application with React and
  TypeScript.
- The JOHOVO logo is present in `public/images/johovo-logo.jpeg`.
- The client-provided IyalMooligai logo is stored at
  `public/images/iyalmooligai-logo.png`. It was supplied as a 1536 × 1024 JPEG
  and encoded as PNG without cropping, resizing, or visual redesign.
- A public-source inventory was captured from <https://johovo.in/> in
  `docs/johovo-live-website-audit.md`. It records six named product candidates,
  two demo entries, downloaded original media, and source URLs.
- Downloaded source images and videos are audit assets, not client approval to
  publish product content. Product claims, descriptions, ingredients, current
  prices, reviews, and uncertain media associations still require review.
- The typed product catalogue remains empty. No product should be published
  until its source data and claims are approved.
- Herbal Care browsing supports Hair Care, Skin Care, Lip Care, and Body Care.
  Category counts and product visibility are derived from approved, published
  product records; the current catalog contains none.

## Confirmed brand structure

- **JOHOVO** is the master company identity and the sole website/domain brand.
- **IyalMooligai** is the product identity for relevant herbal products within
  the unified JOHOVO website; it is not a separate website or company identity.
- Preserve both approved logo files exactly as provided. Do not redraw,
  recolor, crop, distort, or approximate either logo.
- Use the main JOHOVO palette (pink, yellow, cyan, green, purple) for the
  shared site shell. Use natural green, cream, and soft yellow accents for
  IyalMooligai product surfaces.

## Asset and content requirements

Before displaying a logo, place the client-provided original in the approved
brand asset directory and confirm its intended background/size use. The
shared logo component accepts an asset path and intrinsic dimensions; its
image styling preserves aspect ratio and applies no filters or recoloring.
The approved logos are stored locally; the IyalMooligai logo is used only in
the Herbal Care identity. Do not invent replacement artwork.

For each approved product, supply its name/category, description, ingredients,
benefits/claims, prices if to be displayed, promotional images/videos, and
marketplace/contact links. Attribute the product identity as JOHOVO or
IyalMooligai only after that assignment is approved. Publish none of these
fields from assumptions or placeholder data.
