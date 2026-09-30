# Yonoio — manual update reference

Use this file whenever you have **real** text, images, contact details, legal copy, or apps to publish. It maps each on-screen section to the files you must edit. The site is static HTML: JavaScript only filters cards that already exist in the page. It never creates listings for you.

**Brand:** Yonoio  
**Live domain:** `https://yonoio.com` (no `www`)  
**Local folder name `yonoweb` is not the brand.**

Do **not** invent ratings, review quotes, download counts, awards, security claims, user counts, publishers, or legal text. If a fact is unknown, keep the existing “not listed” / “not rated yet” wording.

---

## How to preview locally

From the project folder:

```
node preview-server.js
```

Then open `http://127.0.0.1:4174/`

---

## Site map

| What visitors see | File |
|---|---|
| Home | `index.html` |
| All apps directory | `apps/index.html` |
| App detail template | `apps/example-app/index.html` |
| Category index | `categories/index.html` |
| One category page | `categories/<slug>.html` |
| About | `about.html` |
| Contact | `contact.html` |
| Privacy / Terms / Disclaimer | `privacy-policy.html`, `terms.html`, `disclaimer.html` |
| Search / crawl | `robots.txt`, `sitemap.xml` |

**Styles:** `css/style.css`  
**Behaviour:** `js/main.js` (nav, year, directory filter, FAQ accordion)

---

## Images — what lives where

| File | Used for | What to do |
|---|---|---|
| `favicon.ico` | Browser tab icon on every page | Replace with a real Yonoio favicon if you have one |
| `assets/images/backgrounds/hero-wide.jpg` | Homepage hero on tablet/desktop (1280×720) | Replace **in place**, keep the same filename and landscape crop |
| `assets/images/backgrounds/hero-portrait.jpg` | Homepage hero on phones (864×1152) | Replace **in place**, keep the same filename and portrait crop |
| `assets/images/general/` | Empty. Intended for share image | Add a 1200×630 JPG/PNG for Open Graph |
| `assets/images/apps/demo-*.svg` | Letter-tile icons for the 8 demo cards | Replace with real app icons (PNG/WebP/SVG, ~72–128px) |
| `assets/images/apps/example-app.svg` | Template app icon | Replace when you turn the template into a real app |
| `assets/images/apps/example-app-screen-1.svg` (and `-2`, `-3`) | Template screenshots | Replace with real phone screenshots (portrait, ~9:16) |

The header/footer logo is **not an image**. It is the green “Y” mark in HTML (`.site-logo`). To use a real logo file, you would change that markup on **every** HTML page.

---

## Shared chrome (copied on every page)

Header, announcement bar, and footer are **duplicated** in each HTML file. Changing one page does not update the others.

When you change any of these, edit **all 17 HTML files**:

| On-screen section | Look for | Typical change |
|---|---|---|
| Purple top bar | `.topbar__message` | Announcement text |
| Logo | `.site-logo` | Brand mark / name |
| Nav links | `.primary-nav__list` | Menu labels or URLs |
| Footer blurb | `.site-footer` first column | One-line description |
| Footer links | Browse / Site / Legal lists | New pages |
| Copyright line | `data-current-year` | Year is filled by JS; the “Yonoio” name is manual |

Relative paths differ by folder (`index.html` vs `../index.html` vs `../../index.html`). Copy from a page in the **same folder** so links do not break.

---

## Update now (from the live preview)

These are the sections that still show placeholder images or “needs your input” copy. Do them in this order when you have real material.

### 1. Contact email — `contact.html`

On screen: the dashed box **Needs your input**.

Replace that box with a real address, for example:

```html
<p><a href="mailto:you@yonoio.com">you@yonoio.com</a></p>
```

Until this exists, visitors cannot send corrections or removal requests.

### 2. About story — `about.html`

On screen: the dashed box **Needs your input** under Independence.

Add who runs the site, how apps are chosen, and how often listings are updated. Keep the three existing sections if they still match; expand rather than padding with keywords.

Also review the shorter About block on the homepage: `index.html` → section `#about-site`. Keep those two pages consistent.

### 3. Legal pages (before going live)

All three still say **Legal text required** / **To be written** / **Last updated: not yet published**.

| Page | File | Fill |
|---|---|---|
| Privacy Policy | `privacy-policy.html` | What you actually collect, cookies, analytics, ads, external links, contact |
| Terms of Use | `terms.html` | Acceptance, permitted use, IP, third-party downloads, liability, changes |
| Disclaimer | `disclaimer.html` | Affiliation, trademarks, accuracy, downloads, removals |

Write real policy text. Then set the “Last updated” date in the page hero and bump `<lastmod>` in `sitemap.xml`.

### 4. Open Graph share image — `index.html`

Search for:

```html
<!-- TODO: add og:image (1200x630) to assets/images/general/ and link it here. -->
```

Add something like `assets/images/general/og-home.jpg` (1200×630) and two tags:

```html
<meta property="og:image" content="https://yonoio.com/assets/images/general/og-home.jpg">
<meta name="twitter:image" content="https://yonoio.com/assets/images/general/og-home.jpg">
```

Repeat `og:image` on other important pages when you have artwork for them.

### 5. Hero photography — homepage only

On screen: the large dark photo behind **Discover Android Apps Worth Installing**.

The current JPGs are abstract placeholders. Swap the two files in `assets/images/backgrounds/` if you have real photography. Keep names and crops so CSS and preload links still work. Then edit the H1, lead paragraph, and eyebrow in `index.html` (search `hero-title`) if the wording should change.

The hero still mentions “trending”. That section is empty on purpose (see below). Change that sentence when you are ready, or leave it until featured apps exist.

### 6. Demo app cards — home + directory

On screen: **Latest Apps** on the home page, and the same eight cards on `apps/index.html`.

