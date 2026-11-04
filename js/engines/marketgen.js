/* Synthetic market generator — seeded and reproducible. ALL OUTPUT IS SYNTHETIC.
   It imitates a few stylised features (volatility clustering, U-shaped intraday volume,
   overnight gaps, regimes). It is not a model of any real instrument. */
(function (root) {
  const IA = (root.IA = root.IA || {});

  function rng(seed) { // mulberry32
    let a = seed >>> 0;
    return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function gauss(r) { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  const roundTick = (p, tick) => Math.round(p / tick) * tick;

  const PRESETS = {
    NIFTY: { name: 'Nifty 50 (synthetic)', price: 25800, tick: 0.05, dayVol: 0.009, minutes: 375, open: '09:15', vol: 9e5 },
    BANKNIFTY: { name: 'Bank Nifty (synthetic)', price: 57500, tick: 0.05, dayVol: 0.011, minutes: 375, open: '09:15', vol: 4e5 },
    RELIANCE: { name: 'Large-cap NSE stock (synthetic)', price: 1480, tick: 0.1, dayVol: 0.014, minutes: 375, open: '09:15', vol: 6e5 },
    MIDCAP: { name: 'Mid-cap NSE stock (synthetic)', price: 640, tick: 0.05, dayVol: 0.022, minutes: 375, open: '09:15', vol: 3e5 },
    SPY: { name: 'US index ETF (synthetic)', price: 680, tick: 0.01, dayVol: 0.010, minutes: 390, open: '09:30', vol: 8e5 },
    NVDA: { name: 'US mega-cap tech (synthetic)', price: 190, tick: 0.01, dayVol: 0.025, minutes: 390, open: '09:30', vol: 2e6 },
    DAX: { name: 'European index (synthetic)', price: 24000, tick: 0.5, dayVol: 0.010, minutes: 510, open: '09:00', vol: 2e5 },
    GOLD: { name: 'Gold futures (synthetic)', price: 4000, tick: 0.1, dayVol: 0.012, minutes: 600, open: '09:00', vol: 1e5 },
    BTC: { name: 'Crypto 24h (synthetic)', price: 105000, tick: 0.5, dayVol: 0.03, minutes: 1440, open: '00:00', vol: 5e3 },
  };

  // Generate `days` sessions of 1-minute bars, then aggregate to tfMin.
  function generate({ preset = 'NIFTY', days = 5, tfMin = 5, seed = 42, regimes = null, startDate = '2026-01-05' } = {}) {
    const P = PRESETS[preset] || PRESETS.NIFTY, r = rng(seed);
    const out1 = []; let price = P.price, sigma = P.dayVol / Math.sqrt(P.minutes);
    const [oh, om] = P.open.split(':').map(Number);
    const day0 = new Date(startDate + 'T00:00:00Z');
    let dayIdx = 0, cal = 0;
    while (dayIdx < days) {
      const d = new Date(day0.getTime() + cal * 864e5); cal++;
      if (P.minutes < 1440 && (d.getUTCDay() === 0 || d.getUTCDay() === 6)) continue;
      const dkey = d.toISOString().slice(0, 10);
      const regime = (regimes && regimes[dayIdx]) || ['trend-up', 'trend-down', 'range', 'range', 'breakout', 'reversal', 'volatile'][Math.floor(r() * 7)];
      // overnight gap
      if (dayIdx > 0 && P.minutes < 1440) price *= 1 + gauss(r) * P.dayVol * 0.35 + (regime === 'gap-up' ? 0.012 : regime === 'gap-down' ? -0.012 : 0);
      const dayOpen = price; let localSig = sigma * (regime === 'volatile' ? 1.8 : regime === 'range' ? 0.8 : 1);
      // Drifts are expressed as a multiple of the DAILY volatility spread over the session,
      // so a trend day moves roughly 1–1.5 daily sigmas, not 10%.
      const perMin = P.dayVol / P.minutes, dirSign = r() < 0.5 ? 1 : -1;
      const drift = { 'trend-up': 1.3, 'trend-down': -1.3, 'gap-up': 0.3, 'gap-down': -0.3 }[regime] || 0;
      const rangeMid = dayOpen;
      for (let m = 0; m < P.minutes; m++) {
        const frac = m / P.minutes;
        let mu = drift * perMin;
        if (regime === 'range') mu += -(price - rangeMid) / rangeMid * 0.02; // mean-revert to open
        if (regime === 'breakout' && frac > 0.4) mu += dirSign * 1.6 * perMin / 0.6;   // ~1.6σ move after midday
        if (regime === 'reversal') mu += dirSign * (frac < 0.45 ? 1.1 / 0.45 : -1.7 / 0.55) * perMin;
        // volatility clustering (GARCH-like)
        localSig = Math.max(sigma * 0.4, Math.min(sigma * 4, localSig * 0.97 + sigma * 0.03 + Math.abs(gauss(r)) * sigma * 0.05));
        const uShape = 1 + 1.6 * (Math.exp(-frac * 12) + Math.exp(-(1 - frac) * 14));
        const o = price; let h = o, l = o, p = o;
        for (let k = 0; k < 4; k++) { p *= 1 + mu / 4 + gauss(r) * localSig * Math.sqrt(uShape) / 2; h = Math.max(h, p); l = Math.min(l, p); }
        price = p;
        const v = Math.round((P.vol / P.minutes) * uShape * (0.5 + r()) * (Math.abs(p - o) / (o * localSig) + 0.6));
        const t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), oh, om + m);
        out1.push({ t, d: dkey, o: roundTick(o, P.tick), h: roundTick(h, P.tick), l: roundTick(l, P.tick), c: roundTick(p, P.tick), v, regime });
      }
      dayIdx++;
    }
    return { meta: { preset, name: P.name, tick: P.tick, seed, tfMin, synthetic: true, sessionMinutes: P.minutes, open: P.open }, candles: aggregate(out1, tfMin) };
  }
  function aggregate(c1, tf) {
    if (tf <= 1) return c1.map((b) => ({ ...b }));
    const out = []; let cur = null, curDay = null, n = 0;
    for (const b of c1) {
      if (!cur || b.d !== curDay || n >= tf) { if (cur) out.push(cur); cur = { t: b.t, d: b.d, o: b.o, h: b.h, l: b.l, c: b.c, v: b.v, regime: b.regime }; curDay = b.d; n = 1; }
      else { cur.h = Math.max(cur.h, b.h); cur.l = Math.min(cur.l, b.l); cur.c = b.c; cur.v += b.v; n++; }
    }
    if (cur) out.push(cur);
    return out;
  }
  function heikinAshi(c) {
    const out = []; c.forEach((b, i) => {
      const hc = (b.o + b.h + b.l + b.c) / 4, ho = i === 0 ? (b.o + b.c) / 2 : (out[i - 1].o + out[i - 1].c) / 2;
      out.push({ ...b, o: ho, c: hc, h: Math.max(b.h, ho, hc), l: Math.min(b.l, ho, hc) });
    });
    return out;
  }
  function renko(c, box) {
    if (!c.length) return []; const out = []; let base = c[0].c;
    c.forEach((b) => {
      while (b.c >= base + box) { out.push({ t: b.t, d: b.d, o: base, c: base + box, h: base + box, l: base, v: 0 }); base += box; }
      while (b.c <= base - box) { out.push({ t: b.t, d: b.d, o: base, c: base - box, h: base, l: base - box, v: 0 }); base -= box; }
    });
    return out;
  }
  function dailyBars(c) { return aggregate(c, 1e9); }

  // ----- Decision scenarios: shaped history + randomised future -----
  const SCENARIOS = {
    breakout: { title: 'Range breakout with volume', ideal: 'buy', why: 'Price closed above a well-tested range high on volume roughly 2× the recent average, above VWAP. Under a breakout plan this is a valid long with a stop below the range high/retest area. Waiting for a retest is also defensible.' },
    breakdown: { title: 'Support breakdown', ideal: 'sell', why: 'Price closed below multi-touch support on expanding volume, under VWAP, after lower highs. A short (where permitted — futures or intraday cash) with a stop above the broken level fits a breakdown plan.' },
    'failed-breakout': { title: 'Breakout that snaps back', ideal: 'avoid', why: 'Price poked above the range high on weak volume then closed back inside. Low-volume breakouts that return inside the range are a classic trap; the disciplined action is to stay out (aggressive traders may fade it, but that is a separate setup).' },
    consolidation: { title: 'Tight midday consolidation', ideal: 'wait', why: 'Price is chopping around VWAP in a narrowing range with falling volume. There is no edge until one side breaks. Waiting is a position.' },
    'trend-continuation': { title: 'Pullback in an uptrend', ideal: 'buy', why: 'Higher highs and higher lows, price pulled back to the rising 20 EMA/VWAP on lighter volume and printed a bullish rejection candle. That is the textbook continuation entry, stop below the pullback low.' },
    reversal: { title: 'Exhaustion after an extended move', ideal: 'wait', why: 'Price is far above VWAP after a vertical run, RSI is overbought with bearish divergence, but no lower high has formed yet. Shorting before structure breaks is catching a falling knife in reverse; wait for confirmation.' },
    'high-vol': { title: 'News spike — wide candles', ideal: 'avoid', why: 'Range per candle has tripled and spreads are wide. Your normal stop would be inside the noise, and the correct position size is tiny. Professionals often stand aside until volatility settles.' },
    'liquidity-sweep': { title: 'Sweep of prior low then reclaim', ideal: 'buy', why: 'Price wicked below the previous day low (where sell stops cluster), then closed back above it with strong volume. A reclaim of a swept level is a recognised reversal setup; stop below the sweep wick. Remember this is an interpretation, not proof of institutional activity.' },
    'low-vol': { title: 'Dead, low-volume session', ideal: 'wait', why: 'ATR is at multi-day lows and volume is thin. Targets cannot pay for costs and slippage. Waiting (or not trading today) is the professional choice.' },
    'exit-test': { title: 'You are long — price stalls at target zone', ideal: 'exit', why: 'You are long from lower. Price has reached the planned target at prior resistance and printed a bearish engulfing candle on high volume. Your plan says take profit at target — exit (or at least scale out).' },
  };
  function scenario(type, seed = Date.now() % 1e9) {
    const r = rng(seed), S = SCENARIOS[type]; if (!S) return null;
    const base = 1000 + Math.floor(r() * 2000), tick = 0.05, bars = [], vol0 = 50000;
    let p = base; const push = (o, c, vmul = 1, wick = 0.0015) => {
      const h = Math.max(o, c) * (1 + r() * wick), l = Math.min(o, c) * (1 - r() * wick);
      bars.push({ t: Date.UTC(2026, 0, 6, 9, 15 + bars.length * 5), d: '2026-01-06', o: roundTick(o, tick), h: roundTick(h, tick), l: roundTick(l, tick), c: roundTick(c, tick), v: Math.round(vol0 * vmul * (0.7 + r() * 0.6)) });
    };
    const walk = (n, mu, sd, vmul = 1) => { for (let i = 0; i < n; i++) { const o = p; p = p * (1 + mu + gauss(r) * sd); push(o, p, vmul); } };
    const range = (n, hi, lo, vmul = 0.8) => { for (let i = 0; i < n; i++) { const o = p; const tgt = lo + (hi - lo) * (0.15 + 0.7 * r()); p = tgt; push(o, p, vmul); } };
    if (type === 'breakout' || type === 'failed-breakout') {
      walk(8, 0.0006, 0.002); const hi = p * 1.004, lo = p * 0.994; range(18, hi, lo);
      const o = p; p = hi * (type === 'breakout' ? 1.004 : 1.0012); push(o, p, type === 'breakout' ? 2.4 : 0.9);
      if (type === 'failed-breakout') { const o2 = p; p = hi * 0.997; push(o2, p, 1.1); }
    } else if (type === 'breakdown') { walk(10, -0.0003, 0.002); const hi = p * 1.005, lo = p * 0.996; range(16, hi, lo); const o = p; p = lo * 0.995; push(o, p, 2.2); }
    else if (type === 'consolidation') { walk(10, 0.0004, 0.002); range(20, p * 1.0015, p * 0.9985, 0.5); }
    else if (type === 'trend-continuation') { walk(12, 0.0015, 0.0015, 1.2); walk(5, -0.0012, 0.001, 0.6); const o = p; p *= 1.003; push(o, p, 1.3, 0.003); }
    else if (type === 'reversal') { walk(10, 0.0004, 0.0015); walk(10, 0.0035, 0.0015, 1.6); walk(3, 0.0004, 0.002, 0.8); }
    else if (type === 'high-vol') { walk(15, 0, 0.0015); walk(6, 0, 0.009, 3.5); }
    else if (type === 'liquidity-sweep') { walk(14, -0.0006, 0.0015); const low = Math.min(...bars.map((b) => b.l)); range(6, low * 1.006, low * 1.001); const o = p; p = low * 1.004; push(o, p, 2.5); bars[bars.length - 1].l = roundTick(low * 0.996, tick); }
    else if (type === 'low-vol') { walk(28, 0, 0.0005, 0.3); }
    else if (type === 'exit-test') { walk(18, 0.0018, 0.0015, 1.1); const o = p; p *= 0.996; push(o * 1.002, p, 2.3, 0.002); }
    // future: randomised continuation vs failure — the same good decision can lose
    const hist = bars.slice(); const fut = []; const goesWithIdeal = r() < 0.55;
    const dirIdeal = { buy: 1, sell: -1, exit: -1 }[S.ideal] || (r() < 0.5 ? 1 : -1);
    const dir = goesWithIdeal ? dirIdeal : -dirIdeal;
    const sd = type === 'high-vol' ? 0.007 : type === 'low-vol' ? 0.0005 : 0.002;
    for (let i = 0; i < 16; i++) { const o = p; p = p * (1 + dir * sd * 0.6 + gauss(r) * sd); fut.push({ t: Date.UTC(2026, 0, 6, 9, 15 + (hist.length + i) * 5), d: '2026-01-06', o: roundTick(o, tick), h: roundTick(Math.max(o, p) * (1 + r() * 0.001), tick), l: roundTick(Math.min(o, p) * (1 - r() * 0.001), tick), c: roundTick(p, tick), v: Math.round(vol0 * (0.7 + r() * 0.6)) }); }
    return { type, title: S.title, ideal: S.ideal, why: S.why, history: hist, future: fut, outcomeDir: dir, seed };
  }

  IA.gen = { rng, gauss, generate, aggregate, heikinAshi, renko, dailyBars, scenario, SCENARIOS, PRESETS, roundTick };
})(typeof window !== 'undefined' ? window : globalThis);
