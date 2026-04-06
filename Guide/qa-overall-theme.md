# QA checklist — Overall theme

Master checklist for a full Fashique theme review. Run this before any major release, a Theme Store submission, or after touching cross-cutting files (`layout/theme.liquid`, `config/settings_schema.json`, shared snippets, `assets/critical.css`, etc.).

**Depth checklists for individual templates:**
- [Product page](./qa-phase-5-2-product-page.md)
- [Collection page](./qa-phase-5-3-collection-page.md)
- [Cart page](./qa-phase-5-4-cart-page.md)
- [Search page](./qa-phase-5-5-search-page.md)
- [Article page](./qa-phase-5-6-article-page.md)

---

## 1. Pre-flight

- [x] `shopify theme check` — zero **errors**; no unexpected new warnings.
- [x] All JSON template files are valid (no stray commas, correct schema references).
- [x] `node scripts/check-settings-schema-locale-keys.mjs` — no missing locale keys.
- [ ] Dev store is on `shopify theme dev` with live reload confirmed before starting checks.
- [ ] Confirm the store has demo content: products with variants, a multi-image product, a sold-out product, at least one blog post, a contact page, and populated collections.

---

## 2. Design system

### 2.1 CSS variables & color schemes

- [ ] Open each of the **4 color scheme classes** (Light, Dark, Muted, Accent) in the theme editor — confirm the correct foreground, background, and accent colors render on a section using that scheme.
- [ ] Switching color scheme on a section does not leave leftover inline styles from the previous scheme.
- [ ] `--color-primary` hover state is visually distinct (buttons, links) across all 4 schemes.
- [ ] Dark scheme: text remains readable (contrast ≥ 4.5:1 for body copy, ≥ 3:1 for large text).

### 2.2 Typography

- [ ] All 3 font pair presets render correctly (no FOUT, no missing glyphs for Latin characters).
- [ ] Heading scale h1–h6 is visually coherent at 375 px, 768 px, and 1440 px viewports.
- [ ] Body copy line-height and measure are comfortable to read on mobile and desktop.
- [ ] No Google Fonts CDN calls in the network panel (fonts loaded via Shopify asset system only).

### 2.3 Spacing scale

- [ ] Switch `Spacing scale` in theme settings between **Compact**, **Balanced**, and **Spacious** — verify section padding changes visibly without breaking layouts.
- [ ] No sections overflow their container or collide with adjacent sections in any spacing mode.

### 2.4 Buttons

- [ ] Solid and outline variants both render in `assets/buttons.css` across all color schemes.
- [ ] Hover, focus, active, and disabled states are visually distinct for each button variant.
- [ ] All buttons (add-to-cart, checkout, load more, submit) meet minimum **48×48 px** touch target on mobile.

---

## 3. Layout — header

- [ ] Logo renders as image when set; falls back gracefully to store name text.
- [ ] Logo max-width setting changes the rendered size without distortion.
- [ ] **Sticky header — always-sticky mode:** header stays fixed on all templates.
- [ ] **Sticky header — scroll-up-only mode:** header hides on scroll-down and reappears on scroll-up.
- [ ] Compact/mini header activates on scroll and reverts on scroll back to top.
- [ ] Cart icon badge count shows correct item count; updates without full page reload when drawer is used.
- [ ] Account icon: logged-out state shows Login / Register; logged-in state shows name + Logout.
- [ ] Search icon opens the search drawer; drawer closes on `Escape` and outside click.
- [ ] Language selector (if multi-language enabled) renders and switches storefront locale.

### 3.1 Mega menu

- [ ] Full-width dropdown opens and positions correctly under its trigger without overflowing the viewport.
- [ ] Multi-column layout and optional promo block (image + CTA) render without layout shift.
- [ ] In-menu promo image and link work as configured.
- [ ] Keyboard: `Tab` opens dropdown, arrow keys navigate, `Escape` closes; `aria-expanded` updates correctly.
- [ ] Clicking outside or mousing off closes the panel.
- [ ] Mobile: mega menu collapses to an accordion inside the hamburger drawer; all levels accessible by tap/keyboard.

### 3.2 Mobile navigation

- [ ] Hamburger icon opens the slide-out drawer.
- [ ] Drawer closes via close button, backdrop tap, and `Escape`.
- [ ] All navigation levels are accessible with no items cut off.
- [ ] Back-navigation within the drawer returns to the parent level correctly.

### 3.3 Announcement bar

- [ ] Single message and multi-message carousel both render without JS errors.
- [ ] Dismiss button hides the bar and sets `sessionStorage` — bar stays hidden on page refresh until session ends.
- [ ] Bar color, text, and link settings take effect in the editor.

