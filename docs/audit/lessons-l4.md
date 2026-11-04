# Audit: js/content/lessons-l4.js

Auditor: AI-assisted review, 4 Nov 2026. Brief: docs/AUDIT-SPEC.md, rules from docs/CONTENT-SPEC.md.

## Scope
- 13 lessons (L4-M1 order flow and execution, L4-M2 quant foundations, L4-M3 research process, L4-M5 performance and discipline), 39 lesson check questions, 54 module-bank questions (L4-M1 ×13, L4-M2 ×15, L4-M3 ×13, L4-M5 ×13) and 29 READINESS exam questions. All read in full.
- **Numbers.** Every worked example, table and calculation question was recomputed in node: about 150 separate values. Scripts are in the session scratchpad. The recomputed set covers:
  - Depth: imbalance, micro-price and the cost of walking the book.
  - Footprint and CVD: delta, POC, every diagonal ratio, CVD and the delta z-score.
  - Square-root impact and implementation shortfall, including the exercise answer.
  - The Nifty futures cost stack, cross-checked against the `IA.risk.indiaCharges` engine (₹958.86, 14.75 points; matches the lesson).
  - Expectancy, standard deviation, SE and t from the 40-trade list.
  - Binomial tail: P(≤4 wins of 20) = 5.1%.
  - Streak probabilities: exact Markov-chain DP, compared with the ln N / ln(1/q) approximation.
  - The full five-point regression: β, α, r, R², RSS, residual SE, slope SE, t and the prediction.
  - Mean reversion: z-scores and AR(1) half-life in both forms.
  - The pairs spread worked from logs, leg sizing, and pairs costs and break-even.
  - Walk-forward efficiency (WFE) and the OOS t-test.
  - The three hand shuffles and their drawdowns.
  - Ruin standard error, plus sizing from the 95th-percentile drawdown.
  - Live-vs-OOS z-tests with normal tail probabilities.
  - Risk metrics: Sharpe, Sortino, downside deviation, max drawdown (arithmetic and compounded), Calmar, MAR, and the Sharpe SE in both annual-observation and daily-observation forms.
  - Review: adherence, mistake cost and the setup t-tests.
  - Readiness: break-even win rates, gap loss, recovery after a drawdown, the option spread, multiple-testing counts and the points expectancy.
- **Monte Carlo table.** The illustrative 10,000-path table was checked for plausibility by bootstrap simulation of +0.1R/trade distributions. The 5th-percentile, median and 95th-percentile figures for final R, drawdown and streak all fall within the simulated ranges.
- **Concepts checked:** order-flow mechanics (aggressor, tick, quote and Lee–Ready rules, the footprint diagonal convention, CVD use, spoofing caveats), what Indian retail actually receives in market depth, SL-M availability on NSE, SEBI retail algo framework status, short selling and SLB, and readiness framing (no profitability implied).
- **Facts checked by web search:** SEBI algo circular dates and NSE threshold, broker depth offerings, SEBI F&O loss studies, NSE SL-M block. All `[[link:]]` targets resolve. All references checked against known publications.

## Findings

