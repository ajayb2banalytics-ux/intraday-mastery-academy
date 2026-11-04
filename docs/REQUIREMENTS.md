# Master requirements register

Generated 2026-11-04 by tools/report.py from the actual test results. Status rules are in the script header: **Verified** means every linked automated test ran and passed; **Tested** means covered by route smoke tests or partial tests; **Implemented** means built without an automated test.

Summary: Implemented 5, Tested 19, Verified 58

| ID | Module | Requirement | Status | Tests | Evidence | Known limitations |
|---|---|---|---|---|---|---|
| ARC-01 | Architecture | Standalone HTML/CSS/JS, no backend, no registration, no paid APIs | **Verified** | pass | SMOKE, E2E-28 |  |
| ARC-02 | Architecture | Single self-contained HTML file that runs from file:// | **Tested** | pass | SMOKE | Verified with Chromium; other browsers not automated. |
| ARC-03 | Architecture | Installable PWA: manifest, icons, versioned cache-first service worker | **Verified** | pass | E2E-28 | Install prompt itself cannot be exercised headless — check once on a phone. |
| ARC-04 | Architecture | Offline-first: app and all lessons load with network off | **Verified** | pass | E2E-28 | Service worker requires HTTPS hosting (or localhost). |
| ARC-05 | Architecture | IndexedDB persistence (key-value + collections) with in-memory fallback warning | **Verified** | pass | E2E-03, E2E-04, E2E-16 | Private/incognito modes may discard data on close. |
| ARC-06 | Architecture | Full backup/restore (JSON) with schema check; rejects foreign files | **Verified** | pass | E2E-13 |  |
| ARC-07 | Architecture | Modular engines testable in Node; pure functions | **Verified** | pass | IND-01, IND-02, IND-03, IND-04, IND-05, IND-06 (+52) |  |
| ARC-08 | Architecture | Optional external data via adapters — CSV import adapter for real OHLCV | **Tested** | pass | SMOKE | Only CSV import; no network data adapter shipped (by design: no mandatory APIs). |
| UI-01 | Interface | 15 main sections + Daily Workflow + Settings; sidebar (desktop), bottom bar + drawer (mobile) | **Tested** | pass | SMOKE |  |
| UI-02 | Interface | Dark terminal theme default; light theme option | **Verified** | pass | E2E-25 |  |
| UI-03 | Interface | Mobile-first responsive layout; no horizontal overflow at 360 px | **Verified** | pass | E2E-27 | Checked on 23 key routes. |
| UI-04 | Interface | Global search across lessons, indicators, strategies, patterns, glossary, psychology | **Verified** | pass | E2E-26 | Substring search, no ranking model. |
| UI-05 | Interface | All navigation and controls perform their actions without errors | **Verified** | pass | SMOKE, E2E-29 |  |
| UI-06 | Interface | Accessible controls (semantic buttons, labels, focus, contrast) | **Implemented** | n/a | — | No formal accessibility audit or screen-reader test performed. |
| DSH-01 | Dashboard | Overall mastery, current level, completed lessons, modules mastered | **Tested** | pass | SMOKE |  |
| DSH-02 | Dashboard | Daily goal, streak, recommended lessons, pending assessments, knowledge gaps | **Tested** | pass | SMOKE |  |
| DSH-03 | Dashboard | Simulator, journal and decision statistics; proficiency per track | **Tested** | pass | SMOKE |  |
| LRN-01 | Academy | 4 levels, 25 modules, 99 lessons — every lesson written | **Verified** | pass | CONTENT |  |
| LRN-02 | Academy | Each lesson: beginner/intermediate/advanced views, misconceptions, failure conditions, exercise; maths/India/US sections where applicable | **Verified** | pass | CONTENT, E2E-01 | Lesson text drafted for this build; worked numbers were script-checked by the authors but have not had independent expert review. |
| LRN-03 | Academy | Lesson completes only when its check questions are all answered correctly | **Verified** | pass | E2E-03 |  |
| LRN-04 | Academy | Notes and bookmarks per lesson | **Verified** | pass | E2E-04 |  |
| LRN-05 | Academy | Evidence labels (established / mixed / subjective / speculative) on lessons, indicators, strategies, patterns | **Verified** | pass | CONTENT |  |
| LRN-06 | Academy | Embedded charts, pattern diagrams and live calculators inside lessons | **Verified** | pass | E2E-01 |  |
| LRN-07 | Academy | Separate progress for India, US, global, TA, derivatives, risk, strategy (+ psych, fundamentals, quant, foundations) | **Tested** | pass | SMOKE | Track score = 50% lessons done + 50% best assessment average. |
| ASM-01 | Assessments | Question bank ≥ 12 per module (357 total incl. readiness) | **Verified** | pass | CONTENT |  |
| ASM-02 | Assessments | Module assessment: 10 random questions, 80% mastery, explanations | **Verified** | pass | E2E-05 |  |
| ASM-03 | Assessments | Level unlock by assessment results, not by clicking through | **Verified** | pass | E2E-05, E2E-06 |  |
| ASM-04 | Assessments | Trading-readiness evaluation (Levels 1–3, 100 logged trades, risk plan, ≥85% exam) with explicit "not proof of profitability" | **Tested** | pass | SMOKE | Criteria logic covered by route smoke only. |
| ASM-05 | Assessments | Interactive chart-reading assessments graded from data | **Verified** | pass | E2E-21 |  |
| ASM-06 | Assessments | Knowledge-gap analysis from assessment history | **Tested** | pass | SMOKE |  |
| MKT-01 | Markets | Indian environment: NSE/BSE, segments, sessions, lot sizes, charges, SEBI topics, F&O lessons | **Verified** | pass | CONTENT, SMOKE | Rates as of 4 Nov 2026; verify before trading. |
| MKT-02 | Markets | US environment: venues, NBBO, sessions, SEC/FINRA, PDT change, differences from India | **Verified** | pass | CONTENT, SMOKE |  |
| MKT-03 | Markets | Europe & Asia environments, overnight cues, correlations | **Verified** | pass | CONTENT, SMOKE |  |
| MKT-04 | Markets | Other assets: commodities, FX, crypto perps (funding, liquidation), rate futures | **Verified** | pass | CONTENT, SMOKE |  |
| MKT-05 | Markets | Dated, configurable market specifications (charges, lots, sessions, FX, holidays) | **Verified** | pass | E2E-24, RSK-20, RSK-21, RSK-22, RSK-23, RSK-24 (+1) | US SEC/TAF rates are placeholders to edit; holidays not bundled. |
| CLK-01 | Market clock | Global clock for 10 markets, pre/main/post, lunch breaks, overlaps, timezone selector | **Verified** | pass | CLK-01, CLK-02, CLK-03, CLK-04, CLK-05, CLK-06 (+4) |  |
| CLK-02 | Market clock | DST-safe conversions via IANA zones (no hard-coded offsets) | **Verified** | pass | CLK-01, CLK-02, CLK-04, CLK-05 |  |
| CLK-03 | Market clock | Exchange holidays where available | **Implemented** | pass | CLK-09 | Holiday lists are user-entered in Settings; none bundled. |
| TA-01 | Technical analysis | 38 indicator/tool entries × 15 required fields | **Verified** | pass | CONTENT, E2E-02-indicator |  |
| TA-02 | Technical analysis | Indicator engine: SMA, EMA, WMA, VWMA, MACD, PSAR, Supertrend, ADX/DMI, Ichimoku, RSI, StochRSI, Stoch, CCI, ROC, %R, Momentum, OBV, CMF, A/D, MFI, VWAP, anchored VWAP, BB, ATR, Keltner, Donchian, SD, pivots, Camarilla, Fibonacci, volume profile, divergence | **Verified** | pass | IND-01, IND-02, IND-03, IND-04, IND-05, IND-06 (+27) | Elliott, Gann, harmonics are taught (labelled subjective), not computed. |
| TA-03 | Technical analysis | 22 candlestick patterns with formation, psychology, context, confirmation, entry, stop, target, failure | **Verified** | pass | CONTENT, E2E-02-pattern |  |
| TA-04 | Technical analysis | Chart types: candles, OHLC, line, Heikin-Ashi, Renko; P&F, tick and volume charts explained | **Tested** | pass | GEN-06, GEN-07, SMOKE | Point & figure, tick and volume charts are explained but not rendered (no tick data offline). |
| TA-05 | Technical analysis | Timeframes 1m–daily, multi-timeframe lessons; opening range, PDH/PDL, gaps, VWAP, profiles | **Verified** | pass | GEN-03, CONTENT | Market Profile (TPO) is taught but not drawn; volume profile is drawn. |
| CHT-01 | Chart lab | Canvas chart: pan, zoom (wheel/pinch/buttons), crosshair, legend, sub-panes, volume, volume profile | **Tested** | pass | SMOKE, E2E-22 | Gesture handling verified by code path; pinch tested manually only on desktop emulation. |
| CHT-02 | Chart lab | Annotation: horizontal lines and trendlines saved per chart | **Verified** | pass | E2E-22 |  |
| CHT-03 | Chart lab | Synthetic OHLCV generator: seeded, regimes, gaps, U-shaped volume, tick rounding, realistic daily range | **Verified** | pass | GEN-00, GEN-00b, GEN-01, GEN-02, GEN-03, GEN-04 (+4) | Stylised; not a model of any real instrument. |
| CHT-04 | Chart lab | CSV import of real OHLCV with validation | **Tested** | pass | SMOKE | Parser validated for header detection and OHLC consistency; tested manually. |
| FND-01 | Fundamentals | Company metrics, corporate events, macro (RBI, Fed, ECB, BoJ), calendars, event risk | **Verified** | pass | CONTENT |  |
| DRV-01 | Derivatives | Futures: specs, MTM, basis, contango/backwardation, hedging, rollover + basis lab | **Verified** | pass | CONTENT, SMOKE |  |
| DRV-02 | Derivatives | Black–Scholes price, Greeks, implied volatility | **Verified** | pass | OPT-01, OPT-02, OPT-03, OPT-04, OPT-05, OPT-06 (+3) | European model; US American options approximated. |
| DRV-03 | Derivatives | Payoff builder for 15 strategies: max gain/loss, breakevens, today vs expiry | **Verified** | pass | OPT-10, OPT-11, OPT-12, OPT-13, OPT-14 | Calendar/diagonal spreads (two expiries) are taught but not in the single-expiry builder. |
| DRV-04 | Derivatives | Strategy matrix with position Greeks; Greeks-vs-time lab; synthetic option chain with OI/PCR | **Tested** | pass | SMOKE | Chain OI is randomly generated. |
| STR-01 | Strategies | 30 strategies × 19 fields with worked winning and losing examples | **Verified** | pass | CONTENT, E2E-02-strategy |  |
| STR-02 | Strategies | Mechanical approximations runnable in backtester | **Verified** | pass | E2E-19 | 5 discretionary strategies cannot be expressed in the signal catalogue. |
| STR-03 | Strategies | Strategy comparison laboratory on identical data | **Verified** | pass | E2E-20 |  |
| STR-04 | Strategies | No strategy labelled successful without test results | **Implemented** | pass | CONTENT | Content rule enforced by authoring spec and review, not by an automated check. |
| RSK-01 | Risk | Personal risk plan + live daily/weekly limit, trade-count and losing-streak status | **Tested** | pass | SMOKE |  |
| RSK-02 | Risk | Position sizing (cash/lots/leverage), R:R, expectancy, PF, drawdown, recovery, compounding, leverage, futures exposure, portfolio correlation, Kelly | **Verified** | pass | RSK-01, RSK-02, RSK-03, RSK-04, RSK-05, RSK-06 (+19) |  |
| RSK-03 | Risk | Risk of ruin (Monte Carlo) and Monte Carlo of trade lists | **Verified** | pass | BT-09, BT-10 |  |
| RSK-04 | Risk | India charges (brokerage, STT, txn, SEBI, stamp, GST) and US fees | **Verified** | pass | RSK-20, RSK-21, RSK-22, RSK-23, EXE-10 | Brokerage plan is a typical discount plan — set yours. |
| CAL-01 | Calculators | 19 required calculators + Greeks, Monte Carlo, Kelly (22 total), each showing its working | **Verified** | pass | E2E-07, E2E-08, E2E-09 |  |
| CAL-02 | Calculators | Multi-currency (INR, USD, EUR, GBP, JPY, SGD, HKD, AUD, CAD) | **Verified** | pass | RSK-19 | FX rates are static and user-edited. |
| PSY-01 | Psychology | 19 psychology topics with signs, costs, countermeasures, exercises | **Verified** | pass | CONTENT, SMOKE |  |
| PSY-02 | Psychology | 24-item self-assessment with history (self-reflection, not clinical) | **Tested** | pass | SMOKE |  |
| PSY-03 | Psychology | Behavioural pattern analysis from journal (emotion, mistakes) | **Verified** | pass | E2E-11 |  |
| WFL-01 | Workflow | Editable pre/during/post-market checklists saved per day; consistency history | **Tested** | pass | SMOKE |  |
| JRN-01 | Journal | All 26 required trade fields; derived net, R, R:R, duration | **Verified** | pass | E2E-10 |  |
| JRN-02 | Journal | Analytics: win rate, avg win/loss, net, PF, expectancy, max DD, avg R:R, by strategy/market/hour/week/month, streaks, cost of mistakes | **Verified** | pass | E2E-11, RSK-13 |  |
| JRN-03 | Journal | CSV export and import; real vs simulated separation | **Verified** | pass | E2E-12 |  |
| SIM-01 | Simulator | Chart replay: progressive reveal, hidden future, entries, stop/target placement, outcome review | **Verified** | pass | E2E-14 |  |
| SIM-02 | Simulator | Decision simulator: 10 scenario types, buy/sell/wait/exit/avoid, process vs outcome feedback | **Verified** | pass | E2E-15, GEN-08 | Outcome randomised by design; scenario shapes are stylised. |
| SIM-03 | Simulator | Paper trading: virtual capital, market/limit/stop orders, brackets, history, realised/unrealised P&L, costs, persistence | **Verified** | pass | E2E-16, EXE-01, EXE-02, EXE-03, EXE-04, EXE-05 (+5) | One instrument per paper account; no options paper trading. |
| SIM-04 | Simulator | Realism: slippage, spread, costs, partial fills, next-bar execution delay, gaps, EOD square-off, volatility regimes | **Verified** | pass | EXE-01, EXE-02, EXE-03, EXE-04, EXE-05, EXE-06 (+4) |  |
| SIM-05 | Simulator | No live brokerage connection | **Tested** | pass | SMOKE | By design. |
| QNT-01 | Quant lab | Rule backtester: configurable entries (12 signals), stops, targets, capital, sizing, costs, slippage; no look-ahead | **Verified** | pass | BT-01, BT-02, BT-03, BT-04, BT-05, BT-06 (+3) | Signal catalogue is fixed; custom code not supported. |
| QNT-02 | Quant lab | Walk-forward segments, t-stat, multiple-testing warning, Monte Carlo, research-method guide | **Verified** | pass | E2E-17, E2E-18 | Parameter re-optimisation per window is manual. |
| QNT-03 | Quant lab | Synthetic data always labelled; never presented as historical performance | **Verified** | pass | E2E-17 |  |
| LIB-01 | Library | 20 books (own summaries), 18 official resources, 219-term glossary, reading by subject | **Tested** | pass | SMOKE | Resource URLs were not network-verified during build. |
| SAF-01 | Safety | No profit guarantees; capital-loss, gap, execution and cost warnings throughout; readiness ≠ profitability | **Implemented** | pass | CONTENT | Enforced by authoring spec; spot-checked, not exhaustively reviewed. |
| QA-01 | QA | Known-answer tests for financial calculations incl. edge cases (zero, invalid, insufficient capital, tiny size, lot sizes, currency, expiry) | **Verified** | pass | RSK-01, RSK-02, RSK-03, RSK-04, RSK-05, RSK-06 (+33) |  |
| QA-02 | QA | Browser compatibility | **Tested** | pass | SMOKE | Automated on Chromium (Chrome 1xx) only. Safari/iOS and Firefox not tested in this build. |
| QA-03 | QA | Performance | **Implemented** | n/a | — | See QA report for measured load time; no low-end device testing. |

## Open items lists

### Missing educational content
- None missing from the curriculum map (99/99 lessons). Depth beyond the current lessons — e.g. sector-by-sector Indian case studies, per-indicator video-style walk-throughs — is a future extension.
- Lessons have not had an independent expert review; treat worked examples as teaching material and report errors.

### Incomplete features
- Point & figure, tick and volume charts: explained only (no tick data offline).
- Market Profile (TPO) chart not drawn.
- Calendar/diagonal spreads not in the single-expiry payoff builder.
- Paper trading: one instrument per account; no options or multi-leg paper trading.
- Backtester: fixed signal catalogue; 5 discretionary strategies not expressible; walk-forward re-optimisation is manual.
- No bundled exchange holiday calendars.

### Calculation issues
- None open. RSI reference values differ from the StockCharts table by ≤0.07 because that table rounds intermediate averages (documented in IND-07).

### UI defects
- None open from automated checks. Not audited for screen readers.

### Data limitations
- All bundled market data is synthetic. FX rates and US regulatory fee rates are static placeholders to edit. Indian rates as of 4 Nov 2026.

### Offline limitations
- Service worker requires HTTPS/localhost; the file:// standalone build has no install prompt (still fully offline). External resource links need a connection.

### Known bugs
- None open at the time of this report.