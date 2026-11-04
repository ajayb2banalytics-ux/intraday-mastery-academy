/* Level 2 lessons, part A: L2-M1 to L2-M4 (market structure, intraday levels and volume, indicators with context, multi-timeframe analysis) + module assessments. */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  IA.content.lessons = IA.content.lessons || []; IA.content.questions = IA.content.questions || [];
  /* ===================== L2-M1 Market structure, support and resistance ===================== */
  IA.content.lessons.push(
  {
    id: 'l2-dow', module: 'L2-M1', level: 2, track: 'ta', title: 'Dow Theory and trend definition', mins: 16,
    summary: 'Define an uptrend, downtrend and range objectively using swing highs and lows, and recognise when a trend definition has actually changed.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `Before you can trade "with the trend" you need a definition of a trend that two people looking at the same chart would agree on. Most beginners use a feeling: "it looks like it is going up". Feelings change with every candle. A definition does not.

Charles Dow, who co-founded the Wall Street Journal in the late 1800s, wrote a series of editorials about how markets move. Later writers (William Hamilton, Robert Rhea) organised those ideas into what we now call **Dow Theory**. The single most useful idea from it for an intraday trader is simple:

- An **uptrend** is a series of **higher highs (HH) and higher lows (HL)**.
- A **downtrend** is a series of **lower highs (LH) and lower lows (LL)**.
- Anything else — overlapping highs and lows — is a **range** or a transition.

Think of a staircase. Going up, every step is above the previous one and every landing is above the previous landing. If you suddenly find a landing below the last one, you are no longer sure you are climbing.

Why this matters: almost every setup you will learn later (pullbacks, breakouts, VWAP reclaims) behaves differently in a trend than in a range. Getting the context wrong is one of the most common reasons a "good-looking" setup loses.

> [!evidence] The swing-high/swing-low definition is a **convention**, not a law of nature. It is useful because it is objective and repeatable. Whether trends persist (time-series momentum) has real but **mixed** empirical support that varies by market, timeframe and period.` },
      { h: 'Intermediate view', md: `### Defining a swing point
You need a rule for what counts as a swing high or low, or you will see a "new trend" on every tick. A common rule:

- **Swing high**: a bar whose high is higher than the highs of the N bars on each side (N = 2 or 3 is typical on a 5-minute chart).
- **Swing low**: a bar whose low is lower than the lows of the N bars on each side.

Note the consequence: a swing point is only **confirmed N bars later**. With N = 2 on a 5-minute chart, you know about a swing low ten minutes after it printed. That is built-in lag, and you cannot remove it.

### The six original tenets (paraphrased)
1. The averages discount everything — known information is reflected in price.
2. The market has three movements: primary (months to years), secondary (weeks to months, counter-trend), minor (days).
3. Primary trends have phases (accumulation, public participation, distribution) — see [[link:l2-phases]].
4. The averages should confirm each other (originally Industrials and Rails).
5. Volume should confirm the trend.
6. A trend persists until a definite reversal signal appears.

For intraday use, map the "three movements" to your timeframes: the daily chart is your primary trend, the 15-minute is the secondary swing, the 5- or 1-minute is the minor move. See [[link:l2-mtf]].

### Reading the chart
[[chart:NIFTY:11:ema20,vol]]

On the chart above, mark each confirmed swing high and low with a dot. Label them HH, HL, LH or LL. You will usually find a stretch of clean HH/HL, a stretch of overlap, and possibly a stretch of LH/LL. Your job is not to predict the next label; it is to know which regime you are in **right now**.

### Execution rules that follow from the definition
- In an uptrend, look for long entries near a **higher low** forming; your stop logically goes below that higher low, because if it breaks, your definition is broken.
- The trend is "intact" until price closes below the most recent confirmed higher low. Many traders require a **close**, not a wick, to reduce noise.` },
      { h: 'Advanced view', md: `### Break of structure vs change of character
Professionals separate two events:

- **Continuation break**: in an uptrend, price takes out the prior swing high. The trend continues.
- **First failure**: price breaks the last higher low. The uptrend definition is now broken, but you do **not** yet have a downtrend — you have a lower low but no lower high. This is a transition.
- **Confirmed reversal**: after the failure, a rally fails below the previous high (a lower high), then price breaks again to a new low.

Traders who flip from long to short on the first failure often get chopped up; markets frequently break a low, run stops and resume. Traders who wait for the full LH + LL sequence give up a large part of the move. There is no free lunch — it is a trade-off between early and reliable.

### Fractal nature and conflicting timeframes
The 5-minute chart can show a perfect downtrend while the daily is in a strong uptrend. That 5-minute downtrend is just a pullback in daily terms. Neither is "wrong". The question is which timeframe your trade lives on: your stop, target and holding time define it.

### Confirmation (tenet 4) in modern form
Dow wanted the Industrials and Rails to agree. Modern intraday equivalents: Nifty and Bank Nifty agreeing; SPY and QQQ agreeing; a stock agreeing with its sector index. Disagreement is information — it often marks narrower, choppier days — but it is not a reliable timing signal on its own.

### Volume (tenet 5)
Expanding volume on impulse legs and contracting volume on pullbacks is the textbook healthy trend. In practice intraday volume is dominated by the time-of-day pattern (high at open and close, low at lunch), so compare volume with the **same time of day** on previous sessions rather than with the previous bar.` },
      { h: 'The maths', md: `A trend definition can be made fully mechanical. Using N = 2 fractals:

:::formula
Swing high at bar t  if  High(t) > max(High(t-2), High(t-1), High(t+1), High(t+2))
Swing low at bar t   if  Low(t)  < min(Low(t-2), Low(t-1), Low(t+1), Low(t+2))
Uptrend   if  last SH > previous SH  AND  last SL > previous SL
Downtrend if  last SH < previous SH  AND  last SL < previous SL
:::

### Worked example (illustrative Nifty 5-minute data)
Confirmed swings in sequence: SL 24,812 → SH 24,905 → SL 24,860 → SH 24,948 → SL 24,901.

- Highs: 24,905 then 24,948 — higher high.
- Lows: 24,812 → 24,860 → 24,901 — higher lows.
- Definition: **uptrend**. Invalidation level: close below 24,901.

Now price falls to 24,885 (closes below 24,901). Uptrend broken. Next rally peaks at 24,930 (below 24,948) — a lower high. Then price closes below 24,885 at 24,870 — lower low. Now the definition says **downtrend**, with invalidation above 24,930.

Notice how much price movement passed between "uptrend intact" (24,948 high) and "downtrend confirmed" (24,870): 78 points. That gap is the cost of an objective definition.` },
      { h: 'India', md: `Suppose Bank Nifty opens at 56,200 (illustrative) and the 5-minute chart prints SL 56,120, SH 56,380, SL 56,240, SH 56,510. Uptrend. A trader plans a long on the next higher low, which forms at 56,330.

- Entry: 56,360 on a bullish close above the prior bar's high.
- Stop: 56,315 (just below the 56,330 higher low) — 45 points.
- One Bank Nifty futures lot is 30 units (as of Jan 2026 contracts — verify on nseindia.com), so risk = 45 × 30 = ₹1,350 before costs.
- First target: the prior swing high retest at 56,510 (+150 points) — 3.3R gross.

Meanwhile check Nifty: if Nifty is printing lower highs, the Dow "confirmation" idea warns you this is a less clean day. You may halve size rather than skip the trade.

> [!india] On NSE stocks like RELIANCE or HDFCBANK, apply the same swing rules, but the first 15 minutes after 09:15 IST often produce erratic swings. Many traders only start labelling swings after 09:30.` },
      { h: 'US & global', md: `On SPY (illustrative prices), a 5-minute sequence of SL 581.20 → SH 583.40 → SL 582.10 → SH 584.00 is an uptrend; invalidation is a close below 582.10. Compare with QQQ: if QQQ is making lower highs while SPY makes higher highs, leadership is narrowing.

For NVDA, which can move 3–5% intraday on news, use N = 3 on the 5-minute chart to avoid labelling every wiggle as a swing. The US regular session runs 09:30–16:00 ET; swings formed in pre-market are on thin volume and are better treated as reference levels than as trend structure.` },
      { h: 'Common misconceptions', md: `- **"One lower low means the trend has reversed."** It means the uptrend definition failed. A downtrend needs a lower high as well.
- **"Dow Theory predicts."** It describes the current state. Any predictive value comes from trend persistence, which is mixed and regime-dependent.
- **"Wicks and closes are the same."** Choose one and stick to it. Close-based rules give fewer false breaks but later signals.
- **"Swing points are visible in real time."** They are only confirmed N bars after they form.
- **"Dow Theory is outdated."** Its averages (Industrials and Rails) are dated; the higher-high/higher-low logic is still the basis of most trend definitions, including SMC "break of structure".` },
      { h: 'When it fails', md: `- **Ranges and lunchtime chop.** Between roughly 11:30 and 13:30 IST, Nifty often oscillates with overlapping swings. The definition flips back and forth and every flip is a losing signal.
- **News shocks.** An RBI policy surprise or a US CPI print can gap through several swing levels at once; structure built before the event becomes irrelevant.
- **Losing example.** Nifty 5-minute: HL at 24,900, you go long at 24,925 with a stop at 24,895. Price dips to 24,890 (stop hit, −35 points × 65 = −₹2,275 per lot), then rallies to 25,000. The low was a stop run, not a reversal. The definition was correctly followed and still lost — that is normal and must be budgeted for in your position sizing.` },
      { h: 'Exercise', md: `1. Open the Chart Lab with preset NIFTY and two different seeds. Turn on ema20 and vol.
2. Using N = 2, mark every confirmed swing high and low. Write the label sequence in your journal (for example HL, HH, HL, HH, LL, LH, LL).
3. For each regime change, record: the price where the old trend failed, the price where the new trend was confirmed, and the points between them.
4. Repeat on SPY. Compare how often the definition flipped per session.
5. Use [[widget:position-size]] to size a hypothetical long with the stop below the latest higher low.` },
    ],
    check: [
      { q: 'Nifty 5-min makes HH 24,950, then breaks its last HL at 24,900 and closes at 24,880. What is the most accurate description?', o: ['A confirmed downtrend', 'The uptrend definition has failed; a downtrend is not yet confirmed', 'The uptrend is intact because the daily is up', 'A range, so short the next high'], a: 1, why: 'Breaking the last higher low invalidates the uptrend, but a downtrend also needs a lower high followed by a lower low. Option A jumps ahead; C mixes timeframes; D assumes a range without evidence.' },
      { q: 'Why does a swing-point trend definition always have lag?', o: ['Because exchanges delay data', 'Because volume must confirm first', 'Because a swing point is only confirmed after N subsequent bars fail to exceed it', 'It has no lag; it is visible instantly'], a: 2, why: 'A fractal swing needs N bars on its right side; you cannot know a low was the low until later bars stay above it.' },
      { q: 'SPY prints higher highs but QQQ prints lower highs on the same morning. How should a Dow-style trader read this?', o: ['As a sell signal for SPY', 'As proof institutions are distributing', 'As irrelevant', 'As non-confirmation: a weaker, narrower context that may justify smaller size'], a: 3, why: 'Non-confirmation is context, not a timing signal. It does not prove institutional distribution.' },
    ],
    refs: ['Robert Rhea — The Dow Theory (book)', 'John J. Murphy — Technical Analysis of the Financial Markets (book)', 'Moskowitz, Ooi, Pedersen — Time Series Momentum, Journal of Financial Economics (2012)'],
  },
  {
    id: 'l2-sr', module: 'L2-M1', level: 2, track: 'ta', title: 'Support, resistance, supply and demand', mins: 17,
    summary: 'Identify support and resistance zones objectively, grade their quality, and plan trades around them without treating them as walls.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `**Support** is a price area where falling prices have repeatedly stopped and turned up. **Resistance** is an area where rising prices have repeatedly stopped and turned down. The words supply and demand describe the same thing from the order-book side: at support, buying interest (demand) was enough to absorb selling; at resistance, selling interest (supply) absorbed buying.

An analogy: a busy market stall that sells mangoes for ₹100 a kilo has many buyers queued at that price. If the price drops to ₹90, the queue grows and the price is pushed back up. ₹90 acts as support. But if a truck of fresh mangoes arrives, ₹90 can break easily. Levels hold until something changes the balance.

Why it matters to you: support and resistance give you **places to make decisions** — where to enter, where to put a stop, where to take profit. They are not guarantees that price will turn.

> [!evidence] Price clustering at round numbers and at prior highs and lows is documented, and order books often show resting liquidity there. Whether lines drawn by traders have **predictive** value beyond that is **mixed** — some of the effect is self-fulfilling because many traders watch the same levels.` },
      { h: 'Intermediate view', md: `### Zones, not lines
Draw support and resistance as **zones** a few ticks wide. Use wick extremes and the cluster of closes near them. For Nifty on a 5-minute chart a zone of 10–20 points is typical; for Bank Nifty 30–60 points.

### Where the strongest intraday levels come from
| Level | Why it matters |
|---|---|
| Previous day high / low / close | Widely watched; stop orders cluster beyond them |
| Opening range high / low | Reflects the first auction of the day — see [[link:l2-opening-range]] |
| Round numbers (25,000, 56,000, 600) | Option strikes and human anchoring |
| Prior swing highs / lows | Where the last battle was decided |
| VWAP and volume-profile POC | Volume-weighted fair value — see [[link:l2-volume-profile]] |

### Grading a level
Score each level 0–2 on: number of touches, how sharply price reacted, recency, timeframe it was formed on, and whether it aligns with another level. A level formed on the daily chart that also coincides with a round number beats a single 1-minute touch.

### Role reversal
Broken resistance often becomes support (and vice versa). The logic: traders who sold at resistance and were proven wrong may buy back at break-even; buyers who missed the breakout wait for a retest. This is a **tendency**, not a rule.

### Executing at a level
1. Do not buy just because price touches support. Wait for evidence of rejection: a bullish close back inside the zone, a higher low on a lower timeframe, or a VWAP reclaim.
2. Stop below the zone, not inside it, plus a buffer of roughly 0.2–0.3 × ATR.
3. Target the next opposing level.

[[chart:BANKNIFTY:23:vwap,vol,vp]]` },
      { h: 'Advanced view', md: `### Why levels exist: resting orders and stops
Limit orders rest below the market (bids) and above it (offers). Stop orders cluster just beyond obvious levels. When price reaches an obvious low, two things happen: resting bids absorb selling, and stop-loss sell orders below the low trigger. Which effect dominates decides whether the level holds or breaks. This is why many obvious levels are **briefly breached** before reversing — the stops supply liquidity to larger buyers. See [[link:l2-breakouts]].

> [!warn] "Supply and demand zones" are often marketed as places where "institutions left unfilled orders". That is a narrative. You cannot see those orders on a chart, and institutional jargon is not proof of institutional activity. Treat zones as areas of prior interest only.

### Freshness and decay
Each test of a level consumes some of the resting interest. A third or fourth test is frequently weaker than the first. Some traders grade "fresh" levels (untested) above "tested" levels for this reason. It is a reasonable hypothesis that you should test in your own journal rather than assume.

### Level density and expected move
If the next resistance is closer than your stop distance, the trade has poor reward-to-risk regardless of how good the support looks. Professionals check the **room to the next level** before the level quality.

### Time of day
The same Nifty level behaves differently at 09:20 (high volume, wide ranges) versus 12:30 (thin, mean-reverting). Expect more breakouts early and late, and more holds in midday.` },
      { h: 'The maths', md: `Reward-to-risk at a level:

:::formula
Risk per unit   = Entry − (Zone low − Buffer)
Reward per unit = Next resistance − Entry
R multiple      = Reward ÷ Risk
Buffer          = k × ATR(14), with k ≈ 0.2–0.3
:::

### Worked example (Nifty, illustrative)
- Support zone: 24,780–24,795 (previous day low plus a round-number area).
- 5-minute ATR(14) = 22 points; buffer = 0.25 × 22 = 5.5 → 6 points.
- Stop = 24,780 − 6 = 24,774.
- Entry after a bullish rejection close: 24,805.
- Risk = 24,805 − 24,774 = 31 points.
- Next resistance (VWAP): 24,868. Reward = 63 points. R = 63 ÷ 31 ≈ 2.0.
- Nifty futures lot 65 (as of Jan 2026 contracts — verify on nseindia.com): risk = 31 × 65 = ₹2,015; reward = ₹4,095 gross.

If VWAP were at 24,830 instead, reward = 25 points, R ≈ 0.8 — skip, even though the support itself is strong.` },
      { h: 'India', md: `RELIANCE (illustrative): previous day low ₹1,402, a round number at ₹1,400 and a prior swing low at ₹1,398. That is a **cluster** zone ₹1,398–1,402.

- Morning: price falls to ₹1,399.20, prints a long lower wick and closes ₹1,403.50 on the 5-minute.
- Entry ₹1,404, stop ₹1,396.50 (below zone with buffer) = ₹7.50 risk per share.
- With a ₹5,000 risk budget: 5,000 ÷ 7.50 = 666 shares (≈ ₹9.35 lakh notional — check your intraday margin).
- Target: opening-range high ₹1,419 = ₹15 reward, 2R.

> [!india] Option strikes act as visible reference points: Nifty strikes in 50-point steps and Bank Nifty in 100-point steps (strike intervals as of Nov 2026 — verify on nseindia.com) often line up with intraday S/R, plausibly because round numbers attract attention and option hedging flows can concentrate near large open interest. Treat this as context, not a signal.` },
      { h: 'US & global', md: `On NVDA (illustrative), the prior day's high of $186.40 and the $185 round number create a zone. A clean break and hold above $186.40 in the first hour often attracts momentum participants; a fast rejection back below $185 often traps them. On SPY, whole-dollar and 5-dollar levels (580, 585) often coincide with heavy option open interest. In both cases, check the room to the next level before entering.` },
      { h: 'Common misconceptions', md: `- **"Support is a floor."** It is an area where buyers previously outnumbered sellers. Conditions change.
- **"More touches = stronger."** Sometimes. Repeated tests can also exhaust buyers, and the fifth test breaks.
- **"Precise lines."** A level drawn to the paisa invites stop hunts and false precision. Use zones.
- **"Supply/demand zones show institutional orders."** They show where price moved fast in the past. That is all a chart can show.
- **"Buy at support, always."** Only with room to the next level and a defined stop beyond the zone.` },
      { h: 'When it fails', md: `- **Trend days.** On a strong trend day, every support breaks. Fading levels against a trend is the most expensive version of this mistake.
- **Event days.** RBI policy, US CPI or FOMC can push through every zone.
- **Losing example.** Bank Nifty support 55,900–55,950. You buy 55,980, stop 55,860 (120 points). Price breaks 55,900 on rising volume, Nifty is also making lower lows, and you are stopped: −120 × 30 = −₹3,600 per lot plus costs. The warning signs (market-wide weakness, expanding volume into the level) were visible; the level alone was not enough.` },
      { h: 'Exercise', md: `1. In the Chart Lab, load BANKNIFTY with vp and vwap. Mark the three strongest zones using the grading table (touches, reaction, recency, timeframe, confluence).
2. For each, compute R to the next opposing level using [[widget:rr]].
3. Journal: which zone did price respect, and which did it break? Note the time of day of each test.
4. Repeat for SPY and compare how often round numbers mattered.` },
    ],
    check: [
      { q: 'A Nifty support zone looks excellent, but the next resistance is 18 points away and your stop must be 30 points away. What should you do?', o: ['Take it; strong support matters most', 'Skip or wait: reward-to-risk is below 1', 'Widen the target beyond resistance', 'Tighten the stop inside the zone'], a: 1, why: 'Room to the next level decides R. Tightening a stop inside the zone puts it where normal noise will hit it; moving the target ignores the obstacle.' },
      { q: 'Why are obvious lows often briefly breached before price reverses?', o: ['Clustered stop orders below the low supply liquidity that larger buyers can absorb', 'Exchanges manipulate prices', 'Indicators lag', 'It never happens'], a: 0, why: 'Stops beyond obvious levels become market orders when triggered, giving liquidity to opposite-side participants. No manipulation is needed to explain it.' },
      { q: 'Which statement is honest about supply and demand zones?', o: ['They reveal unfilled institutional orders', 'They are established science', 'They are areas of prior fast movement; any institutional story is unverifiable from a chart', 'They work best on news days'], a: 2, why: 'A chart shows only past prices and volume, not who traded or what is unfilled.' },
    ],
    refs: ['John J. Murphy — Technical Analysis of the Financial Markets (book)', 'Carol Osler — Support for Resistance: Technical Analysis and Intraday Exchange Rates, FRBNY Economic Policy Review (2000)', 'Larry Harris — Trading and Exchanges (book)'],
  },
  {
    id: 'l2-trendlines', module: 'L2-M1', level: 2, track: 'ta', title: 'Trendlines and channels', mins: 15,
    summary: 'Draw trendlines and channels consistently, use them as dynamic reference zones, and understand why they are among the most subjective tools in TA.',
    evidence: 'subjective',
    sections: [
      { h: 'Beginner view', md: `A **trendline** is a straight line connecting two or more swing lows in an uptrend (or swing highs in a downtrend). It turns the staircase of higher lows into a sloping line you can project forward. A **channel** adds a parallel line through the opposite swings, framing the trend.

Analogy: a road with a slope. The trendline is the kerb; the channel's other line is the opposite kerb. Cars (prices) mostly stay in their lane, but they can and do leave the road.

Why it matters: trendlines give you a **dynamic** reference — a level that moves with time — where horizontal support cannot.

> [!evidence] Trendlines are **subjective**. Two traders will often draw different lines on the same chart, and the choice of anchor points (wicks or closes, which swings) changes the conclusion. Treat them as a visual aid for structure, not an objective signal.` },
      { h: 'Intermediate view', md: `### Drawing rules that reduce subjectivity
1. Use **confirmed** swing points only (see [[link:l2-dow]]).
2. Choose wicks or closes and be consistent. Wicks are standard for intraday.
3. Two points draw a line; a **third touch validates** it. Until then it is a hypothesis.
4. Do not redraw the line to make it fit a new wick. If price closes beyond it, the line is broken.
5. Prefer lines with a moderate slope. Very steep lines (a parabolic burst) break quickly; very flat lines are really horizontal levels.

### Channels
Draw the trendline, then copy it parallel to the most significant opposite swing. In an uptrend channel:
- Lower line: potential pullback-buy area.
- Upper line: potential profit-taking area, not automatically a short.
- Mid-line: often acts as minor support or resistance.

### Trading the line
- **Bounce**: wait for a rejection candle at the line, enter on its break, stop beyond the line plus a buffer.
- **Break**: a close beyond the line ends the trendline; it does not prove a reversal. Combine with horizontal structure: a trendline break **plus** a break of the last higher low is far more meaningful than either alone.

[[chart:NIFTY:31:ema20,ema50]]

Compare the trendline with the 20 EMA on the chart. They often track each other because both summarise the recent slope — a point we return to in [[link:l2-confluence]].` },
      { h: 'Advanced view', md: `### Log vs linear scale
On a daily chart covering big moves (NVDA, mid-caps), a trendline on a linear scale and on a log scale can be in quite different places. Intraday the difference is negligible because the price range is small. Know which you are using.

### Lines are hypotheses that decay
Each new bar moves the line's value. Over long projections, small anchor differences become large price differences: a 0.5-point-per-bar slope error over 60 five-minute bars is 30 points of Nifty. Lines drawn days ago are much weaker than lines drawn from this morning's swings.

### Fan lines and acceleration
When a trend accelerates, traders draw a second, steeper line. When it breaks, they fall back to the first line. This is a way of tracking slope change, which a moving-average slope or linear-regression slope measures more objectively.

### Objective alternatives
- **Linear regression channel**: a least-squares line through closes with bands at ±2 standard deviations. Fully reproducible.
- **Donchian channel**: highest high and lowest low over N bars — see [[link:l2-volatility]].
- **Moving-average envelopes / Keltner channels.**
If your strategy depends on trendlines, test whether a reproducible equivalent captures the same behaviour. If it does not, your edge may be in discretionary drawing that you cannot measure.` },
      { h: 'The maths', md: `A trendline is a linear equation through two anchor points.

:::formula
slope m  = (P2 − P1) ÷ (t2 − t1)
Line(t)  = P1 + m × (t − t1)
:::

### Worked example (Bank Nifty 5-minute, illustrative)
- Swing low 1 at bar 10: 55,840. Swing low 2 at bar 22: 55,960.
- m = (55,960 − 55,840) ÷ (22 − 10) = 120 ÷ 12 = 10 points per bar.
- Projected line at bar 34: 55,840 + 10 × 24 = 56,080.
- Price at bar 34 dips to 56,085 and closes at 56,120 — a third touch.
- Long at 56,130, stop 56,050 (line minus a 30-point buffer), risk 80 points × 30 = ₹2,400 per lot.
- Channel top: parallel through the swing high at bar 28 of 56,210. Channel width = 56,210 − (55,840 + 10 × 18) = 56,210 − 56,020 = 190 points. Upper line at bar 34 = 56,080 + 190 = 56,270. Target 56,260: reward 130 points, ≈1.6R.

Notice the line rises 10 points per bar: if you wait 6 bars for a better entry, the line has moved 60 points.` },
      { h: 'India', md: `On a trending NSE stock such as TCS on a 15-minute chart, a rising trendline through two morning lows can be used to trail a stop: each bar, move the stop to the line value minus a buffer. This gives a stop that rises at the trend's own pace. Exit on a 15-minute close below the line. Check sector context (Nifty IT) before trusting a break — a stock trendline breaking while the sector is strong is often just noise.` },
      { h: 'US & global', md: `In QQQ or NVDA during a strong first hour, very steep lines form from the 09:30 ET low. These usually break by mid-morning simply because the pace is unsustainable, not because a reversal starts. A common professional response is to tighten stops on the steep-line break but keep a core position until horizontal structure (a lower low) breaks.` },
      { h: 'Common misconceptions', md: `- **"The more lines, the better."** A chart covered in lines will always have one that "worked". That is hindsight.
- **"A trendline break is a reversal signal."** It is the end of one slope. Reversal needs structure change.
- **"Redraw to fit."** Adjusting the line after a break destroys any discipline the line provided.
- **"Trendlines are objective."** They are among the most subjective tools; label them as such in your journal.` },
      { h: 'When it fails', md: `- In ranges, lines are drawn from random swings and break constantly.
- In fast trends the line lags far behind price; stops based on it become too wide.
- **Losing example.** Nifty 5-minute rising line with three touches. You buy the fourth touch at 24,920, stop 24,900. A Fed-related headline hits; price slices the line and closes at 24,880. Loss 20 points × 65 = −₹1,300 per lot. The line had worked three times; the fourth time context changed. A line never knows about news.` },
      { h: 'Exercise', md: `1. In the Chart Lab load NIFTY with ema20 and ema50. Draw a trendline using only confirmed swing lows, before advancing the chart.
2. Advance bar by bar. Record each touch and whether it held, and the bar where it broke.
3. Ask a friend (or yourself a day later) to draw the line independently. Measure how far apart the two lines are at the latest bar — that gap is your subjectivity.
4. Compare the trendline with the 20 EMA: how often did both "hold" together?` },
    ],
    check: [
      { q: 'Swing lows: 24,800 at bar 5 and 24,860 at bar 17. What is the projected line at bar 29?', o: ['24,880', '24,860', '24,900', '24,920'], a: 3, why: 'Slope = 60 ÷ 12 = 5 points per bar. Bar 29 is 24 bars after bar 5: 24,800 + 5 × 24 = 24,920.' },
      { q: 'Price closes below your validated uptrend line but the last higher low is still intact. What is the best reading?', o: ['Confirmed downtrend; go short', 'The slope has changed; the structure has not yet broken', 'Redraw the line through the new low', 'Ignore it'], a: 1, why: 'A trendline break ends a slope. The Dow structure is only broken when the last higher low fails. Redrawing after the fact removes discipline.' },
      { q: 'Why might a linear regression channel be preferred in a backtest?', o: ['It is reproducible: the same data always give the same line', 'It is more profitable', 'It has no lag', 'Institutions use it'], a: 0, why: 'Reproducibility is required for testing. No claim of extra profitability or zero lag is justified.' },
    ],
    refs: ['John J. Murphy — Technical Analysis of the Financial Markets (book)', 'Edwards and Magee — Technical Analysis of Stock Trends (book)', 'Thomas Bulkowski — Encyclopedia of Chart Patterns (book)'],
  },
  {
    id: 'l2-breakouts', module: 'L2-M1', level: 2, track: 'ta', title: 'Breakouts, retests and false breakouts', mins: 18,
    summary: 'Distinguish breakouts that follow through from false breakouts, choose between breakout and retest entries, and plan the failed-breakout trade.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `A **breakout** happens when price moves beyond a clear level — a range high, previous day high or trendline — and keeps going. A **false breakout** (also called a fakeout or failed breakout) moves beyond the level, then quickly comes back inside. A **retest** is when price breaks out, pulls back to the broken level, and holds it.

Analogy: a crowd pushing on a gate. Sometimes the gate opens and everyone pours through (breakout). Sometimes it opens a little, the guard pushes it shut, and everyone who stepped through gets squeezed back (false breakout).

Why it matters: breakouts are where the biggest intraday moves start — and where many beginners lose money buying the top of a spike.

> [!evidence] Momentum after range breaks has **mixed** support; false breakouts are common. The mechanics of why stops cluster beyond levels are **established** market microstructure. Never assume a given breakout will follow through.` },
      { h: 'Intermediate view', md: `### What tends to separate real from false breakouts
| Factor | Stronger breakout | Weaker breakout |
|---|---|---|
| Range before break | Tight, contracting (coil) | Wide, sloppy |
| Close | Bar closes well beyond level | Only a wick pokes through |
| Volume | Above normal for that time of day | Below normal |
| Higher timeframe | Breaking in direction of daily trend | Against it |
| Market context | Index and sector also breaking | Index flat or opposite |
| Time of day | First 90 minutes, last hour | Midday lull |

None of these is decisive alone. Count how many line up.

### Three entry styles
1. **Breakout entry**: stop-buy a few ticks above the level. You never miss the move, but you take every false break.
2. **Close-confirmation entry**: buy only after a bar closes beyond the level. Fewer false entries; worse price.
3. **Retest entry**: wait for a pullback to the broken level and a hold. Best price and tightest stop, but many strong breakouts never retest — you miss them.

### Stops
- Breakout entry: stop back inside the range, typically below the breakout bar's low or the midpoint of the range.
- Retest entry: stop below the retest low.

[[chart:RELIANCE:47:vol,vwap,atr]]` },
      { h: 'Advanced view', md: `### The failed-breakout trade
When a breakout fails, everyone who bought the break and placed a stop just inside the range becomes a forced seller if price keeps falling. That adds fuel to the move back through the range. Many experienced intraday traders specialise in **fading failed breakouts**: wait for price to break out, then close back inside the range; enter short on a break of the failure bar's low with a stop above the failed high. Target the opposite side of the range.

This is the mirror of the stop-run logic in [[link:l2-sr]]. Neither direction is "smart money"; it is order-flow mechanics around a well-known level.

### Measuring follow-through
Decide in advance how long a breakout has to prove itself. For example: "If price is not at least 0.5 × ATR beyond the level within three 5-minute bars, exit at break-even or small loss." Breakouts that stall are more likely to fail.

### Volume caveats
Intraday volume is time-of-day-driven, so compare breakout volume with average volume for the same bar slot. On index futures, volume around 09:15–09:30 IST is naturally huge, so "high volume" at the open says little.

### Gaps
A gap above resistance is a breakout that happened overnight. Whether gaps fill or extend is covered in [[link:l2-opening-range]]; treat the first 15 minutes after a gap breakout with extra caution.` },
      { h: 'The maths', md: `### Range and measured target
:::formula
Range height H        = Range high − Range low
Measured target       = Breakout level + H
Breakout buffer       = 0.1 × ATR to 0.2 × ATR above level
Follow-through test   = price ≥ level + 0.5 × ATR within k bars
:::

### Worked example (Nifty, illustrative)
- Morning range 24,860–24,910, H = 50 points. 5-minute ATR = 20.
- Stop-buy at 24,910 + 0.15 × 20 = 24,913.
- Stop at range mid-point 24,885: risk 28 points.
- Measured target 24,910 + 50 = 24,960: reward 47 points, R ≈ 1.7.
- Follow-through rule: within 3 bars price should reach 24,910 + 10 = 24,920.
- Per Nifty futures lot (65): risk ₹1,820, reward ₹3,055 gross.

The measured-move target is a **convention** with no guarantee; use it as a planning reference and pair it with the next real level.

### Expectancy of a breakout plan
If you win 40% of breakout trades at +1.7R and lose 60% at −1R, expectancy = 0.4 × 1.7 − 0.6 × 1 = +0.08R before costs. Small edges like this are easily wiped out by slippage on fast breakouts. Use [[widget:expectancy]] with your own journal numbers — these numbers are illustrative, not a claim about breakouts in general.` },
      { h: 'India', md: `RELIANCE (illustrative) consolidates ₹1,410–1,418 for 45 minutes after a news-free open, with volume drying up. At 10:40 IST, a 5-minute bar closes at ₹1,421.50 with volume 1.8 times the average for that slot; Nifty is also making a new high of day.

- Close-confirmation entry ₹1,422, stop ₹1,415.80 (below breakout bar's low), risk ₹6.20.
- Measured target ₹1,418 + 8 = ₹1,426 — only ₹4 away, under 1R. The next level, the previous day high at ₹1,431, gives ₹9 reward: 1.45R.
- Decision: valid but marginal; take half size, or wait for a retest of ₹1,418.

> [!india] Many NSE stocks have fixed price bands (circuit limits); near the upper circuit, trading can freeze with only buyers or only sellers, and you may not be able to exit. Stocks in the F&O segment instead use dynamic price bands that the exchange can widen. Check the applicable band on nseindia.com before trading a breakout near it.` },
      { h: 'US & global', md: `NVDA (illustrative) breaks the previous day's high of $186.40 at 09:45 ET with strong volume, runs to $188.10, then by 10:15 is back at $185.90 — inside the prior range. That is a textbook failed breakout. A fade short below $185.80 with a stop above $188.20 risks $2.40 per share; the previous day low near $181.50 is a target $4.30 away (≈1.8R). In SPY the same patterns occur around the opening range and the previous day's high and low; liquidity is deep, so slippage is lower than in single stocks.` },
      { h: 'Common misconceptions', md: `- **"Volume confirms every breakout."** Volume helps but must be compared with the same time of day.
- **"Retests always happen."** Many of the strongest breakouts never retest.
- **"A false breakout means manipulation."** It usually means not enough new buyers arrived after stops were triggered.
- **"Measured moves are targets price must reach."** They are conventions.
- **"Breakouts work best when everyone is watching."** Obvious levels attract more stop orders, which also makes false breaks more likely.` },
      { h: 'When it fails', md: `- Midday breakouts on low volume.
- Breakouts against the daily trend or against the index.
- Breakouts just before scheduled news (US CPI at 08:30 ET, RBI policy at 10:00 IST).
- **Losing example.** Bank Nifty breaks 56,400 at 12:10 IST on below-average volume; you buy 56,415, stop 56,340. It stalls at 56,430 for four bars (fails your follow-through test, but you ignore it), then drops back to 56,330. Loss 75 points × 30 = −₹2,250 per lot plus costs. Had you applied the follow-through exit, you would have lost about 15 points instead.` },
      { h: 'Exercise', md: `1. In the Chart Lab load RELIANCE with vol and atr. Find two ranges.
2. For each breakout, score the six factors in the table (0 or 1 each) before advancing the chart.
3. Record the outcome. After 20 breakouts, compare the average score of winners and losers in your journal.
4. Practise all three entry styles on the same breakout and compare entry price, stop distance and whether you were filled.
5. Use [[widget:expectancy]] with your own win rate and average R.` },
    ],
    check: [
      { q: 'A range is 24,860–24,910. Using the measured-move convention, where is the target for an upside break?', o: ['24,935', '24,910', '24,960', '25,010'], a: 2, why: 'Height 50 points added to the breakout level: 24,910 + 50 = 24,960.' },
      { q: 'NVDA breaks yesterday\'s high, then closes back inside the range 20 minutes later. Which plan reflects the mechanics?', o: ['Buy more; it will break again', 'Hold the long because volume was high', 'Assume manipulation and stop trading', 'Consider a fade below the failure bar with a stop above the failed high'], a: 3, why: 'Trapped breakout buyers and their stops can fuel a move back through the range. That is the failed-breakout setup, with a defined stop.' },
      { q: 'What is the main trade-off of retest entries compared with stop-buy breakout entries?', o: ['Retests have wider stops', 'Retests give better price and tighter stops but miss breakouts that never pull back', 'Retests are always more profitable', 'There is no difference'], a: 1, why: 'Waiting improves location but reduces participation in the strongest moves.' },
    ],
    refs: ['Linda Bradford Raschke and Laurence Connors — Street Smarts (book)', 'Thomas Bulkowski — Encyclopedia of Chart Patterns (book)', 'Larry Harris — Trading and Exchanges (book)', 'Carol Osler — Currency Orders and Exchange Rate Dynamics: An Explanation for the Predictive Success of Technical Analysis, Journal of Finance (2003)'],
  },
  {
    id: 'l2-phases', module: 'L2-M1', level: 2, track: 'ta', title: 'Market phases: accumulation, markup, distribution, markdown', mins: 15,
    summary: 'Recognise the four-phase market cycle on intraday and daily charts and adapt which setups you trade in each phase.',
    evidence: 'subjective',
    sections: [
      { h: 'Beginner view', md: `Markets tend to alternate between **ranges** and **trends**. One popular way to describe the cycle uses four phases:

1. **Accumulation** — a sideways range after a decline. Selling dries up; buyers start absorbing supply.
2. **Markup** — an uptrend of higher highs and higher lows.
3. **Distribution** — a sideways range after a rise. Buyers are exhausted; sellers supply into strength.
4. **Markdown** — a downtrend of lower highs and lower lows.

Analogy: seasons. Not every year has the same weather, and the seasons do not announce themselves in advance, but knowing whether you are in summer or winter changes what you wear.

Why it matters: a breakout strategy loses money in a range; a range-fading strategy loses money in a trend. Phase awareness tells you which tool belongs in your hand.

> [!evidence] The **range vs trend** distinction is objective and measurable (for example with ADX or range width). The labels "accumulation" and "distribution" imply knowledge of who is buying and selling, which a chart cannot reveal — that interpretation is **subjective**. You only know which it was after the breakout.` },
      { h: 'Intermediate view', md: `### Identifying the phase objectively
| Phase | Structure | Volatility | Typical tools |
|---|---|---|---|
| Range after decline | Overlapping swings | Contracting | Range fades, wait for break |
| Markup | HH + HL | Expanding on impulses | Pullback longs, trailing stops |
| Range after rise | Overlapping swings | Often wide and erratic | Range fades, wait for break |
| Markdown | LH + LL | Often fast | Pullback shorts |

Practical checks:
- Is price making HH/HL or LH/LL? (see [[link:l2-dow]])
- Is the 20 EMA sloping or flat, and is price crossing it repeatedly?
- Is ADX rising above roughly 20–25 or falling? (see [[link:l2-trend-tools]])
- Is Bollinger Band width contracting? (see [[link:l2-volatility]])

### Intraday version
A single session often follows a mini-cycle: opening range (range), a trend leg, a midday range, and sometimes an afternoon trend. Practitioners often observe Bank Nifty trending in the first 60–90 minutes and ranging through lunch; this matches the well-documented U-shaped pattern of intraday volume and volatility (high at open and close), but it is a tendency, not a schedule.

[[chart:MIDCAP:58:ema20,adx,vol]]

### What to do in each phase
- Range: trade from edges back to the middle with small targets, or stand aside until a break.
- Trend: trade pullbacks in the trend direction; do not fade.
- Transition (range forming after trend): reduce size; this is where both styles struggle.` },
      { h: 'Advanced view', md: `### The Wyckoff framing
Richard Wyckoff's method (covered fully in [[link:l3-wyckoff]]) adds events inside accumulation and distribution: selling climax, spring, upthrust, sign of strength. These are useful vocabulary, but they are identified with hindsight much more easily than in real time.

### Same range, two outcomes
A range after a rise can resolve upward (re-accumulation, then further markup) or downward (distribution, then markdown). Before the break the chart looks identical. Honest professionals therefore plan **both** outcomes: a long trigger above the range and a short trigger below, with the higher-timeframe trend tilting size or priority.

### Volatility clustering
Volatility tends to cluster — calm periods follow calm, volatile follows volatile — which is one of the better-established facts in finance. A contracting range is therefore a reasonable warning that expansion may come, but it says **nothing** about direction.

### Regime filters
Quantitative traders replace phase labels with regime filters: ADX threshold, efficiency ratio, or slope of a long moving average. A filter that switches off a breakout system during low-ADX periods is the measurable version of "don't trade breakouts in accumulation". Test it; do not assume it helps.` },
      { h: 'The maths', md: `### Efficiency ratio (Kaufman) as a phase measure
:::formula
ER = |Close(t) − Close(t−n)| ÷ Σ |Close(i) − Close(i−1)|  over the n bars
ER near 1 → trending;  ER near 0 → ranging
:::

### Worked example (n = 5, illustrative Nifty 15-minute closes)
Closes: 24,800, 24,830, 24,815, 24,850, 24,870, 24,900.
- Net change = 24,900 − 24,800 = 100.
- Sum of absolute bar changes = 30 + 15 + 35 + 20 + 30 = 130.
- ER = 100 ÷ 130 ≈ 0.77 → strongly directional.

Compare closes 24,800, 24,830, 24,795, 24,825, 24,790, 24,810:
- Net = 10. Sum = 30 + 35 + 30 + 35 + 20 = 150. ER ≈ 0.07 → range.

Many traders treat ER above about 0.5 as trend and below about 0.3 as range on their chosen timeframe. These thresholds are conventions; calibrate them on your own data.` },
      { h: 'India', md: `Through a typical session, Bank Nifty might open at 56,000, rally to 56,450 by 10:30 IST (markup, ER high), range between 56,300 and 56,450 until 13:30 (ER low), then either break higher or fall back. A trader who bought pullbacks in the morning should switch to small range trades or stand aside at midday, then re-engage on a break with confirmation.

On the daily chart of a mid-cap stock, months of sideways movement after a fall, followed by a high-volume breakout, are often labelled "accumulation" after the fact. Before the breakout, the same range could equally have broken down.` },
      { h: 'US & global', md: `SPY often shows a trend in the first hour, a lull from about 11:30 to 14:00 ET, and renewed activity into the close. NVDA around earnings can move from a tight multi-day range to a large gap; volatility contraction before the event says something big may happen, not which way. DAX shows similar cycles around the European open and the US open overlap.` },
      { h: 'Common misconceptions', md: `- **"I can tell accumulation from distribution in real time."** Usually only after the break.
- **"Every range is accumulation by institutions."** Institutional jargon is not evidence.
- **"Phases are regular and timed."** They vary greatly in length and often skip steps.
- **"Contracting volatility predicts direction."** It hints at a coming expansion, not its direction.` },
      { h: 'When it fails', md: `- Ranges that break both ways (a false break one side, then a real break the other).
- Event days that jump from range straight into a gap trend.
- **Losing example.** A Nifty midday range 24,850–24,890 that you label "accumulation" after a morning rally. You buy 24,860 with a stop at 24,840, expecting markup. The range breaks down on European-open selling; stopped for −20 × 65 = −₹1,300 per lot. The label created a bias; an objective plan would have had both a long and a short trigger.` },
      { h: 'Exercise', md: `1. In the Chart Lab load MIDCAP with ema20 and adx. Mark each segment as trend or range using structure and ADX only.
2. Compute the efficiency ratio for three 5-bar windows by hand and check that it agrees with your labels.
3. For one range, write a two-sided plan (long trigger, short trigger, stops, targets) before advancing the chart.
4. Journal which side triggered and whether your "accumulation/distribution" guess was right.` },
    ],
    check: [
      { q: 'Closes over 5 bars net +20 points with total absolute bar changes of 160 points. What does the efficiency ratio suggest?', o: ['Range-like, choppy conditions', 'Strong trend', 'A breakout has started', 'Accumulation by institutions'], a: 0, why: 'ER = 20 ÷ 160 = 0.125, which is low and choppy. ER cannot tell you who is trading.' },
      { q: 'A tight range forms after a strong rally. What can you honestly conclude?', o: ['It is distribution', 'It is re-accumulation', 'An expansion is plausible but direction is unknown; plan both sides', 'Price must fall'], a: 2, why: 'Volatility clustering hints at expansion; the label is only knowable after the break.' },
      { q: 'Which tool belongs in a confirmed markup phase?', o: ['Fading every new high', 'Waiting for accumulation', 'Selling options at random', 'Buying pullbacks with stops below higher lows'], a: 3, why: 'In a trend, pullback entries in the trend direction align with the structure; fading fights it.' },
    ],
    refs: ['Richard D. Wyckoff — Studies in Tape Reading (book)', 'Perry Kaufman — Trading Systems and Methods (book)', 'Rama Cont — Empirical properties of asset returns: stylized facts and statistical issues, Quantitative Finance (2001)'],
  },
  );
  IA.content.questions.push(
  { id: 'L2-M1-q01', module: 'L2-M1', d: 1, q: 'In Dow Theory terms, what defines an uptrend?', o: ['Price above the 200 SMA', 'Rising volume', 'Green candles outnumber red', 'Higher highs and higher lows'], a: 3, why: 'The swing definition is higher highs and higher lows; the others are proxies or unrelated.' },
  { id: 'L2-M1-q02', module: 'L2-M1', d: 2, q: 'Nifty 5-min swings: SL 24,700, SH 24,790, SL 24,740, SH 24,820, SL 24,760. Where does the uptrend definition fail?', o: ['A close above 24,820', 'A close below 24,760', 'A close below 24,700', 'A close below 24,790'], a: 1, why: 'The most recent higher low is 24,760; closing below it breaks the HL sequence.' },
  { id: 'L2-M1-q03', module: 'L2-M1', d: 2, q: 'You buy Bank Nifty futures (1 lot, 30 units) at 56,250 with a stop at 56,190 below support. What is your gross risk?', o: ['₹3,900', '₹600', '₹1,800', '₹1,950'], a: 2, why: '60 points × 30 = ₹1,800 (before costs).' },
  { id: 'L2-M1-q04', module: 'L2-M1', d: 2, q: 'Why draw support and resistance as zones rather than exact lines?', o: ['Order interest and stops spread around a level, and a precise line invites noise stops and false precision', 'Charts are inaccurate', 'Zones guarantee a reversal', 'Exchanges require it'], a: 0, why: 'Liquidity and reactions are spread around levels; zones reflect that reality.' },
  { id: 'L2-M1-q05', module: 'L2-M1', d: 3, q: 'Support 24,790–24,800, ATR 20, buffer 0.25 × ATR, entry 24,812, next resistance 24,872. What is the R multiple?', o: ['1.6', '2.9', '2.2', '3.0'], a: 2, why: 'Buffer = 0.25 × 20 = 5, so stop = 24,790 − 5 = 24,785; risk = 24,812 − 24,785 = 27; reward = 24,872 − 24,812 = 60; R = 60 ÷ 27 ≈ 2.2.' },
  { id: 'L2-M1-q06', module: 'L2-M1', d: 2, q: 'Two swing lows: 56,000 at bar 4 and 56,090 at bar 13. What is the trendline value at bar 22?', o: ['56,150', '56,180', '56,200', '56,120'], a: 1, why: 'Slope = 90 ÷ 9 = 10 per bar; bar 22 is 18 bars after bar 4 → 56,000 + 180 = 56,180.' },
  { id: 'L2-M1-q07', module: 'L2-M1', d: 1, q: 'Which statement about trendlines is honest?', o: ['They are objective', 'They never break', 'They are subjective; anchor choice changes the line', 'They have no lag'], a: 2, why: 'Different anchors and wick/close choices give different lines; this is why trendlines are labelled subjective.' },
  { id: 'L2-M1-q08', module: 'L2-M1', d: 3, q: 'A breakout at 12:15 IST has volume below the slot average, Nifty is flat and the daily trend is down. How many of the "stronger breakout" factors are present?', o: ['Most of them', 'Almost none — this is a low-quality breakout', 'Exactly half', 'It cannot be assessed'], a: 1, why: 'Midday, low relative volume, no index confirmation and against the daily trend all point to a weaker breakout.' },
  { id: 'L2-M1-q09', module: 'L2-M1', d: 2, q: 'A breakout plan wins 40% at +1.5R and loses 60% at −1R. What is the gross expectancy per trade?', o: ['+0.10R', '0.00R', '−0.10R', '+0.40R'], a: 1, why: '0.4 × 1.5 − 0.6 × 1 = 0.6 − 0.6 = 0. After costs it would be negative.' },
  { id: 'L2-M1-q10', module: 'L2-M1', d: 2, q: 'SPY breaks yesterday\'s high, fails, and closes back inside the range. Which describes the failed-breakout mechanics?', o: ['Institutions manipulated it', 'It is a guaranteed reversal', 'It means nothing', 'Breakout buyers are trapped and their stops inside the range can fuel a move lower'], a: 3, why: 'Trapped longs and triggered stops are the order-flow logic; nothing is guaranteed and no manipulation claim is needed.' },
  { id: 'L2-M1-q11', module: 'L2-M1', d: 3, q: 'You see a tight range after a long rally on the daily chart of a mid-cap. What is the most defensible plan?', o: ['Label it distribution and short', 'Label it re-accumulation and buy', 'Prepare long and short triggers; let the break decide, tilting priority with the higher-timeframe trend', 'Avoid the stock forever'], a: 2, why: 'Accumulation vs distribution is only knowable after the break.' },
  { id: 'L2-M1-q12', module: 'L2-M1', d: 2, q: 'Closes over 5 bars: net change 90 points; sum of absolute changes 100 points. Efficiency ratio?', o: ['0.90', '0.09', '1.11', '0.50'], a: 0, why: 'ER = 90 ÷ 100 = 0.90, a strongly directional move.' },
  { id: 'L2-M1-q13', module: 'L2-M1', d: 2, q: 'Why is broken resistance often watched as new support?', o: ['It is a law of markets', 'Traders who sold there and missed the breakout may now buy at that price; it is a tendency, not a rule', 'Exchanges move the level', 'Indicators say so'], a: 1, why: 'Role reversal is behavioural and order-flow based, and frequently fails.' },
  );
  /* ===================== L2-M2 Intraday reference levels and volume ===================== */
  IA.content.lessons.push(
  {
    id: 'l2-opening-range', module: 'L2-M2', level: 2, track: 'ta', title: 'Opening range, previous-day levels and gaps', mins: 17,
    summary: 'Build an intraday level map from the opening range, previous-day high/low/close and the gap, and plan opening-range breakout and gap trades with defined risk.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `Every intraday session starts with a fresh auction. The first few minutes show where buyers and sellers agree to trade after digesting the overnight news. The **opening range (OR)** is the high and low of the first N minutes — commonly 5, 15 or 30. Together with the **previous day's high (PDH), low (PDL) and close (PDC)**, it gives you a map of the day before you place a single trade.

A **gap** is the difference between today's open and yesterday's close. A gap up means the market opened higher; a gap down means lower.

Analogy: the first few minutes of a cricket match. You learn how the pitch is playing before you decide whether to attack. The opening range is the pitch report.

Why it matters: these levels are watched by a very large number of participants, so price often reacts at them — and stop orders cluster just beyond them.

> [!evidence] The mechanics (what the levels are, where stops cluster) are **established**. Opening-range breakout strategies have **mixed** evidence: they have been profitable in some markets and periods and not in others, and costs matter a great deal.` },
      { h: 'Intermediate view', md: `### Building the level map (before 09:15 IST)
| Level | Source |
|---|---|
| PDH, PDL, PDC | Yesterday's session (09:15–15:30 IST) |
| Gap size | Today's open − PDC |
| Overnight cues | GIFT Nifty, US close, Asian open — see [[link:l2-overnight]] |
| OR high / low | Set after the first 15 minutes (09:15–09:30 IST) |
| Prior swing levels, round numbers | Daily and 15-minute charts |

### Gap types (descriptive)
- **Gap inside yesterday's range**: the open is between PDH and PDL. Price often explores the range and PDC is a common magnet.
- **Gap outside the range**: open above PDH or below PDL. Moves can extend, but if price returns inside yesterday's range the gap trade has failed.

### Opening range breakout (ORB)
1. Wait for the OR to complete (say 15 minutes).
2. Long trigger: a 5-minute close above OR high. Short trigger: a close below OR low.
3. Stop: the opposite side of the OR, or the OR midpoint if the range is wide.
4. Target: a level from your map (PDH, PDL, round number) or a multiple of OR width.
5. Filter: skip if OR width is unusually large relative to ATR — the stop becomes too wide.

### Gap-and-go vs gap-fill
- Gap-and-go: gap above PDH, first pullback holds above PDH, then new high → continuation long.
- Gap-fill: gap up fails to hold above OR low → target PDC.

[[chart:NIFTY:64:vwap,vol]]` },
      { h: 'Advanced view', md: `### Relative OR width
A narrow OR (say less than 40% of the 14-day average daily range — a practitioner threshold, not a tested constant) suggests the open was balanced and leaves room for expansion. A wide OR suggests a lot of the day's range may already be used. Many ORB traders filter and size trades with a relative measure like this rather than the raw OR; calibrate the threshold on your own data.

### Pre-open auction in India
NSE's pre-open call auction (09:00–09:08 IST order entry, then order matching before the 09:15 open) sets the equilibrium opening price for stocks in the cash segment; the index's opening value is computed from those constituent prices. Check nseindia.com for which F&O contracts currently have a pre-open session (as of Nov 2026 — verify). A large gap discovered in pre-open often comes with a burst of volatility at 09:15. Many traders wait until at least 09:20 or 09:30 to let the first auction settle.

### Gaps and information
A gap caused by company-specific news (results, block deal) behaves differently from a gap caused by global cues alone. News gaps in single stocks may extend; macro gaps in the index sometimes partially retrace once local participants take over. Treat both as hypotheses to record in your journal — not rules.

### Second-chance entries
If an ORB fails (breaks out, then returns inside the OR), the opposite-side breakout later in the morning can be stronger because one side is trapped. This is the failed-breakout logic from [[link:l2-breakouts]].

### Interaction with VWAP
An ORB long is generally cleaner when price is also above VWAP and VWAP is rising. If OR high sits just below VWAP, the breakout immediately runs into a reference level. See [[link:l2-vwap-advanced]].` },
      { h: 'The maths', md: `:::formula
Gap points      = Open − PDC
Gap %           = (Open − PDC) ÷ PDC × 100
OR width        = OR high − OR low
Relative OR     = OR width ÷ ADR(14)
ORB target      = OR high + m × OR width   (m often 1)
:::

### Worked example (Nifty, illustrative)
- PDC 24,850, PDH 24,910, PDL 24,780. ADR(14) = 180 points.
- Open 24,935 → gap = +85 points = +0.34%, outside the range (above PDH).
- OR (09:15–09:30): high 24,968, low 24,922. Width = 46; relative OR = 46 ÷ 180 ≈ 0.26 (narrow).
- 09:45 bar closes 24,975 above OR high. Long at 24,977, stop at OR mid 24,945 (32 points).
- Measured target: 24,968 + 46 = 25,014. But the 25,000 round number (heavy option open interest) sits in the way, so a realistic first exit is 24,995: reward 18 points, only 0.56R.
- Revised plan: either skip, or take a small partial at 24,995 and trail the rest with a stop raised to break-even once 25,000 is cleared. With 1 lot (65), initial risk = 32 × 65 = ₹2,080.

The numbers show why levels must be checked against R before entering — a narrow OR does not automatically make a good trade if a major level sits just above.` },
      { h: 'India', md: `Bank Nifty (illustrative): PDC 56,100, PDL 55,940, PDH 56,260. GIFT Nifty indicates a soft open; Bank Nifty opens 55,980 (gap −120, inside yesterday's range). OR: 55,920–56,030.

- 09:40 IST: price breaks below OR low and PDL together (55,920/55,940 cluster), closes 55,895.
- Short at 55,890, stop 55,990 (above OR mid-high area) = 100 points × 30 = ₹3,000 per lot.
- Target: next daily support 55,700 = 190 points (1.9R).
- If price reclaims 55,940 (PDL) within two bars, the break failed: exit.

> [!india] Expiry-day behaviour (Nifty weekly options expire Tuesday as of Nov 2026 — verify on nseindia.com) can distort the opening hour as option hedging flows dominate. Many traders treat expiry days as a separate category in their journal.` },
      { h: 'US & global', md: `In the US, the 09:30 ET open often follows a premarket session with thin volume. Many traders use the **premarket high and low** as additional map levels, but treat them as weaker than PDH/PDL. A common SPY ORB uses the first 5 or 15 minutes. For NVDA after earnings, gaps of 5–10% are possible; the OR is then very wide and a classic ORB stop can be several dollars — size down accordingly with [[widget:position-size]].` },
      { h: 'Common misconceptions', md: `- **"Gaps always fill."** Many do eventually; many do not fill the same day. "Eventually" is not a trading plan.
- **"ORB is a proven edge."** Evidence is mixed and period-dependent.
- **"The first candle tells you the day."** It is one piece of information, often noisy.
- **"PDH/PDL are exact."** Treat them as zones with a small buffer.` },
      { h: 'When it fails', md: `- Wide OR days: stops too wide, targets too close.
- Days with news scheduled mid-morning (RBI policy announcements are usually at 10:00 IST — check the RBI calendar).
- Range days where the OR is broken both ways.
- **Losing example.** Nifty OR 24,880–24,920. Long on a close above 24,920 at 24,923, stop 24,900. Price pokes to 24,935, then reverses through OR low by 10:20. Stopped for −23 × 65 = −₹1,495 per lot, plus roughly ₹950–1,000 in charges (mostly STT on the futures sell leg at Nov 2026 rates — check with [[widget:charges-india]]). Later the short side of the OR works; you were not wrong to take the first trade, but if you skipped the opposite trigger out of frustration, you missed the plan's other half.` },
      { h: 'Exercise', md: `1. Before the open in the simulator, write PDH, PDL, PDC and the expected gap for NIFTY.
2. After 15 simulated minutes, record OR high, low and relative OR width.
3. Plan both ORB triggers, stops and targets; compute R with [[widget:rr]].
4. Check charges for one Nifty futures lot round trip with [[widget:charges-india]].
5. Journal 20 sessions: outcome by gap type (inside vs outside range).` },
    ],
    check: [
      { q: 'PDC 24,850, open 24,935, PDH 24,910. Which gap type is this?', o: ['Gap inside yesterday\'s range', 'Gap outside the range (above PDH)', 'No gap', 'Gap down'], a: 1, why: '24,935 is above PDH 24,910, so the open is outside yesterday\'s range.' },
      { q: 'The OR width is 120 points and ADR(14) is 150 points. What does this imply for an ORB trade?', o: ['Most of the typical range is used; stops are wide and targets limited', 'Ideal setup', 'Guaranteed trend day', 'Nothing'], a: 0, why: 'Relative OR of 0.8 leaves little typical range for follow-through and makes stops costly.' },
      { q: 'An ORB long breaks out, then price returns inside the OR. What does experience suggest about a later break of OR low?', o: ['It cannot happen', 'It is always weaker', 'It may be stronger because breakout buyers are trapped', 'It must be ignored'], a: 2, why: 'Trapped traders and their stops can add fuel to the opposite break — a tendency, not a rule.' },
    ],
    refs: ['Toby Crabel — Day Trading with Short Term Price Patterns and Opening Range Breakout (book)', 'NSE — Pre-open call auction (nseindia.com)', 'Linda Bradford Raschke and Laurence Connors — Street Smarts (book)'],
  },
  {
    id: 'l2-vwap-advanced', module: 'L2-M2', level: 2, track: 'ta', title: 'VWAP bands, anchored VWAP and institutional benchmarks', mins: 18,
    summary: 'Compute VWAP and its standard-deviation bands, anchor VWAP to meaningful events, and understand what VWAP benchmarking does and does not tell you about institutions.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `You met VWAP (volume-weighted average price) in [[link:l1-vwap]]. It is the average price paid for every share or contract traded today, weighted by volume. If VWAP is ₹1,410, the "average participant" today has paid about ₹1,410.

This lesson adds two upgrades:
- **VWAP bands**: lines a set number of standard deviations above and below VWAP, showing how stretched price is from today's average.
- **Anchored VWAP (AVWAP)**: a VWAP that starts from a moment you choose — a gap, a results day, a swing low — instead of the session open.

Analogy: VWAP is the average speed on a journey so far. Bands show whether you are driving much faster or slower than usual. Anchored VWAP is the average speed since a particular toll gate.

> [!evidence] VWAP is an **established** execution benchmark: many institutional orders are measured against it. That is a fact about how execution is evaluated. Whether price "respects" VWAP as support or resistance is **mixed** and partly self-fulfilling.` },
      { h: 'Intermediate view', md: `### VWAP bands
Bands are usually set at ±1, ±2 and sometimes ±3 volume-weighted standard deviations from VWAP. Typical readings:
- Price oscillating around VWAP inside ±1 SD: balanced, rotational day.
- Price riding the +1 to +2 SD zone, pullbacks holding VWAP or +1 SD: trend day up.
- Price tagging +2 or +3 SD then rejecting: stretched; mean reversion toward VWAP is more likely on range days than on trend days.

### Anchored VWAP
Anchor at events that changed participation:
- Today's open, a gap, or the OR high or low.
- Yesterday's high-volume swing low.
- A results day, a block deal, or a budget day on the daily chart.
Price above an AVWAP means the average buyer since that event is in profit; below means underwater. Buyers underwater often sell when price returns to their average cost — one reason AVWAP lines often act as reaction zones.

### Practical setups
- **VWAP pullback in a trend**: in an uptrend day, buy a pullback to VWAP or +1 SD that holds on a closing basis; stop below the band.
- **VWAP reclaim**: price below VWAP all morning, then closes above it and holds a retest — a sentiment shift.
- **Band fade**: on a range day, fade a tag of ±2 SD back toward VWAP, stop beyond ±3 SD.

[[chart:BANKNIFTY:72:vwap,bb,vol]]

(The chart shows Bollinger Bands for comparison; VWAP bands differ because they are volume-weighted and anchored to the session, while Bollinger Bands use a rolling window of closes.)` },
      { h: 'Advanced view', md: `### What institutional VWAP benchmarking means
A fund told to buy 5 lakh shares "at VWAP" will usually slice the order across the day in proportion to expected volume, often using an algorithm. The aim is to match VWAP, not to beat it by timing. That creates steady flow, but:
- It does not mean institutions "defend" VWAP.
- Buy and sell programmes run at the same time; you cannot see net direction from the line.

> [!warn] "Institutions buy at VWAP" is a misreading of execution benchmarking. A chart cannot show you their orders.

### VWAP as a slow average
Intraday VWAP becomes harder to move as the day goes on because cumulative volume grows. At 09:30 IST it moves fast; by 14:30 IST it barely moves. Bands similarly widen early and stabilise. A VWAP cross at 14:30 therefore means more structurally than at 09:25 but leaves less time to profit.

### Futures vs spot
Nifty index itself has no volume. Use Nifty futures VWAP, or the VWAP of a liquid ETF. In the US, SPY has its own volume and VWAP; ES futures VWAP may differ slightly in timing.

### Multiple anchors
Professionals often keep three: session VWAP, a weekly or event AVWAP, and an AVWAP from the most recent major swing. When they cluster, the zone is more likely to matter; when they disagree, expect choppier trade.` },
      { h: 'The maths', md: `:::formula
Typical price TP(i)  = (High + Low + Close) ÷ 3
VWAP                 = Σ (TP × Volume) ÷ Σ Volume
Variance             = Σ (Volume × (TP − VWAP)²) ÷ Σ Volume
SD                   = √Variance
Band k               = VWAP ± k × SD
:::

### Worked example (three 5-minute bars, illustrative RELIANCE)
| Bar | TP (₹) | Volume | TP × Vol |
|---|---|---|---|
| 1 | 1,400 | 20,000 | 2,80,00,000 |
| 2 | 1,406 | 10,000 | 1,40,60,000 |
| 3 | 1,410 | 10,000 | 1,41,00,000 |

- Σ Vol = 40,000. Σ TP × Vol = 5,61,60,000.
- VWAP = 5,61,60,000 ÷ 40,000 = ₹1,404.
- Deviations: −4, +2, +6. Squared × Vol: 16 × 20,000 = 3,20,000; 4 × 10,000 = 40,000; 36 × 10,000 = 3,60,000. Total = 7,20,000.
- Variance = 7,20,000 ÷ 40,000 = 18; SD ≈ ₹4.24.
- +1 SD = ₹1,408.24; +2 SD = ₹1,412.49; −1 SD = ₹1,399.76.

Bar 1's heavy volume pulled VWAP toward ₹1,400, even though the simple average of TP is ₹1,405.33.

> [!note] Platforms differ in detail. The app's engine (and this lesson) uses typical price (H + L + C) ÷ 3 and resets VWAP at each session start; anchored VWAP uses the same sum, started at the anchor bar. Some platforms use the close, OHLC ÷ 4, or tick-by-tick trade prices, and some compute the bands with a different variance formula, so expect small differences between platforms.` },
      { h: 'India', md: `Nifty futures, trend day up (illustrative): VWAP 24,880 at 11:00 IST, +1 SD 24,915, +2 SD 24,950. Price has ridden between +1 and +2 SD all morning. A pullback reaches 24,912 and a 5-minute bar closes at 24,925.

- Long at 24,927, stop 24,895 (below +1 SD with buffer and above VWAP) = 32 points × 65 = ₹2,080.
- Target: +2 SD at 24,950 plus drift (bands rise through the day) → 24,960: 33 points (≈1R). Weak alone; trail instead of using a fixed target.

Anchored example: HDFCBANK results day low ₹1,905 (illustrative). An AVWAP from that day's open sits at ₹1,932 three sessions later. Each test of ₹1,932 from below meets selling as buyers from results day try to exit at cost. A daily close above it shifts the picture.` },
      { h: 'US & global', md: `SPY VWAP and bands are widely displayed by US platforms. On rotational days SPY often oscillates within ±1 SD. NVDA after a large gap: anchor VWAP at the 09:30 ET open and at the premarket high; if price holds above the open-anchored VWAP through the first hour, gap-and-go is intact. In DAX futures, many traders anchor VWAP at 09:00 CET (Xetra open) and again at the US open (15:30 CET for most of the year; 14:30 CET for a few weeks when US and European daylight-saving changes are out of step).` },
      { h: 'Common misconceptions', md: `- **"VWAP is where institutions buy."** It is an execution benchmark; institutions buy and sell all day.
- **"Above VWAP = bullish, always."** It means the average buyer today is in profit; trend context still matters.
- **"±2 SD is overbought."** On trend days price can ride +2 SD for hours.
- **"Anchor anywhere."** Anchors should be events that changed participation; random anchors produce random lines.
- **"Index VWAP."** Cash indices have no volume; use futures or ETFs.` },
      { h: 'When it fails', md: `- Late-day VWAP signals with little time left.
- Thin stocks where a few trades distort VWAP.
- **Losing example.** Range-day assumption on Bank Nifty: you fade the +2 SD tag at 56,420 with a stop at 56,480 (+3 SD). It is actually a trend day; price walks the band to 56,520. Loss 60 × 30 = −₹1,800 per lot. The clue was that the morning pullbacks had held above +1 SD — a trend-day signature that band fades ignore.` },
      { h: 'Exercise', md: `1. In the Chart Lab load BANKNIFTY with vwap and bb. Note where Bollinger Bands and the VWAP line diverge.
2. Compute VWAP and SD by hand for three bars of your choice, using the table method above.
3. Classify the session as rotational or trend using the band behaviour, before advancing the chart.
4. Journal five VWAP pullback trades and five band fades; record the day type each time.` },
    ],
    check: [
      { q: 'Bars: TP 100 (vol 30), TP 110 (vol 10). What is VWAP?', o: ['105.0', '110.0', '107.5', '102.5'], a: 3, why: '(100 × 30 + 110 × 10) ÷ 40 = 4,100 ÷ 40 = 102.5.' },
      { q: 'A fund executes a large buy "at VWAP". What does this tell you?', o: ['They will defend VWAP as support', 'Their execution quality is measured against VWAP; it says nothing about net market direction', 'VWAP will rise all day', 'Retail should buy at VWAP'], a: 1, why: 'VWAP benchmarking is about execution evaluation; buy and sell programmes run simultaneously.' },
      { q: 'On which day type is fading a +2 SD tag most dangerous?', o: ['Trend day', 'Rotational day', 'Holiday', 'Pre-open'], a: 0, why: 'On trend days price can ride the upper bands for hours.' },
    ],
    refs: ['Berkowitz, Logue and Noser — The Total Cost of Transactions on the NYSE, Journal of Finance (1988)', 'Brian Shannon — Maximum Trading Gains with Anchored VWAP (book)', 'Robert Kissell — The Science of Algorithmic Trading and Portfolio Management (book)'],
  },
  {
    id: 'l2-volume-profile', module: 'L2-M2', level: 2, track: 'ta', title: 'Volume profile: POC, value area and low-volume nodes', mins: 18,
    summary: 'Read a volume profile, compute the point of control and 70% value area, and use high- and low-volume nodes as context for entries and targets.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `A normal volume bar shows **how much** traded in each time period. A **volume profile** turns that sideways: it shows how much traded **at each price** over a session or chosen period. It looks like a horizontal histogram on the side of your chart.

Key terms:
- **POC (point of control)**: the price with the most volume.
- **Value area (VA)**: the price range containing about 70% of the volume, with its high (VAH) and low (VAL).
- **HVN (high-volume node)**: a thick part of the profile where a lot of trading happened.
- **LVN (low-volume node)**: a thin part where price moved through quickly.

Analogy: a heat map of footprints in a shop. The busiest aisle is the POC. The empty corridors are LVNs — people walked through without stopping.

> [!evidence] The **mechanics** of volume profile — how POC and value area are computed — are **established** arithmetic. Their **predictive value** for future reactions is **mixed**; HVNs and LVNs describe where trading happened, not where it must happen next.` },
      { h: 'Intermediate view', md: `### Reading the shape
| Shape | Interpretation (descriptive) |
|---|---|
| D-shape (single bell, POC near the middle) | Balanced, rotational session |
| P-shape (fat top) | Rally then acceptance high; often short covering or late buying |
| b-shape (fat bottom) | Decline then acceptance low; often long liquidation |
| Double distribution | Two balance areas with an LVN between — a trend day with a pause |

### Common uses
1. **Context for the open**: If today opens inside yesterday's value area, a rotational day is more likely; if it opens outside value and is accepted there (holds for 30–60 minutes), the market may be seeking new value.
2. **Targets**: POC and VA edges are natural targets for trades from outside value.
3. **LVNs as fast zones**: price often moves quickly through LVNs because there was little prior trading to act as friction. An LVN between your entry and target is helpful; an HVN in the way is friction.
4. **The 80% rule (folk rule)**: if price opens outside value, re-enters, and holds inside for two 30-minute periods, traders expect a move to the other side of value. This is a heuristic from Market Profile practice; treat it as a hypothesis — no reliable public statistics support the number.

[[chart:NIFTY:81:vp,vwap,vol]]

### Session vs composite profiles
A session profile covers one day. A composite profile covers several days or weeks and shows longer-term value. Use both: composite for the big picture, session for intraday decisions.` },
      { h: 'Advanced view', md: `### Data issues that change the profile
- **Tick vs bar data**: building a profile from 5-minute bars assigns each bar's volume across its range (or to its close), which is an approximation. Tick-level data is precise. Two platforms can show different POCs for the same day.
- **Bin size**: a 1-point bin on Nifty gives a jagged profile; 5–10 points is smoother. The POC can shift with bin size.
- **Index vs futures**: use Nifty futures or an ETF; the index has no volume.

### Why HVNs and LVNs might matter
An HVN is where many participants hold positions at similar cost. Returning there, some exit at break-even, some add; two-sided trade slows price. An LVN is where few participants hold positions, so little natural interest exists — price can pass quickly. This logic is sensible but the size of the effect varies a lot.

### Volume profile and VWAP together
VWAP is the volume-weighted mean; POC is the volume mode. On a balanced day they are close. On a trend day VWAP lags behind price while POC may still be at the morning's balance. Large gaps between them indicate skewed sessions.

### Naked POCs
A previous session's POC that price has not revisited is called a "naked" or "virgin" POC. Some traders target them. It is a common but **subjective** practice with no robust public evidence; record it in your journal before relying on it.` },
      { h: 'The maths', md: `### Value area algorithm (standard)
:::formula
1. Find POC = price bin with max volume.
2. Target = 0.70 × total volume.
3. Start at POC. Compare the volume of the next two bins above with the next two below.
4. Add the larger pair to the value area. Repeat until accumulated volume ≥ target.
5. If one side has run out of bins, keep adding from the other side.
:::

Why 70%? It is a convention borrowed from the normal distribution, where about 68% of observations lie within one standard deviation of the mean. It is not a law; some platforms let you set 68% or 80%.

> [!note] Implementations differ. The two-rows-at-a-time comparison above is the traditional Market Profile (CBOT) method. The app's own engine (js/engines/indicators.js) compares **one bin** above with one bin below at each step, and it spreads each bar's volume evenly across that bar's high–low range. On this example both methods give the same value area; on other profiles the VAH or VAL can differ by a bin.

### Worked example (Nifty futures, 10-point bins, volumes in thousands of contracts — illustrative)
| Price | Vol |
|---|---|
| 24,950 | 4 |
| 24,940 | 6 |
| 24,930 | 10 |
| 24,920 | 18 |
| 24,910 | 25 (POC) |
| 24,900 | 15 |
| 24,890 | 9 |
| 24,880 | 8 |
| 24,870 | 5 |

- Total = 100; target = 70. Start with POC: 25.
- Above pair (24,920 + 24,930) = 28; below pair (24,900 + 24,890) = 24. Add above → 53.
- Next above pair (24,940 + 24,950) = 10; below pair still 24. Add below → 77 ≥ 70. Stop.
- Value area = 24,890 to 24,930. VAH 24,930, VAL 24,890, POC 24,910.

If tomorrow opens at 24,955 (above VAH) and drops back below 24,930 and holds, the folk "80% rule" would target VAL 24,890.` },
      { h: 'India', md: `Bank Nifty futures (illustrative): yesterday's VA 55,950–56,150, POC 56,060, an LVN at 56,200–56,240 and an HVN at 56,320.

- Today opens 56,180, just above VAH. Price fails to hold, re-enters value by 09:45 IST and holds below 56,150 for two 30-minute periods.
- Short at 56,120, stop 56,200 (above VAH and into the LVN) = 80 points × 30 = ₹2,400 per lot.
- Target 1: POC 56,060 (60 points). Target 2: VAL 55,950 (170 points).

Contrast: if it had opened 56,180 and moved up quickly through the 56,200–56,240 LVN, the next friction is the HVN at 56,320 — a sensible long target from a break above 56,240.` },
      { h: 'US & global', md: `SPY and ES futures profiles are widely used. The overnight (globex) session for ES creates its own profile; many traders compare the RTH open with both the previous RTH value area and the overnight range. In NVDA, earnings days create large single-session profiles with long LVN "tails"; later returns into those tails often move quickly in either direction.` },
      { h: 'Common misconceptions', md: `- **"POC is support."** It is where most trading happened. It can attract or repel price.
- **"LVNs will reject price."** LVNs are often traversed quickly; the reaction usually happens at the HVN on the other side.
- **"Volume profile shows institutional positions."** It shows traded volume at price, from both sides.
- **"Profiles are identical across platforms."** Data source and bin size change them.
- **"The 80% rule works 80% of the time."** It is a named heuristic, not a measured rate.` },
      { h: 'When it fails', md: `- Trend days where value migrates all day; yesterday's profile becomes irrelevant early.
- Low-liquidity stocks with jagged, unreliable profiles.
- **Losing example.** Nifty opens just below VAL 24,890, you buy the re-entry at 24,895 targeting POC 24,910 then VAH 24,930, stop 24,875. A weak global session pushes a second leg down; price leaves value and accepts below. Loss 20 × 65 = −₹1,300 per lot. The open was outside value; acceptance below was always one of the two outcomes.` },
      { h: 'Exercise', md: `1. In the Chart Lab load NIFTY with vp, vwap and vol. Identify POC, VAH and VAL visually.
2. Recompute the value area by hand using the algorithm on a nine-bin table you copy from the chart.
3. Compare POC and VWAP at the session end; note the gap.
4. For five sessions, record where tomorrow opened (inside or outside value) and whether the day was rotational or trending.` },
    ],
    check: [
      { q: 'Total profile volume is 200k with POC 50k. When does the value area algorithm stop?', o: ['At 100k', 'At 50k', 'At 140k or more', 'At 200k'], a: 2, why: 'Value area targets 70% of total volume: 0.7 × 200k = 140k.' },
      { q: 'Between your long entry and target lies an LVN, followed by an HVN at the target. What does profile logic suggest?', o: ['Price will stop at the LVN', 'The HVN guarantees a reversal', 'Volume profile is irrelevant', 'Price may move quickly through the LVN and meet friction at the HVN'], a: 3, why: 'Little prior trade at LVNs offers little friction; HVNs are where two-sided trade slowed price before.' },
      { q: 'Why might two platforms show a different POC for the same day?', o: ['One is wrong', 'Different data granularity (tick vs bar) and bin sizes', 'Exchanges publish two POCs', 'POC is random'], a: 1, why: 'Profiles built from bars approximate tick data, and bin width changes the mode.' },
    ],
    refs: ['J. Peter Steidlmayer and Steven Hawkins — Steidlmayer on Markets (book)', 'James Dalton, Eric Jones and Robert Dalton — Mind Over Markets (book)', 'CME Group — Market Profile education material (cmegroup.com)'],
  },
  {
    id: 'l2-market-profile', module: 'L2-M2', level: 2, track: 'ta', title: 'Market Profile (TPO) and day types', mins: 17,
    summary: 'Read a TPO chart, identify initial balance and range extension, and classify sessions into day types to choose between rotational and trend tactics.',
    evidence: 'subjective',
    sections: [
      { h: 'Beginner view', md: `**Market Profile**, developed by J. Peter Steidlmayer at the Chicago Board of Trade in the 1980s, organises price by **time** spent at each level rather than by volume. Each 30-minute period gets a letter (A, B, C ...). Every price touched during period A gets an "A"; during B, a "B"; and so on. The result is a sideways distribution of letters — the **TPO (time price opportunity) chart**.

Where letters pile up, the market spent a lot of time: this is accepted value. Where only one or two letters appear, price passed quickly: this is rejected or unexplored territory.

Analogy: a classroom attendance register by seat. The seats with the most ticks are where students actually sat; the empty ones were walked past.

Why it matters: it gives a structured language for describing the day — balanced or trending — which helps you choose tactics.

> [!evidence] The TPO construction is **established** arithmetic. The day-type classification and many of its rules are **subjective frameworks** from practitioner books, with little robust public testing.` },
      { h: 'Intermediate view', md: `### Building blocks
- **Initial balance (IB)**: the range of the first hour (first two 30-minute periods). For NSE that is 09:15–10:15 IST; for US equities 09:30–10:30 ET.
- **Range extension**: price moving beyond the IB high or low later in the day.
- **Single prints**: prices with only one TPO letter — fast moves that left little time.
- **Poor high / poor low**: an extreme with several TPOs at the same price and no tail, suggesting the auction there was not completed.
- **Tail**: two or more single prints at an extreme, suggesting strong rejection.

### Day types (Dalton's terminology, paraphrased)
| Day type | IB | Range extension | Typical tactic |
|---|---|---|---|
| Normal | Wide | Little | Fade the IB extremes |
| Normal variation | Moderate | One side, up to about 2× IB | Trade with the extension |
| Trend | Narrow | Strong, one side, closes near extreme | Buy/sell pullbacks; do not fade |
| Double distribution | Narrow | A late break forming a second balance | Trade the break; single prints separate the two |
| Neutral | Moderate | Both sides | Neutral-centre: close near the middle, fade extremes. Neutral-extreme: close near one extreme — stronger signal for that side |
| Non-trend | Very narrow | None | Low volatility; often stand aside |

[[chart:SPY:93:vp,vwap,vol]]

### Using it intraday
1. After the IB forms, note its width versus recent IB widths.
2. Narrow IB → be ready for range extension (possible trend day).
3. Wide IB → expect rotation inside it.
4. Watch for tails or poor highs/lows at the extremes for clues about whether the auction is complete.` },
      { h: 'Advanced view', md: `### TPO vs volume profile
TPO counts time; volume profile counts volume. They usually agree, but not always: a quick high-volume liquidation shows few TPOs but a lot of volume. Professionals look at both. Many modern traders prefer volume profile for futures (real volume) and TPO for the structure of the auction.

### Auction logic
Steidlmayer's view: the market is a two-way auction seeking a price that facilitates trade. When price moves away from value and finds no participation, it returns (rejection); when it finds participation, value migrates (acceptance). This is a coherent framework, covered more in [[link:l3-auction]], but it is **interpretive** — the same picture can be read differently by two practitioners.

### Day type is a moving target
You do not know the day type at 10:15. A normal-variation morning can become a trend afternoon. Professionals hold a working hypothesis and update it as range extension does or does not happen. The value is in **switching tactics**, for example stopping fades once range extension exceeds 1.5× IB.

### Indian adaptation
NSE's 375-minute session produces 13 periods (12 full 30-minute periods plus a final 15-minute period). The last period overlaps closing-price formation (as of Nov 2026, NSE's cash-market closing price is the volume-weighted average of trades in the last 30 minutes — verify on nseindia.com, as SEBI has consulted on a closing auction mechanism), so late letters can behave differently.` },
      { h: 'The maths', md: `:::formula
IB width              = IB high − IB low
Range extension (up)  = Session high − IB high   (if > 0)
Extension ratio       = Total session range ÷ IB width
TPO POC               = price with most TPO letters
TPO value area        = ~70% of TPO count around TPO POC (same algorithm as volume)
:::

### Worked example (Nifty futures, illustrative)
- IB (09:15–10:15 IST): 24,880–24,925 → width 45. 20-day average IB width: 80. This IB is narrow (0.56×).
- 11:30: price breaks IB high, reaching 24,990 by 13:00 and closing at 24,982.
- Range extension = 24,990 − 24,925 = 65. Session range = 24,990 − 24,880 = 110; extension ratio = 110 ÷ 45 ≈ 2.4.
- Closing near the high, one-sided extension, narrow IB → consistent with a **trend day**.

Trading implication: from 11:30, the plan was "buy pullbacks above IB high". Long at 24,935 on the first pullback, stop 24,915 (back inside IB) = 20 points × 65 = ₹1,300 per lot; exit near close 24,980 = 45 points (2.25R gross).` },
      { h: 'India', md: `Bank Nifty (illustrative): IB 55,900–56,150 (250 points, wide compared with a 20-day average of 180). Price probes 56,180 (above IB high) at 11:00 but leaves a short tail and returns inside. Later it probes 55,880 below IB low and is rejected too.

- Working day type: **neutral / normal** — rotational.
- Tactic: fade the extremes back toward TPO POC (56,020). Short at 56,140 with stop 56,200 (60 points × 30 = ₹1,800), target 56,030 (110 points).
- Rule: abandon fades if price accepts beyond either extreme for a full 30-minute period.` },
      { h: 'US & global', md: `In US index futures, many traders distinguish the overnight session from regular trading hours and build the IB from 09:30–10:30 ET. A narrow IB in SPY on a quiet macro day often leads to a non-trend or normal day; a narrow IB before an afternoon FOMC announcement can resolve sharply at 14:00 ET. DAX traders adapt the IB to the first hour after 09:00 CET.` },
      { h: 'Common misconceptions', md: `- **"Day type is known at the open."** It emerges during the session.
- **"Market Profile is volume profile."** One counts time, the other volume.
- **"Poor highs must be revisited."** It is a practitioner tendency, not a law.
- **"Single prints are always filled."** Many remain unfilled for days or never.
- **"Profile shows what institutions are doing."** It shows time and price; nothing more.` },
      { h: 'When it fails', md: `- News days that ignore the IB entirely.
- Low-liquidity stocks where TPOs are sparse.
- **Losing example.** Nifty IB is wide and the morning is rotational, so you fade the IB high at 24,960 with a stop at 24,985. At 13:30 IST a large index-weight results surprise drives a late extension to 25,040. Loss 25 × 65 = −₹1,625 per lot. Your rule ("abandon fades after acceptance above for a full period") was correct; the stop protected you, and the day type changed.` },
      { h: 'Professional notes', md: `### Open types (Dalton)
Practitioners classify the first minutes of the auction, because the open often sets the tone for the day type:
| Open type | What happens | Working read |
|---|---|---|
| Open-Drive | Price moves away from the open aggressively and never trades back to it | Strong conviction; avoid fading |
| Open-Test-Drive | Price first tests a known level in one direction, rejects, then drives the other way | Conviction after a test |
| Open-Rejection-Reverse | Price moves one way, meets opposite activity, and reverses through the open | Less conviction; rotation more likely |
| Open-Auction | Price rotates on both sides of the open | Balanced; expect a rotational start |

### Balance, imbalance and value migration
Compare today's developing value area with yesterday's: **higher** value (today's VA mostly above yesterday's), **overlapping** value (balance) or **lower** value. Higher or lower value is read as directional acceptance; overlapping value as balance. This uses the same 70% value-area convention as [[link:l2-volume-profile]] applied to TPO counts.

### Honest limits
The open types, day types and value-migration readings come from practitioner books (Steidlmayer, Dalton), not from published out-of-sample tests. They are a vocabulary for describing the auction — label them **subjective** in your journal and record which readings actually changed your decisions.` },
      { h: 'Exercise', md: `1. In the Chart Lab load SPY with vp. Split the session into 30-minute blocks and sketch a TPO chart with letters on paper.
2. Mark IB, range extension and any single prints or tails.
3. Assign a working day type at 10:30, 12:00 and the close; note when and why it changed.
4. Journal five sessions: day type versus which of your trades (fades or pullbacks) worked.` },
    ],
    check: [
      { q: 'IB width 40, session range 120, close near the high, extension one-sided. Most consistent day type?', o: ['Trend day', 'Neutral day', 'Non-trend day', 'Normal day'], a: 0, why: 'Extension ratio 3×, one-sided, close near the extreme fit the trend-day description.' },
      { q: 'What is the key difference between a TPO chart and a volume profile?', o: ['TPO only works in India', 'They are the same', 'TPO counts time spent at price; volume profile counts volume traded at price', 'Volume profile counts time'], a: 2, why: 'TPOs are letters per time period at each price; volume profile sums volume.' },
      { q: 'At 10:15 IST you classify the day as normal. Price then accepts above the IB high for a full 30-minute period. What should a disciplined profile trader do?', o: ['Keep fading', 'Ignore it', 'Add to the short', 'Update the hypothesis and stop fading the high'], a: 3, why: 'Day type is a moving target; acceptance beyond IB contradicts the rotational hypothesis.' },
    ],
    refs: ['J. Peter Steidlmayer and Kevin Koy — Markets and Market Logic (book)', 'James Dalton, Eric Jones and Robert Dalton — Mind Over Markets (book)', 'NSE — Closing price computation in the capital market segment (nseindia.com)'],
  },
  );
  IA.content.questions.push(
  { id: 'L2-M2-q01', module: 'L2-M2', d: 1, q: 'What is the opening range?', o: ['Yesterday\'s high to low', 'The pre-open auction price', 'The gap size', 'The high and low of the first N minutes of the session'], a: 3, why: 'OR is defined by the first N minutes (5, 15 or 30) of today\'s session.' },
  { id: 'L2-M2-q02', module: 'L2-M2', d: 2, q: 'PDC 56,100; Bank Nifty opens 56,380. What is the gap in percent (rounded)?', o: ['0.50%', '0.28%', '0.05%', '2.80%'], a: 0, why: '(56,380 − 56,100) ÷ 56,100 × 100 = 280 ÷ 56,100 × 100 ≈ 0.50%.' },
  { id: 'L2-M2-q03', module: 'L2-M2', d: 2, q: 'OR 24,900–24,950. Long on break, stop at OR low, 1 Nifty lot (65). Entry 24,952. Gross risk?', o: ['₹3,250', '₹1,690', '₹3,380', '₹130'], a: 2, why: 'Risk = 24,952 − 24,900 = 52 points × 65 = ₹3,380.' },
  { id: 'L2-M2-q04', module: 'L2-M2', d: 2, q: 'Bars: TP 200 (vol 10), TP 204 (vol 30). VWAP?', o: ['202', '203', '201', '204'], a: 1, why: '(2,000 + 6,120) ÷ 40 = 8,120 ÷ 40 = 203.' },
  { id: 'L2-M2-q05', module: 'L2-M2', d: 3, q: 'VWAP 1,404, SD 4.24. Where is the −2 SD band?', o: ['1,395.52', '1,399.76', '1,412.48', '1,391.28'], a: 0, why: '1,404 − 2 × 4.24 = 1,404 − 8.48 = 1,395.52.' },
  { id: 'L2-M2-q06', module: 'L2-M2', d: 2, q: 'Why is fading +2 SD VWAP band tags risky on a trend day?', o: ['VWAP stops updating', 'Price can ride the upper band for hours while VWAP rises', 'Bands disappear', 'It is never risky'], a: 1, why: 'Trend days show price holding above +1 SD and walking the upper band.' },
  { id: 'L2-M2-q07', module: 'L2-M2', d: 1, q: 'What is the point of control (POC)?', o: ['The day\'s high', 'VWAP', 'The opening price', 'The price with the most traded volume in the profile'], a: 3, why: 'POC is the volume mode of the profile.' },
  { id: 'L2-M2-q08', module: 'L2-M2', d: 3, q: 'Profile total 100k, POC bin 22k. Pairs above: 26k, 12k; pairs below: 20k, 15k. Using the standard algorithm, which pairs are added?', o: ['Above 26k then below 20k (total 68k), then the next larger pair (below 15k) to reach 83k', 'Only above pairs', 'Only below pairs', 'All pairs'], a: 0, why: 'Start at 22k; add larger pair 26k → 48k; compare 12k vs 20k, add 20k → 68k; compare 12k vs 15k, add 15k → 83k ≥ 70k.' },
  { id: 'L2-M2-q09', module: 'L2-M2', d: 2, q: 'Which statement about volume profile is honest?', o: ['POC is guaranteed support', 'The computation is established; predictive value of nodes is mixed', 'It reveals institutional positions', 'It is identical on every platform'], a: 1, why: 'Mechanics are arithmetic; whether nodes predict reactions is not settled.' },
  { id: 'L2-M2-q10', module: 'L2-M2', d: 2, q: 'In Market Profile, what is the initial balance on NSE?', o: ['09:00–09:10 IST', '09:15–09:30 IST', '09:15–10:15 IST', '15:00–15:30 IST'], a: 2, why: 'IB is the first hour of the regular session: 09:15–10:15 IST.' },
  { id: 'L2-M2-q11', module: 'L2-M2', d: 3, q: 'Nifty IB is very wide versus recent days and both extremes are probed and rejected by 13:00. What tactic fits the working day type?', o: ['Buy every breakout above IB', 'Fade extremes back toward the middle, abandoning fades on acceptance beyond IB', 'Short all day', 'Hold overnight'], a: 1, why: 'Wide IB and two-sided rejection describe a neutral/normal rotational day.' },
  { id: 'L2-M2-q12', module: 'L2-M2', d: 2, q: 'Why should you not use the Nifty 50 cash index for VWAP?', o: ['An index has no traded volume; use futures or a liquid ETF', 'It is too volatile', 'SEBI forbids it', 'VWAP only works in the US'], a: 0, why: 'VWAP needs volume; the cash index is a computed number with no trades of its own.' },
  { id: 'L2-M2-q13', module: 'L2-M2', d: 3, q: 'NVDA opens 6% higher after earnings; the 15-minute OR is $9 wide. With a $500 risk budget and the stop at the OR low, entry at the OR high, how many shares?', o: ['About 55', 'About 500', 'About 9', 'About 5,000'], a: 0, why: '500 ÷ 9 ≈ 55 shares. Wide ORs force much smaller size.' },
  );
  /* ===================== L2-M3 Indicators with context ===================== */
  IA.content.lessons.push(
  {
    id: 'l2-oscillators', module: 'L2-M3', level: 2, track: 'ta', title: 'Momentum oscillators and divergence', mins: 18,
    summary: 'Compute and read RSI, Stochastic and related oscillators, recognise that they measure largely the same thing, and use divergence as a context warning rather than a trigger.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `A **momentum oscillator** is an indicator that moves between fixed bounds (often 0 and 100) and tells you how strongly price has been moving recently. You already know RSI from [[link:l1-rsi]]. This lesson adds the **Stochastic oscillator**, compares the family, and explains **divergence**.

Analogy: a car's speedometer. It does not tell you where the car is going; it tells you how fast it has been going. When a car climbs a hill, it can keep gaining height while its speed slows. That slowing is like a divergence: the car is still rising, but with less force.

Why it matters: oscillators help you judge whether a move is accelerating or tiring. They do **not** tell you that a move must reverse.

> [!evidence] The maths of oscillators is **established**. Their usefulness as trading signals is **mixed**: "overbought/oversold" mean-reversion signals tend to work in ranges and fail in trends; divergence is common and frequently precedes continuation rather than reversal.` },
      { h: 'Intermediate view', md: `### The main oscillators
| Oscillator | What it compares | Typical settings |
|---|---|---|
| RSI | Average up-closes vs average down-closes | 14; levels 70/30 |
| Stochastic %K/%D | Close vs high–low range of last N bars | 14,3,3; levels 80/20 |
| Williams %R | Same as Stochastic, scaled 0 to −100 | 14 |
| CCI | Typical price vs its average, scaled by mean deviation | 20; ±100 |
| ROC / Momentum | Close vs close N bars ago | 10–12 |

### They are largely redundant
RSI and Stochastic both answer "where is the close relative to the recent past?" Williams %R is literally the Stochastic %K minus 100. On most charts, RSI, Stochastic and CCI turn up and down at nearly the same bars. Adding all three to a chart does **not** give you three confirmations — it gives you one opinion three times. More on this in [[link:l2-confluence]].

### Reading them with context
- **In a range**: oversold readings near range support can help time a long; overbought near resistance can help time profit-taking.
- **In a trend**: RSI tends to live in a shifted band — roughly 40–80 in uptrends and 20–60 in downtrends (a practitioner observation associated with Andrew Cardwell and Constance Brown). An uptrend pullback to RSI 40–50 is more useful than "RSI below 30".

### Divergence
- **Regular bearish divergence**: price makes a higher high; the oscillator makes a lower high. Momentum is fading.
- **Regular bullish divergence**: price lower low; oscillator higher low.
- **Hidden bullish divergence**: price higher low; oscillator lower low — often read as uptrend continuation.
- **Hidden bearish divergence**: price lower high; oscillator higher high — often read as downtrend continuation.

All four are practitioner conventions (hidden divergence in particular is popular in trading education with little formal testing); label them **subjective** in your journal.

[[chart:NIFTY:105:rsi,stoch,ema20]]

Look at RSI and Stochastic on the chart: their peaks and troughs line up closely. Stochastic is faster and noisier because it uses the raw high–low range.` },
      { h: 'Advanced view', md: `### Divergence is a warning, not a trigger
In strong trends, momentum can diverge several times before price finally turns. Each divergence that fails is a losing short for anyone using it as a signal. Professionals use divergence to:
- tighten trailing stops on an existing position,
- reduce size on new trend entries,
- look for a reversal **only** if structure also changes (a lower high and break of the last higher low — see [[link:l2-dow]]).

### Lag and look-back
RSI uses Wilder's smoothing, an exponential average with alpha = 1/14, so it carries memory of many more than 14 bars. Stochastic with 14-bar range plus 3-bar smoothing reacts faster. Choosing a shorter setting makes the indicator react sooner but produces more false extremes. There is no setting that removes the trade-off.

### Divergence detection is subjective
Which two peaks do you compare? The two most recent swing highs, or the two most extreme? On a 1-minute chart you can find a divergence almost any time. Define it mechanically — for example "two confirmed N = 3 swing highs within 30 bars, second price high above the first, RSI at the second high at least 5 points lower" — or accept that it is a discretionary read.

### Timeframe alignment
A 5-minute bearish divergence during a 60-minute uptrend is a pullback warning, not a trend change. Check the higher timeframe first ([[link:l2-mtf]]).` },
      { h: 'The maths', md: `### RSI (Wilder)
:::formula
AvgGain(t) = (13 × AvgGain(t−1) + Gain(t)) ÷ 14
AvgLoss(t) = (13 × AvgLoss(t−1) + Loss(t)) ÷ 14
RS  = AvgGain ÷ AvgLoss
RSI = 100 − 100 ÷ (1 + RS)
:::

Worked (Nifty 5-minute, illustrative): previous AvgGain 12.0, AvgLoss 8.0. New bar closes +19 points (gain 19, loss 0).
- AvgGain = (13 × 12 + 19) ÷ 14 = 175 ÷ 14 = 12.50
- AvgLoss = (13 × 8 + 0) ÷ 14 = 104 ÷ 14 = 7.43
- RS = 12.50 ÷ 7.43 = 1.68; RSI = 100 − 100 ÷ 2.68 = 62.7

### Stochastic
:::formula
%K = (Close − Lowest low N) ÷ (Highest high N − Lowest low N) × 100
%D = 3-period SMA of %K
Williams %R = %K − 100      (using the raw, unsmoothed %K)
Slow Stochastic (14,3,3): smooth raw %K with a 3-bar SMA first, then %D = 3-bar SMA of that
:::

The Chart Lab's stoch pane plots the **slow** (14,3,3) version, so its %K will lag the raw %K you compute by hand by a bar or two.

Worked: 14-bar high 24,950, low 24,850, close 24,930.
- %K = (24,930 − 24,850) ÷ (24,950 − 24,850) × 100 = 80 ÷ 100 × 100 = 80
- Williams %R = 80 − 100 = −20 (the same information on a different scale)

Both readings say "close is near the top of its recent activity". Same message, different arithmetic.` },
      { h: 'India', md: `Bank Nifty 5-minute (illustrative): morning uptrend, swing high 56,420 with RSI 74, pullback, then a new high 56,480 with RSI 66 — bearish divergence. Stochastic shows the same.

Wrong use: short at 56,470 because of divergence, stop 56,530 (60 × 30 = ₹1,800 per lot). Price grinds to 56,560 — stopped.

Context use: you are already long from 56,250. The divergence prompts you to move your stop up from 56,300 to below the last higher low at 56,390, locking in 140 points. Price later breaks 56,390 and you exit at 56,385 with +135 points (₹4,050 per lot gross) rather than giving it back.

On an NSE stock like INFY, RSI-based "oversold" buys near the previous day low can work in rotational sessions — but only if your plan includes a stop below the level, not below an RSI number.` },
      { h: 'US & global', md: `NVDA in a momentum phase can hold RSI above 70 on the 15-minute chart for most of a session; shorting "overbought" there is one of the classic beginner losses. SPY on a quiet, range-bound day is where oscillator extremes near VWAP bands (see [[link:l2-vwap-advanced]]) tend to be more useful. Same indicator, different context, opposite outcomes.` },
      { h: 'Common misconceptions', md: `- **"Overbought means sell."** It means price has risen strongly. Strong trends stay overbought.
- **"RSI and Stochastic confirm each other."** They are built from the same data and mostly agree by construction.
- **"Divergence predicts reversals."** It flags fading momentum; continuation is very common.
- **"Settings matter most."** Context matters more than the 14 vs 9 debate.
- **"Oscillators lead price."** They are calculated from past prices; they cannot lead. They can **appear** to lead because momentum often slows before structure changes.` },
      { h: 'When it fails', md: `- Trend days and news-driven moves.
- Low-volatility chop, where readings bounce between 40 and 60 with no meaning.
- **Losing example.** Nifty falls 120 points by 10:30 IST; RSI(14) on 5-minute is 24 ("oversold"). You buy at 24,760 with a stop at 24,735. A second leg follows after a weak European open, RSI makes 18, price hits 24,700. Loss 25 × 65 = −₹1,625 per lot. The oversold reading was correct as a description and useless as a trigger in a markdown phase.` },
      { h: 'Exercise', md: `1. In the Chart Lab load NIFTY with rsi and stoch. Mark every bar where RSI crosses 70 or 30 and every bar where Stochastic crosses 80 or 20. Count how many coincide within two bars.
2. Find two divergences using the mechanical definition in the Advanced view. Record what happened next: reversal, pause or continuation.
3. Compute one RSI update and one %K by hand from chart values and compare with the indicator.
4. Journal: in which phase (trend or range, see [[link:l2-phases]]) did oscillator signals help?` },
    ],
    check: [
      { q: '14-bar high 600, low 580, close 585. What are Stochastic %K and Williams %R?', o: ['%K 75, %R −25', '%K 25, %R −75', '%K 50, %R −50', '%K 25, %R 75'], a: 1, why: '%K = (585 − 580) ÷ 20 × 100 = 25; %R = 25 − 100 = −75. They carry the same information.' },
      { q: 'You add RSI, Stochastic and Williams %R to your chart and all three are overbought. How many independent confirmations do you have?', o: ['Essentially one — they measure the same thing', 'Three', 'Zero, they cancel', 'Two'], a: 0, why: 'All three are functions of the recent close relative to recent price action; Williams %R is a rescaled Stochastic.' },
      { q: 'During a strong 60-minute uptrend, the 5-minute RSI shows bearish divergence. What is the best use?', o: ['Short immediately', 'Ignore all timeframes', 'Treat it as a pullback warning: tighten stops or reduce size; look for structure change before reversing', 'Buy more'], a: 2, why: 'Divergence flags fading momentum; without structure change it often resolves as continuation.' },
    ],
    refs: ['J. Welles Wilder — New Concepts in Technical Trading Systems (book)', 'George Lane — Lane\'s Stochastics, Technical Analysis of Stocks and Commodities (1984)', 'Constance Brown — Technical Analysis for the Trading Professional (book)'],
  },
  {
    id: 'l2-volatility', module: 'L2-M3', level: 2, track: 'ta', title: 'Volatility tools: ATR, Bollinger, Keltner, Donchian', mins: 18,
    summary: 'Compute ATR, Bollinger, Keltner and Donchian channels, use them to size stops and positions, and recognise volatility squeezes without assuming a direction.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `**Volatility** is how much price typically moves. It matters more for risk than almost anything else: a ₹20 stop is tight on a quiet stock and suicidal on a fast one.

Four tools measure it:
- **ATR (Average True Range)**: the average size of a bar, including gaps.
- **Bollinger Bands**: a moving average with bands two standard deviations above and below.
- **Keltner Channels**: a moving average with bands a multiple of ATR above and below.
- **Donchian Channels**: the highest high and lowest low of the last N bars.

Analogy: road conditions. ATR is how bumpy the road is. Bands and channels are the width of the lane you should expect the car to wobble within.

> [!evidence] Volatility measurement and **volatility clustering** (calm follows calm, wild follows wild) are **established**. Using ATR to size stops and positions is sound risk practice. Directional signals from bands (for example "buy the lower band") have **mixed** evidence and depend on regime.` },
      { h: 'Intermediate view', md: `### ATR for stops and sizing
- Stop distance = k × ATR, where k is often 1–2 on your trading timeframe. This adapts stops to current conditions.
- Position size = risk budget ÷ (stop distance × value per point). See [[widget:position-size]].
- ATR has **no direction**. A rising ATR on a selloff and on a rally look identical.

### Bollinger Bands (20, 2)
- Middle = 20-period SMA; bands = ±2 SD of closes.
- **%B** shows where price sits within the bands; **bandwidth** shows how wide they are.
- In ranges, tags of the outer band often revert toward the middle. In trends, price can "walk the band".

### Keltner Channels (20 EMA ± 2 × ATR10 is a common modern variant)
- Smoother than Bollinger because ATR changes more slowly than standard deviation of closes.
- A close outside Keltner is a stronger statement than a tag of Bollinger.

### Donchian Channels (20)
- Upper = highest high of 20 bars, lower = lowest low. The basis of the famous Turtle breakout rules.
- Price at the upper line is, by definition, at a 20-bar high. That is a breakout definition, not a forecast.

### The squeeze
When Bollinger Bands contract **inside** Keltner Channels, volatility of closes has fallen below average range — a squeeze (popularised by John Carter). Volatility clustering suggests expansion may follow; **direction is unknown**.

The squeeze depends on the multipliers. Carter's version compares Bollinger (20, 2) with a Keltner of 1.5 × ATR; the app's kc overlay uses 2 × ATR10, which flags a squeeze more often. State which you use.

[[chart:BANKNIFTY:118:bb,kc,atr]]` },
      { h: 'Advanced view', md: `### Intraday ATR and time of day
A 14-bar ATR on a 5-minute chart at 09:45 IST includes the opening burst; at 13:00 it still reflects the morning. Some professionals use a **time-of-day-adjusted** volatility — average range of the same 5-minute slot over previous sessions — to avoid stops that are too wide at lunch and too tight at the open.

### Daily ATR as a budget
Daily ATR(14) tells you how far the instrument typically travels in a day. If Nifty's daily ATR is 200 points and it has already moved 230 from the open by 11:00, the remaining expected range is smaller — not zero, but smaller. Use it to judge whether a target is realistic.

### Bands are lagging summaries
All four tools are built from past bars. Bollinger widens **after** the volatility arrives; Donchian moves only when a new extreme prints. They describe; they do not forecast.

### Redundancy here too
Bollinger and Keltner both centre on a 20-bar average and both scale with recent variability. Bollinger %B and RSI are also correlated — both rise when closes push to the top of recent range. Use one band tool for context and ATR for risk; a chart with Bollinger, Keltner and Donchian all at once adds little information.

### Mean reversion vs breakout
The same band tag supports opposite strategies: fade it (mean reversion) in ranges; buy it (breakout) in trends. The deciding variable is regime, which you assess with structure and something like ADX ([[link:l2-trend-tools]]).` },
      { h: 'The maths', md: `:::formula
True Range TR = max(High − Low, |High − PrevClose|, |Low − PrevClose|)
ATR(t)        = (13 × ATR(t−1) + TR(t)) ÷ 14      (Wilder)
Bollinger     = SMA20 ± 2 × SD20(closes)   (population SD, divide by n — Bollinger's specification and the app's engine)
%B            = (Close − Lower) ÷ (Upper − Lower)
Bandwidth     = (Upper − Lower) ÷ Middle
Keltner       = EMA20 ± 2 × ATR10
Donchian      = max(High, 20) and min(Low, 20)
:::

### Worked ATR (Nifty 5-minute, illustrative)
Previous close 24,900; bar high 24,960, low 24,920 (gap up bar).
- H − L = 40; |H − PC| = 60; |L − PC| = 20 → TR = 60.
- Previous ATR 22 → new ATR = (13 × 22 + 60) ÷ 14 = 346 ÷ 14 = 24.7.

### Worked bands
SMA20 = 24,900, SD20 = 25 → Bollinger 24,850 / 24,950. Close 24,940 → %B = 90 ÷ 100 = 0.90. Bandwidth = 100 ÷ 24,900 = 0.40%.
EMA20 = 24,900, ATR10 = 20 → Keltner 24,860 / 24,940. Bollinger (±50) is outside Keltner (±40): **no squeeze**. If SD20 drops to 18, Bollinger becomes ±36, inside Keltner: **squeeze on**.

### Worked sizing (Bank Nifty)
5-minute ATR 60; stop = 1.5 × ATR = 90 points. Lot 30 → ₹2,700 risk per lot. Risk budget ₹6,000 → 6,000 ÷ 2,700 = 2.2 → **2 lots** (₹5,400 at risk). Always round down.` },
      { h: 'India', md: `Compare two NSE stocks on the same day (illustrative): HDFCBANK 5-minute ATR ₹3.20, a small-cap with ATR ₹9.50. With a ₹4,000 risk budget and 1.5 × ATR stops:
- HDFCBANK: stop ₹4.80 → 833 shares.
- Small-cap: stop ₹14.25 → 280 shares.
Same rupee risk, very different share counts. This is the single most useful application of ATR.

For India VIX-driven days (high implied volatility), expect wider ATR at the open. Check that your stops scale with it rather than using fixed point stops.` },
      { h: 'US & global', md: `SPY's 5-minute ATR might be around $0.60 on a quiet day and double on CPI day. NVDA's might be several dollars. A Donchian(20) breakout on a 5-minute NVDA chart during a high-ATR session needs a wider stop; use ATR-based sizing so a breakout trade on NVDA risks the same dollars as one on SPY. Gold and Bitcoin presets in the Chart Lab show how near-continuous markets have few or no session gaps (Bitcoin trades 24/7; gold futures still have a short daily break and a weekend gap) but still cluster volatility around major sessions.` },
      { h: 'Common misconceptions', md: `- **"High ATR is bearish."** ATR has no direction.
- **"Touching the lower Bollinger Band is a buy signal."** In a downtrend price can walk the lower band.
- **"A squeeze tells you which way it will break."** It does not.
- **"Fixed point stops are simpler and fine."** They are simple, and they ignore the most important variable in risk.
- **"More band indicators = more confirmation."** They are largely redundant.` },
      { h: 'When it fails', md: `- Sudden regime shifts: ATR from a quiet morning underestimates the post-news range, so stops are too tight.
- Gaps: ATR does not protect you from a gap through your stop overnight or on a halt.
- **Losing example.** Nifty squeeze on the 5-minute; you buy the first close above the upper Bollinger at 24,960, stop at the middle band 24,925 (35 × 65 = ₹2,275 per lot). Price expands **downward** after a fake upside poke — the squeeze resolved the other way. The squeeze predicted expansion correctly and direction not at all.` },
      { h: 'Exercise', md: `1. In the Chart Lab load BANKNIFTY with bb, kc and atr. Mark each squeeze (Bollinger inside Keltner) and the direction of the following expansion.
2. Compute one TR and ATR update by hand.
3. Use [[widget:position-size]] to size the same setup on NIFTY and BANKNIFTY with 1.5 × ATR stops and identical risk.
4. Journal ten trades with fixed stops and ten with ATR stops (paper only); compare how often noise stopped you out.` },
    ],
    check: [
      { q: 'Prev close 500; bar H 508, L 503. What is the true range?', o: ['5', '13', '3', '8'], a: 3, why: 'H − L = 5; |H − PC| = 8; |L − PC| = 3. TR = max = 8.' },
      { q: 'Bollinger Bands contract inside Keltner Channels. What can you honestly conclude?', o: ['An upside breakout is coming', 'Volatility is compressed and may expand; direction is unknown', 'The trend is down', 'Nothing at all'], a: 1, why: 'Volatility clustering supports expansion as plausible; no directional information exists in the squeeze itself.' },
      { q: 'Risk budget ₹5,000, Nifty stop 1.5 × ATR with ATR 30, lot 65. How many lots?', o: ['1', '2', '3', '0'], a: 0, why: 'Stop 45 points × 65 = ₹2,925 per lot; 5,000 ÷ 2,925 = 1.7 → round down to 1 lot.' },
    ],
    refs: ['J. Welles Wilder — New Concepts in Technical Trading Systems (book)', 'John Bollinger — Bollinger on Bollinger Bands (book)', 'Curtis Faith — Way of the Turtle (book)', 'John Carter — Mastering the Trade (book)'],
  },
  {
    id: 'l2-trend-tools', module: 'L2-M3', level: 2, track: 'ta', title: 'Trend tools: MACD, ADX/DMI, Supertrend, PSAR, Ichimoku', mins: 20,
    summary: 'Compute and interpret MACD, ADX/DMI, Supertrend, Parabolic SAR and Ichimoku, and choose at most one or two of them for a clear purpose: trend strength, direction or trailing exits.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `Trend tools try to answer two questions: **is there a trend?** and **which way?** Some also give you a trailing stop that follows the trend.

| Tool | Main question it answers |
|---|---|
| MACD | Direction and momentum of the trend (difference of two EMAs) |
| ADX / DMI | How strong is the trend (ADX), and which side dominates (+DI vs −DI) |
| Supertrend | Direction plus an ATR-based trailing stop line |
| Parabolic SAR | A trailing stop that accelerates as the trend runs |
| Ichimoku | A complete system: trend, momentum and support zones |

Analogy: different instruments on a ship's bridge. A compass (direction), a speed log (strength), and an autopilot line (trailing stop). You do not need five compasses.

> [!evidence] All five are deterministic functions of past prices — **established** maths, unavoidably lagging. Trend-following as a broad approach has **mixed** but substantial evidence over long horizons in futures markets; intraday performance of specific crossover rules is highly regime- and cost-dependent.` },
      { h: 'Intermediate view', md: `### MACD (12, 26, 9)
- MACD line = EMA12 − EMA26. Signal = EMA9 of MACD. Histogram = MACD − signal.
- MACD crossing zero **is** an EMA12/EMA26 crossover. Signal-line crosses are a faster, noisier version.
- Use: momentum direction on your timeframe; histogram shrinking warns that momentum is fading.

### ADX / DMI (14)
- +DI and −DI measure upward vs downward movement; ADX measures how strong the dominant side is, regardless of direction.
- Common practitioner thresholds: ADX below about 20 = weak/no trend; above about 25 and rising = trending. These are conventions.
- Use: a **regime filter** — trade breakouts and pullbacks when ADX is rising; favour range tactics when it is low.

### Supertrend (10, 3)
- A line placed m × ATR below price in an uptrend (above in a downtrend). It flips when price closes through it.
- Use: trailing stop and direction bias. Very popular among Indian intraday traders.

### Parabolic SAR (0.02, 0.02, 0.2)
- Dots that move toward price, accelerating each time a new extreme is made.
- Use: trailing exits in established trends. In ranges it flips constantly.

### Ichimoku (9, 26, 52)
- Tenkan (conversion), Kijun (base), Senkou A and B (the cloud, plotted 26 bars ahead), Chikou (close plotted 26 bars back).
- Use: price above a rising cloud with Tenkan above Kijun = trend up. The default settings are commonly said to reflect an older six-day Japanese trading week (9 ≈ one and a half weeks, 26 ≈ one month); whatever their origin, they are conventions, and many intraday traders keep them anyway.

[[chart:NIFTY:127:macd,adx,st]]

[[chart:SPY:131:psar,ema20]]` },
      { h: 'Advanced view', md: `### Every one of these lags, by design
They smooth past prices to reduce noise. Smoothing = lag. A Supertrend flip happens after price has already moved roughly m × ATR against the prior trend. A MACD zero cross happens after EMA12 has caught EMA26. If you take entries on the flip **and** exits on the opposite flip, you give back a chunk of every trend at both ends. Trend tools make money (when they do) only when trends are long relative to that lag.

### They overlap heavily
- MACD, EMA crossovers and Supertrend direction usually agree because all follow recent price slope.
- ADX is the most different: it measures strength, not direction, so it can complement one directional tool.
- A sensible minimal set: one directional tool (MACD **or** Supertrend **or** an EMA) + ADX as a regime filter + structure (swing highs/lows).

### Choose by job, not by popularity
| Job | Good fit |
|---|---|
| Regime filter | ADX |
| Trailing stop | Supertrend, PSAR, or a swing-low stop |
| Momentum fade warning | MACD histogram |
| All-in-one visual | Ichimoku (if you will learn it fully) |

### Parameter tinkering
Changing Supertrend from (10, 3) to (7, 2.5) because it "would have caught yesterday's move" is curve fitting. Pick sensible defaults, test across many sessions, and change only for a reason you can state in advance.` },
      { h: 'The maths', md: `### MACD
:::formula
EMA(t) = EMA(t−1) + k × (Close − EMA(t−1)),   k = 2 ÷ (n + 1)
MACD = EMA12 − EMA26;  Signal = EMA9(MACD);  Histogram = MACD − Signal
:::
Worked: EMA12 was 24,925, close 24,960, k = 2 ÷ 13 = 0.1538 → EMA12 = 24,925 + 0.1538 × 35 = 24,930.4. If EMA26 = 24,905.0, MACD = 25.4. Signal 18.0 → histogram = 7.4.

### ADX / DMI
:::formula
+DM = High − PrevHigh (if > PrevLow − Low and > 0), else 0
−DM = PrevLow − Low  (if > High − PrevHigh and > 0), else 0
+DI = 100 × smoothed(+DM) ÷ ATR;  −DI = 100 × smoothed(−DM) ÷ ATR
DX  = 100 × |+DI − −DI| ÷ (+DI + −DI);  ADX = Wilder-smoothed DX
:::
Worked: +DI 28, −DI 14 → DX = 100 × 14 ÷ 42 = 33.3. If yesterday's ADX was 24, new ADX = (13 × 24 + 33.3) ÷ 14 = 24.7 — rising, above 20.

### Supertrend
:::formula
Basic upper = (H + L) ÷ 2 + m × ATR;  Basic lower = (H + L) ÷ 2 − m × ATR
In an uptrend the line = max(previous line, basic lower); flip when close < line
(Reset: if the previous close was already below the previous line, the line restarts at the basic lower band)
:::
Worked (Nifty 5-minute): H 24,960, L 24,920, ATR(10) 20, m = 3 → mid 24,940; lower = 24,880. If the previous line was 24,870, new line = max(24,870, 24,880) = 24,880.

### Parabolic SAR
:::formula
SAR(next) = SAR + AF × (EP − SAR);  AF starts 0.02, +0.02 per new extreme, max 0.20
:::
Worked: SAR 24,850, EP 24,950, AF 0.04 → 24,850 + 0.04 × 100 = 24,854.

Two rules complete Wilder's method (both are in the app's engine): in an uptrend the new SAR may not sit above the lows of the previous two bars (if it would, it is set to the lower of them), and when price trades through the SAR it flips — the new SAR starts at the prior extreme point and AF resets to 0.02.

### Ichimoku
Tenkan = (9-bar high + 9-bar low) ÷ 2. With 9-bar high 24,980 and low 24,880, Tenkan = 24,930. Kijun (26-bar) with high 25,000, low 24,800 = 24,900. Senkou A = (24,930 + 24,900) ÷ 2 = 24,915, plotted 26 bars ahead.` },
      { h: 'India', md: `Supertrend (10, 3) on the Bank Nifty 5-minute chart is widely used. Illustrative trade: Supertrend flips up at 56,120 at 10:05 IST, ADX rises from 18 to 26. Long at 56,140 with the Supertrend line at 56,020 as stop (120 × 30 = ₹3,600 per lot). Trail with the line: by 11:30 it is at 56,330; price closes below at 56,310 and you exit for +170 points (₹5,100 gross per lot).

The same rules on a choppy afternoon (ADX 14) produce four flips in 90 minutes, each losing 40–70 points. The ADX filter would have kept you out of most of them — that is its job.` },
      { h: 'US & global', md: `In SPY, a MACD (12, 26, 9) on the 5-minute chart crossing above zero after 10:00 ET while ADX rises is a common momentum-confirmation idea. In NVDA, PSAR trailing works well only once a trend is established; in the first 15 minutes after the open it flips repeatedly. Ichimoku is popular in Japanese markets (it originated there) and in FX; on DAX intraday many traders use only the Kijun line as a trailing reference.` },
      { h: 'Common misconceptions', md: `- **"Supertrend is a strategy."** It is a trailing line. Entries on every flip have large whipsaw costs in ranges.
- **"High ADX means uptrend."** ADX is directionless. A falling market can have ADX 40.
- **"MACD and EMA crossovers confirm each other."** MACD is built from the EMAs.
- **"Ichimoku predicts the future because the cloud is plotted ahead."** The cloud is shifted forward, but it is computed from past data.
- **"Better settings will fix whipsaws."** Whipsaws are the cost of lag in ranges; settings just move the cost around.` },
      { h: 'When it fails', md: `- Range-bound sessions: every crossover rule bleeds.
- V-shaped reversals: lagging tools exit late and re-enter late.
- **Losing example.** Nifty: MACD crosses above signal at 24,905 at 12:20 IST; you buy, stop 24,880. ADX is 15 and falling (you ignored it). Price chops to 24,912 and back; stopped at 24,880 for −25 × 65 = −₹1,625 per lot. Two more crosses follow, each small losers. Three losses plus charges came from using a trend tool in a non-trend regime.` },
      { h: 'Exercise', md: `1. In the Chart Lab load NIFTY with macd, adx and st. Mark every Supertrend flip and the ADX value at that moment.
2. Split the flips into ADX above 20 and below 20. Compare the points gained or lost in each group.
3. Load SPY with psar and ema20 and note where PSAR flips happen within two bars of an EMA20 cross — that is redundancy in action.
4. Write a one-line rule in your journal that uses at most one directional tool and one regime filter.` },
    ],
    check: [
      { q: 'EMA12 is 100.0, the new close is 113. What is the new EMA12 (k = 2/13)?', o: ['101.0', '113.0', '102.0', '106.5'], a: 2, why: '100 + 0.1538 × 13 = 100 + 2.0 = 102.0.' },
      { q: 'ADX is 38 and rising while +DI is well below −DI. What does that describe?', o: ['A strong uptrend', 'A squeeze', 'No trend', 'A strong downtrend'], a: 3, why: 'ADX measures strength; the DI lines give direction. −DI dominant with high ADX = strong downtrend.' },
      { q: 'Which pair is most redundant?', o: ['ADX and MACD', 'MACD zero-cross and EMA12/26 crossover', 'ATR and Supertrend direction', 'Volume and Ichimoku'], a: 1, why: 'MACD = EMA12 − EMA26, so its zero cross is the EMA crossover by definition.' },
    ],
    refs: ['Gerald Appel — Technical Analysis: Power Tools for Active Investors (book)', 'J. Welles Wilder — New Concepts in Technical Trading Systems (book)', 'Nicole Elliott — Ichimoku Charts (book)', 'Hurst, Ooi, Pedersen — A Century of Evidence on Trend-Following Investing, AQR (2017)'],
  },
  {
    id: 'l2-confluence', module: 'L2-M3', level: 2, track: 'ta', title: 'Indicator lag, redundancy and real confluence', mins: 18,
    summary: 'Quantify indicator lag, spot redundant indicators, and build confluence from independent categories of evidence instead of stacking look-alike signals.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Many traders believe that the more indicators agree, the better the trade. That is only true if the indicators bring **different information**. If you ask the same friend the same question three times, you do not have three opinions.

Three ideas to master:
1. **Lag**: every indicator built from past prices responds after price moves.
2. **Redundancy**: many indicators are mathematically close relatives and agree by construction.
3. **Real confluence**: agreement between **independent** types of evidence — for example a price level, the higher-timeframe trend, and participation (volume) — not between three momentum oscillators.

Analogy: a medical diagnosis. A doctor who checks your temperature with three thermometers knows only your temperature. A doctor who checks temperature, a blood test and an X-ray knows much more.

> [!evidence] Lag and redundancy are **established** mathematical facts. Whether a particular confluence checklist improves results is an empirical question you must test on your own trades; no checklist has a guaranteed hit rate.` },
      { h: 'Intermediate view', md: `### Indicator families
| Family | Members | Raw input |
|---|---|---|
| Trend / slope | SMA, EMA, MACD, Supertrend, PSAR, Ichimoku lines, trendlines | Recent closes or ranges |
| Momentum | RSI, Stochastic, Williams %R, CCI, ROC | Recent closes vs recent closes/range |
| Volatility | ATR, Bollinger, Keltner, Donchian | Recent ranges / dispersion |
| Volume / participation | Volume, OBV, VWAP, volume profile | Volume (a different raw input) |
| Strength / regime | ADX, efficiency ratio | Directional movement |
| Structure / location | Swing highs/lows, PDH/PDL, OR, value area | Price levels (where, not how fast) |
| Context | Higher timeframe, time of day, news calendar, index/sector | Outside the chart you are trading |

Indicators **within** a family are largely redundant. Confluence comes from **across** families.

### A practical confluence checklist
Score one point per category, not per indicator:
1. **Location**: at a graded level (S/R, VWAP, value area edge).
2. **Higher-timeframe trend** agrees (see [[link:l2-mtf]]).
3. **Momentum / trigger**: one tool — for example RSI turning or a rejection candle.
4. **Participation**: relative volume above normal for that time slot.
5. **Regime**: ADX or structure says trend (for continuation) or range (for fades).
6. **Room**: at least 1.5–2R to the next opposing level.

A 4–6 score is a candidate. Fewer is a pass. This is a **framework**; test it.

[[chart:NIFTY:144:ema9,ema20,rsi,stoch,macd]]

The chart above deliberately shows five indicators from two families. Notice how EMA9/EMA20 crosses, MACD crosses and RSI/Stochastic turns cluster at the same bars.` },
      { h: 'Advanced view', md: `### Correlation of signals
You can measure redundancy. Export indicator values and compute their correlation. RSI(14) and Stochastic(14) on the same instrument typically show high positive correlation; MACD histogram and RSI change are also correlated. Volume-based measures usually correlate much less with price-based oscillators. Low correlation is what makes evidence additive.

### The multiple-comparison trap
Each extra indicator or parameter adds a way to "find" a pattern in past data. With ten indicators and three settings each, there are thousands of combinations; some will look brilliant in hindsight by chance alone. This is data snooping, covered in [[link:l3-biases]]. Fewer, well-chosen inputs generalise better.

### Lag stacking
If your entry requires an EMA cross **and** a MACD cross **and** RSI above 50, you will typically enter late — after most fast-moving indicators have caught up. Then your stop (structure-based) is far away and R is poor. Requiring many lagging confirmations is a common cause of "I always buy the top".

### Leading vs lagging is mostly a myth
Oscillators are sometimes called leading indicators. They are computed from the same past prices and cannot lead. What can appear "leading" is **location** information (a level, a value area edge) and **context** information (the economic calendar). Those are where genuine independent evidence lives.

### Discretion still needs rules
Professionals often use very few indicators — VWAP, a moving average, volume — and spend their attention on structure, levels and context. That is not minimalism for its own sake; it reduces redundant noise.` },
      { h: 'The maths', md: `### Lag of moving averages
:::formula
SMA(n) average lag  = (n − 1) ÷ 2 bars
EMA(n) centre of mass = (1 − k) ÷ k bars,  k = 2 ÷ (n + 1)  →  also (n − 1) ÷ 2
Time lag = bar lag × bar length
:::

Worked:
- SMA20: lag = 19 ÷ 2 = 9.5 bars. On a 5-minute chart = 47.5 minutes.
- EMA20: k = 2 ÷ 21 = 0.0952; (1 − 0.0952) ÷ 0.0952 = 9.5 bars — the same average lag, but the EMA responds faster to the most recent bar because its weights are front-loaded.
- EMA9: (9 − 1) ÷ 2 = 4 bars = 20 minutes on 5-minute.

### Why redundancy matters for probability
If three signals were truly independent and each were right 55% of the time, then when all three agree the chance they are right is 0.55³ ÷ (0.55³ + 0.45³) ≈ 65% — a real improvement, though you would also get fewer signals because they agree less often. If they are near-perfectly correlated, the combined accuracy is still about 55% — you have just added lag. (These percentages are illustrative, not measured.)

### Confluence score example
Bank Nifty long setup:
| Category | Evidence | Point |
|---|---|---|
| Location | Pullback to VWAP and PDH retest | 1 |
| HTF trend | 60-minute higher highs | 1 |
| Trigger | Bullish engulfing close | 1 |
| Participation | Volume 1.4× slot average | 1 |
| Regime | ADX 27 rising | 1 |
| Room | Next resistance 2.1R away | 1 |
Score 6/6. Now add RSI, Stochastic and MACD all bullish: still 6/6 — they all sit inside "trigger/momentum".` },
      { h: 'India', md: `A common Indian retail setup combines Supertrend, MACD, RSI above 50 and price above EMA20 on Nifty 5-minute. All four are trend/momentum family members. Illustrative morning: by the time all four align, Nifty has rallied from 24,820 to 24,905; the structural stop (below the last higher low) is at 24,858 — 47 points away (₹3,055 per lot) — and the previous day high at 24,935 is only 30 points away (0.64R). Four confirmations, poor trade.

A leaner version: price at the opening-range high retest (location), Nifty 60-minute uptrend (context), relative volume (participation), one trigger candle. Entry earlier, tighter stop, more room.` },
      { h: 'US & global', md: `On NVDA, traders often stack MACD, RSI and Stochastic on a 1-minute chart. Those three agree almost tick for tick. Replacing two of them with SPY/QQQ direction (market context) and the premarket high (location) adds genuinely different information. In DAX, adding the US open time (usually 15:30 CET) as a context filter is more independent than any second oscillator.` },
      { h: 'Common misconceptions', md: `- **"Five indicators agreeing is five confirmations."** Only if they come from different families.
- **"Oscillators are leading."** They are computed from past prices.
- **"Removing indicators means less information."** Removing redundant ones removes noise and lag.
- **"Confluence guarantees a win."** It may improve the odds; losses remain normal.
- **"A perfect checklist exists."** Any checklist must be tested on your own data, and markets change.` },
      { h: 'When it fails', md: `- High-confluence setups still fail on news or when a larger timeframe disagrees.
- Checklists drift: traders loosen criteria after a few missed winners.
- **Losing example.** 6/6 Bank Nifty long at 56,210, stop 56,150 (60 × 30 = ₹1,800). An unexpected global risk-off move hits at 13:00 IST; price drops through 56,150 in two bars, filling at 56,135 with slippage (−75 points, −₹2,250 per lot). Confluence did not and cannot remove event risk. The plan was good; the result was a normal loss.` },
      { h: 'Exercise', md: `1. In the Chart Lab load NIFTY with ema9, ema20, rsi, stoch and macd. For 30 bars, record the bar where each indicator gives its signal. Measure the spread in bars between the first and last.
2. Strip the chart to vwap and vol. Re-plan the same trades with the six-category checklist.
3. Calculate the lag in minutes of EMA9 and SMA50 on 5-minute and 15-minute charts.
4. Journal ten setups with their category score; review after 30 to see whether higher scores did better for **you**.` },
    ],
    check: [
      { q: 'What is the average lag of a 20-period SMA on a 5-minute chart?', o: ['47.5 minutes', '20 minutes', '100 minutes', '9.5 minutes'], a: 0, why: '(20 − 1) ÷ 2 = 9.5 bars × 5 minutes = 47.5 minutes.' },
      { q: 'Which combination gives the most independent evidence?', o: ['RSI, Stochastic and CCI', 'EMA cross, MACD cross and Supertrend', 'A value-area-edge level, 60-minute trend and relative volume', 'Bollinger, Keltner and Donchian'], a: 2, why: 'Location, higher-timeframe context and participation come from different inputs; the others are within-family stacks.' },
      { q: 'A trader requires EMA cross + MACD cross + RSI > 50 before entering. What is the most likely side effect?', o: ['Earlier entries', 'No effect', 'Fewer losses guaranteed', 'Late entries with distant structural stops and poor R'], a: 3, why: 'Stacking lagging confirmations pushes entries later in the move.' },
    ],
    refs: ['John Bollinger — Bollinger on Bollinger Bands (book; discusses multicollinearity of indicators)', 'Perry Kaufman — Trading Systems and Methods (book)', 'David Aronson — Evidence-Based Technical Analysis (book)'],
  },
  {
    id: 'l2-fib-pivots', module: 'L2-M3', level: 2, track: 'ta', title: 'Fibonacci and pivot levels: uses and limits', mins: 17,
    summary: 'Calculate Fibonacci retracements and extensions, classic pivots and CPR, use them as optional reference levels, and understand why they are largely subjective and self-fulfilling.',
    evidence: 'subjective',
    sections: [
      { h: 'Beginner view', md: `**Fibonacci retracements** draw horizontal lines at fixed percentages (23.6%, 38.2%, 50%, 61.8%, 78.6%) of a prior swing. The idea is that pullbacks often pause near these fractions. **Pivot points** are levels calculated from yesterday's high, low and close; they are popular because everyone can compute the same numbers before the open.

Analogy: a town clock tower. The time it shows is not magic, but because everyone looks at it, meetings start there. Pivots and Fibonacci levels can matter for the same reason — many people watch them.

Why learn them: they are everywhere in Indian and global trading communities, and you should understand what they are and what they are not.

> [!evidence] **Subjective / self-fulfilling.** Fibonacci ratios have no established causal link to markets; the swing you choose changes every level. Pivots are objective to compute but their reactions, where they occur, are plausibly because many traders watch them. With many levels close together, some level will always appear to "work".` },
      { h: 'Intermediate view', md: `### Drawing Fibonacci retracements
1. Pick a clear, confirmed swing (low to high for an uptrend pullback).
2. Levels = High − ratio × (High − Low).
3. Treat 38.2–61.8% as a **zone**, not five separate signals.
4. Use it only where it overlaps an independent level: prior swing, VWAP, value area edge, or a round number.

### Extensions
Projections of the swing beyond its end (127.2%, 161.8%) are sometimes used as profit targets. They are conventions.

### Classic floor pivots
P, R1, R2, S1, S2 from yesterday's H, L, C (formulas below). Common use: bias above or below P; R1/S1 as first targets on normal days; R2/S2 on wider days.

### CPR (Central Pivot Range) — popular in India
Three lines: Pivot, Top Central (TC) and Bottom Central (BC). A **narrow CPR** relative to recent days is read by practitioners as a possible trending day; a **wide CPR** as a possible range day. This is a practitioner heuristic, not a tested law.

### Other variants
Camarilla, Woodie and Fibonacci pivots each use different formulas. More variants mean more lines, which increases the chance that some line coincides with any turn.

[[chart:BANKNIFTY:152:ema20,vwap]]

On the chart, draw retracements from the morning swing and compare where price actually paused with VWAP and prior swing levels.` },
      { h: 'Advanced view', md: `### The density problem
A 400-point Nifty swing with five Fibonacci levels has lines roughly 47–67 points apart (23.6→38.2% is 58 points, 38.2→50% and 50→61.8% are 47 points each, 61.8→78.6% is 67 points). Add seven pivot levels and CPR, and you may have a line every 25–35 points — similar to a single 5-minute ATR. Price will touch some line on almost every pullback by chance. That is why "it bounced off the 61.8" is weak evidence; you would have said the same about the 50 or the 38.2.

### Testing honestly
To test Fibonacci, fix the swing-selection rule in advance (for example, the last confirmed N = 3 swing on the 15-minute chart), then record reactions at **all** levels and at random levels with the same spacing. If the Fibonacci levels do not beat random lines, you have learned something useful.

### Why pivots may have some effect
Because pivots are computed identically by many platforms and traders, limit orders and stops can cluster near them, especially at R1/S1. That is a self-fulfilling, liquidity-based mechanism — real while people watch, not a property of the formula itself.

### Better uses
- **Targets and planning**, not entries. "My target is the prior day high, which also sits near R1" is reasonable.
- **Bias filter** at most: above P and CPR with rising VWAP is consistent with an up bias — but VWAP alone conveys most of that.
- **Avoid** stacking Fibonacci levels from multiple swings until "confluence" appears — that is manufacturing coincidences.` },
      { h: 'The maths', md: `### Fibonacci retracement
:::formula
Level(r) = High − r × (High − Low),  r ∈ {0.236, 0.382, 0.5, 0.618, 0.786}
Extension(e) = Low + e × (High − Low),  e ∈ {1.272, 1.618}
:::
Worked (Nifty, illustrative): swing low 24,600, high 25,000, range 400.
- 38.2%: 25,000 − 152.8 = 24,847.2
- 50%: 24,800
- 61.8%: 25,000 − 247.2 = 24,752.8
- 161.8% extension: 24,600 + 647.2 = 25,247.2

### Classic pivots and CPR
:::formula
P  = (H + L + C) ÷ 3
R1 = 2P − L;  S1 = 2P − H
R2 = P + (H − L);  S2 = P − (H − L)
BC = (H + L) ÷ 2;  TC = 2P − BC   (swap so TC ≥ BC)
:::
Worked: yesterday H 25,010, L 24,830, C 24,950.
- P = 74,790 ÷ 3 = 24,930
- R1 = 49,860 − 24,830 = 25,030; S1 = 49,860 − 25,010 = 24,850
- R2 = 24,930 + 180 = 25,110; S2 = 24,930 − 180 = 24,750
- BC = 49,840 ÷ 2 = 24,920; TC = 49,860 − 24,920 = 24,940 → CPR width 20 points (0.08%).

Count the lines between 24,750 and 25,110: S2, S1, BC, P, TC, R1, R2 = 7 lines in 360 points — six gaps averaging 60 points, and three lines within 20 points of each other at the centre.` },
      { h: 'India', md: `CPR is heavily discussed in Indian trading communities. Illustrative Bank Nifty plan: CPR 56,080–56,120 (narrow vs the last five days), PDH 56,260, R1 56,300.

- Opens 56,150 above TC. First pullback holds 56,120 (TC) and VWAP together — the VWAP is the stronger independent fact.
- Long at 56,145, stop 56,075 (below BC with buffer) = 70 × 30 = ₹2,100 per lot.
- Target: PDH 56,260 (115 points, 1.6R); R1 56,300 for a runner.

Notice that every decision anchor here could be justified without CPR (VWAP, PDH). Ask yourself what CPR added.` },
      { h: 'US & global', md: `Floor pivots are usually attributed to exchange floor traders in the Chicago futures pits and are still printed by many US platforms. On SPY, R1/S1 frequently sit near whole-dollar levels and option strikes, which may explain some reactions. NVDA Fibonacci retracements after a large earnings move are popular on social media; the 38.2–61.8% zone is wide enough on a $20 swing ($7.64 to $12.36 of retracement) that "price bounced in the zone" carries little information.` },
      { h: 'Common misconceptions', md: `- **"Fibonacci ratios are natural laws of markets."** No established mechanism; reactions are better explained by attention and liquidity.
- **"The 61.8% is the golden level."** Lore, not measured fact.
- **"Narrow CPR means trend day."** A heuristic; test it.
- **"More pivot types = more precision."** More lines = more coincidences.
- **"Levels drawn after the move proved themselves."** Hindsight: you choose the swing that fits.` },
      { h: 'When it fails', md: `- Trend days slice through every retracement level.
- Different swing choices produce contradictory levels.
- **Losing example.** Nifty pulls back to the 61.8% retracement at 24,753; you buy at 24,760 with a stop at 24,730, just below the 61.8% zone to keep risk small (the 78.6% level at 24,686 would have meant a 74-point stop). Price breaks to 24,700 on falling Bank Nifty. Loss 30 × 65 = −₹1,950 per lot. Nothing at 24,753 except a ratio — no prior swing, no VWAP, no value edge. The level had no independent support.` },
      { h: 'Exercise', md: `1. In the Chart Lab load BANKNIFTY. Fix a swing rule (last confirmed N = 3 swing). Draw retracements before advancing.
2. Record reactions at each Fibonacci level and at three random lines in the same range.
3. Compute pivots and CPR for tomorrow from today's simulated H, L and C by hand.
4. Journal ten sessions: did reactions occur more at Fibonacci/pivots that overlapped VWAP or prior swings than at isolated ones?` },
    ],
    check: [
      { q: 'Yesterday H 600, L 580, C 590. What is the classic pivot P and R1?', o: ['P 590, R1 610', 'P 590, R1 600', 'P 585, R1 595', 'P 595, R1 610'], a: 1, why: 'P = 1,770 ÷ 3 = 590; R1 = 2 × 590 − 580 = 600.' },
      { q: 'Swing 24,600 → 25,000. Where is the 50% retracement?', o: ['24,800', '24,700', '24,850', '24,900'], a: 0, why: '25,000 − 0.5 × 400 = 24,800.' },
      { q: 'Why is "price bounced at a Fibonacci level" weak evidence?', o: ['Fibonacci is illegal', 'Price never reacts at Fibonacci levels', 'With many closely spaced levels, a touch of some level is likely by chance, and the swing was chosen in hindsight', 'Fibonacci only works in crypto'], a: 2, why: 'Level density and swing selection create coincidences; that is why the tool is labelled subjective.' },
    ],
    refs: ['Robert Fischer — Fibonacci Applications and Strategies for Traders (book)', 'Frank Ochoa — Secrets of a Pivot Boss (book)', 'David Aronson — Evidence-Based Technical Analysis (book)'],
  },
  );
  IA.content.questions.push(
  { id: 'L2-M3-q01', module: 'L2-M3', d: 1, q: 'Which pair of indicators measures largely the same thing?', o: ['ATR and OBV', 'VWAP and ADX', 'Volume and Bollinger bandwidth', 'RSI and Stochastic'], a: 3, why: 'Both describe recent closes relative to recent price movement; they mostly agree by construction.' },
  { id: 'L2-M3-q02', module: 'L2-M3', d: 2, q: 'AvgGain 10, AvgLoss 10, new bar +24 points. What is the new RSI (Wilder 14)?', o: ['About 54.2', 'About 70.0', 'About 50.0', 'About 60.5'], a: 0, why: 'AvgGain = (130 + 24) ÷ 14 = 11.0; AvgLoss = 130 ÷ 14 = 9.29; RS = 1.184; RSI = 100 − 100 ÷ 2.184 = 54.2.' },
  { id: 'L2-M3-q03', module: 'L2-M3', d: 2, q: 'Prev close 24,900; bar H 24,915, L 24,860. True range?', o: ['55', '15', '40', '45'], a: 0, why: 'H − L = 55; |H − PC| = 15; |L − PC| = 40. Max = 55.' },
  { id: 'L2-M3-q04', module: 'L2-M3', d: 3, q: 'Risk budget ₹8,000. Bank Nifty 5-min ATR 50; stop = 2 × ATR; lot 30. Maximum whole lots?', o: ['2', '1', '3', '4'], a: 0, why: 'Stop 100 points × 30 = ₹3,000 per lot; 8,000 ÷ 3,000 = 2.67 → 2 lots.' },
  { id: 'L2-M3-q05', module: 'L2-M3', d: 2, q: 'ADX 42 and rising. What does it tell you by itself?', o: ['Strong uptrend', 'Overbought', 'Strong trend, direction unknown without the DI lines', 'Range'], a: 2, why: 'ADX measures strength only; +DI vs −DI shows direction.' },
  { id: 'L2-M3-q06', module: 'L2-M3', d: 2, q: 'Supertrend (10,3): bar H 500, L 490, ATR 4. Basic lower band?', o: ['483', '486', '495', '507'], a: 0, why: 'Mid = 495; 495 − 3 × 4 = 483.' },
  { id: 'L2-M3-q07', module: 'L2-M3', d: 3, q: 'You are long Nifty futures from 24,850. 5-min RSI shows bearish divergence at 24,960 while the 60-min trend is up. Best response?', o: ['Reverse to short', 'Tighten the stop to below the last higher low and keep the position', 'Add two lots', 'Remove the stop'], a: 1, why: 'Divergence is a fading-momentum warning; manage the open position rather than predicting a reversal.' },
  { id: 'L2-M3-q08', module: 'L2-M3', d: 2, q: 'What is the average lag of an EMA(9) on a 15-minute chart?', o: ['60 minutes', '135 minutes', '15 minutes', '4 minutes'], a: 0, why: '(9 − 1) ÷ 2 = 4 bars × 15 minutes = 60 minutes.' },
  { id: 'L2-M3-q09', module: 'L2-M3', d: 3, q: 'Which checklist gives the most real confluence for a long?', o: ['MACD cross, EMA cross, Supertrend up, PSAR below', 'RSI > 50, Stochastic up, CCI > 0', 'At value-area low, 60-min uptrend, relative volume 1.5×, rejection candle', 'Bollinger, Keltner and Donchian all expanding'], a: 2, why: 'It combines location, context, participation and a trigger — different families.' },
  { id: 'L2-M3-q10', module: 'L2-M3', d: 2, q: 'Yesterday H 25,100, L 24,900, C 25,000. What are P and S1?', o: ['P 25,000, S1 24,900', 'P 25,000, S1 24,950', 'P 24,950, S1 24,900', 'P 25,000, S1 24,800'], a: 0, why: 'P = 75,000 ÷ 3 = 25,000; S1 = 2 × 25,000 − 25,100 = 24,900.' },
  { id: 'L2-M3-q11', module: 'L2-M3', d: 2, q: 'Swing low 56,000, high 56,500. Where is the 61.8% retracement?', o: ['56,309', '56,191', '56,250', '56,382'], a: 1, why: '56,500 − 0.618 × 500 = 56,500 − 309 = 56,191.' },
  { id: 'L2-M3-q12', module: 'L2-M3', d: 1, q: 'Which evidence label best fits Fibonacci retracements?', o: ['Established', 'Proven by regulators', 'Speculative crypto-only', 'Subjective / largely self-fulfilling'], a: 3, why: 'No causal mechanism is established; swing choice and level density drive apparent hits.' },
  { id: 'L2-M3-q13', module: 'L2-M3', d: 3, q: 'Bollinger SD20 is 15 and Keltner uses 2 × ATR10 with ATR10 = 18. Is a squeeze on, and what does it imply?', o: ['No squeeze; trend up', 'Squeeze on (±30 inside ±36); expansion plausible, direction unknown', 'Squeeze on; breakout up guaranteed', 'Cannot be computed'], a: 1, why: 'Bollinger ±2 × 15 = ±30 sits inside Keltner ±36. The squeeze says nothing about direction.' },
  );
  /* ===================== L2-M4 Multi-timeframe analysis ===================== */
  IA.content.lessons.push(
  {
    id: 'l2-mtf', module: 'L2-M4', level: 2, track: 'ta', title: 'Top-down analysis from daily to 1-minute', mins: 18,
    summary: 'Run a top-down analysis from the daily to the 1-minute chart, assign each timeframe a job, and resolve conflicts between timeframes with explicit rules.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `Every chart timeframe shows the same market at a different zoom level. The daily chart shows the big picture; the 1-minute chart shows the street you are walking on. **Top-down analysis** means starting from the widest view and zooming in, so that your small-timeframe trade fits inside the larger picture.

Analogy: planning a road trip. First you look at the country map (which highway?), then the city map (which exit?), then the street view (which lane?). Starting with street view, you might take a perfect turn onto the wrong highway.

Why it matters: many intraday losses come from trading a 5-minute signal straight into a daily resistance level, or shorting a 1-minute "breakdown" in the middle of a strong daily uptrend.

> [!evidence] Using multiple timeframes is a **widely used practitioner framework**. The idea that trading with the higher-timeframe trend improves results is plausible and consistent with momentum research, but evidence for specific intraday MTF rules is **mixed** and must be tested on your own trades.` },
      { h: 'Intermediate view', md: `### Give each timeframe one job
| Timeframe | Job | Typical questions |
|---|---|---|
| Daily | Context and big levels | Trend? Where are major S/R, PDH/PDL, gaps? |
| 60-minute | Directional bias for today | Which side is easier? Where are swing levels? |
| 15-minute | Setup and structure | Pullback, range or breakout? Opening range? |
| 5-minute | Entry trigger and stop | Rejection candle? VWAP reclaim? Stop below which swing? |
| 1-minute | Fine execution (optional) | Avoid buying into a spike; refine fills |

A common rule of thumb (from Alexander Elder's triple-screen idea, which suggests a factor of about five) is a ratio of roughly 4–6 between timeframes, for example 60-minute → 15-minute → 3- or 5-minute, or 15-minute → 3-minute → 1-minute for scalpers. In practice many traders use daily → 60-minute → 15-minute → 5-minute even though the last step is only 3×; the point is that each screen should show clearly different detail.

### The top-down routine (about 10 minutes before the open)
1. **Daily**: label trend (HH/HL or LH/LL), mark PDH/PDL/PDC, last two major swings, round numbers.
2. **60-minute**: label trend; note where the last swing high and low are.
3. **15-minute**: after the open, mark the opening range and VWAP.
4. **5-minute**: wait for your setup in the direction allowed by steps 1–3, at a level from steps 1–3.
5. **1-minute** (optional): time the entry within the 5-minute signal bar.

[[chart:NIFTY:166:ema20,ema50,vwap]]

[[chart:NIFTY:167:ema20,vwap,vol]]

Treat the first chart as the higher timeframe and the second as the trading timeframe: identify the bias on the first before looking for an entry on the second.

### Conflict rules
- **Aligned** (daily, 60-min and 15-min agree): normal size; trade with the trend.
- **Partially aligned** (60-min disagrees with daily): smaller size, nearer targets.
- **Opposed** (trading against daily and 60-min): only at major levels, half size, quick targets — or not at all.` },
      { h: 'Advanced view', md: `### Higher timeframes define the room
The best use of the higher timeframe is often not direction but **distance**: how far is the next significant level? A 5-minute long with a perfect trigger 20 points below a daily resistance has nowhere to go. Professionals measure R using levels from the higher timeframe.

### Lag compounds across timeframes
A 60-minute EMA20 has an average lag of 9.5 hours of trading (about 1.5 Indian sessions). A trend "flip" on the 60-minute is therefore late by intraday standards. Use structure (swing highs/lows) on the higher timeframe rather than slow indicators, so you are not working with yesterday's information.

### The current higher-timeframe bar is unfinished
At 11:00 IST, the current daily bar is only just over a quarter complete (105 of 375 minutes) and the current 60-minute bar may be minutes old. Do not read an unfinished higher-timeframe candle as a pattern. Use completed bars plus where price currently sits relative to their levels.

### Time-of-day overlay
Intraday, time is a timeframe of its own. The same 5-minute setup has different expected follow-through at 09:30, 12:30 and 15:00 IST. Add time of day as a context layer.

### Cross-market timeframes
For Nifty, overnight cues (GIFT Nifty, US close, Asian open) act like a higher-timeframe layer before 09:15 IST — see [[link:l2-overnight]]. For a single NSE stock, the sector index and Nifty itself are higher-level context.

### Avoiding timeframe shopping
If you look at enough timeframes, one will always support the trade you want. Fix your timeframe stack in advance and write it in your trading plan.` },
      { h: 'The maths', md: `### Timeframe ratios and lag
:::formula
Ratio  = higher bar length ÷ lower bar length   (aim ≈ 4–6)
Lag(minutes) = (n − 1) ÷ 2 × bar length
R using HTF level = (HTF level − Entry) ÷ (Entry − Stop)
:::

Worked lags (EMA20):
- 5-minute: 9.5 × 5 = 47.5 minutes.
- 15-minute: 9.5 × 15 = 142.5 minutes.
- 60-minute: 9.5 × 60 = 570 minutes ≈ 1.5 NSE sessions of 375 minutes.

### Worked top-down (Bank Nifty, illustrative)
- Daily: uptrend; PDH 56,420; major daily resistance 56,600.
- 60-minute: higher lows; last swing low 56,050.
- 15-minute: opening range 56,180–56,300; VWAP 56,240 rising.
- 5-minute: pullback to VWAP holds; bullish close at 56,260.
- Entry 56,265, stop 56,205 (below pullback low) = 60 points.
- Target A (PDH): 56,420 → 155 points = 2.6R.
- Target B (daily resistance): 56,600 → 335 points = 5.6R (runner, unlikely but possible).
- 1 lot (30): risk ₹1,800; Target A ₹4,650 gross.

If the same 5-minute trigger appeared at 56,560, the daily resistance would be only 40 points away (0.67R): skip.` },
      { h: 'India', md: `RELIANCE (illustrative): daily downtrend (lower highs for three weeks), stock bounces 1.5% at the open with Nifty strong. On the 5-minute chart a clean breakout above the OR appears at ₹1,428.

Top-down check:
- Daily: the last lower high is ₹1,435 — only ₹7 above.
- 60-minute: still lower highs.
- Context: Nifty strong — the stock is following the index, not leading.
Decision: either skip, or take a small scalp to ₹1,434 with a tight stop. A short at ₹1,435 rejection is the trade aligned with the daily, if the rejection appears.

> [!india] Indices and heavyweight stocks move together: HDFCBANK, ICICIBANK, RELIANCE and INFY have large Nifty weights. A Nifty 60-minute trend often tells you more about a heavyweight's afternoon than its own 1-minute chart.` },
      { h: 'US & global', md: `SPY daily in an uptrend, 60-minute pulling back, 5-minute showing a VWAP reclaim at 10:40 ET: partially aligned → normal-to-reduced size, target the morning high. NVDA after a big earnings gap: the daily chart shows a gap above a multi-week range; the 60-minute has only one bar, so the premarket and the first 15 minutes act as the "higher timeframe" until more bars exist. DAX traders often treat the US open (usually 15:30 CET) as a regime change and re-run the top-down then.` },
      { h: 'Common misconceptions', md: `- **"More timeframes = better analysis."** Three or four with defined jobs is enough.
- **"Never trade against the daily trend."** Counter-trend trades at major levels can be valid with smaller size and nearer targets.
- **"The 1-minute chart gives better entries."** It gives tighter stops, which noise hits more often.
- **"Higher timeframe signals are always right."** They are slower, not more accurate.
- **"An unfinished daily candle is a pattern."** Wait for it to close.` },
      { h: 'When it fails', md: `- Regime shifts during the day (news) make the morning top-down obsolete.
- Strong reversal days begin as "against the higher timeframe".
- **Losing example.** Nifty daily up, 60-minute up, 5-minute pullback to VWAP: long at 24,930, stop 24,900. At 14:00 IST a large selloff in global markets drags Nifty down 120 points in 30 minutes; stopped for −30 × 65 = −₹1,950 per lot. All timeframes aligned; the loss came from outside the chart. Alignment improves context, not certainty.` },
      { h: 'Exercise', md: `1. In the Chart Lab, open the same preset (NIFTY) and seed with different indicators to simulate two timeframes. Write the job of each in your journal.
2. Perform the five-step top-down routine on paper before advancing the lower chart.
3. For each trade idea, compute R to the nearest higher-timeframe level with [[widget:rr]].
4. Classify 20 paper trades as aligned, partial or opposed. After 20, compare average R by group.` },
    ],
    check: [
      { q: 'A 5-minute long trigger appears 30 points below a daily resistance; your stop must be 40 points. What does top-down analysis suggest?', o: ['Take it; the trigger is clean', 'Switch to the 1-minute chart', 'Move the stop to 10 points', 'Skip or scalp: the higher-timeframe level leaves R below 1'], a: 3, why: 'The higher timeframe defines the room. 30 ÷ 40 = 0.75R. Shrinking the stop to fit is self-deception.' },
      { q: 'What is the average lag of an EMA20 on a 60-minute chart, in NSE sessions (375 minutes)?', o: ['About 0.25 sessions', 'About 1.5 sessions', 'About 4 sessions', 'No lag'], a: 1, why: '9.5 bars × 60 = 570 minutes ÷ 375 ≈ 1.5 sessions.' },
      { q: 'Daily up, 60-minute down, 15-minute down. You see a 5-minute short trigger. How should you classify and manage it?', o: ['Partially aligned against the daily: reduced size and nearer targets', 'Fully aligned; full size', 'Opposed; never trade', 'Irrelevant'], a: 0, why: 'The intraday frames agree but the daily disagrees — partial alignment.' },
    ],
    refs: ['Alexander Elder — Trading for a Living / The New Trading for a Living (book; triple screen)', 'John J. Murphy — Technical Analysis of the Financial Markets (book)', 'Brian Shannon — Technical Analysis Using Multiple Timeframes (book)'],
  },
  {
    id: 'l2-chart-reading', module: 'L2-M4', level: 2, track: 'ta', title: 'A repeatable chart-reading routine', mins: 17,
    summary: 'Apply a fixed, written chart-reading routine — context, structure, levels, participation, trigger, risk — that turns everything in Level 2 into a checklist you can journal and review.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `By now you know many tools. The danger is using them randomly — a trendline today, an RSI signal tomorrow, a Fibonacci level when you are bored. A **routine** is a fixed order of questions you ask every time you look at a chart, so your decisions are consistent and can be reviewed.

Analogy: a pilot's pre-flight checklist. Experienced pilots still use it, not because they forget, but because a checklist catches the one thing a busy mind skips.

Why it matters: you cannot improve what you do not do consistently. A routine makes your trades comparable in a journal, so you can find out what actually works for you.

> [!evidence] The value of checklists for reducing errors under pressure is **established** in fields like aviation and surgery. The specific chart-reading steps below are a **framework**; their contribution to trading results must be measured in your own journal.` },
      { h: 'Intermediate view', md: `### The six-step routine (C-S-L-P-T-R)
1. **Context** — What day is it? Event calendar (RBI, CPI, FOMC, results), expiry day, overnight cues, higher-timeframe trend ([[link:l2-mtf]]). Output: bias (long / short / neutral) and size modifier.
2. **Structure** — Trend, range or transition on your trading timeframe ([[link:l2-dow]], [[link:l2-phases]]). Output: which tactics are allowed (pullbacks, breakouts, fades).
3. **Levels** — PDH/PDL/PDC, opening range, VWAP and bands, value area, prior swings, round numbers ([[link:l2-sr]], [[link:l2-opening-range]], [[link:l2-volume-profile]]). Output: a short ranked list of 3–6 levels.
4. **Participation** — Relative volume for the time slot, index and sector agreement. Output: strong / normal / weak.
5. **Trigger** — One defined entry signal at a level: rejection candle, break-and-close, VWAP reclaim, or a single oscillator condition. Output: yes / no.
6. **Risk** — Stop beyond structure with an ATR buffer, room to the next level (R), position size ([[widget:position-size]]), and costs ([[widget:charges-india]] or [[widget:charges-us]]). Output: go / no-go and size.

### Writing it down
For each trade, fill a one-line record: {{date | instrument | context | structure | level | participation | trigger | R planned | size | result R | notes}}. That line is the raw material of your improvement.

[[chart:BANKNIFTY:181:vwap,vol,ema20,atr]]

### What is deliberately missing
- No second or third oscillator (redundant; see [[link:l2-confluence]]).
- No Fibonacci or pivots as primary reasons (subjective; at most a tie-breaker; see [[link:l2-fib-pivots]]).
- No prediction step. The routine asks "where and when would I act?", not "where will price go?"` },
      { h: 'Advanced view', md: `### Precommit, then execute
Professionals do steps 1–3 before the session and write them down. During the session they only check 4–6. This splits slow thinking (analysis) from fast thinking (execution) and reduces impulsive trades.

### If-then plans
Convert levels into explicit conditional plans: "If Bank Nifty holds above VWAP after a pullback and relative volume is above normal, then long on a 5-minute close above the pullback bar high, stop below the pullback low, target PDH." If-then statements are easy to review and hard to rationalise after the fact.

### Kill criteria
Write what invalidates your bias for the day — for example, "a 15-minute close below the opening-range low cancels my long bias". When it happens, you stop looking for longs. This prevents the most expensive intraday error: fighting a day that has clearly changed.

### Reviewing the routine itself
Every 20–30 trades, tag results by each step's output: did "strong participation" trades do better? Did "partial alignment" trades lose more? Only change the routine based on enough trades — small samples mislead (see [[link:l3-significance]]).

### Speed
A routine you cannot complete in under a minute during the session will be skipped. Keep the in-session part to three questions: participation, trigger, risk.` },
      { h: 'The maths', md: `### Turning the routine into numbers
:::formula
Planned R          = (Target − Entry) ÷ (Entry − Stop)
Size (units)       = Risk budget ÷ (Entry − Stop)
Net R after costs  = (Gross P&L − Charges) ÷ Risk in ₹
Expectancy per trade = Win% × Avg win R − Loss% × Avg loss R
:::

### Worked example (Nifty futures, illustrative)
1. Context: daily up, no major event, not expiry → long bias, normal size.
2. Structure: 15-minute higher lows → pullbacks allowed.
3. Levels: VWAP 24,905; OR high 24,930; PDH 24,985.
4. Participation: relative volume 1.3× → normal-strong.
5. Trigger: pullback to VWAP, 5-minute close at 24,918 above the prior bar high.
6. Risk: stop 24,893 (below pullback low 24,899 minus 6-point buffer, ATR 24). Entry 24,920.
   - Risk = 27 points; target PDH 24,985 → reward 65 points; R = 2.4.
   - Risk budget ₹4,000; per lot risk 27 × 65 = ₹1,755 → 2 lots (₹3,510).
   - Charges for 2 lots round trip (computed with the app's cost engine at the Nov 2026 rates in [[widget:charges-india]] — verify current rates on nseindia.com and with your broker): about ₹1,880 in total. Most of it is STT at 0.05% of the sell value (about ₹1,620 on ₹32.5 lakh); the rest is brokerage, exchange fees, SEBI fee, GST and stamp duty.
   - If the target hits: gross = 65 × 130 = ₹8,450; net ≈ ₹6,570; net R = 6,570 ÷ 3,510 ≈ 1.87R. Costs took about half an R off a 2.4R plan — this is why the risk step must include charges.

Over 30 trades with 45% winners at +2.2R and 55% losers at −1.05R (including costs): expectancy = 0.99 − 0.58 = +0.41R. These numbers are hypothetical, to show the calculation — your journal supplies the real ones.` },
      { h: 'India', md: `A sample pre-market card for a Tuesday (Nifty weekly expiry as of Nov 2026 — verify on nseindia.com):

| Step | Note |
|---|---|
| Context | Expiry day; GIFT Nifty flat; US closed mixed; daily uptrend; size × 0.5 until 10:15 IST |
| Structure | 60-minute range 24,850–24,990 |
| Levels | PDH 24,990, PDL 24,850, 25,000 round strike, VWAP after open |
| Kill criteria | 15-minute close below 24,850 cancels long bias |
| If-then 1 | Hold above VWAP + break of OR high → long to 24,990 |
| If-then 2 | Rejection at 25,000 + VWAP loss → short to VWAP/OR low |

The card fits on a phone screen and takes about five minutes to fill.` },
      { h: 'US & global', md: `For SPY or NVDA, the same routine applies with US-specific context: premarket high/low as levels, economic releases at 08:30 or 10:00 ET, FOMC at 14:00 ET, and the earnings calendar. In April 2026 the SEC approved FINRA's proposal to replace the pattern-day-trader rule and its $25,000 minimum with risk-based intraday margin standards; broker implementation timing varies (as of Nov 2026 — verify on finra.org and with your broker). Either way, apply your own daily trade and loss limits — the routine's risk step is where that rule lives.` },
      { h: 'Common misconceptions', md: `- **"Routines are for beginners."** Professionals rely on them most.
- **"A routine guarantees winning trades."** It guarantees consistent, reviewable decisions.
- **"More steps = better routine."** If it is too long you will skip it in live conditions.
- **"Once written, never change."** Change it based on evidence from enough trades, not after one loss.
- **"Routine kills intuition."** Intuition is pattern recognition built from consistent review — a routine accelerates it.` },
      { h: 'When it fails', md: `- Skipping steps under pressure, typically context (an event) or risk (size).
- Routine drift: quietly loosening criteria after missing a winner.
- **Losing example.** You complete the routine for a Bank Nifty long and everything scores well, but you skip the context step — RBI policy is at 10:00 IST. At 10:00 price drops 250 points; your stop at 56,180 fills at 56,120 with slippage. Planned loss 60 × 30 = ₹1,800; actual 120 × 30 = ₹3,600 per lot. The routine worked; the missing step cost double.` },
      { h: 'Exercise', md: `1. Write your C-S-L-P-T-R card in the journal for the next simulated session.
2. In the Chart Lab load BANKNIFTY with vwap, vol, ema20 and atr. Before advancing, write two if-then plans and one kill criterion.
3. Execute in the simulator only when a plan triggers. Record every trade in the one-line format.
4. After 20 trades, compute expectancy with [[widget:expectancy]] and tag results by each step's output.` },
    ],
    check: [
      { q: 'Your routine shows a perfect 5-minute trigger, but the context step reveals US CPI in 10 minutes. What is the disciplined action?', o: ['Take full size; the trigger is perfect', 'Remove the stop', 'Skip or wait until after the release, per your context rule', 'Take double size'], a: 2, why: 'Context precedes trigger. Scheduled events can gap through stops.' },
      { q: 'Risk budget ₹5,000, Nifty stop 30 points, lot 65. How many lots?', o: ['1', '5', '3', '2'], a: 3, why: 'Per lot risk = 30 × 65 = ₹1,950; 5,000 ÷ 1,950 = 2.56 → 2 lots.' },
      { q: 'Why does the routine allow only one trigger indicator?', o: ['Indicators are banned', 'Multiple momentum triggers are redundant and add lag without independent information', 'One is more profitable', 'SEBI requires it'], a: 1, why: 'Redundant triggers delay entries and give false confidence.' },
    ],
    refs: ['Atul Gawande — The Checklist Manifesto (book)', 'Brett Steenbarger — The Daily Trading Coach (book)', 'Peter Gollwitzer — Implementation intentions: strong effects of simple plans, American Psychologist (1999)'],
  },
  );
  IA.content.questions.push(
  { id: 'L2-M4-q01', module: 'L2-M4', d: 1, q: 'What is the first step of top-down analysis?', o: ['Find a 1-minute entry', 'Add more indicators', 'Choose a lot size', 'Read the higher-timeframe context (daily trend and major levels)'], a: 3, why: 'Top-down starts from the widest view so lower-timeframe trades fit inside it.' },
  { id: 'L2-M4-q02', module: 'L2-M4', d: 2, q: 'Which timeframe stack best fits a roughly 4–6× ratio for an intraday trader?', o: ['Daily → 60-min → 15-min → 5-min', 'Monthly → 1-min', '5-min → 4-min → 3-min', 'Daily → 1-min only'], a: 0, why: 'Daily to 60-minute (about 6× on a 375-minute NSE session) and 60 to 15 (4×) fit; 15 to 5 (3×) is a little below the range but common in practice. The other stacks either jump too far or barely change the view.' },
  { id: 'L2-M4-q03', module: 'L2-M4', d: 2, q: 'Bank Nifty 5-min long: entry 56,265, stop 56,205, PDH 56,420. What is R to PDH?', o: ['1.5', '2.0', '2.6', '3.2'], a: 2, why: 'Reward 155 ÷ risk 60 = 2.58 ≈ 2.6.' },
  { id: 'L2-M4-q04', module: 'L2-M4', d: 3, q: 'Daily downtrend, 60-min downtrend, a 5-min long trigger at a major daily support. How should this be handled?', o: ['Normal size', 'Opposed trade: only at a major level, half size and quick targets — or skip', 'Double size because it is cheap', 'It is aligned'], a: 1, why: 'Counter-trend trades are possible at major levels but warrant reduced size and nearer targets.' },
  { id: 'L2-M4-q05', module: 'L2-M4', d: 2, q: 'At 11:00 IST, today\'s daily candle looks like a hammer. What is the issue?', o: ['The daily bar is unfinished; it is not yet a pattern', 'None', 'Hammers only work weekly', 'It must be bearish'], a: 0, why: 'Higher-timeframe candles should be read once complete.' },
  { id: 'L2-M4-q06', module: 'L2-M4', d: 2, q: 'What is "timeframe shopping"?', o: ['Buying data feeds', 'Looking through timeframes until one supports the trade you already want', 'Using a fixed stack', 'Trading only one timeframe'], a: 1, why: 'It is a confirmation-bias trap; fix your stack in advance.' },
  { id: 'L2-M4-q07', module: 'L2-M4', d: 1, q: 'In the C-S-L-P-T-R routine, what does P stand for?', o: ['Profit', 'Pivot', 'Participation', 'Prediction'], a: 2, why: 'Participation: relative volume and index/sector agreement.' },
  { id: 'L2-M4-q08', module: 'L2-M4', d: 3, q: 'Nifty long: entry 24,920, stop 24,893, 2 lots of 65, target 24,985. Charges ₹1,900 round trip (mostly STT on the sell leg). Net P&L if target hits?', o: ['₹8,450', '₹4,025', '₹6,550', '₹7,250'], a: 2, why: 'Gross 65 points × 130 = ₹8,450; minus ₹1,900 = ₹6,550. On futures, STT at 0.05% of the sell value is the largest single cost.' },
  { id: 'L2-M4-q09', module: 'L2-M4', d: 2, q: 'Which is a well-formed kill criterion?', o: ['"If I feel nervous, exit"', '"A 15-minute close below the opening-range low cancels my long bias for the day"', '"Never lose"', '"Exit when RSI looks high"'], a: 1, why: 'It is specific, observable and pre-committed.' },
  { id: 'L2-M4-q10', module: 'L2-M4', d: 3, q: 'Over 30 trades: 40% win at +2.5R, 60% lose at −1.1R (after costs). Expectancy?', o: ['+0.34R', '+1.00R', '−0.16R', '+0.04R'], a: 0, why: '0.4 × 2.5 − 0.6 × 1.1 = 1.00 − 0.66 = +0.34R. Thirty trades is still a small sample.' },
  { id: 'L2-M4-q11', module: 'L2-M4', d: 2, q: 'Why split analysis (pre-market) from execution (in-session)?', o: ['It looks professional', 'Exchanges require it', 'It increases leverage', 'It separates slow deliberate thinking from fast decisions, reducing impulsive trades'], a: 3, why: 'Pre-committed plans are easier to follow and review than in-the-moment analysis.' },
  { id: 'L2-M4-q12', module: 'L2-M4', d: 3, q: 'RELIANCE daily shows lower highs; the last lower high is ₹1,435. A 5-min breakout appears at ₹1,428 with a ₹6 stop. What is R to the daily level, and what does top-down suggest?', o: ['R ≈ 1.2; marginal — scalp small or wait for a reaction at ₹1,435', 'R ≈ 3; full size', 'R ≈ 0.5; must short now', 'R cannot be computed'], a: 0, why: 'Reward ₹7 ÷ risk ₹6 ≈ 1.17R into a daily lower high — a weak trade by top-down standards.' },
  { id: 'L2-M4-q13', module: 'L2-M4', d: 2, q: 'All timeframes aligned, but a global selloff stops you out. What is the right lesson?', o: ['MTF analysis is useless', 'Alignment improves context, not certainty; losses from outside events are normal and must be sized for', 'Never use stops', 'Trade only the 1-minute'], a: 1, why: 'No framework removes event risk; position sizing handles it.' },
  );
})(typeof window !== 'undefined' ? window : globalThis);
