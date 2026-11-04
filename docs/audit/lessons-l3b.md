# Audit: js/content/lessons-l3b.js (L3-M4 to L3-M7)

Date: 4 Nov 2026. Auditor: AI-assisted review (Claude), following docs/AUDIT-SPEC.md and docs/CONTENT-SPEC.md.

## Scope
- All 16 lessons (sections, 48 lesson check questions, refs) and all 52 module-bank questions (L3-M4-q01..L3-M7-q13) read in full.
- About 120 numeric items recomputed in node (scratch scripts `verify.js`, `v2.js`, `v3.js` in the session scratchpad). These covered every worked example, table, check question and bank question: slippage budgets, FVG zones, spring sizing, value-area construction, EPS/P/E/ROE/ROCE/D/E, TERP, ex-dividend adjustment, straddle-implied moves, duration, gap-aware sizing, expectancy, t-stats, SE, CIs, required n, 1 − (1 − α)^k, Bonferroni z thresholds, recovery table, compounded streak table, gambler's-ruin figures, Kelly, daily/weekly limits, partial-exit R, scaling-in, ATR/chandelier trails, portfolio heat, and two-asset σ with correlation.
- I checked these against the engines: `IA.risk.indiaCharges` (actual Nifty/Bank Nifty futures charges), `riskOfRuinFormula`, `kelly`, `portfolioRisk`, `IA.ind.volumeProfile` (value-area algorithm), `IA.ind.supertrend`, and `IA.bt.riskOfRuinSim` (the [[widget:ror]] backend).
- I computed losing-streak probabilities exactly with a run-length recursion. I estimated peak-to-trough drawdown probabilities by Monte Carlo (20,000 paths).
- I checked concept definitions for SMC (BOS, CHoCH, OB, FVG, sweep), Wyckoff, AMT, fundamentals formulas, RBI MPC / FOMC structure, and backtest statistics.
- After the edits, `node tests/validate-content.js js/content/lessons-l3b.js` reports 0 errors and 0 warnings.

## Findings

