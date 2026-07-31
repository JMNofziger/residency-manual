# Development phases

Living progress board for the Croatia employer hiring wizard. Update this file when a phase completes or priorities change.

**Product goal:** A static, employer-facing guided runbook for hiring a third-country national (manual labor) via **HZZ labor market test → MUP Single Permit**, with nationality packs, cited facts, and an anonymized example case (real employer fixtures stay local / gitignored).

**Not legal advice.** Numeric legal claims must ship as cited fact objects; `node scripts/lint-facts.mjs` is build-blocking.

---

## Status summary

| Phase | Name | Status |
|---|---|---|
| 0 | Source registry & statute index | Done |
| 1 | Static wizard shell (i18n, theme, progress, case) | Done |
| 2 | Cited facts system + lint + audit | Done |
| 3 | Core EN/HR step content + US nationality pack | Done |
| 4 | Art. 99 guided self-check + searchable UV list | Done |
| 5 | Live Tier-1 re-verification pass | Done |
| 6 | Harden remaining wizard steps (2–8 workflows) | Next |
| 7 | More nationality packs + case picker | Planned |
| 8 | Hosting, CI, and ops polish | Planned |

---

## Phase 0 — Source registry & statute index

**Status:** Done

- [`croatia-foreign-worker-sources.md`](croatia-foreign-worker-sources.md) — Tier 1/2 Track 1 + US Track 2
- [`zakon-srancima-narodne-novine.json`](zakon-srancima-narodne-novine.json) — NN citations including NN 55/2026

---

## Phase 1 — Static wizard shell

**Status:** Done

- `index.html` + dark-first / light toggle + EN/HR toggle
- Step nav, checklists, `localStorage` progress
- Example case fixture: [`cases/example-dool-us-manual-labor.json`](cases/example-dool-us-manual-labor.json) (anonymized; no real employer PII)
- Nationality pack loader (`us`) — core steps stay nationality-neutral

**Bring up:** see [README.md](README.md).

---

## Phase 2 — Cited facts system

**Status:** Done

- Fact shape: `{ value, labelKey, sourceUrl, sourceTier, sourceName, verifiedDate }` — [`data/facts.schema.md`](data/facts.schema.md)
- UI renders citation + verified date ([`js/facts.js`](js/facts.js))
- Lint: `node scripts/lint-facts.mjs`
- Audit: `node scripts/generate-facts-audit.mjs` → [`artifacts/facts-audit.md`](artifacts/facts-audit.md)

---

## Phase 3 — Core content + US pack

**Status:** Done

- Eight nationality-neutral steps in [`data/steps.json`](data/steps.json)
- EN/HR locales; US pack in `data/nationalities/` + `data/locales/nationalities/`
- NKD 90399 occupation suggestions in [`data/occupations.json`](data/occupations.json)

---

## Phase 4 — Art. 99 self-check + UV occupations search

**Status:** Done

- Guided Art. 99 workflow: [`data/art99-checks.json`](data/art99-checks.json), [`js/art99.js`](js/art99.js)
- Searchable UV / LMT-exemption list (official 2023 PDF ingest): [`data/uv-occupations.json`](data/uv-occupations.json), [`js/uv-list.js`](js/uv-list.js)
- Default filter: Grad Zagreb + NKD 90399–relevant tags; toggle for all Zagreb-applicable titles
- Explicit separation: UV list ≠ Art. 110 police categories
- No invented “stagehand” UV title — LMT remains primary for manual event crew unless a listed title truly matches duties

---

## Phase 5 — Live Tier-1 re-verification pass

**Status:** Done (2026-07-31)

Live pass against HZZ / MUP / NN 55/2026 / MVEP. Report: [`artifacts/phase5-verification.md`](artifacts/phase5-verification.md).

**Material corrections from the pass**

- Biometric fees split into production (€31.85 regular) + admin (€9.29); stay fee €46.45 confirmed
- US registration retargeted to MVEP **2 days** (not Embassy “48 hours”)
- Blue Card **48-month** claim removed (unconfirmed on Tier 1 pages in this pass)
- A1 clarified as **A1.1**; deferred force of Art. 92.a(1)/(4)/(6) cited as **2027-06-04**
- UV list remains official **2023-03** PDF (no newer public decision PDF found)

**Exit criteria**

- [x] Walk facts audit against Tier 1 URLs
- [x] Confirm or keep UV list edition
- [x] Confirm Art. 99 thresholds
- [x] Confirm permit / biometric fees
- [x] Re-run lint + regenerate audit
- [x] Note intentional omissions

---

## Phase 6 — Harden steps 2–8 *(next)*

**Status:** Next up

Step 1 is the deepest workflow. Later steps still need the same “how exactly” treatment:

- [ ] Step 2 — occupation selection UX tied to UV search results + duty templates
- [ ] Step 3 — employer package checklist (contract clauses, Form 17a, housing evidence)
- [ ] Step 4 — HZZ LMT filing walkthrough (screens/portals, 90-day window after positive notice)
- [ ] Step 5 — worker docs with nationality pack slots (US already stubbed; deepen checklist)
- [ ] Step 6 — Single Permit filing path for Zagreb competence
- [ ] Step 7 — biometrics / HZMO / HZZO / tax registration order of operations
- [ ] Step 8 — compliance calendar (employer change, unemployment windows, A1 for extension)

---

## Phase 7 — Extensibility

**Status:** Planned

- [ ] Additional nationality packs (schema already in `data/nationalities/_schema.md`)
- [ ] Case picker UI (multiple employers / nationalities)
- [ ] Optional nationality switcher (chip exists; picker later)

---

## Phase 8 — Hosting, CI, ops

**Status:** Planned

- [ ] Static host (e.g. GitHub Pages / Cloudflare Pages)
- [ ] CI job: `node scripts/lint-facts.mjs` on every PR
- [ ] Optional scheduled reminder to re-verify stale `verifiedDate` facts (e.g. > 90 days)

---

## How to contribute on the next phase

1. Read this file and the [README](README.md).
2. Bring up locally: `python3 -m http.server 8080`
3. Prefer Tier 1 sources from [`croatia-foreign-worker-sources.md`](croatia-foreign-worker-sources.md).
4. Never add bare fee/day/% strings outside a fact object — lint must stay green.
5. Update this phase board when you finish work.
