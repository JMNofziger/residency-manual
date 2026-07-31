# Development phases

Progress board for the Croatia employer hiring runbook.

**Goal:** Static guided checklist: labor market test (HZZ) → stay-and-work permit (MUP), with nationality packs and cited facts. Real employer cases stay local (`cases/private/`).

**Not legal advice.** Numeric claims must be cited fact objects; `node scripts/lint-facts.mjs` is build-blocking.

## Status

| Phase | Name | Status |
|---|---|---|
| 0–5 | Sources, shell, facts, US pack, Art. 99 + UV, live Tier-1 verify | Done |
| 6a | Guided steps 3–4 (employer package + labor market test) | Done |
| 6b | Guided step 2 (occupation + duties + UV path decision) | Done |
| 6 | Remaining: steps 5–8 deepen | Next |
| 7 | More nationality packs + case picker | Planned |
| 8 | Hosting + CI lint | Planned |

## Remaining Phase 6

- [ ] Step 5 — worker documents (deepen US pack checklist)
- [ ] Step 6 — stay-and-work filing for Zagreb competence
- [ ] Step 7 — biometrics / pension / health / tax order of operations
- [ ] Step 8 — compliance calendar (employer change, unemployment, language)

## Done highlights

- Guided panels via [`js/guided-checks.js`](js/guided-checks.js) (Art. 99, occupation, employer package, LMT)
- Phase 5 verification: [`artifacts/phase5-verification.md`](artifacts/phase5-verification.md)

## Contribute

1. `python3 -m http.server 8080`
2. Prefer Tier 1 URLs in [`croatia-foreign-worker-sources.md`](croatia-foreign-worker-sources.md)
3. Keep lint green; update this board when a slice ships
