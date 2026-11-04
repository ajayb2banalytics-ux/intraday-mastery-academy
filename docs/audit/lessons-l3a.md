# Audit: js/content/lessons-l3a.js (L3-M1 Futures, L3-M2 Options foundations, L3-M3 Options strategies and expiry risk)

Audit date: 4 Nov 2026. Auditor: AI-assisted review under docs/AUDIT-SPEC.md.

## Scope and method
- Read all 12 lessons (l3-futures-basics, l3-basis, l3-futures-risk, l3-options-basics, l3-pricing, l3-greeks, l3-iv, l3-chain, l3-spreads, l3-vol-strategies, l3-time-spreads, l3-expiry), their 33 inline check questions and the 42 module-bank questions (L3-M1 13, L3-M2 14, L3-M3 15).
- Recomputed every option premium and Greek with `js/engines/options.js` (`IA.opt.bs`) in node. I also cross-checked the headline prices (Nifty 25,000 CE/PE 7d, Bank Nifty 56,000 CE 21d, AAPL 230, SPY 600) with an independent Python Black–Scholes implementation. They agree to the paisa/cent.
- Recomputed every scenario re-price (gaps, IV changes, calendar back-leg values at the front expiry, diagonal, expiry-day straddle, US earnings crush and gap). Where a lesson did not state the IV, I solved for it to check the figure was achievable.
- Verified payoff, breakeven, max gain and max loss for every vertical, straddle, strangle, condor, butterfly, iron fly and ratio with `IA.opt.analyse`, and by hand-coded expiry payoffs.
- Recomputed all futures figures: notional, MTM, leverage, cost-of-carry fair value, roll spread, basis decay, beta hedge, gap stress, statutory costs. Costs used the CONTENT-SPEC rates.
- Recomputed the HV example, VIX-to-daily-move conversions, max pain, PCR, gamma-breakeven moves, required win rate and expected-move shortcut.
- Checked these concepts: European vs American exercise; NSE index options cash-settled; NSE stock F&O physically settled; auto-exercise; STT on exercise; expiry-day rules; SEBI measures from Nov 2024; calendar, diagonal and ratio mechanics; IV crush; the India VIX definition.
- Checked that every internal `[[link:]]` target and every widget name exists.
- Sources consulted for the time-sensitive facts:
  - SEBI 1 Oct 2024 circular measures and effective dates, via the Zerodha Z-Connect summary "SEBI's new rules for index derivatives".
  - NSE index-futures tick-size bands from 15 Apr 2025, via an Upstox community summary of the NSE circular.
  - Physical-settlement STT history, via the Zerodha Z-Connect article "Physical delivery of stock F&O and their risks".

About 230 numeric figures were checked in total.

## Findings

