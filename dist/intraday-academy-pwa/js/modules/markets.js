/* Market Intelligence: DST-safe global clock, market environments, dated specifications. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const { h, prose } = IA.ui;
  const ZONES = ['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Singapore', 'Australia/Sydney', 'UTC'];

  IA.views.markets = (el, tab = 'clock') => {
    const tabs = [['clock', 'Global clock'], ['india', 'India'], ['us', 'United States'], ['global', 'Europe & Asia'], ['assets', 'Other assets'], ['specs', 'Specs & dates']];
    el.append(h('div', { class: 'tabs' }, tabs.map(([k, l]) => h('button', { class: k === tab ? 'on' : '', onclick: () => (location.hash = '#/markets/' + k) }, l))));
    if (tab === 'clock') return clock(el);
    if (tab === 'specs') return specs(el);
    const trackOf = { india: 'india', us: 'us', global: 'global', assets: 'global' }[tab];
    const env = ENV[tab]; el.append(prose(env.md));
    if (env.sessions) { const box = h('div', { class: 'card', style: { marginTop: '12px' } }, h('h3', null, 'Sessions in your time zone')); const tz = IA.settings.tz || Intl.DateTimeFormat().resolvedOptions().timeZone; const today = IA.clock.localYmd(new Date(), 'UTC');
      box.append(IA.ui.table([{ label: 'Exchange', k: 'name' }, { label: 'Local hours', get: (s) => s.main.map((m) => m.join('–')).join(', ') + ' ' + s.tz.split('/')[1].replace('_', ' ') }, { label: `In ${tz}`, get: (s) => IA.clock.sessionWindowsUtc(s, IA.clock.localYmd(new Date(), s.tz)).map(([a, b]) => IA.clock.fmt(new Date(a), tz) + '–' + IA.clock.fmt(new Date(b), tz)).join(', ') }, { label: 'Now', get: (s) => { const x = IA.clock.sessionStatus(s, new Date(), holidays(s.id)); return h('span', { class: 'st-' + x.state }, x.label); } }], IA.specs.sessions.filter((s) => env.sessions.includes(s.id)))); el.append(box); }
    const ls = IA.content.lessonIndex().filter((l) => l.track === trackOf); const written = new Set(IA.content.lessons.map((l) => l.id)); const ts = IA.progress.trackState()[trackOf];
    el.append(h('div', { class: 'card', style: { marginTop: '12px' } }, h('div', { class: 'spread' }, h('h3', null, `${IA.content.tracks[trackOf]} — lessons`), h('span', { class: 'small muted' }, `proficiency ${Math.round((ts?.score || 0) * 100)}%`)), h('div', { class: 'lesson-list' }, ls.map((l) => h('a', { href: written.has(l.id) ? '#/lesson/' + l.id : null }, h('span', { class: 'dot' + (IA.progress.isDone(l.id) ? ' done' : '') }), h('span', { style: { flex: 1 } }, l.title), h('span', { class: 'tiny dim' }, l.module))))));
    if (env.practice) el.append(h('div', { class: 'card', style: { marginTop: '12px' } }, h('h3', null, 'Practise in this environment'), h('div', { class: 'row' }, env.practice.map(([href, l]) => h('a', { class: 'btn', href }, l)))));
  };
  const holidays = (id) => (IA.specs.holidays || {})[id] || [];

  function clock(el) {
    let tz = IA.settings.tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const sel = h('select', { class: 'i', style: { maxWidth: '240px' } }, [...new Set([tz, ...ZONES])].map((z) => h('option', { value: z, selected: z === tz }, z)));
    sel.onchange = async () => { tz = sel.value; IA.settings.tz = tz; await IA.db.set('settings', IA.settings); tick(); };
    const now = h('div', { class: 'kpi' }), rows = h('div'), overlap = h('div', { class: 'card', style: { marginTop: '12px' } });
    el.append(h('div', { class: 'card' }, h('div', { class: 'spread' }, now, h('label', { class: 'f' }, 'Show times in', sel)), h('p', { class: 'small muted' }, 'Conversions use your browser\'s IANA time-zone database, so daylight-saving changes in the US, UK, Europe and Australia are handled automatically. Exchange holidays are not bundled (they change every year) — add them in Settings. The bar shows the next 24 hours in your chosen zone; green = main session, amber = pre/post.'), rows), overlap);
    function tick() {
      const t = new Date(); now.innerHTML = ''; now.append(h('span', { class: 'v' }, IA.clock.fmt(t, tz, { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })), h('span', { class: 'l' }, IA.clock.fmt(t, tz, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + tz));
      rows.innerHTML = ''; const start = t.getTime() - 2 * 3600e3, span = 24 * 3600e3;
      IA.specs.sessions.forEach((s) => {
        const st = IA.clock.sessionStatus(s, t, holidays(s.id)); const bar = h('div', { class: 'timeline' });
        [-1, 0, 1].forEach((dd) => { const day = IA.clock.localYmd(new Date(t.getTime() + dd * 864e5), s.tz); const wd = new Date(day + 'T12:00:00Z').getUTCDay(); if (wd === 0 || wd === 6 || holidays(s.id).includes(day)) return;
          const seg = (a, b, col) => { const x1 = (IA.clock.zonedToUtc(day, a, s.tz).getTime() - start) / span, x2 = (IA.clock.zonedToUtc(day, b, s.tz).getTime() - start) / span; if (x2 < 0 || x1 > 1) return; bar.append(h('i', { style: { left: Math.max(0, x1) * 100 + '%', width: (Math.min(1, x2) - Math.max(0, x1)) * 100 + '%', background: col } })); };
          if (s.pre) seg(s.pre[0], s.pre[1], 'rgba(242,184,75,.35)'); s.main.forEach(([a, b]) => seg(a, b, 'rgba(38,194,129,.55)')); if (s.post) seg(s.post[0], s.post[1], 'rgba(242,184,75,.35)'); });
        bar.append(h('i', { class: 'now', style: { left: (2 / 24) * 100 + '%' } }));
        rows.append(h('div', { class: 'clock-row' }, h('div', null, h('b', null, s.name), h('div', { class: 'tiny dim' }, `${s.country} · ${st.localTime} local`)), bar, h('div', { class: 'small right st-' + st.state }, st.label)));
      });
      // Overlaps today (UTC basis)
      const ymd = IA.clock.localYmd(t, 'UTC'); const win = (id) => { const s = IA.specs.sessions.find((x) => x.id === id); return IA.clock.sessionWindowsUtc(s, IA.clock.localYmd(t, s.tz)); };
      const ov = (a, b) => { let best = null; win(a).forEach(([x1, x2]) => win(b).forEach(([y1, y2]) => { const s1 = Math.max(x1, y1), s2 = Math.min(x2, y2); if (s2 > s1) best = [s1, s2]; })); return best; };
      overlap.innerHTML = ''; overlap.append(h('h3', null, 'Session overlaps (main sessions, today)'), IA.ui.table([{ label: 'Pair', k: 'p' }, { label: `Overlap in ${tz}`, k: 'w' }, { label: 'Why it matters', k: 'y' }], [['NSE', 'LSE', 'Indian afternoon meets the European open — Nifty can react to European flows and DAX/FTSE opening moves.'], ['NSE', 'XETRA', 'Same window as London; European macro data (PMIs, CPI) lands during Indian trading.'], ['LSE', 'NYSE', 'The most liquid overlap globally; US data at 8:30 ET often moves European indices.'], ['TSE', 'NSE', 'Short or no overlap — Japan\'s close is an overnight cue for India.'], ['HKEX', 'NSE', 'Hong Kong afternoon overlaps the Indian morning.']].map(([a, b, y]) => { const o = ov(a, b); return { p: `${a} × ${b}`, w: o ? IA.clock.fmt(new Date(o[0]), tz) + '–' + IA.clock.fmt(new Date(o[1]), tz) : 'none today', y }; })));
    }
    tick(); const iv = setInterval(tick, 1000); return { cleanup: () => clearInterval(iv) };
  }

  function specs(el) {
    const S = IA.specs; el.append(h('p', { class: 'muted' }, 'Every number below is dated. Rates, lot sizes and session times change; edit them in Settings when your exchange or broker publishes changes. The app never fetches them online.'));
    el.append(h('div', { class: 'card' }, h('h3', null, `India — charges (as of ${S.india.asOf})`), h('p', { class: 'small muted' }, S.india.note), IA.ui.table([{ label: 'Segment', get: (g) => g.label }, { label: 'STT buy', get: (g) => (g.sttBuy * 100).toFixed(3) + '%', n: 1 }, { label: 'STT sell', get: (g) => (g.sttSell * 100).toFixed(3) + '%', n: 1 }, { label: 'Exchange txn', get: (g) => '₹' + Math.round(g.txn * 1e7) + '/cr', n: 1 }, { label: 'Stamp (buy)', get: (g) => (g.stampBuy * 100).toFixed(3) + '%', n: 1 }, { label: 'Brokerage (default)', get: (g) => g.brokerage.type === 'minOf' ? `min(₹${g.brokerage.flat}, ${g.brokerage.pct * 100}%)/order` : `₹${g.brokerage.flat}/order` }], Object.values(S.india.segments)), h('p', { class: 'small muted' }, `SEBI fee ₹${Math.round(S.india.sebiFeeRate * 1e7)}/crore · GST ${S.india.gstRate * 100}% on brokerage + exchange + SEBI fees.`)));
    el.append(h('div', { class: 'card', style: { marginTop: '12px' } }, h('h3', null, 'India — index derivatives'), h('p', { class: 'small muted' }, S.india.expiryNote), IA.ui.table([{ label: 'Symbol', k: 'sym' }, { label: 'Underlying', k: 'name' }, { label: 'Lot', k: 'lot', n: 1 }, { label: 'Tick', k: 'tick', n: 1 }, { label: 'Expiry', k: 'expiry' }, { label: 'As of', k: 'asOf' }], S.india.contracts)));
    el.append(h('div', { class: 'card', style: { marginTop: '12px' } }, h('h3', null, `United States (as of ${S.us.asOf})`), h('p', { class: 'small muted' }, S.us.note), IA.ui.table([{ label: 'Contract', k: 'sym' }, { label: 'Description', k: 'name' }, { label: 'Multiplier', k: 'multiplier', n: 1 }, { label: 'Tick', k: 'tick', n: 1 }, { label: 'Tick value $', k: 'tickValue', n: 1 }], S.us.contracts)));
    el.append(h('div', { class: 'card', style: { marginTop: '12px' } }, h('h3', null, 'Sessions (exchange-local time)'), IA.ui.table([{ label: 'Exchange', k: 'name' }, { label: 'Zone', k: 'tz' }, { label: 'Pre', get: (s) => s.pre ? s.pre.join('–') : '—' }, { label: 'Main', get: (s) => s.main.map((m) => m.join('–')).join(', ') }, { label: 'Post', get: (s) => s.post ? s.post.join('–') : '—' }, { label: 'Note', k: 'note' }], S.sessions)));
  }

  const ENV = {
    india: { sessions: ['NSE'], practice: [['#/simulator/replay?preset=NIFTY', 'Replay Nifty'], ['#/simulator/paper?preset=BANKNIFTY', 'Paper-trade Bank Nifty'], ['#/calculators/charges-india', 'Charges calculator'], ['#/calculators/futures-exposure', 'Futures exposure']], md: `## Indian markets — primary practical environment
India's equity and equity-derivatives trading is concentrated on **NSE** (with BSE active in Sensex derivatives and cash). All instruments in this app's India environment trade 09:15–15:30 IST in the normal market, with a pre-open call auction (order entry 09:00–09:08) that discovers the opening price for stocks and a closing session afterwards.

| Segment | What you hold | Intraday specifics | Key cost |
|---|---|---|---|
| Cash equity (delivery) | Shares, T+1 settlement | No leverage beyond your cash | STT 0.1% both sides |
| Cash equity (intraday / MIS) | Nothing at day end — auto square-off | Broker leverage within SEBI peak-margin rules | STT 0.025% on sell |
| Index & stock futures | Obligation to buy/sell at expiry; daily MTM | Lot-based; SPAN + exposure margin | STT 0.05% on sell (from Apr 2026) |
| Index & stock options | Right (buyer) / obligation (seller) | Weekly Nifty, monthly Bank Nifty; huge expiry-day gamma | STT 0.15% of premium on sell |
| Currency & commodity (NSE/BSE/MCX) | Futures/options on INR pairs, metals, energy | Different hours (commodities till late evening) | Segment-specific |

> [!india] Index lot sizes (contracts from Jan 2026): Nifty 65, Bank Nifty 30, Fin Nifty 60, Midcap Select 120, Sensex 20. Verify on NSE/BSE before trading — SEBI reviews contract sizes periodically.

> [!warn] SEBI's own studies of individual F&O traders have repeatedly found that a large majority lose money after costs. Treat the derivatives tracks here as risk education first.

Use the tabs above for the global clock and dated specifications, and the lessons below for depth.` },
    us: { sessions: ['NYSE'], practice: [['#/simulator/replay?preset=SPY', 'Replay SPY'], ['#/simulator/paper?preset=NVDA', 'Paper-trade NVDA'], ['#/calculators/charges-us', 'US costs']], md: `## US markets
US equities trade across many venues — NYSE, Nasdaq, NYSE Arca, Cboe and others — plus off-exchange (dark pools, wholesalers). Regulation NMS links them through the National Best Bid and Offer (NBBO). Regular session 09:30–16:00 ET; most brokers offer premarket (from 04:00) and after-hours (to 20:00) with thinner liquidity and wider spreads.

| Topic | India | United States |
|---|---|---|
| Venues | Two main exchanges | 16+ exchanges plus off-exchange |
| Settlement | T+1 (equity) | T+1 (since May 2024) |
| Index options | European, cash-settled | SPX European cash-settled; SPY/QQQ American, physically settled |
| Day-trading rule | Margin rules by SEBI | PDT $25k rule removal approved Apr 2026; broker rollout varies — verify |
| Short selling | Intraday short in cash allowed; overnight needs SLB | Locate/borrow requirement (Reg SHO) |
| Circuit limits | Stock-level price bands | LULD bands per stock; market-wide circuit breakers |

Examples in lessons use liquid names — Apple, Microsoft, NVIDIA, Tesla, Amazon, and the SPY, QQQ and IWM ETFs — always with synthetic prices.` },
    global: { sessions: ['LSE', 'XETRA', 'EPA', 'TSE', 'HKEX', 'SGX', 'ASX', 'TSX'], practice: [['#/simulator/replay?preset=DAX', 'Replay a European index'], ['#/markets/clock', 'Global clock']], md: `## Europe and Asia
For an India-based intraday trader, other markets matter mainly as **context**: Asia's morning (Japan, Hong Kong, Korea, Australia) and GIFT Nifty set the tone before 09:15 IST; Europe opens around 12:30–13:30 IST depending on daylight saving; US futures and data releases shape the Indian afternoon and the next morning.

| Region | Main indices | Sessions (local) | Why an Indian trader watches it |
|---|---|---|---|
| Europe | DAX, FTSE 100, CAC 40, Euro Stoxx 50 | 08:00/09:00–16:30/17:30 | Overlaps the Indian afternoon; global risk appetite |
| Japan | Nikkei 225, TOPIX | 09:00–11:30, 12:30–15:30 JST | Early Asian risk tone; yen moves |
| Hong Kong / China | Hang Seng; Shanghai, Shenzhen | HK 09:30–16:00 with lunch | China/EM sentiment, metals |
| Korea, Singapore, Australia | KOSPI, STI, ASX 200 | Morning Asia | Tech cycle (KOSPI), commodities (ASX) |
| Canada | S&P/TSX | 09:30–16:00 ET | Commodities and banks |

> [!evidence] Cross-market correlations are real but unstable: they rise in sell-offs and can break down for weeks. Use them as context, never as a mechanical signal.` },
    assets: { sessions: null, practice: [['#/simulator/replay?preset=GOLD', 'Replay gold'], ['#/simulator/replay?preset=BTC', 'Replay a 24h crypto market']], md: `## Other asset classes
| Asset | Where (India) | Where (global) | Distinctive risks |
|---|---|---|---|
| Gold, silver | MCX futures/options; ETFs | COMEX, LBMA spot | USD, real rates, import duty changes |
| Crude oil, natural gas | MCX | NYMEX, ICE | Inventory data, OPEC+, extreme volatility and negative-price precedent (2020) |
| Currencies | NSE/BSE currency derivatives (INR pairs); RBI rules restrict retail forex to permitted pairs and exchanges | Spot FX (OTC), CME futures | Central-bank intervention, event gaps |
| Bond / rate futures | NSE interest-rate futures | CME Treasury futures | Duration maths; policy surprises |
| Crypto | Not exchange-regulated like equities; taxed heavily (verify current rules) | Spot and perpetual futures, often offshore | 24/7 trading, funding rates, liquidation cascades, venue/custody risk |

> [!warn] Trading forex with offshore brokers or unauthorised platforms is not permitted for Indian residents; RBI publishes an Alert List of unauthorised entities. Verify the legal status of any venue before using it.

Perpetual futures have no expiry; a **funding rate** paid between longs and shorts keeps the price near spot. A position at 20× leverage is liquidated after roughly a 5% adverse move minus fees and maintenance margin — see the crypto lesson for the worked maths.` },
  };
})(typeof window !== 'undefined' ? window : globalThis);
