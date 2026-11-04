/* Indicator reference library. Formulas match js/engines/indicators.js (IA.ind). See docs/CONTENT-SPEC.md. */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  IA.content.indicators = [
  {
    id: 'sma', name: 'Simple Moving Average (SMA)', category: 'trend', engine: 'sma', params: 'n=20 (no engine default; 20 and 50 are common)', chart: 'sma20', evidence: 'mixed',
    definition: `The SMA is the plain arithmetic mean of the last **n** closes, recalculated on every bar. Each of the n prices carries equal weight and the oldest price drops out completely when a new bar arrives.`,
    purpose: `It smooths noise so you can see the direction of the average price over a window. Traders use it as a trend filter (price above or below), as a dynamic reference level, and as the middle line of Bollinger Bands.`,
    formula: `:::formula
SMA(t) = ( C(t) + C(t-1) + ... + C(t-n+1) ) / n
:::
The engine returns null for the first n-1 bars (warm-up). The lag of an SMA is roughly (n-1)/2 bars: a 20-bar SMA describes where price was centred about 9.5 bars ago.`,
    calc: `Five Nifty 5-minute closes: 22,410, 22,450, 22,430, 22,480, 22,500. With {{n = 5}}:

- Sum = 112,270, so SMA = 112,270 / 5 = **22,454**.
- Next close is 22,560. Drop 22,410, add 22,560. New sum = 112,420, SMA = **22,484**.

Notice the SMA moved 30 points while price jumped 60. That gap is lag, and it also means the SMA can jump when an *old* extreme bar drops out, even if today's bar is quiet (the drop-off effect).`,
    interpretation: `A rising SMA with price above it describes an uptrend that has persisted for at least the window length. A flat SMA with price crossing back and forth describes a range, where the SMA carries little information. The slope matters more than the crossing.`,
    bullish: `Price closes above a rising SMA; a faster SMA crosses above a slower one (for example 20 over 50); price pulls back to a rising SMA and holds with a higher low.`,
    bearish: `Price closes below a falling SMA; a fast SMA crosses below a slow one; rallies stall at a declining SMA.`,
    example: `On a Nifty 5-minute chart, a 20-SMA sloping up through the morning often acts as a reference where pullbacks pause. In the afternoon, when the index goes sideways, price crosses the same line six or seven times and every cross is noise.
[[chart:NIFTY:11:sma20,sma50]]
On SPY 5-minute the behaviour is the same; the US open is simply a different clock time.`,
    entryExit: `- Filter, not trigger: take long setups only when price is above a rising 20-SMA, shorts only below a falling one.
- Pullback entry: buy a bullish reversal candle near a rising SMA, stop below the swing low, not below the line itself.
- Exit when price closes on the other side and the slope flattens, or use the SMA as a trailing reference on a higher timeframe.`,
    bestConditions: `Persistent, directional sessions (trend days, post-news drift). Liquid instruments where single bars do not distort the average.`,
    weaknesses: `> [!warn] Lag is built in. Crossovers fire after a good part of the move is gone, and in ranges they produce a sequence of small losses (whipsaws).

The drop-off effect can move the line for reasons unrelated to current price. Parameter choice is arbitrary: 20 vs 21 vs 25 changes signals bar by bar, and optimising n on past data is a classic route to curve fitting.

> [!evidence] Mixed. The arithmetic is established. Academic tests of moving-average rules (for example Brock, Lakonishok and LeBaron, 1992) found effects in old index data, while later work on data-snooping (Sullivan, Timmermann and White, 1999) and transaction costs weakened the case. No moving average has a guaranteed edge.`,
    mistakes: `- Treating every cross as a signal in a flat market.
- Stacking SMA, EMA and WMA of similar length; they are redundant and agree with each other by construction.
- Placing stops exactly on the line, where many others place theirs.`,
    timeframes: `Intraday: 9 to 50 bars on 3 to 15-minute charts. Daily 50 and 200 SMAs are widely watched as context for the stock you trade intraday.`,
    combinations: `Pairs well with a non-trend tool: ATR for stop distance, volume for confirmation, ADX to decide whether trend signals deserve attention. Redundant with EMA/WMA of similar length and with the Bollinger middle band (which *is* a 20-SMA).`,
    practice: `1. In the Chart Lab, load NIFTY seed 11 with sma20 and sma50. Mark every 20/50 cross and note how many points price had already moved before the cross.
2. Reload with another seed and count crosses in the flattest stretch. Write the count in your journal: that is your whipsaw cost.
3. Compute a 5-bar SMA by hand for six bars and compare with the chart value to check you understand the drop-off effect.`,
    refs: ['John J. Murphy — Technical Analysis of the Financial Markets (book)', 'Perry J. Kaufman — Trading Systems and Methods (book)', 'Brock, Lakonishok, LeBaron — Simple Technical Trading Rules and the Stochastic Properties of Stock Returns, Journal of Finance (1992)', 'Sullivan, Timmermann, White — Data-Snooping, Technical Trading Rule Performance, and the Bootstrap, Journal of Finance (1999)'],
  },
  {
    id: 'ema', name: 'Exponential Moving Average (EMA)', category: 'trend', engine: 'ema', params: 'n=9, 20 or 50 (no engine default)', chart: 'ema20', evidence: 'mixed',
    definition: `The EMA is a moving average that gives the newest price the most weight, with weights decaying geometrically into the past. It never fully forgets old data, but old data fades quickly.`,
    purpose: `To track price with less lag than an SMA of the same length. Intraday traders use the 9 and 20 EMA as trend guides and pullback references; the EMA is also the building block of MACD and Keltner Channels.`,
    formula: `:::formula
k = 2 / (n + 1)
EMA(t) = k x C(t) + (1 - k) x EMA(t-1)
:::
The engine seeds the first value with the SMA of the first n closes (the common charting convention), so the first n-1 bars are null. Different seeding methods make early values differ between platforms; they converge after a few multiples of n.`,
    calc: `Use the same Nifty closes as the SMA example: 22,410, 22,450, 22,430, 22,480, 22,500, then 22,560. With {{n = 5}}, k = 2/6 = 0.3333.

- Seed (bar 5) = SMA = 22,454.
- Bar 6: 0.3333 x 22,560 + 0.6667 x 22,454 = 7,520 + 14,969.3 = **22,489.3**.

The 5-SMA on bar 6 was 22,484, so the EMA is 5.3 points closer to price. That is the whole difference: slightly faster, slightly noisier.`,
    interpretation: `Same as the SMA but more responsive. A 9-EMA hugging price on a trending 5-minute chart describes momentum; price stretched far from it describes an extended move that often pauses. Watch the slope and the distance, not just which side price is on.`,
    bullish: `Price above a rising 20-EMA; 9-EMA crossing above 20-EMA; shallow pullbacks that hold the 9 or 20-EMA in a strong session.`,
    bearish: `Price below a falling 20-EMA; 9 below 20; bounces failing at the EMA.`,
    example: `Bank Nifty on a strong trend morning often pulls back to the 20-EMA on the 5-minute chart two or three times before the trend tires. On a choppy expiry-week afternoon the same EMA is crossed repeatedly.
[[chart:BANKNIFTY:23:ema9,ema20,vwap]]
NVDA on a news day behaves similarly in the first US hour.`,
    entryExit: `- Pullback long: price above a rising 20-EMA, pulls back to it, prints a higher low and a bullish close; enter above that bar's high, stop below the pullback low.
- Trend exit: close below the 9-EMA (tight) or 20-EMA (loose). Decide which before entering.
- Avoid entries when price is more than about 1.5 to 2 ATR away from the 20-EMA; risk to a sensible stop becomes large.`,
    bestConditions: `Trending sessions with steady participation. Liquid index futures and large-cap stocks.`,
    weaknesses: `> [!warn] Faster than an SMA, but still lagging. The speed you gain is paid for with more false crosses in ranges.

Small parameter changes (8 vs 9 vs 10) shift crosses by a bar or two; claims that a particular number is special have no evidence. Seed differences mean your app value may not match a broker terminal for the first bars of a series.

> [!evidence] Mixed, for the same reasons as the SMA: the maths is exact, the predictive value of crossovers is weak and depends on regime and costs.`,
    mistakes: `- Believing the EMA "predicts"; it only summarises past prices.
- Using 9/20 EMA cross as a stand-alone system in a sideways market.
- Mixing EMA, SMA and WMA of the same length and treating agreement as confirmation.`,
    timeframes: `9 and 20-EMA on 1 to 15-minute charts for intraday; 50-EMA on 15-minute or hourly for context. Daily 20/50 EMA for the bigger picture of a stock.`,
    combinations: `VWAP (price above both VWAP and a rising 20-EMA is a common long filter), ATR for stops, ADX to judge trend strength. Redundant with SMA/WMA/VWMA of similar length and with Keltner middle line (a 20-EMA).`,
    practice: `1. Load BANKNIFTY seed 23 with ema9 and ema20. Step bar by bar and mark each pullback to the 20-EMA; record which held and which failed.
2. Compare ema20 and sma20 on the same chart; measure, on five turns, how many bars earlier the EMA turned.
3. Hand-compute three EMA steps with k = 2/(n+1) and check them against the plotted line.`,
    refs: ['John J. Murphy — Technical Analysis of the Financial Markets (book)', 'Perry J. Kaufman — Trading Systems and Methods (book)', 'Robert W. Colby — The Encyclopedia of Technical Market Indicators (book)'],
  },
  {
    id: 'wma', name: 'Weighted Moving Average (WMA)', category: 'trend', engine: 'wma', params: 'n=20 (no engine default)', chart: null, evidence: 'mixed',
    definition: `A WMA is a linearly weighted average: the newest close gets weight n, the one before n-1, down to weight 1 for the oldest in the window. Unlike the EMA, data outside the window has zero weight.`,
    purpose: `To cut lag relative to an SMA while keeping a fixed window. It is also a building block of the Hull Moving Average and some smoothing schemes.`,
    formula: `:::formula
WMA(t) = [ n x C(t) + (n-1) x C(t-1) + ... + 1 x C(t-n+1) ] / [ n(n+1)/2 ]
:::
The denominator is the sum of the weights. Warm-up is n-1 bars.`,
    calc: `Nifty closes (oldest to newest): 22,450, 22,430, 22,480, 22,500, 22,560. {{n = 5}}, weights 1 to 5, denominator 15.

| Close | Weight | Product |
|---|---|---|
| 22,450 | 1 | 22,450 |
| 22,430 | 2 | 44,860 |
| 22,480 | 3 | 67,440 |
| 22,500 | 4 | 90,000 |
| 22,560 | 5 | 112,800 |

Sum = 337,550, WMA = 337,550 / 15 = **22,503.3**. On the same bar the 5-SMA was 22,484 and the 5-EMA 22,489.3. The WMA is the most responsive of the three here.`,
    interpretation: `Read it exactly like an SMA or EMA: slope gives direction, price relative to the line gives position. Because it responds faster, it turns earlier at real reversals and also at false ones.`,
    bullish: `Price above a rising WMA; a short WMA crossing above a longer one.`,
    bearish: `Price below a falling WMA; short WMA crossing below a longer one.`,
    example: `On a Reliance 15-minute chart, a 20-WMA turns up a bar or so before the 20-SMA after a morning low. In a sideways Reliance session it flips direction more often than the SMA. The Chart Lab has no WMA button, so compare it by computing values from the crosshair readout or by comparing against ema20 and sma20 visually.`,
    entryExit: `- Use as a trailing reference in strong trends: exit on a close beyond the WMA.
- As a filter for pullback entries, as with the EMA.
- Never as a stand-alone entry trigger in ranges.`,
    bestConditions: `Fast, clean trends where reducing lag by a bar matters, such as opening drive sessions.`,
    weaknesses: `> [!warn] The WMA is not a different signal source. It is the same past prices weighted differently, so it inherits every limitation of moving averages: lag in reversals and whipsaw in ranges.

Its abrupt cut-off at the window edge can cause small jumps as bars leave. Few traders use it, so it has no "self-fulfilling" crowd effect, if that matters to you.

> [!evidence] Mixed. No published evidence favours WMA over EMA or SMA in a robust way.`,
    mistakes: `- Switching from SMA to EMA to WMA after each losing trade in search of the "right" average. This is optimisation by hindsight.
- Assuming lower lag means better. Lower lag means more signals, including more false ones.`,
    timeframes: `Same as other moving averages: 9 to 50 bars intraday, longer on daily charts.`,
    combinations: `Redundant with SMA, EMA and VWMA of similar length; pick one. Combine with a volatility measure (ATR) and a participation measure (volume, VWAP) instead.`,
    practice: `1. Using the table method above, compute a 5-WMA, 5-EMA and 5-SMA for the last six bars of any Chart Lab series and rank them by distance from the latest close.
2. In the Chart Lab, overlay ema20 and sma20; predict where a 20-WMA would sit (closer to price than the EMA in a steady trend) and verify with your own calculation for one bar.
3. Journal a rule you would use it for, and the condition under which you would ignore it.`,
    refs: ['Perry J. Kaufman — Trading Systems and Methods (book)', 'Robert W. Colby — The Encyclopedia of Technical Market Indicators (book)'],
  },
  {
    id: 'vwma', name: 'Volume-Weighted Moving Average (VWMA)', category: 'trend', engine: 'vwma', params: 'n=20 (no engine default)', chart: null, evidence: 'mixed',
    definition: `The VWMA averages the last n closes, weighting each by that bar's volume. Bars with heavy trading pull the average towards their close; quiet bars barely count.`,
    purpose: `To show where the bulk of recent trading took place, as a rolling window. Comparing VWMA with an SMA of the same length tells you whether volume has been heavier on up or down closes.`,
    formula: `:::formula
VWMA(t) = Sum[ C(i) x V(i) ] / Sum[ V(i) ]   over the last n bars
:::
The engine uses the close (not typical price) and returns null if total volume in the window is zero. It differs from VWAP in two ways: it uses a rolling window instead of a session-cumulative sum, and it uses the close instead of (H+L+C)/3.`,
    calc: `Three Reliance 15-minute bars, {{n = 3}}: closes ₹1,450, ₹1,460, ₹1,500; volumes 1, 1 and 3 lakh shares.

- Sum of C x V = 1,450 + 1,460 + 4,500 = 7,410
- Sum of V = 5
- VWMA = 7,410 / 5 = **₹1,482**

The 3-SMA would be ₹1,470. The VWMA is ₹12 higher because the heavy-volume bar closed highest. VWMA above SMA suggests volume concentrated on higher closes.`,
    interpretation: `VWMA above an equal-length SMA: the higher closes carried more volume, which some read as accumulation. VWMA below SMA: heavier volume on the lower closes. The spread is small most of the time; large spreads appear around news bars.`,
    bullish: `Price above a rising VWMA, and VWMA above the SMA of the same length.`,
    bearish: `Price below a falling VWMA, and VWMA below the SMA.`,
    example: `On a Reliance results day, one or two huge-volume 15-minute bars dominate the VWMA for the next n bars. If the big bar closed near its high, the VWMA sits above the SMA and pullbacks into it are watched by some traders. The Chart Lab has no VWMA token; approximate the idea with sma20 plus vol, and check the bar volumes by hand.`,
    entryExit: `- Use as a trend reference like any moving average.
- Treat a VWMA/SMA cross as context about volume distribution, not as an entry trigger.`,
    bestConditions: `Liquid stocks and futures where volume data is reliable. In India, use exchange-traded volume for the stock or future, not the spot index (index "volume" on many charts is synthetic or absent).`,
    weaknesses: `> [!warn] One outlier bar (block deal, opening auction print, expiry roll) can dominate the average for n bars, then disappear abruptly when it leaves the window.

It lags like any moving average. Spot indices like Nifty have no true traded volume, so a VWMA on the spot index is meaningless; use the future.

> [!evidence] Mixed. Volume-weighting is a sensible description of where trading happened; there is no robust evidence that VWMA signals beat plain moving averages after costs.`,
    mistakes: `- Confusing VWMA with VWAP; they answer different questions.
- Computing it on spot index data with no real volume.
- Reading "smart money" into a VWMA/SMA gap. Volume does not say who traded.`,
    timeframes: `5 to 60-minute charts with 10 to 50 bars. On 1-minute charts volume spikes make it jumpy.`,
    combinations: `Redundant with SMA/EMA for direction. Useful beside OBV or Chaikin Money Flow, which also ask whether volume favours up or down moves. VWAP for session context.`,
    practice: `1. In the Chart Lab, load RELIANCE with sma20 and vol. Pick the three highest-volume bars and estimate in which direction a VWMA would differ from the SMA. Then compute a 3-bar VWMA around one of them.
2. Find a bar where a volume spike leaves the 20-bar window and note how the VWMA would jump.
3. Journal: write down one reason you would prefer VWAP over VWMA for an intraday decision.`,
    refs: ['Buff Dormeier — Investing with Volume Analysis (book)', 'Robert W. Colby — The Encyclopedia of Technical Market Indicators (book)'],
  },
  {
    id: 'macd', name: 'MACD (Moving Average Convergence Divergence)', category: 'momentum', engine: 'macd', params: 'fast=12, slow=26, signal=9', chart: 'macd', evidence: 'mixed',
    definition: `MACD is the difference between a fast and a slow EMA of price (the MACD line), plus an EMA of that difference (the signal line) and the gap between the two (the histogram). Although often grouped with trend tools, it measures the momentum of a trend.`,
    purpose: `To show whether short-term price is pulling away from, or converging towards, its longer-term average, and whether that pull is accelerating or fading.`,
    formula: `:::formula
MACD line = EMA(C, 12) - EMA(C, 26)
Signal = EMA(MACD line, 9)
Histogram = MACD line - Signal
:::
Units are price points, not a percentage, so values on Bank Nifty and on a ₹300 stock are not comparable. Warm-up: 26 bars for the line, 34 for the signal. Each EMA (including the signal line) is seeded with an SMA, as described under EMA, so the first values can differ slightly from other platforms.

The 12/26/9 construction is Gerald Appel's; the histogram was added later (commonly credited to Thomas Aspray, 1986). If you need values comparable across instruments, the Percentage Price Oscillator divides the MACD line by the slow EMA and multiplies by 100.`,
    calc: `A Nifty 5-minute bar closes at 22,580. Previous values: EMA12 = 22,500, EMA26 = 22,460, Signal = 30.

- k12 = 2/13 = 0.1538. EMA12 = 0.1538 x 22,580 + 0.8462 x 22,500 = **22,512.3**
- k26 = 2/27 = 0.0741. EMA26 = 0.0741 x 22,580 + 0.9259 x 22,460 = **22,468.9**
- MACD line = 22,512.3 - 22,468.9 = **43.4**
- k9 = 0.2. Signal = 0.2 x 43.4 + 0.8 x 30 = **32.7**
- Histogram = 43.4 - 32.7 = **10.7**`,
    interpretation: `Line above zero: fast EMA above slow, an uptrend by this definition. Rising histogram: momentum increasing. A shrinking histogram while price still rises tells you the advance is slowing, not that it has ended.`,
    bullish: `MACD line crosses above signal; histogram turns from negative to positive; line crosses above zero; bullish divergence (price lower low, MACD higher low).`,
    bearish: `Line crosses below signal; histogram turns negative; line crosses below zero; bearish divergence.`,
    example: `On a Nifty 5-minute chart after a gap-up, MACD rises steadily for the first hour, then the histogram shrinks as the index drifts sideways near the high, often several bars before any price break.
[[chart:NIFTY:42:ema20,macd]]
On SPY the same pattern appears after the first 30 minutes of a US session.`,
    entryExit: `- Use a higher-timeframe MACD (15-minute) for bias and a lower timeframe for entries.
- Signal-line cross in the direction of the higher-timeframe trend, with a price-structure stop (swing low/high).
- Exit or tighten when the histogram contracts for several bars against your position.`,
    bestConditions: `Swinging trends with clear pullbacks. It is weakest in tight ranges where the line oscillates around zero.`,
    weaknesses: `> [!warn] MACD is built from two lagging EMAs and then smoothed again, so the signal-line cross is late. In a sideways session it crosses back and forth around zero.

The 12/26/9 defaults were chosen for daily charts decades ago; on 1 or 5-minute charts they are not special, and changing them changes every signal. Divergences can persist through long trends.

> [!evidence] Mixed. Calculation is exact; the predictive value of crossovers depends heavily on regime and costs.`,
    mistakes: `- Comparing MACD values across instruments (it is in points).
- Using MACD and a 12/26 EMA cross together as "two confirmations" when they are the same signal.
- Shorting the first bearish divergence in a strong trend.`,
    timeframes: `5 and 15-minute charts intraday. On 1-minute charts the histogram is very noisy.`,
    combinations: `Redundant with EMA crossovers, momentum and ROC (all measure rate of change of price). Better paired with VWAP and volume for location and participation, or ADX to check whether a trend exists.`,
    practice: `1. Load NIFTY seed 42 with ema20 and macd. Mark every signal-line cross and record the result if you exited at the opposite cross.
2. Find one histogram contraction that preceded a turn and one that did not; journal both.
3. Hand-compute one MACD step using the calc above with a new close of 22,520.`,
    refs: ['Gerald Appel — Technical Analysis: Power Tools for Active Investors (book)', 'John J. Murphy — Technical Analysis of the Financial Markets (book)'],
  },
  {
    id: 'psar', name: 'Parabolic SAR', category: 'trend', engine: 'psar', params: 'step=0.02, max=0.2', chart: 'psar', evidence: 'mixed',
    definition: `Parabolic Stop And Reverse, by J. Welles Wilder, plots a dot below price in an uptrend and above price in a downtrend. The dot accelerates towards price as the trend extends; when price touches it, the system flips direction.`,
    purpose: `A trailing stop that tightens over time, and an always-in-the-market trend-following system (long or short at all times).`,
    formula: `:::formula
SAR(t) = SAR(t-1) + AF x ( EP - SAR(t-1) )
:::
- EP (extreme point): highest high of the current uptrend (lowest low in a downtrend).
- AF (acceleration factor): starts at 0.02, rises by 0.02 each time a new EP is made, capped at 0.2.
- In an uptrend the SAR may not be above the lows of the previous two bars (the engine clamps it). If a bar's low falls below the SAR, the trend reverses: SAR jumps to the old EP and AF resets to 0.02.`,
    calc: `Bank Nifty uptrend: previous SAR = 22,304.8 (illustrative points), EP = 22,450, AF = 0.06.

- SAR = 22,304.8 + 0.06 x (22,450 - 22,304.8) = 22,304.8 + 8.7 = **22,313.5**
- If the last two lows were 22,380 and 22,395, the SAR stays at 22,313.5 (it is below both).
- If this bar makes a new high of 22,470, EP becomes 22,470 and AF becomes 0.08 for the next bar.
- If instead the low prints 22,300, price has crossed the SAR: the system flips short, SAR = 22,450.`,
    interpretation: `Dots below price: system long. Dots above: short. Dots close to price after a long trend mean the trailing stop is tight and a flip is likely on any pullback.`,
    bullish: `Dots flip from above to below price; a long series of rising dots.`,
    bearish: `Dots flip from below to above price.`,
    example: `On a trending Bank Nifty 5-minute morning, SAR dots trail neatly below price and the flip comes after the trend ends. On a sideways afternoon the dots flip side every few bars.
[[chart:BANKNIFTY:7:psar,ema20]]
The same sequence occurs on GOLD futures during quiet Asian hours: many flips, little movement.`,
    entryExit: `- Best used as a trailing exit for a position you entered for another reason.
- Avoid the naive stop-and-reverse system in ranges.
- If you use flips as entries, require a trend filter (ADX rising above 20 to 25, price on the right side of a 20-EMA).`,
    bestConditions: `Strong, persistent directional moves. It was designed to profit only when trends exist.`,
    weaknesses: `> [!warn] Always-in-the-market systems pay a loss on every false flip. In sideways sessions, Parabolic SAR produces a long string of small losses plus costs.

The step and max parameters strongly change behaviour: a higher step tightens faster and exits earlier. The engine starts direction from the first two closes, so the first few dots depend on where the series begins.

> [!evidence] Mixed. The mechanics are exact; profitability depends on the market trending, which is not predictable from the SAR itself.`,
    mistakes: `- Trading every flip without a trend filter.
- Reading the dot as support; it is a mechanical stop that moves regardless of market structure.
- Forgetting that after a flip the first SAR can be far away, meaning large initial risk.`,
    timeframes: `5 to 15-minute charts. On 1-minute charts flips are too frequent once costs are counted.`,
    combinations: `ADX as a trend filter, ATR to judge whether the SAR distance is sensible. Overlaps with Supertrend and Chandelier-style ATR trails; use one trailing method.`,
    practice: `1. Load BANKNIFTY seed 7 with psar. Count flips in the first two hours and in the last two hours of the session.
2. Simulate entering on each flip with a 1-lot position and journal the result including estimated costs from the charges calculator.
3. Hand-compute three SAR steps from a new swing, including one AF increment.`,
    refs: ['J. Welles Wilder Jr. — New Concepts in Technical Trading Systems (book, 1978)', 'Perry J. Kaufman — Trading Systems and Methods (book)'],
  },
  {
    id: 'supertrend', name: 'Supertrend', category: 'trend', engine: 'supertrend', params: 'n=10 (ATR), m=3', chart: 'st', evidence: 'mixed',
    definition: `Supertrend draws a single line that sits a multiple of ATR below price in an uptrend and above price in a downtrend. The line only moves in the trend's favour, and it flips when price closes through it. It is widely available on Indian retail charting platforms and commonly discussed by intraday traders.`,
    purpose: `A volatility-adjusted trailing stop and direction label.`,
    formula: `:::formula
HL2 = (H + L) / 2
Basic upper = HL2 + m x ATR(n)
Basic lower = HL2 - m x ATR(n)
:::
- Final lower band rises or stays flat; it only drops if the previous close was below it.
- Final upper band falls or stays flat; it only rises if the previous close was above it.
- Direction flips to down when the close falls below the final lower band, and to up when the close rises above the final upper band.
- ATR uses Wilder smoothing (see ATR).`,
    calc: `Nifty 5-minute, uptrend: H = 22,560, L = 22,520, so HL2 = 22,540. ATR(10) = 25, m = 3.

- Basic lower = 22,540 - 75 = **22,465**. Previous final lower was 22,450, so the final lower rises to 22,465 (the line ratchets up).
- Next bar: HL2 = 22,520, ATR = 26, basic lower = 22,442. That is below 22,465 and the previous close was above it, so the line stays at 22,465.
- If a later bar closes at 22,460, below 22,465, direction flips to down and the line jumps to the final upper band.`,
    interpretation: `Green/below price: up. Red/above price: down. The distance from price to the line is about m ATRs at most; a wide gap means a stop placed there implies large risk.`,
    bullish: `Close above the upper band (flip to up); price riding above a rising line.`,
    bearish: `Close below the lower band (flip to down).`,
    example: `On Nifty 5-minute charts, a (10, 3) Supertrend often stays green through a trend morning and flips only after a decent pullback. In a narrow-range day it flips several times, each time with a stop that is m ATRs away.
[[chart:NIFTY:19:st,vwap]]
On DAX in the European morning the behaviour is similar.`,
    entryExit: `- Primarily a trailing stop: hold longs while the line is green, exit on the flip.
- If used for entries, require trend context (ADX, higher-timeframe direction) and size the trade using the distance to the line, not a fixed quantity.`,
    bestConditions: `Trending sessions with stable volatility.`,
    weaknesses: `> [!warn] Supertrend is a lagging stop-and-reverse rule. In choppy markets it whipsaws, and each loss is roughly m x ATR plus slippage, which is large compared to the move that follows.

Its popularity makes it look like it "works" in screenshots, which select trending days. Parameters (7/3, 10/3, 10/2) change results heavily. ATR calculation differences between platforms shift the line slightly.

> [!evidence] Mixed. No reliable published evidence of a persistent edge; it is a reasonable trailing-stop mechanism.`,
    mistakes: `- Buying every green flip on a range day.
- Ignoring position size; a 3-ATR stop needs a smaller quantity.
- Stacking two Supertrends and calling it confirmation; they are the same rule with different parameters.`,
    timeframes: `3 to 15-minute charts intraday. Hourly for swing context.`,
    combinations: `ADX or a higher-timeframe EMA as a trend filter; VWAP for location. Redundant with Parabolic SAR, Keltner-based trails and other ATR stops.`,
    practice: `1. Load NIFTY seed 19 with st and vwap. Record every flip, the stop distance in points and the outcome.
2. Use the position-size calculator to size a 1% risk trade using the Supertrend distance for three flips.
3. Compare flips with st against psar on the same chart and note which whipsawed more.`,
    refs: ['Olivier Seban — creator of Supertrend (attributed; see platform documentation)', 'J. Welles Wilder Jr. — New Concepts in Technical Trading Systems (ATR) (book)'],
  },
  {
    id: 'adx', name: 'ADX (Average Directional Index)', category: 'trend', engine: 'adx', params: 'n=14', chart: 'adx', evidence: 'mixed',
    definition: `ADX, from Wilder, measures the **strength** of a trend regardless of direction, on a 0 to 100 scale. It is derived from the Directional Movement Index (+DI and -DI) and smoothed again.`,
    purpose: `To decide whether trend-following tools deserve attention (ADX rising) or whether range tactics fit better (ADX low or falling).`,
    formula: `:::formula
+DM = H(t) - H(t-1) if that is > L(t-1) - L(t) and > 0, else 0
-DM = L(t-1) - L(t) if that is > H(t) - H(t-1) and > 0, else 0
+DI = 100 x RMA(+DM, n) / RMA(TR, n)
-DI = 100 x RMA(-DM, n) / RMA(TR, n)
DX = 100 x | +DI - -DI | / ( +DI + -DI )
ADX = RMA(DX, n)
:::
RMA is Wilder smoothing (alpha = 1/n). Wilder himself smoothed running 14-bar **sums** of TR and DM rather than averages; because +DI and -DI are ratios, the result is identical. The engine seeds each average with the simple mean of the first n values, as Wilder did. Warm-up is about 2n bars (the first ADX value appears on bar 28 at defaults).`,
    calc: `Previous smoothed values (n = 14): TR 60, +DM 20, -DM 8, ADX 30. The new bar: TR 74, +DM 34, -DM 0.

- TR = (60 x 13 + 74)/14 = **61.0**
- +DM = (20 x 13 + 34)/14 = **21.0**; -DM = (8 x 13 + 0)/14 = **7.43**
- +DI = 100 x 21/61 = **34.4**; -DI = 100 x 7.43/61 = **12.2**
- DX = 100 x 22.2/46.6 = **47.7**
- ADX = (30 x 13 + 47.7)/14 = **31.3**`,
    interpretation: `Common thresholds: below 20 weak or no trend, above 25 trending, rising ADX means the trend is strengthening. ADX says nothing about direction; a falling market produces a high ADX too. Thresholds are conventions, not laws.`,
    bullish: `ADX rising above 20 to 25 while +DI is above -DI.`,
    bearish: `ADX rising while -DI is above +DI. Note "bearish" is about direction from the DIs, not from ADX.`,
    example: `On a Bank Nifty 15-minute chart, ADX can stay below 20 in pre-event sessions (policy days, budget) and then climbs quickly after the announcement, by which time much of the move has happened.
[[chart:BANKNIFTY:31:adx,ema20]]`,
    entryExit: `- Regime switch: trend tactics (pullbacks, breakouts) when ADX is above 25 and rising; mean-reversion tactics when it is below 20.
- A turning down of ADX from a high level suggests the trend's strength is fading; tighten stops rather than reverse.`,
    bestConditions: `As a filter in any liquid market. It is a description tool, not an entry signal.`,
    weaknesses: `> [!warn] ADX is double-smoothed and lags noticeably; by the time it confirms a trend the cleanest part may be over. It also stays high briefly after a trend has reversed.

At n = 14 on a 1-minute chart it reflects only 14 minutes of history but still takes about 28 bars to stabilise. Thresholds of 20/25 come from daily-chart usage; intraday levels behave differently by instrument.

> [!evidence] Mixed. A sensible regime descriptor; evidence for specific threshold rules is limited.`,
    mistakes: `- Treating rising ADX as bullish. It means "stronger trend", in either direction.
- Entering on ADX crossing 25 alone.
- Optimising the threshold on past data.`,
    timeframes: `15-minute and hourly charts work best for intraday regime context. Faster charts are noisy.`,
    combinations: `DMI (+DI/-DI) for direction (it is the same calculation), ATR for stops, Bollinger width for an independent view of volatility regime. Choppiness Index is a similar idea.`,
    practice: `1. Load BANKNIFTY seed 31 with adx and ema20. Label each period ADX < 20 and ADX > 25 and check whether 20-EMA pullbacks worked better in the second.
2. Hand-compute one ADX step using the calc template with new inputs (TR 50, +DM 0, -DM 18).
3. Journal: write one rule that uses ADX only as a filter.`,
    refs: ['J. Welles Wilder Jr. — New Concepts in Technical Trading Systems (book, 1978)', 'John J. Murphy — Technical Analysis of the Financial Markets (book)'],
  },
  {
    id: 'dmi', name: 'DMI (+DI / -DI, Directional Movement Index)', category: 'trend', engine: 'adx', params: 'n=14 (returned as pdi and ndi by IA.ind.adx)', chart: 'adx', evidence: 'mixed',
    definition: `The Directional Movement Index is Wilder's pair of lines, **+DI** and **-DI**, that measure what share of recent true range came from upward expansion versus downward expansion. ADX is computed from them; in this app both come from the same engine call.`,
    purpose: `To read trend **direction** and its balance, while ADX reads strength. A +DI/-DI cross is Wilder's original directional signal.`,
    formula: `:::formula
Up move = H(t) - H(t-1);  Down move = L(t-1) - L(t)
+DM = Up move if Up move > Down move and Up move > 0, else 0
-DM = Down move if Down move > Up move and Down move > 0, else 0
+DI = 100 x RMA(+DM, n) / RMA(TR, n)
-DI = 100 x RMA(-DM, n) / RMA(TR, n)
:::
Only one of +DM or -DM can be non-zero on a bar; an inside bar gives both zero. RMA is Wilder smoothing with alpha 1/n.`,
    calc: `Reliance 15-minute. Previous bar H ₹1,480, L ₹1,462. Current bar H ₹1,491, L ₹1,466, previous close ₹1,470.

- Up move = 1,491 - 1,480 = 11; Down move = 1,462 - 1,466 = -4. So **+DM = 11, -DM = 0**.
- TR = max(25, |1,491 - 1,470|, |1,466 - 1,470|) = **25**.
- With smoothed values before this bar of TR 20, +DM 6, -DM 5 (n = 14): TR = (20 x 13 + 25)/14 = 20.36; +DM = (6 x 13 + 11)/14 = 6.36; -DM = 5 x 13/14 = 4.64.
- +DI = 100 x 6.36/20.36 = **31.2**; -DI = 100 x 4.64/20.36 = **22.8**.`,
    interpretation: `+DI above -DI: upward range expansion dominates. The wider the gap, the more one-sided the movement; that gap is exactly what drives DX and ADX higher. Lines tangled near each other describe a balanced, directionless market.`,
    bullish: `+DI crosses above -DI, ideally with ADX rising from a low level. Wilder also used the high of the cross bar as a trigger level.`,
    bearish: `-DI crosses above +DI with ADX rising.`,
    example: `On Reliance 15-minute in a sideways week, +DI and -DI cross repeatedly between 18 and 25. After a results-driven breakout, +DI jumps above 35 while -DI falls under 15 and ADX starts to rise.
[[chart:RELIANCE:14:adx,ema20]]
The Chart Lab adx panel plots ADX with both DI lines.`,
    entryExit: `- Take DI crosses only when ADX is above about 20 or rising.
- Use the extreme of the cross bar as an entry trigger and the opposite extreme as an initial stop, as Wilder suggested; check that risk is acceptable with the position-size calculator.
- Exit on the reverse cross or with a separate trailing stop.`,
    bestConditions: `Markets transitioning from range to trend.`,
    weaknesses: `> [!warn] DI crosses whipsaw badly when ADX is low, which is most of the time intraday. Smoothing makes them late.

Because it is computed from bar extremes, a single wide spike bar (an opening gap or news candle) can dominate the DIs for many bars.

> [!evidence] Mixed. Accepted as a description of directional range expansion; signal profitability is not established.`,
    mistakes: `- Trading DI crosses without the ADX filter.
- Thinking +DI and -DI sum to 100; they do not.
- Using DMI and ADX as independent confirmations; they are one calculation.`,
    timeframes: `15-minute to daily. On 1-minute charts the lines cross too often to be useful.`,
    combinations: `ADX (same engine), ATR for stops, a moving average for structure. Redundant with Aroon and Vortex-style indicators that also compare up and down extremes.`,
    practice: `1. Load RELIANCE seed 14 with adx. List every DI cross and the ADX value at that moment; compare outcomes for ADX below and above 20.
2. Compute +DM and -DM by hand for five consecutive bars, including one inside bar.
3. Journal a rule that uses the DI cross only as a trigger inside a confirmed trend.`,
    refs: ['J. Welles Wilder Jr. — New Concepts in Technical Trading Systems (book, 1978)', 'Robert W. Colby — The Encyclopedia of Technical Market Indicators (book)'],
  },
  {
    id: 'ichimoku', name: 'Ichimoku Cloud (Ichimoku Kinko Hyo)', category: 'trend', engine: 'ichimoku', params: 'tenkan=9, kijun=26, senkou B=52', chart: null, evidence: 'mixed',
    definition: `Ichimoku, developed by Goichi Hosoda in Japan, is a set of five lines built from midpoints of highs and lows over three windows. Two of them are shifted forward to form the "cloud" (kumo), and one is shifted back.`,
    purpose: `A complete trend picture in one view: direction, momentum, and support/resistance zones derived from past ranges.`,
    formula: `:::formula
Tenkan-sen = (highest high + lowest low) / 2 over 9 bars
Kijun-sen = (highest high + lowest low) / 2 over 26 bars
Senkou Span A = (Tenkan + Kijun) / 2, plotted 26 bars ahead
Senkou Span B = (highest high + lowest low) / 2 over 52 bars, plotted 26 bars ahead
Chikou Span = close, plotted 26 bars behind
:::
The engine returns spans unshifted with {{shift = 26}}; the chart applies the displacement. Platforms count the displacement differently (some plot 26 bars ahead, others 25 because the current bar counts as one), so cloud edges can sit one bar apart between platforms. Midpoints of ranges, not averages of closes, make Ichimoku step-shaped.`,
    calc: `Nifty 15-minute. Over the last 9 bars: high 22,620, low 22,480. Over 26 bars: high 22,650, low 22,380. Over 52 bars: high 22,700, low 22,300.

- Tenkan = (22,620 + 22,480)/2 = **22,550**
- Kijun = (22,650 + 22,380)/2 = **22,515**
- Span A = (22,550 + 22,515)/2 = **22,532.5**, plotted 26 bars into the future
- Span B = (22,700 + 22,300)/2 = **22,500**, also plotted 26 bars ahead
- Span A above Span B: the future cloud is "bullish" (often coloured green).`,
    interpretation: `Price above the cloud: uptrend by this system. Inside the cloud: no clear trend. Tenkan above Kijun: short-term momentum up. Thick cloud: wide past range, often treated as stronger support/resistance. Chikou above the price of 26 bars ago: confirms the trend.`,
    bullish: `Price above cloud, Tenkan above Kijun, Span A above Span B, Chikou above past price. A Tenkan/Kijun cross above the cloud is considered stronger than one below it.`,
    bearish: `The mirror image: price below cloud, Tenkan below Kijun, Span A below B, Chikou below past price.`,
    example: `On a Nifty hourly chart, Ichimoku gives a cleaner read than on a 1-minute chart because 52 hourly bars cover about seven to eight NSE sessions (roughly seven hourly bars per 09:15 to 15:30 session). On USDJPY or Nikkei futures, where it is widely followed, traders often reference the Kijun as a pullback level. The Chart Lab has an Ichimoku toggle that plots Tenkan, Kijun and the cloud shifted 26 bars ahead (the Chikou line is not drawn). Tenkan and Kijun are the same quantity as a 9-bar and a 26-bar Donchian midline; the dc overlay uses 20 bars, so compute the 9 and 26-bar midlines by hand to compare.`,
    entryExit: `- Trade only in the direction of price relative to the cloud.
- Pullback entries towards the Kijun in a trend, with stops beyond the Kijun or the cloud edge.
- Exit when price closes back inside the cloud or Tenkan crosses Kijun against you.`,
    bestConditions: `Trending markets on hourly and daily charts.`,
    weaknesses: `> [!warn] Every component is a lagging midpoint. The "future" cloud is not a forecast; it is past data drawn to the right. In ranges, price sits inside or around the cloud and signals conflict.

The 9/26/52 settings are usually explained by the six-day trading week of Japan when Hosoda developed the method (he published it in the late 1960s); their relevance to 5-minute NSE bars is a convention, not a law. Many rules overlap, so "five confirmations" are not independent.

> [!evidence] Mixed. Mechanically clear; systematic evidence of an edge is limited and parameter-dependent.`,
    mistakes: `- Treating the cloud as a prediction of where price will go.
- Using default settings on 1-minute charts without understanding what window that represents.
- Counting Tenkan, Kijun and Span A as independent confirmations; Span A is built from the other two.`,
    timeframes: `Hourly to daily for context; 15-minute at the shortest for intraday.`,
    combinations: `Volume or VWAP for participation; ATR for stops. Redundant with Donchian midlines (Tenkan and Kijun are Donchian midlines) and with moving-average crossovers.`,
    practice: `1. In the Chart Lab, load NIFTY with the Ichimoku toggle on. Using the crosshair readout, compute Tenkan (9) and Kijun (26) by hand as 9 and 26-bar high-low midpoints for three bars and compare with the plotted lines.
2. Compute Span A and Span B for one bar and mark on paper where they would be drawn 26 bars ahead.
3. Journal: list which Ichimoku signals are mathematically dependent on each other.`,
    refs: ['Goichi Hosoda — originator of Ichimoku Kinko Hyo', 'Nicole Elliott — Ichimoku Charts: An Introduction to Ichimoku Kinko Clouds (book)', 'Manesh Patel — Trading with Ichimoku Clouds (book)'],
  },
  {
    id: 'rsi', name: 'RSI (Relative Strength Index)', category: 'momentum', engine: 'rsi', params: 'n=14', chart: 'rsi', evidence: 'mixed',
    definition: `RSI, from Wilder, compares the average size of up-closes with the average size of down-closes over n bars and scales the result to 0 to 100. It is a bounded momentum oscillator.`,
    purpose: `To measure how one-sided recent price changes have been, to spot stretched conditions, momentum regime and divergence.`,
    formula: `:::formula
Gain(t) = max(C(t) - C(t-1), 0);  Loss(t) = max(C(t-1) - C(t), 0)
AvgGain = RMA(Gain, n);  AvgLoss = RMA(Loss, n)
RS = AvgGain / AvgLoss
RSI = 100 - 100 / (1 + RS)
:::
RMA is Wilder smoothing: new = (old x (n-1) + value)/n, seeded with a simple average of the first n values. The engine returns 100 if AvgLoss is 0 and 50 if both are 0.`,
    calc: `Nifty 5-minute, n = 14. Previous AvgGain = 12 points, AvgLoss = 8 points. The new bar closes 30 points higher.

- AvgGain = (12 x 13 + 30)/14 = **13.29**
- AvgLoss = (8 x 13 + 0)/14 = **7.43**
- RS = 13.29/7.43 = 1.79
- RSI = 100 - 100/2.79 = **64.1**

A single 30-point bar moved RSI only a few points because of the smoothing. Short settings (n = 2 to 5) move far more per bar.`,
    interpretation: `Above 70 is conventionally "overbought" and below 30 "oversold", but in strong trends RSI stays above 60 (or below 40) for long periods. Many traders read RSI regime instead: holding 40 to 80 suggests an uptrend, 20 to 60 a downtrend. The 50 line separates up and down momentum.`,
    bullish: `RSI holds above 40 to 50 on pullbacks in an uptrend; bullish divergence (price lower low, RSI higher low); RSI recovers back above 30 after an oversold reading.`,
    bearish: `RSI fails below 50 to 60 on bounces; bearish divergence; RSI falls back below 70 after an overbought reading.`,
    example: `On a Bank Nifty 5-minute trend-up day, RSI can sit above 70 for an hour while price keeps climbing; shorting "overbought" here loses repeatedly. On a range day the same 70/30 levels mark the edges reasonably.
[[chart:BANKNIFTY:42:rsi,vwap]]
On NVDA after an earnings gap the same caution applies.`,
    entryExit: `- In a trend: buy pullbacks when RSI dips to 40 to 50 and turns up, with a structure stop.
- In a confirmed range: fade 70/30 extremes near range edges, exit at the middle.
- Divergence: use only as a warning; wait for price structure to break before acting.`,
    bestConditions: `Range-bound markets for extreme readings; trends for regime reading.`,
    weaknesses: `> [!warn] "Overbought" does not mean "about to fall". RSI pinned high is a feature of strong trends. Fading it without context is a common way to lose money.

RSI is driven only by closes, so intrabar ranges are ignored. Values depend heavily on n; RSI(2) and RSI(14) behave like different indicators. Different smoothing (Wilder vs EMA vs SMA) gives slightly different values across platforms.

> [!evidence] Mixed. Short-horizon mean-reversion effects have been reported in some markets and periods, and have weakened in others. No threshold rule is reliably profitable after costs.`,
    mistakes: `- Selling every reading above 70.
- Using RSI, Stochastic, Williams %R and CCI together as if they were independent votes.
- Ignoring the higher-timeframe trend.`,
    timeframes: `5 and 15-minute charts with n = 14; shorter n for very short holding periods, at the cost of more noise.`,
    combinations: `Trend filter (EMA, ADX), location (VWAP, pivots), volume. Largely redundant with Stochastic, Williams %R, CCI, ROC and MFI.`,
    practice: `1. Load BANKNIFTY seed 42 with rsi and vwap. Mark each RSI > 70 reading and record what happened over the next 10 bars when price was above vs below VWAP.
2. Hand-compute three RSI steps from given AvgGain/AvgLoss values.
3. Find a divergence and journal whether price structure confirmed it.`,
    refs: ['J. Welles Wilder Jr. — New Concepts in Technical Trading Systems (book, 1978)', 'Andrew Cardwell — RSI range-shift concepts (taught in seminars; described in Constance Brown, below)', 'Constance Brown — Technical Analysis for the Trading Professional (book)'],
  },
  {
    id: 'stoch-rsi', name: 'Stochastic RSI', category: 'momentum', engine: 'stochRsi', params: 'rsi n=14, stoch n=14, k=3, d=3', chart: null, evidence: 'mixed',
    definition: `Stochastic RSI applies the Stochastic formula to RSI values instead of price: it shows where the current RSI sits within its own recent high-low range, on 0 to 100. It is an oscillator of an oscillator.`,
    purpose: `To get a more sensitive signal than RSI, which can spend long periods in the middle of its range.`,
    formula: `:::formula
Raw = 100 x ( RSI(t) - lowest RSI over 14 ) / ( highest RSI over 14 - lowest RSI over 14 )
%K = SMA(Raw, 3)
%D = SMA(%K, 3)
:::
The engine returns Raw = 0 when the RSI range is flat (highest = lowest). Chande and Kroll defined the raw value on a 0 to 1 scale with no smoothing; the 3-bar %K and %D smoothing and the 0 to 100 scale are later platform conventions that this engine follows. Warm-up is long: in the engine the first %K appears on bar 30 and the first %D on bar 32 at default settings.`,
    calc: `Nifty 5-minute. Over the last 14 bars, RSI ranged from 40 to 64. Current RSI = 55.

- Raw = 100 x (55 - 40)/(64 - 40) = 100 x 15/24 = **62.5**

Suppose the two previous Raw values were 55 and 61, and the current one is the 62.5 just computed.

- %K = (55 + 61 + 62.5)/3 = **59.5**

Notice that RSI at 55 is unremarkable, while a small RSI move from 55 to 64 would push Raw to 100.`,
    interpretation: `Above 80: RSI is at the top of its recent range. Below 20: at the bottom. Because it is so sensitive, it reaches extremes very often; a reading of 100 is common and does not mean price is extreme.`,
    bullish: `%K crosses above %D from below 20, in the direction of a higher-timeframe uptrend.`,
    bearish: `%K crosses below %D from above 80, in a downtrend.`,
    example: `On a Nifty 5-minute chart, Stochastic RSI swings from 0 to 100 several times per session while RSI moves between 45 and 60. In a trend, the pullback dips to 0 are the only ones worth noticing. The Chart Lab has no StochRSI token; load rsi and observe where RSI sits inside its last 14 values to see the same thing.`,
    entryExit: `- Use only as a timing tool inside a trend you identified with something else.
- Enter on a cross out of the extreme zone in the trend direction; stop on price structure.
- Do not exit trend trades on StochRSI extremes alone; they occur constantly.`,
    bestConditions: `Trending markets with regular pullbacks, on a timeframe where the trend is clear.`,
    weaknesses: `> [!warn] Extremely noisy. Double-processing exaggerates small changes, so it generates many signals and many false ones.

Results depend on four parameters, which invites curve fitting. When RSI is flat, the formula is undefined (the engine returns 0), creating artificial "oversold" readings.

> [!evidence] Mixed, leaning weak. It is a transformation of RSI and adds sensitivity, not new information.`,
    mistakes: `- Treating 0 or 100 as rare extremes.
- Using it alongside RSI and calling it confirmation; it is RSI re-scaled.
- Trading every cross on a 1-minute chart.`,
    timeframes: `5 to 60-minute charts. On very short timeframes, the noise overwhelms any use.`,
    combinations: `Trend filter (EMA, ADX) and price structure. Fully redundant with RSI; partially with Stochastic and Williams %R.`,
    practice: `1. In the Chart Lab, load NIFTY with rsi. Pick a bar, note the last 14 RSI values from the crosshair readout, and compute Raw StochRSI by hand.
2. Count how many times in one session RSI would have reached the top or bottom of its 14-bar range.
3. Journal: decide whether StochRSI adds anything to your RSI process, and why.`,
    refs: ['Tushar Chande and Stanley Kroll — The New Technical Trader (book, 1994)', 'Robert W. Colby — The Encyclopedia of Technical Market Indicators (book)'],
  },
  {
    id: 'stochastic', name: 'Stochastic Oscillator', category: 'momentum', engine: 'stochastic', params: 'k=14, d=3, smooth=1 (fast); smooth=3 gives the slow version', chart: 'stoch', evidence: 'mixed',
    definition: `The Stochastic Oscillator, popularised by George Lane, shows where the latest close sits within the high-low range of the last k bars, on 0 to 100.`,
    purpose: `To read whether closes are clustering near recent highs (upward pressure) or lows (downward pressure), and to time entries in ranges or pullbacks.`,
    formula: `:::formula
Raw %K = 100 x ( C - lowest low over k ) / ( highest high over k - lowest low over k )
%K = SMA(Raw %K, smooth)   (smooth = 1 means %K = Raw)
%D = SMA(%K, d)
:::
Engine defaults k = 14, d = 3, smooth = 1, which is the **fast** stochastic. The common "slow 14,3,3" is smooth = 3, and that slow version is what the app's stoch chart pane plots. If the range is flat, the engine returns 50.`,
    calc: `Reliance 15-minute. Over 14 bars the highest high is ₹1,512 and lowest low ₹1,472. Close = ₹1,502.

- Raw %K = 100 x (1,502 - 1,472)/(1,512 - 1,472) = 100 x 30/40 = **75**
- If the previous two %K values were 60 and 68, %D = (60 + 68 + 75)/3 = **67.7**

%K above %D: the latest close is higher in the range than the recent average.`,
    interpretation: `Above 80: closes near the top of the range. Below 20: near the bottom. In trends, the oscillator stays pinned at the extreme. Unlike RSI, it uses highs and lows, so it reacts to range expansion as well as closes.`,
    bullish: `%K crosses above %D below 20; bullish divergence; in an uptrend, the oscillator dips and turns up from mid-range.`,
    bearish: `%K crosses below %D above 80; bearish divergence.`,
    example: `On Reliance 15-minute in a range between ₹1,470 and ₹1,515, Stochastic turns near 80 and 20 close to the range edges. When Reliance breaks out on news, it pins above 80 and every short signal fails.
[[chart:RELIANCE:27:stoch,ema20]]`,
    entryExit: `- In a range: fade crosses at extremes near support or resistance, target the middle, stop beyond the range edge.
- In a trend: use crosses from the opposite extreme as pullback entries in the trend direction.
- Never exit a strong trend trade solely because the reading is above 80.`,
    bestConditions: `Clear, horizontal ranges; or trending markets for pullback timing.`,
    weaknesses: `> [!warn] The fast version is very jumpy. In trends, "overbought" and "oversold" readings persist and produce repeated losing fades.

Parameter choice (5,3,3 vs 14,3,3) changes the character entirely. The default here is fast; compare carefully with platforms that default to slow.

> [!evidence] Mixed. It is a description of close location; profitable rules depend on regime and costs.`,
    mistakes: `- Mixing up fast and slow stochastic and wondering why values differ from a broker's chart.
- Shorting every reading above 80.
- Treating Stochastic and Williams %R as separate signals; %R is the same quantity inverted.`,
    timeframes: `5 to 60-minute intraday; 15-minute is a common balance.`,
    combinations: `Support/resistance, pivots or VWAP bands for location; ADX to decide range vs trend tactics. Redundant with Williams %R (an exact transformation of the fast version; the slow version is a smoothed copy), StochRSI and largely RSI.`,
    practice: `1. Load RELIANCE seed 27 with stoch and ema20. Identify a range and a trend segment; record the outcome of every extreme cross in each.
2. Compute Raw %K for one bar by hand from the crosshair readout and confirm Williams %R for the same bar equals Raw %K minus 100.
3. Journal: write the condition under which you will not trade a Stochastic signal.`,
    refs: ['George C. Lane — Lane\'s Stochastics (Technical Analysis of Stocks and Commodities articles)', 'John J. Murphy — Technical Analysis of the Financial Markets (book)'],
  },
  {
    id: 'cci', name: 'CCI (Commodity Channel Index)', category: 'momentum', engine: 'cci', params: 'n=20', chart: null, evidence: 'mixed',
    definition: `CCI, from Donald Lambert, measures how far the typical price has moved from its average, in units of mean absolute deviation. It is unbounded. Lambert chose the 0.015 constant so that roughly 70 to 80% of values would fall between -100 and +100 on the data he studied; the actual share varies by instrument and period.`,
    purpose: `To spot unusual deviation from the average: either the start of a strong move (breakout use) or stretched conditions (reversion use).`,
    formula: `:::formula
TP = (H + L + C) / 3
MA = SMA(TP, n)
MD = mean of | TP(i) - MA | over the last n bars
CCI = ( TP - MA ) / ( 0.015 x MD )
:::
The engine uses mean absolute deviation (not standard deviation) around the current SMA, and returns 0 if MD is 0.`,
    calc: `Five Nifty 15-minute typical prices, {{n = 5}}: 22,400, 22,420, 22,410, 22,440, 22,480.

- MA = 112,150/5 = **22,430**
- Deviations: 30, 10, 20, 10, 50; MD = 120/5 = **24**
- CCI = (22,480 - 22,430)/(0.015 x 24) = 50/0.36 = **138.9**

The latest bar is well above the "normal" band of plus or minus 100.`,
    interpretation: `Above +100: price unusually high relative to its average; below -100: unusually low. Lambert originally treated a move above +100 as the start of a trend (buy), not as overbought. Both readings are used, which shows how interpretation-dependent it is.`,
    bullish: `Breakout use: CCI crosses above +100. Reversion use: CCI turns up from below -100 in an uptrend. Zero-line cross from below.`,
    bearish: `Breakout use: CCI crosses below -100. Reversion use: turns down from above +100 in a downtrend.`,
    example: `On Nifty 15-minute, CCI often exceeds +150 on the first bar of an opening drive and stays above +100 while the drive continues. In a range afternoon, it oscillates between plus and minus 100. The Chart Lab has a CCI toggle (CCI 20, with lines at -100, 0 and +100); compute CCI for a few bars by hand to check you understand the mean-deviation step.`,
    entryExit: `- Pick one interpretation per strategy (breakout or reversion) and backtest it in the simulator; do not switch after the fact.
- Breakout: enter on cross above +100 with a trend filter; exit on cross back below 0 or a structure stop.
- Reversion: only in a range, with a stop beyond the range.`,
    bestConditions: `Instruments with cyclical swings; breakout use on trend days.`,
    weaknesses: `> [!warn] Unbounded scale makes "extreme" relative. On volatile days CCI can reach plus or minus 300, and a threshold of 100 triggers constantly.

The 0.015 constant is a scaling choice, not a statistical law. Two opposite interpretations exist, which makes it easy to explain any outcome in hindsight.

> [!evidence] Mixed. No robust evidence for a particular threshold rule.`,
    mistakes: `- Using both the breakout and reversion readings and choosing whichever fits.
- Assuming 70 to 80% of values are within 100 on every instrument; it depends on the distribution.
- Pairing CCI with RSI and Stochastic as independent votes.`,
    timeframes: `15-minute to daily. Short timeframes produce many extreme readings.`,
    combinations: `Trend filter (EMA slope, ADX) and price structure. Redundant with Bollinger %B and z-score ideas (deviation from a mean), and largely with RSI/Stochastic.`,
    practice: `1. Using the Chart Lab crosshair readout (the O, H, L, C, V legend) on any NIFTY seed, compute CCI(5) for three bars as above.
2. Write two rules, one breakout and one reversion, and test each separately in the strategy simulator; compare results honestly.
3. Journal how many times CCI exceeded 100 in a session and what that implies for a threshold rule.`,
    refs: ['Donald R. Lambert — Commodity Channel Index: Tools for Trading Cyclic Trends, Commodities magazine (1980)', 'Robert W. Colby — The Encyclopedia of Technical Market Indicators (book)'],
  },
  {
    id: 'roc', name: 'Rate of Change (ROC)', category: 'momentum', engine: 'roc', params: 'n=10', chart: null, evidence: 'mixed',
    definition: `ROC is the percentage change in price over n bars. It is the simplest momentum measure and is unbounded.`,
    purpose: `To measure how fast price is moving and compare momentum across instruments or time, since it is expressed in percent.`,
    formula: `:::formula
ROC(t) = 100 x ( C(t) - C(t-n) ) / C(t-n)
:::
The engine returns null for the first n bars. ROC is Momentum divided by the old price.`,
    calc: `Nifty 15-minute, {{n = 10}}. Close now 22,560; close 10 bars ago 22,200.

- Change = 360 points
- ROC = 100 x 360/22,200 = **1.62%**

For Reliance, a ₹24 move from ₹1,480 gives ROC = 1.62% as well, so the two moves are comparable, unlike Momentum.`,
    interpretation: `Positive and rising: accelerating advance. Positive but falling: still up over n bars, but slowing. Zero cross: price back to where it was n bars ago. ROC is sensitive to what happened n bars ago (the "drop-off" effect).`,
    bullish: `ROC crosses above zero; rising ROC with rising price; bullish divergence.`,
    bearish: `ROC crosses below zero; bearish divergence.`,
    example: `Comparing ROC(10) on 15-minute Nifty, Bank Nifty and a midcap index shows which is leading on a given morning. On a strong Bank Nifty day, its ROC often runs well ahead of Nifty's. The Chart Lab has a ROC toggle (ROC 10); compare it with macd on the same chart and compute one value from the crosshair readout to check it.`,
    entryExit: `- Relative-strength selection: trade the instrument with stronger ROC in the direction of the market.
- Zero-line cross only with a trend filter.
- Avoid using raw ROC thresholds across days with very different volatility.`,
    bestConditions: `Ranking and comparing instruments; trending markets.`,
    weaknesses: `> [!warn] ROC is noisy and depends on a single old bar: if the bar n periods ago was a spike, ROC jumps when it drops out, even if current price is still.

Thresholds are not stable across volatility regimes. Like all momentum, it lags at turns.

> [!evidence] Mixed. Cross-sectional and time-series momentum have academic support over months (for example Jegadeesh and Titman, 1993; Moskowitz, Ooi and Pedersen, 2012), but those are not intraday results and do not validate intraday ROC signals.`,
    mistakes: `- Treating ROC and Momentum as different indicators.
- Applying monthly-horizon momentum research to 5-minute charts.
- Using fixed thresholds without regard to volatility.`,
    timeframes: `Any. Intraday, n = 10 to 20 on 5 to 15-minute bars is common.`,
    combinations: `Redundant with Momentum (same quantity, different units), close to MACD and RSI. Pair with volatility (ATR) to normalise, or with volume.`,
    practice: `1. From the Chart Lab crosshair readout (the O, H, L, C, V legend), compute ROC(10) for NIFTY and BANKNIFTY at the same bar; decide which is stronger.
2. Find a bar where ROC changed sharply because of the drop-off of an old bar.
3. Journal whether ROC gave you anything MACD did not on the same chart.`,
    refs: ['Martin J. Pring — Technical Analysis Explained (book)', 'Jegadeesh and Titman — Returns to Buying Winners and Selling Losers, Journal of Finance (1993)', 'Moskowitz, Ooi, Pedersen — Time Series Momentum, Journal of Financial Economics (2012)'],
  },
  {
    id: 'williams-r', name: 'Williams %R', category: 'momentum', engine: 'williamsR', params: 'n=14', chart: null, evidence: 'mixed',
    definition: `Williams %R, by Larry Williams, shows where the close sits relative to the highest high of the last n bars, on a 0 to -100 scale. It is exactly the raw fast Stochastic minus 100.`,
    purpose: `To spot closes near the top or bottom of the recent range. Williams designed it for short-term commodity trading, where he looked for the first failure of an extreme reading rather than the extreme itself. Some traders like the inverted scale because "overbought" sits at the top near zero, which visually matches a price near its high.`,
    formula: `:::formula
%R = -100 x ( highest high over n - C ) / ( highest high over n - lowest low over n )
:::
The engine returns -50 when the range is flat. Relationship: {{%R = Raw %K - 100}}.`,
    calc: `Same Reliance data as the Stochastic example: 14-bar high ₹1,512, low ₹1,472, close ₹1,502.

- %R = -100 x (1,512 - 1,502)/(1,512 - 1,472) = -100 x 10/40 = **-25**
- Raw Stochastic %K was 75, and 75 - 100 = -25. Same information.`,
    interpretation: `Above -20: close near the top of the range ("overbought" by convention). Below -80: near the bottom. In trends, readings stay at extremes for long stretches; a string of readings near 0 during an uptrend describes strength, not weakness. Williams himself paid attention to how %R behaved on the bars after an extreme: a quick failure to stay above -20 can describe fading buying pressure, while repeated returns to -5 to 0 describe persistent strength.`,
    bullish: `%R rises from below -80 back above it in a range or uptrend; bullish divergence.`,
    bearish: `%R falls from above -20 back below it.`,
    example: `On Reliance 15-minute, Williams %R and the fast Stochastic show identical turning points. The Chart Lab has a %R toggle (14 bars). Note that the stoch toggle plots the slow 14,3,3 version, so its %K is smoothed and will not equal %R + 100 bar by bar; the exact identity holds only against the raw (fast) %K.
[[chart:RELIANCE:27:stoch]]`,
    entryExit: `- Same uses as the Stochastic: fade extremes only in confirmed ranges; time pullbacks in trends.
- Structure stops beyond the range or swing.
- Wait for a confirming close back out of the extreme zone before acting, which reduces (but does not remove) the number of early fades.
- Exit range trades near the opposite side of the range or the middle, not on the next %R extreme.`,
    bestConditions: `Ranges and pullbacks within trends.`,
    weaknesses: `> [!warn] Unsmoothed, so very noisy. Persistent extremes in trends cause repeated losing fades.

Parameter choice changes signals; there is nothing special about 14. Because it uses the single highest high and lowest low, one spike bar sets the range for n bars and compresses every reading until it leaves the window.

> [!evidence] Mixed. It adds no information beyond the fast Stochastic, and threshold rules have no reliable published edge after costs.`,
    mistakes: `- Using %R and Stochastic together as two confirmations.
- Forgetting the scale is negative and misreading levels.
- Fading a reading above -20 in a stock that has just broken out on heavy volume.
- Ignoring the spike-bar effect after an opening gap.`,
    timeframes: `5 to 60-minute intraday. On 1-minute charts the reading flips between extremes every few minutes.`,
    combinations: `Fully redundant with fast Stochastic; largely with RSI and CCI. Combine instead with trend filters, VWAP or pivots.`,
    practice: `1. Load RELIANCE seed 27 with stoch and %R. For five bars, compute Raw %K by hand from the crosshair readout (the stoch pane shows the smoothed slow %K, so do not use it), convert to %R and compare with the %R pane.
2. Hand-compute %R for one bar from the crosshair readout.
3. Remove any duplicate oscillators from your checklist and note the change in your journal.`,
    refs: ['Larry Williams — How I Made One Million Dollars Last Year Trading Commodities (book, 1973)', 'Robert W. Colby — The Encyclopedia of Technical Market Indicators (book)'],
  },
  {
    id: 'momentum', name: 'Momentum', category: 'momentum', engine: 'momentum', params: 'n=10', chart: null, evidence: 'mixed',
    definition: `Momentum is the price difference between the current close and the close n bars ago, in price units.`,
    purpose: `To show the speed and direction of price change in the simplest possible way. Many more complex oscillators (MACD, RSI, ROC) are refinements of this one idea, so understanding Momentum helps you see why those tools agree with each other so often.`,
    formula: `:::formula
Momentum(t) = C(t) - C(t-n)
:::
The engine returns null for the first n bars. It equals ROC multiplied by the old price, divided by 100.`,
    calc: `Nifty 15-minute, {{n = 10}}: close now 22,560, 10 bars ago 22,200.

- Momentum = **+360 points**

Bank Nifty with the same percentage move from 48,000 would show about +778 points. That is why Momentum values cannot be compared across instruments; use ROC for that.`,
    interpretation: `Above zero: higher than n bars ago. Rising: accelerating. Falling while positive: slowing, not reversing. Peaks in Momentum often come before price peaks because acceleration fades first.`,
    bullish: `Zero-line cross upward; higher lows in Momentum while price makes equal lows.`,
    bearish: `Zero-line cross downward; lower highs while price makes equal highs.`,
    example: `On a Nifty 15-minute uptrend, Momentum(10) peaks mid-morning and declines while the index continues upward slowly; the trend has lost speed but not direction. The Chart Lab has no Momentum token; macd shows a smoothed version of the same idea.`,
    entryExit: `- Use as a slowing warning: tighten stops when Momentum falls for several bars against your position.
- Zero cross with a trend filter, if used as a trigger at all.
- Never short just because Momentum peaked; a slowing advance can continue for a long time, and a later re-acceleration often follows a sideways pause.
- Convert any rule to ROC before applying it to a different instrument.`,
    bestConditions: `Trending markets where you want to monitor speed.`,
    weaknesses: `> [!warn] Raw, unsmoothed and unbounded. Highly noisy and sensitive to the bar n periods back.

It says nothing that ROC does not; scale makes it awkward across instruments and across volatility regimes. A 100-point Momentum reading on Nifty was large in a quiet year and small in a volatile one. The choice of n is arbitrary and changes the zero-cross timing directly: n = 5 turns quickly and whipsaws, n = 20 lags but is calmer.

> [!evidence] Mixed. See ROC: longer-horizon momentum research does not validate intraday Momentum signals.`,
    mistakes: `- Reading a Momentum peak as a price top.
- Comparing values between instruments with different prices.
- Smoothing it heavily and then believing it is a new indicator; a smoothed Momentum is close to MACD.
- Using a fixed threshold such as "+100 points" across months of very different volatility.`,
    timeframes: `Any; n = 10 to 20 bars is common.`,
    combinations: `Redundant with ROC and close to MACD. Pair with ATR (to normalise) and structure.`,
    practice: `1. From the Chart Lab crosshair readout (the O, H, L, C, V legend), compute Momentum(10) for ten consecutive bars and plot them on paper.
2. Compare the Momentum peak bar with the price peak bar; record the gap.
3. Convert three Momentum values to ROC and confirm the relationship.`,
    refs: ['Martin J. Pring — Technical Analysis Explained (book)', 'John J. Murphy — Technical Analysis of the Financial Markets (book)'],
  },
  {
    id: 'volume', name: 'Volume', category: 'volume', engine: null, params: 'raw bar volume; optional n=20 average for comparison', chart: 'vol', evidence: 'established',
    definition: `Volume is the number of shares or contracts traded during a bar. It is raw data, not a derived indicator, and it is the input to every volume-based tool in this library.`,
    purpose: `To judge participation: how much trading accompanied a price move. A move on heavy volume involved more trading than the same move on thin volume, which matters for liquidity, slippage and how seriously to take a breakout.`,
    formula: `:::formula
Relative volume (RVOL) = V(t) / SMA(V, n)
Time-of-day RVOL = V(t) / average V of the same time slot over the last N sessions
:::
Volume has no engine function because it is a raw field ({{v}} on each candle). RVOL can be computed with {{IA.ind.sma}} applied to the volume array.`,
    calc: `A Reliance 5-minute bar trades 4.2 lakh shares. The average of the last 20 bars is 1.4 lakh.

- RVOL = 4.2/1.4 = **3.0**, three times the recent average.

But the first 5-minute bar after 09:15 is normally the heaviest of the day. If the average 09:15 bar over the last 10 sessions is 5.0 lakh, time-of-day RVOL = 4.2/5.0 = **0.84**: below normal for that slot. The two measures tell opposite stories, so always ask "compared with what?"`,
    interpretation: `Rising price with rising volume: broad participation in the advance. Rising price on falling volume: fewer participants, which some read as weakening (not a reliable sell signal on its own). Volume spikes mark events: news, index rebalancing, block deals, option expiry, stop runs. Intraday volume follows a U-shape: heavy at open and close, light at midday.`,
    bullish: `A breakout above resistance on clearly above-normal (time-adjusted) volume; pullbacks on light volume in an uptrend.`,
    bearish: `Breakdown on heavy volume; rallies on light volume in a downtrend; a big-volume bar that closes near its low after an advance.`,
    example: `On a Reliance 5-minute chart, the opening bars and the 15:00 to 15:30 window carry the heaviest volume. A midday breakout on volume that looks "low" may actually be strong for that time of day.
[[chart:RELIANCE:8:vol,vwap]]
> [!india] Spot Nifty and Bank Nifty have no traded volume of their own; use the near-month future or an index ETF for volume. Volume figures on F&O are in contracts or shares depending on the platform; check the unit.

On SPY, the US session shows the same U-shape.`,
    entryExit: `- Confirm breakouts: require time-of-day RVOL above about 1.5 before trusting a range break (a threshold you should test, not a rule).
- Avoid entering in the illiquid lunch period on thin stocks; slippage is higher.
- Exit or tighten when a large-volume bar prints against your position near a key level.`,
    bestConditions: `Centralised exchange-traded instruments with reliable volume (NSE stocks and futures, US-listed stocks). Spot forex has no consolidated volume; tick volume is only a proxy.`,
    weaknesses: `> [!warn] Volume tells you how much traded, not who traded or why. Every share bought was sold by someone, so "buying volume" is an interpretation of price action, not a measurement.

Volume is distorted by expiry, index rebalancing, block and bulk deals, and algorithmic activity. US volume is fragmented across many venues and dark pools, so chart volume may be consolidated or not depending on the feed.

> [!evidence] Established as data. Interpretations such as "volume precedes price" are mixed in the evidence.`,
    mistakes: `- Comparing a 09:15 bar's volume with a 12:30 bar's volume without time-of-day adjustment.
- Calling a heavy bar "institutional buying"; jargon is not evidence.
- Reading volume on spot indices.`,
    timeframes: `All. Daily volume gives context for liquidity; 1 to 15-minute volume for intraday participation.`,
    combinations: `Price structure (breakouts, ranges), VWAP and Volume Profile (both built from volume). OBV, A/D, CMF and MFI are transformations of the same data and add interpretation, not new information.`,
    practice: `1. Load RELIANCE seed 8 with vol. Note the volume of the first three bars and three midday bars; calculate the ratio.
2. Find every bar with RVOL above 2 (versus a 20-bar average) and classify each as breakout, reversal or noise after the fact.
3. Journal a rule that uses time-of-day volume, not raw volume.`,
    refs: ['Buff Dormeier — Investing with Volume Analysis (book)', 'NSE — Market data and F&O contract specifications (nseindia.com)', 'Larry Harris — Trading and Exchanges: Market Microstructure for Practitioners (book)'],
  },
  {
    id: 'vwap', name: 'VWAP (Volume-Weighted Average Price)', category: 'volume', engine: 'vwap', params: 'session reset each calendar day', chart: 'vwap', evidence: 'established',
    definition: `VWAP is the average price paid for every unit traded since the session began, weighting each bar's typical price by its volume. It resets at the start of each session.`,
    purpose: `It is an execution benchmark: institutions and brokers measure fills against VWAP, and VWAP algorithms try to trade in line with it. Intraday traders use it as a fair-value reference and trend filter.`,
    formula: `:::formula
TP = (H + L + C) / 3
VWAP(t) = Sum[ TP(i) x V(i) ] / Sum[ V(i) ]   from the session's first bar to t
:::
The engine resets when the candle's date changes. True VWAP uses every trade; a bar-based VWAP is an approximation that improves on smaller bars.`,
    calc: `First three Reliance 5-minute bars (H, L, C; volume in lakh shares):

| Bar | H | L | C | TP | V | TP x V |
|---|---|---|---|---|---|---|
| 1 | 1,460 | 1,440 | 1,450 | 1,450.00 | 2.0 | 2,900.0 |
| 2 | 1,475 | 1,450 | 1,470 | 1,465.00 | 1.5 | 2,197.5 |
| 3 | 1,480 | 1,465 | 1,468 | 1,471.00 | 1.0 | 1,471.0 |

- After bar 1: 2,900/2.0 = **₹1,450.00**
- After bar 2: 5,097.5/3.5 = **₹1,456.43**
- After bar 3: 6,568.5/4.5 = **₹1,459.67**

The heavy first bar anchors VWAP below current price.`,
    interpretation: `Price above VWAP: the average buyer today is in profit, and the session bias is up. Below: the reverse. As the session goes on, VWAP becomes slower to move because cumulative volume grows, so late-day crosses carry less meaning than early ones.`,
    bullish: `Price holds above VWAP on pullbacks; reclaims VWAP after an early dip with rising volume; VWAP itself sloping up.`,
    bearish: `Price rejected at VWAP from below; loses VWAP and fails to reclaim; VWAP sloping down.`,
    example: `On a Nifty futures 5-minute chart, a trend day often shows price staying on one side of VWAP for hours, with pullbacks to it. A range day shows repeated crosses.
[[chart:NIFTY:42:vwap,ema20,vol]]
> [!india] Use the Nifty or Bank Nifty future, not the spot index, because the spot index has no traded volume.

On SPY, VWAP is widely used as an execution benchmark by US desks.`,
    entryExit: `- Trend-day pullback: in a session holding above a rising VWAP, buy a higher low near VWAP, stop below the pullback low.
- Reclaim: after an opening dip, a decisive close back above VWAP with volume; stop below the reclaim bar.
- Avoid trades in the first few minutes when VWAP is based on very little data.`,
    bestConditions: `Liquid, centrally traded instruments within a single session.`,
    weaknesses: `> [!warn] VWAP is not support or resistance by law. On trend days price can cross it once and never return; on range days it gets crossed many times.

It becomes insensitive late in the session. Opening auction prints and block deals can shift it. It cannot be computed meaningfully without reliable volume.

> [!evidence] Established as an execution benchmark and definition. Its use as a trading signal is mixed.`,
    mistakes: `- Plotting VWAP on a spot index.
- Fading every move away from VWAP, assuming price must return.
- Expecting your VWAP to match the broker's exactly; trade-level and bar-level calculations differ slightly.`,
    timeframes: `Intraday only (1 to 15-minute charts). On daily charts session VWAP is a single number per day.`,
    combinations: `Standard-deviation bands around VWAP, Volume Profile (POC and value area), opening range. Overlaps with a 20-EMA as a trend filter on many days. Anchored VWAP extends the idea to any start point.`,
    practice: `1. Load NIFTY seed 42 with vwap and vol. Count VWAP crosses before 11:00 and after 13:00.
2. Recompute VWAP for the first three bars by hand from the crosshair readout.
3. Journal every VWAP pullback entry you would have taken and the result.`,
    refs: ['Berkowitz, Logue, Noser — The Total Cost of Transactions on the NYSE, Journal of Finance (1988)', 'Barry Johnson — Algorithmic Trading and DMA (book)', 'Brian Shannon — Maximum Trading Gains with Anchored VWAP (book)'],
  },
  {
    id: 'anchored-vwap', name: 'Anchored VWAP (AVWAP)', category: 'volume', engine: 'anchoredVwap', params: 'anchor = bar index chosen by the trader', chart: null, evidence: 'mixed',
    definition: `Anchored VWAP is a VWAP that starts at a bar you choose instead of the session open, and accumulates from there without resetting.`,
    purpose: `To measure the average price paid by everyone who traded since a specific event: a swing low, a gap, an earnings release, the budget speech, or the start of a week.`,
    formula: `:::formula
AVWAP(t) = Sum[ TP(i) x V(i) ] / Sum[ V(i) ]   for i from anchor to t
TP = (H + L + C) / 3
:::
The engine returns null before the anchor and does not reset by date.`,
    calc: `Anchor a Reliance chart at the 09:15 bar of results day; use the same bars as the VWAP example.

- From bar 1: ₹1,450.00, ₹1,456.43, ₹1,459.67, identical to session VWAP because the anchor is the session start.
- Next day bar 1: H 1,470, L 1,455, C 1,462, TP 1,462.33, V 2.5. Session VWAP resets to ₹1,462.33. AVWAP continues: (6,568.5 + 3,655.83)/(4.5 + 2.5) = 10,224.33/7.0 = **₹1,460.62**.

The anchored line keeps the previous day's buyers in the average.`,
    interpretation: `Price above an AVWAP anchored at a low: the average participant since that low is in profit. A return to AVWAP is where that group is back at breakeven; some traders expect reactions there. The choice of anchor carries all the meaning.`,
    bullish: `Price holds above AVWAP from a significant low; reclaims AVWAP from an important high.`,
    bearish: `Price fails at AVWAP anchored from a major high; loses AVWAP from a swing low.`,
    example: `Anchor AVWAP at a Nifty future's budget-day low on the 15-minute chart; over the following sessions, pullbacks towards it can be watched as reference points. Anchor at an NVDA earnings gap open for the US equivalent. The Chart Lab does not yet offer an anchor selection token; use vwap for a session anchor and compute multi-day AVWAP from the crosshair readout.`,
    entryExit: `- Anchor only at objective events (gap, results, macro release, clear swing extreme), decided before you look at subsequent price.
- Pullback entries towards AVWAP in the trend direction, stop beyond it by a volatility buffer (for example 0.5 ATR).
- Use several AVWAPs from opposing anchors to map where different groups are in profit or loss.`,
    bestConditions: `Instruments with a clear event that changed participation; multi-day swings on intraday charts.`,
    weaknesses: `> [!warn] Anchor selection is subjective, and choosing anchors after the fact lets you find a line that "worked" on any chart.

It becomes slow as cumulative volume grows. Like VWAP, it needs reliable volume. The idea that traders defend their breakeven is plausible but not proven.

> [!evidence] Mixed. The calculation is exact; reaction at AVWAP is anecdotal and selection-biased.`,
    mistakes: `- Moving the anchor until the line fits past touches.
- Drawing ten AVWAPs, so that price is always near one.
- Using spot index data.`,
    timeframes: `5-minute to hourly for multi-session swings; daily for longer anchors.`,
    combinations: `Session VWAP, Volume Profile, pivots, swing structure. Redundant with session VWAP when anchored at the open.`,
    practice: `1. Pick an event bar in any Chart Lab RELIANCE seed; compute AVWAP for the next five bars by hand from the crosshair readout.
2. Write down your anchor rule before looking at the chart, then apply it to three seeds and journal what happened at the line.
3. Compare session vwap with your AVWAP on day two and explain the difference.`,
    refs: ['Brian Shannon — Maximum Trading Gains with Anchored VWAP (book)', 'Andrew Coles and David Hawkins — MIDAS Technical Analysis: A VWAP Approach to Trading and Investing in Today\'s Markets (book; describes Paul Levine\'s MIDAS method, the forerunner of anchored VWAP)'],
  },
  {
    id: 'obv', name: 'On-Balance Volume (OBV)', category: 'volume', engine: 'obv', params: 'none', chart: 'obv', evidence: 'mixed',
    definition: `OBV, from Joe Granville, is a running total that adds the full bar volume when the close is up and subtracts it when the close is down. Unchanged closes add nothing.`,
    purpose: `To summarise whether volume has been larger on up-closes or down-closes, looking for divergences between OBV and price.`,
    formula: `:::formula
If C(t) > C(t-1): OBV(t) = OBV(t-1) + V(t)
If C(t) < C(t-1): OBV(t) = OBV(t-1) - V(t)
If C(t) = C(t-1): OBV(t) = OBV(t-1)
:::
The engine starts at 0 on the first bar. The absolute level is meaningless; only its direction and divergences matter.`,
    calc: `Five Nifty futures 5-minute bars (closes, volume in thousand contracts):

| Close | Vol | OBV |
|---|---|---|
| 22,500 | 5 | 0 (start) |
| 22,510 | 3 | +3 |
| 22,505 | 4 | -1 |
| 22,505 | 2 | -1 |
| 22,520 | 6 | **+5** |

A 1-point up close counts the full 6,000 as "up volume", the same as a 50-point close would. That crudeness is OBV's main limitation.`,
    interpretation: `OBV rising with price: volume favours up-closes. OBV flat while price rises: weaker participation in the advance, by this measure. OBV breaking out before price is sometimes read as a lead, but that is not reliable.`,
    bullish: `OBV makes higher highs with price; OBV makes a higher low while price makes a lower low (bullish divergence).`,
    bearish: `OBV lower highs while price makes a higher high (bearish divergence).`,
    example: `On a Bank Nifty futures 15-minute chart, OBV can trend up steadily through a rally and then flatten while price makes a final marginal high. That flattening is a warning, not a signal.
[[chart:BANKNIFTY:12:obv,vol]]`,
    entryExit: `- Use OBV divergence only as a reason to tighten stops or skip new entries.
- Breakout confirmation: a price breakout with OBV also at new highs is consistent; a breakout with OBV well below its high is less so.`,
    bestConditions: `Stocks and futures with reliable volume; multi-hour swings.`,
    weaknesses: `> [!warn] OBV classifies an entire bar's volume by the sign of a single close change. A doji that closes one tick higher adds all its volume.

One huge-volume bar can shift OBV for the rest of the chart. Starting point affects its absolute level, which is why only shape matters.

> [!evidence] Mixed. Granville's claims that volume leads price have not been consistently supported.`,
    mistakes: `- Comparing OBV values across instruments or start dates.
- Reading every small divergence as a reversal signal.
- Using OBV, A/D and CMF together as independent confirmations.`,
    timeframes: `15-minute to daily. On 1-minute charts the up/down classification is close to random.`,
    combinations: `Price structure and trend filters. Overlaps with A/D Line and CMF, which use close location within the bar instead of close-to-close change.`,
    practice: `1. Load BANKNIFTY seed 12 with obv and vol. Find one bearish and one bullish OBV divergence and record what followed.
2. Recompute OBV for five bars from the crosshair readout.
3. Compare OBV with the A/D line computed by hand on the same five bars.`,
    refs: ['Joseph Granville — Granville\'s New Key to Stock Market Profits (book, 1963)', 'John J. Murphy — Technical Analysis of the Financial Markets (book)'],
  },
  {
    id: 'cmf', name: 'Chaikin Money Flow (CMF)', category: 'volume', engine: 'cmf', params: 'n=20', chart: null, evidence: 'mixed',
    definition: `CMF, by Marc Chaikin, averages the Money Flow Multiplier (where the close sits within the bar's range) weighted by volume over n bars. It oscillates between -1 and +1.`,
    purpose: `To show whether, over a window, closes have tended to be near the highs on heavy volume (positive) or near the lows (negative).`,
    formula: `:::formula
MFM = ( (C - L) - (H - C) ) / (H - L)    (between -1 and +1; 0 if H = L)
CMF = Sum[ MFM x V ] / Sum[ V ]   over the last n bars
:::
MFM is +1 when the close equals the high, -1 when it equals the low, 0 at mid-range. Chaikin's original setting is often given as 21 bars; 20 is a common platform default and the engine's.`,
    calc: `Three Reliance bars (n = 3), from the VWAP example:

| Bar | H | L | C | MFM | V | MFM x V |
|---|---|---|---|---|---|---|
| 1 | 1,460 | 1,440 | 1,450 | 0.00 | 2.0 | 0.00 |
| 2 | 1,475 | 1,450 | 1,470 | 0.60 | 1.5 | 0.90 |
| 3 | 1,480 | 1,465 | 1,468 | -0.60 | 1.0 | -0.60 |

- CMF = 0.30/4.5 = **+0.067**, mildly positive.`,
    interpretation: `Above 0: volume-weighted closes near highs. Below 0: near lows. Values beyond plus or minus 0.2 to 0.25 are often called strong; the threshold is a convention.`,
    bullish: `CMF crosses above 0 and stays there; CMF positive during a breakout.`,
    bearish: `CMF below 0 and falling; negative CMF while price rises (divergence).`,
    example: `On Reliance 15-minute during a rally, CMF stays positive; if the stock begins closing near bar lows while drifting higher, CMF turns negative before price does. On SPY the same reading applies. The Chart Lab has a CMF toggle (CMF 20); load it beside obv and vol, and compute CMF for a few bars from the crosshair readout.`,
    entryExit: `- Filter: avoid longs when CMF(20) is negative; avoid shorts when positive.
- Divergence as a warning for existing positions.`,
    bestConditions: `Liquid stocks; 15-minute and higher timeframes.`,
    weaknesses: `> [!warn] It ignores gaps. A stock that gaps up 3% and closes at the bar low scores -1 for that bar despite the rise.

Close location within a bar is a crude proxy for buying or selling pressure. Thresholds are arbitrary.

> [!evidence] Mixed. A reasonable description of close location weighted by volume; edge not established.`,
    mistakes: `- Calling CMF a measure of "money flowing in"; it measures close location.
- Ignoring the gap problem on Indian stocks that gap at 09:15.
- Using CMF and A/D as two confirmations.`,
    timeframes: `15-minute to daily.`,
    combinations: `Redundant with the A/D line (CMF is a windowed, normalised A/D). Pair with trend filters and price levels instead.`,
    practice: `1. Compute MFM for ten bars in any Chart Lab RELIANCE seed and then CMF(10).
2. Find a gap bar and note how CMF scored it compared with the price change.
3. Journal whether CMF would have changed any decision you made using obv.`,
    refs: ['Marc Chaikin — Chaikin Money Flow (described in Achelis, Technical Analysis from A to Z)', 'Steven B. Achelis — Technical Analysis from A to Z (book)'],
  },
  {
    id: 'ad-line', name: 'Accumulation/Distribution Line (A/D)', category: 'volume', engine: 'adl', params: 'none', chart: null, evidence: 'mixed',
    definition: `The A/D line, also from Marc Chaikin, is a running total of Money Flow Multiplier times volume. Unlike OBV, it weights each bar's volume by where the close sits within that bar's range.`,
    purpose: `To track cumulative close-location pressure, and to compare it with price for divergence. Chaikin's idea was that closes near the top of a bar's range on large volume show buyers in control of that bar, and that summing this over time reveals whether pressure has been building or fading behind the price trend.`,
    formula: `:::formula
MFM = ( (C - L) - (H - C) ) / (H - L)    (0 if H = L)
A/D(t) = A/D(t-1) + MFM(t) x V(t)
:::
The engine starts the sum at 0. Absolute level is meaningless.`,
    calc: `Same three Reliance bars as the CMF example:

- Bar 1: MFM 0, V 2.0. A/D = **0**.
- Bar 2: MFM 0.6, V 1.5. A/D = 0 + 0.9 = **0.90**.
- Bar 3: MFM -0.6, V 1.0. A/D = 0.9 - 0.6 = **0.30**.

Bar 3 closed slightly lower than bar 2 (₹1,468 vs ₹1,470), and A/D fell. OBV would have subtracted the whole 1.0. A/D subtracted only 0.6 because the close was not at the bar low.`,
    interpretation: `Rising A/D: closes tend to be in the upper part of bars, weighted by volume. Falling A/D: closes tend to be in the lower part. Divergence from price is the main use. Because the line is cumulative, a single extreme bar can shift its level permanently; look at slope over the last 20 to 50 bars rather than the absolute value.`,
    bullish: `A/D rising while price is flat or declining (bullish divergence).`,
    bearish: `A/D falling while price rises.`,
    example: `On a Nifty future's 15-minute chart, a slow rally where bars repeatedly close near their lows shows a falling A/D line despite rising closes. That divergence describes weak closes, not hidden selling by any particular group. The Chart Lab has no A/D token; compare with obv on the same chart.`,
    entryExit: `- Warning and filter only. Do not take entries on A/D alone.
- Tighten stops on long positions when A/D diverges negatively for an extended period.
- Skip new breakout entries when A/D is making lower highs into the breakout; wait for a retest instead.`,
    bestConditions: `Stocks with moderate gaps; multi-session swings.`,
    weaknesses: `> [!warn] Ignores gaps entirely; a gap up with a weak close lowers A/D. Small-range bars with closes at extremes get full weight.

Divergences can last a long time without any price consequence. In India, many stocks gap at 09:15 almost every day, so a large part of the price movement is invisible to A/D. Intraday on 1-minute bars, close location is close to random and the line wanders.

> [!evidence] Mixed. Same status as OBV and CMF: a factual summary of close location, with no reliable published edge.`,
    mistakes: `- Interpreting "accumulation" literally as institutional buying.
- Using A/D, OBV and CMF as three confirmations.
- Comparing A/D values across instruments.`,
    timeframes: `15-minute to daily. Shorter timeframes make the close-location measure noisy.`,
    combinations: `Redundant with CMF and largely with OBV. Combine with structure and a trend filter.`,
    practice: `1. Compute A/D and OBV by hand for the same eight bars of a Chart Lab seed and list where they disagree.
2. Find a gap bar and note how A/D treated it.
3. Journal which one volume-flow tool you will keep, and why.`,
    refs: ['Marc Chaikin — Accumulation/Distribution (described in Achelis)', 'Steven B. Achelis — Technical Analysis from A to Z (book)'],
  },
  {
    id: 'mfi', name: 'Money Flow Index (MFI)', category: 'volume', engine: 'mfi', params: 'n=14', chart: null, evidence: 'mixed',
    definition: `MFI is a volume-weighted RSI. It separates "raw money flow" (typical price times volume) into positive and negative depending on whether typical price rose or fell, and scales the ratio to 0 to 100.`,
    purpose: `To combine momentum and volume in one bounded oscillator.`,
    formula: `:::formula
TP = (H + L + C) / 3
Raw flow = TP x V
Positive flow = sum of raw flow where TP(t) > TP(t-1), over n bars
Negative flow = sum of raw flow where TP(t) < TP(t-1), over n bars
MFI = 100 - 100 / (1 + Positive / Negative)
:::
The engine uses plain sums over n bars (not Wilder smoothing), skips bars with unchanged TP, and returns 100 if negative flow is 0.`,
    calc: `Reliance, {{n = 3}}. Typical prices: ₹1,500 (previous), 1,504, 1,498, 1,506; volumes (lakh) 12, 8, 15.

- 1,504 > 1,500: positive flow 1,504 x 12 = 18,048
- 1,498 < 1,504: negative flow 1,498 x 8 = 11,984
- 1,506 > 1,498: positive flow 1,506 x 15 = 22,590
- Positive = 40,638; Negative = 11,984; ratio = 3.39
- MFI = 100 - 100/4.39 = **77.2**`,
    interpretation: `Above 80: strong positive money flow (overbought by convention). Below 20: oversold. Like RSI, MFI stays extreme in trends.`,
    bullish: `MFI recovering from below 20 in a range; bullish divergence.`,
    bearish: `MFI falling from above 80; bearish divergence.`,
    example: `On Reliance 15-minute, a results-day rally pushes MFI above 90 for many bars; fading it would have lost. In a quiet range, MFI turns near 20 and 80 at range edges. The Chart Lab has an MFI toggle (MFI 14); load it beside rsi and vol to see where the two differ on volume-spike bars.`,
    entryExit: `- Same tactics as RSI: fade extremes only in ranges, use mid-range readings for pullback timing in trends.
- Structure stops always.`,
    bestConditions: `Liquid stocks and futures with reliable volume, in ranges.`,
    weaknesses: `> [!warn] Not smoothed (in this engine), so jumpier than RSI. A single huge-volume bar can swing MFI sharply for n bars.

Positive/negative flow depends on the sign of the TP change only; a tiny rise with huge volume counts fully.

> [!evidence] Mixed. A volume-weighted RSI; no independent evidence of superior signals.`,
    mistakes: `- Using MFI and RSI together as two votes.
- Calling MFI a measure of actual money entering a stock.
- Ignoring expiry and block-deal volume spikes.`,
    timeframes: `15-minute to daily. On 1 to 5-minute bars, volume spikes dominate the reading.`,
    combinations: `Redundant with RSI (and partly with CMF). Pair with trend filters and price levels.`,
    practice: `1. Compute MFI(3) for a short run of bars from the Chart Lab crosshair readout (the O, H, L, C, V legend) as in the calc.
2. Compare where MFI and RSI would differ on a bar with a volume spike.
3. Journal one situation where you would prefer MFI over RSI.`,
    refs: ['Gene Quong and Avrum Soudack — Money Flow Index (Technical Analysis of Stocks and Commodities, 1989)', 'Steven B. Achelis — Technical Analysis from A to Z (book)'],
  },
  {
    id: 'volume-profile', name: 'Volume Profile', category: 'volume', engine: 'volumeProfile', params: 'bins=24, valueArea=0.7', chart: 'vp', evidence: 'mixed',
    definition: `Volume Profile is a histogram of traded volume by **price** rather than by time, drawn sideways on the chart. It shows at which prices the most trading took place over a chosen period.`,
    purpose: `To find the Point of Control (POC, highest-volume price), the Value Area (the price band holding a chosen share of volume, usually 70%), and low-volume areas where price moved quickly.`,
    formula: `:::formula
Range = lowest low to highest high of the period, split into B equal bins
Each bar's volume is spread evenly across the bins its range touches
POC = midpoint of the highest-volume bin
Value Area: start at POC, repeatedly add the larger neighbouring bin (above or below) until the area holds 70% of total volume
VAH / VAL = top / bottom of the value area
:::
The engine uses 24 bins by default and spreads volume uniformly within each bar's high-low. It grows the value area one bin at a time (ties go upward); the traditional CBOT Market Profile method compares the next **two** price rows above with the next two below, so value-area edges can differ by a bin from other platforms. Real volume-at-price data from ticks would be more precise.`,
    calc: `Three Nifty futures bars, 6 bins of 20 points from 22,400 to 22,520:

- Bar A: 22,400 to 22,440, 300 contracts, touches bins 0 to 2, 100 each.
- Bar B: 22,420 to 22,460, 600, bins 1 to 3, 200 each.
- Bar C: 22,440 to 22,520, 400, bins 2 to 5, 100 each.

Bin volumes: 100, 300, 400, 300, 100, 100. Total 1,300; 70% is 910.

- POC = bin 2 (22,440 to 22,460), price **22,450**.
- Add neighbours: bin 3 (300) then bin 1 (300): 1,000 > 910. Value area 22,420 to 22,480: **VAL 22,420, VAH 22,480**.`,
    interpretation: `High-volume nodes are prices where much trading happened; price often slows there. Low-volume nodes are prices traders passed through quickly. Open inside yesterday's value area suggests balance; open outside suggests possible imbalance, by Market Profile tradition.`,
    bullish: `Acceptance above the prior VAH (several bars of trading there); a pullback that holds a high-volume node.`,
    bearish: `Acceptance below the prior VAL; failure at a high-volume node from below.`,
    example: `On a Nifty futures 5-minute chart, plot the profile of the previous session. A gap open above VAH that holds suggests the market is exploring higher; a gap that falls back inside value often rotates towards POC.
[[chart:NIFTY:33:vp,vwap]]
On ES or SPY, the same concepts are used heavily by futures traders.`,
    entryExit: `- Value-area rule (tradition, not law): if price re-enters the prior value area and holds for two 30-minute periods, some traders look for a move towards the other side.
- Use POC and VAH/VAL as reference levels for stops and targets, with an ATR buffer.`,
    bestConditions: `Liquid futures and stocks with stable session structure.`,
    weaknesses: `> [!warn] Bin count and period choice change the POC and value area. A bar-based profile approximates the real distribution and can misplace volume inside wide bars.

Levels are descriptive. "Price must return to POC" is a tendency some observe, not a rule.

> [!evidence] Mixed. Volume-at-price is a factual description; trading rules built on it lack robust published validation.`,
    mistakes: `- Changing the bin count until levels match recent turns.
- Treating every low-volume node as a magnet or wall.
- Using spot index data with no real volume.`,
    timeframes: `Session and multi-session profiles on 1 to 30-minute data.`,
    combinations: `VWAP, pivots, opening range. Overlaps with VWAP (both summarise where volume traded) and with prior-day high/low.`,
    practice: `1. Load NIFTY seed 33 with vp and vwap. Note POC, VAH, VAL and record how price reacted at each over the session.
2. Recompute the toy profile above with 4 bins instead of 6 and see how POC moves.
3. Journal one rule based on value-area acceptance and test it on three seeds.`,
    refs: ['J. Peter Steidlmayer — Market Profile concepts (CBOT)', 'James Dalton — Mind Over Markets (book)', 'James Dalton — Markets in Profile (book)'],
  },
  {
    id: 'bollinger', name: 'Bollinger Bands', category: 'volatility', engine: 'bollinger', params: 'n=20, k=2', chart: 'bb', evidence: 'mixed',
    definition: `Bollinger Bands, by John Bollinger, are a 20-period SMA with bands k standard deviations above and below. The bands widen when prices disperse and narrow when they compress. The engine also returns Bandwidth and %B.`,
    purpose: `To give a volatility-adjusted envelope around price: describe whether price is high or low relative to its recent distribution, and spot volatility contraction (squeeze) and expansion.`,
    formula: `:::formula
Middle = SMA(C, n)
Upper = Middle + k x SD(C, n);   Lower = Middle - k x SD(C, n)
Bandwidth = (Upper - Lower) / Middle
%B = (C - Lower) / (Upper - Lower)
:::
The engine uses **population** standard deviation (divide by n), as Bollinger specifies. Some platforms use sample SD (divide by n-1), giving slightly wider bands.`,
    calc: `Use n = 5, k = 2 on Nifty closes 22,450, 22,430, 22,480, 22,500, 22,560.

- Middle = 22,484
- Squared deviations: 1,156 + 2,916 + 16 + 256 + 5,776 = 10,120; variance = 10,120/5 = 2,024; SD = **44.99**
- Upper = 22,484 + 89.98 = **22,573.98**; Lower = **22,394.02**
- Bandwidth = 179.96/22,484 = **0.80%**
- %B = (22,560 - 22,394.02)/179.96 = **0.92** (close near the upper band)`,
    interpretation: `%B above 1: close beyond the upper band. A close outside the band is not automatically overbought; in strong trends price "walks the band". Low Bandwidth (a squeeze) describes compressed volatility, which tends to be followed by expansion, but not in a predictable direction.`,
    bullish: `Squeeze followed by a close above the upper band with volume; in an uptrend, pullbacks holding the middle band; %B making a higher low while price makes a lower low near the lower band.`,
    bearish: `Close below the lower band after a squeeze; failures at the middle band in a downtrend; a high outside the band followed by a lower high inside it.`,
    example: `On a Nifty 5-minute chart, the late-morning lull often shows bands contracting to their narrowest of the day; the early-afternoon move then expands them.
[[chart:NIFTY:21:bb,vol]]
On BTC in quiet weekend hours, squeezes can persist for long periods with no breakout.`,
    entryExit: `- Range use: in a confirmed range (low ADX), fade touches of the outer bands back towards the middle; stop beyond the recent extreme.
- Breakout use: after a squeeze, enter on a close outside the band with volume; stop at the middle band or the opposite side of the squeeze.
- Trend use: in a strong trend, hold while price stays between the middle and outer band.`,
    bestConditions: `Ranges for fades; volatility contraction followed by catalysts for breakouts.`,
    weaknesses: `> [!warn] Price returns are not normally distributed, so "95% inside 2 SD" is not true in practice; fat tails mean band breaks are common and sometimes extreme.

The middle band is an SMA, so all moving-average lag applies. A squeeze says volatility may rise, not which way. Fading band touches in a trend is a common way to lose.

> [!evidence] Mixed. The calculation is exact; trading rules derived from bands have mixed results across studies and markets.`,
    mistakes: `- Selling every upper band touch.
- Assuming statistical probabilities from a normal distribution.
- Using Bollinger and Keltner as two independent confirmations of a squeeze; they measure related things.`,
    timeframes: `5 to 60-minute intraday. On 1-minute charts the bands react to every spike.`,
    combinations: `Keltner Channels (the classic squeeze test is Bollinger inside Keltner), RSI or %B for divergence, volume for breakouts. Redundant with Standard Deviation (same SD) and SMA (the middle band).`,
    practice: `1. Load NIFTY seed 21 with bb and vol. Find the narrowest bandwidth period and record the direction and size of the next expansion.
2. Recompute bands for one bar using n = 5 and population SD.
3. Mark every upper-band touch and journal how many were followed by a fall versus a continuation.`,
    refs: ['John Bollinger — Bollinger on Bollinger Bands (book)', 'John J. Murphy — Technical Analysis of the Financial Markets (book)'],
  },
  {
    id: 'atr', name: 'ATR (Average True Range)', category: 'volatility', engine: 'atr', params: 'n=14', chart: 'atr', evidence: 'established',
    definition: `ATR, from Wilder, is a smoothed average of the **true range**: the largest of the bar's high-low range and the gaps from the previous close. It measures how much an instrument typically moves per bar, in price units.`,
    purpose: `ATR is mostly a risk tool: it sets stop distances, position sizes and targets that scale with current volatility. It also feeds Supertrend and Keltner Channels.`,
    formula: `:::formula
TR = max( H - L, |H - C(t-1)|, |L - C(t-1)| )
ATR = RMA(TR, n) = ( ATR(t-1) x (n-1) + TR ) / n
:::
The engine uses H - L for the first bar (it has no previous close) and Wilder smoothing seeded by the SMA of the first n true ranges, so the first ATR appears on bar n. Some platforms start from bar 2 instead; the difference fades within a few multiples of n.`,
    calc: `Nifty 5-minute: H 22,600, L 22,540, previous close 22,510.

- H - L = 60; |22,600 - 22,510| = 90; |22,540 - 22,510| = 30. TR = **90** (a gap from the previous close made this bar's true range larger than its visible range).
- Previous ATR(14) = 40. New ATR = (40 x 13 + 90)/14 = **43.57 points**.

> [!india] Sizing: with ₹10,000 of risk per trade and a stop at 1.5 ATR (65 points), Nifty futures at 65 per lot (lot size for contracts from Jan 2026, as of Nov 2026 — verify on NSE) risk 65 x 65 = ₹4,225 per lot, so 2 lots fit (₹8,450); a third lot would take risk to ₹12,675. Use the position-size calculator to check.
[[widget:position-size]]`,
    interpretation: `High ATR: wide bars, more movement per bar, wider stops needed. Low ATR: compressed. ATR says nothing about direction. Rising ATR during a decline is common because falls are often faster than rises.`,
    bullish: `ATR is not directional. An expanding ATR in an uptrend shows growing range, which may accompany a strong move or a climax.`,
    bearish: `Same: no directional reading. Rising ATR in a downtrend shows accelerating ranges.`,
    example: `On a Bank Nifty 5-minute chart, ATR is typically highest in the first 30 minutes and lowest around lunch; a stop of 1 ATR at 09:20 is far wider in points than 1 ATR at 12:30.
[[chart:BANKNIFTY:5:atr,ema20]]`,
    entryExit: `- Stops: 1 to 2 ATR beyond entry or beyond structure.
- Size: quantity = risk in ₹ / (stop distance in points x lot multiplier).
- Targets: measure expected moves in ATR multiples, then check the risk-reward with the calculator.
- Avoid entries on extreme ATR spikes unless you size down.`,
    bestConditions: `Every market. It is a measurement, not a strategy.`,
    weaknesses: `> [!warn] ATR lags: after a sudden shock it takes several bars to rise. Intraday ATR is distorted by the time-of-day pattern; 14 bars at 09:30 includes the opening rush.

It is in price units, so compare across instruments using ATR as a percentage of price.

> [!evidence] Established as a volatility measure and a sound basis for risk sizing. It is not a signal.`,
    mistakes: `- Using a fixed point stop on every day regardless of ATR.
- Treating rising ATR as bullish or bearish.
- Forgetting gaps: daily ATR includes overnight gaps that intraday stops cannot protect against.`,
    timeframes: `Use the ATR of the chart you trade for stops; daily ATR for expected daily range.`,
    combinations: `Essential with every directional tool. Overlaps with Standard Deviation and Bollinger Bandwidth (all measure dispersion); ATR includes gaps and intrabar ranges, SD uses only closes.`,
    practice: `1. Load BANKNIFTY seed 5 with atr. Record ATR at 09:30, 12:30 and 15:00.
2. Use the position-size calculator to size a Bank Nifty futures trade (30 per lot as of Nov 2026 — verify on NSE) with a 1.5 ATR stop at each of those times.
3. Hand-compute two TR values including one with a gap.`,
    refs: ['J. Welles Wilder Jr. — New Concepts in Technical Trading Systems (book, 1978)', 'Van K. Tharp — Trade Your Way to Financial Freedom (position sizing) (book)'],
  },
  {
    id: 'keltner', name: 'Keltner Channels', category: 'volatility', engine: 'keltner', params: 'n=20 (EMA), m=2, ATR n=10', chart: 'kc', evidence: 'mixed',
    definition: `Keltner Channels are bands placed a multiple of ATR above and below an EMA. The modern version, credited to Linda Bradford Raschke in the 1980s, uses a 20-EMA and ATR; Chester Keltner's original used a 10-day average of typical price and average range.`,
    purpose: `A smoother, ATR-based envelope than Bollinger Bands, used to identify trend strength (closes outside the channel), pullback zones and squeezes.`,
    formula: `:::formula
Middle = EMA(C, 20)
Upper = Middle + 2 x ATR(10)
Lower = Middle - 2 x ATR(10)
:::
Engine defaults: n = 20, m = 2, ATR length 10 (Wilder-smoothed). Many platforms use different ATR lengths or multipliers (1.5, 2.25); always check.`,
    calc: `Reliance 15-minute: 20-EMA = ₹1,480, ATR(10) = ₹9.

- Upper = 1,480 + 18 = **₹1,498**
- Lower = 1,480 - 18 = **₹1,462**

A close at ₹1,501 is outside the upper channel, which describes an unusually strong bar relative to recent ranges. Compared with Bollinger, Keltner width changes more smoothly because ATR changes more slowly than standard deviation of closes.`,
    interpretation: `Closes outside the channel: strong directional pressure. Channel sloping up with price riding the upper half: uptrend. Price oscillating inside a flat channel: range. Bollinger Bands contracting inside Keltner: a "squeeze" (very low close-to-close dispersion compared with typical range).`,
    bullish: `Close above the upper channel in a rising channel; pullbacks to the middle EMA that hold.`,
    bearish: `Close below the lower channel; rallies failing at the middle EMA.`,
    example: `On a Reliance 15-minute chart, overlay kc and bb together; in quiet sessions the Bollinger Bands slip inside Keltner, then expand back outside on the breakout bar.
[[chart:RELIANCE:21:kc,bb]]
On GOLD futures a similar squeeze can appear before scheduled US data.`,
    entryExit: `- Trend pullback: in a rising channel, buy near the middle EMA, stop beyond the lower band or the swing low.
- Breakout: close outside the channel after a squeeze, with volume.
- Exit when price closes back on the opposite side of the middle line.`,
    bestConditions: `Trending markets for pullbacks; volatility compression for squeezes.`,
    weaknesses: `> [!warn] Middle line is an EMA and lags; ATR lags too. In whipsaw markets, breakouts outside the channel fail often.

Parameter choices vary widely across platforms. The squeeze tells you that a breakout may come, not which way.

> [!evidence] Mixed. The construction is exact; trading rules have limited published validation.`,
    mistakes: `- Assuming a close outside the channel is overbought.
- Using Keltner, Bollinger and Donchian all at once as separate confirmations.
- Forgetting parameter differences between platforms.`,
    timeframes: `5 to 60-minute intraday.`,
    combinations: `Bollinger (squeeze), volume, ADX. Redundant with 20-EMA and ATR, from which it is built; overlaps with Supertrend.`,
    practice: `1. Load RELIANCE seed 21 with kc and bb. Mark each squeeze (Bollinger inside Keltner) and the direction of the next breakout.
2. Hand-compute channel values for one bar.
3. Journal two trades: one pullback to the middle line, one channel breakout.`,
    refs: ['Chester W. Keltner — How to Make Money in Commodities (book, 1960)', 'StockCharts ChartSchool — Keltner Channels (stockcharts.com; credits the EMA/ATR version to Linda Raschke, default 20, 2.0, 10)', 'John Carter — Mastering the Trade (squeeze concept) (book)'],
  },
  {
    id: 'donchian', name: 'Donchian Channels', category: 'volatility', engine: 'donchian', params: 'n=20', chart: 'dc', evidence: 'mixed',
    definition: `Donchian Channels, from Richard Donchian, plot the highest high and lowest low of the last n bars, with a midline halfway between. They are the simplest breakout bands.`,
    purpose: `To mark the recent range and define breakouts objectively; the basis of the "Turtle" breakout rules of the 1980s.`,
    formula: `:::formula
Upper = highest high over n bars (including the current bar)
Lower = lowest low over n bars
Middle = (Upper + Lower) / 2
:::
Because the engine includes the current bar, a "breakout" is seen when the upper band moves up. Many systems compare against the band from the previous bar instead.`,
    calc: `Nifty 15-minute: over the last 20 bars the highest high is 22,650 and the lowest low 22,380.

- Upper = **22,650**; Lower = **22,380**; Middle = **22,515**
- Channel width = 270 points

If the next bar's high is 22,662, the upper band rises to 22,662: a new 20-bar high. In this app the Tenkan and Kijun lines of Ichimoku are Donchian midlines of 9 and 26 bars.`,
    interpretation: `Price at the upper band: making new n-bar highs. A flat upper band: no new highs. A narrowing channel: compressing range. The midline is a neutral reference.`,
    bullish: `New n-bar high (upper band rising) with volume; pullback holding above the midline.`,
    bearish: `New n-bar low; failure below the midline.`,
    example: `On a Nifty 15-minute chart, a 20-bar Donchian channel covers a little under one full session (an NSE session has 25 fifteen-minute bars). A break above it in the morning session marks a clear range expansion.
[[chart:NIFTY:17:dc,vol]]
On DAX, the first-hour high and low (an opening range) is a closely related idea.`,
    entryExit: `- Breakout: enter on a new n-bar high (or above the previous bar's upper band), stop at the midline or 2 ATR.
- Exit: on a shorter-period Donchian (for example 10-bar low) for longs.
- Filter: only take breakouts in the direction of a higher-timeframe trend.`,
    bestConditions: `Trending markets with sustained moves after breakouts.`,
    weaknesses: `> [!warn] Breakout systems typically lose on many trades and depend on a few large winners; intraday ranges produce many false breakouts.

Bands change in steps when an extreme bar enters or leaves the window. The choice of n is arbitrary.

> [!evidence] Mixed. Trend-following breakout systems have a long history in futures over multi-month horizons; this does not establish an edge on intraday Nifty charts after costs.`,
    mistakes: `- Assuming that because the Turtle rules were profitable for some traders decades ago, they will be now.
- Trading every touch of the upper band without volume or trend filter.
- Confusing the current-bar band with the previous-bar band.`,
    timeframes: `15-minute and up for intraday breakouts; daily for swing systems.`,
    combinations: `ATR (for stops), volume, ADX. Overlaps with Ichimoku Tenkan/Kijun (midlines), opening-range breakout and prior-day high/low levels.`,
    practice: `1. Load NIFTY seed 17 with dc and vol. Record every new 20-bar high and whether price was higher 10 bars later.
2. Count losers versus winners and estimate the average winner-to-loser ratio.
3. Compute a 9-bar Donchian midline and compare it with Ichimoku Tenkan for the same bar.`,
    refs: ['Richard Donchian — trend-following rules (various writings)', 'Curtis Faith — Way of the Turtle (book)', 'Perry J. Kaufman — Trading Systems and Methods (book)'],
  },
  {
    id: 'stdev', name: 'Standard Deviation', category: 'volatility', engine: 'stdev', params: 'n=20', chart: null, evidence: 'established',
    definition: `Standard deviation measures how widely the last n closes are spread around their mean. The engine uses population SD (dividing by n), the same as Bollinger Bands.`,
    purpose: `To quantify close-to-close dispersion, as a volatility gauge or as the building block for Bollinger Bands, z-scores and VWAP bands.`,
    formula: `:::formula
Mean = SMA(C, n)
SD = sqrt( Sum[ (C(i) - Mean)^2 ] / n )
z-score = (C - Mean) / SD
:::
Sample SD divides by n - 1 and is slightly larger; the difference matters little for n = 20.`,
    calc: `Nifty closes 22,450, 22,430, 22,480, 22,500, 22,560 (n = 5):

- Mean = 22,484
- Deviations: -34, -54, -4, 16, 76; squares 1,156, 2,916, 16, 256, 5,776; sum 10,120
- Variance = 2,024; SD = **44.99 points**
- z-score of the last close = 76/44.99 = **1.69**

Sample SD would be sqrt(10,120/4) = 50.30, which is why platforms differ.`,
    interpretation: `High SD: closes widely dispersed. Low SD: compressed. A z-score above 2 means the close is far from its recent average by this measure. SD on prices (not returns) is in points, so compare across instruments as a percentage of price.`,
    bullish: `Not directional. Rising SD in a rising market means the advance is accelerating or volatile.`,
    bearish: `Not directional. Rising SD during a decline usually reflects fast selling.`,
    example: `On a Nifty 5-minute chart, SD(20) usually falls through the late-morning and rises after a breakout. The Chart Lab has no separate SD token; the width of bb is 4 SD at defaults, so watch the bands to see it.
[[chart:NIFTY:21:bb]]
For US stocks, compare SD of NVDA with SPY as a percentage to see relative volatility.`,
    entryExit: `- Mean-reversion research: fade z-scores beyond 2 only in confirmed ranges, stop beyond the extreme.
- Regime filter: avoid range strategies when SD is rising quickly.
- Volatility-adjusted sizing as an alternative to ATR.`,
    bestConditions: `Any market as a measurement; ranges for z-score fades.`,
    weaknesses: `> [!warn] Price changes have fat tails. A 3 SD move is far more common than a normal distribution suggests; do not convert z-scores to probabilities.

SD uses only closes, ignoring intrabar ranges and gaps. It lags like any rolling statistic.

> [!evidence] Established as a statistic. Trading rules based on z-scores are mixed.`,
    mistakes: `- Assuming 95% of prices fall within 2 SD.
- Comparing SD in points across instruments.
- Using SD and Bollinger width as separate signals.`,
    timeframes: `Any; n = 20 is common.`,
    combinations: `Redundant with Bollinger Bandwidth and closely related to ATR. Use one volatility measure plus directional tools.`,
    practice: `1. Compute population and sample SD by hand for five bars from the Chart Lab crosshair readout (the O, H, L, C, V legend).
2. Load NIFTY seed 21 with bb and convert the band width to SD for three bars.
3. Journal how many z-score above 2 readings occurred in a session and what followed.`,
    refs: ['John Bollinger — Bollinger on Bollinger Bands (book)', 'Benoit Mandelbrot and Richard Hudson — The (Mis)Behaviour of Markets (fat tails) (book)'],
  },
  {
    id: 'fib-retracement', name: 'Fibonacci Retracement', category: 'tool', engine: 'fibonacci', params: 'swing low, swing high, direction; ratios 0.236, 0.382, 0.5, 0.618, 0.786', chart: null, evidence: 'subjective',
    definition: `Fibonacci retracement draws horizontal levels between a swing low and swing high at fixed fractions of the move. The ratios come from the Fibonacci sequence (0.618 and 0.382) plus 0.5 and 0.786, which are conventions rather than Fibonacci numbers in the strict sense (0.5 is not a Fibonacci ratio).`,
    purpose: `To mark candidate pullback zones in a trend, before the pullback happens, so you can plan entries and stops.`,
    formula: `:::formula
Range D = Swing high - Swing low
Uptrend retracement level = Swing high - D x r
Downtrend retracement level = Swing low + D x r
r in { 0, 0.236, 0.382, 0.5, 0.618, 0.786, 1 }
:::
The engine returns both retracements and extensions from {{fibonacci(swingLow, swingHigh, uptrend)}}.`,
    calc: `Nifty rallies from 21,800 to 22,600 (D = 800 points).

| Ratio | Level |
|---|---|
| 0.236 | 22,411.2 |
| 0.382 | 22,294.4 |
| 0.5 | 22,200.0 |
| 0.618 | 22,105.6 |
| 0.786 | 21,971.2 |

If the decline instead ran from 22,700 to 22,100 (downtrend), the 0.618 retracement up would be 22,100 + 600 x 0.618 = **22,470.8**.`,
    interpretation: `Shallow pullbacks (to 0.236 to 0.382) are commonly associated with strong trends; deep ones (beyond 0.618) with weakening trends. Levels are zones, not lines. With five levels across a move, price will be near one of them most of the time, which is why "it bounced at a Fib" is weak evidence.`,
    bullish: `In an uptrend, price pulls back to a level that also coincides with other evidence (prior resistance turned support, VWAP, rising 20-EMA) and prints a bullish reversal bar.`,
    bearish: `In a downtrend, a rally stalls at a retracement level with a bearish reversal bar, ideally confluent with other resistance.`,
    example: `On a Bank Nifty 15-minute chart after a strong morning drive, mark the drive's low and high. The afternoon pullback might hold near the 0.5 level, which also coincides with VWAP; the confluence, not the ratio alone, is what traders watch. The Chart Lab has no Fib token; take swing values from the crosshair readout, compute the levels, and compare them with vwap.
[[chart:BANKNIFTY:44:vwap,ema20]]`,
    entryExit: `- Define the swing with an objective rule (for example, the session's high and low so far) before drawing.
- Enter only on a price confirmation at a level (reversal bar, higher low), stop beyond the next level or the swing, and size with ATR.
- Target the prior high (retest) or an extension.`,
    bestConditions: `Clear trends with obvious swing points.`,
    weaknesses: `> [!warn] Subjective anchor choice: different traders pick different swing points and get different levels. With many levels, hindsight always finds a "hit".

Claims that markets obey the golden ratio are not supported by robust evidence. Any reaction at a level may come from other traders watching it (self-fulfilling) or from coincidence with other structure.

> [!evidence] Subjective. The arithmetic is exact; the special status of these ratios is not established.`,
    mistakes: `- Redrawing swings until the levels fit.
- Treating each level as support without confirmation.
- Stopping exactly at a Fib level where many others stop.`,
    timeframes: `Any; most useful on 15-minute and above where swings are clearer.`,
    combinations: `VWAP, prior day high/low, pivots, Volume Profile for confluence. Keep the list short: with five Fib levels plus pivots, VWAP and profile levels on one chart, some "confluence" is almost guaranteed by chance. Overlaps with simple "half-back" (50%) retracement ideas and with pivot levels.`,
    practice: `1. In the Chart Lab, load BANKNIFTY seed 44; define swings with a written rule, compute the five levels and record which held.
2. Repeat with random levels (for example 0.3, 0.45, 0.7) and compare how often price "reacted".
3. Journal the result of the comparison honestly.`,
    refs: ['Robert Fischer — Fibonacci Applications and Strategies for Traders (book)', 'Constance Brown — Fibonacci Analysis (book)', 'John J. Murphy — Technical Analysis of the Financial Markets (book)'],
  },
  {
    id: 'fib-extension', name: 'Fibonacci Extensions', category: 'tool', engine: 'fibonacci', params: 'ratios 1.272, 1.618, 2.618 of the swing, measured from the swing start', chart: null, evidence: 'subjective',
    definition: `Fibonacci extensions project levels beyond the end of a swing, as multiples of the swing size. They are used as potential profit targets.`,
    purpose: `To plan exits for a trend continuation trade before price gets there.`,
    formula: `:::formula
D = Swing high - Swing low
Uptrend extension = Swing low + D x r
Downtrend extension = Swing high - D x r
r in { 1.272, 1.618, 2.618 }
:::
This engine measures from the swing's start, so the 1.272 level sits 0.272 x D beyond the swing extreme. Some platforms project from a pullback low (a three-point extension); the levels then differ.`,
    calc: `Nifty swing 21,800 to 22,600, D = 800.

- 1.272: 21,800 + 1,017.6 = **22,817.6**
- 1.618: 21,800 + 1,294.4 = **23,094.4**
- 2.618: 21,800 + 2,094.4 = **23,894.4**

Downtrend 22,700 to 22,100 (D = 600): 1.272 gives **21,936.8**, 1.618 gives **21,729.2**.

For a three-point version, if a pullback ended at 22,200, the 1.0 projection of the first leg would be 22,200 + 800 = 23,000, a different level.`,
    interpretation: `Extensions are only meaningful as targets, not as levels where reversals must happen. Most intraday swings do not reach 2.618, and many fail before 1.272. Think of them as a way to plan exits in advance rather than a forecast; a target fixed before entry protects you from the temptation to hold a winner until it turns into a loser.`,
    bullish: `Price breaking above the swing high and continuing towards 1.272 with volume.`,
    bearish: `Price breaking below the swing low towards the downside extensions.`,
    example: `After a Reliance 15-minute pullback holds and the stock breaks its morning high, a trader might set the first target at the 1.272 extension and trail the rest. On SPY the same logic applies to the first-hour range. The Chart Lab has no Fib token; compute levels from the crosshair readout and mark them in your journal.`,
    entryExit: `- Set a partial target at 1.272, trail the remainder with ATR or Supertrend.
- Check the risk-reward of the target with the calculator before entering.
[[widget:rr]]`,
    bestConditions: `Trending sessions with strong continuation.`,
    weaknesses: `> [!warn] Different anchoring methods (two-point vs three-point) produce different targets, and choosing after the fact always finds one that matched.

Extensions ignore volatility; an ATR-based target can be more consistent.

> [!evidence] Subjective. No robust evidence that these ratios outperform other target methods.`,
    mistakes: `- Holding to 2.618 on an intraday trade because "it must reach it".
- Mixing two-point and three-point methods without noticing.
- Ignoring costs on small targets.
- Moving the target further away once price nears it, which turns a planned exit into hope.`,
    timeframes: `15-minute and higher swings.`,
    combinations: `ATR multiples, prior-day levels, pivots R2/R3 or S2/S3, measured moves. Overlaps with those alternative target methods.`,
    practice: `1. For three swings in a Chart Lab seed, compute 1.272 and 1.618 extensions and record how often each was reached before the swing low broke.
2. Compare with a 2 ATR target on the same trades.
3. Use the rr widget to calculate the reward-to-risk of each target.`,
    refs: ['Robert Fischer — Fibonacci Applications and Strategies for Traders (book)', 'Constance Brown — Fibonacci Analysis (book)'],
  },
  {
    id: 'pivots', name: 'Pivot Points (Classic)', category: 'tool', engine: 'pivots', params: 'previous session H, L, C', chart: null, evidence: 'mixed',
    definition: `Classic (floor-trader) pivots are support and resistance levels computed from the previous session's high, low and close. They are fixed for the whole of the next session.`,
    purpose: `To give everyone the same objective reference levels before the open: a central pivot (P), three resistance (R1 to R3) and three support (S1 to S3) levels.`,
    formula: `:::formula
P = (H + L + C) / 3
R1 = 2P - L;  S1 = 2P - H
R2 = P + (H - L);  S2 = P - (H - L)
R3 = H + 2(P - L);  S3 = L - 2(H - P)
:::
The engine computes exactly these from {{pivots(h, l, c)}}.`,
    calc: `Previous Nifty session: H 22,640, L 22,400, C 22,580. Range = 240.

- P = (22,640 + 22,400 + 22,580)/3 = **22,540**
- R1 = 45,080 - 22,400 = **22,680**; S1 = 45,080 - 22,640 = **22,440**
- R2 = 22,540 + 240 = **22,780**; S2 = **22,300**
- R3 = 22,640 + 2 x 140 = **22,920**; S3 = 22,400 - 2 x 100 = **22,200**

For Reliance (H ₹1,500, L ₹1,470, C ₹1,492): P = ₹1,487.33, R1 = ₹1,504.67, S1 = ₹1,474.67.`,
    interpretation: `Open above P: bias up by convention; below P: down. R1/S1 are often reached on ordinary days; R2/S2 on wider days; R3/S3 only on trend days. Levels matter more when they coincide with other structure.`,
    bullish: `Price opens above P and holds it on pullbacks; break and hold above R1.`,
    bearish: `Open below P; rejection at P from below; break below S1.`,
    example: `On a Nifty 5-minute chart, plot the day's pivots before 09:15. Price often reacts around P in the first hour, though on a gap day it may start beyond R1 and never return. The Chart Lab has no pivot toggle (the Technical analysis Structure tab draws classic P, R1 and S1 for the last day); compute the rest from the prior day's high, low and close in the crosshair readout and compare with vwap.
[[chart:NIFTY:42:vwap,vol]]`,
    entryExit: `- Range days: fade R1/S1 back to P with a stop beyond the level by a buffer (0.5 ATR).
- Trend days: buy the break and hold above R1 targeting R2.
- Decide day type from the opening behaviour, not from the levels.`,
    bestConditions: `Liquid index futures and large caps where many participants watch the same levels.`,
    weaknesses: `> [!warn] Pivots ignore everything but three numbers from yesterday. On gap days they can be irrelevant. Different formulas (classic, Woodie, Fibonacci, Camarilla) give different levels, and with seven levels price is often near one.

Previous session definition varies: some platforms include pre-open or use futures data, giving different values.

> [!evidence] Mixed. Research on support and resistance levels published by FX firms (for example Carol Osler, Federal Reserve Bank of New York, 2000) found that intraday trends were interrupted at those levels more often than at arbitrary ones, but that work did not test floor-trader pivots specifically. Any effect at pivots is most plausibly from wide usage and order clustering.`,
    mistakes: `- Expecting every level to hold.
- Using spot and futures pivots interchangeably.
- Ignoring a gap that places the market beyond all levels.`,
    timeframes: `Daily pivots for intraday; weekly pivots for multi-day swings.`,
    combinations: `VWAP, Volume Profile, opening range, prior high/low. Overlaps with Camarilla (same input data, tighter levels) and Fibonacci-pivot variants.`,
    practice: `1. Compute pivots for a Chart Lab NIFTY seed from day one's H, L, C, and record how price behaved at each level on day two.
2. Repeat on a gap day and note which levels were irrelevant.
3. Journal day-type rules you would use before trading pivot fades.`,
    refs: ['Kathy Lien — Day Trading and Swing Trading the Currency Market (book)', 'Carol Osler — Support for Resistance: Technical Analysis and Intraday Exchange Rates, FRBNY Economic Policy Review (2000)', 'John Person — A Complete Guide to Technical Trading Tactics (book)'],
  },
  {
    id: 'camarilla', name: 'Camarilla Pivots', category: 'tool', engine: 'pivots', params: 'previous session H, L, C; returned as .camarilla', chart: null, evidence: 'mixed',
    definition: `Camarilla pivots, attributed to Nick Scott (1989), compute eight levels around the **previous close** using fixed fractions of yesterday's range times 1.1. They are tighter than classic pivots.`,
    purpose: `Intraday range and breakout levels. The common convention: fade at R3/S3, break out beyond R4/S4.`,
    formula: `:::formula
Range = H - L
R4 = C + Range x 1.1 / 2;   S4 = C - Range x 1.1 / 2
R3 = C + Range x 1.1 / 4;   S3 = C - Range x 1.1 / 4
R2 = C + Range x 1.1 / 6;   S2 = C - Range x 1.1 / 6
R1 = C + Range x 1.1 / 12;  S1 = C - Range x 1.1 / 12
:::
The engine returns these from {{pivots(h, l, c).camarilla}}.`,
    calc: `Previous Nifty session: H 22,640, L 22,400, C 22,580, Range 240, Range x 1.1 = 264.

- R4 = 22,580 + 132 = **22,712**; S4 = **22,448**
- R3 = 22,580 + 66 = **22,646**; S3 = **22,514**
- R2 = 22,580 + 44 = **22,624**; S2 = **22,536**
- R1 = 22,580 + 22 = **22,602**; S1 = **22,558**

Compare classic R1 22,680; the Camarilla levels cluster close to yesterday's close.`,
    interpretation: `By convention: inside R3/S3, the day is in range; approaching R3 or S3 invites fades; acceptance beyond R4/S4 suggests a breakout.`,
    bullish: `Rejection of S3 and recovery (fade long); acceptance above R4 (breakout long).`,
    bearish: `Rejection of R3 (fade short); acceptance below S4 (breakout short).`,
    example: `On a quiet Bank Nifty day, the session may stay within S3 to R3. On an event day, price breaks R4 in the first hour and continues. The Chart Lab has no Camarilla token; compute the levels from the prior session in the crosshair readout.
[[chart:BANKNIFTY:9:vwap,atr]]`,
    entryExit: `- Fade R3/S3 only with a reversal bar and a stop beyond R4/S4.
- Breakout trade beyond R4/S4 with a stop back inside at R3/S3.
- Check that the distance between levels exceeds costs; on low-range days they can be too close to trade.`,
    bestConditions: `Mean-reverting sessions after normal-range days.`,
    weaknesses: `> [!warn] Levels depend only on yesterday's range and close; after an unusually narrow day, they are so tight that ordinary noise breaks them.

The 1.1 multiplier and divisors are arbitrary. Claims of high success rates for Camarilla systems circulate without verifiable evidence.

> [!evidence] Mixed. Exact arithmetic; no robust public evidence of edge.`,
    mistakes: `- Trading R1/S1, which are within normal noise.
- Fading R3 on a trend day.
- Using a closing price that differs from the official close.`,
    timeframes: `Daily levels on 1 to 15-minute charts.`,
    combinations: `ATR (to check level spacing), VWAP, opening range. Redundant with classic pivots for the same idea.`,
    practice: `1. Compute Camarilla levels for two Chart Lab sessions and record fades at R3/S3 and breaks of R4/S4.
2. Compare classic and Camarilla levels for the same day.
3. Use the charges calculator to see if the R3-to-close distance covers costs on a narrow day.`,
    refs: ['Nick Scott — Camarilla equation (attributed; 1989)', 'John Person — A Complete Guide to Technical Trading Tactics (book)'],
  },
  {
    id: 'elliott-wave', name: 'Elliott Wave Principle', category: 'tool', engine: null, params: 'none (pattern-based)', chart: null, evidence: 'subjective',
    definition: `Elliott Wave, from R. N. Elliott (1930s) and popularised by Frost and Prechter, holds that prices move in a fractal structure: five waves in the direction of the larger trend (1 to 5) and three corrective waves (A, B, C).`,
    purpose: `To describe the stage of a trend and project likely next moves, using wave counts and Fibonacci relationships between waves.`,
    formula: `:::formula
Rule 1: Wave 2 never retraces more than 100% of wave 1
Rule 2: Wave 3 is never the shortest of waves 1, 3, 5
Rule 3: Wave 4 does not overlap the price territory of wave 1 (in standard impulses)
Guidelines (not rules): wave 3 often about 1.618 x wave 1; wave 2 often 0.5 to 0.618 of wave 1
:::
There is no engine function because counting waves is not an objective computation.`,
    calc: `Nifty candidate count: wave 1 from 22,000 to 22,200 (200 points), wave 2 to 22,080 (60% retracement, allowed).

- Guideline wave 3 target: 22,080 + 1.618 x 200 = **22,403.6**
- If price instead falls below 22,000, Rule 1 is broken: this count is invalid.
- If wave 3 ends at 22,350 and wave 4 drops to 22,190, wave 4 has entered wave 1 territory (below 22,200), so Rule 3 says it is not a standard impulse.

The invalidation level is the only objective part of this calculation.`,
    interpretation: `Wave 3 is described as the strongest; wave 5 often shows momentum divergence. But the same chart can be counted in several valid ways, and analysts routinely revise counts after the fact.`,
    bullish: `A completed ABC correction within an uptrend; a wave 2 holding above the start of wave 1.`,
    bearish: `A completed five-wave advance with divergence in wave 5; a break of the wave 4 low.`,
    example: `On a Nifty hourly chart, an analyst may label a rally as five waves and expect a correction. Another may call the same move waves 1 and 2 of a larger third wave. The Chart Lab can help you practise counting; load NIFTY with rsi to check momentum at each candidate wave.
[[chart:NIFTY:52:rsi]]`,
    entryExit: `- If you use it, use it for invalidation: enter only where the count gives a nearby, objective invalidation price (for example, the start of wave 1 for a wave 2 entry), and size so that being wrong costs a planned amount.
- Never add to losers because "the count has been revised".`,
    bestConditions: `Clear, extended trends on higher timeframes. Intraday noise makes counts even more ambiguous.`,
    weaknesses: `> [!warn] Subjective for specific reasons: (1) wave degree and starting points are chosen by the analyst; (2) many alternative counts satisfy the three rules; (3) extensions, truncations and complex corrections allow almost any path to be fitted; (4) counts are revised after price moves, which makes the method hard to falsify.

> [!evidence] Subjective. No robust, independent evidence of forecasting accuracy. The value for a trader, if any, is in disciplined invalidation levels.`,
    mistakes: `- Believing a count is a forecast.
- Ignoring the hard rules when they break.
- Holding a losing position through recount after recount.`,
    timeframes: `Mostly daily and weekly; intraday counts are especially ambiguous.`,
    combinations: `Momentum divergence (RSI, MACD) and volume. Fibonacci ratios are already built into the wave guidelines, so a Fib level agreeing with a wave target is the same assumption twice, not confirmation. Overlaps with ordinary swing structure (higher highs, higher lows), which is objective.`,
    practice: `1. Load NIFTY seed 52 with rsi. Write two different valid counts for the same move and note the invalidation level of each.
2. Step forward and record which count survived and why.
3. Journal how much your trade plan would have changed between the two counts.`,
    refs: ['A. J. Frost and Robert Prechter — Elliott Wave Principle (book)', 'R. N. Elliott — The Wave Principle (1938)'],
  },
  {
    id: 'gann', name: 'Gann Concepts (angles, Square of Nine, time cycles)', category: 'tool', engine: null, params: 'none (geometric and numerical constructions)', chart: null, evidence: 'subjective',
    definition: `W. D. Gann (early twentieth century) left a set of techniques: price-time angles (the 1x1 "45-degree" line and others), the Square of Nine (a spiral of numbers used to find related prices), and time cycles. His methods were partly secretive and are interpreted differently by different authors.`,
    purpose: `Practitioners use Gann tools to find levels and dates where trend changes might occur.`,
    formula: `:::formula
Square of Nine (one common reading): level = ( sqrt(P) + d )^2
d = 0.25 for 45 degrees, 0.5 for 90, 1 for 180, 2 for 360
Gann 1x1 angle: one price unit per time unit (the unit is chosen by the analyst)
:::
No engine function: the constructions depend on scale and starting choices.`,
    calc: `Nifty at 22,500. sqrt(22,500) = 150.

- 90 degrees: (150 + 0.5)^2 = **22,650.25**
- 180 degrees: (151)^2 = **22,801**
- 360 degrees: (152)^2 = **23,104**
- 90 degrees below: (149.5)^2 = **22,350.25**

These levels are as arbitrary as any other: they depend on the starting price, and the angle mapping is a convention. For the 1x1 angle, the "one point per bar" scale must be chosen; changing it from 1 to 5 points per bar changes the line completely.`,
    interpretation: `Gann followers watch for reactions at Square of Nine levels, angle lines and anniversary dates. Because the choices are free, the levels can be placed almost anywhere.`,
    bullish: `In practice: price holding above a chosen ascending angle.`,
    bearish: `Price breaking below a chosen angle, or a turn near a projected time cycle.`,
    example: `An analyst might compute Square of Nine levels from Nifty's all-time high and note that a pullback stalled near one of them. With eight levels per cycle and any starting price available, such matches occur by chance. On a Chart Lab NIFTY seed, compute the levels from the first close and count how many bars came within 10 points of one.
[[chart:NIFTY:61:vwap]]`,
    entryExit: `- If you experiment with Gann levels, treat them as random reference lines and require independent confirmation (structure, volume, VWAP) for any trade.
- Do not use Gann time cycles to hold losing trades.`,
    bestConditions: `None established.`,
    weaknesses: `> [!warn] Subjective for clear reasons: (1) angles depend on the arbitrary price-to-time scale of the chart; (2) Square of Nine levels depend on the chosen starting price and angle mapping; (3) Gann's own writings are ambiguous and many claims about his trading record are unverifiable; (4) the large number of possible levels guarantees some will appear to work in hindsight.

> [!evidence] Subjective. Many claims made for Gann methods are speculative, and there is no credible independent evidence of predictive power.`,
    mistakes: `- Believing a level is meaningful because it coincided with one turn.
- Paying for "secret" Gann systems.
- Changing chart scale until the angle fits.`,
    timeframes: `Practitioners use all; none is supported by evidence.`,
    combinations: `If used at all, alongside objective tools (VWAP, prior day levels, ATR). Overlaps with Fibonacci-style "magic number" level methods.`,
    practice: `1. Compute Square of Nine levels from the opening price of a Chart Lab NIFTY seed and count near-touches over the session.
2. Repeat with random levels spaced the same way and compare counts.
3. Journal what this tells you about level-based methods in general.`,
    refs: ['W. D. Gann — Truth of the Stock Tape (book, 1923)', 'Patrick Mikula — The Definitive Guide to Forecasting Using W. D. Gann\'s Square of Nine (book)'],
  },
  {
    id: 'harmonics', name: 'Harmonic Patterns (Gartley, Bat, Butterfly, Crab)', category: 'tool', engine: null, params: 'XABCD swing points with Fibonacci ratio tolerances', chart: null, evidence: 'subjective',
    definition: `Harmonic patterns are five-point (X, A, B, C, D) swing structures whose legs are required to match specific Fibonacci ratios. H. M. Gartley described a version in 1935; Scott Carney and Larry Pesavento later defined ratios for the Bat, Butterfly, Crab and others.`,
    purpose: `To identify a "potential reversal zone" (PRZ) at point D where several ratio projections cluster.`,
    formula: `:::formula
Gartley (one common definition):
AB = 0.618 of XA
BC = 0.382 to 0.886 of AB
D at 0.786 retracement of XA (CD often 1.272 to 1.618 of BC)
Bat: B 0.382 to 0.5 of XA; D at 0.886 of XA
:::
Ratio definitions vary between authors, and tolerances (often plus or minus 3 to 5%) are applied.`,
    calc: `Bullish Gartley on Nifty: X = 22,000, A = 22,600 (XA = 600).

- Ideal B = 22,600 - 0.618 x 600 = **22,229.2**
- Suppose C = 22,450 (BC = 220.8 / AB 370.8 = 0.60, inside 0.382 to 0.886)
- D target = 22,600 - 0.786 x 600 = **22,128.4**
- CD = 22,450 - 22,128.4 = 321.6, which is 1.46 x BC (inside 1.272 to 1.618)

The trade idea is a long near 22,128, stop below X (22,000). Risk 128 points.`,
    interpretation: `A completed pattern at D is read as a possible reversal area. But tolerances mean many swing sequences qualify, and the trader decides which swings are X, A, B and C.`,
    bullish: `Bullish pattern completing at D with a bullish reversal bar and momentum divergence.`,
    bearish: `Bearish pattern completing at D with a bearish reversal bar.`,
    example: `On a Reliance 15-minute chart, a trader may identify a bullish Bat completing near a prior support, while another identifies a Gartley that failed using different swing points. Load RELIANCE with rsi and practise labelling XABCD points before stepping forward.
[[chart:RELIANCE:66:rsi]]`,
    entryExit: `- Enter only on confirmation at D, stop beyond X, and calculate risk-reward before entering.
- Treat the PRZ as one input among several, not as a signal.`,
    bestConditions: `Markets with clear swings; higher timeframes reduce ambiguity.`,
    weaknesses: `> [!warn] Subjective for specific reasons: (1) swing point choice is discretionary; (2) ratio tolerances allow many sequences to qualify; (3) multiple pattern definitions (Gartley vs Bat vs Crab) give alternative D points, so one of them will often match; (4) published win-rate claims are not independently verified.

> [!evidence] Subjective. The ratios are exact; the predictive value of the patterns is not established.`,
    mistakes: `- Widening tolerances until a pattern appears.
- Entering at D without confirmation.
- Ignoring the trend; reversal patterns in strong trends fail often.`,
    timeframes: `15-minute and higher; on 1-minute charts swings are too noisy.`,
    combinations: `RSI divergence and price structure. Fibonacci retracements and extensions are not confirmation here: they are the same ratios the pattern is built from, so agreement is automatic. Overlaps with ordinary double bottom and ABCD measured-move concepts.`,
    practice: `1. On RELIANCE seed 66, label one XABCD candidate and compute the D zone before stepping forward.
2. Record whether the pattern reversed, then label an alternative pattern from different swings and compare.
3. Journal how much tolerance you used and how it affected your result.`,
    refs: ['H. M. Gartley — Profits in the Stock Market (book, 1935)', 'Scott M. Carney — Harmonic Trading, Volume One (book)', 'Larry Pesavento — Fibonacci Ratios with Pattern Recognition (book)'],
  },
  {
    id: 'divergence', name: 'Divergence Analysis', category: 'tool', engine: 'divergence', params: 'swing window w=3; any oscillator (RSI, MACD, OBV...)', chart: 'rsi', evidence: 'mixed',
    definition: `Divergence is a disagreement between price and an oscillator at swing points: price makes a higher high while the oscillator makes a lower high (bearish), or price makes a lower low while the oscillator makes a higher low (bullish). Hidden divergence is the reverse pattern within a trend.`,
    purpose: `To flag weakening momentum behind a price move, as a warning or as part of a reversal setup.`,
    formula: `:::formula
Swing high at i: H(i) above the highs of the w bars on each side
Swing low at i: L(i) below the lows of the w bars on each side
Bearish regular: H(b) > H(a) and Osc(b) < Osc(a) for consecutive swing highs a, b
Bullish regular: L(b) < L(a) and Osc(b) > Osc(a) for consecutive swing lows a, b
:::
The engine's {{divergence(candles, osc, 3)}} needs w bars **after** a swing to confirm it, so detection is delayed by w bars. It detects only regular divergences between consecutive swings.`,
    calc: `Nifty 5-minute swing highs: bar 40 high 22,620 with RSI 72; bar 58 high 22,650 with RSI 64.

- Price: 22,650 > 22,620 (higher high)
- RSI: 64 < 72 (lower high)
- Result: **bearish regular divergence**, confirmed only at bar 61 (w = 3 bars after the swing).

A bullish example: swing lows at 22,410 (RSI 28) and 22,390 (RSI 35): lower low in price, higher low in RSI.`,
    interpretation: `Divergence says momentum is weaker at the second swing. It does not say price will reverse, or when. Strong trends often show several consecutive divergences before any meaningful turn.`,
    bullish: `Regular bullish divergence at a support level followed by a break of the latest swing high; hidden bullish divergence (price higher low, oscillator lower low) in an uptrend.`,
    bearish: `Regular bearish divergence at resistance followed by a break of the latest swing low.`,
    example: `On a Bank Nifty 5-minute chart late in a trending morning, RSI may diverge two or three times while price grinds higher. Only the divergence followed by a break of structure led to a pullback.
[[chart:BANKNIFTY:42:rsi,macd]]
On NVDA, the same pattern can appear around the US midday lull.`,
    entryExit: `- Treat divergence as a setup, not a trigger. The trigger is price structure: a lower low after bearish divergence, a higher high after bullish.
- Stop beyond the extreme of the divergent swing.
- Use for tightening stops on existing positions.`,
    bestConditions: `Range edges and exhausted trends with clear swings.`,
    weaknesses: `> [!warn] Divergences are confirmed late (w bars after the swing) and can repeat many times in strong trends. Oscillator choice and settings change whether a divergence exists at all. Selection bias is severe: the divergences you remember are those that worked.

> [!evidence] Mixed. A logical description of slowing momentum; evidence of standalone predictive value is weak.`,
    mistakes: `- Shorting the first bearish divergence in a strong trend.
- Switching oscillators until one shows divergence.
- Ignoring the w-bar confirmation delay when back-testing by eye.`,
    timeframes: `5-minute and higher. On 1-minute charts swings are too noisy.`,
    combinations: `Support/resistance, VWAP, structure breaks. The oscillator chosen (RSI, MACD, Stochastic, OBV) is largely interchangeable; divergence on several at once is usually the same information.`,
    practice: `1. Load BANKNIFTY seed 42 with rsi and macd. Mark every regular divergence and whether price broke structure afterwards.
2. Note the bar where each divergence would have been confirmed (w = 3 bars after the swing) and re-evaluate the entry price.
3. Journal the ratio of divergences that led to a structure break versus those that did not.`,
    refs: ['Constance Brown — Technical Analysis for the Trading Professional (book)', 'Martin J. Pring — Technical Analysis Explained (book)'],
  },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
