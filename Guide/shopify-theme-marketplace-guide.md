# How to Create and Publish a Shopify Theme to the Theme Marketplace

> **Source:** [Shopify Developer Docs — Create a theme](https://shopify.dev/docs/storefronts/themes/getting-started/create) | [Theme Store Requirements](https://shopify.dev/docs/storefronts/themes/store/requirements)

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1 — Initialize Your Theme](#2-step-1--initialize-your-theme)
3. [Step 2 — Start a Local Development Server](#3-step-2--start-a-local-development-server)
4. [Step 3 — Upload Your Theme to a Store](#4-step-3--upload-your-theme-to-a-store)
5. [Step 4 — Publish Your Theme](#5-step-4--publish-your-theme)
6. [Theme Store Requirements](#6-theme-store-requirements)
   - [Exclusivity](#61-exclusivity)
   - [Uniqueness](#62-uniqueness)
   - [Design & UX](#63-design--ux)
   - [Required Features](#64-required-features)
   - [Templates, Sections & Blocks](#65-templates-sections--blocks)
   - [Performance & Accessibility](#66-performance--accessibility)
   - [Page Requirements](#67-page-requirements)
   - [Browser Compatibility](#68-browser-compatibility)
   - [Assets](#69-assets)
   - [SEO](#610-seo)
   - [Accessibility Standards](#611-accessibility-standards)
   - [Settings & Naming](#612-settings--naming)
   - [Demo Stores](#613-demo-stores)
   - [Documentation & Support](#614-documentation--support)
7. [Theme File Structure](#7-theme-file-structure)
8. [Next Steps](#8-next-steps)

---

## 1. Prerequisites

Before creating a Shopify theme, ensure you have the following ready:

- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) installed on your machine
- A [development store](https://shopify.dev/docs/storefronts/themes/tools/development-stores) (recommended for testing)
- The URL of the store you want to work on (e.g., `example.myshopify.com`)
- A [collaborator account](https://shopify.dev/docs/storefronts/themes/tools/collaborator-accounts) or staff account with the **Manage themes** or **Themes** permission — or you are the store owner

> **Note:** To use a dev store with Shopify CLI, you must be the store owner or have a staff account. If you create the dev store yourself, you are automatically assigned as the owner.

---

## 2. Step 1 — Initialize Your Theme

Use `shopify theme init` to clone the [Skeleton theme](https://github.com/shopify/skeleton-theme) Git repository to your local machine.

The **Skeleton theme** is Shopify's minimal, officially approved starting point — the only accepted base for Theme Store submissions. It is built for modularity, maintainability, and Shopify best practices.

```bash
shopify theme init
```

When prompted, enter a name for your theme (e.g., `my-new-theme`). The theme will be cloned into a folder with that name.

Then navigate into the theme folder:

```bash
cd "my-new-theme"
```

> **Tip:** You can also clone from another Git repository by passing a `--clone-url` flag to the `init` command.

---

## 3. Step 2 — Start a Local Development Server

Run the development server to preview your theme in a browser with live hot reloading:

```bash
shopify theme dev --store my-store
```

- Replace `my-store` with your store's `.myshopify.com` subdomain.
- The first time you run this command, you will be prompted to log in to Shopify.
- Open **Google Chrome** and navigate to `http://127.0.0.1:9292` to view the live preview.
- Local changes to CSS and sections hot-reload automatically.

> **Note:** The `--store` flag only needs to be passed the first time. The selected store is saved for future commands. Run `shopify theme info` to check which store is currently connected.

---

## 4. Step 3 — Upload Your Theme to a Store

Push your theme code to Shopify to create a permanent hosted copy.

**First upload (as an unpublished theme):**

```bash
shopify theme push --unpublished
```

You will be prompted to name the theme as it appears in the theme library.

**Subsequent updates:**

```bash
shopify theme push
```

---

## 5. Step 4 — Publish Your Theme

Once all changes are pushed, publish the theme to make it live on the store:

```bash
shopify theme publish
```

1. Select the theme you want to publish from the list.
2. Confirm with `Yes`.

The theme is now the active theme on the store.

---

## 6. Theme Store Requirements

To list your theme on the [Shopify Theme Store](https://themes.shopify.com/), it must pass a thorough review. All requirements below must be met before submission.

---

### 6.1 Exclusivity

- Themes listed on the Shopify Theme Store must **only** be distributed through the Shopify Theme Store.
- Themes must **not** be listed on any other marketplace.
- Themes must **not** include designer credits, developer website links, or affiliate links in theme files.

---

### 6.2 Uniqueness

Your theme must be fundamentally different from any other theme on the Shopify Theme Store — including your own previously listed themes.

- Uniqueness is measured across the overall experience on core templates and elements.
- Component and library reuse is acceptable, but the overall assembly must be substantially different.
- Cosmetic changes are insufficient (e.g., spacing tweaks, color swaps, gradients, animations, or adding a few sections to an existing theme).
- Uniqueness must be embedded at the architectural level.

> **Important:** Only the [Skeleton Theme](https://github.com/shopify/skeleton-theme) is the approved starting codebase. Themes built on or derived from Dawn or Horizon are **not eligible** for the Theme Store.

---

### 6.3 Design & UX

Your theme must demonstrate professional-level visual design and user experience across all areas:

**Visual Design**
- Unique, intentional art direction targeting a specific merchant type or industry
- High-quality images, graphics, and icons — no blurry, stretched, or pixelated visuals
- A cohesive, complementary color palette

**Layout**
- Clear, logical grid structure with deliberate spacing and alignment
- Strong content hierarchy using size, color, contrast, and position
- Layouts must remain visually appealing regardless of content length or image count

**Consistency**
- Consistent font pairing throughout the theme (avoid excessive font variety)
- Uniform interactive element styles (buttons, links, forms)
- Settings must be clearly organized and easy to use in Shopify Admin

**Shopping Experience**
- Frictionless navigation from homepage to product discovery, cart, and checkout
- Intuitive product discovery through menus, collections, and recommendations
- Smooth interactions for selecting variants, adjusting quantities, and adding to cart

**Demo Store**
- A fully realistic demo store with professional images, real text (no "Lorem Ipsum"), and intentional product displays
- All sections must logically fit the portrayed business type

---

### 6.4 Required Features

Every theme submitted to the Theme Store must include the following features:

| Feature | Description |
|---|---|
| Sections Everywhere | All templates must support sections (Online Store 2.0) |
| Discounts | Display discount amounts in cart, checkout, and order templates |
| Accelerated Checkout Buttons | Required on product pages and cart pages (default: enabled) |
| Faceted Search Filtering | Filter by availability, price, type, vendor, and variant options on collection and search pages |
| Gift Cards | A `gift_card.liquid` template that renders the gift card page |
| Image Focal Points | Support the focal point setting from `image_picker` |
| Social Sharing Images | Include a `page_image` object for social media thumbnails |
| Country Selection | Customers must be able to select their currency and country/region |
| Language Selection | Customers must be able to select their preferred language |
| Multi-level Menus | Support nested (drop-down) navigation menus |
| Newsletter Forms | Include a newsletter signup to collect customer emails |
| Pickup Availability | Show local pickup availability on product pages |
| Related Product Recommendations | Automatically generated related products section on product pages |
| Complementary Products | Display complementary product recommendations on product pages |
| Rich Product Media | Support 3D models, embedded videos, Vimeo, and YouTube |
| Search Box | A search template with predictive search functionality |
| Selling Plans | Show selling plan details in the cart and on customer order pages |
| Shop Pay Installments | Show the Shop Pay Installments banner on the product page |
| Unit Pricing | Show unit prices on collection, product, cart, and customer pages |
| Variant Images | Associate and display images with product variants |
| Follow on Shop | Include a Follow on Shop button using the `login_button` Liquid filter |

---

### 6.5 Templates, Sections & Blocks

**Required templates:**

```
theme.liquid (layout)
404.json
article.json
blog.json
cart.json
collection.json
index.json
list-collections.json
page.json
page.contact.json
password.json
product.json
search.json
gift_card.liquid
settings_data.json (config)
settings_schema.json (config)
```

**Section requirements:**
- All templates must support sections (JSON templates), except Customer Account, Gift Card, and Checkout pages.
- Must include a **Custom Liquid section** with a `liquid` setting type, available on all section-supporting templates.
- Header and footer sections must be rendered within **section groups**.

**Block requirements:**
- Most elements on the main product section must be implemented as individual blocks.
- Must support **app blocks** (`@app` type) in the main product section and featured product section.
- Must include **Custom Liquid blocks** wherever app blocks are supported.

> **Note:** Do not include the `config/markets.json` file when submitting.

---

### 6.6 Performance & Accessibility

| Metric | Minimum Score |
|---|---|
| Lighthouse Performance (product, collection, home page — desktop and mobile) | Average ≥ 60 |
| Lighthouse Accessibility (product, collection, home page — desktop and mobile) | Average ≥ 90 |

Tests are run against a [benchmark dataset](https://shopify.dev/docs/storefronts/themes/best-practices/performance#run-a-lighthouse-audit-using-shopify-data). Sections must contain actual images and content when verifying scores.

---

### 6.7 Page Requirements

Each page type has specific content and functionality requirements. Key highlights:

**Product Page**
- Must display: `product.title`, `variant.price`, `variant.unit_price`, compare-at price, `product.description`, option names and values
- All product images must be displayed and viewable
- Must include: product recommendations, rich media, accelerated checkout, pickup availability, Shop Pay Installments
- Color/material options must support swatches using `swatch.image` and `swatch.color`

**Collection Page**
- Must output: `collection.title`, `collection.description`, `collection.image`
- Product grid must include: title, price, images, unit price, and at least one media item
- Must support: sorting, empty collection message, sale badges, price ranges, and pagination or lazy loading

**Cart Page**
- Must display: line item title, unit price, image, final price, quantity, and options
- Must show `cart.total_price` and tax-inclusive price indication
- Must include: checkout button, quantity editing, cart notes, selling plans, discount codes, and accelerated checkout

**Blog & Article Pages**
- Blog must show: `blog.title` and article excerpts with pagination
- Articles must show: title, comments (paginated), `article.published_at`

**Gift Card Page**
- Must support Apple Wallet passes
- Must show: gift card code, QR code (min 120×120px), and shop logo or name

**Password Page**
- Must include: shop logo or name, `shop.password_message`, and a password entry form

---

### 6.8 Browser Compatibility

**Desktop (latest releases):**
- Safari (last 2 releases, Mac)
- Chrome (last 3 releases, Mac & PC)
- Firefox (last 3 releases, Mac & PC)
- Edge (last 2 releases, PC)

**Mobile (latest releases):**
- Theme must be fully **mobile responsive**
- Mobile Safari (last 2 releases, iOS)
- Chrome Mobile (last 3 releases, Android & iOS)
- Samsung Internet (last 2 releases, Android)

**Social/App Webviews:**
- Instagram, Facebook, Pinterest (latest release, Android & iOS)

---

### 6.9 Assets

- Themes must **not** use Sass (no `.scss` or `.scss.liquid` files). Use only native CSS (`.css` or `.css.liquid`).
- Themes must **not** include minified `.css` or `.js` files (except ES6 and third-party libraries). Shopify minifies them automatically.

---

### 6.10 SEO

- Must include theme SEO metadata: title, meta description, and canonical URL
- Must include Google's rich product snippets (validate with [Google's Structured Data Testing Tool](https://developers.google.com/structured-data/testing-tool))
- Must **not** include a `robots.txt.liquid` template

---

### 6.11 Accessibility Standards

- All page areas must be **keyboard accessible**, including dropdown navigation
- Focusable elements must have a **visible focus state**
- All images require an `alt` attribute (use `image.alt` or `image_tag: alt:`)
- Form inputs must have a unique `id` and a matching `<label for>` attribute
- Must be built with **valid HTML**
- Text contrast ratio: **4.5:1** for body text; **3:1** for large text (18pt+) and non-text elements
- Keyboard focus order must follow DOM order (top-to-bottom, left-to-right)
- Touch targets must be at least **24×24 CSS pixels**
- Headings `h1`–`h6` must be visually distinct from each other

---

### 6.12 Settings & Naming

**Settings:**
- All settings must have a `label`
- Must include a favicon setting
- Must have a `theme_info` section in `settings_schema.json`
- Write all section, preset, and category names in **sentence case**
- Use American English spelling (e.g., "color" not "colour", "canceled" not "cancelled")

**Theme and preset naming:**
- Names must be 1–2 words, under 30 characters
- Must be unique and not conflict with existing Shopify Theme Store theme names
- Must not use names of Shopify products, events, company names, platforms, or industry keywords
- One preset must share the parent theme's name

**Font picker:**
- All fonts must use the `font_picker` setting type
- A default font must be specified (e.g., `default: work_sans_n6`)
- CSS must load bold, italic, and bold-italic font variants using the `font_modify` filter
- Custom fonts are not accepted

**Color system:**
- Minimum of **4 colors** required
- Every background color setting must have a corresponding foreground color setting
- Color settings must use `type: color`

---

### 6.13 Demo Stores

- Every theme preset must have at least one demo store
- The demo store must match the primary industry and catalog size the preset is tagged to
- The installed theme must visually match the demo store (layout, colors, typography)
- Demo stores must use **authentic text content** (no Lorem Ipsum)
- Use the [Bogus Gateway](https://help.shopify.com/manual/checkout-settings/test-orders) or Shopify Payments test mode; disable all other checkout options
- You must have appropriate rights for all images and content used in the demo store
- Do not use apps in demo stores (exception: approved free review or translation apps)

---

### 6.14 Documentation & Support

- You must provide **theme documentation** and a **public support contact form** before launching
- Both must be linked from your theme listing page on the Shopify Theme Store
- Documentation must be grammatically correct and consistent with theme settings copy
- You must reply to merchant support requests **within two business days**
- Critical bugs must be fixed immediately or the theme may be temporarily removed

---

## 7. Theme File Structure

A standard Shopify theme (and the required structure for multi-preset submissions) looks like this:

```
.
├── assets/
├── blocks/
├── config/
│   ├── settings_data.json
│   └── settings_schema.json
├── layout/
│   └── theme.liquid
├── locales/
├── listings/                  # Only required for themes with multiple presets
│   ├── preset-name-one/
│   │   ├── templates/
│   │   │   └── *.json
│   │   └── sections/          # Optional
│   │       └── *.json
│   └── another-preset-name/
│       ├── templates/
│       │   └── *.json
│       └── sections/          # Optional
│           └── *.json
├── sections/
├── snippets/
└── templates/
    ├── 404.json
    ├── article.json
    ├── blog.json
    ├── cart.json
    ├── collection.json
    ├── index.json
    ├── list-collections.json
    ├── page.json
    ├── page.contact.json
    ├── password.json
    ├── product.json
    ├── search.json
    └── gift_card.liquid
```

> **Note:** If you only have one preset, the `/listings` folder is not required.

---

## 8. Next Steps

After your theme is ready, consider the following resources before submitting:

- [Learn about theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) — Understand the structure and role of each file and folder
- [Review best practices](https://shopify.dev/docs/storefronts/themes/best-practices) — Build with principles to create great ecommerce experiences
- [Theme Store submission process](https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme) — How to submit your theme for review
- [Performance best practices](https://shopify.dev/docs/storefronts/themes/best-practices/performance) — Optimize your Lighthouse scores before submitting
- [Accessibility best practices](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility) — Ensure your theme is inclusive and accessible
- [Build as a team](https://shopify.dev/docs/storefronts/themes/tools) — Developer tools for collaborative theme development

---

*Last updated: March 2026 | Based on official [Shopify Developer Documentation](https://shopify.dev/docs/storefronts/themes)*
