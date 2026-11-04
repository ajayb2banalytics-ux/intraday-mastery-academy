# Educational accuracy audit (summary)

> **What this is:** an AI-assisted review of all teaching content, carried out by separate review agents, each working on one content file with the instructions in `AUDIT-SPEC.md`. Every worked number was recomputed by script, using the app's own engines wherever one exists. Concepts were checked against primary or standard references, and time-sensitive facts against official sources on the web. **It is not a certification by a human expert, a SEBI-registered adviser or any regulator.** Treat it as a careful second pass, not a guarantee.

## Scope
- 102 lessons (all sections), 373 assessment questions (incl. lesson checks and the 29-question readiness exam), 38 indicator entries, 30 strategies, 22 patterns, 19 psychology topics + self-assessment, research library (21 books, 18 resources, 225 glossary terms).
- 102 market specification items verified against official sources (see below), plus 8 MCX items added in v2.1 that are corroborated by secondary sources only.

## Findings by file (as tabulated in each report; every finding was fixed in place unless the report says otherwise)

| Area | Report | Errors | Misleading | Unsupported | Shallow | Missing | Total |
|---|---|---|---|---|---|---|---|
| Indicator library (38) | [indicators-lib.md](audit/indicators-lib.md) | 3 | 3 | 0 | 7 | 0 | 13 |
| Level 1 lessons + banks | [lessons-l1.md](audit/lessons-l1.md) | 8 | 6 | 2 | 6 | 5 | 27 |
| Level 2 technical lessons | [lessons-l2a.md](audit/lessons-l2a.md) | 5 | 2 | 3 | 2 | 1 | 13 |
| Psychology, US, global, other assets, L4-M4 | [lessons-l2b.md](audit/lessons-l2b.md) | 6 | 2 | 5 | 9 | 3 | 25 |
| Futures & options lessons | [lessons-l3a.md](audit/lessons-l3a.md) | 3 | 2 | 1 | 4 | 3 | 13 |
| SMC/Wyckoff/AMT, fundamentals, backtesting, risk lessons | [lessons-l3b.md](audit/lessons-l3b.md) | 8 | 11 | 0 | 15 | 3 | 37 |
| Level 4 lessons + readiness exam | [lessons-l4.md](audit/lessons-l4.md) | 3 | 5 | 0 | 7 | 3 | 18 |
| Psychology module + research library | [psychology-library.md](audit/psychology-library.md) | 5 | 12 | 0 | 22 | 7 | 46 |
| 30 strategies + 22 patterns | [strategies-patterns.md](audit/strategies-patterns.md) | 14 | 9 | 0 | 3 | 1 | 27 |
| **Total** | | **55** | **52** | **11** | **75** | **26** | **219** |

Some report rows group several related fixes, so the per-file narrative counts can be higher than the table counts.

## Most consequential corrections
- **Futures costs understated** in several lessons, questions and strategies (₹150–400 per Nifty lot round trip). At Nov 2026 rates the app's cost engine gives ≈ ₹950–1,000 per Nifty-futures lot, mostly STT on the sell leg. All examples were recomputed. Some net P&L answers changed.
- **NSE session changes of Aug–Sep 2026** (Closing Auction Session 15:15–15:35 for F&O stocks, post-close 15:50–16:00, pre-open order entry to about 09:10). Old timings removed from lessons, questions, glossary and specs.
- **Self-assessment scoring inverted** for discipline and patience. Fixed and re-tested.
- **Option max gain/loss** read from a grid, which understated a butterfly. Engine rewritten (exact), and lesson figures re-checked.
- **Psychology claims** presented as science were softened or labelled as practitioner heuristics, and real research citations were added (Kahneman & Tversky, Shefrin & Statman, Odean, Lo & Repin, Gollwitzer & Sheeran, Klein).
- **Subjective frameworks** (Elliott, Gann, harmonics, SMC order blocks, most candlestick lore) carry *subjective* evidence labels and a "how to test it" section.
- **Quiz answer positions** were rebalanced where one letter dominated.

## Market specifications verification
102 items checked: 75 verified, 11 corrected, 16 unverified. Every changing specification shows its source and effective date in **Markets → Specifications**. Items not verified are labelled UNVERIFIED in the app and are never presented as current. Details: [audit/specs-verification.md](audit/specs-verification.md). **v2.1:** 8 MCX items (CTT, MCX transaction fees, stamp duty, contract multipliers, trading hours) were added with status *secondary* — corroborated by broker and statute-mirror sources because mcxindia.com and the tax department's site were not reachable from this environment. The app labels them as such.

