// FAQ is edited in the site editor (/admin → Settings → FAQ). Answers accept **bold** and [links](/book/).
import data from '../../content/settings/faq.json';
import { marked } from 'marked';
export const faq = data.groups.map((g) => ({ ...g, items: g.items.map((i) => ({ q: i.q, a: marked.parseInline(i.a) })) }));
