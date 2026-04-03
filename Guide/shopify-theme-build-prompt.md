# Shopify Theme Build Prompt

Use the prompt below when working with an AI assistant or briefing a developer to build a fully-featured, Theme Store-ready Shopify theme from scratch.

---

## Prompt

You are an expert Shopify theme developer. Build a complete, production-ready Shopify theme using the **Skeleton Theme** (`shopify theme init`) as the starting codebase. The theme must be eligible for submission to the **Shopify Theme Store** and must include all of the features listed below.

---

### Theme Vision & Target Market

Focus on building a **conversion-driven, premium Shopify theme tailored for fashion and beauty brands**. This category has the highest demand on the Shopify Theme Store due to its strong emphasis on visual design, brand storytelling, and a customer base that is willing to invest in high-quality, polished themes.

The theme must combine three core pillars:

#### 1. Modern, Aesthetic Design — Image-First & Storytelling-Focused
- Lead with full-bleed imagery, editorial-style layouts, and generous whitespace
- Support large hero sections, lookbook-style collection grids, and campaign image blocks
- Typography should feel elevated — support expressive heading fonts paired with clean body text using the `font_picker` setting
- Color schemes must support both light and dark modes with a minimum of 4 configurable color schemes
- Every section should feel intentional — designed to tell a brand's visual story, not just display products

#### 2. High Conversion Features
- **Sticky Add-to-Cart bar** — A persistent bar fixed to the bottom of the viewport on product pages, showing the product title, selected variant, price, and an Add to Cart button. Activates after the main Add to Cart button scrolls out of view
- **Upsell & Cross-sell blocks** — Post-add-to-cart upsell modal or cart drawer upsell row showing frequently bought together or complementary products using Shopify's product recommendations API
- **Testimonials section** — A configurable section for displaying customer reviews with star ratings, reviewer name, and optional photo; supports carousel and grid layouts — carousel mode must use **Splide**
- **UGC (User-Generated Content) section** — An Instagram-style shoppable photo grid where each image can be linked to a product; supports manual image upload via theme settings
- All conversion features must be built natively — no third-party app dependencies

