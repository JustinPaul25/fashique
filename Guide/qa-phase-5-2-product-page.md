# QA checklist — Phase 5.2 (product page)

Use this when validating `templates/product.json`, `sections/product.liquid`, `assets/section-product.js`, and related snippets after changes or before release.

**Out of scope for 5.2:** sticky add-to-cart bar (Phase 6 / feature #27).

---

## Setup

- [x] Run `shopify theme check` — zero errors (warnings acceptable per team policy).
- [x] Preview product template in the theme editor with a **multi-variant** product (2+ options, e.g. color + size).
- [x] Preview with a **single-variant** product (no option UI).
- [x] Preview with **no product media** (placeholder still acceptable).
- [x] Preview with **multiple media** (images + optional video/model if your catalog has them).
- [ ] Test on a **password-protected** or **live** dev store with real inventory settings where possible.

---

## Theme editor & blocks

- [x] All expected blocks appear: breadcrumbs, title, price, variant picker, inventory, buy buttons, description, share, tiered pricing, combined listing, complementary, and **App** block slot for reviews.
- [x] Blocks can be **reordered**; order matches on the storefront after save.
- [x] Section settings: **color scheme**, **section spacing**, **update URL when variant changes**, **low stock threshold**, **color swatches on variant picker** each have a visible effect when toggled.
- [x] **Variant picker** block: switch between **buttons** and **dropdown**; both update selection, price, and cart line variant.
- [x] **Breadcrumbs** block: show/hide toggle works.
- [x] **Title** block: vendor show/hide works.
- [x] **Inventory** block: “in stock” message and SKU show/hide behave as expected.
- [x] **Description** block: collapsible on/off works when description is long enough to matter.
- [x] **Complementary** block: heading, product count (2–10), and intent (**complementary** vs **related**) save and reflect in the section heading / loaded products.

---

## Media gallery

- [x] **Desktop (wide viewport):** main image + thumbnail strip; clicking a thumb changes the main view and active state.
- [x] **Mobile/narrow:** Splide carousel appears when there is **more than one** medium; pagination/arrows usable; first slide uses eager loading where appropriate.
- [x] **Single image:** no carousel; image visible on all breakpoints (no empty gallery).
- [x] Variant change updates featured media when the variant has a **different featured media** (if applicable).
- [x] **Video / external video / 3D model** (if present): playable or viewable without breaking layout.

---

## Product info & merchandising

- [x] Title and optional vendor render and escape/sanitize correctly (no broken HTML from plain text).
- [x] **Price** uses `snippets/price.liquid`; sale + compare-at displays correctly; **sold out** state shows unavailable pricing copy.
- [x] Variant changes **update price** without full page reload (JS).
- [x] **Color swatches** (when enabled and option is color/colour): image or color swatch renders; unavailable combinations respect disabled state where Liquid provides it.
- [x] **Combined listing** (`snippets/combined-listing.liquid`): only shows when metafield `custom.combined_listing` has product references; current product is indicated; siblings link to correct URLs.

---

## Variants, URL, quantity, cart

- [x] **Hidden variant id** in the product form matches the selected variant after option changes.
- [x] With **“Update URL when variant changes”** enabled, `?variant=` updates (and deep-linking with `?variant=` loads the correct selection on first paint).
- [x] **Quantity** input respects **quantity rules** (min, max, step) when Shopify exposes them; changing quantity updates **tiered pricing** active row if the tier table is present.
- [x] **Add to cart** adds the correct variant and quantity; **dynamic checkout** / wallet buttons still render where Shopify provides them.
- [x] **Sold out / unavailable** variant: primary CTA disabled or shows sold-out copy appropriately.

---

## Inventory & SKU (feature #19)

- [x] With **Shopify-tracked inventory**, low stock message appears when quantity is **at or below** the section threshold (and copy uses the translated template).
- [x] Optional **in stock** message shows only when that block setting is on and conditions match.
- [x] **SKU** updates when the variant changes (if SKU is shown).

---

## Description & share

- [ ] **Description** rich text renders; **Read more / Show less** toggles expansion and `aria-expanded` when collapsible is enabled.
- [ ] **Social share** opens/links correctly (Facebook, X, Pinterest) and **copy link** works (including brief “copied” feedback).

---

## Tiered pricing (feature #13)

- [x] Table appears only when metafield **`custom.quantity_tiers`** has a usable value: a JSON **array** of `{ min, max?, price }` (`price` in **cents**).
- [x] Changing **quantity** highlights the matching tier row and updates the live region / helper text if present.

### Admin: defining `custom.quantity_tiers`

Shopify does **not** offer “List of JSON” as a metafield type. Use a **single JSON** metafield:

1. **Settings → Custom data → Products → Add definition** (or edit existing).
2. Namespace/key: **`custom.quantity_tiers`** (or match what the theme expects).
3. Turn **List** **off**.
4. Type: **JSON** (search “JSON” without the List toggle).
5. On each product, paste a value like:

```json
[
  { "min": 1, "max": 4, "price": 1000 },
  { "min": 5, "max": 9, "price": 800 },
  { "min": 10, "price": 600 }
]
```

(`price` is **cents** per unit for that tier; omit `max` on the last row for “10+”.)

---

## Complementary / related products

- [x] Section loads recommendations when scrolled into view (IntersectionObserver); loading state does not flash forever on failure.
- [x] Cards link to product URLs; image and price look reasonable for returned JSON (cents formatting).
- [x] Empty or API failure: block does not leave a broken gap (section hides or stays minimal).

---

## App block (reviews placeholder)

- [x] An app that provides a **product reviews** block can be placed in the section and renders without Liquid errors.

---

## Accessibility & keyboard

- [x] **Focus visible** on variant buttons, quantity, ATC, thumbs, Splide controls, description toggle, share buttons.
- [x] Variant **buttons** reflect `aria-pressed` / selection state logically.
- [x] **Breadcrumbs** nav has a sensible `aria-label` (from translations).
- [x] **Reduced motion:** Splide still usable when OS “reduce motion” is on (per theme’s Splide init).

---

## Localization

- [x] No hardcoded customer-facing strings on the product section that should use `{{ '…' | t }}` (spot-check against `locales/en.default.json`).
- [x] Quick pass with a **second locale** (if enabled): product page strings and price formatting look correct.

---

## Regression smoke

- [x] No console errors on product page load (aside from known third-party scripts).
- [x] `snippets/price.liquid`, `breadcrumbs.liquid`, `social-share.liquid`, `image.liquid`, `combined-listing.liquid`, `testimonial-card.liquid` unchanged callers still work if you touched shared snippets.

---

## Sign-off

| Date | Tester | Store / theme | Browsers / devices | Pass / fail | Notes |
|------|--------|---------------|--------------------|---------------|-------|
|      |        |               |                    |               |       |
