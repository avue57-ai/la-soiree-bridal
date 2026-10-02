# La Soirée Bridal — website

Static site built with [Astro](https://astro.build). No CMS, no database, no plugins to update. Hosted free on Netlify.

## Everyday edits

| To change… | Edit this file |
|---|---|
| Phone, email, address, hours, social links, booking & shop links | `src/data/site.js` |
| Appointment types and prices shown on the site | `src/data/site.js` → `appointments` |
| Designers (copy, price ranges, plus-size flag, hero images) | `src/data/designers.js` |
| Gowns (add / remove / silhouette) | `src/data/gowns.json` + photos in `media-source/gowns/` |
| FAQ | `src/data/faq.js` |
| Testimonials | `src/data/testimonials.js` |
| Journal posts | `src/data/posts.json` |

### Add a gown
1. Put the photos in `media-source/gowns/` named `designer--gownname--0.jpg`, `--1.jpg`, … (`0` is the cover). Designer slugs: `eva-lendel`, `anna-sposa`, `dama-couture`, `luce-sposa`, `soiree`.
2. Add an entry to `src/data/gowns.json` (copy an existing one; `images` lists `g/designer--gownname--0`, etc.).
3. `npm run images && npm run build && npm run check`.

### Replace the hero video
Drop new files at `public/video/hero-1280.mp4` (landscape, 1280×720 or 1920×1080, ≤ 4 MB, H.264, no audio) and `public/video/hero-720x1280.mp4` (vertical for phones, ≤ 3 MB). Replace the matching `poster-*.webp/.avif` with the first frame of each.

## Commands
```
npm install        # once
npm run images     # convert media-source/ → responsive AVIF/WebP (only changed files)
npm run dev        # local preview at http://localhost:4321
npm run build      # production build → dist/
npm run check      # broken links, titles, descriptions, h1s, alt text, JSON-LD
```

## Deploy (Netlify)
Netlify builds from this folder using `netlify.toml`. Redirects from every old Showit/WordPress URL are in `public/_redirects`. The contact form uses Netlify Forms (enable form notifications in Netlify → Forms → Notifications).
