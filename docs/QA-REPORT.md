# Final QA report

Generated 2026-11-04 in this build environment (Node v22.23.4, headless Google Chrome via Playwright, Linux). Every number below comes from executed test runs saved in `tests/*.json` or produced by the Node suites at generation time. Nothing is marked passed by hand.

## Summary

| Suite | Passed | Notes |
|---|---|---|
| Engine known-answer tests (unit/calculation) | 124/124 |  |
| Importer tests (data integrity) | 26/26 |  |
| Structure-detector tests (incl. causality) | 20/20 |  |
| Backtest audit tests | 33/33 |  |
| Options paper engine + multi-expiry payoff tests | 27/27 |  |
| Spaced-repetition engine tests | 10/10 |  |
| Journal-coaching engine tests | 15/15 |  |
| Strategy bot + code export (Python run for real) | 14/14 |  |
| Independent cross-validation vs Python/ta/SciPy | 59/59 | 1 informational convention difference |
| Content validation | 0 errors | 103/103 lessons, 377 questions, 38 indicators, 30 strategies, 22 patterns |
| Route smoke test (all routes, served + standalone) | pass | 57 routes; - served PWA: dashboard first render 544 ms (cold load, headless Chrome, local disk).; - file:// standalone: dashboard first render 371 ms (cold load, headless Chrome, local disk). |
| End-to-end regression suite — served PWA | 31/31 |  |
| End-to-end regression suite — standalone file | 31/31 | offline-SW test n/a on file:// |
| End-to-end Phase 2 — served PWA | 22/22 |  |
| End-to-end Phase 2 — standalone file | 22/22 |  |
| End-to-end v2.1 features — served PWA | 19/19 |  |
| End-to-end v2.1 features — standalone file | 19/19 |  |
| End-to-end v2.2 (bot, code export, algo lesson) — served PWA | 13/13 |  |
| End-to-end v2.2 — standalone file | 13/13 |  |
| Sandboxed preview frame (standalone) | 22/22 |  |
| Security & data integrity (both builds) | 20/20 |  |
| Mobile/laptop/accessibility | see report | overflow-free on 6 profiles; axe violations 0; installable True; restart persistence True |

## v2.2 additions (4 Nov 2026, night)
- Strategy bot (Simulator → Strategy bot), strategy code export (Python, Pine Script v5) with a bars CSV, lesson on India's retail algo rules.
- v2.1.1 fix: links, tabs and confirmation dialogs did nothing when the file was opened inside a preview window (sandboxed iframe). New suite: sandbox_frame.py.
- Defects found while building v2.2 and fixed: the default Nifty/Bank Nifty backtest made 0 trades because size was capped at unleveraged capital (now an exposure cap, auto 5× for futures, and skipped signals are reported); the Bollinger-fade and VWAP-cross signals could compare against a missing value (a stray short signal was possible on one warm-up bar).

## v2.1 additions (4 Nov 2026)
- Options paper trading (Simulator → Options paper), multi-expiry payoff builder (calendars/diagonals), spaced-repetition review, journal coaching, MCX commodity charges/contracts/session.
- Defects caught by the new tests and fixed: a lesson's MCX charge example said ≈₹141 when the engine (and a corrected hand calculation) give ₹142.01; an expired option contract could stay selected in the order ticket; the charges result row said "STT" for commodity segments (now "CTT").


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
| E2E-01 | All 103 lessons render every tab with no raw markup, NaN/undefined or failed embeds | PASS |
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
| E2E-01 | All 103 lessons render every tab with no raw markup, NaN/undefined or failed embeds | PASS |
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

### v2.1 features (served)

