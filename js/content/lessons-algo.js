/* v2.2 lesson: from backtest to a live algorithm, and India's retail algo rules (as of Nov 2026). */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  IA.content.lessons = IA.content.lessons || []; IA.content.questions = IA.content.questions || [];
  IA.content.lessons.push({
    id: 'l4-algo-india', module: 'L4-M2', level: 4, track: 'quant', title: 'From backtest to live algo: India\'s retail algo rules', mins: 26,
    summary: 'Take a rule from backtest to paper bot to code, know what SEBI\'s retail algo framework requires before any of it touches a real account, and judge when automation helps and when it only loses money faster.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `An **algorithm** is just your trading rules written so precisely that a computer can follow them without asking you anything: when to enter, how much to buy, where the stop and target go, when to stop for the day.

Automation does three useful things: it removes hesitation, it applies the rules identically every time, and it can watch many bars without tiring. It does **not** create an edge. A rule that loses money by hand loses money faster, and more consistently, when a computer runs it.

The safe path has four steps, and this app lets you do the first three:

1. **Backtest** the rule on past bars (Quantitative Research → Backtester).
2. **Paper-trade it forward** with a bot on bars it has never seen (Trading Simulator → Strategy bot).
3. **Export the rules as code** you can read and run yourself (Python, or a TradingView Pine Script).
4. Only then, and only through a broker that offers it under SEBI's rules, run it with small real money.

> [!warn] SEBI's study of individual traders in equity derivatives (published 20 Aug 2026, covering FY25–FY26) found that roughly 88% of individual traders made a net loss in FY26, with aggregate losses of about ₹91,685 crore. Automation does not exempt you from those odds.` },
      { h: 'Intermediate view', md: `### What "the same rules" must mean
A backtest, a paper bot and live code are only comparable if they apply *exactly* the same rules. In this app the bot and the backtester share one bar-by-bar engine, and the exported Python re-implements the same indicators and rules line by line. The test suite checks that the Python produces the same trades as the app on the same bars.

The rules in every version:
- The signal is checked on a bar's **close**; the order fills at the **next bar's open** (no look-ahead).
- If the stop and target are both inside one bar, the **stop** is assumed hit first (conservative).
- Size = risk budget ÷ stop distance, rounded down to whole lots.
- No entries in the last few bars of the session; square off at the close; a maximum number of trades per day.

### Paper bot: the forward test
A backtest is fitted, knowingly or not, to the data you looked at. The bot runs the rules on bars **one at a time**, computing every signal from past bars only, and logs each decision: signal, fill, stop, exit, or "signal ignored: daily limit reached". Run it across many sessions and compare with the backtest:

| Check | Healthy | Warning |
|---|---|---|
| Average R per trade | Similar sign and size to the backtest | Sign flips or shrinks to near zero |
| Trade frequency | Similar | Far more or far fewer trades |
| Cost share of gross P&L | Similar | Costs eat most of the gross |
| Worst losing streak | Within the backtest's Monte Carlo range | Beyond it |

### From code to broker
Exported code is a **specification you can read**. To trade, your code must send orders through your broker's API. In India that is regulated, and the rules are below.` },
      { h: 'Advanced view', md: `### What breaks between a backtest and live trading
- **Fills.** Live market orders cross the spread and may slip more than the ticks you assumed; limit orders may not fill at all, often on the trades that would have been winners.
- **Data.** Live bars can arrive late, be revised, or miss a print; your code must handle a missing bar without double-counting.
- **State.** If the program restarts mid-session it must reload its position from the broker, not from memory. Reconcile your position with the broker before every new order.
- **Idempotency.** A timeout does not mean an order failed. Re-sending blindly can double your position. Use your own order tags and check order status before retrying.
- **Runaway loops.** A bug that fires an order on every tick can exceed the exchange order-rate threshold and your loss limit within minutes. Hard-code a maximum number of orders per minute and per day, and a daily loss stop that cancels everything.
- **Clock and calendar.** Holidays, special sessions and changed session times (for example NSE's closing-auction changes in 2026) must be read from a calendar, not assumed.

### The kill switch hierarchy
Under SEBI's framework the **exchange** can halt orders carrying a given algo ID, described as the last line of defence. Your broker has its own risk controls. You need a third layer in your own code: a manual stop, a daily loss limit, a maximum position, and an order-rate cap. These are cheap to build and the only ones that act on *your* definition of "something is wrong".

### Overfitting, again
Every parameter you tuned on the backtest makes the live result worse than the backtest, on average. Use the out-of-sample and random-entry tests first, keep the rule simple, and expect live performance to be meaningfully lower than the backtest.` },
      { h: 'India', md: `> [!india] SEBI framework for retail algorithmic trading — as of Nov 2026. Verify on sebi.gov.in, NSE/BSE circulars and your broker's API terms before automating anything; details and thresholds change.

**Legal basis.** SEBI circular "Safer participation of retail investors in Algorithmic trading" (SEBI/HO/MIRSD/MIRSD-PoD/P/CIR/2025/0000013, 4 Feb 2025), with exchange implementation standards (NSE, May 2025). The original 1 Aug 2025 start was extended; a SEBI circular of 30 Sep 2025 set a glide path, and full compliance by all brokers was required from **1 Apr 2026** (reported by brokers and the press; check the circular).

| Rule | What it means for you |
|---|---|
| **Broker is the principal** | Algos reach you only through a broker, who is responsible for them and for your grievances. Algo providers and vendors act as the broker's agents and must be **empanelled with the exchange**; each algo needs exchange approval, and changes need fresh approval. |
| **White box vs black box** | White box: logic disclosed and replicable. Black box: logic not known to the user and not replicable; its provider must be a SEBI-registered **Research Analyst** and keep a research report for each algo. |
| **Algo ID** | Every algo order must carry an exchange-issued identifier. NSE treats client API orders as algo orders. |
| **Self-built algos and the order-rate threshold** | You may write your own algo for yourself (and, once registered, family: spouse, dependent children and parents). Above **10 orders per second** it must be registered through your broker and gets its own algo ID; below that, orders are tagged with a generic retail algo ID. Reports differ on whether the 10 per second applies per exchange or per exchange segment — confirm with your broker. |
| **API access** | No open APIs. Access uses an API key specific to you and the vendor, a **static IP** whitelisted by the broker, and OAuth authentication with two-factor login. Brokers have also moved to daily re-authentication (reported in broker notices, 2026). |
| **Advertising** | Since SEBI's circular of 2 Sep 2022, brokers must not refer, directly or indirectly, to past or expected returns of an algorithm, or associate with platforms that do. A seller quoting algo returns at you is a red flag. |

**What this means in practice:**
- A strategy exported from this app and run through your broker's API from a whitelisted static IP, sending well under 10 orders per second, falls in the self-built, below-threshold category. Your broker decides the exact onboarding steps.
- "Copy my algo, guaranteed 5% a month" offers break the advertising rule and the black-box registration requirement unless the provider is a registered RA working through an empanelled arrangement.

[[link:l4-statarb]]` },
      { h: 'The maths', md: `### Will costs kill the algo before it starts?
Suppose the backtest on Nifty futures shows 300 trades a year, a 45% win rate, average win 1.8R and average loss 1R, with R = ₹3,000 per trade (one lot, 46-point stop × 65).

:::formula
Expectancy per trade (gross) = 0.45 × 1.8R − 0.55 × 1R = 0.81R − 0.55R = 0.26R = ₹780
Round-trip cost of one Nifty futures lot ≈ ₹950–1,000 (see the charges calculator)
Net expectancy ≈ ₹780 − ₹975 = −₹195 per trade → about −₹58,500 a year on 300 trades
:::

The rule looked profitable before costs and loses after them. Automation would execute it faithfully and lose faster. Fixes are economic, not technical: trade less often with a larger R, or find a rule whose gross edge is several times its cost.

[[widget:charges-india]]` },
      { h: 'Common misconceptions', md: `- **"An algo removes emotion, so it will profit."** It removes hesitation, not the need for an edge. Most losses come from rules with no edge after costs.
- **"Backtest profit is what I will earn."** Live results are usually worse: real fills, missed data, parameter overfitting and changing regimes.
- **"Retail algo trading is banned in India."** It is permitted under a broker-responsible framework with algo IDs, API controls and, above a threshold, registration.
- **"A vendor's algo with published returns is approved."** Return claims for algos are prohibited for brokers; exchange empanelment and approval of an algo are not endorsements of its profitability.
- **"If the API times out, just resend."** That is how traders end up with double or triple positions.` },
      { h: 'When it fails', md: `**A realistic failure.** A trader backtests an opening-range breakout on 60 synthetic sessions, sees a profit factor of 1.4, and goes live with 3 lots. On day four the data feed lags; the script reads a stale bar, enters late, and the API times out. The script resends; both orders fill. The stop logic manages only the position it thinks it has (3 lots), so 3 extra lots run unprotected into the close. A gap the next morning turns a planned ₹9,000 risk into a ₹40,000 loss.

What would have prevented it:
1. Reconcile the broker position before and after every order.
2. Use order tags and status checks instead of blind retries.
3. Cap position size and orders per minute in code.
4. A daily loss limit that flattens everything and stops the script.
5. Weeks of paper trading forward before any live order.

The algorithm also fails, more quietly, when the edge was never there: costs, regime change or overfitting. That failure is slower and more common than the dramatic one.` },
      { h: 'Exercise', md: `1. In **Quantitative Research → Backtester**, build a rule (for example opening-range breakout plus close above VWAP), run it, and note trades, average R and costs paid.
2. Press **Send to Strategy bot**. In **Trading Simulator → Strategy bot**, advance several sessions and read the decision log. Compare the bot's average R with the backtest.
3. Back in the Backtester, use **Export as Python** and **Export as Pine Script**. Open the Python file and find the stop, the target and the "last bars" rule. Confirm they match what you set.
4. If you have Python, press **Download these bars (CSV)** next to the export buttons and run the script on that file (python3 strategy.py bars.csv). The trade count and net should match the app.
5. Write down, before any live use: your daily loss limit, maximum position, maximum orders per minute, and the broker's API requirements you would have to meet.` },
    ],
    check: [
      { q: 'Your algo sends at most 2 orders per second through your broker\'s API. Under the framework as of 2026, which describes your position?', o: ['It must be registered as a black-box algo with an RA licence', 'It is below the 10 orders-per-second threshold; it still goes through the broker\'s API controls and is tagged with a generic retail algo ID', 'Retail clients cannot use APIs at all', 'It needs no broker involvement'], a: 1, why: 'Self-built algos below the exchange threshold need not be registered, but they still run only through the broker\'s API with its controls, and orders carry the generic retail algo identifier.' },
      { q: 'A backtest shows gross expectancy of ₹600 per trade on one Nifty futures lot. Round-trip cost is about ₹975. What should you conclude?', o: ['Automate it; consistency will fix the gap', 'The rule loses about ₹375 per trade after costs; automation would lose faster', 'Costs only matter for options', 'Increase position size to cover costs'], a: 1, why: 'Net expectancy = 600 − 975 = −375. Automating a negative-expectancy rule only executes the loss more consistently; bigger size scales the loss.' },
      { q: 'Your script gets a timeout when placing an order. What is the correct next step?', o: ['Resend immediately', 'Query the order book and position by your order tag; act only on the confirmed state', 'Double the next order to catch up', 'Restart the script and assume no position'], a: 1, why: 'A timeout says nothing about whether the order reached the exchange. Reconcile with the broker before sending anything else.' },
      { q: 'Which is a white-box algo?', o: ['A vendor algo whose logic you cannot see', 'Your own rule set whose logic is disclosed and replicable', 'Any algo sold by a Research Analyst', 'Any algo above 10 orders per second'], a: 1, why: 'White box means the logic is disclosed and replicable; black box means it is not known to the user, and its provider must be a registered Research Analyst.' },
    ],
    refs: [
      'SEBI — Safer participation of retail investors in Algorithmic trading, circular SEBI/HO/MIRSD/MIRSD-PoD/P/CIR/2025/0000013 (sebi.gov.in, 4 Feb 2025)',
      'SEBI — Glide path for implementation of the retail algo framework, circular SEBI/HO/MIRSD/MIRSD-PoD/P/CIR/2025/132 (sebi.gov.in, 30 Sep 2025)',
      'NSE — Retail algo trading FAQ and implementation standards (nseindia.com, 2025)',
      'SEBI — circular SEBI/HO/MIRSD/DOP/P/CIR/2022/117 on algo platforms and return claims (2 Sep 2022), as reproduced in NSE circular 64/2022',
      'SEBI — Study: Profitability of individual traders in the equity derivatives segment, FY25–FY26 (sebi.gov.in, 20 Aug 2026)',
      'Ernest P. Chan — Algorithmic Trading: Winning Strategies and Their Rationale (book)',
    ],
  });
  IA.content.questions.push(
    { id: 'L4-M2-q16', module: 'L4-M2', d: 2, q: 'From when did SEBI require all brokers to comply fully with the retail algo framework (as of Nov 2026; verify)?', o: ['1 Aug 2025', '1 Oct 2025', '1 Apr 2026', 'It has no compliance date'], a: 2, why: 'The original 1 Aug 2025 start was extended; the Sep 2025 glide path led to full compliance by all brokers from 1 Apr 2026.' },
    { id: 'L4-M2-q17', module: 'L4-M2', d: 2, q: 'A vendor advertises "our algo made 62% last year" and asks you to connect your broker account. Under SEBI rules, what is the main red flag?', o: ['Nothing; past returns are standard disclosure', 'Brokers may not refer to past or expected algo returns or associate with platforms that do, and a black-box provider must be a registered RA working through an empanelled arrangement', 'Only that 62% is too low', 'Vendors may advertise but not brokers'], a: 1, why: 'SEBI\'s 2022 circular bars return claims for algos by brokers and their associates; the 2025 framework requires empanelment and RA registration for black-box algos.' },
    { id: 'L4-M2-q18', module: 'L4-M2', d: 3, q: 'Your backtest and your paper bot use the same rules on the same synthetic market. The backtest shows +0.20R per trade; the bot forward-tested on new sessions shows −0.05R over 120 trades. What is the best interpretation?', o: ['The bot is broken; trust the backtest', 'The edge did not hold out of sample; treat the rule as unproven and do not automate it with real money', 'Increase risk per trade to recover', 'Optimise parameters on the bot sessions too'], a: 1, why: 'A forward test on unseen data is the honest check. A sign flip over a reasonable sample says the backtest result was likely fit to the data; re-optimising on the new sessions repeats the same mistake.' },
    { id: 'L4-M2-q19', module: 'L4-M2', d: 1, q: 'Under the retail framework, who can halt all orders carrying a particular algo ID as the last line of defence?', o: ['The exchange', 'The algo vendor', 'The client only', 'No one'], a: 0, why: 'The SEBI circular gives exchanges the ability to stop orders from a given algo ID (a kill switch), in addition to broker controls and your own.' },
  );
})(typeof window !== 'undefined' ? window : globalThis);
