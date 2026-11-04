/* Trading Simulator: chart replay, decision simulator, paper trading. All synthetic; no broker connection. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const { h, toast, money, num, table } = IA.ui;
  const PRESETS = () => Object.keys(IA.exec.INSTR);

  IA.views.simulator = (el, tab = 'replay') => {
    const tabs = [['replay', 'Chart replay'], ['decision', 'Decision simulator'], ['paper', 'Paper trading'], ['options', 'Options paper'], ['bot', 'Strategy bot']];
    el.append(h('div', { class: 'tabs' }, tabs.map(([k, l]) => h('button', { class: k === tab ? 'on' : '', onclick: () => IA.go('#/simulator/' + k) }, l))));
    if (tab === 'options') return IA.optPaperView(el);
    if (tab === 'bot') return IA.botView(el);
    return ({ replay, decision, paper }[tab] || replay)(el);
  };

  // ---------- shared trade ticket ----------
  function ticket(state, onSubmit) {
    const I = () => (state.ins ? state.ins() : IA.exec.INSTR[state.preset]), f = {};
    const inp = (k, l, v) => { const i = h('input', { class: 'i num', type: 'number', step: 'any', value: v ?? '' }); f[k] = i; return h('label', { class: 'f' }, l, i); };
    const box = h('div', { class: 'card' }, h('div', { class: 'spread' }, h('h3', { style: { margin: 0 } }, 'Order ticket'), ((() => { const x = h('span', { class: 'small muted' }); x.textContent = `${I().sym} · lot ${I().lot} · tick ${I().tick}`; state.onIns = () => (x.textContent = `${I().sym} · lot ${I().lot} · tick ${I().tick}`); return x; })())));
    const type = h('select', { class: 'i' }, [['market', 'Market (fills next bar open)'], ['limit', 'Limit'], ['stop', 'Stop (SL-M)']].map(([a, b]) => h('option', { value: a }, b)));
    const g = h('div', { class: 'form' }, h('label', { class: 'f' }, 'Order type', type), inp('price', 'Limit/stop price'), inp('stop', 'Stop-loss'), inp('target', 'Target'), inp('risk', 'Risk % of equity', 0.5), inp('qty', 'Quantity (blank = size from risk)'));
    const info = h('div', { class: 'small muted', style: { margin: '6px 0' } });
    const calc = () => { const px = state.price(); const st = +f.stop.value; if (!st || !px) { info.textContent = 'Enter a stop-loss to size by risk.'; return null; } const side = st < px ? 1 : -1; const r = IA.risk.positionSize({ capital: state.equity(), riskPct: +f.risk.value || 0.5, entry: px, stop: st, lot: I().lot, leverage: I().seg === 'futures' ? 8 : I().seg === 'eqIntraday' ? 5 : 2 }); if (r.error) { info.textContent = r.error; return null; } const tg = +f.target.value; info.textContent = `Suggested: ${r.units} (${r.lots} lots) · risk ${money(r.actualRisk, I().cur)}${tg ? ` · R:R ${num(Math.abs(tg - px) / Math.abs(px - st), 2)}` : ''}`; return { side, units: r.units }; };
    Object.values(f).forEach((i) => i.addEventListener('input', calc));
    const go = async (side) => { const sz = calc(); let qty = +f.qty.value || (sz ? sz.units : 0); qty = Math.floor(qty / I().lot) * I().lot; if (!qty) { toast('Quantity is zero — set a stop and risk %, or a quantity.'); return; } const st = +f.stop.value || null, tg = +f.target.value || null, px = state.price();
      if (st && (side > 0 ? st >= px : st <= px)) { toast('Stop is on the wrong side of the current price.'); return; }
      if (tg && (side > 0 ? tg <= px : tg >= px)) { toast('Target is on the wrong side of the current price.'); return; }
      if (!st && !state.allowNoStop) { if (!(await IA.ui.ask('No stop-loss. Trading without a stop is the single most common way accounts blow up. Place anyway?'))) return; }
      onSubmit({ side, qty, type: type.value, price: +f.price.value || undefined, stop: st, target: tg }); };
    box.append(g, info, h('div', { class: 'row' }, h('button', { class: 'btn buy', type: 'button', onclick: () => go(1) }, 'BUY / LONG'), h('button', { class: 'btn sell', type: 'button', onclick: () => go(-1) }, 'SELL / SHORT')));
    box.refresh = calc; return box;
  }
  function accountPanel(acc, price, cur) {
    const eq = IA.exec.equity(acc, price), un = acc.pos.qty ? acc.pos.qty * (price - acc.pos.avg) : 0;
    return h('div', { class: 'grid g4 kpis' }, [['Equity', money(eq, cur), IA.ui.signCls(eq - acc.start)], ['Realised (net)', money(acc.realized - acc.charges, cur), IA.ui.signCls(acc.realized - acc.charges)], ['Unrealised', money(un, cur), IA.ui.signCls(un)], ['Position', acc.pos.qty ? `${acc.pos.qty > 0 ? 'Long' : 'Short'} ${Math.abs(acc.pos.qty)} @ ${IA.fmtP(acc.pos.avg)}` : 'Flat'], ['Charges paid', money(acc.charges, cur)], ['Trades', String(acc.trades.length)]].map(([l, v, c]) => h('div', { class: 'card kpi' }, h('span', { class: 'l' }, l), h('span', { class: 'v ' + (c || ''), style: { fontSize: '1.05rem' } }, v))));
  }
  const tradeCols = (cur) => [{ label: 'Side', k: 'side' }, { label: 'Qty', k: 'qty', n: 1 }, { label: 'Entry', get: (t) => IA.fmtP(t.entry), n: 1 }, { label: 'Exit', get: (t) => IA.fmtP(t.exit), n: 1 }, { label: 'Exit reason', k: 'why' }, { label: 'Gross', get: (t) => money(t.gross, cur), n: 1, cls: (t) => IA.ui.signCls(t.gross) }, { label: 'Charges', get: (t) => money(t.charges, cur), n: 1 }, { label: 'Net', get: (t) => money(t.net, cur), n: 1, cls: (t) => IA.ui.signCls(t.net) }];
  IA.simToJournal = (...a) => toJournal(...a);
  async function toJournal(trades, ins, source) { for (const t of trades) await IA.db.put('journal', { date: new Date(t.openT || Date.now()).toISOString().slice(0, 10), market: ins.cur === 'INR' ? 'India' : 'Global', exchange: ins.cur === 'INR' ? 'NSE (simulated)' : 'Simulated', instrument: ins.sym, strategy: '', timeframe: '5m', side: t.side, entry: t.entry, exit: t.exit, stop: t.stop || '', target: t.target || '', qty: t.qty, gross: t.gross, charges: t.charges, net: t.net, entryTime: t.openT, exitTime: t.closeT, source, synthetic: true, notes: `Exit: ${t.why}` }); }

  // ---------- 1. Chart replay ----------
  function replay(el) {
    const q = IA.query || new URLSearchParams(); const st = { preset: q.get('preset') || 'NIFTY', seed: Math.floor(Math.random() * 1e6), idx: 0, timer: null };
    let data, acc, chart; const ins = () => (st.ds ? IA.datasets.instr(st.ds) : IA.exec.INSTR[st.preset]); const rng = IA.gen.rng(st.seed + 1);
    const top = h('div', { class: 'card' }), kp = h('div', { style: { margin: '12px 0' } }), log = h('div', { class: 'small muted' }), trades = h('div');
    el.append(h('p', { class: 'muted' }, 'Candles are revealed one at a time; the future is hidden. Market orders fill at the next bar\'s open. Stops fill at the stop — or worse if price gaps through. Positions are squared off at the session close. Use it to practise execution, not to predict.'), top, kp);
    const sel = h('select', { class: 'i' }, PRESETS().map((k) => h('option', { value: k, selected: k === st.preset }, IA.gen.PRESETS[k].name)));
    sel.onchange = () => { st.preset = sel.value; reset(); };
    const daySel = h('select', { class: 'i' }); const dayLbl = h('label', { class: 'f hidden' }, 'Session to replay', daySel); daySel.onchange = () => reset(true);
    const srcBox = h('div', { class: 'f' }); IA.sourcePicker(async (src) => { st.ds = src.kind === 'dataset' ? src.ds : null; if (st.ds) { const days = [...new Set(st.ds.candles.map((b) => b.d))]; const daily = st.ds.tfMin >= 1440; const opts = daily ? days.slice(20) : days.slice(1); daySel.innerHTML = ''; opts.forEach((d) => daySel.append(h('option', { value: d }, d))); daySel.value = opts[Math.max(0, opts.length - (daily ? 60 : 1))] || ''; dayLbl.classList.remove('hidden'); sel.parentNode.classList.add('hidden'); } else { dayLbl.classList.add('hidden'); sel.parentNode.classList.remove('hidden'); } reset(true); }).then((p) => { srcBox.replaceWith(p); const q = IA.query; if (q && q.get('ds')) { p.select.value = q.get('ds'); p.select.onchange(); } });
    const speed = h('select', { class: 'i' }, [[1200, 'Slow'], [600, 'Normal'], [250, 'Fast']].map(([a, b]) => h('option', { value: a, selected: a === 600 }, b)));
    const playBtn = h('button', { class: 'btn', type: 'button', onclick: () => { if (st.timer) stop(); else { st.timer = setInterval(step, +speed.value); playBtn.textContent = '❚❚ Pause'; } } }, '▶ Play');
    const stop = () => { clearInterval(st.timer); st.timer = null; playBtn.textContent = '▶ Play'; };
    top.append(h('div', { class: 'form' }, srcBox, h('label', { class: 'f' }, 'Instrument', sel), dayLbl, h('label', { class: 'f' }, 'Speed', speed), h('div', { class: 'f', style: { justifyContent: 'flex-end' } }, h('button', { class: 'btn', type: 'button', onclick: reset }, 'New session'))), h('div', { class: 'row', style: { margin: '10px 0' } }, h('button', { class: 'btn primary', type: 'button', onclick: step }, 'Next bar ▸'), playBtn, h('button', { class: 'btn', type: 'button', onclick: () => { for (let k = 0; k < 6; k++) step(); } }, '+6 bars'), h('button', { class: 'btn ghost', type: 'button', onclick: () => { if (acc.pos.qty) { acc.orders.filter((o) => o.status === 'open').forEach((o) => (o.status = 'cancelled')); IA.exec.place(acc, { side: -Math.sign(acc.pos.qty), qty: Math.abs(acc.pos.qty), type: 'market', parent: -1 }); log.prepend(h('div', null, 'Close order sent — fills next bar.')); } } }, 'Close position'), h('button', { class: 'btn ghost', type: 'button', onclick: review }, 'End & review')));
    const chartHost = h('div'); top.append(chartHost);
    const tkState = { preset: st.preset, ins, price: () => data[st.idx - 1].c, equity: () => IA.exec.equity(acc, data[st.idx - 1].c) };
    const tk = ticket(tkState, (o) => { IA.exec.place(acc, o); log.prepend(h('div', null, `Order: ${o.side > 0 ? 'BUY' : 'SELL'} ${o.qty} ${o.type}${o.stop ? ' SL ' + o.stop : ''}${o.target ? ' TGT ' + o.target : ''} — waiting for next bar`)); });
    el.append(h('div', { class: 'grid g2' }, tk, h('div', { class: 'card' }, h('h3', null, 'Event log'), log)), h('div', { class: 'card', style: { marginTop: '12px' } }, h('h3', null, 'Trades this session'), trades));
    function reset(keepSource) {
      stop(); let label = null, intro;
      if (st.ds) {
        const all = st.ds.candles, day = daySel.value, daily = st.ds.tfMin >= 1440; const days = [...new Set(all.map((b) => b.d))]; const di = Math.max(1, days.indexOf(day));
        if (daily) { const i0 = all.findIndex((b) => b.d === days[di]); data = all.slice(Math.max(0, i0 - 60), i0 + 60); st.idx = Math.min(60, i0); }
        else { const keep = new Set(days.slice(di - 1, di + 4)); data = all.filter((b) => keep.has(b.d)); st.idx = data.filter((b) => b.d === days[di - 1]).length + Math.min(3, data.filter((b) => b.d === days[di]).length - 1); }
        label = 'HISTORICAL · ' + st.ds.name; intro = `Historical replay of ${st.ds.name} from ${daily ? days[di] : days[di] + ' (previous session shown for context)'}. Future bars are hidden until you step forward.`;
      } else { st.seed = Math.floor(Math.random() * 1e6); const g = IA.gen.generate({ preset: st.preset, seed: st.seed, days: 2, tfMin: 5 }); data = g.candles; const day1 = data.filter((b) => b.d === data[0].d).length; st.idx = day1 + 6; intro = `New synthetic session (seed ${st.seed}). Previous day shown for context; today has opened.`; }
      acc = IA.exec.newAccount(ins().cur === 'INR' ? 500000 : 25000, st.preset); tkState.onIns && tkState.onIns(); chartHost.innerHTML = ''; chart = new IA.Chart(chartHost, { height: 340, paneH: 70, synthetic: !st.ds, label }); chartHost.prepend(IA.chartToolbar(chart, { types: false })); chart.setTokens(data, ['vol', 'vwap', 'ema20']); chart.setEnd(st.idx); log.innerHTML = ''; log.append(h('div', null, intro)); upd(); }
    function step() {
      if (st.idx >= data.length) { stop(); review(); return; }
      const bar = data[st.idx]; const ev = IA.exec.processBar(acc, bar, ins(), rng); st.idx++;
      ev.forEach((e) => log.prepend(h('div', { class: e.type === 'gap' ? 'warn' : '' }, e.type === 'fill' ? `Filled #${e.id}: ${e.qty} @ ${IA.fmtP(e.price)}${e.partial ? ' (partial)' : ''}` : e.msg)));
      if (st.idx >= data.length || data[st.idx].d !== bar.d) { if (acc.pos.qty) { IA.exec.squareOff(acc, bar, ins()); log.prepend(h('div', { class: 'warn' }, 'Session closed — position squared off at the close.')); } }
      chart.markers = acc.fills.map((f) => ({ i: data.findIndex((b) => b.t === f.t), pos: f.side > 0 ? 'below' : 'above', color: f.side > 0 ? '#26c281' : '#ef5361', text: f.side > 0 ? 'B' : 'S' }));
      chart.levels = acc.pos.qty ? [acc.pos.stop && { price: acc.pos.stop, label: 'SL', color: '#ef5361' }, acc.pos.target && { price: acc.pos.target, label: 'TGT', color: '#26c281' }, { price: acc.pos.avg, label: 'AVG', color: '#8696a7' }].filter(Boolean) : [];
      chart.setEnd(st.idx); upd();
    }
    function upd() { kp.innerHTML = ''; kp.append(accountPanel(acc, data[st.idx - 1].c, ins().cur)); trades.innerHTML = ''; trades.append(table(tradeCols(ins().cur), acc.trades, { empty: 'No closed trades yet.' })); tk.refresh(); }
    function review() {
      stop(); chart.setEnd(null); chart.view.n = data.length; chart.render();
      const s = IA.risk.tradeStats(acc.trades.map((t) => t.net)), cur = ins().cur;
      const m = IA.ui.modal(h('div', null, h('h3', null, 'Session review'), h('p', { class: 'muted small' }, 'The full session is now visible on the chart behind this panel. Judge each trade by whether it followed your plan, not by whether it made money.'),
        acc.trades.length ? IA.ui.resultBlock([['Trades', String(s.n)], ['Win rate', IA.ui.pct(s.winRate)], ['Net P&L', money(s.net, cur), IA.ui.signCls(s.net)], ['Charges', money(acc.charges, cur)], ['Profit factor', num(s.profitFactor)]]) : h('p', null, 'No trades taken. Sitting out is a legitimate decision — but practise taking planned trades too.'),
        h('h4', { style: { marginTop: '12px' } }, 'Ask yourself'), h('ul', { class: 'small' }, ['Was every entry a setup from your written plan?', 'Was every stop placed where the idea is proved wrong — and sized to it?', 'Did you move a stop away from price or exit a winner early out of fear?', 'What did the hidden part of the session do after you exited? (Hindsight is information, not regret.)'].map((x) => h('li', null, x))),
        h('div', { class: 'row' }, acc.trades.length ? h('button', { class: 'btn primary', type: 'button', onclick: async () => { await toJournal(acc.trades, ins(), 'replay'); toast('Saved to journal (marked synthetic)'); m.close(); } }, 'Save trades to journal') : null, h('button', { class: 'btn', type: 'button', onclick: () => { m.close(); reset(); } }, 'New session'), h('button', { class: 'btn ghost', type: 'button', onclick: () => m.close() }, 'Close'))));
    }
    const keys = (e) => { if (/input|select|textarea/i.test(e.target.tagName)) return; if (e.key === 'ArrowRight' || e.key === 'n') { e.preventDefault(); if (e.shiftKey) { for (let k = 0; k < 6; k++) step(); } else step(); } else if (e.key === ' ') { e.preventDefault(); playBtn.click(); } else if (e.key === 'b') document.querySelector('.btn.buy')?.click(); else if (e.key === 's') document.querySelector('.btn.sell')?.click(); else if (e.key === 'x') [...document.querySelectorAll('button')].find((b) => b.textContent === 'Close position')?.click(); };
    document.addEventListener('keydown', keys); top.append(h('div', { class: 'tiny dim' }, 'Keyboard (laptop): → or N next bar · Shift+→ six bars · Space play/pause · B buy · S sell · X close position'));
    reset(); return { cleanup: () => { stop(); document.removeEventListener('keydown', keys); } };
  }

  // ---------- 2. Decision simulator ----------
  function decision(el) {
    const types = Object.keys(IA.gen.SCENARIOS); let cur = null, chart;
    const sel = h('select', { class: 'i' }, [['random', 'Random scenario'], ...types.map((k) => [k, IA.gen.SCENARIOS[k].title])].map(([a, b]) => h('option', { value: a }, b)));
    const area = h('div'), stats = h('div', { class: 'card', style: { marginTop: '12px' } });
    el.append(h('p', { class: 'muted' }, 'Each scenario shows a session up to a decision point. Choose what a disciplined trader would do. You are graded on the quality of the decision against standard rules — then the hidden candles are revealed. The outcome is randomised: good decisions sometimes lose and bad ones sometimes win. That gap between process and outcome is the lesson.'), h('div', { class: 'card' }, h('div', { class: 'form' }, h('label', { class: 'f' }, 'Scenario', sel), h('div', { class: 'f', style: { justifyContent: 'flex-end' } }, h('button', { class: 'btn primary', type: 'button', onclick: next }, 'New scenario'))), area), stats);
    function next() {
      const t = sel.value === 'random' ? types[Math.floor(Math.random() * types.length)] : sel.value; cur = IA.gen.scenario(t, Math.floor(Math.random() * 1e9)); area.innerHTML = '';
      area.append(h('h3', { style: { marginTop: '12px' } }, sel.value === 'random' ? 'What do you do?' : cur.title), t === 'exit-test' ? h('p', { class: 'small warn' }, 'Context: you are already LONG from the early part of this move, with your planned target at this area.') : h('p', { class: 'small muted' }, 'Context: flat, 5-minute chart, VWAP and 20-EMA shown, volume below.'));
      chart = new IA.Chart(area, { height: 300, paneH: 70 }); chart.setTokens([...cur.history, ...cur.future], ['vol', 'vwap', 'ema20']); chart.setEnd(cur.history.length); chart.view.n = cur.history.length + cur.future.length; chart.render();
      const btns = h('div', { class: 'row', style: { marginTop: '10px' } }, [['buy', 'Buy'], ['sell', 'Sell / short'], ['wait', 'Wait'], ['exit', 'Exit'], ['avoid', 'Avoid the trade']].map(([k, l]) => h('button', { class: 'btn ' + (k === 'buy' ? 'buy' : k === 'sell' ? 'sell' : ''), type: 'button', onclick: () => answer(k, btns) }, l)));
      area.append(btns);
    }
    async function answer(k, btns) {
      btns.querySelectorAll('button').forEach((b) => (b.disabled = true)); chart.setEnd(null); const last = cur.history[cur.history.length - 1].c, end = cur.future[cur.future.length - 1].c, moved = (end - last) / last;
      const okSet = { buy: ['buy'], sell: ['sell'], wait: ['wait', 'avoid'], avoid: ['avoid', 'wait'], exit: ['exit'] }[cur.ideal]; const good = okSet.includes(k);
      const outcomeFav = k === 'buy' ? moved > 0 : k === 'sell' ? moved < 0 : k === 'exit' ? moved < 0 : null;
      chart.markers = [{ i: cur.history.length - 1, pos: 'above', color: '#f2b84b', text: 'decision' }]; chart.render();
      area.append(h('div', { class: 'result' }, h('div', null, h('b', { class: good ? 'up' : 'down' }, good ? 'Sound decision.' : 'Not the disciplined choice.'), ` Rule-based answer: `, h('b', null, cur.ideal.toUpperCase()), '.'), h('p', { class: 'small' }, cur.why), h('p', { class: 'small' }, h('b', null, 'What happened next: '), `price moved ${moved >= 0 ? '+' : ''}${(moved * 100).toFixed(2)}% over the next ${cur.future.length} bars. `, outcomeFav === null ? '' : outcomeFav ? 'Your choice would have been rewarded this time.' : 'Your choice would have lost this time.', good && outcomeFav === false ? ' A good decision with a bad outcome — that is normal and expected some of the time.' : '', !good && outcomeFav ? ' A poor decision that happened to work — the most dangerous kind, because it teaches the wrong habit.' : ''), h('button', { class: 'btn primary', type: 'button', onclick: next }, 'Next scenario')));
      await IA.progress.addDecision({ ts: Date.now(), type: cur.type, choice: k, ideal: cur.ideal, good, outcome: outcomeFav }); showStats();
    }
    function showStats() { const d = IA.progress.state.decisions; stats.innerHTML = ''; stats.append(h('h3', null, 'Your decision record'), d.length ? table([{ label: 'Scenario', k: 'k' }, { label: 'Attempts', k: 'n', n: 1 }, { label: 'Sound decisions', get: (r) => IA.ui.pct(r.g / r.n, 0), n: 1 }], Object.entries(d.reduce((a, x) => { (a[x.type] = a[x.type] || { n: 0, g: 0 }).n++; if (x.good) a[x.type].g++; return a; }, {})).map(([k, v]) => ({ k: IA.gen.SCENARIOS[k]?.title || k, ...v }))) : h('p', { class: 'muted small' }, 'No decisions yet.')); }
    showStats(); next();
  }

  // ---------- 3. Paper trading (persistent) ----------
  async function paper(el) {
    const q = IA.query || new URLSearchParams();
    let S = await IA.db.get('paper', null);
    const newBook = (preset, cash) => ({ preset, seed: Math.floor(Math.random() * 1e6), idx: 0, acc: IA.exec.newAccount(cash, preset), created: Date.now() });
    if (!S || (q.get('preset') && q.get('preset') !== S.preset && await IA.ui.ask('Start a new paper account on ' + IA.gen.PRESETS[q.get('preset')].name + '? Your current paper account will be reset (journalled trades are kept).'))) S = newBook(q.get('preset') || 'NIFTY', 500000);
    const ins = () => IA.exec.INSTR[S.preset];
    const data = IA.gen.generate({ preset: S.preset, seed: S.seed, days: 20, tfMin: 5 }).candles; if (!S.idx) S.idx = data.filter((b) => b.d === data[0].d).length + 3;
    const rng = IA.gen.rng(S.seed + S.idx);
    const kp = h('div', { style: { margin: '12px 0' } }), chartHost = h('div'), orders = h('div'), trades = h('div'), log = h('div', { class: 'small muted' });
    el.append(h('p', { class: 'muted' }, 'A persistent virtual account on a synthetic 20-session market. Time moves only when you advance it. Realism: next-bar execution, spread, slippage, partial fills when your size exceeds ~10% of bar volume, gaps between sessions, India/US charges, and automatic square-off at each session close. Nothing here touches a real broker.'));
    const top = h('div', { class: 'card' }); el.append(top, kp);
    top.append(h('div', { class: 'row' }, h('b', null, IA.gen.PRESETS[S.preset].name), h('span', { class: 'tag' }, ins().sym), h('span', { class: 'tag warn' }, 'synthetic'), h('span', { class: 'small muted', id: 'pp-day' })), h('div', { class: 'row', style: { margin: '10px 0' } }, h('button', { class: 'btn primary', type: 'button', onclick: () => adv(1) }, 'Advance 1 bar'), h('button', { class: 'btn', type: 'button', onclick: () => adv(6) }, '+30 min'), h('button', { class: 'btn', type: 'button', onclick: () => adv('eod') }, 'To session close'), h('button', { class: 'btn ghost', type: 'button', onclick: async () => { const sel2 = await IA.ui.askText('New paper account.\nInstrument (' + PRESETS().join(', ') + '):', S.preset); if (!sel2 || !IA.exec.INSTR[sel2.toUpperCase()]) return; const cash = +await IA.ui.askText('Starting virtual capital:', IA.exec.INSTR[sel2.toUpperCase()].cur === 'INR' ? 500000 : 25000); if (!(cash > 0)) return; S = newBook(sel2.toUpperCase(), cash); await IA.db.set('paper', S); IA.views.simulator(el.replaceChildren() || el, 'paper'); } }, 'Reset account')), chartHost);
    const chart = new IA.Chart(chartHost, { height: 340, paneH: 70 }); chartHost.prepend(IA.chartToolbar(chart, { types: false })); chart.setTokens(data, ['vol', 'vwap', 'ema20']);
    const tk = ticket({ preset: S.preset, price: () => data[S.idx - 1].c, equity: () => IA.exec.equity(S.acc, data[S.idx - 1].c) }, async (o) => { IA.exec.place(S.acc, o); log.prepend(h('div', null, `Placed #${S.acc.seq - 1}: ${o.side > 0 ? 'BUY' : 'SELL'} ${o.qty} ${o.type}${o.price ? ' @ ' + o.price : ''}`)); await save(); upd(); });
    el.append(h('div', { class: 'grid g2' }, tk, h('div', { class: 'card' }, h('h3', null, 'Working orders'), orders, h('h3', { style: { marginTop: '12px' } }, 'Event log'), log)), h('div', { class: 'card', style: { marginTop: '12px' } }, h('div', { class: 'spread' }, h('h3', null, 'Closed trades'), h('button', { class: 'btn sm', type: 'button', onclick: async () => { const nw = S.acc.trades.filter((t) => !t.journalled); if (!nw.length) return toast('No new trades to journal.'); await toJournal(nw, ins(), 'paper'); nw.forEach((t) => (t.journalled = true)); await save(); toast(`${nw.length} trade(s) journalled`); } }, 'Send new trades to journal')), trades));
    const save = () => IA.db.set('paper', S);
    async function adv(n) {
      if (S.idx >= data.length) { toast('End of the 20-session market. Reset the account to continue.'); return; }
      const day = data[S.idx].d; let k = 0;
      while (S.idx < data.length && (n === 'eod' ? data[S.idx].d === day : k < n)) {
        const bar = data[S.idx]; IA.exec.processBar(S.acc, bar, ins(), rng).forEach((e) => log.prepend(h('div', { class: e.type === 'gap' || e.type === 'partial' ? 'warn' : '' }, e.type === 'fill' ? `${bar.d} ${new Date(bar.t).toISOString().slice(11, 16)} · filled #${e.id}: ${e.qty} @ ${IA.fmtP(e.price)}${e.partial ? ' (partial)' : ''}` : e.msg)));
        S.idx++; k++;
        if (S.idx >= data.length || data[S.idx].d !== bar.d) { if (S.acc.pos.qty) { IA.exec.squareOff(S.acc, bar, ins()); log.prepend(h('div', { class: 'warn' }, `${bar.d}: session close — intraday position squared off.`)); } else S.acc.orders.filter((o) => o.status === 'open' || o.status === 'partial').forEach((o) => (o.status = 'cancelled')); break; }
      }
      await save(); upd();
    }
    function upd() {
      const px = data[S.idx - 1].c; kp.innerHTML = ''; kp.append(accountPanel(S.acc, px, ins().cur));
      const dEl = document.getElementById('pp-day'); if (dEl) dEl.textContent = `Session ${[...new Set(data.slice(0, S.idx).map((b) => b.d))].length}/20 · ${data[S.idx - 1].d} ${new Date(data[S.idx - 1].t).toISOString().slice(11, 16)}`;
      chart.markers = S.acc.fills.map((f) => ({ i: data.findIndex((b) => b.t === f.t), pos: f.side > 0 ? 'below' : 'above', color: f.side > 0 ? '#26c281' : '#ef5361', text: f.side > 0 ? 'B' : 'S' })).filter((m) => m.i >= 0);
      chart.levels = S.acc.orders.filter((o) => o.status === 'open' && o.price).map((o) => ({ price: o.price, label: o.parent ? (o.type === 'stop' ? 'SL' : 'TGT') : 'ORD', color: o.parent ? (o.type === 'stop' ? '#ef5361' : '#26c281') : '#4fb3ff' }));
      chart.setEnd(S.idx);
      orders.innerHTML = ''; orders.append(table([{ label: '#', k: 'id' }, { label: 'Side', get: (o) => (o.side > 0 ? 'BUY' : 'SELL') }, { label: 'Type', get: (o) => (o.parent ? (o.type === 'stop' ? 'bracket SL' : 'bracket TGT') : o.type) }, { label: 'Qty', get: (o) => `${o.filled}/${o.qty}`, n: 1 }, { label: 'Price', get: (o) => (o.price ? IA.fmtP(o.price) : 'mkt'), n: 1 }, { label: '', get: (o) => h('button', { class: 'btn sm ghost', type: 'button', onclick: async () => { IA.exec.cancel(S.acc, o.id); await save(); upd(); } }, 'Cancel') }], S.acc.orders.filter((o) => o.status === 'open' || o.status === 'partial'), { empty: 'No working orders.' }));
      trades.innerHTML = ''; trades.append(table(tradeCols(ins().cur), S.acc.trades.slice().reverse(), { empty: 'No closed trades yet.' })); tk.refresh();
    }
    upd(); await save();
  }
})(typeof window !== 'undefined' ? window : globalThis);
