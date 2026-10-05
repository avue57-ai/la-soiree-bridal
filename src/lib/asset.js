import site from '../../content/settings/site.json';

// Photos uploaded through the assistant live on the portal and are delivered through Netlify's image CDN.
// Build fails loudly if one is used before the portal address is configured (run scripts/set-asset-base.mjs).
const WIDTHS = [480, 800, 1200, 1600, 2400];
export function assetWidths(w) { const ws = WIDTHS.filter((x) => x < w); ws.push(Math.min(w, 2400)); return [...new Set(ws)]; }
export function assetOrigin(id) {
  if (!site.assets.base) throw new Error(`Asset ${id} is used but content/settings/site.json assets.base is empty. Run: node scripts/set-asset-base.mjs <portal url>`);
  return `${site.assets.base}/assets/${site.assets.siteId}/${id}`;
}
export const assetUrl = (id, w, fmt) => `/.netlify/images?url=${encodeURIComponent(assetOrigin(id))}&w=${w}&fm=${fmt}`;
export const assetSrcset = (a, fmt) => assetWidths(a.w).map((w) => `${assetUrl(a.asset, w, fmt)} ${w}w`).join(', ');
export const assetSrc = (a, fmt = 'jpg', target = 1080) => { const ws = assetWidths(a.w); return assetUrl(a.asset, ws.find((x) => x >= target) ?? ws[ws.length - 1], fmt); };
export const assetRatio = (a) => a.w / a.h;
