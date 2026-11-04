/* Trading psychology reference — Intraday Trading Mastery Academy.
   Educational content. The self-assessment is a self-reflection tool, not a clinical or diagnostic instrument. */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  const topics = [
  {
    id: 'fear', name: 'Fear',
    what: `Fear is the anticipation of loss or pain. In trading it shows up as reluctance to enter a valid setup, cutting winners at the first wobble, or freezing when a position moves against you. Some fear is useful: it keeps you from oversized bets. The problem is fear that is not tied to your actual, pre-defined risk.`,
    why: `Losses tend to feel larger than equal gains (the loss-aversion finding from Kahneman and Tversky's prospect theory), and intraday trading compresses many uncertain outcomes into a few hours. After a string of losses, many traders start to treat every setup as a threat. Fear is also amplified when position size is too large for your account or your comfort level.`,
    signs: `- You skip setups that meet your rules, then watch them work.
- You move targets closer as soon as a trade is in profit.
- Your heart rate rises and you stare at P&L rather than the chart.
- You check the screen constantly but take no action.`,
    cost: `Fear truncates the right tail of your distribution. If you cut winners at half a unit of risk but let losers reach one full unit, your expectancy can be negative even with a decent win rate. Worked example: at a 60% win rate, {{0.60 × 0.5R − 0.40 × 1R = −0.10R}} per trade; with half-R winners and one-R losers you need a win rate above 66.7% just to break even, before costs. Missed trades also distort your journal: your recorded results stop matching the system you think you are testing.`,
    countermeasures: `- Reduce size until a full stop-out feels boring. For many traders, fear eases noticeably at a smaller size; test this on yourself.
- Decide entry, stop and target before the session and write them down.
- Use bracket orders so the exit decisions are made in advance.
- Hide the rupee P&L column and watch the chart in R multiples instead.
- Review missed trades in your journal with the same seriousness as losing trades.`,
    exercise: `For your next 20 paper trades, log one line per trade: did you take it as planned (yes/no) and if not, what you felt. At the end, compare the planned outcomes with the outcomes you actually took. Use [[widget:position-size]] to find a size where a stop-out costs no more than 0.25% of your account.`
  },
  {
    id: 'greed', name: 'Greed',
    what: `Greed is the desire for more than your plan offers: larger size, wider targets, extra trades, or holding beyond the exit because the move "could go further". It is not ambition; it is abandoning the plan in pursuit of a bigger outcome.`,
    why: `Winning feels good, and that feeling invites you to seek it again; this is a plain description of reinforcement, not a neuroscience claim about your brain. Intraday charts constantly show moves you could have caught with hindsight. Social media amplifies this with screenshots of exceptional days, which are a highly selected sample.`,
    signs: `- You raise size after a winning streak without any change in your rules.
- You remove or widen your target in mid-trade.
- You hold an intraday position into the close or overnight to "let it run".
- You calculate what you would make if a trade went to an extreme level.`,
    cost: `Greed increases variance and often turns winners into scratches or losers. Bigger size after wins means your largest positions coincide with the moment your recent sample looks best, and a hot streak in a small sample is usually followed by more ordinary results (regression to the mean), so the extra size tends to meet average performance. For leveraged products such as futures and options, it can produce a single loss that undoes weeks of work.`,
    countermeasures: `- Fix size rules in writing, such as a maximum risk per trade and per day.
- Allow size increases only after a pre-defined review, for example after 50 trades meeting your criteria.
- Use partial exits: take part off at your target and trail the rest under clear rules.
- Set a daily profit cap at which you stop for the day if your discipline tends to slip after big wins.`,
    exercise: `Open your journal and list the five trades in which you deviated to make more. Compute the total R of those deviations versus the plan. Then run [[widget:monte-carlo]] at your current risk per trade and again at double, and compare the drawdown distributions.`
  },
  {
    id: 'fomo', name: 'FOMO (fear of missing out)',
    what: `FOMO is the urge to enter a move because it is happening without you, rather than because it meets your setup. It typically leads to chasing: buying after a big green bar, or shorting after a waterfall decline, at a location with poor risk.`,
    why: `Seeing a move unfold triggers regret and social comparison. Fast markets, watchlists full of gainers, and chat groups where others post wins all intensify it. The move you missed feels like money taken from you, which it is not.`,
    signs: `- You enter without a predefined stop because "it is running".
- Your entries cluster near the high of a rally or the low of a decline.
- You trade instruments that were not on your watchlist this morning.
- You feel urgency rather than calm when placing the order.`,
    cost: `Chasing gives the worst risk-reward: a wide stop to the base of the move, and little room to the next resistance. A chased entry also tends to sit where a normal pullback is enough to stop you out. Even when they work, they reinforce a habit that will eventually be expensive.`,
    countermeasures: `- Write a rule: no entry more than a fixed distance from your trigger, for example 0.5 ATR.
- Accept that missing moves is part of the job; there are always more setups.
- Keep a "missed trades" list rather than chasing; review it later for patterns.
- Mute social feeds and chat groups during market hours.
- Wait for a pullback or a new setup; if none comes, the trade did not exist for you.`,
    exercise: `For one week, record every urge to chase in your journal without acting on it. Note the price you would have entered and track what happened over the next 30 minutes. Compare the results with your planned setups.`
  },
  {
    id: 'revenge-trading', name: 'Revenge trading',
    what: `Revenge trading is entering trades to win back a loss, usually immediately and often in the same instrument, with larger size or weaker criteria. The goal shifts from executing a process to repairing a feeling.`,
    why: `A loss creates an urgent sense that something was taken from you. Anger and humiliation narrow attention and favour action over thought. Intraday markets offer constant opportunity to "get it back", which makes the impulse easy to act on.`,
    signs: `- You enter a new trade within a minute or two of a stop-out.
- You trade the same stock in the opposite direction after being stopped out.
- Your size increases after losses.
- You think about the rupee amount lost rather than the next setup.`,
    cost: `Revenge trades are taken in the worst mental state with the weakest criteria and often the largest size. A single revenge sequence can turn a normal one-R loss into a five-R day. Repeated over months, it is a direct route from small, manageable drawdowns to account-threatening ones. Your own journal is the evidence that matters: tag these trades and measure them.`,
    countermeasures: `- Enforce a mandatory pause after any stop-out: for example five minutes away from the screen.
- Set a maximum daily loss (in R or ₹) after which you stop trading for the day.
- Never increase size after a loss within the same session.
- Prepare a short reset routine: stand up, breathe slowly, review the plan, write one line in your journal.
- Ask before each trade: would I take this if I were flat for the day?`,
    exercise: `Look back through your last 50 trades and tag any trade entered within five minutes of a loss. Compare their average R with the rest. Then write your personal daily loss limit and post it where you can see it while trading.`
  },
  {
    id: 'overtrading', name: 'Overtrading',
    what: `Overtrading is taking more trades than your system generates, or trading when conditions do not suit your approach. It includes boredom trades, marginal setups, and constant scalping in a quiet market.`,
    why: `Activity feels like productivity. Sitting through hours with no setup is uncomfortable, and every candle looks like a potential trade. For intraday traders in India, the middle of the session usually sees lower volume than the open and the close (the common U-shaped intraday volume pattern), and quiet markets make marginal trades tempting. Check this on the volume of your own instruments rather than assuming it.

> [!evidence] Research on individual investors links heavy trading with worse net results. Barber and Odean (Journal of Finance, 2000, "Trading Is Hazardous to Your Wealth") found that the US households who traded most earned markedly lower net returns than those who traded least, largely because of costs. In India, SEBI's July 2024 study of individual intraday traders in the equity cash segment reported that about 7 in 10 made a net loss in FY2022-23, with a higher loss share among those making more than 500 trades a year. These are group findings, not a forecast for you.`,
    signs: `- Your trade count varies widely day to day without changes in conditions.
- Many trades are scratches or small losses.
- Charges are a large share of your gross P&L.
- You cannot name the setup for half your trades.`,
    cost: `Every trade carries costs: brokerage, STT, exchange charges, GST, stamp duty and slippage. Marginal trades with near-zero expectancy become negative after costs. Overtrading also drains attention, so you are tired when the good setups appear.`,
    countermeasures: `- Set a maximum number of trades per day.
- Trade only in defined windows, for example the first 90 minutes and the last hour.
- Require each trade to have a named setup from your playbook.
- Check your charges per trade with [[widget:charges-india]] and compute what share of gross profit they consume.
- Treat no trade as a valid outcome of a session.`,
    exercise: `Calculate your average charges per round trip using [[widget:charges-india]] or [[widget:charges-us]]. Then group your last month of trades by setup and time of day. Identify the bucket with the lowest expectancy and remove it for the next two weeks.`
  },
  {
    id: 'loss-aversion', name: 'Loss aversion',
    what: `Loss aversion is the tendency to feel losses more intensely than equivalent gains. In prospect theory, developed by Daniel Kahneman and Amos Tversky (Econometrica, 1979), outcomes are judged as gains or losses relative to a reference point, and losses weigh more than gains of the same size. Their later estimate (Tversky and Kahneman, 1992) put the typical loss-aversion ratio at roughly two, but this is an average from experiments and varies a great deal between people and situations.

Strictly, loss aversion and the disposition effect are different things. Loss aversion is about how outcomes feel; the disposition effect is the observed behaviour of selling winners too soon and holding losers too long.`,
    why: `Prospect theory also says people tend to take risk to avoid a sure loss and avoid risk to protect a sure gain. Applied to an open trade with your entry price as the reference point, closing a loser turns a paper loss into a realised one, so holding and hoping feels better; closing a winner banks a gain, so traders rush to take it. Hersh Shefrin and Meir Statman (Journal of Finance, 1985) named this pattern the disposition effect, explaining it with prospect theory, mental accounting and regret.

> [!evidence] The disposition effect is one of the better-documented findings in behavioural finance. Terrance Odean (Journal of Finance, 1998) found that US discount-brokerage investors realised gains at a noticeably higher rate than losses, and that the winners they sold went on to do better than the losers they kept. Later studies have found similar patterns in many countries. Whether prospect theory is the full explanation is still debated; the behaviour itself is well established.`,
    signs: `- You move or remove stops to avoid taking a loss.
- You average down on losers without a plan.
- Your average loser is larger than your average winner, despite a planned ratio above one.
- You feel relief, not satisfaction, when closing a winner.`,
    cost: `Loss aversion inverts the payoff you designed. A plan with two-R targets and one-R stops becomes, in practice, half-R winners and two-R losers. At a 40% win rate the plan's expectancy is {{0.40 × 2R − 0.60 × 1R = +0.20R}}; the same win rate with the distorted payoff gives {{0.40 × 0.5R − 0.60 × 2R = −1.00R}}, and you would need to win 80% of trades just to break even. Holding intraday losers can also turn into an unplanned overnight position with gap risk.`,
    countermeasures: `- Place a hard stop order with every entry and never widen it.
- Think in R multiples, not rupees; a one-R loss is a normal cost of business.
- Pre-commit to exits with bracket orders.
- Review the ratio of average win to average loss weekly and compare it with plan.
- Remind yourself that a stop-out is information, not a verdict on you.`,
    exercise: `Using your journal, compute average win in R, average loss in R and win rate. Enter them in [[widget:expectancy]]. Then recompute assuming every loss had been capped at exactly one R. The difference is the cost of loss aversion in your sample.`
  },
  {
    id: 'confirmation-bias', name: 'Confirmation bias',
    what: `Confirmation bias is seeking, noticing and remembering information that supports what you already believe, while discounting what contradicts it. Once you are long, every bullish signal looks important and every bearish one looks like noise.`,
    why: `Holding a position creates a stake in being right. Indicators, news and opinions are abundant, so it is always possible to find something that agrees with you. Charts are ambiguous enough that the same bars can be read either way.

> [!evidence] Confirmation bias is among the most widely replicated findings in the psychology of judgement; Raymond Nickerson's review (Review of General Psychology, 1998) surveys the evidence. Its specific cost to traders is an inference, not a measured result: test it against your own journal.`,
    signs: `- You add indicators until one agrees with your position.
- You look for social media posts that support your trade.
- You explain away price action that hits your invalidation level.
- Your pre-trade analysis lists only reasons to take the trade.`,
    cost: `It delays exits on bad trades and promotes oversized conviction. It also corrupts learning: if you only remember the times your setup worked, your belief in it grows regardless of its true performance.`,
    countermeasures: `- Write the invalidation level before entering: the price that proves you wrong.
- List at least one reason the trade could fail in your pre-trade note.
- Use a fixed indicator set and do not add tools mid-trade.
- Track every instance of a setup, not just the memorable ones.
- Ask: what would I do if I had no position?`,
    exercise: `Before your next five paper trades, write the strongest case against each one. After the session, check whether the counter-case was relevant. Review your journal for setups you consider reliable and count total instances, wins and losses, rather than relying on memory.`
  },
  {
    id: 'anchoring', name: 'Anchoring',
    what: `Anchoring is giving too much weight to a reference number, such as your entry price, yesterday's close, an analyst target, or the high a stock reached last month. Decisions become relative to the anchor rather than to current information.`,
    why: `People use reference points to simplify judgements under uncertainty. Tversky and Kahneman (Science, 1974) showed that estimates are pulled towards an initial number even when that number is obviously irrelevant, and that adjustment away from it is usually too small. Your entry price is the most salient number on your screen, even though other market participants neither know nor care about it. In prospect theory the entry price also acts as the reference point that defines a gain or a loss, which links anchoring to the disposition effect.`,
    signs: `- You wait to "get back to breakeven" before exiting a bad trade.
- You refuse to buy a stock because it was cheaper earlier in the day.
- You set targets based on round numbers or your desired profit rather than structure.
- You judge a move as "too much" because of a level that no longer matters.`,
    cost: `Anchoring keeps you in failing trades and out of valid ones. It also distorts targets and stops, which should be based on market structure and volatility, not on your entry or your wishes.`,
    countermeasures: `- Base stops and targets on structure and ATR, not on your entry or on a desired rupee amount.
- Ask: if I were flat, would I enter here?
- Treat the entry price as irrelevant once you are in the trade.
- Reassess levels each session; yesterday's important level may not matter today.`,
    exercise: `Review 10 recent trades. For each, note where you exited and why. Mark any exit or hold justified by entry price or breakeven. Then check what price structure suggested at that point.`
  },
  {
    id: 'recency-bias', name: 'Recency bias',
    what: `Recency bias is giving too much weight to the most recent events. A few losses make a sound system feel broken; a few wins make a weak one feel brilliant.`,
    why: `Recent outcomes are vivid and easy to recall, and people tend to judge likelihood by how easily examples come to mind (the availability heuristic, Tversky and Kahneman, 1974). Small samples are dominated by randomness, yet people expect even short sequences to look representative of the long run, which Tversky and Kahneman called belief in the law of small numbers (1971).

How noisy is a small sample? For a true 50% win rate, a rough 95% range for the win rate you will observe is about 28%–72% over 20 trades, 36%–64% over 50 trades and 40%–60% over 100 trades. With a 50% win rate, the chance of at least one run of six or more consecutive losses somewhere in 100 independent trades is about 55%; at a 40% win rate, a run of seven or more has about a 69% chance. A streak that long is normal, not proof the method has stopped working.`,
    signs: `- You change systems after three or four losses.
- You increase size after a few wins.
- You assume today's market will behave like yesterday's.
- You abandon a setup because its last instance failed.`,
    cost: `Constant switching means you never collect enough data to know whether anything works. You tend to abandon methods at the bottom of their natural drawdown and adopt others at the top of their lucky streak.`,
    countermeasures: `- Define the sample size required before judging a setup, for example 50 trades.
- Use [[widget:monte-carlo]] to see the natural range of streaks for your win rate.
- Review performance on fixed schedules (weekly, monthly), not after every trade.
- Keep a rules document and change it only during scheduled reviews.`,
    exercise: `Use [[widget:monte-carlo]] with your win rate and average R to estimate the longest losing streak expected in 100 trades. Write that number in your journal as your "normal bad run" and refer to it next time a streak starts.`
  },
  {
    id: 'impatience', name: 'Impatience',
    what: `Impatience is acting before your setup is complete: entering before the candle closes, before price reaches your level, or before confirmation. It also includes exiting early because the trade is "taking too long".`,
    why: `Waiting is uncomfortable, and markets reward patience inconsistently. Intraday traders feel the clock: the session is short and every minute feels like lost opportunity.`,
    signs: `- You enter on intrabar movement rather than closed candles.
- You take partial setups and tell yourself the rest will follow.
- You exit trades that have not hit stop or target simply because they are flat.
- You feel restless during quiet periods.`,
    cost: `Early entries mean worse prices and more false signals. Early exits remove trades from your sample that might have reached target. Your results drift away from your tested system.`,
    countermeasures: `- Use alerts at your levels instead of watching every tick.
- Require a closed candle for confirmation, and set your platform to show a countdown.
- Plan time-based exits in advance, for example exit if no progress after six bars.
- Fill quiet periods with review tasks rather than chart watching.`,
    exercise: `Over 10 sessions, set alerts at your key levels and step away from the screen until one triggers. Log how many trades you took and their quality compared with prior sessions.`
  },
  ];
  topics.push(
  {
    id: 'hesitation', name: 'Hesitation',
    what: `Hesitation is seeing a valid setup and failing to act, or acting late at a worse price. Unlike patience, which waits for criteria to be met, hesitation waits after the criteria are already met.`,
    why: `It often follows losses, a recent mistake, or uncertainty about the system. If you do not trust your rules, every trigger feels like a gamble. Too large a size also produces hesitation because the stakes feel too high.`,
    signs: `- You watch a trigger fire and wait for "one more candle".
- You enter after the move has started, at a worse price.
- You miss trades and then chase them, combining hesitation with FOMO.
- Your journal shows many valid setups you did not take.`,
    cost: `Hesitation leads to worse fills and skipped winners, which biases your results downward. Late entries also widen stops or reduce reward, worsening the trade's risk-reward.`,
    countermeasures: `- Reduce size until taking the trade feels routine.
- Use pre-placed stop-entry orders at your trigger.
- Build trust through a structured paper-trading sample of your setups.
- Write a short checklist so the decision to enter becomes mechanical.
- Review missed trades without judgement and look for the common cause.`,
    exercise: `For your next 20 setups, place stop-entry orders as soon as the setup forms instead of entering manually. Compare execution quality and missed-trade count with your previous 20.`
  },
  {
    id: 'emotional-decisions', name: 'Emotional decision-making',
    what: `Emotional decision-making is letting a mood, rather than your rules, decide what you do. Anger, excitement, anxiety, boredom and euphoria all distort how risk and reward look. Every trader feels emotions; the problem is letting them select trades or exits.`,
    why: `Markets deliver rapid, uncertain feedback with money at stake, which is a strong emotional stimulus. Stress from outside trading, poor sleep and hunger can make it harder to regulate; notice whether they affect you by logging them alongside your trades.`,
    signs: `- Your decisions differ depending on whether the day started well or badly.
- You trade more when stressed or bored.
- You make exceptions to your rules "just this once".
- You feel strong emotions immediately before or after an order.`,
    cost: `Emotional decisions break the link between your plan and your results, so you cannot learn from your journal. They also cluster: one emotional trade often triggers a sequence.`,
    countermeasures: `- Rate your emotional state from 1 to 5 before each session and before each trade.
- Set a rule that you do not trade at a rating of 4 or 5 (highly agitated).
- Use pre-defined orders so most decisions are made calmly in advance.
- Maintain basic physical routines: sleep, food, movement.
- Stop for the day after a rule break.`,
    exercise: `For two weeks, log a 1–5 emotion score with every trade. At the end, compare average R by emotion score. Use the result to set your personal no-trade threshold.`
  },
  {
    id: 'confidence', name: 'Confidence',
    what: `Healthy confidence is trust in your process based on evidence: a tested set of rules, a journal and a track record. Overconfidence is trust that exceeds that evidence, often after a winning streak. Underconfidence is doubt despite good evidence.`,
    why: `A few wins feel like skill; a few losses feel like failure. Without enough data, confidence tracks recent results, not ability. People also tend to credit successes to skill and failures to bad luck (self-attribution bias), which inflates confidence after a good run. Leverage and fast markets make overconfidence especially costly.

> [!evidence] Brad Barber and Terrance Odean linked overconfidence to excessive trading among individual investors: heavy traders earned lower net returns than light traders (Journal of Finance, 2000), and men, whom psychological research finds more overconfident on average in finance, traded more than women and lost more net return as a result (Quarterly Journal of Economics, 2001, "Boys Will Be Boys"). Treat these as evidence about groups of investors, not about you; your journal is the test that applies to you.`,
    signs: `- Overconfidence: increasing size quickly, skipping preparation, dismissing risk.
- Underconfidence: skipping valid trades, reducing size after normal losses.
- Feeling certain about what the market will do next.
- Tying self-worth to the day's P&L.`,
    cost: `Overconfidence produces the largest losses because it combines size with sloppiness. Underconfidence erodes expectancy through missed trades and early exits.`,
    countermeasures: `- Ground confidence in statistics from your own journal, not memory.
- Raise size in small, pre-defined steps after reaching sample thresholds.
- Separate process quality from outcome: grade each trade on execution.
- Remember that no method produces certainty about any single trade.`,
    exercise: `Grade your last 20 trades from A to D on process alone, ignoring P&L. Compare the grades with outcomes. Use [[widget:ror]] to see how risk of ruin changes as risk per trade increases.`
  },
  {
    id: 'discipline', name: 'Discipline',
    what: `Discipline is doing what your plan says consistently, especially when it is uncomfortable. It covers preparation, entries, exits, size, daily limits and review.`,
    why: `Without discipline you cannot test anything, because your results reflect whatever you felt each day rather than a system. Markets constantly tempt you to make exceptions.`,
    signs: `- Discipline present: you follow your checklist, respect stops and stop at your daily limit.
- Discipline lacking: you make frequent exceptions, skip preparation, change rules mid-session.
- Your journal shows large differences between planned and actual trades.`,
    cost: `Indiscipline turns a potentially positive system into a random one. The cost is not just money but the information you lose about whether your method works. Small breaks compound: one widened stop teaches you that stops are negotiable, and the next break comes easier.

> [!note] Discipline is easier when rules are few and specific. A rule such as {{risk per trade = 0.5% of capital}} is easy to follow; a rule such as be careful is not.`,
    countermeasures: `- Write rules down and keep them short.
- Use pre-, during- and post-session checklists.
- Automate what you can: bracket orders, alerts, daily loss limits at the broker.
- Track a rule-adherence percentage in your journal.
- Reward process adherence, not just profit.`,
    exercise: `Compute your rule-adherence rate for the last 30 trades: the percentage that followed every rule. Set a target for the next 30 and review it daily.`
  },
  {
    id: 'patience', name: 'Patience',
    what: `Patience is waiting for your setup to appear and complete, and letting trades run to their planned exit. It is not passivity: it is active waiting with a clear idea of what you are waiting for.`,
    why: `Good setups are relatively rare, and the gaps between them are boring. The urge to do something tends to win unless you plan for the wait.`,
    signs: `- Patience present: fewer, higher-quality trades; entries at your planned levels.
- Patience lacking: early entries, early exits, marginal setups.
- Comfort with sessions that have no trades.`,
    cost: `Impatience shows up as worse prices, more false signals and truncated winners. Patience has a cost too: you will sometimes wait and miss a move. That is acceptable if it is part of the plan.`,
    countermeasures: `- Define what you are waiting for in writing before the session.
- Use alerts rather than staring at charts.
- Keep a list of review tasks for quiet periods.
- Use time stops in your plan so exits are not decided by impatience.`,
    exercise: `For a week, count the setups you planned for each morning and the trades you took. Aim for a ratio close to one. Use the chart lab to practise waiting for candle closes before marking an entry.`
  },
  {
    id: 'consistency', name: 'Consistency',
    what: `Consistency means applying the same process each session: the same preparation, setups, size rules, and review. It does not mean consistent profits; returns will vary even with a consistent process.`,
    why: `Only a consistent process produces data you can learn from. If you change size, setups or timeframes constantly, you cannot tell what is working.`,
    signs: `- Consistency present: similar trade counts on similar days; stable risk per trade.
- Consistency lacking: wide swings in size, varied setups, irregular preparation.`,
    cost: `Inconsistent process produces noisy results and prevents improvement. It also hides the real cause of losses. If you traded three setups at four different sizes across two timeframes last month, you cannot say which combination caused the drawdown, so you cannot fix it.

Consistency is also what makes statistics meaningful. A win rate and average R calculated over 50 trades taken the same way describe your system; the same numbers over 50 improvised trades describe nothing in particular. Mark Douglas, in *Trading in the Zone*, frames this as thinking in probabilities over a series of trades rather than judging any single one.`,
    countermeasures: `- Use a fixed daily routine with set times.
- Keep risk per trade constant until a scheduled review.
- Limit your playbook to a few setups.
- Journal every trade with the same fields.`,
    exercise: `Write your daily routine as a timetable. Follow it for 10 sessions and log any deviations.`
  },
  {
    id: 'accepting-losses', name: 'Accepting losses',
    what: `Accepting losses means treating them as a normal cost of trading rather than as failures. Every method loses some of the time. The skill is keeping losses within plan.`,
    why: `No method avoids losses, and any trader with a positive expectancy will still have losing trades, days and weeks. Refusing to accept this leads to moving stops, revenge trading and abandoning systems.`,
    signs: `- Accepting: you exit at your stop without hesitation and move to the next setup.
- Not accepting: you widen stops, average down, or replay losses for hours.`,
    cost: `Refusing to accept small losses is how large losses happen. It also makes trading emotionally exhausting. Consider a plan with a one-R stop: a trader who cannot accept the loss widens the stop twice and exits at minus three R. Two such trades erase the profit from six planned winners at one R each.

> [!evidence] The idea that small, controlled losses are essential to survival is a matter of arithmetic, not opinion: a 50% drawdown needs a 100% gain to recover. Use [[widget:drawdown]] to see the recovery maths.`,
    countermeasures: `- Pre-define risk per trade in R and accept it before entering.
- Use hard stops.
- Expect losing streaks; use [[widget:monte-carlo]] to see their typical length.
- Review losses for process errors, not just outcomes.`,
    exercise: `Before your next session, write: "My planned loss on each trade is ___ R, and I accept it." Review your journal for any losses beyond one R and identify the cause.`
  },
  {
    id: 'process-thinking', name: 'Process-oriented thinking',
    what: `Process-oriented thinking means judging yourself by how well you executed your plan, not by the outcome of individual trades. A good trade can lose; a bad trade can win.`,
    why: `Short-term outcomes are dominated by randomness. If you judge by outcomes, you will reinforce lucky mistakes and punish correct decisions.`,
    signs: `- Process-oriented: you grade trades on execution, review rules, and track adherence.
- Outcome-oriented: you feel good or bad based only on P&L and change rules after single trades.`,
    cost: `Outcome thinking leads to constant changes, emotional swings and poor learning. A trader who judges by outcome will abandon a sound rule after one loss and keep a reckless habit after one lucky win. Over time, the rules drift towards whatever happened most recently.

Annie Duke's idea of resulting, from *Thinking in Bets*, describes this error: judging the quality of a decision by its result. In trading, the remedy is to define in advance what a good decision looks like, then score yourself against that definition regardless of P&L.`,
    countermeasures: `- Grade every trade on process (A–D) separately from P&L.
- Review weekly with statistics, not stories.
- Set process goals (for example 95% rule adherence) instead of profit goals.
- Celebrate correct losses as much as correct wins.`,
    exercise: `Add a process-grade field to your journal. After 20 trades, compare average R for A-grade versus C- and D-grade trades.`
  },
  {
    id: 'decision-fatigue', name: 'Decision fatigue',
    what: `Decision fatigue is the decline in decision quality after many decisions. Intraday traders make dozens of small decisions every session, and quality tends to drop later in the day.`,
    why: `Attention and self-control appear to weaken with sustained effort, though the science on the exact mechanism is debated. Long sessions, multiple screens and constant monitoring all add to the load.`,
    signs: `- Your worst trades happen late in the session.
- You make impulsive decisions after long periods of watching.
- You struggle to follow your checklist later in the day.`,
    cost: `Fatigue reduces the quality of exits, increases rule breaks and makes revenge trading more likely. For Indian intraday traders, the NSE normal market opens at 09:15 IST; the equity cash session ends at 15:30 IST, and from 3 August 2026 equity derivatives trade until 15:40 IST (as of Nov 2026 — verify current timings on NSE). Many also watch the US open in the evening. Combining both without breaks means many hours of screen time, which is when sloppy decisions creep in.

> [!evidence] Research on ego depletion and decision fatigue is mixed, with some well-known findings failing to replicate. The practical advice here does not depend on the mechanism: your own journal will show whether late-session trades are worse for you.`,
    countermeasures: `- Make key decisions before the session in your plan.
- Limit trading to your best windows.
- Take regular breaks away from the screen.
- Automate routine decisions with bracket orders and alerts.
- Stop after a set number of trades.`,
    exercise: `Group your journal trades by hour of the day and compare average R. If later hours are worse, shorten your trading window for two weeks and compare.`
  }
  );
  const selfAssessment = [
    { id: 'imp1', text: 'I enter trades before my setup has fully formed.', trait: 'impulsivity', reverse: false },
    { id: 'imp2', text: 'I place orders on the spur of the moment, without a written plan.', trait: 'impulsivity', reverse: false },
    { id: 'imp3', text: 'I wait for a closed candle before acting on a signal.', trait: 'impulsivity', reverse: true },
    { id: 'imp4', text: 'I trade instruments that were not on my watchlist that morning.', trait: 'impulsivity', reverse: false },
    { id: 'la1', text: 'I move my stop further away to avoid taking a loss.', trait: 'loss aversion', reverse: false },
    { id: 'la2', text: 'I take profits quickly but hold losing trades hoping they recover.', trait: 'loss aversion', reverse: false },
    { id: 'la3', text: 'I can exit at my stop without much emotional difficulty.', trait: 'loss aversion', reverse: true },
    { id: 'la4', text: 'I average down on losing intraday trades without a pre-defined plan.', trait: 'loss aversion', reverse: false },
    { id: 'dis1', text: 'I follow my written trading rules, even on difficult days.', trait: 'discipline gaps', reverse: true },
    { id: 'dis2', text: 'I stop trading when I reach my daily loss limit.', trait: 'discipline gaps', reverse: true },
    { id: 'dis3', text: 'I skip my pre-market preparation.', trait: 'discipline gaps', reverse: false },
    { id: 'dis4', text: 'I record every trade in my journal, including the embarrassing ones.', trait: 'discipline gaps', reverse: true },
    { id: 'pat1', text: 'I feel restless when no setup appears for an hour.', trait: 'impatience', reverse: false },
    { id: 'pat2', text: 'I am comfortable ending a session with no trades.', trait: 'impatience', reverse: true },
    { id: 'pat3', text: 'I exit trades early because they are taking too long.', trait: 'impatience', reverse: false },
    { id: 'pat4', text: 'I wait for price to come to my level rather than chasing it.', trait: 'impatience', reverse: true },
    { id: 'oc1', text: 'After a few winning trades, I increase my position size.', trait: 'overconfidence', reverse: false },
    { id: 'oc2', text: 'I feel certain about where the market will go next.', trait: 'overconfidence', reverse: false },
    { id: 'oc3', text: 'I base my view of my skill on journal statistics rather than memory.', trait: 'overconfidence', reverse: true },
    { id: 'oc4', text: 'I think the risk rules I follow are for less experienced traders.', trait: 'overconfidence', reverse: false },
    { id: 'tilt1', text: 'After a loss, I enter another trade within a few minutes.', trait: 'tilt', reverse: false },
    { id: 'tilt2', text: 'I feel angry or frustrated at the market after a stop-out.', trait: 'tilt', reverse: false },
    { id: 'tilt3', text: 'I take a deliberate break after a losing trade.', trait: 'tilt', reverse: true },
    { id: 'tilt4', text: 'I increase my size to win back losses on the same day.', trait: 'tilt', reverse: false }
  ];
  selfAssessment.note = 'Self-reflection tool only. It is not a clinical, diagnostic or validated psychometric instrument, has no norms, and says nothing about your mental health or whether you will succeed as a trader. Answer from Strongly disagree (1) to Strongly agree (5) for how you actually behaved over your last month of trading, not how you would like to. Some statements are worded positively and scored in reverse (6 minus your answer), so on every trait a higher score marks an area to build rules around. Compare results only with your own earlier results, check them against your journal, and retake monthly. If trading is causing you serious distress, stop and talk to someone you trust or a qualified professional.';

  const checklists = {
    pre: [
      'Slept adequately and feel calm (state 1–3 out of 5)',
      'Checked the economic and results calendar for today',
      'Checked overnight global cues: US close, Asian markets, GIFT Nifty',
      'Marked prior day high, low, close and key higher-timeframe levels',
      'Noted any gaps and the pre-open price',
      'Built a short watchlist (5 or fewer instruments)',
      'Written the setups I am looking for today',
      'Defined risk per trade in ₹ and R',
      'Defined maximum daily loss and maximum trade count',
      'Checked lot sizes, margins and any F&O ban list',
      'Platform, data feed and internet connection working',
      'Bracket or stop orders templates ready',
      'Phone notifications and social feeds muted',
      'Reviewed yesterday\'s journal lesson'
    ],
    during: [
      'Is this a named setup from my playbook?',
      'Is the price at my planned level, with confirmation?',
      'Stop and target defined before entry',
      'Size calculated from stop distance and risk per trade',
      'Reward-to-risk acceptable after costs',
      'Not entering within five minutes of a loss',
      'Emotion score 3 or lower',
      'Stop order placed immediately after entry',
      'No stop widening once in the trade',
      'Following the planned exit, not adjusting on impulse',
      'Checking total daily P&L against the daily loss limit',
      'Taking a break every hour',
      'Stopping when the daily limit or trade count is reached',
      'Closing intraday positions before the broker square-off time'
    ],
    post: [
      'All positions closed or intentionally held',
      'Every trade logged with entry, stop, target, exit and R',
      'Screenshot of each trade saved',
      'Process grade (A–D) recorded for each trade',
      'Emotion score recorded for each trade',
      'Rule breaks identified and noted',
      'Charges reviewed against gross P&L',
      'Missed setups recorded',
      'One lesson for tomorrow written',
      'Daily P&L in R and ₹ recorded',
      'Checked whether the daily loss limit was respected',
      'Weekly statistics updated if it is the last session of the week',
      'Stepped away from screens before reviewing emotionally charged trades',
      'Planned tomorrow\'s first task'
    ]
  };

  IA.content.psych = { topics, selfAssessment, selfAssessmentNote: selfAssessment.note, checklists };
})(typeof window !== 'undefined' ? window : globalThis);
