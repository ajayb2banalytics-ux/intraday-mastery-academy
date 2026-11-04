# Requirements register (final)

Generated 2026-11-04 by `tools/report.py` from saved test results. **Verified** = every linked automated test ran and passed. **Tested** = smoke-level or partial automation. **Implemented** = built without automated proof. **Not testable here** = needs a browser/device this environment cannot provide.

**Summary:** Implemented: 1, Not testable here: 2, Tested: 5, Verified: 48 — 56 requirements.

| ID | Area | Requirement | Status | Tests | Evidence | Limitations |
|---|---|---|---|---|---|---|
| ARC-01 | Architecture | Standalone HTML/CSS/JS, no backend, no account, no paid APIs, no mandatory middleware | **Verified** | pass | SMOKE, E2E-28 |  |
| ARC-02 | Architecture | Single self-contained HTML file runs from disk (file://) with all features | **Verified** | pass | SMOKE, E2E-01, E2E-02-indicator, E2E-02-strategy, E2E-02-pattern (+49) | Automated on Chromium only. |
| ARC-03 | Architecture | Installable PWA: manifest, icons, versioned cache-first service worker; installability checked by Chrome | **Verified** | pass | MOB-INSTALL, E2E-28 | Install prompt UI itself needs a real device. |
| ARC-04 | Architecture | Offline-first: hosted PWA reloads and serves lessons with the network off | **Verified** | pass | E2E-28 | Requires HTTPS hosting or localhost. |
| ARC-05 | Architecture | IndexedDB persistence across reloads and full browser restarts; persistent-storage request; quota errors surfaced | **Verified** | pass | E2E-03, E2E-04, E2E-16, MOB-PERSIST | Private/incognito modes may discard data. |
| ARC-06 | Architecture | Backup/restore with SHA-256 checksum, schema check, row validation before any write | **Verified** | pass | E2E-13, SEC-06-served, SEC-07-served, P2-21 |  |
| ARC-07 | Architecture | Pure, unit-tested calculation engines (single source for app and tests) | **Verified** | pass | IND-01, IND-02, IND-03, IND-04, IND-05 (+58) |  |
| ARC-08 | Architecture | Script list single source of truth (index.html, service worker, build all generated from js/files.js) | **Tested** | pass | SMOKE |  |
| UI-01 | Interface | 19 sections; sidebar on laptop/desktop, bottom bar + drawer on phones | **Verified** | pass | MOB-NAV, SMOKE |  |
| UI-02 | Interface | Dark terminal theme default; light theme | **Verified** | pass | E2E-25 |  |
| UI-03 | Interface | Responsive: no horizontal overflow on 37 routes at 6 screen sizes (360 px → 1920 px) | **Verified** | pass | MOB-OVERFLOW, E2E-27 | Emulated in Chromium. |
| UI-04 | Interface | Accessibility: zero axe-core WCAG 2.1 A/AA violations on 16 key routes (phone + laptop); visible keyboard focus; 24 px checkboxes | **Verified** | pass | MOB-AXE, MOB-KEYS | Automated rules only; no screen-reader user testing. |
| UI-05 | Interface | Laptop keyboard shortcuts for chart replay | **Verified** | pass | MOB-KEYS |  |
| UI-06 | Interface | Global search | **Verified** | pass | E2E-26 |  |
| UI-07 | Interface | Touch: chart tap, pan, pinch | **Tested** | pass | MOB-TOUCH | Tap verified by automation; pinch/pan verified by code path and desktop emulation only. |
| LRN-01 | Curriculum | 102 lessons in 4 levels / 25 modules, all written; every directive subject mapped (see EDUCATIONAL-AUDIT.md) | **Verified** | pass | CONTENT, E2E-01 |  |
| LRN-02 | Curriculum | Every lesson: beginner/intermediate/advanced, misconceptions, failure conditions, exercise; maths/India/US where relevant | **Verified** | pass | CONTENT, E2E-01 |  |
| LRN-03 | Curriculum | Independent educational audit of all lessons, questions, indicators, strategies, patterns, psychology, library | **Implemented** | n/a |  | AI-assisted review with every number recomputed by script; not an independent human-expert or regulatory certification. |
| LRN-04 | Curriculum | Lesson completion gated by correct check answers; notes; bookmarks | **Verified** | pass | E2E-03, E2E-04 |  |
| ASM-01 | Assessments | 373 assessment questions (≥12 per module) incl. readiness exam | **Verified** | pass | CONTENT |  |
| ASM-02 | Assessments | Module assessments, level unlocking by results, readiness evaluation | **Verified** | pass | E2E-05, E2E-06 |  |
| ASM-03 | Assessments | Chart-reading drills graded from data | **Verified** | pass | E2E-21 |  |
| ASM-04 | Assessments | Spaced-repetition review: missed lesson-check and assessment questions return after 1/3/7/16/35 days; dashboard card; review page | **Verified** | pass | SRS-01, SRS-02, SRS-03, SRS-04, SRS-05 (+9) |  |
| DAT-01 | Historical data | CSV import: NSE quote download, bhavcopy (multi-symbol/series), broker 1-min, TradingView epoch, Yahoo, ISO offsets | **Verified** | pass | DAT-01, DAT-02, DAT-03, DAT-04, DAT-05 (+7) | Formats verified with layout fixtures (invented prices). No real exchange file was available in this environment. |
| DAT-02 | Historical data | Validation: dates, time zones, OHLC relationships, volume, duplicates, order, missing candles, outside-session bars, jumps, timeframe inference, mixed timeframes | **Verified** | pass | DAT-01, DAT-02, DAT-03, DAT-04, DAT-05 (+21) |  |
| DAT-03 | Historical data | Validation report UI, dataset library, HISTORICAL vs SYNTHETIC labelling; DELAYED/LIVE explicitly not provided | **Verified** | pass | P2-01, P2-02, P2-03, P2-04, P2-05 | No live or delayed feed (by design: no network dependency). |
| DAT-04 | Historical data | Multi-timeframe: upward resampling within sessions | **Verified** | pass | DAT-25, P2-06 | Cannot create lower timeframes than the file. |
| DAT-05 | Historical data | Historical replay with no future-candle visibility; next-bar execution | **Verified** | pass | P2-07, P2-08 |  |
| CHT-01 | Charts | Canvas chart engine, 40 indicator overlays/panels, drawings, crosshair, pan/zoom | **Tested** | pass | SMOKE, E2E-22 |  |
| CHT-02 | Charts | Concepts Lab: graded exercises for MTF, VWAP/AVWAP, volume profile, TPO, S/R, supply-demand, structure, BOS/CHoCH, sweeps, order blocks, FVG, relative volume, divergence, relative strength, opening range | **Verified** | pass | P2-13, STR-01, STR-02, STR-03, STR-04 (+16) | Discretionary concepts use the app's stated rule definitions; evidence labels shown. |
| CHT-03 | Charts | Detectors are causal (no future information) — verified by truncation tests | **Verified** | pass | STR-15, STR-16, STR-17, STR-18, STR-19 | Swing points carry an explicit confirmation lag. |
| MKT-01 | Markets | Specifications verified against official sources with effective dates and provenance shown in-app | **Verified** | pass | P2-17, SPC-01, SPC-02, SPC-03, SPC-04 (+1) | 16 items remain unverified and are labelled as such. |
| MKT-02 | Markets | Exchange holidays (verified 2026/2027 lists: NSE, NYSE, Nasdaq, Xetra, Euronext) used by the clock | **Verified** | pass | SPC-01, P2-18, P2-19 | LSE list not verified; 2027 NSE list not yet published. |
| MKT-03 | Markets | DST-safe global clock with sessions, overlaps, auctions | **Verified** | pass | CLK-01, CLK-02, CLK-03, CLK-04, CLK-05 (+5) |  |
| MKT-04 | Markets | Market comparison laboratory | **Verified** | pass | P2-14 | Correlation meaningful only for historical datasets on common dates. |
| MKT-05 | Markets | Charges and fees configurable and dated; broker assumptions labelled | **Verified** | pass | RSK-20, RSK-21, RSK-22, SPC-03, XC-62 (+1) |  |
| MKT-06 | Markets | MCX commodity charges (CTT, MCX fees, SEBI, stamp, GST) in the charges calculator; MCX contracts and 09:00–23:55 session; provenance shown | **Verified** | pass | MCX-01, MCX-02, MCX-03, P3-16, P3-17 (+1) | Rates corroborated by secondary sources only (official MCX/CBDT pages unreachable from this environment); agri exemptions and MCX holiday sessions not modelled. |
| RSK-01 | Risk | Position sizing, stop, target, R:R, expectancy, profit factor, drawdown, compounding, leverage, futures exposure, portfolio correlation, Kelly — independently cross-validated | **Verified** | pass | RSK-01, RSK-02, RSK-03, RSK-04, RSK-05 (+35) |  |
| RSK-02 | Risk | Risk of ruin (Monte Carlo), consecutive-loss probability (exact), options scenario risk grid | **Verified** | pass | BT-10, RSK-26, RSK-27, RSK-28, RSK-29 (+4) | Independence assumption stated. |
| RSK-03 | Risk | Daily/weekly loss limits, trade-count and losing-streak status from the journal | **Tested** | pass | SMOKE |  |
| DRV-01 | Derivatives | Black–Scholes price/Greeks/IV to 1e-9 vs SciPy; exact payoff max gain/loss/breakevens | **Verified** | pass | OPT-01, OPT-02, OPT-03, OPT-04, OPT-05 (+44) | European model; US American options approximated. |
| DRV-02 | Derivatives | Multi-expiry payoff builder (calendars, diagonals): per-leg expiry and IV, value at front expiry, numerical max gain/loss and breakevens | **Verified** | pass | OPT-M01, OPT-M02, OPT-M03, OPT-M04, OPT-M05 (+4) | Assumes IV unchanged at the front expiry (IV-shift supported in the engine). |
| CAL-01 | Calculators | 24 calculators, each showing formula and working | **Verified** | pass | E2E-07, E2E-08, E2E-09, P2-15, P2-16 |  |
| IND-01 | Indicators | 30+ indicators match independent implementations of published definitions and the ta library (after warm-up) | **Verified** | pass | XC-01, XC-02, XC-03, XC-04, XC-05 (+34) | Parabolic SAR differs from the ta library by convention (app follows Wilder; documented). |
| SIM-01 | Simulators | Chart replay (synthetic & historical), decision simulator, persistent paper trading | **Verified** | pass | E2E-14, E2E-15, E2E-16, P2-07, P2-08 |  |
| SIM-03 | Simulators | Options paper trading: Nifty/Bank Nifty weekly options chain (BS + smile + bid/ask), next-bar fills, limit/stop/bracket orders, NSE option charges, approximate margin, Greeks, expiry settlement with STT on exercise, journal export | **Verified** | pass | OPT-P01, OPT-P02, OPT-P03, OPT-P04, OPT-P05 (+23) | Synthetic path is more volatile than the real index (stated in-app); margin is an approximation, not SPAN; IV model is stylised. |
| SIM-02 | Simulators | Execution realism: next-bar fills, spread, slippage, gaps, partial fills, OCO brackets, EOD square-off, charges | **Verified** | pass | EXE-01, EXE-02, EXE-03, EXE-04, EXE-05 (+5) |  |
| BT-01 | Backtesting | No look-ahead (future-perturbation invariance on all 12 signals), sequencing, stop/target/gap/EOD, slippage, costs, partial fills | **Verified** | pass | BTA-01, BTA-02, BTA-03, BTA-04, BTA-05 (+28) |  |
| BT-02 | Backtesting | Walk-forward, out-of-sample optimisation (optimiser never sees OOS bars), random-entry overfitting test, Monte Carlo, regime matrix | **Verified** | pass | BTA-14, BTA-15, BTA-16, BTA-17, BTA-18 (+4) | Synthetic regimes are stylised. |
| JRN-01 | Journal | Journal fields, analytics, CSV export (formula-injection safe) / import | **Verified** | pass | E2E-10, E2E-11, E2E-12, SEC-09-served |  |
| JRN-02 | Journal | Journal coaching: weak setups/times/emotions (Welch t, sample sizes), plan breaches (trade count, daily loss, risk per trade), losses beyond stop, revenge pattern, disposition effect, costs | **Verified** | pass | COA-01, COA-02, COA-03, COA-04, COA-05 (+11) | Describes past behaviour only; small samples are labelled hints. |
| SEC-01 | Security | No stored XSS; CSP (hash-based in standalone, no network); prototype-pollution-safe restore; noopener links | **Verified** | pass | SEC-01-served, SEC-02-served, SEC-03-served, SEC-04-served, SEC-05-served (+15) |  |
| MOB-01 | Mobile | Android Chrome compatibility | **Tested** | pass | MOB-OVERFLOW, MOB-TOUCH | Chromium with Android viewport/UA emulation — not a physical Android device. |
| MOB-02 | Mobile | iOS Safari compatibility | **Not testable here** | n/a |  | WebKit could not be installed here; no Apple device. Not tested. The code avoids APIs known to be missing in Safari, but this is unverified. |
| MOB-03 | Browsers | Firefox compatibility | **Not testable here** | n/a |  | Firefox could not be installed here (download host blocked). Not tested. |
| MOB-04 | Browsers | Chrome / Chromium | **Verified** | pass | SMOKE, MOB-OVERFLOW | Headless Google Chrome. |

## Known limitations (not defects)
- iOS Safari and Firefox untested (browsers unavailable here). Android and iPhone *viewports* were emulated in Chromium only.
- No live or delayed market data (by design). Historical data must be imported by the user.
- Historical import verified against layout fixtures with invented prices; no real exchange file was available offline.
- 16 market-specification items unverified (marked in-app); BSE charges, Sensex tick, some European/Asian auction windows, LSE holidays.
- MCX charges, contract multipliers and hours are corroborated by secondary sources only (official MCX/CBDT pages not reachable here); labelled in-app.
- Options paper trading uses a synthetic path that is more volatile than the real index, a stylised IV smile and an approximate (non-SPAN) margin.
- Educational review is AI-assisted with scripted recomputation — not a human-expert or regulatory certification.

## Open defects
- None known at the time of this report.