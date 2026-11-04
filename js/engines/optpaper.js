/* Options paper trading on a synthetic index path (pure engine, no DOM).
   Model (stated in the UI):
   - Underlying: the seeded synthetic Nifty / Bank Nifty 5-minute path used elsewhere in the app.
   - Weekly expiry every 5 synthetic sessions (settled at that session's close), cash-settled at intrinsic value.
   - Time to expiry in TRADING time: remaining 5-minute bars × 5 / (252 × 375) years.
   - Implied volatility = base IV × smile. Base IV blends the index's typical IV with realised volatility of the
     previous 75 bars (strictly causal: bars before the current one). Smile: iv × (1 − 1.2·m + 6·m²), m = ln(K/S).
   - Price = Black–Scholes with r = 6.5%; bid/ask = mid ∓ half of max(2 ticks, 0.6% of mid + ₹0.05).
   - Orders fill on the NEXT bar: market at that bar's open quote (buy at ask, sell at bid); limit / stop orders
     on premium trigger from the option's value at the bar's high and low and fill at the trigger or a gapped open.
   - Charges: NSE options statutory charges via IA.risk.indiaCharges (round trip charged when a position is closed).
     Expiry: ITM longs pay STT on exercise (0.15% of intrinsic value, from 1 Apr 2026) plus ₹20 + GST brokerage.
   - Margin for shorts: an APPROXIMATION (not SPAN): premium + max(9% of spot − OTM amount, 3.5% of spot) per unit,
     capped at the defined maximum loss when the expiry group is fully hedged. Brokers' real margins differ. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const UNDER = {
    NIFTY: { sym: 'NIFTY', name: 'Nifty 50 options (synthetic)', step: 50, lot: 65, baseIV: 0.13, tick: 0.05 },
    BANKNIFTY: { sym: 'BANKNIFTY', name: 'Bank Nifty options (synthetic)', step: 100, lot: 30, baseIV: 0.16, tick: 0.05 },
  };
  const R = 0.065, BAR_MIN = 5, YEAR_MIN = 252 * 375, EX_STT = 0.0015, EX_BROKERAGE = 20 * 1.18;
  const rt = (x, t) => Math.round(x / t) * t, up = (x, t) => Math.ceil(x / t - 1e-9) * t, dn = (x, t) => Math.floor(x / t + 1e-9) * t;
  const fix = (x) => Math.round(x * 100) / 100;

  // Expiries: last bar of every 5th session. Returns [{id, d, end}]
  function expiries(data, every = 5) {
    const days = []; data.forEach((b, i) => { if (!days.length || days[days.length - 1].d !== b.d) days.push({ d: b.d, start: i, end: i }); else days[days.length - 1].end = i; });
    const out = []; for (let k = every - 1; k < days.length; k += every) out.push({ id: 'W' + (out.length + 1), d: days[k].d, end: days[k].end });
    return out;
  }
  // Years to expiry measured from the START (atClose=false) or END of bar i.
  const tYears = (i, e, atClose = false) => Math.max(0, (e.end - i + (atClose ? 0 : 1)) * BAR_MIN) / YEAR_MIN;
  // Causal base IV for bar i (uses closes of bars < i only).
  function baseIV(data, i, u) {
    const a = Math.max(1, i - 75), rets = []; for (let k = a; k < i; k++) rets.push(Math.log(data[k].c / data[k - 1].c));
    if (rets.length < 20) return u.baseIV;
    const m = rets.reduce((s, x) => s + x, 0) / rets.length, sd = Math.sqrt(rets.reduce((s, x) => s + (x - m) ** 2, 0) / (rets.length - 1));
    const rv = sd * Math.sqrt(YEAR_MIN / BAR_MIN);
    return Math.min(0.8, Math.max(0.07, 0.5 * u.baseIV + 0.5 * 1.1 * rv));
  }
  function smile(base, K, S) { const m = Math.log(K / S); return Math.min(3 * base, Math.max(0.5 * base, base * (1 - 1.2 * m + 6 * m * m))); }
  function quote(u, S, K, type, T, base) {
    const iv = smile(base, K, S);
    const g = T > 0 ? IA.opt.bs({ S, K, T, r: R, sigma: iv, type }) : IA.opt.bs({ S, K, T: 0, sigma: iv, type });
    const mid = Math.max(0, g.price), spread = Math.max(2 * u.tick, up(0.006 * mid + 0.05, u.tick));
    const ask = up(mid + spread / 2, u.tick), bid = Math.max(0, dn(mid - spread / 2, u.tick));
    return { mid, bid: fix(bid), ask: fix(Math.max(ask, u.tick)), iv, delta: g.delta, gamma: g.gamma, theta: g.theta, vega: g.vega, T };
  }
  const key = (expId, K, type) => `${expId}-${K}-${type === 'call' ? 'CE' : 'PE'}`;
  function parse(k) { const [exp, K, t] = k.split('-'); return { exp, K: +K, type: t === 'CE' ? 'call' : 'put' }; }
  function chain(u, S, T, base, expId, width = 8) {
    const atm = rt(S, u.step), rows = [];
    for (let j = -width; j <= width; j++) { const K = atm + j * u.step; rows.push({ K, atm: j === 0, call: { key: key(expId, K, 'call'), ...quote(u, S, K, 'call', T, base) }, put: { key: key(expId, K, 'put'), ...quote(u, S, K, 'put', T, base) } }); }
    return rows;
  }

  function newBook(cash, under) { return { under, lot: UNDER[under].lot, cash, start: cash, pos: {}, orders: [], trades: [], fills: [], realized: 0, charges: 0, seq: 1, rejected: [] }; }
  // order: {key, side 1/-1, lots, type 'market'|'limit'|'stop', price?, stopPx?, targetPx?, parent?, oco?}
  function place(book, o) {
    if (!(o.lots > 0) || Math.floor(o.lots) !== o.lots) return { error: 'Lots must be a whole number above zero.' };
    if (o.type !== 'market' && !(o.price > 0)) return { error: 'Limit and stop orders need a price above zero.' };
    const ord = { id: book.seq++, filled: 0, status: 'open', qty: o.lots * book.lot, ...o }; book.orders.push(ord); return ord;
  }
  function cancel(book, id) { const o = book.orders.find((x) => x.id === id); if (o && (o.status === 'open' || o.status === 'partial')) o.status = 'cancelled'; }
  const optCharges = (buyValue, sellValue) => IA.risk.indiaCharges({ segment: 'options', buyValue, sellValue, specs: (IA.specs || IA.specsDefault).india }).total;

  function applyFill(book, k, side, qty, price, t, why) {
    const p = book.pos[k] || (book.pos[k] = { qty: 0, avg: 0, openT: null }); book.fills.push({ t, key: k, side, qty, price, why });
    if (p.qty === 0 || Math.sign(p.qty) === side) { p.avg = (p.avg * Math.abs(p.qty) + price * qty) / (Math.abs(p.qty) + qty); p.qty += side * qty; if (!p.openT) p.openT = t; return; }
    const closing = Math.min(qty, Math.abs(p.qty)), dir = Math.sign(p.qty), gross = dir * (price - p.avg) * closing;
    const ch = dir > 0 ? optCharges(p.avg * closing, price * closing) : optCharges(price * closing, p.avg * closing);
    book.realized += gross; book.charges += ch; book.cash += gross - ch;
    book.trades.push({ key: k, side: dir > 0 ? 'long' : 'short', qty: closing, lots: closing / book.lot, entry: p.avg, exit: price, gross, charges: ch, net: gross - ch, openT: p.openT, closeT: t, why });
    p.qty += side * closing; if (p.qty === 0) { p.avg = 0; p.openT = null; }
    const rem = qty - closing; if (rem > 0) { p.qty = side * rem; p.avg = price; p.openT = t; }
  }
  // Approximate margin: see header. marks: key → {mid}. Returns {total, byExpiry, premiumHeld}
  function margin(book, S, marks = {}) {
    const groups = {}; let premiumHeld = 0;
    for (const [k, p] of Object.entries(book.pos)) { if (!p.qty) continue; const c = parse(k); (groups[c.exp] = groups[c.exp] || []).push({ ...c, qty: p.qty, avg: p.avg }); }
    const byExpiry = {}; let total = 0;
    for (const [exp, legs] of Object.entries(groups)) {
      let naked = 0;
      for (const l of legs) { if (l.qty > 0) { premiumHeld += l.avg * l.qty; continue; } const otm = l.type === 'call' ? Math.max(0, l.K - S) : Math.max(0, S - l.K); const prem = marks[key(exp, l.K, l.type)]?.mid ?? l.avg; naked += (prem + Math.max(0.09 * S - otm, 0.035 * S)) * -l.qty; }
      let m = naked;
      if (naked > 0) { const a = IA.opt.analyse(legs.map((l) => ({ type: l.type, side: Math.sign(l.qty), K: l.K, premium: l.avg, qty: Math.abs(l.qty) })), S); if (isFinite(a.maxLoss)) m = Math.min(naked, Math.max(0, -a.maxLoss)); }
      byExpiry[exp] = m; total += m;
    }
    return { total, byExpiry, premiumHeld };
  }
  function marksAt(book, ctx, atClose = true) {
    const u = UNDER[book.under], S = atClose ? ctx.bar.c : ctx.bar.o, out = {};
    for (const k of Object.keys(book.pos)) { const c = parse(k), e = ctx.exp[c.exp]; if (!e) continue; out[k] = quote(u, S, c.K, c.type, tYears(ctx.i, e, atClose), ctx.base); }
    return out;
  }
  function unrealised(book, marks) { let s = 0; for (const [k, p] of Object.entries(book.pos)) if (p.qty && marks[k]) s += p.qty * ((p.qty > 0 ? marks[k].bid : marks[k].ask) - p.avg); return s; }
  function equity(book, marks) { return book.cash + unrealised(book, marks); }
  function greeks(book, marks) {
    const g = { delta: 0, gamma: 0, theta: 0, vega: 0 };
    for (const [k, p] of Object.entries(book.pos)) if (p.qty && marks[k]) { g.delta += p.qty * marks[k].delta; g.gamma += p.qty * marks[k].gamma; g.theta += p.qty * marks[k].theta; g.vega += p.qty * marks[k].vega; }
    return g;
  }

  // ctx: {i, bar, exp: {W1:{end,..}}, base}. Process orders on bar i, then settle any expiry ending at bar i.
  function processBar(book, ctx) {
    const u = UNDER[book.under], ev = [], bar = ctx.bar;
    const active = book.orders.filter((o) => o.status === 'open' || o.status === 'partial');
    active.sort((a, b) => (a.type === 'stop' ? 0 : 1) - (b.type === 'stop' ? 0 : 1));
    for (const o of active) {
      if (o.status !== 'open' && o.status !== 'partial') continue;
      const c = parse(o.key), e = ctx.exp[c.exp];
      if (!e || ctx.i > e.end) { o.status = 'cancelled'; ev.push({ type: 'cancel', msg: `#${o.id} cancelled: ${o.key} has expired` }); continue; }
      const T = tYears(ctx.i, e, false), q = (S) => quote(u, S, c.K, c.type, T, ctx.base);
      const q0 = q(bar.o), qHiPrem = c.type === 'call' ? q(bar.h) : q(bar.l), qLoPrem = c.type === 'call' ? q(bar.l) : q(bar.h);
      let px = null;
      if (o.type === 'market') px = o.side > 0 ? q0.ask : q0.bid;
      else if (o.type === 'limit') { if (o.side > 0 ? qLoPrem.ask <= o.price : qHiPrem.bid >= o.price) px = o.side > 0 ? Math.min(o.price, q0.ask) : Math.max(o.price, q0.bid); }
      else if (o.type === 'stop') { if (o.side > 0 ? qHiPrem.ask >= o.price : qLoPrem.bid <= o.price) { const gap = o.side > 0 ? q0.ask > o.price : q0.bid < o.price; px = o.side > 0 ? Math.max(o.price, q0.ask) : Math.min(o.price, q0.bid); if (gap) ev.push({ type: 'gap', msg: `Stop #${o.id} on ${o.key} gapped: filled at ${fix(px)} instead of ${o.price}` }); } }
      if (px === null) continue;
      px = fix(px); if (o.side < 0 && px <= 0) { ev.push({ type: 'info', msg: `#${o.id}: no bid for ${o.key} (worthless); order left working` }); continue; }
      const want = o.qty - o.filled;
      // Funds check for new exposure (exits always allowed)
      const cur = book.pos[o.key]?.qty || 0, opening = cur === 0 || Math.sign(cur) === o.side;
      if (opening && !o.parent) {
        const trial = JSON.parse(JSON.stringify(book)); applyFill(trial, o.key, o.side, want, px, bar.t, 'trial');
        const marks = marksAt(trial, ctx, false), m = margin(trial, bar.o, marks), eq = equity(trial, marks) - (o.side > 0 ? 0 : 0);
        const need = m.total + m.premiumHeld;
        if (need > eq + 1e-6) { o.status = 'rejected'; o.reason = `Insufficient funds: needs ≈${Math.round(need)} (premium + approx. margin), equity ≈${Math.round(eq)}`; book.rejected.push(o.id); ev.push({ type: 'reject', msg: `#${o.id} rejected — ${o.reason}` }); continue; }
      }
      applyFill(book, o.key, o.side, want, px, bar.t, o.parent ? (o.type === 'stop' ? 'stop-loss' : 'target') : o.type);
      o.filled += want; o.status = 'filled'; o.avgFill = px; ev.push({ type: 'fill', id: o.id, key: o.key, qty: want, price: px });
      if (o.oco) { const other = book.orders.find((x) => x.id === o.oco); if (other && other.status === 'open') other.status = 'cancelled'; }
      if (!o.parent && (o.stopPx || o.targetPx)) {
        const sq = Math.abs(book.pos[o.key].qty);
        const s = o.stopPx ? place(book, { key: o.key, side: -o.side, lots: sq / book.lot, type: 'stop', price: o.stopPx, parent: o.id }) : null;
        const tg = o.targetPx ? place(book, { key: o.key, side: -o.side, lots: sq / book.lot, type: 'limit', price: o.targetPx, parent: o.id }) : null;
        if (s && tg && !s.error && !tg.error) { s.oco = tg.id; tg.oco = s.id; }
      }
    }
    for (const o of book.orders) if (o.parent && o.status === 'open' && !(book.pos[o.key]?.qty)) o.status = 'cancelled';
    // Expiry settlement at the close of the expiry bar
    for (const e of Object.values(ctx.exp)) if (e.end === ctx.i) ev.push(...settle(book, e, bar));
    return ev;
  }
  function settle(book, e, bar) {
    const ev = [], S = bar.c;
    for (const [k, p] of Object.entries(book.pos)) {
      const c = parse(k); if (c.exp !== e.id || !p.qty) continue;
      const intr = c.type === 'call' ? Math.max(0, S - c.K) : Math.max(0, c.K - S), dir = Math.sign(p.qty), units = Math.abs(p.qty);
      const gross = dir * (intr - p.avg) * units;
      let ch = dir > 0 ? optCharges(p.avg * units, 0) : optCharges(0, p.avg * units);
      if (intr > 0) ch += EX_BROKERAGE + (dir > 0 ? EX_STT * intr * units : 0);
      book.realized += gross; book.charges += ch; book.cash += gross - ch;
      book.trades.push({ key: k, side: dir > 0 ? 'long' : 'short', qty: units, lots: units / book.lot, entry: p.avg, exit: intr, gross, charges: ch, net: gross - ch, openT: p.openT, closeT: bar.t, why: intr > 0 ? 'expiry: cash-settled ITM' : 'expiry: expired worthless' });
      ev.push({ type: 'expiry', msg: `${k} ${intr > 0 ? `settled at intrinsic ${fix(intr)}` : 'expired worthless'} (spot ${fix(S)})` });
      book.pos[k] = { qty: 0, avg: 0, openT: null };
    }
    for (const o of book.orders) if ((o.status === 'open' || o.status === 'partial') && parse(o.key).exp === e.id) o.status = 'cancelled';
    return ev;
  }
  // Close every open position with market orders (fills next bar).
  function exitAll(book) { const out = []; for (const [k, p] of Object.entries(book.pos)) if (p.qty) out.push(place(book, { key: k, side: -Math.sign(p.qty), lots: Math.abs(p.qty) / book.lot, type: 'market' })); return out; }
  IA.optpaper = { UNDER, R, expiries, tYears, baseIV, smile, quote, chain, key, parse, newBook, place, cancel, processBar, settle, margin, marksAt, unrealised, equity, greeks, exitAll, EX_STT, EX_BROKERAGE };
})(typeof window !== 'undefined' ? window : globalThis);
