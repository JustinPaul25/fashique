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
| 10 | Localization | 5-language locale files |
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
- [ ] Product media gallery (Splide carousel on mobile, filmstrip on desktop)
- [ ] Product title, vendor, price (using `snippets/price.liquid`)
- [ ] Variant selector (dropdown or button group), updating URL on change
- [ ] Color swatches on variant picker (feature #6)
- [ ] Quantity selector
- [ ] Add to Cart form
- [ ] Stock counter / low-stock indicator (feature #19)
- [ ] Sticky Add-to-Cart bar (feature #27 — see Phase 6)
- [ ] Product description (expandable if long)
- [ ] Breadcrumbs (feature #5)
- [ ] Social share (snippet)
- [ ] Complementary / recommended products block (upsell, Phase 6)
- [ ] Quantity / tiered pricing display (feature #13)
- [ ] Combined Listing switcher (feature #7)
- [ ] Product reviews placeholder block (app block slot)
- [ ] Schema: all blocks reorderable in editor

### 5.3 Collection Page (`templates/collection.json` + `sections/collection.liquid`)
- [ ] Collection title, description, banner image
- [ ] Breadcrumbs
- [ ] Filter sidebar / drawer using Storefront Filtering API
- [ ] Swatch filters in sidebar (feature #20)
- [ ] Sort-by dropdown
- [ ] Product grid (responsive, 2-col mobile / 3–4 col desktop)
- [ ] Product cards using `snippets/product-card.liquid`
- [ ] Infinite scroll (feature #11) with Load More fallback
- [ ] Grid/list toggle

### 5.4 Cart Page (`templates/cart.json` + `sections/cart.liquid`)
- [ ] Line item list with image, title, variant, quantity stepper, remove
- [ ] Order note textarea
- [ ] Upsell row / cart drawer upsell (Phase 6)
- [ ] Subtotal, discount code field, checkout button
- [ ] Empty cart state with CTA back to collections
- [ ] Cart type setting: page cart vs. drawer cart

### 5.5 Search Page (`templates/search.json` + `sections/search.liquid`)
- [ ] Search input (pre-filled with current query)
- [ ] Predictive search results (product suggestions while typing)
- [ ] Results grid using `snippets/product-card.liquid`
- [ ] No-results state with suggestions

### 5.6 Article Page (`templates/article.json` + `sections/article.liquid`)
- [ ] Featured image
- [ ] Article title, author, published date
- [ ] Article content (`{{ article.content }}`)
- [ ] Tags, breadcrumbs, social share
- [ ] Previous / next article navigation
- [ ] Comments form (if blog has comments enabled)
- [ ] Related articles block

### 5.7 Blog Page (`templates/blog.json` + `sections/blog.liquid`)
- [ ] Blog header (title + description)
- [ ] Article card grid
- [ ] Tag filter bar
- [ ] Pagination

### 5.8 Standard Page (`templates/page.json` + `sections/page.liquid`)
- [ ] Page title, content
- [ ] Breadcrumbs
- [ ] Optional sidebar or split layout

### 5.9 Contact Page (`templates/page.contact.json`)
- [ ] Contact form using `{% form 'contact' %}`
- [ ] Map embed option (iframe, configurable)
- [ ] Contact info block (address, phone, email)

### 5.10 Remaining Templates
- [ ] `templates/404.json` — styled 404 with search input and homepage CTA
- [ ] `templates/password.json` — branded password page with newsletter signup
- [ ] `templates/list-collections.json` — grid of all collections
- [ ] `templates/gift_card.liquid` — Shopify-provided structure, styled to match theme

---

## Phase 6 — Conversion Features

### 6.1 Sticky Add-to-Cart Bar (Feature #27 from Pillar 2)
- [ ] Build as `sections/sticky-atc.liquid` or a global snippet rendered on product templates
- [ ] Fixed to the bottom of the viewport
- [ ] Shows product title, selected variant, price, and Add to Cart button
- [ ] Activates via `IntersectionObserver` watching the main ATC button — appears when main button scrolls out of view
- [ ] Disappears when user scrolls back up to the main form
- [ ] Mobile: full-width bar; desktop: constrained width centered

### 6.2 Quick View Modal (Feature #15)
- [ ] Build as `snippets/quick-view.liquid` + `assets/component-quick-view.js`
- [ ] Triggered by a button on each product card
- [ ] Opens a `<dialog>` element (native HTML dialog for accessibility)
- [ ] Loads product data via the Shopify Section Rendering API (`?sections=quick-view`)
- [ ] Contains: product images, variant selectors, price, Add to Cart
- [ ] Focus trap inside the dialog, `Escape` closes it
- [ ] `aria-modal="true"`, `role="dialog"`, labeled via `aria-labelledby`
- [ ] Configurable on/off via theme settings

### 6.3 Upsell & Cross-sell (Pillar 2)
- [ ] **Cart drawer upsell row**: build as a block inside `sections/cart.liquid`
- [ ] Fetch recommendations via `/recommendations/products.json?product_id={{ product.id }}&limit=4`
- [ ] Post-ATC modal: show a "Customers also bought" row in a mini-modal after item is added to cart
- [ ] All markup loaded server-side using Section Rendering API to keep JS minimal

### 6.4 Testimonials Section (Feature from Pillar 2)
- [ ] `sections/testimonials.liquid`
- [ ] Schema blocks: each block = one testimonial (reviewer name, quote, star rating 1–5, optional photo)
- [ ] Layout setting: `grid` or `carousel`
- [ ] Carousel mode powered by Splide (load Splide CSS + JS conditionally on this section only)
- [ ] Star rating output using inline SVG stars

### 6.5 UGC Photo Grid (Feature from Pillar 2)
- [ ] `sections/ugc-grid.liquid`
- [ ] Instagram-style grid (3–4 columns)
- [ ] Each cell: manually uploaded image, optional product link
- [ ] Schema blocks: image picker + product picker + caption
- [ ] Lightbox on click (native `<dialog>` or CSS-only approach)

### 6.6 Quick Order List (Feature #14)
- [ ] `sections/quick-order-list.liquid` — usable on collection or custom pages
- [ ] Table layout: product image, name, variant dropdowns, price, quantity input
- [ ] "Add all to cart" button submits all rows in a single cart POST
- [ ] JS validates that at least one quantity > 0 before submission

---

## Phase 7 — Collection & Discovery Features

### 7.1 Infinite Scroll (Feature #11)
- [ ] Build in `assets/section-collection.js`
- [ ] Use `IntersectionObserver` on a sentinel element below the product grid
- [ ] Fetch next page URL from `{{ paginate.next.url }}` stored in a `data-` attribute
- [ ] Append new product cards to the grid without re-rendering the entire page
- [ ] Show a loading spinner while fetching
- [ ] Fallback: `snippets/pagination.liquid` Load More button (works with no JS)
- [ ] Toggle: `infinite_scroll` vs `pagination` setting in `settings_schema.json`

### 7.2 Swatch Filters (Feature #20)
- [ ] Extend the filter sidebar in `sections/collection.liquid`
- [ ] For color/material filter options, render swatch buttons instead of checkboxes
- [ ] Swatch appearance matches swatches on product cards (hex or image-based)
- [ ] On swatch click, update URL params using Storefront Filtering API
- [ ] Re-render product grid via fetch + DOM swap (no full page reload)

### 7.3 Color Swatches (Feature #6)
- [ ] Build as part of `snippets/product-card.liquid` and `sections/product.liquid`
- [ ] Use Shopify's `swatch.color` (hex) and `swatch.image` for image-based swatches
- [ ] Tooltip on hover showing variant name
- [ ] Clicking swatch on product card: update card image and selected variant
- [ ] Clicking swatch on product page: update gallery, price, ATC form variant_id

---

## Phase 8 — Advanced Feature Checklist

Work through each of these remaining features, building each as a self-contained section or snippet.

### Feature #1 — Account Menu
- [ ] Account icon in header with dropdown: Login, Register, Account links
- [ ] When `customer` object is present: show name + Logout link
- [ ] Use `routes.account_url`, `routes.account_login_url`, `routes.account_register_url`, `routes.account_logout_url`

### Feature #2 — Age Verifier
- [ ] `sections/age-verifier.liquid` + `assets/component-age-verifier.js`
- [ ] Full-screen overlay on first visit
- [ ] Schema settings: minimum age label, heading, subheading, confirm label, decline URL
- [ ] Store confirmation in `localStorage` key `age-verified`
- [ ] Decline button redirects to configurable URL

### Feature #3 — Back-to-Top Button
- [ ] `snippets/back-to-top.liquid` rendered globally in `theme.liquid`
- [ ] Appears after scrolling past configurable threshold (e.g., 400px)
- [ ] Smooth scroll via `window.scrollTo({ top: 0, behavior: 'smooth' })`
- [ ] `aria-label="Back to top"`, keyboard focusable
- [ ] Show/hide toggle in theme settings

### Feature #4 — Before/After Image Slider
- [ ] `sections/before-after.liquid`
- [ ] Draggable vertical or horizontal divider using pointer events
- [ ] Schema settings: before image, after image, orientation, left label, right label
- [ ] Keyboard accessible: arrow keys move the divider
- [ ] Multiple pairs in sequence use Splide to navigate between them

### Feature #7 — Combined Listing
- [ ] `snippets/combined-listing.liquid` rendered inside product section
- [ ] Group related products linked via a metafield (e.g., `custom.combined_listing`)
- [ ] Render sibling product links as a swatch/button row
- [ ] Clicking a sibling navigates to that product page (or AJAX-loads it)

### Feature #8 — Countdown Timer
- [ ] `sections/countdown-timer.liquid`
- [ ] Pure JS countdown using `Date` — no external library
- [ ] Schema settings: end date/time (datetime picker), label, expired message, show/hide
- [ ] Display: `DD : HH : MM : SS` format
- [ ] When countdown reaches zero: hide timer, show expired message
- [ ] Do not misrepresent urgency — always tie to a real configurable date

### Feature #13 — Quantity / Tiered Pricing
- [ ] In `sections/product.liquid`, add a tiered pricing table block
- [ ] Tiers stored in a product metafield (JSON: `[{ "min": 1, "max": 4, "price": 1000 }, ...]`)
- [ ] JS listens to quantity input changes and updates the displayed unit price accordingly
- [ ] Table is hidden if no tiered pricing metafield is set

### Feature #16 — RTL Support
- [ ] In `layout/theme.liquid`, detect RTL locales and set `dir="rtl"` on `<html>`
- [ ] Audit all CSS: replace `margin-left/right`, `padding-left/right`, `text-align: left` with logical properties (`margin-inline-start`, `padding-inline-end`, `text-align: start`)
- [ ] Test navigation, sliders (Splide has native RTL support via `direction: 'rtl'`), forms, and product grids in RTL

### Feature #17 — Sign in with Shop
- [ ] On `layout/theme.liquid` or the customer login template, render the Sign in with Shop button using `{{ form | login_button }}`
- [ ] Do not modify button colors, font, or layout — keep Shopify's branded styling intact

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

Rules:
- [ ] Every range input has `min`, `max`, and `step` — no free-form values
- [ ] Use `select` over `text` wherever the valid options are finite
- [ ] Add `info` fields to any setting that could confuse a non-technical merchant
- [ ] Keep `info` text under 12 words, plain language, no jargon

### 9.2 Four Theme Presets

Build named presets in `config/settings_data.json`:

| Preset | Colors | Fonts | Spacing | Sections |
|---|---|---|---|---|
| **Fashion Brand** | Dark tones, cream accent | Serif heading + sans body | Spacious | Hero slideshow → Editorial banner → Featured collection |
| **Beauty Store** | Soft pink / blush palette | Rounded sans + light body | Balanced | Large hero → UGC grid → Testimonials carousel |
| **Minimal Store** | White, black, one neutral | Geometric sans + neutral body | Spacious | Full-bleed image → Multicolumn text → Featured products |
| **Bold Promo Store** | High contrast, bold accent | Strong sans heading + solid body | Compact | Countdown timer → Hero + CTA → Quick order list |

- [ ] Each preset pre-configures all color scheme slots, fonts, and spacing in `settings_data.json`
- [ ] Each preset populates `templates/index.json` with demo-content-ready sections
- [ ] Presets are selectable from the Shopify theme editor via Style options

### 9.3 Pre-Built Section Blocks (Editor Defaults)
- [ ] Hero Banner block (full-bleed image, heading, CTA) — ships with demo image + placeholder text
- [ ] Testimonial row/carousel — 3 pre-filled testimonial blocks
- [ ] Product highlights block (image + feature bullet list)
- [ ] Before/After comparison — placeholder image pair
- [ ] UGC photo grid — 6 placeholder images
- [ ] Announcement bar — one pre-filled message block

---

## Phase 10 — Localization

### 10.1 Locale File Structure

Build complete locale `.json` files for all 5 languages under `/locales/`:

| File | Language |
|---|---|
| `en.default.json` | English (already exists — expand it) |
| `fr.json` | French |
| `it.json` | Italian |
| `de.json` | German |
| `es.json` | Spanish |

Also build the schema translation file: `en.default.schema.json` (already exists — expand it for new settings).

### 10.2 Translation Checklist

All of the following must use `{{ 'key' | t }}` — zero hardcoded UI strings:

- [ ] All button labels (Add to Cart, View All, Load More, Close, Submit...)
- [ ] All ARIA labels (aria-label attributes on icons, buttons, dialogs)
- [ ] All product page labels (Size, Color, Quantity, In stock, Only X left...)
- [ ] All cart labels (Subtotal, Checkout, Remove, Empty cart...)
- [ ] All navigation labels (Menu, Search, Account, Back...)
- [ ] All form labels and error messages
- [ ] All section headings that use static theme-provided text
- [ ] Age verifier text, countdown timer labels, testimonial "stars" alt text

### 10.3 Language Selector
- [ ] Render `{% form 'localization' %}` in the header and/or footer
- [ ] Show language name (localized) using `localization.available_languages`
- [ ] Currency selector if applicable

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
- [ ] All images use `snippets/image.liquid` with `srcset` and `sizes`
- [ ] All non-hero images use `loading="lazy"`
- [ ] Hero/above-fold image uses `loading="eager"` and `fetchpriority="high"`
- [ ] All `<img>` tags have explicit `width` and `height` attributes to prevent CLS
- [ ] Use `image_url` Liquid filter with the `width` parameter instead of outputting full-size image URLs

### 11.3 JavaScript Strategy
- [ ] All non-critical scripts use `defer` or `type="module"`
- [ ] Section-specific JS loaded only when that section is present on the page
- [ ] Use dynamic `import()` for features activated on user interaction (Quick View, Age Verifier)
- [ ] Splide loaded only on pages/sections that include a slider
- [ ] No unused JS loaded globally

### 11.4 CSS Strategy
- [ ] Inline only critical above-fold CSS via `snippets/css-variables.liquid` and `assets/critical.css`
- [ ] All other CSS loaded asynchronously or deferred via `<link rel="stylesheet" media="print" onload="this.media='all'">`
- [ ] No render-blocking CSS in `<head>` beyond the critical inline block

### 11.5 Prefers-Reduced-Motion
- [ ] All Splide instances check `prefers-reduced-motion` and disable autoplay/transitions
- [ ] Any CSS animations use `@media (prefers-reduced-motion: no-preference)` — motion is opt-in
- [ ] Countdown timer, scroll-triggered animations, and parallax effects all respect this media query

---

## Phase 12 — Accessibility

### 12.1 Keyboard Navigation
- [ ] All interactive elements reachable and operable via keyboard
- [ ] Visible focus indicators on all focusable elements (`:focus-visible`)
- [ ] Focus trap implemented in: Mega Menu, Quick View modal, Age Verifier overlay, Cart drawer
- [ ] `Escape` key closes all modals, drawers, and overlays

### 12.2 ARIA & Semantic HTML
- [ ] Correct landmark roles: `<header>`, `<main>`, `<nav>`, `<footer>`, `<aside>`
- [ ] Skip-to-content link: `<a href="#main-content" class="skip-link">Skip to content</a>`
- [ ] All icon-only buttons have `aria-label`
- [ ] Modals use `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- [ ] Navigation dropdowns use `aria-expanded`, `aria-haspopup`, `aria-controls`
- [ ] Breadcrumbs: `<nav aria-label="Breadcrumb">` with `aria-current="page"` on last item
- [ ] Splide: `accessibility: true` option enabled on all instances

### 12.3 Touch & Mobile UX
- [ ] All interactive elements minimum **48×48px** touch target
- [ ] Add to Cart, variant selectors, and navigation all reachable within thumb range
- [ ] No hover-only interactions — all hover states have touch-equivalent behavior
- [ ] Pinch-to-zoom not disabled — never use `user-scalable=no`

### 12.4 RTL Layout Audit
- [ ] Test all pages with an RTL locale active
- [ ] Confirm Splide carousels render correctly with `direction: 'rtl'`
- [ ] Confirm Before/After slider handles RTL correctly
- [ ] Confirm mega menu columns and dropdowns mirror correctly

### 12.5 Structured Data
- [ ] `Product` schema on product pages (name, image, price, availability, sku)
- [ ] `BreadcrumbList` schema on all pages with breadcrumbs
- [ ] `Article` schema on article pages
- [ ] `Organization` or `WebSite` schema on the homepage

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
- [ ] 5 locale files complete with no missing translation keys
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
  