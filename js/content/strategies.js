/* Strategy library: 30 intraday strategies. Rules are testable hypotheses, not proven edges. */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  IA.content.strategies = [
    {
      id: 'opening-range-breakout', n: 1, name: 'Opening Range Breakout', family: 'breakout', evidence: 'mixed',
      markets: `Liquid index futures (Nifty, Bank Nifty), large-cap NSE F&O stocks, US index ETFs and mega-caps. Avoid illiquid stocks where the opening range is mostly spread and noise.`,
      timeframes: `Opening range of 15 minutes (09:15–09:30 IST), traded on a 5-minute chart. Variants use 5, 30 or 60 minutes.`,
      indicators: `Opening-range high and low, session VWAP, volume, ATR(14) for stop sanity.`,
      concept: `The first minutes of the session absorb overnight news, global cues and pre-open orders. The high and low of that window mark where early buyers and sellers stopped. A decisive close beyond one edge is read as one side taking control for the day. The idea has a long practitioner history (Toby Crabel wrote about opening-range behaviour), but it is a hypothesis to test, not a law.`,
      logic: `If the opening auction has priced in the news and a range forms, a later break of that range with participation suggests fresh orders arriving on one side. The trade tries to catch the move that follows, using the opposite side of the range (or part of it) as the place where the idea is proven wrong.

> [!evidence] Opening-range effects have been studied for decades with results that vary by market, period and costs. Treat any edge as unproven until you test it yourself.`,
      setup: `1. Mark the high (ORH) and low (ORL) of the 09:15–09:30 bars.
2. Range width must be between 0.4 and 1.2 times the 14-day average daily ATR divided by 3. Too narrow invites false breaks; too wide makes the stop uneconomic.
3. No scheduled event (RBI policy, CPI, US data) inside the next 30 minutes.`,
      entry: `- **Long:** a 5-minute candle closes above ORH. Buy at the open of the next candle.
- **Short:** a 5-minute candle closes below ORL. Sell at the next open.
- Only the first valid break of the day is taken. No new entries after 13:30.`,
      confirmation: `- Breakout candle volume at least 1.5 times the average of the opening-range candles.
- Price on the trade side of VWAP at the breakout close.
- Optional: Nifty and the stock's sector index moving the same way.`,
      stop: `Initial stop at the midpoint of the opening range, or 1.5 × ATR(14) of the 5-minute chart, whichever is closer to entry. Never wider than the full range.`,
      target: `First target at 1R, final at 2R. Alternative: the previous-day high (long) or low (short) if it lies before 2R.`,
      sizing: `Risk a fixed 0.5–1% of capital. Quantity = risk amount ÷ stop distance, rounded down to whole lots. If one lot exceeds your risk budget, skip the trade. [[widget:position-size]]`,
      rr: `Planned 1:2. Because stops sit inside the range, many trades end near −1R or scratch. Your expectancy depends on how often the 2R leg actually arrives.`,
      exits: `- Stop or target hit.
- Price closes back inside the range on a 5-minute basis for two consecutive candles: exit.
- Time exit at 15:10 IST regardless.`,
      management: `After 1R, book half and move the stop on the rest to entry. Trail below each higher 5-minute swing low (long). Do not add to the position.`,
      winExample: `**Nifty futures, 1 lot (65).** Opening range 25,780–25,826. At 09:40 a candle closes at 25,838 on twice the average volume, above VWAP. Buy at 25,842. Stop at range midpoint 25,803 (39 points, ₹2,535 risk). 1R = 25,881, 2R = 25,920. Half-booking is not possible on one lot, so the stop moves to entry at 25,881. Price reaches 25,921 at 11:05; exit at 25,920. Gross ₹5,070. After roughly ₹1,000 of charges (as of Nov 2026, verify with [[widget:charges-india]]) the net is about ₹4,070.`,
      loseExample: `**Bank Nifty futures, 1 lot (30).** Range 56,940–57,110. A 09:35 candle closes at 57,128 with good volume. Buy at 57,135, stop at midpoint 57,025 (110 points, ₹3,300). Within two candles a large private bank slips on a broker downgrade; price closes at 57,060, back inside the range, then trades 57,020. Stopped at 57,020 after one tick of slippage: −115 points, ₹3,450 plus about ₹1,000 costs. This is the characteristic ORB loss: a break that had no follow-through.`,
      failure: `- Range days where price oscillates across both edges.
- Gap days where the opening range is huge and already contains the day's move.
- Expiry days and event days with whipsaw.
- After several trending days, when many traders crowd the same level.`,
      mistakes: `- Entering on an intrabar poke instead of a candle close.
- Taking the second and third break after the first failed.
- Using the full opposite side of a wide range as the stop and oversizing anyway.
- Ignoring costs: a 40-point stop on Nifty with ₹1,000 charges is already about 0.4R of drag.`,
      backtest: `In the Quant Lab, load a preset such as NIFTY on 5-minute bars and choose the **Opening-range breakout** signal with bars = 3 (15 minutes). Run long and short separately. Then add **Volume spike** and **Close on the trade side of VWAP** as filters and compare. Use walk-forward with 4 folds and Monte Carlo on the trade list. The preloaded config differs from the written rule in three ways: the stop is 1.5 × ATR rather than the range midpoint, there is no volume filter unless you add it, and the 13:30 entry cut-off is not modelled (the engine only blocks entries in the last 3 bars of the session). You need at least 200 trades per side, across trending and ranging regimes, before the average R tells you anything. Remember the data is synthetic: repeat the test on real downloaded data via CSV import. See [[link:l3-significance]].`,
      chart: `[[chart:NIFTY:11:vwap,vol]]`,
      btConfig: { side: 1, entry: [{ id: 'orb', params: { bars: 3 } }, { id: 'vwap_side', params: {} }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 } },
    },
    {
      id: 'vwap-trading', n: 2, name: 'VWAP trading', family: 'trend', evidence: 'mixed',
      markets: `Any liquid intraday instrument with real volume: Nifty and Bank Nifty futures, F&O stocks, US large caps. VWAP is less meaningful on spot indices with no traded volume of their own; use the futures.`,
      timeframes: `3- or 5-minute chart; VWAP anchored at the 09:15 open and reset daily.`,
      indicators: `Session VWAP, optional VWAP ± 1 standard-deviation bands, volume.`,
      concept: `VWAP is the average price paid by everyone today, weighted by volume. Large execution desks often benchmark fills against it, so it acts as a reference for whether buyers or sellers have been in control. The strategy trades the side of VWAP that price is accepting: above it, look for longs; below it, look for shorts; a decisive cross is the trigger.`,
      logic: `When price crosses and holds above VWAP, the average participant is now in profit on longs and sellers from earlier are underwater. That can change behaviour. The trade bets that a clean reclaim leads to a move towards the day's high or the upper band.

> [!evidence] VWAP's role as an execution benchmark is established. Whether a VWAP cross predicts direction is empirical and mixed.`,
      setup: `1. At least 45 minutes into the session (VWAP needs volume to stabilise).
2. Price has spent at least 30 minutes on one side of VWAP.
3. VWAP slope flat or turning in the trade direction.`,
      entry: `- **Long:** a 5-minute candle closes above VWAP after the previous candle closed at or below it. Buy at the next open.
- **Short:** mirror image.
- No entry if the crossing candle is larger than 2 × ATR(14); that is chasing.`,
      confirmation: `- Crossing candle volume above its 20-bar average.
- The next candle does not close back through VWAP.
- Nifty (for a stock) on the same side of its own VWAP.`,
      stop: `Below the low of the crossing candle or 1.2 × ATR(14) below entry, whichever is further from entry, capped at 1.5 × ATR from entry (mirror for shorts).`,
      target: `2R, or the upper 2-standard-deviation VWAP band, whichever comes first.`,
      sizing: `0.5–1% risk per trade. Whole lots or shares, rounded down.`,
      rr: `1:2 planned. Expect frequent small losses on choppy days where price criss-crosses VWAP.`,
      exits: `- Two consecutive 5-minute closes on the wrong side of VWAP.
- Stop or target.
- Time stop: if the trade has not reached 1R in 60 minutes, exit at market.
- Flat by 15:10 IST.`,
      management: `Move stop to entry at 1R. Do not re-enter more than twice in a day; repeated crosses mean the market is balanced and the setup is not present.`,
      winExample: `**Reliance (NSE), 250 shares.** VWAP ₹1,476.40 at 10:30 after price had been below it since the open. A candle closes at ₹1,477.90 on 1.6 × average volume. Buy at ₹1,478.20. ATR(14) on 5 minutes is ₹2.10. The crossing candle's low ₹1,475.40 is further than 1.2 × ATR below entry (₹1,475.68) and inside the 1.5 × ATR cap (₹1,475.05), so the stop is ₹1,475.40 (₹2.80 risk, ₹700 total). Target 2R = ₹1,483.80. Reached at 12:15. Gross ₹1,400; intraday STT is 0.025% on the sell value (about ₹93) plus brokerage and fees, net roughly ₹1,220 (as of Nov 2026, verify with [[widget:charges-india]]).`,
      loseExample: `**Nifty futures, 1 lot (65).** At 11:00 price reclaims VWAP 25,912 with a close at 25,921. Buy at 25,924, stop 25,896 (28 points, ₹1,820). Over the next hour price drifts sideways and slips back to 25,905, closes below VWAP twice; exit at 25,903 for −21 points (₹1,365) plus about ₹1,000 costs. Net loss ≈ ₹2,365, more than the gross. On low-volatility days costs make small VWAP trades especially expensive.`,
      failure: `- Balanced, low-range days where VWAP is flat and price oscillates around it.
- The first 30 minutes, when VWAP moves fast with every candle.
- News spikes that drag VWAP along with price.`,
      mistakes: `- Treating VWAP as a wall instead of a reference.
- Using spot index VWAP that has no real volume.
- Re-entering every cross on a choppy day.
- Forgetting VWAP resets daily; yesterday's VWAP is a different tool (anchored VWAP).`,
      backtest: `Quant Lab: choose **Price crosses VWAP** for the side you want. Then add **ADX above threshold** (min 20) to see whether filtering out flat days changes the result. Compare with and without the filter on the same seed and also across 5+ seeds. The preloaded config uses volume ≥ 1 × the 20-bar average and a 1.2 × ATR stop; it does not model the 45-minute start delay, the VWAP-band target, the 60-minute time stop or the two-closes exit. Collect at least 200 trades; check results by hour of entry, because VWAP behaviour early and late in the day differs. See [[link:l1-vwap]].`,
      chart: `[[chart:RELIANCE:7:vwap,vol]]`,
      btConfig: { side: 1, entry: [{ id: 'vwap_reclaim', params: {} }, { id: 'volume_spike', params: { k: 1 } }], stop: { type: 'atr', mult: 1.2 }, target: { rr: 2 } },
    },
    {
      id: 'vwap-pullback', n: 3, name: 'VWAP pullback', family: 'trend', evidence: 'mixed',
      markets: `Trending sessions in Nifty or Bank Nifty futures and liquid F&O stocks; US large caps.`,
      timeframes: `5-minute chart; trend context from the first 60–90 minutes.`,
      indicators: `Session VWAP, 20 EMA, volume, ATR(14).`,
      concept: `On a trending day price often stays on one side of VWAP and returns to it from time to time. Rather than chase breakouts, you wait for price to come back to VWAP and show signs of resuming the trend. Entry is closer to the invalidation point, so the stop can be tighter.`,
      logic: `If participants who missed the move use VWAP as a fair-value reference, pullbacks to it can attract fresh orders in the trend direction. If VWAP fails decisively, the trend premise is wrong and the trade is closed quickly.

> [!evidence] The pullback idea is a practitioner heuristic. Its usefulness depends on the trend-day frequency of your market, which varies by period.`,
      setup: `1. By 10:30 IST, price has closed above VWAP on at least 80% of 5-minute candles (long case), and VWAP is rising.
2. The day's high is at least 1 × daily-ATR/3 above VWAP (a real trend, not a drift).
3. Price pulls back to within 0.15% of VWAP without closing more than 0.1% below it.`,
      entry: `Buy when a 5-minute candle that touched the VWAP zone closes above the prior candle's high. Enter at the next open. Short side is the mirror image.`,
      confirmation: `- Pullback volume lower than the volume on the preceding leg up.
- The resumption candle has a close in the upper third of its range.
- Index or sector not breaking down at the same time.`,
      stop: `0.1% below VWAP or below the pullback low, whichever is lower; cap at 1.5 × ATR(14).`,
      target: `Retest of the day's high first (often near 1.5–2R); final at 2.5R or a trail.`,
      sizing: `0.5–1% risk. Because the stop is tight, size can be larger; cap exposure at the leverage you have tested with [[widget:futures-exposure]].`,
      rr: `Typically 1:2 to 1:3. Tight stops get hit more often by noise; that is the trade-off.`,
      exits: `- A 5-minute close more than 0.2% beyond VWAP against you.
- Target or trailing stop.
- Exit by 15:10 IST.`,
      management: `At 1R move stop to entry; trail under the most recent 5-minute higher low. Take only the first two pullbacks of the day; the working assumption is that later ones fail more as the trend matures, which your journal should confirm or reject.`,
      winExample: `**Bank Nifty futures, 1 lot (30).** Gap-up day, price above VWAP since 09:20. At 11:10 VWAP is 57,240; price dips to 57,252 on light volume, then a candle closes at 57,290 above the prior high. Buy at 57,295. Stop 57,180 (115 points, ₹3,450). Day high 57,460 is 1.4R; target 2.5R = 57,582.50. Stop moved to entry at 1R. Price reaches 57,500 by 13:00 and stalls; trail exit at 57,470 gives +175 points, ₹5,250 gross, about ₹4,250 net.`,
      loseExample: `**Infosys, 300 shares.** Uptrend morning, VWAP ₹1,612. Pullback to ₹1,613.50, resumption candle closes ₹1,616.20. Buy at ₹1,616.40, stop ₹1,610.30 (₹6.10, ₹1,830 risk). At 13:40 a US tech futures sell-off drags IT stocks; price slices through VWAP and closes at ₹1,608. Stop fills at ₹1,610.10 with slippage: −₹1,890 plus charges. The trend premise broke on outside news, which no chart rule can foresee.`,
      failure: `- Afternoon reversals after a morning trend.
- Days with no trend, where the setup conditions are met loosely and price simply rotates around VWAP.
- Third and fourth pullbacks as the trend tires.`,
      mistakes: `- Buying the first touch without a resumption candle.
- Calling every day a trend day.
- Widening the stop when VWAP is breached.`,
      backtest: `The catalogue has no exact pullback-to-VWAP signal, so the Quant Lab config is a proxy: **Close on the trade side of VWAP** plus **Fast EMA crosses slow EMA** (5/13) to catch the resumption after a dip. Test it, then also journal 50+ discretionary pullbacks in the Simulator using the exact rules above. Compare the two samples. 150+ trades minimum before drawing conclusions.`,
      chart: `[[chart:BANKNIFTY:23:vwap,ema20,vol]]`,
      btConfig: { side: 1, entry: [{ id: 'vwap_side', params: {} }, { id: 'ema_cross', params: { fast: 5, slow: 13 } }], stop: { type: 'atr', mult: 1.2 }, target: { rr: 2.5 } },
    },
    {
      id: 'ema-pullback', n: 4, name: 'EMA pullback', family: 'trend', evidence: 'mixed',
      markets: `Index futures, liquid F&O stocks, US stocks and ETFs, liquid commodity futures.`,
      timeframes: `5-minute entries with a 15-minute trend filter. Also used on 15-minute for slower traders.`,
      indicators: `9 EMA and 20 EMA, ADX(14), RSI(14), ATR(14).`,
      concept: `In a trend, price tends to move in legs and retrace towards a short moving average. The EMA pullback buys the retracement into the 9–20 EMA zone in an uptrend (or sells the bounce in a downtrend), betting on trend continuation.`,
      logic: `The EMA is a moving estimate of recent average price. In a persistent trend, dips towards it bring price back to a "fair" recent level where trend participants may add. The ADX filter tries to keep you out of sideways markets, where EMAs are flat and pullbacks are just noise.

> [!evidence] Trend persistence at intraday horizons is weak and regime-dependent; this is a mixed-evidence setup.`,
      setup: `1. 20 EMA on the 15-minute chart is rising (long) and price is above it.
2. On the 5-minute chart, ADX(14) ≥ 25 and 9 EMA > 20 EMA.
3. Price pulls back so that a candle's low touches or crosses the 20 EMA.
4. RSI(14) dips below 40 during the pullback but does not go below 30.`,
      entry: `Buy at the next open after a 5-minute candle closes back above the 9 EMA with RSI rising back above 40.`,
      confirmation: `- The pullback has fewer than 6 candles (a long pullback suggests a change of trend).
- Volume falls during the pullback and rises on the resumption candle.`,
      stop: `Below the pullback swing low, or 1.5 × ATR(14), whichever is tighter but not tighter than 0.8 × ATR.`,
      target: `2R; or prior swing high if it lies beyond 1.5R.`,
      sizing: `0.5–1% risk. [[widget:position-size]]`,
      rr: `1:2. A trailed trade on a trend day can exceed 2R; choppy days can produce several −1R losses in a row. Neither tells you the average; only a test does.`,
      exits: `- 5-minute close below the 20 EMA after entry.
- Target or stop.
- 15:10 IST time exit.`,
      management: `Stop to entry at 1R. Trail along the 20 EMA (exit on a close below). No more than three pullback trades per day.`,
      winExample: `**Nifty futures, 1 lot (65).** ADX 29, 9 EMA above 20 EMA. A pullback to the 20 EMA at 25,705 takes RSI to 37, then a candle closes at 25,728 above the 9 EMA. Buy at 25,731. Swing low 25,698; stop 25,697 (34 points, ₹2,210). Target 2R = 25,799. Hit at 12:20. Gross ₹4,420, net about ₹3,420.`,
      loseExample: `**An auto F&O stock, 400 shares.** Uptrend; pullback to 20 EMA at ₹712.40, resumption close ₹714.10. Buy at ₹714.20, stop ₹711.30 (₹2.90, ₹1,160 risk). A sector-wide sell-off starts within 15 minutes; price closes below the 20 EMA at ₹711.80 and the stop fills at ₹711.20 on a fast candle. Loss ₹1,200 plus charges. Pullbacks in a trend look identical to the first leg of a reversal until afterwards. Accept the loss at the stop; do not re-label it a "deeper pullback" and widen.`,
      failure: `- Late-day trends that have already run 2–3 daily ATRs.
- Low-ADX days where EMAs are tangled.
- Sharp V-reversals triggered by news.`,
      mistakes: `- Buying while the pullback candle is still falling.
- Ignoring the higher timeframe.
- Treating the 20 EMA as magic; 18 or 21 would behave similarly.
- Taking a pullback against the 15-minute trend because the 5-minute chart looks good.
- Adding to a losing pullback trade ("averaging down") when the 20 EMA breaks.
- Forgetting that every EMA rule is a lagging description of the past, not a forecast.`,
      backtest: `Quant Lab proxy: **ADX above threshold** (min 25) + **Close on the trade side of VWAP** + **RSI crosses back from extreme** with lo = 40 (the RSI dip-and-recover). Run on several presets and seeds. Then vary only one parameter at a time (ADX 20/25/30) and look for stable results rather than the best one; the best one is usually overfit. 200+ trades. See [[link:l3-biases]].`,
      chart: `[[chart:NIFTY:31:ema9,ema20,adx]]`,
      btConfig: { side: 1, entry: [{ id: 'adx_trend', params: { n: 14, min: 25 } }, { id: 'vwap_side', params: {} }, { id: 'rsi_extreme', params: { n: 14, lo: 40, hi: 60 } }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 } },
    },
    {
      id: 'moving-average-crossover', n: 5, name: 'Moving average crossover', family: 'trend', evidence: 'mixed',
      markets: `Index futures, commodity futures, liquid stocks. Best studied on daily and longer horizons; intraday use is more fragile.`,
      timeframes: `5- or 15-minute chart with 9/21 EMA; slower traders use 20/50 on 15-minute.`,
      indicators: `Fast and slow EMA, ADX(14) filter, ATR(14).`,
      concept: `When a fast average of price crosses above a slow one, recent prices are rising faster than older ones: a simple, objective definition of an emerging uptrend. The crossover is one of the oldest systematic rules and a good first strategy to test precisely because it is so mechanical.`,
      logic: `The crossover is a lagging confirmation of direction. It will never catch the top or bottom; it tries to capture the middle of sustained moves and accept many small losses in sideways markets.

> [!evidence] Trend-following rules on daily and longer data have long research histories with mixed and period-dependent results; intraday crossover evidence is weaker and costs matter far more.`,
      setup: `1. Trade only between 09:45 and 14:30 IST.
2. ADX(14) ≥ 20 at the crossover candle (filters flat markets).`,
      entry: `- **Long:** 9 EMA closes above 21 EMA after being below on the prior candle. Buy at the next open.
- **Short:** 9 EMA closes below 21 EMA.
- Ignore any crossover where the gap between the two EMAs on the prior candle was already less than 0.02% of price for 6+ candles (tangled averages mean no trend).`,
      confirmation: `- Crossover candle closes on the same side of VWAP as the trade.
- The slow EMA's slope has turned (not still falling for a long).`,
      stop: `1.5 × ATR(14) from entry.`,
      target: `2R fixed, or exit on the opposite crossover (the "always in until reversed" variant).`,
      sizing: `0.5–1% risk per signal.`,
      rr: `1:2 with fixed target; open-ended with the reverse-crossover exit.`,
      exits: `- Opposite crossover.
- Stop or target.
- 15:10 IST.
- If the crossover happens after 14:30, ignore it: there is not enough session left for a trend to develop. The backtester does not model this cut-off exactly: it only blocks entries in the last 3 bars of the session.`,
      management: `No discretionary overrides. The value of a crossover system is that it is fully mechanical; once you start skipping signals you are trading a different, untested strategy.`,
      winExample: `**Bank Nifty futures, 1 lot (30).** At 10:20 the 9 EMA crosses above the 21 EMA at 56,880 with ADX 24. Buy at 56,892. ATR 70; stop 56,787 (105 points, ₹3,150). Target 2R = 57,102. A steady rally reaches 57,110 by 12:40. Gross ₹6,300, net about ₹5,300.`,
      loseExample: `**Nifty futures, 1 lot (65).** 9/21 cross up at 25,860, ADX 21. Buy at 25,864, stop 1.5 × ATR (22) = 33 points at 25,831 (₹2,145). Price rises 12 points, then the averages cross back down 25 minutes later. Exit on the reverse crossover at 25,846: −18 points, ₹1,170 gross plus ₹1,000 costs. A sideways day can deliver five such whipsaws in a row.`,
      failure: `- Range-bound days: repeated crossovers, each a small loss.
- Gap reversals, where the crossover arrives after the move is done.
- Very short averages on 1-minute data, where signals are mostly noise and costs dominate.`,
      mistakes: `- Optimising the two lengths until the backtest looks perfect.
- Ignoring that a crossover is late by design.
- Running it without costs.
- Trading it on 1-minute bars where the number of signals multiplies costs.
- Switching off the system after three losses, then switching it back on after the trend you missed. A mechanical rule only has a measurable expectancy if you take every signal.
- Believing a crossover "means" institutions are buying. It means two averages crossed, nothing more.`,
      backtest: `Quant Lab: **Fast EMA crosses slow EMA** with fast 9, slow 21. Run a parameter grid (5/13, 9/21, 13/34, 20/50) and look at the whole grid: if only one pair works, it is likely luck. Add **ADX above threshold** as a filter. The preloaded config has no VWAP confirmation, no 0.02% tangle filter and a fixed 2R target (not the reverse-crossover exit). Walk-forward 4 folds. Expect hundreds of signals per year on 5-minute data; use at least 300. See [[link:l4-walkforward]].`,
      chart: `[[chart:BANKNIFTY:5:ema9,ema20,adx]]`,
      btConfig: { side: 1, entry: [{ id: 'ema_cross', params: { fast: 9, slow: 21 } }, { id: 'adx_trend', params: { n: 14, min: 20 } }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 } },
    },
    {
      id: 'supertrend', n: 6, name: 'Supertrend strategy', family: 'trend', evidence: 'mixed',
      markets: `Popular with Indian retail traders on Nifty and Bank Nifty futures and options underlyings; usable on any liquid instrument.`,
      timeframes: `5-minute chart with Supertrend(10, 3); some use 15-minute with (7, 3).`,
      indicators: `Supertrend (ATR-based trailing line), ADX(14), VWAP.`,
      concept: `Supertrend draws a line a multiple of ATR below price in an uptrend and above price in a downtrend. When price closes through the line, it flips. The strategy goes long on a flip to green and short on a flip to red, using the line itself as a trailing stop.`,
      logic: `It is a volatility-adjusted trend follower: the ATR multiple decides how much counter-move is tolerated before the trend is declared over. It wins on sustained moves and gives back small amounts in chop. Nothing about the indicator is predictive; it is a rule for when to be in and out.

> [!evidence] Supertrend is a packaging of ATR trailing-stop logic. Its popularity in India is not evidence of an edge.`,
      setup: `1. Supertrend(10, 3) on 5-minute bars, warmed up with at least 2 prior sessions of data.
2. ADX(14) ≥ 20 at the flip.
3. Time window 09:45–14:30 IST.`,
      entry: `- **Long:** Supertrend direction changes from down to up on a candle close. Buy at the next open.
- **Short:** direction changes from up to down.`,
      confirmation: `- Flip candle closes on the trade side of VWAP.
- Flip candle range less than 2 × ATR (avoid entering after a spike).`,
      stop: `The Supertrend line at entry, capped at 2 × ATR(14). If the line is further away, use 2 × ATR and accept the line as a trailing exit later.`,
      target: `Either 2R fixed, or no fixed target and exit on the opposite flip. Test both; they produce very different trade distributions.`,
      sizing: `0.5–1% risk on the initial stop distance. Because the line can be far from price after a big candle, sizing from the actual stop is essential.`,
      rr: `Fixed 1:2 variant, or open-ended trail. The trailing version has a low hit rate with occasional large winners.`,
      exits: `- Opposite flip (trailing variant).
- Stop or target.
- 15:10 IST.`,
      management: `Trail the stop to the Supertrend line at each candle close. Never move it away from price.`,
      winExample: `**Nifty futures, 1 lot (65).** At 10:05 Supertrend flips up with price closing at 25,742, above VWAP, ADX 23. Buy at 25,746. Line at 25,706 (40 points, ₹2,600 risk). Target 2R = 25,826. The trend carries to 25,830 by 11:50. Exit at target: +80 points, ₹5,200 gross, about ₹4,200 net.`,
      loseExample: `**Bank Nifty futures, 1 lot (30).** Flip down at 13:10, close 57,018, below VWAP. Short at 57,012. Line at 57,120 (108 points, ₹3,240). Price chops for 40 minutes, then a single candle runs from 56,990 to 57,140 on a rumour about bank results. Stop at 57,120 fills at 57,125: −113 points, ₹3,390 plus about ₹1,000 costs. The Supertrend flips back up on the same candle, a classic whipsaw.`,
      failure: `- Range days: flips every 30–60 minutes.
- The open, when ATR is still adjusting and lines are far from price.
- Low-volatility afternoons where ATR is small and every wiggle flips the line.`,
      mistakes: `- Changing parameters day by day.
- Using Supertrend to pick option strikes without understanding that the option's delta and decay change the payoff.
- Confusing the line with support or resistance.
- Not warming up the indicator, so the first signals of the day are based on too few bars.
- Taking the counter-trend flip on a strongly trending day and then trading the next flip in revenge.`,
      backtest: `Quant Lab: **Supertrend flips direction** with n 10, m 3, plus **ADX above threshold** min 20. Run long and short. The preloaded config uses a fixed 2 × ATR stop, not the Supertrend line, and a fixed 2R target; the 09:45–14:30 window is not modelled. Compare multipliers 2, 3, 4 and periods 7, 10, 14 as a grid; look for a broad plateau of similar results, not a single best cell. Because results swing between regimes, use at least 300 trades and walk-forward.`,
      chart: `[[chart:NIFTY:17:st,adx]]`,
      btConfig: { side: 1, entry: [{ id: 'supertrend_flip', params: { n: 10, m: 3 } }, { id: 'adx_trend', params: { n: 14, min: 20 } }], stop: { type: 'atr', mult: 2 }, target: { rr: 2 } },
    },
    {
      id: 'rsi-strategies', n: 7, name: 'RSI strategies', family: 'reversion', evidence: 'mixed',
      markets: `Liquid stocks and index futures. Reversion variants suit range-bound instruments; momentum variants suit trending ones.`,
      timeframes: `5-minute chart with RSI(14); reversion traders sometimes use RSI(2) or RSI(7) on 5-minute.`,
      indicators: `RSI(14), ADX(14) as regime filter, VWAP, ATR(14).`,
      concept: `RSI measures the balance of recent up-closes versus down-closes on a 0–100 scale. Two opposite strategies use it. **Reversion:** buy when RSI recovers from below 30, sell when it falls back from above 70. **Momentum:** stay long while RSI holds above 50 in an uptrend. They contradict each other, so you must pick one per regime.`,
      logic: `In a range, extremes in RSI often coincide with stretched prices that drift back to the middle. In a trend, RSI can sit above 70 for hours and "overbought" means strong, not about to fall. The regime filter (ADX) is the decisive part.

> [!evidence] Short-horizon reversal and momentum effects both appear in research, with results depending on horizon, market and costs. Neither RSI rule is established as profitable.`,
      setup: `**Reversion variant:**
1. ADX(14) < 20 (no strong trend).
2. Price within the day's range, not at a fresh day extreme made in the last 3 candles.

**Momentum variant:**
1. ADX(14) ≥ 25.
2. Price on the trade side of VWAP.`,
      entry: `- **Reversion long:** RSI(14) closes back at or above 30 after a close below 30. Buy next open.
- **Reversion short:** RSI closes back at or below 70 after a close above 70.
- **Momentum long:** RSI crosses above 50 with ADX ≥ 25 and price above VWAP.`,
      confirmation: `- Reversion: the entry candle is a bullish close (close above open) for longs.
- Momentum: RSI has not been above 80 in the last 6 candles (avoid late entries).`,
      stop: `Reversion: below the swing low formed during the oversold phase, maximum 1.2 × ATR. Momentum: 1.5 × ATR.`,
      target: `Reversion: VWAP or 1.5R, whichever is first. Momentum: 2R.`,
      sizing: `0.5% risk for reversion (more frequent, smaller), up to 1% for momentum.`,
      rr: `Reversion near 1:1.5 with targets set by VWAP; momentum 1:2.`,
      exits: `- Target, stop or 15:10.
- Reversion: exit if RSI makes a new low below the entry signal's low.`,
      management: `Reversion trades are not held in hope: if VWAP is not reached within 45 minutes, exit. Momentum trades move stop to entry at 1R.`,
      winExample: `**A private-bank F&O stock, 400 shares, range day (ADX 16).** RSI drops to 26 as price hits ₹1,688, then closes back at 31 with price ₹1,691. Buy at ₹1,691.30. Swing low ₹1,687.80; stop ₹1,687.70 (₹3.60, ₹1,440). VWAP ₹1,696.70 is 1.5R. Reached at 11:30. Gross ₹5.40 × 400 = ₹2,160, net about ₹1,870 (verify with [[widget:charges-india]]).`,
      loseExample: `**Bank Nifty futures, 1 lot (30).** ADX 18, RSI recovers from 28 to 31 at 56,620. Buy at 56,628, stop 56,560 (68 points, ₹2,040). An hour later RBI's governor comments on liquidity; the index trends lower. RSI goes to 22 and price hits the stop at 56,555 after slippage: −73 points, ₹2,190 plus costs. The ADX filter was calm until the news; a range regime can become a trend in one candle.`,
      failure: `- Reversion in a trending market (the classic RSI loss).
- Momentum entries late in an exhausted move.
- Divergence-hunting without a trigger, which turns into catching falling knives.`,
      mistakes: `- Selling simply because RSI is above 70.
- Mixing the two variants in the same session.
- Treating divergence as a signal on its own.
- Moving the levels (25/75, 20/80) after each loss.`,
      backtest: `Quant Lab: reversion test uses **RSI crosses back from extreme** (n 14, lo 30, hi 70) for long and short. For momentum, use **RSI above/below 50** with **ADX above threshold** min 25 and **Fast EMA crosses slow EMA** as a trigger. The preloaded config is the reversion rule without its ADX < 20 filter (the catalogue can only require a strong trend, not a weak one) and with a fixed 1.5R target instead of VWAP. Run both on the same seeds. Then try the reversion rule only on trending seeds to see how it fails. 200+ trades per variant.`,
      chart: `[[chart:MIDCAP:9:rsi,adx]]`,
      btConfig: { side: 1, entry: [{ id: 'rsi_extreme', params: { n: 14, lo: 30, hi: 70 } }], stop: { type: 'atr', mult: 1.2 }, target: { rr: 1.5 } },
    },
    {
      id: 'macd-strategies', n: 8, name: 'MACD strategies', family: 'momentum', evidence: 'mixed',
      markets: `Index futures, liquid stocks, commodities.`,
      timeframes: `5- or 15-minute chart with MACD(12, 26, 9). Faster traders use (8, 17, 9) on 3-minute.`,
      indicators: `MACD line, signal line, histogram, 50 EMA as trend filter, ATR(14).`,
      concept: `MACD is the gap between a 12 EMA and a 26 EMA; the signal line is a 9-period EMA of that gap; the histogram is their difference. A histogram crossing above zero means momentum is accelerating up. The strategy trades histogram zero-crosses in the direction of a higher-level trend filter.`,
      logic: `MACD is a momentum oscillator built from moving averages, so it is still lagging. Filtering signals with a slower trend (price above the 50 EMA for longs) aims to keep only crosses that align with the bigger move and skip counter-trend noise.

> [!evidence] MACD crossovers are a trend/momentum heuristic with mixed evidence; edges reported in publications often shrink after costs.`,
      setup: `1. Price above the 50 EMA on the 5-minute chart (long) or below (short).
2. MACD line on the trade side of zero or crossing it, not deeply opposite.
3. 09:45–14:30 IST.`,
      entry: `- **Long:** MACD histogram turns from ≤ 0 to > 0 on a candle close while price is above the 50 EMA. Buy next open.
- **Short:** histogram turns from ≥ 0 to < 0 while price is below the 50 EMA.`,
      confirmation: `- Price on the same side of VWAP.
- RSI(14) above 50 for longs, below 50 for shorts.`,
      stop: `1.5 × ATR(14) or beyond the most recent swing, whichever is closer.`,
      target: `2R, or exit when the histogram crosses back.`,
      sizing: `0.5–1% risk.`,
      rr: `1:2.`,
      exits: `- Histogram crosses the other way: close.
- Stop, target or 15:10.`,
      management: `Move stop to entry at 1R. Do not take a new MACD signal within 3 candles of a stopped-out one in the same direction. Keep a note of whether each signal came with the MACD line above or below zero; crosses that happen below zero in an uptrend filter are earlier but less confirmed, and you want to know from your own data whether that distinction matters.`,
      winExample: `**Nifty futures, 1 lot (65).** Price above 50 EMA all morning. At 11:15 the histogram turns positive with price at 25,964 and RSI 56. Buy at 25,967. ATR 20; stop 25,937 (30 points, ₹1,950). Target 2R = 26,027. Reached at 13:05. +60 points, ₹3,900 gross, about ₹2,900 net.`,
      loseExample: `**SBI, 1,000 shares.** Above 50 EMA, histogram turns positive at ₹822.40. Buy at ₹822.55, stop ₹820.85 (₹1.70, ₹1,700). Price rises to ₹823.60, then the histogram flips back negative two candles later. Exit at ₹821.90 on the next open: −₹650 plus charges of about ₹340. MACD often gives such early reversals on flat, low-volume afternoons.`,
      failure: `- Sideways sessions where the histogram oscillates around zero.
- Sharp reversals: MACD signals arrive after much of the move.
- Very fast settings on 1-minute data.

**What a bad MACD week looks like:** the index trades in a 0.6% band for three sessions. The histogram crosses zero eight or nine times a day; with the 50-EMA filter you take perhaps three of those daily, and most are stopped or exited on the reverse cross for −0.3R to −1R. Nothing is wrong with the rule; the regime simply offers no momentum to measure. That is why the trade list should be grouped by day type, and why a run of small losses is expected rather than a reason to change settings.`,
      mistakes: `- Treating MACD divergences as reversal signals without a trigger.
- Comparing MACD values across instruments (it is in price units, not normalised).
- Stacking MACD, RSI and stochastic, which are highly correlated, and calling it confluence.
- Re-optimising (12, 26, 9) for each stock.`,
      backtest: `Quant Lab: **MACD crosses signal line** (f 12, s 26, sig 9) with **RSI above/below 50** and **Close on the trade side of VWAP**. The 50-EMA filter is not a catalogue signal; VWAP side is the closest proxy. Run long and short. Try 8/17/9 and 12/26/9 only, not dozens of combinations. 250+ trades; look at returns by hour of day using the trade list.`,
      chart: `[[chart:NIFTY:44:ema50,macd]]`,
      btConfig: { side: 1, entry: [{ id: 'macd_cross', params: { f: 12, s: 26, sig: 9 } }, { id: 'rsi_trend', params: { n: 14 } }, { id: 'vwap_side', params: {} }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 } },
    },
    {
      id: 'bollinger-strategies', n: 9, name: 'Bollinger Band strategies', family: 'reversion', evidence: 'mixed',
      markets: `Range-bound large caps and index futures for fades; any liquid instrument for squeeze breakouts.`,
      timeframes: `5-minute with Bollinger(20, 2).`,
      indicators: `Bollinger Bands (20 SMA ± 2 standard deviations), bandwidth, ADX(14), RSI(14).`,
      concept: `Bollinger Bands wrap price in an envelope two standard deviations from a 20-period average. Two strategies follow. **Band fade:** after a close outside the band, buy or sell the close back inside, targeting the middle band. **Squeeze breakout:** when bandwidth is unusually narrow, trade the direction of the first close outside the band.`,
      logic: `Standard deviation is a measure of recent volatility, not a probability boundary; prices are not normally distributed and closes outside the band are common in trends. The fade bets on mean reversion in quiet markets; the squeeze bets that low volatility is followed by expansion. The ADX filter decides which one is in play.

> [!evidence] John Bollinger describes the bands as a relative framework, not a signal. Both strategies are mixed-evidence.`,
      setup: `**Fade:** ADX(14) < 20; bandwidth not at a 50-bar low.
**Squeeze:** bandwidth at its lowest in 50 bars; any ADX.`,
      entry: `- **Fade long:** previous candle closed below the lower band, current candle closes back above it. Buy next open.
- **Fade short:** mirror at the upper band.
- **Squeeze long:** first close above the upper band after a squeeze, with volume ≥ 1.5 × average.`,
      confirmation: `- Fade: RSI(14) below 35 at the outside close (long).
- Squeeze: close also above VWAP.`,
      stop: `Fade: below the outside-band candle's low, max 1.2 × ATR. Squeeze: middle band or 1.5 × ATR.`,
      target: `Fade: middle band (20 SMA); if that is less than 1R away, skip. Squeeze: 2R.`,
      sizing: `0.5% risk on fades, 0.5–1% on squeezes.`,
      rr: `Fade 1:1 to 1:1.5; squeeze 1:2.`,
      exits: `- Fade: exit if a second consecutive close outside the band occurs after entry.
- Stop, target, 15:10.`,
      management: `Fades are short-lived trades: 30-minute time stop. Squeeze trades move stop to entry at 1R and trail on the middle band. Record bandwidth at entry for every trade; it is the variable most likely to separate good from bad fades in your own data.`,
      winExample: `**ITC, 2,000 shares, quiet day (ADX 14).** A candle closes at ₹428.10 below the lower band ₹428.40; the next closes back inside at ₹428.90. Buy at ₹428.95. Stop ₹427.85 (₹1.10, ₹2,200). Middle band ₹430.60 is 1.5R. Filled at 12:10. Gross ₹3,300, net about ₹2,950.`,
      loseExample: `**Nifty futures, 1 lot (65).** Close back above lower band at 25,690 after a close at 25,671. Buy at 25,693, stop 25,662 (31 points, ₹2,015). The market is actually beginning a trend day; the band widens and price rides the lower band down. Stop fills at 25,660: −33 points, ₹2,145 plus ₹1,000 costs. On a trend day the fade loses repeatedly; the ADX filter reads 19 at entry and only rises later.`,
      failure: `- Fades in trends ("walking the band").
- Squeeze breakouts that reverse (false expansion).
- News candles that blow through both bands.

**Why the bands mislead in trends:** in a steady rally the standard deviation widens and the 20 SMA rises, so price can close at or above the upper band for ten or more candles. Each fade short in that sequence is stopped out, and the band "re-entry" signal can fire repeatedly as price wobbles around the band. A regime filter and a cap of two fades per side per day limit the damage. Measure how many of your losing fades occurred on days when ADX later rose above 25.`,
      mistakes: `- Assuming a close outside the band is statistically rare.
- Fading every upper-band touch.
- Running fade and squeeze rules together without a regime rule.
- Using the bands on illiquid stocks with gappy prices.`,
      backtest: `Quant Lab: **Close back inside Bollinger Band** (n 20, k 2) for fades, long and short. For squeeze breakouts there is no bandwidth signal in the catalogue, so test **Volume spike** combined with an **Opening-range breakout** or note it as untestable here and journal 50+ manual trades instead. The preloaded config is the fade without its ADX < 20 and RSI < 35 conditions, with a fixed 1.5R target instead of the middle band. Compare the fade on several seeds with different regimes. 200+ fade trades.`,
      chart: `[[chart:RELIANCE:13:bb,rsi]]`,
      btConfig: { side: 1, entry: [{ id: 'bb_reentry', params: { n: 20, k: 2 } }], stop: { type: 'atr', mult: 1.2 }, target: { rr: 1.5 } },
    },
    {
      id: 'trend-following', n: 10, name: 'Trend following', family: 'trend', evidence: 'mixed',
      markets: `Index futures, commodity futures (crude, gold), currency futures, liquid stocks. Best on instruments that trend intraday with reasonable frequency.`,
      timeframes: `15-minute chart for direction, 5-minute for entries; hold until a trailing exit or the close.`,
      indicators: `ADX(14), 20 and 50 EMA, Donchian channel (20), ATR(14), Supertrend as a trailing exit.`,
      concept: `Trend following does not predict. It enters after a move is under way and stays in while it continues, cutting losses fast and letting winners run. Most trades are small losers or scratches; a few large trend days carry the result. Intraday, this means accepting many small red days.`,
      logic: `If price moves have some persistence (autocorrelation) on the timescale traded, buying strength and selling weakness with a trailing stop captures part of those runs. The return profile is positively skewed: a low hit rate and large occasional winners.

> [!evidence] Trend following has a long research record on daily and longer futures data with periods of strong and very poor performance. Intraday evidence is thinner and highly cost-sensitive.`,
      setup: `1. 15-minute ADX(14) ≥ 25.
2. 20 EMA above 50 EMA on the 15-minute chart (long).
3. Price above session VWAP.`,
      entry: `Buy on a 5-minute close above the highest high of the previous 20 five-minute bars (Donchian breakout). Short is the mirror.`,
      confirmation: `- Volume on the breakout candle above the 20-bar average.
- Index and sector aligned.`,
      stop: `2 × ATR(14) from entry.`,
      target: `No fixed target. Trail with Supertrend(10, 3) on 5-minute, or a 3 × ATR chandelier stop.`,
      sizing: `0.5–0.75% risk; wide stops mean small quantity. Never add size to make up for a small position.`,
      rr: `Open-ended; average winners must be several times average losers for the system to have any chance.`,
      exits: `- Trailing stop.
- 15:15 IST close-out for NSE instruments; for MCX contracts, a fixed close-out time before the MCX session end that you have written down in advance.`,
      management: `Pyramiding is allowed only after the first unit is at 1R and the stop for the whole position has been moved to protect the original risk. Maximum two units.

Expect long flat or losing stretches. Before going live, decide the maximum drawdown in R (for example 15R) that you will tolerate before pausing to review, and base that number on Monte Carlo results rather than on how you feel after a bad week. Review the system monthly, not daily: a trend system judged on one week is judged on noise.`,
      winExample: `**Crude oil futures (MCX), 1 lot (100 barrels).** ADX 30, EMAs aligned. Breakout above the 20-bar high ₹5,642 at 14:10 IST. Buy at ₹5,645, ATR ₹9; stop ₹5,627 (₹18 × 100 = ₹1,800 risk). US inventory data drives a trend; Supertrend trails to ₹5,701 and is hit at 21:30. +₹56 × 100 = ₹5,600 gross, about 3.1R before costs. MCX commodity futures carry CTT and MCX fees rather than NSE STT and charges, so the app's India charges calculator does not cover them; check your broker's contract note.`,
      loseExample: `**Nifty futures, 1 lot (65).** ADX 27, Donchian break at 25,902. Buy at 25,906, ATR 22, stop 25,862 (44 points, ₹2,860). Price rises 9 points then reverses into a range. Stopped at 25,861 after slippage: −45 points, ₹2,925 plus costs. Next day: same pattern. Four such losses in a week is entirely possible for a trend-following rule, and the test is whether you can take the fifth signal.`,
      failure: `- Prolonged range regimes; losses accumulate slowly.
- Choppy expiry sessions.
- Trends that end on gaps overnight (irrelevant intraday but relevant if you carry).`,
      mistakes: `- Taking profits early "to lock in", which removes the large winners the system depends on.
- Stopping after a losing streak.
- Choosing instruments after looking at which trended last month.
- Adding filters after every losing streak until the sample shrinks to a handful of trades.
- Comparing your result with a single great trend day you remember, rather than the full trade list.`,
      backtest: `Quant Lab: there is no Donchian signal, so use **ADX above threshold** (min 25) + **Break of previous-day high / low** as a breakout proxy, or **Supertrend flips direction**. Set target rr to a large value (for example 5) to approximate a trailing exit, and examine the distribution of R, not just the average. Use Monte Carlo to see drawdown ranges. Trend systems need large samples: 300+ trades and several seeds.`,
      chart: `[[chart:GOLD:21:ema20,ema50,dc,adx]]`,
      btConfig: { side: 1, entry: [{ id: 'adx_trend', params: { n: 14, min: 25 } }, { id: 'supertrend_flip', params: { n: 10, m: 3 } }], stop: { type: 'atr', mult: 2 }, target: { rr: 5 } },
    },
    {
      id: 'momentum-trading', n: 11, name: 'Momentum trading', family: 'momentum', evidence: 'mixed',
      markets: `NSE F&O stocks with news, results or sector rotation; US stocks with earnings or high relative volume.`,
      timeframes: `5-minute; scanning from 09:20 IST onwards.`,
      indicators: `Relative volume (today vs average for the same time), % change, VWAP, RSI(14), ATR(14).`,
      concept: `Momentum traders look for stocks already moving strongly on unusually high volume and join the move, betting that the imbalance of orders continues for a while. It is about selection (which stock) as much as timing.`,
      logic: `News, results or large orders take time to be absorbed. Stocks with high relative volume and strong price change are where the order flow is. The trade buys strength on a pause and exits fast if the strength fades.

> [!evidence] Cross-sectional momentum is a documented long-horizon effect; intraday continuation after big moves is less clear and some studies find reversal instead. Mixed.`,
      setup: `1. Stock up at least 2% from the previous close by 10:00 IST with cumulative volume ≥ 2 × its average for that time.
2. Above VWAP since 09:30.
3. Not in the F&O ban list and not near its circuit limit.`,
      entry: `Buy at the next open after a 5-minute candle closes above the high of a 2–4 candle pause (flag) that stayed above VWAP. Volume on the breakout candle ≥ 1.8 × 20-bar average.`,
      confirmation: `- RSI(14) above 60.
- Sector index positive.`,
      stop: `Below the flag low; max 1.5 × ATR(14).`,
      target: `2R; second half trailed under each 5-minute higher low.`,
      sizing: `0.5% risk. Momentum stocks are volatile; slippage on exits can be large, so reduce size compared with index futures.`,
      rr: `1:2 planned; actual fills can make it worse.`,
      exits: `- Close below VWAP: exit everything.
- Stop, target, trailing stop, or 15:10.`,
      management: `Book half at 1R and move stop to entry. Never average a failing momentum trade. Check the stock's circuit band and F&O ban status each morning before it reaches your scanner, not after you are in the trade.`,
      winExample: `**Tata Steel, 3,000 shares.** Up 2.6% at 09:55 on 2.5× volume after metal prices jump. Flag forms ₹168.20–₹169.10 above VWAP ₹167.40. Breakout close ₹169.35 on 2× volume. Buy at ₹169.40, stop ₹168.10 (₹1.30, ₹3,900). 1R ₹170.70: book 1,500. Trail exits the rest at ₹172.30. Gross ₹1,950 + ₹4,350 = ₹6,300 (1.6R on the full position), net about ₹6,070 (verify with [[widget:charges-india]]).`,
      loseExample: `**A high-beta new-age F&O stock, 1,500 shares near ₹282.** Up 3% with heavy volume; flag breakout at ₹282.40. Buy at ₹282.50, stop ₹280.60 (₹1.90, ₹2,850). Within ten minutes a block deal crosses and sellers appear; price drops through ₹280.60 in one candle. Fill ₹280.20: −₹3,450 plus charges. Slippage turned a 1R plan into a 1.2R loss.`,
      failure: `- Late entries after a stock has moved 5%+ and is extended from VWAP.
- Afternoon fade after a morning spike.
- Stocks where the "news" was already priced in pre-open.

**Typical failure sequence:** a stock gaps up 4% on results, extends to 6% by 09:45, then pauses. The flag looks clean, volume is high, you buy the breakout. Early buyers are already up 6% and use the new high to sell; the breakout candle is the day's high and price drifts back to VWAP by lunchtime. Selection was right (it was the strongest stock), timing was late. A hard rule such as "no entry if price is more than 1.5 daily ATRs above the previous close" removes some of these trades; test whether it helps.`,
      mistakes: `- Chasing the biggest gainer at the top of the day.
- Ignoring circuit limits and ASM/GSM flags.
- Using the same size as on index futures.`,
      backtest: `Quant Lab: **Volume spike** (k 1.8) + **RSI above/below 50** + **Close on the trade side of VWAP**. The catalogue's RSI filter is > 50, looser than the written RSI > 60, and there is no flag detector. Note that selection across many stocks cannot be simulated on one synthetic series; this tests only the timing rule. For selection, keep a scan journal for 60+ sessions. 200+ trades for timing.`,
      chart: `[[chart:MIDCAP:28:vwap,vol,rsi]]`,
      btConfig: { side: 1, entry: [{ id: 'volume_spike', params: { k: 1.8 } }, { id: 'rsi_trend', params: { n: 14 } }, { id: 'vwap_side', params: {} }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 } },
    },
    {
      id: 'scalping', n: 12, name: 'Scalping', family: 'momentum', evidence: 'speculative',
      markets: `Only the most liquid instruments: Nifty futures, Bank Nifty futures, top 10 F&O stocks, US index futures and ETFs. Spread must be one tick most of the time.`,
      timeframes: `1-minute chart and the order book; holding periods of seconds to a few minutes.`,
      indicators: `VWAP, 9 EMA on 1-minute, order book depth, time-and-sales. Indicators matter less than costs and execution.`,
      concept: `Scalping takes many small moves, usually a few ticks, many times a day. The edge, if any, comes from execution quality and reading short-term order flow. For retail traders with exchange fees, STT, GST, slippage and latency, the bar for a scalping edge is extremely high.`,
      logic: `If you can enter on small imbalances and exit within seconds or minutes, each trade has small risk. But costs are fixed per trade, so cost per trade is a large fraction of the expected move. A scalper's realised edge must exceed round-trip costs plus slippage on every trade on average.

> [!warn] For Indian retail traders, round-trip costs on a Nifty futures lot (about ₹1,000 including STT at 0.05% on sell, exchange fees and GST, as of Nov 2026, verify with [[widget:charges-india]]) are roughly 15 Nifty points. A 10-point scalp loses money even when it is "right".`,
      setup: `1. Spread one tick; top-of-book quantity at least 10 × your order size.
2. Market moving: last 15 minutes' 1-minute ATR ≥ 2.5 × the round-trip cost in points.
3. Price on one side of VWAP with 9 EMA sloping.`,
      entry: `Buy a 1-minute close above the prior 1-minute high when price is above VWAP and the 9 EMA is rising. Limit order at the bid or one tick above.`,
      confirmation: `Time-and-sales shows larger prints on the offer; bid stack refilling after hits.`,
      stop: `Fixed 1.0 × 1-minute ATR or a pre-set point amount (for example 12 Nifty points), placed as a stop order immediately.`,
      target: `1.5 × stop distance, with costs counted: the gross target must exceed costs by at least the stop distance.`,
      sizing: `0.25% risk per trade; daily loss limit of 1.5% that ends the session.`,
      rr: `Around 1:1.5 gross; net R:R is much worse after costs.`,
      exits: `- Stop or target.
- Time stop: 5 minutes without progress.
- Daily loss limit.`,
      management: `No holding through news releases. Stop after three consecutive losses for a 30-minute break.

Track net P&L per trade after all charges, not gross points. A useful daily metric is "costs as a percentage of gross profit"; if it exceeds 50% you are working mainly for the broker and exchange. Review fill quality: compare your entry price with the candle's close that triggered it and log the slippage in ticks. If average slippage plus costs exceeds a third of your average winner, the strategy is not viable at your size and speed, whatever the charts say.`,
      winExample: `**Nifty futures, 1 lot (65).** At 10:12 a 1-minute close above the prior high, above VWAP. Buy at 25,812, stop 25,800 (12 points, ₹780). Target 25,830 (18 points). Hit four minutes later: ₹1,170 gross. After about ₹1,000 costs, net ≈ ₹170. A "winning" scalp barely covers costs. Note that this trade fails the strategy's own target rule: the 18-point target does not exceed costs (about 15 points) plus the 12-point stop, so under the written rules it should have been skipped.`,
      loseExample: `**Bank Nifty futures, 1 lot (30).** Scalp long at 57,105, stop 57,075 (30 points, ₹900). A fast candle drops 45 points and the stop fills at 57,066: −39 points, ₹1,170 plus ₹1,000 costs = ₹2,170 loss, about 2.4 times the planned risk once costs are included.`,
      failure: `- Any period when costs exceed the average move captured.
- Fast markets where stops slip.
- Mental fatigue after 30+ trades.`,
      mistakes: `- Ignoring costs, the single biggest scalping mistake.
- Overtrading after a loss.
- Scalping options with wide spreads.
- Using market orders in thin books.
- Scaling up size before measuring slippage at the smaller size.`,
      backtest: `Quant Lab on 1-minute bars: **Close on the trade side of VWAP** + **Fast EMA crosses slow EMA** (3/9). Set slippage to at least 1 tick and costs realistically high (raise costBps). Run twice, with and without costs, to see how much costs alone change the result. Scalping requires 500+ trades and a separate test of real fills, which a bar-based backtester cannot model.`,
      chart: `[[chart:NIFTY:3:vwap,ema9,vol]]`,
      btConfig: { side: 1, entry: [{ id: 'vwap_side', params: {} }, { id: 'ema_cross', params: { fast: 3, slow: 9 } }], stop: { type: 'atr', mult: 1 }, target: { rr: 1.5 } },
    },
    {
      id: 'price-action', n: 13, name: 'Price action trading', family: 'structure', evidence: 'subjective',
      markets: `Any liquid market. Works the same in principle on Nifty futures, NSE stocks, US stocks, gold or crude, because it reads only candles and levels.`,
      timeframes: `5-minute for entries, 15-minute and daily for levels and context.`,
      indicators: `None required. Horizontal levels (previous-day high/low, opening range, swing points), candle structure, volume as an optional check.`,
      concept: `Price action trading means making decisions from the candles and levels themselves rather than from indicators. A typical rule-based version: at a pre-marked level, wait for a rejection candle (pin bar or engulfing) in the direction of the higher-timeframe trend, then enter on a break of that candle's extreme.`,
      logic: `Indicators are derived from price, so reading price directly removes lag. The difficulty is that "reading" is subjective: two traders will mark different levels and see different candles. The way to make it testable is to define levels and candle patterns numerically.

> [!evidence] Most candlestick lore is a subjective framework. Research on candlestick patterns finds weak or inconsistent predictive value once costs are included. Treat each pattern as a trigger for a defined-risk trade, not a forecast.`,
      setup: `1. Mark levels before 09:15: previous-day high (PDH), previous-day low (PDL), previous close, and any 15-minute swing high/low from the last two sessions.
2. Higher-timeframe trend: 15-minute 20 EMA rising (for longs) or falling (for shorts).
3. Price reaches within 0.1% of a marked level.`,
      entry: `Long at a support level: a 5-minute **pin bar** (lower wick ≥ 2 × body, close in upper third) or **bullish engulfing** candle forms at the level. Place a buy-stop one tick above that candle's high; cancel if not triggered within the next 2 candles. Short is the mirror at resistance.

[[pattern:pin-bar]]`,
      confirmation: `- Volume on the rejection candle above the 20-bar average.
- The rejection is in the direction of the 15-minute trend.
- The level has not been crossed more than twice already today.`,
      stop: `One tick beyond the rejection candle's wick. If that is more than 1.5 × ATR(14), skip the trade.`,
      target: `The next marked level, provided it is at least 1.5R away; otherwise skip.`,
      sizing: `0.5–1% risk based on the wick stop.`,
      rr: `Minimum 1:1.5 to the next level; many setups fail this test and should be skipped.`,
      exits: `- Next level reached.
- A close beyond the level against you.
- 15:10 IST.`,
      management: `At 1R move stop to entry. If price stalls for 6 candles without progress, exit at market. Write down the exact pattern and level in the journal so the subjective part can be measured later.`,
      winExample: `**Nifty futures, 1 lot (65).** PDL 25,640. 15-minute trend up. At 10:45 price dips to 25,642 and prints a pin bar: low 25,636, high 25,668, close 25,664. Buy-stop at 25,669 triggers. Stop 25,635 (34 points, ₹2,210). Next level is the opening high 25,735 (66 points, 1.9R). Reached at 12:30. Gross ₹4,290, net about ₹3,290.`,
      loseExample: `**Axis Bank, 600 shares.** Resistance at PDH ₹1,182.50. A bearish engulfing forms at ₹1,182.20 with the 15-minute trend down. Sell-stop at ₹1,179.90 triggers; stop ₹1,183.10 (₹3.20, ₹1,920). A positive sector headline arrives and buyers return; price breaks PDH and runs to ₹1,186. Stop fills at ₹1,183.30: −₹2,040 plus charges. The pattern was textbook; the context changed.`,
      failure: `- Levels drawn after the fact, which makes every past trade look good.
- Patterns taken in the middle of a range rather than at levels.
- Strong trend days where every support breaks.
- Low-volume lunch periods.`,
      mistakes: `- Seeing patterns everywhere (confirmation bias).
- Changing the definition of a pin bar from trade to trade.
- Trading patterns without a level.
- Assuming "smart money" left the wick; a wick only shows where price traded.`,
      backtest: `The catalogue cannot detect pin bars, so there is no btConfig. Test this in two steps: (1) in the Chart Lab, replay 60+ sessions bar by bar with levels drawn in advance and log every qualifying setup in the Journal; (2) use the Journal analytics for R by setup and by level type. You need at least 100 logged trades with strictly written pattern definitions before deciding anything. The Quant Lab can still test the level part: **Break of previous-day high / low** shows how often PDH/PDL breaks continue rather than reject.`,
      chart: `[[chart:NIFTY:52:vol]]`,
      btConfig: null,
    },
    {
      id: 'volume-breakout', n: 14, name: 'Volume breakout', family: 'breakout', evidence: 'mixed',
      markets: `NSE cash and F&O stocks, US stocks. Less useful on index futures, where volume is dominated by hedging and roll.`,
      timeframes: `5-minute bars; consolidation measured over 6–20 candles.`,
      indicators: `Volume, 20-bar average volume, VWAP, ATR(14), consolidation high/low.`,
      concept: `A breakout from a tight consolidation on a surge of volume suggests that many orders arrived at once. The strategy buys the breakout candle when volume is at least 1.8 times the recent average, on the view that participation makes follow-through more likely than a low-volume poke.`,
      logic: `Volume measures how much traded, not who traded or why. A spike at a breakout means more contracts changed hands; it can be aggressive buyers lifting offers or large sellers being absorbed. Requiring volume and a close beyond the range filters out some of the weakest breaks.

> [!evidence] Volume-confirmed breakouts are a widely taught practitioner rule; academic evidence on volume as a predictor is mixed and market-specific.`,
      setup: `1. A consolidation of at least 6 five-minute candles whose total high–low range is under 1 × ATR(14) of the 5-minute chart.
2. The consolidation lies above VWAP (for longs).
3. Time 09:45–14:00 IST.`,
      entry: `Buy at the next open after a 5-minute candle closes above the consolidation high with volume ≥ 1.8 × the 20-bar average volume.`,
      confirmation: `- Breakout candle closes in the upper 30% of its range.
- No large upper wick (less than 40% of the candle).
- The next candle does not trade back below the consolidation mid-point.`,
      stop: `Below the consolidation low, or the mid-point for tighter risk; cap at 1.5 × ATR.`,
      target: `2R. Note the measured move (consolidation height added to the breakout level) as a reference; if it lies short of 1R, the breakout has little room by that yardstick, which is worth logging.`,
      sizing: `0.5–1% risk. Check average traded value: your order should be under 1% of the stock's one-minute traded value so you do not move it.`,
      rr: `1:2 planned.`,
      exits: `- Close back inside the consolidation for two candles.
- Stop, target, 15:10.`,
      management: `Book half at 1R, move stop to entry, trail under the 9 EMA on the 5-minute chart. If the breakout candle's volume is the highest of the day, note it: climactic volume sometimes marks exhaustion rather than the start of a move, and only your log can tell you which is more common in the stocks you trade.`,
      winExample: `**Bharti Airtel, 300 shares.** Consolidation ₹1,948–₹1,955 (₹7 range) for 8 candles above VWAP, ATR ₹7.40, so the range is under 1 × ATR. At 11:20 a candle closes at ₹1,957.60 on 2.3× volume. Buy at ₹1,957.80, stop at mid ₹1,951.50 (₹6.30, ₹1,890). The measured move ₹1,962 is less than 1R away, so it is logged as a reference only; target 2R ₹1,970.40. Reached at 13:15. Gross ₹3,780, net about ₹3,520.`,
      loseExample: `**Nifty-50 stock, 1,200 shares near ₹612.** Consolidation ₹609.50–₹611.80; breakout close ₹612.30 on 2× volume. Buy ₹612.40, stop ₹610.60 (₹1.80, ₹2,160). The spike was one large seller being absorbed; once it finished, buyers disappeared. Two candles later price is back at ₹610.40; stop fills at ₹610.50: −₹2,280 plus charges. High volume confirmed activity, not direction.`,
      failure: `- Volume spikes from block deals, index rebalancing or option-hedging flows.
- Breakouts into the previous-day high or a round number that acts as resistance.
- Late-day breakouts with little session left.

**India-specific traps:** volume spikes around 09:15–09:20 (opening auction carry-over), around 15:20–15:30 (closing-session positioning), on F&O expiry days and on index rebalancing dates are mostly mechanical. Volume can also jump when a stock enters or leaves the F&O ban list, or when a bulk or block deal crosses. None of these say much about direction. Exclude these windows explicitly in your rules, or group trades by them in the journal to see how they behave.`,
      mistakes: `- Measuring volume against the whole day's average instead of the same time of day; volume is always high at the open.
- Ignoring the close; intrabar volume spikes vanish.
- Using volume on spot indices.
- Treating a volume spike as proof of buying; every trade has a buyer and a seller.`,
      backtest: `Quant Lab: the catalogue has no consolidation detector, so the proxy is **Volume spike** (k 1.8) + **Close on the trade side of VWAP** + **ADX above threshold** (min 20). Adding **Opening-range breakout** as well produces almost no trades, because a volume surge rarely lands on the single bar that first breaks the range; that is worth seeing for yourself. Compare k = 1.5, 1.8, 2.5. Remember volume patterns in synthetic data may not resemble real NSE volume; repeat on imported CSV data. 200+ trades.`,
      chart: `[[chart:RELIANCE:19:vwap,vol]]`,
      btConfig: { side: 1, entry: [{ id: 'volume_spike', params: { k: 1.8 } }, { id: 'vwap_side', params: {} }, { id: 'adx_trend', params: { n: 14, min: 20 } }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 } },
    },
    {
      id: 'gap-up', n: 15, name: 'Gap-up trading', family: 'momentum', evidence: 'mixed',
      markets: `NSE F&O stocks and index futures; US stocks with pre-market gaps. Gap size is measured from the previous close to the 09:15 open.`,
      timeframes: `5-minute chart, first 60 minutes of the session.`,
      indicators: `Gap %, previous-day high/close, opening range (first 15 minutes), VWAP, relative volume.`,
      concept: `A gap-up open means price opened above the previous close, usually because of news or global cues. Two opposite trades exist: **gap-and-go** (buy if the gap holds and extends) and **gap fade** (sell if the gap fails). The rules below define which one is in play by watching the first 15 minutes.`,
      logic: `If the gap reflects real new information, buyers keep supporting it and price holds above VWAP and the opening range. If the gap was driven by thin pre-open orders or overnight optimism, early profit-taking can drive price back towards the previous close.

> [!evidence] Both gap continuation and gap filling are observed; which dominates depends on gap size, news and market. Mixed.`,
      setup: `1. Gap of 1–4% for stocks (0.4–1.2% for Nifty) from previous close.
2. Note whether the open is above the previous-day high (a "clean" gap) or inside the previous range.
3. Mark the 09:15–09:30 opening range.`,
      entry: `- **Gap-and-go long:** after 09:30, a 5-minute close above the opening-range high while price is above VWAP. Buy next open.
- **Gap fade short:** a 5-minute close below the opening-range low and below VWAP. Sell next open, target towards the previous-day close.`,
      confirmation: `- Gap-and-go: opening 15-minute volume at least 2 × average and the sector also gapped up.
- Fade: the gap had no clear news, and the index is flat or down.`,
      stop: `Gap-and-go: opening-range low or 1.5 × ATR, whichever is closer. Fade: opening-range high.`,
      target: `Gap-and-go: 2R. Fade: previous-day close (the "gap fill") or 2R, whichever first.`,
      sizing: `0.5% risk; gap days have higher volatility and wider ranges.`,
      rr: `Aim for 1:2; skip if the opening range makes the stop larger than 1.5 × ATR.`,
      exits: `- Stop, target, 15:10.
- For gap-and-go, exit if price closes back below VWAP for 2 candles.`,
      management: `Move stop to entry at 1R. Only one direction per stock per day: if the gap-and-go long is stopped, do not then short the fade.`,
      winExample: `**Infosys, 400 shares.** Previous close ₹1,590, previous-day high ₹1,598. Strong results; opens at ₹1,642 (3.3% gap). Opening range ₹1,636–₹1,651 with heavy volume. At 09:45 close ₹1,653.40 above VWAP ₹1,645. Buy at ₹1,653.60, stop ₹1,641.20 (ATR cap, ₹12.40, ₹4,960). Target 2R ₹1,678.40, reached by 12:40. Gross ₹9,920, net about ₹9,630 (verify with [[widget:charges-india]]).`,
      loseExample: `**Nifty futures, 1 lot (65).** Gap-up 0.7% to 26,010 on strong US cues. Opening range 25,995–26,040. Close above at 26,046 with price above VWAP. Buy at 26,050, stop 26,005 (45 points, ₹2,925). FII selling appears from 10:15; price fills the gap towards the previous close 25,830. Stopped at 26,002: −48 points, ₹3,120 plus costs. A global-cue gap without domestic follow-through is a common gap-and-go loss.`,
      failure: `- Huge gaps (over 5%) where the move is mostly done.
- Gaps into resistance (previous swing highs).
- Expiry days and event days.`,
      mistakes: `- Buying at 09:15 at market into the opening auction volatility.
- Fading every gap because "gaps always fill".
- Taking both directions on the same stock.`,
      backtest: `Quant Lab: the catalogue has no gap filter, so test the opening-range rule (**Opening-range breakout** bars 3 + **Close on the trade side of VWAP**; adding **Volume spike** cuts the sample to a handful of trades, so test that filter separately) and then use the trade list to group trades by whether the day opened with a gap (use the Journal grouping or note the opening price manually). The cleanest test is a manual log of 80+ real gap days from NSE data imported via CSV. Expect gap days to be a minority of sessions, so samples grow slowly.`,
      chart: `[[chart:MIDCAP:35:vwap,vol]]`,
      btConfig: { side: 1, entry: [{ id: 'orb', params: { bars: 3 } }, { id: 'vwap_side', params: {} }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 } },
    },
    {
      id: 'gap-down', n: 16, name: 'Gap-down trading', family: 'momentum', evidence: 'mixed',
      markets: `NSE F&O stocks and index futures (shorting intraday in cash is allowed but must be squared off the same day; futures avoid short-delivery risk). US stocks with pre-market gaps.`,
      timeframes: `5-minute chart, first 60–90 minutes.`,
      indicators: `Gap %, previous-day low/close, opening range, VWAP, relative volume.`,
      concept: `The mirror of gap-up trading: after a gap-down open, either the selling continues (**gap-and-go short**) or the gap is bought and price recovers (**gap-down reversal long**). Gap-downs often come with fear and faster moves, so stops and sizing need extra care.`,
      logic: `Bad news can cause forced selling that persists; panic or thin pre-open selling can also overshoot, followed by a recovery as buyers step in at a discount. The first 15 minutes help separate the two.

> [!evidence] Behaviour after gap-downs varies with news type and market regime. Mixed.`,
      setup: `1. Gap-down of 1–4% for stocks (0.4–1.2% for Nifty).
2. Mark previous-day low and close; note whether the open is below the previous-day low.
3. Mark the 09:15–09:30 opening range.`,
      entry: `- **Gap-and-go short:** after 09:30, a 5-minute close below the opening-range low and below VWAP. Sell next open.
- **Reversal long:** a 5-minute close above the opening-range high and above VWAP, with the previous-day low reclaimed. Buy next open.`,
      confirmation: `- Short: sector also down; volume on the break ≥ 1.5 × average.
- Reversal long: index recovering; the gap was not driven by company-specific negative news (results, regulatory action).`,
      stop: `Short: opening-range high or 1.5 × ATR above entry, whichever is closer. Long: opening-range low or 1.5 × ATR below entry, whichever is closer.`,
      target: `2R. For the reversal long, the previous close (gap fill) if it lies before 2R.`,
      sizing: `0.5% risk. Short squeezes can move fast; check that one lot or the share quantity at the stop keeps you within risk even with 2 ticks of slippage.`,
      rr: `1:2.`,
      exits: `- Stop, target, 15:10.
- Short: exit if price reclaims VWAP for two closes.`,
      management: `At 1R move stop to entry. Avoid trading company-specific gap-downs from fraud or regulatory news; those can hit circuit limits or behave erratically.`,
      winExample: `**Bank Nifty futures, 1 lot (30).** Weak global cues; gap-down 0.9% to 56,350, below the previous-day low 56,520. Opening range 56,290–56,420. At 09:50 a close at 56,270 below VWAP. Short at 56,265. ATR 80; 1.5 × ATR gives 56,385, closer than the opening-range high 56,420, so stop 56,385 (120 points, ₹3,600). Target 2R = 56,025. Reached at 11:30. Gross ₹7,200, net about ₹6,200.`,
      loseExample: `**A large NBFC stock, 120 shares.** Gap-down 2.1% to ₹8,820. Close below the opening-range low at ₹8,795. Short at ₹8,793, stop at opening-range high ₹8,850 (₹57, ₹6,840 risk on 120 shares; too large, so size cut to 50 shares, ₹2,850). A management commentary reassures; shorts cover, price jumps to ₹8,880. Stop fills at ₹8,853: −₹3,000 plus charges. Gap-down shorts are exposed to sharp squeezes.`,
      failure: `- Gap-downs on macro fears that reverse when the global picture calms.
- Shorting into strong support or the previous swing low.
- Stocks near the lower circuit, where liquidity disappears.

**Regime matters:** after a long fall, gap-downs are more often met by value buyers; after a long rise, the first gap-down can be the start of a sharper correction. Record the 20-day trend of the index on every gap-down trade so you can split results by context. Also note whether the gap was caused by global cues (US/Asia), domestic macro, or company news; these often behave differently and mixing them in one sample hides the difference.`,
      mistakes: `- Shorting at 09:15 into the opening auction.
- Buying "cheap" gap-downs without a reversal trigger.
- Not knowing that intraday cash shorts are auto-squared by the broker near the close and can face auction penalties if not covered.
- Fading company-specific gap-downs caused by fraud, governance or regulatory news.`,
      backtest: `Quant Lab: set side to short (−1) and use **Opening-range breakout** (bars 3) + **Close on the trade side of VWAP**. Adding **Volume spike** (k 1.5) is the stricter version but leaves very few trades; run it as a second test. As with gap-ups, isolate gap days by grouping the trade list, or log 80+ real gap-down days from imported data. Short-side results often differ from long-side results; never assume symmetry.`,
      chart: `[[chart:BANKNIFTY:37:vwap,vol]]`,
      btConfig: { side: -1, entry: [{ id: 'orb', params: { bars: 3 } }, { id: 'vwap_side', params: {} }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 } },
    },
    {
      id: 'pdh-breakout', n: 17, name: 'Previous-day high breakout', family: 'breakout', evidence: 'mixed',
      markets: `Nifty and Bank Nifty futures, liquid F&O stocks, US large caps and index futures.`,
      timeframes: `5-minute chart; the level comes from the daily chart.`,
      indicators: `Previous-day high (PDH), VWAP, volume, ATR(14), ADX(14).`,
      concept: `The previous day's high is one of the most watched intraday levels. A sustained break above it means today's buyers have pushed beyond where yesterday's buyers stopped. The strategy buys the first 5-minute close above PDH with participation.`,
      logic: `Many traders place stop orders and alerts above PDH. A break can trigger short-covering and breakout buying together. If the break fails, the trapped buyers can push price back down quickly, which is why the stop is close.

> [!evidence] PDH/PDL breakout rules are practitioner heuristics; results vary by instrument and regime. Mixed.`,
      setup: `1. Today's open is below PDH (otherwise it is a gap trade, not a breakout).
2. Price approaches PDH after 09:45, not on the opening candle.
3. ADX(14) on 5-minute ≥ 20 or the day's range so far is at least 60% of the 14-day average range.`,
      entry: `Buy at the next open after the first 5-minute candle that closes above PDH, having closed at or below it on the prior candle.`,
      confirmation: `- Breakout candle volume ≥ 1.5 × 20-bar average.
- Price above VWAP.
- No major resistance (weekly high, round number) within 0.5 × ATR above PDH.`,
      stop: `Below the breakout candle low or 1.2 × ATR(14), whichever is tighter, but at least 0.1% below PDH.`,
      target: `2R; or the previous week's high if it is at least 1.5R away.`,
      sizing: `0.5–1% risk.`,
      rr: `1:2.`,
      exits: `- Two 5-minute closes back below PDH: exit.
- Stop, target, 15:10.`,
      management: `Stop to entry at 1R. If price returns to PDH and holds (a retest), you may add one unit with the stop for both below the retest low, only if total risk stays within limits.

Log the time of day for each breakout. Morning breaks (before 11:30) and afternoon breaks often behave differently; if your sample shows a clear difference, consider restricting the window, but only after confirming it out of sample with walk-forward folds. Keep one rule change per test cycle so you know what caused any improvement.`,
      winExample: `**Nifty futures, 1 lot (65).** PDH 25,948. At 11:25 a candle closes at 25,961 (previous close 25,940) with 1.7× volume, above VWAP. Buy at 25,963. Breakout candle low 25,938 and 1.2 × ATR (21) both give about 25,938, but that is only 10 points below PDH; the rule requires the stop at least 0.1% (about 26 points) below PDH, so stop 25,922 (41 points, ₹2,665). Target 2R = 26,045. Reached at 13:40. Gross ₹5,330, net about ₹4,330.`,
      loseExample: `**Reliance, 400 shares.** PDH ₹1,492. Close above at ₹1,493.40 with volume, above VWAP. Buy at ₹1,493.60, stop ₹1,490.40 (₹3.20, ₹1,280). Price reaches ₹1,495.10 then sellers return; two closes below PDH at ₹1,491.20 and ₹1,490.60. Exit at ₹1,490.50: −₹1,240 plus charges. A failed breakout like this is itself the setup in the "Failed breakout" strategy.`,
      failure: `- Breakouts on low-range, low-volume days.
- Breaks late in the session.
- Breaks right into a higher-timeframe level.

**What a typical failure looks like:** price grinds up to PDH over two hours on falling volume, closes one candle above it and then stalls. The breakout was "meant" to trigger stop orders above PDH, and once they are filled there is no further buying. The volume rule tries to filter these, but low-volume breaks still pass on some days. Track how many of your losses came within three candles of entry; a large share suggests you are buying exhaustion, not initiation.`,
      mistakes: `- Entering on the first tick above PDH.
- Buying when the open already gapped above PDH.
- Holding after price closes back below.`,
      backtest: `Quant Lab: **Break of previous-day high / low** + **Close on the trade side of VWAP** + **Volume spike** (k 1.5), side long. This signal fires at most once per day per side, so trades accumulate slowly: you need many sessions (generate 250+ days) to reach 150+ trades. Compare with and without the volume filter.`,
      chart: `[[chart:NIFTY:61:vwap,vol]]`,
      btConfig: { side: 1, entry: [{ id: 'pdh_break', params: {} }, { id: 'vwap_side', params: {} }, { id: 'volume_spike', params: { k: 1.5 } }], stop: { type: 'atr', mult: 1.2 }, target: { rr: 2 } },
    },
    {
      id: 'pdl-breakdown', n: 18, name: 'Previous-day low breakdown', family: 'breakout', evidence: 'mixed',
      markets: `Nifty and Bank Nifty futures (preferred for shorts), F&O stocks, US index futures.`,
      timeframes: `5-minute chart; level from the daily chart.`,
      indicators: `Previous-day low (PDL), VWAP, volume, ATR(14).`,
      concept: `The mirror of the PDH breakout. A sustained close below yesterday's low shows sellers have pushed price beyond where yesterday's buyers defended. The strategy shorts the first close below PDL with participation.`,
      logic: `Long holders often place stops just below PDL; their forced selling can accelerate the move. Breakdowns can be faster than breakouts because fear moves prices quickly, but they can also reverse sharply on short covering.

> [!evidence] Mixed; long and short versions of the same rule often behave differently and must be tested separately.`,
      setup: `1. Today's open is above PDL.
2. Price approaches PDL after 09:45.
3. Index (for stocks) below its own VWAP.`,
      entry: `Sell at the next open after the first 5-minute candle that closes below PDL, having closed at or above it on the prior candle.`,
      confirmation: `- Breakdown candle volume ≥ 1.5 × 20-bar average.
- Price below VWAP.
- No major support (weekly low, round number) within 0.5 × ATR below PDL.`,
      stop: `Above the breakdown candle high or 1.2 × ATR(14), whichever is tighter, but at least 0.1% above PDL.`,
      target: `2R, or the previous week's low if at least 1.5R away.`,
      sizing: `0.5–1% risk. Shorts carry squeeze risk; allow for 2 ticks of slippage in the risk calculation.`,
      rr: `1:2.`,
      exits: `- Two 5-minute closes back above PDL.
- Stop, target, 15:10.`,
      management: `Stop to entry at 1R. Avoid holding shorts into scheduled positive catalysts such as RBI announcements.

Keep the long (PDH) and short (PDL) versions as separate strategies in the Journal. If you combine them, a strong long side can hide a losing short side, or the reverse. Decide after testing whether to trade one, both or neither. Asymmetry is normal in equity markets, which have historically had an upward drift over long periods while falling faster in short bursts.`,
      winExample: `**Bank Nifty futures, 1 lot (30).** PDL 56,710. At 10:55 a close at 56,690 below VWAP with 1.8× volume. Short at 56,686. ATR 75; stop 1.2 × ATR = 56,776 (90 points, ₹2,700). Target 2R = 56,506. Reached at 12:50. Gross ₹5,400, net about ₹4,400.`,
      loseExample: `**Nifty futures, 1 lot (65).** PDL 25,612. Close below at 25,604 with volume. Short at 25,602. The stop must be at least 0.1% (about 26 points) above PDL, so stop 25,638 (36 points, ₹2,340). Within 15 minutes a strong DII buying session lifts the index; price closes back above PDL twice. Exit at 25,622: −20 points, ₹1,300 plus costs. Buyers can appear near PDL for many reasons, and the strategy accepts these losses as its cost of doing business.`,
      failure: `- Breakdowns into strong support.
- Days with positive breadth despite a weak index.
- Late-session breaks.

**Short-covering risk:** when many traders short below PDL at the same time, a small piece of positive news can force them all to cover, and price can move several ATRs against the short within minutes. This is why the short version uses a slightly wider slippage allowance and why holding through scheduled announcements is excluded. A common narrative says domestic institutions buy near round levels and previous lows; a chart cannot show who bought, so test it instead: group losing trades by whether they occurred near a round number (multiples of 100 for Nifty, 500 for Bank Nifty).`,
      mistakes: `- Shorting the first tick below PDL.
- Ignoring that the long-side rule's backtest says nothing about the short side.
- Shorting cash stocks without knowing the broker's auto-square-off time.
- Shorting stocks under ASM/GSM or near the lower circuit, where exits can be impossible.
- Doubling the size on shorts because "markets fall faster".`,
      backtest: `Quant Lab: side short (−1), **Break of previous-day high / low** + **Close on the trade side of VWAP** + **Volume spike** (k 1.5). Run alongside the PDH long test with the same seeds and compare the R distributions. 150+ trades; this needs a long synthetic series (250+ days).`,
      chart: `[[chart:BANKNIFTY:62:vwap,vol]]`,
      btConfig: { side: -1, entry: [{ id: 'pdh_break', params: {} }, { id: 'vwap_side', params: {} }, { id: 'volume_spike', params: { k: 1.5 } }], stop: { type: 'atr', mult: 1.2 }, target: { rr: 2 } },
    },
    {
      id: 'sr-reversal', n: 19, name: 'Support and resistance reversal', family: 'reversion', evidence: 'subjective',
      markets: `Range-bound index futures and large caps; US index ETFs. Less suited to news-driven momentum stocks, where levels break more readily.`,
      timeframes: `Levels from 15-minute and daily charts; entries on 5-minute.`,
      indicators: `Horizontal levels (prior swing highs/lows touched at least twice, PDH/PDL, round numbers), RSI(14), volume, ATR(14).`,
      concept: `Support is a price zone where buying has previously stopped declines; resistance is where selling has stopped rallies. The reversal strategy buys at tested support and sells at tested resistance, expecting the level to hold again, with a stop just beyond it.`,
      logic: `Levels matter partly because many traders watch the same prices and place orders around them. That is self-referential rather than structural, so levels can break without warning. The edge, if any, comes from a tight stop beyond the level and a target at the opposite side of the range.

> [!evidence] Support and resistance are a subjective framework. How you draw a level changes the result, so the definition must be mechanical before it can be tested.`,
      setup: `1. Define a level mechanically: a price zone (width 0.1% of price) with at least two 15-minute swing lows (or highs) in the last 3 sessions.
2. ADX(14) on 5-minute < 22 (not a strong trend).
3. Price arrives at the zone from at least 1 × ATR away (a fresh test, not hovering).`,
      entry: `- **Long at support:** a 5-minute candle trades into the zone and closes back above it, with RSI(14) ≤ 40 at the low. Buy next open.
- **Short at resistance:** the mirror.`,
      confirmation: `- The test candle's volume is not more than 2 × average (a huge-volume test often precedes a break).
- RSI makes a higher low than at the previous test (optional divergence).`,
      stop: `0.1% beyond the far side of the zone, or 1 × ATR(14), whichever is further. Never inside the zone.`,
      target: `The opposite side of the range, or VWAP, provided it is at least 1.5R.`,
      sizing: `0.5% risk. Levels fail often; small risk lets you survive a run of breaks.`,
      rr: `1:1.5 to 1:3 depending on range width.`,
      exits: `- A close beyond the zone against you: exit immediately, do not wait for the stop.
- Target, stop, 15:10.`,
      management: `After two failed tests of the same level in a day, stop trading it: the level is being worn down.`,
      winExample: `**Nifty futures, 1 lot (65).** Support zone 25,600–25,626 from two swing lows yesterday. ADX 17. Price drops from 25,690 and a candle low of 25,608 closes at 25,631 with RSI 36. Buy at 25,633. Rule check: 0.1% beyond the zone low is about 25,574; 1 × ATR (22) from entry is 25,611, which is inside the zone, so use the further level, 25,574 (59 points, ₹3,835). Target the range top 25,760 (2.2R). Reached at 13:30. Gross +127 points, ₹8,255, net about ₹7,250.`,
      loseExample: `**A private-bank F&O stock, 500 shares.** Resistance zone ₹1,720–₹1,722 tested twice. Price rallies to ₹1,721.50 and closes back at ₹1,719.20, RSI 62. Short at ₹1,719. Stop ₹1,724 (₹5, ₹2,500). A large block buy lifts the stock; price closes at ₹1,725.40. Stop fills at ₹1,724.30: −₹2,650 plus charges. The third test of resistance broke; the management rule exists because repeated tests are where this setup is most exposed. Measure it in your own log.`,
      failure: `- Trend days, when levels break one after another.
- Third or fourth test of the same level.
- News.`,
      mistakes: `- Drawing levels after seeing the reversal.
- Using lines instead of zones.
- Moving the stop "just a bit" beyond the next level.
- Calling broken support "now resistance" in every case.`,
      backtest: `No catalogue signal knows about drawn levels, and the ADX signal can only require a strong trend, not a weak one. The usable proxy is **RSI crosses back from extreme** (lo 35) as the trigger near lows; it ignores levels and is not the same strategy. The honest test is manual: draw zones in advance in the Chart Lab for 60+ sessions and journal every test, win or lose, aiming for 100+ trades.`,
      chart: `[[chart:NIFTY:73:rsi,vol]]`,
      btConfig: { side: 1, entry: [{ id: 'rsi_extreme', params: { n: 14, lo: 35, hi: 65 } }], stop: { type: 'atr', mult: 1 }, target: { rr: 1.5 } },
    },
    {
      id: 'breakout-retest', n: 20, name: 'Breakout and retest', family: 'breakout', evidence: 'subjective',
      markets: `Index futures and liquid stocks.`,
      timeframes: `5-minute chart; levels from 15-minute/daily.`,
      indicators: `Breakout level (PDH, opening-range high, swing high), VWAP, volume, ATR(14).`,
      concept: `Instead of buying the breakout candle, wait for price to come back to the broken level and hold it. The retest gives a closer stop and filters out some false breakouts, at the cost of missing breakouts that never come back.`,
      logic: `After a break, early buyers take profits and price drifts back. If the level now attracts buyers (former resistance acting as support), the practitioner reading is that the breakout is more likely genuine (a hypothesis, not a measured fact). If it does not, you have avoided the false break or lost a small, defined amount.

> [!evidence] Subjective framework; retest frequency and outcome depend on how "retest" is defined. Define it numerically.`,
      setup: `1. A 5-minute close above a marked level (PDH or opening-range high) with volume ≥ 1.5 × average.
2. Price moves at least 0.5 × ATR above the level within 6 candles (a real break).
3. Price then returns to within 0.1% of the level within 12 candles of the break.`,
      entry: `Buy at the next open after a retest candle closes above the level and above the prior candle's high. Cancel the setup if any candle closes more than 0.15% below the level.`,
      confirmation: `- Retest volume lower than breakout volume.
- Price still above VWAP.`,
      stop: `0.15% below the level, or below the retest low, whichever is lower; cap at 1.2 × ATR.`,
      target: `Breakout high first; final at 2.5R.`,
      sizing: `0.5–1% risk. The closer stop allows more quantity; check exposure stays within limits.`,
      rr: `1:2 to 1:3.`,
      exits: `- Close below the level by 0.15%.
- Stop, target, 15:10.`,
      management: `Stop to entry at 1R; trail under higher lows. If the retest takes more than 12 candles, cancel the setup; slow retests often turn into ranges. Write the cancellation in the journal so missed trades are counted too.`,
      winExample: `**Bank Nifty futures, 1 lot (30).** Opening-range high 57,180. Break at 09:50 to 57,260 on volume. Retest at 10:25: low 57,172, close 57,205 above the prior high. Buy at 57,210. Stop 57,180 − 0.15% ≈ 57,094 but cap at 1.2 × ATR (75) = 90 points → 57,120 (₹2,700). Target 2.5R = 57,435. Reached at 12:10. Gross ₹6,750, net about ₹5,750.`,
      loseExample: `**Nifty futures, 1 lot (65).** PDH 25,900. Break to 25,935, retest 25,904 with a close at 25,918. Buy at 25,920, stop 0.15% below the level at 25,861 (59 points, ₹3,835; inside the 1.2 × ATR cap only because ATR is 50 on this volatile morning). Price drifts, then sellers push through the level; a candle closes at 25,858. Stop fills at 25,859: −61 points, ₹3,965 plus costs. The retest that holds for one candle and then fails is common.`,
      failure: `- Strong breakouts that never retest (missed, not lost).
- Retests that become full reversals.
- Choppy days with multiple shallow "retests".

**Selection bias warning:** breakouts that retest and then work are memorable, so retest trades look better in a casual chart review than they are. Breakouts that run away without a retest are missed opportunities, and breakouts that retest and then fail are losses that are easy to forget. Your test must log all three groups. Only then can you compare "buy the break" with "buy the retest" on the same set of breakouts.`,
      mistakes: `- Buying anywhere near the level without a trigger candle.
- Holding after a close back below.
- Calling a deep reversal a "retest".
- Placing a limit order exactly at the level and getting filled during a full reversal.
- Moving the "level" up or down to match where price turned.`,
      backtest: `The retest sequence cannot be expressed with the catalogue (it requires a break followed by a return), so btConfig is null. Use the Chart Lab bar-by-bar replay with levels drawn in advance; log 100+ setups and also log the breakouts that never retested, so you can compare with simply buying the break (test that with **Break of previous-day high / low**).`,
      chart: `[[chart:BANKNIFTY:81:vwap,vol]]`,
      btConfig: null,
    },
    {
      id: 'failed-breakout', n: 21, name: 'Failed breakout', family: 'reversion', evidence: 'subjective',
      markets: `Index futures and liquid stocks; popular in US index futures as well.`,
      timeframes: `5-minute chart.`,
      indicators: `Breakout level (PDH/PDL, opening range, swing extreme), VWAP, volume.`,
      concept: `When price breaks a well-watched level and then quickly closes back inside, the breakout traders are trapped. The failed-breakout strategy trades against them, for example shorting after a failed break above PDH, using the failed high as the stop.`,
      logic: `Breakout buyers place stops below the level. When price returns inside, their exits add selling pressure. Because the high of the failed move is a clear invalidation point, risk is defined and often small.

> [!evidence] Subjective framework sometimes called a "trap" or "fakeout" trade. The trap story is a narrative; test the mechanics.`,
      setup: `1. A 5-minute close beyond a marked level (PDH for a short setup).
2. Price extends no more than 0.6 × ATR beyond the level.
3. Within the next 3 candles, a candle closes back inside the level.`,
      entry: `Sell at the next open after the close back below the level. Long version: after a failed break below PDL, buy on the close back above.`,
      confirmation: `- The failed-break high had volume no greater than 1.5 × average (weak participation).
- Price is back below VWAP or VWAP is just below.`,
      stop: `One tick above the failed-break high, plus 2 ticks for slippage.`,
      target: `VWAP first, then the opposite side of the day's range; minimum 1.5R.`,
      sizing: `0.5–1% risk.`,
      rr: `1:1.5 to 1:3.`,
      exits: `- Close back beyond the level again.
- Stop, target, 15:10.`,
      management: `Move stop to entry at 1R. If price re-breaks the level, do not re-enter short; the level is now in play the other way. Keep a separate tag for failures of PDH, opening-range and swing-high levels; they may behave differently.`,
      winExample: `**Nifty futures, 1 lot (65).** PDH 25,980. A close at 25,992, high 25,998, on modest volume. Two candles later a close at 25,968. Short at 25,966. Stop one tick above the high plus 2 ticks of slippage allowance = 25,998.15 (32.15 points, ₹2,090). VWAP 25,930, then day low 25,880 (2.7R). Reached at 13:20. Gross ₹5,590, net about ₹4,590.`,
      loseExample: `**ICICI Bank, 700 shares.** PDH ₹1,356. Break to ₹1,358.20, close back below at ₹1,355.40. Short at ₹1,355.30, stop one tick plus 2 ticks above the high at ₹1,358.35 (₹3.05, ₹2,135). The dip was just a pause; buyers return and price closes at ₹1,359. Stop fills at ₹1,358.50: −₹2,240 plus charges. The "failed" breakout was a breakout with a retest.`,
      failure: `- Strong trend days, when the "failure" is a brief pullback before continuation.
- Levels that are not widely watched.

**Why it is hard in real time:** a breakout that dips back below the level for one candle and then continues is the characteristic way this trade loses. The rule requires a close back inside within three candles, but a breakout with a quick retest satisfies that rule too. The only protection is the stop above the failed high, which must be small enough that several such losses are survivable. Track how many losses were caused by a retest-and-continue pattern; if it is most of them, the rule needs a stronger failure condition (for example, a close below VWAP).`,
      mistakes: `- Shorting every candle that wicks above PDH.
- Placing the stop inside the wick.
- Trading both the breakout and the failure on the same level and losing on both.
- Assuming that trapped traders must exit; many simply hold or average.
- Ignoring the higher-timeframe trend, which often decides whether a failure becomes a reversal.`,
      backtest: `Not directly expressible: the catalogue has no "break then return" signal, so btConfig is null. Approximate one half of it by running **Break of previous-day high / low** long and looking at how many trades are stopped quickly; those are the candidates. Then test the failure rule by replaying 60+ sessions in the Chart Lab and journalling 100+ setups.`,
      chart: `[[chart:NIFTY:88:vwap,vol]]`,
      btConfig: null,
    },
    {
      id: 'mean-reversion', n: 22, name: 'Mean reversion', family: 'reversion', evidence: 'mixed',
      markets: `Index futures and large caps on range days; ETFs. Avoid momentum stocks with news.`,
      timeframes: `5-minute chart.`,
      indicators: `VWAP and VWAP standard-deviation bands, Bollinger(20, 2), RSI(14), ADX(14).`,
      concept: `Mean reversion bets that a price stretched far from a reference average will move back towards it. Intraday, the reference is usually VWAP or a 20-period average. The trade buys stretched lows and sells stretched highs, targeting the mean.`,
      logic: `On balanced days, extended moves often attract opposite orders (profit-taking, value buyers), pulling price back. The risk profile is opposite to trend following: frequent small wins and occasional large losses when a stretch turns into a trend.

> [!evidence] Short-horizon reversal effects are documented in several markets but are weak, unstable and cost-sensitive. Mixed.`,
      setup: `1. ADX(14) < 20.
2. Price at least 2 standard deviations below VWAP (long) or a close below the lower Bollinger Band.
3. No trend-day signs: the day's range is under 1 × 14-day average range.`,
      entry: `Buy at the next open after a 5-minute close back inside the lower Bollinger Band with RSI(14) < 35 on the prior candle.`,
      confirmation: `- Index not at a fresh day low.
- Last candle shows a lower wick at least half its range.`,
      stop: `1.2 × ATR(14) below entry; hard rule, no widening.`,
      target: `VWAP or the 20 SMA, whichever is closer, provided ≥ 1R.`,
      sizing: `0.5% risk.`,
      rr: `Around 1:1 to 1:1.5. Because targets are fixed by the mean, winners are capped; losers must be capped too.`,
      exits: `- Time stop: 30 minutes.
- Stop, target, 15:10.`,
      management: `No averaging down. Mean reversion's typical blow-up is adding to a loser that turned into a trend. Limit the strategy to two trades per day and stop for the day after one full −1R loss; a stop-out often signals the regime has changed.`,
      winExample: `**Nifty futures, 1 lot (65).** Range day, ADX 15. Price drops to 25,702, 2.1 standard deviations below VWAP 25,760, and closes back inside the lower band at 25,712; RSI was 31. Buy at 25,714, stop 25,688 (26 points, ₹1,690). Target 20 SMA 25,744 (1.15R). Hit at 11:40. Gross ₹1,950, net about ₹950. Small wins are the design of this strategy; costs take a large share.`,
      loseExample: `**Bank Nifty futures, 1 lot (30).** ADX 18, price 2 standard deviations below VWAP at 56,480; re-entry close 56,505. Buy at 56,510, stop 56,420 (90 points, ₹2,700). A bank-specific negative headline turns the day into a trend; price falls to 56,250. Stop fills at 56,410 after slippage: −100 points, ₹3,000 plus costs. Without the stop, the loss would have been ₹7,800.`,
      failure: `- Trend days (the defining failure).
- Event days.
- Using mean reversion on stocks with fresh news.

**The skew problem:** a mean-reversion system can show a long run of small wins, building false confidence, and then give back weeks of gains in one or two trend days. This is especially true if stops are wide or skipped. Monte Carlo resampling of your trade list shows the range of drawdowns you should expect; look at the 95th percentile, not the median. If you cannot accept that drawdown, the system is not suitable, regardless of the average.`,
      mistakes: `- Averaging down.
- Removing the stop because "it always comes back".
- Taking reversion trades early in the day before the range is known.`,
      backtest: `Quant Lab: requiring both **Close back inside Bollinger Band** and **RSI crosses back from extreme** on the same bar gives very few trades, so use **Close back inside Bollinger Band** (n 20, k 2) alone first (the preloaded config, which omits the ADX < 20 filter and uses a fixed 1R target instead of VWAP or the 20 SMA), then compare on trending seeds vs range seeds. Look at the left tail of the R distribution, not only the average. Monte Carlo drawdowns matter more for reversion than for trend systems. 300+ trades. See [[link:l4-mean-rev-momentum]].`,
      chart: `[[chart:SPY:15:vwap,bb,rsi]]`,
      btConfig: { side: 1, entry: [{ id: 'bb_reentry', params: { n: 20, k: 2 } }], stop: { type: 'atr', mult: 1.2 }, target: { rr: 1 } },
    },
    {
      id: 'range-bound', n: 23, name: 'Range-bound trading', family: 'reversion', evidence: 'mixed',
      markets: `Index futures on quiet days; large caps after a news-free open.`,
      timeframes: `5-minute chart; the range is defined from the first 90 minutes.`,
      indicators: `Session high/low after 90 minutes, VWAP, ADX(14), RSI(14), volume profile (optional).`,
      concept: `Many sessions settle into a range after the first hour. Range trading buys near the bottom of the established range and sells near the top, with stops just outside. It is a structured version of mean reversion that uses the day's own extremes.`,
      logic: `When neither side has new information, prices oscillate between areas where buyers and sellers have already shown up. A range is confirmed only after both edges have been tested, so the rule waits for that.

> [!evidence] Mixed. Ranges are easy to identify in hindsight; in real time, a range can break at any moment.`,
      setup: `1. By 10:45 IST, the session high and low have each been tested at least twice (within 0.1%).
2. Range width between 0.6 and 1.2 × 14-day average daily range / 2.
3. ADX(14) on 5-minute < 20.`,
      entry: `- **Long:** a 5-minute candle trades within the bottom 15% of the range and closes in its upper half. Buy next open.
- **Short:** mirror at the top 15%.`,
      confirmation: `- RSI(14) below 40 at the low (above 60 at the high).
- VWAP near the middle of the range.`,
      stop: `0.1% outside the range edge.`,
      target: `The opposite 15% zone, or VWAP if the R:R to VWAP is already ≥ 1.5. Skip the trade if the opposite zone is less than 1.2R away (the worked example below applies this test).`,
      sizing: `0.5% risk.`,
      rr: `1:1.2 to 1:3 depending on range width.`,
      exits: `- Range edge breaks with a 5-minute close: exit.
- Stop, target, 15:10.`,
      management: `Maximum two trades per range edge. After 14:00, ranges often resolve; cut size or stop trading the range. Redraw the range only if both edges are retested; do not widen it after a break just to stay in a trade.`,
      winExample: `**Nifty futures, 1 lot (65).** Range 25,820–25,905 by 10:45, tested twice each side, ADX 14. At 11:50 a candle trades 25,826 and closes 25,848, RSI 38. Buy at 25,850. Stop 25,794 (56 points, ₹3,640). The top zone begins at 25,892, only 42 points away, which is under 1R; VWAP 25,862 is even closer. Skip. Next setup at the top: short at 25,890 with stop 25,931 (41 points, ₹2,665), target bottom zone 25,833 (1.4R). Hit at 13:20. Gross ₹3,705, net about ₹2,700. The first skip shows the R:R test working.`,
      loseExample: `**Bank Nifty futures, 1 lot (30).** Range 56,900–57,120. Short at the top at 57,105, stop 57,177 (72 points, ₹2,160). At 14:10 a breakout begins; price closes at 57,190. Stop fills at 57,180: −75 points, ₹2,250 plus costs. Afternoon range breaks are a known risk for this setup; group your losses by entry time to measure it.`,
      failure: `- Afternoon breakouts.
- Event-driven sessions.
- Ranges defined too early with only one test of each side.

**Real-time ambiguity:** by 10:45 a range can look clean, but the first-90-minute range has no special status; it is a convenient definition. Many days that look range-bound at 11:00 trend after 13:00 when European markets open or news arrives. That is why the rule cuts size after 14:00 and exits immediately on a close outside the range. Group your results by entry time to see how much the afternoon contributes to losses.`,
      mistakes: `- Trading the middle of the range.
- Fading the third or fourth test of an edge.
- Holding after a close outside.
- Using a range defined on 1-minute bars with a 5-minute stop.
- Ignoring costs: narrow ranges leave little room after ₹1,000 of charges on index futures.`,
      backtest: `Quant Lab proxy: **Close back inside Bollinger Band** (n 20, k 2), long and short, which approximates fading edges. The preloaded config is the short side only; run the long side separately. The catalogue cannot filter for low ADX, so use the Regime matrix tab in the Quant Lab to compare range-regime and trend-regime synthetic data. 200+ trades.`,
      chart: `[[chart:NIFTY:95:vwap,vp]]`,
      btConfig: { side: -1, entry: [{ id: 'bb_reentry', params: { n: 20, k: 2 } }], stop: { type: 'atr', mult: 1 }, target: { rr: 1.5 } },
    },
    {
      id: 'fibonacci', n: 24, name: 'Fibonacci setups', family: 'structure', evidence: 'subjective',
      markets: `Any liquid market.`,
      timeframes: `Swing from 15-minute chart; entries on 5-minute.`,
      indicators: `Fibonacci retracement levels (38.2%, 50%, 61.8%) of a defined swing, 20 EMA, RSI(14).`,
      concept: `Fibonacci retracements divide a completed price swing by ratios derived from the Fibonacci sequence. Traders buy pullbacks to the 50–61.8% zone in an uptrend, expecting the trend to resume. The ratios themselves have no proven special status; their main role is to define a pullback depth objectively.`,
      logic: `Pullbacks of a half or so of the prior swing are common in trending markets. Using the 50–61.8% zone gives a defined area to look for a resumption trigger, with a stop beyond the 78.6% level or the swing origin.

> [!evidence] Fibonacci levels are a subjective framework. There is no robust evidence that these specific ratios matter more than others; treat them as one way to define "a meaningful pullback".`,
      setup: `1. Define the swing: lowest low to highest high of the move that started after 09:30, with at least 1.5 × ATR(14) of the 15-minute chart.
2. 20 EMA on 5-minute rising at the start of the pullback.
3. Price retraces into 50–61.8% of the swing.`,
      entry: `Buy at the next open after a 5-minute close above the prior candle's high, while the pullback low is still inside 50–61.8%.`,
      confirmation: `- RSI(14) above 40 during the pullback (no momentum collapse).
- Volume declines into the pullback.`,
      stop: `Below the 78.6% level, or 1.5 × ATR, whichever is tighter.`,
      target: `Retest of the swing high (often 1.5–2R); extension target at 127.2% of the swing.`,
      sizing: `0.5–1% risk.`,
      rr: `1:1.5 to 1:3.`,
      exits: `- Close below the 78.6% level.
- Stop, target, 15:10.`,
      management: `Book half at the swing high; trail the rest. Log which ratio the pullback reached (38.2%, 50% or 61.8%) on every trade; if results do not differ by ratio, the ratios are not adding information beyond "a pullback happened".`,
      winExample: `**Nifty futures, 1 lot (65).** Swing 25,700–25,820 (120 points). 50% = 25,760, 61.8% = 25,746, 78.6% = 25,726. Pullback low 25,752; trigger close 25,770. Buy at 25,772, stop 25,724 (48 points, ₹3,120). Swing high 25,820 = 1R; book half is not possible on one lot so move stop to entry. Extension 127.2% ≈ 25,853. Exit at 25,850 at 13:10: +78 points, ₹5,070 gross, net about ₹4,070.`,
      loseExample: `**An auto F&O stock, 600 shares.** Swing ₹705–₹718. 61.8% at ₹709.97. Pullback low ₹710.20, trigger at ₹711.80. Buy ₹711.90, stop below 78.6% (₹707.80) at ₹707.70 (₹4.20, ₹2,520). The pullback deepens into a full reversal; stop fills at ₹707.50: −₹2,640 plus charges. Fibonacci does not tell you whether a pullback or a reversal is under way.`,
      failure: `- Swings defined after the fact.
- Choppy markets with no clear swing.
- Deep reversals.

**Hindsight is the main trap:** on a historical chart it is always possible to find a swing whose 61.8% level "held". In real time the swing is still forming, a new high or low can change all the levels, and two traders will often anchor to different points. Unless the swing definition is written before the session, any Fibonacci test is contaminated by hindsight. Also consider that round numbers, VWAP or the 20 EMA often lie near a Fibonacci zone, so any apparent effect may belong to them.`,
      mistakes: `- Redrawing the swing until the levels fit.
- Treating 61.8% as precise; the zone is approximate.
- Stacking many Fibonacci tools and finding "confluence" everywhere.
- Assuming that natural-world Fibonacci ratios explain market behaviour; there is no established mechanism.`,
      backtest: `Fibonacci zones are not in the signal catalogue, so btConfig is null. Replay 60+ sessions in the Chart Lab with the swing rule written down; log 100+ setups including the ones that never triggered. To see whether Fibonacci adds anything, compare against a random pullback depth (for example 40%) with otherwise identical rules.`,
      chart: `[[chart:NIFTY:102:ema20,rsi]]`,
      btConfig: null,
    },
    {
      id: 'mtf-confluence', n: 25, name: 'Multi-timeframe confluence', family: 'trend', evidence: 'mixed',
      markets: `Index futures, liquid stocks, US index futures and large caps.`,
      timeframes: `Three layers: daily (bias), 15-minute (trend), 5-minute (entry). A common ratio is roughly 1:3 to 1:5 between layers.`,
      indicators: `Daily 20 EMA and previous-day levels, 15-minute 20/50 EMA and ADX(14), 5-minute VWAP and 9 EMA.`,
      concept: `Multi-timeframe confluence means taking an entry on a lower timeframe only when it agrees with the trend on one or two higher timeframes. It is not a strategy on its own but a filter that sits on top of any entry trigger, such as a pullback or a breakout.`,
      logic: `A 5-minute buy signal inside a 15-minute and daily uptrend is aligned with the larger flow of orders; the same signal against the higher timeframes is fighting it. The filter reduces the number of trades. Whether it improves expectancy must be tested, because filters can also remove good trades.

> [!evidence] Mixed. Alignment filters are standard practice and intuitive, but adding conditions also raises the risk of overfitting. Test the filter's marginal contribution, not just the final result.`,
      setup: `1. **Daily:** close above the 20 EMA and above the previous day's mid-point (long bias).
2. **15-minute:** 20 EMA above 50 EMA, ADX(14) ≥ 20.
3. **5-minute:** price above VWAP.
All three must hold for longs; mirror for shorts. If the layers disagree, there is no trade.`,
      entry: `Use one defined trigger on the 5-minute chart: the 9 EMA crossing above the 21 EMA after a pullback that touched VWAP or the 20 EMA. Buy at the next open.`,
      confirmation: `- Trigger candle volume above its 20-bar average.
- No higher-timeframe resistance (daily swing high, PDH) within 1R of entry.`,
      stop: `Below the 5-minute pullback low, maximum 1.5 × ATR(14) of the 5-minute chart.`,
      target: `2R; or the nearest 15-minute swing high if it lies beyond 1.5R.`,
      sizing: `0.5–1% risk, based on the 5-minute stop (not on a higher-timeframe stop).`,
      rr: `1:2. Higher-timeframe alignment does not change the maths of R; it may change how often 2R is reached, which only a test can tell.`,
      exits: `- 15-minute close below its 20 EMA: exit even if the 5-minute stop is intact.
- Stop, target, 15:10.`,
      management: `Stop to entry at 1R. Re-check the 15-minute condition at each 15-minute close. If it fails, close the trade.`,
      winExample: `**Bank Nifty futures, 1 lot (30).** Daily close above the 20 EMA; 15-minute 20 EMA above 50 EMA, ADX 26; price above VWAP. Pullback touches VWAP at 57,310; 9 EMA crosses back above 21 EMA at 57,345. Buy at 57,350, pullback low 57,290, stop 57,285 (65 points, ₹1,950). Target 2R = 57,480. Reached at 12:35. Gross ₹3,900, net about ₹2,900.`,
      loseExample: `**Nifty futures, 1 lot (65).** All three layers bullish. 5-minute trigger at 25,880; buy at 25,884, stop 25,852 (32 points, ₹2,080). At 13:00 European markets fall sharply; Nifty drops and the 15-minute closes below its 20 EMA at 25,860. Exit at 25,858 on the 15-minute rule: −26 points, ₹1,690 plus costs. Alignment at entry is no protection against a change of conditions after entry.`,
      failure: `- Turning points, when higher timeframes are still showing the old trend and the lower timeframe is first to change.
- Range-bound daily charts where the "daily bias" is noise.
- Too many layers: so few trades that you cannot measure anything.`,
      mistakes: `- Using the higher timeframe only when it agrees with what you already want.
- Mixing timeframes inconsistently (5-minute today, 3-minute tomorrow).
- Calling three correlated indicators on three timeframes "confluence".
- Placing the stop on the higher timeframe and the size on the lower, which multiplies risk.`,
      backtest: `The backtester works on one timeframe, so higher-timeframe conditions are approximated with slower settings: **ADX above threshold** (min 20) + **Close on the trade side of VWAP** + **Fast EMA crosses slow EMA** (9/21). Then run **Fast EMA crosses slow EMA** alone on the same seeds and compare. The question is whether the filters improve average R enough to justify losing trades. For a fair comparison you need 150+ trades in the filtered version, which means a long synthetic history. Real higher-timeframe tests need imported data at several intervals.`,
      chart: `[[chart:BANKNIFTY:110:ema20,ema50,vwap,adx]]`,
      btConfig: { side: 1, entry: [{ id: 'ema_cross', params: { fast: 9, slow: 21 } }, { id: 'adx_trend', params: { n: 14, min: 20 } }, { id: 'vwap_side', params: {} }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 } },
    },
    {
      id: 'liquidity-sweep', n: 26, name: 'Liquidity sweep strategies', family: 'structure', evidence: 'subjective',
      markets: `Index futures, US index futures, forex and crypto, where the vocabulary is popular. Same mechanics apply to liquid NSE stocks.`,
      timeframes: `5-minute chart; levels from 15-minute and daily.`,
      indicators: `Obvious swing highs/lows, PDH/PDL, equal highs or lows, VWAP, volume.`,
      concept: `A "liquidity sweep" is a quick move beyond an obvious high or low that reverses within a few candles. The story told is that larger players push price through the level to trigger stop orders resting there, then trade the other way. The tradeable mechanics are almost identical to the failed-breakout strategy.`,
      logic: `Clusters of stop orders often sit just beyond obvious levels. When price trades there, those stops execute, briefly adding volume. If no fresh buying (or selling) follows, price returns inside. You do not need to know who caused the move; you need a defined level, a defined sweep and a defined reversal.

> [!warn] Institutional jargon is not proof of institutional activity. A sweep pattern on a chart shows where price traded, not who traded or why. Smart-money-concept language is a subjective framework with no robust public evidence of an edge.`,
      setup: `1. Mark a level with at least two touches (equal highs within 0.05%) or PDH/PDL.
2. Price trades beyond the level by 0.05–0.3% (a sweep, not a full breakout).
3. The sweeping candle or the next one closes back inside the level.`,
      entry: `Short (for a sweep of highs) at the next open after the close back inside. Long for a sweep of lows. Cancel if more than 3 candles pass before the close back inside.`,
      confirmation: `- The sweep candle has a wick at least 50% of its range beyond the level.
- Volume on the sweep candle above average (stops being triggered).
- Price on the reversal side of VWAP within 3 candles.`,
      stop: `Two ticks beyond the sweep extreme.`,
      target: `VWAP, then the opposite liquidity level (the day's low for a short). Minimum 2R.`,
      sizing: `0.5% risk. Tight stops mean high quantity; check the exposure.`,
      rr: `1:2 to 1:4 because the stop is tight; the hit rate is correspondingly uncertain.`,
      exits: `- A second close beyond the swept level.
- Stop, target, 15:10.`,
      management: `Move stop to entry at 1R. Only one sweep trade per level per day.`,
      winExample: `**Nifty futures, 1 lot (65).** Equal highs at 26,045 and 26,047 from the morning. At 13:15 price spikes to 26,071 on a volume jump and the candle closes at 26,038. Short at 26,036, stop two ticks above the sweep high at 26,071.10 (35.10 points, ₹2,282). VWAP 25,990, day low 25,955 (2.3R). Reached at 14:40. Gross ₹5,265, net about ₹4,265.`,
      loseExample: `**Bank Nifty futures, 1 lot (30).** PDL 56,400. Sweep to 56,355, close back above at 56,418. Buy at 56,422, stop two ticks below the sweep low at 56,354.90 (67.10 points, ₹2,013). Instead of reversing, price chops for 30 minutes and then breaks down hard on weak bank results commentary. Stop fills at 56,345 after slippage: −77 points, ₹2,310 plus costs (1.15R). A "sweep" that becomes a breakdown is indistinguishable at entry.`,
      failure: `- Trend days, where levels break and keep going.
- Levels that are not genuinely obvious; then there is no reason for stops to cluster there.
- Thin markets, where sweeps are just random spikes.`,
      mistakes: `- Believing the narrative instead of testing the mechanics.
- Calling every wick a sweep.
- Mixing in "order blocks", "fair value gaps" and other labels until every candle has a story.
- Oversizing because the stop is tight.`,
      backtest: `The sweep-and-reclaim sequence is not in the catalogue, so btConfig is null. Treat it as a variant of [[link:l3-hypothesis]]: write a mechanical definition, replay 60+ sessions in the Chart Lab and journal 100+ sweeps (including the ones that kept going). Compare with the plain failed-breakout rule to see whether the extra conditions add anything.`,
      chart: `[[chart:NIFTY:118:vwap,vol]]`,
      btConfig: null,
    },
    {
      id: 'market-structure', n: 27, name: 'Market structure continuation', family: 'structure', evidence: 'subjective',
      markets: `Any liquid market.`,
      timeframes: `15-minute for structure, 5-minute for entries.`,
      indicators: `Swing highs and lows (fractals: a high with 2 lower highs on each side), VWAP, ATR(14).`,
      concept: `Market structure describes trends by their swing points: an uptrend makes higher highs (HH) and higher lows (HL); a downtrend makes lower highs (LH) and lower lows (LL). A "break of structure" is a close beyond the last swing in the trend direction. The continuation trade buys the next higher low after a break of structure.`,
      logic: `If the swings define the trend, the latest higher low is where the trend is invalidated. Entering near it gives a defined stop; the next swing extension is the target.

> [!evidence] Subjective framework: swing identification depends on the fractal definition used. With a fixed definition (for example 2 bars each side) it becomes testable.`,
      setup: `1. Swings defined as fractals with 2 bars each side on the 15-minute chart.
2. At least two consecutive HH and HL.
3. A 15-minute close above the last swing high (break of structure).`,
      entry: `After the break, wait for a pullback on the 5-minute chart that holds above the most recent 15-minute HL. Buy on a 5-minute close above the prior candle's high, with price above VWAP.`,
      confirmation: `- Pullback retraces at least 30% of the last leg (a real pullback).
- Volume declines on the pullback.`,
      stop: `Below the most recent 15-minute higher low, maximum 2 × ATR(14) of the 5-minute chart.`,
      target: `2R, or the measured move (the length of the previous leg added to the pullback low) if that is further away.`,
      sizing: `0.5–1% risk.`,
      rr: `1:2.`,
      exits: `- A 15-minute close below the last HL ("change of character"): exit.
- Stop, target, 15:10.`,
      management: `After a new HH forms, move the stop below the new HL. If a new HL forms below the previous one (a lower low on a closing basis), exit even if the stop has not been hit: the structure that justified the trade no longer exists.`,
      winExample: `**Reliance, 300 shares.** 15-minute structure HL ₹1,462, HH ₹1,471, HL ₹1,466, then a close above ₹1,471 at ₹1,473. Pullback on 5-minute to ₹1,468.50, trigger close ₹1,470.20 above VWAP. Buy at ₹1,470.40, stop below HL at ₹1,465.80 (₹4.60, ₹1,380). Measured move: previous leg ₹9 + ₹1,468.50 = ₹1,477.50 (1.5R) – use 2R ₹1,479.60. Price hits ₹1,479.70 at 14:00. Gross ₹2,760, net about ₹2,550.`,
      loseExample: `**Nifty futures, 1 lot (65).** Uptrend structure, break of structure at 25,950. Pullback holds above HL 25,905; trigger at 25,930. Buy at 25,932, stop 25,900 (32 points, ₹2,080). The next swing makes a lower high at 25,945 and price closes below 25,905, a change of character. Stop fills at 25,898: −34 points, ₹2,210 plus costs.`,
      failure: `- Ranges, where structure shifts repeatedly.
- Fractal definitions that change from trade to trade.
- Late trends with 4+ legs already done.

**Definition dependence:** with a 2-bar fractal, a 15-minute chart produces many small swings; with a 5-bar fractal, far fewer. The same chart can therefore show an uptrend under one definition and a range under another. Choose one definition before testing and never change it mid-sample. Late in the session, structure built in the morning is often broken by afternoon flows, so time-of-day grouping matters here too.`,
      mistakes: `- Redrawing swings to fit a narrative.
- Treating every break of structure as a strong signal.
- Ignoring the session clock: a structure built from 09:15–10:00 can be meaningless by 14:00.
- Treating "change of character" and "break of structure" as institutional footprints; they are labels for swing patterns.
- Entering on the break of structure itself and calling it a continuation entry.`,
      backtest: `Swing-point logic is not in the catalogue. The closest proxy is **Break of previous-day high / low** (daily structure) or **Supertrend flips direction** (trend state). btConfig uses the latter as a rough stand-in. For the true rule, replay 60+ sessions with a fixed fractal definition and journal 100+ trades.`,
      chart: `[[chart:RELIANCE:125:vwap,st]]`,
      btConfig: { side: 1, entry: [{ id: 'supertrend_flip', params: { n: 10, m: 3 } }, { id: 'vwap_side', params: {} }], stop: { type: 'atr', mult: 2 }, target: { rr: 2 } },
    },
    {
      id: 'options-momentum', n: 28, name: 'Options momentum strategies', family: 'derivatives', evidence: 'speculative',
      markets: `Nifty weekly options (expiring Tuesday as of Nov 2026, verify on NSE), Bank Nifty monthly options, liquid stock options; US index options (SPX, SPY, QQQ).`,
      timeframes: `5-minute signal on the underlying; option held for minutes to a few hours.`,
      indicators: `Underlying: VWAP, opening range, ADX(14). Option: delta, implied volatility, bid–ask spread, open interest.`,
      concept: `Buy a near-the-money call (or put) when the underlying gives a momentum signal, aiming to profit from a fast move. The option offers leverage and a capped loss on the premium, but time decay (theta), volatility changes (vega) and wide spreads work against the buyer.`,
      logic: `If the underlying moves quickly in your direction, the option's delta and gamma make its price rise faster in percentage terms. If the move is slow, sideways or the implied volatility falls, the option can lose value even when the underlying moves your way.

> [!warn] SEBI studies of F&O traders (published from 2023 onwards) have found that a large majority of individual traders lost money in F&O. Verify the latest report on sebi.gov.in. Option buying for momentum is speculative and must be tested with realistic costs, spreads and decay.`,
      setup: `1. Underlying signal: Nifty futures close above the 15-minute opening-range high and above VWAP after 09:30, with ADX(14) ≥ 20 on 5-minute.
2. Option: nearest-weekly ATM or one strike ITM call, delta 0.45–0.60.
3. Bid–ask spread ≤ 1% of the premium; avoid the last 2 hours on expiry day unless you have tested it specifically.`,
      entry: `Buy the call with a limit order at the mid-price or one tick above, within one minute of the signal candle's close. Puts for the mirror signal.`,
      confirmation: `- Implied volatility not at a spike (for example, not right after a big news candle).
- Option volume and open interest high enough that your quantity is a small fraction of the visible depth.`,
      stop: `Stop on the underlying (opening-range mid-point), not on the premium. Also a premium stop at −35% as a backstop.`,
      target: `Underlying 2R, or premium +60%, whichever first. Time stop: 45 minutes without progress.`,
      sizing: `Risk = premium × lot × 35% (the premium stop). Keep it at 0.5% of capital. With Nifty lot 65 and a premium of ₹140, one lot costs ₹9,100 and a 35% stop risks ₹3,185.`,
      rr: `Roughly 1:1.7 on premium. The actual distribution of option returns is skewed and depends on decay and IV.`,
      exits: `- Underlying stop or premium stop.
- Target or time stop.
- Exit before 15:15; never hold an ITM option into expiry without understanding physical settlement rules for stock options and STT on exercise.`,
      management: `Do not roll or average a losing option. Move the underlying stop to entry at 1R; exit if the premium has not responded to an underlying move (IV crush or decay).`,
      winExample: `**Nifty 26,000 CE (weekly), 1 lot (65).** Nifty futures break the opening range at 25,982 above VWAP, ADX 24. Buy the 26,000 CE at ₹138 (delta 0.48). Underlying stop at the opening-range midpoint 25,943 (39 points), so underlying 2R is 26,060. Nifty reaches 26,060 in 40 minutes; the call trades ₹178. Exit at ₹177. Gross (177 − 138) × 65 = ₹2,535. Charges: STT 0.15% of sell premium (about ₹17), transaction charges on premium, brokerage and GST; net roughly ₹2,450 (verify with [[widget:charges-india]]).`,
      loseExample: `**Bank Nifty 57,000 PE (monthly), 1 lot (30).** Bank Nifty breaks down below the opening range at 57,040. Buy the put at ₹420. The underlying falls only 40 points, then stalls for 45 minutes while IV drops from 14% to 12.5%. The put decays to ₹368. Time stop exits at ₹366: −₹54 × 30 = ₹1,620 plus charges. The direction was right; the option still lost.`,
      failure: `- Slow moves and sideways markets (theta).
- Buying after a volatility spike (vega and IV crush).
- Wide spreads in far OTM strikes.
- Expiry-day gamma swings.`,
      mistakes: `- Buying cheap far-OTM options as "lottery tickets".
- Using premium charts with indicators instead of the underlying.
- Ignoring Greeks. Explore them in [[widget:greeks]] and [[widget:options-payoff]].
- Sizing by number of lots rather than by rupees at risk.`,
      backtest: `The Quant Lab backtests the underlying, not option premiums. btConfig tests only the underlying trigger (**Opening-range breakout** + **Close on the trade side of VWAP** + **ADX above threshold**). To approximate the option, multiply underlying R by an assumed delta and subtract decay per hour in a spreadsheet, or paper-trade 100+ option entries in the Simulator, recording premium, IV and spread at entry and exit. Options results need even larger samples than futures because of skew.`,
      chart: `[[chart:NIFTY:131:vwap,adx]]`,
      btConfig: { side: 1, entry: [{ id: 'orb', params: { bars: 3 } }, { id: 'vwap_side', params: {} }, { id: 'adx_trend', params: { n: 14, min: 20 } }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 } },
    },
    {
      id: 'futures-trend', n: 29, name: 'Futures trend strategies', family: 'derivatives', evidence: 'mixed',
      markets: `Nifty futures (lot 65), Bank Nifty futures (lot 30) as of Nov 2026 (verify lot sizes on NSE), MCX crude and gold, US E-mini/Micro futures.`,
      timeframes: `15-minute for trend, 5-minute for entries.`,
      indicators: `ADX(14), Supertrend(10, 3), 20/50 EMA, VWAP, ATR(14), open interest change (context only).`,
      concept: `Futures give linear exposure with leverage: one Nifty lot at 25,800 is about ₹16.8 lakh of notional value. A futures trend strategy is a trend-following rule applied with careful attention to that leverage, margin and contract-specific costs.`,
      logic: `Futures make trend trades cheap to execute relative to notional (about ₹1,000 of charges on a ₹16.8 lakh Nifty round trip, roughly 6 bps, as of Nov 2026, verify with [[widget:charges-india]]), but a 1% adverse move on one Nifty lot is roughly ₹16,800. The strategy is mainly about sizing: the edge question is the same as for any trend rule, while survival depends on keeping lot count consistent with your risk limits.

> [!evidence] Trend-following in futures has a long research record on daily and longer horizons with mixed, period-dependent results. Intraday evidence is weaker.`,
      setup: `1. 15-minute ADX(14) ≥ 25 and 20 EMA above 50 EMA (long).
2. Price above VWAP on the 5-minute chart.
3. Notional exposure check: number of lots × lot × price ≤ 3 × capital. Use [[widget:futures-exposure]].`,
      entry: `Buy one lot at the next open after the 5-minute Supertrend(10, 3) flips up while condition 1 holds.`,
      confirmation: `- Open interest rising with price (new longs) is supportive context, not a signal.
- No scheduled event within 30 minutes.`,
      stop: `2 × ATR(14) of the 5-minute chart; then trail with the Supertrend line.`,
      target: `None fixed; trailing exit. Alternative: 3R fixed for testing comparisons.`,
      sizing: `Risk 0.5–1% of capital. For ₹6 lakh capital at 1%: ₹6,000 risk. Nifty ATR 22 → stop 44 points × 65 = ₹2,860 per lot → 2 lots by risk, but the 3 × capital exposure cap (₹18 lakh) allows only 1 lot (₹16.8 lakh notional), so trade 1 lot. If one lot's stop needs more than your risk, do not trade. With ₹5 lakh, even one lot exceeds the 3× cap. Margin required is set by the exchange (SPAN plus exposure); check your broker.`,
      rr: `Open-ended with a trailing stop; the backtest should be judged on average R and drawdown.`,
      exits: `- Supertrend flip against you.
- 15:15 close-out (no overnight carry in this intraday version).
- Daily loss limit of 2R.`,
      management: `Add a second lot only at +1R with the combined stop at breakeven or better. Never add to a loser. Be aware of contract expiry and roll dates: the near-month contract becomes thin and expensive to trade in the last days.`,
      winExample: `**Nifty futures, 1 lot (65).** ADX 28, EMAs aligned, price above VWAP. Supertrend flips up; buy at 25,846. ATR 21, stop 25,804 (42 points, ₹2,730). Trend runs; trail exits at 25,958 at 14:35. +112 points = ₹7,280 gross. Charges on a futures round trip: STT 0.05% on the sell value (about ₹840), transaction charges at ₹183/crore, stamp duty 0.002% on buy, brokerage and GST; net roughly ₹6,250 (verify with [[widget:charges-india]]).`,
      loseExample: `**Bank Nifty futures, 2 lots (60).** Flip up at 57,210; buy 2 lots at 57,215 to "make it worth it". Stop 2 × ATR = 150 points, ₹9,000 risk, which is 1.5% of a ₹6 lakh account, and about ₹34.3 lakh of notional (5.7× capital) – outside both the risk rule and the exposure cap. An unexpected regulatory headline drops the index 220 points in 10 minutes; the stop fills at 57,050 with slippage: −165 points × 60 = −₹9,900 plus costs. The rule broken was sizing, not entry.`,
      failure: `- Chop.
- Event-driven spikes that blow through stops.
- Expiry-week illiquidity in the near contract.`,
      mistakes: `- Sizing by margin available instead of risk.
- Holding intraday positions overnight "just this once".
- Reading OI change as a directional signal on its own.`,
      backtest: `Quant Lab: **Supertrend flips direction** + **ADX above threshold** (min 25) + **Close on the trade side of VWAP**, with lot set to the contract lot so quantities round correctly, target rr 3 for a fixed comparison. Use Monte Carlo to see the spread of drawdowns at your risk level, and the risk-of-ruin calculator [[widget:ror]]. 300+ trades across regimes.`,
      chart: `[[chart:NIFTY:140:st,ema20,ema50,adx]]`,
      btConfig: { side: 1, entry: [{ id: 'supertrend_flip', params: { n: 10, m: 3 } }, { id: 'adx_trend', params: { n: 14, min: 25 } }, { id: 'vwap_side', params: {} }], stop: { type: 'atr', mult: 2 }, target: { rr: 3 } },
    },
    {
      id: 'sector-relative-strength', n: 30, name: 'Sector-relative strength strategies', family: 'momentum', evidence: 'mixed',
      markets: `NSE F&O stocks with sector indices (Nifty Bank, Nifty IT, Nifty Auto, Nifty Metal, Nifty Pharma, Nifty FMCG); US stocks with sector ETFs.`,
      timeframes: `Relative strength measured from 09:15 to 10:15; trades on 5-minute until 15:10.`,
      indicators: `% change versus previous close for the stock, its sector index and Nifty; VWAP; ratio chart (stock ÷ sector).`,
      concept: `Pick the strongest stock in the strongest sector (for longs) or the weakest in the weakest (for shorts). Then use a simple entry rule on that stock. Relative strength is the selection layer; the entry rule is separate.`,
      logic: `On days when money rotates into a sector, the leaders often keep outperforming during the session. Trading the leader rather than the index aims to capture that extra move. It also concentrates risk in one stock and one sector.

> [!evidence] Cross-sectional momentum and sector rotation are documented over months; intraday persistence of relative strength is far less studied. Mixed.`,
      setup: `At 10:15 IST:
1. Rank sector indices by % change. Take the top sector only if it is up at least 0.8% more than Nifty.
2. Within that sector, take the F&O stock with the highest % change, provided its volume so far is at least 1.5 × its average for that time.
3. Stock above VWAP and its ratio to the sector index rising since 09:30.`,
      entry: `Buy at the next open after a 5-minute close above the stock's high of the day so far (the 09:15–10:15 high).`,
      confirmation: `- Sector index also above its VWAP.
- Nifty not falling below its own VWAP at the time of entry.`,
      stop: `Below VWAP or 1.5 × ATR(14), whichever is closer.`,
      target: `2R; trail the rest under VWAP.`,
      sizing: `0.5% risk. Concentration in one sector means a sector-wide reversal hits all such trades together; take at most two concurrent trades and never two in the same sector.`,
      rr: `1:2.`,
      exits: `- Stock's ratio to sector index falls back below its 10:15 value.
- Close below VWAP.
- Stop, target, 15:10.`,
      management: `Book half at 1R and move stop to entry. Re-rank at 12:30; if the sector has lost its lead, tighten the stop to the last 5-minute swing low.`,
      winExample: `**Nifty Metal leading (+1.9% vs Nifty +0.4%). Hindalco, 1,400 shares.** Hindalco +2.8% at 10:15 on 2× volume, high of day ₹712.50, VWAP ₹707.80. At 10:40 a close at ₹713.20. Buy at ₹713.30. ATR ₹2.40 → stop ₹709.70 (₹3.60, ₹5,040). 1R at ₹716.90, book 700 shares; rest trailed under VWAP until 14:55, exit ₹721.40. Gross ₹2,520 + ₹5,670 = ₹8,190 (1.6R on the full position), net about ₹7,790 (verify with [[widget:charges-india]]).`,
      loseExample: `**Nifty IT leading (+1.2% vs Nifty +0.2%). Infosys, 300 shares.** High of day ₹1,620, breakout close ₹1,621.40. Buy ₹1,621.60, stop ₹1,614.80 (₹6.80, ₹2,040). At 11:30 a large peer issues weak guidance commentary; the whole IT index reverses. Stop fills at ₹1,614.20: −₹2,220 plus charges. Sector strength can vanish on one piece of sector-wide news.`,
      failure: `- Sector rotations that reverse by lunchtime.
- Leaders that are overextended (5%+) by 10:15.
- Index-wide sell-offs, when relative strength does not stop absolute losses.`,
      mistakes: `- Ranking at 09:20, when moves are noise.
- Holding two stocks from the same sector and calling it diversification.
- Using spot index levels without checking the stock's own liquidity.`,
      backtest: `Selection across sectors cannot be simulated on a single synthetic series, so btConfig tests only the timing rule: **Opening-range breakout** with bars 12 (first hour on 5-minute bars) + **Close on the trade side of VWAP**. A volume filter on the same bar shrinks the sample sharply; test it as a separate variant. For the selection layer, record a daily ranking in the Journal for 60+ sessions and track the R of each pick. You need 100+ selected trades before judging whether the ranking adds value over random choice from the same sector.`,
      chart: `[[chart:MIDCAP:148:vwap,vol]]`,
      btConfig: { side: 1, entry: [{ id: 'orb', params: { bars: 12 } }, { id: 'vwap_side', params: {} }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 } },
    },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
