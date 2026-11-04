# QA and test report

Run on 2026-11-04 in this build environment: Node v22.23.4, headless Google Chrome via Playwright, Linux. Every result below was produced by executing the test suites in `tests/` — nothing is marked passed without a run.

## Summary

| Suite | What it checks | Result |
|---|---|---|
| Engine unit tests (`tests/engines.test.js`) | Known-answer maths: indicators, risk, charges, options, generator, backtester, clock/DST, execution | 111/111 passed |
| Content validator (`tests/validate-content.js`) | Schema, required sections, ≥450 words, ≥12 questions/module, coverage | 0 errors · 99/99 lessons · 357 questions · 38 indicators · 30 strategies · 22 patterns |
| Route smoke test (`tests/smoke.py`) | All 51 routes load with no console/page errors (served + file://) | pass |
| End-to-end (`tests/e2e.py`, served PWA) | Functional flows, persistence, offline, mobile overflow | 31/31 passed |
| End-to-end (standalone file://) | Same flows on the single-file build | 31/31 passed (offline-SW test not applicable to file://) |

## Measured performance

- served PWA: dashboard first render 466 ms (cold load, headless Chrome, local disk).
- file:// standalone: dashboard first render 204 ms (cold load, headless Chrome, local disk).


## Not tested in this build

- Safari / iOS and Firefox (only Chromium automated). Recommended: open the standalone file once on your phone and run through Dashboard → a lesson → Chart Lab → Simulator.
- PWA install prompt (cannot be triggered headless).
- Screen-reader accessibility.
- Expert review of lesson content and worked examples.
- Resource-library URLs (no network check).

## Defects found and fixed during testing

- IndexedDB wrapper returned the request object instead of `undefined` for missing keys → every first-run screen failed. Fixed in `db.js`; caught by smoke test.
- Synthetic trend days drifted ~10% per session (drift scaled per minute, not per day). Fixed; regression tests GEN-00/GEN-00b added.
- VWAP line was drawn across session boundaries. Fixed (session-aware line breaks).
- Widget embeds written mid-sentence by content authors were not rendered. Renderer now lifts them onto their own line; caught by E2E-01/02.
- Options payoff chart range too wide; "today" curve too coarse. Fixed.
- RSI reference test initially failed against StockCharts' rounded table; engine confirmed exact by hand calculation, test corrected.

## Detailed results

### Engine unit tests — 111 passed, 0 failed

| ID | Test | Result |
|---|---|---|
| IND-01 | SMA(3) of 1..5 | PASS |
| IND-02 | EMA(3) SMA-seeded of 1..5 = [-,-,2,3,4] | PASS |
| IND-03 | EMA recursion (10,11,12,20; n=3) last = 15.5 | PASS |
| IND-04 | WMA(3) of 1,2,3 = 14/6 | PASS |
| IND-05 | Population SD of 2,4,4,4,5,5,7,9 = 2 | PASS |
| IND-06 | Bollinger(8,2) upper=9 lower=1 | PASS |
| IND-07 | RSI(14) Wilder reference series: exact 70.4641; matches StockCharts table within rounding | PASS |
| IND-08 | RSI is null during warm-up and within 0..100 | PASS |
| IND-09 | RSI of monotonically rising series = 100 | PASS |
| IND-10 | True range uses previous close gaps | PASS |
| IND-11 | ATR(3) Wilder of constant TR=2 is 2 | PASS |
| IND-12 | MACD line = EMA12 − EMA26 | PASS |
| IND-13 | Classic pivots H110 L90 C100 | PASS |
| IND-14 | Camarilla R3 = C + 1.1×range/4 | PASS |
| IND-15 | Fibonacci 61.8% retracement of 100→200 = 138.2 | PASS |
| IND-16 | Session VWAP resets each day and equals typical price for one bar | PASS |
| IND-17 | OBV adds/subtracts volume by close direction | PASS |
| IND-18 | Stochastic %K = 100 at highest close | PASS |
| IND-19 | Williams %R = 0 at highest close | PASS |
| IND-20 | ROC(1) of 100→110 = 10% | PASS |
| IND-21 | CCI of constant series = 0 | PASS |
| IND-22 | MFI = 100 when typical price only rises | PASS |
| IND-23 | CMF = +1 when every close is at the high | PASS |
| IND-24 | Donchian upper/lower = highest high / lowest low | PASS |
| IND-25 | ADX/DI produced in 0..100 on a trend | PASS |
| IND-26 | Supertrend direction is up in a steady uptrend | PASS |
| IND-27 | Parabolic SAR stays below price in an uptrend | PASS |
| IND-28 | Volume profile POC is the most-traded bin; VA holds ≥70% | PASS |
| IND-29 | Ichimoku Tenkan = (9-high + 9-low)/2 | PASS |
| IND-30 | VWMA weights by volume | PASS |
| IND-31 | Anchored VWAP is null before anchor | PASS |
| IND-32 | Keltner = EMA ± m×ATR | PASS |
| IND-33 | Divergence detector finds bearish divergence | PASS |
| RSK-01 | Position size 1% of 1,00,000, entry 500 stop 495 → 200 shares | PASS |
| RSK-02 | Position size capped by capital | PASS |
| RSK-03 | Futures sizing rounds down to whole lots (lot 65) | PASS |
| RSK-04 | Zero-risk edge: stop = entry is rejected | PASS |
| RSK-05 | Invalid inputs rejected (negative capital, missing price) | PASS |
| RSK-06 | Very small budget → 0 units with warning | PASS |
| RSK-07 | Short side detected when stop > entry | PASS |
| RSK-08 | R:R 100/95/110 = 2:1, break-even WR 33.33% | PASS |
| RSK-09 | R:R rejects target on wrong side | PASS |
| RSK-10 | Expectancy W=0.5, +200/−100 → EV 50, PF 2 | PASS |
| RSK-11 | Max drawdown of 100,120,90,130,100 = 30 (25%) | PASS |
| RSK-12 | Recovering 50% drawdown needs +100% | PASS |
| RSK-13 | Trade stats on [100,-50,-50,200] | PASS |
| RSK-14 | Compounding 1000 at 10% for 2 periods = 1210 | PASS |
| RSK-15 | Leverage: notional 5L on 1L capital = 5×, 20% move wipes out | PASS |
| RSK-16 | Futures exposure Nifty 25800 × 65 × 2 = 33,54,000 | PASS |
| RSK-17 | Portfolio risk: two perfectly correlated = sum; uncorrelated = √2 | PASS |
| RSK-18 | Kelly W=0.6 b=1 → 0.2 | PASS |
| RSK-19 | Currency conversion INR→USD via table | PASS |
| RSK-20 | India intraday charges: buy 1,00,000 sell 1,01,000 | PASS |
| RSK-21 | India options STT 0.15% of sell premium (post-Apr-2026) | PASS |
| RSK-22 | India futures STT 0.05% of sell value | PASS |
| RSK-23 | Zero turnover → zero charges | PASS |
| RSK-24 | ATR stop long = entry − 1.5×ATR | PASS |
| RSK-25 | Risk-of-ruin formula: negative edge → 1 | PASS |
| OPT-01 | BS call(100,100,1y,5%,20%) = 10.4506 | PASS |
| OPT-02 | BS put = 5.5735 | PASS |
| OPT-03 | Put–call parity C − P = S − K·e^(−rT) | PASS |
| OPT-04 | Call delta 0.6368, put delta −0.3632 | PASS |
| OPT-05 | Gamma 0.01876 (same for call and put) | PASS |
| OPT-06 | Vega per 1 vol point = 0.3752 | PASS |
| OPT-07 | Call theta per day ≈ −0.01757 | PASS |
| OPT-08 | Implied vol recovers 20% from price | PASS |
| OPT-09 | At expiry price = intrinsic | PASS |
| OPT-10 | Bull call spread 100/110 @5/2: max +7, max −3, BE 103 | PASS |
| OPT-11 | Long call has unlimited gain, loss = premium | PASS |
| OPT-12 | Short call has unlimited loss | PASS |
| OPT-13 | Iron condor: credit = max gain, wings bound the loss | PASS |
| OPT-14 | Long put max gain = K − premium at S=0 | PASS |
| GEN-00 | Realism: median |daily open→close move| within 0.3–2.5 × configured daily vol (Nifty preset, 200 days) | PASS |
| GEN-00b | Realism: 200-day drift stays within ±40% (no runaway trend) | PASS |
| GEN-01 | Same seed → identical data (reproducible) | PASS |
| GEN-02 | OHLC consistency h ≥ max(o,c), l ≤ min(o,c), v ≥ 0 | PASS |
| GEN-03 | 5-min aggregation: 375-min session → 75 bars/day | PASS |
| GEN-04 | Weekends skipped for exchange sessions | PASS |
| GEN-05 | Prices rounded to tick | PASS |
| GEN-06 | Heikin-Ashi close = (o+h+l+c)/4 | PASS |
| GEN-07 | Renko bricks are exact box size | PASS |
| GEN-08 | All 10 decision scenarios generate history + future | PASS |
| BT-01 | No look-ahead: entry fills at NEXT bar open + slippage | PASS |
| BT-02 | No position is carried overnight | PASS |
| BT-03 | Equity = capital + Σ net P&L | PASS |
| BT-04 | Costs reduce P&L (net < gross) | PASS |
| BT-05 | Short side works | PASS |
| BT-06 | Stop-loss loss ≈ −1R before costs/slippage | PASS |
| BT-07 | Every signal combination in catalogue runs without error | PASS |
| BT-08 | Too few bars rejected | PASS |
| BT-09 | Monte Carlo percentiles ordered p5 ≤ p50 ≤ p95 | PASS |
| BT-10 | Risk-of-ruin sim: negative edge ≈ 1, strong edge ≈ 0 | PASS |
| CLK-01 | NYSE open 2026-07-01 = 13:30 UTC (EDT) | PASS |
| CLK-02 | NYSE open 2026-12-01 = 14:30 UTC (EST) | PASS |
| CLK-03 | NSE open = 03:45 UTC year-round (no DST in India) | PASS |
| CLK-04 | London open in BST (Jul) = 07:00 UTC, GMT (Jan) = 08:00 UTC | PASS |
| CLK-05 | Sydney DST (Jan) open 10:00 = 23:00 UTC previous day | PASS |
| CLK-06 | Session status: NSE open at 10:00 IST on a Wednesday | PASS |
| CLK-07 | Session status: weekend closed | PASS |
| CLK-08 | Tokyo lunch break detected | PASS |
| CLK-09 | Holiday list respected | PASS |
| EXE-01 | Market order fills at NEXT bar open (no look-ahead) | PASS |
| EXE-02 | Half-spread + slippage worsen the fill | PASS |
| EXE-03 | Stop gapped through fills at the open, not the stop | PASS |
| EXE-04 | Stop and target in same bar → stop assumed first | PASS |
| EXE-05 | Target fill cancels the OCO stop | PASS |
| EXE-06 | Liquidity cap produces partial fills | PASS |
| EXE-07 | Short trade P&L sign correct | PASS |
| EXE-08 | Limit buy fills at better open on a gap down | PASS |
| EXE-09 | End-of-day square-off closes position and cancels orders | PASS |
| EXE-10 | India futures charges applied on close (cash = start + gross − charges) | PASS |

### End-to-end (served) — 31 passed, 0 failed

| ID | Test | Result |
|---|---|---|
| E2E-01 | All 99 lessons render every tab with no raw markup, NaN/undefined or failed embeds | PASS |
| E2E-02-indicator | All 38 indicator pages render cleanly | PASS |
| E2E-02-strategy | All 30 strategy pages render cleanly | PASS |
| E2E-02-pattern | All 22 pattern pages render cleanly | PASS |
| E2E-03 | Lesson is NOT completed with a wrong answer, IS completed when all correct, and survives reload | PASS |
| E2E-04 | Bookmark and note persist across reload and appear in the library | PASS |
| E2E-05 | Level 2 unlocks after Level 1 mastery; Level 3 stays locked; 10-question assessment scores 100% and is recorded | PASS |
| E2E-06 | Locked level assessment shows lock message instead of questions | PASS |
| E2E-07 | All 22 calculators render a result with default inputs (no NaN/undefined) | PASS |
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

### End-to-end (standalone file://) — 31 passed, 0 failed

| ID | Test | Result |
|---|---|---|
| E2E-01 | All 99 lessons render every tab with no raw markup, NaN/undefined or failed embeds | PASS |
| E2E-02-indicator | All 38 indicator pages render cleanly | PASS |
| E2E-02-strategy | All 30 strategy pages render cleanly | PASS |
| E2E-02-pattern | All 22 pattern pages render cleanly | PASS |
| E2E-03 | Lesson is NOT completed with a wrong answer, IS completed when all correct, and survives reload | PASS |
| E2E-04 | Bookmark and note persist across reload and appear in the library | PASS |
| E2E-05 | Level 2 unlocks after Level 1 mastery; Level 3 stays locked; 10-question assessment scores 100% and is recorded | PASS |
| E2E-06 | Locked level assessment shows lock message instead of questions | PASS |
| E2E-07 | All 22 calculators render a result with default inputs (no NaN/undefined) | PASS |
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
