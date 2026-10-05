// Post-build QA: internal links, images, titles/descriptions, h1 count, JSON-LD validity, alt text.
// Run after `npm run build`:  npm run check
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'dist');
const files = [];
async function walk(d) { for (const f of await readdir(d)) { const p = path.join(d, f); (await stat(p)).isDirectory() ? await walk(p) : p.endsWith('.html') && files.push(p); } }
await walk(DIST);

const redirects = (await readFile(path.join(DIST, '_redirects'), 'utf8')).split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.trim().split(/\s+/)[0]);
const exists = async (url) => {
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0]);
  if (!clean.startsWith('/')) return true;
  const candidates = [path.join(DIST, clean), path.join(DIST, clean, 'index.html')];
  for (const c of candidates) { try { const s = await stat(c); if (s.isFile() || (await stat(path.join(c, 'index.html'))).isFile()) return true; } catch {} }
  return redirects.some((r) => r === clean || (r.endsWith('*') && clean.startsWith(r.slice(0, -1))));
};

const problems = [];
const titles = new Map(), descs = new Map();
let links = 0, imgs = 0;
for (const f of files) {
  const rel = '/' + path.relative(DIST, f).replace(/index\.html$/, '');
  if (rel.startsWith('/admin/')) continue;
  const html = await readFile(f, 'utf8');
  const t = /<title>([^<]*)<\/title>/.exec(html)?.[1];
  const d = /<meta name="description" content="([^"]*)"/.exec(html)?.[1];
  const noindex = html.includes('noindex');
  if (!t) problems.push(`${rel}: missing <title>`);
  else if (!noindex) { if (titles.has(t)) problems.push(`${rel}: duplicate title with ${titles.get(t)}`); titles.set(t, rel); if (t.length > 70) problems.push(`${rel}: title ${t.length} chars`); }
  if (!d) problems.push(`${rel}: missing description`);
  else if (!noindex) { if (descs.has(d)) problems.push(`${rel}: duplicate description`); descs.set(d, rel); if (d.length > 165) problems.push(`${rel}: description ${d.length} chars`); }
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${rel}: ${h1} <h1>`);
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { problems.push(`${rel}: invalid JSON-LD`); } }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) { imgs++; if (!/\salt(=|\s|>)/.test(m[0])) problems.push(`${rel}: <img> without alt`); }
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|#|data:|javascript:)/.test(u) || u.startsWith('//') || u.startsWith('/.netlify/images?')) continue;
    links++;
    if (!(await exists(u))) problems.push(`${rel}: broken link ${u}`);
  }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) { const u = part.trim().split(' ')[0]; if (u.startsWith('/') && !u.startsWith('/.netlify/images?') && !(await exists(u))) problems.push(`${rel}: missing image ${u}`); }
}
// Routes declared in content/settings/routes.json (links the editor may use) must exist in the build.
{
  const { routes } = JSON.parse(await readFile('content/settings/routes.json', 'utf8'));
  for (const r of routes) if (!(await exists(r))) problems.push(`routes.json lists ${r}, which is not in the build`);
}
console.log(`${files.length} pages · ${links} internal links · ${imgs} images checked`);
if (problems.length) { console.log(problems.join('\n')); process.exitCode = 1; } else console.log('✓ no problems found');