| Item | Issue | Severity | Action taken |
|---|---|---|---|
| l3-smc, The maths | Says Nifty futures round-trip costs are "small" against a 16.1-point stop. The engine gives ~₹940 per lot (STT ~₹790), ~14.4 pts ≈ 0.9R. | error | Rewrote it with net-of-cost R (+1.1R winner / −1.9R loser) |
| l3-backtest-method, The maths | Uses round-trip costs of ₹300 (4.6 pts) per Nifty lot. The engine gives ~₹940 (14.5 pts). R values were wrong as a result (1.885R / −1.19R). | error | Recomputed: +1.61R / −1.46R, with the source cited as the widget |
| L3-M6-q09 | Assumed 5 points of costs, which is understated by a factor of three | error | Reworded to ~15 points; answer is now 1.125R; distractors replaced |
| l3-backtest-method, When it fails | Invented-looking result; ignored charges | misleading | Labelled "Illustrative"; added the Bank Nifty cost reality (~30 pts per lot) |
| l3-limits, The maths and L3-M7-q06 | Remaining-allowance sizing ignored charges | misleading | Added charges: 1 lot really fits, not 2. In the q06 explanation, kept the price-only answer and added the charges caveat |
| l3-drawdown, India | Ten-loser streak ignored charges | shallow | Added ~₹28k of charges (−10.6% total) |
| l3-scaling, The maths | "+₹260, no open risk" ignores ~₹1,900 of charges on two lots | misleading | Added net-of-charges outcome and the general combined-stop formula (24,180 floor) |
| l3-drawdown, When it fails | 38% drawdown and +61% recovery are inconsistent with 4% risk, 7 losses and two −2R trades (gives 36.4% and +57%) | error | Corrected the figures and showed the formula |
| l3-drawdown, Advanced | "Negligible chance of −50%, non-trivial chance of −20% in a year" was unquantified | shallow | Replaced with simulation-backed illustration (≈0% for −50%, ~2–9% for −20%) and labelled it as a model |
| l3-drawdown | [[widget:ror]] is a compounded Monte Carlo, not the closed form shown, so learners would see different numbers | misleading | Added a note explaining the difference |
| l3-drawdown, Misconceptions | "Streaks of 5–7 routine at 60%" is vague (7 in a row ≈ 25% over 300 trades) | misleading | Replaced with exact probabilities (85% / 52% / 25%) |
| l3-drawdown | No max-drawdown formula, no drawdown duration, no independence caveat on streak maths | missing | Added a short subsection |
| l3-biases, Beginner analogy | "One of 100 coins will probably get 8+ heads in 10" understates it: about 5.5 are expected and P(at least one) is 99.6% | misleading | Corrected the analogy |
| l3-biases, Advanced | Listed "pivot points" as repainting. Classic floor pivots do not repaint; swing pivots and fractals do. | error | Clarified |
| l3-biases | No direct overfitting measures (PBO, minimum backtest length, trial log) | missing | Added subsection and a real reference (Bailey et al., J. Computational Finance 2017) |
| l3-significance | "s often 1.2–1.6R" stated without basis | shallow | Gave the exact formula for a +2R/−1R system, s = 3√(p(1−p)) |
| l3-significance | t > 2 rule given with no small-sample or one- vs two-sided caveat | shallow | Added Student-t critical values and the one-sided 1.65 note |
| l3-hypothesis | Expectancy formula omitted the cost term that the worked example then subtracted | error | Added the cost term and a "don't double-count" note |
| l3-smc | No precise, testable definitions of BOS, CHoCH, OB, FVG, sweep; no bearish FVG formula; no swing-confirmation look-ahead warning | missing | Added a "Professional notes" section with a definition table, the two backtest traps and a plain evidence statement; added the bearish FVG formula and the timing note |
| l3-smc, Beginner | Origin "late 2010s" with no attribution | reference | Softened to "2010s"; noted the vocabulary is commonly traced to the educator "ICT" and that there is no standard definition set |
| l3-wyckoff, The maths | Reliance at ₹2,940–3,010 contradicts the app's RELIANCE preset (~₹1,480) and real post-bonus prices | misleading | Re-based to an illustrative large-cap at ₹1,470–1,505; all R ratios kept (1.1R / 2.3R / 1.7R); added costs and a simplification note |
| l3-microstructure-liquidity, When it fails | Same Reliance price issue (₹2,890) | misleading | Re-based to an illustrative ₹1,445 large-cap; loss kept at ₹4,500 |
| l3-microstructure-liquidity, Maths | Square-root impact formula mixed σ with "volume per minute" without matching horizons | shallow | Made the horizons consistent |
| l3-microstructure-liquidity, Misconceptions | Said stops are held only by the broker. NSE does hold SL orders in a separate book, but they are not visible in depth. | shallow | Clarified |
| l3-auction, The maths | The single-bin VA method was presented as *the* method. The CBOT original uses dual rows, and platforms differ. | shallow | Added a note that the app engine uses single-bin (verified), alongside the dual-row original |
| l3-company, metrics table | EPS (weighted average shares, attributable profit, diluted), ROE (average equity), ROCE (capital employed = total assets − current liabilities) and D/E (borrowings) were simplified; interest coverage was used in the screen but never defined | shallow | Tightened the definitions; added an interest-coverage row |
| l3-company, The maths | ROE < ROCE for company A could confuse learners (pre- vs post-tax numerators) | shallow | Added an explanation of the like-for-like caveat |
| l3-events, corporate actions | "Dividends above a threshold" was vague | shallow | Stated NSE's extraordinary-dividend rule (≥5% of market value) with a verify-on-NSE tag |
| l3-events, straddle | No basis given for straddle ≈ expected move; no time-value or tail caveat | shallow | Added the 0.8σ√T reasoning and caveats |
| l3-events, India | "Many results land 13:00–17:00 IST" was an unsupported statistic | unsupported claim | Softened |
| l3-events, India | F&O ban described loosely | shallow | Stated the 95% MWPL trigger with a verify tag (OI computation revised in 2025) |
| l3-macro, central-bank table | MPC composition, casting vote and statutory meeting minimum missing; FOMC voting structure, SEP meetings and minutes missing | shallow | Added |
| l3-macro, The maths | 5.50% repo could be read as the current rate; RBI inflation target missing | misleading | Labelled as an illustration; added the 4% ±2% target with a verify tag |
| l3-calendar | GDP timing vague; NFP "first Friday" stated as absolute | shallow | Corrected to "about two months after quarter-end" and "usually first Friday" |
| l3-calendar, When it fails | A pre-market stop on SPY assumed to trigger; many brokers do not trigger stops outside regular hours | misleading | Added caveat |
| l3-limits, Beginner evidence | "Disposition effect" cited as evidence for worse decisions after losses, which is a weak link | reference | Added the break-even effect (Thaler & Johnson 1990); softened "supports" to "is consistent with" |
| l3-limits, When it fails | ₹48,000 loss on 10 lots short options had no derivation | shallow | Added the derivation (≈160-pt premium rise × 300 units) |
| l3-limits, The maths | "Two full days, then a partial day" is arithmetically wrong (2 × 20k = 40k) | error | Corrected |
| l3-scaling, trailing table | Chandelier and Supertrend merged, with Supertrend described as "from highest high" (wrong: it is HL2 ± m×ATR, per engine) | error | Split into two rows with correct definitions |
| l3-correlation, India | Bank Nifty at 52,000 presented as if current | misleading | Labelled illustrative |
| Refs: Thorp Kelly volume | Wrong attribution (edited by MacLean, Thorp and Ziemba) | reference | Corrected |
| Refs: LeBeau & Lucas title | "Markets" should be "Market" | reference | Corrected |
| Refs: Markets in Profile | Missing co-authors | reference | Corrected |
| Answer-key distribution | 74 of 100 correct answers were at index 1 | quality | Re-ordered options on 54 questions without changing their text (now 32/20/29/19 across a=0..3); every key re-verified |

