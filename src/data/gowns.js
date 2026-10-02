// Gowns are edited in the site editor (/admin → Gowns). One JSON file per gown in content/gowns/; the file name is the page URL.
import { toKey, has } from '../lib/img.js';
import { designers } from './designers.js';
const files = import.meta.glob('../../content/gowns/*.json', { eager: true, import: 'default' });
const dOrder = Object.fromEntries(designers.map((d, i) => [d.slug, i]));

const gowns = Object.entries(files)
  .map(([path, g]) => ({
    ...g,
    slug: path.split('/').pop().replace(/\.json$/, ''),
    neckline: g.neckline || null,
    legacyUrl: g.legacyUrl || null,
    // photos that failed to process (e.g. unsupported format) are skipped instead of breaking the build
    images: (g.images || []).map(toKey).filter(has),
  }))
  .filter((g) => g.images.length && !g.hidden)
  .sort((a, b) => (dOrder[a.designer] ?? 99) - (dOrder[b.designer] ?? 99) || (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name));

export default gowns;
