# Site Standard v1: how this site is built to be edited by software

Content, layout order, navigation and colours live in data files. Code renders them. Every file under `content/` is checked against a schema before each build, so a bad edit fails with a plain message and never reaches a deploy.

## What is data

| Thing | File | Notes |
|---|---|---|
| Home page text, images, section order, which sections show | `content/pages/home.json` | Each section has a `type`, an `id` and `hidden`. Reorder the list to reorder the page. |
| Header, mobile menu, footer links and wording | `content/settings/navigation.json` | |
| Colours | `content/settings/theme.json` | Contrast is checked (WCAG AA). Fonts and type scale stay in code. |
| Business details, hours, links | `content/settings/business.json` | |
| Appointment menu, FAQ, testimonials | `content/settings/{appointments,faq,testimonials}.json` | |
| Gowns, designers | `content/gowns/*.json`, `content/designers/*.json` | |
| Which section types this site can display, and where uploaded photos are served from | `content/settings/site.json` | A page using a type not listed here is rejected. |
| New pages (any path not used by code) | `content/pages/<name>.json` | Rendered by `src/pages/[...slug].astro`, listed in the sitemap automatically. |
| Pages rendered by code (valid link targets) | `content/settings/routes.json` | `npm run check` confirms each exists in the build. |

Text fields are plain text. `*word*` makes emphasis. HTML is rejected.

## What is still code

The hero video, fonts, CSS, and the copy on the About, Experience, VIP, Book, Contact, Online Boutique, Collection, Designers index, FAQ page frame, Privacy and 404 pages. A request that needs these goes to a person. Moving a page to data means turning it into sections in `content/pages/<name>.json`.

## Section types (`src/sections/`)

Home page: `hero-video`, `statement-split`, `pillars`, `collection-rail`, `designer-index`, `appointment-feature`, `vip-teaser`, `proof`, `salon-mosaic`, `journal-teaser`, `final-cta`. Any page: `rich-text`, `cta-banner` (headline, text, button, optional photo). To add one: write the component, list it in `src/sections/registry.js`, and add its schema to the platform schemas, then re-bundle (below).

## Photos

A section image is either a built-in key (`{ "key": "s/boutique-salon", "alt": "..." }`) or a photo uploaded through the assistant (`{ "asset": "ast_...", "alt": "...", "w": 3000, "h": 2000 }`). Uploaded photos are served by the portal and resized by Netlify's image CDN. After the portal is deployed, run `node scripts/set-asset-base.mjs https://<portal>` once; it records the address in `site.json` and allows it in `netlify.toml`. The build stops with a clear message if an uploaded photo is used before that.

## Checks

- `npm run validate`: content against the schemas (also runs first in `npm run build`).
- `npm run check`: links, titles, descriptions, headings, alt text, structured data, declared routes (run after a build).
- `scripts/standard/schemas.mjs` is generated from the platform's `packages/schemas`. Do not edit it by hand. Regenerate with `npx esbuild packages/schemas/src/index.ts --bundle --minify --format=esm --platform=node --target=node20 --outfile=<this repo>/scripts/standard/schemas.mjs` from the platform repo.

## Migration proof

On the day of migration the build output of all 112 pages was compared with the previous build. After removing the new theme `<style>` tag and ignoring whitespace between tags, every page was byte-identical.
