/* Options paper trading (Simulator → Options paper). Synthetic index, weekly expiries, Black–Scholes quotes with a
   smile and bid/ask, next-bar fills, NSE options charges, approximate margin, expiry settlement. Engine: js/engines/optpaper.js */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const { h, toast, money, num, table } = IA.ui;
  const OP = () => IA.optpaper;
  const fx = (x) => (x == null || !isFinite(x) ? '—' : num(x, 2));
  const hhmm = (t) => new Date(t).toISOString().slice(11, 16);

  IA.optPaperView = async function (el) {
    let S = await IA.db.get('optpaper', null);
    const newState = (under, cash) => ({ under, seed: Math.floor(Math.random() * 1e6), idx: 0, book: OP().newBook(cash, under), created: Date.now(), expSel: 'W1' });
    if (!S || !OP().UNDER[S.under]) S = newState('NIFTY', 500000);
    const U = () => OP().UNDER[S.under];
    const data = IA.gen.generate({ preset: S.under, seed: S.seed, days: 20, tfMin: 5 }).candles;
    const exps = OP().expiries(data), expMap = Object.fromEntries(exps.map((e) => [e.id, e]));
    if (!S.idx) S.idx = data.filter((b) => b.d === data[0].d).length + 3;
    const save = () => IA.db.set('optpaper', S);
    const ctx = (i) => ({ i, bar: data[i], exp: expMap, base: OP().baseIV(data, i, U()) });
    const live = () => exps.filter((e) => e.end >= S.idx); // expiries still tradeable at the next bar
    const viewCtx = () => ctx(S.idx - 1);
    const marks = () => OP().marksAt(S.book, viewCtx(), true);

    el.append(h('p', { class: 'muted' }, 'Practise index options with a virtual account on a synthetic Nifty or Bank Nifty path. Weekly expiry every 5 sessions, cash-settled at intrinsic value. Quotes are Black–Scholes with a volatility smile and a bid–ask spread; IV follows recent realised volatility. Orders fill on the NEXT bar (buy at ask, sell at bid). NSE option charges are deducted; ITM longs held to expiry pay STT on exercise. Short-option margin is an approximation, not SPAN. Nothing here touches a real broker.'), h('p', { class: 'small warn' }, 'Note: the synthetic path is more volatile than the real index (roughly 25–35% a year versus the 10–20% India VIX usually shows), so premiums here are higher than you would see live. IV is matched to this path, so neither buying nor selling has a built-in edge — but do not compare these premiums with a live option chain.'));
    const top = h('div', { class: 'card' }), kp = h('div', { style: { margin: '12px 0' } }), chartHost = h('div'), chainBox = h('div'), posBox = h('div'), ordBox = h('div'), trBox = h('div'), log = h('div', { class: 'small muted' }), payBox = h('div');
    const underSel = h('select', { class: 'i', 'aria-label': 'Underlying for a new account' }, Object.entries(OP().UNDER).map(([k, u]) => h('option', { value: k, selected: k === S.under }, u.name)));
    const capIn = h('input', { class: 'i num', type: 'number', value: 500000, step: 'any', 'aria-label': 'Starting capital for a new account', style: { width: '120px' } });
    top.append(h('div', { class: 'row' }, h('b', null, U().name), h('span', { class: 'tag' }, `lot ${U().lot} · strikes every ${U().step}`), h('span', { class: 'tag warn' }, 'synthetic'), h('span', { class: 'small muted', id: 'op-day' })),
      h('div', { class: 'row', style: { margin: '10px 0' } }, h('button', { class: 'btn primary', type: 'button', onclick: () => adv(1) }, 'Advance 1 bar'), h('button', { class: 'btn', type: 'button', onclick: () => adv(6) }, '+30 min'), h('button', { class: 'btn', type: 'button', onclick: () => adv('eod') }, 'To session close'), h('button', { class: 'btn', type: 'button', onclick: () => adv('exp') }, 'To next expiry'), h('button', { class: 'btn ghost', type: 'button', onclick: async () => { const o = OP().exitAll(S.book); if (!o.length) return toast('No open positions.'); log.prepend(h('div', null, `Exit all: ${o.length} market order(s) placed — they fill on the next bar.`)); await save(); upd(); } }, 'Exit all positions')),
      h('details', null, h('summary', { class: 'small' }, 'Start a new options account'), h('div', { class: 'row', style: { marginTop: '8px' } }, underSel, capIn, h('button', { class: 'btn sm', type: 'button', onclick: async () => { const c = +capIn.value; if (!(c > 0)) return toast('Enter a positive starting capital.'); S = newState(underSel.value, c); await save(); el.replaceChildren(); IA.views.simulator(el, 'options'); } }, 'Reset account'))), chartHost);
    const chart = new IA.Chart(chartHost, { height: 300, paneH: 60 }); chartHost.prepend(IA.chartToolbar(chart, { types: false })); chart.setTokens(data, ['vol', 'vwap']);

    // ---- order ticket ----
    const T = { key: null, side: 1 };
    const tkKey = h('b', null, '—'), tkSide = h('select', { class: 'i', 'aria-label': 'Side' }, h('option', { value: '1' }, 'Buy'), h('option', { value: '-1' }, 'Sell'));
    const tkType = h('select', { class: 'i', 'aria-label': 'Order type' }, [['market', 'Market (next bar)'], ['limit', 'Limit on premium'], ['stop', 'Stop on premium (SL-M)']].map(([a, b]) => h('option', { value: a }, b)));
    const num_ = (lbl, v) => h('input', { class: 'i num', type: 'number', step: 'any', value: v ?? '', 'aria-label': lbl });
    const tkLots = num_('Lots', 1), tkPx = num_('Limit or stop premium'), tkSL = num_('Stop-loss premium'), tkTG = num_('Target premium');
    const tkInfo = h('div', { class: 'small muted', style: { margin: '6px 0' } });
    const ticket = h('div', { class: 'card' }, h('h3', null, 'Order ticket'), h('div', { class: 'small' }, 'Contract: ', tkKey), h('div', { class: 'form' }, h('label', { class: 'f' }, 'Side', tkSide), h('label', { class: 'f' }, 'Lots', tkLots), h('label', { class: 'f' }, 'Order type', tkType), h('label', { class: 'f' }, 'Limit/stop premium', tkPx), h('label', { class: 'f' }, 'Stop-loss premium (optional)', tkSL), h('label', { class: 'f' }, 'Target premium (optional)', tkTG)), tkInfo, h('button', { class: 'btn primary', type: 'button', onclick: placeOrder }, 'Place order'));
    [tkSide, tkLots, tkType, tkPx].forEach((i) => i.addEventListener('input', info));
    function pick(key, side) { T.key = key; tkKey.textContent = key; tkSide.value = String(side); info(); ticket.scrollIntoView?.({ block: 'nearest' }); }
    function curQuote(k) { const c = OP().parse(k), e = expMap[c.exp]; return OP().quote(U(), data[S.idx - 1].c, c.K, c.type, OP().tYears(S.idx - 1, e, true), OP().baseIV(data, S.idx, U())); }
    function info() {
      if (T.key && !live().some((e) => e.id === OP().parse(T.key).exp)) { T.key = null; tkKey.textContent = '—'; }
      if (!T.key) { tkInfo.textContent = 'Tap B or S in the option chain to choose a contract.'; return; }
      const q = curQuote(T.key), side = +tkSide.value, lots = +tkLots.value || 0, units = lots * U().lot, px = side > 0 ? q.ask : q.bid;
      const est = side > 0 ? `Premium ≈ ${money(px * units)} (max loss if held to expiry = premium + charges)` : `Credit ≈ ${money(px * units)}. Short options: loss can be many times the credit; approx. margin ≈ ${money((px + Math.max(0.09 * data[S.idx - 1].c - (OP().parse(T.key).type === 'call' ? Math.max(0, OP().parse(T.key).K - data[S.idx - 1].c) : Math.max(0, data[S.idx - 1].c - OP().parse(T.key).K)), 0.035 * data[S.idx - 1].c)) * units)} unless hedged`;
      tkInfo.textContent = `Now: bid ${fx(q.bid)} / ask ${fx(q.ask)} · IV ${num(q.iv * 100, 1)}% · Δ ${num(q.delta, 2)}. ${est}. Fills at the next bar's price, which may differ.`;
    }
    async function placeOrder() {
      if (!T.key || !live().some((e) => e.id === OP().parse(T.key).exp)) return toast('Choose a live contract from the chain first.');
      const side = +tkSide.value, sl = +tkSL.value || undefined, tg = +tkTG.value || undefined, q = curQuote(T.key);
      if (sl && (side > 0 ? sl >= q.bid : sl <= q.ask)) return toast('Stop-loss premium is on the wrong side of the current price.');
      if (tg && (side > 0 ? tg <= q.ask : tg >= q.bid)) return toast('Target premium is on the wrong side of the current price.');
      const o = OP().place(S.book, { key: T.key, side, lots: +tkLots.value, type: tkType.value, price: +tkPx.value || undefined, stopPx: sl, targetPx: tg });
      if (o.error) return toast(o.error);
      log.prepend(h('div', null, `Placed #${o.id}: ${side > 0 ? 'BUY' : 'SELL'} ${o.lots} lot(s) ${o.key} ${o.type}${o.price ? ' @ ' + o.price : ''}${sl ? ' · SL ' + sl : ''}${tg ? ' · TGT ' + tg : ''}`));
      await save(); upd();
    }

    const expSeg = h('div');
    el.append(top, kp, h('div', { class: 'card', style: { marginTop: '12px' } }, h('div', { class: 'spread' }, h('h3', { style: { margin: 0 } }, 'Option chain'), expSeg), h('p', { class: 'small muted' }, 'Quotes at the last bar\'s close. B = buy at ask, S = sell at bid. ATM row highlighted.'), chainBox),
      h('div', { class: 'grid g2', style: { marginTop: '12px' } }, ticket, h('div', { class: 'card' }, h('h3', null, 'Positions'), posBox, h('h3', { style: { marginTop: '12px' } }, 'Working orders'), ordBox)),
      h('div', { class: 'card', style: { marginTop: '12px' } }, h('h3', null, 'Position payoff'), payBox),
      h('div', { class: 'card', style: { marginTop: '12px' } }, h('div', { class: 'spread' }, h('h3', null, 'Closed trades'), h('button', { class: 'btn sm', type: 'button', onclick: toJournal }, 'Send new trades to journal')), trBox, h('h3', { style: { marginTop: '12px' } }, 'Event log'), log));

    async function toJournal() {
      const nw = S.book.trades.filter((t) => !t.journalled); if (!nw.length) return toast('No new trades to journal.');
      for (const t of nw) await IA.db.put('journal', { date: new Date(t.openT || Date.now()).toISOString().slice(0, 10), market: 'India', exchange: 'NSE (simulated)', instrument: `${S.under} ${t.key}`, strategy: 'Options', timeframe: '5m', side: t.side, entry: t.entry, exit: t.exit, qty: t.qty, gross: t.gross, charges: t.charges, net: t.net, entryTime: t.openT, exitTime: t.closeT, source: 'options-paper', synthetic: true, notes: `Exit: ${t.why}` });
      nw.forEach((t) => (t.journalled = true)); await save(); toast(`${nw.length} trade(s) journalled`);
    }
    async function adv(n) {
      if (S.idx >= data.length) return toast('End of the 20-session market. Reset the account to continue.');
      const day = data[S.idx].d, nextExp = live()[0]; let k = 0;
      while (S.idx < data.length) {
        const i = S.idx, ev = OP().processBar(S.book, ctx(i));
        ev.forEach((e) => log.prepend(h('div', { class: e.type === 'gap' || e.type === 'reject' ? 'warn' : e.type === 'expiry' ? 'up' : '' }, e.type === 'fill' ? `${data[i].d} ${hhmm(data[i].t)} · filled #${e.id}: ${e.qty} × ${e.key} @ ${fx(e.price)}` : `${data[i].d} ${hhmm(data[i].t)} · ${e.msg}`)));
        S.idx++; k++;
        if (n === 'eod' ? S.idx >= data.length || data[S.idx].d !== day : n === 'exp' ? !nextExp || i >= nextExp.end : k >= n) break;
      }
      if (!live().some((e) => e.id === S.expSel)) S.expSel = live()[0]?.id || S.expSel;
      await save(); upd();
    }
    function upd() {
      const i = S.idx - 1, spot = data[i].c, m = marks(), eq = OP().equity(S.book, m), mg = OP().margin(S.book, spot, m), g = OP().greeks(S.book, m), un = OP().unrealised(S.book, m);
      const dEl = document.getElementById('op-day'); const nx = live()[0];
      if (dEl) dEl.textContent = `Session ${[...new Set(data.slice(0, S.idx).map((b) => b.d))].length}/20 · ${data[i].d} ${hhmm(data[i].t)} · spot ${num(spot, 2)} · base IV ${num(OP().baseIV(data, S.idx, U()) * 100, 1)}%${nx ? ` · next expiry ${nx.id} (${nx.d})` : ''}`;
      kp.innerHTML = ''; kp.append(h('div', { class: 'grid g4 kpis' }, [['Equity', money(eq), IA.ui.signCls(eq - S.book.start)], ['Realised (net)', money(S.book.realized - S.book.charges), IA.ui.signCls(S.book.realized - S.book.charges)], ['Unrealised (at bid/ask)', money(un), IA.ui.signCls(un)], ['Funds available', money(eq - mg.total - mg.premiumHeld)], ['Approx. margin used', money(mg.total)], ['Net delta', `${num(g.delta, 1)} units (${money(g.delta * 50, 'INR', 0)} per 50 pts)`], ['Theta / day', money(g.theta, 'INR', 0), IA.ui.signCls(g.theta)], ['Vega / 1 vol pt', money(g.vega, 'INR', 0)]].map(([l, v, c]) => h('div', { class: 'card kpi' }, h('span', { class: 'l' }, l), h('span', { class: 'v ' + (c || ''), style: { fontSize: '1.0rem' } }, v)))));
      chart.markers = S.book.fills.map((f) => ({ i: data.findIndex((b) => b.t === f.t), pos: f.side > 0 ? 'below' : 'above', color: f.side > 0 ? '#26c281' : '#ef5361', text: (f.side > 0 ? 'B ' : 'S ') + f.key.split('-').slice(1).join('') })).filter((x) => x.i >= 0);
      chart.levels = []; chart.setEnd(S.idx);
      // expiry selector + chain
      expSeg.innerHTML = ''; const L = live(); if (!L.length) { chainBox.innerHTML = ''; chainBox.append(h('p', { class: 'muted' }, 'All expiries in this 20-session market have settled. Reset the account to continue.')); }
      else {
        if (!L.some((e) => e.id === S.expSel)) S.expSel = L[0].id;
        expSeg.append(IA.ui.seg(L.slice(0, 2).map((e) => [e.id, `${e.id} · ${e.d} · ${num((e.end - i) / 75, 1)} d`]), S.expSel, (v) => { S.expSel = v; save(); upd(); }));
        const e = expMap[S.expSel], rows = OP().chain(U(), spot, OP().tYears(i, e, true), OP().baseIV(data, S.idx, U()), e.id, 6);
        const bs = (k, side) => h('button', { class: 'btn sm ' + (side > 0 ? 'buy' : 'sell'), type: 'button', 'aria-label': `${side > 0 ? 'Buy' : 'Sell'} ${k}`, onclick: () => pick(k, side) }, side > 0 ? 'B' : 'S');
        chainBox.innerHTML = ''; chainBox.append(table([
          { label: 'Call bid/ask', n: 1, get: (r) => `${fx(r.call.bid)} / ${fx(r.call.ask)}` }, { label: 'Δ', n: 1, get: (r) => num(r.call.delta, 2) }, { label: '', get: (r) => h('span', { class: 'row', style: { gap: '4px', flexWrap: 'nowrap' } }, bs(r.call.key, 1), bs(r.call.key, -1)) },
          { label: 'Strike', n: 1, get: (r) => h('b', { class: r.atm ? 'accent' : '' }, String(r.K)), cls: (r) => (r.atm ? 'hl' : '') },
          { label: '', get: (r) => h('span', { class: 'row', style: { gap: '4px', flexWrap: 'nowrap' } }, bs(r.put.key, 1), bs(r.put.key, -1)) }, { label: 'Δ', n: 1, get: (r) => num(r.put.delta, 2) }, { label: 'Put bid/ask', n: 1, get: (r) => `${fx(r.put.bid)} / ${fx(r.put.ask)}` }, { label: 'IV', n: 1, get: (r) => `${num(r.call.iv * 100, 1)}%` },
        ], rows));
      }
      // positions
      const open = Object.entries(S.book.pos).filter(([, p]) => p.qty);
      posBox.innerHTML = ''; posBox.append(table([{ label: 'Contract', get: ([k]) => k }, { label: 'Lots', n: 1, get: ([, p]) => num(p.qty / U().lot, 0) }, { label: 'Avg', n: 1, get: ([, p]) => fx(p.avg) }, { label: 'Mark', n: 1, get: ([k]) => fx(m[k]?.mid) }, { label: 'MTM', n: 1, get: ([k, p]) => money(p.qty * ((p.qty > 0 ? m[k]?.bid : m[k]?.ask) - p.avg), 'INR', 0), cls: ([k, p]) => IA.ui.signCls(p.qty * ((p.qty > 0 ? m[k]?.bid : m[k]?.ask) - p.avg)) }, { label: 'Δ', n: 1, get: ([k, p]) => num(p.qty * (m[k]?.delta || 0), 1) }, { label: '', get: ([k, p]) => h('button', { class: 'btn sm ghost', type: 'button', onclick: async () => { OP().place(S.book, { key: k, side: -Math.sign(p.qty), lots: Math.abs(p.qty) / U().lot, type: 'market' }); log.prepend(h('div', null, `Exit order for ${k} placed (fills next bar).`)); await save(); upd(); } }, 'Exit') }], open, { empty: 'No open positions.' }));
      ordBox.innerHTML = ''; ordBox.append(table([{ label: '#', k: 'id' }, { label: 'Contract', k: 'key' }, { label: 'Side', get: (o) => (o.side > 0 ? 'BUY' : 'SELL') }, { label: 'Type', get: (o) => (o.parent ? (o.type === 'stop' ? 'bracket SL' : 'bracket TGT') : o.type) }, { label: 'Lots', n: 1, get: (o) => num(o.qty / U().lot, 0) }, { label: 'Price', n: 1, get: (o) => (o.price ? fx(o.price) : 'mkt') }, { label: '', get: (o) => h('button', { class: 'btn sm ghost', type: 'button', onclick: async () => { OP().cancel(S.book, o.id); await save(); upd(); } }, 'Cancel') }], S.book.orders.filter((o) => o.status === 'open' || o.status === 'partial'), { empty: 'No working orders.' }));
      trBox.innerHTML = ''; trBox.append(table([{ label: 'Contract', k: 'key' }, { label: 'Side', k: 'side' }, { label: 'Lots', n: 1, get: (t) => num(t.lots, 0) }, { label: 'Entry', n: 1, get: (t) => fx(t.entry) }, { label: 'Exit', n: 1, get: (t) => fx(t.exit) }, { label: 'Exit reason', k: 'why' }, { label: 'Gross', n: 1, get: (t) => money(t.gross), cls: (t) => IA.ui.signCls(t.gross) }, { label: 'Charges', n: 1, get: (t) => money(t.charges) }, { label: 'Net', n: 1, get: (t) => money(t.net), cls: (t) => IA.ui.signCls(t.net) }], S.book.trades.slice().reverse(), { empty: 'No closed trades yet.' }));
      drawPayoff(open, spot, i); info();
    }
    function drawPayoff(open, spot, i) {
      payBox.innerHTML = '';
      if (!open.length) return payBox.append(h('p', { class: 'muted small' }, 'Open a position to see its payoff at the nearest expiry and today.'));
      const base = OP().baseIV(data, S.idx, U());
      const legs = open.map(([k, p]) => { const c = OP().parse(k), e = expMap[c.exp]; return { type: c.type, side: Math.sign(p.qty), K: c.K, qty: Math.abs(p.qty), premium: p.avg, days: OP().tYears(i, e, true) * 365, iv: OP().smile(base, c.K, spot) }; });
      const front = Math.min(...legs.map((l) => l.days)), lo = spot * 0.95, hi = spot * 1.05;
      const grid = Array.from({ length: 121 }, (_, j) => lo + ((hi - lo) * j) / 120);
      const atF = grid.map((s) => ({ x: s, y: IA.opt.horizonPnl(legs, s, front) })), now = grid.map((s) => ({ x: s, y: IA.opt.horizonPnl(legs, s, 0) }));
      const a = IA.opt.horizonAnalyse(legs, spot, front);
      payBox.append(h('p', { class: 'small muted' }, `P&L before charges, from your average prices. Time is converted to calendar-day equivalents (trading days × 365/252) and IV is held at today's smile. At the nearest expiry: max gain ${money(a.maxGain, 'INR', 0)}, max loss ${money(a.maxLoss, 'INR', 0)}${a.breakevens.length ? `, breakeven(s) ${a.breakevens.map((b) => num(b, 0)).join(' / ')}` : ''} (numerical, ±50% of spot).`));
      const pl = h('div'); payBox.append(pl); IA.plot(pl, [{ pts: atF, fillSign: true, color: '#4fb3ff' }, { pts: now, color: '#f2b84b', width: 1.2 }], { vlines: [{ x: spot, label: 'spot' }], height: 200 });
      payBox.append(h('div', { class: 'row small' }, h('span', { style: { color: '#4fb3ff' } }, '■ at nearest expiry'), h('span', { style: { color: '#f2b84b' } }, '■ now')));
    }
    upd(); await save();
  };
})(typeof window !== 'undefined' ? window : globalThis);
