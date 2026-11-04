/* Indicator engine — pure functions. Input arrays of numbers or candle objects
   {t,o,h,l,c,v}. Output arrays aligned to input; null during warm-up. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const N = (x) => (x === null || x === undefined || Number.isNaN(x) ? null : x);

  function sma(src, n) {
    const out = new Array(src.length).fill(null);
    let sum = 0;
    for (let i = 0; i < src.length; i++) {
      sum += src[i];
      if (i >= n) sum -= src[i - n];
      if (i >= n - 1) out[i] = sum / n;
    }
    return out;
  }
  // EMA seeded with SMA of first n values (standard charting convention)
  function ema(src, n) {
    const out = new Array(src.length).fill(null);
    const k = 2 / (n + 1);
    let prev = null, start = -1;
    for (let i = 0; i < src.length; i++) {
      if (src[i] === null) continue;
      if (start < 0) start = i;
      if (i - start === n - 1) {
        let s = 0; for (let j = start; j <= i; j++) s += src[j];
        prev = s / n; out[i] = prev;
      } else if (prev !== null) { prev = src[i] * k + prev * (1 - k); out[i] = prev; }
    }
    return out;
  }
  // Wilder smoothing (RMA): alpha = 1/n, seeded by SMA
  function rma(src, n) {
    const out = new Array(src.length).fill(null);
    let prev = null, cnt = 0, s = 0;
    for (let i = 0; i < src.length; i++) {
      if (src[i] === null) continue;
      if (prev === null) { s += src[i]; cnt++; if (cnt === n) { prev = s / n; out[i] = prev; } }
      else { prev = (prev * (n - 1) + src[i]) / n; out[i] = prev; }
    }
    return out;
  }
  function wma(src, n) {
    const out = new Array(src.length).fill(null);
    const den = (n * (n + 1)) / 2;
    for (let i = n - 1; i < src.length; i++) {
      let s = 0; for (let j = 0; j < n; j++) s += src[i - j] * (n - j);
      out[i] = s / den;
    }
    return out;
  }
  function vwma(c, n) {
    const out = new Array(c.length).fill(null);
    for (let i = n - 1; i < c.length; i++) {
      let pv = 0, v = 0;
      for (let j = i - n + 1; j <= i; j++) { pv += c[j].c * c[j].v; v += c[j].v; }
      out[i] = v ? pv / v : null;
    }
    return out;
  }
  function stdev(src, n) { // population SD, as used by Bollinger
    const out = new Array(src.length).fill(null);
    for (let i = n - 1; i < src.length; i++) {
      let m = 0; for (let j = i - n + 1; j <= i; j++) m += src[j]; m /= n;
      let v = 0; for (let j = i - n + 1; j <= i; j++) v += (src[j] - m) ** 2;
      out[i] = Math.sqrt(v / n);
    }
    return out;
  }
  function rsi(src, n = 14) {
    const g = [null], l = [null];
    for (let i = 1; i < src.length; i++) { const d = src[i] - src[i - 1]; g.push(Math.max(d, 0)); l.push(Math.max(-d, 0)); }
    const ag = rma(g, n), al = rma(l, n);
    return src.map((_, i) => {
      if (ag[i] === null || al[i] === null) return null;
      if (al[i] === 0) return ag[i] === 0 ? 50 : 100;
      return 100 - 100 / (1 + ag[i] / al[i]);
    });
  }
  function trueRange(c) {
    return c.map((b, i) => i === 0 ? b.h - b.l : Math.max(b.h - b.l, Math.abs(b.h - c[i - 1].c), Math.abs(b.l - c[i - 1].c)));
  }
  function atr(c, n = 14) { return rma(trueRange(c), n); }
  function macd(src, f = 12, s = 26, sig = 9) {
    const ef = ema(src, f), es = ema(src, s);
    const line = src.map((_, i) => (ef[i] !== null && es[i] !== null ? ef[i] - es[i] : null));
    const signal = ema(line, sig);
    const hist = line.map((v, i) => (v !== null && signal[i] !== null ? v - signal[i] : null));
    return { line, signal, hist };
  }
  function bollinger(src, n = 20, k = 2) {
    const m = sma(src, n), sd = stdev(src, n);
    return {
      mid: m,
      upper: m.map((v, i) => (v === null ? null : v + k * sd[i])),
      lower: m.map((v, i) => (v === null ? null : v - k * sd[i])),
      width: m.map((v, i) => (v === null ? null : (2 * k * sd[i]) / v)),
      pctB: m.map((v, i) => (v === null || sd[i] === 0 ? null : (src[i] - (v - k * sd[i])) / (2 * k * sd[i]))),
    };
  }
  function stochastic(c, k = 14, d = 3, smooth = 1) {
    const raw = c.map((_, i) => {
      if (i < k - 1) return null;
      let hh = -Infinity, ll = Infinity;
      for (let j = i - k + 1; j <= i; j++) { hh = Math.max(hh, c[j].h); ll = Math.min(ll, c[j].l); }
      return hh === ll ? 50 : (100 * (c[i].c - ll)) / (hh - ll);
    });
    const kk = smooth > 1 ? smaN(raw, smooth) : raw;
    return { k: kk, d: smaN(kk, d) };
  }
  function smaN(src, n) { // SMA tolerant of leading nulls
    const out = new Array(src.length).fill(null);
    for (let i = 0; i < src.length; i++) {
      if (i < n - 1) continue; let s = 0, ok = true;
      for (let j = i - n + 1; j <= i; j++) { if (src[j] === null) { ok = false; break; } s += src[j]; }
      if (ok) out[i] = s / n;
    }
    return out;
  }
  function stochRsi(src, rn = 14, sn = 14, k = 3, d = 3) {
    const r = rsi(src, rn);
    const raw = r.map((v, i) => {
      if (v === null || i < sn - 1) return null;
      let hh = -Infinity, ll = Infinity;
      for (let j = i - sn + 1; j <= i; j++) { if (r[j] === null) return null; hh = Math.max(hh, r[j]); ll = Math.min(ll, r[j]); }
      return hh === ll ? 0 : (100 * (v - ll)) / (hh - ll);
    });
    const kk = smaN(raw, k);
    return { k: kk, d: smaN(kk, d) };
  }
  function cci(c, n = 20) {
    const tp = c.map((b) => (b.h + b.l + b.c) / 3), m = sma(tp, n);
    return tp.map((v, i) => {
      if (m[i] === null) return null;
      let md = 0; for (let j = i - n + 1; j <= i; j++) md += Math.abs(tp[j] - m[i]); md /= n;
      return md === 0 ? 0 : (v - m[i]) / (0.015 * md);
    });
  }
  function roc(src, n = 10) { return src.map((v, i) => (i < n ? null : (100 * (v - src[i - n])) / src[i - n])); }
  function momentum(src, n = 10) { return src.map((v, i) => (i < n ? null : v - src[i - n])); }
  function williamsR(c, n = 14) {
    return c.map((b, i) => {
      if (i < n - 1) return null; let hh = -Infinity, ll = Infinity;
      for (let j = i - n + 1; j <= i; j++) { hh = Math.max(hh, c[j].h); ll = Math.min(ll, c[j].l); }
      return hh === ll ? -50 : (-100 * (hh - b.c)) / (hh - ll);
    });
  }
  function obv(c) {
    let v = 0;
    return c.map((b, i) => { if (i > 0) v += b.c > c[i - 1].c ? b.v : b.c < c[i - 1].c ? -b.v : 0; return v; });
  }
  function mfm(b) { return b.h === b.l ? 0 : ((b.c - b.l) - (b.h - b.c)) / (b.h - b.l); }
  function adl(c) { let s = 0; return c.map((b) => (s += mfm(b) * b.v)); }
  function cmf(c, n = 20) {
    return c.map((_, i) => {
      if (i < n - 1) return null; let a = 0, v = 0;
      for (let j = i - n + 1; j <= i; j++) { a += mfm(c[j]) * c[j].v; v += c[j].v; }
      return v ? a / v : 0;
    });
  }
  function mfi(c, n = 14) {
    const tp = c.map((b) => (b.h + b.l + b.c) / 3);
    return c.map((_, i) => {
      if (i < n) return null; let pos = 0, neg = 0;
      for (let j = i - n + 1; j <= i; j++) { const f = tp[j] * c[j].v; if (tp[j] > tp[j - 1]) pos += f; else if (tp[j] < tp[j - 1]) neg += f; }
      return neg === 0 ? 100 : 100 - 100 / (1 + pos / neg);
    });
  }
  // Session VWAP: resets when the calendar day (in candle.d key or date of t) changes
  function vwap(c, sessionKey) {
    const key = sessionKey || ((b) => b.d || new Date(b.t).toISOString().slice(0, 10));
    let pv = 0, v = 0, last = null;
    return c.map((b) => {
      const k = key(b); if (k !== last) { pv = 0; v = 0; last = k; }
      const tp = (b.h + b.l + b.c) / 3; pv += tp * b.v; v += b.v;
      return v ? pv / v : null;
    });
  }
  function anchoredVwap(c, anchor) {
    let pv = 0, v = 0;
    return c.map((b, i) => { if (i < anchor) return null; const tp = (b.h + b.l + b.c) / 3; pv += tp * b.v; v += b.v; return v ? pv / v : null; });
  }
  function keltner(c, n = 20, m = 2, an = 10) {
    const mid = ema(c.map((b) => b.c), n), a = atr(c, an);
    return { mid, upper: mid.map((v, i) => (v === null || a[i] === null ? null : v + m * a[i])), lower: mid.map((v, i) => (v === null || a[i] === null ? null : v - m * a[i])) };
  }
  function donchian(c, n = 20) {
    const upper = [], lower = [];
    c.forEach((_, i) => {
      if (i < n - 1) { upper.push(null); lower.push(null); return; }
      let hh = -Infinity, ll = Infinity; for (let j = i - n + 1; j <= i; j++) { hh = Math.max(hh, c[j].h); ll = Math.min(ll, c[j].l); }
      upper.push(hh); lower.push(ll);
    });
    return { upper, lower, mid: upper.map((u, i) => (u === null ? null : (u + lower[i]) / 2)) };
  }
  function adx(c, n = 14) {
    const pdm = [0], ndm = [0];
    for (let i = 1; i < c.length; i++) {
      const up = c[i].h - c[i - 1].h, dn = c[i - 1].l - c[i].l;
      pdm.push(up > dn && up > 0 ? up : 0); ndm.push(dn > up && dn > 0 ? dn : 0);
    }
    const tr = trueRange(c); tr[0] = null; pdm[0] = null; ndm[0] = null;
    const str = rma(tr, n), sp = rma(pdm, n), sn = rma(ndm, n);
    const pdi = str.map((t, i) => (t ? (100 * sp[i]) / t : null));
    const ndi = str.map((t, i) => (t ? (100 * sn[i]) / t : null));
    const dx = pdi.map((p, i) => (p === null ? null : p + ndi[i] === 0 ? 0 : (100 * Math.abs(p - ndi[i])) / (p + ndi[i])));
    return { adx: rma(dx, n), pdi, ndi };
  }
  function supertrend(c, n = 10, m = 3) {
    const a = atr(c, n); const st = [], dir = [];
    let fu = null, fl = null, d = 1;
    for (let i = 0; i < c.length; i++) {
      if (a[i] === null) { st.push(null); dir.push(null); continue; }
      const hl2 = (c[i].h + c[i].l) / 2, bu = hl2 + m * a[i], bl = hl2 - m * a[i];
      const pc = i > 0 ? c[i - 1].c : c[i].c;
      fu = fu === null || bu < fu || pc > fu ? bu : fu;
      fl = fl === null || bl > fl || pc < fl ? bl : fl;
      if (d === 1 && c[i].c < fl) d = -1; else if (d === -1 && c[i].c > fu) d = 1;
      st.push(d === 1 ? fl : fu); dir.push(d);
    }
    return { line: st, dir };
  }
  function psar(c, step = 0.02, max = 0.2) {
    if (c.length < 2) return c.map(() => null);
    const out = [null]; let up = c[1].c >= c[0].c, af = step, ep = up ? c[0].h : c[0].l, sar = up ? c[0].l : c[0].h;
    for (let i = 1; i < c.length; i++) {
      sar = sar + af * (ep - sar);
      if (up) {
        sar = Math.min(sar, c[i - 1].l, i > 1 ? c[i - 2].l : c[i - 1].l);
        if (c[i].l < sar) { up = false; sar = ep; ep = c[i].l; af = step; }
        else if (c[i].h > ep) { ep = c[i].h; af = Math.min(af + step, max); }
      } else {
        sar = Math.max(sar, c[i - 1].h, i > 1 ? c[i - 2].h : c[i - 1].h);
        if (c[i].h > sar) { up = true; sar = ep; ep = c[i].h; af = step; }
        else if (c[i].l < ep) { ep = c[i].l; af = Math.min(af + step, max); }
      }
      out.push(sar);
    }
    return out;
  }
  function ichimoku(c, t = 9, k = 26, s = 52) {
    const mid = (n, i) => { if (i < n - 1) return null; let hh = -Infinity, ll = Infinity; for (let j = i - n + 1; j <= i; j++) { hh = Math.max(hh, c[j].h); ll = Math.min(ll, c[j].l); } return (hh + ll) / 2; };
    const tenkan = c.map((_, i) => mid(t, i)), kijun = c.map((_, i) => mid(k, i));
    // Spans are plotted k periods ahead; here returned unshifted with shift info
    const spanA = tenkan.map((v, i) => (v === null || kijun[i] === null ? null : (v + kijun[i]) / 2));
    const spanB = c.map((_, i) => mid(s, i));
    return { tenkan, kijun, spanA, spanB, chikou: c.map((b) => b.c), shift: k };
  }
  function pivots(h, l, c) {
    const p = (h + l + c) / 3, r = h - l;
    return {
      classic: { P: p, R1: 2 * p - l, S1: 2 * p - h, R2: p + r, S2: p - r, R3: h + 2 * (p - l), S3: l - 2 * (h - p) },
      camarilla: { R4: c + r * 1.1 / 2, R3: c + r * 1.1 / 4, R2: c + r * 1.1 / 6, R1: c + r * 1.1 / 12, S1: c - r * 1.1 / 12, S2: c - r * 1.1 / 6, S3: c - r * 1.1 / 4, S4: c - r * 1.1 / 2 },
    };
  }
  function fibonacci(swingLow, swingHigh, uptrend = true) {
    const d = swingHigh - swingLow, rl = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1], ex = [1.272, 1.618, 2.618];
    return {
      retracements: rl.map((r) => ({ ratio: r, price: uptrend ? swingHigh - d * r : swingLow + d * r })),
      extensions: ex.map((r) => ({ ratio: r, price: uptrend ? swingLow + d * r : swingHigh - d * r })),
    };
  }
  // Volume profile: distribute each bar's volume evenly across its range into bins
  function volumeProfile(c, bins = 24, valueArea = 0.7) {
    if (!c.length) return null;
    let lo = Infinity, hi = -Infinity; c.forEach((b) => { lo = Math.min(lo, b.l); hi = Math.max(hi, b.h); });
    const step = (hi - lo) / bins || 1, vol = new Array(bins).fill(0);
    c.forEach((b) => {
      const a = Math.min(bins - 1, Math.floor((b.l - lo) / step)), z = Math.min(bins - 1, Math.floor((b.h - lo) / step));
      for (let i = a; i <= z; i++) vol[i] += b.v / (z - a + 1);
    });
    let poc = 0; vol.forEach((v, i) => { if (v > vol[poc]) poc = i; });
    const total = vol.reduce((a, b) => a + b, 0); let inVA = vol[poc], up = poc, dn = poc;
    while (inVA < total * valueArea && (up < bins - 1 || dn > 0)) {
      const nu = up < bins - 1 ? vol[up + 1] : -1, nd = dn > 0 ? vol[dn - 1] : -1;
      if (nu >= nd) { up++; inVA += nu; } else { dn--; inVA += nd; }
    }
    const price = (i) => lo + step * (i + 0.5);
    return { bins: vol.map((v, i) => ({ price: price(i), lo: lo + step * i, hi: lo + step * (i + 1), vol: v })), poc: price(poc), vah: lo + step * (up + 1), val: lo + step * dn, total };
  }
  // Simple regular divergence detector between price and oscillator on swing points
  function swings(src, w = 3) {
    const hi = [], lo = [];
    for (let i = w; i < src.length - w; i++) {
      let isH = true, isL = true;
      for (let j = 1; j <= w; j++) { if (src[i] <= src[i - j] || src[i] <= src[i + j]) isH = false; if (src[i] >= src[i - j] || src[i] >= src[i + j]) isL = false; }
      if (isH) hi.push(i); if (isL) lo.push(i);
    }
    return { hi, lo };
  }
  function divergence(c, osc, w = 3) {
    const highs = swings(c.map((b) => b.h), w).hi, lows = swings(c.map((b) => b.l), w).lo, out = [];
    for (let k = 1; k < highs.length; k++) { const a = highs[k - 1], b = highs[k]; if (osc[a] != null && osc[b] != null && c[b].h > c[a].h && osc[b] < osc[a]) out.push({ type: 'bearish', from: a, to: b }); }
    for (let k = 1; k < lows.length; k++) { const a = lows[k - 1], b = lows[k]; if (osc[a] != null && osc[b] != null && c[b].l < c[a].l && osc[b] > osc[a]) out.push({ type: 'bullish', from: a, to: b }); }
    return out;
  }

  IA.ind = { sma, ema, rma, wma, vwma, stdev, rsi, trueRange, atr, macd, bollinger, stochastic, stochRsi, cci, roc, momentum, williamsR, obv, adl, cmf, mfi, vwap, anchoredVwap, keltner, donchian, adx, supertrend, psar, ichimoku, pivots, fibonacci, volumeProfile, swings, divergence, smaN, N };
})(typeof window !== 'undefined' ? window : globalThis);
