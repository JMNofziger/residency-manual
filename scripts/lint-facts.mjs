#!/usr/bin/env node
/**
 * Walks data/ and cases/ JSON. Fails if:
 * 1) A fact-like object is missing required fields
 * 2) A string outside fact.value matches currency / day-count / % / threshold patterns
 * 3) A facts[] string id is missing from data/facts-catalog.json
 * 4) A catalog fact is re-inlined (same value+labelKey) outside the catalog / uncertainty
 *
 * Usage: node scripts/lint-facts.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TARGETS = [path.join(ROOT, "data"), path.join(ROOT, "cases")];
const CATALOG_REL = "data/facts-catalog.json";

const REQUIRED_FACT_FIELDS = ["value", "sourceUrl", "sourceTier", "verifiedDate"];

/** Numeric/legal threshold patterns that must live in fact.value only */
const UNSOURCED_PATTERNS = [
  { name: "currency-euro", re: /€\s*[\d.,]+\s*k?/i },
  { name: "currency-eur-word", re: /\bEUR\s*[\d.,]+/i },
  { name: "percent", re: /\b\d{1,3}(?:[.,]\d+)?\s*%/ },
  { name: "day-count", re: /\b\d{1,4}\s*-\s*day\b|\b\d{1,4}\s+days?\b/i },
  { name: "hour-count", re: /\b\d{1,3}\s*-\s*hour\b|\b\d{1,3}\s+hours?\b/i },
  { name: "month-count", re: /\b\d{1,3}\s+months?\b/i },
  { name: "year-count", re: /\b\d{1,2}\s+years?\b/i },
  { name: "schengen-window", re: /\b\d{1,3}\s*\/\s*180\b/ },
  { name: "euro-thousands-k", re: /\b\d+(?:[.,]\d+)?\s*k\b/i },
];

const ALLOWED_STRING_PATHS = [
  /sourceUrl$/i,
  /url$/i,
  /finaUrl$/i,
  /mirrorUrl$/i,
  /hubUrl$/i,
  /verifiedDate$/i,
  /gazette_date$/i,
  /official_gazette$/i,
  /\.id$/i,
  /oib$/i,
  /mb$/i,
  /nkd2025$/i,
  /nkd2007$/i,
  /titleHr$/i,
  /titleEn$/i,
  /edition$/i,
  /policeAdmin$/i,
  /hzzRegion$/i,
  /labelKey$/i,
  /titleKey$/i,
  /whyKey$/i,
  /evidenceKey$/i,
  /noteKey$/i,
  /relevanceNoteKey$/i,
  /seasonalNoteKey$/i,
  /introKey$/i,
  /bodyKey$/i,
  /summaryKey$/i,
  /blurbKey$/i,
  /narrativeKey$/i,
  /roleKey$/i,
  /adoptedLabelKey$/i,
  /meaningKey$/i,
  /pageNoteKey$/i,
];

function isFactObject(node) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return false;
  return (
    Object.prototype.hasOwnProperty.call(node, "value") &&
    (Object.prototype.hasOwnProperty.call(node, "sourceUrl") ||
      Object.prototype.hasOwnProperty.call(node, "sourceTier") ||
      Object.prototype.hasOwnProperty.call(node, "verifiedDate") ||
      Object.prototype.hasOwnProperty.call(node, "labelKey"))
  );
}

/** Skip gitignored private / real-employer fixtures so lint stays repo-safe. */
function isPrivateCasePath(fullPath) {
  const rel = path.relative(ROOT, fullPath).split(path.sep).join("/");
  if (rel.startsWith("cases/private/")) return true;
  if (/^cases\/.*-private\.json$/i.test(rel)) return true;
  if (/^cases\/vpr-/i.test(rel)) return true;
  if (/^cases\/.*\.local\.json$/i.test(rel)) return true;
  return false;
}

function listJsonFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (isPrivateCasePath(full)) continue;
    if (entry.isDirectory()) out.push(...listJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
  return out;
}

function pathAllowedForNumericString(pathStr) {
  return ALLOWED_STRING_PATHS.some((re) => re.test(pathStr));
}

function looksLikeIsoDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function looksLikeGazetteRef(s) {
  return /\bNN\s*\d+/i.test(s) || /\bArt\.?\s*\d+/i.test(s) || /\bForm\s*\d+/i.test(s);
}

function findUnsourcedMatches(str) {
  if (looksLikeIsoDate(str)) return [];
  const matches = [];
  for (const { name, re } of UNSOURCED_PATTERNS) {
    if (re.test(str)) {
      if (
        (name === "month-count" || name === "year-count" || name === "schengen-window") &&
        looksLikeGazetteRef(str) &&
        !/€|\bEUR\b|\d+\s*%|\b\d+\s+days?\b/i.test(str)
      ) {
        continue;
      }
      matches.push(name);
    }
  }
  return matches;
}

function isFactsArrayItemPath(pathStr) {
  return /\.facts\[\d+\]$/.test(pathStr) || /^facts\[\d+\]$/.test(pathStr);
}

function catalogFingerprint(fact) {
  return `${String(fact.value)}|${String(fact.labelKey || "")}`;
}

function allowInlineCatalogDuplicate(relFile, pathStr) {
  if (relFile === CATALOG_REL) return true;
  // Contested readings may repeat catalog values with different roles
  if (relFile === "data/uncertainty.json" && /\.readings\[\d+\]/.test(pathStr)) return true;
  return false;
}

