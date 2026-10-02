# La Soirée Bridal — redesign handoff

Built 2026-10-02 from a full crawl of lasoireebridal.com (Showit + WordPress), the Square booking site and Square store. Astro static site, 112 pages, deploy-ready for Netlify.

## What changed

| Area | Before | After |
|---|---|---|
| Positioning | Generic "enchanting world", script fonts, hearts, ALL-CAPS shouting | Editorial European salon: Bodoni Moda + Jost, ivory/taupe/brass palette, restrained copy |
| Homepage | Static hero, stacked unrelated blocks | 11-part story: cinematic video hero → statement → Private/Curated/Personal → lookbook rail → designer index → appointment → VIP → reviews → salon → journal → final CTA |
| Booking | Every CTA went to the Square *website* landing page, then a second click to book | Branded `/book/` page: appointment menu with prices + Square calendar embedded on-page (same Square account; nothing reconfigured). Fallback link + phone |
| Collection | One long page of 80 thumbnails, lightbox only | Filterable lookbook (designer × silhouette, from the old WooCommerce data), save-to-shortlist, 80 individual gown pages with full galleries |
| Designers | Price ranges only | 5 designer pages with origin, positioning, price range, plus-size flag, full edit |
| New pages | — | The Experience, Champagne VIP, About, Online Boutique, Book, Contact/Visit, Privacy, 404 |
| FAQ | One page, mixed groups, typos ("Back your appointment") | 6 groups, accessible accordion, FAQPage schema; adds published appointment prices |
| Journal | 13 posts at /YYYY/MM/DD/slug/ | Same URLs kept (ranking preserved), new layout, celebrity photos removed (rights risk) |
| SEO | No schema, generic titles, broken links (`tel:1=…`, relative Instagram/Pinterest links, 404 veils post linked from home) | Unique titles/descriptions, LocalBusiness/ClothingStore + FAQPage + Product + BlogPosting + Breadcrumb schema, sitemap, robots, 101 redirects from every old URL |
| Performance (Lighthouse mobile) | — | Home 98 · Collection 99 · Gown 99 · VIP 97 · Journal 98. CLS 0. JS ≈ 5 KB |
| Accessibility | — | Lighthouse 100 on all tested pages; axe: 0 critical/serious on 16 pages × desktop/mobile; keyboard, focus, reduced-motion, no-JS all tested |

## Live
- **Preview (live now):** https://la-soiree-bridal.netlify.app — Netlify project `la-soiree-bridal` in Asean's Netlify team. "Powered by Netlify" badge turned off; form detection on (contact form registered).
- Tested live on iPhone 14, iPad and 1440px desktop emulation, plus Asean's Chrome: no horizontal scroll on any of 111 pages at 360 / 768 / 1024 / 1920 px; hero video plays (MP4, with WebM fallback); old URLs redirect.

## Needs you (cannot be done from here)
1. **Point the domain.** Netlify → la-soiree-bridal → Domain management → Add `lasoireebridal.com`, then update DNS at the registrar (Netlify shows the records). Disconnect the domain in Showit; cancel Showit after the new site is live. **The blog is WordPress-on-Showit — it goes away with Showit; all 13 posts are already migrated.**
2. **Form emails:** Netlify → Forms → Notifications → email to hello@lasoireebridal.com.
3. **Google:** add the site in Search Console, submit `sitemap-index.xml`, run Rich Results Test on `/`, `/faq/`, one gown page. GA4 (`G-DSSRN1351Q`) carried over.
4. **Book a test appointment** on the live `/book/` page (calendar verified rendering; no booking placed).
5. Updates: `npm run build`, then `netlify deploy --prod --dir=dist` from `source/` (or drag `dist` into the project's Deploys tab).

## Please confirm (each is a one-line edit)

| Item | File |
|---|---|
| Testimonials are verbatim Google review excerpts (Tabitha P., Taylor, Joann F.). OK to feature? | `src/data/testimonials.js` |
| Owner/stylist name and photo for About (none published) | `src/pages/about.astro` |
| Master logo file (SVG/PNG). The site uses a typeset wordmark until then | `src/components/Wordmark.astro` |
| Silhouettes for 15 gowns not in the old product data were tagged from photos (`silhouetteSource: "visual"`) | `src/data/gowns.json` |
| Gowns that left the salon — remove their entries | `src/data/gowns.json` |
| "Most requested" label on the VIP appointment card | `src/data/site.js` |
| Facebook: the old site links page 105758525447493; another page (100083195895938) also exists. Which is current? | `src/data/site.js` |

## Photography & video that would materially lift the site

The hero is a **temporary** 25-second film built from existing boutique and designer photos. Replace it first.

**Hero film (20–30 s, 4K, 24 fps, some 60 fps for slow motion, warm-neutral grade, shallow depth of field, vertical-safe framing):**
1. Exterior / door opening · 2. Hand moving along the gown rail · 3. Macro embroidery · 4. Stylist carrying a gown · 5. Stylist adjusting a bodice · 6. Bride turning to the mirror · 7. Train moving across the floor · 8. Champagne pour · 9. Guests reacting (backs/side angles, no faces needed) · 10. Full-length gown movement · 11. Veil close-up · 12. Closing wide of the salon.
Deliver: 1920×1080 landscape + 1080×1920 vertical cut, ≤ 4 MB each (H.264, no audio). Drop into `public/video/`.

**Stills (highest impact first):** stylist-with-bride moments (Experience, Appointment), the lounge with guests and champagne (VIP), real La Soirée brides at their weddings with permission (Real Brides section), the owner portrait (About), exterior/entrance (Visit), current gowns photographed in the salon (sample sale).

## Technical notes
- Images: `npm run images` turns `media-source/` into AVIF + WebP at 3–4 widths and writes `src/data/images.json` (dimensions → no layout shift). Share cards (`public/og/`) are 1200×630 JPEGs.
- QA: `npm run check` (links, titles, descriptions, one h1, alt text, JSON-LD) — currently 0 problems across 112 pages / 7,300+ links.
- Old URL → new URL map: `public/_redirects`.
- The online store and appointment system stay on Square; nothing in Square was changed.
