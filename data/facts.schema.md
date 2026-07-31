# Cited fact objects (build-blocking)

Every fact-bearing claim (fees, deadlines, day-counts, percentages, thresholds, document requirements with numeric/legal specificity) MUST be a structured object — never bare prose.

## Shape

```json
{
  "id": "permit-admin-fee",
  "value": "€74.32",
  "labelKey": "facts.permitFee",
  "sourceUrl": "https://mup.gov.hr/aliens-281621/stay-and-work/work-of-third-country-nationals/281663",
  "sourceTier": 1,
  "sourceName": "MUP — Work of third-country nationals",
  "verifiedDate": "2026-07-31"
}
```

| Field | Required | Notes |
|---|---|---|
| `value` | yes | Display value (`€74.32`, `90 days`, `20%`, …) |
| `labelKey` | yes (UI) | i18n key for what the figure means |
| `sourceUrl` | yes | Prefer Tier 1 |
| `sourceTier` | yes | `1` or `2` |
| `sourceName` | recommended | Short citation label for UI |
| `verifiedDate` | yes | ISO date `YYYY-MM-DD` when we last checked the source |
| `id` | recommended | Stable id for checklists / audit |

## Canonical catalog (shared fees)

Shared fees/deadlines live in [`facts-catalog.json`](facts-catalog.json). Elsewhere, `facts[]` may contain **string ids** that resolve at load time:

```json
"facts": ["permit-admin-fee", "biometric-production-fee", "biometric-admin-fee"]
```

Inline full objects remain allowed for one-off / local facts. Do **not** re-inline a catalog entry’s `value` + `labelKey` outside the catalog (lint fails). Contested alternate readings stay in [`uncertainty.json`](uncertainty.json), not the catalog.

Runtime: `FactsCatalog.load()` + `FactsCatalog.resolve()` in [`js/facts.js`](../js/facts.js).

## Where facts live

- `data/facts-catalog.json` — shared canonical facts (id → object)
- `data/steps.json` — `facts[]` on steps or sections (ids and/or objects)
- `data/*-checks.json` — `facts[]` on guided checks
- `data/nationalities/{id}.json` — `facts[]` on slots / checklist items
- `data/occupations.json` — only if stating numeric legal thresholds
- `cases/*.json` — risk flags that assert legal thresholds include `facts[]`

Locale strings (`data/locales/**`) must not embed currency amounts, day-counts, percentages, or similar thresholds — the lint script fails the build if they do.

## Lint

```bash
node scripts/lint-facts.mjs
```

## Audit artifact

```bash
node scripts/generate-facts-audit.mjs
```

Writes `artifacts/facts-audit.json` and `artifacts/facts-audit.md`.
