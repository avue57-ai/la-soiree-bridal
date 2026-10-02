// Converts everything in media-source/ into responsive AVIF + WebP in public/img/
// and writes src/data/images.json (dimensions + available widths) so pages never shift.
// Runs on every Netlify build: files are fingerprinted by content, so only NEW or CHANGED photos are processed
// (a photo uploaded in the editor typically adds ~10 seconds to the build).
import sharp from 'sharp';
import { readdir, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'media-source');
const OUT = path.join(ROOT, 'public', 'img');
const OG = path.join(ROOT, 'public', 'og');
const MANIFEST = path.join(ROOT, 'src', 'data', 'images.json');

// folder → [key prefix, widths]
const SETS = {
  gowns: ['g', [480, 800, 1200]],
  site: ['s', [640, 1080, 1600, 2400]],
  blog: ['blog', [640, 1080, 1600]],
  uploads: ['u', [640, 1080, 1600, 2400]],
};

let manifest = {};
try { manifest = JSON.parse(await readFile(MANIFEST, 'utf8')); } catch {}
const exists = (p) => access(p).then(() => true, () => false);

// must match toKey() in src/lib/img.js — keeps URLs safe whatever the uploaded file is called
const clean = (s) => s.replace(/[^A-Za-z0-9._-]+/g, '-');
const jobs = [];
for (const [folder, [prefix, widths]] of Object.entries(SETS)) {
  let files = [];
  try { files = await readdir(path.join(SRC, folder)); } catch { continue; }
  for (const f of files) {
    if (!/\.(jpe?g|png|webp|avif|tiff?|heic)$/i.test(f)) continue;
    jobs.push({ prefix, widths, file: path.join(SRC, folder, f), key: `${prefix}/${clean(f.replace(/\.[^.]+$/, ''))}` });
  }
}

let processed = 0;
async function run({ file, key, widths, prefix }) {
  const buf = await readFile(file);
  const hash = createHash('sha1').update(buf).digest('hex').slice(0, 16);
  const prev = manifest[key];
  const outBase = path.join(OUT, key);
  if (prev && prev.hash === hash && (await exists(`${outBase}-${prev.widths[0]}.webp`))) return;
  const meta = await sharp(buf).rotate().metadata();
  const flipped = (meta.orientation ?? 1) >= 5;
  const W = flipped ? meta.height : meta.width;
  const H = flipped ? meta.width : meta.height;
  const ws = widths.filter((w) => w < W * 1.05);
  if (!ws.length || ws[ws.length - 1] < Math.min(W, widths[widths.length - 1]) * 0.9) ws.push(Math.min(W, widths[widths.length - 1]));
  await mkdir(path.dirname(outBase), { recursive: true });
  const { dominant } = await sharp(buf).stats();
  for (const w of ws) {
    const r = sharp(buf).rotate().resize({ width: w, withoutEnlargement: true });
    await r.clone().avif({ quality: 52, effort: 3 }).toFile(`${outBase}-${w}.avif`);
    await r.clone().webp({ quality: 74, effort: 4 }).toFile(`${outBase}-${w}.webp`);
  }
  // 1200×630 social-share card (gowns: cover image only)
  if (prefix !== 'g' || key.endsWith('--0') || !/--\d+$/.test(key)) {
    const og = path.join(OG, `${key}.jpg`);
    await mkdir(path.dirname(og), { recursive: true });
    await sharp(buf).rotate().resize(1200, 630, { fit: 'cover', position: H > W ? 'top' : 'centre' }).jpeg({ quality: 78, mozjpeg: true }).toFile(og);
  }
  manifest[key] = { w: W, h: H, widths: ws, bg: `rgb(${dominant.r},${dominant.g},${dominant.b})`, hash };
  processed++;
  process.stdout.write('.');
}

const CONC = 4;
let i = 0;
await Promise.all(Array.from({ length: CONC }, async () => { while (i < jobs.length) await run(jobs[i++]); }));
const keys = new Set(jobs.map((j) => j.key));
for (const k of Object.keys(manifest)) if (!keys.has(k)) delete manifest[k];
await writeFile(MANIFEST, JSON.stringify(manifest, null, 0));
console.log(`\nimages: ${processed} processed, ${Object.keys(manifest).length} total`);
