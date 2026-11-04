/* Rules-based bar-by-bar backtester + Monte Carlo + analytics.
   No look-ahead: a signal computed on bar i's CLOSE is filled at bar i+1's OPEN.
   If stop and target are both inside one bar, the STOP is assumed hit first (conservative). */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const I = () => IA.ind;

  // Signal catalogue — each returns boolean[] for long-side (and short where noted)
  const SIGNALS = {
    ema_cross: { label: 'Fast EMA crosses slow EMA', params: { fast: 9, slow: 21 }, fn: (c, p, side) => { const cl = c.map((b) => b.c), f = I().ema(cl, p.fast), s = I().ema(cl, p.slow); return c.map((_, i) => i > 0 && f[i] != null && s[i] != null && f[i - 1] != null && s[i - 1] != null && (side > 0 ? f[i - 1] <= s[i - 1] && f[i] > s[i] : f[i - 1] >= s[i - 1] && f[i] < s[i])); } },
    vwap_side: { label: 'Close on the trade side of VWAP', params: {}, fn: (c, p, side) => { const v = I().vwap(c); return c.map((b, i) => v[i] != null && (side > 0 ? b.c > v[i] : b.c < v[i])); } },
    vwap_reclaim: { label: 'Price crosses VWAP', params: {}, fn: (c, p, side) => { const v = I().vwap(c); return c.map((b, i) => i > 0 && c[i - 1].d === b.d && (side > 0 ? c[i - 1].c <= v[i - 1] && b.c > v[i] : c[i - 1].c >= v[i - 1] && b.c < v[i])); } },
    rsi_extreme: { label: 'RSI crosses back from extreme (mean reversion)', params: { n: 14, lo: 30, hi: 70 }, fn: (c, p, side) => { const r = I().rsi(c.map((b) => b.c), p.n); return c.map((_, i) => i > 0 && r[i] != null && r[i - 1] != null && (side > 0 ? r[i - 1] < p.lo && r[i] >= p.lo : r[i - 1] > p.hi && r[i] <= p.hi)); } },
    rsi_trend: { label: 'RSI above/below 50 (momentum filter)', params: { n: 14 }, fn: (c, p, side) => { const r = I().rsi(c.map((b) => b.c), p.n); return r.map((x) => x != null && (side > 0 ? x > 50 : x < 50)); } },
    macd_cross: { label: 'MACD crosses signal line', params: { f: 12, s: 26, sig: 9 }, fn: (c, p, side) => { const m = I().macd(c.map((b) => b.c), p.f, p.s, p.sig); return c.map((_, i) => i > 0 && m.hist[i] != null && m.hist[i - 1] != null && (side > 0 ? m.hist[i - 1] <= 0 && m.hist[i] > 0 : m.hist[i - 1] >= 0 && m.hist[i] < 0)); } },
    supertrend_flip: { label: 'Supertrend flips direction', params: { n: 10, m: 3 }, fn: (c, p, side) => { const s = I().supertrend(c, p.n, p.m); return c.map((_, i) => i > 0 && s.dir[i] != null && s.dir[i - 1] != null && s.dir[i] === side && s.dir[i - 1] === -side); } },
    bb_reentry: { label: 'Close back inside Bollinger Band (fade)', params: { n: 20, k: 2 }, fn: (c, p, side) => { const bb = I().bollinger(c.map((b) => b.c), p.n, p.k); return c.map((b, i) => i > 0 && bb.lower[i] != null && (side > 0 ? c[i - 1].c < bb.lower[i - 1] && b.c > bb.lower[i] : c[i - 1].c > bb.upper[i - 1] && b.c < bb.upper[i])); } },
    orb: { label: 'Opening-range breakout', params: { bars: 3 }, fn: (c, p, side) => { const out = new Array(c.length).fill(false); let day = null, k = 0, hi = 0, lo = 0, fired = false; c.forEach((b, i) => { if (b.d !== day) { day = b.d; k = 0; hi = -Infinity; lo = Infinity; fired = false; } k++; if (k <= p.bars) { hi = Math.max(hi, b.h); lo = Math.min(lo, b.l); return; } if (!fired && (side > 0 ? b.c > hi : b.c < lo)) { out[i] = true; fired = true; } }); return out; } },
    pdh_break: { label: 'Break of previous-day high / low', params: {}, fn: (c, p, side) => { const out = new Array(c.length).fill(false); let day = null, ph = null, pl = null, ch = -Infinity, clo = Infinity, fired = false; c.forEach((b, i) => { if (b.d !== day) { if (day !== null) { ph = ch; pl = clo; } day = b.d; ch = -Infinity; clo = Infinity; fired = false; } if (ph !== null && !fired && (side > 0 ? b.c > ph && c[i - 1].c <= ph : b.c < pl && c[i - 1].c >= pl)) { out[i] = true; fired = true; } ch = Math.max(ch, b.h); clo = Math.min(clo, b.l); }); return out; } },
    volume_spike: { label: 'Volume ≥ k × 20-bar average', params: { k: 1.8 }, fn: (c, p) => { const av = I().sma(c.map((b) => b.v), 20); return c.map((b, i) => av[i] != null && b.v >= p.k * av[i]); } },
    adx_trend: { label: 'ADX above threshold (trending)', params: { n: 14, min: 22 }, fn: (c, p) => { const a = I().adx(c, p.n); return a.adx.map((x) => x != null && x >= p.min); } },
  };

  function run(candles, cfg) {
    const C = Object.assign({ side: 1, entry: [{ id: 'ema_cross' }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 }, capital: 100000, riskPct: 1, slippageTicks: 1, tick: 0.05, costBps: 3, eodExit: true, noEntryLastBars: 3, maxTradesPerDay: 3, lot: 1 }, cfg);
    if (!candles || candles.length < 30) return { error: 'Need at least 30 bars.' };
    const sigs = C.entry.map((e) => { const S = SIGNALS[e.id]; return S.fn(candles, Object.assign({}, S.params, e.params || {}), C.side); });
    const entrySig = candles.map((_, i) => sigs.every((s) => s[i]));
    const atr = I().atr(candles, 14);
    const lastOfDay = candles.map((b, i) => i === candles.length - 1 || candles[i + 1].d !== b.d);
    const barsLeft = new Array(candles.length).fill(0); for (let i = candles.length - 1, k = 0; i >= 0; i--) { k = lastOfDay[i] ? 0 : k + 1; barsLeft[i] = k; }
    let equity = C.capital, pos = null; const trades = [], curve = [{ i: 0, eq: equity }]; let dayCount = {}; let pending = false;
    const slip = C.slippageTicks * C.tick;
    const cost = (val) => (val * C.costBps) / 1e4;
    for (let i = 1; i < candles.length; i++) {
      const b = candles[i];
      // 1) fill pending entry at this bar's open
      if (pending && !pos) {
        pending = false;
        const fill = b.o + C.side * slip, a = atr[i - 1];
        const stopDist = C.stop.type === 'atr' ? (a || b.o * 0.003) * C.stop.mult : (b.o * C.stop.pct) / 100;
        const stop = fill - C.side * stopDist, target = C.target.rr ? fill + C.side * stopDist * C.target.rr : null;
        const riskAmt = (equity * C.riskPct) / 100; let qty = Math.floor(riskAmt / stopDist / C.lot) * C.lot;
        qty = Math.min(qty, Math.floor(equity / fill / C.lot) * C.lot);
        if (qty > 0) { pos = { entryI: i, entry: fill, stop, target, qty, stopDist }; dayCount[b.d] = (dayCount[b.d] || 0) + 1; }
      }
      // 2) manage open position within this bar
      if (pos) {
        let exit = null, why = null;
        const hitStop = C.side > 0 ? b.l <= pos.stop : b.h >= pos.stop;
        const hitTgt = pos.target != null && (C.side > 0 ? b.h >= pos.target : b.l <= pos.target);
        if (hitStop) { const gapThrough = C.side > 0 ? b.o < pos.stop : b.o > pos.stop; exit = (gapThrough ? b.o : pos.stop) - C.side * slip; why = gapThrough ? 'stop (gapped)' : 'stop'; }
        else if (hitTgt) { exit = pos.target - C.side * slip; why = 'target'; }
        else if (C.eodExit && lastOfDay[i]) { exit = b.c - C.side * slip; why = 'end of day'; }
        if (exit != null) {
          const gross = C.side * (exit - pos.entry) * pos.qty, costs = cost(pos.entry * pos.qty) + cost(exit * pos.qty);
          const net = gross - costs; equity += net;
          trades.push({ entryI: pos.entryI, exitI: i, entryT: candles[pos.entryI].t, exitT: b.t, entry: pos.entry, exit, qty: pos.qty, gross, costs, net, R: net / (pos.stopDist * pos.qty), why, side: C.side > 0 ? 'long' : 'short', day: b.d });
          pos = null; curve.push({ i, eq: equity });
        }
      }
      // 3) evaluate signal on this bar's close → fill next bar
      if (!pos && !pending && entrySig[i] && barsLeft[i] >= C.noEntryLastBars && (dayCount[b.d] || 0) < C.maxTradesPerDay && i < candles.length - 1) pending = true;
      if (pending && lastOfDay[i]) pending = false; // never carry an entry overnight
    }
    const stats = IA.risk.tradeStats(trades.map((t) => t.net));
    const eqs = curve.map((p) => p.eq), dd = IA.risk.maxDrawdown(eqs);
    stats.maxDD = dd.maxDD; stats.maxDDPct = dd.maxDDPct; stats.finalEquity = equity; stats.returnPct = ((equity - C.capital) / C.capital) * 100;
    stats.avgR = trades.length ? trades.reduce((a, t) => a + t.R, 0) / trades.length : 0;
    stats.totalCosts = trades.reduce((a, t) => a + t.costs, 0);
    const warnings = [];
    if (trades.length < 30) warnings.push(`Only ${trades.length} trades — far too few to judge anything. Aim for hundreds across different regimes.`);
    warnings.push('Results are from SYNTHETIC data and say nothing about how this rule would perform on real markets.');
    return { trades, curve, stats, warnings, config: C };
  }

  function monteCarlo(pnls, { start = 100000, paths = 1000, seed = 7, ruinPct = 50 } = {}) {
    if (!pnls.length) return { error: 'No trades to resample.' };
    const r = IA.gen.rng(seed), finals = [], dds = []; let ruined = 0;
    for (let p = 0; p < paths; p++) {
      let eq = start, peak = start, mdd = 0, dead = false;
      for (let k = 0; k < pnls.length; k++) { eq += pnls[Math.floor(r() * pnls.length)]; peak = Math.max(peak, eq); mdd = Math.max(mdd, (peak - eq) / peak); if (eq <= start * (1 - ruinPct / 100)) dead = true; }
      finals.push(eq); dds.push(mdd); if (dead) ruined++;
    }
    const pct = (a, q) => { const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };
    return { finals: { p5: pct(finals, 0.05), p50: pct(finals, 0.5), p95: pct(finals, 0.95) }, maxDD: { p50: pct(dds, 0.5), p95: pct(dds, 0.95), worst: Math.max(...dds) }, ruinProb: ruined / paths, probLoss: finals.filter((f) => f < start).length / paths, paths };
  }

  function riskOfRuinSim({ winRate, payoff, riskPct, ruinPct = 50, trades = 500, paths = 5000, seed = 11, compound = true }) {
    const r = IA.gen.rng(seed); let ruined = 0; const sample = [];
    for (let p = 0; p < paths; p++) {
      let eq = 1, path = p < 40 ? [1] : null;
      for (let k = 0; k < trades; k++) {
        const risk = compound ? eq * riskPct / 100 : riskPct / 100;
        eq += r() < winRate ? risk * payoff : -risk; if (path) path.push(eq);
        if (eq <= 1 - ruinPct / 100) { ruined++; break; }
      }
      if (path) sample.push(path);
    }
    return { ror: ruined / paths, sample, paths, trades };
  }

  function groupStats(rows, keyFn) {
    const g = {}; rows.forEach((r) => { const k = keyFn(r) ?? '—'; (g[k] = g[k] || []).push(r.net ?? 0); });
    return Object.entries(g).map(([k, v]) => ({ key: k, ...IA.risk.tradeStats(v) })).sort((a, b) => String(a.key).localeCompare(String(b.key)));
  }

  function walkForward(candles, cfg, folds = 4) {
    const n = candles.length, size = Math.floor(n / folds), res = [];
    for (let f = 0; f < folds; f++) { const seg = candles.slice(f * size, (f + 1) * size); const r = run(seg, cfg); res.push({ fold: f + 1, ...(r.stats || {}), error: r.error }); }
    return res;
  }

  IA.bt = { SIGNALS, run, monteCarlo, riskOfRuinSim, groupStats, walkForward };
})(typeof window !== 'undefined' ? window : globalThis);
