// Validates every content/**/*.json against the Site Standard schemas before a build.
// The schemas are bundled from the platform (scripts/standard/schemas.mjs); do not edit that file by hand.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { validateSite } from './standard/schemas.mjs';

const files = {};
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.json')) files[p.split('\\').join('/')] = JSON.parse(readFileSync(p, 'utf8'));
  }
};
walk('content');
const { ok, issues } = validateSite(files);
if (!ok) {
  console.error(`\n✗ Content check failed (${issues.length} problem${issues.length === 1 ? '' : 's'}):`);
  for (const i of issues.slice(0, 30)) console.error(`  ${i.path}\n    ${i.message}`);
  process.exit(1);
}
console.log(`✓ content valid (${Object.keys(files).length} files)`);