Checks that passed: all SMC, Wyckoff and AMT evidence labels (subjective / subjective / mixed) are appropriate and not overstated. BOS/CHoCH, FVG and sweep definitions are correct. VA examples (lesson, check q2, bank q08) match the engine algorithm. All fundamentals, TERP, duration and gap-sizing figures are exact. The recovery and compounded-streak tables are exact. The 45%/40% streak probabilities (0.53, 0.20, 0.75) are exact. Gambler's-ruin figures (1.8%, 13.4%), Kelly, t-stats, CIs, required n, 1 − 0.95^k and the Bonferroni thresholds (|t| ≈ 3.0 for k = 20, 3.7 for k = 216) are correct. Correlation and heat figures match `portfolioRisk`.

## Counts
- Items checked: 16 lessons, 48 check questions, 52 bank questions, 63 references, ~120 numeric computations.
- Errors fixed: 10 (cost understatement ×3, drawdown example, expectancy formula, pivot repaint, Supertrend definition, weekly-limit arithmetic, coin analogy, L3-M6-q09).
- Claims softened or labelled: 9.
- Additions made: 17 (including a new "Professional notes" section in l3-smc, PBO/min-backtest-length, max-drawdown/duration, Student-t values, central-bank structure, fundamentals definitions).
- References corrected: 3; added: 1 (Bailey et al. 2017). None removed (all others are real works).

## Remaining concerns
- Several other lessons and widgets across the app may share the "₹300 per Nifty lot" cost assumption. At 2026 STT, round-trip charges on index futures are ~₹930–940 per lot. Content and widgets outside this file were not checked.
- The [[widget:ror]] widget (compounded Monte Carlo) and `riskOfRuinFormula` (edge-based closed form) give different numbers from the gambler's-ruin example in the lesson. This is not a bug, but learners may be confused. A note has been added.
- The NSE extraordinary-dividend 5% threshold, the 95% MWPL ban trigger, and the RBI 4% ±2% target are given with "verify" tags. I could not re-confirm them against the live circulars or notifications offline.
- The SMC origin attribution ("ICT") is a widely reported fact about online education, not a sourced reference. It was kept deliberately vague.
- `l3-smc` and `l3-microstructure-liquidity` now exceed the 1,300-word target (1,854 and 1,658 words). This is acceptable for level 3, but they could be trimmed.

## Statement
This is an AI-assisted review. It is not an independent expert review or a regulatory certification. Time-sensitive facts must still be verified on the official sources named in the text.
