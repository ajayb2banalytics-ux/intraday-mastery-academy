/* Strategy bot (Simulator → Strategy bot) and the "Automate these rules" panel shown under backtest results. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const { h, toast, table, money, num } = IA.ui;
  const KEY = 'botcfg', STATE = 'botstate', MAXBARS = 1500;
  const DEFAULT = () => ({ name: 'Opening-range breakout above VWAP (long)', data: { preset: 'NIFTY', seed: Math.floor(Math.random() * 1e6), days: 20, tf: 5 }, cfg: { side: 1, entry: [{ id: 'orb', params: { bars: 3 } }, { id: 'vwap_side' }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 }, capital: 2000000, riskPct: 0.5, costBps: 3, slippageTicks: 1, maxTradesPerDay: 2, maxLeverage: 5 } });
  const sessionEnd = (ins) => (ins && ins.cur === 'INR' ? '15:30' : '16:00');
  const hm = (t) => new Date(t).toISOString().slice(11, 16);
  const safeName = (s) => String(s || 'strategy').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'strategy';

  async function loadData(spec) {
    // The bot recomputes every signal from past bars at each step (honest, but O(n²)), so it runs on at most MAXBARS bars.
    if (spec.dsId) { const ds = await IA.datasets.get(spec.dsId); if (ds) { const c = ds.candles.length > MAXBARS ? ds.candles.slice(-MAXBARS) : ds.candles; return { candles: c, ins: IA.datasets.instr(ds), label: `HISTORICAL · ${ds.name}${c.length < ds.candles.length ? ` (last ${c.length} bars)` : ''}`, synthetic: false, tf: ds.tfMin || 5 }; } }
    const p = spec.preset && IA.gen.PRESETS[spec.preset] ? spec.preset : 'NIFTY';
    const tf = spec.tf || 5, perDay = Math.ceil((IA.gen.PRESETS[p].minutes || 375) / tf), days = Math.max(3, Math.min(spec.days || 20, Math.floor(MAXBARS / perDay)));
    return { candles: IA.gen.generate({ preset: p, seed: spec.seed || 1, days, tfMin: tf }).candles, ins: IA.exec.INSTR[p], label: `SYNTHETIC · ${IA.gen.PRESETS[p].name} · seed ${spec.seed}`, synthetic: true, tf: spec.tf || 5, preset: p };
  }
  const barsCsv = (c) => 'datetime,open,high,low,close,volume\n' + c.map((b) => `${b.d} ${hm(b.t)},${b.o},${b.h},${b.l},${b.c},${b.v}`).join('\n') + '\n';

  // Panel used under backtest results and on the bot screen.
  IA.automatePanel = ({ cfg, candles, ins, name, tf, dataSpec, showBot = true }) => {
    const meta = { name, tfMin: tf || 5, sessionEnd: sessionEnd(ins), date: new Date().toISOString().slice(0, 10) };
    const base = safeName(name), pyName = base + '.py';
    const pre = h('pre', { class: 'code', style: { maxHeight: '320px', overflow: 'auto', fontSize: '12px', whiteSpace: 'pre' } });
    const show = (txt) => { pre.textContent = txt; det.open = true; };
    const det = h('details', { style: { marginTop: '10px' } }, h('summary', { class: 'small' }, 'Preview code'), pre);
    return h('div', { class: 'card', style: { marginTop: '12px' } }, h('h3', null, 'Automate these rules'),
      h('p', { class: 'small muted' }, 'Forward-test the exact rules with the paper bot, or export them as code. The Python file re-implements the app\'s indicators and rules with the standard library only and reproduces this backtest trade for trade on the same bars. The Pine Script follows the same rules in TradingView, but its results will be close to, not identical with, the app\'s. Neither file places orders. Read the lesson on India\'s retail algo rules before automating anything.'),
      h('div', { class: 'row' },
        showBot ? h('button', { class: 'btn primary', type: 'button', onclick: async () => { await IA.db.set(KEY, { name, data: dataSpec, cfg: JSON.parse(JSON.stringify(cfg)) }); await IA.db.del(STATE); IA.go('#/simulator/bot'); } }, 'Send to Strategy bot') : null,
        h('button', { class: 'btn', type: 'button', onclick: () => { const s = IA.codegen.python(cfg, { ...meta, file: pyName }); show(s); IA.ui.download(pyName, s, 'text/x-python'); } }, 'Export as Python'),
        h('button', { class: 'btn', type: 'button', onclick: () => { const s = IA.codegen.pine(cfg, meta); show(s); IA.ui.download(base + '.pine', s, 'text/plain'); } }, 'Export as Pine Script'),
        candles ? h('button', { class: 'btn ghost', type: 'button', onclick: () => IA.ui.download(base + '-bars.csv', barsCsv(candles), 'text/csv') }, 'Download these bars (CSV)') : null,
        h('a', { class: 'btn ghost', href: '#/lesson/l4-algo-india' }, 'Algo rules in India')),
      h('p', { class: 'small muted', style: { marginTop: '6px' } }, `Run the Python on the bars file: python3 ${pyName} ${base}-bars.csv trades.csv`), det);
  };

  IA.botView = async (el) => {
    let spec = (await IA.db.get(KEY, null)) || DEFAULT();
    const D = await loadData(spec.data || {}); const candles = D.candles;
    const cfg = { ...spec.cfg, tick: D.ins.tick, lot: D.ins.lot };
    const firstDay = candles[0].d, startI = Math.max(1, candles.findIndex((b) => b.d !== firstDay));
    const bot = IA.bot.create(candles, cfg, { startI });
    const saved = await IA.db.get(STATE, null);
    if (saved && saved.key === JSON.stringify([spec.data, spec.cfg]) && saved.i > startI) IA.bot.advance(bot, candles, saved.i - startI);
    const save = () => IA.db.set(STATE, { key: JSON.stringify([spec.data, spec.cfg]), i: bot.i, journalled: journalled });
    let journalled = saved && saved.key === JSON.stringify([spec.data, spec.cfg]) ? saved.journalled || 0 : 0;
    const C = bot.C, fmt = (x) => IA.fmtP(x);

    el.append(h('p', { class: 'muted' }, 'A paper-trading bot runs your backtester rules bar by bar on bars it has not seen, using only past bars for every decision, and logs what it does and why. Session 1 is indicator history; the bot trades from session 2. Nothing here touches a real broker.'));
    const rules = IA.codegen.rules(C);
    el.append(h('div', { class: 'card' }, h('div', { class: 'spread' }, h('h3', { style: { margin: 0 } }, spec.name || 'Strategy'), h('span', { class: 'tag ' + (D.synthetic ? 'warn' : '') }, D.label)),
      h('ul', { class: 'small', style: { margin: '8px 0' } }, h('li', null, `${C.side > 0 ? 'Long' : 'Short'} when ALL are true on a bar's close: ${rules.join(' + ')}; entry at the next bar's open.`), h('li', null, `Stop ${C.stop.type === 'atr' ? C.stop.mult + ' × ATR(14)' : C.stop.pct + '%'} · target ${C.target && C.target.rr ? C.target.rr + 'R' : 'none'} · risk ${C.riskPct}% of equity · exposure ≤ ${C.maxLeverage}× equity · max ${C.maxTradesPerDay} trades/day · square-off at the session close.`), h('li', null, `Costs ${C.costBps} bps per side, slippage ${C.slippageTicks} tick(s); ${D.ins.sym}, lot ${C.lot}, tick ${C.tick}.`)),
      h('div', { class: 'row' }, h('a', { class: 'btn sm ghost', href: '#/quant/backtest' }, 'Change rules in the Backtester'), h('button', { class: 'btn sm ghost', type: 'button', onclick: async () => { if (!(await IA.ui.ask('Start the bot again on a new synthetic market (new seed)?'))) return; spec = { ...spec, data: { ...(spec.data || {}), dsId: null, seed: Math.floor(Math.random() * 1e6) } }; await IA.db.set(KEY, spec); await IA.db.del(STATE); IA.views.simulator(el.replaceChildren() || el, 'bot'); } }, 'New market'), h('button', { class: 'btn sm ghost', type: 'button', onclick: async () => { await IA.db.del(STATE); IA.views.simulator(el.replaceChildren() || el, 'bot'); } }, 'Restart this market'))));

    const kp = h('div', { class: 'grid g4 kpis', style: { margin: '12px 0' } }), dayLbl = h('span', { class: 'small muted', id: 'bot-day' });
    const per30 = Math.max(1, Math.round(30 / (D.tf || 5)));
    const ctrl = h('div', { class: 'card' }, h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'button', onclick: () => adv(1) }, 'Advance 1 bar'), h('button', { class: 'btn', type: 'button', onclick: () => adv(per30) }, '+30 min'), h('button', { class: 'btn', type: 'button', onclick: () => adv('eod') }, 'To session close'), h('button', { class: 'btn', type: 'button', onclick: () => adv('all') }, 'Run to the end'), dayLbl));
    const chartHost = h('div', { style: { marginTop: '10px' } }); ctrl.append(chartHost);
    const log = h('div', { class: 'small', style: { maxHeight: '320px', overflow: 'auto' } }), trades = h('div');
    el.append(ctrl, kp, h('div', { class: 'grid g2' }, h('div', { class: 'card' }, h('h3', null, 'Decision log'), log), h('div', { class: 'card' }, h('div', { class: 'spread' }, h('h3', null, 'Closed trades'), h('button', { class: 'btn sm', type: 'button', onclick: toJournal }, 'Send new trades to journal')), trades)));
    el.append(IA.automatePanel({ cfg: C, candles, ins: D.ins, name: spec.name, tf: D.tf, dataSpec: spec.data, showBot: false }));
    const chart = new IA.Chart(chartHost, { height: 320, paneH: 70, synthetic: D.synthetic }); chart.setTokens(candles, ['vol', 'vwap']);

    async function toJournal() {
      const nw = bot.S.trades.slice(journalled); if (!nw.length) return toast('No new trades to journal.');
      await IA.simToJournal(nw.map((t) => ({ ...t, openT: t.entryT, closeT: t.exitT, charges: t.costs, stop: null })), D.ins, 'strategy-bot');
      journalled = bot.S.trades.length; await save(); toast(`${nw.length} trade(s) saved to the journal (marked synthetic)`);
    }
    function adv(n) { if (bot.done) return toast('The bot has processed every bar of this market. Start a new market to continue.'); const t0 = Date.now(); IA.bot.advance(bot, candles, n); save(); draw(); if (Date.now() - t0 > 1500) toast('Done'); }
    function draw() {
      const s = IA.bot.summary(bot), eq = IA.bot.equity(bot, candles), op = IA.bot.unrealised(bot, candles), last = candles[Math.max(0, bot.i - 1)];
      dayLbl.textContent = bot.done ? 'End of data' : `Bar ${bot.i - startI} of ${candles.length - startI} · ${last.d} ${hm(last.t)}`;
      kp.innerHTML = ''; [['Equity', money(eq), IA.ui.signCls(eq - C.capital)], ['Open P&L', money(op), IA.ui.signCls(op)], ['Position', bot.S.pos ? `${C.side > 0 ? 'long' : 'short'} ${bot.S.pos.qty} @ ${fmt(bot.S.pos.entry)}` : bot.S.pending ? 'order pending' : 'flat'], ['Closed trades', s.n || 0], ['Net (closed)', money(s.net || 0), IA.ui.signCls(s.net)], ['Win rate', IA.ui.pct(s.winRate || 0, 0)], ['Avg R', num(s.avgR || 0, 2), IA.ui.signCls(s.avgR)], ['Costs paid', money(s.totalCosts || 0)]].forEach(([l, v, cl]) => kp.append(h('div', { class: 'card kpi' }, h('span', { class: 'l' }, l), h('span', { class: 'v ' + (cl || '') }, String(v)))));
      log.innerHTML = ''; const lines = bot.log.slice(-250).reverse(); if (!lines.length) log.append(h('p', { class: 'muted' }, 'No decisions yet. Advance the bot.'));
      lines.forEach((e) => log.append(h('div', { class: e.type === 'exit' ? (e.trade.net >= 0 ? 'up' : 'down') : e.type === 'skip' ? 'warn' : e.type === 'entry' ? '' : 'muted', style: { padding: '2px 0' } }, IA.bot.describe(e, candles, C, fmt))));
      trades.innerHTML = ''; trades.append(table([{ label: 'Day', k: 'day' }, { label: 'In', get: (t) => hm(t.entryT) }, { label: 'Out', get: (t) => hm(t.exitT) }, { label: 'Qty', k: 'qty', n: 1 }, { label: 'Entry', get: (t) => fmt(t.entry), n: 1 }, { label: 'Exit', get: (t) => fmt(t.exit), n: 1 }, { label: 'Net', get: (t) => money(t.net), n: 1, cls: (t) => IA.ui.signCls(t.net) }, { label: 'R', get: (t) => num(t.R, 2), n: 1 }, { label: 'Why', k: 'why' }], bot.S.trades.slice().reverse(), { empty: 'No closed trades yet.' }));
      chart.markers = bot.S.trades.flatMap((t) => [{ i: t.entryI, pos: C.side > 0 ? 'below' : 'above', color: '#4fb3ff', text: 'in' }, { i: t.exitI, pos: C.side > 0 ? 'above' : 'below', color: t.net > 0 ? '#26c281' : '#ef5361', text: t.why === 'target' ? 'T' : t.why.startsWith('stop') ? 'S' : 'E' }]).concat(bot.S.pos ? [{ i: bot.S.pos.entryI, pos: C.side > 0 ? 'below' : 'above', color: '#f2b84b', text: 'open' }] : []);
      chart.levels = bot.S.pos ? [{ price: bot.S.pos.stop, color: '#ef5361', label: 'stop' }].concat(bot.S.pos.target != null ? [{ price: bot.S.pos.target, color: '#26c281', label: 'target' }] : []) : [];
      chart.setEnd(bot.i);
    }
    draw();
  };
})(typeof window !== 'undefined' ? window : globalThis);