| ID | Test | Result |
|---|---|---|
| P3-01 | Options paper: chain shows 13 strikes (ATM ± 6) with bid/ask, delta, IV and B/S buttons; model and synthetic-volatility caveats shown | PASS |
| P3-02 | Options paper: an ATM call bought from the chain fills 1 lot (65) on the NEXT bar at that bar's open ask | PASS |
| P3-03 | Options paper: positions, Greeks (delta/theta/vega), funds and payoff chart shown for the open position | PASS |
| P3-04 | Options paper: selling an ATM put shows an approximate margin above 0 | PASS |
| P3-05 | Options paper: account and positions survive a reload | PASS |
| P3-06 | Options paper: "Exit all" closes both legs on the next bar and records two trades with charges | PASS |
| P3-07 | Options paper: "To next expiry" settles the open option at intrinsic value (expiry trade recorded) | PASS |
| P3-08 | Options paper: closed trades can be sent to the journal | PASS |
| P3-09 | Payoff builder: a long call calendar is valued at the FRONT expiry with a finite max loss (≈ net debit) and two breakevens; per-leg days/IV shown | PASS |
| P3-10 | Payoff builder: single-expiry strategies still use the exact expiry analysis | PASS |
| P3-11 | Dashboard shows the Spaced review card | PASS |
| P3-12 | Wrong answers in a module assessment enter the review queue (box 1, due in 1 day) | PASS |
| P3-13 | Review page lists the due questions as a quiz | PASS |
| P3-14 | Answering due questions correctly moves them to box 2 (next due in 3 days) | PASS |
| P3-15 | Journal coach shows insights with sample sizes: small sample, over-trading against the plan, costs, finding/hint labels | PASS |
| P3-16 | Charges calculator offers MCX futures/options; crude 1 lot 5,500→5,520 shows CTT and total ≈ ₹142.01 | PASS |
| P3-17 | Specs page shows MCX contracts and counts items backed only by secondary sources | PASS |
| P3-18 | India market page lists the MCX session (09:00–23:55) | PASS |
| P3-19 | No uncaught page errors during the run | PASS |

### v2.1 features (standalone)

| ID | Test | Result |
|---|---|---|
| P3-01 | Options paper: chain shows 13 strikes (ATM ± 6) with bid/ask, delta, IV and B/S buttons; model and synthetic-volatility caveats shown | PASS |
| P3-02 | Options paper: an ATM call bought from the chain fills 1 lot (65) on the NEXT bar at that bar's open ask | PASS |
| P3-03 | Options paper: positions, Greeks (delta/theta/vega), funds and payoff chart shown for the open position | PASS |
| P3-04 | Options paper: selling an ATM put shows an approximate margin above 0 | PASS |
| P3-05 | Options paper: account and positions survive a reload | PASS |
| P3-06 | Options paper: "Exit all" closes both legs on the next bar and records two trades with charges | PASS |
| P3-07 | Options paper: "To next expiry" settles the open option at intrinsic value (expiry trade recorded) | PASS |
| P3-08 | Options paper: closed trades can be sent to the journal | PASS |
| P3-09 | Payoff builder: a long call calendar is valued at the FRONT expiry with a finite max loss (≈ net debit) and two breakevens; per-leg days/IV shown | PASS |
| P3-10 | Payoff builder: single-expiry strategies still use the exact expiry analysis | PASS |
| P3-11 | Dashboard shows the Spaced review card | PASS |
| P3-12 | Wrong answers in a module assessment enter the review queue (box 1, due in 1 day) | PASS |
| P3-13 | Review page lists the due questions as a quiz | PASS |
| P3-14 | Answering due questions correctly moves them to box 2 (next due in 3 days) | PASS |
| P3-15 | Journal coach shows insights with sample sizes: small sample, over-trading against the plan, costs, finding/hint labels | PASS |
| P3-16 | Charges calculator offers MCX futures/options; crude 1 lot 5,500→5,520 shows CTT and total ≈ ₹142.01 | PASS |
| P3-17 | Specs page shows MCX contracts and counts items backed only by secondary sources | PASS |
| P3-18 | India market page lists the MCX session (09:00–23:55) | PASS |
| P3-19 | No uncaught page errors during the run | PASS |

### v2.2 (served)