#### 3. Mobile-First Performance — Fast, Lightweight & Optimized UX
- Design and build all layouts mobile-first, then enhance for desktop
- Lazy load all images using native `loading="lazy"` and responsive `srcset`
- Defer all non-critical JavaScript; use dynamic `import()` for feature modules loaded on interaction
- Minimize layout shifts (target CLS < 0.1) by reserving space for images and dynamic elements
- Avoid render-blocking resources — inline only critical CSS; load everything else asynchronously
- Target a minimum **Lighthouse Performance score of 70** on mobile (above the Theme Store's minimum of 60)
- Touch targets must be at least 48×48px on mobile for all interactive elements
- Test and optimize for single-handed mobile use: key actions (Add to Cart, variant selection, navigation) reachable within thumb range

---

### Project Setup

- Initialize the project using `shopify theme init` and the official Shopify Skeleton Theme as the base
- Use **Liquid** for all templating and server-rendered HTML
- Use **native CSS** only — no Sass, no `.scss` files
- Use **vanilla JavaScript** or lightweight web components — no jQuery or heavy frameworks
- All code must be original and not derived from Dawn, Horizon, or any other existing Theme Store theme
- Follow Shopify's [Online Store 2.0](https://shopify.dev/docs/storefronts/themes/architecture) architecture: JSON templates, section groups, blocks, and app blocks
- Build the editing experience as a **block-based system inspired by Horizon's flexibility**: merchants should be able to compose pages by adding, reordering, and configuring modular blocks with sensible defaults and preset block combinations
- Use **[Splide](https://splidejs.com/)** as the slider/carousel library for all sliding and carousel functionality across the theme

#### Splide Integration Rules

- Include Splide as a hosted asset in the `/assets` folder — do **not** load it from a CDN to ensure reliability and Theme Store compliance
- Load Splide's CSS and JS **only on pages and sections that use a slider** — do not include it globally
- Use Splide for:
  - The main hero/slideshow section
  - Product image gallery carousel on the product page
  - Testimonials carousel
  - Featured collection product carousels
  - Any other section with horizontal scrolling or slide behavior
- Initialise each Splide instance inside a scoped JavaScript module that checks for the presence of the slider element before running
- All Splide instances must be fully **keyboard accessible** and **ARIA-compliant** — use Splide's built-in `accessibility: true` option
- Respect `prefers-reduced-motion` — disable autoplay and transitions for users who have reduced motion enabled:
  ```javascript
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  new Splide(el, {
    autoplay: !prefersReducedMotion,
    // ...
  }).mount();
  ```
- Splide version must be pinned in the asset file — do not use `@latest` or unpinned references

---

### Required Features to Implement

Implement each of the following features as self-contained, modular **sections** or **blocks** that are configurable from the Shopify theme editor:

#### 1. Account Menu
- Display a customer account icon/link in the header
- Show login, register, and account dashboard links
- When logged in, display the customer's name and a logout option
- Use Shopify's `customer` Liquid object and `routes` object for all URLs

#### 2. Age Verifier
- Show a full-screen overlay on first visit requiring the customer to confirm their age
- Configurable minimum age (e.g., 18+, 21+) via theme settings
- Store confirmation in a cookie or `localStorage` to avoid repeated prompts on the same session
- Include a customizable heading, subheading, confirm button label, and decline redirect URL

#### 3. Back-to-Top Button
- A floating button that appears after the user scrolls a configurable distance down the page
- Smooth scrolls back to the top when clicked
- Toggleable from theme settings (show/hide)
- Accessible — includes `aria-label` and keyboard support

#### 4. Before/After Image Slider
- A section with a draggable vertical or horizontal divider between two images
- Used to compare product states (e.g., before/after, clean/worn, day/night)
- Configurable: image pair, divider orientation, label text for each side
- Fully accessible with keyboard drag support
- If multiple before/after pairs are shown in a sequence, use **Splide** to handle the slide navigation between pairs

#### 5. Breadcrumbs
- Display a breadcrumb trail on collection, product, blog, article, and page templates
- Use Liquid's `request.page_type` and template context to generate the correct hierarchy
- Configurable visibility per template in theme settings
- Uses semantic `<nav aria-label="Breadcrumb">` and structured data (`BreadcrumbList` schema)

#### 6. Color Swatches
- On product and collection pages, display color/material variants as visual swatches
- Support both hex color swatches and image-based swatches using Shopify's `swatch` object (`swatch.color`, `swatch.image`)
- Clicking a swatch updates the selected variant and the product image
- Tooltip on hover showing the variant option name

#### 7. Combined Listing
- Group related products (e.g., different sizes of the same item) under a single product listing
- Allow customers to switch between related products from one product page
- Configurable via a metafield or product tags linking related products together

#### 8. Countdown Timer
- A section or block displaying a live countdown to a configurable end date and time
- Use cases: flash sales, product launches, limited-time offers
- Display days, hours, minutes, and seconds
- Option to hide the timer or show a custom message once the countdown reaches zero
- Configurable via theme settings: end date/time, label, expired message

> **Note:** The countdown timer must display real, accurate time data. Do not use fake or misleading urgency timers — this violates Shopify Theme Store policy.

#### 9. EU Translations (EN, FR, IT, DE, ES)
- All theme UI strings must be fully translatable via Shopify's locale system
- Provide complete `.json` locale files for:
  - `en.default.json` (English)
  - `fr.json` (French)
  - `it.json` (Italian)
  - `de.json` (German)
  - `es.json` (Spanish)
- All customer-facing strings (buttons, labels, messages, ARIA labels) must use `{{ 'key' | t }}` translation filters — no hardcoded strings
- Include a language selector in the header/footer using Shopify's `localization` object

#### 10. In-Menu Promos
- Support promotional content (image, text, CTA button) displayed inside the navigation mega menu or dropdown
- Configurable per menu item via theme settings or metafields
- Use cases: highlight sale collections, new arrivals, or featured products inside navigation

#### 11. Infinite Scroll
- On collection and search pages, automatically load the next page of products as the user scrolls to the bottom
- Use the Intersection Observer API to detect scroll position
- Fallback: a "Load more" button for users with JavaScript disabled
- Toggled via theme settings (infinite scroll vs. pagination)

#### 12. Mega Menu
- A full-width multi-column dropdown navigation menu
- Configurable columns linking to collections, pages, or custom URLs
- Supports optional featured image or promotional block per menu group
- Accessible: keyboard-navigable with `aria-expanded`, `aria-haspopup`, and focus trapping

#### 13. Quantity Pricing (Tiered / Volume Pricing)
- Display tiered pricing on product pages (e.g., buy 1–4 @ $10, buy 5–9 @ $8, buy 10+ @ $6)
- Dynamically update displayed price when the customer adjusts the quantity selector
- Configured via product metafields for price tiers

#### 14. Quick Order List
- A table-style interface on collection or custom pages allowing customers to add multiple variants of multiple products to the cart at once
- Displays product name, image, variant selectors, price, and quantity input per row
- A single "Add all to cart" button submits all selected items

#### 15. Quick View
- A modal/overlay triggered from product cards on collection and search pages
- Displays the product title, images, variant selectors, price, and an Add to Cart button without navigating away from the page
- Accessible modal with focus trap, `aria-modal`, and `Escape` key to close
- Configurable: enable/disable per theme settings

#### 16. Right-to-Left (RTL) Support
- The theme layout must fully support RTL languages (e.g., Arabic, Hebrew)
- Use CSS logical properties (`margin-inline-start`, `padding-inline-end`, etc.) throughout
- Add `dir="rtl"` to the `<html>` element when the active locale is RTL
- Test all components (navigation, sliders, forms, grids) for correct RTL rendering

#### 17. Sign in with Shop
- Integrate Shopify's **Sign in with Shop** one-tap login on the customer login page and at checkout
- Use the `login_button` Liquid filter to render the branded button
- Do not modify the branded button colors or styling

#### 18. Sticky Header
- The header remains fixed/visible at the top of the viewport as the user scrolls
- Options: always sticky, or only sticky on scroll-up (hide on scroll-down to save space)
- Includes a compact/mini header variant that activates on scroll to reduce height
- Configurable via theme settings

#### 19. Stock Counter
- On product pages, display a low-stock indicator when inventory falls below a configurable threshold (e.g., "Only 3 left!")
- Use `variant.inventory_quantity` and `variant.inventory_policy`
- Updates dynamically when the selected variant changes
- Configurable: threshold quantity, message text, show/hide toggle

#### 20. Swatch Filters
- On collection pages, allow customers to filter products by color or material using visual swatch buttons in the filter sidebar
- Integrate with Shopify's [Storefront Filtering API](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering)
- Swatches update the URL parameters and re-render the product grid without a full page reload

---

### General Implementation Requirements

- All sections must be configurable in the Shopify theme editor with clearly labeled settings
- Use `schema` blocks and `presets` for all sections
- Prioritize block-first composition across templates and sections: each major content area should be assembled from reusable blocks, and blocks must be easy to add/reorder/remove in the editor
- All interactive components must be fully **keyboard accessible** and use proper **ARIA attributes**
- Theme must achieve a minimum **Lighthouse Performance score of 60** and **Accessibility score of 90** across product, collection, and home pages
- All images must use responsive `srcset` and lazy loading
- JavaScript must be modular — load only what is needed per page using `defer` or dynamic imports
- No inline styles — use CSS custom properties for theming
- All locale strings must use the `{{ 't' }}` filter — no hardcoded UI text
- Follow the [Shopify Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) for all templates, sections, blocks, SEO, and accessibility standards

---

### Theme Settings — Core Design Principles

The guiding principle for all theme settings is: **Don't make users think. Make decisions for them.**

Every setting decision should aim to:
- Reduce confusion
- Reduce clicks
- Prevent broken layouts

---

#### 1. Preset-Based Setup

Do not expose 100+ raw settings to the user on a blank theme. Instead, provide **named starting points** that pre-configure the entire theme instantly.

Required presets:

| Preset Name | Character |
|---|---|
| **Fashion Brand** | Editorial, image-led, dark tones, serif headings |
| **Beauty Store** | Soft palette, rounded UI, feminine feel, clean grid |
| **Minimal Store** | Lots of whitespace, neutral colors, understated typography |
| **Bold Promo Store** | High contrast, strong CTAs, urgency-focused layout |

Each preset must:
- Preload a complete color scheme
- Set typography pairings (heading + body font)
- Set spacing scale (Compact / Balanced / Spacious)
- Pre-configure sections on `index.json` with realistic demo content

> **Why it works:** Beginners do not know what to choose. Presets remove that friction instantly and give the theme a strong install-state out of the box.

---

#### 2. Organize Settings Like a Story, Not a Technical Spec

Structure `settings_schema.json` categories around **what the merchant is trying to do**, not around what the setting technically controls.

Do not use:
- "Typography"
- "Layout"
- "Sections"

Use instead:

| Category Label | What it covers |
|---|---|
| **Branding** | Logo, favicon, brand colors |
| **Homepage** | Hero, featured collections, announcements |
| **Product Page** | Media layout, buy buttons, trust badges |
| **Cart & Checkout** | Cart type, upsell, notes |
| **Colors & Style** | Color schemes, button styles, typography |

---

#### 3. Limit Choices — Guide, Don't Overwhelm

Too many options cause decision paralysis. Curate choices down to the essentials.

| Setting | Instead of this | Do this |
|---|---|---|
| Fonts | 10+ individual font options | 2–3 curated font pairs |
| Spacing | Free-range pixel sliders | Compact / Balanced / Spacious |
| Button style | 15 style variations | Solid / Outline |
| Color inputs | Unlimited free inputs | 4–6 named color scheme slots |

> You are not limiting the merchant — you are **guiding** them toward decisions that look good.

---

#### 4. Use Visual Selectors Over Dropdowns

Wherever possible, replace text dropdowns with visual controls so merchants can **see the result before selecting**.

- Use image preview cards for layout choices
- Use toggle buttons for binary options (e.g., Left / Center / Right)
- Use style card selectors for button and section variations

Example: instead of a dropdown labeled `Button Style: [Solid ▾]`, render two clickable preview cards:

```
[ Solid Button ]   [ Outline Button ]
```

> Users make faster, more confident decisions when they can see the outcome.

---

#### 5. Smart Defaults — Look Great Out of the Box

The default state of the theme (before the merchant changes anything) must be:
- Visually clean and balanced
- Conversion-ready
- Fully populated with demo-quality placeholder content

> **Rule:** 80% of merchants should not need to change any settings to have a store they are proud of. The theme should look complete on install.

---

#### 6. Section-Level Setting Structure

Inside every section's schema, follow this consistent order to keep the editor predictable:

1. **Content** — text fields, image pickers, links
2. **Layout** — alignment toggles, column count, image ratio
3. **Style** — color scheme selector, padding scale, visibility toggles

Never mix these categories randomly. Consistent structure trains merchants to know where to look.

---

#### 7. Use "Recommended" Tags to Reduce Decision Anxiety

In section presets and setting info text, use subtle guidance labels to steer merchants toward proven choices:

- `Recommended for most stores`
- `Best for conversion`
- `Most used layout`

Use the `info` property in `settings_schema.json` to add one-line guidance beneath settings where merchants commonly get confused.

---

#### 8. Pre-Built Section Blocks

Do not make merchants build layouts from scratch. Ship the theme with ready-to-use pre-configured blocks that merchants simply add, then swap in their own content.

Required pre-built blocks:

- Hero Banner (full-bleed image + heading + CTA)
- Testimonial row / carousel
- Product highlights (image + feature list)
- Before/After image comparison
- UGC photo grid
- Announcement bar

Merchant workflow must feel like: **Add block → Edit text → Publish.**

---

#### 9. Inline Help — Short, Contextual, and Scannable

Do not rely on external documentation for basic settings. Use `info` fields in the schema for one-line plain-language descriptions on any setting that could confuse a beginner.

Format: `"[Setting name] – [plain-language explanation of what it does]"`

Example:
```
"Sticky Add to Cart – keeps the buy button visible while the customer scrolls the product page"
"Spacious – adds more breathing room between sections for a premium feel"
```

Keep descriptions under 12 words. Do not use technical jargon.

---

#### 10. Prevent Layout Mistakes Proactively

Beginners frequently break layouts with extreme values. The theme must protect against this at the schema level.

- Use `min` and `max` constraints on all range inputs (e.g., padding max: `80`, font size max: `72`)
- Prefer `select` inputs over `text` inputs wherever the set of valid values is finite
- Use `range` inputs with defined steps instead of free-form number inputs for spacing, sizes, and opacity
- Never expose raw CSS or pixel values directly — abstract them into named options (Compact / Balanced / Spacious)

> Ask yourself: *"What decisions can I remove?"* — not *"What settings should I add?"*

---

#### Settings Design Formula

The theme settings experience must feel like a three-step flow:

```
Fill in your content  →  Choose a style  →  Publish
```

Every setting added must justify itself against this formula. If a setting makes the flow longer or more confusing without a meaningful payoff, remove it.

---

### Deliverables

1. A complete Shopify theme folder structure ready to run with `shopify theme dev`
2. All 20 features implemented as modular sections or blocks
3. Locale files for EN, FR, IT, DE, and ES
4. A `settings_schema.json` with all theme-level settings organized and labeled
5. A `settings_data.json` configured to match a realistic demo store install state
6. All required templates: `index.json`, `product.json`, `collection.json`, `cart.json`, `blog.json`, `article.json`, `page.json`, `page.contact.json`, `search.json`, `404.json`, `password.json`, `list-collections.json`, `gift_card.liquid`

---

### References

- [Shopify Theme Store Requirements](https://shopify.dev/docs/storefronts/themes/store/requirements)
- [Shopify Theme Architecture](https://shopify.dev/docs/storefronts/themes/architecture)
- [Shopify CLI — theme init](https://shopify.dev/docs/api/shopify-cli/theme/theme-init)
- [Liquid Reference](https://shopify.dev/docs/api/liquid)
- [Storefront Filtering API](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering)
- [Shopify Skeleton Theme](https://github.com/shopify/skeleton-theme)