const errors = [];
const factsFound = [];
let catalogById = {};
let catalogByFingerprint = new Map();
let catalogRefHits = 0;

function validateFact(fact, pathStr, file) {
  for (const field of REQUIRED_FACT_FIELDS) {
    if (fact[field] === undefined || fact[field] === null || fact[field] === "") {
      errors.push({
        file,
        path: pathStr,
        type: "missing-fact-field",
        message: `Fact object missing required field "${field}"`,
      });
    }
  }
  if (fact.sourceTier !== undefined && fact.sourceTier !== 1 && fact.sourceTier !== 2) {
    errors.push({
      file,
      path: pathStr,
      type: "bad-source-tier",
      message: `sourceTier must be 1 or 2, got ${JSON.stringify(fact.sourceTier)}`,
    });
  }
  if (fact.verifiedDate && !looksLikeIsoDate(String(fact.verifiedDate))) {
    errors.push({
      file,
      path: pathStr,
      type: "bad-verified-date",
      message: `verifiedDate must be YYYY-MM-DD, got ${JSON.stringify(fact.verifiedDate)}`,
    });
  }

  if (file !== CATALOG_REL && fact.id && catalogById[fact.id]) {
    errors.push({
      file,
      path: pathStr,
      type: "catalog-id-redefined",
      message: `Fact id "${fact.id}" belongs in ${CATALOG_REL}; use a string ref in facts[] instead of re-inlining`,
    });
  }

  const fp = catalogFingerprint(fact);
  const catalogId = catalogByFingerprint.get(fp);
  if (catalogId && !allowInlineCatalogDuplicate(file, pathStr)) {
    errors.push({
      file,
      path: pathStr,
      type: "catalog-value-reinlined",
      message: `Fact matches catalog id "${catalogId}" (${fact.value} / ${fact.labelKey}). Use string ref "${catalogId}" in facts[] instead of re-inlining`,
    });
  }

  factsFound.push({ file, path: pathStr, fact });
}

function walk(node, pathStr, file, inFactValue) {
  if (node === null || node === undefined) return;

  if (isFactObject(node)) {
    validateFact(node, pathStr, file);
    for (const [key, val] of Object.entries(node)) {
      walk(val, `${pathStr}.${key}`, file, key === "value");
    }
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, `${pathStr}[${i}]`, file, inFactValue));
    return;
  }

  if (typeof node === "object") {
    for (const [key, val] of Object.entries(node)) {
      walk(val, pathStr ? `${pathStr}.${key}` : key, file, false);
    }
    return;
  }

  if (typeof node === "string") {
    if (isFactsArrayItemPath(pathStr) && file !== CATALOG_REL) {
      if (!catalogById[node]) {
        errors.push({
          file,
          path: pathStr,
          type: "unknown-catalog-ref",
          message: `Unknown facts-catalog id ${JSON.stringify(node)}`,
        });
      } else {
        catalogRefHits += 1;
      }
      return;
    }
    if (inFactValue || pathAllowedForNumericString(pathStr)) return;
    if (/^https?:\/\//i.test(node) || node.startsWith("data/")) return;
    const hits = findUnsourcedMatches(node);
    if (hits.length) {
      errors.push({
        file,
        path: pathStr,
        type: "unsourced-numeric",
        message: `Unsourced fact-like content (${hits.join(", ")}): ${JSON.stringify(node).slice(0, 160)}`,
      });
    }
  }
}

// Load catalog first
const catalogPath = path.join(ROOT, CATALOG_REL);
if (!fs.existsSync(catalogPath)) {
  console.error(`lint-facts: missing ${CATALOG_REL}`);
  process.exit(2);
}
let catalogData;
try {
  catalogData = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
} catch (e) {
  console.error(`lint-facts: failed to parse ${CATALOG_REL}: ${e}`);
  process.exit(2);
}
catalogById = catalogData.facts && typeof catalogData.facts === "object" ? catalogData.facts : {};
for (const [id, fact] of Object.entries(catalogById)) {
  if (!fact || typeof fact !== "object") {
    errors.push({
      file: CATALOG_REL,
      path: `facts.${id}`,
      type: "bad-catalog-entry",
      message: "Catalog entry must be an object",
    });
    continue;
  }
  validateFact(fact, `facts.${id}`, CATALOG_REL);
  catalogByFingerprint.set(catalogFingerprint(fact), id);
}

const files = TARGETS.flatMap(listJsonFiles).filter((f) => path.relative(ROOT, f) !== CATALOG_REL);
if (files.length === 0) {
  console.error("lint-facts: no JSON files found under data/ or cases/");
  process.exit(2);
}

for (const file of files) {
  const rel = path.relative(ROOT, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    errors.push({ file: rel, path: "(root)", type: "parse-error", message: String(e) });
    continue;
  }
  walk(data, "", rel, false);
}

if (errors.length) {
  console.error(`lint-facts: FAILED with ${errors.length} issue(s), ${factsFound.length} fact object(s) seen\n`);
  for (const err of errors) {
    console.error(`- [${err.type}] ${err.file} @ ${err.path || "(root)"}\n  ${err.message}`);
  }
  process.exit(1);
}

console.log(
  `lint-facts: OK — ${files.length + 1} files, ${Object.keys(catalogById).length} catalog fact(s), ${catalogRefHits} catalog ref(s), ${factsFound.length} cited fact object(s), no unsourced thresholds.`
);
