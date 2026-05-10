/**
 * Scrapes embedded nade payloads from csnades.gg map pages (Next Flight RSC data)
 * and writes src/generated/csnades-lineups.json (+ TypeScript shim for Vite imports).
 *
 * Run: npm run sync:csnades
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'src', 'generated');
const OUT_JSON = path.join(OUT_DIR, 'csnades-lineups.json');

/** @typedef {{ id: string; mapId: string; side: 'T'|'CT'; type: string; title: string; origin: string; target: string; thumbnail: string; videoUrl: string; difficulty: 'EASY'|'MEDIUM'|'HARD'; tickRate: '64'|'128'|'BOTH'; steps: string[]; sourceUrl?: string; }} ExportedLineup */

const MAP_SLUGS = ['mirage', 'inferno', 'dust2', 'ancient', 'anubis', 'nuke', 'vertigo'];

/** Lineups written per map (smoke-heavy; see quotas below). */
const EXPORT_PER_MAP = 16;
const SMOKE_QUOTA = 13;
const MOLO_QUOTA = 1;
const FLASH_QUOTA = 1;
const HE_QUOTA = 1;

function findNadesBracketIndex(html) {
  const needle = '\\"nades\\":';
  let pos = -1;
  while ((pos = html.indexOf(needle, pos + 1)) !== -1) {
    const b = html.indexOf('[', pos);
    if (html[b + 1] === '{') return b;
  }
  throw new Error('Could not find full nades array marker ([{…) in HTML');
}

function balancedArraySliceEscaped(html, startBracketIdx) {
  let depth = 0;
  let i = startBracketIdx;
  let inStr = false;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (c === '\\' && html[i + 1] === '"') {
        i++;
        continue;
      }
      if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      continue;
    }
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return html.slice(startBracketIdx, i + 1);
    }
  }
  throw new Error('Unbalanced brackets while slicing nades array');
}

/** @param {{ technique?: string; movement?: string; precision?: string }} n */
function buildStepsFromMeta(n) {
  const tech = String(n.technique || '').replace(/_/g, '+');
  const mov = String(n.movement || '').replace(/_/g, ' ');
  const prec = String(n.precision || '').replace(/_/g, ' ');
  const lines = [
    `Tehnika: ${tech || '—'}.`,
    `Kretanje: ${mov || '—'}.`,
    `Preciznost: ${prec || '—'}.`,
  ];
  if (Array.isArray(n.bounces) && n.bounces.length > 0) {
    lines.push(`Odgovara bounce off ${n.bounces.length} referentnih točaka (vidi radar na CSNADES).`);
  }
  lines.push(`Otvori stranicu nade za točan crosshair overlay i HQ video snimak.`);
  return lines;
}

/** @param {string} p */
function mapPrecisionToDifficulty(p) {
  const s = String(p || '').toLowerCase();
  if (s.includes('very')) return 'HARD';
  if (s.includes('precise')) return 'MEDIUM';
  if (s.includes('loose')) return 'EASY';
  return 'MEDIUM';
}

/** @param {string} raw */
function mapUtilityType(raw) {
  const t = String(raw || '').toLowerCase();
  const map = { smoke: 'SMOKE', molotov: 'MOLOTOV', molotovs: 'MOLOTOV', flashbang: 'FLASH', flash: 'FLASH', he: 'HE', hegrenade: 'HE', combination: 'SMOKE' };
  return map[t] || 'SMOKE';
}

/**
 * Pull nades payload from fetched HTML.
 * @returns {unknown[]}
 */