## Coverage of the subjects required by the brief

| Subject | Where it is taught / practised |
|---|---|
| Market fundamentals, exchanges, orders, settlement | l1-exchanges, l1-orderbook, l1-ordertypes, l1-segments |
| Indian markets (NSE/BSE sessions, SEBI, indices, costs, circuits, flows) | l1-nse-sessions, l1-sebi, l1-indices, l1-india-costs, l1-circuits, l1-flows |
| US markets (structure, sessions, SEC/FINRA, PDT change) | l2-us-structure, l2-us-sessions, l2-us-rules, l2-us-vs-india |
| Global markets & sessions, overnight cues | l2-europe, l2-asia, l2-overnight; Markets → clock & comparison lab |
| Candlesticks & chart types | l1-candle-anatomy, l1-single-candles, l1-multi-candles; 22 patterns |
| Price action | l2-price-action, l2-breakouts, l2-chart-reading |
| Support/resistance, trendlines, supply & demand | l2-sr, l2-trendlines; Concepts Lab sr, sd |
| Market structure, Dow theory, phases | l2-dow, l2-phases; Concepts Lab structure, bos |
| Moving averages, oscillators, volatility & trend indicators | l1-moving-averages, l1-rsi, l2-oscillators, l2-volatility, l2-trend-tools; 38 indicators |
| VWAP / anchored VWAP | l1-vwap, l2-vwap-advanced; Concepts Lab vwap |
| Volume, Volume Profile, Market Profile (TPO), Auction Market Theory | l1-volume, l2-volume-profile, l2-market-profile, l3-auction; Concepts Lab vp, tpo, volume |
| Fibonacci & pivots | l2-fib-pivots; indicator entries |
| Elliott Wave, Gann, harmonics (labelled subjective) | l2-wave-theories; indicator entries |
| Multi-timeframe analysis | l2-mtf; Concepts Lab mtf |
| Smart Money Concepts, liquidity, order blocks, FVG, sweeps | l3-smc, l3-microstructure-liquidity; Concepts Lab ob, fvg, sweep |
| Wyckoff | l3-wyckoff |
| Order flow, depth, tape, footprint, execution | l4-depth, l4-footprint, l4-execution |
| Scalping & momentum day-trading | l4-scalping; strategies: Scalping, Momentum trading |
| Fundamentals, events, macro, economic calendar | l3-company, l3-events, l3-macro, l3-calendar |
| Futures | l3-futures-basics, l3-basis, l3-futures-risk |
| Options, Greeks, IV, chain, spreads, expiry | l3-options-basics … l3-expiry (9 lessons) |
| Commodities, FX, crypto, rates | l3-commodities, l3-fx, l3-crypto, l3-rates |
| Intermarket, regimes, OI/GEX | l4-intermarket, l4-regimes, l4-gex |
| Strategies (30, each with rules, examples, failure modes) | Strategies section |
| Risk management (sizing, stops, expectancy, drawdown, ruin, limits, correlation) | l1-why-risk … l1-cost-drag, l3-drawdown, l3-limits, l3-scaling, l3-correlation |
| Psychology & biases | l2-biases, l2-emotions, l2-process; Psychology section (19 topics, self-assessment) |
| Professional workflow & routine | l2-routine, l4-review, l4-live-transition; Workflow section |
| Backtesting & research method | l3-hypothesis, l3-backtest-method, l3-biases, l3-significance, l4-walkforward, l4-montecarlo |
| Quant & algo fundamentals | l4-probability, l4-correlation-regression, l4-mean-rev-momentum, l4-statarb |
| Performance measurement & readiness | l4-metrics, l4-readiness; readiness exam |

## Known content limitations
- Facts marked "verify" in lessons could not be confirmed from an official source. They include Indian residents' access to GIFT Nifty, some MCX, Eurex and NSE currency hours, and the section numbering for crypto tax under the Income-tax Act 2025.
- Strategy and pattern descriptions describe practice; they are **not** evidence that any rule is profitable. See BACKTESTING-VALIDATION.md for what the app's own tests show on synthetic data.