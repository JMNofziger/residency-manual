# Residency runbook (Croatia)

Guided employer checklist for hiring a **third-country national** (outside EU/EEA/Switzerland) for manual work in Croatia.

Usual path: **labor market test** (HZZ) → **stay-and-work permit** / Single Permit (MUP).

Not legal advice. Fees, deadlines, and thresholds appear only as **cited facts** with official source links.

## Run locally

```bash
python3 -m http.server 8080
```

Open http://localhost:8080 (needed for JSON/`fetch`; do not open as `file://`).

## In the app

- Eight guided steps from employer fitness through compliance
- **Export case** / **Import case** — pretty-printed JSON (case + progress). Browser storage is a last-session cache only
- Steps unlock in order; required guided checks (e.g. Art. 99) must pass before you can advance
- English / Croatian and dark / light toggles
- **Glossary** and **Offices** from the header; per-step office cards
- Official UV occupation search (titles that may skip the labor market test)

## Private cases (local only)

Put a real case at `cases/private/active.json` (gitignored). The app prefers that file, then the anonymized example in `cases/`.

For multiple hires, export one `{id}-runbook.json` per worker. Do not commit private exports (may contain OIB and other identifiers).

## Facts lint

```bash
node scripts/lint-facts.mjs
node scripts/generate-facts-audit.mjs
```

## Docs

| Doc | Purpose |
|---|---|
| [DEVELOPMENT.md](DEVELOPMENT.md) | Phase board |
| [croatia-foreign-worker-sources.md](croatia-foreign-worker-sources.md) | Official source list |
| [data/facts.schema.md](data/facts.schema.md) | Cited-fact shape |
| [artifacts/phase5-verification.md](artifacts/phase5-verification.md) | Phase 5 live source pass |
| [artifacts/phase6e-verification.md](artifacts/phase6e-verification.md) | Phase 6e fee / Form 2a pass |
