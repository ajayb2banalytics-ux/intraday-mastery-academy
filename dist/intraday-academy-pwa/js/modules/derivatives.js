/* Derivatives Academy: strategy explorer (all 15), Greeks lab, synthetic option chain, futures lab. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const { h, prose, table, num, money } = IA.ui;
  IA.views.derivatives = (el, tab = 'overview') => {
    const tabs = [['overview', 'Overview'], ['payoff', 'Strategy builder'], ['matrix', 'Strategy matrix'], ['greeks', 'Greeks lab'], ['chain', 'Option chain'], ['futures', 'Futures lab']];
    el.append(h('div', { class: 'tabs' }, tabs.map(([k, l]) => h('button', { class: k === tab ? 'on' : '', onclick: () => (location.hash = '#/derivatives/' + k) }, l))));
    if (tab === 'overview') {
      const ls = IA.content.lessonIndex().filter((l) => l.track === 'deriv'), written = new Set(IA.content.lessons.map((l) => l.id));
      el.append(prose(`## Futures and options — a specialist track
Derivatives magnify both skill and mistakes. Work through the lessons in order, then use the labs to see every number move: payoffs at expiry and today, the Greeks as spot, time and volatility change, an option chain with open interest, and futures exposure.

> [!warn] Option *selling* has limited reward and potentially unlimited loss; option *buying* has limited loss per trade but a high probability of losing that premium, especially near expiry. Neither is "safe". India's regulator has repeatedly reported that most individual F&O traders lose money.

> [!india] Indian index options (Nifty, Bank Nifty, Sensex) are European-style and cash-settled. Indian stock options are physically settled if in-the-money at expiry — you may have to take or give delivery of shares worth many times the premium. US equity and ETF options are American-style and can be assigned early.`), h('div', { class: 'card lesson-list' }, ls.map((l) => h('a', { href: written.has(l.id) ? '#/lesson/' + l.id : null }, h('span', { class: 'dot' + (IA.progress.isDone(l.id) ? ' done' : '') }), h('span', { style: { flex: 1 } }, l.title), h('span', { class: 'tiny dim' }, l.module)))));
    } else if (tab === 'payoff') el.append(IA.widgets['options-payoff']());
    else if (tab === 'greeks') greeksLab(el);
    else if (tab === 'matrix') matrix(el);
    else if (tab === 'chain') chain(el);
    else if (tab === 'futures') { el.append(IA.widgets['futures-exposure'](), h('div', { style: { height: '12px' } }), basisLab()); }
  };
  function matrix(el) {
    const S = 25800, w = 200, iv = 0.13, T = 7 / 365, lot = 65;
    const rows = Object.entries(IA.opt.templates).map(([name, f]) => {
      const legs = f(S, w).map((l) => ({ ...l, premium: l.type === 'stock' ? 0 : IA.opt.bs({ S, K: l.K, T, sigma: iv, type: l.type }).price, qty: l.qty * lot }));
      const a = IA.opt.analyse(legs, S); const g = legs.reduce((acc, l) => { if (l.type === 'stock') { acc.d += l.side * l.qty; return acc; } const b = IA.opt.bs({ S, K: l.K, T, sigma: iv, type: l.type }); acc.d += l.side * l.qty * b.delta; acc.t += l.side * l.qty * b.theta; acc.v += l.side * l.qty * b.vega; acc.gm += l.side * l.qty * b.gamma; return acc; }, { d: 0, t: 0, v: 0, gm: 0 });
      return { name, net: a.netPremium, max: a.maxGain, min: a.maxLoss, be: [...new Set(a.breakevens.map((b) => Math.round(b)))].join(' / ') || '—', ...g };
    });
    el.append(h('p', { class: 'muted' }, 'All 15 strategies priced the same way: Nifty-like spot 25,800, strikes 200 points apart, IV 13%, 7 days to expiry, lot 65, Black–Scholes premiums. Greeks are position totals (per 1 point, per day, per 1 vol point). Change the inputs in the Strategy builder.'), table([{ label: 'Strategy', k: 'name' }, { label: 'Net premium', get: (r) => money(r.net), n: 1, cls: (r) => IA.ui.signCls(r.net) }, { label: 'Max gain', get: (r) => money(r.max), n: 1 }, { label: 'Max loss', get: (r) => money(r.min), n: 1, cls: () => 'down' }, { label: 'Breakeven(s)', k: 'be', n: 1 }, { label: 'Δ', get: (r) => num(r.d, 1), n: 1 }, { label: 'Γ', get: (r) => num(r.gm, 3), n: 1 }, { label: 'Θ/day', get: (r) => num(r.t, 0), n: 1, cls: (r) => IA.ui.signCls(r.t) }, { label: 'Vega', get: (r) => num(r.v, 0), n: 1 }], rows), h('p', { class: 'small muted' }, 'Positive theta = time decay works for you (you are short options, net). Negative vega = you lose if implied volatility rises. Calendar and diagonal spreads need two expiries and are covered in the lesson and Greeks lab rather than this single-expiry table.'));
  }
  function greeksLab(el) {
    const st = { S: 25800, K: 25800, iv: 13, r: 6.5, type: 'call' };
    const out = h('div'); el.append(IA.widgets.greeks(), h('div', { class: 'card', style: { marginTop: '12px' } }, h('h3', null, 'How the Greeks change'), h('p', { class: 'small muted' }, 'Same strike, different days to expiry. Watch at-the-money gamma explode and theta accelerate as expiry approaches — the core of expiry-day risk.'), (() => { const s = h('select', { class: 'i', style: { maxWidth: '160px' } }, [['delta', 'Delta'], ['gamma', 'Gamma'], ['theta', 'Theta / day'], ['vega', 'Vega'], ['price', 'Premium']].map(([a, b]) => h('option', { value: a }, b))); s.onchange = () => draw(s.value); setTimeout(() => draw('gamma'), 0); s.value = 'gamma'; return s; })(), out));
    function draw(g) { out.innerHTML = ''; const pal = ['#4fb3ff', '#f2b84b', '#a78bfa', '#ef5361']; const days = [30, 7, 2, 0.5]; IA.plot(out, days.map((d, k) => ({ pts: Array.from({ length: 121 }, (_, i) => { const S = st.K * (0.95 + i * 0.1 / 120); return { x: S, y: IA.opt.bs({ S, K: st.K, T: d / 365, r: st.r / 100, sigma: st.iv / 100, type: st.type })[g] }; }), color: pal[k] })), { zero: g !== 'price', height: 240, vlines: [{ x: st.K, label: 'strike' }] }); out.append(h('div', { class: 'row small' }, days.map((d, k) => h('span', { style: { color: pal[k] } }, `■ ${d} day${d === 1 ? '' : 's'}`)))); }
  }
  function chain(el) {
    const st = { S: 25800, step: 50, iv: 13, skew: 0.6, days: 6, seed: 3 };
    const box = h('div'); el.append(h('p', { class: 'muted' }, 'A synthetic Nifty-style weekly option chain. Prices come from Black–Scholes with a simple volatility skew; open interest is randomly generated around round strikes. Use it to practise reading moneyness, OI build-up and PCR — not to infer real positioning.'), box);
    const form = h('div', { class: 'form' }); const inp = (k, l) => { const i = h('input', { class: 'i num', type: 'number', value: st[k], step: 'any' }); i.oninput = () => { st[k] = +i.value; draw(); }; return h('label', { class: 'f' }, l, i); };
    form.append(inp('S', 'Spot'), inp('iv', 'ATM IV %'), inp('skew', 'Put skew (IV pts per 1%)'), inp('days', 'Days to expiry'), inp('seed', 'OI seed')); const tb = h('div', { style: { marginTop: '10px' } }); box.append(h('div', { class: 'card' }, form, tb));
    function draw() {
      const r = IA.gen.rng(st.seed), atm = Math.round(st.S / st.step) * st.step, strikes = Array.from({ length: 21 }, (_, i) => atm + (i - 10) * st.step);
      const rows = strikes.map((K) => { const m = (K - st.S) / st.S * 100, ivK = Math.max(5, st.iv - st.skew * m * 0.6 + Math.abs(m) * 0.4); const c = IA.opt.bs({ S: st.S, K, T: st.days / 365, sigma: ivK / 100, type: 'call' }), p = IA.opt.bs({ S: st.S, K, T: st.days / 365, sigma: ivK / 100, type: 'put' }); const round = K % 500 === 0 ? 3 : K % 100 === 0 ? 1.8 : 1; const coi = Math.round((K >= atm ? 1.4 : 0.6) * round * (40 + r() * 80) * Math.exp(-Math.abs(K - atm) / 900) * 1000), poi = Math.round((K <= atm ? 1.4 : 0.6) * round * (40 + r() * 80) * Math.exp(-Math.abs(K - atm) / 900) * 1000); return { K, ivK, c, p, coi, poi }; });
      const tc = rows.reduce((a, x) => a + x.coi, 0), tp = rows.reduce((a, x) => a + x.poi, 0); const maxC = rows.reduce((a, x) => (x.coi > a.coi ? x : a)), maxP = rows.reduce((a, x) => (x.poi > a.poi ? x : a));
      tb.innerHTML = ''; tb.append(h('div', { class: 'row small', style: { marginBottom: '8px' } }, h('span', { class: 'tag' }, `PCR (OI) ${num(tp / tc, 2)}`), h('span', { class: 'tag down' }, `Highest call OI ${maxC.K}`), h('span', { class: 'tag up' }, `Highest put OI ${maxP.K}`), h('span', { class: 'tag' }, `ATM ${atm}`)));
      tb.append(table([{ label: 'Call OI', get: (x) => num(x.coi, 0), n: 1 }, { label: 'Call LTP', get: (x) => num(x.c.price), n: 1, cls: (x) => (x.K < st.S ? 'acc' : '') }, { label: 'Call Δ', get: (x) => num(x.c.delta, 2), n: 1 }, { label: 'Strike', get: (x) => h('b', { class: x.K === atm ? 'warn' : '' }, x.K), n: 1 }, { label: 'IV %', get: (x) => num(x.ivK, 1), n: 1 }, { label: 'Put Δ', get: (x) => num(x.p.delta, 2), n: 1 }, { label: 'Put LTP', get: (x) => num(x.p.price), n: 1, cls: (x) => (x.K > st.S ? 'acc' : '') }, { label: 'Put OI', get: (x) => num(x.poi, 0), n: 1 }], rows));
      tb.append(h('p', { class: 'small muted' }, 'Blue premiums are in-the-money. High call OI above spot and high put OI below are often described as "resistance" and "support"; that interpretation is popular but contested — OI shows open contracts, not who is long or short or why.'));
    }
    draw();
  }
  function basisLab() {
    return IA.ui.calcForm({ title: 'Basis & cost of carry', note: 'Theoretical futures price F = S × e^((r − q) × T). The difference between actual futures and spot is the basis.', fields: [{ k: 'S', label: 'Spot', v: 25800 }, { k: 'r', label: 'Interest rate %', v: 6.5 }, { k: 'q', label: 'Dividend yield %', v: 1.2 }, { k: 'days', label: 'Days to expiry', v: 21 }, { k: 'F', label: 'Actual futures price', v: 25905 }],
      compute: (v) => { const T = v.days / 365, fair = v.S * Math.exp((v.r - v.q) / 100 * T); return IA.ui.resultBlock([['Fair value', IA.fmtP(fair)], ['Theoretical basis', IA.fmtP(fair - v.S)], ['Actual basis', IA.fmtP(v.F - v.S)], ['Premium vs fair', IA.fmtP(v.F - fair), IA.ui.signCls(v.F - fair)], ['Structure', v.F > v.S ? 'Contango (futures above spot)' : 'Backwardation (futures below spot)']], [`F* = ${v.S} × e^((${v.r}% − ${v.q}%) × ${num(T, 4)}) = ${num(fair)}`, 'Basis converges to zero at expiry. Arbitrageurs keep it near fair value; deviations are usually small and costly to exploit after charges.']); } });
  }
})(typeof window !== 'undefined' ? window : globalThis);
