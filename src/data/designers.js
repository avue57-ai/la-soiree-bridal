// Designers are edited in the site editor (/admin → Designers). One JSON file per designer in content/designers/.
import { toKey, has } from '../lib/img.js';
const files = import.meta.glob('../../content/designers/*.json', { eager: true, import: 'default' });

export const designers = Object.entries(files)
  .map(([path, d]) => ({
    ...d,
    slug: path.split('/').pop().replace(/\.json$/, ''),
    founded: d.founded || null,
    hero: toKey(d.hero),
    feature: (d.feature || []).map(toKey).filter(has),
  }))
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name));

export const designerBySlug = Object.fromEntries(designers.map((d) => [d.slug, d]));
