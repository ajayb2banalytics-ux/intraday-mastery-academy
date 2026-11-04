# Final QA report

Generated 2026-11-04 in this build environment (Node v22.23.4, headless Google Chrome via Playwright, Linux). Every number below comes from executed test runs saved in `tests/*.json` or produced by the Node suites at generation time. Nothing is marked passed by hand.

## Summary

| Suite | Passed | Notes |
|---|---|---|
| Engine known-answer tests (unit/calculation) | 121/121 |  |
| Importer tests (data integrity) | 26/26 |  |
| Structure-detector tests (incl. causality) | 20/20 |  |
| Backtest audit tests | 33/33 |  |
| Independent cross-validation vs Python/ta/SciPy | 59/59 | 1 informational convention difference |
| Content validation | 0 errors | 102/102 lessons, 373 questions, 38 indicators, 30 strategies, 22 patterns |
| Route smoke test (all routes, served + standalone) | pass | 51 routes; - served PWA: dashboard first render 789 ms (cold load, headless Chrome, local disk).; - file:// standalone: dashboard first render 255 ms (cold load, headless Chrome, local disk). |
| End-to-end regression suite — served PWA | 31/31 |  |
| End-to-end regression suite — standalone file | 31/31 | offline-SW test n/a on file:// |
| End-to-end Phase 2 — served PWA | 22/22 |  |
| End-to-end Phase 2 — standalone file | 22/22 |  |
| Security & data integrity (both builds) | 20/20 |  |
| Mobile/laptop/accessibility | see report | overflow-free on 6 profiles; axe violations 0; installable True; restart persistence True |

## Defects found and fixed in Phase 2 (all re-tested)
- IndexedDB `exportAll` declared a variable twice after the checksum change → app failed to start in the standalone build. Caught by the build check; fixed.
- Black–Scholes normal-CDF precision; option max gain/loss grid error; volume-profile/TPO bin edges; OOS optimiser defaults — see CALCULATION-VALIDATION.md.
- Accessibility: 153 axe violations → 0.
- Content: errors fixed by the audits — see EDUCATIONAL-AUDIT.md (most significant: Nifty/Bank Nifty futures round-trip costs understated (₹300–400 vs ≈₹950–1,000) in several lessons and questions; one wrong answer key; self-assessment scoring reversed for two traits).
- Specifications: 11 values corrected against official sources (NSE session changes Aug–Sep 2026, index-futures tick by level, FINRA TAF pause, SGX lunch break, ASX auction) — see audit/specs-verification.md.

## Not tested (limitations, not hidden passes)
- iOS Safari/WebKit and Firefox (cannot be installed here). Physical phones. Screen readers. A real NSE/BSE/US export file (only layout fixtures).

