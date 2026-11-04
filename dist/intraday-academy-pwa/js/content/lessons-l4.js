/* Level 4 lessons: L4-M1 (order flow & execution), L4-M2 (quant foundations), L4-M3 (research process),
   L4-M5 (performance & discipline) + module assessments + READINESS exam. Follows docs/CONTENT-SPEC.md. */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  IA.content.lessons = IA.content.lessons || []; IA.content.questions = IA.content.questions || [];

  IA.content.lessons.push({
    id: 'l4-depth', module: 'L4-M1', level: 4, track: 'ta', title: 'Level 2, time & sales and tape reading', mins: 22,
    summary: 'Read a depth ladder and the time & sales print stream, quantify order-book imbalance, and know exactly what the retail feed can and cannot tell you.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `A candlestick is a summary. It tells you where price opened, went and closed, but not *how* it got there. Level 2 (market depth) and time & sales (the tape) are the raw material underneath every candle.

- **Level 2 / depth** shows resting limit orders waiting to trade: the best bids (buyers) stacked below the price and the best offers (sellers) stacked above, with the quantity at each price.
- **Time & sales** shows trades that actually happened: time, price, quantity and, on many platforms, whether the trade hit the bid or lifted the offer.

An analogy: depth is the list of people standing in a queue saying they *might* buy or sell. The tape is the receipt printer at the till. The queue can change its mind in a millisecond; the receipts cannot be undone.

Why it matters to you: when you trade intraday you are buying from or selling to the people in that queue. If the queue is thin, your market order walks through several price levels and you pay more than the screen price. Reading depth and the tape is first an *execution* skill and only second a *signal* skill.

> [!note] Everything in this lesson is about the mechanics of the order book (established). Whether reading it gives a repeatable trading edge is empirically mixed and depends heavily on the speed and quality of your data.` },
      { h: 'Intermediate view', md: `### Reading a depth ladder
A typical retail depth window for an NSE stock looks like this (illustrative numbers):

| Bid qty | Orders | Bid ₹ | Ask ₹ | Orders | Ask qty |
|---|---|---|---|---|---|
| 1,850 | 14 | 1,402.10 | 1,402.30 | 9 | 1,120 |
| 2,400 | 21 | 1,402.00 | 1,402.40 | 12 | 1,650 |
| 3,900 | 33 | 1,401.90 | 1,402.50 | 18 | 2,300 |
| 1,200 | 10 | 1,401.80 | 1,402.60 | 7 | 900 |
| 2,650 | 19 | 1,401.70 | 1,402.70 | 15 | 2,050 |

Things to read, in order:
1. **Spread** — best ask minus best bid: ₹0.20 here, about 1.4 basis points of price. Tight spread means cheap entry and exit.
2. **Size at the touch** — 1,850 bid vs 1,120 offered. That is how much you can trade at the best price before moving it.
3. **Orders count** — 1,850 shares from 14 orders (average ~132) is different from 1,850 shares from one order. Many small orders are more typical of genuine dispersed interest; one big order is easier to cancel.
4. **Cumulative depth** — total visible bid vs ask over all five levels.

### Reading time & sales
A tape snippet:

| Time | Price ₹ | Qty | Side |
|---|---|---|---|
| 10:14:02 | 1,402.30 | 400 | at ask (buyer aggressive) |
| 10:14:02 | 1,402.30 | 720 | at ask |
| 10:14:03 | 1,402.40 | 1,100 | at ask |
| 10:14:04 | 1,402.30 | 150 | at bid (seller aggressive) |

Three aggressive buys took out the entire 1,120 at ₹1,402.30 and part of ₹1,402.40. The ask level was *consumed*, not pulled. That distinction matters: price moving because sellers were absorbed by buyers is different from price moving because sellers cancelled their offers.

### Tape-reading questions to ask
- **Pace**: are prints arriving faster than usual? A burst of activity at a reference level (previous-day high, VWAP, opening range) is information.
- **Aggressor**: are trades lifting offers or hitting bids?
- **Absorption**: heavy selling prints at the bid while the bid price does not drop — someone is absorbing the selling with a large (possibly hidden or refreshing) bid.
- **Refill / iceberg**: an offer that keeps reappearing at the same size after being traded through suggests a larger order sliced into visible pieces.` },
      { h: 'Advanced view', md: `Professionals treat the order book as a noisy, adversarial signal.

**Visible depth is a fraction of real liquidity.** Large participants slice orders with algorithms (VWAP, TWAP, POV) and many venues support iceberg or reserve orders where only a slice is displayed. In the US, a large share of volume executes off-exchange (dark pools, internalisers), so the lit book under-represents true supply and demand.

**Flicker and spoofing.** High-frequency market makers add and cancel quotes constantly; a 50,000-share bid can appear and vanish in milliseconds. Deliberately placing orders you intend to cancel in order to mislead others is spoofing (or layering). In India it can be treated as a manipulative practice under SEBI's PFUTP regulations, and SEBI has taken enforcement action against such order patterns; in the US it is expressly prohibited by the Dodd-Frank anti-spoofing provision (Commodity Exchange Act) and pursued under securities law. You cannot see intent, so treat any single large resting order as *unconfirmed* until trades print against it.

**Queue position.** At a given price, limit orders fill in time priority on NSE (price-time priority). Joining the back of a 3,900-share bid means 3,900 shares must trade before you fill. If you fill quickly at a heavy level, ask why: often it is because price is about to go through it (adverse selection).

**What actually has some empirical support.** Academic microstructure work (for example Cont, Kukanov and Stoikov on order-flow imbalance) finds that short-horizon price changes are related to imbalances in order-book events. The effect is measured in seconds and ticks, and is largely captured by firms with co-located, full-depth feeds. A retail trader with a delayed snapshot should use depth mainly to judge liquidity and execution cost, and only cautiously as a directional hint.` },
      { h: 'The maths', md: `### Order-book imbalance
:::formula
Imbalance (touch) = (Qbid − Qask) / (Qbid + Qask)
Imbalance (depth k) = (ΣQbid,1..k − ΣQask,1..k) / (ΣQbid,1..k + ΣQask,1..k)
:::
The value runs from −1 (only offers) to +1 (only bids).

Worked example using the ladder above:
- Touch: (1,850 − 1,120) / (1,850 + 1,120) = 730 / 2,970 = **+0.246**
- Five levels: bids 1,850 + 2,400 + 3,900 + 1,200 + 2,650 = 12,000; asks 1,120 + 1,650 + 2,300 + 900 + 2,050 = 8,020. Imbalance = 3,980 / 20,020 = **+0.199**

A mild bid-side imbalance. On its own this means little; one cancelled 3,900 order changes the five-level figure to (8,100 − 8,020) / 16,120 = +0.005 — essentially flat. That fragility is exactly why imbalance must be confirmed by prints.

### Micro-price
A size-weighted mid is a better estimate of "fair" short-term price than the plain mid:
:::formula
Mid = (Bid + Ask) / 2
Micro-price = (Ask × Qbid + Bid × Qask) / (Qbid + Qask)
:::
Mid = (1,402.10 + 1,402.30)/2 = ₹1,402.20. Micro = (1,402.30 × 1,850 + 1,402.10 × 1,120) / 2,970 = ₹1,402.225. The heavier bid pulls the estimate towards the ask.

### Cost of walking the book
You send a market buy for 3,000 shares. Fills: 1,120 at 1,402.30, 1,650 at 1,402.40, 230 at 1,402.50.
:::formula
Avg = (1,120×1,402.30 + 1,650×1,402.40 + 230×1,402.50) / 3,000
    = (15,70,576 + 23,13,960 + 3,22,575) / 3,000 = 42,07,111 / 3,000 = ₹1,402.37
:::
Versus the mid of ₹1,402.20 you paid ₹0.17 per share, or ₹510 total — about 1.2 bps — before any brokerage or tax. Do this calculation before every size increase.` },
      { h: 'India', md: `> [!india] Retail brokers in India typically show **5-level depth** for free; several offer **20-level depth** (some brokers label it "Level 3", sometimes as a paid or opt-in feature), and at least one broker has advertised depth of up to 200 levels on selected instruments. NSE's full order-by-order (tick-by-tick) feed is a licensed data product used by institutions, vendors and co-located members; the standard retail screen does not show every individual order. Retail depth is usually an aggregated, periodic snapshot (often refreshed around once a second or on change), so you are not seeing every add and cancel — and even deeper ladders remain a delayed, aggregated view compared with a co-located feed. As of Nov 2026 — verify depth levels, refresh rate and feed type with your broker.

Practical consequences:
- On Nifty and Bank Nifty futures and liquid large caps (Reliance, HDFC Bank, ICICI Bank), the touch is usually deep enough that retail size barely moves price. On thinly traded small caps, five levels can be a few hundred shares and one market order can move price by 0.5% or more.
- Weekly Nifty option strikes far from the money can show wide spreads and tiny depth. A ₹2.50 option with a ₹0.30 spread has a 12% round-trip spread cost.
- The opening minutes after 09:15 and the closing session behave differently: depth is thinner and flicker higher in the first minute after the pre-open match.` },
      { h: 'US & global', md: `> [!us] US equities trade across many exchanges plus off-exchange venues. Level 1 is the NBBO (national best bid and offer); Level 2 aggregates quotes from multiple venues. Time & sales prints include off-exchange trades reported to a TRF, so you will see prints that never appeared in any visible book. Futures (CME) have a single central book with full market-by-price depth available to retail through many platforms, which is why order-flow tools are most popular there.

In crypto, venues publish full depth publicly, but wash trading and fragmented venues make volume less trustworthy.` },
      { h: 'Common misconceptions', md: `- **"A big bid is support."** Only if it trades. Large visible orders are cancelled often; spoofing exists precisely because people believe this.
- **"Tape reading shows me what institutions are doing."** It shows trades, not identities. Institutional jargon is not proof of institutional activity; a large print can be a retail block, a hedge or a basket leg.
- **"Positive imbalance means price will rise."** It is a short-horizon tendency at best, measured in seconds, and easily reversed by one cancel.
- **"I can scalp like an HFT with my broker's depth."** Your data is a snapshot and your round trip includes network and broker latency. You are slower than the participants who exploit book signals.` },
      { h: 'When it fails', md: `Losing example: Reliance trades at ₹1,402.20. You see 25,000 shares bid at ₹1,401.00 (ten times the surrounding levels) and buy 500 shares at ₹1,402.30 expecting the wall to hold, stop at ₹1,400.80. Two minutes later the ₹1,401.00 bid vanishes without a single trade against it; price slides through and your stop fills at ₹1,400.60 after slippage. Loss: 500 × ₹1.70 = ₹850 plus costs.

What went wrong: you traded on an *unconfirmed* order. Failure conditions for depth reading in general:
- News or index-level moves (Nifty futures dropping) overwhelm single-stock book signals.
- Thin books where your own order is a meaningful part of depth.
- Fast markets where the snapshot is stale before you act.
- Expiry-day and event-day behaviour, when liquidity providers widen or pull quotes.` },
      { h: 'Exercise', md: `1. Open a liquid stock and a thin small cap in your broker's depth window at the same time (paper mode). Record spread, touch size, and five-level imbalance every 5 minutes for 30 minutes. Note how often the imbalance sign flips.
2. Using the ladder in this lesson, calculate the average fill for a 5,000-share market buy. Then enter the slippage in [[widget:position-size]] by widening your effective stop and see how it changes size.
3. In your journal, add a field "depth confirmed by prints? Y/N" for every trade where depth influenced your decision. After 30 trades compare outcomes.
4. Next: [[link:l4-footprint]].` },
    ],
    check: [
      { q: 'Best bid 1,200 shares, best ask 3,600 shares. What is the touch imbalance?', o: ['+0.50', '−0.33', '−0.50', '+0.33'], a: 2, why: '(1,200 − 3,600)/(1,200 + 3,600) = −2,400/4,800 = −0.50, an offer-heavy touch. The other values use the wrong sign or denominator.' },
      { q: 'An offer at ₹500.50 disappears. Which observation tells you it was consumed rather than cancelled?', o: ['Time & sales shows buy prints at ₹500.50 totalling roughly the displayed size', 'The bid size increased', 'The spread widened', 'The orders count fell'], a: 0, why: 'Only trades prove consumption. A spread change or order count drop is consistent with cancellation too.' },
      { q: 'Why should a retail trader in India treat the depth window mainly as an execution tool?', o: ['Depth is illegal to use for signals', 'Depth always lags by one minute', 'Depth only shows options', 'Retail sees 5/20-level snapshots, not the full order-by-order feed, and is slower than firms that exploit book signals'], a: 3, why: 'The data and latency gap makes short-horizon book signals hard to capture; liquidity and cost estimation remain fully valid uses.' },
    ],
    refs: ['Larry Harris — Trading and Exchanges: Market Microstructure for Practitioners (book)', 'Cont, Kukanov & Stoikov — The Price Impact of Order Book Events (Journal of Financial Econometrics, 2014)', 'NSE — Market data products / tick-by-tick data (nseindia.com)', 'SEBI — Prohibition of Fraudulent and Unfair Trade Practices Regulations (sebi.gov.in)'],
  });

  IA.content.lessons.push({
    id: 'l4-footprint', module: 'L4-M1', level: 4, track: 'ta', title: 'Footprint charts, delta and cumulative delta', mins: 22,
    summary: 'Build a footprint bar by hand, compute bar delta and cumulative volume delta, and judge when a delta divergence is information and when it is noise.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `Every trade has a buyer and a seller, so "more buyers than sellers" is meaningless — volume bought always equals volume sold. What *can* differ is who was **aggressive**. The aggressor is the side that crossed the spread with a market (or marketable limit) order:

- A trade at the ask means a buyer was impatient: **buy volume** (also called ask volume).
- A trade at the bid means a seller was impatient: **sell volume** (bid volume).

**Delta** is buy volume minus sell volume. A **footprint chart** splits each candle into price rows and shows, at each price, how much traded at the bid and at the ask. **Cumulative volume delta (CVD)** adds up delta through the session.

Analogy: in an auction hall, everybody eventually shakes hands, but the footprint tells you who kept raising their paddle. Impatience costs money (you pay the spread), so persistent aggression tells you someone wanted to get done.

> [!note] The arithmetic of delta is established. The idea that delta predicts the next move is empirically mixed: aggressive flow is also how informed traders get *trapped*, and passive limit orders can be the smarter side.` },
      { h: 'Intermediate view', md: `### Reading a footprint bar
A 5-minute Nifty futures bar, rows of 1 point (illustrative quantities in contracts):

| Price | Sell (bid) | Buy (ask) | Row delta |
|---|---|---|---|
| 24,812 | 40 | 15 | −25 |
| 24,811 | 120 | 210 | +90 |
| 24,810 | 180 | 390 | +210 |
| 24,809 | 260 | 240 | −20 |
| 24,808 | 310 | 95 | −215 |

How to read it:
1. **Bar delta** = sum of row deltas = −25 + 90 + 210 − 20 − 215 = **+40**. Total volume = 1,860. Delta is only about 2% of volume — close to balanced.
2. **Point of control** of the bar = row with the most total volume: 24,809 (500) and 24,810 (570) — the highest is 24,810.
3. **Diagonal imbalance**: footprint tools usually compare buy volume at one price with sell volume one tick *below* (because buyers lift the ask while sellers hit the bid one tick lower). Buy-side diagonals: 24,812 buy 15 vs 24,811 sell 120 = 0.13; 24,811 buy 210 vs 24,810 sell 180 = 1.17; 24,810 buy 390 vs 24,809 sell 260 = 1.5; 24,809 buy 240 vs 24,808 sell 310 = 0.77. Sell-side diagonals compare sell volume at a price with buy volume one tick *above*: 120 vs 15 = 8.0; 180 vs 210 = 0.86; 260 vs 390 = 0.67; 310 vs 240 = 1.29. A common threshold for a highlighted "imbalance" is 3:1 (300%). The only one that passes is the 8:1 sell imbalance at 24,811 — and it rests on just 15 contracts, which is why most tools also apply a minimum-volume filter before highlighting anything.
4. **Bottom row**: 310 sellers vs 95 buyers at the low — sellers were aggressive at the low but price did not go lower. That is a possible *absorption* or exhaustion print, to be confirmed by what happens next.

### Cumulative delta
CVD = running sum of bar deltas from the session open. Uses:
- **Confirmation**: price makes a new high and CVD makes a new high — aggressive buying is participating.
- **Divergence**: price makes a new high, CVD makes a lower high — the push is happening on less aggression (possibly passive sellers being lifted by fewer buyers, or short covering). This is a *caution* flag, not a short signal.
- **Absorption**: CVD falls sharply while price holds — sellers are aggressive but a passive buyer is taking everything.

[[chart:NIFTY:404:vwap,vol,obv]]

On the chart above, OBV is shown as a rough cousin of CVD built from candle direction. Real CVD needs trade-by-trade aggressor data; OBV assigns a whole bar's volume to one side and is much cruder.` },
      { h: 'Advanced view', md: `**How aggressor side is inferred.** Many feeds do not flag the aggressor. Platforms classify trades with the *tick rule* (trade above the previous different trade price = buy), the *quote rule* (at or above the ask = buy, at or below the bid = sell), or the Lee–Ready algorithm (above the quote midpoint = buy, below = sell, exactly at the midpoint = fall back to the tick rule). With snapshot quotes and batched trades, misclassification is common. Two platforms can show different delta for the same bar.

**Delta is reflexive in strong trends.** In a downtrend, short-term traders sell aggressively into every bounce; delta is negative almost every bar. A negative-delta bar in a downtrend tells you nothing new. Delta matters most at **locations** — prior day high/low, value area edges, VWAP, opening range — where you have a reason to expect a decision.

**Passive is not weak.** A large institution buying 2 lakh shares with a passive VWAP algorithm shows up as *sell* delta (it is getting hit on its bids). Delta can therefore point the wrong way relative to the true large participant.

**Normalise.** Raw delta grows with volume. Compare delta as a percentage of volume, or as a z-score against the same time-of-day bucket over the last 20 sessions, because 09:15–09:30 volume is many times midday volume.` },
      { h: 'The maths', md: `:::formula
Delta(bar) = Σ buy volume − Σ sell volume
Delta% = Delta / Total volume
CVD(t) = Σ Delta(bar i) for i = 1..t
Delta z = (Delta − mean of Delta in same time bucket) / stdev of that bucket
:::

Worked session (Bank Nifty futures, 15-min bars, contracts):

| Bar | Close | Buy vol | Sell vol | Delta | CVD |
|---|---|---|---|---|---|
| 09:15 | 55,120 | 6,200 | 5,400 | +800 | +800 |
| 09:30 | 55,210 | 4,900 | 4,100 | +800 | +1,600 |
| 09:45 | 55,180 | 3,300 | 3,700 | −400 | +1,200 |
| 10:00 | 55,260 | 3,100 | 3,000 | +100 | +1,300 |
| 10:15 | 55,290 | 2,800 | 3,200 | −400 | +900 |

Price made a new session high at 10:00 (55,260) and again at 10:15 (55,290), but CVD peaked at +1,600 at 09:30. That is a **bearish CVD divergence**: the last two highs came with net aggressive selling. Delta% at 10:15 = −400 / 6,000 = −6.7%.

Is −400 unusual? Suppose over the last 20 sessions the 10:15 bucket has mean delta +50 and standard deviation 600. z = (−400 − 50)/600 = −0.75 — well inside normal noise. Conclusion: the divergence is a mild caution, not a statistically unusual event. This is the habit to build: put every order-flow reading against its own distribution before acting on it.` },
      { h: 'India', md: `> [!india] Footprint and delta tools for NSE depend on your data vendor. NSE does not publish an aggressor flag on the retail feed, so tools infer it from trade price versus a quote snapshot. With 5/20-level snapshot depth rather than the full order-by-order stream, expect classification error, especially in fast Nifty and Bank Nifty futures moves around 09:15 and on expiry. As of Nov 2026 — verify your vendor's method.

Index futures (Nifty lot 65, Bank Nifty lot 30 from Jan 2026) are the most sensible Indian instruments for footprint work because of single-book, high liquidity. Options footprints are fragmented across hundreds of strikes and contaminated by hedging flows.` },
      { h: 'Common misconceptions', md: `- **"Positive delta means buyers are winning."** Price can fall on positive delta if passive sellers keep refilling offers.
- **"Footprint shows institutional orders."** It shows aggregated aggressive and passive trades at each price. Labels like "whale" or "smart money" in tools are marketing.
- **"A 3:1 imbalance is a signal."** The threshold is arbitrary. Test whether it adds anything to your existing setup before using it.
- **"CVD divergence predicts reversals."** Divergences can persist through an entire trend day.` },
      { h: 'When it fails', md: `Losing example: Bank Nifty futures rally to 55,290 with CVD divergence (table above). You short 1 lot (30) at 55,280, stop above the high at 55,330 (risk 50 points × 30 = ₹1,500). At 10:30 an RBI-related headline hits; sellers cancel their offers faster than buyers can lift them, so the bar prints only modest delta (−200) yet price jumps through a liquidity vacuum to 55,360 — pulled liquidity, not aggressive buying, moved the price. Your stop slips to 55,345: loss 65 × 30 = ₹1,950 plus costs.

Why it failed: a divergence is about *who was aggressive*, not about who has more capital waiting. News, short covering and pulled liquidity routinely override it. Other failure modes: misclassified trades, low-volume midday bars, and roll periods where calendar spread flow pollutes delta.` },
      { h: 'Professional notes', md: `- **Footprint cannot see spoofing.** A footprint is built only from executed trades. Resting orders that are placed and cancelled never appear in it. Spoofing acts on the *book* and shows up in the footprint only indirectly — for example as aggressive prints from traders who reacted to a fake wall. Use depth for resting interest, the footprint for completed aggression, and treat neither as proof of intent.
- **CVD depends on its anchor.** Session-anchored CVD, CVD anchored to a swing, and rolling-window CVD give different divergences on the same data. Write down which you use and keep it fixed when testing.
- **Bar delta hides the path.** A bar with +40 delta may have been −600 at one point and +500 at another. Many tools show min/max delta within the bar; a close near the extreme of delta tells a different story from a close near zero.
- **Contract roll and continuous charts.** A continuous Nifty or Bank Nifty futures chart switches contract at roll; CVD built across the switch mixes two books. Reset or mark CVD at the roll.
- **Units.** Check whether your vendor reports F&O volume in contracts or in underlying quantity (lots × lot size). A threshold that made sense in one unit is meaningless in the other.

> [!evidence] Trade-sign inference accuracy, order-flow imbalance effects and flow toxicity are active academic research areas (Lee & Ready; Cont, Kukanov & Stoikov; Easley, López de Prado & O'Hara). Retail footprint "signals" built on them have no established, published track record; test them on your own data before relying on them.` },
      { h: 'Exercise', md: `1. Copy the footprint bar table into your notebook and compute bar delta, delta%, POC and all diagonal ratios yourself. Check against the lesson.
2. In the chart lab, load [[chart:BANKNIFTY:77:vwap,vol,obv]]. Mark three places where price made a new high. Note whether OBV confirmed. Then write what *real* CVD would add and why OBV may disagree with it.
3. Design a test: "Short only at prior-day high, only when CVD diverges, stop 1 ATR above." Write the rule precisely enough that someone else would take exactly the same trades. You will test it in [[link:l4-walkforward]].` },
    ],
    check: [
      { q: 'A bar has buy volume 4,200 and sell volume 5,000 with total 9,200. What is delta%?', o: ['+8.7%', '−8.7%', '−16%', '−19%'], a: 1, why: 'Delta = 4,200 − 5,000 = −800; −800/9,200 = −8.7%. The others use the wrong denominator or sign.' },
      { q: 'A large fund buys with a passive limit-order VWAP algorithm all day. What delta would that flow most likely produce?', o: ['Negative or neutral — its passive bids are hit by sellers', 'Strongly positive', 'Exactly zero', 'Delta cannot measure it at all, so it shows as volume only'], a: 0, why: 'Delta counts the aggressor. A passive buyer is filled when sellers hit its bids, which counts as sell volume.' },
      { q: 'Price makes new highs while CVD makes lower highs, and the delta z-score is −0.4. Best interpretation?', o: ['Strong short signal', 'Proof of institutional distribution', 'Mild caution within normal noise; needs location and other evidence', 'Data error'], a: 2, why: 'A small z-score means the divergence is within typical variation. It is information, not a trigger.' },
    ],
    refs: ['Lee & Ready — Inferring Trade Direction from Intraday Data (Journal of Finance, 1991)', 'Larry Harris — Trading and Exchanges (book)', 'Easley, López de Prado & O\'Hara — Flow Toxicity and Liquidity in a High-Frequency World (Review of Financial Studies, 2012)'],
  });

  IA.content.lessons.push({
    id: 'l4-execution', module: 'L4-M1', level: 4, track: 'ta', title: 'Execution quality, slippage and market impact', mins: 22,
    summary: 'Measure slippage and implementation shortfall on your own fills, estimate market impact with the square-root rule, and choose order types that protect a small edge.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Your backtest says you bought at ₹1,000. In real life you bought at ₹1,000.60. That 60 paise is **slippage**: the gap between the price you planned on and the price you got. It sounds tiny. On a strategy that makes ₹2 per share per trade before costs, 60 paise each way is 60% of the edge gone.

Execution has three layers:
1. **Spread** — crossing from bid to ask costs half the spread each way versus mid.
2. **Slippage** — the market moves between your decision and your fill (latency, fast markets, stop orders triggering into a gap).
3. **Market impact** — your own order pushes price, because you consume liquidity.

A professional desk measures every one of these on every trade. Most retail traders never look. The result is a strategy that is profitable on paper and loses money live.` },
      { h: 'Intermediate view', md: `### Order types and their execution cost
| Order | You control | You risk | Typical use |
|---|---|---|---|
| Market | Fill certainty | Price — you walk the book | Urgent exits, very liquid instruments |
| Limit at touch (passive) | Price | Not filling; adverse selection | Entries in liquid names, patient exits |
| Marketable limit (limit a few ticks through) | A price cap | Partial fill | Default for most intraday entries |
| Stop-market (SL-M) | Fill once triggered | Gaps and fast-market slippage | Protective stops where a fill matters most |
| Stop-limit (SL) | Price cap after trigger | No fill in a fast move | Only where you accept the risk of not exiting |

### Measuring your slippage
For every trade log three prices: **decision price** (price when you decided, e.g. the signal bar close or mid at the moment), **arrival price** (mid when the order reached the exchange), **fill price**. Then:
:::formula
Slippage (bps) = side × (Fill − Decision) / Decision × 10,000
side = +1 for buys, −1 for sells
:::
Positive = cost. Track the average and the 90th percentile separately: the average hides the bad fills on stops that actually hurt.

### Practical rules
- Trade the liquid hours. NSE spreads are widest in the first minutes after 09:15 and liquidity thins in the lunch lull.
- Size relative to touch depth: if your order is larger than the size at the best price, expect to walk the book.
- Stops in thin instruments will slip; widen the stop or reduce size *in advance* rather than discover it.
- Avoid market orders in illiquid option strikes; use limits near mid and accept missed trades.

> [!india] NSE has blocked stop-loss *market* (SL-M) orders in index options since September 2021 to limit freak trades, and many brokers also restrict SL-M or plain market orders in other F&O contracts, or convert market orders into limit orders with a "market protection" band. In options you will usually have to use a stop-limit (SL) with a wide enough limit. As of Nov 2026 — verify which order types your broker and NSE currently accept for each segment.` },
      { h: 'Advanced view', md: `### Implementation shortfall
Defined by André Perold (1988), implementation shortfall (IS) compares your real portfolio to a "paper" portfolio that traded the entire intended quantity at the decision price with no cost. It captures everything:
- **Delay cost** — price drift between decision and order arrival.
- **Execution (trading) cost** — fill vs arrival, including spread and impact.
- **Opportunity cost** — the move you missed on the part that never filled.
- **Explicit costs** — brokerage, STT, exchange, stamp duty, GST.

Professional execution desks benchmark algorithms against arrival price (IS) or VWAP. VWAP is easy to beat by trading passively on a day that trends against you — which is why IS is the more honest benchmark.

### Market impact and the square-root law
Empirically, the impact of a meta-order (a large order executed over time) scales roughly with the square root of its size relative to daily volume. This is one of the more robust empirical regularities in microstructure, documented across markets (e.g. work by Almgren and co-authors, and Bouchaud and colleagues). Coefficients vary by instrument and period, so treat any estimate as order-of-magnitude.

Impact is partly **temporary** (price reverts after you finish) and partly **permanent** (information content). A strategy that looks profitable at 1 lot can die at 50 lots purely from impact — this is the *capacity* of a strategy.` },
      { h: 'The maths', md: `### Square-root impact estimate
:::formula
Impact ≈ Y × σ_daily × √(Q / ADV)
:::
Y is a constant of order 1 (often 0.5–1 in published work), σ_daily is daily volatility, Q your order size, ADV average daily volume.

Example: a midcap stock, daily volatility 2.0%, ADV 8 lakh shares. You want 40,000 shares. Q/ADV = 0.05, √0.05 = 0.224. With Y = 0.7: impact ≈ 0.7 × 2.0% × 0.224 = **0.31%**. On ₹600 that is about ₹1.88 per share, or ₹75,000 on the whole order. With 4,000 shares: √0.005 = 0.0707 → 0.10%, about ₹0.59 per share. Ten times the size costs about 3.2 times as much *per share*.

### Implementation shortfall worked example
You decide to buy 2,000 shares of a stock at a decision price of ₹800.00. By the time the order arrives the mid is ₹800.40. You fill 1,500 shares at an average ₹800.90; the remaining 500 never fill and you cancel. At the close the stock is ₹806.00. Explicit costs are ₹420.

| Component | Calculation | ₹ |
|---|---|---|
| Delay cost | 1,500 × (800.40 − 800.00) | 600 |
| Execution cost | 1,500 × (800.90 − 800.40) | 750 |
| Opportunity cost | 500 × (806.00 − 800.00) | 3,000 |
| Explicit costs | — | 420 |
| **Total IS** | | **4,770** |

Paper portfolio profit: 2,000 × (806 − 800) = ₹12,000. Real profit: 1,500 × (806 − 800.90) − 420 = 7,650 − 420 = ₹7,230. Difference = 12,000 − 7,230 = ₹4,770 ✓. IS as a fraction of the paper notional (₹16,00,000) is about 30 bps.

Notice the largest component was the *missed* fill — patient limit orders are not free.` },
      { h: 'India', md: `> [!india] Explicit costs as of Nov 2026 (verify on nseindia.com and your broker's contract note): equity intraday STT 0.025% on sell; futures STT 0.05% on sell; options STT 0.15% of premium on sell; NSE transaction charges ₹307/crore cash, ₹183/crore futures, ₹3,553/crore of option premium; SEBI fee ₹10/crore; GST 18% on brokerage + exchange + SEBI fees; stamp duty on buy side (intraday 0.003%, futures 0.002%, options 0.003%). Use [[widget:charges-india]] for exact numbers.

Worked Nifty futures round trip, 1 lot (65) at 24,800: notional = ₹16,12,000. STT on sell = 0.05% = ₹806. Exchange both sides = 2 × 16.12 lakh × 183/1 crore ≈ ₹59. SEBI ≈ ₹3. Stamp on buy = 0.002% ≈ ₹32. With ₹20 brokerage per side, GST = 18% × (40 + 59 + 3) ≈ ₹18. Explicit total ≈ ₹958, about 14.7 index points. Add one point of slippage each way (₹130) and your break-even is roughly 16–17 points per round trip.` },
      { h: 'US & global', md: `> [!us] US brokers must publish order-routing reports (SEC Rule 606) and market centres publish execution-quality statistics (Rule 605, amended in 2024 to broaden coverage). Payment for order flow means "zero commission" retail orders may receive price improvement against the NBBO, but the true cost is in the spread and fill quality. Compare your fills to the NBBO midpoint, not to the commission line.` },
      { h: 'Common misconceptions', md: `- **"Zero brokerage means trading is free."** Spread, slippage, STT and impact remain. In India statutory charges usually exceed brokerage for futures and options.
- **"Limit orders have no cost."** They carry opportunity cost and adverse selection: you get filled most often when price is about to move through you.
- **"My backtest included costs."** If it used a fixed ₹20 per order and no slippage, it did not.
- **"Slippage averages out."** It is systematically against you on stops and breakouts, because you trade in the same direction as the crowd at the same moment.` },
      { h: 'When it fails', md: `A breakout strategy backtested on 5-minute closes shows +₹1.20 per share average profit on a midcap stock. Live, entries are stop orders just above the breakout level. The actual average entry is ₹0.70 above the backtest price (everyone else's buy stops trigger at the same tick), exits on stops slip a further ₹0.40, and costs are ₹0.35. Net: 1.20 − 0.70 − 0.40 − 0.35 = **−₹0.25 per share**. The edge was entirely an execution illusion.

Execution planning also fails in: circuit-limit stocks (no fill at all), illiquid option strikes on expiry, gap opens through stop levels, and exchange or broker outages.` },
      { h: 'Exercise', md: `1. Add three columns to your journal: decision price, arrival mid, fill price. Fill them for the next 20 simulator trades and compute average and 90th-percentile slippage in bps.
2. Recompute the implementation shortfall example with a 100% fill at ₹801.10. Is the total better or worse? (Answer: delay 800, execution 1,400, opportunity 0, explicit ~420 → ₹2,620 — better, because missing the move cost more than paying up.)
3. Use [[widget:charges-india]] to find the break-even points for 1 lot of Bank Nifty futures (lot 30) at your broker's brokerage.` },
    ],
    check: [
      { q: 'Using the square-root rule, if you quadruple your order size, roughly what happens to impact per share?', o: ['It quadruples', 'It doubles', 'It stays the same', 'It halves'], a: 1, why: '√4 = 2, so per-share impact roughly doubles while total impact cost (per share × shares) rises about eightfold.' },
      { q: 'Which component of implementation shortfall arises from shares you intended to buy but never filled?', o: ['Delay cost', 'Execution cost', 'Explicit cost', 'Opportunity cost'], a: 3, why: 'Opportunity cost measures the price move on the unfilled quantity against the decision price.' },
      { q: 'You sell short at a decision price of ₹500.00 and fill at ₹499.70. What is your slippage in bps (positive = cost)?', o: ['−6 bps', '+0.6 bps', '+6 bps', '+30 bps'], a: 2, why: 'For a sell, side = −1: −1 × (499.70 − 500)/500 × 10,000 = +6 bps cost. You sold 30 paise lower than planned.' },
    ],
    refs: ['André Perold — The Implementation Shortfall: Paper versus Reality (Journal of Portfolio Management, 1988)', 'Almgren & Chriss — Optimal Execution of Portfolio Transactions (Journal of Risk, 2000)', 'Bouchaud, Bonart, Donier & Gould — Trades, Quotes and Prices (book)', 'NSE — Transaction charges (nseindia.com)', 'NSE — Circular on stop-loss market orders in index options (nseindia.com, Sep 2021)', 'SEC — Rule 605 and Rule 606 disclosures (sec.gov)'],
  });

  IA.content.lessons.push({
    id: 'l4-probability', module: 'L4-M2', level: 4, track: 'quant', title: 'Probability and distributions for traders', mins: 24,
    summary: 'Treat every strategy as a distribution of R-multiples, compute expectancy and its standard error, and recognise fat tails and streaks as normal features rather than surprises.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `A single trade is a coin you cannot see inside. You know only the long-run shape of results — how often you win, how big wins and losses are. That shape is a **probability distribution**, and your job is to make sure its average is positive *after costs* and that its worst stretches cannot knock you out.

Three ideas carry most of the weight:
- **Expectancy** — the average result per trade. Positive is necessary but not sufficient.
- **Variance** — how spread out results are. High variance means long, painful losing streaks even with a positive average.
- **Tails** — the rare, extreme outcomes. Markets produce extreme days far more often than a bell curve suggests.

Think of a cricket batter averaging 45. Some innings are ducks, some are centuries. Judging them on one innings is useless; judging them on 10 innings is still noisy. Your trades are the same.` },
      { h: 'Intermediate view', md: `### Express results in R
R is the amount you planned to risk on a trade (entry to stop × quantity). A trade that makes twice its risk is +2R; a full stop-out is −1R; a stop that slipped might be −1.2R. R makes trades of different sizes and instruments comparable.

### Expectancy from a trade list
Suppose your last 40 paper trades produced these R-multiples, grouped:

| Outcome (R) | Count |
|---|---|
| −1.2 | 3 |
| −1.0 | 19 |
| −0.5 | 2 |
| +0.5 | 3 |
| +1.5 | 6 |
| +2.0 | 5 |
| +3.0 | 2 |

Win rate = 16/40 = 40%. Average loss = (3×1.2 + 19×1.0 + 2×0.5)/24 = 23.6/24 = 0.983R. Average win = (3×0.5 + 6×1.5 + 5×2.0 + 2×3.0)/16 = 26.5/16 = 1.656R.

:::formula
E = p × AvgWin − (1 − p) × AvgLoss
E = 0.40 × 1.656 − 0.60 × 0.983 = 0.6625 − 0.590 = +0.0725R
:::
Equivalently, sum of all R (26.5 − 23.6 = 2.9) / 40 = 0.0725R. Use [[widget:expectancy]] to check.

### Losing streaks are normal
With a 40% win rate, the probability that any given 10 trades are all losers is 0.6^10 ≈ 0.6%. That sounds rare, but across a run of 500 trades the chance that a streak of 10 or more losses appears *somewhere* is about 70% (computed exactly, assuming independent trades). Plan for streaks you have not seen yet.` },
      { h: 'Advanced view', md: `**Fat tails.** Daily index returns have excess kurtosis: moves of 4–5 standard deviations, which a normal distribution says should be vanishingly rare, occur in most multi-year samples (for Nifty: March 2020 and the 2024 election-result day are obvious examples). Consequences:
- Volatility-based stops and position sizes underestimate gap risk.
- Short-option and mean-reversion strategies with high win rates often have a left tail that dominates their expectancy.
- Standard deviation is an incomplete risk measure; look at the worst 1% of outcomes (expected shortfall) as well.

**Non-stationarity.** The distribution of your strategy's R changes as volatility regimes and market participants change. A 300-trade history is a sample from *past* regimes.

**Independence.** Most simple statistics assume trades are independent. Intraday trades on the same day or in the same correlated instruments are not; your effective sample size is smaller than your trade count.

**Skew matters to survival.** Two strategies with the same expectancy can feel completely different: positive-skew (trend following, many small losses, few large wins) and negative-skew (option selling, many small wins, rare large losses). Negative skew looks better on short samples and is more dangerous.` },
      { h: 'The maths', md: `### Standard error of expectancy
Your expectancy is an *estimate*. Its uncertainty:
:::formula
SE(E) = s / √n
t = E / SE(E)
:::
For the 40 trades above, compute the sample standard deviation of R. Mean = 0.0725. Sum of squares of R: 3×1.44 + 19×1 + 2×0.25 + 3×0.25 + 6×2.25 + 5×4 + 2×9 = 4.32 + 19 + 0.5 + 0.75 + 13.5 + 20 + 18 = 76.07. Variance = (76.07 − 40 × 0.0725²)/39 = (76.07 − 0.210)/39 = 1.945; s = 1.395R.

SE = 1.395/√40 = 0.221R. t = 0.0725/0.221 = **0.33**.

Interpretation: the expectancy is less than one-third of its standard error. You cannot distinguish this strategy from zero (or from slightly negative) with 40 trades. To get t ≈ 2 at the same mean and spread you would need n ≈ (2 × 1.395/0.0725)² ≈ 1,480 trades.

### Binomial probability of streaks
Probability of exactly k wins in n trades:
:::formula
P(k) = C(n,k) × p^k × (1 − p)^(n − k)
:::
With p = 0.40 and n = 20, the probability of 4 or fewer wins is about 5.1%. So even with a genuine 40% win rate, roughly one 20-trade block in twenty will show a 20% win rate or worse.

### Kurtosis check
Excess kurtosis of a normal distribution is 0. Compute it on your daily P&L; values well above 0 mean you should size for tails you have not yet seen.` },
      { h: 'India', md: `> [!india] Nifty intraday ranges cluster: quiet days of 0.5–0.8% and occasional days above 2–3% on events such as budget day, RBI policy surprises, election results or global shocks. Weekly expiry days (Nifty options expire Tuesday as of Nov 2026 — verify on NSE) can add their own fat-tail behaviour in the final hour. A strategy tested only in a calm year has not met these tails.` },
      { h: 'Common misconceptions', md: `- **"A 70% win rate is a good strategy."** Not without the win/loss sizes. 70% wins of +0.3R and 30% losses of −1R gives −0.09R.
- **"I'm due a winner."** Trades are not obliged to balance out — this is the gambler's fallacy.
- **"50 trades proves my edge."** Run the t-statistic: small samples rarely separate a modest edge from zero.
- **"Normal distribution is good enough."** It underestimates extreme moves, especially for leveraged and short-option positions.` },
      { h: 'When it fails', md: `A trader sells far out-of-the-money Nifty options, wins 46 of 50 weeks for +0.25R each (11.5R total) and loses 4 weeks at −1R (−4R): +7.5R, expectancy +0.15R. Week 51 brings a 4% gap; the loss is −9R because the stop could not fill at its level. Total: −1.5R over 51 weeks. The distribution was fat-tailed and negatively skewed; the 50-week sample simply had not yet sampled the tail. Statistics fail when the sample does not contain the regime that hurts you.` },
      { h: 'Exercise', md: `1. Export 30+ trades from your journal as R-multiples. Compute win rate, average win, average loss, expectancy, standard deviation, SE and t.
2. Enter the same numbers in [[widget:expectancy]] and [[widget:ror]].
3. Write the number of trades you would need for t = 2 if your current mean and standard deviation hold. Is that realistic in a year?` },
    ],
    check: [
      { q: 'Win rate 35%, average win 2.2R, average loss 1.0R. Expectancy?', o: ['+0.12R', '+0.77R', '−0.12R', '+0.42R'], a: 0, why: '0.35 × 2.2 − 0.65 × 1.0 = 0.77 − 0.65 = +0.12R.' },
      { q: 'Expectancy +0.10R, standard deviation 1.5R, 100 trades. What is the t-statistic and what does it mean?', o: ['6.7 — highly significant', '0.067 — negative edge', '1.5 — borderline significant', '0.67 — not distinguishable from zero'], a: 3, why: 'SE = 1.5/√100 = 0.15; t = 0.10/0.15 = 0.67, far below ~2.' },
      { q: 'Which strategy profile is more likely to look excellent on a short sample and then suffer a large loss?', o: ['Positive skew', 'Negative skew with high win rate', 'Zero skew', 'Any strategy with a 50% win rate'], a: 1, why: 'Negative-skew strategies win often in small amounts and occasionally lose big; short samples tend to miss the rare large loss.' },
    ],
    refs: ['Nassim Nicholas Taleb — Fooled by Randomness (book)', 'Van K. Tharp — Trade Your Way to Financial Freedom (book; R-multiples)', 'Rama Cont — Empirical properties of asset returns: stylized facts and statistical issues (Quantitative Finance, 2001)'],
  });

  IA.content.lessons.push({
    id: 'l4-correlation-regression', module: 'L4-M2', level: 4, track: 'quant', title: 'Correlation and regression', mins: 24,
    summary: 'Compute correlation, beta and a regression by hand, interpret R² and standard errors, and avoid the classic traps of spurious and unstable relationships.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `**Correlation** measures how much two things move together, from −1 (perfect opposites) through 0 (no linear relationship) to +1 (perfect lockstep). **Regression** goes a step further: it fits a line so you can say "when Nifty moves 1%, HDFC Bank tends to move about b%".

Why traders care:
- **Risk**: long Bank Nifty and long HDFC Bank is nearly one bet, not two.
- **Hedging**: beta tells you how much index future to short against a stock position.
- **Signals**: relationships between instruments underpin pairs trading and relative value.

Correlation is not causation, and correlations in markets drift and jump — especially in crashes, when many go towards +1 together.` },
      { h: 'Intermediate view', md: `### Use returns, not prices
Always correlate **returns** (percentage changes), not price levels. Two unrelated trending price series can show correlation of 0.9 simply because both went up — a spurious correlation.

### Beta and hedging
Beta of a stock against an index = covariance(stock, index)/variance(index). It is also the slope of the regression of stock returns on index returns.

Hedge example: you hold ₹10 lakh of a stock with beta 1.3 to Nifty. Beta-adjusted exposure = ₹13 lakh. One Nifty futures lot at 24,800 × 65 = ₹16.12 lakh. Hedge ratio = 13/16.12 = 0.81 lots — you cannot trade fractions, so either 1 lot (over-hedged by ₹3.1 lakh) or none. Lot granularity matters for small accounts.

### Reading regression output
- **Slope (beta)** and its **standard error**: is the slope distinguishable from zero?
- **Intercept (alpha)**: average return not explained by the index — usually tiny and noisy.
- **R²**: fraction of variance explained. For a single large-cap stock against Nifty, daily R² is typically well below 1 (often somewhere in the range of about 0.3–0.6 — a rough, period-dependent guide, so measure your own); for a broad sector index against Nifty it is usually higher.
- **Residuals**: what is left. In pairs trading the residual *is* the trading signal.` },
      { h: 'Advanced view', md: `- **Correlation instability**: estimate rolling correlation (e.g. 60-day) and look at how much it moves. Using one full-sample number hides regime shifts.
- **Correlation breakdown in stress**: diversification is weakest when you need it most. Size portfolio heat assuming stressed correlations ([[link:l3-correlation]]).
- **Outliers dominate**: one budget-day return can swing an estimated beta. Use robust checks — drop the top and bottom 1% and see if the result survives.
- **Multiple regression**: adding sector or USD/INR as extra variables can separate index beta from sector beta. Each added variable increases overfitting risk.
- **Non-linearity**: correlation only measures linear association. Option positions and volatility relationships are non-linear.
- **Lead–lag illusions**: apparent "GIFT Nifty predicts Nifty open" style relationships often come from asynchronous closing times rather than an exploitable lead.` },
      { h: 'The maths', md: `### Worked regression (five days, illustrative)
Daily returns in %. x = Nifty, y = a bank stock.

| Day | x | y | x − x̄ | y − ȳ | (x−x̄)(y−ȳ) | (x−x̄)² |
|---|---|---|---|---|---|---|
| 1 | 1.0 | 1.5 | 0.8 | 1.2 | 0.96 | 0.64 |
| 2 | −0.5 | −0.4 | −0.7 | −0.7 | 0.49 | 0.49 |
| 3 | 0.2 | 0.6 | 0.0 | 0.3 | 0.00 | 0.00 |
| 4 | 0.8 | 0.9 | 0.6 | 0.6 | 0.36 | 0.36 |
| 5 | −0.5 | −1.1 | −0.7 | −1.4 | 0.98 | 0.49 |

x̄ = 1.0/5 = 0.2; ȳ = 1.5/5 = 0.3. Sxy = 2.79; Sxx = 1.98.
:::formula
b (beta) = Sxy / Sxx = 2.79 / 1.98 = 1.409
a (alpha) = ȳ − b × x̄ = 0.3 − 1.409 × 0.2 = 0.018
ŷ = 0.018 + 1.409 x
:::
Syy = 1.44 + 0.49 + 0.09 + 0.36 + 1.96 = 4.34.
:::formula
r = Sxy / √(Sxx × Syy) = 2.79 / √(1.98 × 4.34) = 2.79 / 2.931 = 0.952
R² = 0.906
:::
Residual sum of squares = Syy × (1 − R²) = 4.34 × 0.094 = 0.408. Residual standard error = √(0.408/(5−2)) = 0.369. SE of slope = 0.369/√1.98 = 0.262. t for the slope = 1.409/0.262 = 5.4.

Lesson: the numbers look strong, but with five observations a single unusual day could change everything. Real estimation uses at least a year of daily data and checks stability across sub-periods.

### Prediction
If Nifty rises 0.6% tomorrow, the fitted value for the stock is 0.018 + 1.409 × 0.6 = **0.86%**, with a typical error of about ±0.37% (one residual SE) — and wider in practice.` },
      { h: 'India', md: `> [!india] Bank Nifty is heavily weighted towards a handful of private banks, so HDFC Bank and ICICI Bank moves explain a large part of index moves. Weights change in index rebalancing — verify current weights on NSE Indices (niftyindices.com). A "diversified" book of three private banks plus Bank Nifty futures is mostly one factor.` },
      { h: 'US & global', md: `> [!us] Mega-cap tech dominates the S&P 500 and Nasdaq-100. NVDA, MSFT, AAPL and the index often have high correlation in risk-off moves. Cross-market: DAX and S&P futures overlap in the European afternoon; overnight US moves are reflected in Asian opens, a timing effect, not a free lead.` },
      { h: 'Common misconceptions', md: `- **"High correlation means I can predict one from the other."** Correlation is contemporaneous; you still need to know tomorrow's x.
- **"R² of 0.9 on prices proves a relationship."** Price-level regressions of trending series are spurious; use returns or test for cointegration.
- **"Beta is constant."** It drifts with leverage, business mix and regime.
- **"Negative correlation means a perfect hedge."** Only if the hedge ratio is right and the correlation holds in the scenario you fear.` },
      { h: 'When it fails', md: `You hedge a ₹15 lakh IT-stock position with Nifty futures using a 1-year beta of 0.8. A rupee shock and US tech sell-off hit IT stocks hard while banks rally; the stock falls 4% and Nifty rises 0.5%. Your "hedged" position loses about ₹60,000 on the stock *and* about ₹6,000 on the short future. Beta captured average co-movement, not sector-specific shocks.` },
      { h: 'Exercise', md: `1. Recompute the worked regression in a spreadsheet; then change day 5's stock return from −1.1% to +0.5% and recompute beta and R². Note how much one data point matters.
2. Download 250 days of closes for a stock and Nifty, compute daily returns, beta, R² and 60-day rolling correlation. Record the range of the rolling correlation.
3. Use [[widget:futures-exposure]] to size a beta hedge for a ₹5 lakh stock position.` },
    ],
    check: [
      { q: 'Stock beta 1.2, position ₹8 lakh. Nifty future notional per lot ₹16 lakh. Hedge ratio in lots?', o: ['0.6', '0.5', '1.2', '0.83'], a: 0, why: 'Beta-adjusted exposure = 1.2 × 8 = ₹9.6 lakh; 9.6/16 = 0.6 lots.' },
      { q: 'Why correlate returns rather than prices?', o: ['Returns are easier to download', 'Prices are always negatively correlated', 'Trending price levels produce spurious correlation even when the series are unrelated', 'Regulators require it'], a: 2, why: 'Two independent upward-trending prices can show high correlation purely from shared trend; returns remove the trend.' },
      { q: 'A regression gives slope 0.9 with standard error 0.6. What can you say?', o: ['Beta is definitely 0.9', 'The slope is not clearly distinguishable from zero (t = 1.5)', 'The relationship is negative', 'R² must be above 0.9'], a: 1, why: 't = 0.9/0.6 = 1.5, below the usual ~2 threshold — the estimate is noisy.' },
    ],
    refs: ['Ruey S. Tsay — Analysis of Financial Time Series (book)', 'Granger & Newbold — Spurious Regressions in Econometrics (Journal of Econometrics, 1974)', 'NSE Indices — Index factsheets and weights (niftyindices.com)'],
  });

  IA.content.lessons.push({
    id: 'l4-mean-rev-momentum', module: 'L4-M2', level: 4, track: 'quant', title: 'Mean reversion and momentum models', mins: 24,
    summary: 'Build a z-score mean-reversion rule, estimate half-life from an AR(1) fit, define a momentum rule precisely, and know which regime each one needs.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `Two opposite beliefs drive most rules-based strategies:
- **Mean reversion**: stretched prices tend to snap back towards an average. Buy weakness, sell strength.
- **Momentum**: prices that have been moving tend to keep moving for a while. Buy strength, sell weakness.

Both can be true at once — on different horizons, in different instruments, in different regimes. Intraday index prices often mean-revert around VWAP on quiet days and trend on news days. Across months, research finds cross-sectional momentum in many equity markets, while very short horizons (minutes to a few days) often show reversal.

Analogy: a rubber band (mean reversion) versus a rolling ball (momentum). The skill is recognising which one you are holding — and having a rule for when you were wrong.

> [!evidence] Both momentum and short-term reversal are empirically documented across many markets (Jegadeesh & Titman on momentum; Lehmann and Lo & MacKinlay on short-horizon reversal). Both are *mixed* evidence for an individual trader: effects vary by period, weaken after publication, and are often consumed by costs at intraday horizons.` },
      { h: 'Intermediate view', md: `### A z-score mean-reversion rule
:::formula
z = (Price − Mean over N bars) / Standard deviation over N bars
:::
Example rule (5-minute bars, N = 20):
- Enter long when z ≤ −2.0 *and* the day is not trending (e.g. ADX(14) below 20, price has crossed VWAP at least twice).
- Exit at z ≥ 0 (back to the mean) or a time stop of 12 bars.
- Stop at z ≤ −3.5 or a fixed 1.2 ATR.

Bollinger Bands at 2 standard deviations are exactly this z-score drawn on a chart.

[[chart:NIFTY:211:bb,vwap,adx]]

### A momentum rule
- Intraday: opening-range breakout — buy when price closes above the first 15-minute high with volume above its 20-day same-time average; stop at the range low or 1 ATR; trail with a 20-EMA.
- Cross-sectional (multi-day): rank a universe by 12-month return excluding the last month and hold the top decile — the classic academic momentum definition, not an intraday tactic.

### Regime filters
| Filter | Favours mean reversion | Favours momentum |
|---|---|---|
| ADX(14) | Below ~20 | Above ~25 |
| Price vs VWAP | Crosses repeatedly | Stays on one side |
| Opening gap | Small | Large, with follow-through |
| Event day | No | Often yes |

These thresholds are conventions, not proven constants. Test them.` },
      { h: 'Advanced view', md: `**Half-life.** Mean reversion is only tradeable if the reversion happens within your holding period. Model the deviation as an AR(1) / Ornstein–Uhlenbeck process and estimate its half-life — the time for half the deviation to decay. If your 5-minute spread has a half-life of 3 hours, a 30-minute holding period mostly captures noise.

**Stationarity test.** An Augmented Dickey–Fuller (ADF) test asks whether a series has a unit root (random walk). Individual stock prices almost never reject a unit root — prices are not mean-reverting in levels. Spreads between related assets and deviations from intraday VWAP sometimes are, which is why pairs and VWAP-reversion strategies exist.

**Momentum crashes.** Momentum portfolios suffer sharp losses in rebounds after market crashes (documented by Daniel & Moskowitz). Intraday breakout strategies have their own version: chop days where every breakout fails.

**Combine, do not average.** Running both styles in one book can smooth returns because they lose in different regimes — but only if each has a positive expectancy on its own after costs.` },
      { h: 'The maths', md: `### z-score worked example
Last 20 five-minute closes of a stock have mean ₹1,250.00 and standard deviation ₹4.00. The current close is ₹1,241.60.
:::formula
z = (1,241.60 − 1,250.00) / 4.00 = −8.40 / 4.00 = −2.10
:::
Rule fires (z ≤ −2). Target: mean ₹1,250 (+₹8.40). Stop at z = −3.5 → 1,250 − 14 = ₹1,236.00 (−₹5.60). Reward:risk = 1.5. Break-even win rate before costs = 1/(1 + 1.5) = 40%. Note that the mean itself moves while you hold, so the real target drifts.

### Half-life from an AR(1) fit
Regress the change in the deviation on its previous level:
:::formula
Δy(t) = α + λ × y(t−1) + ε
Half-life = −ln(2) / λ
:::
Suppose a regression of 5-minute changes of a pair spread on the previous spread gives λ = −0.058 (with standard error 0.012, so it is clearly negative).

Half-life = −0.693 / −0.058 = **11.9 bars ≈ 60 minutes**. A sensible time stop is 2–3 half-lives (2–3 hours). If λ were −0.005, half-life would be 139 bars — more than a full NSE session of 75 five-minute bars, so the pair is useless intraday.

Equivalently, with AR(1) coefficient φ = 1 + λ = 0.942, half-life = ln(0.5)/ln(0.942) = 11.6 bars (the two formulae agree closely for small λ).

### Momentum expectancy check
A breakout rule: win rate 38%, average win 2.1R, average loss 1.0R, cost 0.08R per trade. E = 0.38 × 2.1 − 0.62 × 1.0 − 0.08 = 0.798 − 0.62 − 0.08 = **+0.098R**. If slippage on entry adds 0.10R, the edge disappears. Momentum rules are particularly slippage-sensitive because they buy when everyone else buys.` },
      { h: 'India', md: `> [!india] On Nifty and Bank Nifty futures, intraday VWAP reversion and opening-range breakouts are common retail templates. Weekly Nifty expiry (Tuesday, as of Nov 2026 — verify on NSE) changes intraday dynamics: option hedging flows can pin price near large-OI strikes (reversion-like) or accelerate moves through them (momentum-like). Test expiry days separately from other days.` },
      { h: 'Common misconceptions', md: `- **"Oversold must bounce."** z = −2 in a trending market is common; prices are not mean-reverting in levels.
- **"Momentum is proven, so breakouts work."** Academic momentum is a cross-sectional, multi-month effect; it says little about a 5-minute breakout on one stock.
- **"Tighter bands catch more reversion."** They catch more noise and more cost.
- **"Half-life is fixed."** It changes with volatility and regime; re-estimate it.` },
      { h: 'When it fails', md: `Mean reversion: a stock gaps down on a results miss. Your z-score rule buys at z = −2.1 (₹1,241.60), then −2.8, then hits the stop at −3.5 within 25 minutes as the mean itself slides lower. Every "oversold" reading was the start of a new leg. The regime filter (event day) should have blocked it.

Momentum: a range-bound Nifty day with ADX 14. Your breakout rule triggers four times; each fails within three bars. Four −1R losses plus costs = −4.3R in a day.` },
      { h: 'Exercise', md: `1. In the chart lab, load a range day and a trend day (try seeds 211 and 88 on NIFTY with bb and adx). Mark every z ≤ −2 touch and record what happened within 12 bars.
2. In a spreadsheet, generate 500 values of y(t) = 0.95 y(t−1) + noise. Regress Δy on y(t−1) and compute the half-life. You should get roughly 13–14 bars.
3. Write one mean-reversion and one momentum rule, each with an explicit regime filter, ready for [[link:l4-walkforward]].` },
    ],
    check: [
      { q: 'A spread regression gives λ = −0.10 per 5-minute bar. What is the half-life?', o: ['10 bars', '0.69 bars', '69 bars', '6.9 bars (~35 min)'], a: 3, why: '−ln2/λ = 0.693/0.10 = 6.9 bars ≈ 35 minutes.' },
      { q: 'Price ₹502, 20-bar mean ₹510, standard deviation ₹3.2. z-score?', o: ['−8.0', '+2.5', '−2.5', '−1.6'], a: 2, why: '(502 − 510)/3.2 = −2.5.' },
      { q: 'Which condition most argues against taking a z = −2 mean-reversion long?', o: ['Earnings-miss gap with price holding below VWAP all morning', 'ADX 15 and price crossing VWAP repeatedly', 'Low volume midday', 'Spread of one tick'], a: 0, why: 'An information event with one-sided trade is a momentum regime where oversold readings keep extending.' },
    ],
    refs: ['Jegadeesh & Titman — Returns to Buying Winners and Selling Losers (Journal of Finance, 1993)', 'Lo & MacKinlay — When Are Contrarian Profits Due to Stock Market Overreaction? (Review of Financial Studies, 1990)', 'Daniel & Moskowitz — Momentum Crashes (Journal of Financial Economics, 2016)', 'Ernest P. Chan — Algorithmic Trading: Winning Strategies and Their Rationale (book)'],
  });

  IA.content.lessons.push({
    id: 'l4-statarb', module: 'L4-M2', level: 4, track: 'quant', title: 'Statistical arbitrage and algorithmic trading concepts', mins: 24,
    summary: 'Construct a hedge-ratio pairs spread, trade it with z-score entry and exit rules, understand the parts of an algorithmic system, and know the Indian retail algo framework.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `**Statistical arbitrage** means trading a *relationship* rather than a direction. The classic version is a **pair**: two closely related stocks (two large private banks, two cement makers) usually move together. When one runs ahead of the other by an unusual amount, you short the leader and buy the laggard, betting the gap closes.

It is called "arbitrage", but it is not risk-free. The relationship can break permanently — a merger, a fraud, a regulatory action — and then the gap keeps widening.

**Algorithmic trading** simply means a computer executes rules: generating signals, sizing, sending orders and managing risk without manual clicks. An algorithm does not create an edge; it executes one consistently, including consistently losing if the rule is bad.` },
      { h: 'Intermediate view', md: `### Building a pair
1. **Choose candidates by economics first**: same sector, similar business, similar index membership.
2. **Estimate the hedge ratio** β by regressing log price of A on log price of B over a formation window (e.g. 120 days): ln A = c + β ln B + spread.
3. **Test the spread for stationarity** (Engle–Granger: ADF on the residual). If it does not reject a unit root, do not trade it.
4. **Compute the spread z-score** using a rolling mean and standard deviation.
5. **Rules**: enter at |z| ≥ 2, exit at z = 0, stop at |z| ≥ 3.5 or a time stop of about 3 half-lives.
6. **Size each leg** so the rupee exposures match β (dollar-neutral, beta-adjusted).

### Parts of an algorithmic system
| Component | Job | Typical failure |
|---|---|---|
| Data handler | Clean, timestamp, adjust for corporate actions | Look-ahead, bad ticks |
| Signal engine | Compute indicators and rules | Overfit parameters |
| Risk manager | Position limits, loss limits, kill switch | Missing or bypassed |
| Execution | Order type, slicing, retries | Duplicate orders, runaway loops |
| Monitoring | Logs, alerts, reconciliation with broker | Silent failures |

The risk manager and kill switch matter more than the signal: a bug that sends an order every second in a loop can do more damage in five minutes than a bad strategy does in a month.` },
      { h: 'Advanced view', md: `- **Cointegration is not correlation.** Two stocks can be highly correlated in returns yet drift apart in price (no cointegration), or have modest return correlation yet a stationary spread.
- **Formation vs trading period.** Estimate β in one window and trade in the next. Estimating on the same window you trade is look-ahead.
- **Multiple testing.** Screening 1,000 pairs for cointegration at 5% significance finds roughly 50 "significant" pairs by chance. Use economic pre-selection and out-of-sample confirmation.
- **Costs double.** Every pair trade has two legs, each paying spread, slippage and statutory charges. Short legs in Indian cash equity cannot be carried overnight in the normal market (intraday short only, or use stock futures), which constrains holding period and adds basis risk.
- **Crowding.** When many funds run similar stat-arb books, deleveraging by one can blow out spreads for all (the August 2007 "quant quake" is the textbook case).
- **Algo concepts**: latency, order throttling, idempotent order IDs, reconciliation and position limits are engineering requirements, not optional extras.` },
      { h: 'The maths', md: `### Worked pair trade
Stocks A and B. Formation-period regression on log prices gives β = 0.85. Today ln A = 7.3132 (A = ₹1,500), ln B = 7.6009 (B = ₹2,000), intercept c = 0.8525.
:::formula
Spread = ln A − c − β ln B = 7.3132 − 0.8525 − 0.85 × 7.6009 = 7.3132 − 0.8525 − 6.4608 = −0.0001
:::
That is today's anchor. Over the trading window the spread's rolling mean is 0.0000 and standard deviation 0.0120. Later in the day A falls to ₹1,464 (ln = 7.2889) and B is unchanged:
:::formula
Spread = 7.2889 − 0.8525 − 6.4608 = −0.0244
z = (−0.0244 − 0) / 0.0120 = −2.03
:::
Signal: buy A, short B. Leg sizing for ₹3 lakh gross long: long A ₹3,00,000 (≈205 shares at ₹1,464); short B = β × ₹3,00,000 = ₹2,55,000 (≈127 shares at ₹2,000; in practice the nearest futures lots).

If the spread returns to 0 because A recovers 2.4% while B is flat, P&L ≈ ₹3,00,000 × 2.4% = ₹7,200 before costs. Costs on four legs (two entries, two exits; total turnover 2 × ₹3,00,000 + 2 × ₹2,55,000 = ₹11.1 lakh) at roughly 6–8 bps per leg ≈ ₹670–₹890, plus slippage. Net ≈ ₹6,300.

Stop at z = −3.5: spread −0.042, about a further 1.8% adverse move → loss ≈ ₹5,400 + costs. Reward:risk ≈ 1.3:1. Break-even probability of reversion = 5,400/(7,200 + 5,400) ≈ 43% before costs; with about ₹900 of costs on each outcome it rises to (5,400 + 900)/(12,600) ≈ 50%. The edge therefore relies on the reversion probability being comfortably above 50%, which only out-of-sample testing can estimate.` },
      { h: 'India', md: `> [!india] SEBI retail algo framework — as of Nov 2026, verify on sebi.gov.in and NSE circulars. SEBI's circular of 4 February 2025 ("Safer participation of retail investors in algorithmic trading") set out a framework under which retail clients may use algorithms through brokers via APIs. Key elements as published: brokers are responsible as principals for algos offered to clients; algo providers are to be empanelled with exchanges; client orders above an exchange-specified order-per-second threshold must be registered algos with a unique algo ID (NSE's implementation standards of May 2025 set this at 10 orders per second per exchange per segment); API order access is through static IP whitelisting with authentication; "white-box" (logic disclosed) and "black-box" (logic not disclosed, provider must register as a research analyst) categories are distinguished. The original 1 August 2025 start was extended, and a SEBI circular of 30 September 2025 set a phased glide path with full applicability from 1 April 2026. Details and thresholds change — check the latest SEBI and NSE circulars and your broker's API terms before you automate anything.

Practical points: in the normal market, cash-equity short sales must be squared off intraday. Overnight shorts in cash require borrowing through the Securities Lending and Borrowing (SLB) mechanism, whose liquidity is limited for many stocks; for multi-day pairs most traders use stock futures (lot sizes are large) and watch the F&O ban list, which can stop new positions in a leg.` },
      { h: 'US & global', md: `> [!us] US retail can short overnight subject to borrow availability and fees (hard-to-borrow stocks can cost a lot). The SEC's Market Access Rule (15c3-5) requires brokers to have pre-trade risk controls on client algorithmic orders. Several US brokers offer APIs for retail automation.` },
      { h: 'Common misconceptions', md: `- **"Pairs trading is market-neutral, so it is low-risk."** It removes market beta, not idiosyncratic or relationship-break risk.
- **"High correlation pairs are good pairs."** Test cointegration and half-life; correlation alone is insufficient.
- **"An algo removes emotion, so it will profit."** It removes discretion. The edge and risk control still have to be real.
- **"Backtested stat arb is easy money."** Costs on two legs, borrow constraints and crowding often eliminate small backtested edges.` },
      { h: 'When it fails', md: `You go long A / short B at z = −2.0. Next morning A announces a large provision; it gaps 7% lower while B is flat. The spread jumps to about z = −8; your stop at −3.5 fills far beyond it because the gap skipped your level. Loss ≈ ₹21,000 on ₹3 lakh, about four times the planned risk. The relationship did not revert; it *re-priced*. Event calendars (results dates for both legs) must be part of the rules.

Algo failure: a script that resubmits an order on every timeout without checking whether the first one filled ends up 5× over-sized. Always reconcile positions with the broker before sending new orders.` },
      { h: 'Exercise', md: `1. Pick two same-sector Nifty stocks. In a spreadsheet, regress 120 days of log prices to get β, compute the spread and its z-score, and estimate the half-life with the method from [[link:l4-mean-rev-momentum]].
2. Write a one-page algo design: data source, signal, sizing, kill switch rules (max loss per day, max orders per minute, max position), and how you reconcile with the broker.
3. Read the latest SEBI and NSE circulars on retail algo trading and note what your broker requires (static IP, algo ID, registration).` },
    ],
    check: [
      { q: 'Spread −0.030, rolling mean −0.006, standard deviation 0.012. z-score and action under a ±2 entry rule?', o: ['−2.5: short the first leg', '+2.0: no trade', '−3.0: stop out', '−2.0: long the first leg, short the second'], a: 3, why: '(−0.030 + 0.006)/0.012 = −2.0; spread is low, so buy A (the cheap leg) and short β × B.' },
      { q: 'You screen 400 random pairs for cointegration at the 5% level. Roughly how many will pass by chance alone?', o: ['0', '20', '2', '200'], a: 1, why: '5% of 400 = 20 false positives, which is why economic pre-selection and out-of-sample checks are essential.' },
      { q: 'Under SEBI\'s retail algo framework (as of 2025–26, verify), who is responsible as principal for algorithms offered to retail clients through APIs?', o: ['The broker', 'The exchange', 'The client alone', 'The cloud hosting provider'], a: 0, why: 'The framework makes brokers responsible as principals, with algo providers empanelled and orders tagged with algo IDs.' },
    ],
    refs: ['Gatev, Goetzmann & Rouwenhorst — Pairs Trading: Performance of a Relative-Value Arbitrage Rule (Review of Financial Studies, 2006)', 'Engle & Granger — Co-integration and Error Correction (Econometrica, 1987)', 'Ernest P. Chan — Quantitative Trading (book)', 'SEBI — Safer participation of retail investors in algorithmic trading, circular (sebi.gov.in, Feb 2025; timeline revised Sep 2025)', 'NSE — Implementation standards for retail algorithmic trading, circular (nseindia.com, May 2025)','Khandani & Lo — What Happened to the Quants in August 2007? (2007)'],
  });

  IA.content.lessons.push({
    id: 'l4-walkforward', module: 'L4-M3', level: 4, track: 'strategy', title: 'Walk-forward and out-of-sample testing', mins: 24,
    summary: 'Split data into in-sample and out-of-sample sets, run an anchored or rolling walk-forward, compute walk-forward efficiency, and recognise when a strategy is curve-fit.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `If you design a strategy while looking at a chart, it will look good on that chart. That is not evidence; it is memory. The only honest test is on data the strategy has **never seen** while you were designing it.

- **In-sample (IS)** data: what you use to choose rules and parameters.
- **Out-of-sample (OOS)** data: held back, touched once, used to judge.
- **Walk-forward**: repeat that split many times through history — optimise on a window, test on the next unseen window, slide forward, repeat — and stitch all the unseen windows together.

Analogy: a student who has seen the exam paper scores well. The real question is how they do on next year's paper.` },
      { h: 'Intermediate view', md: `### A clean research protocol
1. **Write the hypothesis and rules before looking at results** ([[link:l3-hypothesis]]).
2. **Reserve a final holdout** — for example the most recent 20% of data — and do not touch it until the very end.
3. **Walk-forward on the rest.** Example with 4 years of 5-minute Nifty futures data:
   - Window 1: optimise on Year 1, test on Q1 of Year 2.
   - Window 2: optimise on the 12 months ending Q1 Year 2, test on Q2 Year 2.
   - … continue quarterly through the end of Year 4.
4. **Stitch** every OOS quarter into one equity curve. That curve — not the in-sample one — is your estimate of performance.
5. **Run the holdout once.** If it fails, you do not tweak and rerun; you go back to hypothesis.

### Anchored vs rolling
| Type | Training window | Pros | Cons |
|---|---|---|---|
| Anchored | Starts at the beginning, grows | More data, stable parameters | Slow to adapt to regime change |
| Rolling | Fixed length, slides | Adapts to recent regime | Fewer observations per fit, more parameter noise |

### Parameter stability
Look at the whole surface, not the best point. If the best EMA length is 21 but 18 and 24 are both deeply negative, the result is a spike — probably noise. Prefer a broad plateau where neighbouring settings all work moderately.` },
      { h: 'Advanced view', md: `**Count your trials.** Every variant you test spends some of your data's information. Testing 200 parameter combinations and reporting the best one creates selection bias. Bailey, Borwein, López de Prado and Zhu formalised this as the *probability of backtest overfitting*; Bailey and López de Prado's *deflated Sharpe ratio* adjusts a reported Sharpe for the number of trials. The practical rule: record every test you run, and demand more evidence the more you tried.

**Combinatorial purged cross-validation.** For machine-learning style research, López de Prado recommends purging training samples that overlap the test period (labels that span time) and adding an embargo gap, so information does not leak across the boundary.

**Out-of-sample is not truly independent.** If you look at OOS results, change something and look again, OOS has become in-sample. Professionals limit holdout peeks and log them.

**Regime coverage.** Make sure IS and OOS include different volatility regimes (calm, trending, crisis). A strategy that was optimised and tested only in a low-volatility year has not been tested.` },
      { h: 'The maths', md: `### Walk-forward efficiency (WFE)
:::formula
WFE = (annualised OOS return) / (annualised IS return)
:::
Many practitioners treat a WFE comfortably above about 0.5 as acceptable and anything near zero or negative as a sign of overfitting. The threshold is a rule of thumb, not a law. Pardo's definition uses annualised returns; the worked example below uses R per 100 trades, which is equivalent only when IS and OOS trade at a similar frequency — state which version you use.

Worked example — five walk-forward windows, results in R per 100 trades:

| Window | IS R/100 trades | OOS R/100 trades | Best IS parameter |
|---|---|---|---|
| 1 | +24 | +9 | 20 |
| 2 | +21 | +4 | 22 |
| 3 | +27 | −3 | 14 |
| 4 | +19 | +8 | 21 |
| 5 | +22 | +6 | 20 |

Average IS = 113/5 = 22.6; average OOS = 24/5 = 4.8. WFE = 4.8/22.6 = **0.21**. In-sample looked like +0.226R per trade; out-of-sample delivers about +0.048R per trade — roughly one-fifth. Window 3 chose a parameter (14) far from the others and lost; that instability is a warning.

Is +0.048R even real? Suppose 500 OOS trades with standard deviation 1.3R: SE = 1.3/√500 = 0.058; t = 0.048/0.058 = 0.83. Not significant. Subtract realistic slippage of 0.05R and it is zero. Verdict: **reject or redesign**, despite the beautiful in-sample curve.

### Degrees of freedom check
A rough guard: keep trades per free parameter high. With 5 tunable parameters and 150 trades you have only 30 trades per parameter — weak. Aim for several hundred OOS trades for a simple rule with 2–3 parameters.` },
      { h: 'India', md: `> [!india] Regime breaks to include in Indian intraday tests: the March 2020 crash; lot-size and contract changes (Nifty lot 65 and Bank Nifty 30 for contracts from Jan 2026); the end of Bank Nifty weekly options in Nov 2024; changes to expiry days; and STT increases (latest from 1 Apr 2026 — futures 0.05% on sell, options 0.15% of premium on sell). A backtest that applies today's costs and contract rules to old data, or old costs to today, will mislead. Verify current specifications on NSE.` },
      { h: 'Common misconceptions', md: `- **"I split train/test once, so I'm safe."** One split is one sample; walk-forward gives several, and you still must count trials.
- **"OOS failed but window 3 was unusual, so I'll exclude it."** Excluding bad windows is curve-fitting the evaluation.
- **"More parameters capture more nuance."** More parameters capture more noise.
- **"A high in-sample Sharpe means a high live Sharpe."** In-sample performance is almost always an upper bound.` },
      { h: 'When it fails', md: `Walk-forward itself can mislead when:
- The OOS windows are too short (a few dozen trades each), so results are noise.
- The whole history comes from one regime (for example, a single falling-volatility period).
- Data errors (bad ticks, unadjusted corporate actions) are present in both IS and OOS.
- Costs and slippage are understated equally in both — the WFE looks fine but both numbers are fiction.

Realistic losing example: an opening-range strategy shows WFE 0.7 on 2023–2025 data. Live in 2026, intraday volatility rises sharply after a macro shock; the fixed-point stops become too tight and the rule loses 14R in six weeks. The test was honest but did not contain this regime.` },
      { h: 'Exercise', md: `1. Take the rule you wrote in [[link:l4-mean-rev-momentum]]. Define one in-sample year and one out-of-sample quarter and test it in the backtester or bar-by-bar in the chart lab.
2. Fill in a five-window table like the one above and compute WFE.
3. Plot your results for neighbouring parameter values (for example EMA 15, 18, 21, 24, 27). Is there a plateau or a spike?
4. Write down the total number of variants you tested. Keep that log for every future idea.` },
    ],
    check: [
      { q: 'IS average +30R per 100 trades; OOS average +6R per 100 trades. WFE?', o: ['5.0', '0.80', '0.20', '0.06'], a: 2, why: '6/30 = 0.20 — out-of-sample keeps only a fifth of in-sample performance, a strong overfitting warning.' },
      { q: 'You test the holdout, it fails, you change the exit and test the holdout again. What has happened?', o: ['The holdout is still valid', 'The holdout has become in-sample data', 'You have improved robustness', 'You have run a Monte Carlo test'], a: 1, why: 'Using the holdout to make design changes leaks information; it no longer measures unseen performance.' },
      { q: 'Best EMA length is 21 with strong results, but 18 and 24 are both clearly negative. Best interpretation?', o: ['21 is the true optimum; use it', 'Use 18 and 24 together', 'Increase leverage at 21', 'The result is a spike, likely noise; prefer rules with a broad plateau'], a: 3, why: 'Robust edges degrade gently with nearby parameters; isolated peaks are typical of curve-fitting.' },
    ],
    refs: ['Robert Pardo — The Evaluation and Optimization of Trading Strategies (book)', 'Marcos López de Prado — Advances in Financial Machine Learning (book)', 'Bailey, Borwein, López de Prado & Zhu — The Probability of Backtest Overfitting (Journal of Computational Finance, 2017)', 'Bailey & López de Prado — The Deflated Sharpe Ratio (Journal of Portfolio Management, 2014)'],
  });

  IA.content.lessons.push({
    id: 'l4-montecarlo', module: 'L4-M3', level: 4, track: 'strategy', title: 'Monte Carlo analysis of a trade list', mins: 22,
    summary: 'Resample a trade list to see the range of drawdowns, losing streaks and outcomes your strategy can produce, and set risk per trade from the distribution rather than the single backtest path.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `A backtest gives you one sequence of trades — one path. But the same trades in a different order would give a different equity curve and a different maximum drawdown. Your future will be yet another order, with trades you have not seen.

**Monte Carlo analysis** reshuffles or resamples your trade results thousands of times to show the *range* of paths your strategy could plausibly produce. Instead of "my max drawdown was 8R", you learn "in 95% of simulated paths the max drawdown stayed below 14R, and in 5% it was worse".

It is like asking not "how did this cricket season go?" but "across thousands of seasons with the same player, how bad could the worst run of scores be?"

[[widget:monte-carlo]]` },
      { h: 'Intermediate view', md: `### Two resampling methods
1. **Shuffle (permutation)**: reorder the same trades randomly. Final total P&L is identical every time; drawdown and streaks change. Good for drawdown estimation.
2. **Bootstrap (with replacement)**: draw N trades at random from your list, allowing repeats. Final P&L varies too. Good for the uncertainty of total return.

### Procedure
1. Export your out-of-sample trades as R-multiples *after costs*.
2. Run at least 5,000–10,000 simulations of, say, the next 200 trades.
3. For each path record: final R, maximum drawdown in R, longest losing streak, and whether a ruin level (for example −20R) was hit.
4. Read percentiles: median, 5th and 95th.

> [!note] The app's [[widget:monte-carlo]] widget uses the bootstrap method (resampling with replacement), so its final result varies from path to path. A pure shuffle would show the same total on every path.

### Turning it into position size
If the 95th-percentile max drawdown is 16R and you are only willing to tolerate a 20% account drawdown, risk per trade must be at most 20%/16 = 1.25% — and less for a margin of safety. This replaces the guess "I'll risk 2%" with a number linked to your own trade distribution.` },
      { h: 'Advanced view', md: `**What Monte Carlo cannot do.** It only reshuffles the trades you already have. If your sample contains no gap-through-stop loss, the simulation will never produce one. It assumes trades are independent and identically distributed; real trades cluster (losing streaks happen in specific regimes).

Improvements professionals use:
- **Block bootstrap**: resample blocks of consecutive trades (for example, 10 at a time) to preserve clustering.
- **Stress injection**: add synthetic tail losses (for example, a −5R trade with 1% probability) to represent events not in the sample.
- **Degraded edge**: subtract 0.05–0.10R from every trade to test robustness to execution deterioration.
- **Parameter uncertainty**: combine trades from neighbouring parameter sets so the simulation reflects not knowing the true parameter.

Monte Carlo on a curve-fit in-sample trade list gives precise-looking nonsense. Use OOS trades.

### Reading the output like a risk manager
A useful one-page summary of a 10,000-path run over the next 200 trades looks like this (illustrative):

| Statistic | 5th pct | Median | 95th pct |
|---|---|---|---|
| Final R | −4.1 | +19.6 | +43.0 |
| Max drawdown (R) | 6.2 | 9.8 | 16.5 |
| Longest losing streak | 6 | 9 | 13 |

Three questions to ask of it:
1. **Is the 5th-percentile final result acceptable?** Here one path in twenty loses money over 200 trades even though the edge is positive. Can you live with that?
2. **Is the 95th-percentile drawdown survivable at your risk per trade?** At 1% risk, 16.5R is roughly a 16% drawdown — and that is not the worst case, only the 1-in-20 case.
3. **Is the losing streak something you can follow rules through?** If 13 losses in a row would make you abandon the system, size down until it would not.` },
      { h: 'The maths', md: `### Expected streaks
With loss probability q and N trades, the longest losing streak is approximately:
:::formula
Longest losing streak ≈ ln(N) / ln(1/q)
:::
q = 0.60, N = 200: ln 200 = 5.30; ln(1/0.6) = 0.511; → about **10 losses in a row**. Plan your psychology and risk for that.

This rule of thumb slightly overstates the typical case. Computed exactly (independent trades, q = 0.60, N = 200): the median longest losing streak is 9, the chance of at least one streak of 10 or more is about 38%, and of 14 or more about 6%. A refinement, ln(N × (1 − q)) / ln(1/q) = ln 80 / 0.511 ≈ 8.6, is closer to the exact average (about 9.2). Use the 95th percentile (about 14 here), not the average, for your plan.

### Simple worked bootstrap (by hand)
Trade list (R): +2, −1, −1, +1.5, −1, +2.5, −1, −1, +1, −1 → total +1.0R, mean +0.1R.

Shuffle A: −1, −1, −1, −1, +2, −1, +1.5, −1, +2.5, +1. Running equity: −1, −2, −3, −4, −2, −3, −1.5, −2.5, 0, +1. Max drawdown = 4R (from 0 to −4).

Shuffle B: +2.5, +2, −1, +1.5, −1, −1, +1, −1, −1, −1. Equity: 2.5, 4.5, 3.5, 5, 4, 3, 4, 3, 2, 1. Peak 5, max drawdown = 4R (5 → 1).

Shuffle C: +2, +1.5, +2.5, +1, −1, −1, −1, −1, −1, −1. Peak +7 at trade 4, then six losses: drawdown 6R.

Same trades, same total — drawdowns of 4R, 4R and 6R. With thousands of shuffles you get a full distribution.

### Risk of ruin from simulation
:::formula
P(ruin) ≈ (number of paths that touch the ruin level) / (total paths)
:::
If 230 of 10,000 paths hit −20R within 200 trades, estimated P(ruin) = 2.3%, with standard error √(0.023 × 0.977/10,000) ≈ 0.15%. Compare with [[widget:ror]].

### Size from the 95th percentile
95th-percentile max drawdown 15R; maximum tolerable account drawdown 15%; safety factor 1.5:
:::formula
Risk per trade = 15% / (15R × 1.5) = 0.67% of equity
:::
On a ₹10 lakh account that is ₹6,700 per trade.` },
      { h: 'India', md: `> [!india] Convert R to rupees after Indian costs, which are large relative to small edges in F&O. A Nifty futures scalper risking 20 points (₹1,300 on 1 lot of 65) pays roughly ₹950–1,000 explicit cost per round trip (see [[link:l4-execution]]) — about 0.75R per trade. Run your Monte Carlo on net R, never gross.` },
      { h: 'Common misconceptions', md: `- **"Monte Carlo predicts the future."** It describes variability of your sample, assuming the future resembles it.
- **"Shuffling changes my expected profit."** Permutation does not; bootstrap does through sampling variation.
- **"10,000 simulations means my estimate is accurate."** Simulation count reduces simulation noise, not the uncertainty from having only 80 real trades.
- **"The backtest drawdown is my worst case."** It is one path; the 95th percentile is usually materially worse.` },
      { h: 'When it fails', md: `A trader runs Monte Carlo on 120 short-straddle trades from a calm year: 95th-percentile drawdown is 6R, so they risk 3% per trade. The sample contained no event day. A surprise policy announcement produces a −12R loss on one trade — a 36% account hit, larger than anything in 10,000 simulations. Monte Carlo was correct about the sample and blind to the tail it lacked. Stress injection would have shown the danger.` },
      { h: 'Exercise', md: `1. Enter your 30+ journal trades (net R) in the [[widget:monte-carlo]] widget. Record median final R, 95th-percentile drawdown and longest losing streak.
2. Subtract 0.1R from every trade and rerun. How much does the drawdown change?
3. Add one −5R trade to the list and rerun. Then compute risk per trade using the 95th-percentile drawdown, your maximum tolerable drawdown, and a 1.5 safety factor.` },
    ],
    check: [
      { q: 'Your permutation Monte Carlo of 300 trades shows the same final P&L on every path. Why?', o: ['A bug', 'Too few simulations', 'Shuffling reorders the same trades, so the sum is unchanged; only path statistics vary', 'The trades are correlated'], a: 2, why: 'A permutation preserves the multiset of trades, so the total is fixed. Use bootstrap to vary the total.' },
      { q: '95th-percentile max drawdown 20R; you will tolerate a 10% account drawdown; no safety factor. Maximum risk per trade?', o: ['0.5%', '2%', '1%', '5%'], a: 0, why: '10%/20R = 0.5% per trade.' },
      { q: 'What does Monte Carlo resampling of your own trade list fail to capture?', o: ['Losing streaks', 'Drawdown variability', 'Order of trades', 'Tail events that are not present in the sample'], a: 3, why: 'Resampling can only recombine observed outcomes. Unseen tails must be added by stress tests.' },
    ],
    refs: ['Ralph Vince — The Mathematics of Money Management (book)', 'Efron & Tibshirani — An Introduction to the Bootstrap (book)', 'Howard Bandy — Quantitative Technical Analysis (book)'],
  });

  IA.content.lessons.push({
    id: 'l4-live-transition', module: 'L4-M3', level: 4, track: 'strategy', title: 'Paper → small live → scale: a staged process', mins: 22,
    summary: 'Move a validated strategy from paper to live in defined stages, with written promotion criteria and kill criteria you commit to before risking money.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `The gap between a backtest and real trading is where most strategies die. Fills are worse, costs are real, and your own behaviour changes when money is on the line. The professional answer is not courage; it is **staging**: move up only when evidence says you may, and move back down when evidence says you must.

Think of a new pilot: simulator, then supervised flights, then solo short routes, then long-haul. No one skips stages because they feel confident.

Two lists, written *before* you start:
- **Promotion criteria**: what must be true to move to the next stage.
- **Kill criteria**: what will make you stop, reduce or return to research — no debate on the day.` },
      { h: 'Intermediate view', md: `### The staged ladder
| Stage | Size | Minimum duration | Purpose |
|---|---|---|---|
| 0. Research | — | until OOS + holdout pass | Evidence an edge may exist |
| 1. Paper / simulator | 0 | 50+ trades or 6+ weeks | Confirm you can follow the rules exactly |
| 2. Micro live | Smallest unit (1 share-equivalent risk, or ~0.25% risk per trade) | 50+ trades | Measure real slippage, costs, behaviour |
| 3. Small live | ~0.5% risk per trade | 100+ trades | Confirm expectancy is in line with OOS |
| 4. Target size | Up to your Monte Carlo limit (e.g. ≤1%) | Ongoing | Run, monitor, review |

### Promotion criteria (example)
- Rule adherence ≥ 95% of trades (journal-verified).
- Live slippage per trade ≤ the value assumed in the backtest.
- Live expectancy not significantly below OOS expectancy (see the maths).
- Drawdown within the Monte Carlo 75th percentile for the trades taken.

### Kill criteria (example — write your own numbers)
- **Hard stop**: drawdown exceeds the Monte Carlo 95th-percentile drawdown → stop trading the strategy, return to research.
- **Daily limit**: loss of 2R in a day → stop for the day. Weekly loss of 5R → stop for the week.
- **Edge decay**: rolling 50-trade expectancy below zero *and* below the OOS lower bound → drop one stage.
- **Behaviour**: two rule breaks in a week → return to paper for 20 trades.
- **Operational**: any unexplained position, duplicate order or broker mismatch → flatten and investigate.` },
      { h: 'Advanced view', md: `**Why stage 2 exists.** The cost of micro live is small and the information is unique: your real fill quality, your real response to a losing streak, and your broker's behaviour at stop levels. Paper trading tends to fill you at prices you would not get.

**Scaling is non-linear.** Doubling size can more than double impact ([[link:l4-execution]]) and changes your emotional relationship with each trade. Scale in steps of about 1.5–2×, each step needing its own minimum sample.

**Asymmetry of evidence.** It takes many trades to prove an edge exists, but a clear breach of a risk limit is enough to stop. Promotion should be slow, demotion fast.

**Pre-commitment devices.** Professionals rely on risk managers who can switch them off. A solo trader can approximate this with broker-level loss limits where available, a written plan signed and dated, and an accountability partner who reviews the journal weekly.` },
      { h: 'The maths', md: `### Is live performance consistent with the backtest?
OOS expectancy +0.20R, standard deviation 1.4R. After 60 live trades your expectancy is −0.05R.
:::formula
SE = 1.4 / √60 = 0.181R
z = (−0.05 − 0.20) / 0.181 = −1.38
:::
A z of −1.38 is disappointing but within normal variation (about an 8% one-sided chance if the true edge were still +0.20R). Not grounds to kill on expectancy alone — but check slippage and rule adherence.

After 150 trades at −0.05R: SE = 1.4/√150 = 0.114; z = −2.19 (about 1.4% one-sided). Now the live data are significantly worse than the backtest. Demote and investigate.

### Drawdown kill level
Monte Carlo (OOS trades, net costs) 95th-percentile max drawdown over 200 trades = 14R. At stage 3 risk 0.5% per trade → kill level ≈ 7% account drawdown. On ₹8 lakh, that is ₹56,000 — written in the plan before the first trade.

### Expected cost of staging
Suppose staging keeps you at half size (0.5% risk) instead of full size (1%) for 150 trades, and your true edge is +0.15R. Expected R over those trades = 150 × 0.15 = 22.5R. On ₹8 lakh, full-size R = ₹8,000 and half-size R = ₹4,000, so expected profit is ₹1,80,000 at full size versus ₹90,000 at half size: about ₹90,000 foregone *if* the edge is real. That is the insurance premium against the more common outcome that the live edge is smaller than tested — in which case half size halves your losses too.` },
      { h: 'India', md: `> [!india] For F&O, "micro live" is constrained by lot sizes (Nifty 65, Bank Nifty 30 for contracts from Jan 2026 — verify on NSE). One Nifty lot with a 30-point stop risks ₹1,950 before costs, which is 1% of a ₹1.95 lakh account. If even one lot exceeds your stage-2 risk, use cash-equity intraday in a liquid stock with a matching structure, or defined-risk option spreads, for the micro stage. Track every contract note: STT, exchange charges, stamp duty and GST are part of live expectancy.` },
      { h: 'US & global', md: `> [!us] With the SEC's April 2026 approval of FINRA's change ending the pattern-day-trader $25,000 minimum (implementation timing varies by broker — verify), small accounts may get more intraday flexibility. Do not mistake easier access for permission to skip stages; fractional shares and micro futures (e.g. Micro E-mini) make true micro-live staging easier in the US.` },
      { h: 'Common misconceptions', md: `- **"Paper trading is a waste because it is not real."** It is the cheapest way to test whether you can follow your own rules.
- **"I'll know when to stop."** On the day, you will rationalise. Pre-written kill criteria exist because judgement fails under loss.
- **"One great month means scale up."** A month is a small sample; promotion needs the trade count and criteria.
- **"Kill criteria mean I lack confidence."** They are what make it safe to have confidence.` },
      { h: 'When it fails', md: `A trader passes paper trading with +0.3R over 50 trades and jumps straight to 1% risk. Live slippage on breakout entries is 0.15R worse than paper, and the first 20 trades include a 9-loss streak (well within Monte Carlo expectations). Without written kill criteria, they double size to "win it back" and breach a 15% drawdown in three weeks. The strategy may have been fine; the transition process was not.` },
      { h: 'Exercise', md: `1. Write your stage plan for one strategy: the table of stages with your sizes, trade counts and durations.
2. Write five kill criteria with exact numbers (R, %, ₹, count of rule breaks). Date the document.
3. Use your Monte Carlo output from [[link:l4-montecarlo]] to set the hard-stop drawdown level for each stage.
4. Add a weekly journal field: "stage, trades this stage, promotion criteria met Y/N, any kill criterion touched Y/N".` },
    ],
    check: [
      { q: 'OOS expectancy +0.25R (sd 1.5R). After 100 live trades you are at +0.05R. z-score versus OOS?', o: ['−0.20', '−1.33', '−2.67', '+1.33'], a: 1, why: 'SE = 1.5/10 = 0.15; (0.05 − 0.25)/0.15 = −1.33 — within normal variation, keep monitoring.' },
      { q: 'Why should kill criteria be written before the first live trade?', o: ['Judgement deteriorates during losses; pre-commitment removes on-the-day rationalising', 'Brokers require it', 'They improve the win rate', 'They are needed for tax'], a: 0, why: 'Decisions under drawdown are biased; pre-commitment makes the stop decision mechanical.' },
      { q: 'Which is the best reason for a micro-live stage after paper trading?', o: ['To make money quickly', 'To avoid writing a plan', 'To measure real fills, costs and your behaviour with small risk', 'To test new indicators'], a: 2, why: 'Paper fills and emotions differ from live; micro live captures these at minimal cost.' },
    ],
    refs: ['Brett N. Steenbarger — The Daily Trading Coach (book)', 'Robert Pardo — The Evaluation and Optimization of Trading Strategies (book)', 'NSE — Contract specifications for index derivatives (nseindia.com)', 'FINRA — Rule 4210 amendments on day-trading margin (finra.org)'],
  });

  IA.content.lessons.push({
    id: 'l4-metrics', module: 'L4-M5', level: 4, track: 'risk', title: 'Measuring yourself: risk-adjusted performance', mins: 24,
    summary: 'Compute Sharpe, Sortino, Calmar, MAR and expectancy per R from your own daily P&L and trade list, and know what each one hides.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `"I made 18% this year" says nothing about how you made it. Did you risk the whole account on three trades? Did you suffer a 40% drawdown on the way? Risk-adjusted metrics answer the question **"how much return per unit of pain?"**

- **Sharpe ratio** — return per unit of total volatility.
- **Sortino ratio** — return per unit of *downside* volatility only.
- **Calmar / MAR** — return per unit of maximum drawdown.
- **Expectancy per R** — average profit per trade measured in units of risk.

Two traders both make ₹2 lakh. One had a smooth ride, the other a 35% drawdown halfway. The second trader's result is far more likely to be luck — and far harder to repeat.` },
      { h: 'Intermediate view', md: `### Definitions
:::formula
Sharpe (annualised) = (mean daily return − daily risk-free) / sd(daily return) × √252
Sortino = (mean return − target) / downside deviation × √252
Downside deviation = √( mean of min(0, r − target)² over all days )
Calmar = annualised return / |max drawdown| (classically over the last 36 months)
MAR = CAGR since inception / |max drawdown since inception|
Expectancy per R = Σ R-multiples / number of trades
:::

### Which to use when
| Metric | Strength | Weakness |
|---|---|---|
| Sharpe | Standard, comparable | Penalises upside volatility; assumes roughly symmetric returns |
| Sortino | Focuses on harmful volatility | Needs enough losing days to be stable |
| Calmar / MAR | Captures the pain you actually felt | Depends on one worst event; unstable on short records |
| Expectancy per R | Directly tied to your rules and sizing | Ignores time and capital usage |

India uses 252 trading days per year as a common convention; NSE's actual count is roughly 245–250 depending on holidays. Be consistent.

Measure on **account equity daily P&L** (including all costs), not on selected trades.` },
      { h: 'Advanced view', md: `- **Sharpe is a noisy estimate.** Under i.i.d. assumptions (Lo, 2002) the standard error of a Sharpe ratio estimated from T observations is about √((1 + 0.5 × SR²)/T), with SR and T measured at the *same* frequency. With N annual observations that is √((1 + 0.5 × SR²)/N): a Sharpe of 1.5 from one annual figure has SE ≈ 1.46. If you estimate from daily returns and annualise, the SR² term almost vanishes and SE ≈ √(1/N years): a 1-year daily-data Sharpe of 1.5 has SE ≈ 1.0. Either way, 1.5 is only about 1–1.5 standard errors from zero — consistent with a true Sharpe near zero. Non-normal and autocorrelated returns make the error larger.
- **Autocorrelated returns** inflate annualised Sharpe when you scale by √252.
- **Negative skew hides** inside a good Sharpe. Short-option books often show high Sharpe until the tail event; check skew, worst day and Sortino together.
- **Deflate for trials.** If you tested many strategies, the best Sharpe is biased upward ([[link:l4-walkforward]]).
- **Capital usage.** Intraday traders often have idle capital; return on *allocated* capital vs *margin used* can differ widely. State which you report.
- **Benchmarks.** For an Indian trader, compare to a risk-free rate (e.g. a 91-day T-bill yield, verify current level on RBI) and to simply holding a Nifty index fund. If your risk-adjusted result is not better than passive, your time has a cost.` },
      { h: 'The maths', md: `### Worked example — ten trading days, account ₹10,00,000
Daily returns (%): +0.8, −0.4, +1.2, −0.9, +0.3, −0.2, +0.6, −1.1, +0.9, +0.4.

Mean = (0.8 − 0.4 + 1.2 − 0.9 + 0.3 − 0.2 + 0.6 − 1.1 + 0.9 + 0.4)/10 = 1.6/10 = **0.16%**.

Deviations from mean squared: 0.4096, 0.3136, 1.0816, 1.1236, 0.0196, 0.1296, 0.1936, 1.5876, 0.5476, 0.0576 → sum 5.464. Sample variance = 5.464/9 = 0.607; sd = **0.779%**.

Ignoring risk-free for simplicity:
:::formula
Daily Sharpe = 0.16 / 0.779 = 0.205
Annualised Sharpe = 0.205 × √252 = 0.205 × 15.87 = 3.26
:::
Downside deviation (target 0): squared negatives 0.16, 0.81, 0.04, 1.21 → sum 2.22; /10 = 0.222; √ = 0.471%.
:::formula
Sortino = 0.16 / 0.471 × 15.87 = 5.39
:::
Max drawdown: equity path (%, compounding ignored): 0.8, 0.4, 1.6, 0.7, 1.0, 0.8, 1.4, 0.3, 1.2, 1.6. The running peak is 1.6 (day 3); it is not exceeded until day 10. The lowest point after it is 0.3 (day 8). Max DD = 1.6 − 0.3 = **1.3%**.

Annualised return ≈ 0.16% × 252 = 40.3% (arithmetic). Calmar ≈ 40.3/1.3 = 31.0.

> [!warn] These numbers are absurdly high *because ten days is a tiny sample*. Estimated from 10 daily returns, the annualised Sharpe has a standard error of about √(252/10) × √(1 + 0.5 × 0.205²) ≈ 5.1 (the cruder annual-frequency version of the formula gives about 12.6). Either way the estimate is meaningless. Never annualise a few weeks and believe it.

### Expectancy per R
Last 50 trades: total +6.5R → expectancy +0.13R. With 1% risk per trade (₹10,000), that is about ₹1,300 per trade, ₹65,000 over 50 trades, net of costs if R was measured net.` },
      { h: 'India', md: `> [!india] Tax and charges matter for real performance. Intraday equity profits have generally been taxed as speculative business income and F&O as non-speculative business income in India. The Income-tax Act, 2025 is reported to replace the 1961 Act from 1 April 2026, so section numbers and wording may have changed; consult a tax professional and verify current rules for FY 2026–27 on incometax.gov.in. Measure performance net of STT, exchange charges, stamp duty and GST (use [[widget:charges-india]]) and separately note pre-tax vs post-tax.` },
      { h: 'Common misconceptions', md: `- **"Sharpe above 2 means I'm an excellent trader."** Not on a short record, and not if returns are negatively skewed.
- **"Calmar is objective."** It depends on the single worst drawdown in your window — one event.
- **"I only count closed trades."** Daily mark-to-market equity is what matters, including open-position swings.
- **"High win rate is a performance metric."** It is a descriptive statistic; expectancy and risk-adjusted return are performance.` },
      { h: 'When it fails', md: `A trader reports a 12-month Sharpe of 2.4 from selling weekly options. Sortino is barely higher than Sharpe (a hint that downside volatility dominates), skew is strongly negative, and the worst day was −4.8% against an average day of +0.15%. In month 13 a single gap day costs −11% and the trailing Sharpe collapses below zero. The metric was accurate about the past and silent about the shape of risk.` },
      { h: 'Exercise', md: `1. Export your daily equity changes for the last 30+ sessions (simulator or live). Compute mean, sd, Sharpe, Sortino and max drawdown in a spreadsheet using the formulae above.
2. Compute the Sharpe standard error and write one sentence about how confident you can be.
3. Use [[widget:drawdown]] to see how long a recovery from your max drawdown would take at your current expectancy.` },
    ],
    check: [
      { q: 'Mean daily return 0.10%, sd 0.80%. Annualised Sharpe (√252 ≈ 15.87, risk-free ignored)?', o: ['0.125', '1.98', '12.7', '3.97'], a: 1, why: '0.10/0.80 = 0.125 daily; × 15.87 = 1.98.' },
      { q: 'Two strategies have the same Sharpe. Strategy X has a Sortino much higher than its Sharpe; Y has a Sortino about equal to its Sharpe. What does that suggest?', o: ['Y is safer', 'They are identical', 'X must have higher drawdown', 'X has relatively more upside volatility; Y\'s volatility is more on the downside'], a: 3, why: 'Sortino only penalises downside deviation, so a high Sortino relative to Sharpe implies much of the volatility is on the upside.' },
      { q: 'CAGR 18%, max drawdown 24%. MAR ratio?', o: ['1.33', '4.32', '0.75', '0.18'], a: 2, why: '18/24 = 0.75.' },
    ],
    refs: ['William F. Sharpe — The Sharpe Ratio (Journal of Portfolio Management, 1994)', 'Sortino & Price — Performance Measurement in a Downside Risk Framework (Journal of Investing, 1994)', 'Andrew W. Lo — The Statistics of Sharpe Ratios (Financial Analysts Journal, 2002)', 'Terry W. Young — Calmar Ratio: A Smoother Tool (Futures magazine, 1991)'],
  });

  IA.content.lessons.push({
    id: 'l4-review', module: 'L4-M5', level: 4, track: 'psych', title: 'The professional review cycle', mins: 20,
    summary: 'Run daily, weekly, monthly and quarterly reviews that separate execution errors from strategy variance, and convert findings into specific rule or process changes.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Professional traders spend a surprising amount of time not trading: reviewing. The goal of a review is not to feel good or bad about P&L. It is to answer two questions:
1. **Did I do what my plan said?** (execution and discipline)
2. **Is my plan still working?** (strategy edge)

These must be kept apart. A losing trade taken exactly by the rules is a *good* trade with a bad outcome. A winning trade taken against the rules is a *bad* trade that got lucky — and the dangerous one, because it teaches the wrong lesson.

The review cycle is like a cricket team watching match footage: what did we execute well, what errors repeated, and does the game plan need changing for the next series?` },
      { h: 'Intermediate view', md: `### Cadence
| Cycle | Time | Focus | Output |
|---|---|---|---|
| Daily (post-market) | 15–30 min | Each trade: plan vs execution, emotion, rule breaks | Journal entries, one lesson for tomorrow |
| Weekly | 60 min | Stats by setup, rule adherence %, mistakes ranked by ₹ cost | One process change for next week |
| Monthly | 2 hrs | Risk metrics, drawdown vs Monte Carlo, costs, slippage trend | Continue / modify / demote decisions |
| Quarterly | half day | Strategy-level review vs OOS expectations, regime check | Research agenda, capital allocation |

### The trade grade
Grade every trade on **process**, separate from outcome:
- **A** — setup valid, entry/stop/target per plan, size correct.
- **B** — minor deviation (entry a few ticks late, partial exit off-plan).
- **C** — rule break (no stop, oversized, unplanned instrument, revenge trade).

Then build a 2×2: good process / bad process × win / loss. Spend most review time on bad-process wins (luck you might repeat) and bad-process losses (costly errors).

### Mistake cost
For each C-grade trade, estimate what the result would have been if executed by the rules. Example: a revenge trade lost ₹6,500; a plan-compliant day would have stopped after the second loss. Mistake cost = ₹6,500. Rank mistakes by total monthly cost; fix the top one first.` },
      { h: 'Advanced view', md: `- **Change one thing at a time.** If you change entry, stop and timeframe in the same week you cannot attribute the result. Log every change with a date.
- **Distinguish variance from decay.** Compare current rolling expectancy to the OOS distribution ([[link:l4-live-transition]]) before concluding a strategy has stopped working.
- **Segment.** Break performance down by setup, time of day, instrument, day type (trend/range/event), and your state (sleep, stress). Many traders find most losses cluster in one segment — for example, the first 15 minutes or after a large win.
- **Pre-mortem.** Before the week starts, write what is most likely to go wrong and what you will do. Review it on Friday.
- **External review.** A mentor or peer reviewing your journal catches rationalisations you will not see.
- **Avoid hindsight bias.** Review screenshots of the chart *as it was at entry*, not the completed chart.

### A weekly review template
1. Net P&L in ₹ and R, number of trades, adherence %.
2. Expectancy by setup (with trade counts) and comparison to the OOS expectation.
3. Top three mistakes by ₹ cost, each with the rule it broke.
4. Slippage: average and worst, in bps, versus the backtest assumption.
5. Any kill criterion approached or touched.
6. One process change for next week, written as a testable rule, with the date.
7. One thing done well, to repeat. Reinforcing good process matters as much as fixing errors.` },
      { h: 'The maths', md: `### Weekly adherence and mistake statistics
Week: 22 trades. Grades: 15 A, 4 B, 3 C.
:::formula
Adherence = (A + B) / total = 19 / 22 = 86.4%
:::
P&L by grade: A trades +₹14,200; B trades +₹1,100; C trades −₹9,800. Week net = +₹5,500.

Had the three C trades simply not been taken, the week would have been +₹15,300 — the mistakes cost ₹9,800, about 64% of the potential result.

### Is a setup worth keeping?
Setup "VWAP reclaim": 38 trades, expectancy +0.06R, sd 1.2R. SE = 1.2/√38 = 0.195; t = 0.31. Not yet distinguishable from zero. Setup "ORB long": 41 trades, expectancy +0.31R, sd 1.4R. SE = 0.219; t = 1.42 — encouraging but not conclusive.

Decision rule example: keep trading both at current size; reassess at 100 trades each; if VWAP reclaim is still below +0.1R with t < 1 at 100 trades, retire it.

### Segment analysis
| Time window | Trades | Net R |
|---|---|---|
| 09:15–09:30 | 30 | −7.8 |
| 09:30–11:30 | 64 | +11.2 |
| 11:30–14:00 | 28 | −1.4 |
| 14:00–15:15 | 22 | +3.9 |

The open window lost 0.26R per trade. One process change — no entries before 09:30 — would have improved the quarter by about 7.8R, provided the effect is not just noise (30 trades is small; monitor).` },
      { h: 'India', md: `> [!india] Add Indian-specific journal tags: expiry day (Nifty weekly expiry Tuesday as of Nov 2026 — verify), RBI policy days, budget day, result days for stocks you trade, F&O ban-list stocks, and gap size at 09:15 relative to the previous close. Reconcile weekly against your broker's contract notes and P&L statement so charges in your journal match reality.` },
      { h: 'Common misconceptions', md: `- **"Review means looking at my P&L."** P&L is the least informative number in the short run; process grades and segments are more useful.
- **"A losing week means my strategy is broken."** Check against expected variance first.
- **"I remember my trades; I don't need screenshots."** Memory rewrites itself after you know the outcome.
- **"More rules after every loss will fix things."** Over-reacting to small samples creates a rulebook that is curve-fit to your last month.` },
      { h: 'When it fails', md: `A trader reviews only losing trades. Over a quarter they add six new filters, each suggested by a recent loss. Each filter removes some winners too. Expectancy falls from +0.18R to +0.04R, and the trader concludes the market has changed. The review process itself overfit the strategy. Fix: review all trades, require a minimum sample before changing rules, and test changes out-of-sample before adopting them.` },
      { h: 'Exercise', md: `1. Grade your last 20 trades A/B/C and fill the 2×2 process-vs-outcome grid.
2. Compute adherence % and total mistake cost in ₹ and R.
3. Segment your trades by time of day and setup; identify the worst segment and write one specific rule change. Record the date you made it.
4. Schedule weekly and monthly review slots in your calendar now.` },
    ],
    check: [
      { q: 'You took a trade that broke your sizing rule and made ₹8,000. How should it be graded in review?', o: ['C — process violation, regardless of outcome', 'A — it was profitable', 'B — minor deviation', 'Exclude it from review'], a: 0, why: 'Grades measure process. Profitable rule breaks are the most dangerous because they reinforce bad behaviour.' },
      { q: '30 trades, 24 graded A or B. Adherence?', o: ['24%', '125%', '20%', '80%'], a: 3, why: '24/30 = 80%.' },
      { q: 'Why change only one rule at a time?', o: ['Brokers limit changes', 'So the effect of each change can be attributed and evaluated', 'It is faster', 'It improves Sharpe automatically'], a: 1, why: 'Multiple simultaneous changes confound the results; you cannot tell which helped or hurt.' },
    ],
    refs: ['Brett N. Steenbarger — The Daily Trading Coach (book)', 'Mark Douglas — Trading in the Zone (book)', 'Annie Duke — Thinking in Bets (book; process vs outcome)', 'Gary Klein — Performing a Project Premortem (Harvard Business Review, 2007)'],
  });

  IA.content.lessons.push({
    id: 'l4-readiness', module: 'L4-M5', level: 4, track: 'risk', title: 'Are you ready for real money? An honest framework', mins: 22,
    summary: 'Assess your readiness against explicit knowledge, evidence, risk, operational and psychological criteria, and understand why passing every test is still not proof of future profitability.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `This app can teach you how markets work, how to size, how to test. It cannot tell you that you will make money. Nobody honestly can. What a professional framework can do is tell you whether you have earned the right to **risk a small, defined amount of real capital in order to collect more evidence**.

That is the real meaning of "ready": not "ready to profit", but "ready to run a controlled experiment with money you can afford to lose entirely".

> [!warn] Passing the readiness exam, the assessments, a backtest and a paper-trading phase is not proof of future profitability. Markets change, samples are small, and live behaviour differs from practice. Regulators have repeatedly found that most individual traders in Indian equity derivatives lose money; treat that as the base rate you must beat.` },
      { h: 'Intermediate view', md: `### The five gates
Score each gate honestly. All five must pass before stage-2 micro live ([[link:l4-live-transition]]).

| Gate | Pass criteria (examples — set your own, stricter is better) |
|---|---|
| 1. Knowledge | Pass all module assessments at ≥80% and the readiness exam at ≥85%. Can explain costs, margin, order types and your instrument's contract specs without notes. |
| 2. Evidence | A written, rules-based strategy with OOS / walk-forward results, net of realistic costs and slippage; WFE comfortably positive; Monte Carlo 95th-percentile drawdown known. |
| 3. Risk plan | Risk per trade derived from Monte Carlo (typically ≤0.5% for micro stage); daily, weekly and hard-stop loss limits written in ₹; capital at risk is money you can lose without affecting essentials. |
| 4. Operations | Broker, data, order types, stop handling and contract notes tested; you know what to do on broker outage or a stuck order; journal template ready. |
| 5. Behaviour | 100+ journalled paper or simulated trades (the app's readiness checklist requires at least 100) with ≥95% rule adherence; no rule breaks in the last 20; you have pre-written responses for a 10-loss streak and a large win. |

### Red flags — any one means "not yet"
- The money is borrowed, or needed for rent, EMIs, fees or emergencies.
- You are trading to recover a previous loss.
- You cannot state your edge in one sentence and your expected R per trade.
- You plan to "start small and increase quickly once it works".
- You have no maximum loss number written down.` },
      { h: 'Advanced view', md: `**Base rates beat stories.** Your personal story ("I'm disciplined, I've studied hard") does not change the base rate much; evidence does. Start from the assumption your edge is zero after costs and require data to move you.

**Survivorship in your own head.** You remember the trader who turned ₹1 lakh into ₹1 crore and not the thousands who lost. Your own paper results suffer a mini-version: strategies you abandoned are forgotten; the survivor looks better than chance.

**Opportunity cost.** If your realistic, risk-adjusted expectation does not beat a passive index fund plus your salary from the hours spent, trading is a hobby — fine, but budget it like one.

**Readiness decays.** After a break of months, or a regime change (new lot sizes, cost changes, expiry changes), revert to paper briefly.

**What "ready" looks like for professionals.** Desk traders typically start with small risk limits that grow only with a track record, under a risk manager who can stop them. Copy the structure, not the bravado.` },
      { h: 'The maths', md: `### Capital you can afford to lose
Set a **risk capital** amount R_c that you could lose entirely without changing your life. Example: ₹2,00,000.

Stage-2 plan: risk 0.25% of R_c per trade = ₹500. Hard stop at the Monte Carlo 95th-percentile drawdown, say 16R = ₹8,000 (4% of R_c). This structure means even a complete failure of the strategy costs a small fraction of risk capital and leaves enough to research again.

### How much evidence will stage 2 give?
With sd 1.3R, after 100 trades SE = 0.13R. If your true edge is +0.15R, your live estimate will be within roughly ±0.26R (±2 SE) of it — anywhere from −0.11R to +0.41R. So 100 trades still cannot prove an edge; it can reveal a gross problem (huge slippage, rule breaking, negative expectancy well below OOS).

### Break-even check after costs
Planned stop 25 Nifty points, target 40 points, explicit cost ≈ 15 points, slippage 2 points round trip. Net win = 40 − 17 = 23 points; net loss = 25 + 17 = 42 points.
:::formula
Break-even win rate = 42 / (23 + 42) = 64.6%
:::
Without costs, break-even would be 25/65 = 38.5%. If your tested win rate is 50%, this setup is losing money after costs. Run this check on every strategy before calling yourself ready.` },
      { h: 'India', md: `> [!india] SEBI has published studies of individual traders in equity F&O: January 2023 (covering FY22), September 2024 (FY22–FY24) and July 2025 (FY25). Each found that a large majority — around nine in ten — of individual traders incurred net losses; the July 2025 study reported about 91% for FY25. Read the latest study on sebi.gov.in rather than relying on second-hand figures. SEBI also introduced measures from late 2024 onwards to curb speculative retail F&O activity (larger contract sizes, upfront collection of option premium, fewer weekly expiries per exchange, intraday monitoring of position limits). As of Nov 2026 — verify current rules on SEBI and NSE.` },
      { h: 'US & global', md: `> [!us] The end of the pattern-day-trader $25,000 minimum (SEC approval of FINRA's proposal in Apr 2026; broker implementation varies — verify) lowers the barrier to day trading small US accounts. A lower barrier is not a readiness signal. The same five gates apply.` },
      { h: 'Common misconceptions', md: `- **"I passed every quiz, so I'm ready to profit."** Knowledge is necessary, not sufficient.
- **"My backtest is profitable, so the edge is real."** Backtests are upper bounds; live results are usually worse.
- **"I'll go big once I'm confident."** Confidence is not evidence. Scale by criteria.
- **"Small real money doesn't matter, so I'll skip it."** Small real money is where you learn how *you* behave with real risk.` },
      { h: 'When it fails', md: `A learner passes all assessments, has a walk-forward-tested breakout system and completes paper trading with 97% adherence. They start micro live at 0.25% risk. After 80 trades live expectancy is −0.12R; slippage is 0.18R per trade higher than modelled because their broker's stop orders fill poorly on fast breakouts. The framework did its job: total loss about ₹4,800 (80 × 0.12R × ₹500) plus charges on ₹2 lakh risk capital, a stopped experiment and a specific research question (execution). Failure of a strategy is not failure of the process; ignoring the kill criteria would be.` },
      { h: 'Exercise', md: `1. Fill in the five-gate table for yourself with evidence, not feelings. Mark each Pass / Not yet.
2. Write your risk capital figure and confirm in writing that losing all of it would not affect essentials.
3. Run the break-even win-rate calculation for your main setup after costs using [[widget:charges-india]] or [[widget:charges-us]].
4. Take the READINESS exam in the assessments section. A pass unlocks nothing except the right to paper trade with stricter criteria or start stage-2 micro live.` },
    ],
    check: [
      { q: 'Stop 20 points, target 30 points, round-trip cost plus slippage 12 points. Break-even win rate?', o: ['64%', '40%', '50%', '30%'], a: 0, why: 'Net win 18, net loss 32; 32/(18 + 32) = 64%. Costs moved break-even from 40% to 64%.' },
      { q: 'Which is a disqualifying red flag for going live?', o: ['Using a 0.25% risk per trade', 'Having written kill criteria', 'Trading with money needed for an EMI', 'Testing with walk-forward'], a: 2, why: 'Capital that is needed for essentials creates pressure that undermines discipline and can cause real harm.' },
      { q: 'After 100 micro-live trades your expectancy is +0.20R (sd 1.3R). What can you conclude?', o: ['The edge is proven', 'The estimate is consistent with a modest positive edge but also with near zero (2 SE ≈ ±0.26R)', 'The strategy is broken', 'You should triple size immediately'], a: 1, why: 'SE = 0.13R; the 2-SE range is −0.06R to +0.46R. Encouraging, not proof.' },
    ],
    refs: ['SEBI — Study on analysis of profit and loss of individual traders in equity F&O (sebi.gov.in; Jan 2023, Sep 2024, Jul 2025)', 'SEBI — Measures to strengthen equity index derivatives framework, circular (sebi.gov.in, Oct 2024)', 'Daniel Kahneman — Thinking, Fast and Slow (book; base rates)', 'Brett N. Steenbarger — Trading Psychology 2.0 (book)'],
  });

  IA.content.questions.push(
    // ---------- L4-M1 Order flow and execution ----------
    { id: 'L4-M1-q01', module: 'L4-M1', d: 1, q: 'What does time & sales show that a depth (Level 2) window does not?', o: ['Resting limit orders at each price', 'The broker\'s margin requirement', 'Future order intentions', 'Trades that actually executed, with price, size and time'], a: 3, why: 'Depth shows resting orders that can be cancelled; the tape records completed trades.' },
    { id: 'L4-M1-q02', module: 'L4-M1', d: 2, q: 'Five-level bids total 9,000 and asks total 6,000. What is the depth imbalance?', o: ['+0.50', '−0.20', '+0.20', '+0.33'], a: 2, why: '(9,000 − 6,000)/(9,000 + 6,000) = 3,000/15,000 = +0.20.' },
    { id: 'L4-M1-q03', module: 'L4-M1', d: 2, q: 'A 40,000-share bid appears at ₹750 and disappears 2 seconds later with no prints at ₹750. The most defensible conclusion is:', o: ['The order was cancelled; it gave no confirmed information about real demand', 'An institution has accumulated 40,000 shares', 'Price must rise', 'It was an iceberg order that filled'], a: 0, why: 'No trades printed, so nothing was bought. Large orders that vanish untraded may be flicker or, if intended to mislead, spoofing — which is illegal.' },
    { id: 'L4-M1-q04', module: 'L4-M1', d: 2, q: 'Bid 1,500 shares at ₹200.00, ask 500 shares at ₹200.10. What is the micro-price?', o: ['₹200.050', '₹200.025', '₹200.100', '₹200.075'], a: 3, why: '(200.10 × 1,500 + 200.00 × 500)/2,000 = (3,00,150 + 1,00,000)/2,000 = ₹200.075. The heavier bid pulls fair value toward the ask.' },
    { id: 'L4-M1-q05', module: 'L4-M1', d: 2, q: 'A footprint bar shows buy volume 2,600 and sell volume 3,400. What is delta and delta%?', o: ['+800, +13.3%', '−800, −13.3%', '−800, −23.5%', '−600, −10%'], a: 1, why: 'Delta = 2,600 − 3,400 = −800; total 6,000; −800/6,000 = −13.3%.' },
    { id: 'L4-M1-q06', module: 'L4-M1', d: 3, q: 'Price makes a lower low on heavy sell delta, but the bid price at the low holds for several minutes while thousands of contracts trade at the bid. This pattern is usually described as:', o: ['Possible absorption by a passive buyer — needs confirmation from subsequent price action', 'Proof of a reversal', 'A spoofing violation', 'Momentum continuation guaranteed'], a: 0, why: 'Aggressive selling meeting a refilling bid suggests absorption, but it is a hypothesis to confirm, not proof.' },
    { id: 'L4-M1-q07', module: 'L4-M1', d: 2, q: 'Why can two footprint platforms show different delta for the same Nifty futures bar?', o: ['One of them is fraudulent', 'NSE publishes two deltas', 'Aggressor side is inferred (tick or quote rule) from snapshot data, and classification methods differ', 'Delta depends on the chart colour'], a: 2, why: 'Without an official aggressor flag, vendors infer it; snapshots and batching cause misclassification.' },
    { id: 'L4-M1-q08', module: 'L4-M1', d: 3, q: 'Daily volatility 1.5%, ADV 10 lakh shares, your order 1 lakh shares, Y = 1. Square-root impact estimate?', o: ['0.15%', '0.47%', '1.5%', '0.05%'], a: 1, why: '1 × 1.5% × √0.1 = 1.5% × 0.316 = 0.47%.' },
    { id: 'L4-M1-q09', module: 'L4-M1', d: 3, q: 'You plan to buy 1,000 at decision price ₹400. Arrival mid ₹400.20, fill 1,000 at ₹400.50, explicit costs ₹150. Implementation shortfall?', o: ['₹350', '₹500', '₹200', '₹650'], a: 3, why: 'Delay 1,000 × 0.20 = 200; execution 1,000 × 0.30 = 300; no opportunity cost; plus 150 → ₹650.' },
    { id: 'L4-M1-q10', module: 'L4-M1', d: 2, q: 'In India, what market data does a typical retail trading screen provide?', o: ['Full order-by-order feed with every add and cancel', 'No depth at all', 'Typically 5-level depth, sometimes 20-level, as periodic snapshots — not the full tick-by-tick order feed', 'Only end-of-day prices'], a: 2, why: 'Full tick-by-tick data is an institutional/co-location product; retail sees aggregated snapshot depth (verify with your broker).' },
    { id: 'L4-M1-q11', module: 'L4-M1', d: 2, q: 'You need to exit a losing position urgently in a liquid Nifty future during a fast move. Which order type prioritises getting out?', o: ['Market or SL-M order', 'Passive limit at the far side', 'Stop-limit with a tight limit', 'Good-till-cancelled limit'], a: 0, why: 'Market and stop-market orders prioritise fill certainty; limit-based orders risk not filling in a fast move. Check what your broker allows: NSE blocks SL-M in index options and some brokers restrict SL-M or market orders in F&O (as of Nov 2026 — verify).' },
    { id: 'L4-M1-q12', module: 'L4-M1', d: 3, q: 'A backtest shows +₹0.90/share on a breakout rule. Live: entry slippage ₹0.45, exit slippage ₹0.25, costs ₹0.30. Net per share?', o: ['+₹0.90', '+₹0.20', '−₹0.45', '−₹0.10'], a: 3, why: '0.90 − 0.45 − 0.25 − 0.30 = −₹0.10 — the edge was consumed by execution.' },
    { id: 'L4-M1-q13', module: 'L4-M1', d: 2, q: 'Why can a passive limit order still have a hidden cost?', o: ['It always pays more STT', 'It is most likely to fill when price is about to move through it (adverse selection), and misses cost opportunity', 'Exchanges charge double for limits', 'It cannot be cancelled'], a: 1, why: 'Fills cluster when the market moves against you; unfilled orders create opportunity cost.' },

    // ---------- L4-M2 Quantitative foundations ----------
    { id: 'L4-M2-q01', module: 'L4-M2', d: 1, q: 'Which statistic measures how heavy the tails of a return distribution are?', o: ['Kurtosis', 'Mean', 'Skewness', 'Median'], a: 0, why: 'Kurtosis measures tail weight; positive excess kurtosis means more extreme moves than a normal distribution.' },
    { id: 'L4-M2-q02', module: 'L4-M2', d: 2, q: 'Win rate 45%, average win 1.6R, average loss 1.0R, cost 0.05R per trade. Net expectancy?', o: ['+0.17R', '−0.03R', '+0.12R', '+0.22R'], a: 2, why: '0.45 × 1.6 − 0.55 × 1.0 = 0.72 − 0.55 = 0.17; minus 0.05 = +0.12R.' },
    { id: 'L4-M2-q03', module: 'L4-M2', d: 3, q: 'Expectancy +0.08R, sd 1.2R. Roughly how many trades are needed for t ≈ 2?', o: ['about 90', 'about 900', 'about 300', 'about 3,000'], a: 1, why: 'n = (2 × 1.2/0.08)² = 30² = 900.' },
    { id: 'L4-M2-q04', module: 'L4-M2', d: 2, q: 'Your win rate is 50%. What is the probability that the next 6 trades are all losers?', o: ['3.1%', '8.3%', '50%', '1.6%'], a: 3, why: '0.5^6 = 1/64 ≈ 1.6%. Over hundreds of trades such streaks are expected.' },
    { id: 'L4-M2-q05', module: 'L4-M2', d: 2, q: 'Cov(stock, Nifty) = 1.8 (%²), Var(Nifty) = 1.5 (%²). Beta?', o: ['0.83', '2.70', '1.20', '0.30'], a: 2, why: 'Beta = Cov/Var = 1.8/1.5 = 1.2.' },
    { id: 'L4-M2-q06', module: 'L4-M2', d: 2, q: 'Two independent stocks both rose steadily for two years. Their price-level correlation is 0.92. What is the most likely explanation?', o: ['Spurious correlation from shared trend; correlate returns instead', 'They are economically linked', 'One causes the other', 'Data error'], a: 0, why: 'Trending levels correlate spuriously; return correlation removes the common trend.' },
    { id: 'L4-M2-q07', module: 'L4-M2', d: 3, q: 'Regression of stock returns on Nifty returns: slope 1.1, R² 0.45. Nifty rises 1.0% today. Best statement?', o: ['The stock will rise exactly 1.1%', 'The stock will rise 0.45%', 'R² means a 45% chance of rising', 'The fitted value is about +1.1%, but 55% of the stock\'s variance is unexplained, so a wide error band applies'], a: 3, why: 'The fitted value uses the slope; R² of 0.45 means much variation remains unexplained.' },
    { id: 'L4-M2-q08', module: 'L4-M2', d: 2, q: '20-bar mean ₹980, sd ₹6, current price ₹995. z-score?', o: ['−2.5', '+2.5', '+1.5', '+15'], a: 1, why: '(995 − 980)/6 = 2.5.' },
    { id: 'L4-M2-q09', module: 'L4-M2', d: 3, q: 'An AR(1) fit on a 15-minute spread gives λ = −0.035. Half-life, and is it usable for intraday trading on NSE (about 25 fifteen-minute bars per session)?', o: ['19.8 bars — marginal, most of a session', '2 bars — very fast', '35 bars — unusable', '0.7 bars'], a: 0, why: '0.693/0.035 = 19.8 bars ≈ 5 hours, most of a session, so an intraday time stop of 2–3 half-lives cannot be met.' },
    { id: 'L4-M2-q10', module: 'L4-M2', d: 2, q: 'Which regime most favours a mean-reversion rule?', o: ['Event day with a large gap and one-sided trade', 'Breakout from a multi-week range', 'Low ADX, price repeatedly crossing VWAP, no scheduled events', 'Index hitting circuit filter'], a: 2, why: 'Rotational, two-sided trade around a mean is where reversion rules are designed to work.' },
    { id: 'L4-M2-q11', module: 'L4-M2', d: 2, q: 'The classic academic momentum effect (Jegadeesh & Titman) refers to:', o: ['5-minute breakouts in a single stock', 'Cross-sectional returns: past 3–12-month winners tending to outperform past losers over subsequent months', 'Options gamma', 'Overnight gaps'], a: 1, why: 'It is a multi-month cross-sectional effect; it does not directly validate intraday breakouts.' },
    { id: 'L4-M2-q12', module: 'L4-M2', d: 3, q: 'Pair hedge ratio β = 0.7. You buy ₹4 lakh of stock A. How much of stock B do you short to be beta-neutral?', o: ['₹4.0 lakh', '₹5.7 lakh', '₹1.2 lakh', '₹2.8 lakh'], a: 3, why: 'Short β × long = 0.7 × 4 = ₹2.8 lakh.' },
    { id: 'L4-M2-q13', module: 'L4-M2', d: 2, q: 'In a pairs trade, which risk is NOT removed by being market-neutral?', o: ['Index moves', 'Beta exposure', 'A permanent break in the relationship, such as a company-specific event', 'Sector-wide moves in both legs'], a: 2, why: 'Hedging removes common factor exposure but not idiosyncratic or relationship-break risk.' },
    { id: 'L4-M2-q14', module: 'L4-M2', d: 2, q: 'Under SEBI\'s retail algo framework (as of 2025–26, verify on sebi.gov.in), which statement is consistent with the published circular?', o: ['Brokers act as principals; algo providers are empanelled with exchanges; high-frequency client orders need registration with an algo ID', 'Retail algos are banned', 'Any script can trade without registration', 'Only exchanges may write algos'], a: 0, why: 'The Feb 2025 circular set a broker-responsible framework with empanelment, algo IDs and API controls; details are phased and should be verified.' },
    { id: 'L4-M2-q15', module: 'L4-M2', d: 3, q: 'Your trading script resubmits an order whenever the broker API times out, without checking for an existing fill. What is the main risk?', o: ['Slower fills', 'Higher STT rate', 'Lower Sharpe only', 'Duplicate orders leading to unintended multiples of position size'], a: 3, why: 'Timeouts do not mean the order failed; idempotent order IDs and position reconciliation prevent runaway size.' },

    // ---------- L4-M3 Strategy research process ----------
    { id: 'L4-M3-q01', module: 'L4-M3', d: 1, q: 'What is out-of-sample data?', o: ['Data with errors removed', 'Data not used in designing or optimising the strategy, reserved for evaluation', 'The most volatile days', 'Data from another market'], a: 1, why: 'OOS data measure performance on information the design never saw.' },
    { id: 'L4-M3-q02', module: 'L4-M3', d: 2, q: 'Anchored vs rolling walk-forward: which statement is correct?', o: ['Anchored keeps the start date fixed and grows the training window; rolling slides a fixed-length window', 'Anchored uses a fixed-length window', 'They are identical', 'Rolling never re-optimises'], a: 0, why: 'Anchored grows; rolling slides. Anchored is more stable, rolling adapts faster.' },
    { id: 'L4-M3-q03', module: 'L4-M3', d: 2, q: 'IS performance +40R per 100 trades, OOS +28R per 100 trades. WFE?', o: ['1.43', '0.28', '0.70', '0.12'], a: 2, why: '28/40 = 0.70 — OOS retains most of IS, which is a good sign (still check significance and costs).' },
    { id: 'L4-M3-q04', module: 'L4-M3', d: 3, q: 'You tested 150 parameter combinations and report the best Sharpe of 1.9. What adjustment is appropriate?', o: ['None — the best result is the true result', 'Deflate the Sharpe for the number of trials (e.g. deflated Sharpe ratio) and confirm out-of-sample', 'Double the Sharpe', 'Use only the worst result'], a: 1, why: 'Choosing the best of many trials inflates the result; multiple-testing adjustment is needed.' },
    { id: 'L4-M3-q05', module: 'L4-M3', d: 2, q: 'In a walk-forward, the chosen parameter jumps between 10, 34, 12 and 40 across windows. What does that suggest?', o: ['A robust strategy', 'Perfect adaptation', 'Data are too clean', 'Parameter instability — results likely driven by noise'], a: 3, why: 'Stable edges select similar parameters over time; erratic optima indicate overfitting.' },
    { id: 'L4-M3-q06', module: 'L4-M3', d: 2, q: 'What does a permutation (shuffle) Monte Carlo of your trade list change between simulations?', o: ['Total P&L', 'Win rate', 'Order of trades, and therefore drawdowns and streaks', 'Average win'], a: 2, why: 'Shuffling preserves the set of trades (sum, win rate) and varies only the path.' },
    { id: 'L4-M3-q07', module: 'L4-M3', d: 3, q: 'Loss probability 55%, 300 trades. Approximate longest losing streak to plan for?', o: ['about 9–10', 'about 5', 'about 20', 'about 55'], a: 0, why: 'ln(300)/ln(1/0.55) = 5.70/0.598 ≈ 9.5. The exact median is about 8 and there is roughly a 29% chance of 10 or more, so plan around 9–10 and size for the 95th percentile (about 13).' },
    { id: 'L4-M3-q08', module: 'L4-M3', d: 3, q: 'Monte Carlo 95th-percentile max drawdown 18R. You accept at most a 12% account drawdown and use a 1.5 safety factor. Maximum risk per trade?', o: ['0.67%', '1.0%', '0.22%', '0.44%'], a: 3, why: '12%/(18 × 1.5) = 12/27 = 0.44%.' },
    { id: 'L4-M3-q09', module: 'L4-M3', d: 2, q: 'Your 10,000-path Monte Carlo never shows a loss bigger than −1.3R per trade. Why might that still underestimate risk?', o: ['Too many simulations', 'Resampling cannot generate tail events (e.g. gap-through-stop) that are absent from the original sample', 'Monte Carlo always overstates risk', 'The seed was wrong'], a: 1, why: 'Resampling only recombines observed outcomes; add stress losses to model unseen tails.' },
    { id: 'L4-M3-q10', module: 'L4-M3', d: 2, q: 'Which is the best example of a pre-written kill criterion?', o: ['"If account drawdown on this strategy reaches ₹40,000 (MC 95th percentile), stop trading it and return to research"', '"Stop if it feels wrong"', '"Trade until the month ends"', '"Increase size after losses to recover"'], a: 0, why: 'Kill criteria must be specific, measurable and decided in advance.' },
    { id: 'L4-M3-q11', module: 'L4-M3', d: 3, q: 'OOS expectancy +0.30R (sd 1.5R). After 225 live trades expectancy is +0.05R. z-score versus OOS and action?', o: ['−0.25: no concern', '+2.5: scale up', '−2.5: live is significantly worse — demote and investigate', '−1.0: ignore'], a: 2, why: 'SE = 1.5/15 = 0.10; (0.05 − 0.30)/0.10 = −2.5, a significant shortfall.' },
    { id: 'L4-M3-q12', module: 'L4-M3', d: 2, q: 'Why should promotion between stages be slow but demotion fast?', o: ['Brokers prefer it', 'Proving an edge needs many trades, but a clear breach of risk limits is enough evidence to cut risk', 'It maximises short-term profits', 'Regulation requires it'], a: 1, why: 'Evidence for an edge accumulates slowly; risk limits protect against ruin immediately.' },
    { id: 'L4-M3-q13', module: 'L4-M3', d: 2, q: 'A walk-forward test applies 2026 STT rates to 2021 trades but uses 2021 lot sizes. What is the problem?', o: ['None', 'STT does not affect results', 'Lot size never matters', 'Mixing contract and cost regimes inconsistently can mislead; model each period with its own specifications'], a: 3, why: 'Costs and contract specs change over time; tests should reflect the regime of each period, and the current regime for forward estimates.' },

    // ---------- L4-M5 Performance and discipline ----------
    { id: 'L4-M5-q01', module: 'L4-M5', d: 1, q: 'Which ratio uses only downside deviation in its denominator?', o: ['Sharpe', 'Calmar', 'Sortino', 'MAR'], a: 2, why: 'Sortino penalises only returns below the target.' },
    { id: 'L4-M5-q02', module: 'L4-M5', d: 2, q: 'Mean daily return 0.06%, sd 0.60%. Annualised Sharpe (√252 ≈ 15.87)?', o: ['1.59', '0.10', '0.95', '3.17'], a: 0, why: '0.06/0.60 = 0.10; × 15.87 = 1.59.' },
    { id: 'L4-M5-q03', module: 'L4-M5', d: 2, q: 'Annualised return 21%, max drawdown 14%. Calmar ratio?', o: ['0.67', '2.94', '7', '1.5'], a: 3, why: '21/14 = 1.5.' },
    { id: 'L4-M5-q04', module: 'L4-M5', d: 3, q: 'Using the approximation SE(Sharpe) ≈ √((1 + 0.5 SR²)/N years), what is the standard error of a Sharpe of 2.0 measured over 2 years?', o: ['0.35', '1.22', '2.45', '0.61'], a: 1, why: '√((1 + 0.5 × 4)/2) = √1.5 = 1.22 — large relative to 2.0, so the true Sharpe could plausibly be well below 1. (This annual-frequency form is conservative; if the Sharpe was estimated from daily returns the SE is closer to √(1/2) ≈ 0.71 — still large.)' },
    { id: 'L4-M5-q05', module: 'L4-M5', d: 2, q: '60 trades with total +7.2R. Expectancy per R, and the rupee expectancy at ₹3,000 risk per trade?', o: ['+0.12R, ₹360', '+7.2R, ₹21,600', '+0.12R, ₹3,600', '+1.2R, ₹3,600'], a: 0, why: '7.2/60 = 0.12R; 0.12 × 3,000 = ₹360 per trade.' },
    { id: 'L4-M5-q06', module: 'L4-M5', d: 2, q: 'A strategy has Sharpe 2.2 but strong negative skew and a worst day 25× its average day. What should concern you most?', o: ['Nothing — Sharpe is high', 'Too much upside', 'A hidden left tail that Sharpe does not capture', 'Low trade count only'], a: 2, why: 'Sharpe assumes roughly symmetric risk; negative skew can conceal rare large losses.' },
    { id: 'L4-M5-q07', module: 'L4-M5', d: 2, q: 'You followed every rule on a trade and it hit the stop. How should it be graded?', o: ['C — it lost', 'A — process was correct; the outcome is variance', 'B — partial credit', 'Exclude it'], a: 1, why: 'Grades are on process, not outcome.' },
    { id: 'L4-M5-q08', module: 'L4-M5', d: 2, q: 'Week: A-grade trades +₹12,000, B-grade +₹2,000, C-grade −₹8,500. What was the cost of rule breaks if those trades had not been taken?', o: ['₹5,500', '₹14,000', '₹2,000', '₹8,500'], a: 3, why: 'Net would have been +₹14,000 instead of +₹5,500, so mistakes cost ₹8,500.' },
    { id: 'L4-M5-q09', module: 'L4-M5', d: 3, q: 'Segment review shows trades before 09:30 lost −6R on 25 trades. What is the most sensible response?', o: ['Stop trading altogether', 'Double size before 09:30 to recover', 'Adopt a single, dated rule (e.g. no entries before 09:30), and keep monitoring because 25 trades is a small sample', 'Add five new indicators'], a: 2, why: 'Change one thing, log it, and continue measuring; avoid over-reacting or adding complexity.' },
    { id: 'L4-M5-q10', module: 'L4-M5', d: 2, q: 'Why should you review chart screenshots taken at entry rather than the completed chart?', o: ['To avoid hindsight bias — the completed chart shows information you did not have', 'They load faster', 'Regulators require it', 'Screenshots have better indicators'], a: 0, why: 'Hindsight makes decisions look more obvious than they were.' },
    { id: 'L4-M5-q11', module: 'L4-M5', d: 2, q: 'A trader adds a new filter after every losing trade for three months. The most likely effect?', o: ['Higher robustness', 'Guaranteed profits', 'Lower costs', 'Overfitting the rulebook to recent noise, often reducing out-of-sample expectancy'], a: 3, why: 'Reacting to small samples curve-fits the strategy to the recent past.' },
    { id: 'L4-M5-q12', module: 'L4-M5', d: 3, q: 'Stop 30 points, target 45 points, cost plus slippage 16 points round trip. Break-even win rate?', o: ['40%', '61.3%', '50%', '35.6%'], a: 1, why: 'Net win 29, net loss 46; 46/(29 + 46) = 61.3%, about 61.3%.' },
    { id: 'L4-M5-q13', module: 'L4-M5', d: 2, q: 'What does passing every readiness test in this app demonstrate?', o: ['That you have the knowledge and process to run a small, controlled live experiment — not that you will profit', 'Future profitability', 'That you can use maximum leverage', 'That your strategy is risk-free'], a: 0, why: 'Readiness is permission to collect evidence with limited risk, not a forecast of returns.' },
  );

  IA.content.questions.push(
    // ---------- READINESS exam: risk, execution, validation, costs, discipline (scenario style) ----------
    { id: 'READY-q01', module: 'READINESS', d: 2, q: 'Account ₹5,00,000, risk limit 0.5% per trade. You buy a stock at ₹820 with a stop at ₹808. Maximum quantity?', o: ['305 shares', '416 shares', '208 shares', '2,083 shares'], a: 2, why: 'Risk = ₹2,500; per-share risk ₹12; 2,500/12 = 208 shares (round down).' },
    { id: 'READY-q02', module: 'READINESS', d: 2, q: 'You are long 1 lot Nifty futures (65) at 24,850 with a stop at 24,790. The market gaps to 24,700 at the open and your SL-M fills at 24,695. Actual loss before costs?', o: ['₹3,900', '₹10,075', '₹9,750', '₹6,500'], a: 1, why: '(24,850 − 24,695) × 65 = 155 × 65 = ₹10,075 — more than 2.5× the planned ₹3,900. Gap risk must be in your sizing.' },
    { id: 'READY-q03', module: 'READINESS', d: 2, q: 'Your daily loss limit is 2R. You are at −1.8R at 11:00 and see an A+ setup with 1R risk. What does your plan require?', o: ['Take it at full size', 'Take it at half size', 'Take it without a stop', 'Stop for the day — a full loss would breach the limit'], a: 3, why: 'A full stop-out would take you to −2.8R. Limits are only useful if they are absolute.' },
    { id: 'READY-q04', module: 'READINESS', d: 3, q: 'Two Bank Nifty-heavy positions: long HDFC Bank and long ICICI Bank, each risking 1%, plus long Bank Nifty futures risking 1%. How should you think about total risk?', o: ['3 independent 1% bets', '1% in total because of diversification', 'Mostly one correlated bet; effective risk is close to 3% on a single factor', 'Zero, because they hedge each other'], a: 2, why: 'High correlation means the positions move together; portfolio heat should be assessed on the shared factor.' },
    { id: 'READY-q05', module: 'READINESS', d: 2, q: 'A strategy has a 30% win rate. Which of these is necessary for positive expectancy before costs?', o: ['Average win more than about 2.33× average loss', 'Average win equal to average loss', 'Win rate above 50%', 'Using options'], a: 0, why: 'Break-even: 0.30 × W = 0.70 × L → W/L = 2.33.' },
    { id: 'READY-q06', module: 'READINESS', d: 3, q: 'You have lost 40% of your account. What return is needed to get back to the starting balance?', o: ['40%', '60%', '100%', '66.7%'], a: 3, why: '1/(1 − 0.40) − 1 = 66.7%. Drawdowns are asymmetric; protecting capital matters more than chasing returns.' },
    { id: 'READY-q07', module: 'READINESS', d: 2, q: 'You want to buy 2,000 shares of a small cap; the five-level offer side totals 1,100 shares. What should you expect from a market order?', o: ['A fill at the best ask', 'Walking the book through several levels with significant slippage, possibly a partial fill', 'Exchange rejection', 'Price improvement'], a: 1, why: 'Order size larger than visible depth consumes multiple levels; use limits, slice, or reduce size.' },
    { id: 'READY-q08', module: 'READINESS', d: 2, q: 'A large bid wall appears just below the price in a stock you are long. What is the disciplined response?', o: ['Keep your planned stop; untraded resting orders are not confirmed support and may be cancelled', 'Remove your stop because the wall is support', 'Double the position', 'Move the stop below the wall regardless of plan'], a: 0, why: 'Visible orders can vanish; spoofing exists precisely to exploit this belief.' },
    { id: 'READY-q09', module: 'READINESS', d: 3, q: 'You trade a Nifty option with a bid of ₹4.20 and ask of ₹4.70. Round-tripping at bid/ask costs what share of the mid price, before charges?', o: ['about 1%', 'about 5%', 'about 11%', 'about 50%'], a: 2, why: 'Spread ₹0.50; mid ₹4.45; 0.50/4.45 ≈ 11.2% per round trip — a huge hurdle for any edge.' },
    { id: 'READY-q10', module: 'READINESS', d: 2, q: 'Which stop order type risks not exiting at all in a fast-falling market?', o: ['SL-M (stop-market)', 'Stop-limit (SL) with a limit close to the trigger', 'Market order', 'Bracket exit at market'], a: 1, why: 'Once triggered, a stop-limit becomes a limit order; if price gaps through the limit, it may not fill.' },
    { id: 'READY-q11', module: 'READINESS', d: 2, q: 'In India, on which side is STT charged for equity intraday, and at what rate (as of Nov 2026, verify)?', o: ['Buy side, 0.1%', 'Both sides, 0.05%', 'No STT on intraday', 'Sell side, 0.025%'], a: 3, why: 'Equity intraday STT is 0.025% on the sell side; delivery is 0.1% on both sides.' },
    { id: 'READY-q12', module: 'READINESS', d: 3, q: 'Your backtest assumes ₹40 per round trip in costs on Nifty futures (1 lot) and no slippage. Live explicit costs are about ₹950. Your average gross profit per trade is ₹1,100. What is the realistic conclusion?', o: ['The strategy is fine', 'Costs reduce profit by 4%', 'The edge is mostly consumed by costs; with any slippage it is likely negative', 'Switch to options to avoid costs'], a: 2, why: 'Net ≈ ₹150 per trade before slippage; one point of slippage each way (₹130) nearly erases it.' },
    { id: 'READY-q13', module: 'READINESS', d: 2, q: 'In Indian index options, when is STT on premium charged for a position closed before expiry (as of Nov 2026, verify)?', o: ['On the sell transaction — a long pays it on exit, a short pays it on entry', 'Only on the buy transaction', 'Only at expiry', 'Never for intraday'], a: 0, why: 'Options STT (0.15% of premium as of Nov 2026, verify) is charged on the sell transaction, whichever direction that is.' },
    { id: 'READY-q14', module: 'READINESS', d: 3, q: 'You optimised a strategy over 3 years and it shows Sharpe 2.6. You have not run any out-of-sample test. What is the most accurate description?', o: ['A validated strategy', 'Proof of edge if Sharpe is above 2', 'Ready for live trading at full size', 'An in-sample result that is an upper bound and likely overstated; it needs walk-forward and holdout testing'], a: 3, why: 'In-sample optimisation overstates performance; out-of-sample evidence is required.' },
    { id: 'READY-q15', module: 'READINESS', d: 2, q: 'Your walk-forward efficiency is 0.15 and OOS expectancy t-statistic is 0.6. What should you do?', o: ['Go live at small size', 'Reject or redesign — OOS evidence does not distinguish the edge from zero', 'Increase leverage to compensate', 'Remove the worst OOS window'], a: 1, why: 'Low WFE and an insignificant OOS result mean no demonstrated edge.' },
    { id: 'READY-q16', module: 'READINESS', d: 3, q: 'You screened 300 indicator combinations and found 12 with OOS t-statistics above 2. What is the main concern?', o: ['Multiple testing: around 7–8 could pass at that threshold by chance alone, so the winners need fresh confirmation', 'There are too few winners', 'OOS testing is unnecessary', 'All 12 are proven'], a: 0, why: 'At roughly a 2.5% one-sided false-positive rate, 300 tests produce about 7–8 chance passes.' },
    { id: 'READY-q17', module: 'READINESS', d: 2, q: 'Your backtest used today\'s Nifty 50 constituents for the last 10 years of stock-selection tests. What bias is present?', o: ['Look-ahead only', 'No bias', 'Survivorship bias — stocks that were removed or failed are excluded', 'Recency bias only'], a: 2, why: 'Using current constituents ignores removed losers, inflating historical results.' },
    { id: 'READY-q18', module: 'READINESS', d: 2, q: 'Your signal uses the day\'s closing price to decide an entry at 10:30 the same day. What is the error?', o: ['Survivorship bias', 'Look-ahead bias — information not available at decision time', 'Overfitting', 'Selection bias'], a: 1, why: 'Using future data (the close) for an earlier decision invalidates the backtest.' },
    { id: 'READY-q19', module: 'READINESS', d: 3, q: 'Monte Carlo on your OOS trades: 95th-percentile max drawdown 22R. Your maximum tolerable drawdown is 15% and you use a 1.5 safety factor. Risk per trade?', o: ['0.68%', '1.0%', '0.30%', '0.45%'], a: 3, why: '15%/(22 × 1.5) = 15/33 = 0.45%.' },
    { id: 'READY-q20', module: 'READINESS', d: 2, q: 'After 7 consecutive losses, all taken exactly by the rules, and within the Monte Carlo expected range, what is the disciplined action?', o: ['Double size to recover faster', 'Abandon the strategy', 'Continue at planned size unless a pre-written kill criterion is hit, and review execution', 'Switch to a new strategy immediately'], a: 2, why: 'Expected streaks are not evidence of failure; follow the pre-committed rules.' },
    { id: 'READY-q21', module: 'READINESS', d: 2, q: 'You made a large profit on a trade where you moved your stop further away. In review, how do you treat it?', o: ['As a C-grade rule break; outcome does not justify process violation', 'As a model trade', 'Ignore it', 'Add a rule allowing stop moves'], a: 0, why: 'Rewarding rule breaks trains the behaviour that eventually causes large losses.' },
    { id: 'READY-q22', module: 'READINESS', d: 2, q: 'You hit your weekly loss limit on Wednesday. A friend shares a "sure-shot" tip for Thursday. What does a professional process say?', o: ['Trade it small', 'Trade it with a tight stop', 'Trade it only if it is an index', 'Do not trade until the next week; tips are not part of your tested plan'], a: 3, why: 'Limits and plans exist to prevent exactly this decision under stress.' },
    { id: 'READY-q23', module: 'READINESS', d: 3, q: 'Micro live: OOS expectancy +0.22R (sd 1.4R). After 196 trades live expectancy is −0.02R. z-score and action?', o: ['−0.24: keep going', '−2.4: live is significantly below OOS; demote and investigate execution and adherence', '+2.4: scale up', '−1.0: ignore'], a: 1, why: 'SE = 1.4/14 = 0.10; (−0.02 − 0.22)/0.10 = −2.4.' },
    { id: 'READY-q24', module: 'READINESS', d: 2, q: 'Which money is appropriate for a first live trading experiment?', o: ['Risk capital you could lose entirely without affecting essentials', 'A personal loan', 'Money earmarked for an EMI next month', 'Emergency fund'], a: 0, why: 'Only true risk capital avoids the financial and psychological pressure that destroys discipline.' },
    { id: 'READY-q25', module: 'READINESS', d: 2, q: 'You have passed every assessment, a walk-forward test, Monte Carlo and 120 paper trades with 97% adherence. Which statement is correct?', o: ['You will be profitable', 'You can skip micro live', 'You may start a small, staged live experiment with pre-written kill criteria; profitability is not proven', 'You should use maximum leverage'], a: 2, why: 'Passing tests is not proof of future profitability; it qualifies you to collect live evidence safely.' },
    { id: 'READY-q26', module: 'READINESS', d: 3, q: 'Stop 15 points, target 25 points on Nifty futures; explicit costs ≈ 15 points and slippage 2 points per round trip. Your tested win rate is 55%. Expectancy per trade in points?', o: ['+4.0', '−10.0', '+11.0', '−1.0'], a: 1, why: 'Net win = 25 − 17 = 8; net loss = 15 + 17 = 32; 0.55 × 8 − 0.45 × 32 = 4.4 − 14.4 = −10.0 points. Gross expectancy was +7 points (0.55 × 25 − 0.45 × 15); costs turned it deeply negative.' },
    { id: 'READY-q27', module: 'READINESS', d: 2, q: 'Your broker API shows a position of 3 lots but your system believes you hold 1 lot. What is the correct first action?', o: ['Send more orders to reach the target', 'Ignore it until end of day', 'Restart the script and continue', 'Flatten or freeze trading and reconcile before any new order'], a: 3, why: 'A position mismatch means operational failure; reconciling first prevents runaway risk.' },
    { id: 'READY-q28', module: 'READINESS', d: 2, q: 'US: after the SEC approved FINRA\'s change ending the $25,000 pattern-day-trader minimum (Apr 2026; broker implementation varies — verify), what is the right implication?', o: ['Day trading small accounts is now safe', 'Margin no longer applies', 'Access rules changed; risk, costs and the need for a validated edge did not', 'Brokers must give unlimited leverage'], a: 2, why: 'Lower regulatory barriers change access, not the economics or risk of trading.' },
    { id: 'READY-q29', module: 'READINESS', d: 3, q: 'Two strategies: A — Sharpe 1.6, Sortino 1.7, worst day −6%. B — Sharpe 1.3, Sortino 2.4, worst day −1.8%. Which risk profile is more dangerous for a small account, and why?', o: ['A — Sortino barely above Sharpe and a large worst day suggest downside-heavy, tail-exposed returns', 'B, because Sharpe is lower', 'Neither; Sharpe is all that matters', 'Both are identical'], a: 0, why: 'A has volatility concentrated on the downside and a large tail; B has more upside variability and smaller worst-case losses.' },
  );
})(typeof window !== 'undefined' ? window : globalThis);
