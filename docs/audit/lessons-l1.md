# Audit: js/content/lessons-l1.js (Level 1, L1-M1 to L1-M5)

## Scope
- All 24 lessons (every section), 54 lesson check questions and 68 module-bank questions (L1-M1 to L1-M5), plus all reference lists.
- About 150 numeric values recomputed in node (scratch script, not committed). The script used the app's engines where they exist: `IA.risk.indiaCharges` (all charge examples), `IA.risk.positionSize`, and `IA.indicators.ema/sma` (moving-average example). RSI, VWAP, close location, Heikin-Ashi, spreads, order-book fills, auction matching, circuit bands, index contributions, leverage, recovery, streak drawdowns, expectancy, standard errors and cost-in-R were recomputed directly against the engine formulas (`rsi` = Wilder RMA, `vwap` = typical price × volume, `obv`).
- The streak claim (a run of 8 or more losses somewhere in 250 trades at a 50% win rate is about 38% likely) was checked with an exact dynamic-programming calculation: 38.4%.
- Answer keys were checked after the file's `spin()` rotation. Correct indices are spread across 0 to 3 in both the bank (17/13/18/20) and the checks (11/16/14/13).
- `node tests/validate-content.js js/content/lessons-l1.js` gives 0 errors and 0 warnings. `node tests/engines.test.js` passes 116 of 116 (engines not edited).

## Findings
| Item | Issue | Severity | Action taken |
|---|---|---|---|
| l1-orderbook, depth table | Said a ₹0.10 spread is "one tick", but the book steps in ₹0.05, so it is two ticks | error | Corrected; added a note that real ticks depend on price |
| l1-orderbook, Example 2 | ₹1 lakh at ₹249.20 is 401 shares, not 402; cost ₹481 | error (minor) | Corrected |
| l1-orderbook, When it fails | Average fill ₹465.75 gives a loss of ₹28,500, not ₹28,000 | error (minor) | Corrected |
| l1-orderbook, India | Tick-size text implied a uniform ₹0.05 tick; NSE uses price-based ticks | misleading | Rewritten as a principle (tick/price is the spread floor), with an as-of/verify tag |
| l1-orderbook, India | "Among the most heavily traded contracts in the world" had no source | unsupported | Softened to Nifty index options; FIA volume surveys added as source |
| l1-ordertypes, Maths | "Buffer of a few ticks to a few ATR-percent" was garbled | misleading | Changed to "up to a small fraction of the ATR" |
| l1-exchanges, order life | Clearing corporation tied rigidly to the exchange | shallow | Added clearing interoperability (2019) |
| l1-exchanges, India | MIS auto square-off failure and short-delivery close-out not explained | missing | Added "Professional notes": unfilled square-off at a circuit, delivery or short-delivery outcome, auction then close-out rule (verify tag) |
| l1-segments, table | Short-option row put "Margin like futures" in the charge (STT) column | error | Replaced with STT 0.15% on the opening sale plus SPAN/exposure margin |
| l1-segments, When it fails | 2 Bank Nifty lots (₹33.6 lakh) on "₹2.4 lakh margin" is about 7% of notional, unrealistically low, and on a ₹3 lakh account the margin would barely fit | misleading | Rebuilt: ₹5 lakh account, about ₹4 lakh margin (about 12%, illustrative), 12.6% of margin, 10% of account, 6.7x leverage; all recomputed |
| l1-segments, India | No exercise style or settlement: stock F&O is physically settled, index F&O is cash-settled, STT on exercise | missing | Added a settlement table and a paragraph (STT 0.15% on exercise, as of Nov 2026, verify) |
| l1-margin, Intermediate | "Minimum around 20%" stated as a SEBI rule | misleading | Reworded: VaR + ELM is the rule; about 20% is how brokers apply it in practice |
| l1-margin, Intermediate | No intraday F&O margin treatment | missing | Added: intraday F&O needs essentially full SPAN + exposure margin under peak-margin rules (verify) |
| l1-sebi, peak margin | Snapshot mechanism and penalty not explained | shallow | Added: clearing-corporation snapshots, peak obligation, short-margin penalty passed to clients (verify slabs) |
| l1-sebi, Maths | Old lot 25 not dated | shallow | Labelled "before the Nov 2024 resizing" |
| l1-nse-sessions, pre-open | Random closure of order entry and auction tie-break or fallback rules missing | missing | Added both, in broad terms |
| l1-nse-sessions, normal market | Said US data adds afternoon volatility; most US data (08:30 ET) lands about 18:00–19:00 IST, after the NSE close | misleading | Corrected: the European open and data in the afternoon, US data in the next-day gap |
| l1-nse-sessions, closing price | No mention that the closing method may change | shallow | Added a note on SEBI's closing-auction consultation, with "check NSE" |
| L1-M2-q01, explanation | "Pre-open 09:00–09:15" conflicted with the lesson's 09:00–09:08 order entry | ambiguity | Clarified that the session runs 09:00–09:15 and order entry 09:00–09:08; explained the distractors |
| l1-circuits, F&O ban | No penalty for increasing positions; 2025 delta-based OI not named | shallow | Added both (verify on NSE) |
| l1-india-costs, table note | STT on exercised options (charged on intrinsic value, not premium) missing; BSE charges differ | missing | Added |
| l1-india-costs, Advanced | "₹1 spread in a far strike is 0.8% each way": ₹1 on ₹120 is about 0.83% round trip, about 0.42% each way | error | Corrected and added a ₹10-premium case (10%) |
| l1-india-costs, Exercise | Bank Nifty breakeven had no answer | shallow | Added check value: about ₹999 charges, about 33 points (engine) |
| l1-moving-averages, When it fails | Bank Nifty futures charges "≈ ₹400" contradicts the 2026-rate engine (≈ ₹997 at 56,000) | error | Changed to ≈ ₹1,000; day result −₹14,100 |
| L1-M4-q12 | Same ₹400 charge assumption; key −₹9,600 | error | Charges ≈ ₹1,000; key −₹13,200; distractors rebuilt (−₹7,200 ignores charges, −₹6,000 is charges only) |
| L1-M3-q07 | Dark cloud: the classic definition needs the open above the prior *high*; the explanation did not say a relaxed rule applied, or why "below 300" is wrong | ambiguity | Explanation now names the relaxed intraday definition and explains each distractor |
| l1-volume, When it fails | A "block sale crossing at the high" in normal-market depth is inaccurate (Indian block deals go through separate windows) | misleading | Changed to "one large seller filling every bid" |
| l1-why-risk, Intermediate | "Intraday prices are close to efficient" stated as fact | unsupported | Softened to "hard to predict; whatever predictability exists is competed for by faster participants" |
| l1-why-risk, When it fails | "Needs +29% on ₹2.74 lakh to get back to start" was wrong (start ₹3 lakh is +9.5%; peak ₹3.42 lakh is +24.8%) | error | Corrected to about +25% to regain the peak |
| l1-position-sizing, Intermediate | 160 shares (₹2.24 lakh) exceeds ₹2 lakh capital; the engine at 1x returns 142 shares | shallow / engine mismatch | Added the capital-binding case (142 shares, actual risk ₹1,775), matching the engine |
| l1-cost-drag, cost-in-R table | Row 1 (₹133, 0.13R) contradicted the lesson's own worked example (₹113) | error | Aligned to ₹113, 0.11R |
| l1-cost-drag, When it fails | Backtest already included brokerage, but the added cost used ₹1,000 (which includes brokerage): double counting | error | Non-brokerage charges ≈ ₹960, giving ≈ ₹5.8 lakh; net ≈ −₹4.7 lakh |
| l1-rsi refs | "Andrew Cardwell — RSI range rules (seminars)" is not a verifiable published source | reference | Removed; Brown's book now labelled "RSI range shifts" |
| l1-orderbook refs | Investor.gov page title "Understanding bid and ask" not confirmable | reference | Changed to the Investor.gov glossary entries |
| l1-ordertypes refs | "NEAT/NOW FAQs": NOW is not an NSE system name I can confirm | reference | Changed to "Trading system (NEAT) and order types, equity segment FAQs" |
| l1-indices refs | "S&P BSE Sensex" is outdated; the index has been "BSE Sensex" since the 2024 rebrand | reference | Corrected |
| l1-exchanges refs | No source for the short-delivery auction | reference | NSE Clearing auction/close-out page added to the existing entry |

