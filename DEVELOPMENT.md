# Development phases

Progress board for the Croatia employer hiring runbook.

**Goal:** Static guided checklist: labor market test (HZZ) → stay-and-work permit (MUP), with nationality packs, cited facts, glossary, offices, step gates, and exportable case files. Real employer cases stay local (`cases/private/`).

**Not legal advice.** Numeric claims must be cited fact objects; `npm run lint:facts` is build-blocking (also on CI).

## Status

| Phase | Name | Status |
|---|---|---|
| 0–5 | Sources, shell, facts, US pack, Art. 99 + UV, live Tier-1 verify | Done |
| 6 | Guided Steps 1–8, glossary/offices, gates, case file I/O | Done |
| 7a | Case picker (`cases/index.json`) + Zagreb scope banner | Done |
| 7 | More nationality packs (beyond US) | Next |
| 8a | CI lint-facts + gate smoke | Done |
| 8b | EN/HR locale parity in CI + fee uncertainty cards + workflow overview home | Done |
| 8 | Hosting (static deploy) | Planned |

## Known gaps (see critique)

Deep review: [`artifacts/product-critique.md`](artifacts/product-critique.md).

Priorities: canonical fact catalog, more nationality packs, anonymized export, hosting.

## Done highlights

- Guided panels via [`js/guided-checks.js`](js/guided-checks.js) for every step
- Step gates + completion reconcile: [`js/step-gates.js`](js/step-gates.js), `reconcileStepCompletion` in [`js/app.js`](js/app.js)
- Case file I/O: [`js/case-file.js`](js/case-file.js); case picker: [`cases/index.json`](cases/index.json)
- CI: [`.github/workflows/lint-facts.yml`](.github/workflows/lint-facts.yml) — facts + EN/HR locale parity + gate smoke
- Workflow overview home + fee uncertainty cards: [`js/overview.js`](js/overview.js), [`js/uncertainty.js`](js/uncertainty.js), [`data/uncertainty.json`](data/uncertainty.json)
- Live verifies: [`artifacts/phase5-verification.md`](artifacts/phase5-verification.md), [`artifacts/phase6e-verification.md`](artifacts/phase6e-verification.md)

## Contribute

1. `python3 -m http.server 8080`
2. `npm run lint` (facts + EN/HR parity) and `npm run test:gates` before push
3. Prefer Tier 1 URLs in [`croatia-foreign-worker-sources.md`](croatia-foreign-worker-sources.md)
4. Multi-hire: **Export case** after progress; keep private JSON out of git
5. Update this board when a slice ships
