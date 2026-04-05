/**
 * Builds translated *.schema.json files from locales/en.default.schema.json
 * using the public Google Translate gtx endpoint (no API key).
 *
 * Run: node scripts/build-translated-schema-locales.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const localesDir = path.join(root, 'locales');
const sourcePath = path.join(localesDir, 'en.default.schema.json');

/** Output filename -> Google Translate target code (ISO-ish) */
const TARGETS = [
  ['cs.schema.json', 'cs'],
  ['da.schema.json', 'da'],
  ['de.schema.json', 'de'],
  ['es.schema.json', 'es'],
  ['fi.schema.json', 'fi'],
  ['fr.schema.json', 'fr'],
  ['it.schema.json', 'it'],
  ['ja.schema.json', 'ja'],
  ['ko.schema.json', 'ko'],
  ['nb.schema.json', 'no'],
  ['nl.schema.json', 'nl'],
  ['pl.schema.json', 'pl'],
  ['pt-BR.schema.json', 'pt'],
  ['pt-PT.schema.json', 'pt'],
  ['sv.schema.json', 'sv'],
  ['th.schema.json', 'th'],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function collectStrings(obj, out = new Set()) {
  if (typeof obj === 'string') {
    out.add(obj);
    return out;
  }
  if (obj && typeof obj === 'object') {
    for (const v of Object.values(obj)) collectStrings(v, out);
  }
  return out;
}

function protectPlaceholders(s) {
  const placeholders = [];
  const out = s.replace(/\{\{[^}]+\}\}|\{[a-zA-Z_][a-zA-Z0-9_]*\}/g, (m) => {
    const i = placeholders.length;
    placeholders.push(m);
    return `⟦${i}⟧`;
  });
  return { text: out, placeholders };
}

function restorePlaceholders(s, placeholders) {
  return s.replace(/⟦(\d+)⟧/g, (_, i) => placeholders[Number(i)] ?? _);
}

async function googleTranslate(text, tl) {
  if (!text.trim()) return text;
  const { text: safe, placeholders } = protectPlaceholders(text);
  const q = encodeURIComponent(safe.slice(0, 4500));
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${q}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FashiqueTheme/1.0)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data?.[0]) throw new Error('Invalid translate response');
  let translated = data[0].map((row) => row[0]).join('');
  translated = restorePlaceholders(translated, placeholders);
  return translated;
}

async function translateWithRetry(text, tl, retries = 5) {
  let last;
  for (let i = 0; i < retries; i++) {
    try {
      return await googleTranslate(text, tl);
    } catch (e) {
      last = e;
      await sleep(500 * (i + 1));
    }
  }
  throw last;
}

function applyMap(obj, dict) {
  if (typeof obj === 'string') return dict.get(obj) ?? obj;
  if (Array.isArray(obj)) return obj.map((x) => applyMap(x, dict));
  if (obj && typeof obj === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(obj)) o[k] = applyMap(v, dict);
    return o;
  }
  return obj;
}

const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const unique = [...collectStrings(source)];
console.log('Unique strings:', unique.length);

const distinctTl = [...new Set(TARGETS.map(([, tl]) => tl))];
const langMaps = new Map();
for (const tl of distinctTl) langMaps.set(tl, new Map());

let n = 0;
for (const enText of unique) {
  for (let i = 0; i < distinctTl.length; i += 4) {
    const chunk = distinctTl.slice(i, i + 4);
    await Promise.all(
      chunk.map(async (tl) => {
        const map = langMaps.get(tl);
        if (map.has(enText)) return;
        try {
          const tr = await translateWithRetry(enText, tl);
          map.set(enText, tr);
        } catch (e) {
          console.error(`Fail [${tl}]: "${String(enText).slice(0, 50)}…"`, e.message);
          map.set(enText, enText);
        }
      }),
    );
    await sleep(120);
  }

  n++;
  if (n % 25 === 0) console.log(`Progress: ${n}/${unique.length}`);
}

for (const [filename, tl] of TARGETS) {
  const dict = langMaps.get(tl);
  const out = applyMap(source, dict);
  const outPath = path.join(localesDir, filename);
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log('Wrote', filename);
}

console.log('Done.');
