# QA checklist — Phase 5.4 (cart)

Use this when validating `templates/cart.json`, `sections/cart.liquid`, `snippets/cart-line-item.liquid`, `snippets/cart-drawer.liquid`, `snippets/cart-assets.liquid`, `sections/header.liquid` (cart icon), and `layout/theme.liquid` after changes or before release.

**Plan reference:** [theme-development-path.md § 5.4](./theme-development-path.md) — Cart Page.

**Out of scope for 5.4:** upsell row in cart / cart-drawer upsell (Phase 6).

---

## Setup

- [x] Run `shopify theme check` — zero errors (warnings acceptable per team policy).
- [x] Theme settings: test **`Cart type`** **Page** and **Drawer** separately on a dev store.
- [x] Exercise the cart with **1 item**, **multiple items**, **multiple quantities**, and **sold-out / unavailable** variants if your catalog allows.
- [x] Confirm accelerated checkout (Shop Pay, etc.) appears in admin when applicable; test only if your store is configured for it.

---

## Theme settings (global)

- [x] **Cart type → Page:** header cart icon navigates to **`/cart`** (full page).
- [x] **Cart type → Drawer:** header cart icon **opens the cart drawer** on **home, product, collection**, etc. On **`/cart` itself**, the icon is a **normal link** to the cart page (drawer markup is omitted so there is only one cart form).
- [x] With **drawer** + **prefers-reduced-motion: reduce** (OS setting): header cart icon **navigates to `/cart`** (no drawer intercept).
- [x] With **drawer** + motion allowed: clicking the icon when the drawer is open **closes** it; **Escape** and **backdrop** close; focus returns to a sensible element.

---

## Cart template / section

- [x] **Breadcrumbs** (when enabled): **Home → Your cart**; current page is not a duplicate link (see `snippets/breadcrumbs.liquid`).
- [x] Section settings: **Show order note** and **Show discount code field** hide/show the corresponding fields.
- [x] **Empty cart:** title, subtext, **Continue shopping** links to **collections index** (`/collections`); layout does not break with no line items.

---

## Line items (shared with drawer)

- [x] Each row shows **image** (or acceptable placeholder), **product title** (linked), **variant title** when not “Default Title” only, **unit price** (with compare-at when discounted), **line total**, **quantity stepper** (min / max / step from **quantity rules** when present), **Remove** link.
- [ ] **Custom line item properties** (e.g. engraving) render when present; empty properties do not leave empty markup.
- [ ] **Selling plan** name appears for subscription/pre-order lines when allocated.
- [ ] **Removing** a line via `url_to_remove` updates the cart as Shopify expects.

---

## Forms, note, discount, checkout

- [x] **`{% form 'cart', cart %}`** wraps line items and sidebar actions; **no nested forms**.
- [x] Changing quantities and clicking **Update cart** (`name="update"`) persists changes.
- [x] **Order note** saves when **Update cart** is submitted (or when navigating to checkout afterward, per Shopify behavior).
- [ ] **Discount code** field present when enabled; applying codes follows your store’s discount rules (often requires **Update cart** before checkout; confirm on your store).
- [ ] **Subtotal** uses `money_with_currency` (or matches your store’s expectation).
- [ ] **Check out** (`name="checkout"`) proceeds toward checkout with correct cart contents.
- [ ] **`{{ form | payment_button }}`** renders below checkout where Shopify provides dynamic buttons; no Liquid errors.

---

## Cart drawer-only

- [ ] Drawer **title**, **close** control, and **scroll** for many lines behave well on small screens.
- [ ] **View cart** goes to **`/cart`**; **Update cart** / **Check out** behave like the main form.
- [ ] **Empty drawer** messaging and **Continue shopping** match empty state intent.

---

## Accessibility & keyboard

- [ ] Drawer is announced as a **dialog**; **focus** moves to a close or primary control when opened (spot-check).
- [ ] **Tab** cycles within the drawer without losing focus to the page behind (spot-check).
- [ ] Stepper buttons have **accessible names**; quantity **input** has a **label** (visually hidden on line).
- [ ] **Focus visible** on steppers, remove links, primary buttons, close control.

---

## Localization

- [ ] No hardcoded user-facing strings that should use `{{ '…' | t }}` (spot-check `locales/en.default.json` under `cart.*` and `accessibility.*`).
- [ ] Optional: second-locale smoke test for cart strings and currency formatting.

---

## Regression smoke

- [ ] No unexpected **console errors** on pages that load `cart-assets` (cart template or drawer mode).
- [ ] Product **Add to cart** elsewhere still works; header **badge count** updates after cart changes (full page reload scenarios).

---

## Sign-off

| Date | Tester | Store / theme | Browsers / devices | Pass / fail | Notes |
|------|--------|---------------|---------------------|-------------|-------|
|      |        |               |                     |             |       |