---

## 4. Layout — footer

- [ ] All link columns render the correct menu items and links.
- [ ] Newsletter signup form submits without console errors; success/error state shows.
- [ ] Social icons link to the correct networks; icons are recognisable and render from `/assets/`.
- [ ] Payment icons appear when the setting is enabled and are not stretched.
- [ ] Language/currency selectors in the footer function independently of header selectors.
- [ ] Copyright text uses a translation key and is not hardcoded.

---

## 5. Global components

### 5.1 Back-to-top button

- [ ] Button appears after scrolling past the configured threshold (default 400 px).
- [ ] Click smoothly scrolls to the top of the page.
- [ ] Toggle in theme settings shows/hides the button across all pages.
- [ ] `aria-label` is present and correct.

### 5.2 Age verifier

- [ ] Full-screen overlay renders on first visit when the feature is enabled.
- [ ] `localStorage` key `age-verified` is set after confirming; overlay does not reappear on subsequent pages in the same browser.
- [ ] Decline button redirects to the configured URL.
- [ ] Overlay does not appear in the theme editor preview (non-disruptive to merchants).
- [ ] `Escape` key does not bypass the overlay.

### 5.3 Breadcrumbs

- [ ] Correct hierarchy on: home → collection → product, home → blog → article, home → page.
- [ ] Current page item is not a link; has `aria-current="page"`.
- [ ] `BreadcrumbList` JSON-LD is present in the page source when breadcrumbs render.
- [ ] Visibility can be toggled per template via its block setting.

### 5.4 Product card

- [ ] Image lazy-loads on all grid pages; no CLS jump.
- [ ] Sale badge and compare-at price show only when a sale price exists.
- [ ] Color swatches render under the card title; hovering/tapping a swatch updates the card image.
- [ ] Quick view button is visible on hover/focus (desktop) and always visible (mobile).
- [ ] Card links are correct and open the right product URL.

### 5.5 Price snippet

- [ ] Regular price: single price renders correctly.
- [ ] Sale price: sale price + compare-at price with `<s>` tag renders.
- [ ] Price range: shows `From X` for products with differing variant prices.
- [ ] Sold-out state: unavailable copy renders; no price shown when `available == false`.
- [ ] All prices use money filter; no raw cent values visible.

---

## 6. Template coverage

Confirm each template loads without errors, renders demo content, and is editable in the theme editor.

| Template | File | Check |
|---|---|---|
| Home | `templates/index.json` | [ ] |
| Product | `templates/product.json` | [ ] |
| Collection | `templates/collection.json` | [ ] |
| Cart | `templates/cart.json` | [ ] |
| Search | `templates/search.json` | [ ] |
| Article | `templates/article.json` | [ ] |
| Blog | `templates/blog.json` | [ ] |
| Page | `templates/page.json` | [ ] |
| Contact | `templates/page.contact.json` | [ ] |
| List collections | `templates/list-collections.json` | [ ] |
| 404 | `templates/404.json` | [ ] |
| Password | `templates/password.json` | [ ] |
| Gift card | `templates/gift_card.liquid` | [ ] |

For **product**, **collection**, **cart**, **search**, and **article** — complete the corresponding depth checklists linked at the top of this document.

---

## 7. Homepage sections

- [ ] **Slideshow / Hero:** autoplay, navigation arrows, text overlay, and CTA all work; `prefers-reduced-motion` disables autoplay.
- [ ] **Featured collection:** grid and carousel modes both render; "View all" link goes to the correct collection.
- [ ] **Featured product:** single product renders with variant selector and add-to-cart.
- [ ] **Image banner:** full-bleed layout on all viewports; CTA button works.
- [ ] **Multicolumn:** 2, 3, and 4 column configurations are tested; icon and image variants render.
- [ ] **Testimonials:** grid and carousel modes; star ratings render correctly; no broken layout with 1 or 2 testimonials.
- [ ] **UGC photo grid:** image grid renders; lightbox opens and closes on click/tap.
- [ ] **Countdown timer:** digits decrement in real time; expired message shows after the end date.
- [ ] **Before/After slider:** draggable divider moves; labels display; keyboard arrow keys work; RTL inverts horizontal drag.
- [ ] **Rich text:** all heading and text alignment options render correctly.
- [ ] **FAQ:** accordion opens/closes one item at a time; keyboard usable; no scrolljank.
- [ ] **Logo list:** logos render at consistent height; no broken images.
- [ ] **Video:** Shopify-hosted video plays; YouTube/Vimeo embed loads without console errors.
- [ ] **Email signup:** form submits; success/error copy visible; Klaviyo/Shopify email form types accepted.
- [ ] All homepage sections have a **color scheme** selector and a **section spacing** setting that visibly affect the output.
- [ ] No section breaks layout when all its blocks are removed.

