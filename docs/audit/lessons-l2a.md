# Audit: js/content/lessons-l2a.js (L2-M1 to L2-M4)

Auditor: AI-assisted review, 4 Nov 2026. Brief: docs/AUDIT-SPEC.md, rules: docs/CONTENT-SPEC.md.

## Scope
- 16 lessons (l2-dow, l2-sr, l2-trendlines, l2-breakouts, l2-phases, l2-opening-range, l2-vwap-advanced, l2-volume-profile, l2-market-profile, l2-oscillators, l2-volatility, l2-trend-tools, l2-confluence, l2-fib-pivots, l2-mtf, l2-chart-reading), 48 in-lesson check questions, 52 module-bank questions (L2-M1 to L2-M4, 13 each). Read in full.
- Numbers: 143 worked figures, check answers and bank answers recomputed in node (script in the session scratchpad). These ran through the app's engines wherever one exists: IA.ind.vwap, anchoredVwap, stochastic, williamsR, pivots, fibonacci, and IA.risk.indiaCharges at Nov 2026 specs. RSI, ATR, ADX, MACD/EMA, Supertrend, PSAR and Ichimoku updates were checked against the engine's formulas (rma/Wilder, EMA k = 2/(n+1), Wilder +DM/−DM, ATR-band Supertrend, Wilder PSAR). The value-area example was recomputed with both the two-row CBOT method and the engine's one-bin method.
- Concepts checked: Dow/market structure, S/R, trendlines, breakouts, phases/Wyckoff labels, ORB/gaps, VWAP and AVWAP, VWAP bands, volume profile (POC/VA/HVN/LVN, the 70% convention), Market Profile (IB, day types, TPO count, NSE closing price), oscillators and divergence, volatility tools and the squeeze, trend tools, lag and redundancy, Fibonacci/pivots/CPR, the MTF method, and the routine. Also checked: evidence labels, time-sensitive facts, references, link ids (all 7 cross-level link targets exist in curriculum.js) and chart indicator ids.
- After editing: `node tests/validate-content.js js/content/lessons-l2a.js` gives 0 errors and 0 warnings. `node tests/engines.test.js` gives 116/116 (not edited, run only as a sanity check).

