// Points this site at the assistant portal that serves uploaded photos.
// Usage: node scripts/set-asset-base.mjs https://your-portal.netlify.app
import { readFileSync, writeFileSync } from 'node:fs';
const base = (process.argv[2] ?? '').replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+$/i.test(base)) { console.error('Give the portal origin, e.g. https://la-soiree-portal.netlify.app'); process.exit(1); }
const cfgPath = 'content/settings/site.json';
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
cfg.assets.base = base;
writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + '\n');
let toml = readFileSync('netlify.toml', 'utf8').replace(/\n# BEGIN assistant-images[\s\S]*# END assistant-images\n?/, '');
// The portal shows this site in a preview pane, so only the portal may frame it. (Replaces the older X-Frame-Options header.)
toml = toml.replace(/^\s*X-Frame-Options = "SAMEORIGIN"\n/m, '');
const host = new URL(base).host.replace(/\./g, '\\\\.');
toml += `\n# BEGIN assistant-images\n[images]\n  remote_images = ["https://${host}/assets/${cfg.assets.siteId}/.*"]\n\n[[headers]]\n  for = "/*"\n  [headers.values]\n    Content-Security-Policy = "frame-ancestors 'self' ${base}"\n# END assistant-images\n`;
writeFileSync('netlify.toml', toml);
console.log(`asset base set to ${base}; framing allowed for the portal only`);
