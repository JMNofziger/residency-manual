# Residency runbook (Croatia)

Guided employer checklist for hiring a **third-country national** (someone from outside the EU/EEA/Switzerland) for manual work in Croatia.

Usual path: **labor market test** at the Croatian Employment Service (HZZ) → **stay-and-work permit** (Single Permit) at the Ministry of the Interior (MUP).

Not legal advice. Fees, deadlines, and thresholds appear only as **cited facts** with official source links.

## Run locally

```bash
python3 -m http.server 8080
```

Open http://localhost:8080 (needed for JSON/`fetch`; do not open as `file://`).

## In the app

- Step-by-step checklist; **Export case** / **Import case** for durable progress (pretty-printed JSON). Browser storage is only a last-session cache.
- Steps unlock in order: you cannot advance until that step’s required guided checks (e.g. Art. 99) are satisfied
- English / Croatian and dark / light toggles
- **Glossary** and **Offices** (address book) from the header
- Per-step office cards for the agencies you will deal with
- Guided self-checks (employer conditions, occupation, employer package, labor market test, worker docs, Zagreb filing)
- Official UV occupation search (titles that may skip the labor market test)

## Private test case (local only)

Put a real case at `cases/private/active.json` (gitignored). The app prefers that file, then falls back to the anonymized example in `cases/`.

For multiple hires, export one `{id}-runbook.json` per worker (case + checklist progress). Do not commit private exports — they may contain OIB and other identifiers.

## Facts lint (optional Node)

```bash
node scripts/lint-facts.mjs
node scripts/generate-facts-audit.mjs
```

## Docs for maintainers

| Doc | Purpose |
|---|---|
| [DEVELOPMENT.md](DEVELOPMENT.md) | Phase board |
| [croatia-foreign-worker-sources.md](croatia-foreign-worker-sources.md) | Official source list |
| [data/facts.schema.md](data/facts.schema.md) | Cited-fact shape |
| [artifacts/phase5-verification.md](artifacts/phase5-verification.md) | Phase 5 live source pass |
| [artifacts/phase6e-verification.md](artifacts/phase6e-verification.md) | Phase 6e fee / Form 2a pass |
