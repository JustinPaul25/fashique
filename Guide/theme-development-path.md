# Fashique — Theme Development Path

A phased, step-by-step build plan derived from the [Theme Build Prompt](./shopify-theme-build-prompt.md).
Work through each phase in order. Complete every checklist item before moving to the next phase.

---

## Overview

| Phase | Name | Focus |
|---|---|---|
| 1 | Foundation | Project setup, architecture, asset pipeline |
| 2 | Design System | CSS variables, color schemes, typography |
| 3 | Core Layout | Header, footer, navigation, mega menu |
| 4 | Global Components | Snippets and reusable UI primitives |
| 5 | Templates & Sections | All required page templates and their sections |
| 6 | Conversion Features | Sticky ATC, quick view, upsell, quick order list |
| 7 | Collection Features | Filters, infinite scroll, swatch filters |
| 8 | Advanced Features | Remaining 20-feature checklist |
| 9 | Theme Settings | settings_schema.json, presets, smart defaults |
| 10 | Localization | Locale pack (storefront + schema pairs, FR/DE/ES/IT translated) |
| 11 | Performance | Lighthouse, CLS, lazy loading, deferred JS |
| 12 | Accessibility | ARIA, keyboard nav, RTL, touch targets |
| 13 | QA & Polish | Cross-browser, editor UX, final review |

---

## Phase 1 — Foundation

### 1.1 Project Initialization
- [x] Confirm `shopify theme init` skeleton is the base (already scaffolded)
- [x] Verify the folder structure matches OS 2.0: `templates/`, `sections/`, `blocks/`, `snippets/`, `assets/`, `locales/`, `config/`, `layout/`
- [x] Add `.theme-check.yml` and confirm Theme Check is configured (already present)
- [x] Add `.shopifyignore` rules for the `Guide/` folder and any non-theme files
- [x] Set up `shopify theme dev` with your development store to verify live reload works

### 1.2 Splide Integration
- [x] Download the pinned Splide release (`splide@4.1.4`)
- [x] Save `splide.min.js` and `splide.min.css` to `/assets/`
- [x] Do **not** reference CDN URLs anywhere in the theme
- [x] Create `/assets/splide-init.js` — a scoped module that initialises Splide only when the target element exists on the page

### 1.3 Asset Pipeline Rules
- [x] Confirm all CSS is authored as native CSS (no `.scss` files)
- [x] Confirm all JS is vanilla / web components (no jQuery, no heavy frameworks)
- [x] Establish the convention: `assets/section-[name].js` for section-specific JS, `assets/component-[name].js` for shared components
- [x] Ensure `critical.css` in `/assets/` is inlined in `layout/theme.liquid` via `{% render 'critical-css' %}`
- [x] All other CSS files loaded with `rel="stylesheet"` placed after critical CSS

---

## Phase 2 — Design System

### 2.1 CSS Custom Properties
- [x] Define the full token set in `snippets/css-variables.liquid`:
  - Color tokens: `--color-background`, `--color-foreground`, `--color-primary`, `--color-primary-hover`, `--color-border`, `--color-overlay`
  - Typography tokens: `--font-heading-family`, `--font-heading-weight`, `--font-body-family`, `--font-body-size`
  - Spacing tokens: `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`
  - Radius tokens: `--radius-sm`, `--radius-md`, `--radius-lg`
  - Transition token: `--transition-base`
- [x] Output all tokens as CSS custom properties on `:root` using `settings` values from `settings_data.json`

### 2.2 Color Schemes
- [x] Build a minimum of **4 named color scheme classes**: `.color-scheme-1` through `.color-scheme-4`
- [x] Schemes: Light, Dark, Muted, Accent (maps to Fashion Brand, Beauty Store, Minimal, Bold Promo presets)
- [x] Every section's schema must include a `color_scheme` selector setting that applies the correct class to the section wrapper
- [x] Confirm both light and dark modes are visually polished

### 2.3 Typography
- [x] Add 2–3 curated font pair options (not free-range pickers) via `font_picker` settings
- [x] Font pair 1: Serif heading (e.g., Playfair Display) + Sans body (e.g., Inter) — Fashion Brand
- [x] Font pair 2: Rounded sans heading + Light sans body — Beauty Store
- [x] Font pair 3: Geometric sans heading + Neutral sans body — Minimal
- [x] Load fonts via `shopify_asset_url` or Shopify's font asset system, never via Google Fonts CDN
- [x] Define heading scale: h1–h6 fluid type using `clamp()` where appropriate

### 2.4 Spacing Scale
- [x] Implement three spacing modes: `compact`, `balanced`, `spacious`
- [x] Each mode maps to a different set of `--spacing-*` values
- [x] A single `spacing_scale` setting in `settings_schema.json` controls which map is active
- [x] Apply spacing scale to section padding using the token, not hardcoded pixel values

