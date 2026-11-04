/* Phase-2 lessons: l2-price-action (L2-M1), l2-wave-theories (L2-M3), l4-scalping (L4-M1) + extra module assessment questions.
   Charge figures computed with IA.risk.indiaCharges / IA.risk.usCharges (specs as of 4 Nov 2026). */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  IA.content.lessons = IA.content.lessons || []; IA.content.questions = IA.content.questions || [];
  IA.content.lessons.push(
  /* ===================== L2-M1 Price action reading ===================== */
  {
    id: 'l2-price-action', module: 'L2-M1', level: 2, track: 'ta', title: 'Price action reading: bar-by-bar context, pressure and failed moves', mins: 22,
    summary: 'Read an intraday chart bar by bar — context first, then pressure, pullbacks, traps and second entries — and turn that reading into a defined entry, stop and measured-move target.',
    evidence: 'subjective',
    sections: [
      { h: 'Beginner view', md: `**Price action reading** means trading from the bars themselves — their size, where they close, how much they overlap — instead of from indicators. It sounds simple. It is not, because a single candle means almost nothing on its own. A big green bar after a long rally into yesterday's high is a very different event from the same bar at the bottom of a quiet range.

Like a word in a sentence, a bar needs the words around it: the **context**.

So the order is always:
1. **Context** — trend or range? Above or below VWAP? Near a level?
2. **Pressure** — who has been in control over the last few bars?
3. **Setup** — is there a pullback, a failed move or a second attempt?
4. **Plan** — entry, stop, target, size.

> [!evidence] **Subjective**, with some mixed components. Price action reading is a discretionary skill: two experienced readers can disagree on the same chart. Some ingredients — short-term continuation after strong trends, reversals after failed breakouts — overlap with effects that have mixed empirical evidence, but the overall method has no agreed definition and so cannot be tested as a whole. You test **your written rules**, not "price action".` },
      { h: 'Intermediate view', md: `### Context first
- **Trend or range**: use the swing definition from [[link:l2-dow]]. Lots of overlapping bars and both-side tails mean range; consecutive closes near the extreme of each bar, small pullbacks and little overlap mean trend.
- **Location**: mark the previous day's high/low/close, the opening range and VWAP ([[link:l2-opening-range]], [[link:l2-vwap-advanced]]). The same bar reads differently at a level than in the middle of nowhere.
- **VWAP side**: a market that holds above a rising VWAP for an hour has buyers defending the average price of the day.

### Bar anatomy in context
| Feature | In a trend, pointing with it | At a range extreme, against it |
|---|---|---|
| Close near high (bull bar) | Continuation pressure | Possible exhaustion or trap |
| Long lower tail | Buyers absorbing the dip | Rejection of the low (only if the level matters) |
| Small doji | Pause, not reversal | Indecision at the edge |

[[pattern:pin-bar]]

### Pressure: overlap, tails and closes
Count over the last 5–10 bars: how many close in their top third versus bottom third? How much does each bar overlap the previous one? **Little overlap plus strong closes in one direction is pressure.** Heavy overlap with tails on both ends means two-sided trade — a poor place for breakout entries.

### Two-legged pullbacks
In a trend, pullbacks often come in **two legs**: a dip, a small bounce that fails, and a second dip. The second leg traps traders who shorted the first dip expecting a reversal. Many price-action traders wait for that second leg to end, ideally near VWAP or the 20 EMA, and then buy above a bull **signal bar**.

[[chart:NIFTY:27:vwap,ema20,vol]]

### Failed breakouts and second entries
A **failed breakout** is a move beyond a level that cannot hold: price pokes above the prior high, then closes back inside ([[link:l2-breakouts]]). Breakout buyers are now trapped and their stops become fuel for the move the other way. A **second entry** is the second attempt at the same idea — e.g. the second failed push to new highs. The argument is that two failures carry more information than one; it is a heuristic, not a measured law.` },
      { h: 'Advanced view', md: `### How professionals use it
Al Brooks, whose books on reading price charts bar by bar popularised much of this vocabulary, frames trading around a few ideas (paraphrased):

- Ask continuously which side is **always in** — if you had to hold a position right now, long or short?
- Most bars and setups have a probability, a risk and a reward; a trade is only worth taking when the combination (his "trader's equation") is positive. A high-probability setup with a tiny reward and a wide stop can still be a poor trade.
- Trends are made of **legs**; pullbacks frequently have two legs; counting attempts (first, second) helps separate a pause from a reversal.
- Inside trading ranges, he argues, most breakout attempts fail, so fading extremes and buying low/selling high is favoured; in strong trends the opposite holds.

These are rules of thumb from one author's long screen experience, not tested statistics. Use them as **hypotheses to write down and test**, not as facts.

### Measured moves
A **measured move** projects the length of one leg from the end of the pullback: {{target = pullback low + (leg 1 high − leg 1 start)}}. It is a target for managing a trade, not a forecast. Treat it as one of several exits alongside prior highs and the close of session.

### Discipline that makes it testable
Write the context down before looking for setups, define a signal bar objectively (e.g. closes in its top third, body at least half its range), and skip the middle of ranges, the lunch drift and bars just before scheduled news.` },
      { h: 'The maths', md: `:::formula
Measured-move target = pullback extreme + (leg 1 end − leg 1 start)
R multiple = (target − entry) ÷ (entry − stop)
Break-even win rate = net loss ÷ (net win + net loss)
:::

### Worked example (illustrative Nifty futures, 1 lot = 65)
- Leg 1: 25,690 → 25,810 (120 points). Pullback in two legs to 25,760, right at VWAP.
- Signal bar closes strongly; buy at 25,772. Stop 25,754 (below the pullback low with a buffer): 18 points.
- Measured-move target: 25,760 + 120 = **25,880** (108 points above entry): 6R gross.

Charges from the app's engine (futures, ₹20/order brokerage assumption, as of Nov 2026):
| Outcome | Gross | Charges | Net |
|---|---|---|---|
| Target hit | ₹7,020 | ₹998.26 | ₹6,021.74 |
| Stop hit | −₹1,170 | ₹993.98 | −₹2,163.98 |

Break-even win rate = 2,163.98 ÷ (6,021.74 + 2,163.98) = **26.4%**. Note that charges (mostly futures STT at 0.05% of sell value) nearly double the 18-point loss. Tight stops in futures are expensive per unit of risk.` },
      { h: 'India', md: `> [!india] A typical Nifty setup: the market gaps up, holds above VWAP through the first hour (context: trend up), makes a two-legged pullback to VWAP at around 10:45 IST, and prints a bull bar closing near its high. You buy one tick above that bar. Nifty index futures tick by level: around 25,800 the tick is 0.10 (rule effective 15 Apr 2025, reviewed monthly — verify on nseindia.com).

Failed-breakout version on a stock: RELIANCE (illustrative) breaks the previous day's high of ₹1,452 to ₹1,456 at 13:30 on falling volume, then closes back at ₹1,449. A short below that bar with a stop above ₹1,456.50 targets the morning VWAP. Avoid this in the first 15 minutes after 09:15 — the opening auction noise produces many false "failures".` },
      { h: 'US & global', md: `> [!us] SPY (illustrative) on a range day: the prior high is 600.20. At 11:10 ET a bar spikes to 600.45 and closes at 600.05 — a failed breakout. You short 100 shares at 599.98, stop 600.50 (52 cents, $52 risk), target mid-range 598.90 ($108). Charges are tiny: about $1.24 (SEC fee on the sale; FINRA TAF paused for Oct–Dec 2026; $0 commission assumed). In US ETFs the cost problem is slippage and spread, not fees.` },
      { h: 'Common misconceptions', md: `- **"A pin bar is a reversal signal."** Only at a meaningful level and against weak pressure. In a strong trend most counter-trend tails are just pauses.
- **"Price action is pure, indicators are lagging."** Bars lag too: a signal bar is only known when it closes. Price action is a different summary of the same data, not a purer one.
- **"Trapped traders" proves big players hunted stops.** Stops cluster at obvious levels; a run through them needs no conspiracy.
- **"Second entries are high probability."** No reliable published statistic exists. Test them on your instrument and timeframe.` },
      { h: 'When it fails', md: `Price action fails when the context call is wrong. Typical losing example: you read a two-legged pullback in an uptrend and buy at 25,772 with a stop at 25,754. But the "pullback" was the first leg of a trend reversal triggered by a Bank Nifty breakdown you did not check. Price drops through VWAP; you lose 18 points plus ₹994 of charges (−₹2,164 net). If you then "re-read" the chart and buy the next dip, you are now arguing with the market.

It also fails on news bars (RBI policy, US CPI), in very thin stocks where one order prints the bar, and on low-volatility days where every signal bar is smaller than the costs.` },
      { h: 'Exercise', md: `1. Open the Chart Lab with NIFTY and VWAP, EMA 20 and volume. Before scrolling, write the context for the first hour: trend or range, VWAP side, nearest level.
2. Step bar by bar. Mark every two-legged pullback and every failed breakout you see **only at the bar where it becomes knowable**.
3. For each, log entry, stop, measured-move target and outcome in the Journal. After 30 marks, compute win rate and average R with the [[widget:expectancy]] calculator, using net figures from [[widget:charges-india]].
4. Write your signal-bar definition in one sentence. If you cannot, you are not yet testing anything.` },
    ],
    check: [
      { q: "A bull bar closes on its high right at yesterday's high after a 200-point rally with little pullback. What does context-first reading say?", o: ['Buy: strong close means continuation', 'It is ambiguous: strong pressure, but at a level where breakout failure is common; wait for the next bar or a pullback', 'Sell immediately: every bar at a level reverses', 'Ignore context; only the bar matters'], a: 1, why: 'The bar shows pressure, but location matters. Neither automatic buying nor automatic selling follows; context-first readers wait for more information.' },
      { q: 'Leg 1 runs 25,600 to 25,720; the pullback ends at 25,670. What is the measured-move target?', o: ['25,840', '25,720', '25,790', '25,770'], a: 2, why: 'Leg length 120 points added to the pullback low 25,670 = 25,790.' },
      { q: 'Why is a second failed push to new highs considered more meaningful than the first by many price-action traders?', o: ['It is a proven 80% signal', 'Two failures show buyers tried twice and could not hold; it is a heuristic to test, not a law', 'Exchanges cancel second breakouts', 'Volume is always lower'], a: 1, why: 'The logic is information from repeated failure. No reliable published success rate exists, so it must be tested.' },
      { q: 'A 1-lot Nifty futures stop of 18 points costs about ₹1,170 gross. Why is the net loss about ₹2,164?', o: ['Slippage is always 15 points', 'Round-trip charges (mostly futures STT on the sell side) add about ₹994', 'GST is charged on the loss', 'Margin interest'], a: 1, why: 'The engine shows about ₹994 of charges on roughly ₹33.5 lakh of turnover; STT at 0.05% of sell value is the bulk.' },
    ],
    refs: ['Al Brooks — Reading Price Charts Bar by Bar (book)', 'Al Brooks — Trading Price Action Trends (book)', 'Al Brooks — Trading Price Action Trading Ranges (book)', 'Lo, Mamaysky and Wang — Foundations of Technical Analysis, Journal of Finance (2000)', 'NSE — Charges and contract specifications (nseindia.com)'],
  },
  /* ===================== L2-M3 Elliott, Gann, harmonics ===================== */
  {
    id: 'l2-wave-theories', module: 'L2-M3', level: 2, track: 'ta', title: 'Elliott Wave, Gann and harmonic patterns: claims, rules and how to test them', mins: 24,
    summary: 'State the actual rules of Elliott Wave, Gann tools and harmonic patterns, explain why they are classed as subjective, and design an objective test of any such claim.',
    evidence: 'subjective',
    sections: [
      { h: 'Beginner view', md: `Some of the most popular chart methods promise to reveal a hidden order in markets: waves that repeat, angles and squares that "time" turns, or geometric shapes built from Fibonacci ratios. They are attractive because charts *do* look patterned after the fact, and because a correct call feels like magic.

This lesson does two things: it teaches the real rules so you can understand what others are talking about, and it teaches you how to **check** a claim instead of believing or dismissing it.

> [!evidence] **Subjective.** Elliott Wave, Gann and harmonic patterns allow several valid interpretations of the same chart, are usually demonstrated on hand-picked historical examples, and are often stated so that no outcome can prove them wrong. That is not the same as "proven false"; it means **unproven and hard to test** in their usual form. Rigorous, peer-reviewed out-of-sample evidence in their favour is scarce.` },
      { h: 'Intermediate view', md: `### Elliott Wave (R. N. Elliott, later Frost and Prechter)
Markets move in a **5-wave impulse** with the trend (1-2-3-4-5) followed by a **3-wave correction** (A-B-C). Each wave subdivides into smaller waves of the same form.

**The three hard rules of an impulse:**
1. Wave 2 never retraces more than 100% of wave 1.
2. Wave 3 is never the shortest of waves 1, 3 and 5.
3. Wave 4 does not enter the price territory of wave 1 (exceptions: diagonal triangles).

**Guidelines (not rules):** wave 2 often retraces 50–61.8% of wave 1; wave 4 often about 38.2% of wave 3; waves 2 and 4 tend to alternate in form (sharp vs sideways); wave 3 often extends to about 1.618 × wave 1; if wave 3 extends, wave 5 often roughly equals wave 1; in a zigzag, C often equals A.

**Corrective families:** zigzag (5-3-5), flat (3-3-5), triangle (3-3-3-3-3) and combinations.

### Gann (W. D. Gann)
- **Angles**: lines from a pivot at fixed price/time ratios — 1x1 (one unit of price per unit of time), 2x1, 1x2 and so on.
- **Square of Nine**: a spiral of numbers; levels are produced by adding steps to the square root of price.
- **Time cycles**: anniversaries and counts of 90, 144, 180 and 360 days or bars from major pivots.

### Harmonic patterns (Gartley; ratios standardised by Scott Carney)
Five points X-A-B-C-D, with D the "potential reversal zone". Ratios as commonly given (authors differ):
| Pattern | B (of XA) | D (of XA) | BC projection to D |
|---|---|---|---|
| Gartley | 0.618 | 0.786 | 1.272–1.618 |
| Bat | 0.382–0.50 | 0.886 | 1.618–2.618 |
| Butterfly | 0.786 | 1.27–1.618 | 1.618–2.618 |
| Crab | 0.382–0.618 | 1.618 | 2.24–3.618 |

For all, C usually retraces 0.382–0.886 of AB. **AB=CD**: C retraces 0.618–0.786 of AB and CD equals AB in length (or 1.272/1.618 × AB). See [[link:l2-fib-pivots]] for the Fibonacci tools themselves.` },
      { h: 'Advanced view', md: `### Why they are classed as subjective
- **Many valid counts.** The hard rules only exclude a few labellings. On any intraday chart, several Elliott counts satisfy all three rules; practitioners routinely publish a "preferred" and an "alternate" count. If the market follows either, the method is said to have worked.
- **Hindsight fitting.** Waves, angles and XABCD points are chosen *after* the pivots are visible. Pivots are only confirmed with lag, so a live trader faces many candidate patterns, most of which never complete.
- **Ratio tolerance.** With ranges like 0.382–0.886 and several patterns, a large share of random swing sequences will match *something*.
- **Non-falsifiability.** If a forecast fails, the count is relabelled ("wave 4 is becoming a triangle"). A claim that can absorb any outcome makes no testable prediction.
- **Scale dependence (Gann angles).** "One unit of price per unit of time" depends on what you call a unit. Change chart scale and the 1x1 line moves. The geometry is real; its market meaning is a choice.

### What is and is not mathematically meaningful
The arithmetic is exact: Fibonacci ratios, square roots and day counts are well-defined. What is **not** established is that markets respect those numbers more than any other numbers. Prices pass through every level in their range, so a dense grid of "special" levels will always contain hits.

### What limited research exists
Academic work has mostly tested *simple* technical rules (moving averages, breakouts) with careful controls for data snooping — for example Sullivan, Timmermann and White (1999). Lo, Mamaysky and Wang (2000) showed how to define chart patterns algorithmically so they can be tested at all. Elliott, Gann and harmonic methods are rarely tested this way because they are rarely written as unambiguous rules. Absence of tests is not evidence of an edge.` },
      { h: 'The maths', md: `### Square of Nine around Nifty 25,800
:::formula
Level = (√P ± step)²     step 0.5 = "90°", 1 = "180°", 2 = "360°"
√25,800 = 160.62
+0.5 → 160.62 + 0.5 = 161.12, squared ≈ 25,960.9
−0.5 → 160.12, squared ≈ 25,639.6
+1   → 26,122.2      +2 → 26,446.5
:::

The 90° levels sit about 160 points (0.62%) either side. Add 45° steps (0.25) and you get a level every 80 points or so. Nifty's intraday range is often larger than that, so price will "respect" or "break" some Gann level most days by construction.

### Harmonic arithmetic
X = 25,500, A = 25,900 (XA = 400). A Gartley needs B ≈ 25,900 − 0.618 × 400 = 25,652.8 and D ≈ 25,900 − 0.786 × 400 = **25,585.6**. A Bat would put D at 25,900 − 0.886 × 400 = 25,545.6. Two patterns, two zones 40 points apart, both "valid" until price decides.` },
      { h: 'India', md: `> [!india] Elliott and Gann are extremely popular in Indian retail trading communities and on financial TV, often with confident Nifty or Bank Nifty targets. Treat any such call as a hypothesis. Ask: what would make this count wrong, at what price, by when? If the analyst cannot answer, the forecast cannot be scored. Note also that SEBI requires those giving investment advice or research for a fee to be registered (verify on sebi.gov.in).

Practical test idea on Nifty 5-minute data: define a Bat completion objectively (pivot rule N = 3, ratio tolerance ±3%, D at 0.886 XA), go long at D with a stop beyond X and an exit at 0.382 of AD — then evaluate only on data you did not use to choose those numbers.` },
      { h: 'US & global', md: `> [!us] Elliott Wave is widely followed in US and global markets, popularised by Frost and Prechter's book and their forecasting service. Harmonics are common in FX and crypto communities. The same test discipline applies to SPY, EUR/USD or BTC: a published count is only useful if it names an invalidation level in advance.` },
      { h: 'Common misconceptions', md: `- **"It worked on this chart, so it works."** One chosen example is anecdote; selection is the problem.
- **"Fibonacci appears in nature, so it governs markets."** Sunflowers are not order books. The argument is an analogy, not evidence.
- **"Wrong counts are the trader's fault, not the method's."** If no rule set can be stated that produces the right count in real time, the method cannot be separated from the trader.
- **"Subjective means useless."** Some traders use these tools as a structured way to set stops and targets. That can be fine, provided the edge is tested rather than assumed.` },
      { h: 'When it fails', md: `Realistic losing example: an analyst counts Nifty in wave 3 and expects 1.618 × wave 1 = 26,300 from 25,800. You buy at 25,850 with a stop at the wave 2 low of 25,700. Price stalls at 25,920, then drops to 25,690: the count is relabelled as an ABC correction completed at 25,920. Your loss is 160 points × 65 = ₹10,400 plus charges. The method survives; your account does not. The failure condition is built in: a non-falsifiable forecast never "fails", only traders do.` },
      { h: 'How to test such claims', md: `1. **Pre-register** the rules in writing before looking at test data: pivot definition, ratios and tolerances, entry, stop, exit, costs. No edits after you see results.
2. **Split the data**: develop on one period, then test unchanged on later, unseen sessions. Use the Quant Lab (Quantitative Research) tabs **Out-of-sample** and **Walk-forward**.
3. **Random-entry benchmark**: open the **Overfitting test** tab. It compares your strategy with 300 strategies that share exits, sizing, costs and trade count but enter on random bars. If your p-value is not small (say under 0.05), the pattern adds nothing measurable beyond the exit rule and luck.
4. **Count your trials**: every ratio tolerance you tried is another test; see [[link:l3-biases]].
5. Include realistic charges and slippage; many "edges" are smaller than costs.` },
      { h: 'Exercise', md: `Write down one Gartley rule set with exact numbers. Run it (or its closest proxy) in the Quant Lab Backtester on synthetic NIFTY sessions, then run the **Overfitting test** and record p. Now change one tolerance and rerun. Note in your Journal how much the result moves — that sensitivity is itself evidence about robustness.` },
    ],
    check: [
      { q: 'Wave 1 runs 25,400 to 25,600. Which wave 2 low breaks a hard Elliott rule?', o: ['25,480', '25,520', '25,380', '25,410'], a: 2, why: 'Wave 2 may not retrace beyond the start of wave 1 (25,400). 25,380 does; the others are deep but legal.' },
      { q: 'Why does a Square of Nine level being "hit" during the day provide weak evidence?', o: ['The arithmetic is wrong', 'Levels are spaced closely relative to the daily range, so hits occur by construction', 'Gann is banned by SEBI', 'Square roots are not defined for index levels'], a: 1, why: 'At 25,800 the 90-degree steps are about 160 points apart; with smaller steps a hit is near certain. A test must compare against random levels.' },
      { q: 'Which result in the Overfitting test tab supports a harmonic entry rule adding value?', o: ['High in-sample profit', 'A small p-value versus random entries with identical exits and costs, confirmed out of sample', 'A pattern that matches many charts', 'A pattern endorsed by a famous author'], a: 1, why: 'The random-entry benchmark isolates the entry; out-of-sample confirmation guards against fitting.' },
      { q: 'XA = 400 points from 25,500 to 25,900. Where is a Bat D point?', o: ['25,585.6', '25,545.6', '25,652.8', '25,747.2'], a: 1, why: 'D = 25,900 − 0.886 × 400 = 25,545.6. 25,585.6 is the Gartley 0.786 level.' },
    ],
    refs: ['A. J. Frost and Robert Prechter — Elliott Wave Principle (book)', 'R. N. Elliott — The Wave Principle (1938)', 'W. D. Gann — How to Make Profits in Commodities (book)', 'Scott M. Carney — Harmonic Trading, Volume One (book)', 'Sullivan, Timmermann and White — Data-Snooping, Technical Trading Rule Performance, and the Bootstrap, Journal of Finance (1999)', 'Lo, Mamaysky and Wang — Foundations of Technical Analysis, Journal of Finance (2000)', 'Bailey, Borwein, López de Prado and Zhu — The Probability of Backtest Overfitting, Journal of Computational Finance (2017)'],
  },
  /* ===================== L4-M1 Scalping ===================== */
  {
    id: 'l4-scalping', module: 'L4-M1', level: 4, track: 'strategy', title: 'Scalping and momentum day-trading in practice: costs, speed and survival', mins: 24,
    summary: 'Compute the cost of a scalp and the break-even win rate it implies, judge whether retail speed and queue position allow an edge, and decide when not to scalp.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `**Scalping** means taking many small, quick trades — seconds to a few minutes — aiming for a few ticks or points each. **Momentum day-trading** is its slightly slower cousin: jumping on a fast move (a breakout, a news spike) and riding it for minutes.

The appeal is obvious: small risk per trade, lots of action, quick feedback. The trap is just as obvious once you do the arithmetic: **every trade pays costs**, and when your target is small, costs eat a large share of it. A shopkeeper who sells items at ₹10 profit each but pays ₹8 in fees per sale must be right almost every time.

> [!evidence] **Mixed.** Short-horizon trading can be profitable for participants with a real cost and speed advantage (market makers, co-located firms). For retail traders, research on day traders — for example Barber, Lee, Liu and Odean's work on Taiwanese day traders, and SEBI's studies of individual F&O and intraday cash traders (2023, 2024) — finds that most lose money after costs. Some individuals persist, but they are a small minority.` },
      { h: 'Intermediate view', md: `### Order types for fast trading
| Order | Use | Risk |
|---|---|---|
| Market | Get filled now | Pays the spread plus slippage |
| Limit | Control price, sometimes earn spread | May not fill, or fills only when price runs through you |
| Stop-market (SL-M) | Exit on a break | Fills at whatever is available in a fast move |
| Stop-limit (SL) | Exit with a price cap | May not fill at all in a gap |

### Latency and queue position
Your order goes from your app to the broker, through risk checks, to the exchange. Retail round-trip latency is typically far slower than co-located firms. That matters because limit orders at the same price fill in **time priority**: by the time you join the bid, there may be lakhs of units ahead of you. You tend to get filled when the market is about to go through your price — **adverse selection** ([[link:l4-depth]], [[link:l4-execution]]).

### Slippage
Market entries and stop exits typically cost at least a tick against you in fast markets, often more. On a 4-point target, one tick each side can be a meaningful fraction.

### Momentum entries
- Trade only the clearest moves: opening-range breaks with volume, VWAP reclaims, news spikes after the first minute.
- Pre-define the exit: a fixed number of ticks, or the first bar that closes against you.
- Size so a run of losses is survivable; scalpers have long losing streaks because they take so many trades.` },
      { h: 'Advanced view', md: `### Where scalping edges come from
Professional scalpers usually earn from one or more of: **spread capture** (market making with rebates and low fees), **speed** (reacting to order-book changes first), **information** (correlated instruments), or **inventory risk-taking**. A retail trader on a phone app rarely has any of these. A retail edge, if it exists, is more likely in *selectivity* — trading only a few high-quality moments — than in frequency.

### When not to scalp
- When the break-even move is a large share of the typical 1-minute range.
- In the minutes around scheduled news (RBI, US CPI, FOMC), when spreads widen and stops slip.
- During the lunch drift, when ranges shrink below costs.
- After two or three consecutive losses, when tilt rises — set a daily loss limit and a maximum trade count.
- In illiquid strikes or stocks, where your order moves the price.

### Psychological load and overtrading
Scalping concentrates hundreds of decisions into a few hours. Fatigue, revenge trades and "just one more" are the main failure modes. Overtrading converts a small negative expectancy into a large loss quickly, because costs scale with trade count.

### India: algo rules
SEBI has issued a framework for retail participation in algorithmic trading through brokers (API access, registration of algorithms, order-rate thresholds). Implementation dates have been revised — **verify the current status on sebi.gov.in and with your broker** before automating anything.` },
      { h: 'The maths', md: `:::formula
Break-even move (points) = round-trip charges ÷ quantity
Break-even win rate = net loss ÷ (net win + net loss)
:::

All figures below are from the app's engine (IA.risk.indiaCharges, specs as of Nov 2026; ₹20/order brokerage assumed — edit to your broker).

### Nifty futures, 1 lot (65) at 25,800
Round trip at the same price: brokerage ₹40, STT ₹838.50 (0.05% of sell), NSE txn ₹61.38 (₹183/crore), SEBI ₹3.35, stamp ₹33.54, GST ₹18.85 — **total ₹995.62**. Break-even move = 995.62 ÷ 65 = **15.32 points**. At a 0.10 tick (Nifty level ≤ 30,000), that is about 153 ticks.

| Target / stop | Net win | Net loss | Break-even win rate |
|---|---|---|---|
| 20 / 20 points | ₹303.70 | ₹2,294.94 | 88.3% |
| 40 / 20 points | ₹1,603.02 | ₹2,294.94 | 58.9% |

A 20-point futures scalp needs to win nearly 9 times in 10 just to break even. Ten futures round trips a day cost about ₹9,956.

### Nifty option, 1 lot, premium ₹120
Round trip: ₹65.69 (STT 0.15% of premium on sell ₹11.70, NSE txn ₹3,553/crore, brokerage ₹40, GST). Break-even ≈ 1.01 points. With a 4-point target and 4-point stop: net win ₹193.81, net loss ₹325.19, break-even **62.7%**. At 5 lots the flat brokerage spreads out: break-even 55.4%. Add 0.10 points of slippage per side on 1 lot and break-even rises to about **65.2%**.

Use [[widget:charges-india]] and [[widget:expectancy]] to rerun with your broker's tariff.` },
      { h: 'India', md: `> [!india] Since 1 Apr 2026, futures STT is 0.05% of sell value, which makes 1-lot Nifty futures scalping for 10–20 points close to arithmetically hopeless. Option buyers pay far less per trade in rupees, but premiums move fast and spreads in far strikes are wide; and option sellers face large tail risk. Nifty weekly options expire on Tuesday (verify current expiry days on NSE). Expiry-day scalping in near-zero premiums is where many retail accounts suffer their largest losses.

Market hours: 09:15–15:30 IST. The first 15 minutes have the widest spreads; the 12:00–13:30 window often has the smallest ranges.` },
      { h: 'US & global', md: `> [!us] SPY, 200 shares at $600, scalping 10 cents: fees are about $2.47 per round trip (SEC fee on the sale; FINRA TAF paused 1 Oct–31 Dec 2026, about $2.51 from Jan 2027; $0 commission assumed). Net win $17.53, net loss $22.47: break-even 56.2%. One cent of slippage on each side lifts it to about 66.2%. In US ETFs, **slippage is the cost**, not fees. QQQ behaves similarly, with somewhat larger moves.

**Pattern day trader rule:** the SEC approved FINRA's replacement of the PDT definition and the $25,000 minimum with risk-based intraday margin standards (approved Apr 2026, effective 4 Jun 2026; firms may phase in until 20 Oct 2027). Your broker may still apply the old rule — verify with them (FINRA Regulatory Notice 26-10).` },
      { h: 'Common misconceptions', md: `- **"Small stops mean small risk."** Costs are fixed per trade; a small stop raises the cost per unit of risk.
- **"A high win rate means a good system."** An 80% win rate loses money if break-even is 88%.
- **"Faster internet makes me competitive."** Queue position and exchange proximity matter more, and retail cannot buy those.
- **"More trades, more profit."** More trades multiply expectancy — including negative expectancy.` },
      { h: 'When it fails', md: `Realistic losing day: a trader takes 12 Nifty futures scalps targeting 20 points with 20-point stops and wins 8 (67%) — a good-looking hit rate. Net result: 8 × ₹303.70 − 4 × ₹2,294.94 = ₹2,429.60 − ₹9,179.76 = **−₹6,750.16**. The chart reading was decent; the arithmetic was not. Scalping also fails when spreads widen on news, when stop orders slip several ticks, and when the trader keeps going after a daily loss limit.` },
      { h: 'Exercise', md: `1. In [[widget:charges-india]], price a 1-lot Nifty futures round trip at today's level with your broker's brokerage. Compute the break-even move.
2. In the Trading Simulator, scalp NIFTY options for 20 trades with a fixed 4-point target and stop. Log every fill including slippage in the Journal.
3. Compare your win rate with the break-even rate from step 1 or the options table. Write one sentence: is your edge larger than your costs?` },
    ],
    check: [
      { q: 'A Nifty futures round trip (1 lot) costs about ₹996. What is the approximate break-even move?', o: ['1.5 points', '15.3 points', '153 points', '0.10 points'], a: 1, why: '₹995.62 ÷ 65 units ≈ 15.32 points. 153 is the number of 0.10 ticks, not points.' },
      { q: 'Net win ₹200, net loss ₹300 per trade. What win rate breaks even?', o: ['40%', '50%', '60%', '67%'], a: 2, why: '300 ÷ (200 + 300) = 60%.' },
      { q: 'Why does a retail limit order at the best bid often fill just before the price drops?', o: ['Brokers delay orders deliberately', 'Time priority puts you behind earlier orders; you fill when sellers overwhelm the queue — adverse selection', 'Exchanges favour market orders', 'Limit orders always fill last'], a: 1, why: 'Fills at the back of the queue tend to occur when the level is being taken out, which is adverse to the buyer.' },
      { q: 'Under the old US PDT rule, what triggered restrictions in a margin account under $25,000?', o: ['Any options trade', 'Four or more day trades within five business days', 'Holding overnight', 'Trading pre-market'], a: 1, why: 'That was the pattern-day-trader definition; it is being replaced (effective 4 Jun 2026, phase-in to 20 Oct 2027), but brokers may still apply it.' },
    ],
    refs: ['Larry Harris — Trading and Exchanges: Market Microstructure for Practitioners (book)', 'Bob Volman — Forex Price Action Scalping (book)', 'Barber, Lee, Liu and Odean — The cross-section of speculator skill: Evidence from day trading, Journal of Financial Markets (2014)', 'SEBI — Analysis of profit and loss of individual traders dealing in equity F&O (sebi.gov.in, 2023 and 2024)', 'NSE — Transaction charges circulars (nseindia.com)', 'FINRA — Regulatory Notice 26-10 (finra.org)'],
  }
  );
  IA.content.questions.push(
  /* L2-M1 extra */
  { id: 'L2-M1-p2q01', module: 'L2-M1', d: 1, q: 'In price action reading, what should you assess before judging a single bar?', o: ['The bar colour', 'Context: trend or range, location versus levels, and VWAP side', 'The RSI value', 'The broker margin'], a: 1, why: 'The same bar means different things in different contexts, so context comes first.' },
  { id: 'L2-M1-p2q02', module: 'L2-M1', d: 2, q: 'Leg 1: 25,500 to 25,650. Two-legged pullback ends at 25,590. Measured-move target?', o: ['25,800', '25,650', '25,740', '25,710'], a: 2, why: '150-point leg added to 25,590 = 25,740.' },
  { id: 'L2-M1-p2q03', module: 'L2-M1', d: 2, q: 'Price pokes above the prior day high, then the bar closes back inside the range on low volume. What is this called and who is trapped?', o: ['A failed breakout; breakout buyers are trapped', 'A measured move; sellers are trapped', 'A gap; nobody is trapped', 'A second entry long; short sellers are trapped'], a: 0, why: 'A break that cannot hold leaves those who bought the break holding losing positions; their stops can fuel the reverse move.' },
  { id: 'L2-M1-p2q04', module: 'L2-M1', d: 3, q: 'Nifty futures long 1 lot: target nets ₹6,000, stop nets −₹2,000 after charges. What win rate breaks even?', o: ['33%', '20%', '25%', '50%'], a: 2, why: '2,000 ÷ (6,000 + 2,000) = 25%.' },
  { id: 'L2-M1-p2q05', module: 'L2-M1', d: 2, q: 'Why is price action labelled subjective in this app?', o: ['It never works', 'There is no single agreed definition, so readers disagree and the method cannot be tested as a whole — only written rules can', 'SEBI classifies it so', 'It uses no data'], a: 1, why: 'Subjective means interpretation varies; written rules derived from it can still be tested.' },
  /* L2-M3 extra */
  { id: 'L2-M3-p2q01', module: 'L2-M3', d: 1, q: 'Which is a hard Elliott Wave rule rather than a guideline?', o: ['Wave 2 retraces 61.8%', 'Wave 3 is never the shortest of waves 1, 3 and 5', 'Waves 2 and 4 alternate', 'Wave C equals wave A'], a: 1, why: 'Only three rules are absolute: wave 2 within wave 1, wave 3 not shortest, wave 4 not overlapping wave 1. The rest are guidelines.' },
  { id: 'L2-M3-p2q02', module: 'L2-M3', d: 2, q: 'Wave 1: 25,000 to 25,300. Wave 3 tops at 25,900 after a wave 2 low of 25,150. Wave 4 falls to 25,280. What is the Elliott verdict?', o: ['Valid impulse', 'Invalid as an impulse: wave 4 entered wave 1 territory (below 25,300)', 'Invalid: wave 3 is shortest', 'Invalid: wave 2 too deep'], a: 1, why: 'Wave 4 at 25,280 overlaps wave 1 top at 25,300, breaking rule 3 (outside diagonals).' },
  { id: 'L2-M3-p2q03', module: 'L2-M3', d: 3, q: '√25,800 ≈ 160.62. What is the Square of Nine "180 degree" level above it?', o: ['About 25,960.9', 'About 26,122.2', 'About 26,446.5', 'About 25,980.0'], a: 1, why: '180 degrees = +1 on the root: 161.62 squared ≈ 26,122.2. +0.5 gives 25,960.9; +2 gives 26,446.5.' },
  { id: 'L2-M3-p2q04', module: 'L2-M3', d: 2, q: 'Which D ratio of XA defines a Crab?', o: ['0.786', '0.886', '1.618', '1.27'], a: 2, why: 'Crab D is the 1.618 extension of XA; 0.786 is Gartley, 0.886 Bat, 1.27 Butterfly.' },
  { id: 'L2-M3-p2q05', module: 'L2-M3', d: 3, q: 'You want to test whether harmonic Bat entries add value. Which design is soundest?', o: ['Pick the 20 best-looking Bats from last year', 'Pre-register rules, test unchanged on unseen sessions with costs, and compare with a random-entry benchmark using the same exits', 'Ask a harmonic forum', 'Optimise tolerances until profit is highest'], a: 1, why: 'Pre-registration, out-of-sample data and a random-entry baseline (the Overfitting test tab) isolate any genuine entry edge.' },
  /* L4-M1 extra */
  { id: 'L4-M1-p2q01', module: 'L4-M1', d: 2, q: 'Futures STT from 1 Apr 2026 is 0.05% on sell. Nifty 1 lot (65) sold at 25,800. STT amount?', o: ['₹83.85', '₹838.50', '₹8,385', '₹419.25'], a: 1, why: '25,800 × 65 = ₹16,77,000; × 0.0005 = ₹838.50.' },
  { id: 'L4-M1-p2q02', module: 'L4-M1', d: 3, q: 'A scalper wins 8 of 12 trades: net win ₹303.70, net loss ₹2,294.94. Day result?', o: ['+₹2,429.60', '−₹6,750.16', '−₹2,294.94', '+₹6,750.16'], a: 1, why: '8 × 303.70 − 4 × 2,294.94 = 2,429.60 − 9,179.76 = −₹6,750.16.' },
  { id: 'L4-M1-p2q03', module: 'L4-M1', d: 2, q: 'What is the NSE index futures tick size with Nifty near 25,800 under the level-based rule?', o: ['0.05', '0.20', '0.10', '1.00'], a: 2, why: 'Levels up to 15,000 tick 0.05, up to 30,000 tick 0.10, above that 0.20 (verify on NSE; reviewed monthly).' },
  { id: 'L4-M1-p2q04', module: 'L4-M1', d: 2, q: 'Which is the best reason NOT to scalp at a given moment?', o: ['The 1-minute range is barely larger than your break-even move', 'Volume is high', 'Price is trending', 'It is 10:00 IST'], a: 0, why: 'If typical moves barely exceed costs, there is no room for an edge after slippage.' },
  { id: 'L4-M1-p2q05', module: 'L4-M1', d: 2, q: 'For SPY scalps under $0 commission, what is usually the largest cost?', o: ['SEC fee', 'Stamp duty', 'Slippage and spread', 'GST'], a: 2, why: 'Fees are about $2.47 on 200 shares at $600; one cent of slippage per side costs $4 and lifts break-even from about 56% to about 66%.' },
  { id: 'L4-M1-p2q06', module: 'L4-M1', d: 1, q: 'What is the status of the US PDT rule as of Nov 2026?', o: ['Unchanged', 'Being replaced by risk-based intraday margin standards (effective 4 Jun 2026, phase-in to 20 Oct 2027) — broker-dependent', 'Raised to $50,000', 'Applies only to options'], a: 1, why: 'SEC approved the FINRA change in Apr 2026; brokers implement on their own timelines within the phase-in window.' }
  );
})(typeof window !== 'undefined' ? window : globalThis);
