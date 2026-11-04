/* Simulated order execution against OHLCV bars — used by replay and paper trading.
   Realism: execution delay (market orders fill at NEXT bar open), half-spread, random slippage,
   gaps (stops fill at the open if price gaps through), liquidity cap → partial fills,
   bracket stop/target as OCO (stop assumed first if both touched in one bar). */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const INSTR = {
    NIFTY: { sym: 'NIFTY FUT', lot: 65, tick: 0.05, cur: 'INR', seg: 'futures', spreadTicks: 2 },
    BANKNIFTY: { sym: 'BANKNIFTY FUT', lot: 30, tick: 0.05, cur: 'INR', seg: 'futures', spreadTicks: 4 },
    RELIANCE: { sym: 'LARGECAP (cash)', lot: 1, tick: 0.1, cur: 'INR', seg: 'eqIntraday', spreadTicks: 1 },
    MIDCAP: { sym: 'MIDCAP (cash)', lot: 1, tick: 0.05, cur: 'INR', seg: 'eqIntraday', spreadTicks: 3 },
    SPY: { sym: 'SPY-like ETF', lot: 1, tick: 0.01, cur: 'USD', seg: 'us', spreadTicks: 1 },
    NVDA: { sym: 'MEGACAP TECH', lot: 1, tick: 0.01, cur: 'USD', seg: 'us', spreadTicks: 2 },
    DAX: { sym: 'EU INDEX CFD-like', lot: 1, tick: 0.5, cur: 'EUR', seg: 'bps', bps: 1, spreadTicks: 2 },
    GOLD: { sym: 'GOLD FUT', lot: 1, tick: 0.1, cur: 'USD', seg: 'bps', bps: 0.5, spreadTicks: 2 },
    BTC: { sym: 'BTC PERP', lot: 1, tick: 0.5, cur: 'USD', seg: 'bps', bps: 5, spreadTicks: 4 },
  };
  function costs(ins, buyValue, sellValue, qty = 0) {
    if (ins.seg === 'us') { const U = (IA.specs || IA.specsDefault).us; return Math.max(U.commissionMin, qty * U.commissionPerShare * 2) + sellValue * U.secFeeRate + Math.min(U.finraTafMax, qty * U.finraTafPerShare); }
    if (ins.seg === 'bps') return ((buyValue + sellValue) * ins.bps) / 1e4;
    return IA.risk.indiaCharges({ segment: ins.seg, buyValue, sellValue, specs: (IA.specs || IA.specsDefault).india }).total;
  }
  function newAccount(cash, preset) { return { cash, start: cash, preset, pos: { qty: 0, avg: 0 }, orders: [], trades: [], fills: [], realized: 0, charges: 0, seq: 1 }; }
  // order: {side:1 buy/-1 sell, qty, type:'market'|'limit'|'stop', price?, stop?, target?, parent?, oco?}
  function place(acc, o) { const ord = { id: acc.seq++, filled: 0, status: 'open', ...o }; acc.orders.push(ord); return ord; }
  function cancel(acc, id) { const o = acc.orders.find((x) => x.id === id); if (o && o.status !== 'filled') o.status = 'cancelled'; }
  const round = (p, t) => Math.round(p / t) * t;

  function applyFill(acc, ins, side, qty, price, t, why) {
    const p = acc.pos; acc.fills.push({ t, side, qty, price, why });
    if (p.qty === 0 || Math.sign(p.qty) === side) { p.avg = (p.avg * Math.abs(p.qty) + price * qty) / (Math.abs(p.qty) + qty); p.qty += side * qty; if (!p.open) p.open = { t, price }; return; }
    const closing = Math.min(qty, Math.abs(p.qty)); const dir = Math.sign(p.qty);
    const gross = dir * (price - p.avg) * closing; const buyV = dir > 0 ? p.avg * closing : price * closing, sellV = dir > 0 ? price * closing : p.avg * closing;
    const ch = costs(ins, buyV, sellV, closing); acc.realized += gross; acc.charges += ch; acc.cash += gross - ch;
    acc.trades.push({ side: dir > 0 ? 'long' : 'short', qty: closing, entry: p.avg, exit: price, gross, charges: ch, net: gross - ch, openT: p.open?.t, closeT: t, why, stop: p.stop, target: p.target });
    p.qty += side * closing; if (p.qty === 0) { p.avg = 0; p.open = null; p.stop = null; p.target = null; }
    const rem = qty - closing; if (rem > 0) { p.qty = side * rem; p.avg = price; p.open = { t, price }; }
  }
  // Process one new bar. rng → [0,1). Returns events.
  function processBar(acc, bar, ins, rng, { liquidityPct = 0.1, slipTicks = 1 } = {}) {
    const ev = [], half = (ins.spreadTicks * ins.tick) / 2;
    const cap = Math.max(ins.lot, Math.floor((bar.v * liquidityPct) / ins.lot) * ins.lot);
    let capLeft = cap;
    const slip = () => Math.floor(rng() * (slipTicks + 1)) * ins.tick;
    const active = acc.orders.filter((o) => o.status === 'open' || o.status === 'partial');
    // Stops before targets/limits (conservative when both are touched in one bar)
    active.sort((a, b) => (a.type === 'stop' ? 0 : 1) - (b.type === 'stop' ? 0 : 1));
    for (const o of active) {
      if (o.status === 'cancelled' || o.status === 'filled') continue;
      let px = null;
      if (o.type === 'market') px = bar.o + o.side * (half + slip());
      else if (o.type === 'limit') { if (o.side > 0 ? bar.l <= o.price : bar.h >= o.price) px = o.side > 0 ? Math.min(o.price, bar.o) : Math.max(o.price, bar.o); }
      else if (o.type === 'stop') { if (o.side > 0 ? bar.h >= o.price : bar.l <= o.price) { const gap = o.side > 0 ? bar.o > o.price : bar.o < o.price; px = (gap ? bar.o : o.price) + o.side * (half + slip()); if (gap) ev.push({ type: 'gap', msg: `Stop order #${o.id} gapped: filled at open ${bar.o} instead of ${o.price}` }); } }
      if (px === null) continue;
      px = round(px, ins.tick);
      const want = o.qty - o.filled, q = o.parent ? want : Math.min(want, capLeft); // exits are not liquidity-capped to avoid trapping the learner
      if (q <= 0) continue; if (!o.parent) capLeft -= q;
      applyFill(acc, ins, o.side, q, px, bar.t, o.parent ? (o.type === 'stop' ? 'stop-loss' : 'target') : o.type);
      o.filled += q; o.status = o.filled >= o.qty ? 'filled' : 'partial'; o.avgFill = px;
      ev.push({ type: 'fill', id: o.id, qty: q, price: px, partial: o.status === 'partial' });
      if (o.status === 'partial') ev.push({ type: 'partial', msg: `Order #${o.id} partially filled ${o.filled}/${o.qty} — liquidity cap ${cap} per bar` });
      if (o.oco) { const other = acc.orders.find((x) => x.id === o.oco); if (other && other.status === 'open') other.status = 'cancelled'; }
      // attach bracket on entry fill
      if (!o.parent && (o.stop || o.target)) {
        acc.pos.stop = o.stop; acc.pos.target = o.target;
        const sq = Math.abs(acc.pos.qty); acc.orders.filter((x) => x.parent && x.status === 'open').forEach((x) => (x.status = 'cancelled'));
        const s = o.stop ? place(acc, { side: -o.side, qty: sq, type: 'stop', price: o.stop, parent: o.id }) : null;
        const tg = o.target ? place(acc, { side: -o.side, qty: sq, type: 'limit', price: o.target, parent: o.id }) : null;
        if (s && tg) { s.oco = tg.id; tg.oco = s.id; }
      }
    }
    // Brackets cancel if position flat
    if (acc.pos.qty === 0) acc.orders.filter((x) => x.parent && x.status === 'open').forEach((x) => (x.status = 'cancelled'));
    return ev;
  }
  function squareOff(acc, bar, ins, why = 'end-of-day square-off') {
    acc.orders.filter((o) => o.status === 'open' || o.status === 'partial').forEach((o) => (o.status = 'cancelled'));
    if (acc.pos.qty !== 0) applyFill(acc, ins, -Math.sign(acc.pos.qty), Math.abs(acc.pos.qty), round(bar.c - Math.sign(acc.pos.qty) * (ins.spreadTicks * ins.tick) / 2, ins.tick), bar.t, why);
  }
  function equity(acc, price) { return acc.cash + (acc.pos.qty ? acc.pos.qty * (price - acc.pos.avg) : 0); }
  IA.exec = { INSTR, newAccount, place, cancel, processBar, squareOff, equity, costs };
})(typeof window !== 'undefined' ? window : globalThis);
