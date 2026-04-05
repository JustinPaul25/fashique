# QA checklist — Phase 5.6 (article)

Use this when validating `templates/article.json`, `sections/article.liquid`, `snippets/article-card.liquid`, `snippets/article-card-styles.liquid`, `snippets/social-share.liquid`, and `snippets/breadcrumbs.liquid` after changes or before release.

**Plan reference:** [theme-development-path.md § 5.6](./theme-development-path.md) — Article Page.

---

## Setup

- [ ] Run `shopify theme check` — zero errors (warnings acceptable per team policy).
- [ ] Use a blog with **at least three published articles** to exercise **related posts** and **older/newer** navigation.
- [ ] Test one article **with** a featured image and one **without** (hero + card placeholders).
- [ ] If possible, test **comments enabled** and **comments disabled** on the blog.

---

## Theme editor & section settings

- [ ] **Show breadcrumbs** on/off.
- [ ] **Show featured image** on/off; **image ratio** options (21:9, 16:9, 4:3) look correct and **do not distort** unreasonably on mobile.
- [ ] **Show related articles** on/off; **maximum related articles** (0–6) limits the grid; **current article never appears** in the list.
- [ ] **Comments per page** (5–50) affects comment pagination when many comments exist.
- [ ] **Color scheme** and **section spacing** behave like other sections.

---

## Content & layout

- [ ] **Title** renders with proper escaping (no HTML injection from plain text titles).
- [ ] **Author + date** row: with author, uses `blog.article_author_date_html`; without author, falls back to date-only string.
- [ ] **Article body** outputs `article.content` inside an **`rte`** wrapper so typography styles apply.
- [ ] **Featured image** uses `loading="eager"` where implemented; **alt** falls back to title.

---

## Tags, share, navigation

- [ ] **Tags** list links to `{{ blog.url }}/tagged/{{ handle }}` and only renders when tags exist.
- [ ] **Social share** uses absolute URLs and optional **Pinterest** image when a featured image exists.
- [ ] **Older post** links to `blog.next_article` (**older** in time); **Newer post** links to `blog.previous_article` (**newer**). Labels match merchant expectations (swap copy in locales if your blog reads RTL or uses different semantics).

---

## Comments

- [ ] When **comments are disabled** for the blog, the **comments block and form are not shown**.
- [ ] When **enabled**, existing comments list with **author**, **date**, and **body** (`rte`); pagination anchors to `#comments`.
- [ ] **New comment** form shows validation errors from `default_errors`; submit uses theme **button** styling.
- [ ] **Moderation:** if the blog moderates comments, confirm behavior matches admin settings (may require manual admin check).

---

## Related articles

- [ ] Section heading uses **`blog.related_articles`** translation.
- [ ] Grid uses **`snippets/article-card.liquid`**; cards are keyboard-focusable links.

---

## Accessibility & keyboard

- [ ] **Skip** link and heading order: one **`h1`** (title); section **`h2`**/ **`h3`** for subsections are sane.
- [ ] **Comment form** fields have **labels** tied to inputs (`id` includes `section.id`).
- [ ] **Adjacent article** links have clear **visible** labels and large enough touch targets (spot-check).

---

## Localization

- [ ] Spot-check `locales/en.default.json` under `blog.*` for new keys (`comments_heading`, `related_articles`, `article_older`, etc.).
- [ ] Optional: second-locale smoke test for article strings and dates.

---

## Regression smoke

- [ ] **`blog.liquid`** article cards / metadata still OK if shared snippets changed.
- [ ] **`social-share.liquid`** still works on **product** template if you altered share parameters elsewhere.

---

## Sign-off

| Date | Tester | Store / theme | Browsers / devices | Pass / fail | Notes |
|------|--------|---------------|--------------------|-------------|-------|
|      |        |               |                    |             |       |
