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
    vwap_reclaim: { label: 'Price crosses VWAP', params: {}, fn: (c, p, side) => { const v = I().vwap(c); return c.map((b, i) => i > 0 && c[i - 1].d === b.d && v[i] != null && v[i - 1] != null && (side > 0 ? c[i - 1].c <= v[i - 1] && b.c > v[i] : c[i - 1].c >= v[i - 1] && b.c < v[i])); } },
    rsi_extreme: { label: 'RSI crosses back from extreme (mean reversion)', params: { n: 14, lo: 30, hi: 70 }, fn: (c, p, side) => { const r = I().rsi(c.map((b) => b.c), p.n); return c.map((_, i) => i > 0 && r[i] != null && r[i - 1] != null && (side > 0 ? r[i - 1] < p.lo && r[i] >= p.lo : r[i - 1] > p.hi && r[i] <= p.hi)); } },
    rsi_trend: { label: 'RSI above/below 50 (momentum filter)', params: { n: 14 }, fn: (c, p, side) => { const r = I().rsi(c.map((b) => b.c), p.n); return r.map((x) => x != null && (side > 0 ? x > 50 : x < 50)); } },
    macd_cross: { label: 'MACD crosses signal line', params: { f: 12, s: 26, sig: 9 }, fn: (c, p, side) => { const m = I().macd(c.map((b) => b.c), p.f, p.s, p.sig); return c.map((_, i) => i > 0 && m.hist[i] != null && m.hist[i - 1] != null && (side > 0 ? m.hist[i - 1] <= 0 && m.hist[i] > 0 : m.hist[i - 1] >= 0 && m.hist[i] < 0)); } },
    supertrend_flip: { label: 'Supertrend flips direction', params: { n: 10, m: 3 }, fn: (c, p, side) => { const s = I().supertrend(c, p.n, p.m); return c.map((_, i) => i > 0 && s.dir[i] != null && s.dir[i - 1] != null && s.dir[i] === side && s.dir[i - 1] === -side); } },
    bb_reentry: { label: 'Close back inside Bollinger Band (fade)', params: { n: 20, k: 2 }, fn: (c, p, side) => { const bb = I().bollinger(c.map((b) => b.c), p.n, p.k); return c.map((b, i) => i > 0 && bb.lower[i] != null && bb.lower[i - 1] != null && (side > 0 ? c[i - 1].c < bb.lower[i - 1] && b.c > bb.lower[i] : c[i - 1].c > bb.upper[i - 1] && b.c < bb.upper[i])); } },
    orb: { label: 'Opening-range breakout', params: { bars: 3 }, fn: (c, p, side) => { const out = new Array(c.length).fill(false); let day = null, k = 0, hi = 0, lo = 0, fired = false; c.forEach((b, i) => { if (b.d !== day) { day = b.d; k = 0; hi = -Infinity; lo = Infinity; fired = false; } k++; if (k <= p.bars) { hi = Math.max(hi, b.h); lo = Math.min(lo, b.l); return; } if (!fired && (side > 0 ? b.c > hi : b.c < lo)) { out[i] = true; fired = true; } }); return out; } },
    pdh_break: { label: 'Break of previous-day high / low', params: {}, fn: (c, p, side) => { const out = new Array(c.length).fill(false); let day = null, ph = null, pl = null, ch = -Infinity, clo = Infinity, fired = false; c.forEach((b, i) => { if (b.d !== day) { if (day !== null) { ph = ch; pl = clo; } day = b.d; ch = -Infinity; clo = Infinity; fired = false; } if (ph !== null && !fired && (side > 0 ? b.c > ph && c[i - 1].c <= ph : b.c < pl && c[i - 1].c >= pl)) { out[i] = true; fired = true; } ch = Math.max(ch, b.h); clo = Math.min(clo, b.l); }); return out; } },
    volume_spike: { label: 'Volume ≥ k × 20-bar average', params: { k: 1.8 }, fn: (c, p) => { const av = I().sma(c.map((b) => b.v), 20); return c.map((b, i) => av[i] != null && b.v >= p.k * av[i]); } },
    adx_trend: { label: 'ADX above threshold (trending)', params: { n: 14, min: 22 }, fn: (c, p) => { const a = I().adx(c, p.n); return a.adx.map((x) => x != null && x >= p.min); } },
  };

  const DEFAULTS = { side: 1, entry: [{ id: 'ema_cross' }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 }, capital: 100000, riskPct: 1, slippageTicks: 1, tick: 0.05, costBps: 3, eodExit: true, noEntryLastBars: 3, maxTradesPerDay: 3, lot: 1, maxVolPct: 0, maxLeverage: 1 };
  const config = (cfg) => Object.assign({}, DEFAULTS, cfg);
  // Entry signal (ALL conditions true on the bar's close) for every bar of `candles`.
  function entrySignal(candles, C) { const sigs = C.entry.map((e) => { const S = SIGNALS[e.id]; return S.fn(candles, Object.assign({}, S.params, e.params || {}), C.side); }); return candles.map((_, i) => sigs.every((s) => s[i])); }
  // Session calendar (uses timestamps/dates only, never prices): is bar i the last of its day, and bars left in the day.
  function calendar(candles) {
    const lastOfDay = candles.map((b, i) => i === candles.length - 1 || candles[i + 1].d !== b.d);
    const barsLeft = new Array(candles.length).fill(0); for (let i = candles.length - 1, k = 0; i >= 0; i--) { k = lastOfDay[i] ? 0 : k + 1; barsLeft[i] = k; }
    return { lastOfDay, barsLeft };
  }
  function newState(candles, C) { const cal = calendar(candles); return { equity: C.capital, pos: null, trades: [], curve: [{ i: 0, eq: C.capital }], dayCount: {}, pending: false, atr: I().atr(candles, 14), lastOfDay: cal.lastOfDay, barsLeft: cal.barsLeft }; }
  // One bar of the simulation. Shared by run() and the paper-trading bot, so both apply identical rules.
  // `sig` is the entry signal evaluated on bar i's close. Returns a list of events describing what happened.
  function stepBar(S, candles, C, i, sig) {
    const b = candles[i], ev = [], slip = C.slippageTicks * C.tick, cost = (val) => (val * C.costBps) / 1e4;
    // 1) fill pending entry at this bar's open
    if (S.pending && !S.pos) {
      S.pending = false;
      const fill = b.o + C.side * slip, a = S.atr[i - 1];
      const stopDist = C.stop.type === 'atr' ? (a || b.o * 0.003) * C.stop.mult : (b.o * C.stop.pct) / 100;
      const stop = fill - C.side * stopDist, target = C.target.rr ? fill + C.side * stopDist * C.target.rr : null;
      const riskAmt = (S.equity * C.riskPct) / 100; let qty = Math.floor(riskAmt / stopDist / C.lot) * C.lot;
      // exposure cap: notional ≤ equity × maxLeverage (1 = no leverage, as in cash equity; futures need only margin)
      qty = Math.min(qty, Math.floor((S.equity * (C.maxLeverage || 1)) / fill / C.lot) * C.lot);
      let partial = false; if (C.maxVolPct > 0) { const cap = Math.floor((b.v * C.maxVolPct) / C.lot) * C.lot; if (qty > cap) { qty = cap; partial = true; } }
      if (qty > 0) { S.pos = { entryI: i, entry: fill, stop, target, qty, stopDist, partial }; S.dayCount[b.d] = (S.dayCount[b.d] || 0) + 1; ev.push({ type: 'entry', i, price: fill, qty, stop, target, partial }); }
      else { S.skippedSize = (S.skippedSize || 0) + 1; S.oneLotRisk = Math.max(S.oneLotRisk || 0, stopDist * C.lot); ev.push({ type: 'skip', i, why: `size rounds to zero: one lot risks ${Math.round(stopDist * C.lot)} but the budget is ${Math.round(riskAmt)} (raise capital or risk %, or widen the exposure cap)` }); }
    }
    // 2) manage open position within this bar
    if (S.pos) {
      const pos = S.pos; let exit = null, why = null;
      const hitStop = C.side > 0 ? b.l <= pos.stop : b.h >= pos.stop;
      const hitTgt = pos.target != null && (C.side > 0 ? b.h >= pos.target : b.l <= pos.target);
      if (hitStop) { const gapThrough = C.side > 0 ? b.o < pos.stop : b.o > pos.stop; exit = (gapThrough ? b.o : pos.stop) - C.side * slip; why = gapThrough ? 'stop (gapped)' : 'stop'; }
      else if (hitTgt) { exit = pos.target - C.side * slip; why = 'target'; }
      else if (C.eodExit && S.lastOfDay[i]) { exit = b.c - C.side * slip; why = 'end of day'; }
      if (exit != null) {
        const gross = C.side * (exit - pos.entry) * pos.qty, costs = cost(pos.entry * pos.qty) + cost(exit * pos.qty);
        const net = gross - costs; S.equity += net;
        const t = { entryI: pos.entryI, exitI: i, entryT: candles[pos.entryI].t, exitT: b.t, entry: pos.entry, exit, qty: pos.qty, gross, costs, net, R: net / (pos.stopDist * pos.qty), why, side: C.side > 0 ? 'long' : 'short', day: b.d, partial: pos.partial };
        S.trades.push(t); S.pos = null; S.curve.push({ i, eq: S.equity }); ev.push({ type: 'exit', i, trade: t });
      }
    }
    // 3) evaluate signal on this bar's close → fill next bar
    if (sig && !S.pos && !S.pending) {
      if (S.barsLeft[i] < C.noEntryLastBars) ev.push({ type: 'skip', i, why: 'too close to the session close' });
      else if ((S.dayCount[b.d] || 0) >= C.maxTradesPerDay) ev.push({ type: 'skip', i, why: 'daily trade limit reached' });
      else if (i >= candles.length - 1) ev.push({ type: 'skip', i, why: 'no next bar to fill on' });
      else { S.pending = true; ev.push({ type: 'signal', i }); }
    }
    if (S.pending && S.lastOfDay[i]) S.pending = false; // never carry an entry overnight
    return ev;
  }
  function summarise(S, C) {
    const trades = S.trades, stats = IA.risk.tradeStats(trades.map((t) => t.net));
    const eqs = S.curve.map((p) => p.eq), dd = IA.risk.maxDrawdown(eqs);
    stats.maxDD = dd.maxDD; stats.maxDDPct = dd.maxDDPct; stats.finalEquity = S.equity; stats.returnPct = ((S.equity - C.capital) / C.capital) * 100;
    stats.avgR = trades.length ? trades.reduce((a, t) => a + t.R, 0) / trades.length : 0;
    stats.totalCosts = trades.reduce((a, t) => a + t.costs, 0);
    stats.skippedSize = S.skippedSize || 0; stats.oneLotRisk = S.oneLotRisk || 0;
    return stats;
  }
  function run(candles, cfg) {
    const C = config(cfg);
    if (!candles || candles.length < 30) return { error: 'Need at least 30 bars.' };
    const entrySig = C.signal ? C.signal : entrySignal(candles, C);
    const S = newState(candles, C);
    for (let i = 1; i < candles.length; i++) stepBar(S, candles, C, i, entrySig[i]);
    const stats = summarise(S, C), trades = S.trades;
    const warnings = [];
    if (stats.skippedSize) warnings.push(`${stats.skippedSize} signal(s) could not be traded because one lot needs more risk (up to ${Math.round(stats.oneLotRisk).toLocaleString('en-IN')}) than ${C.riskPct}% of capital allows, or exceeds the ${C.maxLeverage}× exposure cap. Raise capital or risk %, or use a wider exposure cap for futures.`);
    if (trades.length < 30) warnings.push(`Only ${trades.length} trades — far too few to judge anything. Aim for hundreds across different regimes.`);
    warnings.push('Results are from SYNTHETIC data and say nothing about how this rule would perform on real markets.');
    return { trades, curve: S.curve, stats, warnings, config: C };
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

  // In-sample optimisation over a parameter grid, then ONE out-of-sample run of the chosen parameters.
  // The optimiser only ever receives candles[0..split): OOS bars are never visible to it.
  function optimiseOOS(candles, cfg, grid, { isFrac = 0.6, metric = 'avgR', minTrades = 20 } = {}) {
    const days = [...new Set(candles.map((b) => b.d))]; const cutDay = days[Math.floor(days.length * isFrac)]; const split = candles.findIndex((b) => b.d === cutDay);
    const IS = candles.slice(0, split), OOS = candles.slice(split);
    const keys = Object.keys(grid); const combos = keys.reduce((acc, k) => acc.flatMap((a) => grid[k].map((v) => ({ ...a, [k]: v }))), [{}]);
    const apply = (p) => { const c = JSON.parse(JSON.stringify(cfg)); c.stop = c.stop || { type: 'atr', mult: 1.5 }; c.target = c.target || { rr: 2 }; c.entry = c.entry || []; keys.forEach((k) => { const [a, b] = k.split('.'); if (a === 'stop') c.stop[b] = p[k]; else if (a === 'target') c.target[b] = p[k]; else { const e = c.entry.find((x) => x.id === a); if (e) e.params = { ...(e.params || {}), [b]: p[k] }; } }); return c; };
    const rows = combos.map((p) => { const r = run(IS, apply(p)); return { params: p, ...(r.stats || {}) }; });
    const ok = rows.filter((r) => (r.n || 0) >= minTrades); const best = (ok.length ? ok : rows).slice().sort((a, b) => (b[metric] || -1e9) - (a[metric] || -1e9))[0];
    const oos = run(OOS, apply(best.params));
    return { rows, best, oos: oos.stats || { n: 0 }, oosRun: oos, combos: combos.length, isBars: IS.length, oosBars: OOS.length, cutDay, degradation: best[metric] ? (oos.stats?.[metric] ?? 0) / best[metric] : null };
  }
  // Random-entry benchmark: same exits, sizing, costs, side and number of entries, but entry bars chosen at random.
  // p = share of random runs whose net P&L >= the strategy's. Small p is necessary, not sufficient, evidence of an edge.
  function randomEntryTest(candles, cfg, { runs = 200, seed = 5 } = {}) {
    const base = run(candles, cfg); if (base.error) return base; const n = base.trades.length; if (n < 5) return { error: 'Need at least 5 trades in the strategy run.' };
    const lastOfDay = candles.map((b, i) => i === candles.length - 1 || candles[i + 1].d !== b.d); const left = new Array(candles.length).fill(0); for (let i = candles.length - 1, k = 0; i >= 0; i--) { k = lastOfDay[i] ? 0 : k + 1; left[i] = k; }
    const eligible = candles.map((_, i) => i).filter((i) => i > 15 && left[i] >= (cfg.noEntryLastBars ?? 3));
    const r = IA.gen.rng(seed); const nets = [];
    for (let k = 0; k < runs; k++) { const sig = new Array(candles.length).fill(false); for (let j = 0; j < n * 2; j++) sig[eligible[Math.floor(r() * eligible.length)]] = true; const x = run(candles, { ...cfg, signal: sig, maxTradesPerDay: 99 }); const tr = x.trades.slice(0, n); nets.push(tr.reduce((a, t) => a + t.net, 0)); }
    const strat = base.stats.net; const p = (nets.filter((x) => x >= strat).length + 1) / (runs + 1); nets.sort((a, b) => a - b);
    return { strategyNet: strat, trades: n, runs, p, randomMedian: nets[Math.floor(runs / 2)], random95: nets[Math.floor(runs * 0.95)], random5: nets[Math.floor(runs * 0.05)] };
  }
  IA.bt = { SIGNALS, DEFAULTS, config, entrySignal, calendar, newState, stepBar, summarise, run, monteCarlo, riskOfRuinSim, groupStats, walkForward, optimiseOOS, randomEntryTest };
})(typeof window !== 'undefined' ? window : globalThis);
