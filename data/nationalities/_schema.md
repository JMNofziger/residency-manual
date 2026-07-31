# Nationality pack schema

Packs: `data/nationalities/{id}.json`  
Strings: `data/locales/nationalities/{id}.{locale}.json`

Core `data/steps.json` stays nationality-neutral. Packs inject into slots only.

## Pack fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Matches case `worker.nationalityId` |
| `labelKey` | string | Chip label key (pack locale) |
| `flagEmoji` | string | Optional |
| `slots` | object | Map of core `stepId` → slot payload |

## Slot payload

| Field | Type | Description |
|---|---|---|
| `blurbKey` / `titleKey` / `notesKey` | string | Locale keys — **no** fees/day-counts/% in the strings |
| `facts` | Fact[] | Structured cited facts (required for any numeric claim) |
| `checklist` | array | `{ id, labelKey, helpKey?, facts?, links? }` |
| `links` | array | `{ labelKey, url }` |

## Fact object

See [`../facts.schema.md`](../facts.schema.md). Unsourced numbers are build-blocking (`node scripts/lint-facts.mjs`).

## Slot map (v1)

- `orient` — practical differences + entry-window facts
- `worker-docs` — primary country document checklist + facts
- `file-permit` — only if filing channel differs
- `start-work` / `comply` — rare deltas

## Extensibility

New country = pack JSON + locale files + case `nationalityId`. Do not edit `steps.json` for nationality rules.
