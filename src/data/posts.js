// Journal posts are edited in the site editor (/admin → Journal). One Markdown file per post in content/journal/.
// URLs keep the original WordPress pattern /YYYY/MM/DD/slug/ so search rankings carry over.
import { toKey, has } from '../lib/img.js';
const files = import.meta.glob('../../content/journal/*.md', { eager: true });

const list = await Promise.all(
  Object.values(files).map(async (f) => {
    const fm = f.frontmatter;
    const date = typeof fm.date === 'string' ? fm.date.slice(0, 10) : new Date(fm.date).toISOString().slice(0, 10);
    const [y, m, d] = date.split('-');
    const html = await f.compiledContent();
    const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    return {
      title: fm.title,
      seoTitle: fm.seoTitle || fm.title,
      slug: fm.slug,
      date,
      description: fm.description || '',
      cover: fm.cover && has(fm.cover) ? toKey(fm.cover) : 's/boutique-salon',
      path: `/${y}/${m}/${d}/${fm.slug}/`,
      html,
      words,
      draft: !!fm.draft,
    };
  })
);

const posts = list.filter((p) => !p.draft).sort((a, b) => b.date.localeCompare(a.date));
export default posts;
