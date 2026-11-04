/* Market-structure & concept detectors. Pure and CAUSAL unless stated: an event at bar i uses only bars ≤ i
   (swing points are only "known" w bars after they print — the confirmation lag is part of the definition).
   These are THIS APP'S rule definitions of discretionary concepts (BOS, CHoCH, order block, FVG, sweep,
   supply/demand). Other traders define them differently; the evidence for their predictive value is weak/mixed. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  // Fractal swing points on highs/lows. k is a swing high if h[k] > h of w bars each side. Confirmed at k+w.
  function swingPoints(c, w = 2) {
    const out = [];
    for (let k = w; k < c.length - w; k++) {
      let hi = true, lo = true;
      for (let j = 1; j <= w; j++) { if (!(c[k].h > c[k - j].h && c[k].h >= c[k + j].h)) hi = false; if (!(c[k].l < c[k - j].l && c[k].l <= c[k + j].l)) lo = false; }
      if (hi) out.push({ i: k, type: 'H', price: c[k].h, confirmed: k + w });
      if (lo) out.push({ i: k, type: 'L', price: c[k].l, confirmed: k + w });
    }
    return out;
  }
  // Market structure: HH/HL/LH/LL labels, BOS (break in trend direction), CHoCH (first break against trend).
  // A break = a CLOSE beyond the most recent confirmed swing high/low that has not been broken yet.
  function structure(c, w = 2) {
    const sw = swingPoints(c, w); const labels = []; const events = [];
    let lastH = null, lastL = null, trend = 0; // 1 up, -1 down, 0 undefined
    let pH = null, pL = null; // previous swing of each type (for HH/LH labels)
    const byConf = {}; sw.forEach((s) => (byConf[s.confirmed] = (byConf[s.confirmed] || []).concat(s)));
    for (let i = 0; i < c.length; i++) {
      (byConf[i] || []).forEach((s) => {
        if (s.type === 'H') { labels.push({ ...s, label: pH ? (s.price > pH.price ? 'HH' : 'LH') : 'H' }); pH = s; lastH = { ...s, broken: false }; }
        else { labels.push({ ...s, label: pL ? (s.price > pL.price ? 'HL' : 'LL') : 'L' }); pL = s; lastL = { ...s, broken: false }; }
      });
      if (lastH && !lastH.broken && c[i].c > lastH.price && i > lastH.i) { lastH.broken = true; const type = trend === -1 ? 'CHoCH' : 'BOS'; events.push({ i, type, dir: 1, level: lastH.price, swing: lastH.i }); trend = 1; }
      if (lastL && !lastL.broken && c[i].c < lastL.price && i > lastL.i) { lastL.broken = true; const type = trend === 1 ? 'CHoCH' : 'BOS'; events.push({ i, type, dir: -1, level: lastL.price, swing: lastL.i }); trend = -1; }
    }
    return { swings: labels, events, trend };
  }
  // Liquidity sweep: wick beyond the latest confirmed swing level but CLOSE back inside, same bar.
  function sweeps(c, w = 2) {
    const sw = swingPoints(c, w); const out = []; let lastH = null, lastL = null; const byConf = {}; sw.forEach((s) => (byConf[s.confirmed] = (byConf[s.confirmed] || []).concat(s)));
    for (let i = 0; i < c.length; i++) {
      (byConf[i] || []).forEach((s) => { if (s.type === 'H') lastH = s; else lastL = s; });
      if (lastH && i > lastH.confirmed - 0 && c[i].h > lastH.price && c[i].c < lastH.price) { out.push({ i, dir: -1, level: lastH.price, swing: lastH.i }); lastH = null; }
      if (lastL && i > lastL.confirmed - 0 && c[i].l < lastL.price && c[i].c > lastL.price) { out.push({ i, dir: 1, level: lastL.price, swing: lastL.i }); lastL = null; }
    }
    return out;
  }
  // Order block (app definition): for a bullish BOS/CHoCH, the LAST bearish candle between the swing low that
  // started the impulse and the break bar; zone = that candle's low..high. Mirror for bearish.
  function orderBlocks(c, w = 2) {
    const { events, swings } = structure(c, w); const out = [];
    events.forEach((e) => {
      const opp = swings.filter((s) => s.type === (e.dir > 0 ? 'L' : 'H') && s.i < e.i && s.confirmed <= e.i).pop(); if (!opp) return;
      for (let k = e.i - 1; k >= opp.i; k--) { const bear = c[k].c < c[k].o, bull = c[k].c > c[k].o; if ((e.dir > 0 && bear) || (e.dir < 0 && bull)) { const z = { i: k, dir: e.dir, lo: c[k].l, hi: c[k].h, event: e.i, mitigated: null }; for (let j = e.i + 1; j < c.length; j++) if (e.dir > 0 ? c[j].l <= z.hi : c[j].h >= z.lo) { z.mitigated = j; break; } out.push(z); break; } }
    });
    return out;
  }
  // Fair value gap: three-candle imbalance. Bullish at i if high[i-2] < low[i]; zone = (high[i-2], low[i]).
  function fvgs(c, minFrac = 0) {
    const out = [];
    for (let i = 2; i < c.length; i++) {
      if (c[i - 2].h < c[i].l && (c[i].l - c[i - 2].h) / c[i].c >= minFrac) out.push({ i: i - 1, dir: 1, lo: c[i - 2].h, hi: c[i].l, formed: i });
      if (c[i - 2].l > c[i].h && (c[i - 2].l - c[i].h) / c[i].c >= minFrac) out.push({ i: i - 1, dir: -1, lo: c[i].h, hi: c[i - 2].l, formed: i });
    }
    out.forEach((z) => { for (let j = z.formed + 1; j < c.length; j++) { if (z.dir > 0 ? c[j].l <= z.lo : c[j].h >= z.hi) { z.filled = j; break; } } });
    return out;
  }
  // Support/resistance: cluster swing prices within tol (default 0.5 × median ATR); keep clusters with ≥ minTouches.
  function srLevels(c, { w = 2, tolAtr = 0.5, minTouches = 2 } = {}) {
    const sw = swingPoints(c, w); const atr = IA.ind.atr(c, 14).filter((x) => x != null).sort((a, b) => a - b); const tol = (atr[Math.floor(atr.length / 2)] || c[0].c * 0.002) * tolAtr;
    const pts = sw.map((s) => ({ p: s.price, i: s.i, t: s.type })).sort((a, b) => a.p - b.p); const cl = [];
    pts.forEach((p) => { const last = cl[cl.length - 1]; if (last && p.p - last.ps[last.ps.length - 1].p <= tol) last.ps.push(p); else cl.push({ ps: [p] }); });
    return cl.filter((k) => k.ps.length >= minTouches).map((k) => ({ price: k.ps.reduce((a, x) => a + x.p, 0) / k.ps.length, touches: k.ps.length, highs: k.ps.filter((x) => x.t === 'H').length, lows: k.ps.filter((x) => x.t === 'L').length, first: Math.min(...k.ps.map((x) => x.i)), last: Math.max(...k.ps.map((x) => x.i)), tol }));
  }
  // Supply/demand (app definition): a base of 1–3 candles each with range < baseAtr×ATR, followed by an impulse
  // candle with body ≥ impAtr×ATR. Demand if impulse is up (zone = base low..base high), supply if down.
  function sdZones(c, { baseAtr = 0.6, impAtr = 1.4 } = {}) {
    const atr = IA.ind.atr(c, 14); const out = [];
    for (let i = 16; i < c.length; i++) {
      const a = atr[i - 1]; if (!a) continue; const body = Math.abs(c[i].c - c[i].o); if (body < impAtr * a) continue;
      let n = 0; while (n < 3 && i - 1 - n >= 0 && c[i - 1 - n].h - c[i - 1 - n].l < baseAtr * a) n++;
      if (!n) continue; const base = c.slice(i - n, i); const z = { i: i - n, end: i - 1, dir: c[i].c > c[i].o ? 1 : -1, lo: Math.min(...base.map((b) => b.l)), hi: Math.max(...base.map((b) => b.h)), impulse: i, tested: null };
      for (let j = i + 1; j < c.length; j++) if (z.dir > 0 ? c[j].l <= z.hi : c[j].h >= z.lo) { z.tested = j; break; }
      out.push(z);
    }
    return out;
  }
  // Market Profile (TPO) for one session: letters A,B,C… per period (default 30 min); price bins of `step`.
  function tpo(day, { periodMin = 30, step = null, va = 0.7 } = {}) {
    if (!day.length) return null; const t0 = day[0].t; let lo = Infinity, hi = -Infinity; day.forEach((b) => { lo = Math.min(lo, b.l); hi = Math.max(hi, b.h); });
    step = step || Math.max((hi - lo) / 30, 1e-9); const n = Math.floor((hi - lo) / step) + 1; const bins = Array.from({ length: n }, (_, k) => ({ lo: lo + k * step, hi: lo + (k + 1) * step, letters: new Set() }));
    const LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    day.forEach((b) => { const p = Math.floor((b.t - t0) / 60000 / periodMin); const L = LET[p] || '?'; const a = Math.max(0, Math.min(n - 1, Math.floor((b.l - lo) / step + 1e-9))), z = Math.max(a, Math.min(n - 1, Math.ceil((b.h - lo) / step - 1e-9) - 1)); for (let k = a; k <= z; k++) bins[k].letters.add(L); });
    const cnt = bins.map((b) => b.letters.size), total = cnt.reduce((a, x) => a + x, 0); let poc = 0; cnt.forEach((x, k) => { if (x > cnt[poc] || (x === cnt[poc] && Math.abs(k - n / 2) < Math.abs(poc - n / 2))) poc = k; });
    let inVA = cnt[poc], up = poc, dn = poc; while (inVA < total * va && (up < n - 1 || dn > 0)) { const u = up < n - 1 ? cnt[up + 1] : -1, d = dn > 0 ? cnt[dn - 1] : -1; if (u >= d) { up++; inVA += u; } else { dn--; inVA += d; } }
    const ibBars = day.filter((b) => (b.t - t0) / 60000 < 2 * periodMin); const ibH = Math.max(...ibBars.map((b) => b.h)), ibL = Math.min(...ibBars.map((b) => b.l));
    const singles = bins.map((b, k) => ({ k, s: b.letters.size })).filter((x) => x.s === 1 && x.k > 0 && x.k < n - 1).map((x) => (bins[x.k].lo + bins[x.k].hi) / 2);
    const mid = (k) => (bins[k].lo + bins[k].hi) / 2;
    return { bins: bins.map((b) => ({ lo: b.lo, hi: b.hi, mid: (b.lo + b.hi) / 2, letters: [...b.letters].join('') })), poc: mid(poc), vah: bins[up].hi, val: bins[dn].lo, ibHigh: ibH, ibLow: ibL, singles, step, total };
  }
  function relativeStrength(a, b) { const n = Math.min(a.length, b.length); const r = []; for (let i = 0; i < n; i++) r.push((a[i].c / a[0].c) / (b[i].c / b[0].c)); return r; }
  // Time-of-day relative volume: volume / average volume of the same bar slot over previous `lookback` sessions.
  function relVolume(c, lookback = 10) {
    const slot = (b) => new Date(b.t).getUTCHours() * 60 + new Date(b.t).getUTCMinutes(); const hist = {}; const out = new Array(c.length).fill(null); let day = null; const pending = [];
    c.forEach((b, i) => { if (b.d !== day) { pending.forEach(([s, v]) => { (hist[s] = hist[s] || []).push(v); if (hist[s].length > lookback) hist[s].shift(); }); pending.length = 0; day = b.d; } const s = slot(b); const hs = hist[s]; if (hs && hs.length) out[i] = b.v / (hs.reduce((a, x) => a + x, 0) / hs.length); pending.push([s, b.v]); });
    return out;
  }
  function openingRange(c, bars = 3) {
    const out = {}; let day = null, k = 0;
    c.forEach((b, i) => { if (b.d !== day) { day = b.d; k = 0; out[day] = { hi: -Infinity, lo: Infinity, start: i, breakUp: null, breakDn: null }; } k++; const o = out[day]; if (k <= bars) { o.hi = Math.max(o.hi, b.h); o.lo = Math.min(o.lo, b.l); o.end = i; return; } if (o.breakUp === null && b.c > o.hi) o.breakUp = i; if (o.breakDn === null && b.c < o.lo) o.breakDn = i; });
    return out;
  }
  // Correlated pair generator for relative-strength / comparison exercises (synthetic): stock = beta×index + idio.
  function pair(seed = 1, { beta = 1.2, alpha = 0, idio = 0.6, days = 3, tfMin = 5 } = {}) {
    const idx = IA.gen.generate({ preset: 'NIFTY', seed, days, tfMin }).candles; const r = IA.gen.rng(seed + 99); let p = 1450; const st = [];
    idx.forEach((b, i) => { const ret = i ? b.c / idx[i - 1].c - 1 : 0; const o = p; p = p * (1 + beta * ret + alpha / idx.length + IA.gen.gauss(r) * 0.0012 * idio); const hi = Math.max(o, p) * (1 + r() * 0.0008), lo = Math.min(o, p) * (1 - r() * 0.0008); st.push({ t: b.t, d: b.d, o: IA.gen.roundTick(o, 0.05), h: IA.gen.roundTick(hi, 0.05), l: IA.gen.roundTick(lo, 0.05), c: IA.gen.roundTick(p, 0.05), v: Math.round(b.v * (0.4 + r() * 0.3)) }); });
    st.forEach((b) => { b.h = Math.max(b.h, b.o, b.c); b.l = Math.min(b.l, b.o, b.c); });
    return { index: idx, stock: st };
  }
  IA.struct = { swingPoints, structure, sweeps, orderBlocks, fvgs, srLevels, sdZones, tpo, relativeStrength, relVolume, openingRange, pair };
})(typeof window !== 'undefined' ? window : globalThis);
