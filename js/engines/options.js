/* Options maths: Black-Scholes(-Merton) price & Greeks, multi-leg payoff. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  // Standard normal CDF — Hart (1968) double-precision algorithm as given by G. West, "Better approximations
  // to cumulative normal functions" (Wilmott, 2005). Absolute error ~1e-15.
  function cdf(x) {
    const z = Math.abs(x); let c;
    if (z > 37) c = 0;
    else { const e = Math.exp(-z * z / 2);
      if (z < 7.07106781186547) {
        let n = 3.52624965998911e-2 * z + 0.700383064443688; n = n * z + 6.37396220353165; n = n * z + 33.912866078383; n = n * z + 112.079291497871; n = n * z + 221.213596169931; n = n * z + 220.206867912376;
        let d = 8.83883476483184e-2 * z + 1.75566716318264; d = d * z + 16.064177579207; d = d * z + 86.7807322029461; d = d * z + 296.564248779674; d = d * z + 637.333633378831; d = d * z + 793.826512519948; d = d * z + 440.413735824752;
        c = e * n / d;
      } else { let f = z + 0.65; f = z + 4 / f; f = z + 3 / f; f = z + 2 / f; f = z + 1 / f; c = e / f / 2.506628274631; }
    }
    return x <= 0 ? c : 1 - c;
  }
  const pdf = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

  // S spot, K strike, T years, r rate (decimal), sigma vol (decimal), q dividend yield
  function bs({ S, K, T, r = 0.065, sigma, q = 0, type = 'call' }) {
    if (!(S > 0 && K > 0 && sigma > 0)) return { error: 'Spot, strike and volatility must be positive.' };
    if (T <= 0) { const iv = type === 'call' ? Math.max(S - K, 0) : Math.max(K - S, 0); return { price: iv, delta: type === 'call' ? (S > K ? 1 : 0) : (S < K ? -1 : 0), gamma: 0, theta: 0, vega: 0, rho: 0, intrinsic: iv, timeValue: 0 }; }
    const sq = Math.sqrt(T), d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * sq), d2 = d1 - sigma * sq;
    const dq = Math.exp(-q * T), dr = Math.exp(-r * T);
    let price, delta, theta, rho;
    if (type === 'call') {
      price = S * dq * cdf(d1) - K * dr * cdf(d2); delta = dq * cdf(d1);
      theta = -(S * dq * pdf(d1) * sigma) / (2 * sq) - r * K * dr * cdf(d2) + q * S * dq * cdf(d1);
      rho = K * T * dr * cdf(d2);
    } else {
      price = K * dr * cdf(-d2) - S * dq * cdf(-d1); delta = -dq * cdf(-d1);
      theta = -(S * dq * pdf(d1) * sigma) / (2 * sq) + r * K * dr * cdf(-d2) - q * S * dq * cdf(-d1);
      rho = -K * T * dr * cdf(-d2);
    }
    const gamma = (dq * pdf(d1)) / (S * sigma * sq), vega = S * dq * pdf(d1) * sq;
    const intrinsic = type === 'call' ? Math.max(S - K, 0) : Math.max(K - S, 0);
    // theta per calendar day, vega & rho per 1 percentage point
    return { price, d1, d2, delta, gamma, theta: theta / 365, vega: vega / 100, rho: rho / 100, intrinsic, timeValue: price - intrinsic };
  }
  function impliedVol({ price, S, K, T, r = 0.065, q = 0, type = 'call' }) {
    let lo = 0.0001, hi = 5;
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2, p = bs({ S, K, T, r, sigma: mid, q, type }).price;
      if (Math.abs(p - price) < 1e-6) return mid;
      if (p > price) hi = mid; else lo = mid;
    }
    return (lo + hi) / 2;
  }
  // legs: [{type:'call'|'put'|'stock'|'future', side:1 long / -1 short, K, premium, qty}]
  function legPayoff(l, ST) {
    if (l.type === 'stock' || l.type === 'future') return l.side * (ST - l.K) * l.qty;
    const iv = l.type === 'call' ? Math.max(ST - l.K, 0) : Math.max(l.K - ST, 0);
    return l.side * (iv - l.premium) * l.qty;
  }
  function payoff(legs, lo, hi, steps = 200) {
    const pts = []; for (let i = 0; i <= steps; i++) { const s = lo + ((hi - lo) * i) / steps; pts.push({ s, pnl: legs.reduce((a, l) => a + legPayoff(l, s), 0) }); }
    return pts;
  }
  // Exact analysis: the expiry payoff is piecewise-linear with kinks only at strikes, so extremes occur at a
  // kink, at S = 0, or at infinity (decided by the slope beyond the highest strike).
  function analyse(legs, spot) {
    const strikes = legs.map((l) => l.K).filter((k) => k > 0); const hi = Math.max(spot, ...strikes) * 2;
    const val = (s) => legs.reduce((a, l) => a + legPayoff(l, s), 0);
    const knots = [...new Set([0, ...strikes, hi])].sort((a, b) => a - b); const kv = knots.map(val);
    const slopeHi = legs.reduce((a, l) => a + (l.type === 'call' || l.type === 'stock' || l.type === 'future' ? l.side * l.qty : 0), 0);
    let max = Math.max(...kv), min = Math.min(...kv);
    const be = [];
    for (let i = 1; i < knots.length; i++) { const a = kv[i - 1], b = kv[i]; if (a === 0 && i === 1) be.push(knots[0]); if ((a < 0 && b > 0) || (a > 0 && b < 0)) be.push(knots[i - 1] + (0 - a) * (knots[i] - knots[i - 1]) / (b - a)); else if (b === 0) be.push(knots[i]); }
    const vHi = kv[kv.length - 1]; if (slopeHi !== 0 && Math.sign(vHi) === -Math.sign(slopeHi) && vHi !== 0) be.push(hi - vHi / slopeHi);
    const pts = payoff(legs, 0, hi, 400);
    const netPremium = legs.reduce((a, l) => a + (l.type === 'call' || l.type === 'put' ? -l.side * l.premium * l.qty : 0), 0);
    return { pts, breakevens: [...new Set(be.map((x) => Math.round(x * 1e6) / 1e6))].sort((a, b) => a - b), netPremium, maxGain: slopeHi > 0 ? Infinity : max, maxLoss: slopeHi < 0 ? -Infinity : min, slopeHi };
  }
  const templates = {
    'Long call': (S, w) => [{ type: 'call', side: 1, K: S, qty: 1 }],
    'Long put': (S, w) => [{ type: 'put', side: 1, K: S, qty: 1 }],
    'Covered call': (S, w) => [{ type: 'stock', side: 1, K: S, qty: 1 }, { type: 'call', side: -1, K: S + w, qty: 1 }],
    'Protective put': (S, w) => [{ type: 'stock', side: 1, K: S, qty: 1 }, { type: 'put', side: 1, K: S - w, qty: 1 }],
    'Bull call spread': (S, w) => [{ type: 'call', side: 1, K: S, qty: 1 }, { type: 'call', side: -1, K: S + w, qty: 1 }],
    'Bear put spread': (S, w) => [{ type: 'put', side: 1, K: S, qty: 1 }, { type: 'put', side: -1, K: S - w, qty: 1 }],
    'Bull put spread': (S, w) => [{ type: 'put', side: -1, K: S, qty: 1 }, { type: 'put', side: 1, K: S - w, qty: 1 }],
    'Bear call spread': (S, w) => [{ type: 'call', side: -1, K: S, qty: 1 }, { type: 'call', side: 1, K: S + w, qty: 1 }],
    'Long straddle': (S, w) => [{ type: 'call', side: 1, K: S, qty: 1 }, { type: 'put', side: 1, K: S, qty: 1 }],
    'Short straddle': (S, w) => [{ type: 'call', side: -1, K: S, qty: 1 }, { type: 'put', side: -1, K: S, qty: 1 }],
    'Long strangle': (S, w) => [{ type: 'call', side: 1, K: S + w, qty: 1 }, { type: 'put', side: 1, K: S - w, qty: 1 }],
    'Short strangle': (S, w) => [{ type: 'call', side: -1, K: S + w, qty: 1 }, { type: 'put', side: -1, K: S - w, qty: 1 }],
    'Iron condor': (S, w) => [{ type: 'put', side: 1, K: S - 2 * w, qty: 1 }, { type: 'put', side: -1, K: S - w, qty: 1 }, { type: 'call', side: -1, K: S + w, qty: 1 }, { type: 'call', side: 1, K: S + 2 * w, qty: 1 }],
    'Long call butterfly': (S, w) => [{ type: 'call', side: 1, K: S - w, qty: 1 }, { type: 'call', side: -1, K: S, qty: 2 }, { type: 'call', side: 1, K: S + w, qty: 1 }],
    'Call ratio spread 1x2': (S, w) => [{ type: 'call', side: 1, K: S, qty: 1 }, { type: 'call', side: -1, K: S + w, qty: 2 }],
  };
  IA.opt = { bs, impliedVol, payoff, analyse, legPayoff, templates, cdf, pdf };
})(typeof window !== 'undefined' ? window : globalThis);
