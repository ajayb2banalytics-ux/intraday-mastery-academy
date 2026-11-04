/* Level 3 lessons, part B: modules L3-M4 (institutional frameworks), L3-M5 (fundamentals & macro),
   L3-M6 (backtesting & validation), L3-M7 (professional risk management) + module question banks. */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  IA.content.lessons = IA.content.lessons || []; IA.content.questions = IA.content.questions || [];

  IA.content.lessons.push(
  /* ===================== L3-M4 Institutional frameworks — evidence-labelled ===================== */
  {
    id: 'l3-microstructure-liquidity', module: 'L3-M4', level: 3, track: 'ta', title: 'Liquidity, stops and price discovery', mins: 20,
    summary: 'Explain where resting liquidity and stop orders tend to cluster, how that shapes short-term price movement, and how to place your own stops so they are not sitting in the obvious crowd.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Every trade needs two sides. When you buy 500 shares of a stock at market, someone has to sell them to you. The orders waiting in the order book — limit orders to buy below the price and to sell above it — are **liquidity**. When there is a lot of it, large orders can trade without moving the price much. When it is thin, even a modest order pushes the price several ticks.

A **stop-loss** is a dormant order. It sits off the book (or as a trigger at the broker or exchange) and, once price touches its level, it becomes a market or limit order. A sell stop under a support level becomes a *sell* order exactly when price is already falling. That is why breaks of obvious levels often move faster than the approach to them: dormant orders wake up and add fuel.

Think of a queue of people at a narrow door. Nothing happens for a while, then the door opens and everyone pushes through at once. Obvious levels — yesterday's low, a round number like Nifty 24,000, the opening-range high — are narrow doors.

> [!evidence] Established: order-book liquidity, order-flow price impact and the clustering of orders at round numbers are standard, well-documented market-microstructure ideas (see Harris; O'Hara; Osler's work on stop-loss clustering in currency markets). What is *not* established is any claim that a particular player "hunted" a particular stop.

Why it matters to you: if your stop sits exactly where everybody else's sits, you will be filled at the worst moment, often with slippage, and frequently just before price reverses.` },
      { h: 'Intermediate view', md: `### Where liquidity clusters
- **Prior swing highs and lows** on the timeframe most traders watch (5-min and 15-min intraday; daily for swing traders).
- **Previous day high/low and close (PDH, PDL, PDC)**, and the opening-range high/low.
- **Round numbers**: Nifty 24,000 / 24,500, Bank Nifty 52,000, a stock at ₹1,000 or ₹2,500, SPY 600.
- **Equal highs or equal lows**: two or three touches at almost the same price advertise a level to everyone.
- **Option strikes with large open interest**, around which hedging flows can concentrate (a mixed, context-dependent effect).

### What happens at the level
When price approaches a cluster of sell stops below support, three things can follow:
1. **Clean break** — stops trigger, sellers dominate, price keeps going. The level was genuinely defended only by stops.
2. **Sweep and reverse** — stops trigger, a burst of selling hits the book, but larger resting buy orders absorb it. Price prints a long lower wick and returns above the level within a few bars.
3. **Absorption without a break** — price stalls just above the level; volume is high but range is small.

[[chart:BANKNIFTY:311:vwap,vol]]

On the chart, look for a bar that pierces a well-known low with a volume spike, then closes back above it. That is a *sweep*. It tells you that liquidity was available below the level. It does not tell you who supplied it or why.

### Placing your own stop
- Do not put the stop exactly on the obvious level. Put it where your **trade idea is wrong**, which is usually beyond the level *plus a buffer* — for example 0.3–0.5 × ATR(14) on the entry timeframe.
- If the logical stop is too far for your risk budget, **reduce size**; do not tighten the stop into the crowd.
- Prefer stop-limit orders only where gaps are unlikely; in fast markets a stop-limit can be skipped entirely and leave you unprotected.` },
      { h: 'Advanced view', md: `**Price discovery** is the process by which trading incorporates information into price. Microstructure models (Kyle; Glosten–Milgrom) describe informed and uninformed traders, and market makers who widen spreads when they fear trading against better information. Two practical consequences:

- **Spreads and depth change through the day.** In Indian cash and futures the first 15 minutes and the final 30 minutes are typically the most active; the post-lunch period is often thinner. Your slippage on a stop depends on *when* it triggers.
- **Price impact is roughly concave in size.** Doubling an order generally less than doubles its impact, but impact rises sharply when you exceed what is resting near the touch. A stop cluster is, in effect, a large market order arriving all at once.

Professionals think about **liquidity as a cost**, not a signal. A desk that needs to buy a large quantity may prefer to buy *into* a wave of stop-driven selling because the counterparty liquidity is there. That is a reasonable execution tactic and it is one plausible reason why sweeps reverse. But many other explanations fit the same bar: short covering by intraday traders, algorithmic mean-reversion, an option dealer's hedge, or plain randomness. A wick is consistent with all of them.

> [!warn] Terminology is not proof. Calling a wick a "liquidity grab by smart money" adds a story, not information. Unless you can see the participants (you cannot, on a retail feed), treat it as "stops were triggered and the move did not continue".

**Measuring it rather than narrating it.** If you think sweeps of the previous day low tend to reverse on a given instrument, that is a testable hypothesis: define the sweep (pierces PDL by at least X points, closes back above within N bars), define the entry, stop and exit, and test across hundreds of instances. See [[link:l3-hypothesis]].` },
      { h: 'The maths', md: `A rough slippage budget for a stop order:

:::formula
Expected stop slippage ≈ half-spread + impact + gap risk
Impact ≈ k × σ × √(order size ÷ volume traded over the same horizon)
:::

Here σ is volatility over the same horizon as the volume (e.g. daily σ with daily volume). The square-root form is a widely used empirical approximation, not a law; treat k as something you estimate from your own fills.

**Worked example.** You short 3 lots of Nifty futures (65 × 3 = 195 units) with the stop at 24,152, just above an obvious equal-high at 24,140. In your journal, stops at that time of day have slipped 4 points on average, with occasional 12-point fills on news. Planned risk was 24,152 − 24,110 = 42 points × 195 = ₹8,190. Realistic risk is (42 + 4) × 195 = ₹8,970 on a normal day and (42 + 12) × 195 = ₹10,530 on a bad one. If your per-trade risk cap is ₹9,000, you are fine on average but over budget on the tail — so either trim to 2 lots or accept that the cap will occasionally be breached and account for it.` },
      { h: 'India', md: `> [!india] NSE runs a continuous limit order book with price-time priority. Stop-loss orders (SL and SL-M) are accepted for equities; SEBI and exchanges have restricted market-type orders in some segments at times, and brokers may convert or block SL-M for options. Verify current order-type availability with your broker and on nseindia.com (as of Nov 2026).

Typical clusters in Indian intraday trading: the 09:15–09:30 opening-range high/low, the previous day's high/low, round Nifty hundreds, and the prior day's VWAP. Bank Nifty futures (lot 30) move fast through such levels. Stocks in the F&O segment usually have deep books; small-caps near circuit limits do not, and a stop there may simply not fill until the circuit opens.` },
      { h: 'US & global', md: `> [!us] US equities trade across many venues under Reg NMS; the visible top of book is consolidated, but a large share of volume is off-exchange and hidden. Stops are mostly held by brokers rather than exchanges and become market orders when triggered.

Clusters appear at the same kinds of places — prior day high/low, the opening range, round numbers (SPY 600, NVDA 150). In FX, research on currency dealers found stop and take-profit orders concentrating near round numbers, with stop-loss orders associated with faster moves once triggered. That is one of the better-documented findings in this area.` },
      { h: 'Common misconceptions', md: `- **"The market maker can see my stop and is coming for it."** In an exchange order book, untriggered stops (held by your broker, or in the exchange's separate stop-loss book on NSE) are not shown in market depth to other participants. Price reaches obvious levels because obvious levels are where many people have orders, not because your order is targeted.
- **"Every wick through a level is a stop hunt."** Most wicks are noise. Without a defined, tested rule you are pattern-matching after the fact.
- **"Put the stop just a few ticks beyond the level and you are safe."** A few ticks is often inside the normal sweep range. Use a volatility buffer.
- **"Liquidity zones are a strategy."** They describe *where* things might happen; they do not tell you *which* outcome will occur.` },
      { h: 'When it fails', md: `The sweep-and-reverse idea fails whenever the level breaks for real. Trend days, news-driven moves and expiry-day flows often run straight through clusters with no reversal.

**Losing example.** A large-cap NSE stock has equal lows at ₹1,445 from the morning. At 13:40 price drops to ₹1,442 with a volume spike and a lower wick, closing the 5-min bar at ₹1,446. You buy at ₹1,446.50 with a stop at ₹1,439.50, expecting a sweep reversal. Ten minutes later a sector-wide sell-off following a regulatory headline pushes price to ₹1,434; your stop fills at ₹1,437.50 after slippage. Loss: (1,446.50 − 1,437.50) × 500 shares = ₹4,500 plus costs. The "sweep" was simply the first leg of a genuine break.` },
      { h: 'Exercise', md: `1. Open the Chart Lab with Bank Nifty and mark the previous day's high and low and the opening range.
2. Scroll through 30 sessions. For each touch of those levels, record: broke and continued, swept and reversed (closed back inside within 3 bars), or stalled. Count each outcome.
3. In the [[widget:position-size]] calculator, size a hypothetical trade twice — once with a stop at the level and once with a stop one-half ATR beyond it — keeping the rupee risk constant. Note the quantity difference.
4. Journal entry: write one sentence describing a sweep *without* using the words "smart money", "institutions" or "hunt".` },
    ],
    check: [
      { q: "Price pierces yesterday's low by 15 points on a volume spike and closes back above it within two bars. What can you reasonably conclude?", o: ["Liquidity (including triggered stops) was available below the level and the move did not continue in that instance","Institutions accumulated at that low","The low is now guaranteed support for the day","A market maker deliberately targeted retail stops"], a: 0, why: "The bar shows that orders were filled below the level and price recovered. It does not identify who traded, and it guarantees nothing about later behaviour." },
      { q: "Your logical stop is 60 points away but your risk budget only fits a 30-point stop at your normal size. What is the professional adjustment?", o: ["Move the stop to 30 points","Skip the stop and use a mental stop","Halve the position size and keep the stop where the idea is invalid","Double the size to recover faster"], a: 2, why: "Stops belong where the trade idea is wrong; size is the variable you adjust to fit risk. Tightening into obvious clusters raises the chance of being swept." },
      { q: "Why do stop orders tend to accelerate a break of an obvious level?", o: ["They are hidden limit orders that add liquidity","Exchanges widen circuit limits when stops trigger","They cancel resting orders on the opposite side","They convert into market orders in the direction of the move at the moment price is already moving that way"], a: 3, why: "A triggered sell stop becomes a sell order just as price falls, adding demand for liquidity in the same direction." },
    ],
    refs: ['Larry Harris — Trading and Exchanges: Market Microstructure for Practitioners (book)', "Maureen O'Hara — Market Microstructure Theory (book)", 'Carol Osler — Currency Orders and Exchange-Rate Dynamics: An Explanation for the Predictive Success of Technical Analysis (Journal of Finance, 2003)', 'Albert Kyle — Continuous Auctions and Insider Trading (Econometrica, 1985)', 'NSE — Trading system and order types (nseindia.com)'],
  },
  {
    id: 'l3-smc', module: 'L3-M4', level: 3, track: 'ta', title: 'Smart Money Concepts: BOS, CHoCH, order blocks, FVGs', mins: 22,
    summary: 'Identify break of structure, change of character, order blocks, fair value gaps and inducement on a chart, and explain precisely which parts are mechanical definitions and which are untested interpretation.',
    evidence: 'subjective',
    sections: [
      { h: 'Beginner view', md: `**Smart Money Concepts (SMC)** is a popular online vocabulary for describing price action. It grew largely out of retail trading education in the 2010s (much of the vocabulary is commonly traced to the online educator known as "ICT"; there is no single authoritative textbook or standard definition set), drawing on older ideas about supply and demand zones and market structure. It claims to show where "smart money" (banks, funds) placed orders.

> [!evidence] Subjective framework. SMC terms can be defined mechanically, but there is no robust independent evidence that order blocks, fair value gaps or inducement identify institutional orders or produce an edge after costs. Treat SMC as a *descriptive language* for swings and imbalances, not as a window into who is trading.

Why learn it at all? Because many traders around you use it, it gives you a precise way to describe swings and gaps, and some of its ideas overlap with genuine microstructure concepts (liquidity at swing points, imbalance). The danger is believing the story behind the labels.

An analogy: SMC is like naming clouds. "Cumulonimbus" is a useful, consistent label. It does not tell you that someone *put* the cloud there.` },
      { h: 'Intermediate view', md: `### Market structure
- **Swing high / swing low**: a bar whose high (low) is higher (lower) than the N bars either side. Choose N (e.g. 2 or 3) and keep it fixed — this is the most important step for making SMC testable.
- **Break of Structure (BOS)**: in an uptrend, a close above the most recent swing high. It signals continuation.
- **Change of Character (CHoCH)**: in an uptrend, the first close below the most recent *higher low*. It is the first hint the sequence has changed.

### Order block (OB)
Usually defined as the last opposite-coloured candle before an impulsive move that causes a BOS. A bullish OB is the last down candle before a strong rally. The zone is that candle's range (some use body only). The claim is that price will return to the zone and react.

### Fair value gap (FVG)
A three-candle pattern: in a bullish FVG, candle 3's low is above candle 1's high, leaving a gap that candle 2 (a large bar) skipped over. In conventional terms this is simply an **imbalance** — a fast move where little trading took place at those prices. The claim is that price tends to come back to "fill" it.

### Inducement
A minor swing point just before an OB, said to "lure" early traders whose stops are then taken before the real move. Mechanically it is a small internal swing inside a pullback.

[[chart:NIFTY:207:ema20,vol]]

### A typical SMC long, described mechanically
1. 15-min: higher highs and higher lows; latest BOS confirmed by a close above the prior swing high.
2. Mark the last down candle before that impulse (the OB) and any FVG inside the impulse.
3. Wait for price to pull back into the OB/FVG overlap on the 5-min.
4. Enter on a 5-min CHoCH back up; stop below the OB low plus a buffer; target the next swing high or 2R.` },
      { h: 'Advanced view', md: `### What is actually established underneath
- **Swing structure** (higher highs/lows) is just a way of describing trend. Momentum and trend effects have mixed but real academic support at some horizons; that support does not transfer to the labels.
- **Liquidity at swing points** is consistent with stop clustering ([[link:l3-microstructure-liquidity]]).
- **Imbalance** is real in the trivial sense that fast moves leave prices with little volume. Whether such prices are revisited more than chance predicts is an empirical question for each market and timeframe. Note that almost any level is revisited eventually, which makes "the gap got filled" a weak test.

### Why SMC is hard to falsify
- **Discretion in definitions**: which candle is "the" OB? Body or wick? Which timeframe? With enough degrees of freedom, every reversal has an OB behind it in hindsight.
- **Narrative escape hatches**: if price ignores an OB, it was "mitigated", "a breaker" or "inducement". A framework that explains every outcome predicts none.
- **Selection bias in teaching material**: examples are chosen after the fact.

### How a professional would use it
Strip it to rules, then test. For example: "On Nifty 5-min, after a BOS with a swing parameter of 3, a first touch of the last opposite candle's range, entered at the zone's midpoint with a stop 0.3 ATR beyond the far edge and a 2R target." Run it across a large sample, include costs, and compare with a control (for example, random pullback entries in the same trend). If the zone adds nothing over the control, the label is decoration.

> [!warn] Do not claim, write or believe that an order block shows where a bank bought. You cannot see participant identity on any retail feed, and SMC terminology is not proof of institutional activity.` },
      { h: 'The maths', md: `**FVG definition (bullish):**

:::formula
Bullish FVG exists at bar t if Low(t+1) > High(t−1)
Gap zone = [High(t−1), Low(t+1)]
Gap size = Low(t+1) − High(t−1)
Bearish FVG exists at bar t if High(t+1) < Low(t−1); zone = [High(t+1), Low(t−1)]
:::

Here bar t is the middle (large) bar; the gap can only be known once bar t+1 has closed, so any rule using it must act at bar t+2 or later.

**Worked example.** Nifty 5-min bars: bar 1 high 24,212; bar 2 range 24,205–24,268; bar 3 low 24,231. Low(3) 24,231 > High(1) 24,212, so the gap zone is 24,212–24,231, size 19 points. With ATR(14) on 5-min at 22 points, the gap is about 0.86 ATR — a filter some traders use is "gap ≥ 0.5 ATR".

Trade plan: limit buy at the gap midpoint 24,221.5, stop at 24,212 − 0.3 × 22 = 24,205.4, risk 16.1 points. One lot (65): risk ₹1,047. Target 2R = 24,253.7.

**Now add costs — they are not small here.** Round-trip charges on one Nifty futures lot at these prices are about ₹940 ([[widget:charges-india]], as of Nov 2026: STT alone is 0.05% of the sell value ≈ ₹790). That is about 14.4 points — roughly 0.9R on a 16-point stop. Net of charges the "2R" winner is about (32.2 − 14.4) ÷ 16.1 ≈ +1.1R and a stopped loser about (−16.1 − 14.4) ÷ 16.1 ≈ −1.9R, before any slippage. Tight structure-based stops on index futures are often dominated by costs; on options the spread adds further drag. Always compute R net of charges before judging an SMC setup.` },
      { h: 'Professional notes', md: `### Testable definitions (fix every parameter before testing)
| Term | Mechanical definition you can code | Parameters to fix |
|---|---|---|
| Swing high / low | Bar whose high (low) is strictly above (below) the N bars on each side | N; confirmed only N bars later |
| BOS (bullish) | A bar **closes** above the most recent confirmed swing high, in the direction of the current structure | Close vs wick; N |
| CHoCH (bearish, in an uptrend) | First **close** below the swing low that preceded the most recent bullish BOS (the low that "protected" the trend) | Which low counts; close vs wick |
| Displacement | A bar or run of bars whose range is at least k × ATR(14) | k (e.g. 1.5) |
| Order block (bullish) | The last down-close bar before a displacement that produces a bullish BOS; zone = that bar's high–low (or open–low) | Body or wick; maximum age in bars |
| FVG (bullish) | Low(t+1) > High(t−1) around a displacement bar t | Minimum size (e.g. ≥ 0.5 ATR) |
| Liquidity sweep (of a low) | Price trades below a marked level (prior swing low, PDL, equal lows) by at least x, then closes back above it within m bars | x (points or ATR fraction), m |
| Mitigation | First return of price into an OB or FVG zone | Touch vs trade-through |

### Two traps that silently invalidate SMC backtests
- **Swing confirmation lag.** A swing high defined with N = 3 cannot be known until three bars after it prints. If your code marks the swing on the bar itself and then trades a BOS of it, the test contains look-ahead ([[link:l3-biases]]). Charting tools that draw swings and zig-zags "repaint" in the same way.
- **Choosing the order block after the outcome.** If several candles qualify and you pick the one price later reacted to, the test is meaningless. The rule must pick exactly one zone, in real time.

### Evidence status, plainly
The definitions above are just pattern descriptions. As of Nov 2026 we know of no peer-reviewed study showing that SMC zones predict reactions better than matched control levels after costs. If you test it, report the result against a control and net of charges; most published "results" for SMC are marketing examples, not tests.` },
      { h: 'India', md: `> [!india] SMC is very widely marketed to Indian retail traders, often in the context of Nifty and Bank Nifty options. Be wary of courses that show only winning examples, sell signals or claim to reveal "operator" activity. SEBI has repeatedly cautioned investors against unregistered advisers and finfluencers offering trading tips; check registration on sebi.gov.in.

When using SMC labels on Nifty options, remember that option premiums move non-linearly and decay; an OB drawn on the underlying does not translate one-for-one into a premium level. Draw structure on the underlying or the future, and size via the option delta.` },
      { h: 'Common misconceptions', md: `- **"Order blocks are where institutions placed orders."** Unverifiable from a chart. It is the last opposite candle before a move — nothing more is visible.
- **"FVGs always fill."** Many fill because price wanders; many never fill on a trend day. Without a base rate, "always" is a feeling.
- **"SMC is different from support and resistance."** Much of it re-labels supply/demand zones and swing structure.
- **"Higher-timeframe confluence makes it reliable."** More conditions reduce trade count and can increase overfitting; they do not automatically add edge.` },
      { h: 'When it fails', md: `SMC setups fail in strong trends (pullbacks never reach the OB), in choppy ranges (BOS and CHoCH flip every hour), and around news.

**Losing example.** Bank Nifty future 15-min shows a bullish BOS at 52,480. You mark the OB at 52,310–52,360 and buy at 52,340 on a 5-min CHoCH, stop 52,280, 2 lots (60 units). Risk ₹3,600. An unexpected global risk-off move pushes through the OB; stop fills at 52,268. Loss ₹4,320 plus costs. An SMC narrative afterwards would call it a "failed OB turned breaker" — which is exactly the kind of after-the-fact relabelling that prevents learning.` },
      { h: 'Exercise', md: `1. In the Chart Lab, pick Nifty 5-min and fix a swing parameter (N = 3). Mark every BOS and CHoCH for five sessions using only that rule.
2. For each BOS, mark the order block by your written definition and record whether price returned to it within 20 bars and whether it reacted by at least 1R.
3. Do the same with *random* pullback levels (for example, the 50% retracement of the impulse). Compare the two counts.
4. Journal: write your exact OB definition. If you cannot write it without the word "obvious", it is not yet testable.` },
    ],
    check: [
      { q: "Which statement about order blocks is honest?", o: ["They mark the price at which banks entered", "They are a label for the last opposite candle before an impulse; any edge must be shown by testing a fixed definition", "They work on every timeframe because institutions trade all timeframes", "They are proven by academic microstructure research"], a: 1, why: "The label is mechanical. Claims about institutions are unverifiable, and there is no robust independent evidence of an edge." },
      { q: "Bar 1 high 512.0, bar 2 range 511–524, bar 3 low 518.5. What is the bullish FVG zone?", o: ["512.0–518.5","511.0–524.0","518.5–524.0","No FVG exists"], a: 0, why: "Bar 3 low (518.5) is above bar 1 high (512.0), so the gap is 512.0–518.5." },
      { q: "Why is \"the FVG eventually filled\" a weak confirmation of the concept?", o: ["Because gaps never fill","Because only daily gaps count","Because most prices are revisited eventually anyway, so filling needs to be compared with a base rate and a time limit","Because filling is a bearish signal"], a: 2, why: "Without a time window and a control, a high fill rate may simply reflect normal price wandering." },
    ],
    refs: ['Larry Harris — Trading and Exchanges (book)', 'Al Brooks — Trading Price Action Trends (book) — swing-structure description', 'SEBI — Investor cautions on unregistered investment advice (sebi.gov.in)', 'David Aronson — Evidence-Based Technical Analysis (book)'],
  },
  {
    id: 'l3-wyckoff', module: 'L3-M4', level: 3, track: 'ta', title: 'Wyckoff method: phases, spring and upthrust', mins: 20,
    summary: 'Describe Wyckoff accumulation and distribution schematics, identify springs and upthrusts with volume, and explain why phase labelling is subjective and mostly visible only in hindsight.',
    evidence: 'subjective',
    sections: [
      { h: 'Beginner view', md: `Richard Wyckoff was an early-twentieth-century market educator who studied how large operators of his era moved stocks. His followers turned his ideas into a framework: markets cycle through **accumulation** (a range where larger buyers absorb supply), **markup** (an uptrend), **distribution** (a range where they sell) and **markdown** (a downtrend).

The core principles are sensible and widely taught:
- **Supply and demand** drive price.
- **Cause and effect**: a longer range (cause) can precede a larger move (effect).
- **Effort versus result**: volume (effort) should match price movement (result); a mismatch is worth noticing.

> [!evidence] Subjective framework. The supply/demand logic is reasonable and the effort-versus-result idea overlaps with ordinary volume analysis, but there is no robust independent evidence that Wyckoff *phase labelling* predicts outcomes better than chance. Phases are often identifiable with confidence only after the range has resolved.

An analogy: a Wyckoff schematic is like a map of a typical football match — kick-off, midfield battle, a breakaway. Real matches resemble it loosely; you rarely know which phase you are in until afterwards.` },
      { h: 'Intermediate view', md: `### Accumulation schematic (simplified)
| Phase | Events | What you see |
|---|---|---|
| A | Preliminary support (PS), selling climax (SC), automatic rally (AR), secondary test (ST) | Downtrend stops; a wide, high-volume bar down, then a sharp bounce defines the range |
| B | Repeated tests inside range | Sideways trade; volume generally declines |
| C | **Spring** (or shakeout) | Price dips below range support, then quickly recovers inside |
| D | Sign of strength (SOS), last point of support (LPS) | Rallies on rising volume, shallow pullbacks |
| E | Markup | Price leaves the range |

Distribution mirrors it: buying climax (BC), automatic reaction, **upthrust after distribution (UTAD)** above resistance, sign of weakness (SOW), last point of supply (LPSY), markdown.

### Spring and upthrust in practice
A **spring** is a break below range support that fails: the bar closes back inside the range, ideally on volume that is not dramatically higher than the prior tests (sellers seem exhausted) — or, in the shakeout variant, on a spike with immediate recovery. An **upthrust** is the mirror above resistance.

[[chart:RELIANCE:118:vol,vp]]

**Execution (spring long):**
1. Define the range on the 15-min: at least 20 bars, two or more touches of support and resistance.
2. Spring = 5-min close back above support after trading below it.
3. Entry: on a test of the spring low that holds, or on the next bar's break of the spring bar high.
4. Stop: below the spring low plus a buffer.
5. Targets: mid-range first, range high second; a point-and-figure "cause" count is used by some for further targets.` },
      { h: 'Advanced view', md: `### Why labelling is subjective
- **Which low is the selling climax?** In a live market, a big down bar might be the SC or just another leg down. You only know after a range forms.
- **Is that dip a spring or the start of markdown?** A spring is defined by its recovery. Until price closes back inside, it is simply a breakdown.
- **Accumulation or re-distribution?** A range inside a downtrend can resolve either way. Wyckoff literature acknowledges re-accumulation and re-distribution, which adds flexibility but also reduces falsifiability.

### What is worth keeping
- **Effort versus result** is a useful question at any level: a huge-volume bar with a tiny range suggests absorption; a small-volume push to new highs suggests a lack of opposition or a lack of interest. These are observations, not proofs.
- **Ranges and failed breaks** are concrete and testable. A "spring" can be coded: break below the 20-bar low by at least 0.2 ATR, close back above within 2 bars.
- **Context**: springs at the bottom of a range in an uptrend on the higher timeframe are a different setup from springs against a strong higher-timeframe downtrend.

### Historical caution
Wyckoff wrote in an era of pools and operators, before modern securities law. Applying stories about a single "Composite Operator" to today's fragmented, regulated, algorithm-heavy markets is a metaphor. Many independent participants can produce a pattern that looks orchestrated.

> [!warn] Terminology is not proof of institutional activity. Calling a range "accumulation" asserts something about who is buying; the chart only shows that price went sideways.` },
      { h: 'The maths', md: `**Range, buffer and risk for a spring long.**

:::formula
Range support S = lowest close-based support of the range
Spring low L = lowest price of the break
Stop = L − b × ATR
Risk per share = Entry − Stop
:::

**Worked example.** A large-cap NSE stock (illustrative prices) has a 15-min range ₹1,470–₹1,505 for two sessions. A 5-min bar dips to ₹1,463 and closes at ₹1,472.50. ATR(14) on 5-min = ₹3. You buy at ₹1,474 on the next bar's break of the spring bar high. Stop = 1,463 − 0.5 × 3 = ₹1,461.50. Risk per share ₹12.50. With a ₹5,000 risk budget: 400 shares (cash, intraday). First target mid-range ₹1,487.50 (+₹13.50, about 1.1R), second target ₹1,502.50 (+₹28.50, about 2.3R). If half is taken at target 1 and the rest at target 2, average gain is about 1.7R before costs. Intraday charges on this size are roughly ₹260 round trip (about 0.05R) — check with [[widget:charges-india]].

> [!note] A Wyckoff purist would also want the spring to occur after Phase A and B events have defined the range; a coded "failed break of a 20-bar range" is a simplification that makes the idea testable, not the full method.` },
      { h: 'India', md: `> [!india] Wyckoff is popular with Indian swing and positional traders on daily charts of mid-caps. On intraday charts of large F&O stocks, many ranges are too short for a full schematic; reduce your expectations to "range, failed break, test".

Be careful with small-caps in the T2T or ASM frameworks and stocks near price bands: a "spring" into a lower circuit cannot be exited until the circuit lifts.` },
      { h: 'Common misconceptions', md: `- **"Wyckoff tells you institutions are accumulating."** It tells you price is ranging. The participant story is an interpretation.
- **"Every spring leads to markup."** Many breakdowns that recover temporarily fail again.
- **"Phase B always has falling volume."** Often, not always; and volume patterns vary by instrument and session.
- **"You can label phases in real time."** Practitioners themselves often revise labels as the range develops.` },
      { h: 'When it fails', md: `The spring setup fails when the range resolves downward after a temporary recovery — a frequent outcome in markets with a downward higher-timeframe trend.

**Losing example.** An NSE mid-cap ranges ₹612–₹640. It springs to ₹606, closes at ₹615. You buy at ₹617, stop ₹603, 350 shares, risk ₹4,900. Price rallies to ₹624, then a block sale headline hits and price falls through ₹603; the stop fills at ₹600. Loss ₹5,950 plus costs. With hindsight one might relabel the range as distribution and the "spring" as a failed test — but that relabelling was not available at entry.` },
      { h: 'Exercise', md: `1. In the Chart Lab, load the RELIANCE preset (a synthetic large-cap NSE stock) and find three ranges of at least 20 bars on the 15-min.
2. For each, mark support and resistance *before* scrolling forward. Then reveal the outcome. Did any break below and recover (spring by your coded rule)? What happened next?
3. Record effort versus result for the five biggest-volume bars in each range: was the range of the bar large or small?
4. Use [[widget:rr]] to compute the R multiple of the spring trades you found, including a ₹40 round-trip cost estimate.` },
    ],
    check: [
      { q: "A stock breaks below its range low by 1% and is still trading there. In Wyckoff terms, what is it?", o: ["A spring, so you should buy","Phase E markup","An upthrust","Undetermined — a spring is only confirmed by a recovery back inside the range"], a: 3, why: "A spring is defined by its failure to continue. Until price closes back inside the range, it is just a breakdown." },
      { q: "A 5-min bar trades three times the average volume but has a range one-third of normal. Effort versus result suggests…", o: ["Absorption — heavy trading without progress — worth noting but not proof of who traded", "Institutions are definitely accumulating", "A guaranteed breakout next bar", "Volume data is wrong"], a: 0, why: "High effort with little result is the classic absorption observation; identity of traders cannot be inferred." },
      { q: "Which part of Wyckoff is the most straightforward to turn into a testable rule?", o: ["Identifying the Composite Operator", "Labelling Phase B", "A failed break of a defined range (spring) with fixed parameters", "Deciding whether a range is accumulation or re-distribution"], a: 2, why: "A spring can be coded with fixed range length, break size and recovery window; the others are interpretive." },
    ],
    refs: ['Richard D. Wyckoff — The Richard D. Wyckoff Method of Trading and Investing in Stocks (course, 1931)', 'David H. Weis — Trades About to Happen: A Modern Adaptation of the Wyckoff Method (book)', 'Hank Pruden — The Three Skills of Top Trading (book)', 'David Aronson — Evidence-Based Technical Analysis (book)'],
  },
  {
    id: 'l3-auction', module: 'L3-M4', level: 3, track: 'ta', title: 'Auction Market Theory', mins: 20,
    summary: 'Use Auction Market Theory and volume/market profile concepts — value area, POC, balance and imbalance, initial balance — to describe the day and frame trades, while treating it as a descriptive framework rather than a predictive law.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `**Auction Market Theory (AMT)** views the market as a continuous two-way auction. Price moves to find trade: it rises until buyers stop accepting higher prices and falls until sellers stop accepting lower ones. When both sides agree on a range, the market is **in balance** and trades sideways around a fair price. When new information arrives, it moves **out of balance** to search for a new fair area.

AMT comes from the Chicago Board of Trade work of J. Peter Steidlmayer in the 1980s, which produced **Market Profile** (price-time distributions), and was developed further by James Dalton and others.

> [!evidence] Descriptive framework. AMT is a coherent way to *describe* where trade has occurred and is consistent with basic auction economics. Its specific trading rules (e.g. "price returns to value 80% of the time") are folklore unless you test them on your market; treat any such percentages as unverified.

An analogy: a fish market at dawn. The price wanders until both buyers and sellers are active; that zone is "value". A sudden storm (news) shifts where buyers will pay, and the market searches for a new zone.` },
      { h: 'Intermediate view', md: `### Key terms
- **Volume profile**: volume traded at each price over a period (shown as a horizontal histogram). **Market profile** (TPO) counts time spent at each price instead.
- **POC (point of control)**: the price with the most volume (or time).
- **Value area (VA)**: the price range containing about 70% of the volume — a convention borrowed from one standard deviation. **VAH** and **VAL** are its high and low.
- **Initial balance (IB)**: the range of the first hour (or, on NSE, many traders use 09:15–10:15).
- **Single prints / low-volume nodes (LVN)**: prices traded briefly during fast moves. **High-volume nodes (HVN)** are where the market spent time.

[[chart:NIFTY:64:vp,vwap]]

### Reading the day
- **Open inside yesterday's value**: balance is likely; mean-reversion toward the POC is the base case.
- **Open outside yesterday's value and accepted** (price holds outside for, say, two 30-min periods): the market is seeking new value; trend-following is the base case.
- **Open outside and rejected** (quickly back inside): a move back through value toward the opposite side is a common scenario.
- **IB extension**: a break of the initial balance range on rising volume suggests an imbalanced, directional day.

### Framing a trade
Long example: Nifty opens below yesterday's VAL, fails to find sellers, and re-enters value by 09:45. Plan: buy on a pullback that holds VAL, stop below the morning low, target yesterday's POC, then VAH.` },
      { h: 'Advanced view', md: `### Day types
Profile traders classify days (normal, normal variation, trend, double distribution, neutral, non-trend). Classification is useful for *management* — whether to hold for extension or fade extremes — but it is clearer late in the day than early.

### What has support and what does not
- **Established**: volume accumulates where participants are willing to trade; VWAP and volume-at-price describe where the bulk of the session's trading happened; prices with little prior trade can move quickly because there are fewer resting orders.
- **Mixed / instrument-specific**: whether prior-day value areas act as support/resistance more than random levels. Some markets and periods show mean reversion around value; others trend. Test on your instrument.
- **Unverified**: fixed percentages ("the 80% rule") circulated in trading books and forums. Treat as hypotheses.

### Practical refinements
- Use **composite profiles** (several days) to find larger HVNs and LVNs.
- Combine **VWAP** (time-weighted acceptance of the day) with the profile ([[link:l1-vwap]]).
- Note that profiles on index *futures* and on the *cash index* can differ; the cash index has no volume of its own, so use futures or ETF volume.
- AMT is a *language for context*, not a signal. Its main value is preventing you from fading a market that has clearly found acceptance at new prices, or chasing a breakout that has been rejected.` },
      { h: 'The maths', md: `**Value-area construction (volume method).**

:::formula
1. Find POC = price bin with highest volume
2. Total volume V; target = 0.70 × V
3. Starting at POC, add the larger of the two adjacent bins (above or below) repeatedly until accumulated volume ≥ target
4. VAH = highest bin included; VAL = lowest bin included
:::

**Worked example.** Seven 10-point bins of Nifty futures volume (lots, thousands): 24,100: 4; 24,110: 9; 24,120: 15; 24,130: 22 (POC); 24,140: 18; 24,150: 10; 24,160: 2. Total 80; target 56. Start 22. Neighbours 15 (below) vs 18 (above) → add 18 → 40. Next neighbours 15 vs 10 → add 15 → 55. Next 9 vs 10 → add 10 → 65 ≥ 56. VA = 24,120–24,150, POC 24,130.

> [!note] This single-bin method is the one the app's volume-profile engine uses. The original CBOT Market Profile procedure compares the *sum of the next two* rows above with the next two below and adds the larger pair; platforms differ (bin size, TPO vs volume, single vs dual rows), so the same session can show slightly different VAH/VAL on different software. Fix the method before testing any value-area rule.` },
      { h: 'India', md: `> [!india] Nifty and Bank Nifty futures provide volume for profiles; the indices themselves do not. Initial balance is often taken as 09:15–10:15 IST. Expiry days for Nifty options (Tuesday, as of Nov 2026 — verify on NSE) can distort profiles because of hedging flows around large open-interest strikes.

Example: if Bank Nifty futures accept above the prior day's VAH for the first two 30-min periods on rising volume, AMT says do not fade it simply because RSI is high.` },
      { h: 'US & global', md: `> [!us] Market Profile originated on CBOT futures and is widely used on ES (S&P 500 futures) and other CME products. For US single stocks, volume profile on 5- or 30-min data is common. The regular session (09:30–16:00 ET) and the overnight session can be profiled separately; many traders keep them apart.` },
      { h: 'Common misconceptions', md: `- **"Price always returns to the POC."** Often, not always; trend days leave value behind.
- **"The value area is where institutions think fair value is."** It is where most volume traded. Calling it "institutional" adds nothing.
- **"70% is a law."** It is a convention.
- **"Profile tells you direction."** It describes acceptance and rejection; direction comes from what happens next.` },
      { h: 'When it fails', md: `Mean reversion to value fails on news-driven trend days and on days where the market opens outside value and is accepted.

**Losing example.** Nifty futures open 70 points above yesterday's VAH after strong US cues. You short at 24,390 expecting a return to value at 24,320, stop 24,420, 2 lots (130 units), risk ₹3,900. Price holds above VAH for the first hour, the IB extends upward, and the stop fills at 24,424. Loss ₹4,420 plus costs. The framework itself warned you: an open outside value that is *accepted* is a trend signal, not a fade.` },
      { h: 'Exercise', md: `1. In the Chart Lab, load Nifty with {{vp}} and {{vwap}}. For ten sessions, record where the open was relative to the prior day's value area (inside, above, below).
2. For each, record whether price traded back to the prior POC before 12:30.
3. Build a small table of the counts. That is your personal base rate — far more useful than any number in a book.
4. Recompute one day's value area by hand using the construction steps above.` },
    ],
    check: [
      { q: "Nifty futures open above yesterday's VAH and hold there through the first hour with an upward IB extension. What does AMT suggest?", o: ["Fade the move back to POC", "The market is accepting higher prices; trend-following is the base case and fading is lower-probability", "A gap always fills by noon", "Profile is invalid on gap days"], a: 1, why: "Acceptance outside prior value indicates a search for new value; fading accepted moves is the classic AMT mistake." },
      { q: "Bins: 100:5, 101:12, 102:20(POC), 103:14, 104:6, 105:3. Total 60, 70% target 42. Which is the value area?", o: ["101–103", "102–104", "100–104", "101–104"], a: 0, why: "Start 20; add 14 (103) → 34; then 12 (101) vs 6 (104) → add 12 → 46 ≥ 42. VA = 101–103." },
      { q: "How should you treat a book's claim that price fills the value area 80% of the time after re-entry?", o: ["As a hypothesis to test on your instrument and period","As an established law of markets","As false by definition","As relevant only to options"], a: 0, why: "Such percentages are not independently established; your own sample is the evidence." },
    ],
    refs: ['J. Peter Steidlmayer & Kevin Koy — Markets and Market Logic (book)', 'James F. Dalton, Eric T. Jones & Robert B. Dalton — Mind Over Markets (book)', 'James F. Dalton, Robert B. Dalton & Eric T. Jones — Markets in Profile (book)', 'CME Group — Market Profile educational material (cmegroup.com)'],
  },

  /* ===================== L3-M5 Fundamentals and macro for intraday ===================== */
  {
    id: 'l3-company', module: 'L3-M5', level: 3, track: 'fund', title: 'Company fundamentals an intraday trader needs', mins: 20,
    summary: 'Read EPS, P/E, ROE, ROCE, debt-to-equity, promoter holding and pledges quickly, and use them to choose which stocks to trade, how much size to allow and which ones to avoid.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Intraday traders hold positions for minutes or hours, so why care about a company's balance sheet? Three reasons:

1. **Event risk.** A weak, highly indebted company can gap 10–20% on a downgrade, a default or a pledge invocation. Fundamentals tell you which stocks carry that risk.
2. **Who trades it.** Large, profitable companies attract index funds, mutual funds and FIIs, which means deeper order books and tighter spreads.
3. **How news is received.** A results surprise moves a richly valued stock differently from a cheap one.

> [!evidence] The definitions and arithmetic in this lesson are established accounting. Links between fundamentals and *long-run* returns (value, quality, profitability) have mixed but substantial academic evidence. For *intraday* trading, fundamentals are mainly a **risk filter**, not a signal.

An analogy: before you drive on a road, you want to know whether it has potholes. You do not need its full construction history.` },
      { h: 'Intermediate view', md: `### The core metrics
| Metric | Formula | What it tells you | Intraday use |
|---|---|---|---|
| EPS | Net profit attributable to equity shareholders ÷ weighted average shares outstanding (diluted EPS also counts options, convertibles) | Profit per share | Results surprise is measured against expected EPS |
| P/E | Price ÷ EPS (trailing twelve months or forward) | How much the market pays per ₹1 of earnings | High P/E stocks can react more violently to misses |
| ROE | Net profit ÷ shareholders' equity (ideally average of opening and closing equity) | Return on owners' money | Quality filter; ROE inflated by debt is a warning |
| ROCE | EBIT ÷ capital employed; capital employed = total assets − current liabilities, often approximated as equity + debt | Return on all capital, pre-tax | Better than ROE for leveraged firms |
| D/E | Total borrowings (short- plus long-term debt) ÷ shareholders' equity | Leverage | High D/E raises refinancing and downgrade risk |
| Interest coverage | EBIT ÷ interest expense | Ability to service debt | Below about 2× is a stress signal |
| Promoter holding | % of shares owned by promoters | Alignment and free float | Low free float can mean thin books |
| Pledged shares | % of promoter holding pledged to lenders | Forced-selling risk | High pledges are a red flag for gap risk |

### A quick pre-market screen (5 minutes)
1. Is the stock in the F&O segment? (Liquidity and a basic size/track-record screen.)
2. Market cap and average daily turnover — enough for your size to be under, say, 1% of a typical minute's volume?
3. D/E and interest coverage — any sign of stress?
4. Promoter pledge — rising over recent quarters?
5. Any scheduled event (results, board meeting, AGM, record date) today or tomorrow?

If any answer is a red flag, either skip the stock or halve your size.` },
      { h: 'Advanced view', md: `### Quality of earnings
EPS can be flattered by one-off gains (asset sales, tax write-backs) or depressed by one-off charges. Analysts and the market usually focus on *adjusted* or *core* earnings. When a headline EPS beat is driven by "other income", the stock may fall despite the beat. Read the segment and margin lines, not just EPS.

### ROE versus ROCE
A company with ROE 22% and D/E 2.5 is earning a lot on equity partly because it borrowed heavily. Its ROCE might be only 11%. Banks and NBFCs are an exception — their business is leverage, so use metrics like net interest margin, gross/net NPA, and capital adequacy instead.

### Pledges and margin calls
When promoters pledge shares as loan collateral and the share price falls, lenders may demand more collateral or sell the pledged shares. That selling can create a feedback loop: lower price → invocation → more selling. In Indian markets several mid-cap collapses have involved this dynamic. Disclosures of pledge creation and invocation are filed with exchanges.

### Valuation and reaction asymmetry
A stock on a P/E of 80 is priced for sustained high growth. A small miss can force a large rerating. A stock on a P/E of 10 with low expectations may rally on a mere "less bad" result. This is not a rule, just a reason to size high-expectation stocks more conservatively on event days.` },
      { h: 'The maths', md: `**Worked example — two companies.**

| | Company A | Company B |
|---|---|---|
| Net profit | ₹1,200 crore | ₹400 crore |
| Shares outstanding | 60 crore | 20 crore |
| Share price | ₹600 | ₹900 |
| Equity | ₹6,000 crore | ₹1,250 crore |
| Debt | ₹1,500 crore | ₹3,750 crore |
| EBIT | ₹1,900 crore | ₹800 crore |

- EPS: A = 1,200 ÷ 60 = ₹20; B = 400 ÷ 20 = ₹20.
- P/E: A = 600 ÷ 20 = 30; B = 900 ÷ 20 = 45.
- ROE: A = 1,200 ÷ 6,000 = 20%; B = 400 ÷ 1,250 = 32%.
- D/E: A = 0.25; B = 3.0.
- ROCE: A = 1,900 ÷ 7,500 = 25.3%; B = 800 ÷ 5,000 = 16%.

B's headline ROE looks better, but it is driven by debt; its ROCE is lower and its P/E higher. For an intraday trader, B carries more event and gap risk.

Note the like-for-like caveat: ROE uses profit *after* interest and tax, ROCE uses EBIT (*before* interest and tax). That is why A's ROE (20%) can sit below its ROCE (25.3%) — tax and interest come out of the ROE numerator. A big gap the other way (ROE far above ROCE, as for B) is the leverage signal. Use the same definitions across companies and years; data sites differ (EBIT vs operating profit, average vs closing equity).` },
      { h: 'India', md: `> [!india] Shareholding patterns (promoter, FII, DII, public) are filed quarterly with NSE/BSE; pledge disclosures are filed under SEBI's takeover regulations. Free sources: company filings on nseindia.com and bseindia.com, and annual reports. As of Nov 2026, verify current disclosure formats on the exchange sites.

Practical: a stock where promoters hold 70% and FIIs/DIIs another 20% has a small free float; such names can move sharply on modest flows. A stock with promoter pledge above, say, a third of their holding deserves a size haircut and a wider stop or a pass.` },
      { h: 'US & global', md: `> [!us] US companies file 10-Q (quarterly) and 10-K (annual) reports with the SEC (sec.gov EDGAR). There is no "promoter" concept; instead look at insider ownership (Form 4 filings), short interest and float. Very high short interest with a small float can create violent squeezes on news.` },
      { h: 'Common misconceptions', md: `- **"Good fundamentals mean the stock will go up today."** Fundamentals change slowly; intraday price is driven by flows and news.
- **"High ROE is always good."** Not if it comes from leverage or a shrinking equity base.
- **"Low P/E means cheap."** It can mean the market expects falling earnings.
- **"Pledging is always bad."** It is a risk factor whose severity depends on size, trend and the lender's terms.` },
      { h: 'When it fails', md: `Fundamental filters do not protect you from market-wide shocks, and a clean balance sheet does not stop a stock falling 8% on a guidance cut.

**Losing example.** You buy a strong-ROCE, zero-debt FMCG stock intraday at ₹2,450 because "fundamentals are great", 200 shares, stop ₹2,425. At 11:00 the company announces a management exit; the stock drops to ₹2,360 within minutes and your stop fills at ₹2,402. Loss ₹9,600 — nearly double your planned ₹5,000. Fundamentals did not cause the loss, but believing they reduce intraday risk led to a too-large position.` },
      { h: 'Exercise', md: `1. Pick five F&O stocks you trade. From their latest filings, compute EPS, P/E, ROE, ROCE and D/E using the formulas above.
2. Record promoter holding and pledge percentage for the last four quarters.
3. Rank them by event risk and set a size multiplier (1.0, 0.75 or 0.5) for each in your journal.
4. Use [[widget:position-size]] to see how the multiplier changes your quantity for the same stop distance.` },
    ],
    check: [
      { q: "Company X has ROE 28% and ROCE 12%. What is the most likely explanation?", o: ["It has no debt","It is a bank","Its equity base is small relative to its debt, so leverage is inflating ROE","Its EBIT is negative"], a: 2, why: "A large gap between ROE and ROCE usually means returns on equity are boosted by borrowed capital." },
      { q: "Net profit ₹500 crore, 25 crore shares, price ₹800. What is the P/E?", o: ["20", "32", "40", "16"], a: 2, why: "EPS = 500 ÷ 25 = ₹20; P/E = 800 ÷ 20 = 40." },
      { q: "Why is a rising promoter pledge a concern even for an intraday trader?", o: ["It increases dividend payout","It reduces brokerage charges","It guarantees an upper circuit","Falling prices can trigger lender selling, raising gap and crash risk"], a: 3, why: "Pledged shares can be sold by lenders if collateral value falls, creating forced selling and gaps." },
    ],
    refs: ['Aswath Damodaran — Damodaran on Valuation (book)', 'Benjamin Graham & David Dodd — Security Analysis (book)', 'NSE — Corporate filings: shareholding pattern and pledge disclosures (nseindia.com)', 'SEBI — Substantial Acquisition of Shares and Takeovers Regulations (sebi.gov.in)', 'SEC — EDGAR company filings (sec.gov)'],
  },
  {
    id: 'l3-events', module: 'L3-M5', level: 3, track: 'fund', title: 'Earnings, corporate actions and event risk', mins: 20,
    summary: 'Plan around results days and corporate actions — dividends, splits, bonuses, buybacks, rights — understand how prices and derivatives adjust, and decide whether to trade, reduce or stand aside.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Some days are not normal days. When a company publishes quarterly results, announces a buyback or goes ex-dividend, the price can jump at the open or move sharply in seconds. Those are **scheduled events**. Unscheduled ones — a regulator's order, a fire at a plant, a CEO resignation — are **event risk** you cannot plan for, only size for.

> [!evidence] Established: corporate-action price adjustments are mechanical (exchange rules). Post-earnings drift and earnings-day volatility patterns have academic support in many markets, but the size and persistence vary and have weakened in some studies. Do not assume a fixed pattern.

Simple rule of thumb: on a stock's event day, your normal stop is not your real risk. The gap is.` },
      { h: 'Intermediate view', md: `### Earnings day
- **Timing**: in India many companies announce during market hours or after the close; in the US most announce before the open or after the close, followed by a conference call.
- **What moves the price**: the result *relative to expectations* (consensus), margins, guidance and management commentary — not the headline number alone.
- **Typical behaviour**: wide opening range, high volume, spreads wider in the first minutes, and frequent reversals as the call is digested.

### Practical playbook for results day
1. **Before**: know the date and time. If you hold an open position into an announcement, you are making a binary bet on the gap.
2. **At release**: do not trade the first one or two minutes; quotes can be erratic.
3. **After**: let the opening range form (15–30 min). Trade a break of that range in the direction of the reaction *or* a failure back inside it, with reduced size.
4. **Options**: implied volatility usually rises into results and drops sharply afterwards (IV crush). Long options bought just before can lose even if direction is right.

### Corporate actions
| Action | Price adjustment | Effect on F&O |
|---|---|---|
| Cash dividend | Price drops roughly by the dividend on the ex-date | NSE adjusts F&O contracts only for extraordinary dividends (those at or above 5% of the share's market value under the current circulars — as of Nov 2026, verify on NSE); ordinary dividends are left to futures pricing |
| Split (e.g. 1:5) | Price divides by 5, shares multiply by 5 | Strike and lot size adjusted |
| Bonus (e.g. 1:1) | Price roughly halves | Strike and lot adjusted |
| Buyback | No mechanical adjustment; tender offer can support price | Usually none |
| Rights issue | Adjustment factor based on the theoretical ex-rights price | Adjusted |` },
      { h: 'Advanced view', md: `### Expected move from options
Before results, the price of the at-the-money straddle approximates the market's expected absolute move to expiry (under a normal-distribution model the ATM straddle is about 0.8 × σ√T × price, and the expected absolute move is also about 0.8 × σ√T × price, which is why the shortcut works). If a ₹1,000 stock's nearest-expiry ATM straddle costs ₹48, the market is pricing a move of roughly ±4.8% by expiry, most of it from the event. Two cautions: the straddle also contains ordinary time value for the non-event days (so subtract a normal-day straddle estimate if expiry is far away), and it is an *average* absolute move — actual moves of one and a half to two times the straddle occur. Use it to set realistic stops and to decide whether your intraday target is achievable.

### Post-earnings drift
Academic work since the late 1960s (Ball and Brown; Bernard and Thomas) documented a tendency for prices to keep drifting in the direction of an earnings surprise for weeks. Later studies suggest the effect has weakened in large, liquid US stocks. For intraday traders, the relevant observation is narrower: a strong surprise often produces a trend day, and fading it early is risky.

### Event-day size rules professionals use
- Cap position size on event names at a fraction (e.g. 50%) of normal.
- Use a **gap-adjusted risk**: assume the stop can fill at the expected-move distance.
- Avoid holding overnight into results unless that *is* the trade, sized as a binary bet.
- Watch sector peers: one bank's results move other banks; one IT major's guidance moves the sector.` },
      { h: 'The maths', md: `**Ex-dividend adjustment.** A stock closes at ₹1,520 on the day before the ex-date; dividend ₹20. The theoretical opening reference is about ₹1,500. A move to ₹1,505 is not a 1% fall; it is a small *rise* on an adjusted basis.

**Bonus 1:1.** You hold 100 shares at ₹2,000 (value ₹2,00,000). After the bonus you hold 200 shares at ~₹1,000: value unchanged.

**Theoretical ex-rights price (TERP).**

:::formula
TERP = (N × P + R × S) ÷ (N + R)
N = existing shares, P = cum-rights price, R = rights shares, S = subscription price
:::

1-for-4 rights at ₹400 on a ₹500 stock: TERP = (4 × 500 + 1 × 400) ÷ 5 = ₹480.

**Gap-adjusted sizing.** Normal stop 1.2% → risk ₹5,000 → ₹4.17 lakh notional. Expected event move 5%: to keep gap risk at ₹5,000, notional = 5,000 ÷ 0.05 = ₹1 lakh, about a quarter of normal.` },
      { h: 'India', md: `> [!india] Companies must give the exchanges prior notice of board meetings to consider results (verify current SEBI LODR timelines). Results calendars are published on NSE and BSE. Stocks enter the F&O ban period when open interest crosses 95% of the market-wide position limit (MWPL; SEBI revised the OI computation in 2025 — verify current rules on NSE); in ban, you can only reduce positions. NSE publishes corporate-action adjustment circulars for F&O.

Intraday note: Indian companies can and do announce results during market hours (board meetings often conclude in the afternoon), so a stock can turn from calm to volatile mid-session. Check the board-meeting date every morning for the names on your watchlist.` },
      { h: 'US & global', md: `> [!us] US earnings season clusters in the weeks after each quarter-end. Pre-market (from 04:00 ET at many brokers) and after-hours sessions show the initial reaction on thin liquidity; spreads are wide and prints can be misleading. Mega-cap results (e.g. NVDA) can move the whole index and spill into global futures overnight.` },
      { h: 'Common misconceptions', md: `- **"Good results mean the stock goes up."** The reaction depends on expectations and guidance.
- **"Ex-dividend falls are selling pressure."** They are a mechanical adjustment.
- **"Buying options before results is a cheap way to play the move."** IV crush often makes it expensive.
- **"Splits and bonuses create value."** They change the share count, not the company's worth.` },
      { h: 'When it fails', md: `**Losing example.** A large IT stock reports at 15:45 IST on a Wednesday. You held 300 shares long from ₹1,640 with a stop at ₹1,620 (planned risk ₹6,000), intending to "see the result". Guidance disappoints; the stock opens at ₹1,560. Your stop fills at the open around ₹1,558. Loss ₹24,600 plus costs — four times your plan. The stop did nothing because there was no trading between the announcement and the next open.` },
      { h: 'Exercise', md: `1. Build a weekly event list for your watchlist: results dates, ex-dates, record dates, AGM and board meetings.
2. For one upcoming result, look up the ATM straddle price and compute the implied expected move as a percentage.
3. Use [[widget:position-size]] with the expected move as the stop distance to find a gap-adjusted size.
4. After the result, journal the actual move versus the implied move.` },
    ],
    check: [
      { q: "A ₹800 stock declares a 1:1 bonus. You hold 50 shares. After the ex-date, assuming no other change, you hold…", o: ["50 shares at ₹800", "100 shares at about ₹400", "100 shares at ₹800", "25 shares at ₹1,600"], a: 1, why: "A 1:1 bonus doubles shares and roughly halves price; total value is unchanged." },
      { q: "A stock's ATM straddle before results costs ₹60 on a ₹1,200 stock. What move is the market roughly pricing?", o: ["±5%","±0.5%","±10%","±60%"], a: 0, why: "Straddle ÷ price = 60 ÷ 1,200 = 5%." },
      { q: "You buy calls the afternoon before results and the stock rises 2% the next day, yet the calls lose value. The most likely reason is…", o: ["The exchange adjusted the strike","STT on exercise","Implied volatility collapsed after the event, offsetting delta gains","The stock went ex-dividend"], a: 2, why: "IV typically drops after the event (IV crush); if the move is smaller than priced, vega losses can exceed delta gains." },
    ],
    refs: ['Ray Ball & Philip Brown — An Empirical Evaluation of Accounting Income Numbers (Journal of Accounting Research, 1968)', 'Victor Bernard & Jacob Thomas — Post-Earnings-Announcement Drift (Journal of Accounting Research, 1989)', 'NSE — Corporate actions and F&O adjustment circulars (nseindia.com)', 'SEBI — Listing Obligations and Disclosure Requirements Regulations (sebi.gov.in)', 'Sheldon Natenberg — Option Volatility and Pricing (book)'],
  },
  {
    id: 'l3-macro', module: 'L3-M5', level: 3, track: 'fund', title: 'Macro: inflation, rates, RBI, Fed, ECB, BoJ', mins: 22,
    summary: 'Explain how inflation and central-bank policy (RBI MPC, Fed FOMC, ECB, BoJ) transmit to yields, currencies and equity indices, and what that means for intraday volatility and sector moves.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `Central banks set the price of money. When inflation is too high, they raise their policy rate; borrowing gets more expensive, spending slows, and inflation should ease. When growth is weak and inflation is low, they cut. Markets constantly try to guess the next move.

For an intraday trader, macro matters in two ways:
1. **Volatility spikes** at policy announcements and data releases.
2. **Sector rotation**: rate-sensitive sectors (banks, NBFCs, real estate, autos) react more than others.

> [!evidence] Established: the mechanics of policy rates, yields and the release schedules. Mixed: the *direction* of any market reaction, which depends on expectations already in the price. "Rate cut = market up" is not reliable.

Analogy: the central bank is the thermostat. Traders do not react to the temperature; they react to whether the thermostat moved more or less than they expected.` },
      { h: 'Intermediate view', md: `### The main central banks
| Bank | Committee | Policy rate | Meets |
|---|---|---|---|
| RBI | Monetary Policy Committee (6 members: 3 from RBI including the Governor, 3 external; Governor has a casting vote on a tie) | Repo rate | RBI Act requires at least four meetings a year; in practice six (bi-monthly); decision announced around 10:00 IST |
| US Federal Reserve | FOMC (12 voting members: 7 Board governors, the New York Fed president and 4 rotating Reserve Bank presidents) | Federal funds target range (a 25 bp band) | Eight scheduled meetings a year, four with a Summary of Economic Projections (dot plot); statement 14:00 ET, press conference 14:30 ET; minutes three weeks later |
| ECB | Governing Council | Deposit facility rate | About every six weeks |
| Bank of Japan | Policy Board | Short-term policy rate | Eight meetings a year; decision timing varies around midday JST |

Verify all dates and times on the central banks' websites — schedules change (as of Nov 2026).

### Transmission chain
Inflation data → rate expectations → bond yields → currency → equity valuations and sector flows.

- **Higher-than-expected inflation** → expectations of tighter policy → yields up → typically pressure on long-duration growth stocks and rate-sensitive sectors.
- **Dovish surprise** → yields down → often supportive of banks' bond portfolios, real estate, and high-P/E stocks.
- **For India**, US yields and the dollar matter: a stronger dollar and higher US yields can mean FII outflows and rupee weakness.

### What to watch on the day
- The decision versus consensus.
- The vote split and the stance (e.g. "neutral", "withdrawal of accommodation").
- Forward guidance, projections (Fed dot plot, RBI growth/inflation forecasts).
- Liquidity measures (RBI CRR changes, Fed balance sheet).` },
      { h: 'Advanced view', md: `### Expectations are priced
Markets price policy paths through instruments such as overnight index swaps and, in the US, fed funds futures (CME FedWatch summarises them). When a move is fully priced, the decision itself may barely move markets; the *guidance* does. A "hawkish cut" — a cut accompanied by signals of no further cuts — can push yields up and equities down.

### Second-round effects for intraday
- **Bank Nifty** is especially sensitive to RBI decisions, liquidity measures and bond yields.
- **IT stocks** react to US data and the USD/INR rate.
- **Global open**: a hawkish Fed at 14:00 ET is after the Indian close; the reaction appears in GIFT Nifty overnight and in the Indian open the next morning.
- **BoJ**: changes in Japanese yields can influence global carry trades; a surprise can cause cross-asset volatility as leveraged positions unwind.

### Reading the reaction
The first move is often a knee-jerk by algorithms reading headlines; a second move follows during the press conference. Many professionals wait for the press conference or the policy statement's full text before committing size.` },
      { h: 'The maths', md: `**Real rate.**

:::formula
Real policy rate ≈ nominal policy rate − expected inflation
:::

Illustration (not the current rate — check rbi.org.in): if the repo rate were 5.50% and expected CPI inflation 4.0%, the real rate would be about 1.5%. RBI's inflation target is 4% CPI with a 2–6% tolerance band under the flexible inflation-targeting framework (verify the current target on rbi.org.in).

**Duration sensitivity (why yields move stocks and bonds).**

:::formula
% change in bond price ≈ − modified duration × change in yield
:::

A 10-year government bond with modified duration 7: a 0.15% (15 bp) rise in yield → price ≈ −7 × 0.15% = −1.05%. Banks holding large government-bond portfolios feel this through treasury gains or losses, which is one reason Bank Nifty reacts to yield moves.

**Equity valuation link (simplified).** Earnings yield = 1 ÷ P/E. With P/E 22, earnings yield is 4.5%. If the 10-year yield rises from 6.5% to 7.0%, the gap between bond and equity yields widens — a reason analysts sometimes cite for de-rating. This is a heuristic, not a precise model.` },
      { h: 'India', md: `> [!india] RBI MPC decisions are announced in a statement (usually around 10:00 IST) followed by a press conference. Bank Nifty and rate-sensitive stocks often show a wide range in the 10:00–10:45 window. India CPI is released by MoSPI monthly (typically around the 12th, 16:00 IST); WPI by the Office of the Economic Adviser mid-month. Verify dates on rbi.org.in and mospi.gov.in (as of Nov 2026).

Example: if the market expects a hold and the MPC delivers a 25 bp cut with a neutral stance, Bank Nifty may spike, then retrace as traders parse liquidity guidance. Size down for the first 30 minutes after 10:00.` },
      { h: 'US & global', md: `> [!us] FOMC statements at 14:00 ET move US index futures, Treasuries and the dollar within seconds; the 14:30 ET press conference can reverse the first move. Fed decisions after the Indian close mean Indian traders see the reaction at the next morning's open.

ECB and BoJ decisions affect EUR/USD, USD/JPY and global risk appetite. A sharp yen move can spill into equities through carry-trade unwinds.` },
      { h: 'Common misconceptions', md: `- **"Rate cuts are always bullish."** A cut that signals economic trouble, or is smaller than hoped, can lead to selling.
- **"The decision is what matters."** Usually the guidance and projections matter more, because the decision is often priced.
- **"Macro is for investors only."** Release windows are among the most volatile minutes of the intraday calendar.
- **"I can predict the reaction from the headline."** Algorithms read headlines faster than you; the edge is not in the first second.` },
      { h: 'When it fails', md: `**Losing example.** On an RBI day you buy Bank Nifty futures at 52,600 one minute before the decision, expecting a cut. The cut comes, Bank Nifty jumps to 52,780 — then the governor's comments on liquidity are read as hawkish and it falls to 52,350 within 20 minutes. Your stop at 52,450 fills at 52,410 in fast trade. Loss 190 points × 30 = ₹5,700 plus costs. You were right on the decision and wrong on the trade.` },
      { h: 'Exercise', md: `1. Note the next RBI MPC and FOMC dates from the official websites.
2. On the day, mark the release time on a Bank Nifty or SPY chart in the Chart Lab replay and record the 5-, 15- and 60-minute range after the release versus the same window on a normal day.
3. Write down the consensus expectation before the release and compare it with the outcome and the actual market move.
4. Decide your rule: size multiplier and earliest entry time after a policy release.` },
    ],
    check: [
      { q: "The market fully expects a 25 bp Fed cut. The Fed cuts 25 bp but signals no further cuts this year. A likely reaction is…", o: ["A large rally because a cut happened","No reaction is possible","The dollar must fall","Yields rise and equities weaken because the guidance is more hawkish than priced"], a: 3, why: "When the decision is priced, the surprise is in the guidance. A hawkish path can push yields up and equities down." },
      { q: "A bond has modified duration 6. Yields rise 20 bp. Approximate price change?", o: ["−0.6%", "−1.2%", "−2.0%", "+1.2%"], a: 1, why: "−6 × 0.20% = −1.2%." },
      { q: "Why might Bank Nifty react more than Nifty IT to an RBI decision?", o: ["Bank earnings and bond portfolios are directly sensitive to policy rates and liquidity","IT stocks are not listed on NSE","RBI sets IT export prices","Bank Nifty has a larger lot size"], a: 0, why: "Banks' margins, funding costs and treasury income depend on rates and liquidity; IT is more linked to US demand and the rupee." },
    ],
    refs: ['Reserve Bank of India — Monetary Policy statements and MPC resolutions (rbi.org.in)', 'Federal Reserve — FOMC meeting calendars and statements (federalreserve.gov)', 'European Central Bank — Monetary policy decisions (ecb.europa.eu)', 'Bank of Japan — Monetary Policy Meetings (boj.or.jp)', 'CME Group — FedWatch Tool (cmegroup.com)', 'Frederic Mishkin — The Economics of Money, Banking and Financial Markets (book)'],
  },
  {
    id: 'l3-calendar', module: 'L3-M5', level: 3, track: 'fund', title: 'Economic calendars and trading around releases', mins: 20,
    summary: 'Build and use India and US economic calendars (CPI, PPI/WPI, NFP, GDP, PMI, policy meetings), and apply a concrete plan for trading, reducing or not trading around high-impact releases.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `An **economic calendar** lists scheduled data releases and policy events with their time, the previous value and the consensus forecast. High-impact items cause bursts of volatility; low-impact ones barely register.

Three choices exist around any release:
1. **Stand aside** — close or reduce positions before, re-engage after the dust settles.
2. **Trade the reaction** — wait for the first move and the subsequent structure, then trade with normal rules and smaller size.
3. **Hold through** — accept the gap risk, sized so the worst plausible move fits your risk limit.

> [!evidence] Established: release schedules and the fact that volatility and spreads increase around high-impact data. The *direction* of reaction is not predictable from the headline alone, because it depends on the surprise versus consensus and on positioning.

For most developing traders, the best answer is usually (1) or (2). Trying to predict the number is gambling on a coin you cannot see.` },
      { h: 'Intermediate view', md: `### High-impact releases
| Release | Country | Typical time | Why it matters |
|---|---|---|---|
| CPI inflation | India (MoSPI) | Around the 12th, 16:00 IST | Drives RBI expectations |
| WPI inflation | India | Mid-month, 12:00 IST | Input-cost pressure |
| IIP, GDP | India (MoSPI) | IIP monthly; GDP quarterly, about two months after quarter-end (typically the last working day of the second month), 16:00 IST | Growth picture |
| RBI MPC decision | India | ~10:00 IST on decision day | Rates, liquidity, Bank Nifty |
| Nonfarm payrolls (NFP) | US (BLS) | Usually first Friday, 08:30 ET (18:00 or 19:00 IST) | Labour market, Fed path |
| CPI | US (BLS) | Mid-month, 08:30 ET | Inflation, Fed path |
| PPI | US (BLS) | Mid-month, 08:30 ET | Producer prices |
| FOMC decision | US | 14:00 ET; presser 14:30 ET | Rates, dollar, global risk |
| PMIs | Many | Start of month | Early growth signal |

IST times for US releases shift by an hour when US daylight saving changes (US clocks fall back in early November). Verify every date and time on the official agency sites (as of Nov 2026).

### A concrete release-day plan
1. **Morning check**: list today's releases with times in IST (or ET).
2. **T − 10 min**: no new entries; tighten or reduce open trades; cancel resting limit orders you would not want filled in a spike.
3. **T to T + 2 min**: no trading. Spreads widen; quotes can jump.
4. **T + 5 to T + 15 min**: mark the high and low of the reaction. Watch whether price holds beyond pre-release levels or snaps back.
5. **Trade**: a break of the reaction range in the direction of the move, or a failure back through the pre-release level, with half size and a stop beyond the reaction extreme.` },
      { h: 'Advanced view', md: `### Surprise, not level
A CPI print of 3.4% is meaningless without the consensus. If consensus was 3.1%, it is a hawkish surprise; if 3.6%, dovish. Professionals also look at *core* measures and revisions to previous months — a strong headline NFP with large downward revisions can be read as weak.

### Spillovers to Indian intraday
US data at 08:30 ET lands in the Indian evening; it affects GIFT Nifty, the USD/INR, and the next Indian open. Indian traders holding overnight positions are exposed. US CPI surprises have moved global risk sentiment strongly in recent years.

### Liquidity and execution
- Market makers widen quotes before releases; depth thins.
- Stop orders can fill far from their trigger in the first seconds.
- In options, implied volatility tends to rise into high-impact releases and fall after them, similar to earnings IV crush.

### Systematic approach
Keep a release log: time, consensus, actual, surprise, reaction in your instruments at 5/15/60 minutes. After 20–30 observations you will know which releases matter for *your* markets, rather than relying on a generic "high-impact" flag.` },
      { h: 'The maths', md: `**Release-day position sizing.**

:::formula
Size = Risk budget ÷ max(normal stop distance, expected spike distance)
:::

Your normal Nifty futures stop is 35 points; risk budget ₹6,500. Normal size = 6,500 ÷ 35 ≈ 186 units → 2 lots (130 units; 3 lots would be 195 and exceed the budget). On US CPI nights, your log shows the first-15-minute GIFT Nifty move averaging 80 points. Gap-aware size = 6,500 ÷ 80 ≈ 81 units → 1 lot (65). Holding 2 lots through the release risks about 80 × 130 = ₹10,400 on an average reaction — 1.6× your budget.

**Surprise in standard-deviation units.** Some desks standardise surprises: (actual − consensus) ÷ standard deviation of past surprises. A 0.3% CPI surprise where past surprises had a 0.15% standard deviation is a 2-sigma surprise — likely to matter.` },
      { h: 'India', md: `> [!india] Key Indian calendar items: RBI MPC (rbi.org.in), CPI and IIP (mospi.gov.in), WPI (eaindustry.nic.in), GDP (MoSPI), Union Budget (usually 1 February), monthly F&O expiry, and major results. Indian CPI is released after the market close, so its effect shows at the next open. GIFT Nifty trades in sessions that cover most US releases.

Practical: on a US NFP Friday, Indian markets are closed by the time it lands; the Monday open absorbs the weekend reaction. Plan weekend exposure accordingly.` },
      { h: 'US & global', md: `> [!us] US data come from the Bureau of Labor Statistics (CPI, PPI, NFP), the Bureau of Economic Analysis (GDP, PCE) and others; their release schedules are published in advance. US equities are often already trading in pre-market at 08:30 ET; the regular session opens at 09:30 ET with the reaction partly priced. Eurozone CPI flash estimates, ECB decisions and China's data also move global futures.` },
      { h: 'Common misconceptions', md: `- **"A strong number is bullish."** Strong data can be bearish if it raises rate expectations.
- **"I can scalp the spike."** Spreads, slippage and algorithm speed make the first seconds an unfavourable place for manual traders.
- **"Calendar flags are reliable."** Generic impact ratings are a start; your own log is better.
- **"Releases don't affect my stock."** Index-heavy names move with the index on macro days.` },
      { h: 'When it fails', md: `**Losing example.** On US CPI day you short SPY at $598.40 at 08:29 ET pre-market with 200 shares, stop $599.40 (risk $200), hoping for a hot print. CPI comes in cooler than consensus; SPY gaps to $601.10 in seconds and your stop fills at $600.95. Loss $510 — 2.5× your plan — plus a wide spread. The "plan" was a prediction, not a risk-managed trade. Worse, many US brokers do not trigger standard stop orders outside the regular session at all, so in reality the stop may not have fired until 09:30 ET — check your broker's extended-hours order rules before relying on any pre-market stop.` },
      { h: 'Exercise', md: `1. Create a calendar for the coming month with all high-impact India and US releases in IST, including the US daylight-saving shift.
2. For each release, write your rule: stand aside, trade the reaction, or hold with gap-aware size.
3. After three releases, fill in the log: consensus, actual, surprise, 5/15/60-minute moves in Nifty futures or GIFT Nifty.
4. Use [[widget:position-size]] to compute gap-aware sizes using your logged reaction ranges.` },
    ],
    check: [
      { q: "US CPI prints 0.4% month-on-month versus 0.2% consensus. What is the more useful framing?", o: ["The number is positive, so buy","CPI does not matter to equities","It is a hawkish surprise relative to expectations; watch yields and the dollar for confirmation","Wait for the next CPI"], a: 2, why: "The reaction is driven by surprise relative to consensus and its implications for policy, not the level." },
      { q: "Your risk budget is ₹6,000. Normal stop 30 points; logged release spike 75 points. How many Nifty lots (65 units) fit if you hold through?", o: ["3 lots", "2 lots", "1 lot", "0 lots — even 1 lot exceeds"], a: 2, why: "6,000 ÷ 75 = 80 units; 1 lot of 65 fits, 2 lots (130) would risk about ₹9,750." },
      { q: "Why do many professionals avoid trading the first one or two minutes after a high-impact release?", o: ["Exchanges halt trading by rule","Data is published only after two minutes","Brokers charge double brokerage","Spreads widen, depth thins and algorithms dominate, so fills are poor and direction often reverses"], a: 3, why: "Execution quality is worst immediately after release; the initial move can reverse as details are digested." },
    ],
    refs: ['US Bureau of Labor Statistics — Release calendar (bls.gov)', 'Ministry of Statistics and Programme Implementation — Press releases calendar (mospi.gov.in)', 'Reserve Bank of India — MPC schedule (rbi.org.in)', 'Federal Reserve — FOMC calendar (federalreserve.gov)', 'NSE International Exchange — GIFT Nifty trading hours (nseix.com)'],
  },

  /* ===================== L3-M6 Backtesting and validation ===================== */
  {
    id: 'l3-hypothesis', module: 'L3-M6', level: 3, track: 'strategy', title: 'From idea to testable hypothesis', mins: 18,
    summary: 'Turn a vague trading idea into a precise, falsifiable hypothesis with fixed entry, stop, exit, universe, period and success criteria decided before you look at results.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `"Bank Nifty reverses after a big gap" is an opinion. "On Bank Nifty futures, when the open is more than 0.8% below the prior close, buying at 09:30 with a stop at the day's low so far and exiting at 15:15 produces a positive average R after costs" is a **hypothesis**: anyone can check it, and it can be shown to be wrong.

Why bother? Because the human mind is very good at remembering the examples that fit and forgetting the ones that do not. A precise hypothesis forces you to count every case.

> [!evidence] Established: the scientific method — define, predict, test, accept or reject — is standard research practice. It does not guarantee you will find an edge; most ideas fail testing, and that is useful information.

Analogy: a doctor does not say "this medicine feels like it works". They define the dose, the patients, the outcome and the comparison group before the trial.` },
      { h: 'Intermediate view', md: `### The seven parts of a testable trading hypothesis
1. **Market and instrument**: Nifty futures continuous, top 50 F&O stocks, SPY.
2. **Timeframe and session**: 5-min bars, 09:15–15:30 IST, excluding expiry days (or including them — decide now).
3. **Setup condition**: exact, codeable. "Opening-range high = highest high of 09:15–09:30 bars."
4. **Entry**: order type and price. "Buy-stop 1 tick above the opening-range high, valid until 11:00."
5. **Stop**: exact. "Opening-range low, or 1.0 × ATR(14) below entry, whichever is closer."
6. **Exit**: target, time stop, trailing rule. "Exit at 2R or 15:15, whichever first."
7. **Costs and slippage**: brokerage, STT, exchange fees, GST, stamp duty, plus slippage per side ([[widget:charges-india]]).

### Write the prediction and the null
- **Prediction (H1)**: mean R per trade after costs is greater than zero.
- **Null (H0)**: mean R per trade after costs is zero or less; any profit is noise.
- **Decision rule** decided now: "I will consider the idea promising if, over at least 200 trades, mean R ≥ 0.10 with a t-statistic above 2, and results are positive in at least 3 of 4 sub-periods."

### Separate data
Split history *before* testing: for example, 2019–2023 for development, 2024–2025 held out. You only look at the held-out period once.` },
      { h: 'Advanced view', md: `### Where ideas come from — and why it matters
- **Economic rationale**: a reason someone is on the other side (forced sellers, hedging flows, risk premia, behavioural over-reaction). Ideas with a rationale are more likely to persist.
- **Observation**: something you saw on charts. Fine as a starting point, but high risk of pattern-seeking.
- **Literature**: published anomalies; many have decayed after publication.

### Falsifiability
If the hypothesis can absorb any result ("it works, but only in the right market conditions"), it is not testable. Define the conditions in advance: "only on days when Nifty ATR(14, daily) is above its 100-day median".

### Pre-registration for one
Write the hypothesis, parameters and decision rule in your journal with a date *before* running the test. This simple step is one of the strongest protections against data snooping ([[link:l3-biases]]).

### Benchmarks and controls
Compare with a baseline: random entries with the same stop and target rules, or buy-and-hold over the same windows. A breakout system that makes money in a strongly rising year may just be capturing the trend.` },
      { h: 'The maths', md: `**Expectancy in R.**

:::formula
Expectancy (R) = (Win rate × Average win in R) − (Loss rate × Average loss in R) − average costs in R
:::

(If your average win and loss are already measured net of costs, drop the last term — do not subtract costs twice.)

**Worked example.** Your draft rules produce, in a small manual sample, 42% winners averaging +1.9R and 58% losers averaging −1.0R, with costs of 0.08R per trade.

Expectancy = 0.42 × 1.9 − 0.58 × 1.0 − 0.08 = 0.798 − 0.58 − 0.08 = **+0.138R**.

Translate the decision rule into numbers: with a per-trade standard deviation of about 1.4R, to get t ≥ 2 you need n ≥ (2 × 1.4 ÷ 0.138)² ≈ 412 trades. That tells you up front whether your data can even answer the question. See [[link:l3-significance]].` },
      { h: 'India', md: `> [!india] Define Indian-specific details: lot sizes changed over time (Nifty 65 from Jan 2026 contracts — verify on NSE), expiry weekdays changed several times, and STT rose from 1 Apr 2026. A test over 2019–2026 must apply the cost and contract specification in force for each date, not today's values backwards.` },
      { h: 'Common misconceptions', md: `- **"I'll know a good setup when I see it."** That is the problem the hypothesis solves.
- **"More conditions make it more precise."** They make it more specific — and more prone to overfitting.
- **"A hypothesis has to be right."** Its job is to be testable. Rejection is progress.
- **"I can decide the success criterion after seeing the results."** That is the most common form of self-deception in research.` },
      { h: 'When it fails', md: `**Example of a failed process.** A trader notices three great days where a 9-EMA cross on Nifty 5-min worked. He tests it and finds a small loss; he adds an RSI filter, then a time filter, then excludes Mondays, then changes the EMA to 11. The final version shows a smooth equity curve on 2023 data. Live, it loses 14R in two months. Nothing in the process was decided in advance, so the final rules were fitted to noise.` },
      { h: 'Exercise', md: `1. Write one idea you believe in as a seven-part hypothesis using the template above.
2. Write H0, H1 and the decision rule, with a date, in your journal.
3. Use [[widget:expectancy]] to compute the expectancy your idea must reach to clear costs.
4. Estimate the number of trades you need with the formula in "The maths". Can your data provide that many?` },
    ],
    check: [
      { q: "Which is a testable hypothesis?", o: ["Gaps usually reverse in the right conditions", "When Nifty futures open >0.8% below prior close, buying at 09:30 with stop at the session low and exit at 15:15 yields mean R > 0 after costs", "Smart money buys gap-downs", "Bank Nifty is bullish this month"], a: 1, why: "It specifies the setup, entry, stop, exit and success measure, so it can be falsified." },
      { q: "When should you set your success criteria (e.g. minimum mean R and t-stat)?", o: ["Before running the test","After seeing the equity curve","Only after live trading","Never; criteria limit creativity"], a: 0, why: "Deciding afterwards lets you move the goalposts, which is a form of data snooping." },
      { q: "Win rate 40%, average win 2.2R, average loss 1R, costs 0.1R. Expectancy?", o: ["+0.18R", "+0.28R", "+0.38R", "−0.02R"], a: 0, why: "0.40 × 2.2 − 0.60 × 1.0 − 0.1 = 0.88 − 0.60 − 0.10 = +0.18R." },
    ],
    refs: ['David Aronson — Evidence-Based Technical Analysis (book)', 'Ernest Chan — Quantitative Trading (book)', 'Robert Pardo — The Evaluation and Optimization of Trading Strategies (book)', 'Karl Popper — The Logic of Scientific Discovery (book)'],
  },
  {
    id: 'l3-backtest-method', module: 'L3-M6', level: 3, track: 'strategy', title: 'Manual, bar-by-bar and automated backtesting', mins: 20,
    summary: 'Choose between manual, bar-by-bar replay and automated backtests, run each correctly with realistic fills and costs, and record results in a format you can analyse.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `A **backtest** applies your rules to past data to see what would have happened. There are three ways to do it:

1. **Manual (chart scrolling)**: you look at historical charts and record trades. Quick to start, but you can see the future on the right of the screen.
2. **Bar-by-bar replay**: the chart reveals one bar at a time, so you decide without seeing what comes next. Slower, more honest, and it also trains your execution.
3. **Automated**: code applies the rules to data. Fast, repeatable, can test thousands of trades — but only as good as your data, fill assumptions and code.

> [!evidence] Established: backtests can only show how rules *would have* performed on the specific data with the specific assumptions used. They are evidence, not proof, of future performance.

Analogy: a flight simulator. Useful, but if the simulator's physics are wrong, you learn the wrong lessons.` },
      { h: 'Intermediate view', md: `### Choosing a method
| Method | Best for | Main risks | Typical sample |
|---|---|---|---|
| Manual | Rough screening of discretionary ideas | Hindsight, inconsistency, cherry-picking | 30–100 trades |
| Bar-by-bar replay | Discretionary setups, execution practice | Slow; still subject to fatigue and drift | 100–300 trades |
| Automated | Fully rule-based systems | Bugs, look-ahead, unrealistic fills, overfitting | Hundreds to thousands |

### A bar-by-bar protocol
1. Pick random dates (use a random number generator so you do not choose "interesting" days).
2. Hide everything to the right of the current bar.
3. At each bar, decide using only the written rules. Record decisions *before* advancing.
4. Use realistic fills: market orders at next bar's open plus slippage; limit orders only filled if price trades *through* your price, not just touches.
5. Log: date, time, setup, entry, stop, exit, R multiple, costs, notes, screenshot.

### Automated backtest checklist
- Signals computed on bar *t* close, orders executed at bar *t+1* open (or later).
- Intrabar ambiguity: if a bar hits both stop and target, assume the stop first (conservative) unless you have tick data.
- Costs per side ([[widget:charges-india]] / [[widget:charges-us]]) and slippage per side.
- Contract roll handling for futures (continuous back-adjusted series, or actual contracts).
- Corporate-action-adjusted data for stocks.
- Correct session times, holidays and half-days.` },
      { h: 'Advanced view', md: `### Walk-forward analysis
Instead of a single in-sample/out-of-sample split, repeatedly optimise on a window (say 24 months) and test on the next window (6 months), rolling forward. Concatenate the out-of-sample results. This shows how a *process* of periodic re-fitting performs, which is closer to how you would trade it.

### Monte Carlo on the trade list
Reshuffle the sequence of backtest R multiples thousands of times to see the range of drawdowns and losing streaks the same edge can produce. Also resample *with replacement* (bootstrap) to account for the uncertainty in the edge itself.

[[widget:monte-carlo]]

### Execution realism
- **Queue position**: a limit order at the best bid may not fill if price touches it and leaves; your backtest should require a trade through.
- **Capacity**: if your order is a large fraction of the volume at that time, assume extra impact.
- **Regime coverage**: include trending, ranging, high- and low-volatility periods. A 2020–2021 only test misses a lot.

### Paper and incubation
After a backtest, run the rules in paper trading or with minimum size for a pre-defined period (e.g. 50 trades). Compare live R with backtest R; a large gap usually means execution or assumption problems.` },
      { h: 'The maths', md: `**Converting rupee P&L into R and applying costs.**

:::formula
R multiple = (Exit − Entry − costs per unit) ÷ (Entry − Stop)   (for a long)
:::

**Worked example.** Long Nifty futures 1 lot (65): entry 24,210, stop 24,170 (risk 40 points = ₹2,600). Exit 24,290. Gross 80 points = ₹5,200. Round-trip statutory and broker charges from [[widget:charges-india]] are about ₹940 (as of Nov 2026; STT on the sell side alone is about ₹790), i.e. about 14.5 points; add 1 point of entry slippage. Net R = (80 − 1 − 14.5) ÷ 40 = **+1.61R**.

A loser stopped at 24,170 with 3 more points of stop slippage: (−40 − 1 − 3 − 14.5) ÷ 40 = **−1.46R**. Notice how costs and slippage make losers bigger than −1R and winners smaller. On a 40-point stop, charges alone are over a third of R; ignoring them can turn a losing backtest into an apparently winning one.` },
      { h: 'India', md: `> [!india] For NSE backtests, use historical contract specifications: lot sizes, expiry days and STT rates have all changed (STT on futures 0.05% on sell and options 0.15% on premium sell from 1 Apr 2026 — as of Nov 2026). Exchange transaction charges also changed on 1 Mar 2026. Apply the correct rate for each trade date. Remove market holidays and special sessions (e.g. Muhurat trading) or treat them separately.` },
      { h: 'US & global', md: `> [!us] For US equities, use split- and dividend-adjusted data and include delisted symbols to avoid survivorship bias. Account for SEC fees and FINRA TAF on sells, and realistic spreads in pre-market and after-hours sessions if your strategy trades them.` },
      { h: 'Common misconceptions', md: `- **"Automated backtests are objective."** They are objective about the assumptions you coded — including the wrong ones.
- **"If a limit price was touched, I was filled."** Often not.
- **"Manual backtesting is enough."** It is a screen; hindsight bias is strong.
- **"A good backtest means I can trade it at full size."** Live execution, psychology and regime change usually reduce results.` },
      { h: 'When it fails', md: `**Illustrative example.** An automated test of a 1-min Bank Nifty scalping rule shows +0.25R per trade. The code filled limit orders whenever the bar's low touched the limit price, and ignored slippage on stops. Re-run with trade-through fills and 1 point slippage per side: −0.06R. Live results matched the second number. And that re-run still understates costs if it omits charges: one Bank Nifty futures lot (30) costs roughly 30 points round trip in charges at current STT (as of Nov 2026 — check with [[widget:charges-india]]), which on a typical 1-min scalping stop is a large fraction of R.` },
      { h: 'Exercise', md: `1. In the Chart Lab replay mode, run 50 bar-by-bar trades of a simple opening-range breakout on Nifty, using random start dates.
2. Log every trade with R multiple net of costs (use [[widget:charges-india]]).
3. Feed your win rate and average R into [[widget:monte-carlo]] and note the 95th-percentile drawdown.
4. Write down three assumptions in your test that could be wrong.` },
    ],
    check: [
      { q: "In an automated test, a signal is computed from a bar's close. When should the order be assumed to fill?", o: ["At that same bar's open", "At that bar's close exactly, with no slippage", "At the next bar's open (or later), plus slippage", "At the bar's best price"], a: 2, why: "You cannot act on a close before it happens; next-bar execution with slippage avoids look-ahead and optimistic fills." },
      { q: "A bar hits both your stop and target, and you only have 5-min OHLC data. The conservative assumption is…", o: ["Target first", "Stop first", "Ignore the trade", "Average of both"], a: 1, why: "Without intrabar data you cannot know the order; assuming the stop first avoids flattering results." },
      { q: "Why reshuffle a backtest trade list in a Monte Carlo simulation?", o: ["To increase the average R","To remove losing trades","To see the range of drawdowns and streaks the same set of outcomes can produce in different orders","To satisfy exchange rules"], a: 2, why: "Order matters for drawdown; reshuffling shows how bad sequences could be even with the same edge." },
    ],
    refs: ['Robert Pardo — The Evaluation and Optimization of Trading Strategies (book)', 'Ernest Chan — Algorithmic Trading: Winning Strategies and Their Rationale (book)', 'Marcos López de Prado — Advances in Financial Machine Learning (book)', 'NSE — Historical contract specifications and circulars (nseindia.com)'],
  },
  {
    id: 'l3-biases', module: 'L3-M6', level: 3, track: 'strategy', title: 'Overfitting, look-ahead, survivorship and data snooping', mins: 20,
    summary: 'Recognise and prevent the major backtest biases — overfitting, look-ahead, survivorship, selection and data snooping — and apply concrete checks before trusting any result.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `A backtest can look excellent and be completely useless. The usual reason is a **bias**: a systematic error that makes past results look better than what you would really have achieved.

- **Overfitting**: rules tuned so tightly to past noise that they describe history, not a repeatable pattern.
- **Look-ahead bias**: using information that was not available at the time of the decision.
- **Survivorship bias**: testing only on stocks that still exist today, ignoring those that were delisted, merged or went bust.
- **Data snooping**: testing many ideas on the same data and keeping the best, which almost guarantees something looks good by luck.

> [!evidence] Established: these biases are well-documented in statistics and finance research (e.g. work by Bailey, Borwein, López de Prado and Zhu on backtest overfitting, and by Harvey, Liu and Zhu on multiple testing in factor research).

Analogy: if you flip 100 fair coins ten times each, you should expect about five of them to land heads eight or more times (the chance for any one coin is about 5.5%). Those coins are not special.` },
      { h: 'Intermediate view', md: `### How each bias sneaks in
| Bias | Typical cause | Check |
|---|---|---|
| Look-ahead | Using the day's high/low/close to decide an intraday entry; using restated fundamentals; index membership as of today | Every input must be timestamped before the decision |
| Survivorship | Today's Nifty 50 constituents tested back to 2015 | Use point-in-time constituents, include delisted names |
| Overfitting | Many parameters, fine-tuned values (EMA 13 not 12 or 14) | Parameter stability; few rules; out-of-sample test |
| Data snooping | Trying 200 variations and reporting the best | Count every trial; adjust significance; hold-out data |
| Selection | Choosing the test period or instruments after seeing charts | Fix universe and period before testing |
| Cost blindness | Ignoring STT, slippage, spreads | Apply realistic costs per side |

### Parameter stability test
If a moving-average length of 20 gives +0.20R, check 16, 18, 22, 24. If they give +0.18, +0.19, +0.17, +0.16, the result is stable. If they give −0.05, +0.02, −0.10, +0.01, the 20 is a spike in noise.

### Out-of-sample discipline
Hold back the most recent 20–30% of the data. Develop on the rest. Test once on the hold-out. If you tweak and re-test on the hold-out, it is no longer out-of-sample.` },
      { h: 'Advanced view', md: `### Multiple testing
Each additional variation you test raises the chance that the best one is a false positive. With 20 independent tests at the 5% level, the chance at least one appears "significant" by luck is about 1 − 0.95²⁰ ≈ **64%**. Remedies:
- **Bonferroni**: require p < 0.05 ÷ number of tests (conservative).
- **Raise the bar**: some researchers suggest t-statistics of about 3 rather than 2 for new findings after extensive search.
- **Deflated Sharpe ratio**: adjusts the Sharpe ratio for the number of trials and non-normal returns (Bailey and López de Prado).

### Subtle look-ahead
- Adjusted historical prices for splits/dividends are fine for returns, but price-level rules (e.g. "stock above ₹1,000") on adjusted data use information from the future.
- Volume profiles or VWAP computed over the full day used for a 10:00 decision.
- Indicators that "repaint" (swing-pivot detectors, fractals or zig-zag lines that confirm a swing only N bars later). Classic floor pivot points from the prior day's high, low and close do not repaint.

### Measuring overfitting directly
- **Probability of backtest overfitting (PBO)**: split the data into many blocks, choose the best configuration on each combination of in-sample blocks and record how it ranks out of sample (combinatorially symmetric cross-validation, Bailey, Borwein, López de Prado and Zhu). A high share of below-median out-of-sample ranks means the selection process is fitting noise.
- **Minimum backtest length**: the more configurations you try, the longer the history needed before the best Sharpe ratio is distinguishable from the best of many random ones. Trying hundreds of variants on two years of data almost guarantees an impressive-looking but meaningless winner.
- **Keep a trial log**: the number of variants tried is an input to every one of these corrections. If you did not record it, assume it is large.

### Regime dependence
A strategy can be valid in a regime that ended. Split results by year, volatility regime and trend regime. A test that is entirely carried by one year is fragile.` },
      { h: 'The maths', md: `**False discovery from many trials.**

:::formula
P(at least one false positive) = 1 − (1 − α)^k
:::

α = 0.05, k = 20 → 1 − 0.95^20 = 1 − 0.358 = **0.642**.

**Bonferroni threshold.** k = 20 → required p < 0.0025, roughly |t| > 3.0 for large samples.

**Worked example of overfitting.** You test a breakout on Nifty 5-min with 3 parameters × 6 values each = 216 combinations. The best shows mean +0.22R over 180 trades with standard deviation 1.3R: t = 0.22 ÷ (1.3 ÷ √180) = 0.22 ÷ 0.097 = 2.27. On its own that clears 2. After 216 trials, Bonferroni requires p < 0.00023 (|t| roughly 3.7). The result is not convincing; the hold-out test becomes the real judge.` },
      { h: 'India', md: `> [!india] Survivorship is a serious issue in Indian small- and mid-cap tests: many companies listed in the 2000s were later delisted or suspended. Use point-in-time index constituents (NSE Indices publishes historical changes) and include delisted securities if your data vendor provides them. Also note that F&O inclusion criteria changed over time; testing "F&O stocks" with today's list is survivorship-biased.` },
      { h: 'Common misconceptions', md: `- **"Out-of-sample results confirm the system."** Only once, and only if you did not adjust after peeking.
- **"More data fixes overfitting."** It helps, but many parameters can still fit noise in large datasets.
- **"Optimisation is bad."** Optimising a few parameters with stability checks is fine; optimising for the single best number is the problem.
- **"My manual backtest has no look-ahead."** Seeing the right side of the chart is look-ahead.` },
      { h: 'When it fails', md: `**Example.** A trader tests a "buy the strongest stock in the Nifty 50 at 09:30" system from 2016 to 2025 using today's Nifty 50 list. It shows strong returns. Rebuilt with point-in-time constituents (stocks that were in the index at each date, including those later removed after poor performance), the edge shrinks to roughly zero after costs. The original result came partly from selecting winners in hindsight.` },
      { h: 'Exercise', md: `1. List every parameter in your current strategy. Count how many variations you have tried in total (be honest).
2. Run a parameter-stability sweep of ±20% on your main parameter and record the mean R for each value.
3. Compute 1 − 0.95^k for your number of trials.
4. In [[widget:monte-carlo]], compare the drawdown distribution of your in-sample and out-of-sample R statistics.` },
    ],
    check: [
      { q: "You test 30 strategy variations on the same data at the 5% level. Roughly what is the chance at least one looks significant by luck alone (if all are independent and useless)?", o: ["5%", "30%", "About 79%", "100%"], a: 2, why: "1 − 0.95^30 ≈ 1 − 0.215 = 0.785." },
      { q: "A test uses today's Nifty 50 constituents back to 2015. Which bias is present?", o: ["Look-ahead only","None if costs are included","Overfitting only","Survivorship (and a form of look-ahead in selection)"], a: 3, why: "Today's list excludes stocks that were dropped, often after poor performance, flattering results." },
      { q: "EMA length 20 gives +0.20R; 18 gives −0.04R; 22 gives −0.07R. What should you conclude?", o: ["Use 20; it is optimal", "The result is unstable and likely noise", "Use 18 and 22 together", "Increase leverage"], a: 1, why: "A sharp peak surrounded by poor neighbours indicates overfitting rather than a robust effect." },
    ],
    refs: ['David Bailey, Jonathan Borwein, Marcos López de Prado & Qiji Jim Zhu — Pseudo-Mathematics and Financial Charlatanism (Notices of the AMS, 2014)', 'Campbell Harvey, Yan Liu & Heqing Zhu — …and the Cross-Section of Expected Returns (Review of Financial Studies, 2016)', 'David Bailey & Marcos López de Prado — The Deflated Sharpe Ratio (Journal of Portfolio Management, 2014)', 'David Bailey, Jonathan Borwein, Marcos López de Prado & Qiji Jim Zhu — The Probability of Backtest Overfitting (Journal of Computational Finance, 2017)', 'NSE Indices — Historical index constituent changes (niftyindices.com)'],
  },
  {
    id: 'l3-significance', module: 'L3-M6', level: 3, track: 'strategy', title: 'Sample size and statistical significance', mins: 22,
    summary: 'Compute the t-statistic of mean R, estimate how many trades you need to distinguish an edge from luck, and use Monte Carlo to see the range of outcomes a real edge can still produce.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Twenty trades tell you almost nothing. A trader with a genuine small edge can easily have a losing month; a trader with no edge can easily have a great one. **Sample size** is how many independent observations you have; **statistical significance** asks how likely your result would be if the true edge were zero.

> [!evidence] Established: the t-test, standard error and sampling distribution are standard statistics. Trading returns are often non-normal and not fully independent, so treat these numbers as approximations, not certainties.

Analogy: a cricketer who scores 80 in one innings is not proven better than one who scores 20. Over 50 innings, the averages start to mean something.` },
      { h: 'Intermediate view', md: `### The three numbers you need
1. **Mean R per trade** (x̄): average of all R multiples, after costs.
2. **Standard deviation of R** (s): how spread out the outcomes are. For a pure +2R / −1R system with win rate p, s = 3 × √(p(1 − p)), which is about 1.4–1.5R for win rates between 30% and 60%; systems with trailing exits and occasional big winners often have higher s.
3. **Number of trades** (n).

### Standard error and the t-statistic
:::formula
Standard error (SE) = s ÷ √n
t = x̄ ÷ SE
:::
Rule of thumb: |t| > 2 means the result would be unusual (roughly 5% two-sided) if the true mean were zero. After testing many variations, demand more (|t| ≈ 3). For small samples use the Student-t critical value rather than 2: about 2.09 at n = 20, 2.03 at n = 35, 2.00 at n = 60 (two-sided 5%). If your hypothesis is one-directional (mean R > 0), a one-sided test at 5% needs about 1.65 for large n — but decide one- versus two-sided before testing, not after.

### Confidence interval
:::formula
95% CI ≈ x̄ ± 2 × SE
:::
If the interval includes zero, you cannot rule out that the edge is zero.

### Practical thresholds
- Under 30 trades: anecdote.
- 30–100: early signal; very wide intervals.
- 200–500: often enough to detect a moderate edge (0.15–0.25R) with typical dispersion.
- Small edges (0.05R) need thousands of trades — and are easily destroyed by costs.` },
      { h: 'The maths', md: `**Worked example — is 60 trades enough?**

Your journal: n = 60 trades, mean R = +0.15, standard deviation s = 1.2R.

- SE = 1.2 ÷ √60 = 1.2 ÷ 7.746 = **0.155R**
- t = 0.15 ÷ 0.155 = **0.97**
- 95% CI ≈ 0.15 ± 2 × 0.155 = **−0.16R to +0.46R**

The interval comfortably includes zero. You cannot distinguish this from luck.

**Same edge, more trades.** If the same mean and dispersion continued for n = 400:
- SE = 1.2 ÷ 20 = 0.06R
- t = 0.15 ÷ 0.06 = **2.5**
- 95% CI ≈ 0.03R to 0.27R

**Required sample size for a target t.**
:::formula
n ≈ (t_target × s ÷ x̄)²
:::
For t = 2, s = 1.2, x̄ = 0.15: n ≈ (2 × 1.2 ÷ 0.15)² = 16² = **256 trades**. For t = 3: n ≈ 24² = 576.

**Monte Carlo view.** Even with a true edge of +0.15R, the order of trades varies. Set the simulator with a 40% win rate, 1.9R average win and 1R loss (which gives roughly +0.16R expectancy) and look at the spread of 100-trade outcomes and drawdowns:

[[widget:monte-carlo]]

You will typically see a sizeable fraction of 100-trade paths ending near flat or negative despite a positive expectancy — which is why short samples cannot judge a strategy.` },
      { h: 'Advanced view', md: `### When the assumptions break
- **Non-normal R**: trend systems have rare large winners (positive skew); option-selling has rare large losers (negative skew). The t-test is fairly robust for large n, but with heavy tails a few trades dominate. Check results with and without the top 5% of trades.
- **Dependence**: trades on the same day or in correlated instruments are not independent. Five Nifty-stock longs on one trend day are closer to one observation than five. Aggregate by day if needed.
- **Bootstrapping**: resample the trade list with replacement 10,000 times and compute mean R each time; the 2.5th and 97.5th percentiles give a distribution-free interval.
- **Sharpe ratio**: for daily P&L, annualised Sharpe ≈ mean daily return ÷ SD × √252. A Sharpe estimate from one year of data has a large standard error; multi-year samples are needed for confidence.

### Live versus backtest
Compare live mean R with the backtest using the same method: is the difference larger than about 2 standard errors of the live sample? If not, you cannot yet say live is worse — but you also cannot say it is the same.` },
      { h: 'India', md: `> [!india] Count only trades taken under the same rules and cost regime. If STT or lot sizes changed during your sample (e.g. 1 Apr 2026 STT change — as of Nov 2026), compute R after the costs that applied at each date, and consider splitting the sample at the change.` },
      { h: 'Common misconceptions', md: `- **"70% win rate over 20 trades proves an edge."** Win rate on a small sample is very noisy; it also ignores the size of wins and losses.
- **"Significance means the edge will continue."** It means the past result is unlikely under zero edge, given your assumptions. Markets change.
- **"A t of 2 after 100 tries is meaningful."** Not without adjusting for multiple testing.
- **"More trades per day gives a bigger sample faster."** Only if they are reasonably independent.` },
      { h: 'When it fails', md: `**Example.** A trader logs 35 trades with mean +0.6R and declares success, doubling size. The standard deviation was 1.8R: SE = 0.30, t = 2.0 — borderline, and before accounting for the fact he had tried four setups. The next 80 trades average −0.05R. The first sample was mostly two large winners on trend days; without them the mean was close to zero.` },
      { h: 'Exercise', md: `1. Export your journal R multiples (or a backtest list). Compute n, mean R, standard deviation, SE and t.
2. Compute the 95% interval. Does it include zero?
3. Calculate how many trades you need for t = 2 at your current mean and SD.
4. Run [[widget:monte-carlo]] with your parameters for 100 and 500 trades and record the 5th and 95th percentile ending equity.` },
    ],
    check: [
      { q: "n = 100 trades, mean R = 0.20, SD = 1.5R. What is the t-statistic?", o: ["1.33","0.75","2.00","13.3"], a: 0, why: "SE = 1.5 ÷ 10 = 0.15; t = 0.20 ÷ 0.15 = 1.33." },
      { q: "Mean R 0.10, SD 1.0R. Roughly how many trades for t = 2?", o: ["40", "100", "400", "4,000"], a: 2, why: "n ≈ (2 × 1.0 ÷ 0.10)² = 20² = 400." },
      { q: "You take 6 correlated long trades on Nifty stocks on the same trend day. Why might counting them as 6 independent observations mislead you?", o: ["They have different tickers","Correlation increases sample size","Their outcomes are driven largely by the same market move, so they carry less independent information","Exchange rules prohibit it"], a: 2, why: "Dependence inflates effective sample size and understates the standard error." },
    ],
    refs: ['David Aronson — Evidence-Based Technical Analysis (book)', 'Bradley Efron & Robert Tibshirani — An Introduction to the Bootstrap (book)', 'Andrew Lo — The Statistics of Sharpe Ratios (Financial Analysts Journal, 2002)', 'Van K. Tharp — Trade Your Way to Financial Freedom (book) — R-multiple framework'],
  },

  /* ===================== L3-M7 Professional risk management ===================== */
  {
    id: 'l3-drawdown', module: 'L3-M7', level: 3, track: 'risk', title: 'Drawdown, recovery and risk of ruin', mins: 22,
    summary: 'Calculate drawdown and the gain needed to recover, estimate losing streaks and risk of ruin for a given edge and risk per trade, and set a per-trade risk that keeps ruin remote.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `A **drawdown** is the fall in your account from its highest point to a later low. If your account peaks at ₹5 lakh and falls to ₹4 lakh, you are in a 20% drawdown.

Losses and gains are not symmetrical. Lose 50% and you need +100% to get back. That asymmetry is why professionals obsess over keeping drawdowns small: deep holes are very hard to climb out of, both mathematically and psychologically.

**Risk of ruin** is the probability that a run of losses takes your account to a level where you cannot or will not continue — not necessarily zero, but your personal "stop trading" point.

> [!evidence] Established: drawdown and recovery arithmetic is exact. Risk-of-ruin formulas are exact for simplified models and approximate for real trading, where edge, sizing and outcomes vary.

Analogy: climbing down a ladder is easy; climbing back up the same number of rungs gets harder the deeper you go, because each rung up is a smaller percentage of a bigger distance.` },
      { h: 'Intermediate view', md: `### Recovery table
| Drawdown | Gain needed to recover |
|---|---|
| 5% | 5.3% |
| 10% | 11.1% |
| 20% | 25.0% |
| 30% | 42.9% |
| 40% | 66.7% |
| 50% | 100% |
| 75% | 300% |

[[widget:drawdown]]

### Losing streaks are normal
With a 45% win rate, over 200 trades the probability of at least one run of 8 consecutive losers is roughly one in two; a run of 10 is about one in five. With a 40% win rate, an 8-loss streak over 200 trades is more likely than not (around three in four). Plan for streaks; do not treat them as evidence your system broke.

### What a streak costs at different risk levels
| Risk per trade | After 8 straight losses | After 10 straight losses |
|---|---|---|
| 0.5% | −3.9% | −4.9% |
| 1% | −7.7% | −9.6% |
| 2% | −14.9% | −18.3% |
| 5% | −33.7% | −40.1% |

(Compounded: 1 − (1 − r)^n.)

The choice of risk per trade matters far more than the choice of indicator.` },
      { h: 'Advanced view', md: `### Risk of ruin models
For a simple model with win probability p, equal-size wins and losses, and capital of N "units" of risk:

:::formula
Risk of ruin ≈ ((1 − p) ÷ p)^N    (for p > 0.5)
:::

With unequal payoffs, closed forms get messy; simulation is the practical approach. The [[widget:ror]] calculator estimates ruin for a given win rate, payoff ratio, risk per trade and ruin threshold.

[[widget:ror]]

### Define ruin realistically
Most traders do not trade to zero; they quit, or blow their confidence, at a 30–50% drawdown. Set ruin at that level. Illustration from simulation (not a forecast): with 1% compounded risk, 250 trades a year and an edge of about +0.12R per trade, the chance of a −50% drawdown within the year is effectively zero, while the chance of a −20% drawdown from a peak at some point is roughly 2–9% depending on the win-rate/payoff mix. Run your own numbers in the simulator.

> [!note] The [[widget:ror]] calculator is a Monte Carlo simulation of compounded fixed-fraction risk over a finite number of trades, so it will not reproduce the closed-form fixed-rupee number below exactly. Both are models; neither includes costs, slippage, changing edge or behavioural errors.

### Edge uncertainty
Your *estimated* edge has a standard error ([[link:l3-significance]]). If the true edge is lower than you think, ruin probability rises sharply. Professionals size for a conservative edge estimate (for example the lower end of the confidence interval), not the backtest average.

### Maximum drawdown, duration and tail streaks
:::formula
Drawdown(t) = 1 − Equity(t) ÷ max(Equity up to t)
Max drawdown = largest Drawdown(t) over the period
:::
Also record **drawdown duration** (time from a peak to a new peak). A strategy with a 12% max drawdown that takes nine months to recover can be harder to live with than one with 18% that recovers in six weeks. Max drawdown from a single backtest is one draw from a distribution; the Monte Carlo widget shows how much deeper it can be with the same trades in a different order.

Losing-streak probabilities quoted in this lesson were computed exactly (a run-length recursion over 200 trades with independent outcomes). Real trades are not fully independent — clusters of losses on choppy days make long streaks somewhat more likely than the model says.

### Fractional Kelly
The Kelly criterion gives the growth-maximising bet fraction: f* = p − (1 − p) ÷ b, where b is the payoff ratio. Full Kelly produces very deep drawdowns and is highly sensitive to edge errors. Practitioners who use it at all typically bet a fraction (a quarter or less), and many intraday traders simply cap risk at 0.25–1% per trade.` },
      { h: 'The maths', md: `**Recovery formula.**

:::formula
Gain needed = DD ÷ (1 − DD)
:::
DD = 25% → 0.25 ÷ 0.75 = 33.3%.

**Streak drawdown.** Risk 1.5% per trade, 9 consecutive losses: 1 − 0.985⁹ = 1 − 0.873 = **12.7%**. On ₹6 lakh, that is about ₹76,000.

**Simple risk of ruin.** p = 0.55, even payoff. Ruin defined as losing 20 units (e.g. 20 × 1% ≈ a 20% loss with fixed rupee risk): ((0.45) ÷ (0.55))²⁰ = 0.818²⁰ ≈ **1.8%**. If you risk 2% per trade, the same 20% loss is only 10 units: 0.818¹⁰ ≈ **13.4%**. Doubling risk per trade raised ruin probability about sevenfold.

**Kelly.** p = 0.45, b = 2: f* = 0.45 − 0.55 ÷ 2 = 0.45 − 0.275 = 0.175 (17.5%). A quarter-Kelly would be about 4.4% — still far above what most intraday professionals risk, which shows how aggressive Kelly is in practice and how wrong it becomes if p is overestimated.` },
      { h: 'India', md: `> [!india] Example: ₹10 lakh account trading Nifty futures. At 1% risk (₹10,000) and a 40-point stop, size = 10,000 ÷ 40 = 250 units → 3 lots (195 units, risk ₹7,800). Ten straight losers ≈ −₹78,000 (−7.8%) — plus charges of roughly ₹2,800 per round trip at 3 lots (about ₹940 per lot as of Nov 2026, see [[widget:charges-india]]), another ₹28,000 over ten trades, taking the streak to about −10.6%. At 3 lots with a 120-point "mental" stop that gets ignored, a single bad day can exceed that.` },
      { h: 'Common misconceptions', md: `- **"A 50% loss needs a 50% gain."** It needs 100%.
- **"My system wins 60%, so long streaks won't happen."** Over 300 trades at a 60% win rate, a run of at least 5 straight losses is very likely (about 85%), 6 is roughly a coin flip, and 7 happens about one time in four.
- **"Risk of ruin is zero if expectancy is positive."** It is lower, not zero; it depends heavily on size.
- **"Kelly is the optimal size for me."** Only if you know your edge exactly — you do not.` },
      { h: 'When it fails', md: `**Example.** A trader with a genuine +0.2R edge risks 4% per trade because "the edge is proven". An ordinary 7-loss streak takes him to about −25% (1 − 0.96⁷); he widens stops to avoid more losses, two trades go to −2R each (−8% of equity each), and the account is down about 36%. He needs about +57% to recover. The edge was real; the sizing made it irrelevant.` },
      { h: 'Exercise', md: `1. Use [[widget:drawdown]] to find the recovery gain for your worst historical drawdown.
2. In [[widget:ror]], enter your win rate and payoff ratio. Compare ruin probability (ruin = −30%) at 0.5%, 1% and 2% risk.
3. In [[widget:monte-carlo]], run 500 trades with your parameters and note the 95th-percentile maximum drawdown.
4. Write your maximum risk per trade in the journal, with the reasoning.` },
    ],
    check: [
      { q: "Your account is in a 40% drawdown. What gain is needed to return to the peak?", o: ["40%", "57%", "66.7%", "100%"], a: 2, why: "0.40 ÷ 0.60 = 66.7%." },
      { q: "Risk 2% per trade, 10 consecutive losses (compounded). Approximate drawdown?", o: ["−10%","−20%","−25%","−18%"], a: 3, why: "1 − 0.98^10 ≈ 1 − 0.817 = 18.3%." },
      { q: "Why do professionals often size using the lower end of their estimated edge?", o: ["It increases returns", "Estimated edges have error; overestimating the edge sharply increases drawdown and ruin risk", "Exchanges require it", "Lower edges have lower costs"], a: 1, why: "Sizing on an overestimated edge, especially with Kelly-style rules, leads to oversized bets and deep drawdowns." },
    ],
    refs: ['Ralph Vince — The Mathematics of Money Management (book)', 'Leonard MacLean, Edward Thorp & William Ziemba (eds.) — The Kelly Capital Growth Investment Criterion: Theory and Practice (book, 2011)', 'Van K. Tharp — Definitive Guide to Position Sizing (book)', 'William Feller — An Introduction to Probability Theory and Its Applications (book) — gambler\'s ruin'],
  },
  {
    id: 'l3-limits', module: 'L3-M7', level: 3, track: 'risk', title: 'Daily and weekly loss limits, circuit breakers for yourself', mins: 18,
    summary: 'Set daily, weekly and monthly loss limits linked to your per-trade risk, build personal circuit breakers that stop trading automatically, and enforce them with broker tools and a written protocol.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Exchanges have circuit breakers that halt trading when prices move too far, too fast. You need your own. A **daily loss limit** is the amount you can lose in a day before you stop — no exceptions. A **weekly limit** does the same over a week.

Why? Because losses change behaviour. After a few losers, people take revenge trades, increase size and abandon their rules. A pre-set limit makes the decision for you while you are still calm.

> [!evidence] Established practice at professional trading desks (traders typically operate under daily and monthly loss limits set by risk managers). Behavioural research on loss aversion, the "break-even effect" (extra risk-taking after losses, Thaler and Johnson, 1990) and the disposition effect is consistent with the idea that decisions after losses are often worse; the specific limit values are judgement calls.

Analogy: a fuel gauge with an automatic cut-off. You cannot run the engine dry, however much you want to keep driving.` },
      { h: 'Intermediate view', md: `### Linking limits to risk per trade
| Limit | Typical range | Example with 1% per-trade risk |
|---|---|---|
| Per trade | 0.25–1% of capital | 1% |
| Daily | 2–3 × per-trade risk | 2.5% |
| Weekly | 4–6 × per-trade risk | 5% |
| Monthly | 8–10 × per-trade risk | 8% — triggers a review and size reduction |

### Additional circuit breakers
- **Consecutive-loss stop**: stop after 3 losing trades in a row in a day, even if under the daily limit.
- **Profit give-back rule**: if you have been up 2R and give back 1R, stop for the day.
- **Time stop**: no new trades after a fixed time (e.g. 14:45 IST) unless part of the plan.
- **Error stop**: any rule violation (moving a stop, oversizing) ends the day.
- **Drawdown ladder**: at −5% from peak, cut size by half; at −10%, paper-trade only until a review is complete.

### Enforcement
1. Write the limits on a card next to your screen and in the app journal.
2. Use broker tools where available: some Indian brokers offer a daily loss "kill switch" that blocks new orders in a segment for the day; US platforms offer daily loss locks.
3. When a limit hits: close all positions, cancel orders, log out, and write a short journal entry. No "one more trade".` },
      { h: 'Advanced view', md: `### Why daily limits help even with a positive edge
In theory, if each trade is independent with positive expectancy, stopping after losses reduces expected profit. In practice, outcomes after losses are not independent of your *state*: execution errors, revenge trading and oversizing rise. A daily limit removes the worst tail — the days that can do lasting damage.

### Calibrating with your data
Plot daily P&L in R. If your worst 5% of days are below −4R, and your daily limit is −3R, the limit would have bitten on those days. Check: were the losses after −3R mostly rule-following trades or emotional ones? That tells you whether the limit is protecting your edge or cutting it.

### Asymmetric limits
Some traders also cap *gains* per day (stop after +4R) to avoid giving back after euphoria. There is no theoretical case for capping profits on a positive-edge system, but if your journal shows that trades after big wins are worse, it is a reasonable behavioural rule.

### Prop-firm style rules
Funded-trader programmes often impose a daily loss limit and a trailing maximum drawdown. Trailing drawdowns based on peak equity (including open profits) can be much tighter than they appear — read the exact definition.` },
      { h: 'The maths', md: `**Setting limits on a ₹8 lakh account.**

:::formula
Per-trade risk R = 1% × capital
Daily limit = 2.5 × R
Weekly limit = 5 × R
:::

R = ₹8,000. Daily limit = ₹20,000. Weekly limit = ₹40,000.

**Worst-case week if limits hold.** Five days hitting the daily limit would be ₹1,00,000, but the weekly limit stops you at ₹40,000 — at most two full daily-limit days (or several partial ones), after which you stop for the rest of the week.

**Slippage beyond the limit.** If you are at −₹17,000 and hold 3 Nifty lots (195 units) with a 20-point stop, the planned loss is ₹3,900 → −₹20,900, already slightly over. The rule should be: *no new trade unless the full stop-loss fits inside the remaining daily allowance*. Remaining ₹3,000 at a 20-point stop allows at most 150 units → 2 lots (130 units, ₹2,600) on price risk alone. Charges also count against the allowance: about ₹940 per Nifty futures lot round trip (as of Nov 2026, [[widget:charges-india]]), so 2 lots really risk about ₹4,480 and only 1 lot (₹1,300 + ₹940 ≈ ₹2,240) fits.` },
      { h: 'India', md: `> [!india] Several Indian brokers provide a "kill switch" or segment-level disable for the day, and some allow a daily loss cap. Features and names vary by broker — check your broker's help pages (as of Nov 2026). SEBI's rules on algorithmic and API trading for retail clients are evolving; verify on sebi.gov.in if you automate limits through an API.` },
      { h: 'US & global', md: `> [!us] Many US platforms offer configurable daily loss limits and account locks. With FINRA's pattern-day-trader rule being replaced by risk-based intraday margin (SEC approval Apr 2026; broker implementation timing varies), small accounts may soon trade more frequently — which makes self-imposed limits more important, not less.` },
      { h: 'Common misconceptions', md: `- **"I'll stop when I feel I'm off."** The feeling arrives too late; that is why the limit is numeric.
- **"A daily limit costs me the recovery trades."** Recovery trades after a limit breach are, in many journals, the worst trades of the month.
- **"Limits are for beginners."** Professional desks impose them on experienced traders.
- **"I can move the limit if the setup is perfect."** A movable limit is not a limit.` },
      { h: 'When it fails', md: `Limits fail when they are not enforced or when one trade can blow through them.

**Example.** A trader with a ₹15,000 daily limit is at −₹12,000 by 11:30. He sells Bank Nifty options for "quick premium", 10 lots, with no stop. A 400-point move against him lifts the premium by about 160 points; on 10 lots (300 units) that costs ₹48,000 in an hour. The limit existed only on paper, and the last trade was sized for hope, not for the remaining allowance.` },
      { h: 'Exercise', md: `1. Write your per-trade, daily, weekly and monthly limits in the journal, in rupees and in R.
2. Configure any broker kill switch or loss cap you have access to, or set a phone alarm to check P&L every hour.
3. Review your last 20 trading days: on how many would the daily limit have triggered? What happened afterwards on those days?
4. Use [[widget:position-size]] to recompute size when your remaining daily allowance is less than one normal R.` },
    ],
    check: [
      { q: "Capital ₹6 lakh, per-trade risk 1%, daily limit 2.5R. You are down ₹12,000 today. What is the maximum risk on your next trade?", o: ["₹3,000","₹6,000","₹15,000","No trade allowed"], a: 0, why: "Daily limit = ₹15,000; remaining allowance ₹3,000, so the next trade's full stop must fit within ₹3,000." },
      { q: "Why might stopping after a daily limit improve results even with a positive-edge system?", o: ["It changes market probabilities","It lowers STT","It removes trades taken in a degraded state, which tend to have worse execution and expectancy","It guarantees a profitable week"], a: 2, why: "The statistical edge assumes rule-following; behaviour after losses often breaks the rules." },
      { q: "Which circuit breaker best addresses moving a stop-loss mid-trade?", o: ["A profit cap","A larger daily limit","A weekly review only","An error stop: any rule violation ends the trading day"], a: 3, why: "An error stop directly penalises rule breaks and prevents compounding them." },
    ],
    refs: ['Brett Steenbarger — The Daily Trading Coach (book)', 'Mark Douglas — Trading in the Zone (book)', 'Daniel Kahneman & Amos Tversky — Prospect Theory: An Analysis of Decision under Risk (Econometrica, 1979)', 'FINRA — Day trading and margin requirements (finra.org)'],
  },
  {
    id: 'l3-scaling', module: 'L3-M7', level: 3, track: 'risk', title: 'Trailing stops, partial exits and scaling', mins: 20,
    summary: 'Choose and apply trailing-stop methods, plan partial exits and scale in or out without increasing initial risk, and measure how each choice changes the distribution of R multiples.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `Once you are in a profitable trade, you face a choice: take the profit now, let it run, or something in between. Three tools help:

- **Trailing stop**: a stop that moves in your favour as price moves, locking in part of the gain.
- **Partial exit**: closing part of the position at a target and leaving the rest to run.
- **Scaling in**: adding to a winner as it confirms, without increasing your total risk beyond plan.

> [!evidence] Mixed: the arithmetic of each method is exact, but which method is "better" depends on the market's tendency to trend or mean-revert, which varies by instrument and period. There is no universally optimal trailing method.

Analogy: a mountaineer moving their safety rope up the cliff as they climb. Move it too close and any slip pulls you off; leave it too far and a fall is long.` },
      { h: 'Intermediate view', md: `### Trailing stop methods
| Method | Rule | Behaviour |
|---|---|---|
| Fixed points/percent | Trail X points behind the high | Simple; ignores volatility |
| ATR trail | High − k × ATR(14) (e.g. k = 2) | Adapts to volatility |
| Swing structure | Below the last higher low | Follows market structure |
| Moving average | Exit on close below EMA 20 | Smooth, laggy |
| Chandelier exit | Highest high since entry − k × ATR | Systematic; only ratchets in your favour |
| Supertrend | (High + Low) ÷ 2 − m × ATR, ratcheted (default 10, 3) | Flips side on a close through the line |
| Time-based | Exit at a fixed time (e.g. 15:15 IST) | Limits intraday exposure |

[[chart:NIFTY:93:st,ema20,atr]]

### Partial exits
A common plan: exit half at 1R, move the stop on the rest to breakeven, trail the remainder. This raises win rate and lowers variance, but it can reduce average R because the biggest winners are cut in half.

### Scaling in without adding risk
1. Enter 1/2 of the planned size with the stop at the logical level.
2. When price moves +1R and forms a new higher low, add the second half and move the stop for the whole position so that **total open risk does not exceed the original R**.
3. If the new stop cannot be placed without exceeding original risk, do not add.

### Scaling out on targets
Set targets at levels with a reason: prior day high, opening range extension, value-area high. Avoid round-R targets that ignore structure.` },
      { h: 'Advanced view', md: `### The trade-off you are choosing
- **Tight trails** convert more trades into small winners and scratches, cut large winners short, and reduce variance.
- **Loose trails** produce more give-backs but allow a few very large winners. Trend-following systems often depend on these few outliers.

Measure it: run the same entries with different exit rules and compare mean R, median R, standard deviation and maximum drawdown. Exits frequently matter more than entries for the overall distribution.

### Partial exits and expectancy
Taking partial profits is mathematically equivalent to running two separate positions with different exits. If the full-target exit has higher expectancy than the 1R partial, the partial lowers total expectancy — in exchange for psychological comfort and lower variance. That can be a reasonable trade-off, but it should be a conscious one.

### Adding to losers is not scaling
Averaging down increases risk on a trade that is proving you wrong. It is a different, much riskier strategy and is a common path to large losses for intraday traders.

### Intraday specifics
Trailing too tightly in the lunch lull gets you stopped on noise; widening trails into the final hour can expose you to closing-session volatility. Some traders switch from a structure trail to a time stop after 15:00 IST.` },
      { h: 'The maths', md: `**Partial exit worked example.**

Plan: long 2 lots Nifty futures (130 units), entry 24,200, stop 24,160 (R = 40 points = ₹5,200).

Scenario A (no partial): target 24,280 (2R) hit. Profit 80 × 130 = ₹10,400 = **+2R**.

Scenario B (half at 1R, rest stopped at breakeven): 65 units +40 = ₹2,600; 65 units 0. Total ₹2,600 = **+0.5R**.

Scenario C (half at 1R, rest at 2R): ₹2,600 + 65 × 80 = ₹5,200 → ₹7,800 = **+1.5R**.

**Scaling in without extra risk.** Initial 1 lot (65) at 24,200, stop 24,160 → risk ₹2,600 (half of the full R ₹5,200). Price rises to 24,240 and forms a higher low at 24,222. Add 1 lot at 24,240; move the combined stop to 24,222. If the combined stop is hit: lot 1 exits 22 points *above* its entry (+₹1,430) and lot 2 exits 18 points below its entry (−₹1,170). Net outcome at the stop ≈ +₹260 before charges — the position is now at full size with essentially no open *price* risk, versus ₹5,200 if you had entered both lots at 24,200. Charges on two Nifty futures lots are roughly ₹1,900 round trip (as of Nov 2026), so the realistic outcome at the stop is about −₹1,600; budget costs into the "no added risk" calculation.

**General rule for the combined stop.** For a long, total risk = Σ quantity × (entry − stop) must stay ≤ original R. With 65 at 24,200 and 65 at 24,240 (average 24,220), the lowest permissible combined stop is 24,220 − 5,200 ÷ 130 = 24,180.

**ATR trail.** ATR(14) on 5-min = 18 points, k = 2. Highest high since entry 24,310 → trail stop = 24,310 − 36 = 24,274.` },
      { h: 'India', md: `> [!india] With lot-based futures (Nifty 65, Bank Nifty 30 — as of Nov 2026, verify on NSE), partial exits require at least 2 lots. In cash equities any share quantity works. Each partial exit incurs its own costs (brokerage per order, STT on the sell side, exchange charges) — check them with [[widget:charges-india]]; many small partials can eat a small edge.` },
      { h: 'Common misconceptions', md: `- **"Moving the stop to breakeven quickly is always safer."** It often turns would-be winners into scratches; it changes, not removes, risk.
- **"Partial profits always increase profits."** They reduce variance; they may reduce expectancy.
- **"Scaling in means adding when price is cheaper."** That is averaging down. Scaling in adds to a position that is working.
- **"A trailing stop guarantees the locked profit."** Gaps and fast markets can fill stops well below the trail.` },
      { h: 'When it fails', md: `**Example.** On a strong trend day you trail Bank Nifty futures with a 30-point fixed trail on 1-min bars. You are stopped out at +1.1R after a normal pullback; price then extends another 400 points. On the next day — a choppy range — a loose 2-ATR trail on 15-min bars gives back an open +1.5R to finish at −0.2R. Neither trail was wrong; each was mismatched to the day type.` },
      { h: 'Exercise', md: `1. Take your last 30 trades. Recompute each with three exit rules: fixed 2R target, half at 1R plus breakeven stop, and a 2 × ATR trail.
2. Tabulate mean R, median R, win rate and largest winner for each.
3. In the Chart Lab, overlay {{st}} (Supertrend) and {{atr}} on Nifty and practise placing ATR trail levels by hand.
4. Use [[widget:rr]] to model the partial-exit scenarios above with your own numbers.` },
    ],
    check: [
      { q: "Long 2 lots, R = 40 points. You exit half at +40 and the rest is stopped at breakeven. Result in R for the whole position?", o: ["+1R", "+0.5R", "0R", "+2R"], a: 1, why: "Half the position earns 1R and half earns 0: total 0.5R." },
      { q: "Which describes scaling in correctly?", o: ["Adding to a working position while keeping total open risk within the original plan","Adding when price moves against you to lower average cost","Doubling size after a loss","Entering all at once at the open"], a: 0, why: "Scaling in adds to winners with a stop adjustment so total risk does not exceed plan; adding to losers is averaging down." },
      { q: "ATR(14) = 25, multiplier 2, highest high since entry 1,850. Where is the chandelier-style trailing stop?", o: ["1,825","1,875","1,800","1,775"], a: 2, why: "1,850 − 2 × 25 = 1,800." },
    ],
    refs: ['Van K. Tharp — Trade Your Way to Financial Freedom (book)', 'Chuck LeBeau & David Lucas — Technical Traders Guide to Computer Analysis of the Futures Market (book) — chandelier exit', 'J. Welles Wilder — New Concepts in Technical Trading Systems (book) — ATR', 'Curtis Faith — Way of the Turtle (book)'],
  },
  {
    id: 'l3-correlation', module: 'L3-M7', level: 3, track: 'risk', title: 'Correlated exposure and portfolio heat', mins: 20,
    summary: 'Measure total open risk (portfolio heat), recognise when several positions are really one bet, and cap correlated exposure across stocks, indices and derivatives.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Holding five different stocks feels diversified. But if all five are private banks, and you are also long Bank Nifty futures, you have one large bet on Indian banks. If the sector falls 2%, everything loses together.

**Portfolio heat** is the total amount you would lose if every open position hit its stop at once. **Correlation** measures how much positions tend to move together, from −1 (opposite) through 0 (unrelated) to +1 (lock-step).

> [!evidence] Established: correlation and portfolio-variance maths are standard (Markowitz portfolio theory). A key practical observation is that correlations between risky assets tend to rise in sell-offs, so diversification often weakens exactly when you need it.

Analogy: five umbrellas from the same factory with the same defect are not five independent umbrellas.` },
      { h: 'Intermediate view', md: `### Portfolio heat
:::formula
Heat = Σ (open risk of each position to its stop) ÷ capital
:::
A typical professional intraday cap: 2–4% of capital total, with no more than 1% per trade.

### Correlation groups
Group your positions by what drives them:
| Group | Examples |
|---|---|
| Index beta | Nifty futures, large-cap longs, Nifty options with positive delta |
| Banks/financials | HDFC Bank, ICICI Bank, Axis, Bank Nifty |
| IT/US-linked | Infosys, TCS, Nasdaq exposure, USD/INR |
| Commodities | Metals stocks, crude-linked names |

Rule of thumb: cap risk *per group* at around 1.5–2× a single trade's risk, regardless of how many tickers are in it.

### Practical checks before a new trade
1. What is my current heat? Does the new trade's full risk fit under the cap?
2. Which group does it belong to? Is that group already at its cap?
3. Is it on the same side as existing positions? Opposite-side positions in the same group (long ICICI, short Bank Nifty) partly offset.
4. Options: convert to delta-equivalent exposure (delta × lot × underlying move) to compare with futures.

[[widget:futures-exposure]]` },
      { h: 'Advanced view', md: `### Portfolio volatility with correlation
For two positions with risks σ₁ and σ₂ and correlation ρ:

:::formula
σ_portfolio = √(σ₁² + σ₂² + 2ρσ₁σ₂)
:::

With ρ near +1, risks simply add. With ρ = 0, they add in quadrature (less than the sum). With ρ negative, they offset.

### Correlation is unstable
Rolling 60-day correlations between Indian bank stocks can be high in normal markets and move closer to 1 in sharp sell-offs. Index heavyweights also drive the index itself, so a long in a top-weighted stock plus a long in Nifty is a doubled exposure.

### Beta-adjusted exposure
Convert stock positions to index-equivalent exposure: notional × beta. ₹10 lakh of a stock with beta 1.3 behaves like about ₹13 lakh of Nifty for market moves. Summing beta-adjusted notionals across positions gives net market exposure.

### Cross-market links
For Indian traders: US tech sell-offs overnight affect Indian IT; crude moves affect OMCs and paint companies; USD/INR affects IT and importers. For US traders: semiconductor names move together; mega-cap tech dominates index moves.

### Heat during the day
Heat falls as stops move to breakeven. A position with its stop above entry contributes zero (or negative) heat — that is when you can add new risk. Many traders track "open heat" on a single line in their trading screen.` },
      { h: 'The maths', md: `**Worked example — ₹10 lakh account, 1% per-trade risk (₹10,000), heat cap 3% (₹30,000), group cap 1.5% (₹15,000).**

Open positions:
| Position | Risk to stop | Group |
|---|---|---|
| Long HDFC Bank | ₹9,000 | Banks |
| Long ICICI Bank | ₹8,000 | Banks |
| Long Infosys | ₹7,000 | IT |

Heat = ₹24,000 (2.4%). Bank group = ₹17,000 — **over the ₹15,000 group cap**. A new Bank Nifty long is not allowed; a new long in an unrelated group with risk up to ₹6,000 fits under the overall cap.

**Correlation effect.** Two bank positions, each with a 1-standard-deviation daily risk of ₹9,000 and ₹8,000, correlation 0.8:
σ = √(9,000² + 8,000² + 2 × 0.8 × 9,000 × 8,000) = √(81 + 64 + 115.2) × 1,000 ≈ √260.2 × 1,000 ≈ **₹16,100** — almost the simple sum (₹17,000). At correlation 0 it would be √145 × 1,000 ≈ ₹12,000.` },
      { h: 'India', md: `> [!india] Nifty and Bank Nifty are heavily weighted towards a handful of stocks; HDFC Bank, ICICI Bank and Reliance together form a large share of Nifty (check current weights on niftyindices.com — as of Nov 2026). Being long two of those and Nifty futures is largely one index bet. Remember lot sizes: 1 Bank Nifty lot (30) at an illustrative 52,000 is ₹15.6 lakh notional.` },
      { h: 'US & global', md: `> [!us] In US markets, a handful of mega-cap technology stocks make up a large share of the S&P 500 and Nasdaq-100. Long NVDA, long AMD and long QQQ is mostly one semiconductor/tech bet. Sector ETFs (XLK, XLF, SMH) are useful proxies for grouping.` },
      { h: 'Common misconceptions', md: `- **"More tickers means more diversification."** Only if their drivers differ.
- **"Correlation is stable."** It changes, and rises in crises.
- **"Options positions are small because premium is small."** Delta-equivalent exposure can be large.
- **"Hedging with the index removes all risk."** It removes market beta; stock-specific risk remains.` },
      { h: 'When it fails', md: `**Example.** A trader holds five separate longs — two private banks, an NBFC, an insurer and Bank Nifty call options — each with "only" 0.8% risk. Heat looks like 4%, but all are financials. An RBI liquidity surprise at 10:00 hits all of them; slippage on stops pushes the realised loss to 5.6% in 15 minutes. The trader thought of five trades; the market treated them as one.` },
      { h: 'Exercise', md: `1. List your open or typical positions and assign each to a correlation group.
2. Compute heat and group heat. Set caps in your journal.
3. Use [[widget:futures-exposure]] and [[widget:greeks]] to convert any futures and options positions to notional and delta-equivalent exposure.
4. In the Chart Lab, compare HDFC-like and Bank Nifty-like charts on the same day and note how similar the intraday moves are.` },
    ],
    check: [
      { q: "Capital ₹5 lakh, heat cap 3%. Open risks: ₹5,000, ₹4,000, ₹3,500. What is the maximum risk for a new trade?", o: ["₹2,500", "₹15,000", "₹5,000", "₹12,500"], a: 0, why: "Cap = ₹15,000; current heat ₹12,500; remaining ₹2,500." },
      { q: "Two positions each with ₹10,000 one-SD risk and correlation 1.0. What is the combined one-SD risk?", o: ["₹10,000", "₹14,142", "₹20,000", "₹0"], a: 2, why: "With ρ = 1, risks add linearly: ₹20,000." },
      { q: "You are long ICICI Bank and long HDFC Bank. Which new trade adds the least correlated exposure?", o: ["Long Bank Nifty futures", "Long Axis Bank", "Short Bank Nifty futures sized to partly offset", "Long an NBFC"], a: 2, why: "A short in the same group partly offsets existing longs; the others add to the same bet." },
    ],
    refs: ['Harry Markowitz — Portfolio Selection (Journal of Finance, 1952)', 'Ralph Vince — The Handbook of Portfolio Mathematics (book)', 'Van K. Tharp — Definitive Guide to Position Sizing (book) — portfolio heat', 'NSE Indices — Index factsheets and weights (niftyindices.com)'],
  },
  );

  IA.content.questions.push(
  /* ---------- L3-M4 ---------- */
  { id: 'L3-M4-q01', module: 'L3-M4', d: 1, q: 'Which of these is best described as an established market-microstructure idea rather than a subjective framework?', o: ["Order blocks mark bank entries","Wyckoff Phase B always has falling volume","Fair value gaps always fill","Stop orders cluster near obvious levels and can accelerate moves when triggered"], a: 3, why: 'Order clustering and stop-driven price impact are documented microstructure findings; the others are framework claims without robust independent evidence.' },
  { id: 'L3-M4-q02', module: 'L3-M4', d: 2, q: 'A trader says: "That wick was a liquidity grab by smart money." What is the most defensible restatement?', o: ['Institutions bought at the low', 'Orders, possibly including triggered stops, were filled below the level and price did not continue lower', 'Retail traders were deliberately targeted', 'The level is now permanent support'], a: 1, why: 'The chart shows fills below a level and a recovery. Participant identity and intent cannot be observed on a retail feed.' },
  { id: 'L3-M4-q03', module: 'L3-M4', d: 2, q: 'Bar 1 low 1,240; bar 2 range 1,205–1,238; bar 3 high 1,219. Is there a bearish FVG, and where?', o: ['Yes, 1,219–1,240', 'Yes, 1,205–1,238', 'No, because bar 3 high is below bar 1 low only by chance', 'No FVG can be bearish'], a: 0, why: 'Bearish FVG: bar 3 high (1,219) is below bar 1 low (1,240), leaving the zone 1,219–1,240.' },
  { id: 'L3-M4-q04', module: 'L3-M4', d: 2, q: 'In an uptrend, what is a Change of Character (CHoCH) in SMC terms?', o: ["The first close below the most recent higher low","A close above the last swing high","Any red candle","A gap up at the open"], a: 0, why: 'A CHoCH is the first break of the trend-defining swing; a close above the swing high is a BOS (continuation).' },
  { id: 'L3-M4-q05', module: 'L3-M4', d: 3, q: 'You want to test whether order blocks add value. Which design is most informative?', o: ["Collect chart examples where OBs worked","Ask a course provider for their win rate","Fix a mechanical OB definition, test entries at OBs, and compare with entries at a control level (e.g. 50% retracement) using the same stops, targets and costs","Use higher-timeframe confluence until results improve"], a: 2, why: 'A fixed definition plus a control isolates whether the OB label adds anything beyond ordinary pullback entries.' },
  { id: 'L3-M4-q06', module: 'L3-M4', d: 2, q: 'In Wyckoff accumulation, what defines a spring?', o: ["A high-volume bar at the range top","The first bar of markup","An upthrust above resistance","A break below range support that quickly recovers back inside the range"], a: 3, why: 'A spring is a failed breakdown; it is confirmed only by the recovery back inside the range.' },
  { id: 'L3-M4-q07', module: 'L3-M4', d: 2, q: 'Why is Wyckoff phase labelling considered subjective?', o: ['Wyckoff never used volume', 'Phases such as selling climax or spring are often identifiable with confidence only after the range resolves, and similar ranges can be relabelled as accumulation or distribution', 'Exchanges prohibit it', 'It only works on crypto'], a: 1, why: 'Real-time ambiguity and flexible relabelling (re-accumulation, re-distribution) make the labels hard to falsify.' },
  { id: 'L3-M4-q08', module: 'L3-M4', d: 3, q: 'Volume bins: 50:3, 51:8, 52:16(POC), 53:12, 54:9, 55:2. Total 50; 70% target 35. Value area?', o: ["52–54","51–53","51–54","50–53"], a: 0, why: 'Start at the POC 16; neighbours 8 (51) vs 12 (53): add 12 → 28. Next neighbours 8 (51) vs 9 (54): add 9 → 37 ≥ 35. VA = 52–54.' },
  { id: 'L3-M4-q09', module: 'L3-M4', d: 2, q: 'Nifty futures open inside yesterday\'s value area. Under Auction Market Theory, what is the base case?', o: ["A trend day away from value","A guaranteed gap fill","Balance, with rotation around value and the prior POC","An upthrust"], a: 2, why: 'An open inside prior value suggests the market still accepts those prices; balance and rotation are the default scenario.' },
  { id: 'L3-M4-q10', module: 'L3-M4', d: 3, q: 'You short Nifty futures 3 lots (195 units) with a stop 42 points away. Your journal shows average stop slippage of 6 points at that time of day. Realistic risk?', o: ["₹8,190","₹8,970","₹7,020","₹9,360"], a: 3, why: '(42 + 6) × 195 = ₹9,360; the planned figure ignores slippage.' },
  { id: 'L3-M4-q11', module: 'L3-M4', d: 1, q: 'Market Profile and Auction Market Theory are most associated with which originator?', o: ['Richard Wyckoff', 'J. Peter Steidlmayer', 'J. Welles Wilder', 'Ralph Elliott'], a: 1, why: 'Steidlmayer developed Market Profile at the CBOT in the 1980s; Dalton and others extended AMT.' },
  { id: 'L3-M4-q12', module: 'L3-M4', d: 2, q: 'What is the best way to place a stop near an obvious equal-low cluster?', o: ['Exactly at the equal lows', 'A few ticks below the lows', 'Where the idea is invalidated, beyond the level plus a volatility buffer, with size reduced to fit risk', 'No stop; use a mental stop'], a: 2, why: 'Obvious levels attract sweeps; a volatility-based buffer and size adjustment keep risk constant while avoiding the crowd.' },
  { id: 'L3-M4-q13', module: 'L3-M4', d: 3, q: 'Bank Nifty sweeps the prior day low and reverses. Which explanation can you rule out from the chart alone?', o: ['Short covering by intraday traders', 'An option dealer hedging', 'Random fluctuation', 'None of these — the chart cannot distinguish among them'], a: 3, why: 'A sweep-and-reverse bar is consistent with many explanations; price data alone cannot identify participants.' },
  /* ---------- L3-M5 ---------- */
  { id: 'L3-M5-q01', module: 'L3-M5', d: 1, q: 'Which ratio measures return on all capital employed (equity plus debt)?', o: ["ROCE","ROE","P/E","EPS"], a: 0, why: 'ROCE = EBIT ÷ capital employed; ROE uses equity only.' },
  { id: 'L3-M5-q02', module: 'L3-M5', d: 2, q: 'Net profit ₹900 crore, 45 crore shares, price ₹1,100. EPS and P/E?', o: ['EPS ₹20, P/E 55', 'EPS ₹20, P/E 50', 'EPS ₹45, P/E 24', 'EPS ₹24, P/E 45'], a: 0, why: 'EPS = 900 ÷ 45 = ₹20; P/E = 1,100 ÷ 20 = 55.' },
  { id: 'L3-M5-q03', module: 'L3-M5', d: 2, q: 'Debt ₹2,400 crore, equity ₹800 crore. What is D/E and what does it suggest for intraday risk?', o: ["0.33; very low leverage","1.0; neutral","3.0; high leverage, greater event and downgrade risk","30; impossible"], a: 2, why: '2,400 ÷ 800 = 3.0. High leverage increases sensitivity to adverse news.' },
  { id: 'L3-M5-q04', module: 'L3-M5', d: 2, q: 'A stock closes at ₹750 before its ex-dividend date; dividend ₹15. It opens at ₹737. On an adjusted basis, the move is…', o: ["−1.7%","−2.0%","0%","About +0.3%"], a: 3, why: 'Adjusted reference ≈ ₹735; ₹737 is about ₹2 higher, roughly +0.3%.' },
  { id: 'L3-M5-q05', module: 'L3-M5', d: 3, q: 'You hold 400 shares long at ₹1,500 with a stop at ₹1,480 into an after-hours results release. The stock opens at ₹1,410. Approximate loss?', o: ['₹8,000', '₹36,000', '₹20,000', '₹4,000'], a: 1, why: 'The stop cannot fill until the open: (1,500 − 1,410) × 400 = ₹36,000, far above the planned ₹8,000.' },
  { id: 'L3-M5-q06', module: 'L3-M5', d: 2, q: 'Rights issue: 1 new for every 5 held at ₹300; stock price ₹420. Theoretical ex-rights price?', o: ['₹400', '₹360', '₹410', '₹420'], a: 0, why: 'TERP = (5 × 420 + 1 × 300) ÷ 6 = 2,400 ÷ 6 = ₹400.' },
  { id: 'L3-M5-q07', module: 'L3-M5', d: 2, q: 'RBI MPC cuts the repo rate by 25 bp as fully expected but signals concern about liquidity. Bank Nifty spikes then falls. Which lesson applies?', o: ["When a decision is priced, guidance and details drive the sustained reaction","Decisions are always bullish","MPC decisions do not affect banks","Always buy before the decision"], a: 0, why: 'The surprise lies in guidance; the initial spike is often a headline reaction.' },
  { id: 'L3-M5-q08', module: 'L3-M5', d: 2, q: 'Around what time (ET) are the FOMC statement and press conference released?', o: ["08:30 and 09:30","10:00 and 11:00","14:00 and 14:30","16:00 and 16:30"], a: 2, why: 'The FOMC statement is at 14:00 ET with the press conference at 14:30 ET (verify on federalreserve.gov).' },
  { id: 'L3-M5-q09', module: 'L3-M5', d: 3, q: 'Risk budget ₹7,000. Your logged reaction to US NFP in GIFT Nifty is about 90 points. Nifty lot 65. How many lots can you hold through?', o: ["0 lots","2 lots","3 lots","1 lot"], a: 3, why: '7,000 ÷ 90 ≈ 77 units, so 1 lot (65). Two lots would risk about ₹11,700.' },
  { id: 'L3-M5-q10', module: 'L3-M5', d: 2, q: 'US CPI comes in at consensus, but the prior month is revised up sharply. How should you read it?', o: ['A neutral print — nothing changed', 'Potentially hawkish, because revisions alter the inflation picture', 'Bullish because the headline matched', 'Irrelevant to equities'], a: 1, why: 'Revisions are part of the surprise; markets react to the full information set, not just the headline.' },
  { id: 'L3-M5-q11', module: 'L3-M5', d: 1, q: 'India CPI is published by which body?', o: ['RBI', 'SEBI', 'MoSPI (National Statistics Office)', 'NSE'], a: 2, why: 'CPI is released by the Ministry of Statistics and Programme Implementation; RBI uses it for policy.' },
  { id: 'L3-M5-q12', module: 'L3-M5', d: 3, q: 'A stock\'s ATM straddle costs ₹42 on a ₹700 stock the day before results. You want gap risk ≤ ₹6,000. Approximate maximum position?', o: ['About 140 shares', 'About 1,000 shares', 'About 6,000 shares', 'About 60 shares'], a: 0, why: 'Implied move ≈ 42 ÷ 700 = 6% ≈ ₹42 per share; 6,000 ÷ 42 ≈ 143 shares.' },
  { id: 'L3-M5-q13', module: 'L3-M5', d: 2, q: 'Why do long options bought just before a scheduled release often disappoint?', o: ["Implied volatility usually falls after the event, so a smaller-than-priced move can lose money","STT doubles on event days","Options cannot be traded on event days","Delta becomes zero"], a: 0, why: 'IV rises into events and drops afterwards; vega losses can offset directional gains.' },
  /* ---------- L3-M6 ---------- */
  { id: 'L3-M6-q01', module: 'L3-M6', d: 1, q: 'What makes a trading hypothesis testable?', o: ["It is based on a famous indicator","It has a high win rate","It specifies exact conditions, entry, stop, exit, universe and success criteria so it can be proven wrong","It is endorsed by a mentor"], a: 2, why: 'Falsifiability requires precise, pre-defined rules and decision criteria.' },
  { id: 'L3-M6-q02', module: 'L3-M6', d: 2, q: 'n = 64 trades, mean R = +0.25, SD = 1.6R. t-statistic?', o: ['1.25', '2.5', '0.16', '4.0'], a: 0, why: 'SE = 1.6 ÷ 8 = 0.2; t = 0.25 ÷ 0.2 = 1.25.' },
  { id: 'L3-M6-q03', module: 'L3-M6', d: 3, q: 'Mean R = 0.12, SD = 1.2R. Approximately how many trades are needed for t = 3?', o: ["300","100","3,000","900"], a: 3, why: 'n ≈ (3 × 1.2 ÷ 0.12)² = 30² = 900.' },
  { id: 'L3-M6-q04', module: 'L3-M6', d: 2, q: 'A rule uses the day\'s closing VWAP to decide a 10:30 entry. Which bias is this?', o: ['Survivorship', 'Look-ahead', 'Selection', 'Recency'], a: 1, why: 'The full-day VWAP is not known at 10:30; using it leaks future information.' },
  { id: 'L3-M6-q05', module: 'L3-M6', d: 2, q: 'n = 225, mean R = 0.18, SD = 1.5R. What is the approximate 95% confidence interval for mean R?', o: ['−0.02 to 0.38', '0.08 to 0.28', '0.15 to 0.21', '−0.18 to 0.54'], a: 0, why: 'SE = 1.5 ÷ √225 = 1.5 ÷ 15 = 0.10; 0.18 ± 2 × 0.10 = −0.02 to 0.38. The interval includes zero, so the edge is not yet established.' },
  { id: 'L3-M6-q06', module: 'L3-M6', d: 3, q: 'You tried 50 parameter combinations; the best has t = 2.4. What is the most reasonable view?', o: ["Weak evidence; after 50 trials a t of 2.4 is quite plausible by chance — test on untouched data","Strong evidence of an edge","Proof the strategy works in all markets","The result should be doubled for safety"], a: 0, why: 'Multiple testing inflates false positives; Bonferroni would demand a much higher threshold.' },
  { id: 'L3-M6-q07', module: 'L3-M6', d: 2, q: 'In a bar-by-bar backtest, when is a limit buy at ₹500 safely counted as filled?', o: ["When the bar low equals ₹500","Whenever the bar opens above ₹500","When price trades through ₹500 (e.g. low ₹499.80)","At the bar close regardless"], a: 2, why: 'A touch does not guarantee a fill due to queue position; trade-through is the conservative rule.' },
  { id: 'L3-M6-q08', module: 'L3-M6', d: 2, q: 'Which split best protects against overfitting?', o: ["Optimise on all data, then test on all data","Test only on the most volatile year","Use the period with the best results","Develop on earlier data and test once on a held-out later period"], a: 3, why: 'A single, untouched out-of-sample test gives an honest estimate; repeated peeking destroys it.' },
  { id: 'L3-M6-q09', module: 'L3-M6', d: 2, q: 'Long 1 lot Nifty futures, entry 24,300, stop 24,260, exit 24,360. Charges (about ₹940 per lot round trip as of Nov 2026) plus slippage come to about 15 points. Net R?', o: ['1.5R', '1.125R', '1.25R', '0.75R'], a: 1, why: '(60 − 15) ÷ 40 = 1.125R. Ignoring charges would report 1.5R; on a 40-point stop, costs are over a third of R.' },
  { id: 'L3-M6-q10', module: 'L3-M6', d: 3, q: 'A backtest of a small-cap momentum strategy uses only companies listed today. Results look strong. What is the main concern?', o: ["Survivorship bias — failed and delisted companies are missing","Look-ahead in indicators","Too few parameters","Costs are too high"], a: 0, why: 'Excluding companies that failed removes many losers, inflating returns.' },
  { id: 'L3-M6-q11', module: 'L3-M6', d: 2, q: 'What does walk-forward analysis evaluate?', o: ["One optimal parameter for all time","Only the latest month","The performance of a process of periodic re-optimisation, measured on successive out-of-sample windows","The number of indicators used"], a: 2, why: 'It rolls an optimisation window forward and stitches together out-of-sample segments.' },
  { id: 'L3-M6-q12', module: 'L3-M6', d: 3, q: 'Your strategy shows mean +0.30R over 120 trades, but removing the top 4 trades drops it to +0.02R. What does this tell you?', o: ["The strategy is robust","Outliers should be deleted permanently","The SD must be zero","Results depend on a few outliers; the estimate is fragile and needs a larger sample or a skew-aware assessment"], a: 3, why: 'Heavy dependence on a few trades indicates high uncertainty in the mean.' },
  { id: 'L3-M6-q13', module: 'L3-M6', d: 1, q: 'A Monte Carlo reshuffle of a trade list mainly helps you understand…', o: ['Which indicator to use', 'The range of drawdowns and streaks possible with the same edge', 'Exchange charges', 'Future news events'], a: 1, why: 'Reordering outcomes shows sequence risk and plausible drawdowns.' },
  /* ---------- L3-M7 ---------- */
  { id: 'L3-M7-q01', module: 'L3-M7', d: 1, q: 'An account falls from ₹4 lakh to ₹3 lakh. What gain is needed to recover?', o: ["33.3%","25%","20%","50%"], a: 0, why: 'Drawdown 25%; gain needed = 0.25 ÷ 0.75 = 33.3%.' },
  { id: 'L3-M7-q02', module: 'L3-M7', d: 2, q: 'Risk 1% per trade compounded. Approximately how much drawdown do 12 consecutive losses produce?', o: ["−12%","−10%","−11.4%","−8.9%"], a: 2, why: '1 − 0.99^12 ≈ 1 − 0.886 = 11.4%.' },
  { id: 'L3-M7-q03', module: 'L3-M7', d: 3, q: 'Simple risk-of-ruin model: p = 0.55, even payoff. Ruin is 10 units away versus 20 units away. Approximately how do the probabilities compare?', o: ['They are equal', 'About 13% versus about 2%', 'About 2% versus about 13%', 'Both are zero'], a: 1, why: '(0.45 ÷ 0.55)^10 ≈ 0.134; ^20 ≈ 0.018. Halving risk per trade doubles the units to ruin and sharply cuts the probability.' },
  { id: 'L3-M7-q04', module: 'L3-M7', d: 2, q: 'Kelly fraction for p = 0.5, payoff b = 1.5?', o: ['16.7%', '33%', '50%', '0%'], a: 0, why: 'f* = 0.5 − 0.5 ÷ 1.5 = 0.5 − 0.333 = 0.167.' },
  { id: 'L3-M7-q05', module: 'L3-M7', d: 2, q: 'Capital ₹12 lakh, per-trade risk 0.75%, daily limit 3R. What is the daily limit in rupees?', o: ["₹9,000","₹36,000","₹18,000","₹27,000"], a: 3, why: 'R = ₹9,000; 3R = ₹27,000.' },
  { id: 'L3-M7-q06', module: 'L3-M7', d: 3, q: 'You are at −₹16,000 with a daily limit of ₹20,000. Your next Bank Nifty futures setup has a 50-point stop (lot 30). Counting price risk only (ignore charges), maximum lots?', o: ['0', '2', '3', '4'], a: 1, why: 'Remaining ₹4,000; one lot risks 50 × 30 = ₹1,500; 2 lots = ₹3,000 fits, 3 lots = ₹4,500 does not. In practice add charges (roughly ₹930 per Bank Nifty lot round trip as of Nov 2026): 2 lots then risk about ₹4,860, so only 1 lot truly fits.' },
  { id: 'L3-M7-q07', module: 'L3-M7', d: 2, q: 'Long 4 lots, R = 30 points. You sell 2 lots at +30 and the remainder hits +90. Result in R for the whole position?', o: ['+2R', '+1.5R', '+3R', '+1R'], a: 0, why: 'Half earns 1R, half earns 3R: average (1 + 3) ÷ 2 = 2R.' },
  { id: 'L3-M7-q08', module: 'L3-M7', d: 2, q: 'Which practice increases risk on a trade that is going against you?', o: ["Averaging down","Scaling in after confirmation with a tighter combined stop","Taking a partial exit","Trailing a stop"], a: 0, why: 'Averaging down adds exposure to a losing idea; the others reduce or hold risk.' },
  { id: 'L3-M7-q09', module: 'L3-M7', d: 2, q: 'ATR(14) = 14, multiplier 2.5, highest high since entry 2,460. Trailing stop?', o: ['2,425', '2,446', '2,432', '2,474'], a: 0, why: '2,460 − 2.5 × 14 = 2,460 − 35 = 2,425.' },
  { id: 'L3-M7-q10', module: 'L3-M7', d: 3, q: 'Two positions with one-SD risk ₹6,000 and ₹8,000, correlation 0. Combined one-SD risk?', o: ["₹14,000","₹2,000","₹10,000","₹7,000"], a: 2, why: '√(6,000² + 8,000²) = √(36 + 64) × 1,000 = ₹10,000.' },
  { id: 'L3-M7-q11', module: 'L3-M7', d: 2, q: 'Capital ₹8 lakh, heat cap 2.5%. Open risks ₹7,000, ₹6,000 and ₹4,000. Maximum risk on a new trade?', o: ['₹3,000', '₹20,000', '₹0', '₹8,000'], a: 0, why: 'Cap = ₹20,000; current heat ₹17,000; remaining ₹3,000.' },
  { id: 'L3-M7-q12', module: 'L3-M7', d: 3, q: 'You hold long HDFC Bank, long ICICI Bank and long Bank Nifty call options. A colleague says you are diversified across three instruments. What is the best response?', o: ["Agreed — three instruments","Options remove the correlation","Diversification only matters overnight","They share the same driver (banking sector), so treat them as one correlated group with a group risk cap"], a: 3, why: 'All three are driven largely by bank-sector moves; correlation, not ticker count, determines diversification.' },
  { id: 'L3-M7-q13', module: 'L3-M7', d: 1, q: 'Why do correlations matter more in sell-offs?', o: ['They usually fall to zero', 'Correlations between risky assets tend to rise, so diversification weakens when it is most needed', 'Exchanges suspend correlation', 'They only affect bonds'], a: 1, why: 'Stress episodes commonly show rising co-movement among risky assets.' },
  );
})(typeof window !== 'undefined' ? window : globalThis);
