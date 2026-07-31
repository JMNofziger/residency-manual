# Phase 5 — Live Tier-1 verification report

> **Note (current):** Stay-and-work admin fee source of truth is [`phase6e-verification.md`](phase6e-verification.md) (**€74.32**). Contested alternate readings are modeled in `data/uncertainty.json`. This Phase 5 log is retained as a changelog.

**Date:** 2026-07-31  
**Case:** `local private case (not in repo)`  
**Method:** Fetch/read live Tier-1 pages; confirm or correct each cited fact; omit unconfirmable numbers.

## Sources checked

| Source | URL | Result |
|---|---|---|
| HZZ — Novi sustav | https://www.hzz.hr/usluge/radne-dozvole-za-zaposljavanje-stranaca-i-test-trzista-rada/novi-sustav-zaposljavanja-stranaca/ | Art. 99 thresholds + 90-day LMT notice window confirmed |
| HZZ — Savjeti | https://www.hzz.hr/usluge/radne-dozvole-za-zaposljavanje-stranaca-i-test-trzista-rada/savjeti-za-predaju-zahtjeva/ | Unemployment 3/6 months confirmed |
| MUP — Temporary stay | https://mup.gov.hr/aliens-281621/stay-and-work/temporary-stay-of-third-country-nationals/281661 | Fees €46.45 (generic temporary stay) / €31.85 / €9.29 confirmed — **stay-and-work admin fee corrected to €74.32 in Phase 6e** |
| MUP — Long-term / permanent | https://mup.gov.hr/aliens-281621/stay-and-work/long-term-residence-and-permanent-stay/281682 | €83.62 confirmed |
| MUP — Blue Card | https://mup.gov.hr/aliens-281621/stay-and-work/stay-and-work-of-highly-qualified-third-country-nationals/281692 | Fees present; **48-month validity not stated** → omitted from wizard |
| NN 55/2026 | https://narodne-novine.nn.hr/clanci/sluzbeni/2026_05_55_692.html | Force date, 90-day decision, mobility, unemployment, A1.1 + deferred Art. 92.a confirmed |
| MVEP — Granting stay | https://mvep.gov.hr/services-consular-portal/consular-information-22802/stay-of-foreigners/granting-stay-in-croatia/22839 | 90/180 short stay; registration 1 day (provider) / 2 days (alien) |
| UV list PDF | MUP/HZZ 2023 PDF (still hosted) | No newer public UV decision PDF found |

U.S. Embassy Croatia entry page is JS-heavy and did not yield extractable text in this pass; US pack numerics retargeted to **MVEP** Tier 1 wording.

## Corrections applied

1. **Biometric fees** — was only €9.29 (understated). Now cite €31.85 production (regular) + €9.29 admin, plus temporary-stay admin €46.45. **Later (Phase 6e):** Single Permit / stay-and-work admin fee is **€74.32** on MUP Work of TCN — see [`phase6e-verification.md`](phase6e-verification.md).
2. **Police registration** — was “48 hours” via Embassy. Now **2 days** via MVEP (alien self-registration if provider cannot register).
3. **Visa-free 90/180** — kept; source retargeted to MVEP.
4. **Blue Card 48 months** — **removed** (not confirmed on live MUP Blue Card page / NN 55/2026 excerpt).
5. **A1 language** — clarified as **A1.1**; added deferred force fact **2027-06-04** for Art. 92.a(1)/(4)/(6).
6. **UV edition** — remains `2023-03` with stale banner; `verifiedDate` bumped after re-check that no newer public PDF was found.
7. All remaining confirmed facts: `verifiedDate` → **2026-07-31**.

## Still not “filing-ready” without employer work

- Live tax/contribution/bank evidence for the local private case (case revenue ≠ Art. 99 inflow proof)
- Re-open MUP fee page on payment day (accelerated biometric production €59.73 exists but is not a default wizard fact)
- Re-open HZZ UV hub before assuming any LMT skip

## Exit criteria checklist

- [x] Walk facts audit against Tier 1 URLs
- [x] Confirm or keep UV list edition (kept 2023-03; no newer PDF)
- [x] Confirm Art. 99 thresholds
- [x] Confirm permit / biometric fees (and correct understatement)
- [x] Re-run lint + regenerate audit
- [x] Note intentional omissions (Blue Card validity months; accelerated biometric fee; Form 17a specs)
