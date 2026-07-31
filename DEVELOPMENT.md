# Development phases

Progress board for the Croatia employer hiring runbook.

**Goal:** Static guided checklist: labor market test (HZZ) → stay-and-work permit (MUP), with nationality packs, cited facts, glossary, offices address book, step gates, and exportable case files. Real employer cases stay local (`cases/private/`).

**Not legal advice.** Numeric claims must be cited fact objects; `node scripts/lint-facts.mjs` is build-blocking.

## Status

| Phase | Name | Status |
|---|---|---|
| 0–5 | Sources, shell, facts, US pack, Art. 99 + UV, live Tier-1 verify | Done |
| 6a | Guided steps 3–4 (employer package + labor market test) | Done |
| 6b | Guided step 2 (occupation + duties + UV path decision) | Done |
| 6c | Glossary + offices address book; docs/copy clarity | Done |
| 6d | Guided step 5 (worker documents + deeper US pack) | Done |
| 6e | Guided step 6 (Zagreb stay-and-work filing + Form 2a) | Done |
| 6f | Sequential step gates (cannot skip required checks) | Done |
| 6g | Exportable/importable case JSON files | Done |
| 6 | Remaining: steps 7–8 deepen | Next |
| 7 | More nationality packs + case picker | Planned |
| 8 | Hosting + CI lint | Planned |

## Remaining Phase 6

- [ ] Step 7 — biometrics / pension / health / tax order of operations
- [ ] Step 8 — compliance calendar (employer change, unemployment, language)

## Done highlights

- Guided panels via [`js/guided-checks.js`](js/guided-checks.js) (Art. 99, occupation, employer package, LMT, worker docs, file-permit)
- Step gates: [`js/step-gates.js`](js/step-gates.js) + `advanceRequires` on [`data/steps.json`](data/steps.json)
- Case file I/O: [`js/case-file.js`](js/case-file.js) (pretty JSON bundle = case + progress)
- US pack worker-docs pipeline: [`data/nationalities/us.json`](data/nationalities/us.json)
- Glossary + offices: [`data/glossary.json`](data/glossary.json), [`data/offices.json`](data/offices.json)
- Phase 5 verification: [`artifacts/phase5-verification.md`](artifacts/phase5-verification.md)
- Phase 6e fee/form verification: [`artifacts/phase6e-verification.md`](artifacts/phase6e-verification.md)

## Contribute

1. `python3 -m http.server 8080`
2. Prefer Tier 1 URLs in [`croatia-foreign-worker-sources.md`](croatia-foreign-worker-sources.md)
3. Keep lint green; update this board when a slice ships
4. For multi-hire work: **Export case** after progress; keep private JSON out of git
