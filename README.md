# Residency runbook (Croatia)

Static guided runbook for hiring a third-country national via **HZZ labor market test → MUP Single Permit**. Ships with an **anonymized example** case (Zagreb d.o.o., US worker, manual event crew / NKD 90399). Real employer fixtures stay local — see `.gitignore`.

Not legal advice. Numeric legal claims are **structured cited facts** (value + Tier 1/2 source URL + `verifiedDate`), rendered in the UI with the citation attached.

**Progress & next steps:** see [DEVELOPMENT.md](DEVELOPMENT.md).

## Prerequisites

- **Python 3** (for the local static server), or any other static file server
- **Node.js** (optional — only for the facts lint / audit scripts)

## Bring up the server

From the repository root:

```bash
cd residency-runbook   # or: cd /path/to/this/repo
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

The site is fully static (no backend). A local HTTP server is required because the app loads JSON via `fetch` and uses ES modules (opening `index.html` as a `file://` URL will fail).

Alternative servers:

```bash
npx --yes serve -l 8080
# or
php -S localhost:8080
```

## Features

- Guided wizard with step navigation and checklist progress (`localStorage`)
- English-first UI with Croatian (HR) toggle
- Dark-first UI with light-mode toggle
- Nationality-neutral core workflow + pluggable nationality packs (`us` first)
- Cited fact objects for fees, deadlines, and thresholds (build-blocking lint)
- Art. 99 guided self-check + searchable UV / deficitary occupations list

## Architecture

| Layer | Path | Owns |
|---|---|---|
| Core workflow | `data/steps.json` | Nationality-neutral LMT → Single Permit steps |
| Nationality pack | `data/nationalities/{id}.json` | Entry/docs deltas only (US first) |
| Example case | `cases/example-dool-us-manual-labor.json` | Anonymized employer + `nationalityId` |
| Locales | `data/locales/` | EN/HR UI + step copy (no bare fee/day/% strings) |
| Facts schema | `data/facts.schema.md` | Required fact object shape |

**Local testing with a real case (not pushed):** put the fixture at `cases/private/active.json` (gitignored). The app loads that first and falls back to the anonymized example. You can also keep a named copy under `cases/private/` or use `cases/*-private.json` / `cases/vpr-*.json` (all ignored).

## Cited facts (build-blocking)

```bash
node scripts/lint-facts.mjs
```

Fails if currency / day-count / percent / similar thresholds appear outside a fact object’s `value`, or if a fact is missing `value`, `sourceUrl`, `sourceTier`, or `verifiedDate`.

Generate the QA audit artifact:

```bash
node scripts/generate-facts-audit.mjs
```

Outputs `artifacts/facts-audit.json` and `artifacts/facts-audit.md`.

## Persistence

`localStorage` key `residency-runbook:<case-id>` stores completed steps, checklist ids, locale, theme.

## Step 1 tools

- **Art. 99 self-check** — guided where/how/evidence workflow from `data/art99-checks.json`
- **UV / deficitary occupations search** — `data/uv-occupations.json` ingested from the official MUP/HZZ PDF (edition `2023-03`). Default filter: Grad Zagreb + NKD-relevant tags for the loaded case. Re-check the live HZZ hub before filing; the list can be amended after this edition.

Source PDF: [MUP-hosted list](https://mup.gov.hr/UserDocsImages/2024/8/Lista-zanimanja-izuzetak-od-provedbe-testa-trzista-rada_2023.pdf) · [HZZ hub](https://www.hzz.hr/usluge/radne-dozvole-za-zaposljavanje-stranaca-i-test-trzista-rada/)

## Development roadmap

Full phase board: **[DEVELOPMENT.md](DEVELOPMENT.md)**.

## Source registry

See [`croatia-foreign-worker-sources.md`](croatia-foreign-worker-sources.md) and [`zakon-srancima-narodne-novine.json`](zakon-srancima-narodne-novine.json).
