/* Lessons L2-M5 (psychology), L2-M6 (US), L2-M7 (global sessions), L3-M8 (other asset classes), L4-M4 (advanced market analysis)
   plus module assessment questions. Educational content only — not personal advice. Facts dated Nov 2026; verify time-sensitive items. */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  IA.content.lessons = IA.content.lessons || []; IA.content.questions = IA.content.questions || [];

  /* ============================ L2-M5 Trading psychology core ============================ */
  IA.content.lessons.push(
  {
    id: 'l2-biases', module: 'L2-M5', level: 2, track: 'psych', title: 'Cognitive biases that cost traders money', mins: 18,
    summary: 'Recognise the specific cognitive biases that show up in your own trades and attach a concrete countermeasure to each one.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Your brain was built to survive in a world of quick, rough judgements. Those shortcuts — psychologists call them **heuristics** — are usually helpful. In markets they quietly cost you money, because markets punish exactly the habits that kept our ancestors alive: following the crowd, avoiding the pain of a loss, and seeing patterns everywhere.

A **cognitive bias** is a predictable error in judgement. "Predictable" is the key word. If the error is predictable, you can catch it with a checklist, a rule or a journal entry, in the same way a pilot uses a pre-flight checklist instead of trusting memory.

Think of biases as optical illusions for decisions. Knowing that two lines are the same length does not stop them *looking* different. Likewise, knowing about loss aversion does not stop you *feeling* it. The goal is not to stop feeling biases; it is to build a process that stops them from placing orders.

> [!evidence] The existence of these biases (loss aversion, overconfidence, anchoring, the disposition effect) is well established in behavioural finance research, notably Kahneman and Tversky's prospect theory. How much any single bias costs *you* is something only your own journal can tell you.` },
      { h: 'Intermediate view', md: `Here are the biases that matter most for an intraday trader, each with the behaviour you would actually see in your trade log and a countermeasure.

| Bias | What it looks like in your trades | Countermeasure |
|---|---|---|
| Loss aversion | Moving a stop further away "to give it room"; refusing to exit a loser | Stop is placed as a live order at entry; widening it is a journal violation |
| Disposition effect | Taking small winners quickly, holding losers long | Pre-defined target or trailing rule; compare average win vs average loss in R |
| Anchoring | "Reliance was 1,500 yesterday, so 1,460 is cheap" | Judge price against today's structure (VWAP, opening range), not a remembered number |
| Confirmation bias | Reading only bullish posts after going long | Before entry, write one sentence: "This trade is wrong if…" |
| Overconfidence | Doubling size after three wins | Size is set by a formula, never by mood: fixed fraction of equity |
| Recency bias | Assuming today will trend because yesterday did | Classify the day type after the first hour, not before the open |
| Hindsight bias | "I knew it would reverse" | Record your forecast *before* the outcome, then compare |
| Sunk-cost fallacy | Averaging down because you are already in | Rule: never add to a losing intraday position |
| Gambler's fallacy | "Five losers in a row — the next must win" | Each trade's odds are independent of your recent streak |
| Herding / social proof | Entering because a Telegram channel says so | Only trade setups that exist in your written playbook |

**How to identify them.** You cannot spot a bias in real time with any reliability; you spot it in data. Tag each journal entry with the bias you suspect was present. After 50 trades, filter by tag and look at the P&L in R-multiples. A bias that appears in a small share of trades but accounts for most of your losses is your first target.` },
      { h: 'Advanced view', md: `Professionals treat bias as a **system-design problem**, not a willpower problem. Three ideas are worth adopting.

**1. Decide before you are exposed.** Biases intensify once money is at risk. So the decisions that matter — entry trigger, stop, size, target, maximum loss for the day — are made before the order is sent. During the trade you only *execute* pre-made decisions. This is a pre-commitment device.

**2. Make the bias expensive to act on.** Many brokers let you place bracket or cover orders that attach a stop automatically. Some traders keep a rule that any stop widening must be written in the journal with a reason before it is done. Friction reduces impulsive action.

**3. Measure decisions, not just outcomes.** A trade that followed every rule and lost is a *good* trade. A trade that broke a rule and won is a *bad* trade that happened to pay. If you only look at P&L, you reward bias whenever it gets lucky. Track a **rule-adherence score** alongside P&L.

**Edge case — bias stacking.** Biases rarely act alone. A typical disaster: overconfidence after a green week (bigger size) → anchoring to a prior high (early entry) → loss aversion (stop moved) → sunk cost (averaging down). Each step felt reasonable. The journal reveals the chain; the fix is usually at the first link — size.

> [!warn] Removing biases improves the consistency of your decisions. It does not create an edge. A perfectly disciplined trader with a negative-expectancy strategy still loses money — just more predictably.` },
      { h: 'The maths', md: `The disposition effect shows up directly in your expectancy.

:::formula
Expectancy per trade (R) = (Win rate × Average win in R) − (Loss rate × Average loss in R)
:::

Suppose your setup, managed by its rules, has a 45% win rate, average win 2.0R and average loss 1.0R:

:::formula
E = 0.45 × 2.0 − 0.55 × 1.0 = 0.90 − 0.55 = +0.35R
:::

Now add the disposition effect: you cut winners early at 1.2R and let some losers run, so the average loss becomes 1.4R.

:::formula
E = 0.45 × 1.2 − 0.55 × 1.4 = 0.54 − 0.77 = −0.23R
:::

The setup did not change. Your *behaviour* turned a positive-expectancy process into a negative one. (These are illustrative numbers, not results of any study.) Try both sets in the calculator.

[[widget:expectancy]]` },
      { h: 'India', md: `> [!india] Anchoring is common around round numbers on Nifty (for example 24,000 or 25,000) and around a stock's 52-week high. Traders often enter a "breakout" the moment Nifty prints a round number, before the 5-minute candle closes, then hold through a reversal because "it was above 25,000 a minute ago". A countermeasure: require a candle *close* beyond the level plus a VWAP condition, written in your playbook.

Herding is amplified by the volume of tips on social media and messaging groups. SEBI has repeatedly warned investors about unregistered advisers and finfluencers (verify current circulars on sebi.gov.in). A tip is not a setup; if it is not in your playbook, it is not a trade.` },
      { h: 'Common misconceptions', md: `- **"Experienced traders don't have biases."** They have the same brains. They have better systems for catching biases.
- **"If I know about a bias, I'm immune."** Knowledge alone helps little. Rules and friction do the heavy lifting.
- **"Cutting winners early is safe and conservative."** It feels safe, but it can turn a positive-expectancy method negative, as the maths section shows.
- **"Discipline guarantees profit."** No. Discipline makes your results reflect your strategy. If the strategy has no edge, discipline just loses money steadily.` },
      { h: 'When it fails', md: `Bias checklists fail when they become ritual rather than thought. A realistic example:

You write "This trade is wrong if Bank Nifty closes a 5-minute candle below VWAP" before going long at 52,400. Ten minutes later a candle closes below VWAP. You tell yourself "it's only 8 points below, the next candle will reclaim it." You hold. Bank Nifty falls 180 points. With 1 lot (30 units), that is ₹5,400 instead of the planned loss of about ₹1,500.

The checklist existed but had no enforcement. The fix is an **order**, not a sentence: the stop sits in the system at the invalidation level the moment you enter. Countermeasures also fail when you are tired, ill or emotionally loaded from outside events — on such days the right adjustment is smaller size or no trading.` },
      { h: 'Exercise', md: `1. Open your trade journal and add a "bias tag" field if you do not already use one.
2. Review your last 20 trades (simulator trades count). For each, tag the most likely bias, or "none".
3. Compute average R for tagged vs untagged trades.
4. Pick the single most expensive bias and write one *mechanical* countermeasure for it (an order type, a size rule, a time rule).

**Journal prompts:**
- "What did I believe about this trade before I entered, and what would have proved me wrong?"
- "Did I change the stop, size or target after entry? Why, in one sentence?"
- "Would I have taken this trade if I had lost my previous two trades? If I had won them?"

Then run the expectancy calculator with your own numbers.` },
    ],
    check: [
      { q: 'A trader has a valid setup with positive expectancy but consistently exits winners at +1R and holds losers to −1.5R. Which bias is most directly at work, and what is its effect?', o: ['Gambler\'s fallacy; it increases win rate', 'Disposition effect; it can make expectancy negative even though the setup is unchanged', 'Hindsight bias; it has no effect on expectancy', 'Herding; it only matters for swing trades'], a: 1, why: 'Selling winners early and holding losers is the disposition effect. Shrinking wins and enlarging losses lowers expectancy and can turn it negative. The other options misname the behaviour or misstate its effect.' },
      { q: 'Which countermeasure is the most robust against loss aversion during an intraday trade?', o: ['Reminding yourself to stay calm', 'Reading more about loss aversion', 'Placing the stop as a live order at entry and treating any widening as a rule violation', 'Watching the chart more closely'], a: 2, why: 'Mechanical pre-commitment works better than willpower or knowledge. The other choices rely on in-the-moment self-control, which is exactly what the bias erodes.' },
      { q: 'You followed every rule on a trade and lost 1R. How should it be graded in a process-focused journal?', o: ['As a good trade, since the decision followed the plan; the outcome was variance', 'As a bad trade because it lost', 'It should not be recorded', 'As a bad trade unless the next one wins'], a: 0, why: 'Grading by decision quality, not outcome, prevents you from rewarding rule-breaking that happens to win and punishing good process that happens to lose.' },
    ],
    refs: ['Daniel Kahneman — Thinking, Fast and Slow (book)', 'Kahneman & Tversky — Prospect Theory: An Analysis of Decision under Risk (Econometrica, 1979)', 'Hersh Shefrin — Beyond Greed and Fear (book)', 'Brett Steenbarger — The Psychology of Trading (book)', 'SEBI — Investor awareness (sebi.gov.in)'],
  },
  {
    id: 'l2-emotions', module: 'L2-M5', level: 2, track: 'psych', title: 'Fear, greed, FOMO and revenge trading', mins: 17,
    summary: 'Identify the physical and behavioural signs of fear, greed, FOMO and revenge trading, and apply pre-set circuit breakers before they cause damage.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Emotions are not the enemy. They are information. Fear tells you something feels risky; excitement tells you something feels like an opportunity. The trouble is that in fast markets these signals tend to peak *after* price has already moved, so acting on them puts you late — buying near highs and selling near lows.

Four emotional states cause most of the damage for intraday traders:

- **Fear** — hesitating on valid setups, exiting good trades on noise, not taking the next trade after a loss.
- **Greed** — oversizing, removing targets, holding for "just a bit more".
- **FOMO (fear of missing out)** — chasing a move that has already run, entering without a setup because others are making money.
- **Revenge trading** — trading to "win back" a loss, usually bigger and faster, with lower-quality setups.

An analogy: driving angry. You are the same driver with the same car, but you take risks you would never take calmly. The answer is not to never get angry; it is to have a rule that you pull over.` },
      { h: 'Intermediate view', md: `**Learn your own warning signs.** Emotional states show up in the body and in behaviour before you consciously name them. Common signs traders report:

| State | Physical / behavioural signs | Typical damaging action |
|---|---|---|
| Fear | Tight chest, refreshing P&L every few seconds, hand hovering over exit | Closing at breakeven just before the move works |
| Greed | Euphoria, mentally spending the profit | Cancelling the target, adding size at extension |
| FOMO | Urgency, "it's leaving without me" | Market order into a vertical candle far from VWAP |
| Revenge | Anger, jaw clenching, talking to the screen | Immediate re-entry, larger size, often opposite direction |

**Circuit breakers** are rules decided in advance that stop trading when a damaging state is likely:

1. **Daily loss limit** — for example 2R or 1.5% of capital. Hit it and you stop for the day. No exceptions.
2. **Consecutive-loss rule** — after two or three losses in a row, a mandatory 15-minute break away from the screen, then half size.
3. **Distance-from-reference rule for FOMO** — no entry if price is more than, say, 1 ATR (5-minute) from VWAP or your trigger level.
4. **Re-entry cool-down** — no new trade within 5 minutes of a stop-out on the same instrument.
5. **Size freeze** — size is fixed at the start of the day and cannot be increased intraday.

**How to execute.** Write these on a card next to your screen and set the daily limit in your broker as a hard limit if your broker offers one. Many Indian brokers offer a kill switch that disables trading in a segment for the day (verify the feature with your broker).` },
      { h: 'Advanced view', md: `**Emotion follows exposure.** The size of your position relative to your account is the biggest driver of emotional intensity. If a 1-lot Nifty trade makes your heart race, your size is too large *for you* even if the maths says it is affordable. A practical test: you should be able to calmly describe your stop and target out loud while in the trade.

**The tilt cycle.** Poker players call the emotionally compromised state "tilt". In trading it typically runs: loss → feeling of injustice ("the market hunted my stop") → urgency to recover → bigger size, weaker setups → bigger loss → despair or more aggression. Each stage reduces decision quality. The earlier you break the cycle, the cheaper it is. That is why consecutive-loss rules work better than end-of-day reflection alone.

**FOMO is often a planning failure.** If you feel FOMO, ask: "Was this setup in my plan?" If yes, why were you not ready with an alert and an order? If no, it is not your trade. Some traders keep a "missed trades" log; reviewing it calmly often shows that many chased moves would have reversed.

**Fear after drawdowns.** After a losing streak, some traders stop taking valid signals and only take the ones they feel "sure" about — which are often not the best ones. The fix is reducing size (so fear drops) while keeping the *rules* the same.

> [!warn] Managing emotions keeps you executing your plan. It does not guarantee profit. A calm trader can still lose if the method has no edge or if market conditions change.` },
      { h: 'The maths', md: `Why revenge trading is so destructive: losses compound against you, and recovery needs a larger percentage gain.

:::formula
Gain needed to recover = Loss ÷ (1 − Loss)
:::

Start with ₹5,00,000. Normal risk is 1% (₹5,000) per trade.

- Trade 1 loses 1% → ₹4,95,000.
- Angry, you risk 3% to "get it back" and lose ₹14,850 → ₹4,80,150.
- You then risk 5% and lose ₹24,008 → ₹4,56,142.

Total drawdown = 8.8%. Gain needed to recover = 0.088 ÷ 0.912 ≈ **9.6%**. At your normal 1% risk and an illustrative expectancy of +0.3R, that is roughly 32 trades of average performance just to get back to start. Three angry trades cost weeks.

[[widget:drawdown]]` },
      { h: 'India', md: `> [!india] Expiry days on Nifty weekly options (Tuesday as of Nov 2026 — verify current expiry days on NSE) are a classic FOMO trigger: cheap out-of-the-money options can multiply in minutes. Watching a ₹4 option become ₹40 creates intense urgency, yet most far out-of-the-money options expire worthless. A FOMO rule for expiry days: no new option buys after a fixed time, and no buying options whose premium has already multiplied intraday.

Many Indian brokers provide a daily kill switch and loss-limit features; using them on a day you have hit your limit is one of the simplest protective actions available. Check your broker's documentation.` },
      { h: 'Common misconceptions', md: `- **"Good traders feel nothing."** They feel plenty; they have rules that act before feelings do.
- **"I'll stop after one more trade."** The decision to stop must be made before the day starts, not when you are already tilted.
- **"Revenge trading is only about anger."** It is also about shame and needing to feel competent again.
- **"FOMO means I'm reading the market well."** Usually it means the move has already happened and you are late.` },
      { h: 'When it fails', md: `Circuit breakers fail when they are soft. Example: your daily limit is ₹6,000 but it is "mental". You lose ₹5,800 by 11:30. You tell yourself one small trade is fine. It loses ₹2,200. Now you are over the limit, and the shame makes the next trade bigger. By 14:00 the day is −₹19,000.

Countermeasures also fail when life stress is high — poor sleep, family or money pressure. On such days the realistic adjustment is to trade at reduced size or not at all. Rules cannot fix a person who is not in a state to follow them; they can only tell you to step away. Put the limit in the broker system so that the decision is not yours to make in the moment.` },
      { h: 'Exercise', md: `1. Write your personal circuit-breaker card: daily loss limit (in ₹ and R), consecutive-loss rule, re-entry cool-down, FOMO distance rule.
2. In the simulator, trade one session and log your emotional state (1–5 for fear, greed, urgency) before every entry.
3. After the session, compare your three worst trades with your emotional scores.

**Journal prompts:**
- "What did my body feel like in the 60 seconds before my worst trade today?"
- "Was my last entry in my written plan, or was I reacting to a candle?"
- "If a friend showed me this trade, what would I tell them?"

Use the drawdown calculator to see the recovery cost of your worst day.` },
    ],
    check: [
      { q: 'You have just been stopped out twice in 20 minutes and feel an urge to re-enter immediately with double size. What does a well-designed rule set say?', o: ['Re-enter now; the move is due', 'Switch to options for more leverage', 'Take the mandatory break, then return at reduced size only if a planned setup appears', 'Remove stops to avoid being stopped out again'], a: 2, why: 'This is the start of the tilt cycle. A pre-set consecutive-loss rule stops it cheaply. The other options increase risk exactly when decision quality is lowest.' },
      { q: 'Your account falls 20% after a series of oversized revenge trades. What percentage gain do you need to get back to the starting balance?', o: ['20%', '25%', '15%', '40%'], a: 1, why: 'Gain needed = 0.20 ÷ 0.80 = 25%. Losses need proportionally larger gains to recover.' },
      { q: 'Which is the most useful response to repeated FOMO on moves you were not ready for?', o: ['Treat it as a planning gap: set alerts and conditional orders for playbook setups, and ignore moves outside the plan', 'Use market orders so you never miss', 'Follow more tip channels', 'Trade every breakout'], a: 0, why: 'FOMO often means the setup was not prepared or was not yours. Preparation addresses the first case; the playbook filters the second.' },
    ],
    refs: ['Mark Douglas — Trading in the Zone (book)', 'Brett Steenbarger — Enhancing Trader Performance (book)', 'Jared Tendler — The Mental Game of Trading (book)', 'NSE — Investor education (nseindia.com)'],
  },

  {
    id: 'l2-process', module: 'L2-M5', level: 2, track: 'psych', title: 'Process over outcome', mins: 16,
    summary: 'Grade your trades on decision quality rather than P&L, and use process metrics to improve when short-term results are mostly noise.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Imagine a weather forecaster who says "70% chance of rain". It stays dry. Was the forecast wrong? Not necessarily — on 3 out of 10 such days it *should* stay dry. You can only judge a forecaster over many forecasts.

Trading is the same. Any single trade's outcome is heavily influenced by chance. A good decision can lose; a bad decision can win. If you judge yourself by the last trade's P&L, you will learn the wrong lessons: you will repeat lucky mistakes and abandon sound methods after normal losing streaks.

**Process over outcome** means you measure what you control — following your entry rules, sizing correctly, honouring stops, keeping your loss limit — and you let P&L be the long-run result of that process, judged over a large sample.

Professional poker players call the mistake of judging decisions by results "resulting". Avoiding it is one of the most important mental shifts a trader can make.` },
      { h: 'Intermediate view', md: `**The decision–outcome grid**

| | Good outcome | Bad outcome |
|---|---|---|
| Good decision (rules followed) | Deserved success | Bad luck — repeat this |
| Bad decision (rules broken) | Dumb luck — dangerous | Deserved loss — fix this |

The most dangerous cell is *bad decision, good outcome*, because it trains you to break rules.

**Process metrics to track every day:**
1. **Rule-adherence %** — trades where entry, stop, size and exit all followed the plan ÷ total trades.
2. **Setup-quality grade** — A/B/C against your playbook criteria, assigned *before* entry.
3. **Planned vs actual R** — did the exit match the plan? Difference reveals management errors.
4. **Trades outside the playbook** — count; target zero.
5. **Loss-limit respected** — yes/no.

**How to execute.** Before entry, record setup name, grade, entry, stop, target, size. After exit, record outcome and whether each rule was followed. At day end, compute adherence %. A day at 100% adherence and −1.5R is a successful *process* day. A day at 60% adherence and +3R is a warning.` },
      { h: 'Advanced view', md: `**Separate the strategy problem from the execution problem.** If your adherence is high and results are still poor over a large sample, the *strategy* needs work (or market conditions have changed). If adherence is low, you cannot judge the strategy at all — you have been trading a different, undocumented one. This separation is how professional desks review traders.

**Sample size matters.** With a 50% win-rate strategy, runs of six or more losses are normal over a few hundred trades. Judging a method after 15 trades is mostly reading noise. As a rule of thumb, gather at least 50–100 trades of the same setup at high adherence before drawing strong conclusions, and even then treat conclusions as provisional.

**Outcome still matters — eventually.** "Process over outcome" is not an excuse to ignore losses forever. Set a review threshold in advance: for example, if a setup shows negative expectancy after 100 adherent trades, or drawdown exceeds a pre-set level, you pause it and re-examine. Pre-committing to this threshold prevents both quitting too early and holding a broken method too long.

**Process goals reduce pressure.** A daily goal of "+₹10,000" encourages forcing trades on quiet days. A goal of "take only A-grade setups and respect every stop" can be met on any day, including days with zero trades.

> [!warn] A perfect process with a strategy that has no edge still loses. Discipline makes results interpretable; it does not make them positive.` },
      { h: 'The maths', md: `How much do short-run results vary even with a real edge? Consider a strategy with a 50% win rate, wins of +1.5R and losses of −1R. Expectancy = 0.5 × 1.5 − 0.5 × 1 = +0.25R.

Over 20 trades, the expected total is 20 × 0.25 = +5R. But the standard deviation per trade is:

:::formula
SD = √[ p(W − E)² + (1 − p)(L − E)² ]
= √[ 0.5 × (1.5 − 0.25)² + 0.5 × (−1 − 0.25)² ]
= √[ 0.5 × 1.5625 + 0.5 × 1.5625 ] = 1.25R
:::

Over 20 trades, SD of the total = 1.25 × √20 ≈ 5.6R. So a range of roughly −6R to +16R (±2 SD) is plausible, and a 20-trade losing stretch is entirely possible even with a genuine positive edge. Run the Monte Carlo simulator to see this visually.

[[widget:monte-carlo]]` },
      { h: 'India', md: `> [!india] Example process review for one Nifty futures day (1 lot = 65 units; lot size as of Jan 2026 — verify on NSE):

| Trade | Setup | Grade | Rules followed? | Result |
|---|---|---|---|---|
| 1 | Opening-range breakout long | A | Yes | −1R (₹−1,950) |
| 2 | VWAP reclaim long | A | Yes | +2R (₹+3,900) |
| 3 | "Felt like a top" short | — | No (not in playbook) | +1R (₹+1,950) |

P&L is positive, but adherence is 2/3 = 67%. Trade 3 is the most important line in the journal: it won while breaking the rules. The correct action is to log it as a violation, not to celebrate it.` },
      { h: 'Common misconceptions', md: `- **"If I made money, I did it right."** Not necessarily. Lucky rule-breaking is the most expensive habit to build.
- **"Process focus means ignoring P&L."** No — P&L is reviewed over large samples against pre-set thresholds.
- **"A few bad weeks prove my strategy is broken."** Often it is normal variance; check adherence and sample size first.
- **"Following a process guarantees profits."** It guarantees only that your results reflect your method.` },
      { h: 'When it fails', md: `Process focus fails when the "process" is vague. "Trade well and be patient" cannot be graded. Rules must be checkable: "enter only on a 5-minute close above the opening-range high with price above VWAP".

It also fails if you hide behind it. Example: a trader runs a mean-reversion setup on Bank Nifty with 95% adherence for 150 trades. Expectancy is −0.12R and drawdown keeps deepening. Saying "I followed my process" does not make the method profitable. Here the correct response is to stop, review whether conditions changed (trending regime?), and paper-test changes before risking capital again.` },
      { h: 'Exercise', md: `1. Add three fields to your journal: **setup grade (pre-entry)**, **rules followed (Y/N per rule)**, **adherence %**.
2. Simulate 20 trades in the app's simulator using one setup only. Grade each trade before entry.
3. Fill the decision–outcome grid with your 20 trades. Count the trades in each cell.
4. Run the Monte Carlo widget with your setup's win rate and R values to see the plausible range for 20 and 100 trades.

**Journal prompts:**
- "Which trade today would I be happy to repeat 100 times, regardless of its result?"
- "Which winning trade today broke a rule?"
- "What pre-set threshold will make me re-examine this setup?"` },
    ],
    check: [
      { q: 'Which of these trades is the most dangerous for long-term development?', o: ['Rules followed, lost 1R', 'Rules broken, won 2R', 'Rules followed, won 2R', 'No trade taken on a quiet day'], a: 1, why: 'A rule-breaking winner reinforces bad behaviour. A rule-following loser is normal variance, and skipping a quiet day is a valid decision.' },
      { q: 'Your rule-adherence over 60 trades is 55% and results are negative. What can you conclude about the strategy?', o: ['It is broken and should be abandoned', 'Very little — you have not actually tested it, because most trades did not follow it', 'It works, because some trades won', 'Win rate is too low'], a: 1, why: 'With low adherence you were trading a different, undocumented method. Fix execution first, then evaluate the strategy.' },
      { q: 'A strategy has expectancy +0.25R and per-trade SD of 1.25R. Over 16 trades, what is the approximate SD of the total result?', o: ['1.25R', '5R', '20R', '4R'], a: 1, why: 'SD of a sum of independent trades = SD × √n = 1.25 × 4 = 5R. That is large relative to the expected +4R, which is why short samples are noisy.' },
    ],
    refs: ['Annie Duke — Thinking in Bets (book)', 'Brett Steenbarger — The Daily Trading Coach (book)', 'Van K. Tharp — Trade Your Way to Financial Freedom (book)'],
  },
  {
    id: 'l2-routine', module: 'L2-M5', level: 2, track: 'psych', title: 'Building a pre-, during- and post-market routine', mins: 17,
    summary: 'Build a written daily routine covering preparation, in-session execution checks and post-market review that you can follow even on bad days.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `A routine is a set of steps you do the same way every day, so that good behaviour does not depend on how you feel. Athletes warm up the same way before every match; surgeons follow a checklist before every operation. The point is not ceremony — it is to reduce the number of decisions you make while under pressure.

A trading routine has three parts:

1. **Pre-market** — understand the context, decide what you will trade and what would stop you.
2. **During market** — execute the plan, check your state, enforce limits.
3. **Post-market** — record, review and decide one improvement for tomorrow.

If you trade only one hour a day, your routine might take 30 minutes before and 20 minutes after. That ratio is normal. Most of the useful work is done outside the trading window.` },
      { h: 'Intermediate view', md: `**Pre-market checklist (India example, 08:15–09:15 IST)**

1. **State check** (2 min): sleep, stress, illness. Score 1–5. Below 3 → half size or no trading.
2. **Global cues** (10 min): US close, Asian open, GIFT Nifty indication, crude, USD/INR, US 10-year yield. See [[link:l2-overnight]].
3. **Calendar** (5 min): data releases, RBI events, results of stocks you trade, expiry day.
4. **Levels** (15 min): previous day high/low/close, overnight range, weekly levels, VWAP from prior session, key round numbers.
5. **Scenarios** (10 min): write two or three "if–then" plans: "If Nifty opens above yesterday's high and holds the first 15-minute low, look for VWAP pullback longs."
6. **Risk set-up** (3 min): size per trade, daily loss limit, maximum number of trades; enter them in broker limits if available.

**During market**
- Trade only scenarios from your plan.
- Every entry: setup name, grade, stop, target logged *before* the order.
- Every hour (or after every trade): 30-second state check — urgency, frustration, fatigue.
- Hard stop on the day: loss limit, maximum trades, or a fixed end time (many intraday traders stop by 14:30–15:00 IST to avoid the last half-hour unless it is part of their plan).

**Post-market (20–30 min)**
1. Export trades; screenshot each entry and exit on the chart.
2. Grade decisions (process) separately from outcomes.
3. Write one thing done well and one thing to improve.
4. Update your statistics: adherence %, R per setup.
5. Shut down — close the platform. Rumination at night damages sleep and tomorrow's state.` },
      { h: 'Advanced view', md: `**Routines should be minimal and sustainable.** A 40-step routine is abandoned within weeks. Keep the daily core short and add a weekly deeper review (60–90 minutes): statistics by setup, by time of day, by day type, and by emotional state. Monthly, review whether market conditions (volatility regime, trend vs range) have shifted. See [[link:l4-regimes]].

**If–then planning.** Research on "implementation intentions" in psychology suggests that specific if–then plans improve follow-through compared with general goals. In trading this means rehearsing responses: "If I take two losses before 10:30, then I stop for 30 minutes and review screenshots before any new trade."

**Rehearse failure.** Before the open, spend one minute imagining your worst likely scenario — a gap against your idea, a fast stop-out — and your scripted response. This reduces the shock and the impulsive reaction when it happens.

**Separate preparation from prediction.** The pre-market plan is not a forecast. It is a set of conditional responses. Traders who write "Nifty will go up today" anchor to that view; traders who write "If X then Y; if not-X then Z" stay flexible.

> [!warn] A good routine improves consistency and reduces avoidable errors. It does not guarantee profitable days or profitable months.` },
      { h: 'India', md: `> [!india] A sample timeline for a Nifty/Bank Nifty intraday trader (times IST, NSE hours as of Nov 2026 — verify on nseindia.com):

| Time | Activity |
|---|---|
| 08:15 | State check; global cues; GIFT Nifty indication |
| 08:40 | Levels and scenarios written |
| 09:00–09:08 | Pre-open order entry; watch indicative open price |
| 09:15 | Market opens — observe first 5–15 minutes unless your setup is an opening play |
| 09:30–11:30 | Main trading window for many intraday setups |
| 11:30–13:30 | Often quieter; reduce activity or stop |
| 13:30–14:45 | Secondary window (European open around 13:30 IST in winter, 12:30 in summer) |
| 15:30 | Close; post-market review |` },
      { h: 'US & global', md: `> [!us] For a trader in India trading US stocks, the US regular session (09:30–16:00 ET) runs late evening to early morning IST: 20:00–02:30 IST in US winter (EST), 19:00–01:30 IST in US summer (EDT). Your routine must protect sleep. Many Indian traders who trade US markets focus only on the first 60–90 minutes of the US session, then stop. Trading tired is a predictable source of errors.` },
      { h: 'Common misconceptions', md: `- **"Routines are for beginners."** Professionals rely on routines more, not less.
- **"I'll review on the weekend."** Daily review while memory is fresh captures emotional context that a weekly review cannot.
- **"A plan means predicting direction."** A plan is a set of if–then responses for different scenarios.
- **"More screen time means more preparation."** Watching charts aimlessly is not preparation; written levels and scenarios are.` },
      { h: 'When it fails', md: `Routines fail when they are skipped on the days you need them most. A realistic case: you oversleep, skip the pre-market steps, see Bank Nifty gap up 300 points and buy at 09:16 without levels or a stop plan. The gap fades, you are down ₹4,500 (1 lot = 30 units, 150 points) before 09:30, and the rest of the day is spent trying to recover.

The countermeasure is a rule: **no routine, no trade**. If the pre-market steps are not done, the first hour is observation only. Routines also fail when they grow too long; trim to what you actually use.` },
      { h: 'Exercise', md: `1. Write your three-part routine on one page: pre-market (≤8 steps), during (≤5 rules), post-market (≤5 steps).
2. Use it for five simulator sessions. Tick each step daily.
3. At the end of the week, note which steps you skipped and why. Remove or simplify those steps.

**Journal prompts:**
- "What did my pre-market plan say, and did I trade it or something else?"
- "What was my state score this morning, and did I adjust size accordingly?"
- "What is the one change I will make tomorrow?"` },
    ],
    check: [
      { q: 'Your pre-market state score is 2/5 after poor sleep. What does a well-built routine prescribe?', o: ['Trade normally — feelings do not matter', 'Reduce size or skip trading, as pre-committed in your routine', 'Trade larger to finish early', 'Skip the stop-loss to avoid being shaken out'], a: 1, why: 'The state check exists to adjust risk on impaired days. The other options increase risk when decision quality is low.' },
      { q: 'Which pre-market note is the most useful?', o: ['"Nifty will rally today."', '"If Nifty holds above yesterday\'s high after the first 15 minutes, look for VWAP pullback longs; if it falls back below, no longs before 10:30."', '"Be disciplined."', '"Watch the market closely."'], a: 1, why: 'A conditional, checkable plan supports execution without anchoring you to a forecast. The others are a prediction or are too vague to act on.' },
    ],
    refs: ['Brett Steenbarger — The Daily Trading Coach (book)', 'Atul Gawande — The Checklist Manifesto (book)', 'Peter Gollwitzer — Implementation intentions (American Psychologist, 1999)', 'NSE — Market timings (nseindia.com)'],
  },

  /* ============================ L2-M6 US market essentials ============================ */
  {
    id: 'l2-us-structure', module: 'L2-M6', level: 2, track: 'us', title: 'US market structure: exchanges, NBBO, dark pools and PFOF', mins: 20,
    summary: 'Explain how a US stock order is routed across many exchanges, wholesalers and dark pools, and what the NBBO and payment for order flow mean for your fills.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `In India, almost all equity intraday volume happens on two exchanges, NSE and BSE, and NSE dominates derivatives. The US is very different. A single stock such as Apple trades at the same moment on more than a dozen registered exchanges (NYSE, Nasdaq, Cboe venues, IEX, MIAX Pearl, MEMX and others), on dozens of **alternative trading systems** (many of them "dark pools"), and inside **wholesale market makers** that fill retail orders directly.

Think of it like buying a phone. In India you mostly go to one big shop. In the US there are many shops on the same street, all displaying prices. A rule says your broker must not sell you the phone at a worse price than the best price displayed in any shop on the street at that moment. That best displayed price is the **NBBO** — the National Best Bid and Offer.

Why it matters for you: your order may not be filled where you think. The quality of a fill (did you get the NBBO, better, or worse?) depends on how your broker routes orders and on what your broker gets paid to route them.` },
      { h: 'Intermediate view', md: `**Key building blocks**

| Term | What it is | Why it matters intraday |
|---|---|---|
| Exchange | Registered national securities exchange with a public (lit) order book | Displayed quotes feed the NBBO |
| NBBO | Highest displayed bid and lowest displayed offer across all exchanges, computed by the SIPs (securities information processors) | Benchmark for "best execution" |
| ATS / dark pool | Privately operated trading venue that does not display orders publicly | Large orders can trade without showing size; prints appear on the tape after the fact via a FINRA trade reporting facility |
| Wholesaler | Market-making firm that buys retail orders from brokers and fills them internally | Most US retail marketable orders are filled here, not on an exchange |
| PFOF | Payment for order flow — the wholesaler pays the broker for routing orders to it | Supports "zero-commission" models; creates a potential conflict of interest |

**Reg NMS** (Regulation National Market System, adopted 2005) is the rulebook that knits this together. Its main parts:
- **Order Protection Rule (Rule 611)** — trading centres must have policies to prevent "trade-throughs", i.e. executing at a worse price than a protected displayed quote on another exchange.
- **Access Rule (Rule 610)** — fair access to quotes and a cap on exchange access fees.
- **Sub-Penny Rule (Rule 612)** — limits quoting increments (one cent for stocks priced at $1 or more, with recent SEC amendments allowing half-cent ticks for some tightly quoted stocks — verify current status on sec.gov).
- **Market data rules** — how consolidated quotes and trades are distributed.

**How a retail market order typically flows:** you click buy → broker routes to a wholesaler → wholesaler fills you at or inside the NBBO, often with a small "price improvement" → the trade is reported to the tape through a FINRA facility. Limit orders that cannot fill immediately are often sent on to an exchange to rest in the book.` },
      { h: 'Advanced view', md: `**Price improvement versus the counterfactual.** Wholesalers usually report price improvement relative to the NBBO. Critics argue that, without PFOF, more retail orders would interact on exchanges and could get better prices still; supporters argue retail gets fills at or inside the NBBO with low costs. Evidence is genuinely mixed and model-dependent.

> [!evidence] Whether PFOF helps or hurts retail traders on net is an empirical-mixed question. Different studies reach different conclusions depending on how they measure execution quality. Treat any single claim with caution.

**Disclosure.** Brokers publish order-routing reports under SEC **Rule 606**, showing where they send orders and what PFOF they receive. Market centres publish execution-quality statistics under **Rule 605** (amended by the SEC in 2024 to broaden coverage — verify compliance dates on sec.gov). Reading these tells you more about your broker than marketing does.

**Dark pools and the tape.** Off-exchange prints appear on your time & sales with an exchange code indicating a FINRA trade reporting facility. A large dark print is *not* proof of institutional direction: it could be a hedge, an agency cross or one leg of a complex trade. Institutional jargon is not proof of institutional intent.

**Fragmentation effects intraday:**
- The visible book on any one exchange shows only part of the liquidity. Level 2 aggregates many venues but excludes dark liquidity.
- Hidden and midpoint orders on exchanges mean real size can be larger than displayed.
- Intermarket sweep orders (ISOs) let fast participants take liquidity on several venues at once, which is why a level can disappear in milliseconds.

**Policy is moving.** The SEC proposed several market-structure changes in 2022 (including an order-competition rule); some proposals were later withdrawn (verify the current status on sec.gov). Always date your knowledge.` },
      { h: 'The maths', md: `**Price improvement and spread cost**

:::formula
Effective spread = 2 × |Execution price − Midpoint at order time|
Price improvement per share = Offer − Execution price (for a buy)
:::

Example: NBBO for a stock is $50.00 × $50.04 (midpoint $50.02). You buy 300 shares with a market order and are filled at $50.035.
- Price improvement = $50.04 − $50.035 = $0.005 per share → $1.50 total.
- Effective spread = 2 × ($50.035 − $50.02) = $0.03, versus the quoted spread of $0.04.

If you trade 40 round trips a month at that size, a half-cent per share on each side is 300 × 0.005 × 2 × 40 = $120 a month — small for one trade, meaningful over a year for a small account. Model your own costs:

[[widget:charges-us]]` },
      { h: 'India', md: `> [!india] Contrast with India: NSE runs a single central limit order book for each instrument, with price-time priority, and the vast majority of intraday cash and F&O volume happens there. There is no PFOF model and no dark pools in Indian equities. Brokers charge brokerage plus statutory charges (STT, exchange transaction charges, SEBI fee, GST, stamp duty). In the US, "zero commission" does not mean zero cost — the cost is partly in the spread and routing.` },
      { h: 'Common misconceptions', md: `- **"Zero commission means free trading."** You still pay the spread, and routing choices affect your fill.
- **"Dark pools are where institutions hide manipulation."** They are regulated ATSs that file with the SEC (Form ATS-N) and report trades to FINRA. Misconduct cases exist, but the venue type itself is legal and supervised.
- **"Level 2 shows all available liquidity."** It shows displayed exchange quotes only; hidden, midpoint and dark liquidity are invisible.
- **"A big dark-pool print means smart money is buying."** You cannot know the direction or purpose from the print.` },
      { h: 'When it fails', md: `Market orders in thin names fail badly. Example: a small-cap stock shows $4.10 × $4.15 with only 300 shares displayed on the offer. You send a market order for 5,000 shares in a fast premarket move. Your order sweeps several venues and fills at an average of $4.26 — $0.11 above the displayed offer, or $550 of slippage before the trade has even started. The NBBO protects you only against trade-throughs of *displayed* size at that instant; it does not guarantee size. Use limit orders, especially outside regular hours.` },
      { h: 'Exercise', md: `1. Open your broker's Rule 606 report (if you have a US broker) and note the top three venues for market orders and any PFOF disclosed.
2. In the app's chart lab, open [[chart:SPY:17:vwap,vol]] and compare candle wicks with volume. Note how large one-bar spikes occur in thin periods.
3. Use the US charges calculator to compare a "zero-commission" broker with a per-share commission broker for your typical size, including an assumed half-cent of effective spread.

**Journal prompt:** "For my last five US trades, what was my fill compared with the midpoint at the time of the order?"` },
    ],
    check: [
      { q: 'The NBBO for a stock is $20.00 × $20.02. A broker fills your market buy at $20.015. What happened?', o: ['A trade-through violation', 'Price improvement of $0.005 per share relative to the offer', 'You paid above the NBBO', 'The order went to an exchange auction'], a: 1, why: 'Filling below the offer is price improvement. A trade-through would be a fill worse than a protected displayed quote, which did not happen here.' },
      { q: 'Which statement about payment for order flow is most accurate?', o: ['It is illegal in the US', 'It guarantees the best possible price', 'It is legal with disclosure (Rule 606), and its net effect on retail execution quality is debated', 'It only applies to options and not to stocks'], a: 2, why: 'PFOF is legal in the US with routing disclosure. Its overall effect on retail traders is empirically contested. It applies to both equities and options.' },
      { q: 'You see a 500,000-share print on time & sales reported through a FINRA trade reporting facility. What can you safely conclude?', o: ['An institution is aggressively buying', 'A trade occurred off-exchange; direction and purpose are unknown', 'The stock will rise', 'It is a cancelled trade'], a: 1, why: 'Off-exchange prints do not reveal who initiated them or why. Inferring intent is speculation.' },
    ],
    refs: ['SEC — Regulation NMS (sec.gov)', 'SEC — Rule 605 and Rule 606 disclosures (sec.gov)', 'FINRA — OTC Transparency / ATS data (finra.org)', 'Larry Harris — Trading and Exchanges: Market Microstructure for Practitioners (book)', 'NSE — Trading system overview (nseindia.com)'],
  },
  {
    id: 'l2-us-sessions', module: 'L2-M6', level: 2, track: 'us', title: 'Premarket, regular and after-hours trading', mins: 17,
    summary: 'Know the US session times in ET and IST, how liquidity and risk differ in extended hours, and how to trade them with limit orders and reduced size.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `US stocks have a **regular session** from 09:30 to 16:00 Eastern Time (ET). Around it are **extended hours**: a premarket session in the early morning and an after-hours session in the evening. Many brokers now also offer overnight trading in some stocks through alternative trading systems.

Extended hours look like normal trading on a chart, but they are not. Fewer participants are active, spreads are wider and prices can jump on small orders. It is like a shop that opens early with one cashier: you can buy, but the queue and prices are less predictable.

Important news — company earnings, many economic data releases — often comes out *outside* regular hours, so the biggest moves frequently start in premarket or after hours. That is why you need to understand them even if you never trade them.` },
      { h: 'Intermediate view', md: `**Session map** (times as of Nov 2026; exact windows vary by exchange and broker — verify with your broker):

| Session | ET | IST when US is on EST (Nov–Mar) | IST when US is on EDT (Mar–Nov) |
|---|---|---|---|
| Premarket (major exchanges) | 04:00–09:30 | 14:30–20:00 | 13:30–19:00 |
| Regular | 09:30–16:00 | 20:00–02:30 | 19:00–01:30 |
| After-hours | 16:00–20:00 | 02:30–06:30 | 01:30–05:30 |
| Overnight (some brokers, via ATSs) | ~20:00–04:00 | varies | varies |

US daylight saving time begins on the second Sunday of March and ends on the first Sunday of November. India does not use daylight saving, so the IST timings shift by one hour twice a year.

**Auctions.** The regular session opens and closes with auctions (Nasdaq Opening and Closing Cross; NYSE opening and closing auctions). The closing auction is often one of the largest single liquidity events of the day because index funds and many institutions trade at the close. Market-on-close order cut-offs are a few minutes before 16:00 ET (verify exchange rules).

**How extended-hours trading behaves:**
- Spreads are wider and displayed size is thin.
- Many brokers accept only limit orders in extended hours; stop orders may not trigger.
- Prices can be far from where the regular session opens.
- Volume concentrates in stocks with news (earnings, guidance, mergers).

**Execution rules for extended hours:**
1. Limit orders only, priced with a deliberate tolerance.
2. Half or quarter of normal size.
3. Stops are often not honoured by the system — you must monitor manually or not trade.
4. Know your broker's session windows and which orders carry over.` },
      { h: 'Advanced view', md: `**Premarket levels as reference.** Premarket high and low often act as reference points after the open, in a similar way to the opening range. Some traders mark premarket high/low, the prior close and the overnight VWAP. Their usefulness is empirical-mixed: in thin premarket trading a level may be set by a handful of trades.

**Earnings gaps.** A stock reports after the close and moves 8% after hours. The overnight move reflects a small number of participants. At the 09:30 open, the full market arrives; the gap can extend or fade. Professionals often wait for the first 5–30 minutes to see whether the gap is accepted (holds above key levels with volume) or rejected.

**Regulatory protections differ.** Limit Up–Limit Down (LULD) bands, which pause trading in a stock after rapid moves, apply during regular hours; the market-wide circuit breakers based on the S&P 500 (7%, 13% and 20% declines) apply during regular hours as well. Extended-hours trading has fewer of these protections (verify current rules on sec.gov and exchange sites).

**Twenty-four-hour trading.** Several venues and brokers have launched or announced near round-the-clock trading in US stocks (verify current availability). For a trader in India this is tempting, but overnight liquidity is thin and fills can be poor.

> [!warn] Trading extended hours increases slippage and gap risk. Knowing the sessions improves preparation; it does not create an edge.` },
      { h: 'The maths', md: `**Spread cost is proportional to how often you cross it.**

:::formula
Round-trip spread cost = Shares × Spread (if you buy at the offer and sell at the bid)
Cost in R = Round-trip spread cost ÷ Planned risk
:::

Regular hours: stock quoted $80.00 × $80.02. Premarket: $79.85 × $80.15.

You plan to risk $0.40 per share on 250 shares (planned risk = $100).
- Regular hours round-trip spread cost = 250 × $0.02 = $5 → 0.05R.
- Premarket round-trip spread cost = 250 × $0.30 = $75 → 0.75R.

In premarket, three-quarters of your risk is consumed by the spread before price moves. That is the core reason to cut size or avoid extended hours.` },
      { h: 'India', md: `> [!india] For a trader based in India, the US regular session runs 20:00–02:30 IST in US winter and 19:00–01:30 IST in US summer. The first hour of the US session (20:00–21:00 IST in winter) often carries the most volume and range, which is convenient. Trading after midnight while also trading NSE at 09:15 the next morning is a reliable way to accumulate fatigue errors. Pick one market for active trading per day.

Indian markets have no equivalent of US extended-hours stock trading. NSE has a pre-open call auction (09:00–09:08 order entry) and a closing session; GIFT Nifty on NSE IX trades for much longer hours. See [[link:l2-overnight]].` },
      { h: 'Common misconceptions', md: `- **"A premarket high is a strong level because it is on the chart."** It may be set by a few hundred shares.
- **"My stop protects me after hours."** Many brokers do not trigger stops outside regular hours.
- **"After-hours moves always continue at the open."** They can extend or fade; acceptance is unknown until the full market arrives.
- **"US hours in IST are fixed."** They shift with US daylight saving time.` },
      { h: 'When it fails', md: `Example: a stock reports earnings at 16:05 ET and jumps from $120 to $131 after hours. You buy 100 shares at $130.80 using a limit order at 21:30 ET. Overnight, the earnings call reveals weak guidance. At 08:00 ET premarket the stock trades $122. Your stop at $128 never triggered because your broker does not process stops outside regular hours, and there were no bids near your stop anyway. You are down $880 before the regular session opens. Thin liquidity plus news risk turned a planned $280 loss into a much larger one.` },
      { h: 'Exercise', md: `1. Write the US session times in IST for both EST and EDT in your routine notes.
2. Use [[chart:NVDA:23:vwap,vol]] in the chart lab and mark where volume is thinnest. Imagine the same chart in premarket with spreads ten times wider.
3. With the R:R calculator, compute how much of your risk a $0.20 spread consumes on your typical size.

[[widget:rr]]

**Journal prompt:** "If I trade extended hours, what are my reduced size and order rules, and have I confirmed how my broker handles stops?"` },
    ],
    check: [
      { q: 'In December, what is the US regular session in IST?', o: ['19:00–01:30', '20:00–02:30', '18:30–01:00', '21:00–03:30'], a: 1, why: 'In December the US is on EST (UTC−5); IST is UTC+5:30, a 10.5-hour difference. 09:30 ET = 20:00 IST.' },
      { q: 'You plan a $150 risk on 300 shares. In premarket the spread is $0.25. Roughly what fraction of your risk does a round-trip spread cost consume?', o: ['10%', '25%', '50%', '100%'], a: 2, why: 'Round-trip spread cost = 300 × 0.25 = $75, which is 50% of the $150 planned risk.' },
      { q: 'Which is the most appropriate practice for extended-hours trading?', o: ['Market orders for speed', 'Normal size because news drives volume', 'Limit orders, reduced size, and confirming how the broker handles stops', 'Rely on LULD bands for protection'], a: 2, why: 'Thin liquidity, wide spreads, unprocessed stops and fewer protections all call for limits and smaller size.' },
    ],
    refs: ['Nasdaq — Trading hours and Opening/Closing Cross (nasdaq.com)', 'NYSE — Auctions (nyse.com)', 'SEC — Investor Bulletin: Extended-hours trading (investor.gov)', 'SEC — Limit Up–Limit Down and market-wide circuit breakers (sec.gov)'],
  },
  {
    id: 'l2-us-rules', module: 'L2-M6', level: 2, track: 'us', title: 'SEC, FINRA and the end of the PDT rule', mins: 18,
    summary: 'Understand who regulates US trading, what the pattern-day-trader rule was, what changed in 2026, and how settlement and options exercise affect intraday traders.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Two organisations matter most to a US retail trader:

- **SEC (Securities and Exchange Commission)** — the federal regulator. It writes and approves market rules, oversees exchanges and brokers, and enforces securities law.
- **FINRA (Financial Industry Regulatory Authority)** — a self-regulatory organisation that supervises broker-dealers under SEC oversight. FINRA writes many of the day-to-day rules brokers must follow, including margin rules.

Futures are separate: they are regulated by the **CFTC** with the **NFA** as the self-regulatory body. Options on stocks fall under the SEC; options and futures on indices traded on futures exchanges fall under the CFTC.

For decades, the rule that small US traders talked about most was the **pattern-day-trader (PDT) rule**. It forced margin-account traders who day-traded frequently to keep at least $25,000 in equity. In April 2026 the SEC approved FINRA's proposal to remove the PDT definition and the $25,000 minimum, replacing it with risk-based intraday margin standards. When this applies to *your* account depends on your broker.` },
      { h: 'Intermediate view', md: `**The old PDT rule (for context)**
- A "day trade" = opening and closing the same security on the same day in a margin account.
- Four or more day trades within five business days (and more than 6% of trades) flagged you as a pattern day trader.
- PDTs had to maintain $25,000 minimum equity; below that, day trading was restricted.
- Many small traders worked around it with cash accounts, multiple brokers or offshore brokers.

**What changed in 2026**
> [!us] As of Nov 2026: the SEC approved (April 2026) FINRA's proposal to eliminate the pattern-day-trader definition and the $25,000 minimum equity requirement, replacing them with risk-based intraday margin standards. Broker implementation timing and the exact margin each broker applies vary — verify on finra.org, sec.gov and with your broker.

What does *not* change automatically:
- Brokers can still set **house rules** stricter than FINRA minimums.
- **Intraday margin** still applies — your broker calculates how much exposure you can hold during the day and can liquidate positions if equity falls short.
- **Reg T** initial margin (generally 50% for overnight stock positions) and maintenance requirements still govern overnight holdings (verify current rules).
- **Cash accounts** are still limited by settlement: you cannot repeatedly buy with unsettled sale proceeds without risking good-faith or free-riding violations.

**Settlement**
- US equities settle **T+1** (since May 2024).
- Listed options trades settle **T+1** for premium.
- Exercise and assignment of equity options settle as stock trades (T+1 after exercise).` },
      { h: 'Advanced view', md: `**Options exercise and assignment.** US single-stock options are American-style (exercisable any time) and **physically settled** — exercise delivers shares. Most broad index options such as SPX are European-style and **cash-settled**. This matters intraday:

- If you are short an in-the-money stock call near expiry, you can be assigned and end up short 100 shares per contract overnight, exposed to any after-hours news.
- Options that are in the money by a small amount at expiry are generally auto-exercised by the clearing house (OCC) under its exercise-by-exception threshold unless instructed otherwise (verify current thresholds on theocc.com).
- Index options with daily expiries (zero-days-to-expiry, or 0DTE) have become popular. They carry very high gamma: small index moves cause large percentage changes in premium.

**Removing PDT does not remove risk.** The $25,000 rule was a blunt filter. Its removal means small accounts can day-trade more often — which also means they can lose faster. Risk-based intraday margin means your broker can still cut your buying power or liquidate positions in volatile moves. Some brokers may impose stricter limits on volatile or low-priced stocks.

**Enforcement environment.** The SEC and FINRA bring actions for fraud, manipulation (for example pump-and-dump schemes in small caps), misleading promotion and broker failures. For a retail trader the practical lessons are: be sceptical of promoted small caps, and know your broker is a FINRA member (check BrokerCheck).

> [!warn] Easier access to day trading is not evidence that day trading is profitable. More trades at small size, with costs and spreads, can mean faster losses.` },
      { h: 'The maths', md: `**Intraday buying power and liquidation risk** (illustrative — your broker's risk-based model will differ).

Suppose your broker grants intraday leverage of 4× on a liquid stock and you have $8,000 equity.

:::formula
Max intraday exposure = Equity × Leverage = 8,000 × 4 = $32,000
:::

You buy $32,000 of a stock. A 2% adverse move costs $640 — 8% of your equity. If the broker requires equity to stay above 25% of exposure:

:::formula
Liquidation when Equity ÷ Exposure < 25%
(8,000 − L) ÷ (32,000 − L) = 0.25 → L ≈ 0
:::

At maximum leverage you are already at the edge: almost any loss triggers a margin call. Using a fraction of available leverage keeps you in control. Explore with the leverage widget:

[[widget:leverage]]` },
      { h: 'India', md: `> [!india] For Indian residents: buying US stocks is generally done under the RBI's Liberalised Remittance Scheme (LRS). LRS rules do not permit remittances for margin trading or margin calls to overseas exchanges or counterparties, and Indian residents generally cannot use LRS for leveraged overseas derivatives (as of Nov 2026 — verify the current LRS master direction on rbi.org.in and consult a qualified adviser). Tax collected at source on LRS remittances above a threshold and Indian tax on foreign gains also apply (verify current rates). So the PDT change mainly matters to US-resident traders and to Indians with lawful US-resident accounts; it does not create a new route for Indian residents to day-trade on US margin.` },
      { h: 'Common misconceptions', md: `- **"PDT removal means unlimited day trading for small accounts."** Brokers still apply intraday margin, house rules and liquidation policies.
- **"The SEC and FINRA are the same."** The SEC is the federal regulator; FINRA is the broker-dealer self-regulator under SEC oversight.
- **"Options always settle in cash."** US single-stock options are physically settled; SPX-style index options are cash-settled.
- **"Cash accounts have no restrictions."** You must trade with settled funds to avoid good-faith or free-riding violations.` },
      { h: 'When it fails', md: `Example: a trader with a $6,000 account, freshly free of PDT limits, makes 12 day trades in a week in a volatile small cap, each using near-maximum intraday buying power. A halt-and-gap move causes a 7% drop in one minute after LULD resumes trading. The broker liquidates at the worst point. The account loses $1,700 in one trade — 28% — even though the trader had set a mental stop at 2%. Regulation changed; market risk did not.` },
      { h: 'Exercise', md: `1. Write down, for your broker (or a broker you are considering): its current intraday margin policy, how it treats low-priced stocks, and whether it has implemented the post-PDT framework yet.
2. In the leverage widget, compare 1×, 2× and 4× exposure for an 8% intraday move.
3. In the options payoff widget, model being short one at-the-money call at expiry and note the overnight share exposure if assigned.

[[widget:options-payoff]]

**Journal prompt:** "Am I trading more often because I have a better edge, or because the rules now let me?"` },
    ],
    check: [
      { q: 'After the April 2026 SEC approval, what is the most accurate statement for a small US margin account?', o: ['Day trading is now unlimited at every broker immediately', 'The $25,000 PDT minimum is being replaced by risk-based intraday margin; timing and limits depend on each broker', 'FINRA abolished all margin requirements', 'Only cash accounts can day trade'], a: 1, why: 'The SEC approved removal of the PDT definition and minimum, replaced by risk-based intraday margin, with broker implementation varying. Margin rules and house rules still apply.' },
      { q: 'You are short one in-the-money AAPL call at expiry and do not close it. What is the likely result?', o: ['It expires worthless', 'You are assigned and are short 100 shares, physically settled', 'You receive cash settlement only', 'Nothing until the next month'], a: 1, why: 'US single-stock options are physically settled; in-the-money options are generally exercised at expiry, so the short call holder is assigned 100 shares short.' },
      { q: 'Who is the primary regulator for US futures trading?', o: ['FINRA', 'SEC', 'CFTC (with the NFA as self-regulatory body)', 'Federal Reserve'], a: 2, why: 'Futures and options on futures are regulated by the CFTC, with the NFA as the self-regulatory organisation.' },
    ],
    refs: ['FINRA — Rule 4210 Margin Requirements (finra.org)', 'SEC — Release approving FINRA pattern day trading amendments, 2026 (sec.gov)', 'OCC — Exercise and assignment (theocc.com)', 'SEC — T+1 settlement (sec.gov)', 'RBI — Master Direction: Liberalised Remittance Scheme (rbi.org.in)'],
  },

  {
    id: 'l2-us-vs-india', module: 'L2-M6', level: 2, track: 'us', title: 'US vs India: what changes for an intraday trader', mins: 16,
    summary: 'Compare the practical differences between US and Indian intraday trading — structure, products, costs, hours, settlement, tax and access — and adapt your process accordingly.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `If you learned to trade on NSE and then look at US markets, many things look familiar — candles, VWAP, order books. Underneath, a lot is different: who you trade against, how orders are routed, what products are popular, when the market is open, how you are charged and what you are legally allowed to do as an Indian resident.

The biggest shift in thinking: in India, most intraday speculation is concentrated in **index derivatives** (especially Nifty options). In the US, intraday activity is spread across thousands of **individual stocks and ETFs**, plus stock and index options and futures. You choose from a far larger universe, which is both an opportunity and a trap.` },
      { h: 'Intermediate view', md: `| Feature | India (NSE) | US |
|---|---|---|
| Venue structure | One dominant exchange per segment; central order book | 15+ exchanges, many ATSs and wholesalers; NBBO links them |
| Main intraday products | Index options and futures, stock futures, cash intraday (MIS) | Stocks, ETFs, stock options, index options (SPX, 0DTE), futures (ES, NQ) on CME |
| Regular hours | 09:15–15:30 IST | 09:30–16:00 ET (20:00–02:30 or 19:00–01:30 IST) |
| Extended hours | Pre-open auction only for equities | Premarket, after-hours, some overnight trading |
| Tick size | ₹0.05 for most stocks and index derivatives (verify per instrument) | $0.01 for most stocks ≥ $1 (some half-cent ticks — verify) |
| Price bands | Stock-specific circuit bands; F&O stocks dynamic bands | LULD pauses; market-wide circuit breakers on S&P 500 |
| Settlement | T+1 for equities (optional T+0 for some stocks — verify) | T+1 for equities and option premiums |
| Option style | Index and stock options European; stock options physically settled | Stock options American and physically settled; SPX European cash-settled |
| Costs | Brokerage + STT + exchange charges + SEBI fee + GST + stamp duty | Commission (often zero) + small regulatory fees + spread/PFOF effects |
| Day-trading rule | No PDT; intraday leverage capped by SEBI peak-margin rules | PDT being replaced by risk-based intraday margin (2026, broker timing varies) |
| Short selling | Intraday shorts in cash allowed; overnight via SLB or futures | Requires a borrow ("locate"); hard-to-borrow fees; SSR (Rule 201) on sharp falls |

**Short-sale restriction (SSR).** In the US, when a stock falls 10% or more from the prior close, Rule 201 restricts short sales to prices above the national best bid for the rest of that day and the next. This changes how breakdowns trade.` },
      { h: 'Advanced view', md: `**Liquidity selection.** On NSE, you can trade the most liquid instrument in the country (Nifty options) and know depth is there. In the US you must actively filter: average daily volume, spread as a percentage of price, float and whether the stock is in play (news, earnings). Many US day traders scan for "stocks in play" each morning, which is a different routine from watching one index.

**Leverage differences.** SEBI's margin framework requires upfront margin collection and caps intraday leverage in cash equities (broadly, margins are tied to VaR-based requirements — verify with your broker). US intraday leverage depends on the broker's risk model and is moving to risk-based standards. Different leverage changes how a "1% stop" translates into account risk.

**Option market culture.** Indian retail option activity concentrates in weekly index options on expiry days. US retail activity includes single-stock options around earnings and 0DTE SPX options. Both carry heavy gamma risk close to expiry; neither is a shortcut.

**Taxes and reporting.** In India, intraday equity gains are generally speculative business income and F&O is non-speculative business income for tax (verify with a tax adviser). For an Indian resident trading US stocks, foreign income and foreign-asset disclosure in the Indian return apply; the US generally withholds tax on dividends to non-residents, not on capital gains for most non-residents (verify). This is not tax advice.

**Access for Indian residents.** Investing in US stocks via LRS is permitted; leveraged overseas trading is restricted (verify current RBI rules). Many apps offering "US trading" to Indians are intermediaries; check who the actual US broker is, whether it is a FINRA/SIPC member, and how your money is held.` },
      { h: 'The maths', md: `**Same idea, different cost structure** (illustrative; verify current charges with your broker).

India — Nifty futures, 1 lot (65 units) bought and sold intraday at 25,000 → 25,040:
- Turnover per side ≈ 65 × 25,000 = ₹16,25,000; both sides ≈ ₹32.5 lakh.
- STT 0.05% on sell ≈ ₹813 (on ₹16.28 lakh sell value).
- NSE transaction charges ₹183/crore ≈ ₹59.
- Brokerage, say ₹20 per order = ₹40, plus GST on brokerage and fees, stamp duty 0.002% on buy ≈ ₹33.
- Gross profit = 40 × 65 = ₹2,600. Costs ≈ ₹960 → net ≈ ₹1,640.

US — 100 shares of a $250 stock, bought and sold intraday for a $1.00 gain:
- Gross = $100. Commission $0 at many brokers; SEC fee and FINRA TAF on the sell side are a few cents; effective spread, say $0.01 per share each way = $2.
- Net ≈ $97.

Statutory taxes are a much larger share of small intraday gains in Indian futures than in US stocks. Compare both calculators:

[[widget:charges-india]]
[[widget:charges-us]]` },
      { h: 'India', md: `> [!india] If you trade Nifty and want US exposure in the evening, consider GIFT Nifty and global cues as *inputs* for tomorrow's NSE session rather than another market to trade at night. Running two full trading days in one 24-hour cycle is a fatigue risk. Check the regulatory status of any app that offers US derivatives to Indian residents.` },
      { h: 'Common misconceptions', md: `- **"US is cheaper, so I'll make more."** Lower costs help, but they do not create an edge.
- **"Strategies transfer directly."** Index-option expiry behaviour in India and single-stock momentum in the US are different markets.
- **"I can short any US stock."** You need a borrow, and SSR may apply.
- **"Indian residents can trade US options on margin freely."** LRS restrictions apply (verify with RBI rules and an adviser).` },
      { h: 'When it fails', md: `Example: an Indian trader runs an opening-range breakout that suits Nifty and applies it to a $3 US small cap at the 09:30 open. The breakout triggers, but the spread is $0.04 (1.3% of price) and the stock halts on LULD two minutes later, reopening 9% lower. The stop executes far below plan. The strategy may have been reasonable for an index; it was not designed for a thin, halt-prone small cap. Market rules, liquidity and product differences must be part of the strategy, not afterthoughts.` },
      { h: 'Exercise', md: `1. Build a two-column checklist "India vs US" for your own trading: hours, instruments, costs, settlement, shorting, leverage.
2. Compute one Nifty futures intraday trade and one US stock trade with the charges calculators.
3. Open [[chart:SPY:31:vwap,ema20,vol]] and [[chart:NIFTY:31:vwap,ema20,vol]] side by side; note differences in opening volatility.

**Journal prompt:** "Which of my rules depend on Indian market features (circuit bands, expiry days, pre-open) and would break in the US?"` },
    ],
    check: [
      { q: 'A US stock falls 11% from the prior close at 11:00 ET. What restriction typically applies to short sellers for the rest of the day and the next day?', o: ['No restriction', 'Short sales only at a price above the current national best bid (Rule 201 SSR)', 'Shorting banned entirely', 'Shorting allowed only after hours'], a: 1, why: 'Rule 201 is triggered by a 10% decline and restricts short sales to prices above the national best bid; it does not ban shorting.' },
      { q: 'Which difference most changes an India-trained trader\'s morning routine in the US?', o: ['Candles look different', 'The need to scan a large universe for stocks in play, liquidity and spread, rather than focusing on one index', 'VWAP is calculated differently', 'There are no options in the US'], a: 1, why: 'US intraday activity is spread across thousands of stocks, so selection by liquidity and catalyst becomes a core skill.' },
    ],
    refs: ['SEC — Rule 201 (Alternative uptick rule) (sec.gov)', 'NSE — Trading and settlement (nseindia.com)', 'SEBI — Margin framework circulars (sebi.gov.in)', 'RBI — Liberalised Remittance Scheme FAQs (rbi.org.in)', 'FINRA — BrokerCheck (brokercheck.finra.org)'],
  },

  /* ============================ L2-M7 Global markets and sessions ============================ */
  {
    id: 'l2-europe', module: 'L2-M7', level: 2, track: 'global', title: 'European markets: DAX, FTSE, CAC, Euro Stoxx', mins: 16,
    summary: 'Identify the main European indices, their session times in IST across daylight-saving changes, their sector make-up and how the European open can influence the Indian afternoon.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Europe opens while India is in its afternoon session, so European moves can affect Nifty and Bank Nifty in the second half of the Indian day. The four indices you will hear about most:

- **DAX 40** (Germany, Deutsche Börse/Xetra) — 40 large German companies; heavy in industrials, autos, chemicals, software and financials.
- **FTSE 100** (UK, London Stock Exchange) — 100 large UK-listed companies; heavy in energy, mining, banks, consumer staples and pharma. Many earn revenue abroad.
- **CAC 40** (France, Euronext Paris) — strong luxury-goods, energy, industrial and bank exposure.
- **Euro Stoxx 50** (Eurozone blue chips, by STOXX) — 50 leading Eurozone companies across countries; its futures (traded on Eurex) are among the most liquid index futures in the world.

Think of Europe as the bridge between Asia and the US: it digests Asian news and sets the tone before New York opens.` },
      { h: 'Intermediate view', md: `**Session times** (cash markets; as of Nov 2026 — verify on exchange websites):

| Market | Local hours | IST in European winter (Nov–Mar) | IST in European summer (Mar–Oct) |
|---|---|---|---|
| Xetra (DAX) | 09:00–17:30 CET | 13:30–22:00 | 12:30–21:00 |
| Euronext Paris (CAC) | 09:00–17:30 CET | 13:30–22:00 | 12:30–21:00 |
| London (FTSE) | 08:00–16:30 UK | 13:30–22:00 | 12:30–21:00 |

Europe moves its clocks on the **last Sunday of March** and the **last Sunday of October**. The US moves on the second Sunday of March and the first Sunday of November. For a few weeks each year the gap between Europe and the US is one hour different from normal — check your session table during those weeks.

**Futures trade much longer.** DAX and Euro Stoxx 50 futures on Eurex trade from early morning (roughly 01:10 CET for many index futures) to 22:00 CET (verify current Eurex hours). FTSE 100 futures trade on ICE Futures Europe. So "Europe" has prices well before the cash open.

**Index characteristics:**
- DAX is a **total-return (performance) index**: dividends are reinvested in the index level. FTSE, CAC and Euro Stoxx 50 headline figures are price indices. This matters when you compare long-run charts.
- The FTSE 100 often moves inversely to sterling: a weaker pound raises the sterling value of overseas earnings.
- Bank-heavy days in Europe (rates, ECB news) can echo into Bank Nifty sentiment, though the link is loose.

**How to read the European open from India:** at 13:30 IST (winter), note the DAX and Euro Stoxx 50 futures direction over the first 15–30 minutes, alongside US index futures. A strong, broad move often coincides with a change in Nifty's afternoon tone; a mixed open usually means little.` },
      { h: 'Advanced view', md: `**Macro drivers specific to Europe:** ECB policy (rate decisions about every six weeks), Eurozone inflation flash estimates, German Ifo and ZEW surveys, PMI releases, energy prices (Europe imports much of its gas), and sovereign spreads (e.g. Italian BTP–German Bund). A widening of peripheral spreads tends to hit European banks first.

**Sector skew matters more than country.** The DAX's exposure to exporters and autos makes it sensitive to China demand and global trade news. The FTSE's commodity weighting makes it sensitive to crude and metals. If you are watching Europe for clues about Indian metal stocks, the FTSE and the Stoxx 600 Basic Resources sector are more relevant than the CAC.

**Correlation is regime-dependent.** On ordinary days, Nifty's intraday correlation with European indices is modest. On global risk-off days (a major geopolitical shock, a US data surprise during the European session), correlations rise sharply. See [[link:l4-regimes]].

> [!evidence] The idea that European moves "lead" Nifty in the afternoon is empirical-mixed. Co-movement is clearest on days with a common global driver; on India-specific news days, Europe tells you little.` },
      { h: 'The maths', md: `**Time-zone arithmetic**

:::formula
IST = UTC + 5:30
CET = UTC + 1 (winter), CEST = UTC + 2 (summer)
UK = UTC + 0 (GMT, winter), UTC + 1 (BST, summer)
:::

Example (winter): DAX opens 09:00 CET = 08:00 UTC = 13:30 IST.
Example (summer): DAX opens 09:00 CEST = 07:00 UTC = 12:30 IST.

**Index point value example.** Euro Stoxx 50 futures (FESX) have a multiplier of €10 per index point (verify on eurex.com). At 5,000 points, one contract ≈ €50,000 notional; a 40-point move = €400. Use the futures-exposure widget to compare with Nifty futures:

[[widget:futures-exposure]]` },
      { h: 'India', md: `> [!india] From November to March, the European open at 13:30 IST falls in the last two hours of NSE trading; from April to October it is at 12:30 IST. Add a note in your routine: "European open check" at that time. Ask three questions: Are European futures moving strongly in one direction? Are US futures moving with them? Is Nifty reacting or ignoring them? Only a yes to the first two makes it a meaningful input.` },
      { h: 'Common misconceptions', md: `- **"DAX and FTSE are interchangeable as 'Europe'."** Their sector make-ups differ greatly.
- **"The DAX index level is directly comparable to price indices."** DAX includes dividends.
- **"Europe opens at the same IST time all year."** It shifts with European daylight saving time.
- **"A red European open means Nifty will fall."** Only when there is a shared driver; otherwise the link is weak.` },
      { h: 'When it fails', md: `Example: on an Indian results day, HDFC Bank and ICICI Bank rally after strong numbers and Bank Nifty trends up. At 13:30 IST the DAX opens down 0.8% on a German industrial profit warning. A trader shorts Bank Nifty "because Europe is weak", is stopped out as domestic buying continues, and loses 1R. The European move had a local cause unrelated to Indian banks. Cross-market cues need a shared driver to be useful.` },
      { h: 'Exercise', md: `1. Add a European session table (both summer and winter IST times) to your routine notes.
2. Open [[chart:DAX:12:vwap,vol]] in the chart lab and identify the opening hour's range and volume relative to the rest of the day.
3. For one week, write down at 13:30 IST (winter) the direction of DAX futures and Nifty over the next hour. Record whether there was a common driver.

**Journal prompt:** "Did I use the European open as information, or as a reason to trade against my plan?"` },
    ],
    check: [
      { q: 'In July, at what IST time does the Xetra DAX cash session open?', o: ['13:30', '12:30', '11:30', '14:30'], a: 1, why: 'In summer Germany uses CEST (UTC+2). 09:00 CEST = 07:00 UTC = 12:30 IST.' },
      { q: 'Which European index is most directly sensitive to crude oil and metal prices because of its sector make-up?', o: ['DAX 40', 'FTSE 100', 'CAC 40', 'All equally'], a: 1, why: 'The FTSE 100 has heavy weightings in energy and mining; the DAX is more industrial/auto, the CAC more luxury and industrial.' },
      { q: 'Why might a long-run DAX chart rise more than a CAC 40 chart even if the underlying companies performed similarly?', o: ['The DAX has more companies', 'The DAX is a total-return index that reinvests dividends; the CAC 40 headline is a price index', 'The DAX trades longer hours', 'Currency effects'], a: 1, why: 'Dividend reinvestment in a performance index adds to the index level over time, while a price index drops dividends.' },
    ],
    refs: ['Deutsche Börse — DAX index methodology (deutsche-boerse.com / stoxx.com)', 'London Stock Exchange — Trading hours (londonstockexchange.com)', 'Euronext — Trading hours (euronext.com)', 'Eurex — Euro Stoxx 50 futures specifications (eurex.com)', 'ECB — Monetary policy decisions (ecb.europa.eu)'],
  },

  {
    id: 'l2-asia', module: 'L2-M7', level: 2, track: 'global', title: 'Asian markets: Japan, Hong Kong, China, Korea, Singapore, Australia', mins: 18,
    summary: 'Map the Asian session in IST, understand what drives each major Asian market, and use their opening hours as context for the Indian open without over-reading them.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Most of Asia opens before India. By 09:15 IST, Australia, Japan, Korea, Hong Kong, mainland China and Singapore are already trading. Their early moves are the freshest information you have about global risk appetite since the US closed.

Each market has a personality:
- **Japan** — Nikkei 225 and TOPIX; very sensitive to the yen.
- **Hong Kong** — Hang Seng and Hang Seng Tech; strongly linked to Chinese internet and property companies.
- **Mainland China** — Shanghai Composite, CSI 300; policy-driven, with limited foreign access.
- **South Korea** — KOSPI; dominated by semiconductors.
- **Singapore** — Straits Times Index; banks and REITs; also home to big derivatives trading.
- **Australia** — S&P/ASX 200; banks and miners, sensitive to iron ore and China.

Like reading the weather in towns to your east before a storm reaches you: useful, but your local conditions still decide.` },
      { h: 'Intermediate view', md: `**Session map in IST** (cash markets; as of Nov 2026 — verify on exchange websites):

| Market | Local hours | Lunch break | IST |
|---|---|---|---|
| Australia (ASX) | 10:00–16:00 | none | 04:30–10:30 (Oct–Apr, AEDT) / 05:30–11:30 (Apr–Oct, AEST) |
| Japan (TSE) | 09:00–15:30 JST | 11:30–12:30 | 05:30–12:00 |
| South Korea (KRX) | 09:00–15:30 KST | none | 05:30–12:00 |
| Hong Kong (HKEX) | 09:30–16:00 HKT | 12:00–13:00 | 07:00–13:30 |
| Shanghai/Shenzhen | 09:30–15:00 CST | 11:30–13:00 | 07:00–12:30 |
| Singapore (SGX) | 09:00–17:00 SGT | 12:00–13:00 | 06:30–14:30 |

Notes: Tokyo extended its close from 15:00 to 15:30 JST in November 2024. Japan, Korea, Hong Kong, China and Singapore do not use daylight saving; Australia (in its south-eastern states) does, so ASX shifts by one hour.

**Key index facts:**
- **Nikkei 225** is price-weighted (high-priced shares carry more weight, like the Dow); **TOPIX** is free-float market-cap weighted. They can diverge.
- **Hang Seng** and **Hang Seng Tech** carry large weightings in Chinese companies listed in Hong Kong.
- **CSI 300** tracks large A-shares in Shanghai and Shenzhen. A-shares have daily price limits (typically ±10% on main boards; wider on STAR and ChiNext boards — verify).
- **KOSPI** is heavily weighted towards a few chip makers; global semiconductor news (including US chip stocks overnight) moves it.
- **ASX 200** is heavy in banks and miners; iron ore and China demand matter.` },
      { h: 'Advanced view', md: `**Currency is a first-order driver in Japan.** A weaker yen tends to lift Japanese exporters (higher yen value of foreign revenue) and the Nikkei; a sharp yen rally can hit the Nikkei hard. In early August 2024, a rapid yen rally and unwinding of yen-funded "carry trades" coincided with a one-day Nikkei fall of more than 12% — a reminder that currency and positioning can dominate fundamentals over short horizons.

**China is policy-sensitive.** Announcements on stimulus, property support or regulation can move Chinese indices sharply and without warning. Foreign access is mainly via the Stock Connect links with Hong Kong. For Indian traders, China's moves matter mostly through metals (steel, aluminium, copper) and through global risk sentiment.

**Korea and Taiwan as chip barometers.** If US semiconductor stocks moved sharply overnight, KOSPI and Taiwan's TAIEX usually reflect it at their open. For India this matters less directly, since Nifty has little semiconductor weight, but it signals global tech risk appetite.

**Singapore's derivatives role.** Before July 2023, Nifty futures traded on SGX as "SGX Nifty". They moved to NSE International Exchange in GIFT City as **GIFT Nifty**. SGX remains a major venue for other Asian index and commodity derivatives.

> [!evidence] Asian opens are a reasonable *context* input for Nifty's open, but the strength of the link varies by day and regime. On India-specific news days, domestic drivers dominate. Treat any "Asia leads Nifty" rule as empirical-mixed.` },
      { h: 'The maths', md: `**Time-zone arithmetic for Asia**

:::formula
JST = KST = UTC + 9 → IST = JST − 3:30
HKT = CST(China) = SGT = UTC + 8 → IST = HKT − 2:30
AEDT = UTC + 11 → IST = AEDT − 5:30; AEST = UTC + 10 → IST = AEST − 4:30
:::

Example: Hong Kong opens 09:30 HKT → 09:30 − 2:30 = 07:00 IST.
Example: Tokyo afternoon session resumes 12:30 JST → 09:00 IST, just before NSE's pre-open ends.

**Currency effect on index returns.** If the Nikkei rises 2% in yen and the yen falls 1.5% against the dollar the same day, a dollar-based investor's return is roughly:

:::formula
(1 + 0.02) × (1 − 0.015) − 1 ≈ 0.47%
:::

Local-currency gains can largely vanish in another currency. Try it in the FX widget:

[[widget:fx]]` },
      { h: 'India', md: `> [!india] A practical 08:30–09:15 IST check:
1. Nikkei and KOSPI change since their open (both open at 05:30 IST).
2. Hang Seng and China direction at 07:00 IST open, and after the first hour.
3. Yen and offshore yuan moves overnight.
4. GIFT Nifty level versus Nifty's previous close.

Write one line: "Asia risk-on / risk-off / mixed". If mixed, give it no weight. If broadly risk-off and GIFT Nifty agrees, expect a weaker open, but wait for NSE's own opening structure before acting.` },
      { h: 'Common misconceptions', md: `- **"Nikkei and TOPIX are the same."** Price-weighting versus cap-weighting can produce different moves.
- **"SGX Nifty still exists."** Nifty futures moved to GIFT Nifty on NSE IX in July 2023.
- **"China's market is just like Hong Kong's."** A-shares have daily limits, different participants and restricted access.
- **"A strong Asian session guarantees a strong Nifty."** It is context, not a signal.` },
      { h: 'When it fails', md: `Example: Asia is up broadly at 08:45 IST — Nikkei +1.2%, Hang Seng +1.5%. A trader buys Nifty futures in the first minute of trading at 09:15 expecting follow-through. At 09:20, an Indian regulatory announcement on a large lender hits banks; Nifty falls 120 points in 15 minutes. With 1 lot (65 units) that is ₹7,800 against a planned ₹2,600 stop that was not placed because "Asia was strong". Asian cues did not include India-specific news.` },
      { h: 'Exercise', md: `1. Build an Asian session table in IST in your routine notes, including lunch breaks and the ASX daylight-saving shift.
2. For five sessions, record your 08:45 IST "Asia risk-on / risk-off / mixed" call and Nifty's direction over the first hour.
3. Use the FX widget to convert a 2% Nikkei gain into rupee terms with a 1% yen move.

**Journal prompt:** "Did I treat the Asian session as context, or did it make me trade before my opening setup appeared?"` },
    ],
    check: [
      { q: 'At what IST time does the Hong Kong stock exchange cash session open?', o: ['06:30', '07:00', '07:30', '08:00'], a: 1, why: 'HKT is UTC+8, 2.5 hours ahead of IST. 09:30 HKT = 07:00 IST.' },
      { q: 'The Nikkei rises 3% in yen terms while the yen falls 2% versus the US dollar. What is the approximate return for a dollar-based investor?', o: ['+5%', '+3%', '+0.9%', '−2%'], a: 2, why: '(1.03 × 0.98) − 1 ≈ 0.94%. The currency fall offsets much of the local gain.' },
      { q: 'Which statement about GIFT Nifty is correct?', o: ['It is traded on SGX', 'It replaced SGX Nifty in July 2023 and trades on NSE International Exchange in GIFT City', 'It is the same as the Nifty spot index', 'It trades only during NSE hours'], a: 1, why: 'Nifty futures migrated from SGX to NSE IX in GIFT City in July 2023, trading in USD for much longer hours than NSE.' },
    ],
    refs: ['Japan Exchange Group — Trading hours (jpx.co.jp)', 'HKEX — Trading hours (hkex.com.hk)', 'KRX — Market hours (global.krx.co.kr)', 'SGX — Trading hours (sgx.com)', 'ASX — Trading hours (asx.com.au)', 'NSE International Exchange — GIFT Nifty (nseix.com)'],
  },
  {
    id: 'l2-overnight', module: 'L2-M7', level: 2, track: 'global', title: 'Overnight cues, GIFT Nifty and cross-market correlation', mins: 19,
    summary: 'Build a structured overnight-cues check, read GIFT Nifty correctly (including basis and currency), and judge when cross-market correlation is strong enough to matter.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `Between NSE's close at 15:30 IST and the next open at 09:15, the world keeps trading: Europe's afternoon, the full US session, and Asia's morning. **Overnight cues** are what those markets did while India was closed.

The most direct cue is **GIFT Nifty** — Nifty 50 futures that trade on NSE International Exchange (NSE IX) in GIFT City, Gujarat, for most of the 24 hours. When GIFT Nifty is trading 100 points above Nifty's previous close, the market is signalling an expected higher open.

Other cues: US index closes and futures, the US dollar, crude oil, US 10-year Treasury yields, Asian opens, and major overnight news. The skill is to combine them into a simple "risk-on / risk-off / mixed" picture — and then still let NSE's opening price action decide your trades.` },
      { h: 'Intermediate view', md: `**GIFT Nifty basics** (as of Nov 2026 — verify contract specifications and hours on nseix.com):
- Quoted in index points, settled in **US dollars**, so trading it is not open to most Indian residents but anyone can watch the price.
- Trades in two sessions totalling about 21 hours, roughly 06:30–15:40 IST and 16:35–02:45 IST.
- It is a **futures** price. Its premium over the Nifty spot index includes **basis** (cost of carry minus expected dividends), not only sentiment.

**Reading it properly:**

:::formula
Implied gap ≈ GIFT Nifty (near month) − Fair basis − Nifty previous close
:::

If GIFT Nifty near-month is 25,180, fair basis for the near month is about 60 points, and Nifty closed at 25,050, then the implied opening gap is about 25,180 − 60 − 25,050 = **+70 points**, not +130.

**The overnight-cues checklist (08:15–08:45 IST):**

| Cue | What to note | Typical relevance to India |
|---|---|---|
| GIFT Nifty | Level vs prior close, adjusted for basis | Direct |
| S&P 500 / Nasdaq close and futures | % change, breadth of move | Moderate; strongest on global-driver days |
| USD/INR, Dollar Index | Rupee weakness/strength | FPI flows, IT and importers |
| Brent crude | % change | Oil marketing companies, paints, aviation, inflation, rupee |
| US 10-year yield | Change in basis points | Global risk appetite, FPI flows, rate-sensitive sectors |
| Asian opens | Broad direction | Context |
| News | Results, policy, geopolitics | Can override everything |` },
      { h: 'Advanced view', md: `**Correlation is not constant.** The day-to-day correlation between Nifty and the S&P 500 is positive but moderate over long periods, and it rises sharply in global stress. During India-specific events (budget, elections, RBI surprises, large results) it can collapse. The practical rule: give overnight cues weight only when there is a **shared driver** you can name. See [[link:l4-regimes]].

**Gap behaviour.** A large gap implied by GIFT Nifty does not tell you whether the gap will extend or fade. Common opening scenarios after a gap:
1. **Gap and go** — opens beyond the prior range and holds above VWAP and the opening range low.
2. **Gap fill** — fades back towards the prior close.
3. **Gap and range** — chops around the open.

Pre-plan your response to each; do not pre-decide which one occurs. See [[link:l2-opening-range]].

**Currency effects on flows.** A sharply weaker rupee can coincide with foreign portfolio investor (FPI) selling, because foreign investors' dollar returns fall when the rupee drops. IT exporters, whose revenue is largely in dollars, can respond differently from domestic-focused banks. Crude spikes tend to weigh on the rupee because India imports most of its crude.

**Beta translation (illustrative).** Some traders estimate Nifty's sensitivity to an overnight US move using a beta estimated from history. Any such beta is unstable; use it only to frame expectations, never as a forecast.

> [!evidence] Overnight cues have reasonable explanatory power for the *opening gap* on many days, but much weaker power for the rest of the session. Treat them as context — empirical-mixed.` },
      { h: 'The maths', md: `**1. Fair basis for GIFT Nifty (simplified cost of carry)**

:::formula
Fair futures ≈ Spot × (1 + r × t) − Dividends expected before expiry
:::

Nifty spot 25,000, annual carry rate 6.5%, 20 days to expiry (t = 20/365), expected dividends ≈ 10 points:
- Carry = 25,000 × 0.065 × 20/365 ≈ 89 points.
- Fair futures ≈ 25,000 + 89 − 10 = 25,079 → fair basis ≈ 79 points.

**2. Correlation from paired returns**

:::formula
ρ = Cov(X, Y) ÷ (σX × σY)
:::

Five days of returns (%): S&P overnight X = [+1.0, −0.5, +0.2, −1.2, +0.5]; Nifty open-to-close Y = [+0.4, +0.1, −0.3, −0.8, +0.6].
- Means: X̄ = 0.0, Ȳ = 0.0.
- Σ(XY) = 0.40 − 0.05 − 0.06 + 0.96 + 0.30 = 1.55.
- Σ(X²) = 1 + 0.25 + 0.04 + 1.44 + 0.25 = 2.98; Σ(Y²) = 0.16 + 0.01 + 0.09 + 0.64 + 0.36 = 1.26.
- ρ = 1.55 ÷ √(2.98 × 1.26) = 1.55 ÷ 1.938 ≈ **0.80**.

With five data points this number means almost nothing statistically — a single day changes it a lot. Use rolling windows of at least 60 days and check stability. (Data here is illustrative.)` },
      { h: 'India', md: `> [!india] Example pre-market note (illustrative):
"Nifty closed 25,050. GIFT Nifty near-month 25,180; fair basis ~60 → implied gap ≈ +70. S&P 500 +0.9% on softer US inflation data (shared driver: global rates). USD/INR flat. Brent −1.2%. Asia mostly up. Read: mild risk-on. Plan: if Nifty holds above the first 15-minute low and VWAP, look for pullback longs; if it fills the gap below 25,050, no longs before 10:30."` },
      { h: 'US & global', md: `> [!us] The same logic applies to US traders reading Asia and Europe before the US open: S&P 500 futures (ES) on CME trade nearly 24 hours, Sunday to Friday, with a daily maintenance break (verify current CME hours). A move in ES during the European morning, combined with a scheduled US data release at 08:30 ET, is a typical driver of the US opening gap.` },
      { h: 'Common misconceptions', md: `- **"GIFT Nifty premium = expected gap."** It includes basis; subtract fair basis first.
- **"If the US was up, Nifty will be up all day."** Overnight cues mostly inform the open, not the full session.
- **"High correlation last month means high correlation tomorrow."** Correlations shift with regime and news.
- **"More cues = better forecast."** Many cues are themselves correlated; you may be counting one signal several times.` },
      { h: 'When it fails', md: `Example: GIFT Nifty implies a +150-point gap after a strong US session. You buy Nifty futures in the pre-open expecting continuation. The market opens +140, but large domestic funds sell into the gap; within 30 minutes Nifty is only +20. Long 1 lot from the open at 25,190, you are down 120 × 65 = ₹7,800. The cue correctly forecast the *open*; it said nothing about the gap's acceptance.` },
      { h: 'Exercise', md: `1. Each morning for two weeks, write the implied gap from GIFT Nifty after subtracting an estimated fair basis, and compare with the actual open.
2. Record whether the gap held or filled by 10:30.
3. Open [[chart:NIFTY:58:vwap,ema20,vol]] in the chart lab, imagine a +100-point gap at the open, and write your gap-and-go, gap-fill and gap-and-range plans.

**Journal prompt:** "Which overnight cue did I rely on today, what shared driver connected it to India, and did the open confirm or reject it?"` },
    ],
    check: [
      { q: 'GIFT Nifty near-month is 24,860. Fair basis is about 70 points. Nifty previous close is 24,700. What is the approximate implied opening gap?', o: ['+160', '+90', '+70', '−70'], a: 1, why: 'Implied gap ≈ 24,860 − 70 − 24,700 = +90. Ignoring basis overstates the expected gap.' },
      { q: 'Overnight, the S&P 500 fell 1.5% on a US tech earnings miss. Indian IT stocks have significant US client exposure, but today India has a surprise RBI policy announcement at 10:00 IST. How should you weight the US cue?', o: ['Heavily — US always leads India', 'As context for the open and IT sector; the domestic policy event can dominate after 10:00', 'Ignore all cues on RBI days', 'Short Nifty at the open regardless'], a: 1, why: 'The US move has a plausible channel into Indian IT and the open, but a scheduled domestic event is likely to dominate later. Cues are weighted by shared drivers and timing.' },
      { q: 'You compute a 0.8 correlation between two markets using five days of data. What is the right interpretation?', o: ['The markets are strongly linked', 'The estimate is unreliable with so few observations; use longer rolling windows and check stability', 'Correlation is causation', 'The relationship will continue tomorrow'], a: 1, why: 'Five observations give a very noisy estimate. Correlation also does not imply causation or persistence.' },
    ],
    refs: ['NSE International Exchange — GIFT Nifty contract specifications (nseix.com)', 'NSE — Nifty 50 index methodology (nseindia.com)', 'CME Group — E-mini S&P 500 trading hours (cmegroup.com)', 'John Hull — Options, Futures, and Other Derivatives (book)'],
  },
  );

  /* ============================ L3-M8 Other asset classes ============================ */
  IA.content.lessons.push(
  {
    id: 'l3-commodities', module: 'L3-M8', level: 3, track: 'global', title: 'Commodities: MCX, gold, silver, crude, natural gas', mins: 20,
    summary: 'Understand how commodity futures on MCX are specified and priced, what drives gold, silver, crude and natural gas, and how global prices and USD/INR combine into the rupee price.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Commodities are physical goods — metals, energy, agricultural products. Intraday traders usually trade them through **futures**: standardised contracts to buy or sell a set quantity at a future date, on a regulated exchange.

In India the main commodity exchange is **MCX (Multi Commodity Exchange)**, regulated by SEBI since the 2015 merger of the commodities regulator (FMC) into SEBI. NSE also lists some commodity contracts. Popular MCX contracts include gold, silver, crude oil, natural gas, copper and zinc, with smaller "mini" and "micro" versions of several.

Two big differences from Nifty:
1. **Global price, local contract.** MCX crude is essentially the global crude price converted into rupees. Moves often happen while India is asleep or during the evening US session.
2. **Long trading hours.** MCX trades well into the night to overlap with global markets.

Commodities can be more volatile than indices and are driven by supply shocks, weather, geopolitics and inventory data, not by company earnings.` },
      { h: 'Intermediate view', md: `**MCX trading hours** (as of Nov 2026 — verify on mcxindia.com): non-agricultural commodities trade from 09:00 to about 23:30 IST, extended to about 23:55 IST when the US is on standard time (roughly November to March). Agricultural contracts have shorter hours.

**Contract specification matters.** Before trading any commodity, read the exchange spec sheet. Typical fields:

| Field | Why it matters |
|---|---|
| Trading unit / lot | Determines rupee value per point |
| Quotation | e.g. gold in ₹ per 10 g, silver in ₹ per kg, crude in ₹ per barrel, natural gas in ₹ per mmBtu |
| Tick size | Minimum price move and its rupee value |
| Daily price limit | Initial band with possible expansion (verify) |
| Expiry and delivery | Some contracts are compulsory-delivery; know your broker's square-off policy before expiry |
| Margin | SPAN plus exposure; can be raised in volatile times |

Lot sizes for MCX contracts change from time to time — always check the current specification (verify). For example, MCX crude oil is quoted per barrel with a standard lot of 100 barrels and a mini contract of 10 barrels (verify current lots).

**What drives each commodity:**
- **Gold** — real interest rates (inversely), US dollar strength (inversely in USD terms), central-bank buying, safe-haven demand, and in India import duty and USD/INR.
- **Silver** — part precious metal, part industrial metal (solar panels, electronics); more volatile than gold.
- **Crude oil** — OPEC+ decisions, US inventory data (EIA weekly report, normally Wednesday 10:30 ET), geopolitics, global demand. MCX crude tracks NYMEX WTI.
- **Natural gas** — weather (heating/cooling demand), storage reports (EIA weekly storage, normally Thursday 10:30 ET), LNG export flows. Very volatile; tracks Henry Hub (NYMEX).` },
      { h: 'Advanced view', md: `**Term structure.** Commodity futures for different months have different prices. When later months are higher, the curve is in **contango** (often storage and financing costs); when they are lower, it is in **backwardation** (often tight current supply). Rolling a position from one month to the next can gain or lose money independent of spot price. See [[link:l3-basis]].

**Event intraday trading.** Crude and natural gas routinely spike within seconds of EIA releases. Spreads widen, stops slip. Many intraday traders either flatten before the release or trade only after the first 5–15 minutes. In IST, EIA's crude release at 10:30 ET is 21:00 IST in US winter and 20:00 IST in US summer.

**Negative prices and contract mechanics.** In April 2020, the expiring NYMEX WTI contract settled below zero because of storage constraints at the delivery point. MCX contracts referencing WTI faced settlement questions at that time. The lesson: know how your contract settles, and avoid holding into expiry unless you understand delivery.

**Regulated exchange vs unregulated venue.** MCX and NSE commodity futures are exchange-traded, cleared by a clearing corporation and regulated by SEBI. "Commodity CFDs" offered by offshore apps to Indian residents are a different product: typically over-the-counter, not cleared by an Indian clearing corporation, and SEBI/RBI have warned about unauthorised platforms (verify the RBI alert list of unauthorised forex platforms and SEBI cautions).

> [!warn] Commodity futures are leveraged. A 3% move in crude — common on inventory or OPEC news days — can be a large multiple of margin.` },
      { h: 'The maths', md: `**1. Rupee value of a move.**

:::formula
P&L = Price change × Lot multiplier × Number of lots
:::

MCX crude oil, lot = 100 barrels (verify). You buy 1 lot at ₹6,200 and sell at ₹6,262 → P&L = 62 × 100 = ₹6,200.

**2. Converting global prices into MCX (approximate parity).**

:::formula
MCX crude (₹/bbl) ≈ WTI ($/bbl) × USD/INR
MCX gold (₹/10 g) ≈ Spot gold ($/troy oz) × USD/INR × (10 ÷ 31.1035) × (1 + import duty and other levies)
:::

WTI $72, USD/INR 87 → MCX crude ≈ 72 × 87 = ₹6,264/bbl. If WTI falls 1% but the rupee weakens 0.5%, the rupee price falls only about 0.5%: (0.99 × 1.005) − 1 ≈ −0.5%.

Gold example (illustrative, ignoring exact duty structure): $2,700/oz × 87 × 0.3215 ≈ ₹75,520 per 10 g before duties. Actual MCX prices include import duty and basis, so use this only to understand direction, not as an exact fair value.

**3. Leverage.** If margin is 8% of notional on a crude lot worth ₹6.2 lakh, margin ≈ ₹49,600. A 3% move = ₹18,600, i.e. about 37% of margin.

[[widget:futures-exposure]]` },
      { h: 'India', md: `> [!india] Practical notes (as of Nov 2026 — verify with MCX and your broker):
- Intraday commodity trades attract CTT (commodity transaction tax) on non-agricultural futures sells, plus exchange charges, SEBI fees, GST and stamp duty. Rates differ from equity F&O — check your broker's charge sheet.
- Many brokers auto-square or block positions in contracts entering the delivery period. Find out the exact date for each contract.
- Evening liquidity in MCX crude and natural gas is driven by the US session; your intraday window may be 18:30–23:30 IST rather than the daytime.` },
      { h: 'Common misconceptions', md: `- **"Gold always rises in a crisis."** It often does, but liquidations can push gold down in a sharp panic as traders raise cash.
- **"MCX crude is an Indian price."** It is a rupee translation of a global benchmark.
- **"Commodity CFDs on offshore apps are the same as MCX."** They are not exchange-traded or cleared in India and may not be permitted for Indian residents.
- **"Natural gas is like crude."** It is driven by different fundamentals (weather, storage) and is often much more volatile.` },
      { h: 'When it fails', md: `Example: you short 1 lot of MCX natural gas (lot 1,250 mmBtu — verify) at ₹280 ahead of the US storage report, expecting a bearish number. The report is in line, but a revised weather forecast shows a cold spell. Price jumps to ₹298 within minutes. Your stop at ₹286 fills at ₹292 because of the gap. Loss = 12 × 1,250 = ₹15,000 against a planned ₹7,500. Event risk plus a volatile contract doubled the planned loss.` },
      { h: 'Exercise', md: `1. Download the current MCX spec sheet for crude oil mini and gold mini; record lot, tick value and margin.
2. Open [[chart:GOLD:27:vwap,atr,vol]] in the chart lab. Note the ATR in points and convert it to rupees per lot.
3. Use the futures-exposure widget to calculate what a 1 ATR move means as a percentage of margin.

**Journal prompt:** "What scheduled events (EIA, OPEC+, US data) fall inside my commodity trading window this week, and what is my rule for each?"` },
    ],
    check: [
      { q: 'WTI crude falls 2% overnight while USD/INR rises 1%. Roughly how does MCX crude move?', o: ['−3%', '−2%', 'About −1%', '+1%'], a: 2, why: 'Rupee price ≈ WTI × USD/INR: (0.98 × 1.01) − 1 ≈ −1.0%. The weaker rupee offsets part of the fall.' },
      { q: 'You hold 2 lots of a crude contract with a 100-barrel lot. Price moves against you by ₹45. What is your loss?', o: ['₹4,500', '₹9,000', '₹900', '₹45,000'], a: 1, why: 'Loss = 45 × 100 × 2 = ₹9,000.' },
      { q: 'Which statement best distinguishes MCX futures from commodity CFDs on an offshore app?', o: ['They are identical products', 'MCX futures are exchange-traded, centrally cleared and SEBI-regulated; offshore CFDs are OTC and may not be permitted for Indian residents', 'CFDs are safer because there is no margin', 'MCX futures cannot be traded intraday'], a: 1, why: 'The regulatory and clearing difference is fundamental; RBI and SEBI have warned about unauthorised platforms.' },
    ],
    refs: ['MCX — Contract specifications and trading hours (mcxindia.com)', 'SEBI — Commodity derivatives circulars (sebi.gov.in)', 'US EIA — Weekly Petroleum Status Report and Natural Gas Storage Report (eia.gov)', 'CME Group — WTI and Henry Hub futures (cmegroup.com)', 'RBI — Alert list of unauthorised forex trading platforms (rbi.org.in)'],
  },
  {
    id: 'l3-fx', module: 'L3-M8', level: 3, track: 'global', title: 'Currency derivatives and forex', mins: 20,
    summary: 'Understand currency pairs, pips and quoting conventions, what Indian residents may legally trade in currency derivatives, and how global spot forex differs.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Currencies trade in **pairs**. USD/INR at 87.20 means one US dollar costs ₹87.20. If it rises to 87.50, the dollar has strengthened and the rupee has weakened.

The global foreign-exchange (forex) market is the largest financial market in the world, but it is mostly **over-the-counter**: banks and dealers trade with each other rather than on one exchange. It runs 24 hours from Monday morning in Asia to Friday evening in New York.

For Indian residents, the rules are strict. You may trade **exchange-traded currency derivatives on recognised Indian exchanges** (NSE, BSE) — for example USD/INR, EUR/INR, GBP/INR and JPY/INR futures and options, plus some cross-currency pairs. Trading forex on international websites or apps that offer leveraged forex or CFDs is not permitted for Indian residents under FEMA, and the RBI maintains an alert list of unauthorised platforms (as of Nov 2026 — verify on rbi.org.in).` },
      { h: 'Intermediate view', md: `**Quoting conventions**
- **Base/quote:** in EUR/USD = 1.0850, EUR is the base, USD the quote; one euro costs $1.0850.
- **Pip:** the standard small unit. For most pairs it is 0.0001; for yen pairs 0.01. In USD/INR on NSE the tick is ₹0.0025 (verify current spec).
- **Spread:** difference between bid and ask, often a fraction of a pip in major pairs at liquid times.

**Indian exchange-traded currency derivatives** (as of Nov 2026 — verify on nseindia.com):
- USD/INR futures: lot of USD 1,000, quoted in ₹ per USD.
- Options on USD/INR and other pairs are European-style and cash-settled.
- Trading hours: 09:00–17:00 IST for INR pairs; cross-currency pairs (e.g. EUR/USD) trade longer, to around 19:30 IST (verify).
- **Underlying exposure requirement:** following RBI directions, participants in INR exchange-traded currency derivatives are expected to have an underlying exposure to hedge, with a de minimis limit up to which exposure need not be documented. RBI's framework was revised in 2024 (verify current RBI directions and exchange circulars). This has reduced speculative retail volume.

**Drivers of USD/INR:** RBI intervention (it often smooths volatility), FPI equity and debt flows, crude prices (India's import bill), the US Dollar Index (DXY), interest-rate differentials, and the trade balance.

**Global session map** (IST, approximate): Sydney/Tokyo from early morning, London from about 12:30–13:30 IST, New York from about 17:30–18:30 IST. The **London–New York overlap** is usually the most liquid window for majors.` },
      { h: 'Advanced view', md: `**Interest-rate differential and forward points.** A currency forward or future price reflects the interest-rate difference between the two currencies (covered interest parity). If rupee interest rates are higher than dollar rates, USD/INR futures trade at a **premium** to spot. That premium is not a forecast of rupee weakness; it is carry. See the maths section.

**Carry trades.** Borrowing in a low-yield currency (historically the yen) to hold a higher-yield one earns the rate differential while exchange rates are stable, but suffers abrupt losses when the funding currency rallies, as in the yen-carry unwind of August 2024.

**Global spot forex and CFDs.** Retail forex outside India is offered by brokers regulated in some jurisdictions (for example the CFTC/NFA in the US, the FCA in the UK) and by many offshore entities with light regulation. Leverage of 30:1 to 50:1 on majors is common in regulated jurisdictions; offshore venues offer far higher. Offshore brokers often act as your counterparty, set their own prices and may have weak segregation of client funds. For Indian residents, this is outside the permitted framework regardless of how the app markets itself.

**Central-bank intervention risk.** The RBI and other central banks can intervene; the Swiss National Bank's removal of the EUR/CHF floor in January 2015 caused moves of well over 10% within minutes and wiped out several retail forex brokers. Gap risk exists even in "the most liquid market in the world".` },
      { h: 'The maths', md: `**1. Pip value**

:::formula
P&L = Price change × Contract size × Number of lots
:::

USD/INR futures, lot USD 1,000. You buy 5 lots at 87.2000 and sell at 87.2850. P&L = 0.0850 × 1,000 × 5 = ₹425.

**2. Forward premium (covered interest parity)**

:::formula
Forward ≈ Spot × (1 + r_INR × t) ÷ (1 + r_USD × t)
:::

Spot 87.00, r_INR = 6.5%, r_USD = 4.5%, t = 3 months (0.25):
- Numerator = 87 × 1.01625 = 88.414; denominator = 1.01125.
- Forward ≈ 88.414 ÷ 1.01125 ≈ 87.43 → premium ≈ 43 paise, about 2% annualised.

**3. Leverage in global forex (for understanding only).** A standard EUR/USD lot = 100,000 EUR. At 1.0850, notional = $108,500. A 50-pip move = 0.0050 × 100,000 = $500. At 30:1 leverage, margin ≈ $3,617, so a 50-pip move is about 14% of margin.

[[widget:fx]]` },
      { h: 'India', md: `> [!india] As of Nov 2026: Indian residents may trade currency derivatives only on recognised Indian exchanges and within RBI's framework, including the underlying-exposure rules. Online forex or CFD platforms that accept rupee deposits for leveraged trading in pairs like EUR/USD or XAU/USD are not authorised; RBI's alert list names many such platforms. Funds sent to them may not be recoverable, and participants may face action under FEMA. Verify on rbi.org.in before acting on anything an app or influencer says.` },
      { h: 'Common misconceptions', md: `- **"Forex is 24 hours so there are no gaps."** Weekend gaps and central-bank shocks still happen.
- **"A futures premium means the rupee will fall."** It mostly reflects interest-rate differentials.
- **"Any app on the Play Store is legal."** Availability is not authorisation; check RBI's alert list.
- **"RBI never intervenes."** It actively manages volatility in USD/INR.` },
      { h: 'When it fails', md: `Example: a trader buys 10 lots of USD/INR futures at 87.10 expecting rupee weakness on high crude prices. RBI intervenes by selling dollars; USD/INR falls to 86.80 in an hour. Loss = 0.30 × 1,000 × 10 = ₹3,000. More importantly, the trader had no documented underlying exposure, so the position also sat uneasily with RBI's framework. Low volatility in USD/INR invites oversizing; intervention risk punishes it.` },
      { h: 'Exercise', md: `1. Look up the current NSE currency derivatives spec for USD/INR: lot, tick, hours, expiry.
2. Use the FX widget to compute the forward premium for your own assumed rates.
3. Check RBI's alert list and note whether any app you have heard of appears on it.

**Journal prompt:** "Would this currency trade be permitted under current RBI rules for me, and do I have an underlying exposure it hedges?"` },
    ],
    check: [
      { q: 'Spot USD/INR is 86.00. Rupee rates are 7% and dollar rates 5% annually. Roughly what is the 6-month forward?', o: ['84.30', '86.85', '86.00', '89.00'], a: 1, why: 'Forward ≈ 86 × 1.035 ÷ 1.025 ≈ 86.84. The higher rupee rate creates a forward premium of about 1% over six months.' },
      { q: 'Which of these is permitted for an Indian resident retail trader (as of Nov 2026, subject to RBI rules)?', o: ['Leveraged EUR/USD CFDs on an offshore app funded via UPI', 'USD/INR futures on NSE within RBI\'s underlying-exposure framework', 'XAU/USD spot on an international broker using LRS', 'Crypto-collateralised forex perpetuals'], a: 1, why: 'Indian residents may trade currency derivatives on recognised Indian exchanges within RBI rules. Offshore leveraged forex and CFDs are not permitted.' },
      { q: 'You buy 4 lots of USD/INR futures (lot USD 1,000) at 87.3000 and exit at 87.2400. What is the P&L?', o: ['−₹240', '+₹240', '−₹60', '−₹2,400'], a: 0, why: 'P&L = (87.24 − 87.30) × 1,000 × 4 = −0.06 × 4,000 = −₹240.' },
    ],
    refs: ['NSE — Currency derivatives contract specifications (nseindia.com)', 'RBI — Master Direction on risk management and inter-bank dealings / exchange-traded currency derivatives (rbi.org.in)', 'RBI — Alert list of unauthorised forex trading platforms (rbi.org.in)', 'BIS — Triennial Central Bank Survey of FX markets (bis.org)', 'CFTC/NFA — Retail forex rules (nfa.futures.org)'],
  },

  {
    id: 'l3-crypto', module: 'L3-M8', level: 3, track: 'global', title: 'Crypto, perpetual futures, funding and liquidation', mins: 22,
    summary: 'Explain how crypto perpetual futures work, calculate funding payments and liquidation prices, and distinguish regulated venues from offshore ones in the Indian legal context.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Crypto assets such as Bitcoin (BTC) and Ether (ETH) trade 24 hours a day, seven days a week, on many venues around the world. There is no closing bell, no single exchange and, on many platforms, no regulator you would recognise from equity markets.

The most traded crypto product is not spot coins but the **perpetual future** ("perp"): a futures contract with **no expiry date**. Because it never expires, something must stop its price drifting away from spot. That mechanism is the **funding rate** — a periodic payment between longs and shorts.

Perps are usually traded with high leverage, and positions are **liquidated** automatically when your margin runs out. Understanding funding and liquidation maths is not optional; it is the difference between knowing your risk and being surprised by it.

> [!warn] Crypto is highly volatile, and many venues are offshore and lightly regulated. Losses can exceed what you expect, and platform failure is a real risk (the 2022 collapse of FTX is the best-known example).` },
      { h: 'Intermediate view', md: `**How a perpetual works**
- You post **margin** (collateral, often USDT/USDC stablecoins or the coin itself).
- You choose **leverage** — exposure ÷ margin.
- **Mark price** (usually derived from an index of spot prices across venues) is used for P&L and liquidation, to reduce manipulation by one venue's last trade.
- **Funding**: at fixed intervals (commonly every 8 hours; some venues every 1 or 4 hours — verify per venue), longs pay shorts if the perp trades above spot (positive funding), shorts pay longs if below (negative funding).
- **Maintenance margin rate (MMR)**: the minimum equity as a fraction of position value. Below it, the position is liquidated.
- **Isolated vs cross margin**: isolated limits loss to the margin assigned to that position; cross uses your whole account balance as collateral, so one bad trade can drain everything.

**Linear vs inverse contracts**
- *Linear* (USDT/USDC-margined): P&L in stablecoin, straightforward.
- *Inverse* (coin-margined): P&L in BTC; your collateral loses value as price falls, so long positions are hit twice.

**Execution notes for intraday traders**
1. Use isolated margin and low leverage while learning.
2. Calculate the liquidation price *before* entry and ensure your stop is far inside it.
3. Check funding times — holding through a funding timestamp costs or pays you.
4. Weekend liquidity is thinner; sudden moves are common.` },
      { h: 'Advanced view', md: `**Funding as a positioning signal.** Persistently high positive funding means longs are paying heavily to stay long — crowded positioning. Some traders read extreme funding as a contrarian warning. This is empirical-mixed: crowded positioning can persist for a long time.

**Liquidation cascades.** Because many traders use similar leverage, liquidation prices cluster. When price reaches a cluster, forced sells (for longs) push price lower, triggering the next cluster. Public "liquidation heatmaps" are model-based estimates, not exact data — label them as such.

**Insurance funds and auto-deleveraging (ADL).** When a liquidated position cannot be closed at better than bankruptcy price, the venue's insurance fund covers the shortfall. If the fund is insufficient, some venues auto-deleverage profitable traders on the other side. Your winning position can be closed without your consent.

**Basis trade.** Buying spot and shorting the perp collects positive funding, roughly market-neutral. Risks: funding flips negative, venue risk, collateral haircuts and liquidation on the short leg in a rally if margin is thin.

**Regulated vs offshore venues.**
| Feature | Regulated venue (e.g. CME Bitcoin/Ether futures; US-regulated or EU MiCA-authorised venues) | Offshore unregulated venue |
|---|---|---|
| Oversight | Regulator (CFTC, SEC, EU national authorities) | Little or none in your jurisdiction |
| Client money | Segregation rules, audits | Often unclear; commingling risk |
| Leverage | Lower | Often 50–100× or more |
| Recourse | Legal and regulatory channels | Very limited |
| Product | Dated futures, some perps-style products (verify) | Perpetuals, exotic products |

Regulation reduces some risks (custody, fraud) but not market risk.` },
      { h: 'The maths', md: `**1. Funding payment**

:::formula
Funding payment = Position notional × Funding rate (per interval)
Annualised ≈ Funding rate × Intervals per day × 365
:::

You are long 1 BTC perp at $60,000 (notional $60,000). Funding is +0.01% every 8 hours.
- Per interval: 60,000 × 0.0001 = **$6** paid by you (long) to shorts.
- Per day (3 intervals): $18. Annualised: 0.01% × 3 × 365 ≈ **10.95%** of notional.
- At 10× leverage your margin is $6,000, so $18 a day is 0.3% of margin per day.

**2. Liquidation price (linear, isolated margin, fees ignored)**

Long: equity = Margin + (P − Entry) × Qty. Liquidation when equity = MMR × P × Qty.

:::formula
Long liquidation price = Entry × (1 − 1/L) ÷ (1 − MMR)
Short liquidation price = Entry × (1 + 1/L) ÷ (1 + MMR)
:::

**Worked example.** Long 1 BTC at $60,000, leverage L = 10, MMR = 0.5%.
- Margin = $6,000.
- Liquidation = 60,000 × 0.9 ÷ 0.995 = **$54,271** — a fall of only 9.5%.
- Check: at $54,271, equity = 6,000 − 5,729 = $271; maintenance = 0.005 × 54,271 = $271. ✓

Short 1 BTC at $60,000, L = 10, MMR = 0.5%:
- Liquidation = 60,000 × 1.1 ÷ 1.005 = **$65,672** — a rise of 9.45%.

At 25× leverage the long liquidates at 60,000 × 0.96 ÷ 0.995 ≈ $57,889, just 3.5% away. BTC moves of 3–5% in a day are common. Real venues add fees, tiered MMR and mark-price rules (verify per venue).

[[widget:leverage]]` },
      { h: 'India', md: `> [!india] As of Nov 2026 — verify all of this; the rules have been changing:
- Crypto is not legal tender in India, and there is no SEBI-regulated crypto derivatives market. SEBI does not regulate crypto exchanges.
- Gains on "virtual digital assets" are taxed at a flat 30% (plus surcharge and cess) with no set-off of losses against other income, and 1% TDS applies on transfers above thresholds (Income-tax Act provisions from 2022 — verify current law and thresholds).
- Virtual-asset service providers serving Indian users must register with FIU-IND under anti-money-laundering rules; FIU-IND has issued notices to offshore exchanges that were not registered (verify the current list of registered entities).
- Some Indian-registered platforms offer crypto futures; their regulatory status differs from SEBI-regulated F&O. Offshore leveraged platforms carry legal, tax and recovery risks for Indian residents.
Speak to a qualified tax adviser before trading crypto from India.` },
      { h: 'Common misconceptions', md: `- **"High leverage just means bigger profits."** It moves your liquidation price close to entry; small, normal moves wipe out the position.
- **"Isolated margin cannot lose more than margin."** Usually true for that position, but fees, funding and ADL still apply.
- **"Funding is negligible."** At elevated rates it can exceed your intraday edge.
- **"A big exchange is safe."** Platform failure, freezes and hacks have happened at large venues.` },
      { h: 'When it fails', md: `Example: you go long 0.5 BTC at $62,000 with 20× isolated leverage (margin $1,550, MMR 0.5%). Liquidation ≈ 62,000 × 0.95 ÷ 0.995 ≈ $59,196. Your stop is at $59,500, only 4% from entry. On a Sunday night a liquidation cascade drops mark price from $61,000 to $58,800 within two minutes; your stop slips through and the position is liquidated at about $59,200. You lose the full $1,550 plus fees. A slightly wider stop would not have helped; the leverage left no room.` },
      { h: 'Exercise', md: `1. Using the formulas, calculate long and short liquidation prices for BTC at $60,000 with leverage 3×, 10× and 25× (MMR 0.5%). Put them in a table.
2. Open [[chart:BTC:44:vwap,atr,vol]] and compare the ATR with the distance to each liquidation price.
3. Compute the daily funding cost of a $20,000 long at +0.03% per 8 hours.

**Journal prompt:** "Is my stop at least 2–3 ATR inside my liquidation price, and have I checked the legal and tax position for where I am trading?"` },
    ],
    check: [
      { q: 'You are long $40,000 notional of an ETH perp. Funding is +0.02% every 8 hours. What do you pay per day?', o: ['$8', '$24', '$80', '$2.40'], a: 1, why: 'Per interval = 40,000 × 0.0002 = $8; three intervals = $24 per day, paid by longs to shorts when funding is positive.' },
      { q: 'Long BTC at $50,000, 5× leverage, isolated, MMR 1%, fees ignored. What is the approximate liquidation price?', o: ['$40,000', '$40,404', '$45,000', '$49,500'], a: 1, why: 'Liquidation = 50,000 × (1 − 1/5) ÷ (1 − 0.01) = 40,000 ÷ 0.99 ≈ $40,404.' },
      { q: 'Which is the most important difference between CME Bitcoin futures and a perpetual on an offshore venue?', o: ['CME futures cannot go down', 'CME is a regulated, centrally cleared exchange with dated contracts; the offshore venue may lack regulatory oversight and client-money protections', 'Offshore perps have lower risk', 'There is no difference'], a: 1, why: 'Regulation and clearing affect custody, fraud and recourse risk. Market risk exists on both.' },
    ],
    refs: ['CME Group — Bitcoin and Ether futures specifications (cmegroup.com)', 'BitMEX — Perpetual contracts guide (bitmex.com)', 'Income Tax Department — Taxation of virtual digital assets, Section 115BBH and 194S (incometaxindia.gov.in)', 'FIU-IND — Registration of VDA service providers (fiuindia.gov.in)', 'European Securities and Markets Authority — MiCA (esma.europa.eu)'],
  },
  {
    id: 'l3-rates', module: 'L3-M8', level: 3, track: 'global', title: 'Bond futures and interest-rate derivatives', mins: 19,
    summary: 'Understand bond prices versus yields, duration and DV01, how bond and rate futures work in India and globally, and why rate moves matter to equity intraday traders.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `A bond is a loan you make to a government or company. It pays fixed interest (the **coupon**) and returns the principal at maturity. The **yield** is the return you earn if you buy at today's price and hold to maturity.

The most important rule: **bond prices and yields move in opposite directions.** If new bonds pay 7% and you hold an old bond paying 6.5%, nobody will pay full price for yours — its price falls until its yield matches the market.

Why should an equity intraday trader care? Because interest rates are the "gravity" of all asset prices. A sharp rise in the US 10-year Treasury yield or the Indian 10-year government bond (G-sec) yield can hit growth stocks, banks, NBFCs, real estate and the rupee on the same day. Even if you never trade a bond future, you should watch yields.` },
      { h: 'Intermediate view', md: `**Key instruments**

| Market | Instrument | Notes (verify specs) |
|---|---|---|
| India | Interest rate futures (IRF) on GoI bonds, NSE/BSE | Cash-settled futures on specific G-secs (e.g. 10-year); lower retail liquidity than equity F&O |
| India | Overnight index swaps (OIS) linked to MIBOR | OTC, interbank; reflect expected RBI policy path |
| US | Treasury futures on CME: 2-year (ZT), 5-year (ZF), 10-year (ZN), Ultra 10, 30-year bond (ZB), Ultra bond | Deeply liquid; physically delivered against a basket of eligible Treasuries |
| US | SOFR futures (CME) | Price = 100 − expected average SOFR; used to read Fed expectations |
| Europe | Bund (FGBL), Bobl, Schatz futures on Eurex | German government bond benchmarks |

**Duration and DV01**
- **Modified duration**: approximate % price change for a 1-percentage-point change in yield.
- **DV01** (dollar value of a basis point): the price change for a 1 basis-point (0.01%) move in yield. It is how rate traders size positions.

**Reading rate futures**: SOFR futures at 96.25 imply an expected average SOFR of 3.75% for the contract's reference period. Movements in these prices after US data releases tell you how markets repriced the Fed path — a key input for US equities.

**Intraday drivers**: inflation data (CPI), employment (US non-farm payrolls), central-bank decisions and minutes, auction results, and fiscal news (budget borrowing). In India: RBI policy, inflation prints, government borrowing calendars, and FPI debt flows (especially after Indian bonds' inclusion in global bond indices from 2024).` },
      { h: 'Advanced view', md: `**Cheapest-to-deliver (CTD).** US Treasury and Bund futures are deliverable against a basket of bonds. Each bond's price is adjusted by a **conversion factor**; the seller chooses the bond that is cheapest to deliver. The future therefore tracks the CTD bond, and its DV01 is roughly CTD DV01 ÷ conversion factor. If the CTD switches, the future's sensitivity changes.

**Curve trades.** Professionals often trade the *shape* of the yield curve: e.g. long 2-year futures and short 10-year futures in DV01-neutral ratios ("steepener"). A steepening or flattening curve can signal changing growth and policy expectations.

**Rates and equities intraday.** On US CPI days, equity index futures and Treasury futures often react within the same second. A hotter-than-expected print typically lifts yields (Treasury futures fall) and can pressure Nasdaq stocks more than value sectors because their valuations depend more on distant cash flows. This relationship is empirical-mixed and regime-dependent: in some periods stocks and bonds move together; in others they move opposite. See [[link:l4-intermarket]].

**India's IRF market** has historically had limited liquidity outside a few contracts; check open interest and spreads before trading. Most Indian equity traders use G-sec yields as an *input* rather than a traded market.

> [!warn] Bond futures look "low volatility" but are traded with high leverage. A 20 basis-point surprise can produce large losses on a leveraged futures position.` },
      { h: 'The maths', md: `**1. Price–yield approximation**

:::formula
ΔP ÷ P ≈ −Modified duration × Δy
DV01 ≈ Modified duration × Price × 0.0001
:::

A 10-year G-sec priced at ₹100 with modified duration 7.0. Yield rises from 6.40% to 6.55% (+15 bp).
- ΔP/P ≈ −7.0 × 0.0015 = −1.05% → price ≈ ₹98.95.
- DV01 per ₹100 face ≈ 7.0 × 100 × 0.0001 = ₹0.07.
- For ₹2 crore face value: DV01 ≈ ₹0.07 × 2,00,000 = ₹14,000 per basis point; a 15 bp move ≈ ₹2.1 lakh.

**2. SOFR future implied rate**

:::formula
Implied rate (%) = 100 − Futures price
:::

A SOFR future moves from 96.10 to 96.25 after weak US jobs data → implied rate falls from 3.90% to 3.75%, i.e. markets price about 15 bp more easing for that period.

**3. US 10-year note futures (ZN)** have a face value of $100,000 (verify). If the CTD DV01 is about $75 per $100,000 face and conversion factor about 0.9, futures DV01 ≈ 75 ÷ 0.9 ≈ $83 per contract per basis point (illustrative).` },
      { h: 'India', md: `> [!india] A practical routine: note the Indian 10-year G-sec yield and the US 10-year Treasury yield every morning. On days when the US 10-year rises more than about 10 bp overnight, watch rate-sensitive Indian sectors (banks, NBFCs, real estate) and the rupee at the open. Inclusion of Indian government bonds in global bond indices (from 2024) has made foreign debt flows a more visible driver of Indian yields (verify current index status).` },
      { h: 'US & global', md: `> [!us] US data releases at 08:30 ET (CPI, payrolls, retail sales) fall at 19:00 IST in US winter and 18:00 IST in US summer — during MCX and GIFT Nifty trading and before the US cash open. Treasury futures and SOFR futures react first; equity index futures follow. For a trader in India, these releases are often the main overnight driver of the next morning's GIFT Nifty.` },
      { h: 'Common misconceptions', md: `- **"Bonds are always safe."** Long-duration bonds can fall sharply when yields rise, as in 2022.
- **"A higher bond price means higher yield."** It is the reverse.
- **"Stocks and bonds always move opposite."** Their correlation changes with the inflation and policy regime.
- **"Rates matter only for bond traders."** Yields affect every valuation and FPI flow.` },
      { h: 'When it fails', md: `Example: you buy 10 lots of a GoI IRF expecting a rate cut at the RBI policy. The RBI cuts as expected, but its commentary signals a long pause. Yields *rise* 12 bp as markets price fewer future cuts. With an illustrative DV01 of ₹400 per lot, the loss is 12 × 400 × 10 = ₹48,000. The event outcome matched the forecast; the reaction did not. Rate markets trade expectations, not headlines.` },
      { h: 'Exercise', md: `1. For a bond with modified duration 5 and price 100, compute the price change for +25 bp and −25 bp.
2. Write the 08:30 ET US data release time in IST for both summer and winter in your routine notes.
3. Watch one US CPI release in the simulator or by noting prices: record the move in US 10-year yields, Nasdaq futures and GIFT Nifty in the first 15 minutes.

**Journal prompt:** "Which of my sectors are rate-sensitive, and what yield move overnight would make me reduce size?"` },
    ],
    check: [
      { q: 'A bond has modified duration 6 and price 100. Yield falls by 20 bp. Approximately what happens to price?', o: ['Falls 1.2%', 'Rises 1.2%', 'Rises 0.12%', 'Rises 12%'], a: 1, why: 'ΔP/P ≈ −6 × (−0.002) = +1.2%. Yields down means prices up.' },
      { q: 'A SOFR future trades at 95.80. What average SOFR does it imply for its reference period?', o: ['95.80%', '4.20%', '5.80%', '0.42%'], a: 1, why: 'Implied rate = 100 − 95.80 = 4.20%.' },
      { q: 'The RBI cuts rates as widely expected but signals no further cuts. Bond yields rise. Why?', o: ['The cut was a mistake', 'Markets trade the expected path of rates; the guidance removed expected future cuts', 'Bonds always rise on cuts', 'Yields move only on inflation data'], a: 1, why: 'Prices reflect expectations. Guidance about the future path can outweigh the current decision.' },
    ],
    refs: ['CME Group — Treasury futures and SOFR futures specifications (cmegroup.com)', 'NSE — Interest rate futures (nseindia.com)', 'RBI — Monetary policy statements (rbi.org.in)', 'Frank Fabozzi — Bond Markets, Analysis and Strategies (book)', 'Eurex — Bund futures specifications (eurex.com)'],
  },
  );

  /* ============================ L4-M4 Advanced market analysis ============================ */
  IA.content.lessons.push(
  {
    id: 'l4-intermarket', module: 'L4-M4', level: 4, track: 'global', title: 'Intermarket analysis and sector rotation', mins: 22,
    summary: 'Use relationships between equities, bonds, currencies and commodities, and relative strength across sectors, as context for intraday bias and instrument selection.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `No market moves in isolation. Stocks, bonds, currencies and commodities are linked through money flows, interest rates, inflation and growth expectations. **Intermarket analysis** studies these links to understand the backdrop for the market you trade.

**Sector rotation** is the observation that, as economic conditions change, money tends to move between sectors — for example from defensive sectors (FMCG, pharma) to cyclical ones (metals, autos, banks) when growth expectations improve, and back when they worsen.

For an intraday trader, the use is practical: if banks are leading and IT is lagging today, a long setup in a strong bank stock has the wind behind it, while the same setup in a weak IT stock fights the tide. You are not forecasting the economy; you are choosing where to point your setups.` },
      { h: 'Intermediate view', md: `**Classic relationships** (tendencies, not laws):

| If… | Often associated with… | Indian intraday angle |
|---|---|---|
| US 10-year yield rises sharply | Pressure on high-valuation growth stocks; stronger dollar | IT and new-age tech under pressure; FPI selling risk |
| Crude oil spikes | Higher inflation expectations; weaker rupee | Oil marketing companies, paints, aviation, tyres weaker; upstream oil producers stronger |
| Dollar Index (DXY) strengthens | Emerging-market currencies weaker; commodity prices in USD softer | USD/INR up; IT exporters may outperform |
| Copper and metals rise | Growth optimism (especially China) | Metal stocks lead |
| Gold rises with falling real yields | Easier policy expectations | Gold financiers, jewellers |

**Relative strength (RS) for sector rotation**

:::formula
RS line = Sector index ÷ Benchmark index
:::

Plot Nifty Bank ÷ Nifty 50. A rising line means banks are outperforming. On an intraday chart, compare each sector's % change from the open against Nifty's.

**A simple intraday rotation routine:**
1. At 09:45 and 11:00 IST, rank sectoral indices (Bank, IT, Auto, Metal, FMCG, Pharma, Energy, Realty, PSU Bank) by % change from the open and versus VWAP.
2. Long setups preferred in the top two sectors; short setups in the bottom two.
3. Inside the leading sector, pick stocks showing RS vs the sector itself.
4. Check whether the leadership has an intermarket explanation (yields, crude, rupee, news).` },
      { h: 'Advanced view', md: `**Regime dependence.** The stock–bond correlation is a prime example. In low-inflation periods, bonds often rallied when equities fell (negative correlation), acting as a hedge. In high-inflation regimes, like 2022, both can fall together as rising inflation lifts yields and hurts equities. Any intermarket rule must be tagged with the regime it worked in. See [[link:l4-regimes]].

**Lead–lag claims.** Popular frameworks claim bonds lead stocks, or copper leads equities. Some relationships hold for periods; none is stable enough to trade mechanically.

> [!evidence] Momentum in sector and industry returns has research support across many markets (e.g. Moskowitz and Grinblatt on industry momentum), mostly over multi-month horizons. Intraday sector leadership persistence is less studied; treat it as empirical-mixed and test it on your own data.

**Business-cycle rotation models** (early cycle: financials, consumer discretionary; mid: industrials, tech; late: energy, materials; recession: staples, utilities, healthcare) are a useful vocabulary but a subjective framework when used for timing — cycles are identified clearly only in hindsight.

**Breadth inside sectors.** A sector index can rise on one heavyweight. Check how many constituents are above VWAP. For Nifty Bank, two or three stocks dominate the weighting; a Bank Nifty rally led only by HDFC Bank is different from a broad bank rally.

**Currency translation for FPIs.** A foreign investor's return on Nifty is local return combined with the rupee move. A falling rupee can trigger FPI selling in large caps even when local fundamentals are unchanged.` },
      { h: 'The maths', md: `**Intraday relative-strength ranking (illustrative numbers)**

At 11:00 IST, % change from open: Nifty +0.40%. Bank +0.85%, IT −0.30%, Metal +1.10%, FMCG +0.05%, Auto +0.45%.

:::formula
Relative performance = Sector % − Benchmark %
:::

- Metal: +0.70 pp; Bank: +0.45 pp; Auto: +0.05 pp; FMCG: −0.35 pp; IT: −0.70 pp.
- Leaders: Metal, Bank. Laggards: IT, FMCG.

Intermarket check: copper up 1.5% overnight on China stimulus news (explains Metal); US 10-year yield up 8 bp (consistent with IT weakness). Leadership has a plausible driver, which makes it more likely to be meaningful today — not certain.

**Beta-adjusted RS.** A high-beta sector should outperform in an up-move just by beta. If Metal's beta to Nifty is about 1.5, its "expected" move is 1.5 × 0.40 = 0.60%; actual +1.10% → excess ≈ +0.50 pp. Betas are unstable; use them only as rough context.` },
      { h: 'India', md: `> [!india] Sector indices to monitor on NSE: Nifty Bank, Nifty Financial Services, Nifty IT, Nifty Auto, Nifty Metal, Nifty FMCG, Nifty Pharma, Nifty Energy, Nifty Realty, Nifty PSU Bank. Open [[chart:BANKNIFTY:63:vwap,ema20,vol]] and [[chart:NIFTY:63:vwap,ema20,vol]] together. If Bank Nifty is above VWAP and making higher highs while Nifty is flat, banks are leading; your long setups in leading banks start with an advantage, but you still need your normal trigger and stop.` },
      { h: 'Common misconceptions', md: `- **"Intermarket relationships are fixed."** They change with inflation, policy and risk regimes.
- **"The leading sector at 09:30 will lead all day."** Leadership can rotate within the session.
- **"Sector rotation tells me what to buy."** It tells you where to *look* for your setups.
- **"Correlation means one market causes the other."** Both may respond to a third driver.` },
      { h: 'When it fails', md: `Example: at 10:00 IST IT is the strongest sector after a weak rupee. You buy an IT stock breakout at ₹1,640 with a ₹12 stop, 300 shares. At 11:30 the RBI is reported to be selling dollars; the rupee strengthens sharply; IT reverses. Your stop is hit for −₹3,600 (1R), and IT finishes as the weakest sector. The intermarket driver reversed, and so did the leadership. The process was sound; the outcome was a normal loss.` },
      { h: 'Exercise', md: `1. For five sessions, record a sector RS ranking at 09:45 and 11:00 IST, plus the intermarket driver you think explains the leaders.
2. Note whether the 09:45 leaders were still leading at 15:00.
3. Restrict simulator long setups to the top two sectors for one week and compare results with your usual approach (small sample — treat as observation, not proof).

**Journal prompt:** "Which intermarket driver explained today's leadership, and when did it change?"` },
    ],
    check: [
      { q: 'At 11:00 IST, Nifty is +0.5%, Nifty IT is −0.2% and Nifty Bank is +0.9%. US 10-year yields rose 10 bp overnight. Where should a trader using sector rotation look for long setups?', o: ['IT stocks, because they are cheap', 'Leading bank stocks with their own setups and stops', 'Any stock — sectors do not matter', 'Only Nifty options'], a: 1, why: 'Banks are leading; IT is lagging with a plausible driver (higher yields). Rotation narrows where you look; you still need a setup.' },
      { q: 'In which environment is the stock–bond correlation most likely to turn positive (both falling together)?', o: ['Low and stable inflation', 'Rising inflation that pushes yields up', 'Falling interest rates', 'Never'], a: 1, why: 'When inflation drives yields higher, bond prices fall and equity valuations also suffer, so both can fall together, as in 2022.' },
      { q: 'A sector with beta 1.5 to Nifty rises 0.9% while Nifty rises 0.6%. What is its approximate beta-adjusted excess return?', o: ['+0.3 pp', '0 pp', '+0.9 pp', '−0.3 pp'], a: 1, why: 'Expected = 1.5 × 0.6 = 0.9%; actual 0.9% → excess ≈ 0. Raw outperformance was only beta.' },
    ],
    refs: ['John J. Murphy — Intermarket Analysis (book)', 'Moskowitz & Grinblatt — Do Industries Explain Momentum? (Journal of Finance, 1999)', 'NSE Indices — Sectoral indices (niftyindices.com)', 'Sam Stovall — Standard & Poor\'s Guide to Sector Investing (book)'],
  },
  {
    id: 'l4-regimes', module: 'L4-M4', level: 4, track: 'global', title: 'Volatility regimes and correlation breakdowns', mins: 22,
    summary: 'Classify the current volatility regime with simple measures, adjust size and strategy selection to it, and recognise when correlations you rely on are breaking down.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `Markets have moods. Some weeks are calm, with small ranges and gentle trends. Others are violent, with big gaps and sudden reversals. These moods are **volatility regimes**, and they tend to persist for a while — calm follows calm, storm follows storm. This persistence is called **volatility clustering**.

Why it matters: a strategy and a stop size that suit a calm market can be destroyed in a volatile one, and vice versa. If you risk the same number of points in both, your actual risk changes dramatically.

**Correlation breakdown** is the related idea that relationships between markets — for example "IT moves with the US Nasdaq" or "gold rises when stocks fall" — are not fixed. They can weaken or even reverse, often exactly when you most need them, in stress.` },
      { h: 'Intermediate view', md: `**Measuring the regime**

| Measure | What it tells you | Simple rule of thumb |
|---|---|---|
| India VIX / CBOE VIX | Options-implied 30-day volatility | Compare to its own 1-year range; high percentile = high-vol regime |
| ATR(14) on daily chart | Realised daily range | ATR vs its 100-day average |
| Realised volatility (std. dev. of returns) | Recent actual movement | 20-day vs 100-day |
| Opening-range size | Intraday behaviour | Today's first-30-minute range vs 20-day average |

**A three-bucket regime model** (a framework, not a law):
1. **Low vol** — ATR below its 100-day average, VIX in the lower third of its range. Ranges are tight; breakouts fail more often; mean-reversion setups around VWAP may suit better.
2. **Normal vol** — around average. Your standard playbook.
3. **High vol** — ATR well above average, VIX elevated. Larger gaps, faster moves, wider spreads. Trend and momentum setups may work; mean-reversion can be dangerous.

**Adjusting execution:**
- **Size by volatility:** keep rupee risk constant by widening stops in points and reducing quantity.
- **Fewer trades** in high vol; slippage and emotional pressure rise.
- **Check correlations** before relying on hedges or cross-market cues.

[[chart:NIFTY:71:atr,bb,vol]]` },
      { h: 'Advanced view', md: `**Volatility clustering and GARCH.** Statistical models such as GARCH formalise the observation that large moves tend to follow large moves. They forecast near-term volatility better than a constant, but not precisely; regime shifts often begin with an unexpected shock.

**Implied vs realised.** When implied volatility (VIX) is well above recent realised volatility, options are pricing fear of future moves. When implied is below realised, options may be cheap relative to recent movement. This spread is a core input for options traders. See [[link:l3-iv]].

**Correlation breakdowns.** Two common patterns:
1. *Correlations go to one in a crisis.* Diversification across stocks and sectors shrinks when panic selling hits everything.
2. *Hedge relationships flip.* The stock–bond hedge failed in 2022. Gold has sometimes fallen with equities during liquidity scrambles.

Measure with **rolling correlation** (e.g. 20-day and 60-day). If the short window diverges sharply from the long window, treat the relationship as unstable.

**Regime detection lags.** Every regime measure is backward-looking. By the time ATR confirms a high-vol regime, the first big move has happened. Some traders use a faster measure (opening-range size, intraday VIX change) as an early warning and a slower one for confirmation.

> [!evidence] Volatility clustering is an established empirical feature of financial returns. Specific regime-switch rules for strategy selection are empirical-mixed and should be tested on your own data.` },
      { h: 'The maths', md: `**1. Volatility-adjusted position size**

:::formula
Quantity = Rupee risk ÷ (Stop distance in points × Point value)
Stop distance = k × ATR
:::

Capital ₹10 lakh, risk 0.5% = ₹5,000. Trading a stock with k = 1.5.
- Normal regime: 5-minute ATR = ₹4 → stop ₹6 → quantity = 5,000 ÷ 6 ≈ 833 shares.
- High-vol regime: 5-minute ATR = ₹9 → stop ₹13.5 → quantity = 5,000 ÷ 13.5 ≈ 370 shares.
Risk in rupees stays the same; quantity falls by more than half.

**2. Annualising VIX to a daily move**

:::formula
Expected 1-day move ≈ Index × (VIX ÷ 100) ÷ √252
:::

Nifty 25,000, India VIX 16 → 25,000 × 0.16 ÷ 15.87 ≈ **252 points** (one standard deviation, implied). At India VIX 25 → ≈ 394 points.

**3. Rolling correlation shift (illustrative):** 60-day correlation of Nifty IT with Nasdaq = 0.55; 20-day = 0.10. The recent relationship has weakened; cross-market cues for IT deserve less weight.

[[widget:position-size]]` },
      { h: 'India', md: `> [!india] India VIX is computed by NSE from Nifty option prices and represents expected 30-day volatility in annualised terms. Before major events — Union Budget, election results, RBI policy — India VIX often rises and then drops after the event (an IV crush). On election-result days, intraday ranges in Nifty have been several times normal. Pre-commit to a regime rule: for example, "If India VIX is above its 80th percentile of the past year, I trade half size and only trend setups."` },
      { h: 'Common misconceptions', md: `- **"VIX predicts direction."** It measures expected magnitude, not direction.
- **"Correlations are stable enough to hedge with."** They are least stable when you need the hedge most.
- **"Wider stops in high volatility mean more risk."** Only if you do not reduce quantity.
- **"Low volatility is safe."** Low-vol regimes can end with abrupt, large moves.` },
      { h: 'When it fails', md: `Example: India VIX has been near the bottom of its range for weeks, and you run a VWAP mean-reversion short on Nifty futures with a tight 30-point stop. A surprise global event produces a 300-point gap-up and continuation. Your stop slips by 40 points; you lose 70 × 65 = ₹4,550, more than double the plan. Low-vol regimes end suddenly, and the first move of a new regime often punishes the strategy that suited the old one.` },
      { h: 'Exercise', md: `1. Calculate today's Nifty 1-day implied move from India VIX and compare it with the actual range at the close.
2. Classify the last 20 sessions into low, normal or high regime using ATR vs its 100-day average.
3. Re-run your position-size calculation for one setup in each regime using the widget.

**Journal prompt:** "Which regime am I in, what did I change because of it (size, setups, trade count), and which correlation did I rely on today?"` },
    ],
    check: [
      { q: 'Nifty is at 24,000 and India VIX is 20. What is the approximate one-standard-deviation 1-day implied move?', o: ['About 120 points', 'About 302 points', 'About 480 points', 'About 4,800 points'], a: 1, why: '24,000 × 0.20 ÷ √252 ≈ 24,000 × 0.20 ÷ 15.87 ≈ 302 points.' },
      { q: 'ATR doubles versus last month. To keep rupee risk the same with an ATR-based stop, what should you do?', o: ['Keep quantity the same', 'Roughly halve quantity', 'Double quantity', 'Remove the stop'], a: 1, why: 'Stop distance doubles, so quantity must roughly halve to keep risk per trade constant.' },
      { q: 'The 60-day correlation between two markets is 0.6 and the 20-day correlation is −0.1. What is the most reasonable interpretation?', o: ['The long-term relationship is confirmed', 'The relationship is unstable recently; reduce reliance on it for cues or hedges', 'Correlation does not matter', 'The markets will soon re-correlate'], a: 1, why: 'A sharp divergence between short and long windows signals instability; treat cross-market inferences cautiously.' },
    ],
    refs: ['Robert Engle — Autoregressive Conditional Heteroscedasticity (Econometrica, 1982)', 'Tim Bollerslev — Generalized ARCH (Journal of Econometrics, 1986)', 'NSE — India VIX methodology (nseindia.com)', 'Cboe — VIX white paper (cboe.com)', 'Euan Sinclair — Volatility Trading (book)'],
  },

  {
    id: 'l4-gex', module: 'L4-M4', level: 4, track: 'deriv', title: 'Open-interest analysis, gamma exposure and expiry behaviour', mins: 24,
    summary: 'Interpret changes in futures and options open interest, estimate gamma exposure with explicit model assumptions, and understand how dealer hedging may influence expiry-day behaviour.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `**Open interest (OI)** is the number of derivative contracts that are open — created and not yet closed or expired. Volume counts trades; OI counts outstanding positions. If a buyer and seller both open new positions, OI rises by one contract. If both close, it falls by one.

OI tells you how much positioning exists, not who is right. Combined with price, it gives clues about whether new money is entering or old positions are being closed.

**Gamma exposure (GEX)** is a more advanced idea. Option dealers (market makers) usually hedge their option positions by buying or selling the underlying. How much they must hedge changes as price moves, depending on the options' **gamma**. If dealers are, in aggregate, long gamma, their hedging tends to *dampen* moves (they sell rallies and buy dips). If they are short gamma, their hedging can *amplify* moves (they buy rallies and sell dips).

> [!warn] Nobody outside the dealers knows their actual positions. Every public GEX number is an **estimate based on assumptions**. Treat it as a model-dependent hypothesis, not a fact.` },
      { h: 'Intermediate view', md: `**Price–OI matrix for futures** (a classic interpretation — subjective but widely used):

| Price | OI | Common interpretation |
|---|---|---|
| Up | Up | Long build-up (new longs) |
| Down | Up | Short build-up (new shorts) |
| Up | Down | Short covering |
| Down | Down | Long unwinding |

Caveats: every contract has a buyer and a seller, so "new longs" always come with "new shorts". The label describes which side was more aggressive, inferred from price.

**Option chain OI** (see [[link:l3-chain]]):
- High call OI at a strike is often read as resistance (call writers defending), high put OI as support. This is a popular heuristic, not an established rule — subjective.
- **Change in OI** during the day is more informative than absolute OI.
- **PCR** (put–call ratio of OI) is a sentiment gauge with mixed evidence.

**Gamma exposure basics**
- Gamma is highest for at-the-money options and increases sharply as expiry approaches.
- Standard GEX models assume dealers are **long calls and short puts** sold by customers — or the reverse — and sum gamma × OI across strikes with a sign. Different assumptions produce different, sometimes opposite, results.
- The **"gamma flip" level** is the price at which estimated net GEX changes sign. Above it the model says dealers are long gamma (dampening); below it, short gamma (amplifying).

**How some traders use it:** in an estimated positive-GEX environment they favour mean-reversion around large-OI strikes; in negative GEX they expect larger ranges and favour trend setups. These are hypotheses to test.` },
      { h: 'Advanced view', md: `**Why assumptions dominate.** In India, a large share of index option volume comes from proprietary traders and retail, and many option *sellers* are not dealers. In the US, retail and institutions both buy and sell options, and 0DTE flows change through the day. The standard dealer-positioning assumption can simply be wrong, and the sign of GEX depends on it.

> [!evidence] Academic and practitioner work suggests that dealer hedging of options can affect intraday volatility of the underlying, particularly near expiry. However, published GEX levels from data vendors rely on assumptions about who holds which side; they are model-dependent estimates, and their predictive value is empirical-mixed at best.

**Expiry behaviour.**
- **Pinning:** prices sometimes gravitate towards high-OI strikes near expiry, possibly because of hedging by long-gamma holders. This is debated; it does not happen reliably.
- **Gamma explosion:** short-gamma positions near expiry can force rapid hedging, accelerating moves through a strike.
- **Max pain** — the strike where option buyers collectively lose most — is a popular idea with weak support; treat it as subjective.

**Regulatory context in India.** SEBI introduced measures from late 2024 to curb expiry-day speculation in index derivatives — fewer weekly expiries per exchange, larger contract sizes, upfront collection of option premium, and removal of calendar-spread margin benefit on expiry day (verify current circulars on sebi.gov.in). Expiry-day patterns from earlier years may not apply now.

**Vanna and charm.** Beyond gamma, dealer hedges change with implied volatility (vanna) and with time (charm). Late-day drifts on expiry are sometimes attributed to charm flows. These are speculative explanations; useful vocabulary, not tradable rules.` },
      { h: 'The maths', md: `**1. Gamma exposure at one strike (per 1% move)**

:::formula
GEX(strike) = Gamma × OI (contracts) × Lot size × Spot² × 0.01 × Sign
Sign = +1 for calls, −1 for puts (under the "dealers long calls, short puts" assumption)
:::

Nifty spot 25,000, lot 65 (verify current lot). At the 25,000 call: OI = 1,00,000 contracts, gamma = 0.0008 per point per unit.
- Units = 1,00,000 × 65 = 65 lakh.
- Delta change per 1% move (250 points) = 0.0008 × 250 = 0.20 per unit.
- Hedge change = 0.20 × 65 lakh = 13 lakh units of Nifty.
- In rupees = 13,00,000 × 25,000 = ₹3,250 crore per 1% move.
- Formula check: 0.0008 × 1,00,000 × 65 × 25,000² × 0.01 = ₹3.25 × 10¹⁰ = ₹3,250 crore ✓.

If the 25,000 put has OI 80,000 and the same gamma, its GEX = −₹2,600 crore under the same assumption. Net at this strike = +₹650 crore.

**Flip the assumption** (dealers short calls, long puts) and the net becomes −₹650 crore. The number's sign depends entirely on positioning you cannot observe — this is why GEX estimates are model-dependent.

**2. Price–OI classification (worked)**
Bank Nifty futures: 09:30 price 52,100, OI 18.0 lakh units; 11:30 price 51,750, OI 19.6 lakh. Price −0.67%, OI +8.9% → classic reading: short build-up. Caveat: it is a description of the session, not a forecast.

[[widget:greeks]]` },
      { h: 'India', md: `> [!india] On a Nifty weekly expiry day (Tuesday as of Nov 2026 — verify on NSE), watch:
1. The strikes with the largest call and put OI near spot, and how OI changes from 09:15 to 13:00.
2. Whether price is above or below the largest put/call OI strikes.
3. Your own options' gamma: a ₹10 option can become ₹60 or ₹0 within an hour.
4. Size: SEBI's expiry-day measures and higher lot values mean your risk per lot is larger than in earlier years.
Use [[chart:NIFTY:88:vwap,vol]] in the chart lab to rehearse an expiry afternoon and mark hypothetical high-OI strikes.` },
      { h: 'US & global', md: `> [!us] In the US, SPX and SPY options now have expiries every trading day, and 0DTE options account for a large share of SPX option volume (verify current data on cboe.com). Several vendors publish daily GEX estimates for SPX. Their assumptions about customer versus dealer positioning differ, so two vendors can show different flip levels on the same day. Read each vendor's methodology before using any number.` },
      { h: 'Common misconceptions', md: `- **"High call OI is a wall price cannot cross."** It is a heuristic; walls break often, sometimes with acceleration as hedges flip.
- **"GEX tells me what dealers hold."** It estimates it from assumptions.
- **"Rising OI with rising price is bullish."** It describes aggressive buying today; it does not forecast tomorrow.
- **"Max pain predicts the expiry close."** Evidence is weak; treat it as subjective.` },
      { h: 'When it fails', md: `Example: Nifty is at 25,050 on expiry morning with the largest call OI at 25,100. You sell 2 lots of the 25,100 call at ₹45, expecting the "wall" to hold. At 13:30 a large buyer lifts Nifty through 25,100; call writers cover, adding to the move; Nifty reaches 25,230. The call trades at ₹135. Loss = (135 − 45) × 65 × 2 = ₹11,700. The OI heuristic failed precisely through the hedging mechanism that was supposed to support it.` },
      { h: 'Exercise', md: `1. Using the formula, compute GEX at three strikes from an option chain snapshot (real or simulated), first under "dealers long calls, short puts" and then reversed. Note how the net sign changes.
2. On three sessions, classify Bank Nifty futures each hour with the price–OI matrix and compare with the next hour's price change. Treat as observation.
3. Use the Greeks widget to see how gamma of an ATM option changes from 5 days to 1 day to expiry.

**Journal prompt:** "Which assumption did my OI or GEX reading depend on, and what price action would show it was wrong today?"` },
    ],
    check: [
      { q: 'Bank Nifty futures fall 0.8% while OI rises 7%. What does the classic price–OI matrix label this, and what is the main caveat?', o: ['Long build-up; it guarantees a rally', 'Short build-up; it describes aggressive selling with new positions but does not forecast the next move', 'Short covering; it means shorts are exiting', 'Long unwinding; OI must fall'], a: 1, why: 'Price down with OI up is labelled short build-up. Every new contract has both a buyer and a seller, so it is a description of aggression, not a forecast.' },
      { q: 'An estimated net GEX at a strike is +₹500 crore under the assumption that dealers are long calls and short puts. If the true positioning is the opposite, what happens to the estimate?', o: ['It stays +₹500 crore', 'It becomes about −₹500 crore', 'It doubles', 'It becomes zero'], a: 1, why: 'Reversing the sign assumption reverses each strike\'s contribution, flipping the net. This shows why GEX is model-dependent.' },
      { q: 'Why does gamma risk on short options increase sharply on expiry day?', o: ['Theta falls to zero', 'Gamma of at-the-money options rises sharply as time to expiry shrinks', 'OI always rises on expiry', 'Lot sizes change on expiry'], a: 1, why: 'Near expiry, ATM option delta changes very fast with small price moves, so short-gamma positions lose quickly when price moves through the strike.' },
    ],
    refs: ['Cboe — Options volume and 0DTE data (cboe.com)', 'NSE — Option chain and open interest data (nseindia.com)', 'SEBI — Measures to strengthen equity index derivatives framework, circular Oct 2024 (sebi.gov.in)', 'Sheldon Natenberg — Option Volatility and Pricing (book)', 'Ni, Pearson & Poteshman — Stock price clustering on option expiration dates (Journal of Financial Economics, 2005)'],
  },
  );

  /* ============================ Module assessment questions ============================ */
  IA.content.questions.push(
    {"id":"L2-M5-q01","module":"L2-M5","d":1,"q":"What does the disposition effect describe?","o":["Holding winners too long","Trading only in the morning","Preferring index options to stocks","Selling winners too early and holding losers too long"],"a":3,"why":"The disposition effect is the tendency to realise gains quickly and keep losing positions open, hoping they recover."},
    {"id":"L2-M5-q02","module":"L2-M5","d":2,"q":"Your setup expectancy with rules followed is 0.40 × 2.5R − 0.60 × 1R. You start cutting winners at 1.5R. What is the new expectancy if win rate is unchanged?","o":["+0.40R","+0.30R","0.00R","−0.10R"],"a":2,"why":"Original = 1.00 − 0.60 = +0.40R. New = 0.40 × 1.5 − 0.60 × 1 = 0.60 − 0.60 = 0R. Early exits erased the edge."},
    {"id":"L2-M5-q03","module":"L2-M5","d":2,"q":"You are long Reliance at ₹1,452 and say \"it was ₹1,500 yesterday, so it must come back\". Which bias is this?","o":["Recency bias","Anchoring","Herding","Hindsight bias"],"a":1,"why":"Judging value against a remembered reference price is anchoring. Today's structure, not yesterday's number, should define your trade."},
    {"id":"L2-M5-q04","module":"L2-M5","d":2,"q":"Which journal metric best separates execution problems from strategy problems?","o":["Rule-adherence percentage alongside R per setup","Total P&L","Number of trades","Largest winner"],"a":0,"why":"With high adherence, poor results point to the strategy; with low adherence, you have not actually tested the strategy."},
    {"id":"L2-M5-q05","module":"L2-M5","d":3,"q":"A setup has per-trade SD of 1.5R and expectancy +0.2R. Over 25 trades, what is the approximate SD of the total?","o":["1.5R","5R","37.5R","7.5R"],"a":3,"why":"SD of the sum = 1.5 × √25 = 7.5R, far larger than the expected +5R, so a losing 25-trade stretch is quite plausible."},
    {"id":"L2-M5-q06","module":"L2-M5","d":2,"q":"You are long Bank Nifty futures 1 lot (30 units) at 52,000, stop 51,950. Price drops to 51,955 and you feel the urge to move the stop to 51,850. What does a well-designed rule set say?","o":["Move it — the level is close to support","Add a second lot to average down","Keep the stop; widening it is a rule violation driven by loss aversion","Close half and move the rest"],"a":2,"why":"Widening the stop under pressure is loss aversion in action. The stop was set when you were objective; honour it."},
    {"id":"L2-M5-q07","module":"L2-M5","d":2,"q":"After three losses before 10:30, which circuit breaker is the most appropriate?","o":["Double size to recover","A pre-set break away from the screen, then reduced size only on playbook setups","Switch to a different instrument","Trade without stops"],"a":1,"why":"Consecutive-loss rules interrupt the tilt cycle early, when it is cheapest to stop it."},
    {"id":"L2-M5-q08","module":"L2-M5","d":2,"q":"Your account is down 12%. What gain is needed to recover?","o":["About 13.6%","12%","About 10.7%","24%"],"a":0,"why":"Gain needed = 0.12 ÷ 0.88 ≈ 13.6%."},
    {"id":"L2-M5-q09","module":"L2-M5","d":1,"q":"Which statement about discipline is correct?","o":["Discipline guarantees profit","Discipline matters only for beginners","Discipline means trading every day","Discipline makes your results reflect your strategy; it does not create an edge"],"a":3,"why":"A disciplined trader with a negative-expectancy method still loses. Discipline makes results interpretable."},
    {"id":"L2-M5-q10","module":"L2-M5","d":3,"q":"A trader broke three rules in a trade that won 3R and followed all rules in a trade that lost 1R. In the decision–outcome grid, which trade needs the most attention?","o":["The losing trade","Neither","The winning rule-breaking trade, because it reinforces bad behaviour","Both equally"],"a":2,"why":"Bad decision, good outcome is the most dangerous cell: it rewards rule-breaking."},
    {"id":"L2-M5-q11","module":"L2-M5","d":2,"q":"Which pre-market plan entry is the most useful?","o":["\"Market looks bullish.\"","\"If Nifty holds above 25,100 after 09:30 and stays above VWAP, look for pullback longs; below 25,000, no longs before 10:30.\"","\"Trade carefully today.\"","\"Target ₹10,000 profit.\""],"a":1,"why":"A conditional, checkable plan supports execution without forcing a forecast or a P&L target."},
    {"id":"L2-M5-q12","module":"L2-M5","d":1,"q":"Your sleep and stress score is 2/5 this morning. What is the best routine response?","o":["Reduce size or skip trading as pre-committed","Trade normally","Trade more to finish early","Use higher leverage"],"a":0,"why":"The state check exists to adjust risk on impaired days."},
    {"id":"L2-M6-q01","module":"L2-M6","d":1,"q":"What is the NBBO?","o":["The best bid and offer on NYSE only","The closing auction price","A dark-pool price","The highest displayed bid and lowest displayed offer across US exchanges"],"a":3,"why":"The National Best Bid and Offer consolidates displayed quotes across exchanges."},
    {"id":"L2-M6-q02","module":"L2-M6","d":2,"q":"NBBO is $30.10 × $30.14. Your market buy fills at $30.13. What is the price improvement per share and the effective spread?","o":["$0.03 improvement; effective spread $0.04","No improvement; effective spread $0.04","$0.01 improvement; effective spread $0.02","$0.01 improvement; effective spread $0.06"],"a":2,"why":"Improvement = 30.14 − 30.13 = $0.01. Midpoint = $30.12; effective spread = 2 × (30.13 − 30.12) = $0.02."},
    {"id":"L2-M6-q03","module":"L2-M6","d":1,"q":"Which disclosure rule requires US brokers to report where they route orders and PFOF received?","o":["Rule 605","Rule 606","Rule 611","Rule 201"],"a":1,"why":"Rule 606 covers broker routing disclosures. Rule 605 covers execution quality; 611 is order protection; 201 is the short-sale restriction."},
    {"id":"L2-M6-q04","module":"L2-M6","d":2,"q":"In August, at what IST time does the US regular session open?","o":["19:00","18:00","20:00","21:00"],"a":0,"why":"In August the US is on EDT (UTC−4), 9.5 hours behind IST. 09:30 ET = 19:00 IST."},
    {"id":"L2-M6-q05","module":"L2-M6","d":2,"q":"You plan $200 risk on 400 shares. The premarket spread is $0.20. What fraction of your risk does a round-trip spread cost consume?","o":["10%","20%","80%","40%"],"a":3,"why":"Round trip = 400 × 0.20 = $80, which is 40% of $200."},
    {"id":"L2-M6-q06","module":"L2-M6","d":2,"q":"What did the SEC approve in April 2026 regarding the pattern-day-trader rule?","o":["Raising the minimum to $50,000","Banning day trading in margin accounts","Eliminating the PDT definition and $25,000 minimum in favour of risk-based intraday margin, with broker timing varying","Applying PDT to cash accounts"],"a":2,"why":"FINRA's proposal replaced PDT with risk-based intraday margin standards; implementation depends on each broker."},
    {"id":"L2-M6-q07","module":"L2-M6","d":2,"q":"You are short an in-the-money US single-stock call at expiry and do nothing. What is the most likely result?","o":["Cash settlement of the difference","Assignment: you deliver (become short) 100 shares per contract","The option expires worthless","Your broker converts it to a put"],"a":1,"why":"US single-stock options are physically settled; in-the-money options are generally exercised, so short calls are assigned."},
    {"id":"L2-M6-q08","module":"L2-M6","d":1,"q":"What is the settlement cycle for US equities as of Nov 2026?","o":["T+1","T+0","T+2","T+3"],"a":0,"why":"US equities moved to T+1 settlement in May 2024."},
    {"id":"L2-M6-q09","module":"L2-M6","d":3,"q":"A US stock is down 10.5% from the prior close at 13:00 ET. You want to short a breakdown below the day low. What changes?","o":["Nothing","Shorting is banned for a week","You must use a market order","Rule 201 SSR: short sales are allowed only at prices above the national best bid, so you cannot hit the bid to enter"],"a":3,"why":"SSR restricts shorts to prices above the best bid for the rest of that day and the next, changing breakdown execution."},
    {"id":"L2-M6-q10","module":"L2-M6","d":2,"q":"Which statement about dark pools is accurate?","o":["They are unregulated","They show their order book publicly","They are SEC-registered ATSs that report trades to FINRA; a large print does not reveal direction or intent","Only retail traders use them"],"a":2,"why":"Dark pools are regulated ATSs; prints are reported after the fact. Inferring intent from a print is speculation."},
    {"id":"L2-M6-q11","module":"L2-M6","d":3,"q":"An Indian resident wants to day-trade US stocks on margin through an app. What is the key issue to verify?","o":["Only the US PDT rule","RBI LRS rules, which do not permit remittances for margin trading overseas, plus tax and the app's actual US broker status","Nothing — LRS allows anything","Only US tax"],"a":1,"why":"LRS restricts margin and leveraged overseas trading; the PDT change does not alter Indian rules (verify current RBI directions)."},
    {"id":"L2-M6-q12","module":"L2-M6","d":2,"q":"Why can a stop order fail to protect you after hours?","o":["Many brokers do not trigger stops outside regular hours, and thin liquidity can leave no bids near your level","Stops are illegal after hours","Stops always fill at the exact price","After-hours trading has LULD protection"],"a":0,"why":"Broker handling and thin liquidity both make stops unreliable in extended hours."},
    {"id":"L2-M7-q01","module":"L2-M7","d":1,"q":"Where does GIFT Nifty trade?","o":["SGX in Singapore","CME in Chicago","BSE in Mumbai","NSE International Exchange in GIFT City"],"a":3,"why":"Nifty futures moved from SGX to NSE IX in GIFT City in July 2023."},
    {"id":"L2-M7-q02","module":"L2-M7","d":2,"q":"In January, at what IST time does the Xetra DAX cash session open?","o":["12:30","14:30","13:30","11:30"],"a":2,"why":"In winter Germany is on CET (UTC+1). 09:00 CET = 08:00 UTC = 13:30 IST."},
    {"id":"L2-M7-q03","module":"L2-M7","d":2,"q":"GIFT Nifty near-month is 25,320, fair basis about 80 points, Nifty previous close 25,150. What is the approximate implied gap?","o":["+170","+90","+80","−90"],"a":1,"why":"Implied gap ≈ 25,320 − 80 − 25,150 = +90."},
    {"id":"L2-M7-q04","module":"L2-M7","d":2,"q":"Nikkei rises 2.5% in yen while the yen falls 1.8% against the rupee. Roughly what is the return in rupee terms?","o":["+0.65%","+4.3%","+2.5%","−1.8%"],"a":0,"why":"(1.025 × 0.982) − 1 ≈ +0.66%. Currency moves can absorb most of a local gain."},
    {"id":"L2-M7-q05","module":"L2-M7","d":1,"q":"Which index is price-weighted?","o":["TOPIX","Euro Stoxx 50","FTSE 100","Nikkei 225"],"a":3,"why":"The Nikkei 225 is price-weighted; TOPIX and the others are free-float market-cap weighted."},
    {"id":"L2-M7-q06","module":"L2-M7","d":2,"q":"Which European index is most sensitive to commodity prices because of its sector make-up?","o":["DAX 40","CAC 40","FTSE 100","Euro Stoxx 50"],"a":2,"why":"The FTSE 100 has heavy energy and mining weightings."},
    {"id":"L2-M7-q07","module":"L2-M7","d":2,"q":"At what IST time does the Hong Kong cash market open?","o":["06:30","07:00","07:30","05:30"],"a":1,"why":"HKT = UTC+8, 2.5 hours ahead of IST: 09:30 HKT = 07:00 IST."},
    {"id":"L2-M7-q08","module":"L2-M7","d":3,"q":"The S&P 500 rose 1.2% overnight on a soft US inflation print. Today, an Indian bank faces a regulatory action announced at 09:20 IST. How should overnight cues be weighted after 09:20?","o":["Lightly — the domestic, India-specific news is the dominant driver for banks","Heavily — US leads India","Ignore India news","Buy Bank Nifty at the open regardless"],"a":0,"why":"Cross-market cues matter when there is a shared driver. India-specific news can dominate."},
    {"id":"L2-M7-q09","module":"L2-M7","d":2,"q":"Why does the gap between the European and US opens change for a few weeks each spring and autumn?","o":["Exchanges change hours","India adopts daylight saving","Holidays","Europe and the US change clocks on different dates"],"a":3,"why":"Europe changes on the last Sundays of March and October; the US on the second Sunday of March and first Sunday of November."},
    {"id":"L2-M7-q10","module":"L2-M7","d":3,"q":"You compute a 0.75 correlation between US overnight returns and Nifty using 8 days of data. What is the best conclusion?","o":["The link is strong and reliable","Nifty follows the US 75% of the time","The estimate is too noisy to rely on; use longer rolling windows and check for a shared driver","Correlation proves causation"],"a":2,"why":"Small samples give unstable correlation estimates, and correlation is not a percentage of days or a causal claim."},
    {"id":"L2-M7-q11","module":"L2-M7","d":2,"q":"GIFT Nifty correctly implied a +120-point open. What does it tell you about the rest of the session?","o":["The gap will extend","Little — acceptance or rejection of the gap is decided by NSE price action after the open","The gap will fill","It guarantees a trend day"],"a":1,"why":"Overnight cues mostly inform the open; gap-and-go, gap-fill and gap-and-range all remain possible."},
    {"id":"L2-M7-q12","module":"L2-M7","d":1,"q":"Tokyo extended its cash-market close in November 2024 to what time?","o":["15:30 JST","15:00 JST","16:00 JST","14:30 JST"],"a":0,"why":"The Tokyo Stock Exchange moved its close from 15:00 to 15:30 JST in November 2024."},
    {"id":"L3-M8-q01","module":"L3-M8","d":2,"q":"WTI crude rises 1.5% overnight and USD/INR falls 0.5% (rupee strengthens). Roughly how does MCX crude move?","o":["+2.0%","+1.5%","−0.5%","+1.0%"],"a":3,"why":"(1.015 × 0.995) − 1 ≈ +1.0%. A stronger rupee reduces the rupee price gain."},
    {"id":"L3-M8-q02","module":"L3-M8","d":2,"q":"You are long 3 lots of a crude contract with a 100-barrel lot. Price rises ₹38. What is the P&L before costs?","o":["₹3,800","₹1,140","₹11,400","₹38,000"],"a":2,"why":"P&L = 38 × 100 × 3 = ₹11,400."},
    {"id":"L3-M8-q03","module":"L3-M8","d":1,"q":"Which regulator oversees commodity derivatives trading on MCX?","o":["RBI","SEBI","FMC","IRDAI"],"a":1,"why":"The Forward Markets Commission was merged into SEBI in 2015; SEBI now regulates commodity derivatives."},
    {"id":"L3-M8-q04","module":"L3-M8","d":2,"q":"USD/INR spot is 87.00, rupee rates 6.5%, dollar rates 4.5%. What is the approximate 3-month forward?","o":["87.43","86.57","88.74","87.00"],"a":0,"why":"Forward ≈ 87 × 1.01625 ÷ 1.01125 ≈ 87.43. The premium reflects the interest differential."},
    {"id":"L3-M8-q05","module":"L3-M8","d":2,"q":"For an Indian resident (as of Nov 2026, subject to verification), which is permitted?","o":["EUR/USD CFDs on an offshore app","Leveraged gold CFDs on an international broker funded via UPI","Offshore forex perpetuals","Exchange-traded currency derivatives on NSE or BSE within RBI's framework"],"a":3,"why":"Residents may trade currency derivatives only on recognised Indian exchanges within RBI rules; RBI lists unauthorised forex platforms."},
    {"id":"L3-M8-q06","module":"L3-M8","d":3,"q":"Long 1 BTC perp at $70,000, 10× isolated leverage, MMR 0.5%, fees ignored. What is the approximate liquidation price?","o":["$63,000","$66,500","$63,317","$69,650"],"a":2,"why":"Liquidation = 70,000 × 0.9 ÷ 0.995 ≈ $63,317 — only about 9.5% below entry."},
    {"id":"L3-M8-q07","module":"L3-M8","d":2,"q":"You are short $25,000 notional of a BTC perp. Funding is +0.01% every 8 hours. What happens over one day?","o":["You pay $7.50","You receive $7.50","You pay $2.50","Nothing"],"a":1,"why":"Positive funding means longs pay shorts. Per interval = 25,000 × 0.0001 = $2.50; three intervals = $7.50 received."},
    {"id":"L3-M8-q08","module":"L3-M8","d":3,"q":"Short 2 ETH perps at $3,000 each, 20× isolated, MMR 0.5%. What is the approximate liquidation price?","o":["$3,134","$3,150","$3,015","$2,850"],"a":0,"why":"Short liquidation = 3,000 × (1 + 1/20) ÷ (1 + 0.005) = 3,150 ÷ 1.005 ≈ $3,134 — about 4.5% above entry."},
    {"id":"L3-M8-q09","module":"L3-M8","d":2,"q":"A bond has modified duration 8 and price 100. Yield rises 15 bp. What is the approximate price change?","o":["+1.2%","−0.12%","−12%","−1.2%"],"a":3,"why":"ΔP/P ≈ −8 × 0.0015 = −1.2%."},
    {"id":"L3-M8-q10","module":"L3-M8","d":2,"q":"A SOFR future rises from 96.00 to 96.20 after US data. What did the market do?","o":["Priced higher rates","Nothing meaningful","Priced about 20 bp lower average rates for that period","Priced higher inflation"],"a":2,"why":"Implied rate = 100 − price: from 4.00% to 3.80%, i.e. about 20 bp more easing priced."},
    {"id":"L3-M8-q11","module":"L3-M8","d":1,"q":"How are crypto gains on virtual digital assets taxed in India (as of Nov 2026, verify)?","o":["Like equity short-term gains at 20%","Flat 30% plus surcharge and cess, with no set-off of losses against other income, and TDS on transfers above thresholds","Tax-free","Only on withdrawal to a bank"],"a":1,"why":"The 2022 VDA provisions set a flat 30% rate, restrict loss set-off and add 1% TDS above thresholds — verify current law."},
    {"id":"L3-M8-q12","module":"L3-M8","d":3,"q":"You hold MCX natural gas short into the US weekly storage report. What is the main execution risk?","o":["Sudden spikes with gaps through stops, wider spreads and slippage around the release","Low volatility","Exchange closure","No price change"],"a":0,"why":"Natural gas is highly volatile around EIA storage data and weather revisions; stops can fill far from planned levels."},
    {"id":"L4-M4-q01","module":"L4-M4","d":1,"q":"What does a rising relative-strength line of Nifty Bank ÷ Nifty 50 indicate?","o":["Bank Nifty is falling","Nifty is outperforming banks","Volatility is rising","Banks are outperforming the broad index"],"a":3,"why":"The ratio rises when the numerator outperforms the denominator."},
    {"id":"L4-M4-q02","module":"L4-M4","d":2,"q":"Nifty is at 25,500 and India VIX is 18. What is the approximate one-standard-deviation 1-day implied move?","o":["About 145 points","About 459 points","About 289 points","About 4,590 points"],"a":2,"why":"25,500 × 0.18 ÷ √252 ≈ 4,590 ÷ 15.87 ≈ 289 points."},
    {"id":"L4-M4-q03","module":"L4-M4","d":2,"q":"Capital ₹8 lakh, risk 0.5% per trade. Stop = 1.5 × ATR. ATR is ₹10. How many shares?","o":["400","267","533","800"],"a":1,"why":"Risk = ₹4,000; stop = ₹15; quantity = 4,000 ÷ 15 ≈ 267."},
    {"id":"L4-M4-q04","module":"L4-M4","d":2,"q":"Bank Nifty futures rise 0.6% while OI falls 5%. What is the classic label?","o":["Short covering","Long build-up","Short build-up","Long unwinding"],"a":0,"why":"Price up with OI down is labelled short covering — positions being closed with buyers more aggressive."},
    {"id":"L4-M4-q05","module":"L4-M4","d":3,"q":"Using GEX = Gamma × OI × Lot × Spot² × 0.01, with gamma 0.0005, OI 50,000 contracts, lot 65 and spot 25,000, what is the GEX per 1% move at this strike?","o":["₹101.6 crore","₹10,156 crore","₹10.2 crore","₹1,015.6 crore"],"a":3,"why":"0.0005 × 50,000 × 65 × 625,000,000 × 0.01 = ₹1.0156 × 10¹⁰ ≈ ₹1,015.6 crore. The sign depends on unobservable positioning assumptions."},
    {"id":"L4-M4-q06","module":"L4-M4","d":2,"q":"Why should GEX estimates be labelled model-dependent?","o":["They use delayed data","Gamma cannot be calculated","They depend on assumptions about who holds which side of each option, which cannot be observed directly","They only apply in the US"],"a":2,"why":"Flipping the positioning assumption flips the sign of each strike's contribution."},
    {"id":"L4-M4-q07","module":"L4-M4","d":2,"q":"In which regime is a stock–bond hedge most likely to fail?","o":["Low, stable inflation","Rising inflation that lifts yields and hurts equities simultaneously","Falling yields","Low volatility"],"a":1,"why":"When inflation drives both lower bond prices and lower equity valuations, the correlation turns positive."},
    {"id":"L4-M4-q08","module":"L4-M4","d":3,"q":"Metal index beta to Nifty is 1.4. Nifty is +0.5% and Metal is +1.2%. What is the approximate beta-adjusted excess?","o":["+0.5 pp","+0.7 pp","0 pp","−0.2 pp"],"a":0,"why":"Expected = 1.4 × 0.5 = 0.7%; excess = 1.2 − 0.7 = +0.5 pp."},
    {"id":"L4-M4-q09","module":"L4-M4","d":2,"q":"The 60-day correlation of Nifty IT with Nasdaq is 0.55, but the 20-day figure is 0.05. What is the sensible adjustment?","o":["Rely more on Nasdaq cues","Short IT whenever Nasdaq falls","Ignore all correlations permanently","Give Nasdaq cues less weight for IT until the relationship stabilises"],"a":3,"why":"A sharp divergence between windows signals recent instability."},
    {"id":"L4-M4-q10","module":"L4-M4","d":3,"q":"You sold the 25,100 call because it had the highest call OI. Nifty breaks through 25,100 at 13:30 on expiry. Why can the move accelerate?","o":["OI cannot change on expiry","Theta increases","Short-gamma positions must buy the underlying as price rises, and call writers covering add buying pressure","Lot sizes change"],"a":2,"why":"Near expiry, gamma is high; hedging and covering by short-call holders can reinforce the breakout."},
    {"id":"L4-M4-q11","module":"L4-M4","d":2,"q":"What does India VIX measure?","o":["Expected direction of Nifty","Options-implied expected 30-day volatility of Nifty, annualised","Historical daily range","Put–call ratio"],"a":1,"why":"India VIX is derived from Nifty option prices and measures expected magnitude, not direction."},
    {"id":"L4-M4-q12","module":"L4-M4","d":1,"q":"What is the most accurate use of sector rotation for an intraday trader?","o":["It narrows where you look for your own setups, favouring leaders for longs and laggards for shorts","It tells you exactly what to buy","It forecasts the economy","It replaces stop-losses"],"a":0,"why":"Rotation provides context for instrument selection; entries and stops still come from your playbook."}
  );
})(typeof window !== 'undefined' ? window : globalThis);