| Item | Issue | Severity | Action taken |
|---|---|---|---|
| l3-greeks, When it fails (expiry-day short straddle at 25,220, 14:00) | Call "≈ ₹225, put ₹2" is not achievable with about 90 minutes left. Black–Scholes gives about ₹220 and ₹0.00. The loss was given as ₹29,640 and should be about ₹28,275. Position delta was given as "−170 units" but is about −195 (all 3 lots fully ITM). | error | Corrected the prices, the loss and the delta. |
| l3-time-spreads, When it fails (ratio on budget day) | "Lost about 47 times its credit" is wrong. ₹64,155 ÷ (₹21 × 195 units = ₹4,095) is about 15.7×. | error | Changed to "about 16 times (₹64,155 against ₹4,095 received)". |
| l3-time-spreads, The maths (calendar breakevens) | Breakevens were stated as 24,725 / 25,395. A numerical Black–Scholes solve gives 24,727 / 25,381. | error (minor) | Changed to ≈ 24,730 / 25,380 and stated the method. |
| l3-pricing, Sensitivity checks | IV 13 to 16% was given as "+₹42/unit, ₹2,730 per lot". The engine gives +₹41.3 per unit, ₹2,686 per lot. | error (minor) | Changed to +₹41, about ₹2,690. |
| L3-M2-q08 (AAPL expected move) | The correct option was "$14.60" but the explanation computes $14.77. The answer key worked, but the keyed value did not match the calculation. | error | Changed the option to $14.80 and explained the $51.50 distractor (missing √T). |
| l3-spreads, When it fails (bull put through a gap) | The loss at the open was given as the full width (₹29,835). With 6 days left, Black–Scholes values the spread at about ₹124, not ₹200. The full-width loss is reached only if Nifty is still below 24,600 at expiry. | misleading | Added the open mark-to-market loss (≈ ₹15,015) and kept ₹29,835 as the loss at expiry. |
| l3-basis, When it fails (basis squeeze) | The narrative mixed up the futures MTM debit with the basis P&L and with the "broker charges extra MTM" wording. The basis widened by only about 30 points net. | misleading | Rewrote it with the correct split: an 80-point futures debit (₹5,200 cash), about 50 points of unrealised ETF gain, and a net basis loss of about ₹1,950. |
| l3-options-basics, When it fails (24,600 PE to ₹410) | The IV jump behind the ₹410 price was not stated. ₹410 needs IV of about 20% with 6 days left. | shallow | Stated the IV jump (13% to about 20%) and the time left. |
| l3-pricing, Advanced view (Black-76) | "use forward in place of spot with r = 0 discounting adjustments" is garbled. The module also never says that its Nifty prices assume q = 0, while l3-basis uses q = 1.2%. | error (concept) / missing | Gave the correct Black-76 formula and discounting. Added a note that the module uses spot with q = 0 (with q = 1.2% the 7-day ATM call is ≈ ₹192, not ₹195). |
| l3-pricing, American options | "American puts are worth slightly more" was stated as always true. | misleading (minor) | Corrected: an American put is worth at least as much as the European put, usually slightly more, and early exercise of a call on a non-dividend stock is never optimal. |
| l3-options-basics, Intermediate view | Auto-exercise at NSE expiry was missing, and so was the "do not exercise" option for close-to-money stock options. | missing | Added an "Exercise at expiry in India" subsection with a verify note. |
| l3-options-basics, Advanced view and l3-expiry, Stock option delivery | The text said share delivery from a stock option attracts "delivery STT 0.1%". That is not in the CONTENT-SPEC verified fact list, and the treatment has changed in past budgets. | reference / time-sensitive | Labelled it as the rate brokers commonly apply, to be verified on the contract note or NSE. I did not assert it as fact. |
| l3-options-basics, positions table | "Premium only" margin for long options. | shallow | Clarified: premium paid upfront, no margin. This matches SEBI's upfront-premium measure. |
| l3-chain India, l3-vol-strategies India, l3-expiry Intermediate | The SEBI Nov 2024 measures were described vaguely ("late 2024", "extra margin"). | shallow / time-sensitive | Gave the specific sourced measures and dates: contract size and one weekly-expiry index (20 Nov 2024), 2% expiry-day ELM on short index options (20 Nov 2024), upfront premium, no calendar-spread benefit on expiry day (10 Feb 2025), intraday position-limit monitoring (Apr 2025). Each carries "as of Nov 2026 — verify on SEBI/NSE". |
| l3-time-spreads, India | Said that "some brokers remove the hedge benefit in expiry week". The exchange-level rule (no calendar-spread benefit on the expiry day of the expiring leg, from 10 Feb 2025) was missing. | missing | Added the rule with a verify note. |
| l3-expiry, India / Intermediate | Auto-exercise of ITM options was not stated. | missing | Added an auto-exercise bullet with a verify note. |
| l3-expiry, forgotten stock option | "Short delivery penalty" applies to failing to deliver shares (a long put or short call). It does not apply to failing to pay for a long call. | error (concept) | Reworded: the option is auto-exercised, and a funding shortfall leads to interest or penalties and possible sale of the shares. |
| l3-iv, Advanced view (India VIX) | The definition was too thin: "near and next-month" options, with no mention of OTM strikes, variance or annualisation. The treatment of weekly contracts was not stated. | shallow / time-sensitive | Expanded the definition (OTM option prices from two expiries, variance interpolated to 30 calendar days, annualised %). Added a note to verify the current expiry selection in NSE's methodology. |
| l3-iv, India | "Single-digit to low-teens" readings in calm periods. India VIX single-digit readings are rare and I could not confirm them. | unsupported | Softened to "around 10 to the low teens". |
| l3-futures-basics, spec table | Tick sizes (₹0.10 / ₹0.20) were stated without the band rule that produces them. | time-sensitive | Added the NSE Apr 2025 index-level tick bands with a verify note. The table values are consistent with the bands at the current index levels. |
| l3-futures-basics, Beginner view | "A 1% move is about an 8% move on a typical margin deposit" presented the margin level as typical. | unsupported (minor) | Tied it to the illustrative ₹2 lakh margin. |
| l3-futures-basics, Intermediate view | "Typically 10–15% of notional". | unsupported (minor) | Labelled it as illustrative, with a pointer to verify on NSE Clearing. |
| l3-futures-basics, India (F&O ban) | MWPL was not named, and the post-2024 change to how open interest is measured for the ban was not mentioned. | time-sensitive | Named MWPL and added a verify note. I did not state the new method, because I have not verified it. |
| l3-futures-risk, Beginner warn | SEBI study claim. | reference | Kept it (the year and scope are correct) and attributed it explicitly to SEBI. |
| l3-futures-risk, Advanced view | "3% gap has happened around budget days" was not verified. | unsupported (minor) | Narrowed to election results and global shocks. |
| l3-vol-strategies, Iron fly ≡ butterfly | "Offset by the width" was ambiguous. | shallow | Gave the numeric parity check: credit ≈ width − fly debit, 165 vs 164. |
| l3-options-basics, Beginner analogy | "Refundable-only-by-luck booking fee" was confusing. | shallow | Changed to "non-refundable booking fee". |
| L3-M2-q14 | "r ≈ 0" contradicts the module's r = 6.5%. The forward 25,031 is consistent with r = 6.5% and q = 0. | misleading (minor) | Reworded: parity uses PV(F − K), and discounting is negligible over 7 days. |

