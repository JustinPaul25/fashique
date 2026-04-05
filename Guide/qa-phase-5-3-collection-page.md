# QA checklist — Phase 5.3 (collection page)

Use this when validating `templates/collection.json`, `sections/collection.liquid`, `snippets/collection-filters.liquid`, `snippets/collection-filter-chips.liquid`, `assets/section-collection.js`, and related snippets after changes or before release.

**Plan reference:** [theme-development-path.md § 5.3](./theme-development-path.md) — Collection Page.

**Dependencies:** Storefront filtering requires filters to be configured in the admin (typically **Search & Discovery**). Shopify does not render `collection.filters` for collections with **more than 5,000 products**.

---

## Setup

- [x] Run `shopify theme check` — zero errors (warnings acceptable per team policy).
- [ ] Use a collection with **enough products** to span multiple pages (pagination / infinite scroll).
- [x] Use a collection with **filters enabled** (availability, price, variant options, swatch presentation, image presentation where configured).
- [x] Test **filtered URL** state (query string preserved) and **direct reload** on a filtered view.
- [x] Test on a **password-protected** or **live** dev store where possible.

---

## Theme editor & section settings

- [x] **Color scheme** and **section spacing** change the section appearance as expected.
- [x] **Show breadcrumbs** on/off works in context of global breadcrumb behavior.
- [ ] **Show collection image** on/off; banner **aspect ratio** options (21:9, 16:9, 3:1) look correct and image does not distort critically on mobile.
- [x] **Product columns on desktop** (3 vs 4) updates the grid; **narrow / tablet** still matches theme intent (3 columns for 4-col setting where breakpoints apply; 2 columns on small screens).
- [x] **Products per page** (12 / 24 / 36) changes page size; `Load more` / infinite scroll still behave.
- [x] **Show filters** off: sidebar and mobile filter control hidden; chips still work if filters are active via URL (clear via chip or URL).
- [x] **Show vendor** on product cards on/off.

---

## Header & merchandising

- [x] **Collection title** renders; special characters escaped safely in the title.
- [x] **Description** (`collection.description`) renders as rich text where Shopify supplies HTML; layout does not break the page width.
- [x] With **no description**, no empty gap or broken heading stack.

---

## Breadcrumbs

- [x] **Breadcrumb** trail is correct for the collection context (Home → collection title).
- [x] `aria-label` on the breadcrumb nav matches translations.

---

## Active filters (chips)

- [x] **Chips** appear when filters are active (including **price range** if applied).
- [x] Each chip **removes** only its facet; **Clear all** returns to unfiltered collection URL.
- [x] Chips remain **visible on mobile** above the grid (not only inside the drawer).

---

## Filter sidebar & drawer (Storefront Filtering API)

- [x] **Desktop:** filter panel is visible in the sidebar, scrollable if tall; **sticky** behavior does not obscure the viewport badly on long pages.
- [x] **Mobile:** **Filter** button opens the drawer; **backdrop** closes it; **Close** control works; **Escape** closes and returns focus sensibly; **body scroll** locks while open.
- [x] **Boolean** filters: checkboxes apply and clear as expected.
- [x] **List** filters (text): values, counts, disabled zero-count states behave; group **Clear** / remove links work.
- [x] **Swatch** presentation: color / pattern / image swatches render when Search & Discovery provides them; fallback is acceptable when swatch data is missing.
- [x] **Image** presentation: thumbnail + label; selection state visible.
- [x] **Price range:** min / max fields submit with **Apply**; currency display matches store; clearing price filter works.
- [x] **Checkbox** changes **auto-submit** the form (full page reload with updated results).
- [x] **Sort order** is preserved when submitting filter changes (hidden `sort_by` field).

---

## Sort

- [x] **Sort** dropdown lists all `collection.sort_options`.
- [x] Changing sort updates the URL (`sort_by`) and **preserves active filters** where Shopify merges query parameters.
- [x] Current sort matches the selected option after reload.

---

## Product grid & cards

- [x] Grid uses **`snippets/product-card.liquid`**; cards match styling used elsewhere (featured collection, etc.).
- [x] **Hover / quick view** (if enabled on cards) does not break layout on collection page.
- [x] **Empty state** when no products match filters: message + link to reset view is correct.

---

## Grid / list toggle

- [x] **Grid** and **list** buttons toggle layout; `aria-pressed` reflects the active mode.
- [x] **List** layout: card becomes horizontal row; image and text remain readable on narrow screens.
- [x] Preference **persists** across navigations in the same tab (`sessionStorage`) without breaking first paint.

---

## Pagination, infinite scroll & Load more (feature #11)

- [x] **Load more** link appears when there is a next page; shows **“Showing X of Y”** copy from translations.
- [x] With **JavaScript on** and **prefers-reduced-motion: no:** scrolling near the sentinel **loads the next page** and **appends** products without full navigation.
- [x] After the last page, control updates to **“All items shown”** (or pagination UI is removed) without duplicate fetches.
- [x] With **`prefers-reduced-motion: reduce`:** infinite scroll does not auto-fetch; **Load more** still navigates or loads next page per implementation.
- [x] With **JavaScript off:** **Load more** is a normal link to the next URL (progressive enhancement).

---

## Accessibility & keyboard

- [ ] **Focus visible** on sort select, layout toggles, filter controls, drawer open/close, chips, Load more.
- [ ] Filter drawer **focus management** is acceptable (no invisible focus trap dead ends).
- [ ] Swatch / image filter inputs remain **keyboard operable** with labels or visually hidden text.

---

## Localization

- [ ] No hardcoded customer-facing strings that should use `{{ '…' | t }}` (spot-check `locales/en.default.json` keys under `collections.*` and `pagination.*`).
- [ ] Optional: second locale smoke test for filter labels (admin-driven) and theme strings.

---

## Regression smoke

- [ ] No unexpected **console errors** on collection load (aside from known third-party scripts).
- [ ] **`snippets/pagination.liquid`**, **`product-card.liquid`**, **`breadcrumbs.liquid`** — other templates using them still behave if shared code changed.

---

## Sign-off

| Date | Tester | Store / theme | Browsers / devices | Pass / fail | Notes |
|------|--------|---------------|--------------------|-------------|-------|
|      |        |               |                    |             |       |
