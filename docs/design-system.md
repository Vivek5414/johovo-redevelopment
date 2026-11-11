# JOHOVO frontend design system

This design system is used by the unified JOHOVO website. Product information
and imagery remain limited to client-approved content.

## Brand architecture and logo handling

- JOHOVO is the master company and website identity.
- IyalMooligai is a sub-brand, shown only in relevant approved herbal-product
  contexts.
- Use the original client-provided logos unchanged. Preserve intrinsic aspect
  ratio and avoid recoloring, filters, clipping, masks, or decorative edits.
- The original JOHOVO logo is stored at `public/images/johovo-logo.jpeg` and
  is rendered without image optimization or transformations. Its source file
  has not been edited.
- The client-provided IyalMooligai logo is stored at
  `public/images/iyalmooligai-logo.png` (1536 × 1024). The shared herbal
  signature renders it at its intrinsic proportions only in IyalMooligai
  product contexts; it does not replace the JOHOVO site logo.
- Herbal Care uses a reusable, restrained botanical ornament around the
  existing IyalMooligai rendering. It does not redraw or alter either logo.
  The motif uses global herbal green, gold, warm cream, and subtle blush
  tokens and is shared by the Herbal Care banner and IyalMooligai product
  signatures.
- JOHOVO accent colors are pink, yellow, cyan, green, and purple. Use these
  selectively for focus, small rules, badges, and minor highlights rather than
  large competing fields.
- The global CSS values were sampled from the supplied JOHOVO logo:
  - Pink: `#FC2874`
  - Yellow: `#FDB700`
  - Cyan: `#04CFE0`
  - Green: `#17CC1B`
  - Purple: `#D054F2`
- Herbal product surfaces use forest green, natural green, cream, and soft
  yellow. The shared site frame remains JOHOVO.

## Tokens and type

Global tokens live in `src/app/globals.css`. Prefer semantic tokens for
surfaces, text, borders, focus states, typography, spacing, radii, shadows,
containers, and motion. Do not copy raw brand color values into CSS Modules.
The existing shorter color aliases remain available for established styles.

- Use the display serif for a small number of editorial headings and the
  system sans-serif stack for navigation, product data, forms, and body copy.
- Keep body copy comfortable to read with the defined body line-height.
- Use the type scale and responsive `clamp()` tokens instead of arbitrary
  component-specific font sizes.
- Use the 4px-based spacing scale; use the section-spacing token for major
  vertical rhythm.
- Prefer square or subtly rounded corners, restrained borders, and light
  shadows. Avoid pill-shaped cards, excessive shadows, or gradients.

## Components and layout

Reusable foundations are in `src/components/layout/` and
`src/components/ui/`:

- `PageContainer` constrains content to the shared page width or reading
  measure with responsive gutters.
- `ContentSection` provides consistent vertical rhythm and default, neutral,
  or herbal surface tones.
- `Button` supports primary, secondary, and quiet actions with compact and
  regular sizes.
- `Card` supports a flat or lightly raised surface.
- `Badge` offers neutral, JOHOVO-accent, and herbal identity treatments.
- `TextField` associates labels, hints, and errors with an input accessibly.
- `SiteHeader` and `SiteFooter` provide responsive shared site framing and
  navigation. Add links only when the corresponding destinations exist.
- The home page assembles hero, company identity, planned collections,
  catalogue, herbal identity, product-information, video, and contact
  sections. Product-dependent sections remain honest empty states until
  approved content and assets are available.
- The header includes desktop links and a native responsive mobile disclosure,
  plus a Shop Now link to the catalogue. The footer includes navigation,
  collection anchors, and policy links; policy/contact copy remains pending
  client approval.
- Reusable product cards require a product identity and approved image
  metadata. The homepage contains no product records until approved data is
  provided.
- The Herbal Care collection page and herbal card styling are ready to display
  approved product content. No product-detail route is assigned to Herbal
  Care until approved product records identify it; other collections remain
  visually separate.
- Products, product details, contact, privacy, and terms routes currently use
  honest empty/pending states. Replace these only with approved catalog,
  contact, and legal content.

Use semantic HTML and heading order, visible focus, sufficient contrast, and
reduced-motion support. Keep the primary action visually clear; avoid styling
every link as a button. Product cards should prioritize approved imagery,
product name, and essential product facts without ornamental clutter.

## Responsive behavior

- Mobile: single-column content, comfortable 20px minimum page gutters,
  practical touch targets, and wrapping navigation.
- Tablet: use two-column content only when each column remains readable; reduce
  section spacing before reducing type size.
- Desktop: constrain long text and page content to the shared container width;
  use grids only when real content supports the layout.
- CSS Modules own component-specific responsive rules. Keep global CSS for
  tokens, resets, focus, and accessibility preferences.

## Header and footer guidance

- Keep the header calm and compact, with the original JOHOVO logo/name as the
  primary brand anchor and only verified navigation destinations.
- Keep the footer minimal: brand identity and a small set of useful links.
- Maintain clear separation from page content using neutral surfaces and a
  fine border; do not introduce a second large brand mark or decorative
  gradient.

## Scope guardrails

- Do not add products, testimonials, product claims, or product imagery
  without client approval.
- Do not alter business logic, admin behavior, Supabase migrations, tables, or
  storage policies as part of design-system work.
