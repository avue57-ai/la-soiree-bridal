import manifest from '../data/images.json';

// Content files reference images by their path (e.g. /media-source/gowns/jess--0.jpg, as saved by the editor).
// Code may also use short keys (g/…, s/…). Both resolve to the same manifest entry.
const PREFIX = { gowns: 'g', site: 's', blog: 'blog', uploads: 'u' };
export function toKey(ref) {
  if (!ref) return ref;
  try { ref = decodeURIComponent(ref); } catch {}
  const m = /^\/?media-source\/([^/]+)\/(.+?)(\.[a-z0-9]+)?$/i.exec(ref);
  return m ? `${PREFIX[m[1]] ?? m[1]}/${m[2].replace(/[^A-Za-z0-9._-]+/g, '-')}` : ref;
}
export function img(ref) {
  const key = toKey(ref);
  const m = manifest[key];
  if (!m) throw new Error(`Image not found: ${ref} (run npm run images)`);
  return m;
}
export const has = (ref) => Boolean(manifest[toKey(ref)]);
export function srcset(ref, fmt) {
  const key = toKey(ref);
  return img(key).widths.map((w) => `/img/${key}-${w}.${fmt} ${w}w`).join(', ');
}
export function src(ref, fmt = 'webp', target = 1080) {
  const key = toKey(ref);
  const m = img(key);
  const w = m.widths.find((x) => x >= target) ?? m.widths[m.widths.length - 1];
  return `/img/${key}-${w}.${fmt}`;
}
export function ratio(ref) {
  const m = img(ref);
  return m.w / m.h;
}
export function picHtml(ref, alt = '', sizes = '(min-width: 760px) 640px, 100vw') {
  if (!has(ref)) return '';
  const key = toKey(ref);
  const m = manifest[key];
  const esc = (s) => String(s).replace(/"/g, '&quot;');
  return `<picture><source type="image/avif" srcset="${srcset(key, 'avif')}" sizes="${sizes}"><source type="image/webp" srcset="${srcset(key, 'webp')}" sizes="${sizes}"><img src="${src(key, 'webp')}" width="${m.w}" height="${m.h}" alt="${esc(alt)}" loading="lazy" decoding="async" style="background:${m.bg}"></picture>`;
}
