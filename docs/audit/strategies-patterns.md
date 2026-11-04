# Audit: strategies.js (30 strategies) and patterns.js (22 patterns)

Date: 4 Nov 2026. Auditor: AI-assisted review following docs/AUDIT-SPEC.md and docs/CONTENT-SPEC.md.

## Scope and method

- **Strategies.** I read all 30 entries in full. I recomputed every worked trade in node: 56 single-exit trades, 2 partial-booking trades and 2 options trades. For each one I checked points at risk, rupee risk, R multiples, target prices (1R/2R/2.5R), gross P&L and net P&L, with charges from `IA.risk.indiaCharges` using `IA.specsDefault.india` (futures, eqIntraday and options segments). Lot sizes are Nifty 65 and Bank Nifty 30. I also checked each example against its own strategy's stop and target rules, and checked each btConfig against the SIGNALS catalogue and run() defaults in js/engines/backtest.js. Then I searched for frequency or profitability language.
- **Patterns.** I loaded all 22 entries in node and measured the pattern bars with a script. Checks per pattern:
  - body/range for doji
  - wick/body ratios for hammer family and stars
  - total wick share for marubozu
  - nose/range for pin bar
  - body containment for engulfing and harami
  - midpoint rules for piercing and dark cloud
  - high/low equality for tweezers
  - range containment for inside and outside bars
  - star body gap and third-bar midpoint for morning and evening star
  - open-within-prior-body and progressive closes for soldiers and crows
  - prior trend direction
  - open-to-previous-close joins

  I also read confirmation, stop and target text for internal consistency and checked that evidence labels match the text.
- Validator: `node tests/validate-content.js js/content/strategies.js js/content/patterns.js` gives 0 errors and 0 warnings. Engine tests: 121/121 pass. No engines, modules or tests were edited.

## Findings