### Checked and correct (no change)
- All base Black–Scholes prices (Nifty 7d CE 24,800/25,000/25,200/25,400 and PE 24,600/24,800/25,000; 35d, 28d, 6d, 2d, 1d, 0.3d; Bank Nifty 56,000/56,500; AAPL; SPY 7/30/35/37d) match the engine to rounding. All Greek tables match, including Bank Nifty delta 0.55, gamma 0.000197, theta −24.3, vega 53.2, and SPY gamma and theta for 7d vs 35d.
- The step-by-step d1/d2/N(d) worked example: d1 0.0782, d2 0.0602, N 0.5312/0.5240, C ₹195, P ₹164.
- All vertical, straddle, strangle, condor, butterfly, iron-fly and ratio max gain / max loss / breakevens. These were confirmed with `IA.opt.analyse`.
- All calendar table values: back leg ₹166/275/424/612/834 and the per-lot P&L. Diagonal and SPY calendar/ratio figures are within ₹30 / $1 rounding.
- Futures notional, MTM table, leverage, statutory cost (≈ ₹925, about 14 points), fair value 25,109 / 25,237, roll ₹16,640 / ₹24,960, beta hedges, gap stresses, MES hedge.
- HV example (12.6%), VIX conversions, gamma breakevens (185, 170 and 490 points), max pain 25,000, PCR 0.94, required win rate 76.5%, theta decay 62%.
- Expiry delta jump 0.30 to 0.63 (+80 points, 0.3 day), gamma 0.0043, 5-lot straddle delta swing about 140 units, AAPL early-exercise time value about $0.07, AAPL gap put about $15.
- All 42 bank questions and 33 check questions: arithmetic and answer keys correct apart from q08 and q14 above. The correct-index positions are varied.
- Concepts that are correct: NSE index options European and cash-settled; NSE stock F&O physically settled; US equity/ETF options American and physically settled; SPX European and cash-settled; OCC $0.01 exercise-by-exception; STT 0.15% on sold premium and on intrinsic value at exercise, paid by the buyer; Nifty weekly Tuesday and Bank Nifty monthly (both with verify notes); calendar = short gamma / long vega / positive theta near the strike; the ratio's unlimited tail; IV crush mechanics; NSE futures daily settlement price based on the last half-hour VWAP.
- References are real works and official sources: Hull, Natenberg, Sinclair, McMillan, Black & Scholes (JPE 1973), NSE, NSE Clearing, SEBI 2024 study and Oct 2024 circular, CME, Cboe, OCC, OIC.

## Counts
- Items checked: 12 lessons, 33 inline checks, 42 bank questions, about 230 numeric figures.
- Errors fixed: 9 (5 numeric in lesson text, 1 answer-key value, 3 conceptual: Black-76 wording, short-delivery penalty, basis-squeeze arithmetic).
- Claims softened or labelled: 7 (margin %, "typical" margin, VIX single digits, budget-day gaps, delivery STT, SEBI study attribution, q14 premise).
- Additions made: 8 (auto-exercise ×2, SEBI measures with dates ×3, calendar-spread expiry-day rule, India VIX method, Black-76 formula and q = 0 note, plus smaller clarifications).
- References removed or corrected: 0 removed; SEBI circular references now carry the specific date (1 Oct 2024).
- Validation: `node tests/validate-content.js js/content/lessons-l3a.js` gives 0 errors and 0 warnings. `tests/engines.test.js` gives 121/121 passing (engine not modified).

## Remaining concerns
1. **Engine sampling artefact, reported and not edited.** `IA.opt.analyse` reports the long call butterfly's max gain as ₹10,621 instead of ₹10,725. The 4,000-step grid from 0 to 2 × the highest strike does not land exactly on the 25,000 body strike. Lesson text is correct (₹10,725). The payoff widget may display the lower figure. Suggested engine fix: evaluate the payoff at each strike as well as on the grid.
2. **STT on physically settled stock options/futures.** The STT basis on the resulting share delivery is not in the verified fact list. The content now says to verify on the contract note. A future content pass should confirm it from the Finance Act or an NSE circular.
3. **F&O ban open-interest measure.** SEBI changed how OI is measured for MWPL and the ban (future-equivalent/delta-based OI) after 2024. I did not verify the details or the effective date, so I added only a verify note.
4. **India VIX expiry selection after weekly-contract changes.** NSE's current methodology document should be checked to confirm which expiries it uses.
5. **Minor unstated IV assumption.** In l3-chain's "trading the wall" example, the call at ₹285 (Nifty 25,280, 5 days) needs IV of about 14%. At an unchanged 13% it would be about ₹275. I left this as within illustrative tolerance.
6. Expiry weekdays, lot sizes and margin percentages remain time-sensitive. They carry "verify on NSE" notes as required.

## Statement
This is an AI-assisted review against the project's audit brief. It is not an independent expert review, legal or tax opinion, or regulatory certification. Time-sensitive regulatory facts should be verified on SEBI, NSE, NSE Clearing, the Income Tax Department, OCC and CME before they are relied on.
