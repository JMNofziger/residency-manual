# Development phases

Progress board for the Croatia employer hiring runbook.

**Goal:** Static guided checklist: labor market test (HZZ) → stay-and-work permit (MUP), with nationality packs, cited facts, glossary, offices, step gates, and exportable case files. Real employer cases stay local (`cases/private/`).

**Not legal advice.** Numeric claims must be cited fact objects; `node scripts/lint-facts.mjs` is build-blocking.

## Status

| Phase | Name | Status |
|---|---|---|
| 0–5 | Sources, shell, facts, US pack, Art. 99 + UV, live Tier-1 verify | Done |
| 6a–6g | Guided Steps 1–6, glossary/offices, step gates, case file I/O | Done |
| 6h | Guided Step 7 (decision → biometrics → HZMO/HZZO/tax → start) | Done |
| 6i | Guided Step 8 (compliance calendar) | Done |
| **6** | **Employer runbook path (Steps 1–8)** | **Done** |
| 7 | More nationality packs + case picker | Planned |
| 8 | Hosting + CI lint | Planned |

## Done highlights

- Guided panels via [`js/guided-checks.js`](js/guided-checks.js) for every step (Art. 99 through compliance)
- Step gates: [`js/step-gates.js`](js/step-gates.js) + `advanceRequires` in [`data/steps.json`](data/steps.json)
- Case file I/O: [`js/case-file.js`](js/case-file.js) (pretty JSON = case + progress)
- US pack: [`data/nationalities/us.json`](data/nationalities/us.json)
- Glossary / offices: [`data/glossary.json`](data/glossary.json), [`data/offices.json`](data/offices.json)
- Live verifies: [`artifacts/phase5-verification.md`](artifacts/phase5-verification.md), [`artifacts/phase6e-verification.md`](artifacts/phase6e-verification.md)

## Contribute

1. `python3 -m http.server 8080`
2. Prefer Tier 1 URLs in [`croatia-foreign-worker-sources.md`](croatia-foreign-worker-sources.md)
3. Keep lint green; update this board when a slice ships
4. Multi-hire: **Export case** after progress; keep private JSON out of git
