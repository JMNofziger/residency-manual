# Facts audit

Generated: 2026-07-31
Case: example-dool-us-manual-labor
Total cited facts: 30 (Tier 1: 30, Tier 2: 0)

## Notes

- Phase 5 live Tier-1 pass completed 2026-07-31 — see artifacts/phase5-verification.md.
- CONFIRMED on HZZ novi sustav: Art. 99 20%/10%, 12 months continuous FTE, €100,000 legal-entity inflow, 30-day blockade, 90-day LMT positive-notice window.
- CONFIRMED on MUP temporary stay: €46.45 stay fee, €31.85 biometric production (regular), €9.29 biometric admin fee. Accelerated biometric production (€59.73) omitted from wizard facts.
- CONFIRMED on MUP long-term page: €83.62 decision fee.
- CONFIRMED on NN 55/2026: general force 2026-06-04; 90-day decision deadline; employer-change after 6 months; unemployment 3/6 months with 2-year qualifier; A1.1 after 1 year stay; Art. 92.a(1)/(4)/(6) deferred to 2027-06-04.
- CONFIRMED on MVEP granting-stay page: short-stay 90/180; alien self-registration within 2 days if provider cannot register (provider: 1 day via eVisitor).
- UV list: no newer public UV decision PDF found; still shipping official 2023-03 MUP/HZZ PDF with stale-edition banner.
- OMITTED: Blue Card validity months (not stated on live MUP Blue Card page / not confirmed in NN 55/2026 excerpt); Blue Card fee schedule (wrong path); seasonal/student numerics; Form 17a field specs.
- Case revenue remains case data, not a legal fact — still needs live tax/bank verification before filing.

## Claims

| ID | Value | Label key | Source | Tier | Verified | Age (days) | File |
|---|---|---|---|---:|---|---:|---|
| a1-deferred-force | 2027-06-04 | facts.a1DeferredForce | Narodne novine — NN 55/2026 | 1 | 2026-07-31 | 0 | data/steps.json |
| a1-within | 1 year | facts.a1LanguageWithin | Narodne novine — NN 55/2026 | 1 | 2026-07-31 | 0 | data/steps.json |
| art99-blocked-account | 30 days | facts.art99BlockedAccount | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | data/steps.json |
| art99-check-blocked | 30 days | facts.art99BlockedAccount | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | data/art99-checks.json |
| art99-check-continuous | 12 months | facts.art99ContinuousEmployment | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | data/art99-checks.json |
| art99-check-inflow | €100,000 | facts.art99InflowThreshold | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | data/art99-checks.json |
| art99-check-ratio-10 | 10% | facts.art99DeficitaryDomesticRatio | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | data/art99-checks.json |
| art99-check-ratio-20 | 20% | facts.art99DomesticRatio | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | data/art99-checks.json |
| art99-continuous-employment | 12 months | facts.art99ContinuousEmployment | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | data/steps.json |
| art99-domestic-ratio | 20% | facts.art99DomesticRatio | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | data/steps.json |
| art99-inflow-threshold | €100,000 | facts.art99InflowThreshold | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | data/steps.json |
| biometric-admin-fee | €9.29 | facts.biometricAdminFee | MUP — Temporary Stay | 1 | 2026-07-31 | 0 | data/steps.json |
| biometric-production-fee | €31.85 | facts.biometricProductionFee | MUP — Temporary Stay | 1 | 2026-07-31 | 0 | data/steps.json |
| case-art99-blocked | 30 days | facts.art99BlockedAccount | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | cases/example-dool-us-manual-labor.json |
| case-art99-continuous | 12 months | facts.art99ContinuousEmployment | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | cases/example-dool-us-manual-labor.json |
| case-art99-ratio | 20% | facts.art99DomesticRatio | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | cases/example-dool-us-manual-labor.json |
| case-inflow-threshold | €100,000 | facts.art99InflowThreshold | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | cases/example-dool-us-manual-labor.json |
| employer-change-after | 6 months | facts.employerChangeAfter | Narodne novine — NN 55/2026 | 1 | 2026-07-31 | 0 | data/steps.json |
| lmt-positive-notice-window | 90 days | facts.lmtPositiveNoticeWindow | HZZ — Novi sustav zapošljavanja stranaca | 1 | 2026-07-31 | 0 | data/steps.json |
| long-term-fee | €83.62 | facts.longTermFee | MUP — Long-term residence and permanent stay | 1 | 2026-07-31 | 0 | data/steps.json |
| nn552026-in-force | 2026-06-04 | facts.nn552026InForce | Narodne novine — NN 55/2026 | 1 | 2026-07-31 | 0 | data/steps.json |
| — | 2023-03 | uv.listEdition | MUP/HZZ — Lista zanimanja (izuzetak od TTR) PDF | 1 | 2026-07-31 | 0 | data/uv-occupations.json |
| permit-admin-fee | €46.45 | facts.permitFee | MUP — Temporary Stay | 1 | 2026-07-31 | 0 | data/steps.json |
| permit-decision-timeline | 90 days | facts.permitDecisionTimeline | Narodne novine — NN 55/2026 | 1 | 2026-07-31 | 0 | data/steps.json |
| unemployment-long-hold-qualifier | 2 years | facts.unemploymentLongHoldQualifier | Narodne novine — NN 55/2026 | 1 | 2026-07-31 | 0 | data/steps.json |
| unemployment-window-long-hold | 6 months | facts.unemploymentWindowLongHold | Narodne novine — NN 55/2026 | 1 | 2026-07-31 | 0 | data/steps.json |
| unemployment-window-standard | 3 months | facts.unemploymentWindowStandard | Narodne novine — NN 55/2026 | 1 | 2026-07-31 | 0 | data/steps.json |
| us-police-registration | 2 days | facts.usPoliceRegistration | MVEP — Granting Stay in Croatia | 1 | 2026-07-31 | 0 | data/nationalities/us.json |
| us-visa-free-window | 90/180 | facts.usVisaFreeWindow | MVEP — Granting Stay in Croatia | 1 | 2026-07-31 | 0 | data/nationalities/us.json |
| us-visa-free-window-docs | 90/180 | facts.usVisaFreeWindow | MVEP — Granting Stay in Croatia | 1 | 2026-07-31 | 0 | data/nationalities/us.json |