function parseNadesFromPageHtml(html, mapSlug) {
  const b = findNadesBracketIndex(html);
  const rawArr = balancedArraySliceEscaped(html, b);
  const normalized = rawArr.replace(/\\"/g, '"');
  const cut = normalized.indexOf('],"map":');
  const jsonBlob = cut === -1 ? normalized : normalized.slice(0, cut + 1);
  /** @type {unknown[]} */
  const arr = JSON.parse(jsonBlob);
  if (!Array.isArray(arr)) throw new Error(`${mapSlug}: expected array`);
  return arr;
}

const UTILITY_PATHS = ['smokes', 'molotovs', 'flashbangs', 'hegrenades'];

/**
 * Map pages split utility classes by path (e.g. /mirage/molotovs). Merge and de-dupe by nade id.
 * @returns {Promise<unknown[]>}
 */
async function fetchAllNadesForMap(slug) {
  /** @type {Map<string, unknown>} */
  const byId = new Map();

  for (const part of UTILITY_PATHS) {
    const url = `https://csnades.gg/${slug}/${part}`;
    const res = await fetch(url, { headers: { 'user-agent': 'Guerilla-Intel/sync-csnades' } });
    if (!res.ok) {
      console.warn(`[${slug}/${part}] HTTP ${res.status} — skipping`);
      continue;
    }
    const html = await res.text();
    let nades;
    try {
      nades = parseNadesFromPageHtml(html, slug);
    } catch (e) {
      console.warn(`[${slug}/${part}] parse failed`, e.message);
      continue;
    }
    for (const n of nades) {
      if (n?.id) byId.set(n.id, n);
    }
  }

  return [...byId.values()];
}

function scoreCard(x) {
  const t = String(x.type || '').toLowerCase();
  const typeBoost = t === 'smoke' ? 4 : t === 'molotov' ? 2.5 : t === 'flashbang' ? 2 : t === 'he' ? 1.5 : 1;
  const big = x.small === true ? -1 : 0;
  const beginnerPenalty = x.beginner === true ? -0.2 : 0;
  return typeBoost + big + beginnerPenalty;
}

function sortByScore(list) {
  return [...list].sort((a, b) => scoreCard(b) - scoreCard(a));
}

/**
 * Smoke-heavy export: many smokes plus one molotov / flash / HE when available.
 * @returns {unknown[]}
 */
function pickFeatured(arr, /** @type {number} */ n) {
  /** @type {Record<string, unknown[]>} */
  const buckets = { smoke: [], molotov: [], flashbang: [], he: [], combination: [], other: [] };
  for (const x of arr) {
    const k = String(x.type || '').toLowerCase();
    const key = buckets[k] ? k : 'other';
    (buckets[key] ?? buckets.other).push(x);
  }

  for (const key of Object.keys(buckets)) buckets[key] = sortByScore(buckets[key]);

  /** @type {unknown[]} */
  const out = [];
  const seen = new Set();

  /** @param {string} kind @param {number} cap */
  function pushUpTo(kind, cap) {
    for (const row of buckets[kind] ?? []) {
      if (cap <= 0) return;
      const slug = row.slug;
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push(row);
      cap--;
    }
  }

  pushUpTo('smoke', SMOKE_QUOTA);
  pushUpTo('molotov', MOLO_QUOTA);
  pushUpTo('flashbang', FLASH_QUOTA);
  pushUpTo('he', HE_QUOTA);

  if (out.length < n) pushUpTo('combination', n - out.length);
  if (out.length < n) pushUpTo('smoke', n - out.length);
  if (out.length < n) pushUpTo('other', n - out.length);

  return out.slice(0, n);
}

/** @returns {ExportedLineup} */
function toLineup(n, /** @type {string} */ mapSlug) {
  const side = String(n.team || 't').toLowerCase() === 'ct' ? 'CT' : 'T';
  const slug = /** @type {string} */ (n.slug || '');
  const titleFrom = String(n.titleFrom || '');
  const titleTo = String(n.titleTo || '');
  const mp4 = n.assets?.videoHq?.mp4 || n.assets?.videoLq?.mp4 || '';
  const thumb = n.assets?.thumbnail || '';
  return {
    id: `cs-${mapSlug}-${slug}`,
    mapId: mapSlug,
    side,
    type: mapUtilityType(n.type),
    title: `${titleFrom} → ${titleTo}`,
    origin: titleFrom.toUpperCase(),
    target: titleTo.toUpperCase(),
    thumbnail: thumb,
    videoUrl: mp4 || thumb,
    difficulty: mapPrecisionToDifficulty(n.precision),
    tickRate: 'BOTH',
    steps: buildStepsFromMeta(n),
    sourceUrl: `https://csnades.gg/${mapSlug}/${slug}`,
  };
}

async function main() {
  /** @type {ExportedLineup[]} */
  const all = [];

  for (const slug of MAP_SLUGS) {
    process.stderr.write(`Fetching ${slug} (smokes+molos+flashes+HE)…\n`);
    const nades = await fetchAllNadesForMap(slug);
    const top = pickFeatured(nades, EXPORT_PER_MAP);
    for (const raw of top) {
      try {
        all.push(toLineup(raw, slug));
      } catch {
        console.warn(`skip bad row on ${slug}`, raw?.slug);
      }
    }
    process.stderr.write(`  ${slug}: merged ${nades.length} nades → exporting ${top.length} featured\n`);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const bundle = {
    scrapedAt: new Date().toISOString(),
    source: 'https://csnades.gg',
    lineupCount: all.length,
    lineups: all,
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(bundle, null, 2), 'utf8');
  console.log(`Wrote ${OUT_JSON}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