## Findings
| Item | Issue | Severity | Action taken |
|---|---|---|---|
| l2-chart-reading, The maths (charges) | Said 2 Nifty futures lots round trip cost "₹150–250". The app's cost engine at Nov 2026 rates gives about ₹1,884, of which STT (0.05% of the sell value) is ₹1,624. Net P&L ₹8,250 and net R 2.35 were therefore wrong. | error | Replaced with engine figures: ≈₹1,880 charges, net ≈₹6,570, net R ≈1.87. Added a note on how much cost takes off the R. |
| L2-M4-q08 | Same error carried into the bank question (₹200 charges, answer ₹8,250). | error | Charges now ₹1,900; answer ₹6,550; why explains STT. |
| l2-opening-range, When it fails | "About ₹100–150 in charges" for a 1-lot Nifty futures round trip. The engine gives about ₹963. | error | Corrected to ₹950–1,000, with the STT explanation and a widget pointer. |
| l2-fib-pivots, The maths | "One every ~51 points": 7 lines span 360 points with 6 gaps, so the average is 60. | error | Corrected. |
| l2-fib-pivots, Advanced | Fibonacci spacing on a 400-point swing given as "40–60 points". The actual gaps are 47–67. | error | Corrected and the gaps listed. |
| l2-fib-pivots, US | 0.382 × $20 = $7.64, not $7.60. | error (minor) | Corrected. |
| l2-mtf, Advanced | "At 11:00 IST the daily bar is only a third complete". 105 of 375 minutes is 28%. | error (minor) | Corrected to "just over a quarter". |
| l2-mtf, Intermediate + L2-M4-q02 | Elder's triple screen uses a factor of about 5. The cited stack daily→60→15→5 includes a 3× step, so it does not fit "4–6", and the bank answer called 15→5 meaningful without caveat. | misleading | Reworded to give 4–6 examples, said honestly that the common stack has a 3× step, and updated the q02 explanation. |
| l2-volume-profile, value-area algorithm | Taught the CBOT two-row method. The engine uses a one-bin comparison and spreads each bar's volume evenly across its range. There was no rule for an exhausted side, and the 70% convention was not explained. | shallow / engine mismatch | Added step 5 (exhausted side), the reason for 70% (≈68% within 1 SD, a convention) and a note on how the engine differs. Worked example verified: both methods give VA 24,890–24,930 with 77% inside. |
| l2-volume-profile, shapes table | Listed a "Single bell (P/D balanced)" shape, which mixes the P-shape and D-shape names. | error (terminology) | Renamed to D-shape. |
| l2-vwap-advanced | Platform differences (TP vs close vs tick data, session reset, band variance formula) were not mentioned. The content matches the engine (TP = HLC/3, session reset, AVWAP from the anchor bar), checked with engine output: VWAP 1,404, AVWAP from bar 2 = 1,408. | missing | Added a note callout. |
| l2-vwap-advanced, US | DAX/US-open time given as fixed at 15:30 CET; it shifts during DST mismatch weeks. Same issue in l2-confluence and l2-mtf. | misleading (minor) | Qualified as "usually 15:30 CET". |
| l2-market-profile, day types | The Neutral day type did not distinguish neutral-centre from neutral-extreme. Open types and value migration (core Dalton concepts) were missing. | shallow / missing | Expanded the Neutral row. Added a "Professional notes" section (open types, higher/overlapping/lower value, honest limits). |
| l2-market-profile, Indian adaptation | NSE closing-price method stated as current fact with no date. | time-sensitive | Labelled "as of Nov 2026 — verify on nseindia.com" and noted that SEBI has consulted on a closing auction. |
| l2-oscillators | Hidden bearish divergence was missing. Hidden divergence was not labelled subjective. Williams %R = %K − 100 holds only for raw %K, but the Chart Lab plots slow 14,3,3. | missing / misleading | Added hidden bearish divergence and a subjective label, specified "raw %K", and added the slow-stochastic formula with a note about the Chart Lab pane. |
| l2-volatility | The squeeze multiplier was not stated. Carter uses Keltner 1.5 × ATR; the app's kc overlay is 2 × ATR10. Bollinger SD convention unstated. "24-hour markets have no opening gap" is wrong for gold futures (daily break and weekend). | misleading | Added the multiplier note, the population-SD note (matches the engine) and corrected the gold/BTC statement. |
| l2-trend-tools, PSAR / Supertrend | Formulas left out Wilder's two-bar clamp and the reversal reset (both in the engine), and the Supertrend band reset rule. | shallow | Added both rules. |
| l2-trend-tools, Ichimoku | Origin in a six-day week was stated as fact. | unsupported | Softened to "commonly said". |
| l2-confluence, The maths | Said "raise your confidence substantially" for independent signals, with no number given. | shallow | Added the calculation: 0.55³ ÷ (0.55³ + 0.45³) ≈ 65%, with the note that fewer signals result. |
| l2-opening-range, Advanced | Implied that professionals universally size with the "<40% of ADR" rule. NSE pre-open was described as setting index opens, which is imprecise. | unsupported / misleading | Labelled the threshold a practitioner one; corrected the pre-open mechanics (cash-segment call auction, index computed from constituents, check F&O pre-open coverage on NSE). |
| l2-sr, India callout | "Option hedging flows concentrate there" was stated as the cause; strike intervals had no date. | unsupported | Softened to "plausibly", gave round-number attention as an alternative cause, and dated the strike steps. |
| l2-breakouts, India callout | Said all NSE stocks have circuit "halts". F&O stocks use dynamic bands. Reference list lacked the stop-order evidence. | shallow / reference | Clarified fixed vs dynamic bands. Added Osler (2003, Journal of Finance) on stop-loss order clustering. |
| l2-phases | "Bank Nifty frequently trends in the first 60–90 minutes" had no evidence label. | unsupported | Reframed as a practitioner observation consistent with the U-shaped intraday volume/volatility pattern. |
| l2-fib-pivots, US | Origin of floor pivots in the Chicago pits stated as fact. | unsupported (minor) | Changed to "usually attributed to". |
| l2-chart-reading, US | Gave the PDT change in a form different from the verified fact, and omitted the as-of tag. | time-sensitive | Restated per CONTENT-SPEC with "as of Nov 2026 — verify on finra.org". |
| l2-chart-reading, evidence | Lesson-level label was 'established', but the lesson's own callout says the routine is a framework whose value is untested; only the checklist idea from aviation and surgery is established. | evidence label | Changed to 'mixed'. Other 15 labels checked and kept: structure/levels/MTF 'mixed'; trendlines, phases, Market Profile and Fibonacci 'subjective'; volatility and confluence 'established' because their core claims are measurement and lag maths. |
| All 48 lesson checks | 42 of 48 had a: 1, which makes them predictable. The quiz does not shuffle options (ui.js quiz shuffles questions only). | quality | Rotated options so answers are spread 11/13/12/12. The first l2-dow check was left unchanged because its explanation cites letters. The bank distribution (17/16/11/8) was already varied and left as is. |
| RELIANCE / NVDA / SPY / Bank Nifty prices | All marked illustrative. Lot sizes (Nifty 65, Bank Nifty 30), session times and Tuesday Nifty expiry match CONTENT-SPEC verified facts and carry as-of tags. | — | No change. |
| References | All books and papers checked and found to be real: Rhea; Murphy; Moskowitz-Ooi-Pedersen 2012 JFE; Osler 2000 FRBNY EPR; Harris; Edwards & Magee; Bulkowski; Raschke & Connors; Wyckoff; Kaufman; Cont 2001 QF; Crabel; Berkowitz-Logue-Noser 1988 JF; Shannon (both books); Kissell; Steidlmayer & Hawkins; Steidlmayer & Koy; Dalton et al.; Wilder; Lane 1984 TASC; Brown; Bollinger; Faith; Carter; Appel; Elliott; Hurst-Ooi-Pedersen AQR 2017; Aronson; Fischer; Ochoa; Elder; Gawande; Steenbarger; Gollwitzer 1999. | reference | No removals; 1 added (Osler 2003). |

