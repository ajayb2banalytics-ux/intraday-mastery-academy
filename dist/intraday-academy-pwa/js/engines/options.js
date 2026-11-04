/* Options maths: Black-Scholes(-Merton) price & Greeks, multi-leg payoff. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  // Standard normal CDF (Abramowitz-Stegun 7.1.26 via erf; |err| < 7.5e-8)
  function erf(x) {
    const s = Math.sign(x); x = Math.abs(x);
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const t = 1 / (1 + p * x); const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return s * y;
  }
  const cdf = (x) => 0.5 * (1 + erf(x / Math.SQRT2));
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
  function analyse(legs, spot) {
    const strikes = legs.map((l) => l.K).filter((k) => k > 0);
    const hi = Math.max(spot, ...strikes) * 2;
    // Evaluate from 0 (price floor) to 2x the highest strike; payoff is piecewise linear
    const pts = payoff(legs, 0, hi, 4000);
    let max = -Infinity, min = Infinity; pts.forEach((p) => { max = Math.max(max, p.pnl); min = Math.min(min, p.pnl); });
    // Slope as price → ∞ decides whether gain/loss is unbounded on the upside
    const slopeHi = legs.reduce((a, l) => a + (l.type === 'call' || l.type === 'stock' || l.type === 'future' ? l.side * l.qty : 0), 0);
    const be = [];
    for (let i = 1; i < pts.length; i++) if ((pts[i - 1].pnl < 0 && pts[i].pnl >= 0) || (pts[i - 1].pnl > 0 && pts[i].pnl <= 0)) {
      const a = pts[i - 1], b = pts[i]; be.push(a.s + ((0 - a.pnl) * (b.s - a.s)) / (b.pnl - a.pnl));
    }
    const netPremium = legs.reduce((a, l) => a + (l.type === 'call' || l.type === 'put' ? -l.side * l.premium * l.qty : 0), 0);
    return {
      pts, breakevens: be, netPremium,
      maxGain: slopeHi > 0 ? Infinity : max, maxLoss: slopeHi < 0 ? -Infinity : min, slopeHi,
    };
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
