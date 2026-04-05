/**
 * Seeds locale files to match Shopify theme locale packs (storefront + schema pairs).
 * Run from repo root: node scripts/seed-locale-files.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const enJsonPath = path.join(localesDir, 'en.default.json');
const enSchemaPath = path.join(localesDir, 'en.default.schema.json');

const jsonOnly = [
  'af',
  'bg',
  'el',
  'hr',
  'hu',
  'id',
  'lt',
  'ro',
  'ru',
  'sk',
  'sl',
];

const jsonAndSchema = [
  'cs',
  'da',
  'de',
  'es',
  'fi',
  'fr',
  'it',
  'ja',
  'ko',
  'nb',
  'nl',
  'pl',
  'pt-BR',
  'pt-PT',
  'sv',
  'th',
];

const enJson = fs.readFileSync(enJsonPath, 'utf8');
const enSchema = fs.readFileSync(enSchemaPath, 'utf8');

/** Do not overwrite hand-translated storefront JSON when re-seeding. */
const protectedStorefrontJson = new Set(['fr', 'de', 'es', 'it']);

for (const code of jsonOnly) {
  fs.writeFileSync(path.join(localesDir, `${code}.json`), enJson);
}

for (const code of jsonAndSchema) {
  const jsonPath = path.join(localesDir, `${code}.json`);
  if (!protectedStorefrontJson.has(code) || !fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, enJson);
  }
  /** Editor schema: use `node scripts/build-translated-schema-locales.mjs` — do not overwrite translations here. */
  if (process.env.FORCE_SCHEMA_SEED === '1') {
    fs.writeFileSync(path.join(localesDir, `${code}.schema.json`), enSchema);
  }
}

console.log(
  `Wrote ${jsonOnly.length} storefront-only + ${jsonAndSchema.length} storefront JSON (schema skipped; set FORCE_SCHEMA_SEED=1 to mirror English schema).`,
);