## Verified without change (highlights)
- Every Dow, S/R, trendline, breakout, ER, ORB, VWAP/SD band, value-area, IB/extension, RSI, Stochastic/%R, TR/ATR, Bollinger/%B/bandwidth/Keltner squeeze, ATR sizing, MACD/EMA, DX/ADX, Supertrend, PSAR, Ichimoku, pivot/CPR, Fibonacci, lag, MTF R and expectancy figure. All 52 bank and 48 check answers are correct, except the q08 charges error listed above.
- Formulas match the engine: EMA k = 2/(n+1) with SMA seed, Wilder RSI/ATR/ADX (rma), population SD for Bollinger, Keltner EMA20 ± 2 × ATR10, classic pivots, Fibonacci retracements and extensions, VWAP on HLC/3 with session reset, AVWAP from the anchor bar.

## Counts
- Items checked: 16 lessons, 100 questions (48 check + 52 bank), 143 numeric values recomputed, 37 references.
- Errors fixed: 10 (3 charges errors in lessons and the bank, 3 Fibonacci/pivot arithmetic slips, the daily-bar fraction, the profile-shape name, the MTF ratio, the gold/24-hour statement).
- Claims softened or labelled: 8 (option-strike flows, ORB threshold, Bank Nifty session pattern, Ichimoku origin, pivot origin, hidden divergence, Market Profile frameworks, routine evidence label).
- Time-sensitive facts tagged: 4 (NSE closing price, strike intervals, US PDT change, RBI timing).
- Additions: 11 (VA step 5 and the 70% rationale, VA engine note, VWAP implementation note, Market Profile Professional notes, neutral-day split, hidden bearish divergence, slow-stochastic note, squeeze multiplier and SD note, PSAR rules, Supertrend reset, independent-signal calculation).
- References removed/corrected: 0 removed, 1 added.
- Check answers redistributed: 34.

## Remaining concerns
- Engine vs textbook value area: the engine's one-bin expansion and even spreading of volume across each bar's range differ from the CBOT two-row method. This is documented in the lesson but not changed, since engines are out of scope. Profiles drawn in the Chart Lab can differ from the hand method by one bin.
- The app's kc overlay (2 × ATR10) differs from Carter's squeeze (1.5 × ATR), so the app's squeeze flags will not match TTM-style tools. This is a product choice for the engine owner.
- NSE pre-open coverage for F&O contracts and any move to a closing auction should be checked against current NSE circulars. I could not verify them offline, so they are tagged rather than stated.
- Charges figures assume the specs.js brokerage model (₹20 or 0.03% per order). Real brokers differ, so the lesson points learners to the widget.
- The first l2-dow check still has a: 1 because its explanation names options by letter.

## Statement
This is an AI-assisted content review. It is not an independent expert review, a regulatory review, or a certification of accuracy. Facts marked "verify" must be confirmed against the named official sources before anyone relies on them.
