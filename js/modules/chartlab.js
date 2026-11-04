/* Chart Laboratory: interactive chart, indicators, annotations, CSV import, auto-graded chart-reading drills. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const { h, toast, num } = IA.ui;
  const IND = [['vol', 'Volume'], ['vwap', 'VWAP'], ['ema9', 'EMA 9'], ['ema20', 'EMA 20'], ['ema50', 'EMA 50'], ['sma20', 'SMA 20'], ['sma50', 'SMA 50'], ['bb', 'Bollinger'], ['kc', 'Keltner'], ['dc', 'Donchian'], ['st', 'Supertrend'], ['psar', 'PSAR'], ['ichimoku', 'Ichimoku'], ['vp', 'Vol. profile'], ['rsi', 'RSI'], ['macd', 'MACD'], ['stoch', 'Stochastic'], ['atr', 'ATR'], ['adx', 'ADX/DMI'], ['obv', 'OBV'], ['cci', 'CCI'], ['mfi', 'MFI'], ['willr', '%R'], ['roc', 'ROC'], ['cmf', 'CMF'], ['wma20', 'WMA 20'], ['vwma20', 'VWMA 20'], ['stochf', 'Fast Stoch'], ['stochrsi', 'StochRSI'], ['adl', 'A/D line'], ['sd', 'Std dev'], ['mom', 'Momentum']];

  IA.views.chartlab = async (el) => {
    const qs = IA.query || new URLSearchParams(); const st = { preset: qs.get('preset') || 'NIFTY', seed: +(qs.get('seed') || 42), tf: 5, days: 5, ind: (qs.get('ind') || 'vol,vwap,ema20').split(','), data: null, imported: null };
    const srcBox = h('div', { class: 'f' }); IA.sourcePicker(async (src) => { st.ds = src.kind === 'dataset' ? src.ds : null; await gen(); }).then((p) => { srcBox.replaceWith(p); if (qs.get('ds')) { p.select.value = qs.get('ds'); p.select.onchange(); } });
    const host = h('div', { class: 'card' }), ctrl = h('div', { class: 'form', style: { marginBottom: '10px' } }), chips = h('div', { class: 'row', style: { marginBottom: '10px', gap: '6px' } });
    const sel = (opts, v, f) => { const s = h('select', { class: 'i' }, opts.map(([a, b]) => h('option', { value: a, selected: String(a) === String(v) }, b))); s.onchange = () => f(s.value); return s; };
    ctrl.append(
      h('label', { class: 'f' }, 'Instrument', sel(Object.entries(IA.gen.PRESETS).map(([k, p]) => [k, p.name]), st.preset, (v) => { st.preset = v; st.imported = null; gen(); })),
      h('label', { class: 'f' }, 'Timeframe', sel([[1, '1 min'], [3, '3 min'], [5, '5 min'], [15, '15 min'], [30, '30 min'], [60, '1 hour'], [9999, 'Daily']], st.tf, (v) => { st.tf = +v; gen(); })),
      h('label', { class: 'f' }, 'Sessions', sel([[1, '1 day'], [3, '3 days'], [5, '5 days'], [10, '10 days'], [40, '40 days']], st.days, (v) => { st.days = +v; gen(); })),
      h('label', { class: 'f' }, 'Seed', (() => { const i = h('input', { class: 'i num', type: 'number', value: st.seed }); i.onchange = () => { st.seed = +i.value; gen(); }; return i; })()),
      h('div', { class: 'f', style: { justifyContent: 'flex-end' } }, h('button', { class: 'btn', type: 'button', onclick: () => { st.seed = Math.floor(Math.random() * 1e6); ctrl.querySelector('input').value = st.seed; st.imported = null; gen(); } }, 'New random market')),
      srcBox);
    IND.forEach(([k, l]) => { const b = h('button', { class: 'btn sm ' + (st.ind.includes(k) ? 'sel' : 'ghost'), type: 'button', onclick: () => { st.ind = st.ind.includes(k) ? st.ind.filter((x) => x !== k) : [...st.ind, k]; b.classList.toggle('sel'); b.classList.toggle('ghost'); draw(); } }, l); chips.append(b); });
    const info = h('div', { class: 'small muted', style: { marginTop: '6px' } });
    el.append(h('p', { class: 'muted' }, 'Generate synthetic markets with different regimes, or open a historical dataset you imported in Historical Data. Change timeframe (historical data is resampled upward within sessions), toggle indicators, draw levels and trendlines.'), host);
    const chart = new IA.Chart(host, { height: 380 }); host.prepend(IA.chartToolbar(chart)); host.append(info, h('div', { style: { height: '12px' } }), ctrl, chips);
    chart.onDraw = async () => { const k = annKey(); const all = await IA.db.get('annotations', {}); all[k] = chart.drawings; await IA.db.set('annotations', all); };
    const annKey = () => st.imported ? 'imp:' + st.imported.name : `${st.preset}:${st.seed}:${st.tf}:${st.days}`;
    async function gen() {
      if (st.ds) { const tf = st.tf === 9999 ? 1440 : st.tf; const base = st.ds.candles; const res = tf > st.ds.tfMin ? IA.dataimport.resample(base, tf) : base; const days = [...new Set(res.map((b) => b.d))]; const keep = new Set(days.slice(-Math.max(st.days, st.ds.tfMin >= 1440 || tf >= 1440 ? 250 : 1))); st.imported = { name: st.ds.name, candles: res.filter((b) => keep.has(b.d)) }; if (tf < st.ds.tfMin) toast(`Dataset is ${st.ds.tfLabel}; a lower timeframe cannot be created — showing ${st.ds.tfLabel}.`); }
      else st.imported = null;
      st.data = st.imported ? st.imported.candles : IA.gen.generate({ preset: st.preset, seed: st.seed, days: st.days, tfMin: st.tf === 9999 ? 1e9 : st.tf }).candles; chart.o.synthetic = !st.imported; chart.o.label = st.imported ? 'HISTORICAL · ' + st.imported.name : null; chart.drawings = (await IA.db.get('annotations', {}))[annKey()] || []; draw(true); }
    function draw(fresh) {
      chart.setTokens(st.data, st.ind, { keepView: !fresh }); const c = st.data, last = c[c.length - 1];
      const regimes = [...new Set(c.map((b) => b.regime).filter(Boolean))];
      info.innerHTML = ''; info.append(`${c.length} bars · last close ${IA.fmtP(last.c)} · ${st.imported ? 'HISTORICAL dataset: ' + st.imported.name + ' (your file, not live)' : 'synthetic seed ' + st.seed + (regimes.length ? ' · day regimes: ' + regimes.join(', ') : '')} · drawings saved per chart`);
    }
    async function importCsv() {
      const f = await IA.ui.pickFile('.csv,text/csv'); if (!f) return;
      try { const c = parseOhlcv(f.text); st.imported = { name: f.name, candles: c }; await gen(); toast(`Imported ${c.length} bars`); } catch (e) { toast('Import failed: ' + e.message, 5000); }
    }
    await gen();

    // ---- Drills ----
    const drill = h('div', { class: 'card', style: { marginTop: '16px' } }); el.append(drill); drills(drill, qs.get('drill'));
  };

  function parseOhlcv(text) {
    const rows = IA.ui.parseCsv(text); if (rows.length < 3) throw new Error('need a header and at least 2 rows');
    const hd = rows[0].map((x) => x.trim().toLowerCase()); const col = (...n) => hd.findIndex((x) => n.includes(x));
    const iD = col('date', 'datetime', 'timestamp', 'time'), iT = col('time'), iO = col('open', 'o'), iH = col('high', 'h'), iL = col('low', 'l'), iC = col('close', 'c', 'adj close'), iV = col('volume', 'vol', 'v');
    if ([iD, iO, iH, iL, iC].some((x) => x < 0)) throw new Error('columns required: date(or datetime), open, high, low, close [, volume]');
    const out = rows.slice(1).map((r) => { const ds = iT >= 0 && iT !== iD ? `${r[iD]} ${r[iT]}` : r[iD]; const t = Date.parse(ds.replace(' ', 'T') + (/[zZ+]/.test(ds) ? '' : 'Z')) || Date.parse(ds); const b = { t, o: +r[iO], h: +r[iH], l: +r[iL], c: +r[iC], v: iV >= 0 ? +r[iV] || 0 : 0 }; b.d = new Date(t).toISOString().slice(0, 10); return b; }).filter((b) => isFinite(b.t) && [b.o, b.h, b.l, b.c].every(isFinite));
    const bad = out.filter((b) => b.h < Math.max(b.o, b.c) - 1e-9 || b.l > Math.min(b.o, b.c) + 1e-9).length; if (bad) throw new Error(`${bad} rows have high/low inconsistent with open/close`);
    if (out.length < 2) throw new Error('no valid rows'); out.sort((a, b) => a.t - b.t); return out;
  }
  IA.parseOhlcv = (text) => { const r = IA.dataimport.importCsv(text); if (r.error) throw new Error(r.error); return r.candles; };

  // Auto-generated, auto-graded chart-reading questions computed from the data itself.
  const QGEN = [
    (c) => { const v = IA.ind.vwap(c); const i = c.length - 1, d = (c[i].c - v[i]) / v[i]; if (Math.abs(d) < 0.0005) return null; return { q: 'At the last candle, where is price relative to session VWAP?', o: ['Above VWAP', 'Below VWAP'], a: d > 0 ? 0 : 1, why: `Last close ${IA.fmtP(c[i].c)} vs VWAP ${IA.fmtP(v[i])}.`, ind: ['vwap'] }; },
    (c) => { const e = IA.ind.ema(c.map((b) => b.c), 20), a = IA.ind.atr(c), i = c.length - 1; const s = (e[i] - e[i - 10]) / (a[i] || 1); const ans = s > 0.6 ? 0 : s < -0.6 ? 1 : 2; return { q: 'Over the last 10 bars the 20-EMA is…', o: ['Rising', 'Falling', 'Roughly flat'], a: ans, why: `EMA moved ${IA.fmtP(e[i] - e[i - 10])} (${num(s, 2)} × ATR). Rule used: > +0.6 ATR rising, < −0.6 ATR falling, otherwise flat.`, ind: ['ema20'] }; },
    (c) => { const days = [...new Set(c.map((b) => b.d))]; if (days.length < 2) return null; const td = c.filter((b) => b.d === days[days.length - 1]), pd = c.filter((b) => b.d === days[days.length - 2]); const pdh = Math.max(...pd.map((b) => b.h)), pdl = Math.min(...pd.map((b) => b.l)), th = Math.max(...td.map((b) => b.h)), tl = Math.min(...td.map((b) => b.l)); const up = th > pdh, dn = tl < pdl; return { q: 'In the last session, did price trade beyond the previous day\'s high or low?', o: ['Only above PDH', 'Only below PDL', 'Both', 'Neither — stayed inside'], a: up && dn ? 2 : up ? 0 : dn ? 1 : 3, why: `PDH ${IA.fmtP(pdh)}, PDL ${IA.fmtP(pdl)}; last session high ${IA.fmtP(th)}, low ${IA.fmtP(tl)}.`, levels: [{ price: pdh, label: 'PDH' }, { price: pdl, label: 'PDL' }] }; },
    (c) => { const days = [...new Set(c.map((b) => b.d))]; const td = c.filter((b) => b.d === days[days.length - 1]); if (td.length < 6) return null; const or = td.slice(0, 3), H = Math.max(...or.map((b) => b.h)), L = Math.min(...or.map((b) => b.l)); const rest = td.slice(3); const up = rest.findIndex((b) => b.c > H), dn = rest.findIndex((b) => b.c < L); let a = 3; if (up >= 0 && (dn < 0 || up < dn)) a = 0; else if (dn >= 0) a = 1; return { q: 'Last session: first CLOSE outside the opening range (first 3 bars) was…', o: ['Above the range high', 'Below the range low', '—', 'Never closed outside'].filter((_, k) => k !== 2).map((x) => x), a: a === 3 ? 2 : a, why: `Opening range ${IA.fmtP(L)} – ${IA.fmtP(H)}. A wick outside does not count; a close does.`, levels: [{ price: H, label: 'ORH' }, { price: L, label: 'ORL' }] }; },
    (c) => { const b = IA.ind.bollinger(c.map((x) => x.c)), i = c.length - 1; const a = c[i].c > b.upper[i] ? 0 : c[i].c < b.lower[i] ? 2 : 1; return { q: 'Where did the last candle close relative to Bollinger Bands (20, 2)?', o: ['Above the upper band', 'Inside the bands', 'Below the lower band'], a, why: `Upper ${IA.fmtP(b.upper[i])}, lower ${IA.fmtP(b.lower[i])}, close ${IA.fmtP(c[i].c)}.`, ind: ['bb'] }; },
    (c) => { const r = IA.ind.rsi(c.map((x) => x.c)), v = r[r.length - 1]; const a = v > 70 ? 0 : v > 50 ? 1 : v > 30 ? 2 : 3; return { q: 'RSI(14) on the last bar is in which zone?', o: ['Above 70', '50–70', '30–50', 'Below 30'], a, why: `RSI = ${num(v, 1)}. Remember: a zone is a description, not a signal.`, ind: ['rsi'] }; },
    (c) => { const n = c.length, avg = c.slice(n - 21, n - 1).reduce((s, b) => s + b.v, 0) / 20, v = c[n - 1].v, k = v / avg; return { q: 'Last bar\'s volume compared with the previous 20-bar average is…', o: ['More than 1.5× average', 'Between 0.67× and 1.5×', 'Less than 0.67× average'], a: k > 1.5 ? 0 : k < 0.67 ? 2 : 1, why: `Ratio = ${num(k, 2)}×.`, ind: ['vol'] }; },
    (c) => { const sw = IA.ind.swings(c.map((b) => b.c), 3); const hs = sw.hi.slice(-2), ls = sw.lo.slice(-2); if (hs.length < 2 || ls.length < 2) return null; const hh = c[hs[1]].c > c[hs[0]].c, hl = c[ls[1]].c > c[ls[0]].c; const a = hh && hl ? 0 : !hh && !hl ? 1 : 2; return { q: 'Using the last two swing highs and lows (3-bar fractals), the structure is…', o: ['Higher highs & higher lows (uptrend)', 'Lower highs & lower lows (downtrend)', 'Mixed — no clean trend'], a, why: `Swing highs ${hs.map((i) => IA.fmtP(c[i].c)).join(' → ')}; swing lows ${ls.map((i) => IA.fmtP(c[i].c)).join(' → ')}.`, markers: [...hs.map((i) => ({ i, pos: 'above', color: '#ef5361' })), ...ls.map((i) => ({ i, pos: 'below', color: '#26c281' }))], reveal: true }; },
  ];
  function drills(box, startPattern) {
    const score = { n: 0, ok: 0 };
    box.append(h('h3', null, 'Chart-reading drills'), h('p', { class: 'small muted' }, 'Questions are generated from a fresh synthetic chart and graded from the data, so every answer is exact. Pattern drills ask you to tap the candle.'));
    const modeBar = h('div', { class: 'row' }), area = h('div', { style: { marginTop: '10px' } }), sc = h('div', { class: 'small muted', style: { marginTop: '8px' } });
    const PATS = [['bullish-engulfing', 'Bullish engulfing'], ['bearish-engulfing', 'Bearish engulfing'], ['doji', 'Doji'], ['hammer', 'Hammer'], ['shooting-star', 'Shooting star'], ['inside-bar', 'Inside bar'], ['outside-bar', 'Outside bar']];
    modeBar.append(h('button', { class: 'btn primary', type: 'button', onclick: () => mcq() }, 'Reading question'), ...PATS.map(([k, l]) => h('button', { class: 'btn sm', type: 'button', onclick: () => pick(k, l) }, 'Find: ' + l)));
    box.append(modeBar, area, sc);
    const upd = () => { sc.textContent = `This session: ${score.ok}/${score.n} correct`; };
    async function save(ok, kind) { score.n++; if (ok) score.ok++; upd(); const d = await IA.db.get('drillStats', {}); d[kind] = d[kind] || { n: 0, ok: 0 }; d[kind].n++; if (ok) d[kind].ok++; await IA.db.set('drillStats', d); }
    function mcq() {
      area.innerHTML = ''; let item = null, c = null;
      for (let t = 0; t < 20 && !item; t++) { c = IA.gen.generate({ preset: ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'SPY', 'NVDA'][t % 5], seed: Math.floor(Math.random() * 1e6), days: 3, tfMin: 5 }).candles; item = QGEN[Math.floor(Math.random() * QGEN.length)](c); }
      const ch = new IA.Chart(area, { height: 300, paneH: 80 }); const inds = ['vol', ...(item.ind || [])]; ch.setTokens(c, [...new Set(inds)]); if (item.levels) { ch.levels = item.levels.map((l) => ({ ...l, color: '#f2b84b' })); } if (item.markers && !item.reveal) ch.markers = item.markers; ch.render();
      area.append(IA.ui.quiz([{ id: 'drill', q: item.q, o: item.o, a: item.a, why: item.why }], { onDone: (r) => { save(r.correct === 1, 'reading'); if (item.reveal && item.markers) { ch.markers = item.markers; ch.render(); } area.append(h('button', { class: 'btn', type: 'button', onclick: mcq }, 'Next question')); } }));
    }
    function pick(id, label) {
      area.innerHTML = ''; let c, hits = []; for (let t = 0; t < 30 && hits.length === 0; t++) { c = IA.gen.generate({ preset: 'RELIANCE', seed: Math.floor(Math.random() * 1e6), days: 1, tfMin: 5 }).candles.slice(-45); hits = IA.findPatterns(c, id).filter((i) => i > 2); }
      area.append(h('p', null, h('b', null, `Tap a ${label}.`), ' ', h('span', { class: 'muted small' }, `There ${hits.length === 1 ? 'is 1 occurrence' : 'are ' + hits.length + ' occurrences'} by the app's rule-based definition. Tap directly on the candle (±1 bar tolerance).`)));
      const ch = new IA.Chart(area, { height: 280, volume: true, draw: 'pick' }); ch.setData(c); ch.view.n = c.length; ch.render();
      const fb = h('div', { class: 'result hidden' }); area.append(fb); let done = false;
      ch.onPick = ({ i }) => { if (done) return; done = true; const ok = hits.some((k) => Math.abs(k - i) <= 1); save(ok, 'pattern:' + id); ch.markers = hits.map((k) => ({ i: k, pos: 'below', color: '#f2b84b', text: label.split(' ')[0] })); ch.markers.push({ i, pos: 'above', color: ok ? '#26c281' : '#ef5361', text: 'you' }); ch.render(); fb.classList.remove('hidden'); fb.innerHTML = ''; fb.append(h('b', { class: ok ? 'up' : 'down' }, ok ? 'Correct.' : 'Not that one.'), ' Yellow markers show every occurrence by rule. ', h('a', { href: '#/pattern/' + id }, 'Pattern notes'), ' · ', h('button', { class: 'btn sm', type: 'button', onclick: () => pick(id, label) }, 'Another')); };
    }
    upd(); if (startPattern && IA.detect[startPattern]) pick(startPattern, startPattern.replace(/-/g, ' ')); else mcq();
  }
})(typeof window !== 'undefined' ? window : globalThis);
