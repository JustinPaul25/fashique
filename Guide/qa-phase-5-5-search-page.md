# QA checklist — Phase 5.5 (search)

Use this when validating `templates/search.json`, `sections/search.liquid`, `sections/predictive-search.liquid`, `assets/section-search.js`, `snippets/article-card.liquid`, `snippets/article-card-styles.liquid`, and related assets after changes or before release.

**Plan reference:** [theme-development-path.md § 5.5](./theme-development-path.md) — Search Page.

**Dependencies:** Full storefront search and predictive behavior depend on **Search & Discovery** and catalog/content being indexed. Predictive search requires a [supported buyer language](https://shopify.dev/docs/api/ajax/reference/predictive-search#supported-languages).

---

## Setup

- [ ] Run `shopify theme check` — zero errors (warnings acceptable per team policy).
- [ ] On a dev store, confirm the **search template** opens at `/search` and returns **products**, **articles**, and **pages** when those resources exist.
- [ ] Test with JavaScript **on** and **off** (predictive is JS-enhanced; the form still submits to full search without JS).

---

## Theme editor & section settings

- [ ] **Enable predictive search** on/off: when off, no dropdown requests and no predictive panel; submit still works.
- [ ] **Results per page** changes how many unified results load per pagination step.
- [ ] **Show vendor** / **Show quick view** affect **product** hits only (article/page hits unchanged).
- [ ] **Color scheme** and **section spacing** behave like other sections.

---

## Search form & query

- [ ] **Search input** is pre-filled with `search.terms` after a search is performed.
- [ ] Submitting the form navigates to `routes.search_url` with `q` set; results update.
- [ ] **Placeholder** and **submit** labels use translations.

---

## Predictive search (typing)

- [ ] With predictive **on**, typing **2+ characters** triggers suggestions (debounced); **Escape** clears the panel; click outside closes it.
- [ ] Suggestions include **products** (thumbnails + `snippets/price.liquid`) and, when returned by the API, **articles**, **collections**, and **pages**.
- [ ] Choosing a suggestion link navigates correctly; panel does not trap focus in a broken way (spot-check).
- [ ] Empty predictive state shows translated “no matches yet” style copy when the API returns no resources.
- [ ] **Reduced risk:** no duplicate `section_id` conflicts; `sections/predictive-search.liquid` is **not** added to JSON templates (API-only).

---

## Results grid

- [ ] **Product** results render via **`snippets/product-card.liquid`** (not a custom minimal card).
- [ ] **Article** results render via **`snippets/article-card.liquid`**.
- [ ] **Page** (and other) results render a readable title block with **Page** kicker where applicable.
- [ ] **Pagination** appears when results exceed the configured page size; links work.

---

## No-results state

- [ ] Zero hits shows **no-results** messaging and **suggested CTAs** (all products, collections, home).
- [ ] Copy uses `search.*` translation keys (no hardcoded user-facing English in Liquid except where keys are missing).

---

## Accessibility & keyboard

- [ ] Search field has an associated **label** (visually hidden).
- [ ] **aria-expanded** / **aria-controls** on the input when predictive is enabled (spot-check in DevTools).
- [ ] **Status** region (`aria-live="polite"`) updates when suggestions refresh (if `data-live-msg` is set).
- [ ] **Focus visible** on submit, suggestion links, and product cards.

---

## Localization

- [ ] Spot-check `locales/en.default.json` keys under `search.*` for new strings.
- [ ] Optional: second-locale smoke test for search strings and predictive copy.

---

## Regression smoke

- [ ] Header **search drawer** / nav links to search still behave if you touched shared CSS or routes.
- [ ] No unexpected **console errors** on `/search` (aside from known third-party scripts).

---

## Sign-off

| Date | Tester | Store / theme | Browsers / devices | Pass / fail | Notes |
|------|--------|---------------|--------------------|-------------|-------|
|      |        |               |                    |             |       |
