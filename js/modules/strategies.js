/* Strategy Academy: 30-strategy library + comparison lab (backtests on identical synthetic data). */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const { h, prose, table, num, money, pct } = IA.ui;
  IA.views.strategies = (el) => {
    const S = IA.content.strategies || [];
    el.append(h('p', { class: 'muted' }, `${S.length} intraday strategies with concrete rules, worked winning and losing trades, failure conditions and a testing plan. None is labelled "profitable" — the evidence for intraday rules is mixed at best, and you must test each one yourself.`));
    const fam = [...new Set(S.map((s) => s.family))];
    fam.forEach((f) => el.append(h('h3', { style: { marginTop: '14px', textTransform: 'capitalize' } }, f), h('div', { class: 'grid gauto' }, S.filter((s) => s.family === f).map((s) => h('a', { class: 'card card-link', href: '#/strategy/' + s.id }, h('div', { class: 'spread' }, h('span', { class: 'tag' }, '#' + s.n), IA.ui.evTag(s.evidence)), h('h3', { style: { marginTop: '6px' } }, s.name), h('div', { class: 'small muted' }, s.btConfig ? 'Backtestable in the lab' : 'Discretionary — practise in replay'))))));
    compareLab(el, S);
  };
  IA.views.strategy = (el, id) => {
    const s = (IA.content.strategies || []).find((x) => x.id === id); if (!s) return IA.views.notfound(el); IA.setTitle(s.name);
    el.append(h('a', { href: '#/strategies', class: 'small' }, '← Strategy Academy'), h('div', { class: 'row', style: { marginTop: '8px' } }, h('h2', { style: { margin: 0 } }, `${s.n}. ${s.name}`), h('span', { class: 'tag' }, s.family), IA.ui.evTag(s.evidence)));
    const F = [['concept', 'Concept'], ['logic', 'Market logic — why it might work'], ['markets', 'Suitable markets'], ['timeframes', 'Suitable timeframes'], ['indicators', 'Indicators required'], ['setup', 'Setup identification'], ['entry', 'Entry conditions'], ['confirmation', 'Confirmation'], ['stop', 'Stop-loss'], ['target', 'Target'], ['sizing', 'Position sizing'], ['rr', 'Risk / reward'], ['exits', 'Exit rules'], ['management', 'Trade management'], ['winExample', 'Worked winning example'], ['loseExample', 'Worked losing example'], ['failure', 'Failure conditions'], ['mistakes', 'Common mistakes'], ['backtest', 'How to backtest it']];
    el.append(prose((s.chart ? s.chart + '\n\n' : '') + F.map(([k, l]) => `## ${l}\n\n${s[k] || '*—*'}`).join('\n\n')));
    if (s.btConfig) { const box = h('div', { class: 'card', style: { marginTop: '16px' } }, h('h3', null, 'Test the mechanical version'), h('p', { class: 'small muted' }, 'Runs the app\'s rule-based approximation of this strategy on synthetic data. Treat it as a mechanics demo, not evidence.')); el.append(box); box.append(h('a', { class: 'btn primary', href: '#/quant/backtest?strategy=' + s.id }, 'Open in Quant Lab')); }
    else el.append(h('div', { class: 'card', style: { marginTop: '16px' } }, h('h3', null, 'Practise it'), h('p', { class: 'small muted' }, 'This setup needs discretionary judgement the mechanical backtester cannot express. Practise it bar by bar in Chart Replay and log every attempt in the journal with this strategy name, then analyse the journal statistics after 50+ attempts.'), h('a', { class: 'btn', href: '#/simulator/replay' }, 'Open Chart Replay')));
  };
  function compareLab(el, S) {
    const testable = S.filter((s) => s.btConfig); if (!testable.length) return;
    const box = h('div', { class: 'card', style: { marginTop: '18px' } }, h('h3', null, 'Strategy comparison laboratory'), h('p', { class: 'small muted' }, 'Run several mechanical strategies on the SAME synthetic data with the same risk, costs and slippage. Then change the seed: if the ranking reshuffles, none of them has shown a robust edge — which is the usual result on random data, and an important lesson.'));
    const picks = new Set(testable.slice(0, 4).map((s) => s.id)), st = { preset: 'NIFTY', days: 60, seed: 7, cost: 3 };
    const chips = h('div', { class: 'row', style: { gap: '6px', margin: '8px 0' } }, testable.map((s) => { const b = h('button', { type: 'button', class: 'btn sm ' + (picks.has(s.id) ? 'sel' : 'ghost'), onclick: () => { picks.has(s.id) ? picks.delete(s.id) : picks.add(s.id); b.classList.toggle('sel'); b.classList.toggle('ghost'); } }, s.name); return b; }));
    const num2 = (k, l) => { const i = h('input', { class: 'i num', type: 'number', value: st[k] }); i.oninput = () => (st[k] = +i.value); return h('label', { class: 'f' }, l, i); };
    const ps = h('select', { class: 'i' }, ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'MIDCAP', 'SPY', 'NVDA'].map((k) => h('option', { value: k }, IA.gen.PRESETS[k].name))); ps.onchange = () => (st.preset = ps.value);
    const out = h('div');
    box.append(chips, h('div', { class: 'form' }, h('label', { class: 'f' }, 'Market', ps), num2('days', 'Sessions'), num2('seed', 'Seed'), num2('cost', 'Costs (bps per side)'), h('div', { class: 'f', style: { justifyContent: 'flex-end' } }, h('button', { class: 'btn primary', type: 'button', onclick: run }, 'Run comparison'))), out);
    el.append(box);
    function run() {
      out.innerHTML = 'Running…'; setTimeout(() => {
        const ins = IA.exec.INSTR[st.preset]; const data = IA.gen.generate({ preset: st.preset, seed: st.seed, days: Math.min(250, Math.max(5, st.days)), tfMin: 5 }).candles;
        const rows = [...picks].map((id) => { const s = S.find((x) => x.id === id); const r = IA.bt.run(data, { ...s.btConfig, capital: 500000, riskPct: 0.5, tick: ins.tick, lot: ins.lot, costBps: st.cost }); return { name: s.name, ...(r.stats || {}), curve: r.curve, err: r.error }; });
        out.innerHTML = ''; out.append(h('p', { class: 'small warn' }, `Synthetic data · ${data.length} bars · seed ${st.seed}. Results say nothing about real markets.`), table([{ label: 'Strategy', k: 'name' }, { label: 'Trades', k: 'n', n: 1 }, { label: 'Win %', get: (r) => pct(r.winRate || 0, 1), n: 1 }, { label: 'PF', get: (r) => num(r.profitFactor || 0), n: 1 }, { label: 'Avg R', get: (r) => num(r.avgR || 0, 2), n: 1 }, { label: 'Net', get: (r) => money(r.net || 0), n: 1, cls: (r) => IA.ui.signCls(r.net) }, { label: 'Max DD', get: (r) => pct(r.maxDDPct || 0, 1), n: 1 }, { label: 'Costs', get: (r) => money(r.totalCosts || 0), n: 1 }], rows));
        const pl = h('div', { style: { marginTop: '10px' } }); out.append(pl); const pal = ['#4fb3ff', '#f2b84b', '#a78bfa', '#3fd0d4', '#ff8c69', '#9be15d', '#ff6fb5'];
        IA.plot(pl, rows.filter((r) => r.curve).map((r, k) => ({ pts: r.curve.map((p, j) => ({ x: j, y: p.eq })), color: pal[k % pal.length] })), { zero: false, height: 220 });
        out.append(h('div', { class: 'row small', style: { marginTop: '6px' } }, rows.map((r, k) => h('span', { style: { color: pal[k % pal.length] } }, '■ ' + r.name))));
      }, 20);
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
