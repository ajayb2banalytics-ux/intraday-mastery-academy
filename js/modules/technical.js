/* Technical Analysis: indicator reference, candlestick patterns, chart types; pattern detectors. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const { h, prose } = IA.ui;

  // Rule-based candle detectors (for drills). Definitions are conventional, not unique.
  const body = (b) => Math.abs(b.c - b.o), rng = (b) => b.h - b.l || 1e-9, upW = (b) => b.h - Math.max(b.o, b.c), dnW = (b) => Math.min(b.o, b.c) - b.l;
  IA.detect = {
    doji: (c, i) => body(c[i]) <= 0.1 * rng(c[i]),
    hammer: (c, i) => i >= 3 && dnW(c[i]) >= 2 * body(c[i]) && upW(c[i]) <= 0.3 * body(c[i]) + 0.05 * rng(c[i]) && body(c[i]) > 0.05 * rng(c[i]) && c[i - 3].c > c[i - 1].c,
    'shooting-star': (c, i) => i >= 3 && upW(c[i]) >= 2 * body(c[i]) && dnW(c[i]) <= 0.3 * body(c[i]) + 0.05 * rng(c[i]) && body(c[i]) > 0.05 * rng(c[i]) && c[i - 3].c < c[i - 1].c,
    'bullish-engulfing': (c, i) => i >= 1 && c[i - 1].c < c[i - 1].o && c[i].c > c[i].o && c[i].o <= c[i - 1].c && c[i].c >= c[i - 1].o && body(c[i]) > body(c[i - 1]),
    'bearish-engulfing': (c, i) => i >= 1 && c[i - 1].c > c[i - 1].o && c[i].c < c[i].o && c[i].o >= c[i - 1].c && c[i].c <= c[i - 1].o && body(c[i]) > body(c[i - 1]),
    'inside-bar': (c, i) => i >= 1 && c[i].h < c[i - 1].h && c[i].l > c[i - 1].l,
    'outside-bar': (c, i) => i >= 1 && c[i].h > c[i - 1].h && c[i].l < c[i - 1].l,
    'marubozu': (c, i) => body(c[i]) >= 0.9 * rng(c[i]) && rng(c[i]) > 0,
  };
  IA.findPatterns = (c, id) => c.map((_, i) => (IA.detect[id](c, i) ? i : -1)).filter((i) => i >= 0);

  IA.views.technical = (el, tab = 'indicators') => {
    const C = IA.content, tabs = [['indicators', 'Indicator library'], ['patterns', 'Candlestick patterns'], ['charttypes', 'Chart types'], ['structure', 'Structure & levels']];
    el.append(h('div', { class: 'tabs' }, tabs.map(([k, l]) => h('button', { class: k === tab ? 'on' : '', onclick: () => IA.go('#/technical/' + k) }, l))));
    if (tab === 'indicators') {
      const list = C.indicators || []; if (!list.length) return el.append(h('p', { class: 'muted' }, 'Indicator library content not loaded.'));
      el.append(h('p', { class: 'muted' }, `${list.length} indicators and tools. Each entry: definition, formula, worked calculation, interpretation, signals, chart example, entries/exits, conditions, weaknesses, mistakes, timeframes, combinations, and practice. Green = established maths/mechanics; amber = mixed evidence of usefulness; violet = subjective framework.`));
      ['trend', 'momentum', 'volume', 'volatility', 'tool'].forEach((cat) => { const xs = list.filter((x) => x.category === cat); if (!xs.length) return; el.append(h('h3', { style: { marginTop: '16px', textTransform: 'capitalize' } }, cat === 'tool' ? 'Additional tools' : cat + ' indicators'), h('div', { class: 'grid gauto' }, xs.map((x) => h('a', { class: 'card card-link', href: '#/indicator/' + x.id }, h('div', { class: 'spread' }, h('b', null, x.name), IA.ui.evTag(x.evidence)), h('div', { class: 'small muted' }, x.params || ''))))); });
    } else if (tab === 'patterns') {
      const ps = C.patterns || []; el.append(h('p', { class: 'muted' }, 'Candlestick patterns describe a short battle between buyers and sellers. On their own they have weak and mixed predictive evidence — location (at support/resistance, VWAP, range edges), trend context, volume and confirmation matter more than the shape.'));
      el.append(h('div', { class: 'grid gauto' }, ps.map((p) => h('a', { class: 'card card-link', href: '#/pattern/' + p.id }, h('div', { html: IA.patternSvg(p, 260, 120) }), h('div', { class: 'spread', style: { marginTop: '6px' } }, h('b', null, p.name), h('span', { class: 'tag ' + (p.bias === 'bullish' ? 'up' : p.bias === 'bearish' ? 'down' : '') }, p.bias))))));
    } else if (tab === 'charttypes') {
      const g = IA.gen.generate({ preset: 'NIFTY', seed: 77, days: 3, tfMin: 5 }).candles;
      el.append(prose(`## Chart types compared
The same synthetic Nifty session drawn six ways. Time-based charts (candles, bars, line, Heikin-Ashi) give one bar per fixed time slice. Price-based charts (Renko, point & figure) only add a brick when price moves a set amount, which removes time and filters small noise — but also hides *when* things happened and how much volume traded.

| Type | Built from | Strength | Weakness |
|---|---|---|---|
| Candlestick | OHLC per time slice | Body/wick show who won the period | Easy to over-read single candles |
| OHLC bar | Same as candle | Less visual bias | Harder to scan quickly |
| Line | Close only | Clean trend view | Hides intrabar range and gaps |
| Heikin-Ashi | Averaged OHLC | Smooths trends | **Prices are not real** — never use HA values for entries/stops |
| Renko | Fixed price bricks | Filters noise | Lags; ignores time and volume; brick size is subjective |
| Point & figure | X/O columns by box & reversal | Classic S/R and targets | Ignores time; rarely used intraday |
| Tick / volume | Bar per N trades / N shares | Normalises activity | Needs tick data (not in this offline app) |

> [!warn] Heikin-Ashi candles are averages. The "close" shown is not a price anyone traded at. Use them to read trend, then place orders on a normal chart.`));
      [['candle', 'Candlesticks'], ['bar', 'OHLC bars'], ['line', 'Line (close)'], ['ha', 'Heikin-Ashi']].forEach(([t, l]) => { const box = h('div', { class: 'card', style: { marginTop: '12px' } }, h('h3', null, l)); el.append(box); const ch = new IA.Chart(box, { height: 220, type: t, volume: false }); ch.setData(g); });
      const rk = IA.gen.renko(g, 40); const box = h('div', { class: 'card', style: { marginTop: '12px' } }, h('h3', null, 'Renko (box 40 points)'), h('p', { class: 'small muted' }, `${g.length} time bars became ${rk.length} bricks.`)); el.append(box); new IA.Chart(box, { height: 220, volume: false }).setData(rk.map((b, i) => ({ ...b, t: g[0].t + i * 3e5 })));
    } else if (tab === 'structure') {
      const g = IA.gen.generate({ preset: 'BANKNIFTY', seed: 314, days: 4, tfMin: 15 }).candles;
      const sw = IA.ind.swings(g.map((b) => b.c), 3);
      const box = h('div', { class: 'card' }, h('h3', null, 'Swing structure, previous-day levels and pivots'), h('p', { class: 'small muted' }, 'Swing highs (▼) and lows (▲) are detected with a 3-bar fractal rule. Dashed lines: previous-day high/low/close and classic pivot for the last day.'));
      el.append(box); const ch = new IA.Chart(box, { height: 340 }); ch.setTokens(g, ['vwap', 'vol']);
      ch.markers = [...sw.hi.map((i) => ({ i, pos: 'above', color: '#ef5361' })), ...sw.lo.map((i) => ({ i, pos: 'below', color: '#26c281' }))];
      const days = [...new Set(g.map((b) => b.d))], pd = g.filter((b) => b.d === days[days.length - 2]); const H = Math.max(...pd.map((b) => b.h)), L = Math.min(...pd.map((b) => b.l)), Cc = pd[pd.length - 1].c, pv = IA.ind.pivots(H, L, Cc).classic;
      ch.levels = [{ price: H, label: 'PDH', color: '#26c281' }, { price: L, label: 'PDL', color: '#ef5361' }, { price: Cc, label: 'PDC', color: '#8696a7' }, { price: pv.P, label: 'P', color: '#f2b84b' }, { price: pv.R1, label: 'R1', color: '#a78bfa' }, { price: pv.S1, label: 'S1', color: '#a78bfa' }]; ch.render();
      el.append(prose(`Read it like this: in an uptrend each swing low (▲) should be higher than the last and each swing high (▼) should break the previous one. The first time a higher low is taken out, the structure is **no longer an uptrend** — that is information, not a signal by itself. See [[link:l2-dow]] and [[link:l2-sr]].`));
    }
  };
  IA.views.indicator = (el, id) => {
    const x = (IA.content.indicators || []).find((i) => i.id === id); if (!x) return IA.views.notfound(el);
    IA.setTitle(x.name);
    el.append(h('a', { href: '#/technical/indicators', class: 'small' }, '← Indicator library'), h('div', { class: 'row', style: { marginTop: '8px' } }, h('h2', { style: { margin: 0 } }, x.name), IA.ui.evTag(x.evidence), h('span', { class: 'tag' }, x.category), x.params ? h('span', { class: 'tag' }, x.params) : null));
    if (x.chart) { const box = h('div', { class: 'card', style: { marginTop: '12px' } }); el.append(box); IA.embeds.chart(box, ['NIFTY', '42', x.chart + (/(rsi|macd|stoch|atr|adx|obv|cci|mfi|willr|roc|cmf)/.test(x.chart) ? '' : ',vol')]); }
    const F = [['definition', 'Definition'], ['purpose', 'Purpose'], ['formula', 'Formula'], ['calc', 'Calculation, worked'], ['interpretation', 'Interpretation'], ['bullish', 'Bullish signals'], ['bearish', 'Bearish signals'], ['example', 'Practical chart example'], ['entryExit', 'Entry & exit applications'], ['bestConditions', 'Best market conditions'], ['weaknesses', 'Weaknesses'], ['mistakes', 'Common mistakes'], ['timeframes', 'Suitable timeframes'], ['combinations', 'Combinations with other tools'], ['practice', 'Practice exercises']];
    el.append(prose(F.map(([k, l], i) => `## ${i + 1}. ${l}\n\n${x[k] || '*Not yet written.*'}`).join('\n\n') + (x.refs?.length ? '\n\n## References\n\n' + x.refs.map((r) => '- ' + r).join('\n') : '')));
  };
  IA.views.pattern = (el, id) => {
    const p = (IA.content.patterns || []).find((i) => i.id === id); if (!p) return IA.views.notfound(el);
    IA.setTitle(p.name);
    el.append(h('a', { href: '#/technical/patterns', class: 'small' }, '← Patterns'), h('div', { class: 'row', style: { marginTop: '8px' } }, h('h2', { style: { margin: 0 } }, p.name), h('span', { class: 'tag' }, p.kind), h('span', { class: 'tag ' + (p.bias === 'bullish' ? 'up' : p.bias === 'bearish' ? 'down' : '') }, p.bias), IA.ui.evTag(p.evidence)), h('div', { style: { margin: '12px 0' }, html: IA.patternSvg(p, 340, 190) }));
    const F = [['formation', 'Formation'], ['psychology', 'Psychology'], ['context', 'Context that matters'], ['confirmation', 'Confirmation'], ['entry', 'Entry'], ['stop', 'Stop-loss'], ['target', 'Target'], ['failure', 'Failure scenarios'], ['mistakes', 'Common mistakes']];
    el.append(prose(F.filter(([k]) => p[k]).map(([k, l]) => `## ${l}\n\n${p[k]}`).join('\n\n')));
    const det = IA.detect[id === 'pin-bar' ? 'hammer' : id]; if (det) el.append(h('div', { class: 'card', style: { marginTop: '14px' } }, h('h3', null, 'Practise spotting it'), h('p', { class: 'small muted' }, 'The Chart Lab drill generates fresh synthetic charts and asks you to tap occurrences.'), h('a', { class: 'btn', href: '#/chartlab?drill=' + id }, 'Open drill')));
  };
})(typeof window !== 'undefined' ? window : globalThis);