---

## 8. Conversion features

### 8.1 Sticky add-to-cart bar

- [ ] Bar is hidden when the main ATC button is visible in the viewport.
- [ ] Bar appears when the user scrolls past the main ATC button.
- [ ] Bar disappears again when the user scrolls back up to the main form.
- [ ] Product title, selected variant, and price in the bar update when the variant changes.
- [ ] Clicking the bar ATC adds the correct variant.
- [ ] Setting to enable/disable sticky ATC works without page reload (editor live preview).

### 8.2 Quick view

- [ ] Quick view dialog opens from product card button on collection, featured-collection, and search results pages.
- [ ] Dialog contains images, variant selector, price, and add-to-cart; all functional.
- [ ] `Escape` closes dialog; focus returns to the triggering button.
- [ ] Tab focus is trapped inside the dialog while open.
- [ ] `aria-modal="true"` and `role="dialog"` are present on the `<dialog>` element.
- [ ] Setting to disable quick view hides the trigger button and does not load `component-quick-view.js`.

### 8.3 Cart drawer & upsell

- [ ] Cart drawer opens from header icon and after adding a product (when enabled).
- [ ] Upsell row renders product recommendations; cards are correct size and not broken at narrow widths.
- [ ] Post-ATC modal appears after adding a product (when drawer + post-add-modal setting enabled).
- [ ] Post-ATC modal has correct product title, image, and "View cart" / "Continue shopping" CTAs.

### 8.4 Quick order list

- [ ] Table renders product image, name, variant selectors, price, and quantity input per row.
- [ ] "Add all to cart" submits only rows with quantity > 0.
- [ ] Validation prevents submission when all quantities are zero.
- [ ] Cart badge count updates after a successful multi-add.

---

## 9. Collection & discovery features

### 9.1 Infinite scroll

- [ ] New products load automatically as the sentinel element enters the viewport.
- [ ] Loading spinner appears and disappears correctly.
- [ ] When all products are loaded, the sentinel is removed; no error loop.
- [ ] With JS disabled: "Load more" button (`snippets/pagination.liquid`) renders and loads the next page.
- [ ] Toggle between **infinite scroll** and **pagination** in section settings works without refreshing the editor.

### 9.2 Storefront filtering

- [ ] Filter sidebar/drawer renders all active filters for the collection.
- [ ] Selecting a filter updates the URL and re-renders the product grid without full page reload.
- [ ] Removing a single active filter chip updates the results.
- [ ] "Clear all" removes all active filters.
- [ ] Sort-by dropdown changes product order correctly.
- [ ] Filter drawer closes via close button, backdrop, and `Escape` on mobile.

### 9.3 Swatch filters

- [ ] Color/material filter options render as swatch buttons (not plain checkboxes) in the sidebar.
- [ ] Swatch appearance matches the color swatches on product cards.
- [ ] Active swatch filter is visually indicated (border/check).

### 9.4 Color swatches

- [ ] Swatches on product cards: tapping/hovering a swatch updates the card image and selected variant.
- [ ] Swatches on the product page: selecting a swatch updates the gallery, price, and variant id in the form.
- [ ] Sold-out swatch combinations are visually marked (diagonal line or reduced opacity).
- [ ] Tooltip with the variant name appears on swatch hover (desktop).

---

## 10. Advanced features

### 10.1 Combined listing (feature #7)

- [ ] Sibling product switcher renders only when the `custom.combined_listing` metafield is populated.
- [ ] Clicking a sibling navigates to (or AJAX-loads) the correct product.
- [ ] Current product is indicated as active in the switcher.

### 10.2 Tiered pricing (feature #13)

- [ ] Pricing table renders only when the `custom.quantity_tiers` metafield is a valid JSON array.
- [ ] Changing quantity in the product page highlights the correct tier row.
- [ ] No JS error when the metafield is absent or malformed.

### 10.3 Stock counter (feature #19)

- [ ] Low-stock message appears when inventory is at or below the configured threshold.
- [ ] "In stock" message shows only when that block setting is on.
- [ ] SKU updates on variant change when the SKU block is visible.

### 10.4 RTL support (feature #16)