| ID | Test | Result |
|---|---|---|
| V22-01 | Backtester defaults on Nifty futures now produce trades (was 0: one lot exceeded unleveraged capital) and show the "Automate these rules" panel | PASS |
| V22-02 | Export as Python downloads a .py file with the embedded CONFIG, the indicator code and no order-placement code | PASS |
| V22-03 | Export as Pine Script downloads a .pine file: //@version=5 strategy with entry, exit and square-off | PASS |
| V22-04 | Download these bars (CSV) exports exactly the bars the backtest used, in the format the Python script reads | PASS |
| V22-05 | With capital too small for one Nifty lot at the chosen risk %, the backtest says how many signals were skipped and why | PASS |
| V22-06 | Send to Strategy bot opens Simulator → Strategy bot with the backtest rules, data source and costs | PASS |
| V22-07 | Advance 1 bar moves the bot one bar; To session close stops after the last bar of that session | PASS |
| V22-08 | Run to the end: the trade count on screen equals an independent bot run in the page on the same bars and rules; the decision log is filled | PASS |
| V22-09 | Bot trades go to the journal once (marked synthetic, with costs); pressing again adds nothing | PASS |
| V22-10 | The bot's progress survives a page reload | PASS |
| V22-11 | Algo-rules lesson renders: SEBI framework table, 10 orders/second threshold, 1 Apr 2026 compliance date, cost maths with the live charges calculator, and the quiz | PASS |
| V22-12 | The lesson is listed in Level 4 → Quantitative foundations | PASS |
| V22-13 | No page errors during the v2.2 flows | PASS |

### v2.2 (standalone)

| ID | Test | Result |
|---|---|---|
| V22-01 | Backtester defaults on Nifty futures now produce trades (was 0: one lot exceeded unleveraged capital) and show the "Automate these rules" panel | PASS |
| V22-02 | Export as Python downloads a .py file with the embedded CONFIG, the indicator code and no order-placement code | PASS |
| V22-03 | Export as Pine Script downloads a .pine file: //@version=5 strategy with entry, exit and square-off | PASS |
| V22-04 | Download these bars (CSV) exports exactly the bars the backtest used, in the format the Python script reads | PASS |
| V22-05 | With capital too small for one Nifty lot at the chosen risk %, the backtest says how many signals were skipped and why | PASS |
| V22-06 | Send to Strategy bot opens Simulator → Strategy bot with the backtest rules, data source and costs | PASS |
| V22-07 | Advance 1 bar moves the bot one bar; To session close stops after the last bar of that session | PASS |
| V22-08 | Run to the end: the trade count on screen equals an independent bot run in the page on the same bars and rules; the decision log is filled | PASS |
| V22-09 | Bot trades go to the journal once (marked synthetic, with costs); pressing again adds nothing | PASS |
| V22-10 | The bot's progress survives a page reload | PASS |
| V22-11 | Algo-rules lesson renders: SEBI framework table, 10 orders/second threshold, 1 Apr 2026 compliance date, cost maths with the live charges calculator, and the quiz | PASS |
| V22-12 | The lesson is listed in Level 4 → Quantitative foundations | PASS |
| V22-13 | No page errors during the v2.2 flows | PASS |

### Sandboxed preview frame

| ID | Test | Result |
|---|---|---|
| SBX-01 | [allow-scripts] sidebar #/academy | PASS |
| SBX-02 | [allow-scripts] sidebar #/simulator | PASS |
| SBX-03 | [allow-scripts] sidebar #/calculators | PASS |
| SBX-04 | [allow-scripts] sidebar #/journal | PASS |
| SBX-05 | [allow-scripts] sidebar #/dashboard | PASS |
| SBX-06 | [allow-scripts] tab button Options paper | PASS |
| SBX-07 | [allow-scripts] in-page link to module | PASS |
| SBX-08 | [allow-scripts] Strategy bot advances inside the frame | PASS |
| SBX-09 | [allow-scripts] in-app confirm dialog appears | PASS |
| SBX-10 | [allow-scripts] dialog OK runs action | PASS |
| SBX-11 | [allow-scripts] no page errors | PASS |
| SBX-12 | [allow-scripts allow-same-origin] sidebar #/academy | PASS |
| SBX-13 | [allow-scripts allow-same-origin] sidebar #/simulator | PASS |
| SBX-14 | [allow-scripts allow-same-origin] sidebar #/calculators | PASS |
| SBX-15 | [allow-scripts allow-same-origin] sidebar #/journal | PASS |
| SBX-16 | [allow-scripts allow-same-origin] sidebar #/dashboard | PASS |
| SBX-17 | [allow-scripts allow-same-origin] tab button Options paper | PASS |
| SBX-18 | [allow-scripts allow-same-origin] in-page link to module | PASS |
| SBX-19 | [allow-scripts allow-same-origin] Strategy bot advances inside the frame | PASS |
| SBX-20 | [allow-scripts allow-same-origin] in-app confirm dialog appears | PASS |
| SBX-21 | [allow-scripts allow-same-origin] dialog OK runs action | PASS |
| SBX-22 | [allow-scripts allow-same-origin] no page errors | PASS |