---

## Phase 3 — Core Layout

### 3.1 `layout/theme.liquid`
- [x] Inline `critical.css` via snippet
- [x] Output `{{ content_for_header }}` correctly
- [x] Apply `dir="rtl"` to `<html>` when active locale is RTL (Arabic, Hebrew)
- [x] Include `{{ content_for_layout }}` inside `<main id="main-content">`
- [x] Link skip-to-content anchor `#main-content` for accessibility
- [x] Load Back-to-Top button snippet globally
- [x] Load Age Verifier snippet globally (conditionally by setting)
- [x] Defer all non-critical scripts using `defer` attribute or `type="module"`

### 3.2 Header Section (`sections/header.liquid`)
- [x] Logo (image or text fallback)
- [x] Navigation tied to a menu picker setting
- [x] Account icon/link (feature #1 — Account Menu)
- [x] Cart icon with live item count
- [x] Search trigger (icon opens search drawer)
- [x] Language selector using `localization` object (if multi-language enabled)
- [x] Mobile hamburger menu and slide-out drawer
- [x] **Sticky header** behavior (feature #18): always-sticky vs. scroll-up-only mode
- [x] Compact/mini header variant on scroll (reduced height)
- [x] Schema settings: logo, menu picker, sticky mode, color scheme

### 3.3 Mega Menu (feature #12)
- [x] Build as a component rendered inside `sections/header.liquid`
- [x] Full-width multi-column dropdown layout
- [x] Each column configurable: link list, heading, optional featured image or promo block
- [x] In-Menu Promos (feature #10): promo image + text + CTA inside menu panel
- [x] Keyboard accessible: `aria-expanded`, `aria-haspopup`, focus trap on open
- [x] Close on `Escape` key and outside click
- [x] Mobile: collapses to accordion inside hamburger drawer

### 3.4 Footer Section (`sections/footer.liquid`)
- [x] Link columns (configurable number)
- [x] Newsletter signup form
- [x] Social media icons
- [x] Payment icons
- [x] Language/currency selectors
- [x] Copyright text (translatable)
- [x] Schema blocks: link column, newsletter, social, text

### 3.5 Announcement Bar
- [x] Separate section for an announcement bar above the header
- [x] Dismissible via close button (stored in `sessionStorage`)
- [x] Supports Splide carousel for multiple messages
- [x] Configurable: background color, text, link, show/hide toggle

---

## Phase 4 — Global Component Snippets

Build these as standalone `.liquid` snippets in `/snippets/` before building sections that depend on them.

### 4.1 Image Snippet (`snippets/image.liquid`)
- [x] Accepts: `image`, `widths`, `sizes`, `alt`, `class`, `loading`
- [x] Outputs `<img>` with `srcset`, `sizes`, `loading="lazy"` by default, and `width`/`height` for CLS prevention
- [x] Fallback placeholder when image is nil

### 4.2 Icon Snippet (`snippets/icon.liquid`)
- [x] Accepts an `icon` parameter and renders the corresponding inline SVG
- [x] Covers: cart, account, search, close, hamburger, chevron, star, check, arrow

### 4.3 Button Snippet (`snippets/button.liquid`)
- [x] Accepts: `label`, `url`, `style` (solid / outline), `size`, `type`, `class`
- [x] Outputs semantic `<a>` or `<button>` based on context
- [x] All buttons minimum 48×48px touch target on mobile

### 4.4 Product Card Snippet (`snippets/product-card.liquid`)
- [x] Product image (lazy loaded via `snippets/image.liquid`)
- [x] Product title, vendor (optional), price (with sale/compare-at)
- [x] Color swatches (feature #6) rendered inline on the card
- [x] Quick View trigger button (feature #15)
- [x] Overlay add-to-cart button (optional, configurable)

### 4.5 Price Snippet (`snippets/price.liquid`)
- [x] Handles single price, sale price + compare-at, price range for multi-variant products
- [x] Marks up `compare_at_price` with `<s>` and a visually hidden "Regular price" for screen readers

### 4.6 Pagination Snippet (`snippets/pagination.liquid`)
- [x] Outputs `{{ paginate.next.url }}` link styled as a "Load more" button
- [x] Acts as the JavaScript-disabled fallback for infinite scroll

### 4.7 Breadcrumbs Snippet (`snippets/breadcrumbs.liquid`) — Feature #5
- [x] Generates correct hierarchy from `request.page_type`
- [x] Semantic `<nav aria-label="Breadcrumb">` wrapper
- [x] `BreadcrumbList` JSON-LD structured data block
- [x] Configurable visibility per template via settings

### 4.8 Social Share Snippet (`snippets/social-share.liquid`)
- [x] Share buttons: Facebook, X (Twitter), Pinterest, copy link
- [x] Used on product and article pages

---

## Phase 5 — Templates & Sections

Build each template's primary section. All templates already exist as JSON files; now build their section content.

### 5.1 Home Page (`templates/index.json` + homepage sections)

Sections to build for the homepage:

| Section | File | Notes |
|---|---|---|
| Slideshow / Hero | `sections/slideshow.liquid` | Splide-powered, full-bleed, text overlay |
| Featured Collection | `sections/featured-collection.liquid` | Product grid or Splide carousel |
| Featured Product | `sections/featured-product.liquid` | Single product spotlight |
| Image Banner | `sections/image-banner.liquid` | Full-width editorial image + CTA |
| Multicolumn | `sections/multicolumn.liquid` | 2–4 columns, icon/image + text |
| Testimonials | `sections/testimonials.liquid` | Feature #— see Phase 6 |
| UGC Photo Grid | `sections/ugc-grid.liquid` | Feature #— see Phase 6 |
| Countdown Timer | `sections/countdown-timer.liquid` | Feature #8 |
| Before/After Slider | `sections/before-after.liquid` | Feature #4 |
| Rich Text | `sections/rich-text.liquid` | Centered or split text block |
| Collapsible FAQ | `sections/faq.liquid` | Accordion, schema-driven |
| Brand Logos | `sections/logo-list.liquid` | Press / brand trust bar |
| Video | `sections/video.liquid` | Shopify-hosted or YouTube/Vimeo embed |
| Email Signup | `sections/email-signup.liquid` | Full-width newsletter CTA |

- [x] Configure `templates/index.json` to reference all homepage sections in order
- [x] Pre-populate `settings_data.json` with demo content for each section

### 5.2 Product Page (`templates/product.json` + `sections/product.liquid`)

QA checklist: [qa-phase-5-2-product-page.md](./qa-phase-5-2-product-page.md).

Complete for this phase: sticky add-to-cart bar is **Phase 6** (feature #27), not 5.2.

- [x] Product media gallery (Splide carousel on mobile, filmstrip on desktop)
- [x] Product title, vendor, price (using `snippets/price.liquid`)
- [x] Variant selector (dropdown or button group), updating URL on change
- [x] Color swatches on variant picker (feature #6)
- [x] Quantity selector
- [x] Add to Cart form
- [x] Stock counter / low-stock indicator (feature #19)
- [ ] Sticky Add-to-Cart bar (feature #27 — see Phase 6)
- [x] Product description (expandable if long)
- [x] Breadcrumbs (feature #5)
- [x] Social share (snippet)
- [x] Complementary / recommended products block (JSON recommendations API; Phase 6 may extend)
- [x] Quantity / tiered pricing display (feature #13)
- [x] Combined Listing switcher (feature #7)
- [x] Product reviews placeholder block (app block slot)
- [x] Schema: all blocks reorderable in editor

### 5.3 Collection Page (`templates/collection.json` + `sections/collection.liquid`)

QA checklist: [qa-phase-5-3-collection-page.md](./qa-phase-5-3-collection-page.md).

- [x] Collection title, description, banner image
- [x] Breadcrumbs
- [x] Filter sidebar / drawer using Storefront Filtering API
- [x] Swatch filters in sidebar (feature #20)
- [x] Sort-by dropdown
- [x] Product grid (responsive, 2-col mobile / 3–4 col desktop)
- [x] Product cards using `snippets/product-card.liquid`
- [x] Infinite scroll (feature #11) with Load More fallback
- [x] Grid/list toggle

### 5.4 Cart Page (`templates/cart.json` + `sections/cart.liquid`)

QA checklist: [qa-phase-5-4-cart-page.md](./qa-phase-5-4-cart-page.md).

- [x] Line item list with image, title, variant, quantity stepper, remove
- [x] Order note textarea
- [ ] Upsell row / cart drawer upsell (Phase 6)
- [x] Subtotal, discount code field, checkout button
- [x] Empty cart state with CTA back to collections
- [x] Cart type setting: page cart vs. drawer cart

### 5.5 Search Page (`templates/search.json` + `sections/search.liquid`)

QA checklist: [qa-phase-5-5-search-page.md](./qa-phase-5-5-search-page.md).

- [x] Search input (pre-filled with current query)
- [x] Predictive search results (product suggestions while typing)
- [x] Results grid using `snippets/product-card.liquid`
- [x] No-results state with suggestions

### 5.6 Article Page (`templates/article.json` + `sections/article.liquid`)

QA checklist: [qa-phase-5-6-article-page.md](./qa-phase-5-6-article-page.md).

- [x] Featured image
- [x] Article title, author, published date
- [x] Article content (`{{ article.content }}`)
- [x] Tags, breadcrumbs, social share
- [x] Previous / next article navigation
- [x] Comments form (if blog has comments enabled)
- [x] Related articles block

### 5.7 Blog Page (`templates/blog.json` + `sections/blog.liquid`)
- [x] Blog header (title + description)
- [x] Article card grid
- [x] Tag filter bar
- [x] Pagination

### 5.8 Standard Page (`templates/page.json` + `sections/page.liquid`)
- [x] Page title, content
- [x] Breadcrumbs
- [x] Optional sidebar or split layout

### 5.9 Contact Page (`templates/page.contact.json`)
- [x] Contact form using `{% form 'contact' %}`
- [x] Map embed option (iframe, configurable)
- [x] Contact info block (address, phone, email)

### 5.10 Remaining Templates
- [x] `templates/404.json` — styled 404 with search input and homepage CTA
- [x] `templates/password.json` — branded password page with newsletter signup
- [x] `templates/list-collections.json` — grid of all collections
- [x] `templates/gift_card.liquid` — Shopify-provided structure, styled to match theme

---

## Phase 6 — Conversion Features

### 6.1 Sticky Add-to-Cart Bar (Feature #27 from Pillar 2)
- [x] Build as `sections/sticky-atc.liquid` or a global snippet rendered on product templates
- [x] Fixed to the bottom of the viewport
- [x] Shows product title, selected variant, price, and Add to Cart button
- [x] Activates via `IntersectionObserver` watching the main ATC button — appears when main button scrolls out of view
- [x] Disappears when user scrolls back up to the main form
- [x] Mobile: full-width bar; desktop: constrained width centered

### 6.2 Quick View Modal (Feature #15)
- [x] Build as `snippets/quick-view-dialog.liquid` + `sections/quick-view.liquid` + `assets/component-quick-view.js`
- [x] Triggered by a button on each product card
- [x] Opens a `<dialog>` element (native HTML dialog for accessibility)
- [x] Loads product data via the Shopify Section Rendering API (`?view=quick-view&sections=…`)
- [x] Contains: product images, variant selectors, price, Add to Cart
- [x] Focus trap inside the dialog, `Escape` closes it
- [x] `aria-modal="true"`, `role="dialog"`, labeled via `aria-labelledby`
- [x] Configurable on/off via theme settings

### 6.3 Upsell & Cross-sell (Pillar 2)
- [x] **Cart drawer upsell row**: `snippets/cart-drawer.liquid` + fetch in `snippets/cart-assets.liquid` (first line item `product_id`)
- [x] Fetch recommendations via `/recommendations/products.json?product_id=…&limit=4`
- [x] Post-ATC modal: `snippets/post-add-modal.liquid` + Ajax add on product page when drawer cart + setting (`section-product.js`)
- [ ] Optional: heavier server-rendered upsell via Section Rendering API (not required for recommendations JSON)

### 6.4 Testimonials Section (Feature from Pillar 2)
- [x] `sections/testimonials.liquid`
- [x] Schema blocks: each block = one testimonial (reviewer name, quote, star rating 1–5, optional photo)
- [x] Layout setting: `grid` or `carousel`
- [x] Carousel mode powered by Splide (load Splide CSS + JS conditionally on this section only)
- [x] Star rating output using inline SVG stars

### 6.5 UGC Photo Grid (Feature from Pillar 2)
- [x] `sections/ugc-grid.liquid`
- [x] Instagram-style grid (3–4 columns)
- [x] Each cell: manually uploaded image, optional product link
- [x] Schema blocks: image picker + product picker + caption
- [x] Lightbox on click (native `<dialog>` or CSS-only approach)

### 6.6 Quick Order List (Feature #14)
- [x] `sections/quick-order-list.liquid` — usable on collection or custom pages
- [x] Table layout: product image, name, variant dropdowns, price, quantity input
- [x] "Add all to cart" button submits all rows in a single cart POST (`cart/add.js` with `items`)
- [x] JS validates that at least one quantity > 0 before submission

---

## Phase 7 — Collection & Discovery Features

### 7.1 Infinite Scroll (Feature #11)
- [x] Build in `assets/section-collection.js`
- [x] Use `IntersectionObserver` on a sentinel element below the product grid
- [x] Fetch next page URL from `{{ paginate.next.url }}` stored in a `data-` attribute
- [x] Append new product cards to the grid without re-rendering the entire page
- [x] Show a loading spinner while fetching
- [x] Fallback: `snippets/pagination.liquid` Load More button (works with no JS)
- [x] Toggle: infinite scroll vs pagination via collection section `pagination_mode` and theme default `settings.collection_pagination_mode`

### 7.2 Swatch Filters (Feature #20)
- [x] Extend the filter sidebar in `sections/collection.liquid`
- [x] For color/material filter options, render swatch buttons instead of checkboxes
- [x] Swatch appearance matches swatches on product cards (hex or image-based)
- [x] On swatch click, update URL params using Storefront Filtering API
- [x] Re-render product grid via fetch + DOM swap (no full page reload)

### 7.3 Color Swatches (Feature #6)
- [x] Build as part of `snippets/product-card.liquid` and `sections/product.liquid`
- [x] Use Shopify's `swatch.color` (hex) and `swatch.image` for image-based swatches
- [x] Tooltip on hover showing variant name
- [x] Clicking swatch on product card: update card image and selected variant
- [x] Clicking swatch on product page: update gallery, price, ATC form variant_id

---

## Phase 8 — Advanced Feature Checklist

Work through each of these remaining features, building each as a self-contained section or snippet.

### Feature #1 — Account Menu
- [x] Account icon in header with dropdown: Login, Register, Account links
- [x] When `customer` object is present: show name + Logout link
- [x] Use `routes.account_url`, `routes.account_login_url`, `routes.account_register_url`, `routes.account_logout_url`

### Feature #2 — Age Verifier
- [x] `sections/age-verifier.liquid` + `assets/component-age-verifier.js`
- [x] Full-screen overlay on first visit
- [x] Schema settings: minimum age label, heading, subheading, confirm label, decline URL
- [x] Store confirmation in `localStorage` key `age-verified`
- [x] Decline button redirects to configurable URL

### Feature #3 — Back-to-Top Button
- [x] `snippets/back-to-top.liquid` rendered globally in `theme.liquid`
- [x] Appears after scrolling past configurable threshold (e.g., 400px)
- [x] Smooth scroll via `window.scrollTo({ top: 0, behavior: 'smooth' })`
- [x] `aria-label="Back to top"`, keyboard focusable
- [x] Show/hide toggle in theme settings

### Feature #4 — Before/After Image Slider
- [x] `sections/before-after.liquid`
- [x] Draggable vertical or horizontal divider using pointer events
- [x] Schema settings: before image, after image, orientation, left label, right label
- [x] Keyboard accessible: arrow keys move the divider
- [x] Multiple pairs in sequence use Splide to navigate between them

### Feature #7 — Combined Listing
- [x] `snippets/combined-listing.liquid` rendered inside product section
- [x] Group related products linked via a metafield (e.g., `custom.combined_listing`)
- [x] Render sibling product links as a swatch/button row
- [x] Clicking a sibling navigates to that product page (or AJAX-loads it)

### Feature #8 — Countdown Timer
- [x] `sections/countdown-timer.liquid`
- [x] Pure JS countdown using `Date` — no external library
- [x] Schema settings: end date/time (datetime picker), label, expired message, show/hide
- [x] Display: `DD : HH : MM : SS` format
- [x] When countdown reaches zero: hide timer, show expired message
- [x] Do not misrepresent urgency — always tie to a real configurable date

### Feature #13 — Quantity / Tiered Pricing
- [x] In `sections/product.liquid`, add a tiered pricing table block
- [x] Tiers stored in a product metafield (JSON: `[{ "min": 1, "max": 4, "price": 1000 }, ...]`)
- [x] JS listens to quantity input changes and updates the displayed unit price accordingly
- [x] Table is hidden if no tiered pricing metafield is set

### Feature #16 — RTL Support
- [x] In `layout/theme.liquid`, detect RTL locales and set `dir="rtl"` on `<html>`
- [x] Audit all CSS: replace `margin-left/right`, `padding-left/right`, `text-align: left` with logical properties (`margin-inline-start`, `padding-inline-end`, `text-align: start`)
- [x] Test navigation, sliders (Splide has native RTL support via `direction: 'rtl'`), forms, and product grids in RTL

### Feature #17 — Sign in with Shop
- [x] On `layout/theme.liquid` or the customer login template, render the Sign in with Shop button using `{{ form | login_button }}`
- [x] Do not modify button colors, font, or layout — keep Shopify's branded styling intact

---

## Phase 9 — Theme Settings

### 9.1 `config/settings_schema.json` Structure

Organize categories in this exact order, using merchant-friendly labels:

| Category | Key Settings |
|---|---|
| **Branding** | Logo, favicon, logo width |
| **Colors & Style** | Color scheme slots (4–6), button style, border radius |
| **Typography** | Font pair selector, heading size scale, body size |
| **Spacing** | Spacing scale (Compact / Balanced / Spacious) |
| **Homepage** | Announcement bar, hero defaults |
| **Product Page** | Sticky ATC toggle, quick view toggle, color swatches toggle, stock counter threshold |
| **Collection Page** | Filter position (sidebar/drawer), infinite scroll vs pagination, products per page |
| **Cart & Checkout** | Cart type (page/drawer), cart upsell toggle, order notes toggle |
| **Navigation** | Mega menu toggle, mobile menu style |
| **Footer** | Show/hide payment icons, social icons |
| **Advanced** | Back-to-top toggle, age verifier toggle + settings |

- [x] Theme settings in `config/settings_schema.json` follow this category order and are wired in Liquid where noted (spacing, product/collection/cart defaults, header logo, mega menu, footer payment/social, favicon, homepage defaults).

Rules:
- [x] Every range input has `min`, `max`, and `step` — no free-form values
- [x] Use `select` over `text` wherever the valid options are finite
- [x] Add `info` fields to any setting that could confuse a non-technical merchant
- [x] Keep `info` text under 12 words, plain language, no jargon

### 9.2 Four Theme Presets

Build named presets in `config/settings_data.json`:

| Preset | Colors | Fonts | Spacing | Sections |
|---|---|---|---|---|
| **Fashion Brand** | Dark tones, cream accent | Serif heading + sans body | Spacious | Hero slideshow → Editorial banner → Featured collection |
| **Beauty Store** | Soft pink / blush palette | Rounded sans + light body | Balanced | Large hero → UGC grid → Testimonials carousel |
| **Minimal Store** | White, black, one neutral | Geometric sans + neutral body | Spacious | Full-bleed image → Multicolumn text → Featured products |
| **Bold Promo Store** | High contrast, bold accent | Strong sans heading + solid body | Compact | Countdown timer → Hero + CTA → Quick order list |

- [x] Each preset pre-configures all color scheme slots, fonts, and spacing in `settings_data.json`
- [x] `templates/index.json` ships demo-ready homepage sections; switching a **Style** preset updates theme settings only (homepage section order is not swapped automatically — merchants customize in the editor).
- [x] Presets are selectable from the Shopify theme editor via Style options

### 9.3 Pre-Built Section Blocks (Editor Defaults)
- [x] Hero Banner block (full-bleed image, heading, CTA) — ships with demo image + placeholder text
- [x] Testimonial row/carousel — 3 pre-filled testimonial blocks
- [x] Product highlights — multicolumn preset with bullet lists (`sections/multicolumn.liquid`)
- [x] Before/After comparison — pair block preset + homepage `pair` block (upload images in editor)
- [x] UGC photo grid — 6 placeholder photo blocks
- [x] Announcement bar — one pre-filled message block

---

## Phase 10 — Localization

### 10.1 Locale File Structure

The theme ships a **Shopify-style locale pack** under `/locales/` (default English + many storefront locales). Pairs with a `.schema.json` file translate **theme editor** strings; storefront-only files translate the online store UI.

| Kind | Files |
|---|---|
| Default | `en.default.json`, `en.default.schema.json` |
| Storefront + editor schema | `cs`, `da`, `de`, `es`, `fi`, `fr`, `it`, `ja`, `ko`, `nb`, `nl`, `pl`, `pt-BR`, `pt-PT`, `sv`, `th` |
| Storefront only | `af`, `bg`, `el`, `hr`, `hu`, `id`, `lt`, `ro`, `ru`, `sk`, `sl` |

**Storefront copy:** `fr`, `de`, `es`, and `it` use full human translations. Other storefront JSON files currently **mirror English keys** so structure and fallbacks are complete; replace with professional translations before a Theme Store submission if required.

**Editor schema:** Non-English `*.schema.json` files mirror `en.default.schema.json` until translated in the editor or by a translator.

Regenerate mirrored **storefront** JSON from English with: `node scripts/seed-locale-files.mjs` (protects `fr` / `de` / `es` / `it`; does not overwrite `*.schema.json` unless `FORCE_SCHEMA_SEED=1`).

Regenerate **translated editor** strings for all `*.schema.json` (except `en.default.schema.json`) with: `node scripts/build-translated-schema-locales.mjs` (~20 min, uses Google gtx; spot-check and fix any bad machine translations).

### 10.2 Translation Checklist

All of the following must use `{{ 'key' | t }}` — zero hardcoded UI strings:

- [x] All button labels (Add to Cart, View All, Load More, Close, Submit...)
- [x] All ARIA labels (aria-label attributes on icons, buttons, dialogs)
- [x] All product page labels (Size, Color, Quantity, In stock, Only X left...)
- [x] All cart labels (Subtotal, Checkout, Remove, Empty cart...)
- [x] All navigation labels (Menu, Search, Account, Back...)
- [x] All form labels and error messages
- [x] All section headings that use static theme-provided text
- [x] Age verifier text, countdown timer labels, testimonial "stars" alt text

### 10.3 Language Selector
- [x] Render `{% form 'localization' %}` in the header and/or footer
- [x] Show language name (localized) using `localization.available_languages`
- [x] Currency selector if applicable

---

## Phase 11 — Performance

### 11.1 Lighthouse Targets

| Metric | Target | Minimum |
|---|---|---|
| Performance (mobile) | 70+ | 60 |
| Accessibility | 90+ | 90 |
| CLS | < 0.1 | < 0.25 |
| LCP | < 2.5s | — |

### 11.2 Image Optimization
- [x] Key storefront images use `snippets/image.liquid` with `srcset` and `sizes` (collection hero, article hero, article cards; product cards already used it). Remaining `image_tag` usages: cart line items, predictive search, quick-view template, swatches, combined listing, password/gift card, custom-section background — migrate opportunistically.
- [x] Non-hero images default to `loading="lazy"` via `image.liquid` and existing patterns
- [x] Hero/above-fold images: collection + article heroes and header logo use `loading="eager"`; `image.liquid` adds `fetchpriority="high"` when eager
- [x] `image.liquid` outputs native `width`/`height`; header and other hand-tuned images set dimensions explicitly
- [x] No full-size-only hero URLs in migrated spots — `image_url` always scoped by width list

### 11.3 JavaScript Strategy
- [x] Non-critical scripts use `defer` or `{% javascript %}` / injected deferred scripts where applicable
- [x] Section-specific JS (Splide, product section JS, etc.) only when the section is present
- [x] Quick View: CSS + `component-quick-view.js` injected on first `[data-quick-view]` click (interaction-gated load). Age Verifier: `component-age-verifier.js` skipped when visitor already passed (non–theme-editor) via `age-verifier-passed` on `<html>`.
- [x] Splide assets only on slider sections (slideshow, featured collection, testimonials, announcement bar, product gallery, before/after)
- [x] Reduced global Quick View / age-verifier JS parse cost on pages where the feature is unused or already dismissed

### 11.4 CSS Strategy
- [x] Critical path: `snippets/css-variables.liquid` + `snippets/critical-css.liquid` (mirrors `assets/critical.css`)
- [x] Global non-critical CSS: `color-schemes`, `typography`, `spacing`, `buttons` via `media="print" onload="this.media='all'"` + `noscript` in `layout/theme.liquid`
- [x] No extra render-blocking `<link rel="stylesheet">` in `<head>` beyond inlined critical CSS

### 11.5 Prefers-Reduced-Motion
- [x] `assets/splide-init.js` disables autoplay and zeroes transition speeds when `prefers-reduced-motion: reduce`
- [x] Mega menu entrance animation is opt-in under `prefers-reduced-motion: no-preference`; FAQ / pagination spinners already gated
- [x] Countdown section stylesheet suppresses transitions/animations under reduce; digit updates remain for accessibility (time-critical content)

---

## Phase 12 — Accessibility

### 12.1 Keyboard Navigation
- [x] Interactive elements use native controls or documented keyboard paths (header `section-header.js`, filters, search, Splide arrows, before/after divider, etc.)
- [x] Global `:focus-visible` fallback in `critical-css` / `critical.css`; section-level focus styles remain where defined
- [x] Focus trap: mega menu panel (`section-header.js` + `trapFocus`), Quick View (`component-quick-view.js`), age verifier panel (`component-age-verifier.js`), cart drawer (`cart-assets.liquid`), post-add modal (`component-post-add-modal.js`)
- [x] `Escape` closes mega menu, mobile nav, header search, cart drawer, collection filter drawer, predictive search, Quick View, post-add modal. Age verifier intentionally does **not** close on Escape (no bypass of the gate).

### 12.2 ARIA & Semantic HTML
- [x] Landmarks: `layout/theme.liquid` uses `<main id="main-content">`; header/footer via section groups (`<header>`, `<footer>`); collection filters `<aside>`; nav regions in header, mobile drawer, breadcrumbs
- [x] Skip link: `#main-content` with classes `skip-to-content-link skip-link` (matches checklist wording)
- [x] Icon-only controls use `aria-label` (theme convention); continue to audit new UI
- [x] Native `<dialog>` modals: Quick View, post-add, cart drawer pattern; mega panel uses `role="dialog"` with `aria-labelledby` (non-modal flyout: `aria-modal="false"`)
- [x] Nav: `aria-expanded` / `aria-haspopup` on items with children; `aria-controls` on mega triggers (`mega-menu-…`) and simple dropdowns (`header-dropdown-…`); search/cart/hamburger wired in JS
- [x] Breadcrumbs: `nav` + translated `aria-label` + `aria-current="page"` on current item; JSON-LD `BreadcrumbList` in `snippets/breadcrumbs.liquid`
- [x] Splide: `accessibility: true` in `assets/splide-init.js` defaults

### 12.3 Touch & Mobile UX
- [x] Header icon buttons use **48×48px** (`3rem`) minimum; `.btn` base uses `min-height: 3rem` in `buttons.css`
- [x] Sticky header + drawer patterns keep primary actions in predictable zones (manual device pass recommended before Theme Store)
- [x] Hover states pair with focus/active or click (e.g. product card actions use `:focus-within`)
- [x] Viewport meta in `snippets/meta-tags.liquid`: `width=device-width, initial-scale=1` only — no `user-scalable=no`

### 12.4 RTL Layout Audit
- [ ] Manual pass: enable an RTL storefront locale and click through critical templates (checklist for humans)
- [x] Splide: `direction: 'rtl'` when `document.documentElement.dir === 'rtl'` (`splide-init.js`)
- [x] Before/After: horizontal pointer % and Arrow Left/Right inverted in RTL (`section-before-after.js`); vertical unchanged
- [x] Mega / layout: theme sets `dir` on `<html>`; columns use logical properties (`inset-inline`, `margin-inline`, etc.) in many areas — confirm visually on RTL pass

### 12.5 Structured Data
- [x] Product: `{{ product | structured_data }}` in `snippets/meta-tags.liquid`
- [x] BreadcrumbList: output with `breadcrumbs` snippet when crumbs render
- [x] Article: `{{ article | structured_data }}` on `request.page_type == 'article'`
- [x] Homepage: `WebSite` (with `SearchAction`) + `Organization` JSON-LD on `request.page_type == 'index'`

---

## Phase 13 — QA & Polish

### 13.1 Cross-Template Testing
- [ ] Test all 13 required templates in the theme editor
- [ ] Confirm every section is editable and blocks are add/reorder/remove capable
- [ ] Confirm every setting has a visible effect in the editor preview
- [ ] Verify no broken layouts when sections have zero blocks

### 13.2 Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Safari (macOS + iOS)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome + Mobile Safari on real devices or accurate emulation

### 13.3 Theme Check
- [ ] Run `shopify theme check` — resolve all errors, review all warnings
- [ ] Confirm no deprecated Liquid tags or filters are used
- [ ] Confirm all JSON template files are valid

### 13.4 Lighthouse Audit
- [ ] Run Lighthouse on: home page, a product page, a collection page
- [ ] Performance ≥ 70 on mobile
- [ ] Accessibility ≥ 90
- [ ] Fix any Lighthouse-flagged issues before submission

### 13.5 Theme Store Readiness Checklist
- [ ] All 13 required templates present and functional
- [ ] All 20 features implemented and editor-configurable
- [ ] Locale JSON files share the same keys as `en.default.json`; FR/DE/ES/IT storefront strings translated; other locales English mirrors until professionally translated
- [ ] `settings_data.json` shows a polished demo-ready install state
- [ ] No CDN dependencies — all assets hosted in `/assets/`
- [ ] No references to Dawn, Horizon, or other existing themes in code or comments
- [ ] README updated with theme setup instructions
- [ ] Theme tested with `shopify theme dev` and confirmed live-ready

---

## Feature Build Order Reference

Use this quick-reference table when deciding what to build next:

| # | Feature | Phase | Section / File |
|---|---|---|---|
| 1 | Account Menu | 3 | `sections/header.liquid` |
| 2 | Age Verifier | 8 | `sections/age-verifier.liquid` |
| 3 | Back-to-Top | 8 | `snippets/back-to-top.liquid` |
| 4 | Before/After Slider | 8 | `sections/before-after.liquid` |
| 5 | Breadcrumbs | 4 | `snippets/breadcrumbs.liquid` |
| 6 | Color Swatches | 7 | `snippets/product-card.liquid` |
| 7 | Combined Listing | 8 | `snippets/combined-listing.liquid` |
| 8 | Countdown Timer | 8 | `sections/countdown-timer.liquid` |
| 9 | EU Translations | 10 | `locales/*.json` |
| 10 | In-Menu Promos | 3 | `sections/header.liquid` |
| 11 | Infinite Scroll | 7 | `assets/section-collection.js` |
| 12 | Mega Menu | 3 | `sections/header.liquid` |
| 13 | Quantity Pricing | 8 | `sections/product.liquid` |
| 14 | Quick Order List | 6 | `sections/quick-order-list.liquid` |
| 15 | Quick View | 6 | `snippets/quick-view.liquid` |
| 16 | RTL Support | 12 | Global CSS + `layout/theme.liquid` |
| 17 | Sign in with Shop | 8 | Customer login template |
| 18 | Sticky Header | 3 | `sections/header.liquid` |
| 19 | Stock Counter | 5 | `sections/product.liquid` |
| 20 | Swatch Filters | 7 | `sections/collection.liquid` |

---

## Key References

- [Shopify Theme Store Requirements](https://shopify.dev/docs/storefronts/themes/store/requirements)
- [Online Store 2.0 Architecture](https://shopify.dev/docs/storefronts/themes/architecture)
- [Liquid Reference](https://shopify.dev/docs/api/liquid)
- [Storefront Filtering API](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering)
- [Shopify CLI — theme dev](https://shopify.dev/docs/api/shopify-cli/theme/theme-dev)
- [Splide Documentation](https://splidejs.com/guides/getting-started/)
- [Shopify Skeleton Theme](https://github.com/shopify/skeleton-theme)
  