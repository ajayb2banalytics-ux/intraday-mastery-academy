/* Candlestick pattern reference — Intraday Trading Mastery Academy.
   Evidence note: candlestick patterns on their own have weak and mixed empirical support.
   Every entry treats the pattern as a location-dependent hint, never a signal by itself. */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  // Shared context legs (o, h, l, c). U = rally ending near 103.4; D = decline ending near 97.8; D2 = decline ending near 99.4.
  const U = [[96, 97.2, 95.8, 97], [97, 98.1, 96.7, 97.9], [97.9, 99.2, 97.6, 99], [99, 100.4, 98.8, 100.1], [100.1, 101.5, 99.9, 101.3], [101.3, 102.6, 101, 102.4], [102.4, 103.6, 102.1, 103.4]];
  const D = [[104, 104.3, 102.9, 103.1], [103.1, 103.4, 101.8, 102], [102, 102.3, 100.6, 100.9], [100.9, 101.2, 99.5, 99.8], [99.8, 100.1, 98.4, 98.7], [98.7, 99, 97.5, 97.8]];
  const D2 = [[104.5, 104.8, 103.6, 103.8], [103.8, 104, 102.7, 102.9], [102.9, 103.2, 101.8, 102], [102, 102.3, 100.9, 101.1], [101.1, 101.4, 100, 100.2], [100.2, 100.5, 99.2, 99.4]];
  IA.content.patterns = [
  {
    id: 'doji', name: 'Doji', kind: 'single', bias: 'neutral', evidence: 'subjective',
    bars: [[99, 100.2, 98.8, 100], [100, 101, 99.7, 100.8], [100.8, 101.9, 100.5, 101.6], [101.6, 102.5, 101.2, 102.2], [102.2, 103.1, 101.9, 102.9], [102.9, 103.6, 102.5, 103.3], [103.3, 104.2, 102.6, 103.32]],
    patternBars: 1,
    formation: `A candle whose open and close are almost equal, so the body is a thin line, with wicks of any length. A practical rule: body no more than about 10% of the bar's full range. Variants include the long-legged doji (long wicks both sides), dragonfly (long lower wick) and gravestone (long upper wick).`,
    psychology: `Buyers and sellers both pushed price during the bar and both failed to hold it. After a strong run, that pause can mean the trend's driver is tiring. In a quiet range it usually means nothing at all: nobody cared enough to move price.`,
    context: `A doji only carries information where something was happening before it: after an extended move into a level you already marked (prior day high, VWAP band, round number). On a 1-minute or 5-minute intraday chart, doji appear constantly in the lunch lull and should be ignored there.`,
    confirmation: `Treat the doji as a question, not an answer. The answer is the next bar. After a rally, a close below the doji's low suggests sellers took over; a close above its high says the trend simply paused. Rising volume on the decisive bar strengthens the read.`,
    entry: `Do not enter on the doji itself. Place a stop order a tick beyond the doji's high or low in the direction the context favours, or wait for the confirming bar to close and enter on a small pullback.`,
    stop: `Beyond the opposite extreme of the doji. If that distance is larger than your planned risk per trade allows, reduce size or skip the trade rather than tightening to an arbitrary level.`,
    target: `The nearest opposing level: the last swing, VWAP, or the opening range edge. Measure reward to risk before entering; with a wide doji the first target often does not justify the risk.`,
    failure: `In strong trends doji are frequently just pauses. Price breaks the doji's extreme in the trend's direction and keeps going. Example: Nifty prints a doji at 10:40 after a morning rally, you short the break of its low at 24,610, and the next bar reverses and runs 60 points higher.`,
    mistakes: `Calling every small-bodied bar a doji; trading doji in the middle of a range; ignoring the higher-timeframe trend; treating a doji as a reversal signal instead of an indecision marker.`
  },
  {
    id: 'hammer', name: 'Hammer', kind: 'single', bias: 'bullish', evidence: 'mixed',
    bars: [...D, [97.6, 98.1, 95.9, 97.9]],
    patternBars: 1,
    formation: `A small body near the top of the bar, a lower wick at least about twice the body's length, and little or no upper wick. The colour of the body matters less than its position. It must appear after a decline; the identical shape after a rally is a hanging man.`,
    psychology: `Sellers drove price well below the open, then buyers absorbed the selling and pushed price back up to close near the high. The long lower wick shows a rejection of lower prices during that bar. Whether those buyers return is what the next bars reveal.`,
    context: `Most meaningful at a level that already mattered: prior day low, a higher-timeframe support zone, a VWAP standard-deviation band, or after a sharp, extended drop. A hammer in the middle of a choppy range is just noise.`,
    confirmation: `Wait for the next bar to trade and ideally close above the hammer's high. Stronger if the wick probed below a known support and closed back above it, and if volume on the hammer or the follow-through bar is above recent average.`,
    entry: `Buy stop a tick above the hammer's high, active only for the next one or two bars. Conservative traders wait for a pullback towards the hammer's midpoint after confirmation.`,
    stop: `A tick or two below the hammer's low. Size the position so that distance equals your fixed risk per trade, for example 0.5% of account.`,
    target: `First target at the nearest resistance (the last lower high or VWAP); consider moving the stop to breakeven after one unit of risk. Avoid assuming a full trend reversal from one bar.`,
    failure: `In a strong intraday downtrend, hammers often form, trigger, and then fail as selling resumes. Example: Bank Nifty prints a hammer at 52,140, your buy triggers at 52,190, and the next 15-minute bar breaks the low to 52,080 for a full one-R loss.`,
    mistakes: `Buying before the bar closes (the wick can vanish); ignoring the trend on the higher timeframe; placing the stop inside the wick; taking hammers that are tiny relative to recent bars.`
  },
  {
    id: 'inverted-hammer', name: 'Inverted hammer', kind: 'single', bias: 'bullish', evidence: 'subjective',
    bars: [...D, [97.6, 99.5, 97.4, 97.9]],
    patternBars: 1,
    formation: `After a decline: a small body near the bottom of the bar, a long upper wick of at least twice the body, and little or no lower wick. Same shape as a shooting star, but it appears after selling rather than after a rally.`,
    psychology: `Buyers tried to lift price during the bar and were pushed back, yet sellers also failed to make new lows. The story is weaker than a hammer: it shows an attempt by buyers, not a rejection of lower prices. That is why confirmation matters even more here.`,
    context: `Look for it after an extended decline into a support zone you identified in advance, such as the previous day's low or a higher-timeframe demand area. It carries more weight if the market has been oversold on several timeframes.`,
    confirmation: `The next bar should open at or above the inverted hammer's body and close above its high. Without that, the long upper wick is just evidence of selling into strength, which is bearish.`,
    entry: `Buy stop above the high of the confirming bar or the inverted hammer, whichever is higher. Avoid buying the inverted hammer's close.`,
    stop: `Below the inverted hammer's low. The stop distance is often small, which is attractive, but small stops also get hit by normal noise; check the stop is at least a fraction of the bar's ATR.`,
    target: `The nearest swing high or VWAP. Take partial profits at one R and trail the rest behind higher lows on the entry timeframe.`,
    failure: `Frequently the upper wick marks supply and the decline continues. Example: a midcap stock prints an inverted hammer at ₹612, the next bar opens lower, and price slides to ₹598 without ever triggering your buy stop. That is the stop order doing its job.`,
    mistakes: `Confusing it with a shooting star (location decides); buying on hope with no confirmation; ignoring that the long upper wick represents sellers who may still be there.`
  },
  {
    id: 'shooting-star', name: 'Shooting star', kind: 'single', bias: 'bearish', evidence: 'mixed',
    bars: [...U, [103.4, 105.4, 103, 103.1]],
    patternBars: 1,
    formation: `After a rally: a small body at the lower end of the bar, a long upper wick at least twice the body, and little or no lower wick. Ideally it gaps or pushes to a new high for the move before closing near its low.`,
    psychology: `Buyers extended the rally, then met heavy selling that pushed price back down to around the open. Late buyers near the high are now trapped at a loss, and their stop orders can fuel the next move down if price keeps falling.`,
    context: `Strongest at a predefined resistance: prior day high, a gap fill level, the top of an opening range, or after a run that is stretched far from VWAP. A shooting star in an uptrend that has just broken out of a base is much less reliable.`,
    confirmation: `The next bar breaks and closes below the shooting star's low. Supportive signs include declining momentum (for example RSI failing to make a new high) and higher volume on the rejection.`,
    entry: `Sell stop a tick below the shooting star's low, cancelled if not triggered within one or two bars. Alternatively, wait for a weak retest of the wick area and short the failure.`,
    stop: `Above the high of the upper wick. Because the wick is long, the stop can be wide; size down accordingly rather than moving the stop inside the wick.`,
    target: `First target at VWAP, the breakout level the rally came from, or the last higher low. Trail above lower highs if momentum continues.`,
    failure: `In a strong trend day the shooting star is often just a pause, and price breaks above the wick. Example: an NVDA 5-minute shooting star at $142.80 triggers a short at $141.90, then a market-wide rally lifts it through $143 within 20 minutes.`,
    mistakes: `Shorting every long upper wick; fighting a strong trend day; ignoring scheduled news that can blow through the wick; placing the stop just below the high where normal noise hits it.`
  },
  {
    id: 'hanging-man', name: 'Hanging man', kind: 'single', bias: 'bearish', evidence: 'subjective',
    bars: [...U, [103.6, 103.8, 101.6, 103.4]],
    patternBars: 1,
    formation: `Shape identical to a hammer: small body near the top, long lower wick at least twice the body, little upper wick. The difference is location: it appears after a rally, near a high.`,
    psychology: `During the bar sellers were able to push price well below the open, which shows that supply exists at these levels. Buyers rescued the close, but the dip reveals fragility. If the next bar cannot hold above it, recent buyers are exposed.`,
    context: `Only relevant after a clear advance into resistance. It is one of the weaker patterns because the close is strong; treat it as a warning to tighten stops on longs more than a reason to short.`,
    confirmation: `Essential. Require the next bar to close below the hanging man's body, ideally below its low. A gap down or a strong bearish bar after it is the classic confirmation.`,
    entry: `For a short, sell stop below the hanging man's low after a confirming close. Many traders use it only to manage existing longs.`,
    stop: `Above the hanging man's high or the confirming bar's high, whichever is higher.`,
    target: `The nearest support: VWAP, the start of the last impulse, or the opening range high. Expect modest targets; this is not a strong reversal signal.`,
    failure: `Because buyers won the close, the next bar often continues higher. Example: Reliance prints a hanging man at ₹2,948, the next bar opens flat and closes at ₹2,962; anyone who shorted the hanging man's close is immediately offside.`,
    mistakes: `Shorting without confirmation; forgetting that the same shape is called a hammer in a different location; using it against a strong higher-timeframe uptrend; misreading a normal pullback wick as distribution.`
  },
  {
    id: 'marubozu-bull', name: 'Bullish marubozu', kind: 'single', bias: 'bullish', evidence: 'subjective',
    bars: [[100.5, 101, 99.8, 100.2], [100.2, 100.9, 99.6, 100.6], [100.6, 101.1, 99.9, 100.1], [100.1, 100.8, 99.7, 100.5], [100.5, 100.9, 99.8, 100], [100, 100.7, 99.6, 100.2], [100.2, 102.8, 100.15, 102.75]],
    patternBars: 1,
    formation: `A long green body with no or almost no wicks: it opens at or near the low and closes at or near the high. The body should be large relative to recent bars, say two or more times the average range.`,
    psychology: `Buyers controlled the entire bar. There was no meaningful selling at any point, and the close at the high means buyers were still lifting offers into the close. It shows strong demand, often from a news catalyst or a breakout.`,
    context: `Most useful as a continuation signal when it breaks out of a range or a consolidation, such as an opening range or a multi-day high. In an already stretched trend, a marubozu can be an exhaustion bar instead of the start of a move.`,
    confirmation: `Watch the next bars: a shallow pullback that holds the marubozu's midpoint is constructive. A quick reversal back into the range is a warning that the breakout failed.`,
    entry: `Few traders chase the close. Common approaches are buying a pullback to the midpoint or to the breakout level, or buying the break of a small consolidation that forms after it.`,
    stop: `Below the marubozu's midpoint for an aggressive entry, or below its low for a conservative one. The low is often far away; size down to keep risk fixed.`,
    target: `The next higher-timeframe resistance, or a measured move equal to the prior range height. Trail behind higher lows.`,
    failure: `Late in a move a marubozu can mark capitulation buying. Example: a stock spikes on a results headline with a ₹40 marubozu, you buy the close, and the next 15 minutes retrace half the bar as early buyers take profits.`,
    mistakes: `Chasing at the close with a wide stop; treating it as a signal in the middle of nowhere; ignoring that it may simply be a news reaction; failing to compare its size with the recent average.`
  },
  {
    id: 'marubozu-bear', name: 'Bearish marubozu', kind: 'single', bias: 'bearish', evidence: 'subjective',
    bars: [[100.5, 101, 99.8, 100.2], [100.2, 100.9, 99.6, 100.6], [100.6, 101.1, 99.9, 100.1], [100.1, 100.8, 99.7, 100.5], [100.5, 100.9, 99.8, 100], [100, 100.7, 99.6, 100.2], [100.2, 100.25, 97.6, 97.65]],
    patternBars: 1,
    formation: `A long red body with no or almost no wicks: it opens at or near the high and closes at or near the low. The body should be clearly larger than recent bars.`,
    psychology: `Sellers dominated the entire bar with no meaningful bounce, and the close at the low shows they were still hitting bids at the end. It often reflects forced selling, a negative catalyst, or a breakdown that triggered stops below a level.`,
    context: `Most informative when it breaks down from a range or below a well-watched level like the previous day's low or VWAP. Late in a long decline, it can mark capitulation and precede a sharp bounce.`,
    confirmation: `A weak bounce that fails below the marubozu's midpoint supports continuation. A quick reclaim of the broken level suggests a failed breakdown and possible short squeeze.`,
    entry: `Short a pullback towards the midpoint or the broken level, or the break of a small flag that forms after the bar. Chasing the close gives a poor stop location.`,
    stop: `Above the midpoint (aggressive) or above the high (conservative). Size so that the stop equals your planned risk.`,
    target: `The next support zone or a measured move equal to the range height. In India, check the stock is in the F&O list and not near its lower circuit, which can freeze exits.`,
    failure: `After a long decline, a bearish marubozu is often the last flush. Example: Bank Nifty drops 300 points in a 5-minute marubozu at 14:10, you short the close, and buyers lift it 180 points by 14:30 as shorts cover.`,
    mistakes: `Shorting at the low of a capitulation bar; ignoring circuit limits; mistaking a scheduled-news spike for structural selling; skipping the size check against recent bars.`
  },
  {
    id: 'pin-bar', name: 'Pin bar', kind: 'single', bias: 'either', evidence: 'subjective',
    bars: [[101, 101.3, 100, 100.3], [100.3, 100.6, 99.2, 99.5], [99.5, 99.9, 98.6, 98.9], [98.9, 99.6, 98.5, 99.4], [99.4, 99.7, 98.6, 98.8], [98.8, 99.1, 98.2, 98.5], [98.5, 99.2, 96.9, 99]],
    patternBars: 1,
    formation: `A price-action name for a bar with one long wick (the nose) that protrudes beyond the surrounding bars, and a small body at the opposite end. A bullish pin has a long lower wick; a bearish pin has a long upper wick. It overlaps with the hammer and shooting star but stresses the protrusion.`,
    psychology: `Price probed beyond nearby bars, perhaps triggering stops, and was rejected quickly. The protruding wick suggests that orders on the other side absorbed the move. It is a rejection story; its value depends on what was rejected.`,
    context: `Use it only at levels marked before the session: prior day high or low, opening range edges, a higher-timeframe swing. A pin bar in the middle of a range has nothing to reject.`,
    confirmation: `The next bar should move away from the nose and break the pin's body end. Some traders also require the pin to close back inside the prior bar's range.`,
    entry: `Stop order beyond the pin's body end (above the high for a bullish pin), or a limit order at the 50% retracement of the wick for a better price with a lower fill rate.`,
    stop: `Beyond the tip of the nose. With a long wick this can be wide; reduce size or pass.`,
    target: `The opposite side of the recent range, or at least two R if the structure allows. Pin bars against a strong trend should target less.`,
    failure: `A pin at a level can simply be the first test; the second test breaks it. Example: a bullish pin forms at the previous day's low on Nifty, triggers, and 20 minutes later the level breaks for a stop-out as the trend resumes.`,
    mistakes: `Labelling every wick a pin; ignoring trend; entering before the close; placing stops inside the nose; assuming the wick proves institutional buying.`
  },
  {
    id: 'bullish-engulfing', name: 'Bullish engulfing', kind: 'double', bias: 'bullish', evidence: 'mixed',
    bars: [...D, [97.9, 98.1, 97.2, 97.4], [97.3, 98.6, 97.1, 98.4]],
    patternBars: 2,
    formation: `Two bars after a decline. The first is a red candle. The second is a green candle whose body opens at or below the first's close and closes above the first's open, so its body fully covers the first body. In intraday charts gaps are rare, so most traders accept an open equal to the prior close.`,
    psychology: `Sellers were in control on bar one. On bar two, buyers not only stopped the decline but recovered all of bar one's losses and more. Shorts who sold bar one are now underwater, and their covering can add fuel.`,
    context: `Look for it after a clear down leg into a planned support level, ideally with the engulfing bar much larger than recent bars. The higher-timeframe trend matters: engulfing patterns that agree with it tend to deserve more attention than counter-trend ones.`,
    confirmation: `Follow-through on the next bar above the engulfing high, a reclaim of VWAP, or above-average volume on the engulfing bar. If the next bar immediately falls back into the first candle's body, treat the signal as void.`,
    entry: `Buy stop above the engulfing bar's high, or buy a pullback into the upper half of the engulfing body on the next bar or two.`,
    stop: `Below the low of the two-bar pattern. If that low is far away, a tighter alternative is below the engulfing bar's midpoint, accepting a higher chance of being stopped.`,
    target: `First target at the nearest resistance or one to one-and-a-half R; trail the remainder below higher lows.`,
    failure: `Against a strong downtrend the engulfing bar may just be a short-covering bounce. Example: on a 5-minute chart Infosys engulfs at ₹1,512 after falling all morning; your buy above ₹1,520 triggers, then selling resumes and price breaks ₹1,508 within three bars.`,
    mistakes: `Accepting engulfing bars that are barely larger than the first candle; ignoring where they form; buying the close without a plan for a failed follow-through; treating it as stronger than it is just because it is popular.`
  },
  {
    id: 'bearish-engulfing', name: 'Bearish engulfing', kind: 'double', bias: 'bearish', evidence: 'mixed',
    bars: [...U, [103.4, 104.2, 103.3, 104], [104.1, 104.3, 102.6, 102.9]],
    patternBars: 2,
    formation: `Two bars after a rally. The first is a green candle. The second is a red candle whose body opens at or above the first's close and closes below the first's open, fully covering the first body.`,
    psychology: `Buyers carried price higher on bar one, then sellers wiped out all of that gain and more in a single bar. Anyone who bought bar one is trapped at a loss, and their exits can extend the drop.`,
    context: `Most relevant at a level identified before the open: prior day high, a gap-fill level, a round number, or an extended stretch above VWAP. Late-day bearish engulfing bars often reflect profit-taking rather than a fresh trend.`,
    confirmation: `The next bar trades below the engulfing low and stays there. Supportive evidence includes a loss of VWAP, momentum divergence, and high relative volume on the engulfing bar.`,
    entry: `Sell stop below the engulfing bar's low, or short a weak retest of the engulfing bar's midpoint.`,
    stop: `Above the high of the two-bar pattern. If you short the retest, you can use the engulfing bar's high as long as risk fits your plan.`,
    target: `First target at VWAP or the last swing low. On index futures, check that the stop and target in points translate into acceptable rupee risk at your lot size.`,
    failure: `In a strong trend-up day, bearish engulfing bars are often absorbed. Example: Nifty futures engulf at 24,880, you short at 24,850, and the market grinds back above 24,900 by noon for a stop-out.`,
    mistakes: `Taking tiny engulfing patterns in ranges; ignoring a bullish higher-timeframe structure; shorting into major support just below; holding through an obvious failure because the pattern "should" work.`
  },
  {
    id: 'piercing', name: 'Piercing line', kind: 'double', bias: 'bullish', evidence: 'subjective',
    bars: [...D, [98, 98.2, 96.6, 96.8], [96.6, 97.7, 96.4, 97.6]],
    patternBars: 2,
    formation: `After a decline: a long red candle followed by a green candle that opens below the red candle's close (or at it, on intraday charts) and closes above the midpoint of the red body, but not above its open. If it closes above the open, it is a bullish engulfing instead.`,
    psychology: `Sellers dominated the first bar and opened the second lower, but buyers reclaimed more than half of the first bar's body. It shows demand appearing, though less decisively than an engulfing.`,
    context: `Most meaningful on daily charts where gaps are real. Intraday, a gap is rare except at the session open, so the opening bar after an overnight decline is the classic intraday location. Combine with a known support level.`,
    confirmation: `A third bar closing above the piercing candle's high. Without that, the pattern is only a partial recovery that sellers can fade.`,
    entry: `Buy stop above the piercing candle's high or the confirming bar's high.`,
    stop: `Below the low of the two-bar pattern.`,
    target: `The open of the first red candle is a natural first target, since that is where its sellers began; beyond that, the nearest resistance.`,
    failure: `Sellers often defend the upper half of the first red body. Example: after a gap-down open, a stock's first 15-minute bar pierces to ₹845 from ₹832, you buy above ₹846, and price fades back to ₹830 as the gap-down sellers return.`,
    mistakes: `Confusing it with engulfing; ignoring the midpoint rule; trading it in ranges; assuming a gap-down open will always fill.`
  },
  {
    id: 'dark-cloud', name: 'Dark cloud cover', kind: 'double', bias: 'bearish', evidence: 'subjective',
    bars: [...U, [102.4, 104.6, 102.3, 104.4], [104.6, 104.8, 103.1, 103.2]],
    patternBars: 2,
    formation: `After a rally: a long green candle, then a red candle that opens above the green close (or at it intraday) and closes below the green body's midpoint, but above its open.`,
    psychology: `Buyers looked strong into the first close, and the second bar even started higher. Then sellers pushed price deep into the prior gains. It suggests supply arriving at higher prices, though not complete control.`,
    context: `Use at resistance after an extended run. Intraday, the most natural location is the open after a gap-up, where the first bar sells into the gap.`,
    confirmation: `A following bar that closes below the dark cloud's low. A loss of VWAP after a gap-up adds weight.`,
    entry: `Sell stop below the dark cloud candle's low or the confirmation bar's low.`,
    stop: `Above the high of the two-bar pattern.`,
    target: `The open of the first green candle, then the next support such as the prior day's close or the gap-fill level.`,
    failure: `In strong trends, the dip into the green body is bought. Example: on a gap-up day SPY opens at $598, the first 5-minute bar forms a dark cloud, you short at $597.10, and buyers reclaim $598.50 within 20 minutes.`,
    mistakes: `Shorting every red bar after a green one; ignoring the midpoint rule; fighting a strong gap-and-go day; skipping a check of the economic calendar.`
  },
  {
    id: 'bullish-harami', name: 'Bullish harami', kind: 'double', bias: 'bullish', evidence: 'subjective',
    bars: [...D, [98.2, 98.4, 96.4, 96.6], [96.9, 97.6, 96.7, 97.4]],
    patternBars: 2,
    formation: `After a decline: a long red candle followed by a small candle whose body sits entirely within the prior body. The small candle can be any colour; if it is a doji the pattern is called a harami cross.`,
    psychology: `The decline stalls. Sellers who were in control on bar one could not extend the move, and the range contracts. It signals a loss of momentum, not a takeover by buyers.`,
    context: `After an extended decline into support. Because it is a contraction pattern, it often precedes a breakout either way, which is why some traders treat it as neutral until resolved.`,
    confirmation: `A close above the first red candle's midpoint or above the harami's high. A break below the harami's low instead suggests continuation of the decline.`,
    entry: `Buy stop above the harami candle's high; some traders place a sell stop below its low too and let the market choose.`,
    stop: `Below the low of the first candle, or below the harami's low for a tighter stop.`,
    target: `The top of the first red candle as a first objective, then the next resistance.`,
    failure: `Haramis often resolve in the trend's direction. Example: a stock declining all morning prints a harami at ₹410; the next bar breaks the low and drops to ₹402, never triggering the buy.`,
    mistakes: `Treating it as a strong reversal; ignoring breakouts in the trend's direction; trading it in a range where contraction is normal.`
  },
  {
    id: 'bearish-harami', name: 'Bearish harami', kind: 'double', bias: 'bearish', evidence: 'subjective',
    bars: [...U, [102.4, 104.4, 102.3, 104.2], [103.9, 104.1, 103.3, 103.5]],
    patternBars: 2,
    formation: `After a rally: a long green candle followed by a small candle whose body lies entirely within the first body. A doji in that position is a bearish harami cross.`,
    psychology: `The rally pauses. Buyers could not extend beyond the prior bar, and the range shrinks. It is a warning that momentum is fading, not a confirmation that sellers have taken control.`,
    context: `At resistance after a stretched run, such as the prior day high or a level far above VWAP. Often more useful for managing an existing long than for initiating a short.`,
    confirmation: `A close below the harami's low or below the first candle's midpoint. A break above the harami's high instead suggests continuation.`,
    entry: `Sell stop below the harami's low.`,
    stop: `Above the high of the first candle or of the harami bar.`,
    target: `The base of the first green candle, then VWAP or the nearest support.`,
    failure: `In a trending session the harami is just a pause. Example: a strong Bank Nifty trend-up morning prints a harami at 53,200, you short below 53,150, and price breaks above 53,300 shortly after.`,
    mistakes: `Shorting a pause in a strong uptrend; ignoring breakouts upward; using haramis on tiny timeframes where contraction bars are constant; forgetting that a harami is an inside bar with a candlestick name, and inherits the same false-break problem.

> [!evidence] Treat the harami as a momentum-fade warning, not a tested reversal signal.`
  },
  {
    id: 'tweezer-top', name: 'Tweezer top', kind: 'double', bias: 'bearish', evidence: 'subjective',
    bars: [...U, [103.4, 104.6, 103.2, 104.3], [104.3, 104.62, 103.4, 103.6]],
    patternBars: 2,
    formation: `After a rally, two consecutive bars with highs at or very close to the same price. Usually the first is green and the second red, though the key feature is the matching highs.`,
    psychology: `Buyers tested a price twice and were turned back both times. It suggests that a seller or a cluster of resting orders is defending that level, at least for now.`,
    context: `Meaningful when the matching highs coincide with a level you already marked, like the prior day high or a round number. On fast intraday charts, matching highs are common by chance, so location is the filter.`,
    confirmation: `A break below the low of the two bars. Lower momentum on the second test and a close below VWAP strengthen the case.`,
    entry: `Sell stop below the low of the pair, or a short on a weak third push towards the double high with a tight stop.`,
    stop: `A few ticks above the shared high.`,
    target: `The start of the last impulse up, or VWAP. Measured moves equal to the pattern's height are a reasonable first objective.`,
    failure: `Levels tested repeatedly tend to break eventually. Example: a stock tests ₹1,250 twice in two bars, you short at ₹1,244, and the third test breaks through to ₹1,262.`,
    mistakes: `Accepting highs that are not actually similar; ignoring the trend; holding the short when the level breaks; confusing a tight consolidation with a rejection.`
  },
  {
    id: 'tweezer-bottom', name: 'Tweezer bottom', kind: 'double', bias: 'bullish', evidence: 'subjective',
    bars: [...D, [97.8, 98, 96.9, 97.1], [97.1, 97.9, 96.92, 97.8]],
    patternBars: 2,
    formation: `After a decline, two consecutive bars with lows at or very near the same price. Typically the first is red and the second green.`,
    psychology: `Sellers pushed to the same price twice and failed to break it. That suggests buyers are defending the level. The second bar's green close adds weight to the story.`,
    context: `Use at a support level identified in advance: prior day low, opening range low, a VWAP band. A random pair of equal lows means little.`,
    confirmation: `A break above the high of the pair. A reclaim of VWAP or a shift to higher highs on the entry timeframe adds support.`,
    entry: `Buy stop above the pair's high, or buy near the shared low on a third test with a tight stop.`,
    stop: `A few ticks below the shared low.`,
    target: `The last lower high, or a measured move equal to the pair's range.`,
    failure: `Repeated tests of support often weaken it. Example: Nifty tests 24,400 twice, you buy at 24,420, and a third push breaks 24,390, triggering a stop-run below the obvious level.`,
    mistakes: `Placing the stop exactly at the obvious level where everyone else's sit; treating equal lows as guaranteed support; ignoring a bearish higher timeframe; accepting lows that differ by more than a tick or two on liquid instruments.

> [!evidence] Tweezers are a subjective label. Equal lows occur by chance frequently, so only those at levels you marked in advance deserve attention.`
  },
  {
    id: 'inside-bar', name: 'Inside bar', kind: 'double', bias: 'neutral', evidence: 'subjective',
    bars: [[99, 100, 98.8, 99.8], [99.8, 100.8, 99.6, 100.6], [100.6, 101.4, 100.3, 101.2], [101.2, 101.9, 100.8, 101.7], [101.7, 102.4, 101.4, 102.2], [102.2, 103.8, 101.9, 103.5], [103.3, 103.4, 102.5, 102.9]],
    patternBars: 2,
    formation: `A bar whose high is lower than, and whose low is higher than, the previous bar (the mother bar). It shows range contraction. Several inside bars in a row form a tighter coil.`,
    psychology: `After a large move, the market pauses and both sides wait. Orders build on either side of the mother bar's range, and a break of that range often brings a burst of activity as stops and breakout orders fire.`,
    context: `Most useful after a strong impulse, where a pause is natural, and at a level that matters. A trend-direction break is the classic setup. Inside bars in a choppy, low-volume midday session are less useful.`,
    confirmation: `A close beyond the mother bar's high or low. Many traders use the inside bar's range as the trigger and the mother bar as the bigger structure.`,
    entry: `Buy stop above the inside bar's high in an uptrend (sell stop below its low in a downtrend), or bracket both sides and cancel the unused order.`,
    stop: `Opposite side of the inside bar for a tight stop, or opposite side of the mother bar for a wider one.`,
    target: `A measured move equal to the mother bar's range, or the next level.`,
    failure: `False breaks are common: price pokes out, triggers orders, and reverses. Example: an inside bar on a 15-minute chart of a stock breaks up at ₹720, you buy at ₹721, and it reverses below ₹715 within one bar.`,
    mistakes: `Trading every inside bar; bracketing both sides in chop and getting whipsawed; using the mother bar stop when it is too wide for your account.`
  },
  {
    id: 'outside-bar', name: 'Outside bar', kind: 'double', bias: 'either', evidence: 'subjective',
    bars: [[101, 101.5, 100.6, 101.2], [101.2, 101.7, 100.8, 101.4], [101.4, 102, 101.1, 101.8], [101.8, 102.3, 101.4, 102], [102, 102.4, 101.6, 101.9], [101.9, 102.3, 101.5, 102.1], [102.6, 102.9, 100.6, 100.8]],
    patternBars: 2,
    formation: `A bar whose high is above and whose low is below the previous bar's range. Its direction comes from the close: a close near the low is bearish, near the high is bullish. When bodies also engulf, it overlaps with the engulfing pattern.`,
    psychology: `Price went both ways beyond the prior bar, typically running stops on one side, then reversing to take out the other. The close shows who won the bar.`,
    context: `Most informative at a level or after a stretch. In volatile markets outside bars are common and carry less meaning. Look at the size relative to recent bars and the strength of the close.`,
    confirmation: `The next bar should continue in the direction of the outside bar's close and stay beyond its midpoint.`,
    entry: `Stop order beyond the outside bar's extreme in the direction of its close, or a pullback towards its midpoint.`,
    stop: `Beyond the opposite extreme or the midpoint, depending on risk tolerance.`,
    target: `The next level in the direction of the close, or a move equal to the outside bar's range.`,
    failure: `In a volatile session, outside bars may simply reflect noise. Example: on a Fed decision day, a SPY 5-minute outside bar closes at its low, you short, and the next bar reverses the entire move.`,
    mistakes: `Ignoring news-driven volatility; entering against the close direction; using it on very small timeframes.`
  },
  {
    id: 'morning-star', name: 'Morning star', kind: 'triple', bias: 'bullish', evidence: 'mixed',
    bars: [...D2, [99.4, 99.6, 97.6, 97.8], [97.6, 97.9, 97, 97.5], [97.7, 99.4, 97.6, 99.2]],
    patternBars: 3,
    formation: `Three bars after a decline: a long red candle, then a small-bodied candle (the star) that ideally gaps or holds below the first close, then a long green candle that closes well into the first red body, usually above its midpoint.`,
    psychology: `Selling dominates bar one, stalls in bar two as neither side controls price, and buyers take charge on bar three. The three bars tell a complete story of a decline, a pause and a recovery.`,
    context: `Best at support after a sustained decline. On intraday charts, gaps between bars are rare, so the star simply needs a small body near the lows. A morning star across the opening bars after an overnight drop is a natural location.`,
    confirmation: `The third bar itself is a partial confirmation. Extra confirmation is a break above the third bar's high or a reclaim of VWAP.`,
    entry: `Buy above the third bar's high, or buy a pullback into the upper half of the third bar.`,
    stop: `Below the star's low, which is the lowest point of the pattern.`,
    target: `The top of the first red candle, then the next resistance. Consider partial profits at one R.`,
    failure: `Sellers may return after the bounce. Example: a Bank Nifty 15-minute morning star forms at 51,800, you buy at 51,950, and selling returns to 51,750 by the afternoon.`,
    mistakes: `Accepting a third bar that barely recovers; ignoring the higher timeframe; buying too late, after a big rally from the star; not adjusting for the wide stop.`
  },
  {
    id: 'evening-star', name: 'Evening star', kind: 'triple', bias: 'bearish', evidence: 'mixed',
    bars: [...U.slice(0, 6), [102.4, 104.2, 102.3, 104], [104.2, 104.8, 104, 104.4], [104.2, 104.3, 102.6, 102.8]],
    patternBars: 3,
    formation: `Three bars after a rally: a long green candle, a small-bodied star at or above the first close, and a long red candle that closes well into the first green body, usually below its midpoint.`,
    psychology: `Buying drives bar one, stalls in bar two, and selling takes over on bar three. It describes a shift from demand to supply over three bars.`,
    context: `At resistance after a sustained advance, ideally with momentum already waning. Intraday, the opening bars after a gap-up are a common location.`,
    confirmation: `The third bar partly confirms. A break below its low or a loss of VWAP adds evidence.`,
    entry: `Sell below the third bar's low, or short a weak retest of its midpoint.`,
    stop: `Above the star's high.`,
    target: `The base of the first green candle, then the next support.`,
    failure: `Buyers may defend the dip. Example: a stock forms an evening star at ₹980, you short at ₹972, and buying returns to push it above ₹985 within an hour.`,
    mistakes: `Accepting a weak third bar; fighting a strong trend day; ignoring support just below; chasing the short far below the pattern.

> [!evidence] Star patterns are popular in the literature, but tests of three-bar candle patterns on their own report weak and inconsistent results that vary by market and period. Treat the evening star as a prompt to look harder at location, momentum and volume, not as an edge in itself. Record every instance you trade in your journal to build your own sample.`
  },
  {
    id: 'three-white-soldiers', name: 'Three white soldiers', kind: 'triple', bias: 'bullish', evidence: 'subjective',
    bars: [[101, 101.3, 99.8, 100], [100, 100.2, 98.8, 99], [99, 99.3, 97.9, 98.2], [98.2, 98.6, 97.6, 97.9], [97.9, 98.3, 97.4, 98], [98, 99.3, 97.9, 99.1], [99, 100.4, 98.9, 100.2], [100.1, 101.5, 100, 101.3]],
    patternBars: 3,
    formation: `Three consecutive long green candles, each opening within the prior body and closing near its high, with each close higher than the last. Small upper wicks are ideal.`,
    psychology: `Buyers keep control bar after bar, absorbing any selling. It shows steady demand rather than a single spike.`,
    context: `After a decline or a base, it can signal a shift in control. After an already extended rally, three strong bars can instead mark exhaustion.`,
    confirmation: `A shallow pullback that holds above the second soldier's midpoint is constructive. Shrinking bodies or long upper wicks on the third bar (an "advance block") warn of fading demand.`,
    entry: `Buy a pullback rather than the third close, since the entry price is often extended.`,
    stop: `Below the second soldier's low, or the first soldier's low for a wider stop.`,
    target: `The next resistance or a measured move from the base.`,
    failure: `After three strong bars, profit-taking is common. Example: Nifty rallies three 15-minute bars to 24,750, you buy at the close, and the next hour retraces to 24,640.`,
    mistakes: `Chasing at the extended close; ignoring the advance-block warning; not checking where the next resistance is; treating three strong bars as proof that large institutions are buying.

> [!evidence] This is a descriptive pattern, not a tested edge. Three consecutive strong bars simply describe momentum that has already happened; whether it persists depends on context, liquidity and news. Paper-trade it and journal the outcomes before relying on it.`
  },
  {
    id: 'three-black-crows', name: 'Three black crows', kind: 'triple', bias: 'bearish', evidence: 'subjective',
    bars: [[99, 100.2, 98.8, 100], [100, 101.2, 99.8, 101], [101, 102.1, 100.7, 101.8], [101.8, 102.4, 101.4, 102.1], [102.1, 102.6, 101.7, 102], [102, 102.1, 100.7, 100.9], [101, 101.1, 99.6, 99.8], [99.9, 100, 98.5, 98.7]],
    patternBars: 3,
    formation: `Three consecutive long red candles, each opening within the prior body and closing near its low, with each close lower than the last.`,
    psychology: `Sellers keep control bar after bar. It reflects persistent supply rather than a single shock.`,
    context: `After a rally or a top, it can mark a shift in control. After a long decline, it can mark exhaustion and precede a short squeeze.`,
    confirmation: `A weak bounce that fails below the second crow's midpoint. Shrinking bodies or long lower wicks on the third bar warn of fading supply.`,
    entry: `Short a bounce rather than the third close.`,
    stop: `Above the second crow's high or the first crow's high.`,
    target: `The next support or a measured move from the top.`,
    failure: `Late in a decline, three crows can be the final flush. Example: a stock drops three bars to ₹540, you short the close, and a bounce to ₹556 stops you out.`,
    mistakes: `Shorting the extended close; ignoring capitulation signs; not checking circuit limits or nearby support; assuming every three-bar decline is the start of a trend.

> [!evidence] Like its bullish mirror, three black crows describes momentum after the fact. There is no reliable evidence that the pattern alone predicts further declines. On intraday charts three consecutive red bars are common; the useful question is where they occurred and how price behaves on the first bounce. Paper-trade and journal it before risking capital.`
  }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