### Options paper, multi-expiry, spaced-repetition and coaching engine tests

| ID | Test | Result |
|---|---|---|
| OPT-P01 | Weekly expiries fall on the last bar of sessions 5 and 10 | PASS |
| OPT-P02 | Time to expiry in trading time: 75 bars = one trading day = 1/252 year | PASS |
| OPT-P03 | Quote mid equals Black–Scholes at the smile IV (independent call to IA.opt.bs) | PASS |
| OPT-P04 | Put–call parity holds on mids: C − P = S − K·e^(−rT) (same strike, same IV) | PASS |
| OPT-P05 | Bid < mid < ask, both on the 0.05 tick, spread ≥ 2 ticks | PASS |
| OPT-P06 | Smile: OTM puts carry higher IV than OTM calls equidistant from spot | PASS |
| OPT-P07 | Base IV uses only past bars (changing bar i itself does not change baseIV(i)) | PASS |
| OPT-P08 | Market buy fills at the NEXT bar's open ASK (placed after bar 99 → fills on bar 100) | PASS |
| OPT-P09 | Round trip: realised gross = (exit bid − entry ask) × 65; charges = NSE options charges on those premiums | PASS |
| OPT-P10 | Expiry: long ITM call settles at intrinsic with STT on exercise (0.15%) + brokerage; OTM put expires worthless with no exercise charge | PASS |
| OPT-P11 | Expiry cancels working orders on that expiry | PASS |
| OPT-P12 | Limit buy below the market does not fill on a flat bar; fills when the option trades down to it (at the limit or better) | PASS |
| OPT-P13 | Bracket stop-loss on a long option exits when the premium falls to the stop; gapped stop fills at the worse open | PASS |
| OPT-P14 | Funds check: a buy whose premium exceeds equity is rejected with a reason | PASS |
| OPT-P15 | Margin: a naked short needs ≈ 9% of notional; the same short hedged into a credit spread needs only its maximum loss | PASS |
| OPT-P16 | Portfolio Greeks: long call + short call at the same strike nets to zero delta/gamma/theta/vega | PASS |
| OPT-P17 | Calendar positions: different expiries are tracked and settled separately | PASS |
| OPT-P18 | No look-ahead: changing every bar after bar 400 leaves all fills up to bar 400 identical | PASS |
| OPT-P19 | exitAll places closing market orders for every open position | PASS |
| OPT-P20 | Invalid orders are refused (fractional lots, limit without price) | PASS |
| OPT-M01 | Single expiry: horizonPnl at the expiry day equals the exact expiry payoff | PASS |
| OPT-M02 | Today with premiums = Black–Scholes prices → P&L exactly 0 at spot | PASS |
| OPT-M03 | Calendar at front expiry = BS(back call, 7 days left) − front intrinsic − net debit (independent hand calculation) | PASS |
| OPT-M04 | Calendar: peak at the strike, loss limited to roughly the net debit far from the strike | PASS |
| OPT-M05 | Numerical analysis agrees with the exact analysis for a single-expiry iron condor (within ₹1) | PASS |
| OPT-M06 | IV shift: a long calendar loses when IV falls (positive vega) — value at front expiry lower with IV −3 pts | PASS |
| OPT-M07 | Scenario grid honours per-leg expiries (calendar today at spot and unchanged IV ≈ 0) | PASS |
| SRS-01 | A correct answer to a never-missed question schedules nothing | PASS |
| SRS-02 | A wrong answer queues the question in box 0, due in 1 day | PASS |
| SRS-03 | Correct reviews climb the boxes with intervals 3, 7, 16, 35 days, then graduate | PASS |
| SRS-04 | A wrong answer at any box sends it back to box 0 and counts a lapse | PASS |
| SRS-05 | A graduated question re-enters the queue if missed again later | PASS |
| SRS-06 | due() returns only due, non-graduated items, oldest first; stats() counts boxes | PASS |
| SRS-07 | resolve() finds module-bank questions by id | PASS |
| SRS-08 | resolve() finds lesson-check questions by <lessonId>-c<index> | PASS |
| SRS-09 | resolve() returns null for ad-hoc drill ids (never queued) | PASS |
| SRS-10 | Every question in every bank and lesson check is resolvable (so any miss can be reviewed) | PASS |
| COA-01 | Empty journal → a single "No trades yet" note | PASS |
| COA-02 | Small sample (< 20 trades) is flagged | PASS |
| COA-03 | Clearly losing strategy (VWAP fade, 12 trades at about −1R) is flagged as a FINDING; the profitable one is not | PASS |
| COA-04 | A weak group with only 3 trades is a HINT, not a finding | PASS |
| COA-05 | Over-trading: a day with 6 trades against a 4-trade limit is reported with the extra trades' net | PASS |
| COA-06 | Trades taken after the daily loss limit (₹7,500) are counted | PASS |
| COA-07 | Position risk above plan (₹2,500 limit; a ₹6,000-risk trade) is flagged | PASS |
| COA-08 | Losses worse than −1.2R are reported with the worst R | PASS |
| COA-09 | Revenge pattern: re-entry within 15 min of a loss with a larger size is detected | PASS |
| COA-10 | Disposition effect: losers held much longer than winners is flagged | PASS |
| COA-11 | Costs turning gross profit into a net loss is flagged | PASS |
| COA-12 | Costly mistakes are ranked by their net cost | PASS |
| COA-13 | Losing streak longer than the plan's stop rule is flagged | PASS |
| COA-14 | A random journal with zero mean is NOT called a positive or negative edge as a finding | PASS |
| COA-15 | Welch t matches a hand calculation | PASS |

