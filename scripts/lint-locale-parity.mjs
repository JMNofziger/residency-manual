#!/usr/bin/env node
/**
 * Fail if EN and HR locale trees do not share the same leaf key paths.
 * Usage: node scripts/lint-locale-parity.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EN = path.join(ROOT, "data/locales/en.json");
const HR = path.join(ROOT, "data/locales/hr.json");

function flatten(obj, prefix = "", out = []) {
  if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      const p = prefix ? `${prefix}.${k}` : k;
      flatten(v, p, out);
    }
  } else {
    out.push(prefix);
  }
  return out;
}

const en = JSON.parse(fs.readFileSync(EN, "utf8"));
const hr = JSON.parse(fs.readFileSync(HR, "utf8"));
const enKeys = new Set(flatten(en));
const hrKeys = new Set(flatten(hr));

const onlyEn = [...enKeys].filter((k) => !hrKeys.has(k)).sort();
const onlyHr = [...hrKeys].filter((k) => !enKeys.has(k)).sort();

if (onlyEn.length || onlyHr.length) {
  console.error("lint-locale-parity: FAILED — EN/HR key trees differ\n");
  if (onlyEn.length) {
    console.error(`Only in EN (${onlyEn.length}):`);
    onlyEn.forEach((k) => console.error(`  + ${k}`));
  }
  if (onlyHr.length) {
    console.error(`Only in HR (${onlyHr.length}):`);
    onlyHr.forEach((k) => console.error(`  + ${k}`));
  }
  process.exit(1);
}

console.log(`lint-locale-parity: OK — ${enKeys.size} shared leaf keys`);
