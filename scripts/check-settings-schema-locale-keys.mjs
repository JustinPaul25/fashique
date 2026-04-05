import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const schema = JSON.parse(
  fs.readFileSync(path.join(root, 'locales', 'en.default.schema.json'), 'utf8'),
);
const settings = fs.readFileSync(
  path.join(root, 'config', 'settings_schema.json'),
  'utf8',
);

const re = /"t:([a-z0-9_.]+)"/gi;
const refs = [];
let m;
while ((m = re.exec(settings)) !== null) refs.push(m[1]);
const uniq = [...new Set(refs)];

function get(obj, parts) {
  let o = obj;
  for (const p of parts) {
    if (o == null || typeof o !== 'object') return undefined;
    o = o[p];
  }
  return o;
}

const missing = [];
for (const ref of uniq) {
  const parts = ref.split('.');
  const [top, ...rest] = parts;
  if (!schema[top]) {
    missing.push(`${ref} (missing top-level "${top}")`);
    continue;
  }
  const v = get(schema[top], rest);
  if (v === undefined) missing.push(ref);
}

console.log('Unique t: references in settings_schema.json:', uniq.length);
if (missing.length) {
  console.log('MISSING in en.default.schema.json:\n', missing.join('\n'));
  process.exit(1);
}
console.log('All keys present in en.default.schema.json.');
