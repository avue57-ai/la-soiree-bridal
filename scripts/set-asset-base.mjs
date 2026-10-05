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
const host = new URL(base).host.replace(/\./g, '\\\\.');
toml += `\n# BEGIN assistant-images\n[images]\n  remote_images = ["https://${host}/assets/${cfg.assets.siteId}/.*"]\n# END assistant-images\n`;
writeFileSync('netlify.toml', toml);
console.log(`asset base set to ${base}`);
