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
- **Case picker** in the sidebar (`cases/index.json`; private `cases/private/active.json` when present)
- **Export case** / **Import case** — pretty-printed JSON (case + progress). Browser storage is a last-session cache only
- Steps unlock in order; required guided checks must pass (completion is revoked if you uncheck a required item)
- Scope banner: desks/competence modeled for **Grad Zagreb**
- English / Croatian and dark / light toggles
- **Glossary** and **Offices**; per-step office cards
- Official UV occupation search (titles that may skip the labor market test)

## Private cases (local only)

Put a real case at `cases/private/active.json` (gitignored). It appears first in the case picker when present.

For multiple hires, export one `{id}-runbook.json` per worker. Do not commit private exports (may contain OIB and other identifiers).

## Facts lint / CI

```bash
npm run lint:facts
npm run test:gates
npm run audit:facts
```

GitHub Actions runs lint + gate smoke on pushes/PRs to `main`.

## Docs

| Doc | Purpose |
|---|---|
| [DEVELOPMENT.md](DEVELOPMENT.md) | Phase board |
| [croatia-foreign-worker-sources.md](croatia-foreign-worker-sources.md) | Official source list |
| [data/facts.schema.md](data/facts.schema.md) | Cited-fact shape |
| [artifacts/product-critique.md](artifacts/product-critique.md) | Post–Phase 6 critique |
| [artifacts/phase5-verification.md](artifacts/phase5-verification.md) | Phase 5 live source pass |
| [artifacts/phase6e-verification.md](artifacts/phase6e-verification.md) | Phase 6e fee / Form 2a pass |