These are placeholders, not real products:

| Card name | Icon file | Category badge | Card id |
|---|---|---|---|
| Northwind Notes | `demo-notes.svg` | Tools | `app-demo-notes` |
| Harbor Weather | `demo-weather.svg` | Weather | `app-demo-weather` |
| Lumen Reader | `demo-reader.svg` | Books | `app-demo-reader` |
| Pulse Timer | `demo-timer.svg` | Tools | `app-demo-timer` |
| Atlas Maps Demo | `demo-maps.svg` | Travel | `app-demo-maps` |
| Folio Gallery | `demo-gallery.svg` | Photography | `app-demo-gallery` |
| Cedar Tasks | `demo-tasks.svg` | Productivity | `app-demo-tasks` |
| Drift Radio | `demo-radio.svg` | Music | `app-demo-radio` |

Each card currently links to a hash on the directory (`apps/index.html#app-…`), **not** to a detail page.

When you have a real app, either:

- **Replace** one demo card in both `index.html` and `apps/index.html`, or
- **Delete** the demo `<li>` blocks and add new ones.

Search for `APP DIRECTORY START` / `ADD NEW APP CARD HERE`.

The search box and category filter read the card’s title, description, and badge. You do not edit `js/main.js` when you add or rename a card.

### 7. App detail pages

On screen: `apps/example-app/` is a **template**, not a live product. You will see “Example App”, “Version not listed”, “Publisher not listed”, “Download link not listed yet”, and three grey phone-frame screenshots.

**To publish a real app:**

1. Copy the folder `apps/example-app/` to `apps/<slug>/` (example: `apps/northwind-notes/`).
2. In the new `index.html`, replace every “Example App” string, the title, description, canonical URL, Open Graph tags, and both JSON-LD blocks.
3. Replace `example-app.svg` and `example-app-screen-1/2/3.svg` with real files (or point `src` at new files under `assets/images/apps/`).
4. Fill About, Features, How It Works, Who Is It For, Requirements, FAQ, and the `#get-app` download block **only with facts you have**.
5. Point the “Get …” button `href` at the official store or file URL.
6. On home and `apps/index.html`, set that card’s `href` to `apps/<slug>/index.html` (or `../apps/<slug>/index.html` from nested pages).
7. Add one `<url>` row in `sitemap.xml` for `https://yonoio.com/apps/<slug>/`.
8. Copy the same card HTML onto the matching `categories/<slug>.html` page, replacing the “No apps listed yet” box.

Leave `apps/example-app/` as the blank template, or delete it from the sitemap if you do not want it indexed.

### 8. Category pages — all still empty

On screen: every category page shows **No apps listed yet**.

Files:

- `categories/productivity.html`
- `categories/education.html`
- `categories/tools.html`
- `categories/entertainment.html`
- `categories/security.html`
- `categories/finance.html`
- `categories/utilities.html`
- `categories/communication.html`

When a real app belongs in a category, copy its directory card into that page (adjust `href` and image paths: from a category page, apps live at `../apps/<slug>/` and icons at `../assets/images/apps/`).

**Mismatch to watch:** some demo badges (Weather, Books, Travel, Photography, Music) have **no** matching category page. Recategorise into one of the eight pages above, or add a new category (recipe below).

Category names and one-line descriptions are also on:

- Home `#categories` in `index.html`
- `categories/index.html`

Edit both if you rename a category.

---

## Leave empty until you say otherwise

### Trending (`#trending` on the home page)

The dark empty band between the hero and Latest Apps is **intentional**. Do not add featured cards, a podium, or substitute widgets here yet. Nav still links to `index.html#trending` so the jump target exists.

### Ratings and “Updated” dates

Empty stars and “Not rated yet” / “Version not listed” / “Updated date not listed” are honest. Fill them only when the figures are real.

---

## Recipes

### Add a new app (checklist)

1. Duplicate `apps/example-app/` → `apps/<slug>/`.
2. Put icon + screenshots in `assets/images/apps/`.
3. Rewrite the detail page (text, meta, JSON-LD, download URL).
4. Add the card between `APP DIRECTORY START` and `END` in:
   - `index.html` (paths like `assets/images/apps/…` and `apps/<slug>/index.html`)
   - `apps/index.html` (paths like `../assets/…` and `<slug>/index.html`)
5. Add the same card to the right `categories/*.html` page.
6. Add the URL to `sitemap.xml`.

### Add a new category

1. Copy an existing file such as `categories/tools.html` to `categories/<new-slug>.html`.
2. Change the H1, lead, title, canonical, and breadcrumb.
3. Add a card in `index.html` (`#categories`) **and** `categories/index.html` (search `ADD NEW CATEGORY HERE`).
4. Add a `<url>` in `sitemap.xml`.

### Change a listing later

Edit the **detail page** first, then the **same facts** on:

- home card
- `apps/index.html` card
- category card
- any “Related Apps” cards on other detail pages
- `sitemap.xml` `<lastmod>`

---

## Do not publish fake data

| Tempting fill | What to do instead |
|---|---|
| Star ratings / review quotes | Keep “Not rated yet” |
| Download counts / “trusted by X users” | Omit |
| Publisher / version you are guessing | Keep “not listed” |
| Invented store or APK host | Keep the `#get-app` placeholder until you have the official URL |
| Placeholder legal / privacy text | Leave the dashed boxes until a real policy is written |

---

## After each real content change

1. Preview the page at `http://127.0.0.1:4174/…`
2. Check the same content on home, directory, category, and detail if it is an app.
3. Update `sitemap.xml` `<lastmod>` for that URL.
4. Confirm image paths: root pages use `assets/…`, `apps/` uses `../assets/…`, `apps/<slug>/` uses `../../assets/…`, `categories/` uses `../assets/…`.