- [ ] Enable an RTL storefront locale (Arabic or Hebrew) and confirm `dir="rtl"` is on `<html>`.
- [ ] Header logo is on the correct side; navigation order makes sense in RTL.
- [ ] Splide carousels run right-to-left.
- [ ] Before/After horizontal drag is correctly inverted; vertical slider unchanged.
- [ ] Filter sidebar/drawer, cart drawer, and mega menu layout in RTL.
- [ ] No text is visually cut off or overflowing due to non-logical CSS properties.

### 10.5 Sign in with Shop (feature #17)

- [ ] Login button rendered by `{{ form | login_button }}` appears on the customer login template.
- [ ] No custom colors, fonts, or dimensions override Shopify's branded styling.

---

## 11. Theme settings & presets

- [ ] All settings categories appear in the theme editor in the correct order (Branding → Advanced).
- [ ] Each setting has a visible effect on the storefront — no orphaned settings with no output.
- [ ] All `range` inputs have `min`, `max`, and `step` — no free-form inputs where finite options exist.
- [ ] All `info` fields are under 12 words and jargon-free.
- [ ] Switch between the **4 theme presets** (Fashion Brand, Beauty Store, Minimal, Bold Promo) — each produces a visually coherent and distinct result.
- [ ] Switching presets does not break the homepage section order.
- [ ] `settings_data.json` default state is demo-ready: populated sections, plausible copy, no placeholder errors visible on first install.

---

## 12. Localization

- [ ] Every user-facing string uses `{{ 'key' | t }}` — zero hardcoded UI text (spot-check buttons, labels, error messages, ARIA labels).
- [ ] `en.default.json` contains all keys used in Liquid files (run `node scripts/check-settings-schema-locale-keys.mjs`).
- [ ] French (FR), German (DE), Spanish (ES), and Italian (IT) storefront strings are human-translated (not English mirrors).
- [ ] Switching the storefront to FR/DE/ES/IT shows translated strings with no `translation missing:` errors.
- [ ] All `*.schema.json` files share the same key structure as `en.default.schema.json`.
- [ ] Language selector in the header and footer allows switching locale without navigating away.
- [ ] Currency selector works when the store has multiple currencies enabled.

---

## 13. Performance

### 13.1 Lighthouse (mobile, incognito, throttled 4G)

Run against: **home page**, a **product page**, and a **collection page**.

| Page | Performance | Accessibility | CLS | LCP | Pass? |
|------|-------------|---------------|-----|-----|-------|
| Home | ≥ 70 | ≥ 90 | < 0.1 | < 2.5 s | [ ] |
| Product | ≥ 70 | ≥ 90 | < 0.1 | < 2.5 s | [ ] |
| Collection | ≥ 70 | ≥ 90 | < 0.1 | < 2.5 s | [ ] |

### 13.2 Images

- [ ] Hero images use `loading="eager"` and `fetchpriority="high"` via `snippets/image.liquid`.
- [ ] All below-fold images use `loading="lazy"`.
- [ ] Every `<img>` has explicit `width` and `height` attributes to prevent CLS.
- [ ] No image renders at full original resolution — `image_url: width:` is always scoped.
- [ ] No Google Images or external CDN image URLs (all hosted in Shopify).

### 13.3 JavaScript

- [ ] No render-blocking scripts in `<head>` — all non-critical JS uses `defer` or `type="module"`.
- [ ] Splide JS loads **only** on pages/sections where a slider is present.
- [ ] Quick View JS (`component-quick-view.js`) loads on first user interaction, not on page load.
- [ ] Age Verifier JS is skipped when the visitor has already passed (`age-verifier-passed` on `<html>`).
- [ ] No `console.error` or unhandled `Promise` rejections on any page.

### 13.4 CSS

- [ ] `snippets/critical-css.liquid` (mirroring `assets/critical.css`) is the only inline CSS in `<head>`.
- [ ] Global non-critical CSS (`color-schemes`, `typography`, `spacing`, `buttons`) is loaded with `media="print" onload` deferred pattern + `<noscript>` fallback.
- [ ] No extra render-blocking `<link rel="stylesheet">` in `<head>`.

### 13.5 Reduced motion

- [ ] Splide autoplay stops when OS `prefers-reduced-motion: reduce` is active.
- [ ] Mega menu entrance animation is suppressed.
- [ ] Countdown timer transitions are suppressed (digits still update).
- [ ] No other animation or transition persists under reduced-motion.

---

## 14. Accessibility

### 14.1 Keyboard navigation