| Item | Issue | Severity | Action taken |
|---|---|---|---|
| RSI strategies, win | Gross stated ₹2,200; 400 × ₹5.40 = ₹2,160. Net ₹1,950 vs engine ₹1,872 | error | Corrected to ₹2,160 gross, net about ₹1,870 |
| MACD, lose | Charges "about ₹250"; engine gives ₹339 | error | Corrected to about ₹340 |
| VWAP trading, stop rule | "1.2 × ATR beyond VWAP … whichever is further" puts the stop (₹1,473.88) outside the 1.5 × ATR cap; the rule contradicts itself and the example | error | Rewrote the rule (candle low or 1.2 × ATR from entry, whichever is further, capped at 1.5 × ATR) and showed the check in the example |
| VWAP trading, win | Net ₹1,250 vs engine ₹1,221 | error (minor) | ₹1,220 plus verify note |
| VWAP trading, btConfig | Text says volume above average; config used k 1.2 | misleading | Config set to k 1; backtest text lists the parts that are not modelled |
| PDH breakout, win | Stop 25,938 is only 10 points below PDH 25,948, but the strategy's own rule needs at least 0.1% (about 26 points) | error | Stop 25,922 (41 pts, ₹2,665), target 26,045, gross ₹5,330, net about ₹4,330 |
| PDL breakdown, lose | Stop 25,628 is under 0.1% above PDL 25,612 | error | Stop 25,638 (36 pts, ₹2,340) |
| Failed breakout, win | Stop "≈26,000" doesn't match the rule (high + 1 tick + 2 ticks = 25,998.15); 2.5R mislabelled | error | 32.15 pts, ₹2,090, 2.7R |
| Failed breakout, lose | Stop ₹1,358.40 vs rule ₹1,358.35 | error (minor) | ₹3.05, ₹2,135 |
| Liquidity sweep, win/lose | Stops not "two ticks beyond the sweep extreme" (26,073 vs 26,071.10; 56,350 vs 56,354.90) | error | Corrected risk, R and rupee figures |
| Gap-down, win | Stop rule had no tie-break; example used 1.5 × ATR but called it the opening-range high | error | Rule says "whichever is closer"; example explains the choice |
| Futures trend, sizing | ₹5 lakh capital: one Nifty lot (₹16.8 lakh) breaks the strategy's own 3 × capital exposure cap | error | Example now uses ₹6 lakh, shows 2 lots by risk capped to 1 by exposure, and notes ₹5 lakh fails the cap; losing example updated (1.5% risk, 5.7× notional) |
| Volume breakout, win | ATR ₹6.80 makes the ₹7 consolidation fail setup rule 1 (range under 1 × ATR); "measured move or 2R, whichever first" contradicted using 2R | error | ATR ₹7.40; target rule is now 2R with the measured move logged as a reference; net ₹3,520 |
| Range-bound, win | Short trade at 1.4R breaks the stated minimum 1:1.5 | error | Rule now skips trades under 1.2R and the range text says 1:1.2–1:3 (example kept to show the test) |
| Market structure, target | "Measured move … or 2R" was ambiguous, and the example picked 2R | misleading | Rule says 2R or the measured move if further; net corrected ₹2,450 → ₹2,550 |
| Scalping, win | The 18-pt target fails the strategy's own rule (target must exceed costs (about 15 pts) plus the 12-pt stop) | misleading | Example now says the trade should have been skipped under the written rules |
| Momentum / Sector RS / Gap-up, nets | Nets understated by ₹290–₹370 against the engine | error (minor) | ₹6,070, ₹7,790, ₹9,630; R on full position added |
| Breakout retest, lose | 59-pt stop is above the 1.2 × ATR cap at typical ATR | misleading | States ATR 50 so the cap holds |
| VWAP pullback, win | 2.5R = 57,582.50, not 57,582 | error (minor) | Corrected |
| Options momentum, win | Underlying 2R not shown | shallow | Added underlying stop 25,943 and 2R 26,060 |
| Options momentum, lose | "Stalls for an hour" vs 45-minute time stop | error | 45 minutes |
| Trend following, crude | MCX trade held to 21:30 against a "15:15 IST close-out" rule; MCX charges differ from NSE | error / missing | Exit rule now separates NSE and MCX; note that CTT/MCX fees are not in the India calculator |
| Futures trend, logic | "Low STT" claim had no number | shallow | Added about ₹1,000 on ₹16.8 lakh (about 6 bps) with an as-of/verify note |
| MA crossover | Said the backtester's last-bars rule "mirrors" the 14:30 cut-off; the engine only blocks the last 3 bars | error | Corrected |
| btConfig gaps (ORB, MA crossover, Supertrend, RSI, Bollinger, Momentum, Mean reversion, Range-bound) | Backtest text didn't say where the config differs from the written rule (stop type, missing ADX<20 filters, fixed targets vs VWAP/band targets, RSI 50 vs 60, short side only) | misleading | Added one sentence per strategy naming the differences |
| Range-bound, backtest | Told users to group by regime label in the trade list; the trade list has no regime field | error | Points to the Quant Lab Regime matrix tab |
| Frequency claims (ORB, EMA pullback, VWAP pullback, RSI, retest, failed breakout, trend following, mean reversion, range, S/R, PDL) | Phrases like "is normal", "most common", "happens often", "works poorly", "more likely" stated without evidence; "large buyers defend PDL" and "DII buying is common" read as facts | claim | Softened to hypotheses, characteristic losses or journal-measurable questions |
| EMA pullback, rr | "Many trend days give 3R or more" implies frequency | claim | Reworded with no frequency implied |
| Piercing line, bars | First red bar opened 0.2 above the prior close (a gap up inside a decline) | misleading (minor) | Open set to the prior close, 97.8; pattern still valid (close 97.6 > mid 97.3 < open 97.8) |
| Dark cloud / Bearish harami, bars | The first pattern bar opened 1.0 below the context close (the context leg ended at 103.4 while the bar opens at 102.4) | misleading | Context changed to U.slice(0, 6), as evening star already does; joins are now 0.2–0.3 |
| Bullish harami, bars | First bar opened 0.4 above the prior close | misleading (minor) | Open 97.8; body still contains the harami body |
| Outside bar, bars | Bar opened 0.5 above the prior close | misleading (minor) | Open 102.2; still outside, close in bottom 9% of range |
| Pin bar | No numeric definition; the brief needs nose ≥ 2/3 of range. The bar's nose is 0.696 of the range | shallow | Added the numeric definition (nose ≥ 2/3, body in opposite third, nose beyond prior extreme) |
| Piercing, dark cloud, harami (both), morning/evening star targets | The first target (first candle's open/base) is often under 1R from a breakout entry with the stated stop, which the text didn't mention | misleading | Added a reward-to-risk check: partial-profit point or skip |
| Inside bar | Confirmation (close beyond the mother bar) conflicts with entry (stop beyond the inside bar) | misleading | Text now says to choose one in advance and log it |
| Hanging man | Reliance ₹2,948 is a pre-bonus price level | misleading | ₹1,474 / ₹1,481 |
| Hammer, shooting star, both engulfings, morning star | Labelled `mixed` with no evidence callout explaining the label | missing | Added `[!evidence]` callouts (results vary by market/period/costs; often weak after costs) |
| Bullish engulfing context | "Tend to deserve more attention" stated as fact | claim | Labelled as a practitioner view to check in the journal |

All other pattern geometry passed the script checks. Measured values:

| Pattern | Measured values |
|---|---|
| Doji | body 1.2% of range |
| Hammer / hanging man | lower wick 5.7× / 9× body |
| Inverted hammer / shooting star | upper wick 5.3× / 6.7× body |
| Marubozu (both) | wicks 3.8% of range; range 2.3× context average |
| Engulfing (both) | bodies fully engulf |
| Harami (both) | second body inside first body |
| Tweezers | extremes differ by 0.02 |
| Morning star | star body gaps below first close; third closes above midpoint |
| Evening star | star body gaps above first close; third closes below midpoint |
| Soldiers / crows | each opens within the prior body and closes beyond the prior close; bodies 1.7–1.9× context average |
| Inside bar | contained |
| Outside bar | engulfs the prior range |

All 30 strategy evidence labels (mixed, subjective or speculative) and all 22 pattern labels are consistent with their text. No strategy states a win rate, success rate or profitability figure. No references are listed in either file, so I removed or corrected none.

## Counts

- Items checked: 30 strategies (60 worked trades, 25 btConfigs plus 5 null configs) and 22 patterns (22 bar sets, 180+ geometric checks).
- Errors fixed: 27 (19 numeric or rule-consistency errors in strategies, 8 strategy text/config errors including the MA-crossover engine claim, range-bound regime instruction, crude exit, options time stop and VWAP config).
- Claims softened: 15 (12 strategies, 1 pattern, plus 2 institutional-flow narratives).
- Additions made: 25 (8 btConfig-difference notes, the futures cost figure, the MCX charges note, the options underlying 2R, the pin-bar numeric definition, 6 pattern R:R notes, the inside-bar trigger note, 6 evidence callouts, the scalping skip note).
- Pattern bar arrays changed: 5 (piercing, dark cloud, bullish harami, bearish harami, outside bar).
- References removed or corrected: 0 (none present).

## Remaining concerns

- Many strategies use a rule with a condition the catalogue cannot express: low ADX, Donchian, flags, consolidation, 50 EMA, time windows. The text now says so, but those configs remain loose proxies. A `adx_below` or `time_window` signal would close several gaps; that is an engine change, which I did not make.
- The backtester's position sizing ignores the 3 × exposure cap and margin. Futures-trend users testing with lot 65 on small capital may see trades the written rule forbids.
- Net figures assume the specs' discount-broker brokerage (₹20 or 0.03% per leg). Readers on other plans will see different nets; each example says "about" and most link the charges widget.
- MCX crude charges (CTT, MCX fees) are not modelled anywhere in the app, so the trend-following crude example's net is not given.
- In patterns.js, the hammer, inverted hammer and hanging man pattern bars open 0.2 away from the prior close. That is acceptable intraday drift, but they are not exact joins.
- Example stock prices (Infosys, ITC, SBI, Hindalco and so on) are illustrative and not checked against Nov 2026 market levels. None is presented as a real historical trade.

## Statement

This is an AI-assisted review. It is not an independent expert review or a regulatory certification. Figures were recomputed against the app's own engines and the verified facts in CONTENT-SPEC.md. Regulatory and charge figures should still be checked on NSE, SEBI and broker sources before use.
