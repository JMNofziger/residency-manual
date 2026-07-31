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

- Step-by-step checklist with progress saved in the browser
- English / Croatian and dark / light toggles
- **Glossary** and **Offices** (address book) from the header
- Per-step office cards for the agencies you will deal with
- Guided self-checks (employer conditions, occupation, employer package, labor market test)
- Official UV occupation search (titles that may skip the labor market test)

## Private test case (local only)

Put a real case at `cases/private/active.json` (gitignored). The app prefers that file, then falls back to the anonymized example in `cases/`.

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
| [artifacts/phase5-verification.md](artifacts/phase5-verification.md) | Latest live source pass |