All other numbers were confirmed correct, including:
- every charge example (₹97.16, ₹967.91, ₹66.94, ₹82.68, matching the engine to the paisa)
- leverage, wipe-out and recovery figures; index contributions; bands; RVOL
- EMA (1,405.20 and 1,408.13, matching the engine) and RSI 62.9 and 47.2
- VWAP 25,013.33, 25,020.67 and 25,027.67
- close location 0.86; Heikin-Ashi 25,021.5; hammer and engulfing sizing
- square-root timeframe maths
- expectancy table, SE and CI (−0.08R to +0.65R), option-selling −₹292, streak drawdowns, the 38% run probability
- all 68 bank answer keys apart from the M4-q12 fix

## Counts
- Items checked: 24 lessons, 122 questions (54 check + 68 bank), 102 references, about 150 numeric values.
- Errors fixed: 13, including 1 question key (M4-q12) and 2 question-explanation ambiguities (M2-q01, M3-q07).
- Claims softened: 4 (heavily traded contracts, intraday efficiency, 20% margin "minimum", block-sale story).
- Additions: 11 (interoperability, MIS square-off/short delivery notes, F&O settlement table, STT on exercise ×2, intraday F&O margin, peak-margin penalty, pre-open random close and tie-break, closing-auction note, F&O ban penalty and delta OI, capital-binding sizing).
- References: 1 removed, 3 corrected, 2 added or expanded (FIA volume surveys; NSE Clearing short-delivery close-out).

## Remaining concerns (not resolved)
- **Short-delivery close-out formula.** The added text is deliberately broad: higher of the highest price from trade day to auction day, or a percentage above the close. Confirm the exact current rule on nseclearing.in.
- **Closing auction session.** I am fairly but not fully certain SEBI consulted on a cash-market closing auction. Before Nov 2026 I could not confirm whether it has been implemented. If it has, the "30-minute VWAP close" text in l1-nse-sessions (and L1-M2-q03) is out of date.
- **Index-futures pre-open** ("introduced in late 2023, verify scope") is left as written, with its verify tag.
- **SEBI 2025 rules** (non-benchmark index composition, retail algo framework phasing, MWPL delta-based revision) are cited with verify tags. Exact effective dates were not confirmed here.
- **Specs mismatch, outside this file.** `js/engines/specs.js` says Sensex expires weekly on Thursday. This file does not state a Sensex expiry day, but other content should be checked against BSE. I did not edit the engine.
- **Example margins** (about ₹1.8 lakh for 1 Nifty lot; about 12% of notional for Bank Nifty) are illustrative and labelled so; they were not checked against a live SPAN file.

This is an AI-assisted review, not an independent expert or regulatory certification. Verify all time-sensitive facts on SEBI, NSE, BSE, NSE Clearing and Income Tax Department sources before relying on them.