- [ ] Tab through the entire home page — no focus traps outside of intended modals/dialogs.
- [ ] Skip-to-content link (`#main-content`) is the first focusable element and works correctly.
- [ ] Header icons (search, cart, account, hamburger) are keyboard-operable.
- [ ] Mega menu opens and closes entirely via keyboard; focus does not escape behind the panel while open.
- [ ] Quick View dialog traps focus; `Escape` closes and returns focus to the trigger.
- [ ] Cart drawer traps focus; `Escape` closes and returns focus to the trigger.
- [ ] Before/After divider moves with arrow keys.
- [ ] All interactive controls have a visible `:focus-visible` outline.

### 14.2 ARIA & semantic HTML

- [ ] `<main id="main-content">` is present on every page.
- [ ] `<header>`, `<nav>`, `<footer>`, `<aside>` (filter sidebar), `<article>` used semantically.
- [ ] All icon-only buttons/links have an `aria-label`.
- [ ] `aria-expanded` updates on: mega menu triggers, hamburger button, accordion FAQ items, filter drawer trigger, collapsible product description.
- [ ] `role="dialog"` / `aria-modal` present on Quick View, post-add modal, and age verifier overlay.
- [ ] Splide carousels have `accessibility: true` in `splide-init.js`.

### 14.3 Screen reader smoke test

- [ ] Navigate the home page with VoiceOver (macOS) or NVDA (Windows) — no confusing announcements or missing labels on primary controls.
- [ ] Add a product to cart from the product page — cart count change is announced.
- [ ] Open and close Quick View dialog — focus movement and dialog role are announced correctly.

### 14.4 Color contrast

- [ ] Body text on each of the 4 color schemes passes WCAG AA (≥ 4.5:1 for small text, ≥ 3:1 for large text).
- [ ] Placeholder text in form inputs has ≥ 3:1 contrast.
- [ ] Button text against button background color passes WCAG AA.

### 14.5 Touch targets

- [ ] All buttons and links are at least **48×48 px** on mobile viewports (375 px wide).
- [ ] Swatch buttons are large enough to tap without inadvertently activating an adjacent swatch.
- [ ] Stepper +/− buttons in the cart and product page meet minimum touch target size.

---

## 15. Cross-browser & cross-device

Test each page type listed in §6 at a minimum on the following:

| Browser / device | Tested? |
|---|---|
| Chrome (latest, desktop) | [ ] |
| Safari (latest, macOS) | [ ] |
| Firefox (latest, desktop) | [ ] |
| Edge (latest, desktop) | [ ] |
| Safari (iOS 16+, real device or accurate emulation) | [ ] |
| Chrome (Android, real device or accurate emulation) | [ ] |

- [ ] No CSS grid or flexbox layout breaks in any listed browser.
- [ ] Splide carousels function on touch devices (swipe gestures work).
- [ ] `<dialog>` polyfill is not required — native dialog support is confirmed in targeted browsers.
- [ ] Hover effects degrade gracefully on touch-only devices (no stuck hover states).

---

## 16. Structured data & SEO

- [ ] `{{ product | structured_data }}` present in the `<head>` on product pages.
- [ ] `{{ article | structured_data }}` present on article pages.
- [ ] `WebSite` (with `SearchAction`) and `Organization` JSON-LD present on the home page.
- [ ] `BreadcrumbList` JSON-LD renders when breadcrumbs snippet is active.
- [ ] Validate structured data with [Google Rich Results Test](https://search.google.com/test/rich-results) for product and article pages.
- [ ] `canonical_url` and `page_title` / `page_description` outputs are correct on all templates.
- [ ] `<meta name="robots">` is absent (not blocking indexing) — Shopify controls this via the admin.

---

## 17. Theme Store readiness

- [ ] All **13 required templates** are present, render without errors, and are editable.
- [ ] All **20 features** from the feature list are implemented, editor-configurable, and can be toggled on/off cleanly.
- [ ] No references to **Dawn**, **Horizon**, or other existing theme names in code, comments, or settings.
- [ ] No CDN dependencies — all third-party assets (Splide) are in `/assets/`.
- [ ] No `console.error` calls remain in production JS.
- [ ] `README.md` reflects current setup instructions and feature list.
- [ ] `settings_data.json` is demo-ready; a new install immediately presents a polished storefront.
- [ ] `locales/en.default.json` and all `*.schema.json` files have no missing keys relative to the live Liquid.
- [ ] FR/DE/ES/IT storefront translations are full human-quality translations (not English mirrors).
- [ ] Theme runs cleanly on `shopify theme dev` with no Liquid render errors in the terminal.

---

## 18. Final sign-off

| Date | Tester | Store / theme version | Browsers / devices covered | Overall result | Notes |
|------|--------|-----------------------|----------------------------|----------------|-------|
|      |        |                       |                            |                |       |
