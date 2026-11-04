# Audit: js/content/indicators-lib.js (indicator reference library)

Date: 4 Nov 2026. Auditor: AI-assisted review (Claude), following docs/AUDIT-SPEC.md and docs/CONTENT-SPEC.md.

## Scope and method

- All 38 entries read in full, all 15 required fields plus `refs`, `params`, `chart`, `evidence`.
- **Every worked calculation recomputed in node by calling the engine** (`require('js/engines/indicators.js')`, `globalThis.IA.ind`): SMA, EMA, WMA, VWMA, MACD (one step via `ema` with SMA seeds), PSAR step, Supertrend bands, ADX and DMI (via `rma`), RSI (constructed series hitting AvgGain 12 and AvgLoss 8 exactly, then `rsi`), StochRSI, Stochastic, Williams %R, CCI, ROC, Momentum, RVOL, VWAP, AVWAP, OBV, CMF, A/D, MFI, Volume Profile, Bollinger (SD, bands, bandwidth, %B), sample SD and z-score, ATR and the lot-sizing arithmetic, Keltner, Donchian, Ichimoku, Fibonacci retracements and extensions (both directions), classic and Camarilla pivots (Nifty and Reliance), Elliott, Gann Square of Nine and Harmonic ratios. That is 41 calc blocks and about 140 printed numbers.
- **Warm-up claims checked by running the engine**: MACD line on bar 26, signal on bar 34 (correct); ADX first value on bar 28 (correct); StochRSI first %K on bar 30 and %D on bar 32 (text said "about 14+14+3+3"; made exact).
- **Engine checked against independent textbook implementations** written from the published definitions, on a 300-bar random OHLCV series: Wilder RSI, Wilder ADX/DMI using Wilder's running-sum smoothing, Lambert CCI, Quong–Soudack MFI, Lane raw %K, Williams %R, Bollinger upper band (population SD). The largest difference was 2e-11 (floating-point only). Wilder ATR differs only in the seed bar (see Engine discrepancies).
- Formula text checked against standard definitions: Wilder (RSI, ATR, ADX/DMI, PSAR), Appel (MACD), Bollinger, Lane, Lambert, Granville, Chaikin, Keltner (StockCharts states that Linda Raschke's EMA/ATR version defaults to 20, 2.0, 10, which matches the engine), Hosoda, Donchian.
- Chart Lab claims checked against `js/core/chart.js` (`tokens`) and `js/modules/chartlab.js` (`IND` list).
- `combinations` advice in every entry checked for redundant pairs. Elliott, Gann, Harmonics and Fibonacci checked for honest labelling.
- `node tests/validate-content.js js/content/indicators-lib.js`: 0 errors, 0 warnings before and after the edits.

## Findings

| Item | Issue | Severity | Action taken |
|---|---|---|---|
| stoch-rsi calc | %K example used Raw values 55, 61, **67.25** right after computing the current Raw as **62.5**. That is inconsistent, and 61.1 did not follow from the example. | error | Uses 55, 61 and 62.5 now, so %K = **59.5** (checked in node). |
| stoch-rsi formula | Said nothing about the original definition. Chande & Kroll used a 0–1 raw value with no smoothing; the 3/3 smoothing is a platform convention. Warm-up was vague. | shallow | Explains the convention. Exact engine warm-up added (bar 30 for %K, bar 32 for %D). |
| anchored-vwap calc | 10,224.3/7 shown as ₹1,460.61. With the rounding the text itself shows, the engine gives 1,460.619. | error (rounding) | Now reads 3,655.83, 10,224.33 and **₹1,460.62**. |
| 20 practice/example fields | Pointed users to a "Chart Lab data table" that does not exist. The Chart Lab shows values only in the crosshair OHLCV legend. | error (app mismatch) | Changed every one to "crosshair readout (the O, H, L, C, V legend)". |
| cci, roc, williams-r, cmf, mfi examples | Said the Chart Lab has **no** CCI, ROC, %R, CMF or MFI token. All five exist as toggles in chartlab.js and in chart.js tokens. | error (app mismatch) | Each now names the real toggle and its setting (CCI 20, ROC 10, %R 14, CMF 20, MFI 14). |
| ichimoku example/practice | Said the Chart Lab has no Ichimoku token. It does: Tenkan, Kijun and the cloud, shifted 26 bars, with no Chikou. The text also said dc gives 9 or 26-bar midlines, but dc is fixed at 20 bars. | error (app mismatch) | Describes the real toggle. Explains that dc is 20 bars, so 9 and 26-bar midlines are worked out by hand. |
| williams-r example/practice, stochastic | The `stoch` chart pane plots the **slow** 14,3,3 version. The text told users to subtract 100 from the plotted %K to get %R. That only works against the raw (fast) %K. | error | Now says the pane is slow, that %R matches only raw %K, and that raw %K is worked out from the crosshair readout. The stochastic formula note also says the chart pane is slow. |
| pivots example | Said "no pivot token". The Structure tab does draw P, R1 and S1. | misleading | Mentions the Structure tab. |
| macd formula | Did not mention the SMA-seeded EMA convention, who added the histogram, or the percentage version. | shallow | Notes the SMA seeding, that the histogram was added later (commonly credited to Thomas Aspray, 1986) and that PPO is the version you can compare across instruments. |
| adx formula | Did not say that Wilder smoothed running sums while the engine smooths averages. | shallow | Explains that the two are equivalent because the DIs are ratios (shown numerically, max difference 2e-14) and states the seeding and the bar-28 first value. |
| atr formula | Did not say that the seed includes bar 0's H−L. | shallow | States the convention and that it converges (difference 0.44 points at bar 14, 0.0007 at bar 100 on a test series). |
| atr calc (India) | Lot size of 65 was given as fact with no date or source. A third lot was not shown. | missing (time-sensitive) | Adds "as of Nov 2026 — verify on NSE" and the ₹12,675 figure for 3 lots. Bank Nifty 30 in practice gets the same label. |
| ichimoku formula | Did not mention that platforms displace by 26 or by 25. History said "1930s to 1960s". | shallow / misleading | Adds the displacement note. History now says Hosoda published in the late 1960s and that the six-day week is the *usual explanation*. |
| ichimoku example | "52 hourly bars cover about eight sessions". | misleading | Now about seven to eight NSE sessions (about 7 hourly bars per session). |
| donchian example | "20 x 15-minute bars capture the prior day and a half". An NSE session has 25 fifteen-minute bars. | error | Now "a little under one full session". |
| keltner definition/refs | "Popularised by Raschke" was cited to *Street Smarts*. I could not confirm that book describes the ATR Keltner version. | reference | Says "credited to Linda Bradford Raschke in the 1980s". The ref is replaced with StockCharts ChartSchool, which states this and the 20, 2.0, 10 defaults. |
| anchored-vwap refs | "Paul Levine — originator … (described in Shannon)" is a person, not a source. | reference | Replaced with Coles & Hawkins, *MIDAS Technical Analysis: A VWAP Approach…*, which documents Levine's MIDAS method. |
| rsi refs | "Andrew Cardwell — seminars; paraphrased widely" cannot be checked. | reference | Now points to Constance Brown's book (already listed), which describes Cardwell's range shifts. |
| pivots evidence | "Some studies report clustering in FX" had no source. | unsupported claim | Now names Osler (FRBNY Economic Policy Review, 2000) and says plainly that it tested published S/R levels, **not** floor pivots. Ref added. |
| cci definition | Stated as fact that "70–80% of values fall within ±100". | overstated | Now says that was Lambert's intent on his data and that the share varies. |
| supertrend definition | "Very popular among Indian retail traders" was an unsupported claim. | unsupported claim | Now says it is widely available on Indian retail platforms and commonly discussed. |
| adx, keltner, divergence examples | "Often", "tends to" used as empirical claims. | overstated | Changed to "can". |
| cmf formula | Did not mention Chaikin's 21-bar original. | shallow | Notes that 21 is often given as the original and 20 is the engine's default. |
| volume-profile formula | Did not say the engine adds one bin at a time, unlike the CBOT two-row method. | shallow | Notes the difference and the possible one-bin offset from other platforms. |
| elliott-wave combinations | Listed Fibonacci ratios as a combination. The wave guidelines are already Fibonacci, so agreement is circular. | misleading (redundant pair) | Now says this is the same assumption twice, not confirmation. |
| harmonics combinations | Same circularity: Fib retracements/extensions listed as confluence. | misleading (redundant pair) | Rewritten to say the same thing. |
| fib-retracement combinations | Confluence advice did not warn that many levels make "confluence" likely by chance. | shallow | Adds the warning. |
| stochastic combinations | "%R exact transformation" without saying of which version. | misleading | Now says it is exact against fast %K and a smoothed copy for slow. |

Correct as written (verified, no change): SMA, EMA, WMA, VWMA, MACD, PSAR, Supertrend, ADX, DMI, RSI, Stochastic, %R, CCI, ROC, Momentum, RVOL, VWAP, OBV, CMF, A/D, MFI, Volume Profile, Bollinger (population SD correctly labelled as Bollinger's convention), Standard Deviation (sample 50.30 correct), Keltner, Donchian, Ichimoku, Fibonacci (both directions, three-point note), classic and Camarilla pivots, Elliott, Gann and Harmonic arithmetic all matched the engine or direct arithmetic to the printed precision.

Honesty labelling: Fibonacci retracement and extension, Elliott, Gann and Harmonics are all `evidence: 'subjective'`, each with an explicit numbered list of reasons it is subjective. Gann already says "none established" and calls the claims speculative. These were adequate; only the circular-confluence advice was changed. The other redundancy notes in `combinations` (SMA/EMA/WMA, RSI/Stoch/%R/CCI, OBV/A-D/CMF, MACD/EMA cross, Bollinger/SD, Supertrend/PSAR/Keltner, ADX/DMI, Ichimoku/Donchian) are correct.

## Engine discrepancies (reported, engine not edited)

1. **ATR / Supertrend / Keltner seed bar.** `trueRange` returns H−L for bar 0 and `atr = rma(trueRange)` includes it in the seed, so the first ATR is on bar index 13. Wilder's worksheet starts true range on the first bar that has a previous close and seeds with the mean of TR over bars 1–14 (first ATR on index 14). Evidence: on a 300-bar random series the engine's ATR differs from a Wilder-seeded ATR by 0.44 points at bar 14 and by 0.0007 at bar 100. This is a seeding convention many platforms share, not a formula error. The content now discloses it. Note that `adx` already sets `tr[0] = null`, so ATR and the ADX TR smoothing use different seeds inside the same engine.
2. **Stochastic RSI flat range returns 0.** `stochRsi` returns 0 when RSI is flat over the window. That is a deliberate convention, not a standard. Some platforms return 50 or carry the previous value forward, and 0 gives a false "oversold" reading. The content already warns about this.
3. **Parabolic SAR initialisation.** Direction comes from `c[1].c >= c[0].c`, and the starting EP and SAR use bar 0 only. Wilder starts from a chosen significant point. This is a convention, already disclosed in the PSAR weaknesses. On a flip, the engine does not clamp the new SAR against the last two bars' highs/lows (Wilder's rule applies to the next bar). Minor, and not tested here against Wilder's worked tables.
4. No errors found in RSI, ADX/DMI, MACD, Bollinger (population SD), Stochastic, %R, CCI, MFI, OBV, A/D, CMF, VWAP, Keltner, Donchian, Ichimoku, Fibonacci or pivots against the standard definitions.

## Counts

- Items checked: 38 entries × 15 fields (570 fields), plus refs; 41 calc blocks (about 140 numbers) recomputed with the engine; 8 indicators cross-checked against independent implementations.
- Errors fixed: 9 (StochRSI %K, AVWAP rounding, Donchian session length, data-table references (20 occurrences counted as one), wrong "no token" claims for 5 indicators, Ichimoku token/dc length, slow-vs-fast Stochastic and %R relationship, pivot token, Ichimoku session count).
- Claims softened: 6 (Supertrend popularity, CCI 70–80%, Ichimoku history, ADX/Keltner/divergence "often/tends").
- Additions made: 12 (MACD conventions/Aspray/PPO, ADX sums equivalence and seeding, ATR seed, StochRSI convention and warm-up, Ichimoku displacement, Stochastic pane note, CMF 21-bar, Volume Profile VA method, ATR lot verify and third-lot figure, three combinations warnings).
- References removed/corrected: 4 (Keltner/Street Smarts replaced, Paul Levine replaced with Coles & Hawkins, Cardwell redirected to Brown, Osler 2000 added for pivots).

## Remaining concerns

- Fixing the Chart Lab is outside my edit scope. The stoch pane plots slow 14,3,3 while the indicator page's `params` and the engine default are fast. A `stochFast` token would make the %R identity something users can see.
- There is no WMA, VWMA, StochRSI, Momentum, A/D or SD toggle, and the chart has no data table. The practice tasks still need hand calculation from the crosshair legend, which is slow for 14 to 26-bar windows.
- I could not verify that Nick Scott (1989) originated Camarilla, or that Olivier Seban created Supertrend. Both are already marked "attributed". The Supertrend ref "see platform documentation" is not a specific source.
- The 1986 credit to Thomas Aspray for the MACD histogram comes from secondary sources (his 1988–89 *Technical Analysis of Stocks & Commodities* articles are on record). The text says "commonly credited".
- The CONTENT-SPEC token list leaves out ichimoku, cci, mfi, willr, roc and cmf, even though chart.js supports them. Another owner should update it.
- Recompute scripts were written to the shared scratchpad, and a parallel auditor overwrote them after they ran. The outputs above were captured before that happened.

## Statement

This is an AI-assisted review, not an independent expert review or a regulatory certification. Nothing here is investment advice.
