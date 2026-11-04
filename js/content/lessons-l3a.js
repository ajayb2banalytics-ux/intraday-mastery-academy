/* Level 3 — Derivatives: L3-M1 Futures, L3-M2 Options foundations, L3-M3 Options strategies and expiry risk.
   Worked option prices in this file come from Black–Scholes with stated inputs (illustrative, not live quotes). */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  IA.content.lessons = IA.content.lessons || []; IA.content.questions = IA.content.questions || [];

  IA.content.lessons.push(
  /* ───────────────────────── L3-M1 FUTURES ───────────────────────── */
  {
    id: 'l3-futures-basics', module: 'L3-M1', level: 3, track: 'deriv', title: 'Futures contracts, specifications and mark-to-market', mins: 20,
    summary: 'Read a futures contract specification, compute notional, margin and daily mark-to-market cash flows for Nifty, Bank Nifty and US index futures.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `A futures contract is a standardised agreement to buy or sell something at a fixed price on a fixed future date. You do not pay the full price today. You post a deposit (margin) with your broker, and every evening the exchange settles your gains and losses in cash. That daily settlement is called **mark-to-market (MTM)**.

Think of it as a running bet on the price, settled every night. If you are long one Nifty futures lot and Nifty futures close 100 points higher, roughly ₹6,500 (100 × 65) lands in your account that evening. If they close 100 lower, ₹6,500 leaves it. Nothing waits until expiry.

Why this matters to an intraday trader: futures let you control a large exposure with a small deposit. One Nifty lot at 25,100 controls about ₹16.3 lakh of index exposure. That is both the attraction and the danger. With an illustrative ₹2 lakh margin per lot (about 8× leverage), a 1% move in the index is about an 8% move on the margin deposit.

> [!note] Futures are **symmetric**: every point up gains exactly what every point down loses. There is no time decay and no premium. Your risk is the full price move times the lot size, for as long as you hold.` },
      { h: 'Intermediate view', md: `### Reading a contract specification
Every exchange publishes a spec sheet. The fields that change your P&L:

| Field | Nifty futures (NSE) | Bank Nifty futures (NSE) | E-mini S&P 500 (CME) |
|---|---|---|---|
| Underlying | Nifty 50 index | Nifty Bank index | S&P 500 index |
| Lot / multiplier | 65 units (contracts from Jan 2026) | 30 units (contracts from Jan 2026) | $50 per index point |
| Tick | ₹0.10 → ₹6.50 per lot | ₹0.20 → ₹6 per lot | 0.25 pt → $12.50 |
| Expiries | Monthly (3 serial months) | Monthly | Quarterly (Mar, Jun, Sep, Dec) |
| Settlement | Cash, to index close on expiry day | Cash | Cash |

Indian **stock futures** are physically settled: if you hold to expiry you give or take delivery of the shares. Index futures are cash-settled.

> [!warn] Lot sizes, tick sizes and expiry days are time-sensitive. Since April 2025 NSE sets index-futures tick sizes by index-level band (0.05 below 15,000; 0.10 from 15,000 to 30,000; 0.20 above 30,000) and reviews them periodically, so the ticks shown here follow from today's index levels. As of Nov 2026 — verify on NSE (nseindia.com, F&O contract specifications and circulars) and CME Group.

### Notional, margin and leverage
- **Notional** = futures price × lot size. Nifty at 25,100 → 25,100 × 65 = ₹16,31,500.
- **Initial margin** in India = SPAN margin + exposure margin, set by the clearing corporation (NSE Clearing) from a risk model. For index futures it has often been in the region of 10–15% of notional (illustrative range, not a fixed rule — verify on NSE Clearing), but it changes with volatility. Use your broker's margin calculator on the day.
- **Leverage** = notional ÷ margin. With ₹2 lakh margin on ₹16.3 lakh notional, leverage is about 8.2×.

[[widget:futures-exposure]]

### Daily settlement
NSE marks open futures positions to a **daily settlement price** (for futures, broadly the volume-weighted price of the last half hour of trading). The difference from the previous settlement price, times your quantity, is credited or debited the same evening. If losses eat into margin below the required level you must top up before the next day or the broker can cut the position.` },
      { h: 'Advanced view', md: `Professionals think in **exposure and cash flow**, not in margin. Three ideas matter.

**1. Margin is a floor, not a risk budget.** Exchange margin is designed to cover a plausible one-to-two-day move for the clearing house. It says nothing about what you can afford to lose. A trader who sizes "as many lots as margin allows" has let the clearing house set their risk — the clearing house is protecting itself, not you.

**2. MTM creates liquidity risk even when the thesis is right.** A hedge fund short futures against a long stock portfolio can be fully hedged and still need to fund large daily MTM debits on the futures while the stock gains are unrealised. Running out of cash is how sound positions get liquidated.

**3. Peak margin and intraday margin.** SEBI's peak-margin framework requires brokers to collect margin based on intraday snapshots, not just end-of-day. Intraday-only "leverage products" that once let traders take futures with a fraction of SPAN are largely constrained. Brokers may still apply their own extra margins near expiry or in volatile sessions.

**Execution detail.** Near-month index futures are deeply liquid with spreads of a tick or two in normal conditions. Far-month contracts and many stock futures are thinner; your fill may be several ticks away from the last traded price. Always look at the bid–ask and depth, not the LTP.

> [!evidence] Established: margin methodology (SPAN + exposure), daily MTM and cash vs physical settlement are exchange rules. Specific margin percentages vary by day and are not fixed facts.` },
      { h: 'The maths', md: `:::formula
Notional = F × lot size
Daily MTM = (Settle_today − Settle_yesterday) × lot size × lots   (long; negative for short)
Leverage = Notional ÷ Margin posted
Return on margin = Index move % × Leverage
:::

### Worked example — Nifty futures, 3 days
You buy 2 lots of Nifty futures at 25,100 at 10:30. Margin assumed ₹2,00,000 per lot (illustrative) → ₹4,00,000 posted.

| Day | Settlement price | Change vs previous | MTM (2 lots × 65) | Cumulative |
|---|---|---|---|---|
| 1 | 25,160 | +60 from entry | +₹7,800 | +₹7,800 |
| 2 | 24,930 | −230 | −₹29,900 | −₹22,100 |
| 3 | 24,990 | +60 | +₹7,800 | −₹14,300 |

Notional at entry = 25,100 × 130 = ₹32,63,000. Leverage on ₹4 lakh = 8.2×. The day-2 move was −0.92% in the index but −7.5% on margin (29,900 ÷ 4,00,000).

### Costs on the round trip (India, as of Nov 2026 — verify)
Buy and sell 1 lot at 25,100 (notional ₹16,31,500 each side):
- STT 0.05% on the sell side only → ₹815.75
- NSE transaction charges ₹183 per crore each side → about ₹29.86 × 2 = ₹59.71
- Stamp duty 0.002% on buy → ₹32.63
- SEBI fee ₹10 per crore → about ₹3.26 total; GST 18% on brokerage + exchange + SEBI fees

Total statutory cost (before brokerage) is roughly ₹925 per lot round trip, about 14 Nifty points. Check with [[widget:charges-india]].` },
      { h: 'India', md: `> [!india] **Bank Nifty futures, intraday.** Bank Nifty futures at 56,200, lot 30. Notional = ₹16,86,000. Each 100-point move = ₹3,000 per lot. Bank Nifty's typical daily range is wider in percentage terms than Nifty's, so per rupee of notional it is the more volatile contract.

Practical points for NSE futures:
- **Expiry:** monthly contracts for both Nifty and Bank Nifty; the expiry weekday has changed more than once in recent years. Verify the current expiry day on NSE.
- **Settlement price on expiry** is the closing value of the underlying index, so a position held into the close of expiry day is settled at the index close, not at the last futures trade.
- **Stock futures** carry physical-settlement obligations at expiry. Brokers often square off open stock futures before expiry if you do not have funds or shares for delivery.
- **F&O ban:** a stock enters ban when market-wide open interest crosses 95% of its market-wide position limit (MWPL); you can only reduce positions while it is in ban (see [[link:l1-circuits]]). SEBI has revised how open interest is measured for these limits since 2024 — as of Nov 2026, verify the current method on NSE.` },
      { h: 'US & global', md: `> [!us] **E-mini S&P 500 (ES)** at 6,000 has notional 6,000 × $50 = $300,000. The **Micro E-mini (MES)** is one-tenth: $5 per point, $30,000 notional. One ES point = $50; a 30-point day = $1,500 per contract.

US futures trade nearly 23 hours a day on CME Globex, so overnight risk is continuous rather than a single gap at the open. Margin is set by CME (maintenance margin) plus broker add-ons; many brokers offer lower **day-trading margins** that revert to full overnight margin if you hold past the session — a position that is fine at 15:55 ET can trigger a margin call at 16:00 ET.

Equity options in the US use a 100-share multiplier, but futures multipliers differ by contract. Never assume — read the spec.` },
      { h: 'Common misconceptions', md: `- **"I only risk my margin."** False. Losses can exceed margin. A gap through your stop can take more than your entire deposit, and you owe the difference.
- **"Futures are for experts, cash is safe."** The instrument is not the risk; the size is. One Nifty lot is ₹16 lakh of exposure. Treat it as such.
- **"Expiry is when I pay or receive."** No — MTM is daily. Expiry is just the last MTM.
- **"Low margin means low risk."** Margin falls when recent volatility is low. That is precisely when complacency is highest and a volatility shock does the most damage.
- **"Futures track the index exactly."** Futures trade at a basis to spot (see [[link:l3-basis]]), which changes intraday.` },
      { h: 'When it fails', md: `Futures fail traders through **size** and **gaps**, not through complexity.

**Losing example.** A trader with ₹5 lakh capital buys 2 Nifty lots at 25,100 (notional ₹32.6 lakh, 6.5× leverage on capital) with a mental stop at 24,950. Overnight, a global sell-off sends Nifty futures to open at 24,650. The stop is irrelevant: the first available price is 450 points below entry. Loss = 450 × 130 = ₹58,500, or 11.7% of capital in one trade. With a planned stop of 150 points the intended risk was ₹19,500.

Other failure modes:
- Margin calls during a drawdown force exits at the worst moment.
- Thin far-month or stock futures give slippage of several ticks per side.
- Holding stock futures into expiry without arranging delivery funds.` },
      { h: 'Exercise', md: `1. Open [[widget:futures-exposure]]. Enter Nifty at 25,100, lot 65, 1 lot, margin ₹2,00,000. Note notional and leverage. Change to 3 lots and record how a 1% index move maps to % of margin.
2. Repeat for Bank Nifty at 56,200, lot 30. Which contract gives more rupee P&L per 1% move? (Hint: compare notionals.)
3. Build a 5-day MTM table in your journal using any five consecutive daily closes from the chart lab [[chart:NIFTY:31:vol]]. Mark the day your cumulative MTM is worst.
4. Use [[widget:charges-india]] to cost a 1-lot round trip and convert the total to Nifty points.` },
    ],
    check: [
      { q: 'You are short 1 Bank Nifty futures lot (30 units). Yesterday settlement 56,400, today 56,150. What is today\'s MTM?', o: ['−₹7,500', '+₹7,500', '+₹250', '+₹16,250'], a: 1, why: 'Short position gains when price falls: (56,400 − 56,150) × 30 = 250 × 30 = ₹7,500 credited. ₹250 is points, not rupees; ₹16,250 uses the Nifty lot size.' },
      { q: 'Your Nifty futures margin is ₹2 lakh on ₹16.3 lakh notional. Nifty falls 1.5%. Approximately what % of your margin do you lose?', o: ['1.5%', 'About 12%', 'About 8%', 'It depends on time to expiry'], a: 1, why: 'Leverage ≈ 16.3 ÷ 2 = 8.15×; 1.5% × 8.15 ≈ 12.2%. Futures have no time decay, so expiry does not change the delta of one.' },
      { q: 'Which statement about Indian stock futures held to expiry is correct?', o: ['They are cash-settled at the index close', 'They expire worthless', 'They are physically settled — you give or take delivery of shares', 'They automatically roll to next month'], a: 2, why: 'NSE stock derivatives are physically settled; index derivatives are cash-settled. Nothing rolls automatically.' },
    ],
    refs: ['NSE — Equity derivatives contract specifications (nseindia.com)', 'NSE Clearing — Margins: SPAN and exposure margin (nseindia.com)', 'CME Group — E-mini S&P 500 futures contract specs (cmegroup.com)', 'John C. Hull — Options, Futures, and Other Derivatives (book)'],
  },

  {
    id: 'l3-basis', module: 'L3-M1', level: 3, track: 'deriv', title: 'Basis, cost of carry, contango and backwardation', mins: 18,
    summary: 'Compute fair futures value from spot, interest rate and dividends, measure basis and roll spread, and explain contango and backwardation.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Nifty spot is 25,000 but Nifty futures show 25,130. Why the gap? Because buying futures lets you get index exposure **without paying the full price today**. You can keep the cash in a deposit earning interest. To be fair to the seller, futures trade at a premium roughly equal to that interest — minus the dividends you miss by not owning the shares.

That premium is the **basis**: {{basis = futures − spot}}. It shrinks every day as expiry approaches and is zero at expiry, because on expiry day the futures settle to the spot close.

- **Contango**: futures above spot (normal for equity indices when interest rates exceed dividend yield).
- **Backwardation**: futures below spot (happens around big dividend dates, in stressed markets, or in commodities in short supply).

Why intraday traders care: if you draw levels on futures but your plan was based on spot (or vice versa) you are off by 100+ points. And a change in basis can move your futures P&L even when spot is unchanged.` },
      { h: 'Intermediate view', md: `### Fair value
The cost-of-carry model links spot (S) and futures (F):

:::formula
F = S × e^((r − q) × t)
r = risk-free rate (annual, continuous), q = dividend yield (annual), t = years to expiry
:::

For short periods {{F ≈ S × (1 + (r − q) × t)}} is close enough.

### Reading basis on a screen
- Compare near-month futures with spot. A premium larger than fair value means futures are **rich**; smaller means **cheap**.
- Basis is noisy intraday: in a sharp sell-off futures often fall faster than spot (premium shrinks or turns to discount) because futures are where leveraged traders hedge first.
- The **calendar (roll) spread** is next-month minus near-month futures. It is roughly the carry for the extra period.

### Contango and backwardation table
| State | Equity index example | Commodity example | Effect on a long rolled position |
|---|---|---|---|
| Contango | Futures 25,130 vs spot 25,000 | Natural gas with storage costs | Pays the roll each month |
| Backwardation | Futures below spot near heavy dividend dates | Crude in a supply squeeze | Earns the roll |

### Arbitrage keeps basis honest
If futures are much richer than fair value, an arbitrageur can buy the basket (or an ETF) and sell futures, locking in the excess basis minus costs. This **cash-futures arbitrage** is why basis rarely strays far from fair value in liquid index markets — but costs (STT, impact, funding) define a band in which it can float.` },
      { h: 'Advanced view', md: `**Implied repo / implied rate.** Rearranging the formula gives the interest rate the market is implying: {{r_implied = ln(F ÷ S) ÷ t + q}}. Desks compare this to their funding cost. When implied rates are well above funding, arbitrage capital flows in and compresses the basis; near quarter-ends and in tight-liquidity periods it can widen.

**Dividends are lumpy.** Indian index dividends cluster in certain months. A contract spanning heavy ex-dividend dates should trade at a lower premium. Stock futures can trade at a **discount** just before a large dividend record date — this is fair value, not a bearish signal.

**Basis risk in hedges.** A hedge with futures protects against spot moves but leaves you exposed to changes in basis. Over a few days the basis can move by tens of points for no fundamental reason.

**Options and basis.** Index option prices are anchored to the **futures** (or synthetic forward), not spot. Put–call parity implies a forward price; if you use spot you will mis-read whether calls or puts are "expensive". See [[link:l3-pricing]].

> [!evidence] Established: cost-of-carry pricing and convergence at expiry follow from no-arbitrage. Claims that "rising premium = bullish smart money" are subjective interpretations — premium also rises mechanically with interest rates and falls with dividends.` },
      { h: 'The maths', md: `### Worked example — Nifty fair value
Spot S = 25,000. Risk-free r = 6.5%, dividend yield q = 1.2%, days to expiry = 30.

:::formula
t = 30 ÷ 365 = 0.0822
(r − q) × t = 0.053 × 0.0822 = 0.004356
F = 25,000 × e^0.004356 = 25,109
Fair basis = 109 points
:::

Actual futures = 25,140 → futures rich by 31 points.
Annualised basis = (109 ÷ 25,000) × (365 ÷ 30) = 5.3% (the net carry, as expected).

### Next-month and roll spread
Next month at 65 days: F2 = 25,000 × e^(0.053 × 65 ÷ 365) = 25,237. Fair roll spread = 25,237 − 25,109 = 128 points. Rolling 2 lots long from near to next costs about 128 × 65 × 2 = ₹16,640 of extra premium — not a loss in itself, it decays to zero by the next expiry, but it is carry you must out-earn.

### Basis decay
With spot unchanged at 25,000, after 15 days the fair basis falls to roughly 25,000 × 0.053 × 15 ÷ 365 ≈ 54 points. A long futures position loses about 55 points (₹3,575 per lot) purely from convergence over that fortnight, all else equal. A short gains the same.` },
      { h: 'India', md: `> [!india] **Bank Nifty basis.** Spot 56,000, r 6.5%, q 0.8%, 21 days: F ≈ 56,000 × (1 + 0.057 × 21 ÷ 365) ≈ 56,184. If the screen shows 56,240, the contract is about 56 points rich. One lot: 56 × 30 = ₹1,680 of excess premium.

Practical points:
- On expiry day the near-month basis collapses to zero by the close; the next-month contract becomes the most-traded and its basis (often 100–200 points on Nifty depending on rates and dividends) can confuse traders who switch charts.
- Pre-open and the first minutes can show distorted basis because spot index constituents have not all traded.
- GIFT Nifty (NSE IX) trades nearly round the clock and is quoted with its own basis to Nifty spot; translating GIFT Nifty to an expected spot open requires subtracting the basis, not reading the number directly ([[link:l2-overnight]]).` },
      { h: 'US & global', md: `> [!us] **Futures fair value pre-market.** US financial TV quotes "S&P futures vs fair value". If ES trades at 6,035 and fair value is 6,025 above an index close of 6,000, the market is indicating a 10-point higher open, not 35.

Commodities show the starkest curves. Crude oil, natural gas and agricultural contracts can swing between steep contango (storage full, costly to carry) and backwardation (immediate scarcity). Commodity ETFs that roll front-month futures in persistent contango can lag the spot price badly over time — a structural effect, not bad management.` },
      { h: 'Common misconceptions', md: `- **"Futures premium means the market expects prices to rise."** Mostly it reflects interest minus dividends. It is not a forecast.
- **"Discount = bearish signal."** A stock future at a discount before a large dividend is simply pricing the dividend.
- **"Roll cost is a fee."** It is the price difference between contracts; it converges away. It only "costs" if spot does not move to compensate.
- **"Arbitrage is risk-free money."** Real arbitrage has execution risk, funding risk, costs and margin calls. The band of no-arbitrage is set by those frictions.` },
      { h: 'When it fails', md: `**Losing example — the basis squeeze.** A trader is long Nifty spot exposure via ETF (₹16 lakh) and short 1 Nifty futures lot at a rich 25,180 vs fair 25,110, expecting to capture 70 points of excess basis. A rally led by futures pushes the premium even richer: futures 25,260 vs spot 25,050 the same day (basis 210, up from about 180). The hedge is right in the long run (convergence at expiry), but today the futures leg is debited 80 points × 65 = ₹5,200 in cash MTM while the ETF gain (about 50 points, ≈ ₹3,200 on ₹16 lakh) is only on paper — a net basis loss of about 30 points (≈ ₹1,950) plus a cash outflow of ₹5,200. If they panic and unwind, they lock in the loss.

Basis analysis also fails when: interest-rate assumptions are wrong, dividend estimates are wrong, or liquidity in the contract is thin enough that the quoted price is not tradable.` },
      { h: 'Exercise', md: `1. In your journal, record spot and near-month futures for Nifty at 09:20, 12:00 and 15:20 on three different days. Compute basis each time and compare with fair value from the formula.
2. Use [[widget:futures-exposure]] to model a long 1-lot Nifty futures position and enter an unchanged spot with basis shrinking from 109 to 54. Record the P&L.
3. Open [[chart:NIFTY:58:vwap]] and note a level on spot. Add the current basis and work out where the same level sits on the futures chart.` },
    ],
    check: [
      { q: 'Spot 25,000, r = 6.5%, q = 1.2%, 30 days. Fair futures ≈ 25,109. Futures trade at 25,060. What is the best description?', o: ['Futures are rich by 60 points', 'Futures are cheap by about 49 points versus fair value', 'The market expects a 60-point rally', 'Futures are in backwardation'], a: 1, why: '25,060 is below fair value 25,109 by 49 points, so cheap. It is still above spot (contango), so not backwardation. Basis is not a forecast.' },
      { q: 'With spot unchanged, what happens to a long near-month futures position as expiry approaches in contango?', o: ['It gains as basis widens', 'It loses as basis converges to zero', 'Nothing — futures have no time effect', 'It is rolled automatically'], a: 1, why: 'In contango the futures premium decays to zero at expiry, so a long loses the premium if spot is flat; a short gains it.' },
    ],
    refs: ['John C. Hull — Options, Futures, and Other Derivatives (book)', 'NSE — Futures pricing and cost of carry (NCFM study material, nseindia.com)', 'CME Group — Understanding futures fair value (cmegroup.com)'],
  },

  {
    id: 'l3-futures-risk', module: 'L3-M1', level: 3, track: 'deriv', title: 'Futures leverage, rollover and hedging', mins: 20,
    summary: 'Size futures by risk not margin, decide when and how to roll, and compute a beta hedge for an Indian or US portfolio.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Leverage magnifies whatever you are. If your trades have a small edge, leverage magnifies it; if they have no edge or a negative one after costs, leverage gets you to the end faster.

Futures give you three tools:
1. **Speculation** — take directional exposure with less capital.
2. **Rollover** — keep a position past expiry by closing the near month and opening the next.
3. **Hedging** — offset the market risk of a stock portfolio, a business exposure or an options position.

The habit to build first: **size by the money you are willing to lose if your stop is hit, not by how many lots your margin allows.** Margin tells you the maximum you are *allowed* to do. Your risk plan tells you what you *should* do.

> [!warn] SEBI's study of individual F&O traders (published 2024, covering FY22–FY24) reported that a large majority — around nine in ten — made net losses (source: SEBI, sebi.gov.in). Leverage without a sizing rule is a central reason. This is not personal advice; paper trade first.` },
      { h: 'Intermediate view', md: `### Sizing by risk
:::formula
Lots = (Capital × risk %) ÷ (stop distance in points × lot size)
:::
Capital ₹10 lakh, risk 1% = ₹10,000. Nifty futures long at 25,100, stop 24,980 (120 points). Risk per lot = 120 × 65 = ₹7,800. Lots = 10,000 ÷ 7,800 = 1.28 → **1 lot**. Bank Nifty with a 300-point stop: 300 × 30 = ₹9,000 → 1 lot.

If the stop distance that makes sense on the chart gives zero lots, the trade is too big for your account. Do not tighten the stop to make it fit. Use smaller instruments (cash equity, ETF, or a mini contract where available).

[[widget:position-size]]

### Rollover mechanics
- Close the near month and open the next in one go (many brokers offer a calendar-spread order).
- Cost of rolling = bid–ask on two legs + statutory charges + the price of the spread versus fair value.
- Typical timing: index futures liquidity migrates to next month in the last few sessions before expiry. Rolling early pays a bit more carry; rolling on expiry day risks wider spreads and erratic basis.

### Hedging a portfolio with index futures
:::formula
Hedge lots = (Portfolio value × β) ÷ (Futures price × lot size)
:::
β is the portfolio's sensitivity to the index (estimated by regression of returns; see [[link:l4-correlation-regression]]).` },
      { h: 'Advanced view', md: `**Leverage is a portfolio property.** One Nifty lot plus one Bank Nifty lot plus long HDFC Bank stock is mostly one bet on Indian banks and large caps. Add notionals with their correlations, not lot counts.

**Gap risk sets the real maximum leverage.** If a 3% overnight gap is plausible (moves of that size have occurred in Indian indices around election results and global shocks), then at 8× leverage on margin a single gap is about 24% of margin. Professionals cap gross leverage so that a stress move — not a typical day — is survivable.

**Hedge imperfections:**
- **Basis risk**: futures vs spot changes ([[link:l3-basis]]).
- **Beta instability**: β estimated over a calm year can be wrong in a crash, when correlations rise.
- **Rounding**: you cannot hedge 3.37 lots. You choose 3 (under-hedged) or 4 (over-hedged).
- **Cash flow**: the futures leg pays MTM daily; the portfolio gain is unrealised. Keep a cash buffer.

**Delta-hedging options with futures.** Option desks neutralise delta with futures. A long call book with total delta of +130 units equals 2 Nifty futures lots (2 × 65). Selling 2 lots makes it delta-neutral at that instant; gamma means it will drift ([[link:l3-greeks]]).` },
      { h: 'The maths', md: `### Worked example — beta hedge
Portfolio ₹50,00,000 of large-cap Indian stocks, β = 1.1 to Nifty. Nifty futures 25,100, lot 65 → notional per lot ₹16,31,500.

:::formula
Hedge notional = 50,00,000 × 1.1 = ₹55,00,000
Lots = 55,00,000 ÷ 16,31,500 = 3.37 → 3 lots short
Residual beta exposure = 55,00,000 − 3 × 16,31,500 = ₹6,05,500
:::

If Nifty falls 4%: expected portfolio loss ≈ 50 lakh × 1.1 × 4% = ₹2,20,000. Futures gain ≈ 3 × 16,31,500 × 4% = ₹1,95,780. Net ≈ −₹24,220 (the unhedged residual), before basis changes and stock-specific moves.

### Worked example — gap stress
You hold 2 Nifty lots long overnight at 25,100. Stress gap −2.5% → 627.5 points. Loss = 627.5 × 130 = ₹81,575. If your capital is ₹6 lakh, that is 13.6% in one open. Ask yourself whether that is acceptable *before* holding overnight.

### Roll cost
Near 25,109 (fair), next 25,237 (fair). Roll 3 short lots at fair: you **receive** 128 points of extra premium × 195 units = ₹24,960 more in the new short — which decays to zero by the next expiry if spot is flat. For a short hedger contango is carry income; for a long speculator it is carry cost.` },
      { h: 'India', md: `> [!india] **Hedging a Bank Nifty-heavy portfolio.** Banking stocks worth ₹30 lakh with β 1.0 to Bank Nifty. Bank Nifty futures 56,200 × 30 = ₹16,86,000 per lot. Lots = 30,00,000 ÷ 16,86,000 = 1.78 → 2 lots short (over-hedged by about ₹3.7 lakh). If Bank Nifty rises 2%, the over-hedge costs about ₹7,400 relative to a perfect hedge.

India specifics:
- Brokers apply higher margins in expiry week and may block fresh positions in contracts nearing expiry.
- Position limits apply per client and per market-wide open interest; large hedges may need to be split across contracts.
- Statutory costs on futures (STT 0.05% sell side as of Nov 2026) make frequent intraday hedging adjustments expensive; budget them with [[widget:charges-india]].` },
      { h: 'US & global', md: `> [!us] **Hedging with MES.** A $200,000 US portfolio, β 1.2 to the S&P 500, index at 6,000. Hedge notional $240,000. ES notional = $300,000 (too big); MES = $30,000 → 8 MES contracts short. Granularity is the reason micro contracts exist.

An alternative US hedge is buying puts on SPY or SPX. Puts cap downside without capping upside but cost premium and decay (theta). Futures cost nothing upfront but remove upside too. The choice depends on whether you want insurance (puts) or neutrality (futures).` },
      { h: 'Common misconceptions', md: `- **"Hedged means risk-free."** A hedge removes one risk (market direction) and leaves others (basis, beta error, stock-specific, funding).
- **"Rolling resets my loss."** Rolling a losing position simply carries it forward. The loss is real and already debited via MTM.
- **"I can always add margin."** Margin calls arrive when markets are stressed and you are least able to think clearly.
- **"Max lots by margin = my position size."** That confuses permission with prudence.` },
      { h: 'When it fails', md: `**Losing example — the over-levered roll.** A trader long 4 Nifty lots (₹65 lakh notional on ₹10 lakh capital) rolls into next month to "give the trade more time". The next week Nifty falls 3%: loss = 25,100 × 3% × 260 units ≈ ₹1,95,780 — 19.6% of capital. The roll did not fail; the sizing did.

Hedges fail when β shifts (a defensive portfolio that suddenly trades like the market), when one stock in a concentrated book gaps on news (the index hedge does nothing), or when the hedger lifts the hedge after a loss on the futures leg just before the market falls.` },
      { h: 'Exercise', md: `1. With [[widget:position-size]], size Nifty futures for your capital with 1% risk and stops of 80, 150 and 250 points. Record lots each time.
2. Use [[widget:leverage]] to see how gross leverage changes from 1 to 4 lots on your capital. Note the lots at which a 2.5% gap exceeds 10% of capital.
3. In the journal, design a beta hedge for a hypothetical ₹25 lakh portfolio with β 0.9. How many Nifty lots? What is the residual?
4. Run [[widget:ror]] with a 1% vs 4% risk per trade and compare risk of ruin.` },
    ],
    check: [
      { q: 'Capital ₹8 lakh, risk 1%. Bank Nifty futures stop 350 points. How many lots (lot 30)?', o: ['0 lots — risk per lot ₹10,500 exceeds ₹8,000', '1 lot', '2 lots', 'As many as margin allows'], a: 0, why: 'Risk per lot = 350 × 30 = ₹10,500 > ₹8,000 budget. The correct answer is to skip or use a smaller instrument, not to tighten the stop or ignore the rule.' },
      { q: 'Portfolio ₹40 lakh, β 1.2, Nifty futures 25,000 × 65. Hedge lots?', o: ['About 2.5', 'About 2.95 → 3 lots', 'About 3.7', 'About 4.8'], a: 1, why: 'Hedge notional = 40 × 1.2 = ₹48 lakh. Per lot = 25,000 × 65 = ₹16.25 lakh. 48 ÷ 16.25 = 2.95 → 3 lots.' },
    ],
    refs: ['John C. Hull — Options, Futures, and Other Derivatives (book)', 'SEBI — Study on profit and loss of individual traders in equity F&O (2024, sebi.gov.in)', 'NSE — Hedging with index futures (NCFM material, nseindia.com)', 'CME Group — Micro E-mini equity index futures (cmegroup.com)'],
  },

  /* ───────────────────────── L3-M2 OPTIONS FOUNDATIONS ───────────────────────── */
  {
    id: 'l3-options-basics', module: 'L3-M2', level: 3, track: 'deriv', title: 'Calls, puts, moneyness, intrinsic and time value', mins: 22,
    summary: 'Compute payoff, breakeven, intrinsic and time value for long and short calls and puts, and know how Indian and US options settle.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `An option is a contract that gives the **buyer a right, not an obligation**, and puts the **seller under an obligation**.

- A **call** gives the buyer the right to buy the underlying at the **strike** price.
- A **put** gives the buyer the right to sell the underlying at the strike.
- The buyer pays a **premium** to the seller up front.

Analogy: a call is like a non-refundable booking fee that locks a flat's price. If prices rise, your booking is valuable. If they fall, you walk away and lose only the fee. The seller of that booking keeps the fee but must deliver at the fixed price however high the market goes.

That asymmetry is the whole subject. The buyer's loss is capped at the premium but the probability of losing some or all of it is often high. The seller's gain is capped at the premium but the loss can be large — unlimited for a short call. **Neither side is "safe" and neither is "cheap risk".** They are different shapes of risk.

> [!warn] Losing 100% of premium on a long option is a common outcome, not a rare one. Selling options produces frequent small gains punctuated by occasional large losses. Size both accordingly.` },
      { h: 'Intermediate view', md: `### Moneyness (for a call; reverse for a put)
| Term | Call | Put | Intrinsic value |
|---|---|---|---|
| In the money (ITM) | Spot > strike | Spot < strike | Positive |
| At the money (ATM) | Spot ≈ strike | Spot ≈ strike | ≈ 0 |
| Out of the money (OTM) | Spot < strike | Spot > strike | 0 |

**Premium = intrinsic value + time value.** Intrinsic is what you would get by exercising now. Time value is what the market charges for the chance of the option becoming more valuable before expiry. At expiry time value is zero.

### The four basic positions
| Position | Max gain | Max loss | Breakeven at expiry | Margin | Vega | Theta |
|---|---|---|---|---|---|---|
| Long call | Unlimited | Premium paid | Strike + premium | Premium paid upfront (no margin) | + | − |
| Short call | Premium received | Unlimited | Strike + premium | Full SPAN + exposure | − | + |
| Long put | Strike − premium (underlying to 0) | Premium paid | Strike − premium | Premium only | + | − |
| Short put | Premium received | Strike − premium (large) | Strike − premium | Full SPAN + exposure | − | + |

**Expiry risk**: long options can expire worthless; short options can be assigned or move sharply ITM in the final hours. **Market suitability**: long calls/puts for a strong directional view with an expected move larger than the premium; short options for range or slow-drift views where you accept tail risk.

[[widget:options-payoff]]

### European vs American
- **European**: exercise only at expiry. All NSE index options (Nifty, Bank Nifty) are European and **cash-settled**.
- **NSE stock options** are European but **physically settled**: an ITM stock option at expiry results in delivery of shares (long call → you buy shares at strike; short call → you deliver).
- **American**: exercise any time up to expiry. US equity and ETF options (AAPL, SPY) are American, and the seller can be **assigned early**. SPX index options are European and cash-settled.

### Exercise at expiry in India
NSE options are not exercised by hand. At expiry the clearing corporation **automatically exercises** every ITM contract and lets OTM ones lapse. For stock options NSE offers a "do not exercise" instruction only for strikes close to the money (as of Nov 2026, verify the current rule on NSE). If you are long an ITM stock option, plan on delivery unless you close it.` },
      { h: 'Advanced view', md: `**Put–call parity** ties calls, puts and the forward together for European options: {{C − P = PV(F − K)}}. If parity breaks beyond costs, arbitrage (conversions and reversals) restores it. Practical use: if a call looks "cheap" while the put at the same strike looks "expensive", check the forward — it is usually the forward that has moved.

**Exercise and STT in India.** As of Nov 2026 (verify on NSE and the Income Tax department), STT is 0.15% of premium when you sell an option, and an option **exercised** at expiry attracts STT of 0.15% on its **intrinsic (settlement) value**, payable by the buyer. For a cash-settled index option the two bases are similar at expiry, because premium has converged to intrinsic. The bigger traps are elsewhere: brokers may charge an exercise or delivery fee, and an ITM **stock** option turns into a share delivery obligation, with the full contract value of shares to fund and delivery-related charges on top. How STT applies to the resulting share delivery (the delivery-equity rate on the full contract value or a different basis) has changed in past budgets and is not in this app's verified fact list — check the current treatment on your contract note or NSE before you rely on it. Many professionals close ITM options before the final minutes rather than leave them to exercise — compare the contract-note cost both ways with your broker.

**Physical settlement of stock options.** A long ITM Reliance call at expiry obliges you to pay for the full lot of shares; a short ITM put obliges you to buy them. Brokers raise margins in the days before expiry and may square off positions you cannot fund.

**Early assignment in the US.** For American calls, early exercise is usually only rational just before an ex-dividend date when the remaining time value is less than the dividend. Short ITM calls over ex-dividend dates and short ITM puts with little time value are the classic assignment candidates.

> [!evidence] Established: payoff shapes, parity and settlement mechanics are contractual. Any claim that buyers or sellers "usually win" depends on the period, product and costs — treat it as unverified unless you have the data.` },
      { h: 'The maths', md: `:::formula
Long call payoff at expiry = max(S_T − K, 0) − premium
Long put payoff at expiry  = max(K − S_T, 0) − premium
Call breakeven = K + premium     Put breakeven = K − premium
Intrinsic (call) = max(S − K, 0)    Time value = premium − intrinsic
:::

### Worked example — Nifty, 7 days to expiry
Spot 25,000. Illustrative Black–Scholes prices (IV 13%, r 6.5%): 25,000 CE ₹195, 24,800 CE ₹317, 25,200 CE ₹108, 25,000 PE ₹164.

- 24,800 CE: intrinsic 200, time value 117. ITM.
- 25,200 CE: intrinsic 0, time value 108. OTM.
- **Long 1 lot 25,000 CE at ₹195**: cost 195 × 65 = ₹12,675 (max loss). Breakeven 25,195. If Nifty settles at 25,400: payoff (400 − 195) × 65 = ₹13,325. At 25,000 or below: −₹12,675.
- **Short 1 lot 25,000 PE at ₹164**: receive ₹10,660 (max gain). Breakeven 24,836. If Nifty settles at 24,400: loss (600 − 164) × 65 = ₹28,340. Max loss if Nifty went to zero = (25,000 − 164) × 65 ≈ ₹16.1 lakh.

### STT on exercise (India, rates as of Nov 2026 — verify)
Long 25,000 CE held to expiry, settles at 25,400. Intrinsic = 400 × 65 = ₹26,000. STT on exercise at 0.15% = ₹39, paid by the buyer. Had you sold it at ₹400 just before the close, STT on the sale = 0.15% × ₹26,000 = ₹39 as well — the same, because premium ≈ intrinsic at expiry. Exchange charges and any broker exercise fee differ between the two routes. For **stock options** the decisive cost is the physical delivery: you must fund (or deliver) the full lot of shares. Always check your broker's contract note.` },
      { h: 'India', md: `> [!india] **Bank Nifty monthly, 21 days.** Spot 56,000, IV 15%: 56,000 CE ≈ ₹911, 56,000 PE ≈ ₹702. Long 1 lot CE = ₹27,330 at risk (911 × 30). Breakeven 56,911 — Bank Nifty must rise 1.6% by expiry just to break even. Short 1 lot PE: receive ₹21,060; breakeven 55,298; margin is SPAN + exposure (often ₹1 lakh+ per lot; check broker).

- Nifty weekly options expire on Tuesday (as of Nov 2026); Bank Nifty has **monthly** options only. Verify on NSE.
- Strikes far OTM often trade at a few rupees with wide spreads; the displayed LTP may be stale. Use the bid–ask, not LTP.` },
      { h: 'US & global', md: `> [!us] **AAPL, 30 days.** Stock $230, IV 28%: 230 call ≈ $7.74, 230 put ≈ $6.98. Long 1 call = $774 at risk (multiplier 100); breakeven $237.74. Short 1 put: receive $698; breakeven $223.02; cash-secured requirement $23,000 minus premium, or broker margin (Reg T) if in a margin account. The put can be **assigned early** — you could be handed 100 shares before expiry.

SPY options are American and physically settled into ETF shares; SPX options are European, cash-settled and have different tax treatment in the US. Do not assume one behaves like the other.` },
      { h: 'Common misconceptions', md: `- **"Buying options is cheap risk."** The premium is small relative to notional but the chance of losing all of it is significant, and repeated small total losses compound into large ones.
- **"Selling options is safe income."** The return is capped while the loss is not. A single gap can erase many months of premium.
- **"OTM options are better value because they are cheaper."** Price per lot is lower but probability of payoff is also lower. Cheap is not the same as good value.
- **"An ITM option is guaranteed profit."** Only if intrinsic exceeds what you paid, after costs.
- **"Indian stock options settle in cash like Nifty."** They are physically settled at expiry if ITM.` },
      { h: 'When it fails', md: `**Long option failure.** You buy 1 lot Nifty 25,200 CE at ₹108 (₹7,020) expecting a breakout. Nifty rallies to 25,180 by expiry — you were right on direction — yet the option expires worthless. Direction was right; **magnitude and timing** were not enough.

**Short option failure.** You sell 2 lots Nifty 24,600 PE at ₹40 (₹5,200 received) "because it is far OTM". An overnight shock gaps Nifty to 24,300 and IV jumps from 13% to about 20%. With 6 days left the put now trades near ₹410 (Black–Scholes). Loss ≈ (410 − 40) × 130 = ₹48,100 — over nine times the premium you collected.` },
      { h: 'Exercise', md: `1. In [[widget:options-payoff]], build a long 25,000 CE at ₹195 (lot 65) and a short 25,000 PE at ₹164. Read off breakeven and P&L at 24,400, 25,000 and 25,600.
2. Repeat with AAPL 230 call at $7.74 (multiplier 100). Compare breakeven as % of spot with the Nifty example.
3. On [[chart:NIFTY:12:atr]] estimate the average 5-day range. Is it larger than the breakeven distance of an ATM weekly option? Record in your journal.` },
    ],
    check: [
      { q: 'Nifty spot 25,000. The 24,800 CE trades at ₹317. What is its time value?', o: ['₹317', '₹200', '₹117', '₹0'], a: 2, why: 'Intrinsic = 25,000 − 24,800 = 200. Time value = 317 − 200 = 117.' },
      { q: 'You are short 1 lot Bank Nifty 56,000 PE at ₹702 (lot 30). Bank Nifty settles at 55,000. P&L?', o: ['+₹21,060', '−₹8,940', '−₹30,000', '−₹51,060'], a: 1, why: 'Intrinsic at expiry = 1,000. Loss per unit = 1,000 − 702 = 298. 298 × 30 = −₹8,940.' },
      { q: 'Which option is most exposed to early assignment?', o: ['A short Nifty ITM call', 'A short AAPL ITM call the day before ex-dividend', 'A long SPY put', 'A short SPX put'], a: 1, why: 'Nifty and SPX options are European (no early exercise). Long positions are never assigned. American calls are commonly exercised just before ex-dividend when time value is below the dividend.' },
    ],
    refs: ['John C. Hull — Options, Futures, and Other Derivatives (book)', 'Sheldon Natenberg — Option Volatility and Pricing (book)', 'NSE — Physical settlement of stock derivatives (nseindia.com)', 'The Options Industry Council — Options assignment and exercise (optionseducation.org)'],
  },

  {
    id: 'l3-pricing', module: 'L3-M2', level: 3, track: 'deriv', title: 'How options are priced: Black–Scholes intuition', mins: 22,
    summary: 'Explain the five inputs to an option price, compute a Black–Scholes value step by step, and know where the model breaks.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `An option's price is the market's estimate of its **expected payoff**, adjusted for the time value of money. Five things drive it:

1. **Spot vs strike** — how far in or out of the money.
2. **Time to expiry** — more time, more chance of a big move.
3. **Volatility** — bigger expected swings, more chance of a large payoff.
4. **Interest rates** — slightly raise calls, lower puts.
5. **Dividends** — lower calls, raise puts.

Only one of these is not directly observable: **volatility**. That is why options traders talk about "buying vol" or "selling vol" — the price of an option is, in effect, a price for expected movement.

Analogy: an insurance premium depends on what you insure (strike), for how long (time), and how risky the driver is (volatility). Options work the same way.` },
      { h: 'Intermediate view', md: `### Black–Scholes in plain words
The Black–Scholes–Merton model assumes the underlying moves randomly with constant volatility and no jumps, and that you can continuously hedge. Under those assumptions the call price is:

:::formula
C = S × N(d1) − K × e^(−rT) × N(d2)
P = K × e^(−rT) × N(−d2) − S × N(−d1)
d1 = [ln(S ÷ K) + (r + σ² ÷ 2) × T] ÷ (σ × √T)
d2 = d1 − σ × √T
:::

- {{N(d2)}} is (roughly) the risk-neutral probability the call finishes ITM.
- {{N(d1)}} is the call's delta — how many units of the underlying it behaves like.
- {{σ√T}} is the expected one-standard-deviation move over the life of the option, in % terms.

### The expected-move shortcut
An ATM straddle (call + put) costs roughly {{0.8 × S × σ × √T}}. This gives a fast read of how much movement the market is pricing. Nifty 25,000, IV 13%, 7 days: 0.8 × 25,000 × 0.13 × √(7/365) ≈ 360 points. The model straddle (195 + 164 = ₹359) agrees.

[[widget:greeks]]

### What each input does (holding others fixed)
| Increase in | Call | Put |
|---|---|---|
| Spot | ↑ | ↓ |
| Strike | ↓ | ↑ |
| Time | ↑ (usually) | ↑ (usually) |
| Volatility | ↑ | ↑ |
| Interest rate | ↑ slightly | ↓ slightly |
| Dividends | ↓ | ↑ |` },
      { h: 'Advanced view', md: `**The model is a translator, not a truth.** Traders quote options in implied volatility because it normalises across strikes and expiries. The model's assumptions are known to be wrong:

- **Jumps and fat tails**: real returns have more extreme days than a normal distribution. Markets price this as a **volatility skew** — OTM puts on indices trade at higher IV than OTM calls.
- **Volatility is not constant**: it clusters and mean-reverts.
- **Hedging is discrete and costly**: STT, spreads and gaps make continuous hedging impossible.

**Forward, not spot.** For index options use the forward (or futures price) F in place of spot and discount the whole payoff at r — the Black-76 form: {{C = e^(−rT) × [F × N(d1) − K × N(d2)]}} with {{d1 = [ln(F ÷ K) + σ²T ÷ 2] ÷ (σ√T)}}. This removes the need to guess the dividend yield, because the futures price already embeds it. Using spot with an incorrect dividend assumption mis-prices calls versus puts. (The worked Nifty numbers in this module use spot with zero dividend yield for simplicity; with a 1.2% dividend yield the 7-day 25,000 CE would be about ₹192 instead of ₹195.)

**American options.** US equity options can be exercised early, so they are priced with binomial trees or similar methods; for non-dividend-paying stocks an American call is worth the same as a European call (early exercise is never optimal), while an American put is worth at least as much as the European put and usually slightly more.

> [!evidence] Established: the Black–Scholes formula and its no-arbitrage derivation (Black, Scholes, Merton, 1973). Empirically mixed: how well it fits — skew and term structure show the market systematically adjusts for its limitations.` },
      { h: 'The maths', md: `### Worked Black–Scholes — Nifty 25,000 CE, 7 days
Inputs: S = 25,000, K = 25,000, T = 7/365 = 0.01918, r = 0.065, σ = 0.13.

:::formula
σ√T = 0.13 × 0.1385 = 0.01800
ln(S/K) = 0
(r + σ²/2) × T = (0.065 + 0.00845) × 0.01918 = 0.001409
d1 = 0.001409 ÷ 0.01800 = 0.0782
d2 = 0.0782 − 0.0180 = 0.0602
N(d1) = 0.5312   N(d2) = 0.5240
K e^(−rT) = 25,000 × 0.99875 = 24,968.8
C = 25,000 × 0.5312 − 24,968.8 × 0.5240 = 13,280 − 13,084 = ₹195 (to rounding)
P = C − S + K e^(−rT) = 195 − 25,000 + 24,968.8 = ₹164
:::

### Sensitivity checks
- IV up from 13% to 16%: call ≈ ₹237 (+₹41 per unit, about ₹2,690 per lot).
- Same option with 35 days left: ≈ ₹483. Five times the time does not give five times the price — value scales with √T.
- 1 day left: ≈ ₹70. Time value is concentrated near expiry, which is why weekly ATM options lose value fastest in their last days.

### US example
AAPL $230, 30 days, IV 28%, r 4%: 230 call ≈ $7.74 ($774 per contract), 230 put ≈ $6.98. Expected move ≈ 0.8 × 230 × 0.28 × √(30/365) ≈ $14.6, consistent with the straddle ($14.72).` },
      { h: 'India', md: `> [!india] On NSE the option chain shows IV for each strike, computed by the exchange from traded prices. For Bank Nifty 56,000, 21 days, IV 15%: CE ≈ ₹911, PE ≈ ₹702. The straddle ≈ ₹1,613 → market pricing a move of about ±2.9% to expiry. If you think Bank Nifty will move less than that, the straddle is "expensive" to you; more, it is "cheap" — but that is a view, not a fact.

Use the futures price, not spot, as the reference for Indian index options. The call–put difference at the ATM strike reflects the carry in the futures.` },
      { h: 'US & global', md: `> [!us] **SPY 600, 30 days, IV 15%**: ATM call ≈ $11.29, put ≈ $9.32 (with r 4%). Straddle ≈ $20.61 per share ($2,061 per pair) → about ±3.4% priced move.

US quotes are in dollars per share with a multiplier of 100. Most US platforms show IV and Greeks per contract; many Indian platforms show them per unit. Always check whether a displayed theta is per unit or per lot.` },
      { h: 'Common misconceptions', md: `- **"The model price is the fair price."** It is fair only under its assumptions. The market price embeds the crowd's view of volatility and tail risk.
- **"N(d2) is the real probability."** It is a risk-neutral probability; real-world probabilities differ.
- **"Doubling time doubles value."** Value scales roughly with the square root of time.
- **"High IV means the option will go up."** High IV means the option is expensive relative to a lower-IV world. If realised movement disappoints, high-IV options lose value fast.` },
      { h: 'When it fails', md: `**Losing example — trusting the model through a gap.** A trader sells 1 lot Nifty 25,400 CE at ₹53 on the model's 21% delta, intending to delta-hedge with futures each hour. Overnight, positive news gaps Nifty to 25,500. No hedge was possible between 15:30 and 09:15. The call now trades near ₹240. Loss ≈ (240 − 53) × 65 = ₹12,155 on a position whose model risk at the close looked modest.

The model also fails when liquidity vanishes (the "price" you computed cannot be traded) and around events (results, RBI policy, elections) where the distribution is not lognormal but two-humped.` },
      { h: 'Exercise', md: `1. Open [[widget:greeks]]. Enter Nifty 25,000, strike 25,000, 7 days, IV 13%, r 6.5%. Confirm a call near ₹195 and put near ₹164.
2. Change only IV to 16%, then only days to 35, then only days to 1. Record the price each time in your journal.
3. Calculate the expected move with {{0.8 × S × σ × √T}} for Bank Nifty 56,000, IV 15%, 21 days. Compare with the straddle in the widget.` },
    ],
    check: [
      { q: 'Nifty 25,000, IV 13%, 28 days. Approximate ATM straddle price?', o: ['About ₹180', 'About ₹720', 'About ₹1,450', 'About ₹3,250'], a: 1, why: '0.8 × 25,000 × 0.13 × √(28/365) = 2,600 × 0.277 ≈ ₹720. Model call ₹424 + put ₹299 = ₹723.' },
      { q: 'Which change raises both call and put prices?', o: ['Higher spot', 'Higher interest rate', 'Higher implied volatility', 'Higher dividend'], a: 2, why: 'Both calls and puts have positive vega. Spot, rates and dividends push calls and puts in opposite directions.' },
    ],
    refs: ['Fischer Black and Myron Scholes — The Pricing of Options and Corporate Liabilities (Journal of Political Economy, 1973)', 'John C. Hull — Options, Futures, and Other Derivatives (book)', 'Sheldon Natenberg — Option Volatility and Pricing (book)', 'Euan Sinclair — Volatility Trading (book)'],
  },

  {
    id: 'l3-greeks', module: 'L3-M2', level: 3, track: 'deriv', title: 'The Greeks: delta, gamma, theta, vega, rho', mins: 25,
    summary: 'Use the Greeks to compute delta-equivalent exposure, daily theta, vega P&L and gamma risk for single options and positions.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `The Greeks are sensitivities — they answer "if X changes a little, how much does my option change?"

| Greek | Question it answers | Long option sign |
|---|---|---|
| **Delta** | How much does the option move per 1-point move in the underlying? | Call +, put − |
| **Gamma** | How fast does delta itself change? | + |
| **Theta** | How much value is lost per day, all else equal? | − |
| **Vega** | How much does the option change per 1-point change in IV? | + |
| **Rho** | How much per 1% change in interest rates? | Call +, put − (small) |

Short options flip every sign. That is the trade-off in one line: **long options pay theta to own gamma and vega; short options earn theta by being short gamma and vega.** Neither is free.` },
      { h: 'Intermediate view', md: `### Delta-equivalent exposure
The single most useful number: {{Delta-equivalent units = delta × lot size × lots}}. It tells you how many units of the underlying (or futures) your position behaves like right now.

Example: long 2 lots Nifty 25,000 CE, delta 0.53 → 0.53 × 65 × 2 = 69 units ≈ 1.06 Nifty futures lots. Rupee delta = 69 × 25,000 ≈ ₹17.3 lakh of index exposure.

[[widget:greeks]]

### Gamma
Gamma is highest for ATM options close to expiry. A Nifty 25,000 CE with 7 days has gamma ≈ 0.00088 per point: a 100-point rise lifts delta from 0.53 to about 0.62. With 1 day left gamma is about 0.0023 — a 100-point move swings delta by 0.23. This is **expiry-day gamma**: small moves cause large swings in position exposure.

### Theta
Theta for the 7-day ATM Nifty call is about −₹15 per unit per day (−₹983 per lot). On the final day the ATM option's remaining value (₹70 at 1 day) can go to zero in hours.

### Vega
Vega ≈ ₹13.8 per unit per 1 IV point for the 7-day ATM call. If IV falls from 16% to 13% after an event, the option loses about ₹41 per unit even if Nifty does not move.

[[widget:futures-exposure]]` },
      { h: 'Advanced view', md: `**Gamma–theta trade-off.** For a delta-hedged option, the daily P&L is approximately {{½ × Γ × (ΔS)² + Θ}}. The breakeven daily move that makes gamma gains equal theta is {{ΔS* = √(2|Θ| ÷ Γ)}}. For the 7-day Nifty ATM call: √(2 × 15.12 ÷ 0.000884) ≈ 185 points. If realised daily moves exceed about 185 points, long gamma wins; below, short gamma wins. This is why options traders frame decisions as **realised vs implied volatility**.

**Position Greeks add.** Sum each leg's Greek × quantity × lot size. A short straddle has near-zero delta but large negative gamma and vega; its risk is in moves and IV jumps, not in direction at inception.

**Greeks are local.** They describe small changes. For a 3% gap, use full revaluation (re-price every option at the new spot and IV) — the widget's payoff and scenario views do this.

**Skew changes vega meaning.** When the market falls, index IV usually rises (negative spot–vol correlation). A short put loses on delta and on vega together — the losses compound.

**Rho** matters for long-dated options and when rates move sharply; for weekly Nifty options it is negligible.

> [!evidence] Established: Greek definitions are partial derivatives of the pricing model. The breakeven-move framework is standard derivatives theory; real P&L differs because of discrete hedging and costs.` },
      { h: 'The maths', md: `### Worked position — Nifty, 7 days, IV 13%
Position: long 2 lots 25,000 CE (₹195) and short 3 lots 25,400 CE (₹53).

| Leg | Delta | Gamma | Theta (₹/unit/day) | Vega (₹/unit/IV pt) | Qty (units) |
|---|---|---|---|---|---|
| Long 25,000 CE | +0.531 | +0.000884 | −15.12 | +13.77 | +130 |
| Short 25,400 CE | +0.211 | +0.000642 | −10.22 | +10.00 | −195 |

:::formula
Delta = 0.531 × 130 − 0.211 × 195 = 69.0 − 41.1 = +27.9 units (≈ 0.43 futures lots)
Gamma = 0.000884 × 130 − 0.000642 × 195 = 0.1149 − 0.1252 = −0.0103 units/pt
Theta = −15.12 × 130 + 10.22 × 195 = −1,966 + 1,993 = +₹27 per day
Vega = 13.77 × 130 − 10.00 × 195 = 1,790 − 1,950 = −₹160 per IV point
:::

Reading: mildly long delta now, but short gamma — a large rally reduces delta and eventually turns it negative (the extra short call). Theta is near flat; vega is slightly short.

### Delta-hedging
Delta 27.9 units. To be delta-neutral you would sell 27.9 units of Nifty futures — impossible (lot 65). This is why small accounts cannot hedge precisely with index futures.

### US check
Long 3 AAPL 230 calls (delta 0.532, theta −$0.13/day, vega $0.26). Delta-equivalent = 0.532 × 100 × 3 = 160 shares. Theta = −$39/day. A 2-point IV drop costs ≈ 0.26 × 2 × 300 = $156.` },
      { h: 'India', md: `> [!india] **Bank Nifty 56,000 CE, 21 days, IV 15%**: delta 0.55, gamma 0.000197, theta −₹24.3, vega ₹53.2. Per lot (30): delta-equivalent 16.5 units (≈ ₹9.2 lakh of index), theta −₹729/day, vega ₹1,596 per IV point. If India VIX-linked IV jumps 3 points on a shock day, a long lot gains about ₹4,800 from vega alone; a short lot loses it.

On weekly Nifty expiry day (Tuesday, as of Nov 2026 — verify), ATM gamma is several times its 7-day value. Option sellers who look "delta neutral" at 09:30 can be heavily directional by 13:00 after a 150-point move.` },
      { h: 'US & global', md: `> [!us] **SPY 600, 7 days vs 35 days, IV 15%.** 7-day ATM: gamma 0.032, theta −$0.39/day. 35-day: gamma 0.014, theta −$0.19/day. The short-dated option has more than twice the gamma and twice the theta — the pattern behind the popularity (and danger) of 0DTE options.` },
      { h: 'Common misconceptions', md: `- **"Delta is the probability of finishing ITM."** It is close for some options but not equal; N(d2) is closer, and both are risk-neutral.
- **"Delta-neutral means no risk."** It means no risk to tiny moves right now. Gamma and vega remain.
- **"Theta is a guaranteed daily income for sellers."** Theta is earned only if spot and IV stay put. It is compensation for gamma risk.
- **"High theta means a good trade."** It means a large exposure to movement on the other side.` },
      { h: 'When it fails', md: `**Losing example — short gamma on expiry day.** At 09:30 on expiry day a trader sells 3 lots Nifty 25,000 straddle at ₹38 + ₹37 = ₹75 (₹14,625 received), delta near zero. By 14:00 Nifty is 25,220. With about 90 minutes left the call is worth about ₹220 (almost all intrinsic) and the put close to ₹0. Loss ≈ (220 − 75) × 195 = ₹28,275 — nearly double the premium. The position's delta went from 0 to about −195 units (the full 3 lots, ≈ 3 short futures lots) as gamma did its work.` },
      { h: 'Exercise', md: `1. In [[widget:greeks]] enter Nifty 25,000 CE, 7 days, IV 13%. Then change days to 1. Record how gamma and theta change.
2. Build the two-leg position from The maths in [[widget:options-payoff]] and check the delta sign at 25,000 and at 25,500.
3. Use [[widget:futures-exposure]] to convert your position delta into futures-lot equivalents.
4. Compute the gamma breakeven move {{√(2|Θ| ÷ Γ)}} for Bank Nifty 56,000 CE using the India section numbers.` },
    ],
    check: [
      { q: 'Long 3 lots Nifty 25,200 CE, delta 0.36. Delta-equivalent exposure in units?', o: ['0.36 units', '23.4 units', '70.2 units', '195 units'], a: 2, why: '0.36 × 65 × 3 = 70.2 units, about 1.08 Nifty futures lots.' },
      { q: 'An ATM option has theta −₹15/unit/day and gamma 0.00088. Approximate daily move needed for a delta-hedged long option to break even?', o: ['About 30 points', 'About 185 points', 'About 600 points', 'It cannot be estimated'], a: 1, why: '√(2 × 15 ÷ 0.00088) = √34,091 ≈ 185 points.' },
      { q: 'A short straddle has delta ≈ 0 at entry. Which is true?', o: ['It has no directional risk', 'It is short gamma and short vega', 'It is long gamma and long vega', 'Its theta is negative'], a: 1, why: 'Short options are short gamma and vega with positive theta. Zero delta only applies to tiny moves at that instant.' },
    ],
    refs: ['Sheldon Natenberg — Option Volatility and Pricing (book)', 'John C. Hull — Options, Futures, and Other Derivatives (book)', 'Euan Sinclair — Volatility Trading (book)', 'The Options Industry Council — Greeks (optionseducation.org)'],
  },

  {
    id: 'l3-iv', module: 'L3-M2', level: 3, track: 'deriv', title: 'Implied vs historical volatility, IV crush and India VIX', mins: 22,
    summary: 'Compute historical volatility, compare it with implied volatility, quantify IV crush around events and read India VIX correctly.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `There are two kinds of volatility:

- **Historical (realised) volatility (HV)** — how much the price actually moved in the past, measured from returns.
- **Implied volatility (IV)** — the volatility number that makes the model price equal the market price. It is the market's price for future movement.

Think of HV as last month's weather and IV as the price of an umbrella today. Umbrellas get expensive before a forecast storm (results day, RBI policy, an election). After the storm passes, umbrella prices collapse — that is **IV crush**.

**India VIX** is an index computed by NSE from Nifty option prices. It represents the market's expected annualised volatility of Nifty over the next 30 days. India VIX at 13 means roughly ±13% annualised, or about ±0.82% a day (13 ÷ √252).` },
      { h: 'Intermediate view', md: `### Computing historical volatility
1. Take daily closes; compute log returns {{r = ln(P_t ÷ P_(t−1))}}.
2. Standard deviation of returns over N days (commonly 20).
3. Annualise: multiply by √252 (trading days).

### IV vs HV
| Situation | Read |
|---|---|
| IV well above HV | Options priced for more movement than recently seen — event ahead, or fear |
| IV near HV | Fair-ish by recent standards |
| IV below HV | Options cheap relative to recent movement — complacency, or movement fading |

None of these is a trade signal on its own. IV can stay above HV for long periods because sellers demand a premium for tail risk.

### IV crush
Before a scheduled event IV rises because one day's move could be large. After the event, the uncertainty is resolved and IV drops. A long option can lose money even if the underlying moves in the right direction — if the move is smaller than what was priced.

### Term structure and skew
- **Term structure**: IV across expiries. Before an event the expiry containing it has higher IV than later ones.
- **Skew**: IV across strikes. Index OTM puts usually carry higher IV than OTM calls.

[[widget:greeks]]` },
      { h: 'Advanced view', md: `**Variance risk premium.** Over long periods, index IV has tended to exceed subsequently realised volatility — sellers are paid for bearing crash risk. This is widely documented but **mixed** as a trading edge: the premium is compensation, it disappears exactly when losses are largest, and costs and margins absorb much of it for retail.

**Event IV extraction.** If the expiry containing results has IV σ1 and the next expiry σ2, you can back out the IV attributable to the event day. The simpler retail heuristic: ATM straddle price ≈ expected move. Compare it with the stock's historical post-results moves (from your own data).

**India VIX mechanics.** NSE computes India VIX using a methodology adapted from CBOE's VIX: out-of-the-money Nifty option prices across strikes from two expiries, combined into a variance estimate for each and interpolated to a constant 30 calendar days, then expressed as an annualised percentage (square root of variance × 100). It is model-free (not Black–Scholes IV of one strike). Which expiries are used, and how weekly contracts are treated, is set in NSE's methodology document — verify the current version on NSE (as of Nov 2026). Key behaviours:
- It tends to rise when Nifty falls sharply (negative correlation), and to drift lower in steady rallies.
- It is mean-reverting over months but can stay elevated during regimes of stress.
- It is not tradable directly in India in a liquid form; it is a gauge.

> [!evidence] Established: definitions of HV, IV and the VIX methodology. Empirically mixed: whether IV "overestimates" future vol enough to profit after costs, and any rule like "sell when VIX is above X".` },
      { h: 'The maths', md: `### Daily move from IV or VIX
:::formula
Daily 1σ move ≈ Spot × IV ÷ √252
Move over n days ≈ Spot × IV × √(n ÷ 365)   (calendar days)
:::
India VIX 13, Nifty 25,000 → daily 1σ ≈ 25,000 × 0.13 ÷ 15.87 ≈ 205 points.

### Worked HV
Five daily Nifty log returns (%): +0.6, −0.9, +0.3, +1.1, −0.4. Mean = 0.14. Deviations²: 0.2116, 1.0816, 0.0256, 0.9216, 0.2916 → sum 2.532. Sample variance = 2.532 ÷ 4 = 0.633; SD = 0.796% daily. Annualised = 0.796 × √252 ≈ 12.6%. (Use 20+ days in practice.)

### Worked IV crush — AAPL results
Before results: AAPL $230, 3 days to expiry, IV 45%: 230 call ≈ $3.78, put ≈ $3.70. Straddle $7.48 → priced move ≈ ±3.3%.
After results: stock at $232 (+0.9%), IV collapses to 25%, 2 days left: call ≈ $2.92, put ≈ $0.87.

| Leg | Before | After | P&L per contract |
|---|---|---|---|
| Long call | $3.78 | $2.92 | −$86 |
| Long put | $3.70 | $0.87 | −$283 |
| Straddle | $7.48 | $3.79 | −$369 |

The call buyer was **right on direction and still lost** because the move (+$2) was smaller than the premium and IV fell.

### India example
Nifty 25,000 CE, 7 days. IV 16% before an RBI policy day: ≈ ₹237. Next day, Nifty unchanged, 6 days left, IV back to 13%: ≈ ₹180 (approximate). Loss ≈ ₹57 × 65 = ₹3,705 per lot from vega and theta.` },
      { h: 'India', md: `> [!india] **Reading India VIX.** As a rough frame (not a rule), readings around 10 to the low teens have accompanied calm periods; readings in the 20s and above have accompanied stress such as March 2020. Use VIX to scale position size: at VIX 20 the expected daily Nifty move is about 1.26% (≈ 315 points at 25,000) versus about 0.82% at VIX 13.

Practical points:
- Option sellers' margins rise with volatility because SPAN scenarios widen.
- Budget day, RBI policy, general elections and big global events are the usual IV-crush candidates.
- Stock options have results-related crush; check the corporate-results calendar on NSE.` },
      { h: 'US & global', md: `> [!us] **CBOE VIX** measures 30-day expected S&P 500 volatility from SPX options. VIX 15 → about ±0.95% daily SPX move. VIX futures and options exist and have their own term structure; VIX itself cannot be bought.

Single-stock IV in the US spikes before earnings (often quarterly, mostly after the close or before the open) and crushes the next session. Weekly options straddling an earnings date carry most of the event premium.` },
      { h: 'Common misconceptions', md: `- **"High VIX means the market will fall."** VIX is a price for uncertainty, not a forecast of direction. It often rises during falls, but high VIX can coincide with sharp rallies.
- **"Low IV means options are cheap, so buying is low-risk."** Low IV options can still expire worthless; low IV can get lower.
- **"Selling high IV is free money."** IV is high because the market sees risk. Sometimes the risk arrives.
- **"IV crush only hurts buyers."** Sellers who are short the wrong expiry or skew can lose when IV in their leg rises.` },
      { h: 'When it fails', md: `**Losing example — selling into rising VIX.** A trader sells 2 lots Nifty 24,600 PE at ₹40 with VIX at 12, reasoning that "IV is low so nothing will happen". A global sell-off sends Nifty down 2.2% to about 24,450 and India VIX to 19 in two sessions. The put reprices to about ₹290. Loss ≈ (290 − 40) × 130 = ₹32,500 — delta and vega losses together.

HV-based reasoning fails at regime changes: the last 20 days are calm right up until the day they are not.` },
      { h: 'Exercise', md: `1. On [[chart:NIFTY:77:atr,bb]] compute a 10-day HV from the closes in your journal.
2. In [[widget:greeks]] price Nifty 25,000 CE at IV 16% (7 days) and at IV 13% (6 days). Record the vega + theta loss per lot.
3. Convert India VIX values 11, 15, 20 and 28 into expected daily Nifty moves in points with {{Spot × VIX ÷ √252}}.` },
    ],
    check: [
      { q: 'India VIX is 16 and Nifty is 25,000. Approximate 1-standard-deviation daily move?', o: ['16 points', 'About 252 points', 'About 400 points', 'About 4,000 points'], a: 1, why: '25,000 × 0.16 ÷ √252 = 4,000 ÷ 15.87 ≈ 252 points.' },
      { q: 'Before results a stock straddle costs 6% of spot. The stock moves 4% after results and IV falls. Long straddle outcome at the next open (ignoring the residual time value)?', o: ['Profit, because the stock moved', 'Likely loss, because the move was smaller than the premium paid', 'Break-even', 'Profit only on the put'], a: 1, why: 'A straddle needs a move larger than its cost. A 4% move is less than the 6% paid, and IV crush removes the remaining time value.' },
    ],
    refs: ['NSE — India VIX white paper and methodology (nseindia.com)', 'Cboe — VIX index methodology (cboe.com)', 'Euan Sinclair — Volatility Trading (book)', 'Sheldon Natenberg — Option Volatility and Pricing (book)'],
  },

  {
    id: 'l3-chain', module: 'L3-M2', level: 3, track: 'deriv', title: 'Reading an option chain: OI, PCR and max pain', mins: 20,
    summary: 'Read an NSE or US option chain for liquidity, open interest, PCR and max pain, and know which of those readings are evidence and which are folklore.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `An **option chain** is a table of every strike for one expiry: calls on the left, puts on the right, strike in the middle. For each strike you see last price, bid, ask, volume, **open interest (OI)**, change in OI and IV.

- **Volume** = contracts traded today.
- **Open interest** = contracts still open (not yet closed or expired). A new buyer and new seller add 1 to OI; one closing against another closer reduces it.

Traders use the chain in two ways: as a **liquidity map** (where can I trade with tight spreads?) and as a **positioning map** (where are big open positions?). The first use is solid. The second is useful but often over-interpreted.

> [!warn] OI tells you how many contracts are open, **not who is long and who is short**. Every contract has a buyer and a seller. Statements like "writers are defending 25,000" are interpretations, not facts.` },
      { h: 'Intermediate view', md: `### What to read first
1. **Bid–ask spread** at your strike. Nifty ATM weekly spreads are often ₹0.05–0.50 in normal conditions; far OTM and stock options can be several rupees or 5–10% of premium.
2. **Depth** — how many lots sit at the best bid and ask.
3. **IV across strikes** — skew.
4. **OI concentration** — strikes with the largest call and put OI.

### Put–Call Ratio (PCR)
{{PCR (OI) = total put OI ÷ total call OI}} for an expiry. PCR of 1.3 means 30% more put OI than call OI. It is read both ways by different traders: as bullish (put sellers confident) or bearish (put buyers hedging). Because OI does not reveal direction, PCR is ambiguous by construction.

### Max pain
The strike at which the total intrinsic value payable to option holders at expiry is **smallest**. The folk theory says price gravitates there into expiry. Evidence for a reliable max-pain pull is **mixed at best**; treat it as a description of open positions, not a forecast.

### Change in OI with price
| Price | OI | Common reading |
|---|---|---|
| ↑ | ↑ | Long build-up |
| ↓ | ↑ | Short build-up |
| ↑ | ↓ | Short covering |
| ↓ | ↓ | Long unwinding |

This table is widely used for **futures**; for options it is weaker because each strike's OI mixes buyers and sellers with different motives (hedges, spreads, directional bets).` },
      { h: 'Advanced view', md: `**Who is short?** Exchange data in India publishes participant-wise OI (client, DII, FII, proprietary) for index futures and options. That is better evidence than single-strike OI, but it is aggregate and published after the close.

**Dealer gamma.** If market makers are net short options at a strike, their delta-hedging buys rallies and sells dips (amplifying moves); if net long, hedging dampens moves. Estimating this requires assumptions about who holds what; see [[link:l4-gex]]. Outside professional data, it is speculative.

**Liquidity first.** The most valuable chain reading is execution quality. A strategy whose expected edge is ₹3 per unit cannot survive a ₹2 spread on each of four legs.

**Strike pinning.** Around large-OI strikes near expiry, hedging flows can contribute to price lingering near the strike late on expiry day. It is plausible and observed sometimes; it is not dependable enough to bet on alone.

> [!evidence] Established: definitions of OI, volume, PCR and max pain. Mixed: predictive value of PCR and OI build-up. Subjective/speculative: reading intent ("writers defending") from single-strike OI; max-pain targeting.` },
      { h: 'The maths', md: `### Worked max pain (simplified, 3 strikes, Nifty)
OI in lots — calls: 24,900: 10k, 25,000: 40k, 25,100: 60k. Puts: 24,900: 50k, 25,000: 45k, 25,100: 8k.

Payout to holders (in points × lots) if expiry at:
- **24,900**: calls 0. Puts: 25,000 PE 100 × 45k + 25,100 PE 200 × 8k = 4.5m + 1.6m = 6.1m.
- **25,000**: calls 24,900 CE 100 × 10k = 1.0m. Puts 25,100 PE 100 × 8k = 0.8m. Total 1.8m.
- **25,100**: calls 200 × 10k + 100 × 40k = 2m + 4m = 6m. Puts 0. Total 6m.

Max pain = **25,000** (smallest payout). This only describes positions. It says nothing about where price will go.

### PCR
Put OI 103k ÷ call OI 110k = 0.94.

### Spread cost
Nifty 25,200 CE bid ₹107.5 / ask ₹109. Crossing both ways on 2 lots: 1.5 × 130 = ₹195 per round trip — before STT and charges. A US AAPL 240 call bid $3.70 / ask $3.85: $15 per contract round trip on spread alone.` },
      { h: 'India', md: `> [!india] On the NSE chain for Nifty weekly options, OI at round strikes (25,000, 25,500) is usually largest. Bank Nifty has monthly options only, so its chain concentrates more OI in fewer expiries. Change-in-OI columns refresh during the day; participant-wise OI is published after the close on NSE.

- Use limit orders; market orders in thin strikes can fill several rupees away.
- SEBI's circular of 1 Oct 2024 on index derivatives: higher minimum contract size (new contracts from 20 Nov 2024), weekly expiries on only one benchmark index per exchange (from 20 Nov 2024), an extra 2% extreme-loss margin on short index options on expiry day (from 20 Nov 2024), upfront collection of option premium from buyers, removal of the calendar-spread margin benefit on the expiry day of the expiring leg (from 10 Feb 2025), and intraday monitoring of position limits (from Apr 2025). Later changes may apply — as of Nov 2026, verify on SEBI and NSE circulars.` },
      { h: 'US & global', md: `> [!us] US chains show OI updated once a day (from OCC), plus intraday volume. SPY and SPX have daily expiries and some of the tightest spreads in the world; single stocks vary widely. A $0.05 spread on a $1 option is 5% — costly for frequent trading.` },
      { h: 'Common misconceptions', md: `- **"High call OI at a strike is resistance."** It may be, or it may be covered-call overwriting, spreads or hedges. Direction of OI is unknown.
- **"PCR above 1 is bullish."** It is read both ways. Without context it is not a signal.
- **"Max pain is where expiry will settle."** It is a calculation on open positions, not a forecast.
- **"LTP is the price."** In thin strikes the last trade can be minutes old. Bid and ask are what you can trade.` },
      { h: 'When it fails', md: `**Losing example — trading the "wall".** A trader sees 60k lots of call OI at 25,100 and sells 2 lots 25,100 CE at ₹40, believing writers will "defend" it. A positive surprise drives Nifty through 25,100 to 25,280. Much of the OI was covered calls and spreads that do not need to be defended. With five days left the call reprices to about ₹285. Loss ≈ (285 − 40) × 130 = ₹31,850.` },
      { h: 'Exercise', md: `1. Copy a 7-strike slice of a chain into your journal (any expiry). Compute PCR and max pain as in The maths.
2. For each strike note the bid–ask as % of mid. Mark which strikes you would refuse to trade.
3. In [[widget:options-payoff]] build a short 25,100 CE and stress it at 25,300. Compare the loss with the premium.` },
    ],
    check: [
      { q: 'Total put OI 1.2 lakh lots, call OI 1.5 lakh lots. PCR?', o: ['1.25', '0.80', '0.30', '2.70'], a: 1, why: 'PCR = put OI ÷ call OI = 1.2 ÷ 1.5 = 0.80.' },
      { q: 'Which chain reading is most reliable for an intraday options trader?', o: ['Max-pain strike as a target', 'PCR above 1 means bullish', 'Bid–ask spread and depth at the intended strike', 'Largest call OI is guaranteed resistance'], a: 2, why: 'Spread and depth directly determine execution cost. The others are interpretations with mixed or weak evidence.' },
    ],
    refs: ['NSE — Option chain and participant-wise open interest (nseindia.com)', 'SEBI — Measures to strengthen equity index derivatives framework (circular, Oct 2024, sebi.gov.in)', 'Lawrence G. McMillan — Options as a Strategic Investment (book)', 'OCC — Open interest data (theocc.com)'],
  },

  /* ───────────────────────── L3-M3 OPTIONS STRATEGIES AND EXPIRY RISK ───────────────────────── */
  {
    id: 'l3-spreads', module: 'L3-M3', level: 3, track: 'deriv', title: 'Vertical spreads', mins: 25,
    summary: 'Build debit and credit vertical spreads, compute max gain, max loss and breakeven, and judge their margin, Greeks and expiry risk.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `A **vertical spread** combines a bought option and a sold option of the same type (both calls or both puts) and the same expiry, at different strikes. The sold option pays for part of the bought one; in return you give up profit beyond the sold strike.

There are four of them:

| Spread | Construction | View | Cash at entry |
|---|---|---|---|
| Bull call spread | Buy lower call, sell higher call | Moderately up | Pay (debit) |
| Bear put spread | Buy higher put, sell lower put | Moderately down | Pay (debit) |
| Bull put spread | Sell higher put, buy lower put | Not down | Receive (credit) |
| Bear call spread | Sell lower call, buy higher call | Not up | Receive (credit) |

The key benefit is that **both maximum gain and maximum loss are defined at entry**. That makes sizing honest: you know the worst case before you trade (except for settlement and assignment issues covered below).

> [!warn] Defined risk is not small risk. A credit spread that earns ₹3,000 when right can lose ₹9,000 when wrong. Probability and payoff are traded against each other; neither side gets something for nothing.` },
      { h: 'Intermediate view', md: `### Formulas (width W = distance between strikes)
:::formula
Debit spread:  Max loss = net debit     Max gain = W − net debit
Credit spread: Max gain = net credit    Max loss = W − net credit
Bull call BE = lower strike + debit      Bear put BE = higher strike − debit
Bull put BE  = higher strike − credit     Bear call BE = lower strike + credit
:::

### Strategy profile
| Feature | Debit verticals | Credit verticals |
|---|---|---|
| Max gain | W − debit | Credit |
| Max loss | Debit | W − credit |
| Margin character | Premium paid; little or no margin | Spread margin (hedged) — far below a naked short, but blocked until exit |
| Vega | Small; sign depends on where spot sits versus strikes | Small; opposite to the debit version |
| Theta | Usually negative while OTM, positive once ITM | Usually positive while OTM |
| Expiry risk | Spot settling between strikes; stock-option delivery | Same, plus assignment on the short leg (US) |
| Suits | Directional view with a target | Range view or "not beyond X" |

[[widget:options-payoff]]

### Choosing strikes
- **Width** sets the maximum outcome. Wider = more gain potential, more cost.
- **Distance from spot** sets probability. A credit spread far OTM wins more often but loses several times the credit when it loses.
- **Expiry**: shorter expiries give faster theta but more gamma — the spread can go from max gain to max loss in one session near expiry.

### Execution
Enter as a single spread order where your broker supports it, or **buy the long leg first**, then sell the short leg — the reverse order leaves you naked short (with full margin) if the second leg does not fill. Close both legs together.` },
      { h: 'Advanced view', md: `**The spread's Greeks are the difference of two options' Greeks.** Long 25,000 CE and short 25,200 CE (7 days): delta 0.531 − 0.358 = +0.173; vega 13.77 − 12.92 = +0.85; theta −15.12 + 13.58 = −1.54 per unit per day. The spread has much lower vega and theta than the naked call — that is the point. You are trading direction with reduced volatility exposure.

**Greeks flip as spot moves.** If Nifty rallies above 25,200 the short leg becomes the more ATM option and the spread's theta turns positive and vega negative: you now want time to pass.

**Margin benefit in India.** NSE's SPAN recognises the hedge, so a bull put spread blocks far less margin than a naked short put. But margin benefit can disappear if the long leg is exited first, and brokers add margin in expiry week.

**Pin risk between strikes.** At expiry, with spot settling between the strikes, the long leg is ITM and the short OTM (or vice versa). For **cash-settled index options** this simply settles at intrinsic. For **Indian stock options** an ITM leg results in delivery — you could end up with a full lot of shares to buy. For **US American options**, the short leg can be assigned (early or at expiry) while the long leg is not exercised automatically if it ends just OTM — leaving you with a stock position over the weekend.

> [!evidence] Established: payoff, breakeven and Greek arithmetic. Any statement that credit spreads "win 80% of the time" depends on strike choice and period — it is a choice of payoff shape, not an edge.` },
      { h: 'The maths', md: `### Nifty, 7 days, IV 13% (illustrative Black–Scholes prices)
Spot 25,000. CE: 25,000 ₹195, 25,200 ₹108, 25,400 ₹53. PE: 25,000 ₹164, 24,800 ₹87, 24,600 ₹40.

**Bull call 25,000/25,200** — debit 195 − 108 = ₹87.
- Max loss 87 × 65 = **₹5,655**; max gain (200 − 87) × 65 = **₹7,345**; BE **25,087**.

**Bear put 25,000/24,800** — debit 164 − 87 = ₹77.
- Max loss ₹5,005; max gain (200 − 77) × 65 = ₹7,995; BE 24,923.

**Bull put 24,800/24,600** — credit 87 − 40 = ₹47.
- Max gain ₹3,055; max loss (200 − 47) × 65 = **₹9,945**; BE 24,753.

**Bear call 25,200/25,400** — credit 108 − 53 = ₹55.
- Max gain ₹3,575; max loss (200 − 55) × 65 = ₹9,425; BE 25,255.

Reward-to-risk: the bull call risks ₹5,655 to make ₹7,345 (1.3:1); the bull put risks ₹9,945 to make ₹3,055 (0.31:1). The credit spread needs a much higher win rate just to break even: {{required win rate = max loss ÷ (max gain + max loss)}} = 9,945 ÷ 13,000 = 76.5% before costs.

### Costs
Four premium-side transactions per round trip (two legs × buy and sell). STT 0.15% on each sold premium, NSE charges ₹3,553 per crore of premium, plus GST and brokerage per order. On small-premium spreads, brokerage per leg can be a large fraction of the expected gain — check with [[widget:charges-india]].` },
      { h: 'India', md: `> [!india] **Bank Nifty bull call 56,000/56,500, 21 days, IV 15%.** Buy 56,000 CE ₹911, sell 56,500 CE ₹670 → debit ₹241. Lot 30: max loss **₹7,230**; max gain (500 − 241) × 30 = **₹7,770**; BE **56,241**. Net delta 0.549 − 0.450 ≈ 0.10 per unit → 3 units per lot (versus 16.5 for the naked call). Bank Nifty has only monthly options, so you cannot choose a weekly expiry.

Points specific to India:
- Index options are European and cash-settled: no early assignment. You can still be hurt by a gap that takes the spread from max gain to max loss overnight.
- Stock-option spreads held to expiry with one leg ITM create physical delivery obligations. Close them before the final day unless you intend delivery.
- STT on exercised options is 0.15% of settlement value (as of Nov 2026 — verify).` },
      { h: 'US & global', md: `> [!us] **SPY 600/610 bull call, 30 days, IV 15%.** Buy 600 call $11.29, sell 610 call $6.85 → debit $4.44 → **max loss $444**, **max gain $556**, BE **$604.44**.
**AAPL 230/220 bear put, 30 days, IV 28%.** Buy 230 put $6.98, sell 220 put $3.07 → debit $3.91 → max loss $391, max gain $609, BE $226.09.

US specifics: the short leg is American and can be assigned early, most often a short ITM put deep in the money or a short ITM call ahead of ex-dividend. Assignment does not change the spread's maximum loss in theory, but it creates a stock position and margin call in practice. Close spreads before expiry if spot is near the short strike.` },
      { h: 'Common misconceptions', md: `- **"Spreads are safe because risk is defined."** The loss is capped, but it can be the full width minus credit, and it can happen in one gap.
- **"High-probability credit spreads are an edge."** High win rate comes with a low reward-to-risk; expectancy is what matters.
- **"I'll leg in to get a better price."** Legging adds directional risk between fills and, if the short leg fills first, a naked short with full margin.
- **"Max loss at expiry is all I need to know."** Mark-to-market losses before expiry can be close to max loss and trigger exits or margin calls earlier.` },
      { h: 'When it fails', md: `**Losing example — credit spread through a gap.** You sell 3 lots of the Nifty 24,800/24,600 bull put for ₹47 (₹9,165 received). Overnight a global sell-off opens Nifty at 24,520. Both puts are ITM. With about 6 days left the spread marks near ₹124 (Black–Scholes, IV 16–20%), so the open-mark loss is ≈ (124 − 47) × 195 = ₹15,015. If Nifty is still below 24,600 at expiry, the spread settles at its full ₹200 width: loss (200 − 47) × 195 = **₹29,835**, about three times the premium. Your planned stop "if Nifty breaks 24,800" never had a chance to fill.

**Losing example — debit spread decay.** You buy the 25,000/25,200 bull call for ₹87 expecting a rally. Nifty drifts sideways at 25,020 for six days. At expiry the spread is worth ₹20. Loss ≈ ₹67 × 65 = ₹4,355 — the direction was barely right but not enough.` },
      { h: 'Exercise', md: `1. In [[widget:options-payoff]] build all four Nifty spreads from The maths. Record max gain, max loss and breakeven, and check them against the formulas.
2. Calculate the required win rate for each to break even before costs.
3. Use [[widget:expectancy]] with the bull put spread: assume win rate 75%, win ₹3,055, loss ₹9,945. Is expectancy positive? Then subtract costs from [[widget:charges-india]].
4. Paper trade one debit and one credit spread for a week in the simulator and journal the mark-to-market each day.` },
    ],
    check: [
      { q: 'Nifty 25,200/25,400 bear call spread for a ₹55 credit (lot 65). Max loss and breakeven?', o: ['₹3,575; 25,145', '₹9,425; 25,255', '₹13,000; 25,400', 'Unlimited; 25,255'], a: 1, why: 'Max loss = (200 − 55) × 65 = ₹9,425. Breakeven = lower (short) strike + credit = 25,255. The long 25,400 call caps the loss.' },
      { q: 'A credit spread risks ₹9,945 to make ₹3,055. Required win rate to break even before costs?', o: ['23.5%', '50%', '76.5%', '90%'], a: 2, why: '9,945 ÷ (3,055 + 9,945) = 76.5%.' },
      { q: 'Which order is safer when you cannot place a spread as one order?', o: ['Sell the short leg first to collect premium', 'Buy the long leg first, then sell the short leg', 'It makes no difference', 'Place both at market at the same instant'], a: 1, why: 'Buying the long leg first means a partial fill leaves you with a defined-risk long option, not a naked short with full margin and unlimited or large risk.' },
    ],
    refs: ['Lawrence G. McMillan — Options as a Strategic Investment (book)', 'Sheldon Natenberg — Option Volatility and Pricing (book)', 'NSE — SPAN margin and spread benefit (nseindia.com)', 'The Options Industry Council — Vertical spreads (optionseducation.org)'],
  },

  {
    id: 'l3-vol-strategies', module: 'L3-M3', level: 3, track: 'deriv', title: 'Straddles, strangles, condors and butterflies', mins: 28,
    summary: 'Compute payoff, breakevens, margin and Greek exposure for straddles, strangles, iron condors and butterflies, and match each to a volatility view.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Volatility strategies are bets on **how much** price moves, not which way.

- **Long straddle**: buy a call and a put at the same strike. You profit if the move is bigger than the total premium.
- **Long strangle**: buy an OTM call and an OTM put. Cheaper, but needs a bigger move.
- **Short straddle / short strangle**: the reverse. You profit if price stays inside the breakevens, and your loss is **unlimited** on the upside and large on the downside.
- **Iron condor**: a short strangle with protective wings bought further out — a bull put spread plus a bear call spread. Defined risk.
- **Butterfly**: buy one low strike, sell two middle, buy one high (all calls or all puts). Cheap, defined risk, profits most if price pins near the middle strike at expiry.

The core trade-off: **short-volatility positions win small and often; long-volatility positions lose small and often and win big occasionally.** Neither is inherently better. The market prices both.` },
      { h: 'Intermediate view', md: `### Strategy profiles
| Strategy | Max gain | Max loss | Breakevens | Margin | Vega | Theta |
|---|---|---|---|---|---|---|
| Long straddle | Unlimited | Total premium | K ± premium | Premium only | + large | − large |
| Short straddle | Premium | Unlimited | K ± premium | Full SPAN on two shorts (some offset) | − large | + large |
| Long strangle | Unlimited | Premium | K_call + prem; K_put − prem | Premium only | + | − |
| Short strangle | Premium | Unlimited | Same | Full SPAN | − | + |
| Iron condor (short) | Net credit | Wing width − credit | Short strikes ± credit | Spread margin | − small | + |
| Long butterfly | Width − debit | Debit | Low + debit; high − debit | Premium (little) | − near centre | + near centre, near expiry |
| Short iron fly | Net credit | Width − credit | Centre ± credit | Spread margin | − | + |

**Expiry risk**: short straddles and strangles carry the biggest expiry-day gamma; condors and flies can swing from max gain to max loss across a single wing. **Suitability**: long straddles/strangles before an event if you think the market under-prices the move; short structures in ranges where you think it over-prices — always with a plan for the tail.

[[widget:options-payoff]]

### Managing
- Define exits in advance: for short premium a common professional rule is to close when the loss reaches a multiple of the credit, or when a short strike is touched — choose and test your own rule.
- Short premium positions should be sized assuming the worst plausible gap, not the margin required.` },
      { h: 'Advanced view', md: `**Greeks for a short Nifty 25,000 straddle (7 days, IV 13%), per lot:** theta ≈ (15.12 + 10.67) × 65 = **+₹1,676/day**; vega ≈ −(13.77 + 13.77) × 65 = **−₹1,790 per IV point**; gamma ≈ −0.00177 × 65 = −0.115 units per point. A 200-point move changes delta by about 23 units (0.35 futures lots) per lot sold.

**Gamma breakeven**: the straddle's theta is earned only if realised daily moves stay below roughly √(2 × 25.8 ÷ 0.00177) ≈ 170 points. India VIX 13 implies a 1σ day of about 205 points. You are being paid to bet that realised movement will be lower than implied.

**Wings and skew.** In an iron condor the put wing usually carries higher IV (skew), so it collects more premium — and it is also the side exposed to sudden falls where IV jumps. Vega losses and delta losses compound on that side.

**Butterflies = cheap gamma near the centre at expiry.** A butterfly has small Greeks far from expiry and large ones near it. Its theoretical max gain is rarely realised because price must settle exactly at the middle strike.

**Iron fly ≡ butterfly.** By put–call parity, a short iron fly (short straddle plus long wings) has the same payoff shape at expiry as a long call butterfly with the same strikes, and its credit should be about the wing width minus the butterfly's debit (here 200 − 35 = 165 vs a ₹164 credit; the gap is interest and rounding) — a useful check on your arithmetic.

> [!evidence] Established: payoffs and Greeks. Mixed: the volatility risk premium as a retail edge after costs, slippage and tail events.` },
      { h: 'The maths', md: `### Nifty, 7 days, IV 13% (illustrative)
CE: 24,800 ₹317, 25,000 ₹195, 25,200 ₹108, 25,400 ₹53. PE: 24,600 ₹40, 24,800 ₹87, 25,000 ₹164.

**Long 25,000 straddle** — cost 195 + 164 = ₹359 → **max loss ₹23,335** per lot. BE **24,641 / 25,359**. At expiry 25,600: payoff (600 − 359) × 65 = +₹15,665.

**Short 24,800/25,200 strangle** — credit 87 + 108 = ₹195 → **max gain ₹12,675**. BE **24,605 / 25,395**. At 25,700: loss (500 − 195) × 65 = −₹19,825. Max loss unlimited above, and up to about (24,800 − 195) × 65 below.

**Short iron condor 24,600/24,800 — 25,200/25,400** — credit (87 − 40) + (108 − 53) = ₹102.
- Max gain 102 × 65 = **₹6,630**; max loss (200 − 102) × 65 = **₹6,370**; BE **24,698 / 25,302**.

**Long call butterfly 24,800/25,000/25,200** — debit 317 − 2 × 195 + 108 = ₹35.
- Max loss **₹2,275**; max gain (200 − 35) × 65 = **₹10,725** (only at exactly 25,000); BE **24,835 / 25,165**.

**Short iron fly 24,800/25,000/25,200** — credit 359 − (108 + 87) = ₹164 → max gain ₹10,660, max loss (200 − 164) × 65 = ₹2,340, BE 24,836 / 25,164 (matches the butterfly within rounding).

### Theta decay over a week
The 25,000 straddle at 7 days ≈ ₹359; at 6 days with spot and IV unchanged ≈ ₹333; at 1 day ≈ ₹136. Roughly 62% of its value disappears in the last six days if nothing moves.` },
      { h: 'India', md: `> [!india] **Bank Nifty 56,000 straddle, 21 days, IV 15%.** Call ₹911 + put ₹702 = ₹1,613 → per lot ₹48,390. Long: max loss ₹48,390, BE 54,387 / 57,613 (±2.9%). Short: max gain ₹48,390, unlimited risk, margin typically well above ₹1 lakh per lot and higher in expiry week (check your broker's calculator).

India-specific:
- **India VIX** lets you compare the IV you pay or receive with the market's 30-day gauge.
- Weekly Nifty expiry (Tuesday as of Nov 2026 — verify on NSE) concentrates theta and gamma. SEBI's 1 Oct 2024 circular added a 2% extreme-loss margin on short index options on expiry day (from 20 Nov 2024) — as of Nov 2026, verify on NSE.
- Iron condors involve four legs: four brokerage charges per side, STT on sold premiums and exchange charges. On a ₹102 credit, costs can absorb a significant share — compute with [[widget:charges-india]].` },
      { h: 'US & global', md: `> [!us] **SPY 600 straddle, 30 days, IV 15%.** Call $11.29 + put $9.32 = $20.61 → $2,061 max loss for the long; BE $579.39 / $620.61.
**SPY 590/610 short strangle**: put $5.31 + call $6.85 = $12.16 → max gain $1,216, BE $577.84 / $622.16, unlimited upside risk, assignment risk on whichever leg goes ITM. Earnings-season straddles on single stocks like AAPL are pure IV-crush trades: see [[link:l3-iv]].` },
      { h: 'Common misconceptions', md: `- **"Short strangles are high-probability income."** High probability of small gains, low probability of large losses. Probability without payoff is half the picture.
- **"A straddle profits from any move."** Only from a move larger than the premium, and before theta and IV crush erode it.
- **"Condors are safe because both sides are hedged."** One side loses the full wing width minus credit in a trend or gap.
- **"Butterflies are cheap lottery tickets."** Max gain needs an exact pin; most outcomes are a small gain or loss of the debit.` },
      { h: 'When it fails', md: `**Losing example — short strangle in a trend.** You sell 2 lots of the 24,800/25,200 strangle for ₹195 (₹25,350 received). Nifty trends up 1.5% over three days to 25,380 and IV rises a point. With 4 days left the 25,200 CE is about ₹267 and the 24,800 PE about ₹8. Total ≈ ₹275 → loss (275 − 195) × 130 = ₹10,400 — and that is the mild case. A 3% gap to 25,750 at expiry: loss (550 − 195) × 130 = **₹46,150**, nearly twice the premium.

**Losing example — long straddle into a quiet event.** You buy the 25,000 straddle for ₹359 before a policy day. The event passes, Nifty moves 60 points, IV falls 3 points. Next day the straddle is worth about ₹270: loss ≈ ₹89 × 65 = ₹5,785.` },
      { h: 'Exercise', md: `1. In [[widget:options-payoff]] build the iron condor and the short strangle from The maths. Overlay them and note where the condor's wings cap the loss.
2. In [[widget:greeks]] read the short straddle's vega and theta, then compute the IV jump that wipes out three days of theta.
3. Use [[widget:monte-carlo]] or [[widget:ror]] to simulate a strategy that wins ₹3,000 at 80% and loses ₹12,000 at 20%. Record the drawdown range.` },
    ],
    check: [
      { q: 'Short iron condor 24,600/24,800/25,200/25,400 for ₹102 credit (Nifty lot 65). Max loss?', o: ['₹6,630', '₹6,370', '₹13,000', 'Unlimited'], a: 1, why: 'Wing width 200 − credit 102 = 98 × 65 = ₹6,370. The bought wings cap the loss.' },
      { q: 'Long Nifty 25,000 straddle for ₹359. Breakevens at expiry?', o: ['24,641 and 25,359', '24,820 and 25,180', '25,000 only', '24,359 and 25,641'], a: 0, why: 'Strike ± total premium = 25,000 ± 359.' },
      { q: 'Which position has the largest negative vega?', o: ['Long butterfly far from expiry', 'Short straddle', 'Bull call spread', 'Long strangle'], a: 1, why: 'A short straddle is short two ATM options, the highest-vega strikes. Long strangle has positive vega; spreads and far-dated butterflies have small vega.' },
    ],
    refs: ['Sheldon Natenberg — Option Volatility and Pricing (book)', 'Euan Sinclair — Volatility Trading (book)', 'Lawrence G. McMillan — Options as a Strategic Investment (book)', 'SEBI — Measures to strengthen equity index derivatives framework (circular, Oct 2024, sebi.gov.in)'],
  },

  {
    id: 'l3-time-spreads', module: 'L3-M3', level: 3, track: 'deriv', title: 'Calendar, diagonal and ratio spreads', mins: 25,
    summary: 'Construct calendar, diagonal and ratio spreads, estimate their payoff at the near expiry, and identify their vega, theta and tail risks.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `So far every leg shared one expiry. **Time spreads** use different expiries.

- **Calendar (horizontal) spread**: sell a near-expiry option, buy a later-expiry option at the **same strike**. The near option decays faster, so if price stays near the strike you profit.
- **Diagonal spread**: same idea but **different strikes** as well as expiries — adds a directional tilt.
- **Ratio spread**: same expiry, unequal quantities — e.g. buy 1 call, sell 2 higher calls. It can be entered for little or no cost but leaves an **unhedged short option**.

Why they matter: they let you separate **time and volatility** from direction. Their payoff at the near expiry is not a straight-line diagram because the back option still has time value — you must estimate it with a model.` },
      { h: 'Intermediate view', md: `### Profiles
| Strategy | Max gain | Max loss | Breakeven | Margin | Vega | Theta |
|---|---|---|---|---|---|---|
| Long calendar | Near strike at front expiry; model-dependent | Net debit (approx.) | Two points around the strike; depend on IV | Usually spread margin; check broker for cross-expiry offsets | + | + near strike |
| Long diagonal | Near the short strike at front expiry | Net debit (approx.) | Model-dependent | Spread margin | + | + if short leg near ATM |
| 1×2 call ratio | At upper strike at expiry: width ± net premium | **Unlimited above** | Upper BE = upper K + max gain in points | Naked-short margin on the extra leg | − | + |

**Expiry risk**: the front leg can go deep ITM at its expiry while the back leg remains open — for Indian stock options that means physical delivery on the front leg; for US options, assignment. **Market suitability**: calendars for a pinned, range-bound market with stable-to-rising IV; diagonals for a slow drift toward the short strike; ratios for a modest move to a target with an accepted tail.

[[widget:options-payoff]]

### Term structure is the hidden variable
A calendar is long the back-month IV and short the front-month IV. If front IV is inflated by an event (results, policy) and collapses after it, the calendar benefits; if back-month IV falls, it loses even with spot unchanged.` },
      { h: 'Advanced view', md: `**Calendar Greeks (Nifty 25,000 CE, sell 7-day, buy 35-day, IV 13%):** vega 30.42 − 13.77 = **+16.65 per unit** (+₹1,082 per lot per IV point); theta −8.10 + 15.12 = **+₹7.02 per unit per day** (+₹456 per lot). Delta ≈ 0.569 − 0.531 = +0.04. Gamma is **negative** (0.00039 − 0.00088): large moves either way hurt.

**Diagonal as a "poor man's covered call".** Buying a longer-dated ITM call and selling short-dated OTM calls against it replicates a covered call with less capital, but you carry vega and roll risk on the long leg.

**Ratio spreads and the tail.** A 1×2 call ratio is a bull call spread plus a naked short call. Its maximum gain is at the short strike, then losses grow without limit. In equity indices, upside gaps are less common than downside ones, but they occur — on budget day, election results, or a policy surprise. A put ratio (buy 1, sell 2 lower puts) carries the more dangerous downside tail **and** the steeper put skew.

**Model risk.** Every calendar or diagonal P&L estimate assumes an IV for the back month at the front expiry. A two-point IV change can swing the result as much as a 100-point move.

> [!evidence] Established: construction and Greek arithmetic. Payoff at the front expiry is model-dependent; treat it as an estimate.` },
      { h: 'The maths', md: `### Nifty calendar — 25,000 CE (IV 13% throughout, illustrative)
Sell 7-day 25,000 CE ₹195, buy 35-day 25,000 CE ₹483 → debit **₹287** (₹18,655 per lot).

Value at the front expiry (back leg then has 28 days):
| Nifty at front expiry | Back 25,000 CE | Front leg | Spread value | P&L per lot |
|---|---|---|---|---|
| 24,400 | ₹166 | 0 | ₹166 | −₹7,865 |
| 24,700 | ₹275 | 0 | ₹275 | −₹780 |
| 25,000 | ₹424 | 0 | ₹424 | **+₹8,905** |
| 25,300 | ₹612 | −₹300 | ₹312 | +₹1,625 |
| 25,600 | ₹834 | −₹600 | ₹234 | −₹3,445 |

Approximate breakevens ≈ 24,730 and 25,380 if IV is unchanged (solved numerically with Black–Scholes). Max loss ≈ the debit (if spot moves so far that both legs converge to intrinsic).

### Diagonal — buy 35-day 24,800 CE ₹600, sell 7-day 25,200 CE ₹108 → debit ₹492
At front expiry: Nifty 25,000 → back ₹542, front 0 → +₹50 × 65 = +₹3,250. Nifty 25,300 → back ₹753 − front ₹100 = ₹653 → +₹10,465. Nifty 24,400 → back ₹231 → −₹16,965.

### 1×2 call ratio — buy 1 × 25,000 CE ₹195, sell 2 × 25,200 CE ₹108 (7 days)
Net **credit** 2 × 108 − 195 = ₹21.
- Below 25,000 at expiry: +₹21 × 65 = +₹1,365.
- Max gain at 25,200: (200 + 21) × 65 = **₹14,365**.
- Upper BE = 25,200 + 221 = **25,421**.
- At 25,800: 800 − 2 × 600 + 21 = −379 → **−₹24,635**. Loss is unlimited above.` },
      { h: 'India', md: `> [!india] Nifty's weekly (Tuesday) plus monthly expiries make Nifty calendars straightforward; **Bank Nifty has monthly options only**, so a Bank Nifty calendar spans at least a month between legs.

India practicalities:
- Margin benefit across expiries depends on SPAN and on your broker. Under SEBI's Oct 2024 measures (effective 10 Feb 2025), **no calendar-spread margin benefit is given on the expiry day of the expiring leg** — the short front leg needs full margin that day, plus the expiry-day extreme-loss margin on short index options. Some brokers remove the benefit earlier in expiry week. As of Nov 2026, verify on NSE and with your broker.
- Avoid holding the front leg into its expiry if it is ITM — the settlement of an index option is cash, but your back leg stays open with a different delta overnight.
- For stock-option calendars the ITM front leg becomes a delivery obligation at its expiry.` },
      { h: 'US & global', md: `> [!us] **SPY 600 call calendar (IV 15%)**: sell 7-day $5.20, buy 37-day $12.66 → debit $7.46 ($746). At the front expiry (back has 30 days): SPY 600 → back $11.29 → +$383; SPY 585 → back $4.93 → −$253; SPY 615 → back $21.02 − front $15 → −$144.
**SPY 1×2 call ratio 600/610 (30 days)**: buy 600 call $11.29, sell 2 × 610 call $6.85 → credit $2.41. Max gain at 610: $1,241; upper BE $622.41; above that losses are unlimited.

In the US the short front leg can be assigned early (dividends, deep ITM puts), which turns the calendar into a stock-plus-option position overnight.` },
      { h: 'Common misconceptions', md: `- **"A calendar is a theta trade only."** It is also long vega and short gamma. A big move or falling back-month IV can make it lose.
- **"A ratio spread for a credit cannot lose."** It can lose without limit beyond the upper breakeven.
- **"The payoff diagram at expiry is exact."** For time spreads it depends on the back-month IV at the front expiry.
- **"Rolling the short leg every week is free income."** Each roll carries costs, slippage and the risk of the short leg being run over.` },
      { h: 'When it fails', md: `**Losing example — the ratio on budget day.** A trader sells the Nifty 1×2 25,000/25,200 ratio (3 sets) for a ₹21 credit, expecting a gentle rally. A policy surprise gaps Nifty to 25,750 at the open on expiry day. Position at expiry ≈ 750 − 2 × 550 + 21 = −329 points → −329 × 65 × 3 = **−₹64,155**. The "free" trade lost about 16 times its credit (₹64,155 against ₹4,095 received).

**Losing example — calendar and IV.** You buy the 25,000 calendar for ₹287. Spot stays at 25,000, but after a calm week back-month IV falls from 13% to 11%. The back leg is worth about ₹370 instead of ₹424; the trade makes ₹83 instead of ₹137 — and if IV falls further or spot drifts 300 points, it loses.` },
      { h: 'Exercise', md: `1. In [[widget:greeks]] price the 7-day and 35-day 25,000 calls, then compute calendar vega and theta.
2. Reprice the back leg at the front expiry (28 days) with spot 24,700, 25,000 and 25,300 at IV 11%, 13% and 15%. Build a 3×3 P&L grid in your journal.
3. In [[widget:options-payoff]] build the 1×2 ratio and mark the upper breakeven. Then stress it with a 3% gap.` },
    ],
    check: [
      { q: 'Nifty 1×2 call ratio: buy 25,000 CE ₹195, sell 2 × 25,200 CE ₹108. Upper breakeven at expiry?', o: ['25,221', '25,421', '25,600', '25,179'], a: 1, why: 'Net credit 21; max gain at 25,200 = 200 + 21 = 221 points; beyond 25,200 the position loses 1 point per point, so BE = 25,200 + 221 = 25,421.' },
      { q: 'A long calendar is best described as:', o: ['Long gamma, short vega', 'Short gamma, long vega, positive theta near the strike', 'Delta neutral and risk-free', 'Short theta and long gamma'], a: 1, why: 'Selling the near option (high gamma, high theta) and buying the far (high vega) leaves the position short gamma, long vega and earning theta near the strike.' },
    ],
    refs: ['Sheldon Natenberg — Option Volatility and Pricing (book)', 'Lawrence G. McMillan — Options as a Strategic Investment (book)', 'John C. Hull — Options, Futures, and Other Derivatives (book)', 'NSE — SPAN margin methodology (nseindia.com)'],
  },

  {
    id: 'l3-expiry', module: 'L3-M3', level: 3, track: 'deriv', title: 'Expiry day, assignment, gamma and gap risk', mins: 25,
    summary: 'Manage expiry-day gamma, settlement and assignment, STT on exercise, gap and liquidity risk for Indian and US options.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Expiry day is when options become all-or-nothing. Time value goes to zero, so every option ends at its intrinsic value — or worthless. In the final hours small price moves cause large percentage swings in option prices.

Three things change on expiry day:
1. **Gamma explodes** for at-the-money options. A ₹30 option can become ₹150 or ₹0 within an hour.
2. **Settlement rules** start to matter: is the option cash-settled or delivered? Can it be exercised early?
3. **Liquidity and costs** shift: spreads in far strikes widen, brokers raise margins and may square off positions.

> [!warn] Options priced at a few rupees on expiry morning are not "cheap" — they reflect a low probability of paying off. Selling them is not "safe" — it is collecting a small amount against a potentially large loss. Both have repeatedly caused severe losses for retail traders.` },
      { h: 'Intermediate view', md: `### Settlement and exercise
| Contract | Style | Settlement | What happens if ITM at expiry |
|---|---|---|---|
| Nifty / Bank Nifty options | European | Cash, to index closing value | Intrinsic value credited/debited |
| NSE stock options | European | **Physical** | Long call → buy shares at strike; short put → buy shares; long put/short call → deliver shares |
| US equity/ETF options (AAPL, SPY) | American | Physical (shares) | Auto-exercise if ITM by $0.01+ (OCC rule); early assignment possible any time |
| SPX options | European | Cash | Intrinsic value settled |

### STT on exercise (India, as of Nov 2026 — verify)
- Sold option: STT 0.15% of premium.
- Option **exercised** at expiry: STT 0.15% of **settlement (intrinsic) value**, charged to the buyer.
- Stock options delivered: the share delivery also triggers delivery-side charges, and you need the full contract value in funds (or shares).

### Expiry-day timeline (NSE)
- 09:15–15:30 normal market. Index settles to the closing value of the index.
- Brokers often block fresh positions in expiring contracts after a cut-off and square off stock-option positions that may go to delivery. Learn your broker's policy before the day.
- SEBI's measures (circular of 1 Oct 2024) added an extra 2% extreme-loss margin on short index options on expiry day (from 20 Nov 2024), limited weekly expiries to one benchmark index per exchange, required option premium to be collected upfront from buyers, and removed the calendar-spread margin benefit on the expiring leg's expiry day (from 10 Feb 2025). As of Nov 2026 — verify current rules on SEBI and NSE circulars.
- Exercise is automatic: NSE Clearing exercises every ITM option at expiry and lets OTM options lapse. For stock options a "do not exercise" instruction has been allowed only for strikes close to the money — verify the current rule on NSE.

[[widget:greeks]]` },
      { h: 'Advanced view', md: `**Gamma, quantified.** A Nifty 25,000 CE on expiry morning (≈ 0.3 day of model time, IV 13%) has gamma ≈ 0.0043 per point — five times its 7-day value. A 50-point move changes its delta by about 0.21. A seller of 5 lots of the ATM straddle (325 units, call and put both contributing gamma) sees delta swing by about 140 units — more than two futures lots — for each 50-point move.

**Theta at the end is not linear.** The same option is worth about ₹70 one day out, ₹38 on expiry morning and zero at 15:30 if Nifty settles at or below 25,000. Sellers' gains come in the last hours — exactly when gamma risk is largest.

**Pin risk.** With spot near a strike into the close, you do not know whether your option will settle ITM or OTM. For cash-settled index options this resolves to a small cash amount. For stock options and US options the difference is **owning or not owning shares** — a full lot of exposure with gap risk at the next open.

**Early assignment (US).** Rational early exercise of an American call usually happens just before an ex-dividend date when the call's time value is below the dividend. Example: AAPL at $240, short 230 call with 2 days left trades at about $10.07, time value ≈ $0.07. If the dividend is larger than that, expect assignment and to be short 100 shares on the ex-date, owing the dividend.

**Gap risk.** Options are priced continuously but markets close. Overnight gaps (global news, results after hours, policy) move prices past any stop. Short-option positions held overnight carry the full gap.

**Liquidity.** On expiry afternoon, far OTM strikes can quote with spreads of 20–50% of premium. Exits in a hurry cost more than the mark-to-market suggests.

> [!evidence] Established: settlement rules, auto-exercise thresholds and STT treatment (as of Nov 2026 — verify on NSE, OCC and the Income Tax department). Speculative: specific expiry-day "patterns" such as reliable max-pain pinning.` },
      { h: 'The maths', md: `### Expiry-day gamma — Nifty 25,000 straddle
| Time left | Call | Put | Straddle | Gamma (per option) |
|---|---|---|---|---|
| 7 days | ₹195 | ₹164 | ₹359 | 0.00088 |
| 2 days | ₹100 | ₹92 | ₹192 | 0.00166 |
| 1 day | ₹70 | ₹66 | ₹136 | 0.00234 |
| Expiry morning (≈0.3 day) | ₹38 | ₹37 | ₹75 | 0.0043 |

Short 3 lots at ₹75 on expiry morning (₹14,625 received). Nifty moves +180 points to settle at 25,180: call 180, put 0 → loss (180 − 75) × 195 = **₹20,475**. Move of 60 points instead: (60 − 75) → +₹2,925. The difference between a calm and a busy final session is ₹23,400 on a position that looked "nearly expired".

### Delta-equivalent exposure on expiry afternoon
Long 4 lots Nifty 25,050 CE, delta 0.30, Nifty 25,000 (260 units). Delta-equivalent = 78 units = 1.2 futures lots. If Nifty rises 80 points late in the session, delta can jump to around 0.63: about 164 units = 2.5 futures lots. Exposure more than doubles in minutes. Use [[widget:futures-exposure]] to see the rupee equivalent.

### STT on exercise vs closing (rates as of Nov 2026)
Long 1 lot Nifty 25,000 CE; index settles at 25,300. Intrinsic = 300 × 65 = ₹19,500. Exercise STT = 0.15% × 19,500 = ₹29.25. Selling at ₹300 just before close: STT = 0.15% × 19,500 = ₹29.25 too. For index options the cost is similar; the decision usually rests on liquidity, broker fees and the risk of the final minutes.

### Stock option delivery
Hypothetical NSE stock at ₹1,400, lot 500. A short 1,420 PE that settles ITM at ₹1,380 obliges you to buy 500 shares at ₹1,420: **₹7,10,000** of funds, plus delivery-type charges (brokers commonly apply the equity-delivery STT rate of 0.1% to physically settled contracts, ≈ ₹710 here — verify on your contract note) and stamp duty — and you now hold the shares with a ₹20,000 mark-to-market loss (500 × 40) before the premium you received.

### US gap
Short 2 AAPL 225 puts at $1.70 (3 days, IV 45%) before earnings. Stock gaps to $210. Puts ≈ $15 → loss ≈ (15 − 1.70) × 200 = **$2,660**. Assignment would give you 200 shares at $225 = $45,000 of stock.` },
      { h: 'India', md: `> [!india] **Nifty weekly expiry (Tuesday, as of Nov 2026 — verify on NSE).** Bank Nifty options are monthly only. On expiry day:
- Know your broker's cut-off time for fresh positions and the auto square-off time for stock options at risk of delivery.
- Expect higher margins on short options (SEBI's expiry-day extra margin).
- Expect wider spreads in far strikes in the last hour; use limit orders.
- **India VIX** often eases into a quiet expiry and spikes on shocks; it measures 30-day volatility, so it understates the intraday gamma of an expiring contract.

Bank Nifty 56,000 CE in its last day carries large rupee gamma per lot (30 × higher index points). A 300-point Bank Nifty move on the last day is common enough to plan for.` },
      { h: 'US & global', md: `> [!us] **SPY and AAPL options are American and physically settled.** OCC auto-exercises equity options ITM by $0.01 or more at expiry unless the holder instructs otherwise. After-hours moves on expiry Friday can make an option that closed OTM worth exercising (holders can submit exercise instructions after the close within the cut-off), so a short option that "expired worthless" at 16:00 ET can still be assigned. SPX is cash-settled and European. 0DTE options on SPX and SPY have expiry-day gamma every session.` },
      { h: 'Common misconceptions', md: `- **"Far OTM options on expiry day are free money to sell."** They are a small reward against a rare but large loss.
- **"Buying ₹5 options is low risk because I can only lose ₹325 per lot."** Repeated total losses add up quickly; probability of payoff is low.
- **"Index options can be assigned early."** NSE index options are European and cash-settled; only US American options carry early assignment.
- **"Stock options settle in cash."** NSE stock options are physically settled when ITM at expiry.
- **"My stop will protect me overnight."** Gaps skip stops.` },
      { h: 'When it fails', md: `**Losing example — the last-hour short.** At 14:15 on expiry day a trader sells 10 lots Nifty 25,100 CE at ₹6 (₹3,900 received). A late rally takes Nifty to 25,190 by the close. Settlement = 90 points → loss (90 − 6) × 650 = **₹54,600** — fourteen times the premium.

**Losing example — forgotten stock option.** A long stock call bought "for a quick trade" is left ITM into expiry. The broker's auto square-off misses it near the close, the option is auto-exercised, and the trader is obliged to pay for the full lot. With insufficient funds the broker can charge interest or penalties on the shortfall and sell the shares the next day — possibly after a gap down.` },
      { h: 'Exercise', md: `1. In [[widget:greeks]] price the Nifty 25,000 CE at 7, 2, 1 and 0.3 days. Record theta and gamma, and plot them in your journal.
2. In [[widget:options-payoff]] build a 3-lot short straddle at ₹75 and stress it at ±60, ±120 and ±180 points.
3. Write your expiry-day checklist: broker cut-offs, positions at risk of delivery, maximum lots, exit time, and what you will do if a short strike is touched.
4. Calculate the STT on exercise for your largest ITM option in the simulator and compare with closing before 15:30.` },
    ],
    check: [
      { q: 'You are short 1 lot of an NSE stock 800 PE (lot 1,000) and the stock settles at ₹780 at expiry. What happens?', o: ['Cash settlement of ₹20 × 1,000', 'You must buy 1,000 shares at ₹800 (physical settlement)', 'Nothing; European options cannot be exercised', 'The broker rolls it to next month'], a: 1, why: 'NSE stock options are physically settled. A short ITM put means you buy the shares at the strike: ₹8,00,000 of funds required.' },
      { q: 'Short 3 lots Nifty 25,000 straddle at ₹75 on expiry morning; Nifty settles at 25,180. P&L?', o: ['+₹14,625', '−₹20,475', '−₹35,100', '−₹5,850'], a: 1, why: 'Settlement value = 180 (call). Loss per unit = 180 − 75 = 105. × 195 units = −₹20,475.' },
      { q: 'Which position is most exposed to early assignment?', o: ['Short Nifty 25,000 CE', 'Short Bank Nifty 56,000 PE', 'Short AAPL deep ITM call before ex-dividend', 'Long SPY put'], a: 2, why: 'Only American options can be exercised early; deep ITM calls with little time value are exercised before ex-dividend. Indian index options are European.' },
    ],
    refs: ['NSE — Settlement of equity derivatives and physical settlement of stock derivatives (nseindia.com)', 'SEBI — Measures to strengthen equity index derivatives framework (circular, Oct 2024, sebi.gov.in)', 'OCC — Exercise and assignment; Exercise-by-exception rule (theocc.com)', 'Sheldon Natenberg — Option Volatility and Pricing (book)'],
  }
  );

  /* ───────────────────────── QUESTION BANK ───────────────────────── */
  IA.content.questions.push(
    {"id":"L3-M1-q01","module":"L3-M1","d":1,"q":"Nifty futures trade at 25,100 with a lot size of 65. What is the notional value of one lot?","o":["₹1,63,150","₹16,31,500","₹25,100","₹1,63,15,000"],"a":1,"why":"25,100 × 65 = ₹16,31,500. Notional, not margin, is your real exposure."},
    {"id":"L3-M1-q02","module":"L3-M1","d":2,"q":"You are long 2 Nifty futures lots. Yesterday's settlement 24,980, today's 24,860. Today's MTM?","o":["−₹15,600","+₹15,600","−₹3,600","−₹7,800"],"a":0,"why":"(24,860 − 24,980) × 65 × 2 = −120 × 130 = −₹15,600, debited the same evening."},
    {"id":"L3-M1-q03","module":"L3-M1","d":2,"q":"Margin ₹2.2 lakh on one Bank Nifty futures lot at 56,200 (lot 30). Leverage?","o":["About 25×","About 30×","About 3.3×","About 7.7×"],"a":3,"why":"Notional = 56,200 × 30 = ₹16,86,000. 16.86 ÷ 2.2 ≈ 7.7×."},
    {"id":"L3-M1-q04","module":"L3-M1","d":2,"q":"Spot Nifty 24,800, r = 6.5%, dividend yield 1.2%, 45 days to expiry. Approximate fair futures price?","o":["24,638","24,800","24,962","25,100"],"a":2,"why":"F ≈ 24,800 × (1 + 0.053 × 45 ÷ 365) = 24,800 × 1.006534 ≈ 24,962."},
    {"id":"L3-M1-q05","module":"L3-M1","d":2,"q":"Spot is unchanged at 25,000 for 15 days. Fair basis falls from 109 to 54 points. P&L on 1 short Nifty futures lot from convergence alone?","o":["−₹3,575","+₹3,575","+₹7,085","₹0 — futures have no time effect"],"a":1,"why":"Futures fall 55 points relative to unchanged spot; a short gains 55 × 65 = ₹3,575."},
    {"id":"L3-M1-q06","module":"L3-M1","d":1,"q":"A stock future trades below spot two days before a large dividend record date. The most likely explanation?","o":["The futures price reflects the dividend the futures holder will not receive","The contract is illiquid","Interest rates have turned negative","Institutions are aggressively bearish"],"a":0,"why":"Fair value subtracts expected dividends. A discount before a large dividend is cost-of-carry, not a signal."},
    {"id":"L3-M1-q07","module":"L3-M1","d":3,"q":"Portfolio ₹75 lakh, β 0.9 to Nifty. Nifty futures 25,000 × 65. How many lots to hedge, and what residual notional remains with the nearest whole number?","o":["5 lots, residual ≈ −₹13.75 lakh","3 lots, residual ≈ ₹18.75 lakh","4.15 lots exactly","4 lots, residual ≈ ₹2.5 lakh unhedged"],"a":3,"why":"Hedge notional = 75 × 0.9 = ₹67.5 lakh; per lot ₹16.25 lakh → 4.15. 4 lots hedge ₹65 lakh, leaving ≈ ₹2.5 lakh. You cannot trade 0.15 of a lot."},
    {"id":"L3-M1-q08","module":"L3-M1","d":2,"q":"Capital ₹12 lakh, risk 1% per trade, Nifty futures stop 140 points. Maximum lots?","o":["3","0","1","2"],"a":2,"why":"Budget ₹12,000. Risk per lot = 140 × 65 = ₹9,100 → 1.32 → 1 lot. Always round down."},
    {"id":"L3-M1-q09","module":"L3-M1","d":3,"q":"You hold 3 Nifty futures lots long at 25,100 overnight. Nifty opens with a −2% gap. Loss at the open?","o":["₹65,260","₹97,890","₹1,63,150","₹32,630"],"a":1,"why":"2% of 25,100 = 502 points × 195 units = ₹97,890. No stop could fill above the open."},
    {"id":"L3-M1-q10","module":"L3-M1","d":2,"q":"Round-trip STT on 1 Nifty futures lot bought and sold at 25,000 (rates as of Nov 2026)?","o":["₹812.50 (0.05% on sell only)","₹2,437.50 (0.15%)","₹0 — STT applies only to options","₹1,625 (0.05% each side)"],"a":0,"why":"Futures STT is 0.05% on the sell side: 25,000 × 65 × 0.0005 = ₹812.50."},
    {"id":"L3-M1-q11","module":"L3-M1","d":2,"q":"Near-month Nifty futures 25,109 and next-month 25,237 (both at fair value). You roll 2 long lots. What does the 128-point difference represent?","o":["A guaranteed loss of ₹16,640","A bullish signal from institutions","A fee charged by the exchange","Extra carry for the longer period, which converges away by the next expiry"],"a":3,"why":"The roll spread is the extra cost-of-carry. It is not a fee; it decays as the new contract approaches expiry, so a long must out-earn it."},
    {"id":"L3-M1-q12","module":"L3-M1","d":3,"q":"An option book has total delta of +195 Nifty units. To make it delta-neutral with futures you would:","o":["Buy 1 lot","Buy 3 lots","Sell 3 lots","Sell 195 lots"],"a":2,"why":"195 ÷ 65 = 3 lots of positive delta; selling 3 futures lots offsets it. Gamma will move delta again as spot changes."},
    {"id":"L3-M1-q13","module":"L3-M1","d":2,"q":"A US trader is long 2 E-mini S&P 500 contracts ($50/point). The index falls 45 points. P&L?","o":["−$900","−$4,500","−$450","−$9,000"],"a":1,"why":"45 × $50 × 2 = −$4,500."},
    {"id":"L3-M2-q01","module":"L3-M2","d":1,"q":"Nifty at 25,000. Which option is in the money?","o":["25,200 PE","25,400 CE","25,200 CE","24,800 PE"],"a":0,"why":"A put is ITM when strike > spot: 25,200 PE has 200 points of intrinsic value."},
    {"id":"L3-M2-q02","module":"L3-M2","d":2,"q":"Bank Nifty 56,000 CE costs ₹911 (lot 30). Breakeven at expiry and maximum loss?","o":["56,000; ₹911","55,089; ₹27,330","56,911; unlimited","56,911; ₹27,330"],"a":3,"why":"BE = strike + premium = 56,911. Max loss for a long call = premium × lot = ₹27,330."},
    {"id":"L3-M2-q03","module":"L3-M2","d":2,"q":"Short 1 lot Nifty 25,000 CE at ₹195. Nifty settles at 25,450. P&L?","o":["−₹4,550","+₹12,675","−₹16,575","−₹29,250"],"a":2,"why":"Intrinsic 450 − 195 = 255 loss per unit × 65 = −₹16,575."},
    {"id":"L3-M2-q04","module":"L3-M2","d":2,"q":"Long 2 lots Nifty 25,000 CE, delta 0.53. Delta-equivalent exposure in futures lots?","o":["0.53","About 1.06","2","About 3.8"],"a":1,"why":"0.53 × 65 × 2 = 68.9 units ÷ 65 = 1.06 futures lots."},
    {"id":"L3-M2-q05","module":"L3-M2","d":2,"q":"An option has theta −₹15 per unit per day. Over 3 days, with spot and IV unchanged, approximately how much does 1 Nifty lot lose?","o":["₹2,925","₹8,775","₹45","₹975"],"a":0,"why":"15 × 3 × 65 = ₹2,925. Theta accelerates near expiry, so this is an approximation."},
    {"id":"L3-M2-q06","module":"L3-M2","d":2,"q":"A Nifty option has vega ₹13.8 per unit per IV point. IV falls from 17% to 13% after an event. Change per lot from vega (spot unchanged)?","o":["+₹3,588","−₹55","−₹897","−₹3,588"],"a":3,"why":"−4 × 13.8 × 65 ≈ −₹3,588 for a long option. This is IV crush."},
    {"id":"L3-M2-q07","module":"L3-M2","d":2,"q":"India VIX is 20 and Nifty is 25,000. Approximate 1σ daily move?","o":["About 1,250 points","About 80 points","About 315 points","About 500 points"],"a":2,"why":"25,000 × 0.20 ÷ √252 ≈ 5,000 ÷ 15.87 ≈ 315 points."},
    {"id":"L3-M2-q08","module":"L3-M2","d":3,"q":"AAPL $230, 30-day IV 28%. Using 0.8 × S × σ × √T, the expected move to expiry is about:","o":["$5.20","$14.80","$51.50","$64.40"],"a":1,"why":"0.8 × 230 × 0.28 × √(30/365) = 51.52 × 0.2867 ≈ $14.77; the model straddle is $14.72. $51.50 forgets the √T term."},
    {"id":"L3-M2-q09","module":"L3-M2","d":3,"q":"Theta −₹24 and gamma 0.0002 for a Bank Nifty ATM option. Daily move needed for a delta-hedged long option to break even?","o":["About 490 points","About 1,200 points","About 49 points","About 120 points"],"a":0,"why":"√(2 × 24 ÷ 0.0002) = √240,000 ≈ 490 points."},
    {"id":"L3-M2-q10","module":"L3-M2","d":2,"q":"Total put OI 2.4 lakh lots, total call OI 1.6 lakh lots. PCR, and what can you conclude from it alone?","o":["1.5 — the market will rise to the highest put OI strike","1.5 — clearly bullish","0.67 — clearly bearish","1.5 — ambiguous, because OI does not show who is long or short"],"a":3,"why":"PCR = 2.4 ÷ 1.6 = 1.5. It is read both ways; without knowing direction of positions it is not a reliable signal."},
    {"id":"L3-M2-q11","module":"L3-M2","d":2,"q":"Which NSE contract is physically settled if ITM at expiry?","o":["Nifty weekly options","Bank Nifty monthly options","Stock options such as Reliance","Nifty futures"],"a":2,"why":"NSE stock derivatives are physically settled. Index derivatives are cash-settled."},
    {"id":"L3-M2-q12","module":"L3-M2","d":2,"q":"Before results AAPL's 230 straddle costs $7.48. After results the stock is at $232 and the straddle is worth $3.79. P&L for one long straddle?","o":["+$200","−$369","−$748","+$379"],"a":1,"why":"(3.79 − 7.48) × 100 = −$369. The stock moved the right way for the call, but the move was smaller than the premium and IV crushed."},
    {"id":"L3-M2-q13","module":"L3-M2","d":2,"q":"Nifty 24,800 PE costs ₹87 with spot at 25,000. Intrinsic and time value?","o":["0 and 87","87 and 0","200 and 87","200 and −113"],"a":0,"why":"A put is OTM when strike < spot, so intrinsic is 0 and all ₹87 is time value."},
    {"id":"L3-M2-q14","module":"L3-M2","d":3,"q":"Using put–call parity for European options (C − P = PV(F − K), and over 7 days discounting is negligible), if the 25,000 CE is ₹195 and the forward is 25,031, the 25,000 PE should be about:","o":["₹195","₹226","₹31","₹164"],"a":3,"why":"C − P ≈ F − K = 31 → P ≈ 195 − 31 = ₹164. Using spot instead of the forward misreads which option is expensive."},
    {"id":"L3-M3-q01","module":"L3-M3","d":2,"q":"Nifty bull call spread 25,000/25,200 for a ₹87 debit (lot 65). Max gain, max loss and breakeven?","o":["₹5,655; ₹7,345; 25,113","Unlimited; ₹5,655; 25,087","₹7,345; ₹5,655; 25,087","₹13,000; ₹5,655; 25,200"],"a":2,"why":"Max gain = (200 − 87) × 65 = ₹7,345; max loss = 87 × 65 = ₹5,655; BE = lower strike + debit = 25,087."},
    {"id":"L3-M3-q02","module":"L3-M3","d":2,"q":"Nifty bull put spread 24,800/24,600 for ₹47 credit. Nifty settles at 24,700. P&L per lot?","o":["+₹3,055","−₹3,445","−₹9,945","+₹6,500"],"a":1,"why":"Short 24,800 PE intrinsic 100; long 24,600 PE 0. Loss = 100 − 47 = 53 × 65 = −₹3,445."},
    {"id":"L3-M3-q03","module":"L3-M3","d":3,"q":"Short Bank Nifty 56,000 straddle for ₹1,613 (lot 30). Bank Nifty settles at 58,100. P&L?","o":["−₹14,610","−₹63,000","−₹48,390","+₹48,390"],"a":0,"why":"Call intrinsic 2,100; put 0. Loss = 2,100 − 1,613 = 487 × 30 = −₹14,610. A further 1,000 points would add −₹30,000 — risk is unlimited."},
    {"id":"L3-M3-q04","module":"L3-M3","d":2,"q":"Long call butterfly 24,800/25,000/25,200 for a ₹35 debit. Max gain and where it occurs?","o":["₹13,000 at 25,200","₹2,275 at 24,800","Unlimited above 25,200","₹10,725 at 25,000"],"a":3,"why":"Max gain = (width 200 − debit 35) × 65 = ₹10,725 if Nifty settles exactly at the middle strike."},
    {"id":"L3-M3-q05","module":"L3-M3","d":3,"q":"Iron condor 24,600/24,800/25,200/25,400 for ₹102 credit, 2 lots. Nifty gaps to 25,500 at expiry. P&L?","o":["−₹25,480","+₹13,260","−₹12,740","−₹39,000"],"a":2,"why":"Call spread at full width 200; loss = 200 − 102 = 98 × 130 = −₹12,740. The long 25,400 call caps it."},
    {"id":"L3-M3-q06","module":"L3-M3","d":3,"q":"Nifty 1×2 call ratio: buy 1 × 25,000 CE ₹195, sell 2 × 25,200 CE ₹108. Settlement 25,700. P&L per set?","o":["+₹1,365","−₹18,135","−₹32,500","+₹14,365"],"a":1,"why":"Long call 700, two short calls −2 × 500 = −1,000, credit +21 → −279 × 65 = −₹18,135."},
    {"id":"L3-M3-q07","module":"L3-M3","d":2,"q":"SPY 600/610 bull call spread, debit $4.44. Max loss, max gain and breakeven per spread?","o":["$444; $556; $604.44","$556; $444; $605.56","$1,000; $444; $610","$444; unlimited; $604.44"],"a":0,"why":"Max loss = debit × 100 = $444; max gain = (10 − 4.44) × 100 = $556; BE = 600 + 4.44."},
    {"id":"L3-M3-q08","module":"L3-M3","d":2,"q":"Short Nifty straddle per lot: theta +₹1,676/day, vega −₹1,790 per IV point. India VIX jumps and the option IV rises 2.5 points in a day with spot unchanged. Net one-day P&L approximately?","o":["−₹4,475","+₹6,151","+₹1,676","−₹2,799"],"a":3,"why":"Vega loss = 2.5 × 1,790 = ₹4,475; theta gain ₹1,676. Net ≈ −₹2,799. Theta is not guaranteed income."},
    {"id":"L3-M3-q09","module":"L3-M3","d":3,"q":"Nifty calendar: sell 7-day 25,000 CE and buy 35-day 25,000 CE for a net debit of ₹287. At the front expiry Nifty is 25,000 and the back call is worth ₹424 (IV unchanged). P&L per lot?","o":["+₹27,560","+₹18,655","+₹8,905","−₹3,835"],"a":2,"why":"Spread value at the front expiry = 424 − 0 = 424; gain (424 − 287) = 137 × 65 = ₹8,905. If back-month IV had fallen, the gain would be smaller."},
    {"id":"L3-M3-q10","module":"L3-M3","d":3,"q":"You are short 5 lots Nifty 25,000 straddle on expiry morning; each option has gamma ≈ 0.0043 per point. Roughly how much does position delta change for a 50-point rise?","o":["About 14 units","About 140 units (≈ 2 futures lots) more short","About 650 units","About 1 unit"],"a":1,"why":"Straddle gamma ≈ 2 × 0.0043 = 0.0086 per unit. × 325 units × 50 points ≈ 140 units, about 2.2 Nifty futures lots, and the position becomes more short as price rises. That is short gamma."},
    {"id":"L3-M3-q11","module":"L3-M3","d":2,"q":"Long 1 lot Nifty 25,000 CE held to expiry; Nifty settles at 25,300. STT on exercise (0.15% of settlement value, as of Nov 2026)?","o":["₹29.25","₹292.50","₹2,437.50","₹0"],"a":0,"why":"Settlement value = 300 × 65 = ₹19,500; 0.15% = ₹29.25. For index options it is similar to selling at intrinsic before the close."},
    {"id":"L3-M3-q12","module":"L3-M3","d":3,"q":"You are short 1 lot of an NSE stock 1,420 PE (lot 500). The stock settles at ₹1,380. What must you do and fund?","o":["Deliver 500 shares","Nothing; European options cannot be exercised","Pay ₹20,000 cash only","Buy 500 shares at ₹1,420 = ₹7,10,000"],"a":3,"why":"NSE stock options are physically settled. A short ITM put obliges you to buy the shares at the strike."},
    {"id":"L3-M3-q13","module":"L3-M3","d":2,"q":"Which US position is most likely to be assigned early?","o":["Short AAPL 250 call, AAPL at $230","Short SPX 6,000 put","Short AAPL 230 call, AAPL at $240, 2 days to expiry, dividend tomorrow larger than the call's time value","Long SPY 600 call"],"a":2,"why":"American calls deep ITM with time value below the upcoming dividend are commonly exercised before ex-dividend. SPX is European; OTM options are not rationally exercised; long positions are never assigned."},
    {"id":"L3-M3-q14","module":"L3-M3","d":2,"q":"On expiry morning a trader sells 10 lots Nifty 25,100 CE at ₹6. Nifty settles at 25,190. P&L?","o":["+₹3,900","−₹54,600","−₹58,500","−₹5,460"],"a":1,"why":"(90 − 6) × 650 = −₹54,600 — fourteen times the premium collected. Small premiums are not small risk."},
    {"id":"L3-M3-q15","module":"L3-M3","d":1,"q":"You cannot place a two-leg credit spread as one order. Which leg should you enter first?","o":["The long (protective) leg","Either, it does not matter","Both at market simultaneously","The short leg, to lock in premium"],"a":0,"why":"Entering the long leg first means a partial fill leaves defined risk, not a naked short with full margin."}
  );
})(typeof window !== 'undefined' ? window : globalThis);
