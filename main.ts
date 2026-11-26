// DompetKeluarga — "Make the best household budget site"
// (make.fun bounty best-household-budget-site-20261126-1457).
//
// This program hands the site in. The site itself is plain static files under
// app/ (index.html, one stylesheet, and small ES modules with one job each),
// served by any static server with app/ at its root — no build step, no
// network requests. The program copies app/ and screenshots/ from beside this
// file to /output and writes /output/dossier.json, the summary the judge reads
// (screenshots, first-load files and bytes, and the source), with the vendored
// make.fun library. Leave vendor/makefun-frontend.ts as it is: the scorer
// requires dossier.json to be byte for byte what its own copy writes.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The hand-in is only valid with the site's front page present, so refuse
// loudly instead of writing an empty output.
if (!existsSync(join(here, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing — nothing to hand in');
}
const shotDir = join(here, 'screenshots');
if (!existsSync(shotDir) || !existsSync(join(shotDir, '1-overview.jpg'))) {
  throw new Error('screenshots/1-overview.jpg (the cover) is missing');
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in
// app/ or 16 MiB of app files: app/ counts beside /output's own 1000-entry
// cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

// A short human-readable note on stdout, so a local run shows what landed.
const appBytes = statSync(join(out, 'app')).size;
process.stdout.write(`DompetKeluarga handed in: app/ copied, dossier.json written to ${out}\n`);
void appBytes;
