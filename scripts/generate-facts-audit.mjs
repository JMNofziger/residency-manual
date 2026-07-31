#!/usr/bin/env node
/**
 * Collect every cited fact object under data/ and cases/ into artifacts/.
 * Usage: node scripts/generate-facts-audit.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "artifacts");
const TARGETS = [path.join(ROOT, "data"), path.join(ROOT, "cases")];

function listJsonFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
  return out;
}

function isFactObject(node) {
  return (
    node &&
    typeof node === "object" &&
    !Array.isArray(node) &&
    "value" in node &&
    "sourceUrl" in node &&
    "sourceTier" in node &&
    "verifiedDate" in node
  );
}

function walk(node, file, pathStr, acc) {
  if (!node || typeof node !== "object") return;
  if (isFactObject(node)) {
    const ageDays = Math.floor(
      (Date.UTC(2026, 6, 30) - Date.parse(node.verifiedDate)) / (24 * 3600 * 1000)
    );
    acc.push({
      id: node.id || null,
      value: node.value,
      labelKey: node.labelKey || null,
      sourceUrl: node.sourceUrl,
      sourceTier: node.sourceTier,
      sourceName: node.sourceName || null,
      verifiedDate: node.verifiedDate,
      ageDaysAsOfAudit: Number.isFinite(ageDays) ? ageDays : null,
      file: path.relative(ROOT, file),
      path: pathStr || "(root)",
    });
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, file, `${pathStr}[${i}]`, acc));
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    walk(v, file, pathStr ? `${pathStr}.${k}` : k, acc);
  }
}

const facts = [];
for (const file of TARGETS.flatMap(listJsonFiles)) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  walk(data, file, "", facts);
}

facts.sort((a, b) => String(a.id).localeCompare(String(b.id)) || a.path.localeCompare(b.path));

const auditDate = "2026-07-30";
const payload = {
  generatedAt: auditDate,
  caseId: "example-dool-us-manual-labor",
  factCount: facts.length,
  tier1Count: facts.filter((f) => f.sourceTier === 1).length,
  tier2Count: facts.filter((f) => f.sourceTier === 2).length,
  notes: [
    "verifiedDate reflects last check against linked source registry / Tier 1 URLs in-repo, not a live MUP/HZZ/NN scrape on audit day.",
    "LIVE RE-VERIFY BEFORE FILING: permit fee €46.45, biometric card fee €9.29, long-term fee €83.62 (MUP pages).",
    "LIVE RE-VERIFY: Art. 99-style 20% / 12 months / 30 days / €100,000 (HZZ novi sustav + NN text).",
    "LIVE RE-VERIFY: LMT positive-notice window 90 days; permit decision window 90 days; employer-change 6 months; unemployment 3/6 months; A1 within 1 year (NN 55/2026 + MUP/HZZ).",
    "LIVE RE-VERIFY (US pack): visa-free 90/180 and police registration 48 hours (U.S. Embassy Croatia page).",
    "Omitted on purpose: Blue Card fee amounts (wrong path for this job); seasonal/student numeric rules; Form 17a field-level specs (confirm current form template).",
    "Employer revenue in the case fixture is case data (number field), not a cited legal fact — still needs live tax/bank verification.",
  ],
  facts,
};

fs.mkdirSync(OUT_DIR, { recursive: true });
const jsonPath = path.join(OUT_DIR, "facts-audit.json");
const mdPath = path.join(OUT_DIR, "facts-audit.md");
fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2) + "\n");

const lines = [
  "# Facts audit",
  "",
  `Generated: ${auditDate}`,
  `Case: ${payload.caseId}`,
  `Total cited facts: ${payload.factCount} (Tier 1: ${payload.tier1Count}, Tier 2: ${payload.tier2Count})`,
  "",
  "## Notes",
  "",
  ...payload.notes.map((n) => `- ${n}`),
  "",
  "## Claims",
  "",
  "| ID | Value | Label key | Source | Tier | Verified | Age (days) | File |",
  "|---|---|---|---|---:|---|---:|---|",
  ...facts.map(
    (f) =>
      `| ${f.id || "—"} | ${f.value} | ${f.labelKey || "—"} | ${f.sourceName || f.sourceUrl} | ${f.sourceTier} | ${f.verifiedDate} | ${f.ageDaysAsOfAudit ?? "—"} | ${f.file} |`
  ),
  "",
];
fs.writeFileSync(mdPath, lines.join("\n"));

console.log(`facts-audit: wrote ${facts.length} facts → artifacts/facts-audit.json and artifacts/facts-audit.md`);
