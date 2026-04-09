/**
 * Copy full job JSON into the app data file:
 *   node scripts/import-hidden-jobs.mjs path/to/your-jobs.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dest = path.join(root, 'data', 'hidden-jobs.json');

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/import-hidden-jobs.mjs <source.json>');
  process.exit(1);
}

const abs = path.isAbsolute(src) ? src : path.join(process.cwd(), src);
const json = JSON.parse(fs.readFileSync(abs, 'utf8'));
if (!Array.isArray(json)) {
  console.error('Source must be a JSON array of job objects.');
  process.exit(1);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(json, null, 2), 'utf8');
console.log(`Wrote ${json.length} jobs to data/hidden-jobs.json`);
