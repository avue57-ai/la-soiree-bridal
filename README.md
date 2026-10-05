# La Soirée Bridal — website

Static site built with [Astro](https://astro.build). No database, no plugins to update. Hosted free on Netlify. Built to the Site Standard: see `STANDARD.md`.

## Everyday edits

**Non-technical edits happen in the site editor at `/admin/`** — see `EDITING.md`. Every save commits to GitHub and Netlify republishes in about 1 minute.

The tables below are for developers editing files directly.

| To change… | Edit this file |
|---|---|
| Home page text, images and section order | `content/pages/home.json` |
| Menu, footer links and wording | `content/settings/navigation.json` |
| Colours | `content/settings/theme.json` |
| Phone, email, address, hours, social links, booking & shop links | `content/settings/business.json` |
| Appointment types and prices shown on the site | `content/settings/appointments.json` |
| Designers (copy, price ranges, plus-size flag, hero images) | `content/designers/*.json` |
| Gowns (add / remove / silhouette) | `content/gowns/*.json` + photos in `media-source/gowns/` |
| FAQ | `content/settings/faq.json` |
| Testimonials | `content/settings/testimonials.json` |
| Journal posts | `content/journal/*.md` |

### Add a gown
1. Put the photos in `media-source/gowns/` named `designer--gownname--0.jpg`, `--1.jpg`, … (`0` is the cover). Designer slugs: `eva-lendel`, `anna-sposa`, `dama-couture`, `luce-sposa`, `soiree`.
2. Add `content/gowns/<slug>.json` (copy an existing one; `images` lists `/media-source/gowns/designer--gownname--0.jpg`, etc.).
3. `npm run images && npm run build && npm run check`.

### Replace the hero video
Drop new files at `public/video/hero-1280.mp4` (landscape, 1280×720 or 1920×1080, ≤ 4 MB, H.264, no audio) and `public/video/hero-720x1280.mp4` (vertical for phones, ≤ 3 MB). Replace the matching `poster-*.webp/.avif` with the first frame of each.

## Commands
```
npm install        # once
npm run images     # convert media-source/ → responsive AVIF/WebP (only changed files)
npm run dev        # local preview at http://localhost:4321
npm run build      # production build → dist/
npm run validate   # content against the Site Standard schemas
npm run check      # broken links, titles, descriptions, h1s, alt text, JSON-LD
```

## Deploy (Netlify)
Netlify builds from this folder using `netlify.toml`. Redirects from every old Showit/WordPress URL are in `public/_redirects`. The contact form uses Netlify Forms (enable form notifications in Netlify → Forms → Notifications).