## Reports
- EDUCATIONAL-AUDIT.md · CALCULATION-VALIDATION.md · HISTORICAL-DATA-REPORT.md · BACKTESTING-VALIDATION.md · MOBILE-OFFLINE-REPORT.md · SECURITY-REPORT.md · REQUIREMENTS.md · audit/*.md

## Detailed end-to-end results

### Regression suite (served)

| ID | Test | Result |
|---|---|---|
| E2E-01 | All 102 lessons render every tab with no raw markup, NaN/undefined or failed embeds | PASS |
| E2E-02-indicator | All 38 indicator pages render cleanly | PASS |
| E2E-02-strategy | All 30 strategy pages render cleanly | PASS |
| E2E-02-pattern | All 22 pattern pages render cleanly | PASS |
| E2E-03 | Lesson is NOT completed with a wrong answer, IS completed when all correct, and survives reload | PASS |
| E2E-04 | Bookmark and note persist across reload and appear in the library | PASS |
| E2E-05 | Level 2 unlocks after Level 1 mastery; Level 3 stays locked; 10-question assessment scores 100% and is recorded | PASS |
| E2E-06 | Locked level assessment shows lock message instead of questions | PASS |
| E2E-07 | All 24 calculators render a result with default inputs (no NaN/undefined) | PASS |
| E2E-08 | Position-size calculator UI: 1% of ₹1,00,000, entry 500, stop 495 → 200 shares | PASS |
| E2E-09 | Calculator rejects stop = entry with a clear message | PASS |
| E2E-10 | Journal trade saved with derived net P&L (100 × 12 − 60 = 1,140), R = 1.9 and 35-min duration | PASS |
| E2E-11 | Journal analytics show the trade (₹1,140 net) grouped by strategy, time of day, week and month | PASS |
| E2E-12 | Journal CSV export contains header and the trade row | PASS |
| E2E-13 | Full backup restores journal and lesson progress after a wipe; foreign files are rejected | PASS |
| E2E-14 | Replay: bracket order fills at the next bar, then exits by stop/target/session close; review appears at session end | PASS |
| E2E-15 | Decision simulator grades the decision, reveals the outcome separately, and records it | PASS |
| E2E-16 | Paper trading: 1 lot fills next bar, survives reload, is squared off at session close with charges deducted | PASS |
| E2E-17 | Backtester runs, labels results SYNTHETIC, shows KPIs, equity curve and trade list | PASS |
| E2E-18 | Walk-forward produces 4 segments | PASS |
| E2E-19 | All 25 backtestable strategy configs run and produce trades on 120 synthetic sessions | PASS |
| E2E-20 | Strategy comparison lab ranks the selected strategies on identical data | PASS |
| E2E-21 | Chart-reading drills: data-graded question and tap-the-pattern drill both score and record | PASS |
| E2E-22 | Chart annotation (horizontal line) is saved per chart | PASS |
| E2E-23 | Clock time-zone choice persists | PASS |
| E2E-24 | Invalid specification JSON is rejected without saving | PASS |
| E2E-25 | Theme switch applies immediately | PASS |
| E2E-26 | Search finds lessons, indicators and strategies | PASS |
| E2E-27 | No horizontal page overflow at 360 px on 23 key routes (tables scroll inside their own box) | PASS |
| E2E-28 | Service worker installs; app reloads and serves lessons with the network OFF | PASS |
| E2E-29 | No uncaught page errors or console errors during the whole run | PASS |

### Regression suite (standalone)

| ID | Test | Result |
|---|---|---|
| E2E-01 | All 102 lessons render every tab with no raw markup, NaN/undefined or failed embeds | PASS |
| E2E-02-indicator | All 38 indicator pages render cleanly | PASS |
| E2E-02-strategy | All 30 strategy pages render cleanly | PASS |
| E2E-02-pattern | All 22 pattern pages render cleanly | PASS |
| E2E-03 | Lesson is NOT completed with a wrong answer, IS completed when all correct, and survives reload | PASS |
| E2E-04 | Bookmark and note persist across reload and appear in the library | PASS |
| E2E-05 | Level 2 unlocks after Level 1 mastery; Level 3 stays locked; 10-question assessment scores 100% and is recorded | PASS |
| E2E-06 | Locked level assessment shows lock message instead of questions | PASS |
| E2E-07 | All 24 calculators render a result with default inputs (no NaN/undefined) | PASS |
| E2E-08 | Position-size calculator UI: 1% of ₹1,00,000, entry 500, stop 495 → 200 shares | PASS |
| E2E-09 | Calculator rejects stop = entry with a clear message | PASS |
| E2E-10 | Journal trade saved with derived net P&L (100 × 12 − 60 = 1,140), R = 1.9 and 35-min duration | PASS |
| E2E-11 | Journal analytics show the trade (₹1,140 net) grouped by strategy, time of day, week and month | PASS |
| E2E-12 | Journal CSV export contains header and the trade row | PASS |
| E2E-13 | Full backup restores journal and lesson progress after a wipe; foreign files are rejected | PASS |
| E2E-14 | Replay: bracket order fills at the next bar, then exits by stop/target/session close; review appears at session end | PASS |
| E2E-15 | Decision simulator grades the decision, reveals the outcome separately, and records it | PASS |
| E2E-16 | Paper trading: 1 lot fills next bar, survives reload, is squared off at session close with charges deducted | PASS |
| E2E-17 | Backtester runs, labels results SYNTHETIC, shows KPIs, equity curve and trade list | PASS |
| E2E-18 | Walk-forward produces 4 segments | PASS |
| E2E-19 | All 25 backtestable strategy configs run and produce trades on 120 synthetic sessions | PASS |
| E2E-20 | Strategy comparison lab ranks the selected strategies on identical data | PASS |
| E2E-21 | Chart-reading drills: data-graded question and tap-the-pattern drill both score and record | PASS |
| E2E-22 | Chart annotation (horizontal line) is saved per chart | PASS |
| E2E-23 | Clock time-zone choice persists | PASS |
| E2E-24 | Invalid specification JSON is rejected without saving | PASS |
| E2E-25 | Theme switch applies immediately | PASS |
| E2E-26 | Search finds lessons, indicators and strategies | PASS |
| E2E-27 | No horizontal page overflow at 360 px on 23 key routes (tables scroll inside their own box) | PASS |
| E2E-28 | Service worker offline test — not applicable to file:// (no service workers); standalone file makes no network requests | PASS |
| E2E-29 | No uncaught page errors or console errors during the whole run | PASS |

### Phase 2 (served)

| ID | Test | Result |
|---|---|---|
| P2-01 | Data page explains SYNTHETIC / HISTORICAL / DELAYED / LIVE and states delayed & live are not available | PASS |
| P2-02 | Import of a defective NSE 5-min file shows a validation report: dropped rows, duplicates, missing candles, outside-hours, jump, quality not good | PASS |
| P2-03 | Naive-UTC file read as IST is flagged ("check time zone") and saving is discouraged | PASS |
| P2-04 | Switching "Timestamps are in" to UTC fixes it (quality good) | PASS |
| P2-05 | Dataset saved to the library with timeframe, range and bar count | PASS |
| P2-06 | Chart Lab shows the dataset labelled HISTORICAL; 15-min resampling gives one third of the 5-min bars per session | PASS |
| P2-07 | Historical replay: chart exposes only revealed bars (drawn range ≤ revealed), future hidden, one step reveals exactly one bar, labelled HISTORICAL | PASS |
| P2-08 | Historical replay order fills at the NEXT bar's open ± spread/slippage | PASS |
| P2-09 | Backtest on a HISTORICAL dataset is labelled as such (not synthetic) | PASS |
| P2-10 | Quant Lab "oos" runs and reports | PASS |
| P2-11 | Quant Lab "overfit" runs and reports | PASS |
| P2-12 | Quant Lab "regimes" runs and reports | PASS |
| P2-13 | All 15 Concepts-Lab exercises generate a chart, accept an answer, grade it and record the result | PASS |
| P2-14 | Market comparison lab reports volatility, ranges, gaps, round-trip charges and sessions for two markets | PASS |
| P2-15 | Calculator losing-streak computes and shows its working | PASS |
| P2-16 | Calculator options-risk computes and shows its working | PASS |
| P2-17 | Specs page shows provenance (verified / corrected / unverified counts, sources) and verified holiday lists | PASS |
| P2-18 | Global clock marks NSE closed for the verified 24 Nov 2026 holiday (clock set to 10:00 IST) | PASS |
| P2-19 | Next trading day (25 Nov 2026, 10:00 IST) NSE shows Open | PASS |
| P2-20 | Settings shows storage status and the phone ↔ laptop transfer guide | PASS |
| P2-21 | Downloaded backup contains a SHA-256 checksum and the saved dataset | PASS |
| P2-22 | No uncaught page errors during the Phase 2 run | PASS |

### Phase 2 (standalone)

| ID | Test | Result |
|---|---|---|
| P2-01 | Data page explains SYNTHETIC / HISTORICAL / DELAYED / LIVE and states delayed & live are not available | PASS |
| P2-02 | Import of a defective NSE 5-min file shows a validation report: dropped rows, duplicates, missing candles, outside-hours, jump, quality not good | PASS |
| P2-03 | Naive-UTC file read as IST is flagged ("check time zone") and saving is discouraged | PASS |
| P2-04 | Switching "Timestamps are in" to UTC fixes it (quality good) | PASS |
| P2-05 | Dataset saved to the library with timeframe, range and bar count | PASS |
| P2-06 | Chart Lab shows the dataset labelled HISTORICAL; 15-min resampling gives one third of the 5-min bars per session | PASS |
| P2-07 | Historical replay: chart exposes only revealed bars (drawn range ≤ revealed), future hidden, one step reveals exactly one bar, labelled HISTORICAL | PASS |
| P2-08 | Historical replay order fills at the NEXT bar's open ± spread/slippage | PASS |
| P2-09 | Backtest on a HISTORICAL dataset is labelled as such (not synthetic) | PASS |
| P2-10 | Quant Lab "oos" runs and reports | PASS |
| P2-11 | Quant Lab "overfit" runs and reports | PASS |
| P2-12 | Quant Lab "regimes" runs and reports | PASS |
| P2-13 | All 15 Concepts-Lab exercises generate a chart, accept an answer, grade it and record the result | PASS |
| P2-14 | Market comparison lab reports volatility, ranges, gaps, round-trip charges and sessions for two markets | PASS |
| P2-15 | Calculator losing-streak computes and shows its working | PASS |
| P2-16 | Calculator options-risk computes and shows its working | PASS |
| P2-17 | Specs page shows provenance (verified / corrected / unverified counts, sources) and verified holiday lists | PASS |
| P2-18 | Global clock marks NSE closed for the verified 24 Nov 2026 holiday (clock set to 10:00 IST) | PASS |
| P2-19 | Next trading day (25 Nov 2026, 10:00 IST) NSE shows Open | PASS |
| P2-20 | Settings shows storage status and the phone ↔ laptop transfer guide | PASS |
| P2-21 | Downloaded backup contains a SHA-256 checksum and the saved dataset | PASS |
| P2-22 | No uncaught page errors during the Phase 2 run | PASS |