| Item | Issue | Severity | Action taken |
|---|---|---|---|
| l4-footprint, Intermediate: diagonal imbalance | Only one diagonal computed, and it said "None here". The sell-side diagonal at 24,811 (sell 120 vs buy 15 one tick above = 8:1) exceeds the 3:1 threshold, so the claim was wrong. | error | Listed all 8 buy-side and sell-side diagonals. Pointed out that the 8:1 imbalance passes but rests on only 15 contracts, and explained minimum-volume filters. |
| l4-footprint, Advanced: Lee–Ready | Described as "trade at or above ask = buy … otherwise tick rule", which is the quote rule. Lee–Ready compares the trade with the quote **midpoint** and uses the tick rule only at the midpoint. | error | Separated the tick rule, quote rule and Lee–Ready, and stated each correctly. |
| l4-footprint, When it fails | "Short-covering burst … delta −200". Short covering is aggressive buying and would print positive delta, so the explanation contradicted itself. | misleading | Rewritten as offers pulled into a liquidity vacuum: price moves without aggressive buying. Numbers unchanged (loss ₹1,950 verified). |
| l4-footprint | No spoofing caveat for the footprint (it only sees executed trades). Missing: CVD anchor choice, intra-bar min/max delta, contract roll, volume units. Footprint signal efficacy unlabelled. | missing | Added a "Professional notes" section covering these, plus an evidence callout saying retail footprint signals have no established published track record. |
| l4-depth, Advanced: spoofing legality | Called spoofing flatly "illegal under SEBI's PFUTP regulations". PFUTP does not name spoofing; SEBI treats it as manipulation case by case. The US statutory basis was imprecise. | misleading | Reworded: "can be treated as a manipulative practice under PFUTP, SEBI has taken enforcement action"; in the US, expressly prohibited by the Dodd-Frank provision of the CEA (futures) and pursued under securities law. |
| l4-depth, India: retail depth | Correct but incomplete. Some brokers now advertise up to 200 levels (Dhan "Full Market Depth"); refresh rate was not described. | shallow | Added the up-to-200-level offering, the snapshot refresh rate (often around 1 s) and the point that deeper ladders are still aggregated and delayed versus co-located TBT. Kept the "verify with your broker" date stamp. |
| l4-execution, order types | Recommends SL-M stops with no mention that NSE has blocked SL-M in index options since Sep 2021, or that brokers restrict SL-M and market orders in F&O. The same gap affects M1-q11. | missing | Added an India callout (as of Nov 2026, verify) and a qualifier to the M1-q11 explanation. Added an NSE circular reference. |
| l4-probability, Intermediate: 10-loss streak in 500 trades | "Well over one in two": direction correct but vague. Exact value at q = 0.6 is 70.6%. | shallow | Now states "about 70% (computed exactly, assuming independent trades)". |
| l4-montecarlo, The maths: streak formula | ln N / ln(1/q) gives 10.4 for N = 200, q = 0.6. The exact median is 9 and the mean 9.2; P(≥10) = 38%, P(≥14) = 5.8%. The formula overstates the typical case and understates the case you should plan for. | shallow | Added the exact figures and the refinement ln(N(1−q))/ln(1/q) ≈ 8.6. Advised planning around the 95th percentile (about 14). |
| L4-M3-q07 explanation | Same approximation (9.5). Exact median is 8, P(≥10) = 29%, 95th percentile = 13. | shallow | Added the exact figures to the explanation; the correct option (9–10) is still defensible. |
| l4-montecarlo | Lesson explains shuffle vs bootstrap but not which one the widget uses. The engine (`IA.bt.monteCarlo`) bootstraps. | missing | Added a note: the widget bootstraps, so its total varies. |
| l4-metrics, Advanced: Sharpe SE | "1-year Sharpe 1.5 has SE ≈ 1.5 (√2.125)": the arithmetic is off (√2.125 = 1.46), and the formula mixes frequencies. Lo's SE uses SR and T at the same frequency. With daily data annualised, the SE is about √(1/years) ≈ 1.0. | misleading | Rewrote with both frequency forms (1.46 for annual observations, about 1.0 for daily) and noted that non-normal or autocorrelated returns raise the SE. The conclusion (consistent with zero) is unchanged. |
| l4-metrics, The maths: warn callout | "SE ≈ 12.6" for 10 days uses the annual-observation form. The daily-observation form gives about 5.1. | misleading | Both figures now shown, with the correct one first. |
| L4-M5-q04 | Same formula, applied as annual-observation (answer 1.22 is internally correct). | shallow | Explanation now notes that the daily-data SE would be about 0.71, still large. The answer is unchanged. |
| l4-metrics, India: tax | Tax characterisation did not account for the Income-tax Act 2025 replacing the 1961 Act from 1 Apr 2026. | misleading | Added a "reported to replace … verify on incometax.gov.in" caveat. Not independently verified: marked as reported. |
| l4-statarb, The maths: costs | Cost range ₹800–900 was inconsistent with the stated 6–8 bps on ₹11.1 lakh of turnover (₹666–888). Break-even said "above 45%", but it is 43% before costs and about 50% after ₹900 of costs. | error | Turnover shown explicitly; costs corrected to ₹670–890; break-even shown before costs (43%) and after costs (50%); requirement changed to "comfortably above 50%". |
| l4-statarb, India: SEBI algo framework | Status was given as "as of 2025–26, phased through 2025" without the current dates or threshold. | reference / time-sensitive | Verified and added: SEBI circular 4 Feb 2025; NSE implementation standards May 2025 with a 10 orders/sec per exchange per segment threshold for registration; original 1 Aug 2025 start extended, and the 30 Sep 2025 circular set full applicability from 1 Apr 2026. Date stamp changed to "as of Nov 2026, verify". Added NSE circular reference. White-box/black-box and RA-registration details are from the original circular summary and were not re-verified line by line (left "as published, verify"). |
| l4-statarb, India: short selling | Said cash shorts must be squared off intraday, with no mention of SLB. | shallow | Added SLB as the overnight-borrow route and its limited liquidity. |
| l4-walkforward: WFE definition | Formula uses annualised returns; the example uses R per 100 trades without explaining that the two differ. | shallow | Added the equivalence condition (similar trade frequency). |
| l4-readiness, Gate 5 vs app | Gate 5 required "50+ paper trades", but the app's readiness checklist (js/modules/misc.js) requires 100+ journalled trades. "5-loss streak" was too lax given that ~14-loss streaks are the 95th percentile over 200 trades at 40% wins. | error (inconsistency) | Gate 5 now says 100+ journalled trades, citing the app requirement, and a 10-loss streak response. READY-q25 changed from 60 to 120 paper trades so the scenario is consistent. |
| l4-readiness, India: SEBI studies | Vague ("first covering FY22, with later updates"). | reference | Verified and added study dates (Jan 2023, Sep 2024, Jul 2025) and the FY25 headline of about 91% incurring net losses. Reference updated. |
| l4-readiness: profitability framing | Checked every section, check question, L4-M5-q13 and READY-q25: no statement implies that passing guarantees or predicts profit. The warn callout, "When it fails" example and exercise all frame readiness as permission for a controlled experiment. The app's own copy (misc.js) agrees. | none | No change needed. |
| l4-correlation-regression: R² range | "Daily R² often 0.3–0.6" for large caps against Nifty is an unsourced statistic. | unsupported claim | Softened to a rough, period-dependent guide with "measure your own". |
| All other numeric items | Recomputed. Correct, apart from rounding within displayed precision: imbalance +0.246 and +0.199; micro-price 1,402.225; walk-the-book ₹1,402.37 / ₹510 / 1.2 bps; impact 0.31% / ₹75k / 3.2×; IS ₹4,770 and the exercise ₹2,620; regression β 1.409, R² 0.906, slope t 5.4 (exact 5.37); half-lives 11.9 / 11.6 / 139 / 13–14; z-scores; WFE 0.21, t 0.83; drawdowns 4/4/6R; Sharpe 3.26, Sortino 5.39, MDD 1.3%, Calmar 31; live z −1.38 (8.4%) and −2.19 (1.4%); all question answers. | none | No change. |
| References | All books, papers and official sources checked against known publications (Harris; Cont–Kukanov–Stoikov 2014; Lee–Ready 1991; Easley–López de Prado–O'Hara 2012; Perold 1988; Almgren–Chriss 2000; Bouchaud et al.; Tsay; Granger–Newbold 1974; Jegadeesh–Titman 1993; Lo–MacKinlay 1990; Daniel–Moskowitz 2016; Chan ×2; Gatev et al. 2006; Engle–Granger 1987; Khandani–Lo 2007; Pardo; López de Prado; Bailey et al. 2014/2017; Vince; Efron–Tibshirani; Bandy; Steenbarger ×2; Sharpe 1994; Sortino–Price 1994; Lo 2002; Young 1991; Douglas; Duke; Klein 2007; Kahneman; Taleb; Tharp; Cont 2001). | reference | None removed. Three official references added or made more precise (SEBI algo circular dates, NSE algo standards, NSE SL-M circular, SEBI study dates). |

## Counts
- Items checked: 13 lessons, 122 questions (39 lesson checks, 54 module bank, 29 READINESS) and about 150 recomputed numeric values.
- Errors fixed: 4 (footprint diagonal claim, Lee–Ready definition, stat-arb costs and break-even, readiness Gate 5 vs app criteria with READY-q25).
- Misleading claims corrected or softened: 6 (spoofing legality, short-covering delta, Sharpe SE ×2, tax-law caveat, R² statistic).
- Additions made: 9 (footprint Professional notes section with evidence callout; India SL-M callout; 200-level depth and refresh detail; exact streak statistics ×2; widget bootstrap note; WFE definition note; SLB note; SEBI study dates; M1-q11 and M5-q04 explanation qualifiers).
- References removed: 0. References corrected or added: 4.
- Validator: `node tests/validate-content.js js/content/lessons-l4.js` → 0 errors, 0 warnings.

## Remaining concerns
- **SEBI algo framework details:** the white-box/black-box split, RA registration for black-box providers and the 10 OPS threshold come from the Feb 2025 SEBI circular and the May 2025 NSE standards as reported by secondary sources (broker blogs, news). Any amendment after Sep 2025 was not checked. The text keeps "verify on sebi.gov.in / NSE".
- **Income-tax Act 2025 effective 1 Apr 2026** is stated as "reported", not verified against the official gazette.
- **Dhan's 200-level depth** is a broker marketing claim. Whether it comes from NSE TBT was not confirmed.
- **Bank Nifty footprint example** (55,000 level, 6,200 contracts in 15 min) is illustrative. Absolute contract volumes are not checked against real NSE data.
- **Monte Carlo summary table** is labelled illustrative and is plausible for a +0.1R strategy, but it was not generated from a stated trade list. A future revision could tie it to the lesson's own 40-trade example. That list yields wider ranges: 95th-percentile DD about 32R, because its standard deviation is 1.39R.
- **L4-M4 has no lessons or questions in this file** (the validator lists it as a thin module). That is out of scope for this file.

## Statement
This is an AI-assisted content review against the project's audit brief. It is not an independent expert review, a regulatory opinion or a certification of accuracy. Regulatory and cost facts are time-sensitive and must be verified on official sources (SEBI, NSE, FINRA/SEC, the Income Tax Department) before you rely on them.
