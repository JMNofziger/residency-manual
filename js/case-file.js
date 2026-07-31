/**
 * Pretty-printed case JSON bundles (case identity + progress).
 * schemaVersion 2 / kind residency-runbook-case
 */

export const CASE_KIND = "residency-runbook-case";
export const CASE_SCHEMA_VERSION = 2;

const CASE_KEYS = [
  "id",
  "title",
  "employer",
  "worker",
  "intendedOccupation",
  "primaryPath",
  "suggestedOccupationIds",
  "riskFlags",
  "notes",
];

export function emptyProgress() {
  return {
    completedStepIds: [],
    checkedItemIds: [],
    selectedOccupationId: null,
    occupationPath: "labor_market_test",
    uvCandidate: null,
    stepIndex: 0,
    locale: null,
    updatedAt: null,
  };
}

export function toBundle(caseData, progress) {
  const bundle = {
    schemaVersion: CASE_SCHEMA_VERSION,
    kind: CASE_KIND,
  };
  for (const key of CASE_KEYS) {
    if (caseData && Object.prototype.hasOwnProperty.call(caseData, key) && caseData[key] !== undefined) {
      bundle[key] = caseData[key];
    }
  }
  // Preserve any extra case fields not in CASE_KEYS (except progress/schema)
  if (caseData && typeof caseData === "object") {
    for (const [k, v] of Object.entries(caseData)) {
      if (k === "progress" || k === "schemaVersion" || k === "kind" || k === "theme") continue;
      if (!(k in bundle)) bundle[k] = v;
    }
  }
  bundle.progress = {
    completedStepIds: [...(progress.completedStepIds || [])],
    checkedItemIds: [...(progress.checkedItemIds || [])],
    selectedOccupationId: progress.selectedOccupationId ?? null,
    occupationPath: progress.occupationPath === "uv_skip_candidate" ? "uv_skip_candidate" : "labor_market_test",
    uvCandidate: progress.uvCandidate && typeof progress.uvCandidate === "object" ? progress.uvCandidate : null,
    stepIndex: typeof progress.stepIndex === "number" ? progress.stepIndex : 0,
    locale: progress.locale || null,
    updatedAt: progress.updatedAt || new Date().toISOString(),
  };
  return bundle;
}

export function serializeBundle(bundle) {
  return `${JSON.stringify(bundle, null, 2)}\n`;
}

export function fromBundle(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("invalid");
  }

  // v1 case-only (no kind) — migrate
  const isV2 = raw.kind === CASE_KIND;
  const isLegacyCase = !raw.kind && raw.id && raw.employer && raw.worker;

  if (!isV2 && !isLegacyCase) {
    throw new Error("kind");
  }

  if (isV2 && raw.schemaVersion != null && Number(raw.schemaVersion) > CASE_SCHEMA_VERSION) {
    throw new Error("version");
  }

  const caseData = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k === "progress" || k === "schemaVersion" || k === "kind") continue;
    caseData[k] = v;
  }
  if (!caseData.id || !caseData.employer || !caseData.worker) {
    throw new Error("shape");
  }

  const p = raw.progress && typeof raw.progress === "object" ? raw.progress : {};
  const progress = {
    ...emptyProgress(),
    completedStepIds: Array.isArray(p.completedStepIds) ? p.completedStepIds : [],
    checkedItemIds: Array.isArray(p.checkedItemIds) ? p.checkedItemIds : [],
    selectedOccupationId: p.selectedOccupationId ?? caseData.intendedOccupation?.id ?? null,
    occupationPath: p.occupationPath === "uv_skip_candidate" ? "uv_skip_candidate" : "labor_market_test",
    uvCandidate: p.uvCandidate && typeof p.uvCandidate === "object" ? p.uvCandidate : null,
    stepIndex: typeof p.stepIndex === "number" ? p.stepIndex : 0,
    locale: p.locale || null,
    updatedAt: p.updatedAt || null,
  };

  return { caseData, progress };
}

export function downloadBundle(bundle, filename) {
  const text = serializeBundle(bundle);
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `${bundle.id || "case"}-runbook.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function parseFile(file) {
  const text = await file.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("json");
  }
  return fromBundle(json);
}