### Strategy bot and code export tests

| ID | Test | Result |
|---|---|---|
| BOT-01 | Bot started at bar 1 and run to the end reproduces the backtester trade for trade (27 configurations, all 12 signals × both sides) | PASS |
| BOT-02 | Causality: every signal computed on bars 0..i equals the full-series signal at i (no look-ahead in any signal) | PASS |
| BOT-03 | Changing every bar after i leaves all bot decisions up to i unchanged | PASS |
| BOT-04 | "To session close" stops exactly after the last bar of the current session | PASS |
| BOT-05 | Every closed trade has an entry and an exit event in the log, and each signal event precedes its fill by exactly one bar | PASS |
| BOT-06 | Equity = realised equity + open P&L marked at the last processed close | PASS |
| BOT-07 | A bot started on session 2 places no trade before its start bar and still uses session 1 as indicator history | PASS |
| BOT-08 | Decision log text names the action, price and reason (signal ignored: daily trade limit) | PASS |
| CG-01 | Exported Python, run by python3 on the same bars, reproduces the app's trades (entry/exit time, qty, exit reason, net within ₹0.01) for all 27 configurations | PASS |
| CG-02 | Python export uses only the standard library and contains no order-placement code | PASS |
| CG-03 | Python export embeds the exact configuration (side, stop, target, risk, costs, lot, signal params) | PASS |
| CG-04 | Pine export is well-formed for every configuration: //@version=5, one strategy() call, a condition per entry rule, entry + exit + square-off, no undefined/NaN | PASS |
| CG-05 | Pine export: entry cut-off and square-off times are derived from the session end and bar size (NSE 15:30, 5-min, 3 bars → 15:10 / 15:25) | PASS |
| CG-06 | Pine export maps Supertrend direction correctly (Pine uses −1 for an uptrend) | PASS |