# Facts audit

Generated: 2026-07-30
Case: example-dool-us-manual-labor
Total cited facts: 29 (Tier 1: 29, Tier 2: 0)

## Notes

- verifiedDate reflects last check against linked source registry / Tier 1 URLs in-repo, not a live MUP/HZZ/NN scrape on audit day.
- LIVE RE-VERIFY BEFORE FILING: permit fee €46.45, biometric card fee €9.29, long-term fee €83.62 (MUP pages).
- LIVE RE-VERIFY: Art. 99-style 20% / 12 months / 30 days / €100,000 (HZZ novi sustav + NN text).
- LIVE RE-VERIFY: LMT positive-notice window 90 days; permit decision window 90 days; employer-change 6 months; unemployment 3/6 months; A1 within 1 year (NN 55/2026 + MUP/HZZ).
- LIVE RE-VERIFY (US pack): visa-free 90/180 and police registration 48 hours (U.S. Embassy Croatia page).
- Omitted on purpose: Blue Card fee amounts (wrong path for this job); seasonal/student numeric rules; Form 17a field-level specs (confirm current form template).
- Employer revenue in the case fixture is case data (number field), not a cited legal fact — still needs live tax/bank verification.

## Claims

| ID | Value | Label key | Source | Tier | Verified | Age (days) | File |
|---|---|---|---|---:|---|---:|---|
| a1-within | 1 year | facts.a1LanguageWithin | Narodne novine — NN 55/2026 | 1 | 2026-07-30 | 0 | data/steps.json |
| art99-blocked-account | 30 days | facts.art99BlockedAccount | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | data/steps.json |
| art99-check-blocked | 30 days | facts.art99BlockedAccount | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | data/art99-checks.json |
| art99-check-continuous | 12 months | facts.art99ContinuousEmployment | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | data/art99-checks.json |
| art99-check-inflow | €100,000 | facts.art99InflowThreshold | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | data/art99-checks.json |
| art99-check-ratio-10 | 10% | facts.art99DeficitaryDomesticRatio | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | data/art99-checks.json |
| art99-check-ratio-20 | 20% | facts.art99DomesticRatio | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | data/art99-checks.json |
| art99-continuous-employment | 12 months | facts.art99ContinuousEmployment | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | data/steps.json |
| art99-domestic-ratio | 20% | facts.art99DomesticRatio | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | data/steps.json |
| art99-inflow-threshold | €100,000 | facts.art99InflowThreshold | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | data/steps.json |
| biometric-card-fee | €9.29 | facts.biometricCardFee | MUP — Temporary Stay | 1 | 2026-07-30 | 0 | data/steps.json |
| blue-card-validity | 48 months | facts.blueCardValidity | MUP — Highly-qualified TCNs (EU Blue Card) | 1 | 2026-07-30 | 0 | data/steps.json |
| case-art99-blocked | 30 days | facts.art99BlockedAccount | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | cases/example-dool-us-manual-labor.json |
| case-art99-continuous | 12 months | facts.art99ContinuousEmployment | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | cases/example-dool-us-manual-labor.json |
| case-art99-ratio | 20% | facts.art99DomesticRatio | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | cases/example-dool-us-manual-labor.json |
| case-inflow-threshold | €100,000 | facts.art99InflowThreshold | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | cases/example-dool-us-manual-labor.json |
| employer-change-after | 6 months | facts.employerChangeAfter | Narodne novine — NN 55/2026 | 1 | 2026-07-30 | 0 | data/steps.json |
| lmt-positive-notice-window | 90 days | facts.lmtPositiveNoticeWindow | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-30 | 0 | data/steps.json |
| long-term-fee | €83.62 | facts.longTermFee | MUP — Long-term residence and permanent stay | 1 | 2026-07-30 | 0 | data/steps.json |
| nn552026-in-force | 2026-06-04 | facts.nn552026InForce | Narodne novine — NN 55/2026 | 1 | 2026-07-30 | 0 | data/steps.json |
| — | 2023-03 | uv.listEdition | MUP/HZZ — Lista zanimanja (izuzetak od TTR) PDF | 1 | 2026-07-30 | 0 | data/uv-occupations.json |
| permit-admin-fee | €46.45 | facts.permitFee | MUP — Temporary Stay | 1 | 2026-07-30 | 0 | data/steps.json |
| permit-decision-timeline | 90 days | facts.permitDecisionTimeline | Narodne novine — NN 55/2026 | 1 | 2026-07-30 | 0 | data/steps.json |
| unemployment-long-hold-qualifier | 2 years | facts.unemploymentLongHoldQualifier | Narodne novine — NN 55/2026 | 1 | 2026-07-30 | 0 | data/steps.json |
| unemployment-window-long-hold | 6 months | facts.unemploymentWindowLongHold | Narodne novine — NN 55/2026 | 1 | 2026-07-30 | 0 | data/steps.json |
| unemployment-window-standard | 3 months | facts.unemploymentWindowStandard | Narodne novine — NN 55/2026 | 1 | 2026-07-30 | 0 | data/steps.json |
| us-police-registration | 48 hours | facts.usPoliceRegistration | U.S. Embassy Croatia — Entry and Residence | 1 | 2026-07-30 | 0 | data/nationalities/us.json |
| us-visa-free-window | 90/180 | facts.usVisaFreeWindow | U.S. Embassy Croatia — Entry and Residence | 1 | 2026-07-30 | 0 | data/nationalities/us.json |
| us-visa-free-window-docs | 90/180 | facts.usVisaFreeWindow | U.S. Embassy Croatia — Entry and Residence | 1 | 2026-07-30 | 0 | data/nationalities/us.json |
