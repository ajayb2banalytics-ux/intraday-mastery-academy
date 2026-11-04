/* Canvas chart: candles/bars/line/Heikin-Ashi, overlays, sub-panes, volume, volume profile,
   pan (drag), zoom (wheel/pinch/buttons), crosshair, drawings (h-line, trendline), markers.
   Replay: chart.setEnd(n) shows only candles[0..n). */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#888';
  const PAL = ['#4fb3ff', '#f2b84b', '#a78bfa', '#3fd0d4', '#ff8c69', '#9be15d', '#ff6fb5'];

  // Token → overlays/panes (shared by lessons, chart lab, simulator)
  function tokens(c, list) {
    const I = IA.ind, cl = c.map((b) => b.c), ov = [], panes = []; let vol = false, vp = false;
    (list || []).forEach((t, k) => {
      const col = PAL[k % PAL.length];
      const m = t.match(/^(ema|sma|wma)(\d+)$/);
      if (m) ov.push({ name: t.toUpperCase(), data: I[m[1]](cl, +m[2]), color: col });
      else if (t === 'vwap') ov.push({ name: 'VWAP', data: I.vwap(c), color: '#f2b84b', width: 1.6, session: true });
      else if (t === 'bb') { const b = I.bollinger(cl); ov.push({ name: 'BB', band: [b.upper, b.lower], data: b.mid, color: '#a78bfa', dash: [4, 3] }); }
      else if (t === 'kc') { const b = I.keltner(c); ov.push({ name: 'KC', band: [b.upper, b.lower], data: b.mid, color: '#3fd0d4', dash: [4, 3] }); }
      else if (t === 'dc') { const b = I.donchian(c); ov.push({ name: 'DC', band: [b.upper, b.lower], data: b.mid, color: '#9be15d', dash: [2, 3] }); }
      else if (t === 'st') { const s = I.supertrend(c); ov.push({ name: 'Supertrend', data: s.line, colorFn: (i) => (s.dir[i] === 1 ? css('--up') : css('--down')), width: 1.6 }); }
      else if (t === 'psar') ov.push({ name: 'PSAR', data: I.psar(c), dots: true, color: '#ff8c69' });
      else if (t === 'ichimoku') { const ic = I.ichimoku(c); ov.push({ name: 'Tenkan', data: ic.tenkan, color: '#4fb3ff' }, { name: 'Kijun', data: ic.kijun, color: '#ef5361' }, { name: 'Cloud', band: [ic.spanA, ic.spanB], data: ic.spanA, color: '#26c281', shift: ic.shift, dash: [2, 2] }); }
      else if (t === 'vol') vol = true;
      else if (t === 'vp') vp = true;
      else if (t === 'rsi') panes.push({ name: 'RSI 14', lines: [{ data: I.rsi(cl), color: '#a78bfa' }], levels: [30, 50, 70], min: 0, max: 100 });
      else if (t === 'stoch') { const s = I.stochastic(c, 14, 3, 3); panes.push({ name: 'Stoch 14,3,3', lines: [{ data: s.k, color: '#4fb3ff' }, { data: s.d, color: '#f2b84b' }], levels: [20, 80], min: 0, max: 100 }); }
      else if (t === 'macd') { const m2 = I.macd(cl); panes.push({ name: 'MACD 12,26,9', lines: [{ data: m2.line, color: '#4fb3ff' }, { data: m2.signal, color: '#f2b84b' }], hist: m2.hist, levels: [0] }); }
      else if (t === 'atr') panes.push({ name: 'ATR 14', lines: [{ data: I.atr(c), color: '#3fd0d4' }] });
      else if (t === 'adx') { const a = I.adx(c); panes.push({ name: 'ADX/DMI 14', lines: [{ data: a.adx, color: '#f2b84b' }, { data: a.pdi, color: '#26c281' }, { data: a.ndi, color: '#ef5361' }], levels: [20, 25] }); }
      else if (t === 'obv') panes.push({ name: 'OBV', lines: [{ data: I.obv(c), color: '#9be15d' }] });
      else if (t === 'cci') panes.push({ name: 'CCI 20', lines: [{ data: I.cci(c), color: '#ff8c69' }], levels: [-100, 0, 100] });
      else if (t === 'mfi') panes.push({ name: 'MFI 14', lines: [{ data: I.mfi(c), color: '#3fd0d4' }], levels: [20, 80], min: 0, max: 100 });
      else if (t === 'willr') panes.push({ name: 'Williams %R', lines: [{ data: I.williamsR(c), color: '#ff6fb5' }], levels: [-80, -20], min: -100, max: 0 });
      else if (t === 'roc') panes.push({ name: 'ROC 10', lines: [{ data: I.roc(cl), color: '#4fb3ff' }], levels: [0] });
      else if (t === 'cmf') panes.push({ name: 'CMF 20', lines: [{ data: I.cmf(c), color: '#26c281' }], levels: [0] });
    });
    return { overlays: ov, panes, volume: vol, profile: vp };
  }

  class Chart {
    constructor(host, opt = {}) {
      this.host = host; this.o = Object.assign({ height: 340, paneH: 90, volume: true, type: 'candle', synthetic: true, profile: false, interactive: true, draw: null }, opt);
      this.c = []; this.ov = []; this.panes = []; this.markers = []; this.levels = []; this.drawings = []; this.end = null; this.zones = [];
      this.box = IA.ui.h('div', { class: 'chart-box' }); this.cv = IA.ui.h('canvas'); this.legend = IA.ui.h('div', { class: 'chart-legend' });
      this.box.append(this.cv, this.legend); host.append(this.box);
      this.view = { n: 80, off: 0 }; // n bars visible, off = bars hidden from right
      this.mouse = null; this.pending = null;
      this._bind(); this._ro = new ResizeObserver(() => this.render()); this._ro.observe(this.box);
    }
    setData(c, { overlays = [], panes = [], volume, profile, keepView } = {}) {
      this.c = c; this.ov = overlays; this.panes = panes; if (volume !== undefined) this.o.volume = volume; if (profile !== undefined) this.o.profile = profile;
      if (!keepView) { this.view.n = Math.min(c.length, Math.max(30, Math.floor((this.box.clientWidth || 600) / 9))); this.view.off = 0; }
      this.render(); return this;
    }
    setTokens(c, list, extra = {}) { const t = tokens(c, list); return this.setData(c, { overlays: t.overlays, panes: t.panes, volume: t.volume || extra.volume, profile: t.profile, keepView: extra.keepView }); }
    setEnd(n) { this.end = n; this.view.off = 0; this.render(); }
    len() { return this.end === null ? this.c.length : Math.min(this.end, this.c.length); }
    zoom(f) { this.view.n = Math.max(15, Math.min(this.len(), Math.round(this.view.n * f))); this.render(); }
    _range() { const L = this.len(); const last = Math.max(0, L - this.view.off); const first = Math.max(0, last - this.view.n); return [first, last]; }
    _bind() {
      const cv = this.cv; let drag = null, pinch = null;
      const pos = (e) => { const r = cv.getBoundingClientRect(); const p = e.touches ? e.touches[0] : e; return { x: p.clientX - r.left, y: p.clientY - r.top }; };
      cv.addEventListener('mousemove', (e) => { this.mouse = pos(e); if (drag) this._pan(this.mouse.x - drag); else this.render(); });
      cv.addEventListener('mouseleave', () => { this.mouse = null; drag = null; this.render(); });
      cv.addEventListener('mousedown', (e) => { if (this.o.draw) return; drag = pos(e).x; this._panStart = this.view.off; });
      window.addEventListener('mouseup', () => (drag = null));
      cv.addEventListener('click', (e) => this._click(pos(e)));
      cv.addEventListener('wheel', (e) => { if (!this.o.interactive) return; e.preventDefault(); this.zoom(e.deltaY > 0 ? 1.12 : 0.89); }, { passive: false });
      cv.addEventListener('touchstart', (e) => { if (e.touches.length === 2) { pinch = { d: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY), n: this.view.n }; } else { drag = pos(e).x; this._panStart = this.view.off; this.mouse = pos(e); this._tap = Date.now(); this.render(); } }, { passive: true });
      cv.addEventListener('touchmove', (e) => { if (pinch && e.touches.length === 2) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); this.view.n = Math.max(15, Math.min(this.len(), Math.round(pinch.n * pinch.d / d))); this.render(); } else if (drag !== null) { this.mouse = pos(e); if (!this.o.draw) this._pan(this.mouse.x - drag); else this.render(); } }, { passive: true });
      cv.addEventListener('touchend', (e) => { if (drag !== null && Date.now() - (this._tap || 0) < 250 && this.mouse) this._click(this.mouse); drag = null; pinch = null; });
    }
    _pan(dx) { const bw = this._bw || 8; this.view.off = Math.max(0, Math.min(this.len() - 10, Math.round(this._panStart + dx / bw))); this.render(); }
    _click(p) {
      if (!this.o.draw || !this._map) return;
      const price = this._map.yToP(p.y), idx = this._map.xToI(p.x); if (price === null) return;
      if (this.o.draw === 'hline') { this.drawings.push({ type: 'hline', price }); this.render(); this.onDraw && this.onDraw(); }
      else if (this.o.draw === 'trend') { if (!this.pending) this.pending = { i: idx, p: price }; else { this.drawings.push({ type: 'trend', a: this.pending, b: { i: idx, p: price } }); this.pending = null; this.render(); this.onDraw && this.onDraw(); } }
      else if (this.o.draw === 'pick') { this.onPick && this.onPick({ i: idx, price }); }
    }
    render() {
      const W = this.box.clientWidth || 600; if (!this.c.length) { this.cv.width = W; return; }
      const volH = this.o.volume ? 0.18 : 0, mainH = this.o.height, totalH = mainH + this.panes.length * this.o.paneH;
      const dpr = Math.min(2, root.devicePixelRatio || 1); this.cv.width = W * dpr; this.cv.height = totalH * dpr; this.cv.style.height = totalH + 'px';
      const g = this.cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, totalH);
      const C = { line: css('--line'), text: css('--muted'), up: css('--up'), down: css('--down'), bg: css('--bg2'), acc: css('--accent'), warn: css('--warn') };
      const axisW = 62, plotW = W - axisW, [a, b] = this._range(), n = Math.max(1, b - a), bw = plotW / Math.max(n, this.view.n); this._bw = bw;
      const vis = this.c.slice(a, b);
      let lo = Infinity, hi = -Infinity; vis.forEach((k) => { lo = Math.min(lo, k.l); hi = Math.max(hi, k.h); });
      this.ov.forEach((o) => { [o.data, ...(o.band || [])].forEach((arr) => { if (!arr) return; for (let i = a; i < b; i++) { const v = arr[i - (o.shift || 0)]; if (v != null) { lo = Math.min(lo, v); hi = Math.max(hi, v); } } }); });
      this.levels.forEach((l) => { if (l.fit) { lo = Math.min(lo, l.price); hi = Math.max(hi, l.price); } });
      const padP = (hi - lo) * 0.06 || hi * 0.01; lo -= padP; hi += padP;
      const top = 18, priceH = mainH * (1 - volH) - top - 18, volTop = top + priceH + 4, volBottom = mainH - 18;
      const y = (p) => top + (hi - p) / (hi - lo) * priceH, x = (i) => (i - a) * bw + bw / 2;
      this._map = { yToP: (yy) => (yy < top || yy > top + priceH ? null : hi - ((yy - top) / priceH) * (hi - lo)), xToI: (xx) => Math.max(0, Math.min(this.len() - 1, Math.floor(xx / bw) + a)), y, x };
      // grid + axis
      g.strokeStyle = C.line; g.lineWidth = 1; g.fillStyle = C.text; g.font = '10.5px ' + css('--mono'); g.textAlign = 'left';
      const ticks = 6; for (let k = 0; k <= ticks; k++) { const p = lo + (hi - lo) * k / ticks, yy = y(p); g.globalAlpha = 0.5; g.beginPath(); g.moveTo(0, yy); g.lineTo(plotW, yy); g.stroke(); g.globalAlpha = 1; g.fillText(fmtP(p), plotW + 6, yy + 3); }
      g.textAlign = 'center'; const step = Math.max(1, Math.ceil(70 / bw));
      for (let i = a; i < b; i += step) { const k = this.c[i]; g.fillText(tlabel(k), x(i), mainH - 4); }
      // day separators
      g.setLineDash([2, 4]); g.globalAlpha = 0.6; for (let i = a + 1; i < b; i++) if (this.c[i].d !== this.c[i - 1].d) { g.beginPath(); g.moveTo(x(i) - bw / 2, top); g.lineTo(x(i) - bw / 2, mainH - 16); g.stroke(); } g.setLineDash([]); g.globalAlpha = 1;
      // zones (shaded ranges e.g. opening range)
      this.zones.forEach((z) => { g.fillStyle = z.color || 'rgba(79,179,255,.08)'; const x1 = z.i1 != null ? x(Math.max(a, z.i1)) - bw / 2 : 0, x2 = z.i2 != null ? x(Math.min(b - 1, z.i2)) + bw / 2 : plotW; g.fillRect(x1, y(z.hi), x2 - x1, y(z.lo) - y(z.hi)); });
      // volume profile
      if (this.o.profile) { const vp = IA.ind.volumeProfile(vis, 28); if (vp) { const mx = Math.max(...vp.bins.map((q) => q.vol)); vp.bins.forEach((q) => { const inVA = q.lo >= vp.val - 1e-9 && q.hi <= vp.vah + 1e-9; g.fillStyle = inVA ? 'rgba(79,179,255,.22)' : 'rgba(134,150,167,.16)'; const ww = (q.vol / mx) * plotW * 0.22; g.fillRect(plotW - ww, y(q.hi), ww, Math.max(1, y(q.lo) - y(q.hi) - 1)); }); [['POC', vp.poc, C.warn], ['VAH', vp.vah, C.acc], ['VAL', vp.val, C.acc]].forEach(([l, p, col]) => this._hline(g, y(p), plotW, col, l + ' ' + fmtP(p), [3, 3])); } }
      // volume
      if (this.o.volume) { let mv = 0; vis.forEach((k) => (mv = Math.max(mv, k.v))); vis.forEach((k, j) => { const i = a + j, hgt = (k.v / (mv || 1)) * (volBottom - volTop); g.fillStyle = (k.c >= k.o ? C.up : C.down) + '55'; g.fillRect(x(i) - bw * 0.35, volBottom - hgt, Math.max(1, bw * 0.7), hgt); }); }
      // overlays: bands
      this.ov.forEach((o) => { if (!o.band) return; const [u, l2] = o.band, sh = o.shift || 0; g.fillStyle = (o.color || C.acc) + '18'; g.beginPath(); let started = false; for (let i = a; i < b; i++) { const v = u[i - sh]; if (v == null) continue; started ? g.lineTo(x(i), y(v)) : g.moveTo(x(i), y(v)); started = true; } for (let i = b - 1; i >= a; i--) { const v = l2[i - sh]; if (v == null) continue; g.lineTo(x(i), y(v)); } g.closePath(); if (started) g.fill(); [u, l2].forEach((arr) => this._line(g, arr, a, b, x, y, o.color, 1, o.dash, sh)); });
      // candles
      const type = this.o.type; const data = type === 'ha' ? IA.gen.heikinAshi(this.c.slice(0, b)).slice(a) : vis;
      if (type === 'line') { g.strokeStyle = C.acc; g.lineWidth = 1.6; g.beginPath(); data.forEach((k, j) => (j ? g.lineTo(x(a + j), y(k.c)) : g.moveTo(x(a + j), y(k.c)))); g.stroke(); }
      else data.forEach((k, j) => {
        const i = a + j, up = k.c >= k.o, col = up ? C.up : C.down, xx = x(i); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 1;
        if (type === 'bar') { g.beginPath(); g.moveTo(xx, y(k.h)); g.lineTo(xx, y(k.l)); g.moveTo(xx - bw * 0.35, y(k.o)); g.lineTo(xx, y(k.o)); g.moveTo(xx, y(k.c)); g.lineTo(xx + bw * 0.35, y(k.c)); g.stroke(); return; }
        g.beginPath(); g.moveTo(xx, y(k.h)); g.lineTo(xx, y(k.l)); g.stroke();
        const yo = y(k.o), yc = y(k.c), bh = Math.max(1, Math.abs(yc - yo)); const w = Math.max(1, bw * 0.7);
        if (up && bw > 4) { g.fillStyle = C.bg; g.fillRect(xx - w / 2, Math.min(yo, yc), w, bh); g.strokeRect(xx - w / 2 + 0.5, Math.min(yo, yc) + 0.5, w - 1, Math.max(0, bh - 1)); } else g.fillRect(xx - w / 2, Math.min(yo, yc), w, bh);
      });
      // overlays: lines
      this.ov.forEach((o) => { if (o.band && o.name === 'Cloud') return; if (o.dots) { g.fillStyle = o.color; for (let i = a; i < b; i++) { const v = o.data[i]; if (v != null) { g.beginPath(); g.arc(x(i), y(v), 1.6, 0, 7); g.fill(); } } return; } this._sessionBreak = !!o.session; this._line(g, o.data, a, b, x, y, o.color, o.width || 1.3, o.band ? null : o.dash, o.shift || 0, o.colorFn); this._sessionBreak = false; });
      // levels
      this.levels.forEach((l) => { const yy = y(l.price); if (yy < top || yy > top + priceH) return; this._hline(g, yy, plotW, l.color || C.acc, l.label ? `${l.label} ${fmtP(l.price)}` : fmtP(l.price), l.dash || [5, 4]); });
      // drawings
      g.lineWidth = 1.4; this.drawings.forEach((d) => { if (d.type === 'hline') this._hline(g, y(d.price), plotW, '#ff6fb5', fmtP(d.price), []); else if (d.type === 'trend') { g.strokeStyle = '#ff6fb5'; g.beginPath(); const slope = (d.b.p - d.a.p) / ((d.b.i - d.a.i) || 1); g.moveTo(x(d.a.i), y(d.a.p)); g.lineTo(x(b - 1), y(d.a.p + slope * (b - 1 - d.a.i))); g.stroke(); } });
      if (this.pending) { g.fillStyle = '#ff6fb5'; g.beginPath(); g.arc(x(this.pending.i), y(this.pending.p), 4, 0, 7); g.fill(); }
      // markers
      this.markers.forEach((m) => { if (m.i < a || m.i >= b) return; const k = this.c[m.i]; const above = m.pos === 'above'; const yy = above ? y(k.h) - 8 : y(k.l) + 8; g.fillStyle = m.color || C.acc; g.beginPath(); if (above) { g.moveTo(x(m.i), yy + 5); g.lineTo(x(m.i) - 5, yy - 3); g.lineTo(x(m.i) + 5, yy - 3); } else { g.moveTo(x(m.i), yy - 5); g.lineTo(x(m.i) - 5, yy + 3); g.lineTo(x(m.i) + 5, yy + 3); } g.fill(); if (m.text) { g.font = '10px ' + css('--sans'); g.textAlign = 'center'; g.fillText(m.text, x(m.i), above ? yy - 6 : yy + 14); } });
      // sub panes
      this.panes.forEach((p, k) => {
        const t0 = mainH + k * this.o.paneH, t1 = t0 + this.o.paneH; g.strokeStyle = C.line; g.beginPath(); g.moveTo(0, t0); g.lineTo(W, t0); g.stroke();
        let pl = p.min ?? Infinity, ph = p.max ?? -Infinity; if (p.min === undefined) { [...p.lines.map((l) => l.data), p.hist].forEach((arr) => { if (!arr) return; for (let i = a; i < b; i++) if (arr[i] != null) { pl = Math.min(pl, arr[i]); ph = Math.max(ph, arr[i]); } }); (p.levels || []).forEach((v) => { pl = Math.min(pl, v); ph = Math.max(ph, v); }); }
        if (!isFinite(pl)) return; const pad = (ph - pl) * 0.1 || 1; const lo2 = p.min === undefined ? pl - pad : pl, hi2 = p.max === undefined ? ph + pad : ph;
        const yy = (v) => t0 + 14 + (hi2 - v) / (hi2 - lo2) * (this.o.paneH - 20);
        (p.levels || []).forEach((v) => { g.setLineDash([2, 3]); g.strokeStyle = C.line; g.beginPath(); g.moveTo(0, yy(v)); g.lineTo(plotW, yy(v)); g.stroke(); g.setLineDash([]); g.fillStyle = C.text; g.textAlign = 'left'; g.fillText(fmtP(v), plotW + 6, yy(v) + 3); });
        if (p.hist) for (let i = a; i < b; i++) { const v = p.hist[i]; if (v == null) continue; g.fillStyle = (v >= 0 ? C.up : C.down) + '88'; g.fillRect(x(i) - bw * 0.3, Math.min(yy(0), yy(v)), Math.max(1, bw * 0.6), Math.abs(yy(v) - yy(0))); }
        p.lines.forEach((l) => this._line(g, l.data, a, b, x, yy, l.color, 1.2));
        g.fillStyle = C.text; g.textAlign = 'left'; g.font = '10.5px ' + css('--mono'); const cur = p.lines[0].data[(this.mouseI ?? b - 1)]; g.fillText(p.name + (cur != null ? '  ' + fmtP(cur) : ''), 6, t0 + 11);
      });
      // crosshair + legend
      let li = b - 1;
      if (this.mouse && this.mouse.x < plotW) { li = Math.max(a, Math.min(b - 1, Math.floor(this.mouse.x / bw) + a)); g.strokeStyle = C.text; g.globalAlpha = 0.5; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(x(li), 0); g.lineTo(x(li), totalH); if (this.mouse.y < top + priceH) { g.moveTo(0, this.mouse.y); g.lineTo(plotW, this.mouse.y); } g.stroke(); g.setLineDash([]); g.globalAlpha = 1; const pp = this._map.yToP(this.mouse.y); if (pp !== null) { g.fillStyle = C.acc; g.fillRect(plotW, this.mouse.y - 8, axisW, 16); g.fillStyle = '#fff'; g.textAlign = 'left'; g.fillText(fmtP(pp), plotW + 4, this.mouse.y + 4); } }
      this.mouseI = li; const k = this.c[li];
      if (k) { const ch = k.c - k.o; this.legend.innerHTML = `${this.o.synthetic ? '<span class="synthetic-badge">SYNTHETIC</span>' : ''}<span>${tlabel(k, true)}</span><span>O <b>${fmtP(k.o)}</b></span><span>H <b>${fmtP(k.h)}</b></span><span>L <b>${fmtP(k.l)}</b></span><span>C <b class="${ch >= 0 ? 'up' : 'down'}">${fmtP(k.c)}</b></span><span>V <b>${IA.ui.num(k.v, 0)}</b></span>` + this.ov.filter((o) => !o.band || o.name !== 'Cloud').map((o) => { const v = o.data[li - (o.shift || 0)]; return v == null ? '' : `<span style="color:${o.color || ''}">${o.name} <b>${fmtP(v)}</b></span>`; }).join(''); }
    }
    _line(g, arr, a, b, x, y, color, w = 1.3, dash, shift = 0, colorFn) {
      if (!arr) return; g.lineWidth = w; g.setLineDash(dash || []); let started = false;
      if (colorFn) { for (let i = a + 1; i < b; i++) { const v0 = arr[i - 1 - shift], v1 = arr[i - shift]; if (v0 == null || v1 == null) continue; g.strokeStyle = colorFn(i); g.beginPath(); g.moveTo(x(i - 1), y(v0)); g.lineTo(x(i), y(v1)); g.stroke(); } g.setLineDash([]); return; }
      g.strokeStyle = color; g.beginPath(); for (let i = a; i < b; i++) { const v = arr[i - shift]; if (v == null) { started = false; continue; } const newSession = this._sessionBreak && i > 0 && this.c[i] && this.c[i - 1] && this.c[i].d !== this.c[i - 1].d; if (!started || newSession) { g.moveTo(x(i), y(v)); started = true; } else g.lineTo(x(i), y(v)); } g.stroke(); g.setLineDash([]);
    }
    _hline(g, yy, w, color, label, dash) { g.strokeStyle = color; g.setLineDash(dash || []); g.lineWidth = 1; g.beginPath(); g.moveTo(0, yy); g.lineTo(w, yy); g.stroke(); g.setLineDash([]); if (label) { g.font = '10px ' + css('--mono'); const tw = g.measureText(label).width + 8; g.fillStyle = color; g.fillRect(w + 1, yy - 7, Math.min(61, tw), 14); g.fillStyle = '#0b0f14'; g.textAlign = 'left'; g.fillText(label.length > 9 ? label.split(' ').pop() : label, w + 4, yy + 3); } }
    destroy() { this._ro.disconnect(); this.box.remove(); }
  }
  function fmtP(p) { if (p === null || p === undefined) return '—'; const a = Math.abs(p); return a >= 1e6 ? (p / 1e6).toFixed(2) + 'M' : a >= 1000 ? p.toFixed(1) : a >= 10 ? p.toFixed(2) : p.toFixed(3); }
  function tlabel(k, full) { const d = new Date(k.t); const hh = String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0'); return full ? `${k.d} ${hh}` : hh === '00:00' || hh === '09:15' || hh === '09:30' || hh === '09:00' ? k.d.slice(5) : hh; }

  // Toolbar helper for zoom / type / drawing
  function toolbar(chart, { draw = true, types = true } = {}) {
    const h = IA.ui.h, bar = h('div', { class: 'chart-toolbar' });
    bar.append(h('button', { class: 'btn sm', type: 'button', title: 'Zoom in', onclick: () => chart.zoom(0.8) }, '+'), h('button', { class: 'btn sm', type: 'button', title: 'Zoom out', onclick: () => chart.zoom(1.25) }, '−'));
    if (types) bar.append(IA.ui.seg([['candle', 'Candles'], ['bar', 'OHLC'], ['line', 'Line'], ['ha', 'Heikin-Ashi']], chart.o.type, (v) => { chart.o.type = v; chart.render(); }));
    if (draw) bar.append(IA.ui.seg([['', 'Pan'], ['hline', 'H-line'], ['trend', 'Trendline']], '', (v) => { chart.o.draw = v || null; chart.pending = null; }), h('button', { class: 'btn sm ghost', type: 'button', onclick: () => { chart.drawings = []; chart.render(); chart.onDraw && chart.onDraw(); } }, 'Clear drawings'));
    return bar;
  }
  IA.Chart = Chart; IA.chartTokens = tokens; IA.chartToolbar = toolbar; IA.fmtP = fmtP;
})(typeof window !== 'undefined' ? window : globalThis);
