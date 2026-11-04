/* Level 1 — Foundation lessons (L1-M1 … L1-M5) and module assessment questions.
   Authoring rules: see docs/CONTENT-SPEC.md. Figures marked "as of" must be re-verified. */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  IA.content.lessons = IA.content.lessons || []; IA.content.questions = IA.content.questions || [];
  // Deterministic rotation of answer options so the correct index varies across items.
  let rot = 0;
  const spin = (q) => { const n = q.o.length, k = rot++ % n; if (!k) return q; const o = q.o.slice(k).concat(q.o.slice(0, k)); return Object.assign({}, q, { o, a: (q.a - k + n) % n }); };
  const L = (o) => IA.content.lessons.push(Object.assign({ level: 1 }, o, { check: (o.check || []).map(spin) }));
  const Q = (arr) => arr.forEach((q) => IA.content.questions.push(spin(q)));

  /* ======================= L1-M1 How markets work ======================= */

  L({
    id: 'l1-exchanges', module: 'L1-M1', track: 'found', title: 'Exchanges, brokers, clearing and settlement', mins: 16,
    summary: 'Trace exactly what happens between pressing Buy and owning a share, and know which institution protects you at each step.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Think of a market as a very strict wholesale bazaar. The **exchange** is the bazaar building: it sets the rules, runs the matching machine and publishes prices. You are not allowed inside directly; you enter through a licensed agent, the **broker**. When two people agree a price, a separate referee, the **clearing corporation**, steps in and guarantees that the buyer gets the shares and the seller gets the money, even if one of them disappears. Finally, the **depository** is the vault where shares sit in electronic form in your name.

Why should an intraday trader care? Because every rupee of cost, every margin call, every "order rejected" message and every rare broker failure comes from one of these four layers. If you know who does what, you know where your risk sits.

> [!note] You trade with the market, not with your broker. Your broker forwards your order; the counterparty is anonymous and the clearing corporation stands between you.` },
      { h: 'Intermediate view', md: `### The life of one order (India)
1. You place a limit order to buy 100 Reliance at ₹1,400 in your broker app.
2. The broker's risk system checks you have enough margin or cash. If not, the order is rejected before it ever reaches the exchange.
3. The order goes to NSE (or BSE). It enters the **order book** and waits until a seller at ₹1,400 or lower appears. Matching is by price, then time.
4. On a match, the exchange creates a **trade**. Both sides receive a trade confirmation within milliseconds.
5. A clearing corporation, typically **NSE Clearing Ltd** for NSE trades or **Indian Clearing Corporation** for BSE trades, becomes the buyer to every seller and the seller to every buyer. This is called **novation**. (Under the interoperability framework, in place since 2019, a clearing member can choose which clearing corporation it clears through.)
6. If you square off the same day (intraday), your buy and sell net to zero shares; only the rupee profit or loss and charges settle.
7. If you hold, settlement happens on **T+1**: shares are credited to your demat account at **CDSL** or **NSDL** the next working day.

| Layer | India | US | What it protects you from |
|---|---|---|---|
| Exchange | NSE, BSE | NYSE, Nasdaq, Cboe and others | Unfair matching, hidden prices |
| Broker | SEBI-registered stockbroker | SEC/FINRA-registered broker-dealer | You do not need exchange membership |
| Clearing | NSE Clearing, ICCL | NSCC (DTCC), OCC for options | Counterparty default |
| Depository | CDSL, NSDL | DTC | Loss of physical certificates, ownership disputes |

The broker also applies its own rules on top of the exchange's: auto square-off times for intraday positions, higher margins on volatile stocks, blocked order types. These are broker choices, not market law.` },
      { h: 'Advanced view', md: `Professionals think about **where risk is concentrated**. The clearing corporation manages default risk with margins (SPAN plus exposure margin in derivatives, VaR plus extreme-loss margin in cash) and a **core settlement guarantee fund**. That is why margin is collected upfront: it is the clearing house's buffer, not a fee.

Your remaining risk is mostly **broker risk**: misuse of client funds or securities. SEBI tightened this after several broker failures with rules such as upfront margin collection, daily reporting of client balances to exchanges, and blocking of client securities through a pledge mechanism rather than transfer. In the US, broker-dealer client assets are segregated under SEC customer-protection rules and SIPC provides limited coverage if a broker fails (not coverage against trading losses).

Settlement cycle matters for capital efficiency. India moved fully to T+1 in January 2023, and SEBI has run an optional same-day (T+0) cycle for a limited list of stocks since 2024 (as of Nov 2026 — verify scope on sebi.gov.in). The US moved to T+1 on 28 May 2024. For a pure intraday trader, settlement mostly affects **when sale proceeds become usable** and how BTST (buy today, sell tomorrow) trades carry short-delivery risk.` },
      { h: 'The maths', md: `Intraday netting is simple arithmetic but worth seeing once.

:::formula
Net obligation = (Sell qty × Sell price) − (Buy qty × Buy price) − charges
:::

You buy 100 Reliance at ₹1,400 and sell 100 at ₹1,410 the same day.
- Buy value: 100 × 1,400 = ₹1,40,000
- Sell value: 100 × 1,410 = ₹1,41,000
- Gross P&L: ₹1,000
- Charges (brokerage, STT, exchange, SEBI, GST, stamp duty): about ₹97 at a ₹20-per-order broker
- Net credited after settlement: about ₹903

No shares move into your demat account, because your net share obligation is zero.` },
      { h: 'India', md: `> [!india] If you buy intraday (MIS/intraday product) and forget to sell, most brokers auto square-off around 15:15–15:25 IST at market price and may charge a fee. If you sell intraday shares you do not own and cannot buy back (for example the stock hits upper circuit), you face **short delivery**: the exchange runs an **auction** and you can pay a penalty well above the price you sold at. This is a real, avoidable intraday risk.

### Professional notes: MIS square-off and short delivery
- **Auto square-off is a broker process, not an exchange guarantee.** The broker's system sends market orders near its cut-off time. If the stock is locked at a circuit, those orders cannot fill. An unfilled intraday *buy* becomes a delivery position that needs full payment (the broker may sell it the next day at your risk); an unfilled intraday *short* becomes a short delivery. Brokers typically charge a fee for auto square-off (check your broker's charges page).
- **How short delivery is settled.** The clearing corporation buys the shares for you in an auction on the settlement day. If the auction also fails, the position is closed out at a price set by exchange rules (broadly, the higher of the highest price traded between the trade day and the auction day, or a fixed percentage above the auction-day close; as of Nov 2026 — verify the current rule on nseclearing.in). Either way, the cost can be far above any stop you planned.

Keep three things separate in your mind: the **trading account** (with broker, holds funds), the **demat account** (with depository via the broker, holds shares), and the **bank account** (linked for pay-in and pay-out).` },
      { h: 'US & global', md: `> [!us] A US order may be routed to any of a dozen-plus exchanges, to a wholesaler, or to an alternative trading system. The best displayed price across venues is the **NBBO**, and brokers have a best-execution duty. This fragmented routing is covered in [[link:l2-us-structure]]. Clearing and settlement still converge on DTCC for stocks and OCC for listed options.

Europe has a similar chain (exchange, broker, central counterparty such as Eurex Clearing or LCH, and a central securities depository).` },
      { h: 'Common misconceptions', md: `- **"My broker takes the other side of my trade."** On NSE/BSE, no. Your trade is matched with another anonymous participant and novated to the clearing corporation. (Some offshore CFD brokers do take the other side; that is a different, riskier product.)
- **"Margin is a fee."** Margin is a deposit held against possible loss. You get it back when the position closes, minus any loss.
- **"Settlement is instant because the app shows the shares."** The app shows a position; legal ownership in the depository follows the settlement cycle.
- **"An exchange guarantees I won't lose money."** The guarantee is only that the trade settles, not that it is profitable.` },
      { h: 'When it fails', md: `The plumbing rarely fails, but the edges do:
- **Broker outage.** During a fast move your app freezes and you cannot exit. Professionals keep the broker's call-and-trade number saved and know that a stop order already sitting at the exchange still works even if the app does not.
- **Short delivery.** You short 200 shares of a small-cap at ₹300 intraday; it hits the upper circuit at ₹330 and there are no sellers. You cannot buy back. The next day the exchange auction settles at, say, ₹340 plus penalty. A planned ₹1,000 risk turns into a loss of ₹8,000 or more.
- **Broker default.** Rare and partly mitigated by SEBI rules, but this is why you should check your demat holdings directly with CDSL/NSDL statements, not only the broker's app.` },
      { h: 'Exercise', md: `1. Open the Simulator and place a limit buy, then a market sell. Write in your Journal the five layers each order passed through.
2. Download a contract note from your broker (or use the sample in the Library) and label each charge with the institution that receives it.
3. Use the calculator below for a ₹1,40,000 intraday Reliance trade and check that the charges match the worked example.

[[widget:charges-india]]` },
    ],
    check: [
      { q: "You buy and sell 500 HDFC Bank shares on the same day. What happens at settlement?", o: ["500 shares are delivered to your demat and then taken out", "Only the net rupee profit or loss and charges settle; no shares move", "The broker keeps the shares as collateral", "Nothing settles until T+2"], a: 1, why: "Intraday buys and sells net to zero shares, so only the money obligation settles. T+2 is outdated; India is on T+1, and the broker does not keep shares from a squared-off trade." },
      { q: "Which institution guarantees that your matched NSE trade settles even if the counterparty defaults?", o: ["Your broker", "SEBI", "NSE Clearing Ltd through novation", "Your bank"], a: 2, why: "The clearing corporation becomes the counterparty to both sides. SEBI regulates; it does not guarantee trades. Brokers and banks are not counterparties." },
      { q: "Why is short-selling an illiquid stock intraday more dangerous than buying it?", o: ["Short sellers pay higher brokerage", "If it locks at upper circuit you may be unable to buy back, leading to an auction and penalty", "Short sales settle on T+3", "Shorts cannot use stop-losses"], a: 1, why: "The unique risk is short delivery when you cannot cover. Brokerage and settlement cycles do not differ, and stops are possible but may not fill at a locked circuit." },
    ],
    refs: ['Larry Harris — Trading and Exchanges: Market Microstructure for Practitioners (book)', 'NSE Clearing Ltd — Clearing and settlement process; auction and close-out of short deliveries (nseclearing.in)', 'SEBI — Circular on T+1 rolling settlement (2021) and optional T+0 settlement (2024) (sebi.gov.in)', 'SEC — Shortening the securities transaction settlement cycle, final rule (2023) (sec.gov)', 'CDSL / NSDL — Investor FAQs on demat accounts (cdslindia.com, nsdl.co.in)'],
  });

  L({
    id: 'l1-orderbook', module: 'L1-M1', track: 'found', title: 'The order book, bid–ask spread and liquidity', mins: 16,
    summary: 'Read a market-depth screen, compute the spread cost of a trade, and judge whether a stock is liquid enough for your size.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Every price you see on a chart is the result of a queue. On one side are buyers saying "I will pay up to X" (the **bids**). On the other are sellers saying "I will sell at no less than Y" (the **asks** or **offers**). The highest bid and the lowest ask face each other; the gap between them is the **spread**.

If you want to buy *now*, you must pay the ask. If you want to sell *now*, you must accept the bid. So the instant you buy at the ask and could sell at the bid, you are already slightly in loss. That loss is the spread, and for an intraday trader who trades many times a day it is one of the biggest hidden costs.

**Liquidity** is how much you can trade quickly without moving the price much. A liquid stock is like a busy highway: plenty of cars in every lane. An illiquid stock is a village road: one tractor can block it.` },
      { h: 'Intermediate view', md: `### Reading market depth
Most Indian broker apps show the top five price levels on each side (this is often called **Level 2** or market depth). Here is a stylised snapshot of a large private bank stock:

| Bid qty | Bid ₹ | Ask ₹ | Ask qty |
|---|---|---|---|
| 1,250 | 1,000.10 | 1,000.20 | 900 |
| 3,400 | 1,000.05 | 1,000.25 | 2,100 |
| 2,800 | 1,000.00 | 1,000.30 | 5,600 |
| 1,900 | 999.95 | 1,000.35 | 1,700 |
| 4,100 | 999.90 | 1,000.40 | 3,000 |

- **Best bid** ₹1,000.10, **best ask** ₹1,000.20, spread ₹0.10. In this stylised book prices step in ₹0.05 **ticks**, so the spread is two ticks. (The real tick for a stock depends on its price band; see the India section.)
- If you send a market buy for 500 shares, all 500 fill at ₹1,000.20 because 900 are offered there.
- A market buy for 5,000 shares eats 900 at 1,000.20, 2,100 at 1,000.25 and 2,000 at 1,000.30. Your average price is higher than the best ask. That is **market impact** or **slippage**.

### Three ways to judge liquidity quickly
1. **Spread in ticks.** One tick most of the day is a good sign.
2. **Depth versus your size.** Your order should be a small fraction of what is shown at the top few levels.
3. **Traded value.** Look at average daily traded value in crore. Nifty 50 heavyweights trade thousands of crore a day; many small-caps trade a few crore.` },
      { h: 'Advanced view', md: `The visible book is not the whole book. Large participants hide size using **iceberg orders** (only a slice is displayed) and algorithms that refill the best price repeatedly. Displayed size can also vanish before you reach it; this is normal behaviour of market makers updating quotes, and it is risky to read intent into it.

Spreads are not constant. They **widen** at the open (09:15–09:30 IST) when price discovery is still happening, around news, near the close, and in stocks that hit price bands. They **narrow** when many competing liquidity providers are active. A strategy that looks profitable on a 1-minute chart using last-traded prices can be unprofitable once you pay half the spread on entry and exit at those exact times.

Professionals measure **effective spread** (twice the distance between their fill and the mid-price) rather than the quoted spread, because that is what they actually paid. Liquidity also has a time dimension: Bank Nifty futures can absorb several lots instantly, but a far out-of-the-money stock option may show a ₹2 spread on a ₹10 premium, which is a 20% round-trip handicap.` },
      { h: 'The maths', md: `:::formula
Mid-price = (Best bid + Best ask) / 2
Spread % = (Ask − Bid) / Mid × 100
Round-trip spread cost ≈ Spread × Quantity (buying at ask, selling at bid)
:::

**Example 1 — liquid large-cap.** Bid ₹1,000.10, ask ₹1,000.20. Mid ₹1,000.15. Spread % = 0.10 / 1,000.15 × 100 ≈ 0.01%. For 500 shares the round-trip spread cost is about 0.10 × 500 = ₹50.

**Example 2 — thin small-cap.** Bid ₹248.00, ask ₹249.20. Mid ₹248.60. Spread % = 1.20 / 248.60 × 100 ≈ 0.48%. For ₹1,00,000 of stock (about 401 shares at the ₹249.20 ask) the round-trip spread cost is about 1.20 × 401 = ₹481, nearly ten times the liquid case for a smaller position.

If your target is 0.5% on the trade, the small-cap spread alone consumes almost all of it.` },
      { h: 'India', md: `> [!india] Nifty index options have been among the most heavily traded derivative contracts in the world by contract count (see the Futures Industry Association's annual volume surveys), and Nifty and Bank Nifty futures are very liquid. Liquidity in individual stock options is far thinner. Before trading any stock intraday, check its average traded value and whether it is in the F&O segment (F&O stocks must meet liquidity criteria set by SEBI and NSE).

NSE uses price-based tick sizes for equities, reviewed periodically: lower-priced stocks get a smaller tick (as small as ₹0.01) and higher-priced stocks larger ones (as of Nov 2026 — verify the current tick table on nseindia.com). The principle to remember: the minimum possible spread is one tick, so tick size divided by price is a floor on your spread cost. Illustration: a ₹0.05 tick on a ₹50 stock is a 0.1% floor; the same tick on a ₹2,500 stock is only 0.002%.` },
      { h: 'US & global', md: `> [!us] US large-caps like Apple or Nvidia usually trade with a one-cent spread on a share price in the hundreds of dollars, a tiny percentage. Low-priced US small-caps can show spreads of several percent, especially in pre-market. US quotes also aggregate across many venues into the NBBO.` },
      { h: 'Common misconceptions', md: `- **"Large bid size means price will go up."** Displayed size can be cancelled in milliseconds. Depth is information, not a promise.
- **"The last traded price is what I will get."** You get the ask when buying at market and the bid when selling.
- **"Spread doesn't matter, brokerage is zero."** Zero brokerage does nothing about spread or impact.
- **"Volume equals liquidity."** High volume at a wide spread during a news spike is not the same as tight, deep liquidity.` },
      { h: 'When it fails', md: `Liquidity disappears exactly when you need it most. On a sharp news drop, the bid side of a mid-cap can thin from thousands of shares to a few hundred within seconds. Suppose you are long 2,000 shares at ₹480 with a stop-loss market order at ₹472. When it triggers, the visible bids are 300 at ₹471, 400 at ₹469, 500 at ₹466 and 800 at ₹462. Your fill averages roughly ₹466 (₹465.75). Your planned loss was ₹16,000; your actual loss is about ₹28,500. Nothing was wrong with your analysis. The failure was trading a size that the book could not absorb under stress.` },
      { h: 'Exercise', md: `1. In the Chart Lab, load a Midcap chart and a Nifty chart. Note how the simulated spread differs.
2. Copy the depth table above into your Journal and calculate the average fill for market buys of 1,000, 3,000 and 6,000 shares.
3. Pick three stocks you might trade. Record their typical spread (in ticks and %) at 09:20, 11:30 and 15:15 for a week in paper mode.

[[chart:MIDCAP:7:vol]]` },
    ],
    check: [
      { q: "Bid ₹500.00, ask ₹500.50. You buy 200 at market and immediately sell 200 at market. Ignoring other charges, what do you lose?", o: ["₹0, prices didn't move", "₹50", "₹100", "₹500"], a: 2, why: "You buy at ₹500.50 and sell at ₹500.00, losing ₹0.50 × 200 = ₹100. The spread is a real cost even with no price movement." },
      { q: "Which is the best evidence that a stock can absorb your 1,000-share intraday order?", o: ["It rose 8% today", "Its spread is usually one tick and several thousand shares rest at each of the top levels", "A large bid of 50,000 shares is showing", "It has high RSI"], a: 1, why: "Consistently tight spread and depth well above your size indicate liquidity. A one-off large bid can be cancelled; price change and RSI say nothing about depth." },
    ],
    refs: ['Larry Harris — Trading and Exchanges: Market Microstructure for Practitioners (book)', 'Maureen O\'Hara — Market Microstructure Theory (book)', 'NSE — Market depth and tick size information (nseindia.com)', 'Futures Industry Association — annual exchange volume surveys (fia.org)', 'SEC — Investor.gov: glossary entries on bid price, ask price and spread (investor.gov)'],
  });

  L({
    id: 'l1-ordertypes', module: 'L1-M1', track: 'found', title: 'Order types and when each one hurts you', mins: 17,
    summary: 'Choose between market, limit, stop-limit and stop-market orders for entries and exits, knowing the specific way each can fail.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `An order is an instruction to your broker. There are only two basic promises an order can make:
- **"Fill me for sure"** (market order): you are guaranteed execution but not price.
- **"Fill me only at this price or better"** (limit order): you are guaranteed price but not execution.

Every other order type is a combination of these two with a **trigger**. A stop-loss order says, "do nothing until price reaches the trigger, then become a market (or limit) order." Choosing the right type is a trade-off between the risk of a bad price and the risk of not getting filled. Each one hurts you in a different situation, so you should pick deliberately, not by habit.` },
      { h: 'Intermediate view', md: `| Order | What it does | Helps when | Hurts when |
|---|---|---|---|
| Market | Fills immediately at best available price | You must exit now | Thin book, open, news: big slippage |
| Limit | Fills at your price or better | Entering at a planned level | Price runs away without filling you |
| SL (stop-limit) | At trigger, places a limit order | You want a stop but fear slippage | Gap through limit: no fill, loss grows |
| SL-M (stop-market) | At trigger, places a market order | Exit must happen | Slippage in fast markets; often blocked for options |

### Indian broker terminology
- **SL** with trigger ₹1,386 and limit ₹1,384 on a long Reliance position: when last traded price touches ₹1,386, a sell limit at ₹1,384 is sent. It fills anywhere at or above ₹1,384.
- **SL-M** with trigger ₹1,386: on trigger, a market sell is sent.
- **Validity**: DAY (cancelled at close) or IOC (immediate or cancel; whatever doesn't fill instantly is cancelled).
- **Product**: intraday (MIS) versus delivery (CNC) versus normal (NRML for F&O carry). Product decides margin and auto square-off, not price.
- Broker features such as **GTT** (good-till-triggered), **cover orders** and **AMO** (after-market orders) live on the broker's servers until they are sent to the exchange.

### A sensible default for beginners
Enter with **limit** orders at your planned price. Exit losers with a **stop-limit with a wide enough buffer** (or stop-market where the instrument is very liquid and allowed). Take profits with limits.` },
      { h: 'Advanced view', md: `Two subtleties matter for professionals.

**Where the order lives.** An exchange-resident stop (an SL order sitting at NSE) triggers even if your phone dies. A broker-resident trigger (GTT, some app "alerts") depends on the broker's systems watching prices and then sending an order; there is extra latency and, in rare outages, no trigger at all.

**Trigger mechanics.** In India, the trigger is based on last traded price. A single odd trade can trigger your stop even if the bid–ask quickly returns. Exchanges and brokers add **market protection** limits to market and SL-M orders (the order will not fill beyond a percentage band), and many brokers block SL-M and market orders in illiquid options for this reason (as of Nov 2026 — verify with your broker).

Large traders slice orders (child orders over time), use limit orders priced at the bid to earn rather than pay spread, and accept that some orders will not fill. The cost of a missed fill is real but invisible; it should be tracked in a journal the same way slippage is.` },
      { h: 'The maths', md: `Compare the expected cost of a stop-limit with a ₹2 buffer against a stop-market, using a simple scenario model.

You are long 300 shares at ₹1,400, stop trigger ₹1,386.
- **Normal day (most stops):** both fill near ₹1,386. Loss ≈ 14 × 300 = ₹4,200.
- **Fast move:** price drops from ₹1,388 to ₹1,378 in one second.
  - SL-M fills around ₹1,380. Loss = 20 × 300 = ₹6,000.
  - SL with limit ₹1,384 does **not** fill. You are still long at ₹1,378 and falling. If you panic-exit at ₹1,370, loss = 30 × 300 = ₹9,000.

:::formula
Stop slippage = |Fill price − Trigger price| × Quantity
:::

The stop-limit avoids small slippage but exposes you to rare large losses. Many traders choose a stop-limit with a buffer of a few ticks up to a small fraction of the ATR in liquid stocks, and monitor it.` },
      { h: 'India', md: `> [!india] At 09:15 IST after a gap, a market order in a stock can fill far from the previous close. In index options on expiry day, premiums can move 30–50% in minutes; a market buy order there can fill much higher than the screen showed. Also note the **freeze quantity**: orders above an exchange-set size per order in index derivatives are rejected and must be split (iceberg orders do this automatically).` },
      { h: 'US & global', md: `> [!us] US brokers offer stop, stop-limit, trailing stop, and time-in-force options such as GTC (good till cancelled). Stops are usually held by the broker and sent to market on trigger, often on the consolidated last sale. Extended-hours sessions usually accept limit orders only. The SEC's Investor.gov guide on order types is a good plain-language reference.` },
      { h: 'Common misconceptions', md: `- **"A stop-loss guarantees my loss amount."** Only a filled stop limits loss, and the fill may be worse than the trigger.
- **"Market orders are always bad."** In Nifty futures at 11:00 with one-tick spread, a market order costs almost nothing extra and guarantees exit.
- **"Limit orders cost nothing."** They can miss the trade entirely, which is a cost when you were right.
- **"Placing the stop in my head is the same thing."** A mental stop has no execution, only intention.` },
      { h: 'When it fails', md: `**Gap through a stop-limit.** Long 100 shares of a mid-cap at ₹820 overnight with an SL trigger ₹800 limit ₹798. Bad results are announced; the stock opens at ₹740. Your sell limit at ₹798 is far above the market and does not fill. You exit at ₹735 after hesitating. Planned loss ₹2,000; actual loss ₹8,500. (Intraday traders avoid this specific risk by not holding overnight, but news halts and circuit hits create the same effect intraday.)

**Market order in a thin option.** Bid ₹4.00, ask ₹6.50 on a stock option. A market buy for 2 lots fills at ₹6.50. Mid-price was ₹5.25, so you are instantly down about 19% on premium.` },
      { h: 'Exercise', md: `1. In the Simulator, place the same exit three ways (market, SL, SL-M) during a fast candle and record each fill.
2. In your Journal, write your personal rule: which order type you use for entry, stop and target, and why.
3. Use the calculator to see how your position size changes if you assume 0.1% slippage on every stop.

[[widget:position-size]]` },
    ],
    check: [
      { q: "You are long a liquid Nifty future and must exit before an RBI announcement in 30 seconds. Which order best fits?", o: ["Limit sell 20 points above market", "Market sell", "Stop-limit with trigger far below", "GTT for tomorrow"], a: 1, why: "When exit certainty matters and the instrument is very liquid, a market order is appropriate. A far limit may not fill, a distant stop doesn't exit now, and GTT is for later." },
      { q: "A stop-limit order's main risk compared with a stop-market order is that it…", o: ["costs more brokerage", "may not fill in a fast move, leaving you in a growing loss", "always fills at a worse price", "cannot be used intraday"], a: 1, why: "The limit protects price but sacrifices execution. Brokerage is the same; fills are at the limit or better, not always worse; and it is fine intraday." },
      { q: "Why do many Indian brokers block SL-M orders in illiquid options?", o: ["SEBI bans all stop orders", "A market order on trigger could fill far from fair value in a wide spread", "Options cannot fall", "Exchanges charge extra for them"], a: 1, why: "In wide-spread options, a triggered market order can fill disastrously. There is no blanket SEBI ban on stops, and options certainly can fall." },
    ],
    refs: ['SEC — Investor.gov: Types of orders (investor.gov)', 'NSE — Trading system (NEAT) and order types, equity segment FAQs (nseindia.com)', 'Larry Harris — Trading and Exchanges: Market Microstructure for Practitioners (book)', 'Zerodha Varsity — Introduction to stock markets: order types (zerodha.com/varsity)'],
  });

  L({
    id: 'l1-segments', module: 'L1-M1', track: 'found', title: 'Cash, intraday, futures, options: what you actually own', mins: 18,
    summary: 'State precisely what you own and owe in each segment, and how far the profit and loss of each can go.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `The same view, "Reliance will go up today", can be expressed in four very different ways:
- **Delivery (cash):** you buy the share and own it. If the company does well, you keep it as long as you like.
- **Intraday cash:** you buy the share with a promise to sell before the close. You own a price exposure for a few hours, partly funded by the broker.
- **Futures:** you sign a contract to buy (or sell) at a fixed price on a future date. You own an obligation, not a share.
- **Options:** you buy a *right* (not obligation) to buy or sell at a fixed price before expiry, paying a premium. Or you *sell* that right and take on the obligation.

These look similar on a chart, but what can go wrong, and how much, is completely different. Knowing what you own is the first defence against a loss you did not expect.` },
      { h: 'Intermediate view', md: `| Segment | You own | Max loss (long) | Leverage | Time limit | Key Indian charge |
|---|---|---|---|---|---|
| Delivery | Shares | Amount paid | None | None | STT 0.1% both sides |
| Intraday cash | Exposure till close | Can exceed margin | Up to about 5x (20% margin) | Same day | STT 0.025% on sell |
| Futures | Obligation | Unlimited in principle | Often 6–10x | Expiry | STT 0.05% on sell |
| Long option | Right | Premium paid | High, built-in | Expiry; time decay | STT 0.15% of premium on sell |
| Short option | Obligation | Unlimited (calls) / large (puts) | High | Expiry | STT 0.15% of premium on the opening sale; SPAN + exposure margin blocked |

STT figures as of Nov 2026 (Budget 2026, effective 1 Apr 2026) — verify on incometaxindia.gov.in or your broker's charges page.

### Example: one view, four trades (Reliance at ₹1,400)
- **Delivery:** buy 100 shares, pay ₹1,40,000.
- **Intraday:** buy 100 shares with about ₹28,000 margin; must square off by close.
- **Futures:** stock futures lots are sized so that one lot is worth several lakh; a 1% move changes P&L by about 1% of the whole contract value, though you posted perhaps a fifth or less as margin.
- **Call option:** buy one lot of a ₹1,400 call for a premium; if Reliance stays flat, the premium decays and you lose even though you were "not wrong".` },
      { h: 'Advanced view', md: `Professionals describe every position by **delta-adjusted exposure** and **path risk**, not by segment.

- A futures position's exposure equals its full notional value, regardless of margin. One Nifty lot at 25,000 with lot size 65 is ₹16.25 lakh of exposure.
- A long option's exposure changes as price moves (delta, gamma), and it loses value with time (theta). You need to be right about **direction, size and timing**.
- A short option has limited reward (the premium) and large tail risk. It wins often and loses big, which psychologically misleads beginners into thinking it is safe.

SEBI's studies of individual F&O traders have repeatedly found that a large majority lost money (see [[link:l1-why-risk]]). That is not a statement that derivatives are bad; they are essential for hedging and price discovery. It is a statement that leverage plus costs plus inexperience is a dangerous mix. This academy keeps you on cash and paper trading until Level 3 for that reason.` },
      { h: 'The maths', md: `:::formula
Futures P&L = (Exit − Entry) × Lot size × Lots
Long call P&L at expiry = max(0, S − K) × Lot − Premium × Lot
Exposure-to-margin leverage = Notional / Margin
:::

**Nifty future.** Buy 1 lot at 25,000, lot 65. Nifty closes the day at 24,800.
- P&L = (24,800 − 25,000) × 65 = −₹13,000.
- If the margin was about ₹1,80,000 (illustrative — check your broker's SPAN calculator), that is a 7.2% hit to margin from a 0.8% index move.

**Nifty call.** Buy 1 lot of the 25,000 call at ₹120. At expiry Nifty is 25,100.
- Intrinsic = 25,100 − 25,000 = 100. P&L = (100 − 120) × 65 = −₹1,300. Direction was right; the trade still lost because the move was smaller than the premium paid.` },
      { h: 'India', md: `> [!india] Index lot sizes for contracts from Jan 2026: Nifty 65, Bank Nifty 30, Fin Nifty 60, Midcap Select 120, Sensex 20 (as of Nov 2026 — verify on nseindia.com/bseindia.com). Nifty has weekly options expiring on Tuesday; Bank Nifty has monthly contracts only. Stock F&O is available only in stocks that meet eligibility criteria.

Intraday cash in India is often called MIS; positions are squared off automatically by the broker near the close. Futures and options can be intraday (MIS) or carried (NRML) with higher margin.

### Settlement at expiry: index versus stock derivatives
| Contract | Exercise style | Settlement at expiry |
|---|---|---|
| Index futures and options (Nifty, Bank Nifty, Sensex) | Options are European (exercised only at expiry) | Cash-settled against the final settlement price |
| Stock futures and options | Options are European | **Physically settled**: open positions turn into delivery of shares |

Physical settlement matters even to an intraday trader who "forgets" a position: an in-the-money stock option or a stock future held into expiry becomes an obligation to take or give delivery of the full lot, needing the full cash or shares, and brokers often square off such positions early or raise margin in expiry week. In-the-money long options exercised at expiry attract STT on the intrinsic (settlement) value at 0.15% from 1 Apr 2026 (as of Nov 2026 — verify on incometaxindia.gov.in and your broker's charges page). Check how your broker charges exercise and physical delivery before deciding whether to hold an option into expiry.` },
      { h: 'US & global', md: `> [!us] US intraday traders mostly trade stocks and ETFs (such as SPY or QQQ) in a margin account, plus listed options and CME futures (E-mini and Micro E-mini S&P 500). One equity option contract usually covers 100 shares. Micro futures exist precisely so small traders can size down; Indian index futures have no equivalent small contract.` },
      { h: 'Common misconceptions', md: `- **"Options are cheaper, so less risky."** A cheap option is cheap because it probably expires worthless.
- **"Futures margin is my risk."** Your risk is the notional; margin is only the deposit.
- **"Intraday means I can't lose more than my margin."** A gap or circuit move can produce a debit balance.
- **"Selling options is like collecting rent."** It is collecting a small, frequent premium in exchange for occasional large losses.` },
      { h: 'When it fails', md: `A beginner with a ₹5 lakh account buys 2 lots of Bank Nifty futures at 56,000, blocking about ₹4 lakh of margin (roughly 12% of notional; illustrative, check your broker's SPAN calculator), and thinks "I'm risking ₹4 lakh at most". Bank Nifty falls 1.5% (840 points) on a surprise policy comment. Loss = 840 × 30 × 2 = ₹50,400, about 12.6% of the margin and 10% of the whole account, in under an hour. The mistake was thinking in margin rather than notional: 2 lots = ₹33.6 lakh of exposure on a ₹5 lakh account, about 6.7x leverage. A 15% move against him, rare but possible around shocks, would wipe out the account entirely and could leave a debit.` },
      { h: 'Exercise', md: `1. Use the futures exposure calculator for 1 lot each of Nifty and Bank Nifty at current simulated prices. Write the notional and the rupee P&L of a 1% move.
2. In the options payoff widget, plot a long 25,000 call at ₹120 and mark the breakeven.
3. Journal: write in one line what you own in each segment.

[[widget:futures-exposure]]

[[widget:options-payoff]]` },
    ],
    check: [
      { q: "You buy 1 lot of Nifty futures (lot 65) at 25,000 and sell at 25,060. Gross P&L?", o: ["₹60", "₹3,900", "₹6,500", "₹39,000"], a: 1, why: "60 points × 65 = ₹3,900. ₹60 ignores the lot size; the others use the wrong multiplier." },
      { q: "You buy a Nifty 25,000 call at ₹120 and at expiry Nifty is 25,080. What happened?", o: ["Profit of ₹80 per unit", "Loss of ₹40 per unit, because intrinsic value 80 is below the 120 premium", "Breakeven", "Loss of the full premium"], a: 1, why: "Intrinsic = 80; 80 − 120 = −40 per unit. Breakeven needs 25,120. The full premium is lost only if Nifty is at or below 25,000." },
      { q: "Which statement about futures exposure is correct?", o: ["Exposure equals the margin posted", "Exposure equals full contract notional, regardless of margin", "Exposure is zero until expiry", "Exposure is capped at the premium"], a: 1, why: "Futures P&L moves with the full notional. Margin is a deposit; there is no premium in futures." },
    ],
    refs: ['John C. Hull — Options, Futures, and Other Derivatives (book)', 'NSE — Equity derivatives contract specifications (nseindia.com)', 'SEBI — Measures to strengthen equity index derivatives framework, circular 1 Oct 2024 (sebi.gov.in)', 'CME Group — Micro E-mini equity index futures (cmegroup.com)', 'Income Tax Department — Securities Transaction Tax rates (incometaxindia.gov.in)'],
  });

  L({
    id: 'l1-margin', module: 'L1-M1', track: 'risk', title: 'Margin and leverage — the double-edged sword', mins: 17,
    summary: 'Calculate leverage, the percentage move that wipes out your margin, and set a personal leverage ceiling before you trade.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Leverage lets you control a large position with a small deposit. Imagine buying a ₹50 lakh flat with ₹10 lakh down payment. If the flat rises 10%, you gain ₹5 lakh, a 50% return on your money. If it falls 10%, you lose ₹5 lakh, half your money. Leverage did not change the flat; it changed what the flat's movement does to *you*.

In trading the same thing happens in minutes. **Margin** is the deposit; **leverage** is how many times larger the position is than the deposit. The sword cuts both ways at exactly the same speed. Beginners feel the upside in their imagination and the downside in their account.` },
      { h: 'Intermediate view', md: `### How margin works in India
- **Cash intraday:** SEBI's peak-margin rules require brokers to collect upfront margin (VaR plus extreme-loss margin), and in practice brokers apply at least about 20% of trade value for intraday cash positions. That caps intraday leverage near 5x for liquid stocks, less for volatile ones (as of Nov 2026 — verify with your broker).
- **Futures and short options:** the clearing corporation sets **SPAN margin** (worst-case one-day loss scenarios) plus **exposure margin**. The total is typically a low double-digit percentage of notional for index futures, higher around events.
- **Long options:** you pay the full premium upfront; no further margin, but the leverage is built into the option.
- **Intraday F&O:** under peak-margin rules, an intraday (MIS) futures or short-option position needs essentially the full exchange margin (SPAN plus exposure), the same as a carried position; the old large intraday discounts on F&O margin have largely gone (verify with your broker).
- **Mark-to-market (MTM):** futures profits and losses are settled daily; if losses eat into margin, you must add funds or the broker closes positions.

### Effective leverage is what matters
Do not ask "how much margin is blocked?"; ask "what is my total notional divided by my *total account equity*?" A ₹5 lakh account holding one Nifty lot (₹16.25 lakh) is at 3.25x, even if ₹3 lakh sits unused.` },
      { h: 'Advanced view', md: `Professionals cap leverage **by volatility**, not by what the broker permits. A 3x position in Nifty (daily moves often under 1%) is less risky than 3x in a mid-cap that moves 4% on an ordinary day. They also think in **risk per trade** (see [[link:l1-position-sizing]]), which automatically limits leverage: if the stop is fixed in rupees, size cannot balloon.

Margin can change *during* a position. Clearing corporations raise margins in volatile periods and before events; SEBI's 2024 index-derivative measures added extra extreme-loss margin on short options on expiry day. A position that fitted your account yesterday can require more money today.

There is also a behavioural trap: available margin feels like available money. Prop desks and serious traders define a **maximum gross exposure** in rupees, written down, and treat the broker's limit as irrelevant.` },
      { h: 'The maths', md: `:::formula
Leverage = Notional exposure / Account equity
% move that wipes out equity = 100 / Leverage
Return on equity = Leverage × % price move
:::

**Example — intraday HDFC Bank-style stock at ₹1,000.** Account ₹2,00,000. You use 5x intraday leverage: buy ₹10,00,000 worth = 1,000 shares.
- A 1% drop (₹10) costs ₹10,000 = **5%** of your account.
- A 4% drop (bad news, ₹40) costs ₹40,000 = **20%** of your account.
- Wipe-out move = 100 / 5 = **20%**. Rare for a large bank in a day, but small-caps can do it.

**Example — Bank Nifty future.** Bank Nifty 56,000, lot 30, notional ₹16.8 lakh per lot. Account ₹4 lakh, 1 lot: leverage 4.2x. A 2% move (1,120 points) = ₹33,600, about 8.4% of the account.

Recovery is asymmetric: lose 20% and you need +25% to get back; lose 50% and you need +100%.` },
      { h: 'India', md: `> [!india] Brokers display "leverage available" prominently for intraday. That is a ceiling allowed by regulation and the broker's risk team, not a recommendation. Also check how your broker treats margin from pledged shares and whether a portion must be cash (exchanges require a cash component for derivatives margin).

[[widget:leverage]]` },
      { h: 'US & global', md: `> [!us] US Regulation T allows 2:1 overnight margin for stocks; intraday "day-trading buying power" under the old rules was up to 4x for pattern day traders. In April 2026 the SEC approved FINRA's proposal to eliminate the pattern-day-trader definition and $25,000 minimum, replacing it with risk-based intraday margin standards; how and when each broker implements it varies (as of Nov 2026 — verify on finra.org and with your broker).` },
      { h: 'Common misconceptions', md: `- **"Leverage increases my edge."** It multiplies returns and losses alike; an edge of zero leveraged 5x is still zero, but with 5x the variance and costs.
- **"I only use a small part of my margin."** What matters is total notional to equity.
- **"Margin calls only happen to big traders."** They happen to anyone with leveraged positions.
- **"The broker wouldn't allow it if it were too risky."** The broker's limit protects the broker.` },
      { h: 'When it fails', md: `A trader with ₹1,00,000 buys ₹5,00,000 of a small-cap at 5x intraday. Unexpected promoter-pledge news hits at 13:00; the stock falls 9% in ten minutes and the bid side thins. Stop slippage takes the exit to −11%. Loss: ₹55,000, i.e. 55% of the account, from one trade. To recover the trader now needs a +122% return on the remaining ₹45,000. Leverage turned a bad trade into a career-ending one.` },
      { h: 'Exercise', md: `1. Write your personal maximum effective leverage for Level 1 (we suggest no more than 1–2x in paper and live cash trading while learning).
2. Use the leverage calculator for your account size and three instruments. Note the wipe-out move for each.
3. Use the drawdown widget to see the gain needed to recover from 10%, 25% and 50% losses.

[[widget:drawdown]]` },
    ],
    check: [
      { q: "Account ₹3,00,000. You hold one Nifty futures lot at 25,000 (lot 65). Effective leverage?", o: ["About 1.2x", "About 5.4x", "65x", "Depends only on SPAN margin"], a: 1, why: "Notional = 25,000 × 65 = ₹16,25,000; divided by ₹3,00,000 ≈ 5.4x. Margin does not change exposure." },
      { q: "At 4x leverage, what price move against you wipes out the account?", o: ["4%", "25%", "40%", "100%"], a: 1, why: "100 / 4 = 25%. A 4% move costs 16% of equity, not all of it." },
      { q: "After a 40% drawdown, the gain needed to recover is about…", o: ["40%", "50%", "67%", "100%"], a: 2, why: "From 60 back to 100 is 40/60 ≈ 66.7%. Losses and gains are not symmetric." },
    ],
    refs: ['SEBI — Circulars on collection of upfront margins and peak margin (2020–2021) (sebi.gov.in)', 'NSE Clearing — Risk management: SPAN and exposure margins (nseclearing.in)', 'FINRA — Day trading and margin requirements (finra.org)', 'Ralph Vince — The Mathematics of Money Management (book)'],
  });

  Q([
    { id: 'L1-M1-q01', module: 'L1-M1', d: 1, q: "Which layer holds your shares in electronic form in India?", o: ["The exchange", "The depository (CDSL/NSDL)", "SEBI", "The clearing corporation permanently"], a: 1, why: "Depositories hold dematerialised securities. Exchanges match trades, SEBI regulates, and clearing corporations settle." },
    { id: 'L1-M1-q02', module: 'L1-M1', d: 2, q: "What is novation?", o: ["The exchange cancelling bad trades", "The clearing corporation becoming buyer to every seller and seller to every buyer", "Brokers netting client orders internally", "Moving from T+2 to T+1"], a: 1, why: "Novation replaces the bilateral trade with two trades against the clearing corporation, removing counterparty risk between participants." },
    { id: 'L1-M1-q03', module: 'L1-M1', d: 2, q: "Bid ₹249.00, ask ₹250.00. What is the spread as a percentage of mid (approx.)?", o: ["0.04%", "0.4%", "1%", "4%"], a: 1, why: "Mid = 249.50; 1.00 / 249.50 ≈ 0.40%." },
    { id: 'L1-M1-q04', module: 'L1-M1', d: 2, q: "Ask side shows 400 @ ₹100.10, 600 @ ₹100.20, 1,000 @ ₹100.30. You market-buy 1,000. Average fill?", o: ["₹100.10", "₹100.16", "₹100.20", "₹100.30"], a: 1, why: "(400×100.10 + 600×100.20)/1,000 = (40,040 + 60,120)/1,000 = ₹100.16." },
    { id: 'L1-M1-q05', module: 'L1-M1', d: 2, q: "Which order guarantees price but not execution?", o: ["Market", "Limit", "SL-M", "IOC market"], a: 1, why: "A limit fills only at your price or better, so it may not fill at all. Market and SL-M guarantee execution, not price." },
    { id: 'L1-M1-q14', module: 'L1-M1', d: 3, q: "You are long 400 shares at ₹600 with an SL trigger ₹590, limit ₹589. Price drops from ₹592 straight to ₹584 and keeps falling. What is most likely?", o: ["Filled at ₹590", "Filled at ₹589", "Not filled; you are still long below your limit", "Filled at ₹584 automatically"], a: 2, why: "Once triggered, a sell limit at ₹589 cannot fill when the market is below ₹589. Only a stop-market would chase the price down." },
    { id: 'L1-M1-q06', module: 'L1-M1', d: 2, q: "You buy one Bank Nifty future (lot 30) at 56,000. Notional exposure?", o: ["₹56,000", "₹1,68,000", "₹16,80,000", "₹1,68,00,000"], a: 2, why: "56,000 × 30 = ₹16,80,000." },
    { id: 'L1-M1-q07', module: 'L1-M1', d: 3, q: "Account ₹2,00,000. You buy ₹8,00,000 of a stock intraday. The stock drops 3%. Loss as % of account?", o: ["3%", "6%", "12%", "24%"], a: 2, why: "Leverage 4x; 4 × 3% = 12%. In rupees: 3% of ₹8 lakh = ₹24,000, which is 12% of ₹2 lakh." },
    { id: 'L1-M1-q08', module: 'L1-M1', d: 2, q: "Which statement about a long call option is true?", o: ["Maximum loss is unlimited", "You can lose even if price moves in your direction, if the move is smaller than the premium or comes too late", "It has no time limit", "It requires SPAN margin like a short future"], a: 1, why: "A long option needs direction, magnitude and timing. Max loss is the premium; it expires; buyers pay premium, not SPAN." },
    { id: 'L1-M1-q09', module: 'L1-M1', d: 1, q: "Equity settlement cycle in India for delivery trades (as of 2026)?", o: ["T+0 for everything", "T+1", "T+2", "T+3"], a: 1, why: "India completed the move to T+1 in Jan 2023; an optional T+0 exists only for a limited set of stocks." },
    { id: 'L1-M1-q10', module: 'L1-M1', d: 3, q: "You short 300 shares of a small-cap at ₹200 intraday. It hits the upper circuit at ₹220 with no sellers and stays locked. What is the main risk?", o: ["Your broker refunds the trade", "Short delivery, leading to an exchange auction and possibly a price well above ₹220 plus penalty", "The trade is automatically cancelled", "Nothing, intraday positions cannot carry over"], a: 1, why: "If you cannot buy back, you fail to deliver shares and the exchange auction settles your obligation, often at a punitive price." },
    { id: 'L1-M1-q11', module: 'L1-M1', d: 2, q: "Why do spreads typically widen at 09:15–09:30 IST?", o: ["Exchanges charge more then", "Price discovery after overnight news is incomplete and liquidity providers quote cautiously", "SEBI requires it", "Brokers are offline"], a: 1, why: "Uncertainty is highest after the open, so quotes are wider. It is a market behaviour, not a fee or rule." },
    { id: 'L1-M1-q12', module: 'L1-M1', d: 3, q: "Two traders each have ₹5 lakh. A holds 1 Nifty lot (₹16.25 lakh). B holds ₹16.25 lakh of a mid-cap that moves three times as much as Nifty daily. Which is true?", o: ["Same risk, same notional", "B carries roughly three times the volatility risk despite equal leverage", "A has more risk because futures are derivatives", "Neither has risk with a stop"], a: 1, why: "Equal leverage does not mean equal risk; volatility of the underlying matters. Stops limit but do not remove risk." },
    { id: 'L1-M1-q13', module: 'L1-M1', d: 1, q: "Margin in derivatives is best described as…", o: ["A fee paid to the exchange", "A deposit held against possible losses", "The maximum you can lose", "Brokerage"], a: 1, why: "Margin is collateral; it is returned minus losses. It is not a fee and not a cap on loss." },
  ]);

  /* ======================= L1-M2 Indian market essentials ======================= */

  L({
    id: 'l1-nse-sessions', module: 'L1-M2', track: 'india', title: 'NSE/BSE sessions, pre-open and closing auctions', mins: 15,
    summary: 'Know what each part of the Indian trading day does to price and liquidity, and plan your first and last trades around it.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `The Indian market day is not one smooth block of time. It has phases, and each phase behaves differently, like a cricket match with a powerplay, middle overs and death overs.

| Time (IST) | Phase | What happens |
|---|---|---|
| 09:00–09:08 | Pre-open order entry | Orders collected, nothing traded |
| 09:08–09:12 (approx.) | Price discovery and matching | One equilibrium opening price is calculated |
| 09:12–09:15 | Buffer | Transition to continuous trading |
| 09:15–15:30 | Normal market | Continuous matching |
| 15:40–16:00 | Closing session | Trades only at the official closing price |

Session times as of Nov 2026 — verify on nseindia.com.

Why it matters: the first 15–30 minutes after 09:15 usually carry the widest spreads and the fastest moves of the day, and the official **closing price** is not simply the last trade at 15:29:59.` },
      { h: 'Intermediate view', md: `### The pre-open call auction
Since 7 Sep 2026, buyers and sellers can enter, modify and cancel limit and market orders from 09:00 to 09:05, then limit orders only until order entry closes at a random moment between 09:08 and 09:10, so nobody can game the last second. Matching runs 09:10–09:12, followed by a buffer to 09:15. (Before Sep 2026 order entry ended around 09:08. As of Nov 2026, verify on NSE.) The exchange then finds the single price at which the largest quantity can trade (the **equilibrium price**), matches all eligible orders at that price, and this becomes the opening price. The indicative equilibrium price is visible on NSE's pre-open page while orders come in.

Why an auction? Overnight news creates uncertainty. Rather than letting the first few random orders set a wild opening print, an auction pools orders and finds a fairer price.

### Normal market
Continuous price–time priority matching. Liquidity tends to be highest in the first hour and the last hour, with a lull around lunch. The European open (London 08:00 local, which is 12:30 IST in British summer time and 13:30 IST in winter) and European data releases can add volatility in the afternoon. Most US economic data (08:30 ET) arrives at about 18:00–19:00 IST, after the NSE close, so its effect shows up in the next morning's gap.

### Closing price
Since 3 Aug 2026, NSE runs a **Closing Auction Session (CAS)** for stocks that have F&O contracts: continuous trading in those stocks stops at 15:15, orders are collected (order entry 15:20–15:30, closing at a random moment between 15:28 and 15:30), and the auction matches at a single price by 15:35. That auction price is the official close. For other stocks the close is still a **volume-weighted average of trades in the last 30 minutes** of the session, not the final tick. Both methods make the close harder to manipulate than a last-trade rule. The post-close session, now **15:50–16:00**, lets you buy or sell at the official closing price. Equity F&O trading ends at 15:40. (Source: SEBI circular on CAS, Jan 2026; NSE circulars. As of Nov 2026, verify on NSE.)` },
      { h: 'Advanced view', md: `- **Opening gaps** are set in the auction. If the auction prints 1% above yesterday's close, the gap already reflects overnight information; chasing it in the first minute means paying the widest spreads of the day.
- **Index derivatives** have their own pre-open for futures (introduced in late 2023, verify scope), so Nifty futures open with a discovered price rather than a scramble.
- **Expiry days** (Nifty weekly on Tuesday as of Nov 2026) see heavy options activity late in the session; hedging flows from option writers can push the index around the close.
- **Auto square-off** by brokers around 15:15–15:25 creates a burst of market orders in intraday-heavy stocks. Some traders avoid the last 15 minutes for this reason; others study it.
- **Block deal windows** (a morning and an afternoon window) allow large negotiated trades within a price band of the prevailing price; they appear in exchange block-deal reports.

Professionals tag every trade with its **time bucket** in their journal. Very often a strategy works in one bucket and not in another.` },
      { h: 'The maths', md: `### How an equilibrium price is chosen (simplified)
| Price ₹ | Cumulative buy qty (at or above) | Cumulative sell qty (at or below) | Tradable |
|---|---|---|---|
| 1,404 | 2,000 | 9,000 | 2,000 |
| 1,402 | 5,000 | 7,000 | 5,000 |
| 1,400 | 6,500 | 6,000 | **6,000** |
| 1,398 | 8,000 | 4,000 | 4,000 |

:::formula
Tradable quantity at price P = min(cumulative buys ≥ P, cumulative sells ≤ P)
Opening price = the P with the largest tradable quantity
:::
If two prices tie on tradable quantity, exchange rules break the tie (broadly, the price leaving the smaller unmatched quantity, then the price closer to the previous close). If too few orders match, the opening price is set from the first trades of the normal market instead.
Here the opening price is ₹1,400, with 6,000 shares matched; 500 buy shares remain unfilled and carry into the normal market.` },
      { h: 'India', md: `> [!india] Practical rules for a beginner: (1) Do not place market orders in the pre-open; use limits. (2) Consider waiting until 09:20–09:30 before your first trade so the opening range and spread settle. (3) Know your broker's auto square-off time and be flat 10 minutes before it. (4) Market holidays and special sessions (for example the Diwali Muhurat trading session) are published by NSE each year.

BSE runs the same structure for Sensex stocks; prices are linked by arbitrage, so they rarely differ by more than a tick or two in liquid names.

[[chart:NIFTY:15:vwap,vol]]` },
      { h: 'US & global', md: `> [!us] NYSE and Nasdaq also open and close with auctions (opening and closing cross). Regular session 09:30–16:00 ET, with pre-market and after-hours sessions that are thinner and more volatile. Tokyo extended its close to 15:30 JST in Nov 2024. Session overlaps are covered in [[link:l2-overnight]].` },
      { h: 'Common misconceptions', md: `- **"The 09:15 candle is the open price set by the first trader."** It is set by the pre-open auction.
- **"The closing price is the last trade."** On NSE it is the Closing Auction price for F&O stocks (from Aug 2026) and a last-30-minute VWAP for other stocks.
- **"More volatility at the open means more profit."** It means more opportunity and more cost; spreads and slippage are highest then.
- **"I can trade in the closing session at any price."** Only at the closing price.` },
      { h: 'When it fails', md: `A beginner sees Reliance indicated 1.5% higher in the pre-open and places a market buy at 09:07 for 200 shares. The auction prints at ₹1,421; within the first five minutes, sellers who were waiting for strength push it to ₹1,408. Loss ₹2,600 before any plan was made. The failure: entering in the most uncertain minutes with no level, no stop and a market order. The auction is fair, but fairness does not mean the price will continue.` },
      { h: 'Exercise', md: `1. In the Simulator's session clock, step through a synthetic day and mark each phase.
2. For five days, record in your Journal the Nifty opening gap (open minus previous close) and whether the first 15-minute candle continued or reversed it. Do not trade it; just observe.
3. Compute the equilibrium price for a pre-open book you invent with five price levels.` },
    ],
    check: [
      { q: "Why does NSE run a pre-open call auction instead of starting continuous trading at 09:00?", o: ["To give brokers time to log in", "To pool overnight orders and discover a single fair opening price", "To allow only institutions to trade", "To collect STT"], a: 1, why: "The auction concentrates liquidity and reduces random opening prints after overnight news. It is open to all participants and has nothing to do with tax." },
      { q: "You want to sell your holding at exactly the official NSE closing price. When can you do this?", o: ["09:00–09:10", "15:29 with a market order", "In the post-close session 15:50–16:00", "Never"], a: 2, why: "The post-close session (15:50–16:00 since Aug 2026) trades at the official closing price. A 15:29 market order trades at the then-prevailing price (and for F&O stocks continuous trading has already stopped at 15:15 for the closing auction). Pre-open trades set the opening price, not the close." },
    ],
    refs: ['NSE — Trading hours and pre-open session (nseindia.com)', 'NSE — Closing price computation FAQ (nseindia.com)', 'BSE — Trading hours and call auction (bseindia.com)', 'Larry Harris — Trading and Exchanges: Market Microstructure for Practitioners (book)'],
  });

  L({
    id: 'l1-sebi', module: 'L1-M2', track: 'india', title: 'SEBI rules every intraday trader must know', mins: 17,
    summary: 'Recognise the SEBI rules that directly change your margin, your F&O costs, the advice you can trust and how your money is held.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `SEBI (the Securities and Exchange Board of India) is the referee of Indian markets. It does not tell you what to buy. It makes rules about how much leverage you can take, how your broker must hold your money, who is allowed to give you advice and how derivatives are designed.

Many beginners only meet SEBI rules when an order is rejected or margin suddenly rises. You will make better decisions if you know the main rules in advance, and especially *why* they were made: almost every rule below responds to a pattern of retail traders being hurt.

> [!warn] Rules change. Everything in this lesson is as of Nov 2026 and must be verified on sebi.gov.in and your broker's notices before you rely on it.` },
      { h: 'Intermediate view', md: `### 1. Upfront and peak margin (2020–2021)
Brokers must collect margin **before** the trade, and the clearing corporation checks each client's margin at several random snapshots during the day; the highest requirement seen (the "peak") must have been covered. Result: intraday cash leverage is effectively capped at about 5x for most stocks, lower for volatile ones. The old "20x intraday leverage" offers are gone.

If a snapshot shows a shortfall, the clearing corporation levies a **short-margin penalty** (a percentage of the shortfall, higher for repeat cases) on the broker, which brokers normally pass on to the client. The penalty slabs and how brokers treat same-day credits (such as proceeds from selling delivery holdings) change from time to time (as of Nov 2026 — verify on nseclearing.in and with your broker).

### 2. Client money protection
Brokers must report client balances to exchanges, cannot use one client's money for another, and must settle running accounts (return unused funds) periodically. Securities given as margin are **pledged** in your demat account rather than transferred to the broker.

### 3. Equity index derivatives measures (circular 1 Oct 2024, phased from Nov 2024)
- Minimum contract value raised (lots resized so each contract is worth roughly ₹15 lakh or more at introduction).
- One weekly-expiry index per exchange (hence Nifty weekly on NSE, Sensex weekly on BSE; Bank Nifty weekly discontinued).
- Upfront collection of option premium from buyers.
- Extra extreme-loss margin on short options on expiry day.
- Removal of calendar-spread margin benefit on expiry day.
- Intraday monitoring of position limits.

### 4. Advice and finfluencers
Only SEBI-registered **Investment Advisers (RIA)** and **Research Analysts (RA)** may give paid advice or recommendations. SEBI's 2024 rules restrict regulated entities from associating with unregistered people who give advice or claim returns. A Telegram "tips" channel that is not registered is outside the system.

### 5. Retail algo trading framework
SEBI's 2025 framework brings retail API/algo trading under broker responsibility, with registration of algos above a threshold order rate and exchange-tagged strategies (implementation phased — verify the current status).` },
      { h: 'Advanced view', md: `Read rules as **information about risk**. SEBI publishes studies of individual traders' outcomes in F&O; its January 2023 study (FY2022) found roughly nine in ten individual F&O traders lost money, and a September 2024 study covering FY2022–FY2024 found a similar, slightly worse proportion. The 2024 measures were explicitly aimed at reducing speculative retail activity in index options around expiry.

Rules also change the **microstructure** you trade. Fewer weekly expiries concentrate activity on the remaining expiry days; larger lot sizes raise the minimum risk per trade (one Nifty lot is now about ₹16 lakh notional at 25,000); upfront premium collection removes the ability to buy options on margin.

Professionals keep a short "regulatory changes" note in their trading plan and review it monthly. When a rule changes contract size or margin, any backtest using old lot sizes or charges must be re-run.` },
      { h: 'The maths', md: `**Effect of lot-size increase on minimum risk.** A trader whose rule is "risk 1% of capital per trade" with a 40-point stop on Nifty:
- Old lot 25 (before the Nov 2024 resizing): risk per lot = 40 × 25 = ₹1,000, needs ₹1,00,000 capital.
- Current lot 65: risk per lot = 40 × 65 = ₹2,600, needs ₹2,60,000 capital.

:::formula
Minimum capital = (Stop distance × Lot size) / Risk fraction
:::
With a 1% rule and ₹2,00,000 capital, you **cannot** take even one Nifty futures lot with a 40-point stop without breaking your rule. That is not a reason to break the rule; it is a reason to trade cash or wait.` },
      { h: 'India', md: `> [!india] Practical checklist: verify your broker on SEBI's intermediary search; verify any adviser's SEBI registration number; never share OTP or login with "account handlers"; download your CDSL/NSDL consolidated account statement monthly; read your broker's notices on margin changes. Complaints go first to the broker, then to SEBI SCORES and the online dispute resolution (ODR) platform.` },
      { h: 'US & global', md: `> [!us] The US equivalents are the SEC (regulator) and FINRA (self-regulatory organisation for brokers). In April 2026 the SEC approved FINRA's proposal to eliminate the pattern-day-trader definition and the $25,000 minimum, replacing it with risk-based intraday margin standards; broker implementation timing varies (verify on finra.org). This is covered in [[link:l2-us-rules]].` },
      { h: 'Common misconceptions', md: `- **"SEBI rules are meant to stop small traders."** They are designed to limit leverage and mis-selling that historically hurt small traders most.
- **"A tips channel with lakhs of followers must be legitimate."** Popularity is not registration.
- **"Rules don't affect my strategy."** Lot size, margin and expiry rules directly change position size and costs.
- **"My broker lets me, so it's allowed."** Brokers can err; compliance failures land on you as rejected orders or penalties.` },
      { h: 'When it fails', md: `A trader backtested a weekly Bank Nifty options strategy on 2022–2024 data. It relied on weekly expiries and lot sizes that no longer exist. Going live in 2026 with the old plan, he finds no weekly Bank Nifty contracts and much larger lots; he switches to Nifty weeklies without re-testing. The behaviour of a different index, a different expiry day and different charges made the old results irrelevant. The failure was not a SEBI rule; it was ignoring how rules change the game.` },
      { h: 'Exercise', md: `1. Look up your broker and one adviser you follow on SEBI's intermediary search; note registration numbers in your Journal.
2. Use the position-size calculator: with your paper capital and a 1% risk rule, find the largest Nifty stop distance that allows one lot.
3. Write three rule changes from this lesson and how each would change your plan.

[[widget:position-size]]` },
    ],
    check: [
      { q: "Why did SEBI's peak-margin rules reduce intraday leverage?", o: ["Brokers stopped offering intraday", "Margin is checked at random snapshots intraday, so brokers must collect it upfront", "STT was raised", "Exchanges banned short selling"], a: 1, why: "Random intraday snapshots mean the full margin must be present throughout the day, removing the old end-of-day loophole. Tax and short-selling rules are unrelated." },
      { q: "With ₹2,00,000 capital, a 1% risk rule and a 40-point Nifty stop (lot 65), can you take one futures lot?", o: ["Yes, risk is ₹2,000", "No, risk per lot is ₹2,600, above the ₹2,000 limit", "Yes, margin covers it", "Only on expiry day"], a: 1, why: "40 × 65 = ₹2,600 > 1% of ₹2 lakh. Margin availability is irrelevant to the risk rule." },
    ],
    refs: ['SEBI — Measures to strengthen equity index derivatives framework for increased investor protection, circular 1 Oct 2024 (sebi.gov.in)', 'SEBI — Study on analysis of profit and loss of individual traders dealing in equity F&O, Jan 2023 and Sep 2024 (sebi.gov.in)', 'SEBI — Circulars on upfront collection of margins and peak margin (sebi.gov.in)', 'SEBI — Safer participation of retail investors in algorithmic trading, circular Feb 2025 (sebi.gov.in)', 'FINRA — Day trading rules (finra.org)'],
  });

  L({
    id: 'l1-indices', module: 'L1-M2', track: 'india', title: 'Nifty, Bank Nifty and sectoral indices', mins: 16,
    summary: 'Explain how Nifty and Bank Nifty are built, why a few heavyweights move them, and use sector indices to read the market before trading a stock.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `An index is a scoreboard for a group of stocks. **Nifty 50** tracks fifty large companies listed on NSE; **Sensex** tracks thirty on BSE; **Nifty Bank** (Bank Nifty) tracks large banking stocks. When people say "the market fell 1%" they usually mean Nifty.

Indices matter to an intraday trader in three ways:
1. They tell you the market's mood, so you are not buying a stock while everything around it is being sold.
2. Their futures and options are the most liquid instruments in India.
3. A few big stocks have a large weight, so their news moves the whole index.` },
      { h: 'Intermediate view', md: `### Free-float market-cap weighting
Nifty is weighted by **free-float market capitalisation**: the value of shares actually available to trade (excluding promoter holdings and other locked-in shares). A company with ₹10 lakh crore free-float value has ten times the influence of one with ₹1 lakh crore.

Consequences:
- The top ten Nifty stocks typically make up more than half of the index weight (verify the current factsheet on niftyindices.com).
- Banks and financials are the largest sector group in Nifty, so Bank Nifty and Nifty are closely linked.
- A 3% move in the largest bank can move Nifty more than a 5% move in several smaller constituents combined.

### Bank Nifty
Bank Nifty contains a small set of the most liquid large banks and is dominated by two or three private-sector giants. SEBI's 2025 norms for non-benchmark derivative indices set a minimum number of constituents and caps on the top weights, phased in by NSE (verify current constituents and caps). Bank Nifty is typically more volatile than Nifty because it is concentrated in one sector.

### Sectoral and thematic indices
Nifty IT, Nifty Pharma, Nifty Auto, Nifty FMCG, Nifty Metal, Nifty PSU Bank, Nifty Financial Services (Fin Nifty), Nifty Midcap and Smallcap indices. **India VIX** measures the market's expected 30-day volatility from Nifty option prices.` },
      { h: 'Advanced view', md: `### Contribution analysis
Professionals look at **points contribution**: how many index points each stock added or subtracted today. If Nifty is up 100 points and 70 come from three stocks, the move is narrow; the median stock may be flat. Narrow rallies are more fragile than broad ones (see [[link:l1-flows]] on breadth).

### Relative strength
Before trading a stock long, compare it with its sector and with Nifty. A bank stock up 1% while Bank Nifty is up 2% is *weak* relative to peers, even though it is green.

### Index rebalancing
NSE reviews indices semi-annually. Additions and deletions, and changes in weight, cause passive funds to trade on the effective date, often near the close. These are announced in advance and are visible on niftyindices.com.

### Derivatives link
Nifty futures trade at a premium or discount to spot (the **basis**), and index arbitrage keeps them close. Heavy option open interest at certain strikes can influence intraday behaviour near expiry, but this is debated and covered with evidence labels in Level 3–4.` },
      { h: 'The maths', md: `:::formula
Index level = (Current free-float market cap of constituents / Base market cap) × Base value
Stock's points contribution ≈ Index level × Weight × Stock % change
:::

**Worked example.** Nifty at 25,000. A large bank has a 13% weight and rises 2%. Contribution ≈ 25,000 × 0.13 × 0.02 = **65 points**. An IT stock with 4% weight falls 1.5%: 25,000 × 0.04 × (−0.015) = **−15 points**. Net from these two: +50 points.

If Nifty is up 60 points, almost the whole move came from one bank. You now know the index rally depends on one stock's news.

(Weights here are illustrative; use the current factsheet.)` },
      { h: 'India', md: `> [!india] Morning routine idea: check GIFT Nifty, then at 09:15 look at Nifty, Bank Nifty and India VIX, then the sector heatmap. Trade stocks in sectors moving with the index direction while you are learning; fighting both the sector and the index is a low-probability starting point.

[[chart:BANKNIFTY:21:ema20,vwap,vol]]` },
      { h: 'US & global', md: `> [!us] The S&P 500 is also free-float cap-weighted and very concentrated in a handful of mega-cap technology stocks; the Nasdaq-100 even more so. The Dow Jones Industrial Average is price-weighted, an older method where a high share price gives more weight. The VIX plays the role India VIX plays here.` },
      { h: 'Common misconceptions', md: `- **"Nifty up means most stocks are up."** Weighting can hide weak breadth.
- **"Bank Nifty is just Nifty with more volatility."** It is a concentrated sector bet.
- **"India VIX predicts direction."** It measures expected volatility, not direction.
- **"Index constituents never change."** They are reviewed twice a year.` },
      { h: 'When it fails', md: `You buy a mid-sized private bank stock at ₹780 at 10:00 because Bank Nifty is up 1.2%. You did not check contribution: nearly all of Bank Nifty's gain is from one heavyweight that posted strong results. Your stock is actually flat-to-weak. When the heavyweight's rally fades at 11:30, Bank Nifty drops and your stock falls to ₹768. Stop hit, loss ₹12 per share. The index signal was real but did not apply to your stock.` },
      { h: 'Exercise', md: `1. In the Chart Lab, overlay a synthetic Nifty and Bank Nifty day and compare their ranges.
2. Using the latest Nifty factsheet, list the top five weights and compute the points contribution of a 1% move in each.
3. For one week, journal each day whether Nifty's move was broad or narrow (top three contributors' share of the move).` },
    ],
    check: [
      { q: "Nifty at 24,000. A stock with 10% weight rises 3%. Approximate points contribution?", o: ["3", "24", "72", "240"], a: 2, why: "24,000 × 0.10 × 0.03 = 72 points." },
      { q: "Bank Nifty is up 1.5% but your bank stock is up 0.2%. What does this tell you?", o: ["Your stock is strong", "Your stock is weak relative to its sector", "Bank Nifty will fall", "Nothing"], a: 1, why: "Relative to its sector, it is lagging. That says nothing directly about Bank Nifty's future." },
    ],
    refs: ['NSE Indices — Nifty 50 and Nifty Bank index methodology and factsheets (niftyindices.com)', 'BSE / Asia Index — BSE Sensex methodology (asiaindex.co.in)', 'SEBI — Circular on eligibility criteria for non-benchmark indices for derivatives (2025) (sebi.gov.in)', 'NSE — India VIX methodology (nseindia.com)', 'S&P Dow Jones Indices — S&P U.S. Indices methodology (spglobal.com)'],
  });

  L({
    id: 'l1-india-costs', module: 'L1-M2', track: 'india', title: 'The true cost of a trade in India', mins: 18,
    summary: 'Compute every charge on an Indian intraday equity, futures and options trade and turn the total into breakeven points.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `"Zero brokerage" does not mean zero cost. Every Indian trade pays a stack of charges: securities transaction tax (STT), exchange transaction charges, a SEBI fee, stamp duty, GST, and brokerage. On top of that come spread and slippage, which never appear on the contract note.

For an investor holding for years, these are small. For an intraday trader making many trades a day, they are the **rent you pay to play**. If your average profit per trade is smaller than your average cost, you lose money even with a good win rate. That is why you learn to compute cost before strategy.` },
      { h: 'Intermediate view', md: `### The charge stack (rates as of Nov 2026 — verify on your broker's charges page and nseindia.com)
| Charge | Equity intraday | Equity delivery | Futures | Options |
|---|---|---|---|---|
| STT | 0.025% on sell | 0.1% buy and sell | 0.05% on sell | 0.15% of premium on sell |
| NSE transaction charge | ₹307 per crore | ₹307 per crore | ₹183 per crore | ₹3,553 per crore of premium |
| SEBI fee | ₹10 per crore | ₹10 per crore | ₹10 per crore | ₹10 per crore |
| Stamp duty (buy side) | 0.003% | 0.015% | 0.002% | 0.003% |
| GST | 18% on brokerage + exchange + SEBI fees | same | same | same |
| Brokerage | Typically ₹20 or 0.03% per order, whichever lower, at discount brokers | Often ₹0 at discount brokers | Typically ₹20 per order | Typically ₹20 per order |

STT from 1 Apr 2026 (Budget 2026); NSE charges from 1 Mar 2026 (including IPFT). Delivery sells also attract a depository (DP) charge per scrip. In-the-money options **exercised** at expiry pay STT of 0.15% on the settlement (intrinsic) value, not on premium, so holding a deep in-the-money option to expiry can cost much more STT than selling it before expiry. BSE's transaction charges differ from NSE's.

### Hidden costs
- **Spread**: half the spread on entry and half on exit if you trade at market.
- **Slippage**: stops and market orders filled worse than planned.
- **Tax**: intraday equity profit is treated as speculative business income; F&O as non-speculative business income (consult a tax professional).` },
      { h: 'The maths', md: `### Example 1 — intraday equity (Reliance-style, ₹20/order)
Buy 100 at ₹1,400, sell 100 at ₹1,410. Turnover = ₹1,40,000 + ₹1,41,000 = ₹2,81,000.
| Item | Calculation | ₹ |
|---|---|---|
| Brokerage | 2 × ₹20 | 40.00 |
| STT | 0.025% × 1,41,000 | 35.25 |
| Transaction | 2,81,000 × 307 / 1,00,00,000 | 8.63 |
| SEBI fee | 2,81,000 × 10 / 1,00,00,000 | 0.28 |
| GST | 18% × (40 + 8.63 + 0.28) | 8.80 |
| Stamp duty | 0.003% × 1,40,000 | 4.20 |
| **Total** | | **≈ 97.16** |
Gross ₹1,000 → net ≈ ₹903. Breakeven ≈ ₹0.97 per share, about 0.07% of price.

### Example 2 — 1 lot Nifty futures
Buy at 25,000, sell at 25,050, lot 65. Buy value ₹16,25,000; sell ₹16,28,250. Gross ₹3,250.
STT 0.05% × 16,28,250 = 814.13; transaction ≈ 59.53; SEBI ≈ 3.25; GST ≈ 18.50; stamp 0.002% × 16,25,000 = 32.50; brokerage 40. **Total ≈ ₹968**, about 30% of the gross profit. Breakeven ≈ 968 / 65 ≈ **15 Nifty points**.

### Example 3 — 1 lot Nifty option
Buy at ₹120, sell at ₹130, lot 65. Premium turnover = 7,800 + 8,450 = ₹16,250. Gross ₹650.
STT 0.15% × 8,450 = 12.68; transaction ≈ 5.77; SEBI ≈ 0.02; GST ≈ 8.24; stamp ≈ 0.23; brokerage 40. **Total ≈ ₹67**. Here flat brokerage is the biggest single item.

:::formula
Breakeven move (per unit) = Total round-trip charges / Quantity
:::` },
      { h: 'Advanced view', md: `- **Cost as a fraction of expected move.** Compare charges with your typical target. Example 2's ₹968 is 30% of a 50-point target, but only 10% of a 150-point target. Small-target scalping in futures is very hard after the 2026 STT increase.
- **Spread dominates in options.** A one-tick spread of ₹0.05 on a ₹120 premium is tiny (about 0.04% round trip), but a ₹1 spread on the same premium costs about 0.8% of premium per round trip, and on a ₹10 far-strike premium a ₹1 spread costs 10%.
- **Frequency.** Ten round trips a day at ₹97 each = ₹970/day ≈ ₹2.1 lakh over 220 trading days on a modest account. That number belongs at the top of your trading plan.
- **Charges are dated data.** This app stores rates with an as-of date; when STT or exchange fees change, re-run old backtests.` },
      { h: 'India', md: `> [!india] Check your contract note against your own calculation for the first ten trades. Differences usually come from per-order brokerage caps, DP charges, or call-and-trade fees. Use the calculator below with your broker's actual brokerage.

[[widget:charges-india]]` },
      { h: 'US & global', md: `> [!us] US costs are structured differently: many brokers charge zero commission on stocks; regulatory fees (SEC Section 31 fee on sales, FINRA trading activity fee) are tiny; options carry per-contract fees. There is no STT, but spreads and payment-for-order-flow execution quality matter. See the US calculator.

[[widget:charges-us]]` },
      { h: 'Common misconceptions', md: `- **"Zero brokerage means free trading."** STT, exchange fees, GST, stamp and spread remain.
- **"STT is negligible."** On futures after Apr 2026 it is the largest charge in Example 2.
- **"Options are cheap to trade."** Charges are small in rupees, but flat brokerage on small premiums and wide spreads can be large in percentage.
- **"I'll worry about costs once I'm profitable."** Costs decide whether you become profitable.` },
      { h: 'When it fails', md: `A trader's 1-minute Nifty futures strategy wins 60% of trades, averaging +20 points on winners and −20 on losers. Gross expectancy = 0.6 × 20 − 0.4 × 20 = +4 points per trade = ₹260 per lot. Charges ≈ ₹968 per round trip. Net expectancy ≈ **−₹708 per trade**. The strategy "works" on the chart and loses steadily in the account.` },
      { h: 'Exercise', md: `1. Enter Examples 1–3 into the charges calculator and confirm the totals.
2. Compute breakeven in points for 1 lot of Bank Nifty futures (lot 30) at 56,000 with a 100-point target. (Check: charges ≈ ₹999, so breakeven ≈ 33 points, and charges take about a third of the ₹3,000 gross.)
3. In your Journal, add a "charges" column to every paper trade from today.` },
    ],
    check: [
      { q: "On a 1-lot Nifty futures intraday trade, which charge is largest at 2026 rates?", o: ["Stamp duty", "SEBI fee", "STT on the sell side", "GST"], a: 2, why: "0.05% of about ₹16 lakh ≈ ₹814 dominates; the others are tens of rupees or less." },
      { q: "Charges on your trade total ₹130 for 200 shares. Breakeven move per share?", o: ["₹0.26", "₹0.65", "₹1.30", "₹6.50"], a: 1, why: "130 / 200 = ₹0.65 per share before any profit." },
    ],
    refs: ['NSE — Transaction charges circular, effective 1 Mar 2026 (nseindia.com)', 'Income Tax Department — Securities Transaction Tax rates; Finance Act 2026 (incometaxindia.gov.in)', 'SEBI — Fees and charges for stock brokers (sebi.gov.in)', 'Indian Stamp Act — uniform stamp duty on securities transactions, effective 1 Jul 2020 (indiacode.nic.in)', 'SEC — Section 31 transaction fees (sec.gov)'],
  });

  L({
    id: 'l1-circuits', module: 'L1-M2', track: 'india', title: 'Circuit limits, ASM/GSM, F&O ban and market-wide limits', mins: 16,
    summary: 'Identify when a stock can lock, when trading conditions change under surveillance, and why a stock in F&O ban behaves differently.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Indian exchanges put speed limits on prices. If a stock moves too far in one day, trading is either restricted to a band or stopped. If the whole market crashes, trading in everything pauses. Exchanges also place certain stocks under **surveillance**, making them more expensive or slower to trade.

For a beginner the key risk is simple: **you may not be able to exit**. A stock locked at its lower circuit has sellers but no buyers. Your stop-loss is just an unfilled order.` },
      { h: 'Intermediate view', md: `### Stock price bands
- Stocks **not** in F&O have fixed daily price bands such as 2%, 5%, 10% or 20%, set by the exchange based on the stock's risk.
- Stocks **in** F&O have no fixed band; instead a **dynamic price band** (initially around 10%) can be relaxed in steps if the price approaches it with demand.
- When a stock hits its band and stays there with only buyers (upper circuit) or only sellers (lower circuit), it is "locked".

### Market-wide circuit breakers
Triggered by a 10%, 15% or 20% move in Nifty 50 or Sensex. They halt trading in all equity and equity derivatives for periods that depend on the level and time of day; a 20% move halts trading for the rest of the day (verify the current table on NSE).

### Surveillance frameworks
- **ASM** (Additional Surveillance Measure): for stocks with unusual price or volume patterns. Stages may require 100% margin (no intraday leverage) or trade-for-trade settlement.
- **GSM** (Graded Surveillance Measure): for stocks where price movement looks out of line with fundamentals; stages restrict frequency and may require deposits.
- **Trade-for-trade (T2T) / BE series**: every trade must be settled by delivery; intraday squaring off is not allowed.

### F&O ban
Each F&O stock has a **market-wide position limit (MWPL)**. When open interest across all participants exceeds 95% of MWPL, the stock enters the **ban period**: no fresh positions, only reductions. It exits when OI falls below 80%. The computation method was revised in 2025, with OI measured on a futures-equivalent (delta-based) basis (verify on NSE). A client who increases a position during the ban is penalised by the exchange, and brokers usually block such orders; even an intraday trade that adds to a position and is closed the same day can count.` },
      { h: 'Advanced view', md: `- **Magnet effect.** Research on price limits in several markets suggests prices can accelerate as they approach a band, as traders rush to trade before a lock. Evidence varies by market and period; treat it as a risk, not a strategy.
- **Liquidity cliff.** In a 5%-band small-cap, you can be at −4% with an orderly book and at −5% locked one minute later.
- **F&O ban effects.** Since no new positions are allowed, existing short positions cannot be added to and some are covered; derivative prices can decouple slightly from cash. Exchanges publish the ban list daily.
- **Surveillance lists change daily.** A stock can move into ASM overnight and your intraday product is no longer available; your broker may reject MIS orders or demand full margin.

Professional intraday desks avoid stocks with small fixed bands and stocks under surveillance unless that is their specialism.` },
      { h: 'The maths', md: `:::formula
Upper band = Previous close × (1 + Band %)
Lower band = Previous close × (1 − Band %)
OI utilisation = Open interest / MWPL × 100
:::

**Example.** A small-cap closed at ₹180 with a 5% band. Upper = 180 × 1.05 = **₹189**; lower = 180 × 0.95 = **₹171**. If you buy at ₹186 with a stop at ₹183, a sudden drop to the lower band of ₹171 would mean a potential loss of ₹15/share if locked, five times your planned ₹3.

**F&O ban.** MWPL 10 crore shares; OI 9.6 crore → 96% utilisation → ban. OI must fall below 8 crore (80%) for the stock to exit.` },
      { h: 'India', md: `> [!india] Each morning, check three NSE lists before trading a stock: the F&O ban list, the ASM/GSM lists and the price-band file. Many broker apps show tags such as "ASM", "T2T" or "Ban" next to the symbol.` },
      { h: 'US & global', md: `> [!us] US stocks have no fixed daily bands; instead, **Limit Up–Limit Down (LULD)** bands pause a stock for a few minutes if it moves too far within a short window, and market-wide circuit breakers trigger at 7%, 13% and 20% declines in the S&P 500. China's A-share market uses fixed daily limits (typically 10%, wider on some boards).` },
      { h: 'Common misconceptions', md: `- **"A stop-loss protects me from circuit risk."** Not if there is no one on the other side.
- **"Upper circuit means guaranteed gains tomorrow."** Locked stocks can open with a large reversal.
- **"F&O ban means the stock can't be traded."** Cash trading continues; only fresh derivative positions are blocked.
- **"Surveillance means the company is a fraud."** It means trading patterns need monitoring.` },
      { h: 'When it fails', md: `You short 1,000 shares of a 10%-band stock at ₹95 intraday, expecting a fade. Positive news arrives; it rallies to the upper circuit at ₹104.50 and locks with buy orders queued. Your stop at ₹98 never fills. At close the broker cannot square off. Short delivery: the next-day auction settles at ₹108 plus penalty. Planned loss ₹3,000; actual ≈ ₹13,000+. The rule many traders adopt: **never short band-restricted small-caps intraday**.` },
      { h: 'Exercise', md: `1. For a stock with previous close ₹320 and a 10% band, compute both bands.
2. Download today's NSE F&O ban list (or use the sample in the Library) and note OI utilisation of each stock.
3. Add a "pre-trade checks" item to your daily checklist: ban list, surveillance tags, price band.` },
    ],
    check: [
      { q: "A stock closed at ₹240 with a 5% band. What is the lower band?", o: ["₹228", "₹235", "₹216", "₹252"], a: 0, why: "240 × 0.95 = ₹228. ₹252 is the upper band; ₹216 would be a 10% band." },
      { q: "A stock enters the F&O ban. What can you do?", o: ["Open new futures longs only", "Reduce existing derivative positions; cash trading continues", "Nothing at all in that stock", "Trade unlimited options"], a: 1, why: "During ban, fresh F&O positions are blocked but reductions are allowed, and the cash market is unaffected." },
    ],
    refs: ['NSE — Price bands, dynamic price bands and market-wide circuit breakers (nseindia.com)', 'NSE — Surveillance actions: ASM and GSM frameworks (nseindia.com)', 'NSE — Securities in ban period and MWPL (nseindia.com)', 'SEC / FINRA — Limit Up–Limit Down plan and market-wide circuit breakers (sec.gov, finra.org)'],
  });

  L({
    id: 'l1-flows', module: 'L1-M2', track: 'india', title: 'FII/DII flows, breadth and advance–decline', mins: 15,
    summary: 'Read FII/DII flow and breadth data correctly, use them as context rather than signals, and spot a narrow, fragile move.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `Two groups dominate Indian market money: **foreign portfolio investors** (FPIs, still widely called FIIs) and **domestic institutional investors** (DIIs: mutual funds, insurers, pension funds). The exchanges publish a provisional daily summary of their buying and selling. Media headlines like "FIIs sold ₹3,000 crore" come from this.

**Breadth** tells you how many stocks are rising versus falling. If Nifty is up but most stocks are down, the rally is being carried by a few heavyweights.

Both are **context**, not trading signals. They help you understand the backdrop; they rarely tell you what to do in the next 15 minutes.` },
      { h: 'Intermediate view', md: `### FII/DII data
- NSE publishes provisional FII/FPI and DII cash-market net figures after market hours; NSDL publishes FPI data based on custodian reports.
- Exchanges also publish **participant-wise open interest** in derivatives (client, DII, FII, proprietary), which shows positioning in index futures and options.
- Over months, persistent FPI selling and DII buying (or vice versa) can describe a regime. On any single day, the figure is backward-looking: it describes what already happened.

### Breadth measures
| Measure | Calculation | Reading |
|---|---|---|
| Advance–decline ratio | Advances / Declines | Above 1 = more stocks up |
| A/D line | Running sum of (Advances − Declines) | Rising line = broad participation |
| % above moving average | Share of stocks above their 20- or 50-day MA | Extremes show stretched conditions |
| New highs – new lows | 52-week highs minus lows | Trend health |

Intraday, the NSE live advance–decline count for the Nifty 500 or all listed stocks updates during the day.` },
      { h: 'Advanced view', md: `### Evidence status: mixed
- Research on foreign flows in emerging markets, including India, generally finds that flows **follow** returns (investors chase performance) as well as influence them. Contemporaneous correlation is clear; predictive power for the next day is weak and unstable.
- Breadth divergences (index making highs while the A/D line weakens) are widely discussed by technicians as a warning sign. They can persist for months before anything happens, and there is no reliable timing rule.

### How professionals use them
- As a **regime filter**: in a period of heavy, persistent FPI selling with weak breadth, they size smaller and favour short or mean-reverting setups.
- As a **sanity check** on a strong index day: if Nifty is up 1% with an A/D ratio of 0.8, they treat the rally as narrow and avoid buying random laggards.
- Participant OI is used to understand how positioned others are, but **institutional jargon is not proof of institutional activity**: an FII category includes hedgers, arbitrageurs and index funds with very different motives.` },
      { h: 'The maths', md: `:::formula
A/D ratio = Advancing stocks / Declining stocks
A/D line (today) = A/D line (yesterday) + (Advances − Declines)
FII/DII net = Gross buy − Gross sell (₹ crore)
:::

**Example.** Nifty 500 at 13:00: 180 advancing, 300 declining, 20 unchanged. Ratio = 180 / 300 = **0.6**. Nifty itself is +0.4%. This is a narrow rally led by heavyweights.

**Flow example.** FPIs: gross buy ₹12,400 crore, gross sell ₹15,100 crore → net **−₹2,700 crore**. DIIs net +₹3,200 crore. Headlines say "FIIs sold", yet the market might have closed up because domestic buying absorbed it.` },
      { h: 'India', md: `> [!india] A balanced approach: read FII/DII and participant OI once in the evening as part of your post-market review. Do not open trades at 09:15 because of yesterday's FII number. During the day, glance at the advance–decline count to judge whether the index move is broad or narrow.` },
      { h: 'US & global', md: `> [!us] US traders watch NYSE advance–decline, the NYSE TICK (upticks minus downticks across stocks, intraday), and the percentage of S&P 500 stocks above their 50- and 200-day averages. Fund-flow data (ETF creations/redemptions) is published with a lag.` },
      { h: 'Common misconceptions', md: `- **"FIIs sold, so the market will fall tomorrow."** The figure is already in the price; next-day predictive power is weak.
- **"FIIs are smart money."** It is a broad category with many motives.
- **"Breadth divergence means a crash is coming."** It can last a long time.
- **"Provisional data is final."** It is revised; NSDL and exchange final data can differ.` },
      { h: 'When it fails', md: `You read that FPIs sold ₹4,000 crore yesterday and short Nifty futures at 09:20 at 25,050, expecting a fall. Domestic funds buy steadily, a heavyweight posts results, and Nifty rises to 25,180 by 11:00. Stop at 25,120 is hit: loss 70 × 65 = ₹4,550 plus ~₹970 charges. The flow data was correct but old; it told you nothing about today's buyers.` },
      { h: 'Exercise', md: `1. For five days, record Nifty change, A/D ratio of the Nifty 500, and FII/DII net figures in your Journal. At the end, describe in words whether they lined up. Do not compute a "success rate" from five days.
2. In the Chart Lab, note days on the synthetic Nifty where the index rose but the simulated breadth was weak.` },
    ],
    check: [
      { q: "Nifty is up 0.8% at noon but the A/D ratio is 0.7. What is the best interpretation?", o: ["Broad, healthy rally", "Narrow rally led by a few heavyweights", "Data error", "Nifty must fall in the afternoon"], a: 1, why: "More decliners than advancers despite the index rising means a few large weights are carrying it. It does not guarantee a fall." },
      { q: "Why is yesterday's FII net selling figure a weak signal for today's intraday direction?", o: ["It is secret", "It describes past trades already reflected in prices and has little reliable next-day predictive power", "FIIs cannot trade intraday", "It is in dollars"], a: 1, why: "Flows are backward-looking and mixed in motive. The data is public, FIIs can trade intraday, and figures are in rupees." },
    ],
    refs: ['NSE — FII/FPI and DII trading activity, participant-wise open interest (nseindia.com)', 'NSDL — FPI monitor (fpi.nsdl.co.in)', 'John J. Murphy — Technical Analysis of the Financial Markets (book)', 'Robert D. Edwards, John Magee — Technical Analysis of Stock Trends (book)'],
  });

  Q([
    { id: 'L1-M2-q01', module: 'L1-M2', d: 1, q: "NSE normal market hours (as of Nov 2026)?", o: ["09:00–15:30", "09:15–15:30", "09:15–16:00", "10:00–15:30"], a: 1, why: "Continuous trading runs 09:15–15:30 IST. The pre-open session spans 09:00–09:15 (order entry to about 09:10, matching 09:10–09:12, then a buffer), F&O stocks go into the Closing Auction Session 15:15–15:35, and the post-close session runs 15:50–16:00. 09:00 is the pre-open start, 16:00 the end of the post-close session, and there is no 10:00 start." },
    { id: 'L1-M2-q02', module: 'L1-M2', d: 2, q: "In a pre-open auction, at ₹500 cumulative buys are 8,000 and cumulative sells 6,500; at ₹502 buys 6,000 and sells 7,500. Which price matches more shares?", o: ["₹500 (6,500 shares)", "₹502 (6,000 shares)", "Both equal", "Neither"], a: 0, why: "Tradable = min(buys, sells): ₹500 → 6,500, ₹502 → 6,000. The auction picks the larger." },
    { id: 'L1-M2-q03', module: 'L1-M2', d: 2, q: "How is NSE's cash-market closing price determined?", o: ["Last trade at 15:30", "Volume-weighted average of the last 30 minutes", "Average of open and close", "Set by SEBI"], a: 1, why: "NSE uses a weighted average of trades in the final 30 minutes to reduce manipulation of the close." },
    { id: 'L1-M2-q04', module: 'L1-M2', d: 2, q: "Which change came from SEBI's Oct 2024 index-derivatives measures?", o: ["Removal of all stop orders", "One weekly-expiry index per exchange", "STT abolished on options", "T+3 settlement"], a: 1, why: "The circular limited weekly expiries to one benchmark index per exchange, among other measures." },
    { id: 'L1-M2-q05', module: 'L1-M2', d: 1, q: "Who may legally give paid stock recommendations in India?", o: ["Anyone with many followers", "SEBI-registered research analysts and investment advisers", "Any stockbroker employee", "Any CA"], a: 1, why: "Paid advice and research require SEBI registration as RA or RIA." },
    { id: 'L1-M2-q06', module: 'L1-M2', d: 2, q: "Nifty at 25,000. A stock with 8% weight falls 2.5%. Approximate points contribution?", o: ["−20", "−50", "−200", "−8"], a: 1, why: "25,000 × 0.08 × −0.025 = −50 points." },
    { id: 'L1-M2-q07', module: 'L1-M2', d: 2, q: "India VIX rises sharply while Nifty is flat. This means…", o: ["Nifty will rise", "Option prices imply higher expected volatility ahead", "Nifty will fall", "Volume has fallen"], a: 1, why: "VIX is derived from option prices and measures expected volatility, not direction." },
    { id: 'L1-M2-q08', module: 'L1-M2', d: 3, q: "Intraday equity: buy 200 at ₹700, sell 200 at ₹705. Brokerage ₹20 per order. Using 2026 rates, approximate total charges?", o: ["About ₹20", "About ₹100", "About ₹300", "About ₹700"], a: 1, why: "Brokerage 40; STT 0.025% × 1,41,000 ≈ 35; transaction ≈ 8.6; SEBI ≈ 0.3; GST ≈ 8.8; stamp ≈ 4.2 — total ≈ ₹97. ₹20 counts only one order's brokerage; the larger figures confuse intraday with delivery or futures rates." },
    { id: 'L1-M2-q09', module: 'L1-M2', d: 3, q: "1 lot Nifty futures round-trip charges ≈ ₹968 (lot 65). Your target is 30 points. What share of gross profit do charges take?", o: ["About 5%", "About 15%", "About 50%", "About 100%"], a: 2, why: "Gross = 30 × 65 = ₹1,950; 968 / 1,950 ≈ 50%." },
    { id: 'L1-M2-q10', module: 'L1-M2', d: 2, q: "A non-F&O stock closed at ₹150 with a 20% band. What is the upper band?", o: ["₹165", "₹172.50", "₹180", "₹200"], a: 2, why: "150 × 1.20 = ₹180." },
    { id: 'L1-M2-q11', module: 'L1-M2', d: 2, q: "A stock's derivative OI is 97% of MWPL. What happens?", o: ["It is delisted", "It enters the F&O ban: no fresh positions, only reductions", "Cash trading stops", "Lot size doubles"], a: 1, why: "Above 95% of MWPL, the stock is in ban until OI falls below 80%; cash trading continues." },
    { id: 'L1-M2-q12', module: 'L1-M2', d: 3, q: "You short a 5%-band small-cap intraday and it locks at the upper circuit. What is the realistic outcome if it stays locked?", o: ["Your stop fills at the trigger", "You cannot cover; short delivery leads to auction and penalty", "The exchange cancels your trade", "The broker absorbs the loss"], a: 1, why: "A locked upper circuit has no sellers, so you cannot buy back; the obligation goes to auction." },
    { id: 'L1-M2-q13', module: 'L1-M2', d: 2, q: "Which is the best use of daily FII/DII data for an intraday beginner?", o: ["Trade the opposite direction at 09:15", "Use it as post-market context about the regime", "Ignore index movement", "Treat FII as smart money and copy them"], a: 1, why: "Flow data is backward-looking context; it does not provide reliable intraday entries, and FIIs have many motives." },
    { id: 'L1-M2-q14', module: 'L1-M2', d: 1, q: "Which surveillance framework is meant for stocks whose price moves seem out of line with fundamentals?", o: ["GSM", "MWPL", "SPAN", "IPFT"], a: 0, why: "GSM (Graded Surveillance Measure) targets such stocks. MWPL is a position limit, SPAN a margin system, IPFT an investor-protection fund charge." },
  ]);

  /* ======================= L1-M3 Candlesticks and chart basics ======================= */

  L({
    id: 'l1-candle-anatomy', module: 'L1-M3', track: 'ta', title: 'Candle anatomy and chart types', mins: 15,
    summary: 'Read open, high, low and close from any candle, describe what the body and wicks say about the fight inside that period, and choose a chart type for the job.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `A candlestick is a compressed story of one period (one minute, five minutes, one day). It records four prices: where the period **opened**, the **highest** and **lowest** prices traded, and where it **closed**.

- The thick part is the **body**, between open and close.
- If close is above open the candle is **bullish** (usually green or hollow). If close is below open it is **bearish** (red or filled).
- The thin lines above and below are **wicks** (shadows). They show prices that were traded but rejected before the close.

Think of a tug of war. The body tells you who won the period; the wicks tell you how far each team pulled before being pulled back.

[[pattern:marubozu-bull]]` },
      { h: 'Intermediate view', md: `### Reading a candle step by step
1. Colour: who won from open to close?
2. Body size relative to recent candles: a strong or weak win?
3. Upper wick: how much buying was rejected?
4. Lower wick: how much selling was rejected?
5. Close location within the range: closing near the high shows buyers in control at the end of the period.

### Chart types compared
| Type | Shows | Good for | Weakness |
|---|---|---|---|
| Line | Closes only | Big-picture trend, clean levels | Hides intraperiod volatility |
| OHLC bar | O, H, L, C as ticks | Dense charts, US habit | Harder to read colour at a glance |
| Candlestick | O, H, L, C with body | Most intraday work | Encourages over-reading patterns |
| Heikin-Ashi | Smoothed averaged candles | Seeing trend persistence | Prices are not real traded prices |
| Renko / range | Fixed price boxes, time ignored | Filtering noise | Lag, gaps in time, unsuitable for exact entries |

Heikin-Ashi deserves a warning: its open and close are averages, so you cannot place orders at the prices it shows. Use it for viewing, never for backtest fills.` },
      { h: 'Advanced view', md: `A candle hides the **path** inside it. A green 5-minute candle with open ₹1,400, high ₹1,408, low ₹1,396 and close ₹1,406 could have gone down first and then up, or up first, down, then up again. For stop-and-target logic this matters: did the low hit your stop before the high hit your target? Backtests on candles must make an assumption, and the honest one is often the pessimistic one.

Professionals also note that candles are **arbitrary time slices**. A 5-minute candle from 10:00 to 10:05 looks different from one built 10:02–10:07, even though the market was the same. That is a reason not to treat any single candle's shape as decisive.

Closing location value (CLV) is a simple numeric description of where the close sits in the range; volume-based indicators such as accumulation/distribution use it.` },
      { h: 'The maths', md: `:::formula
Range = High − Low
Body = |Close − Open|
Upper wick = High − max(Open, Close)
Lower wick = min(Open, Close) − Low
Close location = (Close − Low) / (High − Low)
:::

**Example (Nifty 5-min).** O 25,010, H 25,042, L 24,998, C 25,036.
- Range = 44 points. Body = 26 (59% of range). Upper wick = 6. Lower wick = 12.
- Close location = (25,036 − 24,998) / 44 = 38/44 ≈ **0.86**, near the high.

Description: a solid bullish candle that rejected an early dip and closed near its high.

**Heikin-Ashi close** = (O + H + L + C) / 4 = (25,010 + 25,042 + 24,998 + 25,036) / 4 = **25,021.5**, a price that never needed to trade.` },
      { h: 'India', md: `> [!india] The first 5-minute candle on Nifty or a stock (09:15–09:20) usually has the widest range of the morning because it absorbs overnight information. Many Indian intraday traders mark its high and low as an initial reference; that idea is developed in [[link:l2-opening-range]].

[[chart:NIFTY:3:vol]]` },
      { h: 'US & global', md: `> [!us] US traders often use OHLC bars and 1-, 2- or 5-minute charts. The first 30 minutes after 09:30 ET behave similarly to India's open: wide ranges, high volume. Pre-market candles exist but are thin; many traders hide them to avoid confusing levels.` },
      { h: 'Common misconceptions', md: `- **"Green candle means price went up during the period."** It means close > open; the candle may have closed below the previous candle's close.
- **"Long wick always means reversal."** It means rejection inside that period; context decides what follows.
- **"Heikin-Ashi is more accurate."** It is smoother, not more accurate.
- **"Candlestick colour is universal."** Some platforms use hollow/filled or reversed colour schemes; check settings.` },
      { h: 'When it fails', md: `A trader uses a Heikin-Ashi 5-minute chart and buys when the first green HA candle appears, at what the chart shows as ₹1,402. The real price at that moment is ₹1,409, because HA averaging lags. His stop "₹6 below" on the HA chart is actually ₹13 below his real entry. On the first pullback he loses twice his planned amount. Viewing tool, used as an execution tool: failure.` },
      { h: 'Exercise', md: `1. In the Chart Lab, switch the same synthetic day between line, candlestick and Heikin-Ashi. Note one thing each hides.
2. For ten consecutive 5-minute candles, compute body %, wicks and close location, and write one sentence per candle describing the fight.
3. Journal: write the pessimistic rule you will use when a candle touches both your stop and your target.` },
    ],
    check: [
      { q: "O 500, H 510, L 492, C 495. What is the upper wick?", o: ["5", "10", "15", "3"], a: 1, why: "Upper wick = High − max(O, C) = 510 − 500 = 10. Body is 5; lower wick is 3." },
      { q: "Why should Heikin-Ashi prices not be used as order prices?", o: ["They are delayed by a day", "They are averages that may never have traded", "They only show closes", "They are illegal in India"], a: 1, why: "HA opens and closes are computed averages, so the price shown may not be tradable at that moment." },
    ],
    refs: ['Steve Nison — Japanese Candlestick Charting Techniques (book)', 'John J. Murphy — Technical Analysis of the Financial Markets (book)', 'Dan Valcu — Using the Heikin-Ashi Technique, Technical Analysis of Stocks & Commodities (2004, article)', 'Thomas Bulkowski — Encyclopedia of Candlestick Charts (book)'],
  });

  L({
    id: 'l1-single-candles', module: 'L1-M3', track: 'ta', title: 'Single-candle patterns in context', mins: 17,
    summary: 'Identify doji, hammer, shooting star, marubozu and pin bars, and judge whether the location and the next candle give them any meaning at all.',
    evidence: 'subjective',
    sections: [
      { h: 'Beginner view', md: `Some single candles have names because their shape tells a vivid story.
- **Doji**: open and close almost equal. Buyers and sellers ended in a draw.
- **Hammer**: small body near the top, long lower wick. Sellers pushed price down hard, buyers pushed it all the way back.
- **Shooting star**: small body near the bottom, long upper wick. The opposite story.
- **Marubozu**: big body, little or no wick. One side dominated the whole period.

The single most important idea in this lesson: **a candle shape means very little on its own**. Where it appears (at a level, after a trend, on high volume) and what happens next matter far more than the shape.

[[pattern:doji]]
[[pattern:hammer]]
[[pattern:shooting-star]]` },
      { h: 'Intermediate view', md: `### Identification rules (common conventions)
| Pattern | Rule of thumb | Context it needs |
|---|---|---|
| Doji | Body ≤ ~10% of range | Comes after a clear move; at a level |
| Hammer | Lower wick ≥ 2× body, small upper wick, after a decline | At support, previous low, VWAP |
| Hanging man | Same shape as hammer, after a rise | At resistance; needs bearish confirmation |
| Inverted hammer | Upper wick ≥ 2× body, after a decline | Needs bullish confirmation |
| Shooting star | Upper wick ≥ 2× body, after a rise | At resistance |
| Marubozu | Body ≥ ~90% of range | Shows strong one-sided control |
| Pin bar | Long wick poking beyond a level, close back inside | Classic rejection of a level |

### A three-question filter
1. **Location**: is it at a level that matters (previous day high/low, VWAP, opening range)?
2. **Prior move**: is there something to reverse?
3. **Confirmation**: does the next candle close beyond the pattern candle's high (for bullish) or low (for bearish)?

### Execution example (bullish hammer)
Entry above the hammer's high on the next candle; stop below the hammer's low; first target at the nearest resistance or at 1.5–2 times the risk.

[[pattern:pin-bar]]
[[pattern:hanging-man]]` },
      { h: 'Advanced view', md: `### Evidence status: subjective
Candlestick names and stories come from Japanese rice-trading tradition popularised in the West by Steve Nison. Academic tests of candlestick patterns on US and other markets have produced mostly weak or inconsistent results once costs are included; some studies find small effects in particular markets and periods, others none. Thomas Bulkowski's large catalogue of patterns reports wide variation in how often patterns are followed by the expected move. Treat any pattern as a **description of what happened**, not as a prediction.

### How professionals use single candles
- As **trigger** candles inside a setup already defined by structure and level, never as the setup itself.
- To place **stops logically**: a hammer's low is a natural line in the sand.
- With **volume**: a hammer at support on twice the average volume tells a different story from one on thin volume at 12:30.

Timeframe matters: a hammer on a 1-minute chart is a few seconds of noise; on a daily chart it summarises a whole session's battle.` },
      { h: 'The maths', md: `:::formula
Lower-wick ratio = Lower wick / Body
Hammer test: Lower wick ≥ 2 × Body and Upper wick ≤ 0.3 × Body (one common convention)
Risk per share = Entry − Stop
:::

**Example (HDFC Bank-style stock, 5-min).** After falling from ₹1,012 to ₹996, a candle prints O 997.0, H 998.2, L 991.5, C 997.8.
- Body = 0.8. Lower wick = 997.0 − 991.5 = 5.5 → ratio 6.9 (hammer-shaped). Upper wick 0.4 = 0.5 × body (slightly above the strict 0.3 rule, so a "loose" hammer).
- Entry above high: ₹998.30. Stop below low: ₹991.40. Risk = ₹6.90/share.
- With ₹1,000 risk budget: 1,000 / 6.90 ≈ 144 shares.
- Target at previous breakdown level ₹1,008: reward ₹9.70 → R:R ≈ 1.4.` },
      { h: 'India', md: `> [!india] In Nifty and Bank Nifty, long-wick candles often appear at the previous day's high or low and around VWAP after the first hour. Watch them, but log every instance in your journal (including the ones that failed) before trusting them.

[[chart:RELIANCE:11:vwap,vol]]` },
      { h: 'US & global', md: `> [!us] The same patterns appear on SPY, NVDA or any liquid instrument; there is nothing market-specific about the geometry. What differs is the typical range and noise level per timeframe. Bulkowski's work is based mainly on US stocks.` },
      { h: 'Common misconceptions', md: `- **"A hammer is a buy signal."** It is a shape. Without location and confirmation it is noise.
- **"Doji means reversal."** In a strong trend, dojis often mark pauses before continuation.
- **"The hanging man and hammer are different candles."** Same shape; only the prior trend differs.
- **"Named patterns have proven win rates."** Published results vary widely and rarely include costs.` },
      { h: 'When it fails', md: `Bank Nifty falls 600 points in the first hour on heavy selling. A hammer forms on the 5-minute chart, not at any level, just mid-air. You buy above its high at 55,420 with a stop at 55,330 (90 points; 1 lot = ₹2,700 risk). The next candle breaks the hammer's low; the trend continues to 55,150. You are stopped out for ₹2,700 plus charges. The pattern was "textbook" in shape and meaningless in context: strong trend, no level, no confirmation.` },
      { h: 'Exercise', md: `1. In the Chart Lab, find ten hammers or shooting stars on a synthetic 5-minute chart. For each, note location (level or mid-air) and whether the next two candles confirmed.
2. Use the R:R calculator for the HDFC Bank-style example above, then change the target to ₹1,004 and see how the trade quality changes.

[[widget:rr]]` },
    ],
    check: [
      { q: "A hammer-shaped candle appears after a strong uptrend at resistance. What is it usually called?", o: ["Hammer", "Hanging man", "Marubozu", "Inverted hammer"], a: 1, why: "Same shape, different context: after a rise it is a hanging man and needs bearish confirmation." },
      { q: "Which hammer is most worth paying attention to?", o: ["Mid-trend on a 1-minute chart at 12:30 on low volume", "At the previous day's low after a decline, on above-average volume, with the next candle closing above its high", "Any hammer, because the shape is what matters", "One with a long upper wick"], a: 1, why: "Location, prior move, volume and confirmation give context. Shape alone is weak; a long upper wick is a different pattern." },
    ],
    refs: ['Steve Nison — Japanese Candlestick Charting Techniques (book)', 'Thomas Bulkowski — Encyclopedia of Candlestick Charts (book)', 'Al Brooks — Trading Price Action Trends (book)', 'Ben R. Marshall, Martin R. Young, Lawrence C. Rose — Candlestick technical trading strategies: Can they create value for investors? Journal of Banking & Finance (2006, article)'],
  });

  L({
    id: 'l1-multi-candles', module: 'L1-M3', track: 'ta', title: 'Two- and three-candle patterns', mins: 17,
    summary: 'Recognise engulfing, harami, piercing/dark cloud, stars, tweezers and inside/outside bars, and convert each into a testable entry, stop and invalidation.',
    evidence: 'subjective',
    sections: [
      { h: 'Beginner view', md: `Two or three candles together tell a short story with a beginning and an end. An **engulfing** pattern says, "yesterday sellers were in charge; today buyers wiped out all of it." A **morning star** says, "sellers were strong, then nobody was in charge, then buyers took over."

These stories are useful for describing a shift in control. They are not magic. They work best when they appear at an important level after a clear move and when the next candles agree.

[[pattern:bullish-engulfing]]
[[pattern:bearish-engulfing]]` },
      { h: 'Intermediate view', md: `| Pattern | Formation | Story | Natural stop |
|---|---|---|---|
| Bullish engulfing | Red candle, then green body that covers the red body | Buyers overwhelm | Below pattern low |
| Bearish engulfing | Green, then red body covering it | Sellers overwhelm | Above pattern high |
| Bullish / bearish harami | Large candle, then small body inside its body | Momentum stalls | Beyond the large candle |
| Piercing line | Red, then green opening lower and closing above the red midpoint | Strong reclaim | Below the low |
| Dark cloud cover | Green, then red opening higher and closing below green midpoint | Strong rejection | Above the high |
| Morning / evening star | Big candle, small "star", big opposite candle | Exhaustion, then reversal | Beyond the star |
| Tweezer top / bottom | Two candles with nearly equal highs / lows | Level defended twice | Beyond the tweezer |
| Three white soldiers / black crows | Three strong same-colour candles | Sustained control | Below/above the first |
| Inside bar | Range inside the previous candle's range | Compression | Opposite side of the mother bar |
| Outside bar | Range engulfs previous range | Expansion, volatility | Opposite extreme |

[[pattern:morning-star]]
[[pattern:evening-star]]
[[pattern:inside-bar]]

### Intraday gaps are rare
Classic definitions of piercing lines and stars involve gaps between daily candles. On 5-minute charts of liquid instruments, the next candle usually opens at the previous close, so traders relax these rules. Relaxed rules mean more patterns and less selectivity.` },
      { h: 'Advanced view', md: `### Evidence status: subjective
As with single candles, published tests give mixed and mostly weak results after costs. The patterns are most defensible as **frameworks for defining risk**: an engulfing low or an inside-bar range gives a clear invalidation point.

### Inside bars as a volatility tool
An inside bar is a period of lower range. Breakouts from compression are a broad idea (see [[link:l2-breakouts]]), but false breaks are common. Many traders require the breakout candle to close beyond the mother bar, not just poke through it.

### Making a pattern testable
Write it as rules a computer could follow: "bullish engulfing on 5-min where low is within 0.1% of previous-day low, entry on a stop order one tick above pattern high within the next two candles, stop one tick below pattern low, target 2R or 15:10 exit." Only then can you paper-trade it and collect a sample. The app's backtest engine accepts such rules in Level 3.` },
      { h: 'The maths', md: `:::formula
Bullish engulfing: C2 > O2, C1 < O1, O2 ≤ C1 and C2 ≥ O1
Piercing: C2 > (O1 + C1) / 2 with C1 < O1
Mother-bar breakout entry = Mother high + 1 tick; stop = Mother low − 1 tick
:::

**Example (Reliance-style, 5-min, at previous day's low ₹1,382).**
- Candle 1: O 1,390, C 1,383 (red). Candle 2: O 1,382.5, H 1,393, L 1,381, C 1,392 (green body covers red body) → bullish engulfing.
- Entry 1,393.10, stop 1,380.90 → risk ₹12.20.
- Risk budget ₹1,500 → 1,500 / 12.20 ≈ 122 shares.
- Target 2R = 1,393.10 + 24.40 = ₹1,417.50; check that no resistance (VWAP, morning high) sits in the way. If VWAP is at 1,401, the realistic first target is only 0.65R, which may make the trade not worth taking.` },
      { h: 'India', md: `> [!india] Expiry-day afternoons on Nifty can produce violent outside bars as option hedging flows hit; patterns formed then are less reliable as reversal signals. Many traders exclude expiry-day afternoons from pattern statistics.

[[chart:NIFTY:27:ema20,vwap]]` },
      { h: 'US & global', md: `> [!us] On US stocks, daily-chart patterns frequently include true gaps (earnings, overnight news), so classical definitions apply better on daily charts than intraday. Intraday, the same relaxations as in India apply.` },
      { h: 'Common misconceptions', md: `- **"Three white soldiers mean buy."** After a long rally, three strong candles can be the final exhaustion.
- **"A harami is a reversal."** It is a pause; many haramis resolve in the trend direction.
- **"More candles in a pattern means more reliable."** More candles means more conditions, not proven reliability.
- **"If it failed, I identified it wrong."** Correctly identified patterns fail often.` },
      { h: 'When it fails', md: `Nifty is in a strong uptrend after positive news. A bearish engulfing forms at 11:00 at no particular level. You short at 25,180 with a stop above the pattern high at 25,215 (35 points = ₹2,275 per lot). Fifteen minutes later buyers return, the engulfing high breaks, and you are stopped out. The pattern described a 5-minute pullback inside a trend, nothing more. Rule learned: **reversal patterns against a strong trend, away from a level, are low-quality**.` },
      { h: 'Exercise', md: `1. Write one two-candle pattern as a full rule set (conditions, entry, stop, target, time exit) in your Journal.
2. Paper-trade it in the Simulator for at least 30 instances before forming any opinion. Record losers as carefully as winners.
3. Use the expectancy calculator with your paper results.

[[widget:expectancy]]` },
    ],
    check: [
      { q: "Candle 1: O 200, C 196. Candle 2: O 195.5, C 201. Which pattern?", o: ["Bearish harami", "Bullish engulfing", "Dark cloud cover", "Tweezer top"], a: 1, why: "Green body 195.5–201 covers red body 196–200: bullish engulfing." },
      { q: "An inside bar forms after a big candle. What does it mainly indicate?", o: ["Guaranteed breakout upward", "Compression / pause; direction undecided", "A completed reversal", "High volatility"], a: 1, why: "An inside bar has a smaller range, signalling compression. Direction is not determined by the pattern." },
    ],
    refs: ['Steve Nison — Japanese Candlestick Charting Techniques (book)', 'Thomas Bulkowski — Encyclopedia of Candlestick Charts (book)', 'Gregory L. Morris — Candlestick Charting Explained (book)', 'Ben R. Marshall, Martin R. Young, Rochester Cahan — Are candlestick technical trading strategies profitable in the Japanese equity market? Review of Quantitative Finance and Accounting (2008, article)'],
  });

  L({
    id: 'l1-timeframes', module: 'L1-M3', track: 'ta', title: 'Timeframes: what a 1-min, 5-min and daily chart each tell you', mins: 16,
    summary: 'Pick a primary timeframe for your intraday trading, use a higher one for context and a lower one for timing, and understand how noise and costs change with timeframe.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `The same market looks completely different depending on how much time each candle represents. A daily chart of Nifty might show a calm uptrend; the 1-minute chart of the same day might look like chaos.

Think of it like maps. A country map shows highways (daily chart: the big trend). A city map shows roads (15- or 5-minute: today's structure). A street map shows every lane (1-minute: exact timing). You need the right map for the decision you are making, and you should not plan a journey with only the street map.` },
      { h: 'Intermediate view', md: `| Timeframe | Candles per NSE day | Best for | Problems |
|---|---|---|---|
| Daily | 1 | Trend, key levels (previous highs/lows) | Too slow for intraday entries |
| 60-min | ~6 | Intraday trend, session structure | Few candles per day |
| 15-min | 25 | Intraday structure, opening range | Entries can be late |
| 5-min | 75 | Most beginner intraday setups | More noise than 15-min |
| 1-min | 375 | Fine-tuning entries | Mostly noise; overtrading |

### A simple three-timeframe stack for a beginner
1. **Daily**: mark yesterday's high, low and close, and the trend (higher highs/lows or not).
2. **15-minute**: identify today's structure and the opening range.
3. **5-minute**: execute: entry, stop, target.

Ratios of roughly 3–5x between timeframes keep them related but distinct. A detailed top-down process is in [[link:l2-mtf]].

[[chart:NIFTY:33:ema20,ema50]]` },
      { h: 'Advanced view', md: `### Noise versus signal
Roughly, price volatility scales with the square root of time, not with time itself. A 1-minute candle's typical range is therefore about 45% of a 5-minute candle's, not 20%: shorter bars contain proportionally more random back-and-forth. Meanwhile your cost per trade is fixed in rupees. The shorter your holding period, the smaller the typical move you can capture, and the larger costs loom as a share of it.

### Indicator settings change meaning
A 20-period EMA on 5-minute candles covers 100 minutes; on 1-minute candles it covers 20 minutes. Professionals talk about lookbacks in **time**, not bars.

### Sampling sensitivity
A setup that appears on 5-minute candles might not appear on 4- or 6-minute candles. If a strategy only works on one exact bar size, it is probably fragile. Robust ideas tend to survive small changes in timeframe.` },
      { h: 'The maths', md: `:::formula
Expected range scales roughly with √(time)
Range(T2) ≈ Range(T1) × √(T2 / T1)
Cost as % of range = Round-trip cost per unit / Typical range
:::

**Example.** Suppose Nifty's typical 5-minute range is 18 points.
- 1-minute estimate: 18 × √(1/5) ≈ 18 × 0.447 ≈ **8 points**.
- 15-minute estimate: 18 × √3 ≈ **31 points**.

With round-trip futures costs of about 15 points (from [[link:l1-india-costs]]):
- 1-min: costs ≈ 15 / 8 ≈ **188%** of a typical bar.
- 5-min: 15 / 18 ≈ **83%**.
- 15-min: 15 / 31 ≈ **48%**.

The square-root rule is an approximation (markets trend and mean-revert at different times), but the message is robust: shorter timeframes make costs a much heavier burden.` },
      { h: 'India', md: `> [!india] Intraday-only traders in India often hold for 15 minutes to a few hours. With 2026 STT on futures and fixed lot sizes, 1-minute scalping in Nifty futures carries a very high cost hurdle. Beginners are usually better served by 5- and 15-minute charts in liquid cash stocks or index futures in paper trading.` },
      { h: 'US & global', md: `> [!us] US markets trade 6.5 regular hours (78 five-minute candles). Low per-share costs make 1- and 2-minute trading more common, but spreads in less liquid stocks create the same hurdle. Futures traders often use tick or volume bars instead of time bars.` },
      { h: 'Common misconceptions', md: `- **"Lower timeframe = more opportunities = more money."** More trades also means more costs and more mistakes.
- **"The higher timeframe is always right."** It is context, not a command; intraday moves can oppose it for hours.
- **"Indicator settings transfer across timeframes."** A 14-bar RSI on 1-minute is a 14-minute RSI.
- **"Switching timeframes until the chart looks good is analysis."** That is confirmation bias.` },
      { h: 'When it fails', md: `A trader sees a clean breakout on the 1-minute chart of a mid-cap and buys at ₹612 with a ₹2 stop. On the 15-minute chart, price is directly under yesterday's high at ₹614, a level that had rejected price twice. The 1-minute breakout runs to ₹613.80, reverses, and stops him out. He repeats this five times in a day, losing about ₹1,000 each plus charges. The lower timeframe gave him precise entries into a bad location.` },
      { h: 'Exercise', md: `1. In the Chart Lab, view the same synthetic Nifty day on 1-, 5- and 15-minute candles. Count how many swings each shows.
2. Measure the average range of the last 20 candles on each timeframe and check how well the square-root rule fits.
3. Write your personal timeframe stack (context, structure, execution) in your trading plan.` },
    ],
    check: [
      { q: "Typical 5-min range is 20 points. Using the square-root rule, approximate 20-minute range?", o: ["20", "40", "80", "10"], a: 1, why: "20 × √(20/5) = 20 × 2 = 40." },
      { q: "A 20-period EMA on a 1-minute chart covers roughly how much time?", o: ["20 days", "100 minutes", "20 minutes", "1 hour"], a: 2, why: "20 bars × 1 minute = 20 minutes; on 5-minute it would be 100 minutes." },
    ],
    refs: ['Alexander Elder — Trading for a Living (book; triple-screen idea)', 'John J. Murphy — Technical Analysis of the Financial Markets (book)', 'Brett N. Steenbarger — The Psychology of Trading (book)', 'Larry Harris — Trading and Exchanges: Market Microstructure for Practitioners (book)'],
  });

  Q([
    { id: 'L1-M3-q01', module: 'L1-M3', d: 1, q: "In a bearish candle, the top of the body is the…", o: ["Close", "Open", "High", "Low"], a: 1, why: "In a bearish candle, open is above close, so the body's top is the open. The high is the top of the upper wick." },
    { id: 'L1-M3-q02', module: 'L1-M3', d: 2, q: "O 1,000, H 1,012, L 996, C 1,010. Close location value?", o: ["0.25", "0.50", "0.875", "1.00"], a: 2, why: "(1,010 − 996)/(1,012 − 996) = 14/16 = 0.875." },
    { id: 'L1-M3-q03', module: 'L1-M3', d: 2, q: "Which chart type shows prices you cannot necessarily trade at?", o: ["Candlestick", "OHLC bar", "Heikin-Ashi", "Line of closes"], a: 2, why: "Heikin-Ashi values are averages; the others plot actual traded prices." },
    { id: 'L1-M3-q04', module: 'L1-M3', d: 2, q: "Body 2, lower wick 7, upper wick 0.3, after a decline at the previous day's low. Best label?", o: ["Shooting star", "Hammer", "Marubozu", "Bearish engulfing"], a: 1, why: "Long lower wick ≥ 2× body, tiny upper wick, after a decline: hammer." },
    { id: 'L1-M3-q05', module: 'L1-M3', d: 2, q: "What is the main difference between a hammer and a hanging man?", o: ["Colour", "Wick length", "The prior trend in which it appears", "Volume"], a: 2, why: "They share the same shape; context (after a decline vs after a rise) names them." },
    { id: 'L1-M3-q06', module: 'L1-M3', d: 3, q: "Hammer high ₹502.50, low ₹496.00. Entry one tick (₹0.05) above high, stop one tick below low. Risk budget ₹1,300. Shares?", o: ["150", "196", "260", "197"], a: 1, why: "Entry 502.55, stop 495.95, risk 6.60; 1,300 / 6.60 ≈ 196.97 → 196 shares. Always round down; 197 would exceed the risk budget." },
    { id: 'L1-M3-q07', module: 'L1-M3', d: 2, q: "Candle 1: O 300, C 306 (green). Candle 2: O 307, C 302. Is it dark cloud cover?", o: ["Yes: it opened above the prior close and closed below the prior body midpoint of 303", "No: it must close below 300", "No: dark cloud requires a red first candle", "No: it is a bullish harami"], a: 0, why: "Midpoint of candle 1's body = 303; candle 2 opened above the prior close and closed at 302, below the midpoint but inside the body: dark cloud cover under the relaxed intraday definition (the classic daily definition wants the open above the prior high). Closing below 300 would make it a bearish engulfing; the first candle must be green, not red; and a harami needs the second body inside the first." },
    { id: 'L1-M3-q08', module: 'L1-M3', d: 2, q: "An inside bar is best described as…", o: ["A reversal signal", "A candle whose range sits within the prior candle's range, showing compression", "A large expansion candle", "A gap"], a: 1, why: "Inside bars show contraction; outside bars show expansion." },
    { id: 'L1-M3-q09', module: 'L1-M3', d: 3, q: "Bullish engulfing entry ₹1,000, stop ₹992, but VWAP resistance is at ₹1,004. What is the realistic R:R to that first obstacle?", o: ["0.5", "1.0", "2.0", "4.0"], a: 0, why: "Risk 8, reward to VWAP 4: R:R = 0.5. A pattern does not create room to the next level." },
    { id: 'L1-M3-q10', module: 'L1-M3', d: 1, q: "What is the overall evidence status of candlestick pattern lore in this academy?", o: ["Established", "Subjective framework", "Proven profitable", "Illegal"], a: 1, why: "Tests are mixed and mostly weak after costs, so patterns are labelled subjective." },
    { id: 'L1-M3-q11', module: 'L1-M3', d: 2, q: "A 14-period RSI on a 5-minute chart looks back roughly…", o: ["14 minutes", "70 minutes", "14 hours", "14 days"], a: 1, why: "14 × 5 = 70 minutes." },
    { id: 'L1-M3-q12', module: 'L1-M3', d: 3, q: "Typical 5-min range 18 points, costs 15 points per round trip. Why is a 1-minute scalping plan in Nifty futures harder?", o: ["1-min ranges are bigger", "1-min typical range (~8) is smaller than costs, so costs dominate", "Costs are lower on 1-min", "NSE bans 1-min trading"], a: 1, why: "By the square-root rule 18 × √0.2 ≈ 8 points, below the 15-point cost hurdle." },
    { id: 'L1-M3-q13', module: 'L1-M3', d: 2, q: "A bearish engulfing appears mid-way through a strong uptrend, not at any level. Best assessment?", o: ["High-quality short", "Low-quality: against trend, no level, needs much more confirmation", "Guaranteed reversal", "Buy signal"], a: 1, why: "Context dominates: reversal patterns against strong trends away from levels often just mark pullbacks." },
  ]);

  /* ======================= L1-M4 First indicators ======================= */

  L({
    id: 'l1-moving-averages', module: 'L1-M4', track: 'ta', title: 'Moving averages: SMA, EMA and what lag really means', mins: 17,
    summary: 'Calculate SMA and EMA by hand, explain why every moving average lags, and use one for trend context rather than as a crossover signal machine.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `A moving average smooths price by averaging the last N closes. It turns a jagged line into a smoother one, so you can see the direction more easily.

The price of smoothness is **lag**. Because the average includes old prices, it always reacts late. A 20-period average is, roughly speaking, telling you where the price was about 10 periods ago on average. That is fine for seeing the trend; it is a problem if you expect it to tell you the future.

Two common types:
- **SMA** (simple): every one of the last N closes counts equally.
- **EMA** (exponential): recent closes count more, so it reacts faster, with more false turns.` },
      { h: 'Intermediate view', md: `### Three practical uses
1. **Trend filter.** Price above a rising 20 EMA on the 15-minute chart: favour longs. Below a falling one: favour shorts. Flat and tangled: no trend, so trend-following setups are weaker.
2. **Dynamic pullback zone.** In a trending intraday move, price often pulls back towards the 9 or 20 EMA before continuing. "Often" is not "always".
3. **Slope and spacing.** A steep, widening gap between the 9 and 20 EMA shows strong momentum; when they converge and flatten, momentum is fading.

### Crossovers
A fast average crossing a slow one (e.g. 9 over 20) is the most famous signal and the most misunderstood. In trends it catches moves late; in ranges it whipsaws repeatedly.

[[chart:NIFTY:12:ema9,ema20,ema50]]

### Common settings
| Use | Typical settings |
|---|---|
| Intraday short-term trend | 9 and 20 EMA on 5-min |
| Intraday context | 20 / 50 EMA on 15-min |
| Daily trend | 50 and 200 SMA |` },
      { h: 'Advanced view', md: `### Evidence status: mixed
Trend-following with moving-average rules has a long research history. Some studies (for example Brock, Lakonishok and LeBaron's 1992 tests on the Dow) found that simple MA rules had predictive value historically; later work found much of that faded after the rules became widely known, or disappeared after costs and data-snooping corrections. Time-series momentum across futures markets has stronger evidence at monthly horizons; the evidence for intraday MA crossover rules on individual stocks is weak. Use MAs as **context**, not as a standalone edge.

### Lag is unavoidable
Every smoother trades responsiveness for noise. Faster averages (EMA, Hull, DEMA) reduce lag by weighting recent data, which amplifies noise and creates more false signals. There is no free lunch; only different compromises.

### Professional habits
- Think in **time**, not bars (a 20 EMA on 5-min ≈ 100 minutes).
- Use the MA's **slope** and price's **distance** from it (in ATR units) as information, not just a cross.
- Do not stack five averages; they are highly correlated and add little.` },
      { h: 'The maths', md: `:::formula
SMA_N = (C1 + C2 + … + CN) / N
EMA_today = EMA_yesterday + k × (Close − EMA_yesterday),  k = 2 / (N + 1)
Average lag of SMA ≈ (N − 1) / 2 bars
:::

**Worked example — 5-period, Reliance-style closes:** 1,400, 1,404, 1,402, 1,408, 1,410, 1,406, 1,414.
- First SMA (first five closes) = 7,024 / 5 = **₹1,404.80**. Use it to seed the EMA.
- k = 2 / 6 = 0.3333.
- Close 1,406: EMA = 1,404.80 + 0.3333 × (1,406 − 1,404.80) = **₹1,405.20**.
- Close 1,414: EMA = 1,405.20 + 0.3333 × (1,414 − 1,405.20) = **₹1,408.13**.
- SMA of last five (1,402…1,414) = **₹1,408.00**.

Average lag of a 20 SMA ≈ 9.5 bars; on a 5-minute chart that is about 47 minutes behind.` },
      { h: 'India', md: `> [!india] On Nifty and Bank Nifty 5-minute charts, many traders watch the 20 EMA alongside VWAP. On trending days price may stay on one side of both for hours; on range days price crosses them repeatedly. Counting crosses in the first two hours is a crude but useful way to describe whether a day is trending.` },
      { h: 'US & global', md: `> [!us] The 50-day and 200-day SMAs on the S&P 500 are widely reported in financial media ("golden cross", "death cross"). Because they are widely watched, they sometimes act as reference points, but crossovers of these averages have a poor record as short-term timing tools.` },
      { h: 'Common misconceptions', md: `- **"EMA is better than SMA."** It is faster, not better. Faster means more false signals.
- **"Price bounces off the 20 EMA."** Sometimes. Often it slices through it.
- **"A crossover tells me a new trend has started."** It tells you a move has already happened.
- **"Optimising the period (e.g. 17 instead of 20) will improve results."** Usually that is curve-fitting.` },
      { h: 'When it fails', md: `On a range-bound Bank Nifty day between 55,800 and 56,050, a 9/20 EMA crossover system on 5-minute candles flips long and short six times. Each signal arrives after a ~60-point move has already happened, near the edge of the range. Average loss per trade ≈ 45 points = ₹1,350 per lot plus ≈ ₹1,000 charges (1 lot of Bank Nifty futures at about 56,000, 2026 rates). Six trades: about −₹14,100. The averages worked as designed; the market had no trend to follow.` },
      { h: 'Exercise', md: `1. In the Chart Lab, add 9 and 20 EMAs to a synthetic Nifty day; count crossovers and mark which were followed by a move of at least 2× the 5-min ATR.
2. Compute a 5-period EMA by hand for ten closes and compare with the app's indicator values.
3. Journal: write how you will use MAs (filter, pullback zone or not at all).` },
    ],
    check: [
      { q: "N = 9. What is the EMA multiplier k?", o: ["0.1", "0.2", "0.25", "0.111"], a: 1, why: "k = 2/(9 + 1) = 0.2." },
      { q: "Why does a crossover system lose money on range days?", o: ["MAs are calculated wrongly", "Signals arrive after each move, near range edges, so entries are late and whipsaw", "Ranges have no volume", "EMAs only work on daily charts"], a: 1, why: "Lag makes crossovers late; in a range the move reverses soon after." },
    ],
    refs: ['John J. Murphy — Technical Analysis of the Financial Markets (book)', 'Perry J. Kaufman — Trading Systems and Methods (book)', 'William Brock, Josef Lakonishok, Blake LeBaron — Simple technical trading rules and the stochastic properties of stock returns, Journal of Finance (1992, article)', 'Tobias Moskowitz, Yao Hua Ooi, Lasse Pedersen — Time series momentum, Journal of Financial Economics (2012, article)'],
  });

  L({
    id: 'l1-rsi', module: 'L1-M4', track: 'ta', title: 'RSI from first principles', mins: 17,
    summary: 'Compute Wilder RSI by hand, read it as a measure of recent momentum, and avoid the classic mistake of shorting every reading above 70.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `The Relative Strength Index (RSI), created by J. Welles Wilder in 1978, answers one question: **of the recent price movement, how much was up versus down?** It is scaled from 0 to 100.

- RSI near 100: almost all recent movement was upward.
- RSI near 0: almost all recent movement was downward.
- RSI near 50: up and down movement balanced.

Popular levels are 70 ("overbought") and 30 ("oversold"). These words are misleading. "Overbought" does not mean "about to fall". It means "has risen strongly recently". Strong trends can stay above 70 for a long time.` },
      { h: 'Intermediate view', md: `### How to read RSI in practice
| Use | What to look for | Better context |
|---|---|---|
| Momentum regime | RSI holding 40–80 in uptrends; 20–60 in downtrends | Matches price structure |
| Mean-reversion extreme | RSI below 30 in a range, at support | Range days, not trend days |
| Failure swing | RSI makes a lower high while price tests highs | Combined with a level |
| Divergence | Price higher high, RSI lower high | Warning only; often fails in trends |

### Execution example (range day)
Nifty has oscillated between 24,900 and 25,050 for two hours. On the 5-minute chart price touches 24,905 and RSI(14) reads 27. You wait for a candle to close back above the previous candle's high (confirmation), buy at 24,920 with stop below the range low at 24,885 (35 points) and target the middle of the range at 24,975 (55 points).

On a trend day, the same RSI reading would be a reason *not* to buy.

[[chart:NIFTY:8:rsi]]` },
      { h: 'Advanced view', md: `### Evidence status: mixed
Short-horizon mean reversion (prices partially reversing after sharp moves) has some empirical support in certain markets and periods, and RSI is one way to measure "sharp". Results depend heavily on the market, the regime (trending vs ranging), the holding period and costs. Simple "buy below 30, sell above 70" rules on intraday data are often unprofitable after costs.

### Professional nuances
- **Regime first.** Identify whether the day is trending or rotating (ADX, structure, VWAP crosses) before deciding whether RSI extremes mean "strong" or "stretched".
- **Shorter lookbacks** (2–5) make RSI very sensitive; they are used in some short-term mean-reversion research. Longer ones (14–21) are smoother.
- **Wilder smoothing** is an EMA with k = 1/N, slower than the standard EMA with the same N. Some platforms use simple averages instead, giving different values; check before comparing.
- **Divergence** is popular and subjective; it fires often and fails often in strong trends. See [[link:l2-oscillators]].` },
      { h: 'The maths', md: `:::formula
Change_t = Close_t − Close_(t−1)
Gain = max(Change, 0); Loss = max(−Change, 0)
AvgGain_t = (AvgGain_(t−1) × (N − 1) + Gain_t) / N   (Wilder smoothing)
AvgLoss_t = (AvgLoss_(t−1) × (N − 1) + Loss_t) / N
RS = AvgGain / AvgLoss
RSI = 100 − 100 / (1 + RS)
:::

**Worked example (N = 14).** Previous AvgGain = 1.20, AvgLoss = 0.80. Today the stock closes ₹2.00 higher.
- AvgGain = (1.20 × 13 + 2.00) / 14 = 17.60 / 14 = **1.257**
- AvgLoss = (0.80 × 13 + 0) / 14 = 10.40 / 14 = **0.743**
- RS = 1.257 / 0.743 = **1.692**
- RSI = 100 − 100 / 2.692 = **62.9**

Notice that a ₹2 up-move lifted RSI meaningfully. The first AvgGain/AvgLoss is a simple average of the first 14 gains/losses.` },
      { h: 'India', md: `> [!india] On trending Bank Nifty days, the 5-minute RSI can stay above 70 for an hour or more. Beginners who short the first "overbought" reading are one of the most common sources of losses in Indian intraday forums. Write in your plan: "RSI above 70 in an uptrend is information about strength, not a short signal."` },
      { h: 'US & global', md: `> [!us] RSI is equally popular in US and crypto markets. Crypto's 24/7 trading and sharp trends make extreme RSI readings persist even longer; the same caution applies.` },
      { h: 'Common misconceptions', md: `- **"Overbought means sell."** It means recent gains were strong.
- **"RSI predicts reversals."** It describes past momentum.
- **"Divergence always leads to reversal."** Divergences appear repeatedly during strong trends.
- **"All platforms show the same RSI."** Smoothing methods and data differ.` },
      { h: 'When it fails', md: `On a strong trend day, Reliance rallies from ₹1,390 to ₹1,435. At ₹1,412, 5-minute RSI hits 74 and a trader shorts 200 shares with a ₹6 stop. Stopped at ₹1,418. He shorts again at ₹1,425 (RSI 81) and is stopped at ₹1,431. Two losses of ₹1,200 each plus charges. Each time RSI was "overbought", and each time momentum was continuing. The indicator did its job; the interpretation ignored the regime.` },
      { h: 'Exercise', md: `1. In the Chart Lab, mark every 5-min RSI > 70 on a synthetic trend day and on a range day. Note what price did over the next six candles in each case.
2. Compute RSI by hand for one step from given averages (use the example's method) and check against the app.
3. Journal: write a regime rule that decides when you would use RSI extremes for mean reversion.` },
    ],
    check: [
      { q: "AvgGain = 1.0, AvgLoss = 1.0. RSI?", o: ["0", "50", "70", "100"], a: 1, why: "RS = 1; RSI = 100 − 100/2 = 50." },
      { q: "Price is in a strong uptrend and RSI(14) is 76. Which is the most defensible interpretation?", o: ["Short immediately", "Momentum is strong; overbought alone is not a reason to short", "RSI is broken", "Buy more because RSI will reach 100"], a: 1, why: "In trends, high RSI describes strength and can persist. It neither predicts a top nor guarantees continuation." },
    ],
    refs: ['J. Welles Wilder — New Concepts in Technical Trading Systems (book, 1978)', 'Constance Brown — Technical Analysis for the Trading Professional (book; RSI range shifts)','Perry J. Kaufman — Trading Systems and Methods (book)'],
  });

  L({
    id: 'l1-vwap', module: 'L1-M4', track: 'ta', title: 'VWAP: the intraday benchmark', mins: 17,
    summary: 'Compute session VWAP, understand why institutions benchmark executions to it, and use it as a reference line for intraday bias and pullbacks.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `VWAP stands for **volume-weighted average price**. It is the average price paid for every share traded today, where prices with more volume count more. It starts fresh at the open each day.

Why it matters: large funds often judge their traders by whether they bought below VWAP or sold above it. So VWAP is a real benchmark that real money cares about. For you, it is a simple, objective line that says whether today's average buyer is in profit (price above VWAP) or in loss (price below).

The **calculation** is established fact. Whether price "respects" VWAP is a behavioural tendency that varies day by day.` },
      { h: 'Intermediate view', md: `### Reading VWAP
| Situation | Typical reading |
|---|---|
| Price above a rising VWAP all morning | Buyers in control; favour long pullbacks to VWAP |
| Price below a falling VWAP | Sellers in control; favour short rallies to VWAP |
| Price crossing VWAP repeatedly | Balanced / range day; VWAP is a magnet, not a trend line |
| Price far above VWAP in a spike | Stretched; late longs risk buying the top |

### A basic VWAP pullback plan (paper trade first)
1. After 10:00 IST, price has stayed above VWAP and made higher highs.
2. Wait for a pullback that touches or nears VWAP.
3. Enter when a 5-min candle closes back up away from VWAP.
4. Stop a little below VWAP or the pullback low.
5. Target the morning high or 1.5–2R.
6. If price closes decisively below VWAP and holds, the bias is invalid.

[[chart:BANKNIFTY:5:vwap,vol]]` },
      { h: 'Advanced view', md: `### Why institutions care
An institution buying 5 lakh shares over a day cannot do it in one order without moving the price. Execution algorithms spread orders through the day in proportion to expected volume, aiming to achieve close to VWAP. Brokers report execution quality against VWAP. This creates genuine order flow linked to VWAP, but it does **not** mean VWAP is a support level by law; the algorithm's goal is average price, not defending a line.

### Limitations
- VWAP early in the session is unstable because it averages only a few minutes of trading; after a couple of hours it becomes heavy and moves slowly.
- It is cumulative: one huge-volume spike can drag it for the rest of the day.
- **Anchored VWAP** (from a chosen event, e.g. a gap or news) and **VWAP bands** (standard deviations) extend the idea; see [[link:l2-vwap-advanced]].
- On index charts (Nifty spot), there is no traded volume of the index itself; platforms use futures volume or constituent volume. Check what your platform does.` },
      { h: 'The maths', md: `:::formula
Typical price TP = (High + Low + Close) / 3
VWAP_t = Σ(TP × Volume) / Σ(Volume), summed from the session open to bar t
:::

**Worked example — Nifty futures, three 5-minute bars:**
| Bar | H | L | C | TP | Volume | TP × Vol |
|---|---|---|---|---|---|---|
| 1 | 25,030 | 24,990 | 25,020 | 25,013.33 | 1,20,000 | 300.16 crore |
| 2 | 25,045 | 25,010 | 25,040 | 25,031.67 | 80,000 | 200.25 crore |
| 3 | 25,060 | 25,030 | 25,035 | 25,041.67 | 1,00,000 | 250.42 crore |

- After bar 1: VWAP = **25,013.33**
- After bar 2: (300.16 + 200.25) crore / 2,00,000 = **25,020.67**
- After bar 3: (750.83 crore) / 3,00,000 = **25,027.67**

Price closed bar 3 at 25,035, 7.3 points above VWAP: today's average participant is slightly in profit on longs.` },
      { h: 'India', md: `> [!india] Most Indian broker charting platforms offer session VWAP on intraday charts that resets at 09:15. For stocks, VWAP uses the stock's own volume; for indices, check whether it uses futures data. The NSE also publishes the day's volume-weighted average price for each stock.` },
      { h: 'US & global', md: `> [!us] VWAP is perhaps the single most widely used intraday benchmark among US institutional traders. Some US traders include pre-market volume in VWAP and some do not; results differ. Be consistent.` },
      { h: 'Common misconceptions', md: `- **"Institutions buy at VWAP, so price bounces there."** They target average price; there is no obligation to defend VWAP.
- **"VWAP works on daily charts."** Session VWAP resets each day; on daily charts use anchored VWAP instead.
- **"Above VWAP = buy."** It shows bias, not entry.
- **"VWAP at 09:20 is meaningful."** Early VWAP is based on very little data.` },
      { h: 'When it fails', md: `Bank Nifty is above VWAP all morning. At 13:30 an unexpected regulatory headline hits; price pierces VWAP at 56,020. A trader treats it as a "VWAP pullback" and buys at 56,030, stop 55,980 (50 points, ₹1,500 per lot). Heavy selling continues; price falls to 55,700. Stopped for ₹1,500 plus charges. If he had no stop, the loss would be ₹9,900. News overrides any technical reference line.` },
      { h: 'Exercise', md: `1. Compute VWAP by hand for five bars of your choosing and compare with the app.
2. In the Chart Lab, count how many synthetic days price stayed on one side of VWAP after 10:30 versus crossing it repeatedly.
3. Paper-trade the VWAP pullback plan 20 times and record results in your Journal, including the times the pullback failed.` },
    ],
    check: [
      { q: "Two bars: TP 100 with volume 1,000, TP 104 with volume 3,000. VWAP?", o: ["101", "102", "103", "104"], a: 2, why: "(100×1,000 + 104×3,000)/4,000 = 4,12,000/4,000 = 103." },
      { q: "Price has crossed VWAP eight times by noon. Best interpretation?", o: ["Strong uptrend", "Balanced/range day; VWAP acting as a magnet", "Data error", "VWAP pullback buy signal"], a: 1, why: "Frequent crossings indicate balance, where trend-style VWAP pullback trades work poorly." },
    ],
    refs: ['Brian Shannon — Maximum Trading Gains with Anchored VWAP (book)', 'Robert Kissell — The Science of Algorithmic Trading and Portfolio Management (book)', 'Stephen Berkowitz, Dennis Logue, Eugene Noser — The total cost of transactions on the NYSE, Journal of Finance (1988, article; VWAP benchmark)', 'NSE — Security-wise price and volume data (nseindia.com)'],
  });

  L({
    id: 'l1-volume', module: 'L1-M4', track: 'ta', title: 'Reading volume', mins: 16,
    summary: 'Use relative volume to judge the strength behind breakouts, trends and reversals, and recognise the times of day and events that distort volume.',
    evidence: 'mixed',
    sections: [
      { h: 'Beginner view', md: `Volume is the number of shares (or contracts) traded in a period. Price tells you *what* happened; volume tells you *how much participation* was behind it.

A useful analogy: a cricket crowd. A boundary hit in front of a full stadium is a big event; the same shot in an empty practice net means less. A price breakout on heavy volume shows that many participants were involved. A breakout on thin volume may be just a few orders.

Important: every trade has a buyer and a seller. High volume does not mean "more buyers". It means more trading. Direction must come from price.` },
      { h: 'Intermediate view', md: `### Relative volume (RVOL)
Raw volume is meaningless without comparison. Compare the current bar's volume with the average volume **for the same time of day** over recent sessions.

- RVOL 2.0 at 11:00 means twice the usual 11:00 volume: something is happening.
- RVOL 2.0 at 09:15 may be normal, because the open is always busy.

### Classic volume readings
| Price action | Volume | Common interpretation |
|---|---|---|
| Breakout above level | High RVOL | Participation supports the move |
| Breakout above level | Low RVOL | Higher chance of failure |
| Trend continuation candles | Steady/rising | Healthy trend |
| Pullback | Declining | Orderly, not aggressive selling |
| Climactic spike after a long move | Very high | Possible exhaustion or capitulation |
| Tight range | Very low | Compression; a move may follow |

### The intraday "U-shape"
NSE volume is usually highest in the first hour and last hour and lowest around lunch. Never compare a 12:30 bar with a 09:20 bar.

[[chart:RELIANCE:19:vol,vwap]]` },
      { h: 'Advanced view', md: `### Evidence status: mixed
The link between volume and subsequent price behaviour is studied widely. There is evidence that trading volume relates to volatility and to information arrival; evidence for simple rules like "breakouts on high volume continue more often" is mixed and depends on market and definition. Treat volume as **confirming or questioning** a price story, not as a signal.

### Professional refinements
- **Volume at price** (volume profile) shows where trading concentrated; see [[link:l2-volume-profile]].
- **OBV** (on-balance volume) and **accumulation/distribution** accumulate volume by direction; they are crude and should not be read as "smart money buying".
- **Derivatives vs cash.** A stock's futures volume and options activity can spike around expiry and rollover independent of conviction.
- **Distortions.** Index rebalancing days, block deals, F&O expiry, results days and the closing session all create volume unrelated to intraday direction.

Institutional jargon ("absorption", "accumulation") describes possibilities; a volume bar alone cannot prove who traded or why.` },
      { h: 'The maths', md: `:::formula
RVOL = Current bar volume / Average volume of the same time bar over the last N sessions
Volume spike test (one convention): RVOL ≥ 2
OBV_t = OBV_(t−1) + Volume_t if Close up; − Volume_t if Close down; unchanged if flat
:::

**Example (HDFC Bank-style stock, 11:00–11:05 bar).** Volume today = 1,80,000 shares. The 11:00 bar's volumes over the last 10 sessions average 75,000.
- RVOL = 1,80,000 / 75,000 = **2.4**.
- Price broke above the morning high on this bar. Reading: participation is unusually high for that time; the breakout has volume support. It is not a guarantee.

**Contrast.** At 09:20 the same stock trades 4,00,000 shares in five minutes, but the 09:20 average is 4,20,000. RVOL = **0.95**: perfectly normal for the open.` },
      { h: 'India', md: `> [!india] Delivery percentage (share of traded quantity marked for delivery) is published daily by NSE for each stock. It is sometimes used to distinguish speculative intraday volume from investors taking delivery. It is end-of-day data, so treat it as context for tomorrow, not an intraday signal.` },
      { h: 'US & global', md: `> [!us] US volume is fragmented across exchanges and off-exchange venues (dark pools, wholesalers). Consolidated volume includes all of them. Significant volume occurs in the closing auction, especially on index-rebalance and options-expiry days.` },
      { h: 'Common misconceptions', md: `- **"High volume = buying."** Every trade has both sides.
- **"Volume leads price."** Sometimes; often they move together.
- **"Raw volume comparisons work across the day."** Use time-of-day RVOL.
- **"OBV rising means institutions are accumulating."** It means up-closes had more volume; motives are unknown.` },
      { h: 'When it fails', md: `A mid-cap breaks above its morning high at ₹540 on RVOL 3.1. A trader buys 300 shares at ₹541 with stop ₹536. Much of the volume came from one large seller filling every bid at the high, and once that seller finishes, demand dries up. Price slides to ₹535 within 20 minutes; stopped for ₹1,500 plus charges. High volume confirmed activity, not direction or continuation.` },
      { h: 'Exercise', md: `1. In the Chart Lab, mark breakouts on synthetic charts and classify by RVOL (below 1, 1–2, above 2). Track what happened next over 30 examples.
2. Calculate OBV for ten bars by hand.
3. Journal: add an RVOL column to your trade log.` },
    ],
    check: [
      { q: "11:30 bar volume 90,000; average 11:30 volume 60,000. RVOL?", o: ["0.67", "1.5", "2.0", "30,000"], a: 1, why: "90,000 / 60,000 = 1.5." },
      { q: "Why is high raw volume at 09:15 often not significant?", o: ["The open is always high-volume; RVOL may be normal", "Volume data is wrong at the open", "SEBI caps opening volume", "Only institutions trade then"], a: 0, why: "Opening volume is routinely heavy; time-of-day comparison is what matters." },
    ],
    refs: ['Joseph Granville — Granville\'s New Key to Stock Market Profits (book; OBV)', 'Jonathan Karpoff — The relation between price changes and trading volume: a survey, Journal of Financial and Quantitative Analysis (1987, article)', 'Buff Dormeier — Investing with Volume Analysis (book)', 'NSE — Security-wise delivery position data (nseindia.com)'],
  });

  Q([
    { id: 'L1-M4-q01', module: 'L1-M4', d: 1, q: "Which moving average weights recent prices more heavily?", o: ["SMA", "EMA", "Both equally", "Neither"], a: 1, why: "The EMA uses a multiplier k = 2/(N + 1) that gives more weight to recent closes." },
    { id: 'L1-M4-q02', module: 'L1-M4', d: 2, q: "EMA yesterday 500, today's close 510, N = 9. Today's EMA?", o: ["500", "502", "505", "510"], a: 1, why: "k = 0.2; 500 + 0.2 × (510 − 500) = 502." },
    { id: 'L1-M4-q03', module: 'L1-M4', d: 2, q: "Average lag of a 21-period SMA, in bars?", o: ["5", "10", "21", "42"], a: 1, why: "(N − 1)/2 = 10 bars." },
    { id: 'L1-M4-q04', module: 'L1-M4', d: 2, q: "AvgGain = 2.0, AvgLoss = 1.0. RSI?", o: ["33.3", "50", "66.7", "80"], a: 2, why: "RS = 2; RSI = 100 − 100/3 = 66.7." },
    { id: 'L1-M4-q05', module: 'L1-M4', d: 3, q: "Previous AvgGain 0.9, AvgLoss 0.9 (N = 14). Today close falls ₹1.40. New RSI is approximately…", o: ["About 55", "Exactly 50", "About 47", "About 20"], a: 2, why: "AvgGain = 0.9×13/14 = 0.836; AvgLoss = (0.9×13 + 1.4)/14 = 0.936; RS = 0.893; RSI = 100 − 100/1.893 ≈ 47.2. It dips below 50 because the bar was a loss, but Wilder smoothing keeps the change small." },
    { id: 'L1-M4-q06', module: 'L1-M4', d: 2, q: "RSI holds between 45 and 80 for a whole morning while price rises. This most likely shows…", o: ["A range", "A persistent uptrend in momentum terms", "Imminent crash", "Indicator error"], a: 1, why: "In uptrends RSI often oscillates in a higher band, rarely reaching 30." },
    { id: 'L1-M4-q07', module: 'L1-M4', d: 2, q: "Bars: TP 200 vol 500; TP 202 vol 500; TP 206 vol 1,000. Session VWAP?", o: ["202.67", "203.5", "204", "206"], a: 1, why: "(1,00,000 + 1,01,000 + 2,06,000)/2,000 = 4,07,000/2,000 = 203.5." },
    { id: 'L1-M4-q08', module: 'L1-M4', d: 2, q: "Why do institutions care about VWAP?", o: ["SEBI mandates buying at VWAP", "It is a common benchmark for judging execution quality on large orders", "VWAP predicts tomorrow's price", "It sets circuit limits"], a: 1, why: "Execution is often benchmarked to VWAP; nothing obliges anyone to trade at or defend it." },
    { id: 'L1-M4-q09', module: 'L1-M4', d: 3, q: "You are long Nifty futures (1 lot, 65) from 25,040 with VWAP at 25,010. A news headline drives price to 24,990 and it holds below VWAP for three bars. Your plan says VWAP loss invalidates the bias. Best action?", o: ["Add another lot at VWAP", "Exit per plan; loss ≈ 50 × 65 = ₹3,250 plus charges", "Remove the stop and wait", "Switch to a 1-min chart for a better reading"], a: 1, why: "The plan's invalidation has occurred; following it caps loss. Adding or removing stops increases risk." },
    { id: 'L1-M4-q10', module: 'L1-M4', d: 2, q: "Bar volume 1,20,000 at 12:15; average 12:15 volume 1,50,000. RVOL and reading?", o: ["0.8 — below-normal participation", "1.25 — above normal", "2.0 — spike", "Cannot compute"], a: 0, why: "1,20,000 / 1,50,000 = 0.8: less activity than usual for that time." },
    { id: 'L1-M4-q11', module: 'L1-M4', d: 2, q: "Which statement about volume is correct?", o: ["High volume means more buyers than sellers", "Every trade has a buyer and seller; volume measures activity, not direction", "Volume always leads price", "Low volume means price will fall"], a: 1, why: "Volume counts matched trades; direction must be read from price." },
    { id: 'L1-M4-q12', module: 'L1-M4', d: 3, q: "A 9/20 EMA crossover system trades a range day with six signals, average loss 40 points per trade on 1 lot of Bank Nifty futures (lot 30), charges ≈ ₹1,000 per round trip. Approximate day result?", o: ["−₹6,000", "−₹7,200", "−₹13,200", "+₹7,200"], a: 2, why: "6 × (40 × 30 + 1,000) = 6 × 2,200 = −₹13,200. −₹7,200 ignores charges, −₹6,000 counts only charges, and a run of losses cannot produce a gain." },
    { id: 'L1-M4-q13', module: 'L1-M4', d: 1, q: "Which indicator in this module has an 'established' evidence label for its calculation and benchmark role?", o: ["RSI crossover rules", "VWAP", "EMA crossovers", "Divergences"], a: 1, why: "VWAP's calculation and benchmark use are established facts; whether price respects it is a tendency." },
  ]);

  /* ======================= L1-M5 Risk before reward ======================= */

  L({
    id: 'l1-why-risk', module: 'L1-M5', track: 'risk', title: 'Why most intraday traders lose, and what that means for you', mins: 16,
    summary: 'Explain the structural reasons intraday trading is hard — costs, competition, leverage and behaviour — and turn them into concrete rules for your first year.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Before learning a single strategy, you should know the base rate: **most individual intraday and F&O traders lose money**. This is not pessimism; it is the starting point any honest professional would give you.

SEBI has published studies of individual traders. Its study of equity intraday traders (published July 2023, covering FY2019, FY2022 and FY2023 samples) found that a large majority of individual intraday traders made net losses, and that traders who traded more frequently had higher loss rates. Its F&O studies (January 2023 and September 2024) found roughly nine in ten individual F&O traders lost money over the periods studied (verify details on sebi.gov.in).

Think of it like learning to fly. Most people who try to fly without training crash. Pilots survive because they follow procedures that keep small errors from becoming fatal. In trading, those procedures are risk rules.` },
      { h: 'Intermediate view', md: `### Four structural headwinds
1. **Costs are certain; edge is uncertain.** Every trade pays STT, fees, GST, spread and slippage. A random strategy loses roughly its costs over time. See [[link:l1-india-costs]].
2. **Competition.** Your counterparty is often a professional market maker, an arbitrage desk or an algorithm with faster data and lower costs. Short-horizon price moves in liquid instruments are hard to predict, and whatever predictability exists is competed for by faster participants.
3. **Leverage.** Intraday margin and futures magnify mistakes. A few bad days can remove months of gains.
4. **Behaviour.** Humans cut winners early (to lock in the pleasure) and let losers run (to avoid the pain of admitting a loss), revenge-trade after losses and overtrade when bored. This "disposition effect" is well documented in finance research.

### What this means in practice
| Headwind | Rule that addresses it |
|---|---|
| Costs | Minimum target ≥ 3× round-trip cost; fewer, better trades |
| Competition | Trade liquid instruments at times and setups you have tested |
| Leverage | Fixed risk per trade (0.5–1% of capital), leverage ceiling |
| Behaviour | Written plan, stop placed with entry, daily loss limit, journal |` },
      { h: 'Advanced view', md: `### Variance hides skill for a long time
Even with a genuine small edge, results over a few dozen trades are dominated by luck. A strategy with positive expectancy can easily have a losing month; a strategy with negative expectancy can easily have a winning one. That is why beginners who start with a lucky streak often increase size just before the luck turns.

### Survival comes before profitability
Professionals view the first goal as **not blowing up** while data accumulates. With 1% risk per trade, ten consecutive losses cost about 10% of capital. With 5% risk per trade, the same streak costs about 40%. Losing streaks of that length are not rare: with a 50% win rate, the chance of at least one run of eight losses somewhere in 250 trades is roughly 38% (a simple probability calculation, not a backtest).

### A realistic progression
Paper trading → small live size → gradual scaling only after a large sample shows a positive expectancy after costs. This academy's Level 4 has a structured readiness framework ([[link:l4-readiness]]).` },
      { h: 'The maths', md: `:::formula
Expected net per trade = Gross expectancy − Average cost per trade
Loss after n consecutive losses at risk r = 1 − (1 − r)^n
:::

**Cost reality.** A random-entry strategy with zero gross edge, trading 1 lot of Nifty futures 4 times a day at ≈ ₹968 per round trip, loses ≈ ₹3,870 per day on average, ≈ ₹8.5 lakh over 220 days. Zero edge does not mean zero loss.

**Streak arithmetic.**
- Risk 1% per trade, 10 losses: 1 − 0.99^10 ≈ **9.6%** drawdown.
- Risk 2%: 1 − 0.98^10 ≈ **18.3%**.
- Risk 5%: 1 − 0.95^10 ≈ **40.1%**, needing +67% to recover.` },
      { h: 'India', md: `> [!india] Indian social media is full of P&L screenshots. You see the survivors, not the many accounts that were closed (survivorship bias). The SEBI studies are a better reference because they cover all individual traders in the sample, not the ones who chose to post.` },
      { h: 'US & global', md: `> [!us] Studies of day traders in other markets point in the same direction. A widely cited study of Taiwanese day traders by Barber, Lee, Liu and Odean found that only a small fraction were predictably profitable after costs over time. The US change to the pattern-day-trader rule in 2026 makes access easier; it does not change the economics.` },
      { h: 'Common misconceptions', md: `- **"I'll be in the profitable minority because I'm disciplined."** Everyone believes this; the base rate already includes disciplined people.
- **"I need a better strategy."** Most beginners need better risk control first.
- **"Losses are just tuition."** Only if you are recording and learning from them.
- **"If professionals make money, so can I with the same indicators."** Their edge is often execution, cost, information and risk management.` },
      { h: 'When it fails', md: `A beginner starts with ₹3 lakh. His first ten trades win ₹42,000, mostly on one big Bank Nifty move. Convinced, he doubles size and removes his daily loss limit. A trending day against him produces four losing trades and one revenge trade: −₹68,000 in a day. His account falls from a peak of ₹3.42 lakh to ₹2.74 lakh, below where he started; he now needs about +25% just to regain the peak. The original "edge" was never measured; ten trades was luck plus leverage.` },
      { h: 'Exercise', md: `1. Use the risk-of-ruin widget with a 50% win rate, 1.5R average win and risk of 1%, 2% and 5% per trade. Write down what changes.
2. Draft your first-year rules: risk per trade, daily loss limit, maximum trades per day, minimum target versus cost.
3. Journal: commit to paper trading at least 100 trades before any live trade.

[[widget:ror]]

[[widget:monte-carlo]]` },
    ],
    check: [
      { q: "You trade a strategy with zero gross edge 4 times a day. What happens over a year?", o: ["You break even", "You lose roughly your total costs", "You win half the time and profit", "It depends only on win rate"], a: 1, why: "With zero gross expectancy, costs are the expected result: a steady loss. Win rate alone doesn't decide profit." },
      { q: "At 2% risk per trade, what drawdown do ten straight losses cause (approx.)?", o: ["2%", "10%", "18%", "20%"], a: 2, why: "1 − 0.98^10 ≈ 18.3%. 20% would be the non-compounded approximation." },
    ],
    refs: ['SEBI — Analysis of intraday trading by individuals in equity cash segment, July 2023 (sebi.gov.in)', 'SEBI — Study on analysis of profit and loss of individual traders dealing in equity F&O, Jan 2023 and Sep 2024 (sebi.gov.in)', 'Brad Barber, Yi-Tsung Lee, Yu-Jane Liu, Terrance Odean — Do day traders rationally learn about their ability? (working paper) and The cross-section of speculator skill: evidence from day trading, Journal of Financial Markets (2014, article)', 'Hersh Shefrin, Meir Statman — The disposition to sell winners too early and ride losers too long, Journal of Finance (1985, article)', 'Nassim Nicholas Taleb — Fooled by Randomness (book)'],
  });

  L({
    id: 'l1-position-sizing', module: 'L1-M5', track: 'risk', title: 'Position sizing: the one skill that keeps you in the game', mins: 18,
    summary: 'Size any cash, futures or options trade from a fixed risk budget and a stop distance, and check it against liquidity and leverage limits.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Position sizing answers: **how many shares or lots should I trade?** Most beginners decide by feel ("200 shares feels right") or by how much margin is available. Professionals decide by working backwards from how much they are willing to lose if the stop is hit.

The idea is simple:
1. Decide your maximum loss per trade, as a small percentage of your capital (often 0.5–1%).
2. Decide where your stop goes based on the chart, not on money.
3. Quantity = money at risk ÷ distance to stop.

This makes every trade risk the same amount, whether the stop is tight or wide. A wide stop means fewer shares; a tight stop means more. Your losses stay predictable, and predictable losses are survivable.` },
      { h: 'Intermediate view', md: `### Step-by-step (cash equity)
1. Capital: ₹2,00,000. Risk per trade 1% = ₹2,000.
2. Setup: buy Reliance-style stock at ₹1,400; stop below structure at ₹1,388. Stop distance = ₹12.
3. Add a slippage buffer for the stop, e.g. ₹0.50 → effective risk ₹12.50.
4. Shares = 2,000 / 12.50 = **160**.
5. Position value = 160 × 1,400 = ₹2,24,000 → leverage 1.12x. Check it is within your leverage ceiling. If your ceiling is 1x (no borrowed money), capital is the binding limit: floor(2,00,000 / 1,400) = 142 shares, and your actual risk falls to 142 × 12.50 = ₹1,775. The position-size calculator shows exactly this when leverage is set to 1.
6. Check liquidity: 160 shares is trivial for a Nifty heavyweight.

### Futures (lot-constrained)
Lots = Risk budget / (Stop points × Lot size). Always **round down**. If the result is below 1, the correct answer is **no trade** (or trade cash instead), not "1 lot anyway".

### Long options
Risk is the premium you could lose, up to your stop on the premium. Lots = Risk budget / (Premium stop distance × Lot size).

[[widget:position-size]]` },
      { h: 'Advanced view', md: `### Fixed fractional versus fixed rupee
Risking a fixed **percentage** of current equity shrinks size after losses and grows it after gains. This slows drawdowns automatically. Risking a fixed **rupee** amount is simpler and stable for beginners; recompute it monthly.

### Volatility-adjusted stops
Stops based on ATR (average true range) make stop distance proportional to current volatility; position sizing then makes risk constant. Covered in [[link:l2-volatility]].

### Portfolio heat
If you hold three positions at 1% risk each in highly correlated stocks (three private banks), your real risk is closer to 3% on one idea. Professionals cap **total open risk** (heat), e.g. 2–3% at once. See [[link:l3-correlation]].

### Kelly is a ceiling, not a target
The Kelly criterion gives a theoretical growth-maximising bet size given a known edge. Real edges are uncertain and estimated with error; full Kelly produces brutal drawdowns. Practitioners who use it at all use a small fraction. At Level 1, use a fixed small percentage.` },
      { h: 'The maths', md: `:::formula
Quantity = Risk budget / (|Entry − Stop| + Slippage allowance)
Futures lots = floor(Risk budget / (Stop points × Lot size))
Actual risk = Quantity × (|Entry − Stop| + Slippage)
:::

**Example 1 — HDFC Bank-style stock.** Capital ₹5,00,000; risk 0.5% = ₹2,500. Entry ₹1,000, stop ₹993, slippage ₹0.30 → 7.30. Shares = 2,500 / 7.30 = 342.5 → **342**. Value ₹3,42,000.

**Example 2 — Nifty futures.** Capital ₹5,00,000; risk 1% = ₹5,000. Stop 45 points, lot 65. Risk per lot = 2,925 → lots = floor(5,000 / 2,925) = **1**. Actual risk ₹2,925.

**Example 3 — Bank Nifty futures.** Same capital, 1% risk; stop 180 points, lot 30. Risk per lot = 5,400 > 5,000 → **0 lots. No trade.**

**Example 4 — Nifty call.** Premium ₹120, stop on premium ₹90 (₹30), lot 65. Risk per lot ₹1,950. With ₹5,000: floor(2.56) = **2 lots**.` },
      { h: 'India', md: `> [!india] After the 2024–2026 lot-size increases, many small Indian accounts cannot take even one index futures lot within a 1% risk rule. That is information, not an obstacle to work around. Cash equity allows exact sizing at any account size.` },
      { h: 'US & global', md: `> [!us] US traders can size to the single share, and micro futures (e.g. Micro E-mini S&P 500, one-tenth of the E-mini) make lot constraints much less binding. Many US brokers also offer fractional shares, though not always for intraday short-term trading.` },
      { h: 'Common misconceptions', md: `- **"Position size = how much margin I have."** Margin sets the maximum, not the right size.
- **"Tight stops let me trade bigger, so they're better."** Tight stops are hit more often by noise.
- **"I'll size up when I'm confident."** Confidence is not measured edge.
- **"Rounding up one lot is fine."** It silently breaks your risk rule.` },
      { h: 'When it fails', md: `You size correctly for a ₹12 stop, buying 160 shares with ₹2,000 at risk. At 14:10 the company announces disappointing guidance; price gaps from ₹1,395 to ₹1,370 within seconds and your stop fills at ₹1,371. Loss = 29 × 160 = ₹4,640, 2.3x your planned risk. Position sizing controls normal losses; it cannot stop gap risk. Defences: smaller risk per trade around known events, avoiding results days, and a daily loss limit.` },
      { h: 'Exercise', md: `1. Size these in the calculator with ₹3,00,000 and 1% risk: (a) stock at ₹850, stop ₹842; (b) Nifty futures, 30-point stop; (c) Bank Nifty futures, 120-point stop.
2. Write your risk-per-trade rule and maximum open heat in your trading plan.
3. For every paper trade this week, write planned risk and actual loss and compute the ratio.` },
    ],
    check: [
      { q: "Capital ₹4,00,000, risk 1%. Entry ₹500, stop ₹492, ignore slippage. Shares?", o: ["400", "500", "800", "50"], a: 1, why: "₹4,000 / ₹8 = 500 shares." },
      { q: "Risk budget ₹3,000. Bank Nifty stop 150 points, lot 30. Correct size?", o: ["1 lot", "0 lots — no trade", "2 lots", "Use half a lot"], a: 1, why: "Risk per lot = 4,500 > 3,000, so the rule says no futures trade. Half lots don't exist." },
      { q: "Three open trades in three private banks at 1% risk each. Your effective risk is best described as…", o: ["1%", "Up to about 3% on one correlated idea", "0.33%", "Zero, they diversify"], a: 1, why: "Highly correlated positions behave like one bigger position." },
    ],
    refs: ['Van K. Tharp — Trade Your Way to Financial Freedom (book; position sizing)', 'Ralph Vince — The Mathematics of Money Management (book)', 'Edward O. Thorp — The Kelly criterion in blackjack, sports betting and the stock market (paper, 2006)', 'NSE — Equity derivatives contract specifications (nseindia.com)'],
  });

  L({
    id: 'l1-stops', module: 'L1-M5', track: 'risk', title: 'Stop-losses: placement, types and discipline', mins: 17,
    summary: 'Place stops where your trade idea is proven wrong, pick the right stop type, and build the discipline to never widen one.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `A stop-loss is a pre-decided exit for a losing trade. It answers: **at what price is my idea wrong?** It is not a measure of how much pain you can take; it is a statement about the market.

Why it matters: without stops, one bad trade can wipe out weeks of good ones. Every trader has trades that go wrong; the difference is whether the loss is small and planned or large and emotional.

The two disciplines you will practise all year:
1. Decide the stop **before** entering, and place it as soon as you are filled.
2. **Never move it further away.** Moving it closer to lock in profit is fine; moving it away is how small losses become big ones.` },
      { h: 'Intermediate view', md: `### Where to place stops
| Method | Example | Pros | Cons |
|---|---|---|---|
| Structure | Below the pullback low or opening-range low | Logical invalidation | Obvious levels attract stop runs |
| Volatility (ATR) | 1–1.5 × 5-min ATR beyond entry | Adapts to conditions | Ignores structure |
| Indicator | Below VWAP or the 20 EMA | Objective | Line can be pierced briefly |
| Time | Exit if no progress by 30 min or at 15:10 | Frees capital, limits exposure | May exit before the move |
| Rupee | "Exit at −₹2,000" | Simple | Ignores the chart; arbitrary |

Best practice is **structure first, adjusted for volatility**: place the stop beyond the level that invalidates your idea, plus a buffer of a fraction of ATR, then size the position so the rupee risk fits your rule.

### Types of stop
- **Hard stop at exchange** (SL / SL-M): executes without you.
- **Mental stop**: no execution; avoid as a beginner.
- **Trailing stop**: moves with price in your favour (e.g. below each higher low).
- **Break-even stop**: moved to entry after a certain gain; reduces losses but increases small scratches.

[[chart:RELIANCE:29:atr,vwap]]` },
      { h: 'Advanced view', md: `### Stop runs and liquidity
Obvious stops (just below a round number or yesterday's low) cluster. Price sometimes trades briefly through such clusters before reversing. Some traders place stops a little beyond the obvious level, accepting a slightly larger risk with smaller size. Do not assume every stop-run is "smart money hunting"; it is often simply that liquidity sits there.

### Trade-off between stop distance and win rate
Tight stops get hit more often by noise (lower win rate, larger size); wide stops get hit less often (higher win rate, smaller size). There is no universally best distance; it depends on the setup and must be tested. What does not change: the stop must sit where the setup is invalid, not where it feels comfortable.

### Discipline as a system
Professional desks enforce stops with risk software. Individual traders can copy this: stop placed with the entry as a bracket or OCO order where available; a daily loss limit after which the platform is closed; a journal column for "stop moved away? Y/N".` },
      { h: 'The maths', md: `:::formula
Stop = Structure level − Buffer (long) ;  Buffer = m × ATR
Risk per unit = Entry − Stop
R-multiple of exit = (Exit − Entry) / (Entry − Stop)
:::

**Example (Nifty futures, 5-min ATR 16 points).** Long at 25,060 after a pullback low at 25,032. Buffer 0.5 × ATR = 8 → stop 25,024. Risk = 36 points = ₹2,340 per lot.
- Exit at 25,132 → R = 72 / 36 = **+2R**.
- Exit at 25,024 → **−1R**.
- If you had moved the stop to 24,990 "to give it room" and been hit: −70 points = **−1.94R**, nearly double the planned loss.` },
      { h: 'India', md: `> [!india] Many Indian brokers offer bracket-style or GTT OCO orders that place stop and target together; availability changes, so check your broker. In options, SL-M is often blocked; use SL with a reasonable limit buffer and monitor it. Around 09:15 and on expiry afternoons, buffers may need to be wider.` },
      { h: 'US & global', md: `> [!us] US platforms commonly support OCO brackets and trailing stops natively. Note that stops are usually held by the broker and triggered on last sale; in pre-market and after-hours, stops may not trigger at all.` },
      { h: 'Common misconceptions', md: `- **"Stops make me lose more often."** They make losses smaller; without them, a few huge losses dominate results.
- **"I'll set the stop where I can afford to lose."** Position size handles affordability; the stop belongs where the idea fails.
- **"Moving my stop to break-even is always smart."** It can turn good trades into scratches; test it.
- **"Big traders don't use stops."** They have risk limits enforced by systems.` },
      { h: 'When it fails', md: `You buy Bank Nifty futures at 56,100 with a stop at 56,020 (80 points, ₹2,400). Price drops to 56,030; you think "it's about to bounce" and move the stop to 55,900. Price falls to 55,880 and you exit there: −220 points = ₹6,600, 2.75R. The next day you need nearly three good trades just to recover. The stop worked the first time; the discipline failed.` },
      { h: 'Exercise', md: `1. Paper-trade 20 setups. For each, write the invalidation level before entering, place the stop with the entry, and record whether you touched it afterwards.
2. Compare structure-only stops versus structure + 0.5 ATR stops on the same chart in the Chart Lab.
3. Add the "stop moved away?" column to your Journal.

[[widget:rr]]` },
    ],
    check: [
      { q: "Entry 800, stop 792, exit 820. R-multiple?", o: ["+1.5R", "+2.5R", "+20R", "+2R"], a: 1, why: "Reward 20 / risk 8 = 2.5R." },
      { q: "Which stop placement best follows the principle 'the stop is where the idea is wrong'?", o: ["₹2,000 below entry because that's affordable", "Just beyond the pullback low that defines the setup, plus a small ATR buffer", "At a random round number", "No stop; exit when it feels wrong"], a: 1, why: "Structure-based invalidation with a volatility buffer ties the stop to the market, and size handles the rupee risk." },
    ],
    refs: ['Van K. Tharp — Trade Your Way to Financial Freedom (book; R-multiples)', 'Mark Douglas — Trading in the Zone (book)', 'J. Welles Wilder — New Concepts in Technical Trading Systems (book; ATR)', 'Alexander Elder — Come Into My Trading Room (book; stops)'],
  });

  L({
    id: 'l1-expectancy', module: 'L1-M5', track: 'risk', title: 'Win rate, R:R and expectancy', mins: 17,
    summary: 'Compute expectancy in R and rupees from a trade list, see why win rate alone is meaningless, and know how many trades you need before trusting the number.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `People love asking "what's your win rate?" It is the wrong first question. A strategy that wins 80% of the time can lose money if its losses are large. A strategy that wins 35% of the time can make money if its wins are big.

What matters is **expectancy**: on average, how much do you make or lose per trade, after costs? Think of a shop: it doesn't matter how many customers buy something if the shop loses money on each sale.

Expectancy combines how often you win, how much you win and how much you lose. It is the single most important number in your trading journal.` },
      { h: 'Intermediate view', md: `### Measuring in R
Express every trade's result in **R** (multiples of the planned risk). A trade that risked ₹2,000 and made ₹3,000 is +1.5R. This lets you compare trades of different sizes.

### Win rate and R:R together
| Win rate | Avg win | Avg loss | Expectancy per trade |
|---|---|---|---|
| 40% | 2.0R | 1R | 0.4×2 − 0.6×1 = **+0.20R** |
| 60% | 1.0R | 1R | 0.6 − 0.4 = **+0.20R** |
| 60% | 1.0R | 1.5R | 0.6 − 0.6 = **0R** |
| 80% | 0.5R | 2.5R | 0.4 − 0.5 = **−0.10R** |
| 35% | 2.5R | 1R | 0.875 − 0.65 = **+0.225R** |

### Breakeven win rate
For a given average win/loss ratio, there is a win rate below which you lose. With 2:1, you need more than 33.3%; with 1:1, more than 50%; with 1:2 (you risk 2 to make 1), more than 66.7%. And all of these move higher once you include costs.

[[widget:expectancy]]` },
      { h: 'Advanced view', md: `### Sample size
Expectancy from 20 trades is mostly noise. The standard error of the average R shrinks with the square root of the number of trades. If your trade results have a standard deviation of about 1.3R, the standard error after 30 trades is 1.3 / √30 ≈ 0.24R, larger than the expectancy you are trying to measure. After 400 trades it is about 0.065R. Formal significance testing is covered in [[link:l3-significance]].

### Distribution matters
Two strategies with equal expectancy can feel very different. One has many small wins and rare large losses (e.g. short options); the other has many small losses and rare large wins (trend following). The first looks smooth until it doesn't. Look at the **largest loss**, **longest losing streak** and **maximum drawdown**, not just the average.

### Profit factor
Gross profit ÷ gross loss. Above 1 means profitable overall. Useful as a cross-check; it carries the same sample-size caveats.` },
      { h: 'The maths', md: `:::formula
Expectancy (R) = W × AvgWin(R) − (1 − W) × AvgLoss(R)
Expectancy (₹) = Expectancy (R) × Risk per trade − Average cost per trade
Breakeven win rate = AvgLoss / (AvgWin + AvgLoss)
Standard error of mean R ≈ SD(R) / √n
:::

**Worked example.** 50 paper trades: 22 winners averaging +1.8R, 28 losers averaging −0.9R (some exits before stop). Risk per trade ₹1,500; average costs ₹110.
- W = 22/50 = 0.44.
- Expectancy (R) = 0.44 × 1.8 − 0.56 × 0.9 = 0.792 − 0.504 = **+0.288R**.
- In rupees: 0.288 × 1,500 = ₹432 − ₹110 = **+₹322 per trade**.
- Breakeven win rate = 0.9 / 2.7 = **33.3%** (before costs).
- If SD(R) ≈ 1.3, standard error ≈ 1.3/√50 ≈ 0.18R. The true expectancy could plausibly be anywhere from about −0.08R to +0.65R. Promising, not proven.` },
      { h: 'India', md: `> [!india] Express Indian futures costs in R too. If your Nifty futures risk per trade is ₹2,600 (40 points × 65) and round-trip cost ≈ ₹968, costs are about **0.37R per trade**. A strategy needs gross expectancy above 0.37R just to break even. Cash equity trades with ₹2,000 risk and ₹100 cost carry only ≈ 0.05R.` },
      { h: 'US & global', md: `> [!us] The same arithmetic applies everywhere. Low commissions in US equities make cost-in-R smaller, but spreads in thin stocks and options can still be a large fraction of R.` },
      { h: 'Common misconceptions', md: `- **"High win rate = good strategy."** Only if wins are not dwarfed by losses.
- **"I'm profitable after 15 trades, so it works."** The sample is far too small.
- **"Average R:R target of 3 means I earn 3R on wins."** Planned targets are not realised averages; measure actual exits.
- **"Expectancy is fixed."** It changes with market regime; monitor it in rolling windows.` },
      { h: 'When it fails', md: `A trader's option-selling plan shows 46 winners and 4 losers in 50 trades (92% win rate). Average win ₹900; average loss ₹14,000. Expectancy = 0.92 × 900 − 0.08 × 14,000 = 828 − 1,120 = **−₹292 per trade**. For months his journal felt like success; one bad expiry day revealed the arithmetic.` },
      { h: 'Exercise', md: `1. Enter your last 30 paper trades into the expectancy calculator. Compute expectancy in R and rupees.
2. Compute the standard error and write the plausible range for your true expectancy.
3. Run the Monte Carlo widget on your trade list to see the spread of possible equity curves.

[[widget:monte-carlo]]` },
    ],
    check: [
      { q: "Win rate 30%, average win 3R, average loss 1R. Expectancy?", o: ["−0.1R", "+0.2R", "+0.9R", "0R"], a: 1, why: "0.3 × 3 − 0.7 × 1 = 0.9 − 0.7 = +0.2R." },
      { q: "Average win 1R, average loss 2R. Breakeven win rate before costs?", o: ["33%", "50%", "67%", "80%"], a: 2, why: "2 / (1 + 2) = 66.7%." },
      { q: "Why is expectancy from 20 trades unreliable?", o: ["Expectancy formulas need 1,000 trades by law", "The standard error is large relative to typical expectancies, so luck dominates", "Win rate is undefined below 50 trades", "Costs aren't counted"], a: 1, why: "SE ≈ SD/√n; with n = 20, SE is often bigger than the edge being measured." },
    ],
    refs: ['Van K. Tharp — Trade Your Way to Financial Freedom (book; expectancy and R-multiples)', 'Ralph Vince — The Mathematics of Money Management (book)', 'David Aronson — Evidence-Based Technical Analysis (book)', 'Robert Pardo — The Evaluation and Optimization of Trading Strategies (book)'],
  });

  L({
    id: 'l1-cost-drag', module: 'L1-M5', track: 'risk', title: 'How costs and slippage destroy small edges', mins: 16,
    summary: 'Turn charges, spread and slippage into a per-trade cost in R, and decide whether a strategy has enough edge to survive real-world friction.',
    evidence: 'established',
    sections: [
      { h: 'Beginner view', md: `Imagine a game where you win ₹100 on heads and lose ₹100 on tails, but each toss costs ₹10 to play. Over many tosses you lose ₹10 per toss on average. Now imagine a slightly favourable coin that lands heads 52% of the time. Your gross edge is ₹4 per toss (0.52 × 100 − 0.48 × 100). After the ₹10 fee you still lose ₹6 per toss.

Trading works the same way. Many strategies have **small** genuine edges, and costs (charges, spread, slippage) are **certain**. The more often you trade, and the smaller your target, the more costs dominate. This lesson shows how to measure that before risking money.` },
      { h: 'Intermediate view', md: `### Three layers of friction
| Layer | Where it appears | How to estimate |
|---|---|---|
| Explicit charges | Contract note | Charges calculator |
| Spread | Entry at ask / exit at bid | Typical spread × quantity |
| Slippage | Stops and market orders filled worse than trigger | Journal: fill − planned price |

### Cost in R
Divide total round-trip friction by your risk per trade. This single number tells you how hard your strategy has to work.

| Instrument | Risk per trade | Friction per trade | Cost in R |
|---|---|---|---|
| Large-cap cash, ₹1 lakh position (100 × ₹1,000) | ₹1,000 | ≈ ₹83 charges + ₹10 spread (one ₹0.10 tick) + ₹20 slippage ≈ ₹113 | 0.11R |
| Nifty futures 1 lot, 40-pt stop | ₹2,600 | ≈ ₹968 + 1–2 points slippage (₹65–130) ≈ ₹1,060 | 0.41R |
| Nifty futures 1 lot, 15-pt stop (scalp) | ₹975 | ≈ ₹1,060 | 1.09R |

The last row shows why small-stop futures scalping is almost impossible after 2026 costs: friction exceeds the entire risk.` },
      { h: 'Advanced view', md: `### Turnover is the multiplier
A strategy's annual cost ≈ cost per trade × trades per year. Doubling trade frequency doubles costs; it only doubles profits if the extra trades are as good as the original ones, which is rarely true (the best setups are rare).

### Slippage is not random noise
Slippage is worse exactly when your strategy needs fills most: breakouts (everyone buys at once), stops (everyone sells), opening minutes and news. Backtests that assume fills at the candle's close or at the stop price systematically overstate results. A pessimistic assumption (e.g. 1–2 ticks per side in liquid futures, more in mid-caps, plus the full spread) is safer.

### Capacity
A strategy that works with 100 shares may not work with 10,000, because market impact grows with size. For Level 1 accounts, capacity is rarely binding in liquid names, but it explains why some edges exist only at small scale.

### Taxes
Profits are taxed; losses can be set off subject to rules. Net-of-tax returns are lower still. Consult a tax professional; this is not tax advice.` },
      { h: 'The maths', md: `:::formula
Net expectancy (₹) = Gross expectancy (₹) − (Charges + Spread + Slippage)
Cost in R = Friction per trade / Risk per trade
Required gross edge (R) > Cost in R
Annual friction = Friction per trade × Trades per day × Trading days
:::

**Worked example — intraday cash.** Buy and sell ₹1,00,000 of a large-cap at the same price (₹1,000 × 100 shares).
- Brokerage 40; STT 0.025% × 1,00,000 = 25; transaction 2,00,000 × 307/1 crore = 6.14; SEBI 0.20; GST 18% × (40 + 6.14 + 0.20) = 8.34; stamp 0.003% × 1,00,000 = 3.
- Charges ≈ **₹82.68**. Add one-tick spread (₹0.10 × 100 = ₹10) and slippage ₹0.20/share on the exit (₹20): ≈ **₹113**.
- Break-even move ≈ ₹1.13 per share, **0.11%**.

A strategy targeting 0.3% with a 0.2% stop has gross reward ₹300 and risk ₹200. Friction ₹113 = **0.57R**. A 50% win-rate version earns 0.5 × 300 − 0.5 × 200 = ₹50 gross, **−₹63 net** per trade. Five trades a day × 220 days ≈ **−₹69,000** a year.` },
      { h: 'India', md: `> [!india] Reduce friction honestly: trade fewer, higher-quality setups; prefer liquid large-caps and index instruments; avoid the first minutes after 09:15 unless your plan needs them; use limit orders for entries; compare brokers' total charges, not just the "zero brokerage" headline. Recheck everything when STT or exchange charges change (rates here as of Nov 2026).

[[widget:charges-india]]` },
      { h: 'US & global', md: `> [!us] US zero-commission stock trading reduces explicit charges, but execution quality (price improvement versus the NBBO) varies between brokers. Options carry per-contract fees and often wide spreads. The same cost-in-R test applies.

[[widget:charges-us]]` },
      { h: 'Common misconceptions', md: `- **"Costs are small compared with my profits."** Compare them with your *edge*, not your occasional big win.
- **"My backtest includes brokerage, so it's realistic."** It also needs STT, fees, spread and slippage.
- **"More trades = more profit."** More trades = more friction; profit depends on edge per trade.
- **"Slippage averages out."** It is skewed against you on stops and breakouts.` },
      { h: 'When it fails', md: `A trader's backtest of a 5-minute Bank Nifty futures breakout shows +₹1.8 lakh over a year with 600 trades, using brokerage only. Adding STT, exchange charges, GST and stamp duty (≈ ₹960 per round trip on top of brokerage, at Bank Nifty's lot of 30 and ~56,000; ≈ ₹1,000 including brokerage) costs ≈ ₹5.8 lakh. Adding two points of slippage per side (₹120 per trade) costs a further ₹72,000. Net: about **−₹4.7 lakh**. The "strategy" was a cost-blind illusion.` },
      { h: 'Exercise', md: `1. For your current paper strategy, compute friction per trade and cost in R. If cost in R is above 0.3, write how you will reduce it.
2. Re-run your expectancy with full friction. Does it stay positive?
3. Use the compounding widget to compare an account with +0.15R and +0.05R net per trade over 500 trades at 1% risk.

[[widget:compounding]]` },
    ],
    check: [
      { q: "Risk per trade ₹1,200; friction ₹300. Cost in R?", o: ["0.025R", "0.25R", "2.5R", "4R"], a: 1, why: "300 / 1,200 = 0.25R." },
      { q: "Gross expectancy +0.15R, cost in R 0.20R. What is true?", o: ["Profitable", "Net expectancy is negative (−0.05R)", "Breakeven", "Costs don't apply in R"], a: 1, why: "0.15 − 0.20 = −0.05R per trade: losing after friction." },
    ],
    refs: ['Larry Harris — Trading and Exchanges: Market Microstructure for Practitioners (book)', 'Robert Kissell — The Science of Algorithmic Trading and Portfolio Management (book; transaction costs)', 'Andre Perold — The implementation shortfall: paper versus reality, Journal of Portfolio Management (1988, article)', 'NSE — Transaction charges circular, effective 1 Mar 2026 (nseindia.com)', 'Income Tax Department — Securities Transaction Tax rates (incometaxindia.gov.in)'],
  });

  Q([
    { id: 'L1-M5-q01', module: 'L1-M5', d: 1, q: "What is the first goal of a beginner intraday trader according to this module?", o: ["Maximise monthly returns", "Survive (avoid large drawdowns) while collecting data", "Find a 90% win-rate strategy", "Use maximum leverage while capital is small"], a: 1, why: "Capital preservation comes first; profitability can only be measured with a large sample." },
    { id: 'L1-M5-q02', module: 'L1-M5', d: 2, q: "Capital ₹2,50,000, risk 1%. Entry ₹640, stop ₹630, slippage allowance ₹0.50. Shares?", o: ["250", "238", "390", "25"], a: 1, why: "Risk ₹2,500 / 10.50 = 238.1 → 238 (round down)." },
    { id: 'L1-M5-q03', module: 'L1-M5', d: 2, q: "Risk budget ₹6,000. Nifty futures stop 35 points, lot 65. How many lots?", o: ["1", "2", "3", "0"], a: 1, why: "Risk per lot = 2,275; 6,000 / 2,275 = 2.64 → 2 lots." },
    { id: 'L1-M5-q04', module: 'L1-M5', d: 3, q: "You are long Bank Nifty futures 1 lot (30) at 56,200, stop 56,080. Price trades at 56,100. You move the stop to 55,950 and get hit there. What R did you lose?", o: ["−1R", "−1.5R", "−2.08R", "−0.5R"], a: 2, why: "Planned risk 120 points; actual loss 250 points; 250/120 ≈ 2.08R (₹7,500 vs ₹3,600 planned)." },
    { id: 'L1-M5-q05', module: 'L1-M5', d: 2, q: "Entry ₹1,200, stop ₹1,190, exit ₹1,185 due to slippage. R-multiple?", o: ["−1R", "−1.5R", "−0.5R", "−15R"], a: 1, why: "(1,185 − 1,200) / 10 = −1.5R. Slippage made the loss larger than planned." },
    { id: 'L1-M5-q06', module: 'L1-M5', d: 2, q: "Win rate 55%, average win 1.2R, average loss 1R. Expectancy?", o: ["+0.21R", "+0.55R", "−0.05R", "+0.10R"], a: 0, why: "0.55 × 1.2 − 0.45 × 1 = 0.66 − 0.45 = +0.21R." },
    { id: 'L1-M5-q07', module: 'L1-M5', d: 2, q: "Average win 2.5R, average loss 1R. Breakeven win rate before costs?", o: ["20%", "28.6%", "40%", "50%"], a: 1, why: "1 / (2.5 + 1) = 28.6%." },
    { id: 'L1-M5-q08', module: 'L1-M5', d: 3, q: "A strategy: 90% win rate, average win ₹1,000, average loss ₹12,000. Expectancy per trade?", o: ["+₹900", "−₹300", "+₹300", "−₹1,200"], a: 1, why: "0.9 × 1,000 − 0.1 × 12,000 = 900 − 1,200 = −₹300." },
    { id: 'L1-M5-q09', module: 'L1-M5', d: 3, q: "Trade-result SD is 1.2R. Approximate standard error of the average R after 36 trades?", o: ["0.03R", "0.2R", "1.2R", "0.033R"], a: 1, why: "1.2 / √36 = 1.2 / 6 = 0.2R." },
    { id: 'L1-M5-q10', module: 'L1-M5', d: 2, q: "Risk ₹2,600 per Nifty futures trade, friction ≈ ₹1,050. Cost in R?", o: ["About 0.04R", "About 0.4R", "About 2.5R", "About 4R"], a: 1, why: "1,050 / 2,600 ≈ 0.40R." },
    { id: 'L1-M5-q11', module: 'L1-M5', d: 3, q: "Gross expectancy +₹200 per trade; friction ₹240 per trade; 6 trades/day; 220 days. Expected annual result?", o: ["+₹2,64,000", "−₹52,800", "₹0", "−₹3,16,800"], a: 1, why: "Net −₹40 × 6 × 220 = −₹52,800." },
    { id: 'L1-M5-q12', module: 'L1-M5', d: 2, q: "Why is slippage usually worse on stop orders and breakouts than on limit entries in calm periods?", o: ["Exchanges charge more for stops", "Many participants trade in the same direction at the same moment, thinning the opposite side", "SEBI adds a penalty", "It isn't; slippage is random"], a: 1, why: "Order imbalance at stops and breakouts consumes depth, so fills worsen; it is not a fee." },
    { id: 'L1-M5-q13', module: 'L1-M5', d: 2, q: "At 5% risk per trade, approximate drawdown after 8 consecutive losses?", o: ["8%", "25%", "34%", "40%"], a: 2, why: "1 − 0.95^8 ≈ 33.7%." },
    { id: 'L1-M5-q14', module: 'L1-M5', d: 1, q: "Where should a stop-loss be placed in principle?", o: ["Where the loss feels affordable", "Where the trade idea is invalidated, with a volatility buffer; size handles the rupee amount", "Exactly at a round number", "Nowhere; exit by feel"], a: 1, why: "Stops belong to the market structure; position size converts it to an acceptable rupee risk." },
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
