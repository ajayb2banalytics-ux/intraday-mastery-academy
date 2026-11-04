/* Known-answer tests for every calculation engine. Run: node tests/engines.test.js */
const path = require('path');
const files = ['specs', 'indicators', 'risk', 'options', 'marketgen', 'backtest', 'clock', 'execution'];
files.forEach((f) => require(path.join(__dirname, '..', 'js', 'engines', f + '.js')));
const IA = globalThis.IA;
const results = []; let pass = 0, fail = 0;
function t(id, name, fn) {
  try { const r = fn(); if (r === true) { pass++; results.push({ id, name, ok: true }); } else { fail++; results.push({ id, name, ok: false, detail: String(r) }); } }
  catch (e) { fail++; results.push({ id, name, ok: false, detail: e.stack.split('\n')[0] }); }
}
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol || `expected ${b}, got ${a}`;
const all = (...xs) => xs.every((x) => x === true) || xs.find((x) => x !== true);
const bars = (arr) => arr.map((c, i) => ({ t: i * 60000, d: '2026-01-01', o: c, h: c, l: c, c, v: 100 }));

// ---------- Indicators ----------
t('IND-01', 'SMA(3) of 1..5', () => JSON.stringify(IA.ind.sma([1, 2, 3, 4, 5], 3)) === '[null,null,2,3,4]' || IA.ind.sma([1, 2, 3, 4, 5], 3));
t('IND-02', 'EMA(3) SMA-seeded of 1..5 = [-,-,2,3,4]', () => JSON.stringify(IA.ind.ema([1, 2, 3, 4, 5], 3)) === '[null,null,2,3,4]' || IA.ind.ema([1, 2, 3, 4, 5], 3));
t('IND-03', 'EMA recursion (10,11,12,20; n=3) last = 15.5', () => near(IA.ind.ema([10, 11, 12, 20], 3)[3], 15.5));
t('IND-04', 'WMA(3) of 1,2,3 = 14/6', () => near(IA.ind.wma([1, 2, 3], 3)[2], 14 / 6));
t('IND-05', 'Population SD of 2,4,4,4,5,5,7,9 = 2', () => near(IA.ind.stdev([2, 4, 4, 4, 5, 5, 7, 9], 8)[7], 2));
t('IND-06', 'Bollinger(8,2) upper=9 lower=1', () => { const b = IA.ind.bollinger([2, 4, 4, 4, 5, 5, 7, 9], 8, 2); return all(near(b.upper[7], 9), near(b.lower[7], 1), near(b.mid[7], 5)); });
const wilder = [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.10, 45.42, 45.84, 46.08, 45.89, 46.03, 45.61, 46.28, 46.28, 46.00, 46.03, 46.41, 46.22];
// Exact: avg gain 3.34/14, avg loss 1.40/14 → RSI = 70.4641. Published StockCharts table rounds the averages first (70.53, 66.32, 66.55, 69.41, 66.36) — allow 0.15.
t('IND-07', 'RSI(14) Wilder reference series: exact 70.4641; matches StockCharts table within rounding', () => { const r = IA.ind.rsi(wilder, 14); return all(near(r[14], 100 - 100 / (1 + 3.34 / 1.40), 1e-9), near(r[15], 66.32, 0.15), near(r[16], 66.55, 0.15), near(r[17], 69.41, 0.15), near(r[18], 66.36, 0.15)); });
t('IND-08', 'RSI is null during warm-up and within 0..100', () => { const r = IA.ind.rsi(wilder, 14); return r[13] === null && r.slice(14).every((x) => x >= 0 && x <= 100) || r; });
t('IND-09', 'RSI of monotonically rising series = 100', () => near(IA.ind.rsi([1, 2, 3, 4, 5, 6], 3)[5], 100));
t('IND-10', 'True range uses previous close gaps', () => { const c = [{ h: 10, l: 9, c: 9.5 }, { h: 12, l: 11, c: 11.5 }]; return near(IA.ind.trueRange(c)[1], 2.5); });
t('IND-11', 'ATR(3) Wilder of constant TR=2 is 2', () => { const c = Array.from({ length: 10 }, (_, i) => ({ h: 102 + i * 0, l: 100, c: 101, o: 101 })); return near(IA.ind.atr(c, 3)[9], 2); });
t('IND-12', 'MACD line = EMA12 − EMA26', () => { const s = Array.from({ length: 60 }, (_, i) => 100 + Math.sin(i / 5) * 5 + i * 0.1); const m = IA.ind.macd(s); const e12 = IA.ind.ema(s, 12), e26 = IA.ind.ema(s, 26); return all(near(m.line[59], e12[59] - e26[59]), near(m.hist[59], m.line[59] - m.signal[59])); });
t('IND-13', 'Classic pivots H110 L90 C100', () => { const p = IA.ind.pivots(110, 90, 100).classic; return all(near(p.P, 100), near(p.R1, 110), near(p.S1, 90), near(p.R2, 120), near(p.S2, 80), near(p.R3, 130), near(p.S3, 70)); });
t('IND-14', 'Camarilla R3 = C + 1.1×range/4', () => near(IA.ind.pivots(110, 90, 100).camarilla.R3, 100 + 1.1 * 20 / 4));
t('IND-15', 'Fibonacci 61.8% retracement of 100→200 = 138.2', () => near(IA.ind.fibonacci(100, 200, true).retracements.find((x) => x.ratio === 0.618).price, 138.2));
t('IND-16', 'Session VWAP resets each day and equals typical price for one bar', () => { const c = [{ d: 'a', h: 12, l: 9, c: 9, v: 10 }, { d: 'a', h: 12, l: 12, c: 12, v: 10 }, { d: 'b', h: 30, l: 30, c: 30, v: 5 }]; const v = IA.ind.vwap(c); return all(near(v[0], 10), near(v[1], 11), near(v[2], 30)); });
t('IND-17', 'OBV adds/subtracts volume by close direction', () => { const c = [{ c: 10, v: 5 }, { c: 11, v: 7 }, { c: 10, v: 3 }, { c: 10, v: 9 }]; return JSON.stringify(IA.ind.obv(c)) === '[0,7,4,4]' || IA.ind.obv(c); });
t('IND-18', 'Stochastic %K = 100 at highest close', () => { const c = Array.from({ length: 14 }, (_, i) => ({ h: 10 + i, l: 9 + i, c: 10 + i })); return near(IA.ind.stochastic(c, 14, 3).k[13], 100); });
t('IND-19', 'Williams %R = 0 at highest close', () => { const c = Array.from({ length: 14 }, (_, i) => ({ h: 10 + i, l: 9 + i, c: 10 + i })); return near(IA.ind.williamsR(c, 14)[13], 0); });
t('IND-20', 'ROC(1) of 100→110 = 10%', () => near(IA.ind.roc([100, 110], 1)[1], 10));
t('IND-21', 'CCI of constant series = 0', () => near(IA.ind.cci(Array.from({ length: 25 }, () => ({ h: 10, l: 10, c: 10 })), 20)[24], 0));
t('IND-22', 'MFI = 100 when typical price only rises', () => near(IA.ind.mfi(Array.from({ length: 20 }, (_, i) => ({ h: 10 + i, l: 9 + i, c: 10 + i, v: 100 })), 14)[19], 100));
t('IND-23', 'CMF = +1 when every close is at the high', () => near(IA.ind.cmf(Array.from({ length: 20 }, (_, i) => ({ h: 11, l: 9, c: 11, v: 50 })), 20)[19], 1));
t('IND-24', 'Donchian upper/lower = highest high / lowest low', () => { const c = [5, 8, 3, 7].map((x) => ({ h: x + 1, l: x - 1, c: x })); const d = IA.ind.donchian(c, 4); return all(near(d.upper[3], 9), near(d.lower[3], 2)); });
t('IND-25', 'ADX/DI produced in 0..100 on a trend', () => { const c = Array.from({ length: 80 }, (_, i) => ({ h: 101 + i, l: 99 + i, c: 100.5 + i, o: 100 + i })); const a = IA.ind.adx(c, 14); return a.adx[79] > 50 && a.pdi[79] > a.ndi[79] || [a.adx[79], a.pdi[79], a.ndi[79]]; });
t('IND-26', 'Supertrend direction is up in a steady uptrend', () => { const c = Array.from({ length: 60 }, (_, i) => ({ h: 101 + i, l: 99 + i, c: 100.5 + i, o: 100 + i })); return IA.ind.supertrend(c, 10, 3).dir[59] === 1; });
t('IND-27', 'Parabolic SAR stays below price in an uptrend', () => { const c = Array.from({ length: 40 }, (_, i) => ({ h: 101 + i, l: 99 + i, c: 100.5 + i, o: 100 + i })); const p = IA.ind.psar(c); return p[39] < c[39].l || p[39]; });
t('IND-28', 'Volume profile POC is the most-traded bin; VA holds ≥70%', () => { const c = [{ h: 101, l: 100, v: 1000 }, { h: 105, l: 104, v: 10 }, { h: 110, l: 100, v: 100 }]; const vp = IA.ind.volumeProfile(c, 10); const inVA = vp.bins.filter((b) => b.lo >= vp.val - 1e-9 && b.hi <= vp.vah + 1e-9).reduce((a, b) => a + b.vol, 0); return all(vp.poc < 102 || vp.poc, inVA / vp.total >= 0.7 || inVA / vp.total); });
t('IND-29', 'Ichimoku Tenkan = (9-high + 9-low)/2', () => { const c = Array.from({ length: 9 }, (_, i) => ({ h: 10 + i, l: 5 + i, c: 8 })); return near(IA.ind.ichimoku(c).tenkan[8], (18 + 5) / 2); });
t('IND-30', 'VWMA weights by volume', () => { const c = [{ c: 10, v: 1 }, { c: 20, v: 3 }]; return near(IA.ind.vwma(c, 2)[1], 17.5); });
t('IND-31', 'Anchored VWAP is null before anchor', () => { const v = IA.ind.anchoredVwap(bars([1, 2, 3]), 1); return v[0] === null && near(v[1], 2) === true || v; });
t('IND-32', 'Keltner = EMA ± m×ATR', () => { const c = Array.from({ length: 30 }, (_, i) => ({ h: 102, l: 100, c: 101, o: 101 })); const k = IA.ind.keltner(c, 20, 2, 10); return all(near(k.upper[29], 105), near(k.lower[29], 97)); });
t('IND-33', 'Divergence detector finds bearish divergence', () => { const hs = [1, 2, 5, 2, 1, 2, 6, 2, 1]; const c = hs.map((h) => ({ h, l: h - 0.5, c: h })); const osc = [0, 0, 80, 0, 0, 0, 60, 0, 0]; return IA.ind.divergence(c, osc, 2).some((d) => d.type === 'bearish'); });

// ---------- Risk ----------
t('RSK-01', 'Position size 1% of 1,00,000, entry 500 stop 495 → 200 shares', () => { const r = IA.risk.positionSize({ capital: 100000, riskPct: 1, entry: 500, stop: 495 }); return all(r.units === 200 || r.units, near(r.actualRisk, 1000)); });
t('RSK-02', 'Position size capped by capital', () => { const r = IA.risk.positionSize({ capital: 10000, riskPct: 2, entry: 1000, stop: 999 }); return r.units === 10 || r.units; });
t('RSK-03', 'Futures sizing rounds down to whole lots (lot 65)', () => { const r = IA.risk.positionSize({ capital: 1e6, riskPct: 1, entry: 25800, stop: 25740, lot: 65, leverage: 8 }); return r.units === 130 && r.lots === 2 || [r.units, r.lots]; });
t('RSK-04', 'Zero-risk edge: stop = entry is rejected', () => !!IA.risk.positionSize({ capital: 1000, riskPct: 1, entry: 100, stop: 100 }).error);
t('RSK-05', 'Invalid inputs rejected (negative capital, missing price)', () => !!IA.risk.positionSize({ capital: -5, riskPct: 1, entry: 100, stop: 99 }).error && !!IA.risk.positionSize({ capital: 1000, riskPct: 1, entry: undefined, stop: 99 }).error);
t('RSK-06', 'Very small budget → 0 units with warning', () => { const r = IA.risk.positionSize({ capital: 1000, riskPct: 0.1, entry: 25800, stop: 25700, lot: 65 }); return r.units === 0 && r.warnings.length > 0; });
t('RSK-07', 'Short side detected when stop > entry', () => IA.risk.positionSize({ capital: 1e5, riskPct: 1, entry: 100, stop: 102 }).side === 'short');
t('RSK-08', 'R:R 100/95/110 = 2:1, break-even WR 33.33%', () => { const r = IA.risk.riskReward({ entry: 100, stop: 95, target: 110 }); return all(near(r.ratio, 2), near(r.breakevenWinRate, 1 / 3)); });
t('RSK-09', 'R:R rejects target on wrong side', () => !!IA.risk.riskReward({ entry: 100, stop: 95, target: 90 }).error);
t('RSK-10', 'Expectancy W=0.5, +200/−100 → EV 50, PF 2', () => { const r = IA.risk.expectancy({ winRate: 0.5, avgWin: 200, avgLoss: 100 }); return all(near(r.ev, 50), near(r.profitFactor, 2)); });
t('RSK-11', 'Max drawdown of 100,120,90,130,100 = 30 (25%)', () => { const r = IA.risk.maxDrawdown([100, 120, 90, 130, 100]); return all(near(r.maxDD, 30), near(r.maxDDPct, 0.25)); });
t('RSK-12', 'Recovering 50% drawdown needs +100%', () => near(IA.risk.lossesToRecover(0.5), 1));
t('RSK-13', 'Trade stats on [100,-50,-50,200]', () => { const s = IA.risk.tradeStats([100, -50, -50, 200]); return all(near(s.winRate, 0.5), near(s.profitFactor, 3), near(s.net, 200), s.maxConsecLosses === 2 || s.maxConsecLosses, near(s.maxDD, 100)); });
t('RSK-14', 'Compounding 1000 at 10% for 2 periods = 1210', () => near(IA.risk.compounding({ start: 1000, ratePct: 10, periods: 2 }).final, 1210));
t('RSK-15', 'Leverage: notional 5L on 1L capital = 5×, 20% move wipes out', () => { const r = IA.risk.leverageMargin({ notional: 500000, marginPct: 20, capital: 100000 }); return all(near(r.effectiveLeverage, 5), near(r.movePctToLoseCapital, 20), near(r.margin, 100000)); });
t('RSK-16', 'Futures exposure Nifty 25800 × 65 × 2 = 33,54,000', () => near(IA.risk.futuresExposure({ price: 25800, lotSize: 65, lots: 2 }).notional, 3354000));
t('RSK-17', 'Portfolio risk: two perfectly correlated = sum; uncorrelated = √2', () => { const a = IA.risk.portfolioRisk([{ risk: 1000 }, { risk: 1000 }], [[1, 1], [1, 1]]).combined, b = IA.risk.portfolioRisk([{ risk: 1000 }, { risk: 1000 }], [[1, 0], [0, 1]]).combined; return all(near(a, 2000), near(b, Math.SQRT2 * 1000)); });
t('RSK-18', 'Kelly W=0.6 b=1 → 0.2', () => near(IA.risk.kelly({ winRate: 0.6, payoff: 1 }).full, 0.2));
t('RSK-19', 'Currency conversion INR→USD via table', () => { const fx = { rates: { USD: 1, INR: 88.5 } }; return near(IA.risk.convert(885, 'INR', 'USD', fx).value, 10); });
t('RSK-20', 'India intraday charges: buy 1,00,000 sell 1,01,000', () => { const r = IA.risk.indiaCharges({ segment: 'eqIntraday', buyValue: 100000, sellValue: 101000 }); const exp = 40 + 25.25 + 201000 * 307e-7 + 201000 * 1e-6 + 3 + 0.18 * (40 + 201000 * 307e-7 + 201000 * 1e-6); return all(near(r.brokerage, 40), near(r.stt, 25.25), near(r.stamp, 3), near(r.total, exp, 1e-6), near(r.net, 1000 - exp, 1e-6)); });
t('RSK-21', 'India options STT 0.15% of sell premium (post-Apr-2026)', () => near(IA.risk.indiaCharges({ segment: 'options', buyValue: 10000, sellValue: 12000 }).stt, 18));
t('RSK-22', 'India futures STT 0.05% of sell value', () => near(IA.risk.indiaCharges({ segment: 'futures', buyValue: 1e6, sellValue: 1e6 }).stt, 500));
t('RSK-23', 'Zero turnover → zero charges', () => near(IA.risk.indiaCharges({ segment: 'eqIntraday', buyValue: 0, sellValue: 0 }).total, 0));
t('RSK-24', 'ATR stop long = entry − 1.5×ATR', () => near(IA.risk.atrStop({ entry: 100, atr: 2, mult: 1.5 }).stop, 97));
t('RSK-25', 'Risk-of-ruin formula: negative edge → 1', () => IA.risk.riskOfRuinFormula({ winRate: 0.3, payoff: 1, riskPct: 2 }).ror === 1);

// ---------- Options ----------
const bc = IA.opt.bs({ S: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, type: 'call' });
const bp = IA.opt.bs({ S: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, type: 'put' });
t('OPT-01', 'BS call(100,100,1y,5%,20%) = 10.4506', () => near(bc.price, 10.4506, 1e-3));
t('OPT-02', 'BS put = 5.5735', () => near(bp.price, 5.5735, 1e-3));
t('OPT-03', 'Put–call parity C − P = S − K·e^(−rT)', () => near(bc.price - bp.price, 100 - 100 * Math.exp(-0.05), 1e-6));
t('OPT-04', 'Call delta 0.6368, put delta −0.3632', () => all(near(bc.delta, 0.6368, 1e-4), near(bp.delta, -0.3632, 1e-4)));
t('OPT-05', 'Gamma 0.01876 (same for call and put)', () => all(near(bc.gamma, 0.018762, 1e-5), near(bp.gamma, bc.gamma)));
t('OPT-06', 'Vega per 1 vol point = 0.3752', () => near(bc.vega, 0.37524, 1e-4));
t('OPT-07', 'Call theta per day ≈ −0.01757', () => near(bc.theta, -6.414 / 365, 1e-4));
t('OPT-08', 'Implied vol recovers 20% from price', () => near(IA.opt.impliedVol({ price: bc.price, S: 100, K: 100, T: 1, r: 0.05 }), 0.2, 1e-4));
t('OPT-09', 'At expiry price = intrinsic', () => near(IA.opt.bs({ S: 110, K: 100, T: 0, sigma: 0.2 }).price, 10));
t('OPT-10', 'Bull call spread 100/110 @5/2: max +7, max −3, BE 103', () => { const a = IA.opt.analyse([{ type: 'call', side: 1, K: 100, premium: 5, qty: 1 }, { type: 'call', side: -1, K: 110, premium: 2, qty: 1 }], 100); return all(near(a.maxGain, 7, 1e-6), near(a.maxLoss, -3, 1e-6), near(a.breakevens[0], 103, 0.05)); });
t('OPT-11', 'Long call has unlimited gain, loss = premium', () => { const a = IA.opt.analyse([{ type: 'call', side: 1, K: 100, premium: 5, qty: 1 }], 100); return all(a.maxGain === Infinity || a.maxGain, near(a.maxLoss, -5)); });
t('OPT-12', 'Short call has unlimited loss', () => IA.opt.analyse([{ type: 'call', side: -1, K: 100, premium: 5, qty: 1 }], 100).maxLoss === -Infinity);
t('OPT-13', 'Iron condor: credit = max gain, wings bound the loss', () => { const legs = [{ type: 'put', side: 1, K: 80, premium: 1, qty: 1 }, { type: 'put', side: -1, K: 90, premium: 3, qty: 1 }, { type: 'call', side: -1, K: 110, premium: 3, qty: 1 }, { type: 'call', side: 1, K: 120, premium: 1, qty: 1 }]; const a = IA.opt.analyse(legs, 100); return all(near(a.maxGain, 4), near(a.maxLoss, -6), a.breakevens.length === 2 || a.breakevens); });
t('OPT-14', 'Long put max gain = K − premium at S=0', () => near(IA.opt.analyse([{ type: 'put', side: 1, K: 100, premium: 5, qty: 1 }], 100).maxGain, 95));

// ---------- Generator ----------
t('GEN-00', 'Realism: median |daily open→close move| within 0.3–2.5 × configured daily vol (Nifty preset, 200 days)', () => { const c = IA.gen.generate({ preset: 'NIFTY', seed: 99, days: 200, tfMin: 375 }).candles; const m = c.map((b) => Math.abs(b.c / b.o - 1)).sort((a, b) => a - b)[100] / 0.009; return (m > 0.3 && m < 2.5) || m; });
t('GEN-00b', 'Realism: 200-day drift stays within ±40% (no runaway trend)', () => { const c = IA.gen.generate({ preset: 'NIFTY', seed: 99, days: 200, tfMin: 375 }).candles; const d = c[c.length - 1].c / c[0].o - 1; return Math.abs(d) < 0.4 || d; });
t('GEN-01', 'Same seed → identical data (reproducible)', () => JSON.stringify(IA.gen.generate({ seed: 5, days: 2 }).candles) === JSON.stringify(IA.gen.generate({ seed: 5, days: 2 }).candles));
t('GEN-02', 'OHLC consistency h ≥ max(o,c), l ≤ min(o,c), v ≥ 0', () => { const c = IA.gen.generate({ seed: 9, days: 5, tfMin: 1 }).candles; return c.every((b) => b.h >= Math.max(b.o, b.c) - 1e-9 && b.l <= Math.min(b.o, b.c) + 1e-9 && b.v >= 0) || 'violation'; });
t('GEN-03', '5-min aggregation: 375-min session → 75 bars/day', () => { const g = IA.gen.generate({ seed: 1, days: 2, tfMin: 5 }); return g.candles.length === 150 || g.candles.length; });
t('GEN-04', 'Weekends skipped for exchange sessions', () => { const c = IA.gen.generate({ seed: 1, days: 6, tfMin: 375, startDate: '2026-01-05' }).candles; return c.every((b) => ![0, 6].includes(new Date(b.d).getUTCDay())) || c.map((b) => b.d); });
t('GEN-05', 'Prices rounded to tick', () => IA.gen.generate({ preset: 'RELIANCE', seed: 3, days: 1 }).candles.every((b) => Math.abs(b.c / 0.1 - Math.round(b.c / 0.1)) < 1e-6));
t('GEN-06', 'Heikin-Ashi close = (o+h+l+c)/4', () => { const ha = IA.gen.heikinAshi([{ o: 1, h: 4, l: 0, c: 3 }]); return near(ha[0].c, 2); });
t('GEN-07', 'Renko bricks are exact box size', () => IA.gen.renko(bars([100, 103.5, 106.2, 99]), 2).every((b) => near(Math.abs(b.c - b.o), 2) === true));
t('GEN-08', 'All 10 decision scenarios generate history + future', () => Object.keys(IA.gen.SCENARIOS).every((k) => { const s = IA.gen.scenario(k, 3); return s.history.length > 10 && s.future.length === 16; }));

// ---------- Backtester ----------
t('BT-01', 'No look-ahead: entry fills at NEXT bar open + slippage', () => {
  const g = IA.gen.generate({ seed: 21, days: 10, tfMin: 5 });
  const r = IA.bt.run(g.candles, { entry: [{ id: 'ema_cross' }], slippageTicks: 2, tick: 0.05 });
  const sig = IA.bt.SIGNALS.ema_cross.fn(g.candles, IA.bt.SIGNALS.ema_cross.params, 1);
  return r.trades.length > 0 && r.trades.every((tr) => sig[tr.entryI - 1] === true && Math.abs(tr.entry - (g.candles[tr.entryI].o + 0.1)) < 1e-9) || 'entry not at next open';
});
t('BT-02', 'No position is carried overnight', () => { const r = IA.bt.run(IA.gen.generate({ seed: 4, days: 10 }).candles, { entry: [{ id: 'vwap_reclaim' }] }); return r.trades.every((tr) => tr.day === new Date(tr.entryT).toISOString().slice(0, 10)) || 'overnight'; });
t('BT-03', 'Equity = capital + Σ net P&L', () => { const r = IA.bt.run(IA.gen.generate({ seed: 8, days: 15 }).candles, { entry: [{ id: 'orb' }] }); return near(r.stats.finalEquity, 100000 + r.trades.reduce((a, b) => a + b.net, 0), 1e-6); });
t('BT-04', 'Costs reduce P&L (net < gross)', () => { const r = IA.bt.run(IA.gen.generate({ seed: 8, days: 15 }).candles, { entry: [{ id: 'orb' }], costBps: 5 }); return r.trades.every((x) => x.net < x.gross) || 'cost'; });
t('BT-05', 'Short side works', () => { const r = IA.bt.run(IA.gen.generate({ seed: 12, days: 15 }).candles, { side: -1, entry: [{ id: 'pdh_break' }] }); return r.trades.every((x) => x.side === 'short') || 'side'; });
t('BT-06', 'Stop-loss loss ≈ −1R before costs/slippage', () => { const r = IA.bt.run(IA.gen.generate({ seed: 31, days: 20 }).candles, { entry: [{ id: 'ema_cross' }], slippageTicks: 0, costBps: 0 }); const st = r.trades.filter((x) => x.why === 'stop'); return st.length > 0 && st.every((x) => near(x.R, -1, 1e-6) === true) || st.map((x) => x.R).slice(0, 3); });
t('BT-07', 'Every signal combination in catalogue runs without error', () => Object.keys(IA.bt.SIGNALS).every((k) => !IA.bt.run(IA.gen.generate({ seed: 2, days: 6 }).candles, { entry: [{ id: k }] }).error));
t('BT-08', 'Too few bars rejected', () => !!IA.bt.run(IA.gen.generate({ days: 1, tfMin: 60 }).candles, {}).error);
t('BT-09', 'Monte Carlo percentiles ordered p5 ≤ p50 ≤ p95', () => { const m = IA.bt.monteCarlo([100, -50, 80, -60, 30, -20, 120, -90]); return m.finals.p5 <= m.finals.p50 && m.finals.p50 <= m.finals.p95; });
t('BT-10', 'Risk-of-ruin sim: negative edge ≈ 1, strong edge ≈ 0', () => { const a = IA.bt.riskOfRuinSim({ winRate: 0.35, payoff: 1, riskPct: 2, paths: 1000 }).ror, b = IA.bt.riskOfRuinSim({ winRate: 0.55, payoff: 2, riskPct: 1, paths: 1000 }).ror; return a > 0.9 && b < 0.01 || [a, b]; });

// ---------- Clock (DST) ----------
t('CLK-01', 'NYSE open 2026-07-01 = 13:30 UTC (EDT)', () => IA.clock.zonedToUtc('2026-07-01', '09:30', 'America/New_York').toISOString() === '2026-07-01T13:30:00.000Z' || IA.clock.zonedToUtc('2026-07-01', '09:30', 'America/New_York').toISOString());
t('CLK-02', 'NYSE open 2026-12-01 = 14:30 UTC (EST)', () => IA.clock.zonedToUtc('2026-12-01', '09:30', 'America/New_York').toISOString() === '2026-12-01T14:30:00.000Z');
t('CLK-03', 'NSE open = 03:45 UTC year-round (no DST in India)', () => ['2026-01-15', '2026-07-15'].every((d) => IA.clock.zonedToUtc(d, '09:15', 'Asia/Kolkata').toISOString() === d + 'T03:45:00.000Z'));
t('CLK-04', 'London open in BST (Jul) = 07:00 UTC, GMT (Jan) = 08:00 UTC', () => IA.clock.zonedToUtc('2026-07-01', '08:00', 'Europe/London').getUTCHours() === 7 && IA.clock.zonedToUtc('2026-01-05', '08:00', 'Europe/London').getUTCHours() === 8);
t('CLK-05', 'Sydney DST (Jan) open 10:00 = 23:00 UTC previous day', () => IA.clock.zonedToUtc('2026-01-06', '10:00', 'Australia/Sydney').toISOString() === '2026-01-05T23:00:00.000Z');
t('CLK-06', 'Session status: NSE open at 10:00 IST on a Wednesday', () => IA.clock.sessionStatus(IA.specsDefault.sessions[0], new Date('2026-11-04T04:30:00Z')).state === 'open');
t('CLK-07', 'Session status: weekend closed', () => IA.clock.sessionStatus(IA.specsDefault.sessions[0], new Date('2026-11-07T05:00:00Z')).label === 'Weekend');
t('CLK-08', 'Tokyo lunch break detected', () => IA.clock.sessionStatus(IA.specsDefault.sessions.find((s) => s.id === 'TSE'), new Date('2026-11-04T03:00:00Z')).state === 'break');
t('CLK-09', 'Holiday list respected', () => IA.clock.sessionStatus(IA.specsDefault.sessions[0], new Date('2026-11-04T04:30:00Z'), ['2026-11-04']).label === 'Holiday');

// ---------- Execution (paper trading / replay) ----------
const ins = { lot: 1, tick: 0.05, cur: 'INR', seg: 'bps', bps: 0, spreadTicks: 0 }; const zero = () => 0;
const B = (o, h, l, c, v = 1e6, t = 1) => ({ o, h, l, c, v, t });
t('EXE-01', 'Market order fills at NEXT bar open (no look-ahead)', () => { const a = IA.exec.newAccount(1e5); IA.exec.place(a, { side: 1, qty: 10, type: 'market' }); IA.exec.processBar(a, B(100, 101, 99, 100.5), ins, zero); return all(a.pos.qty === 10 || a.pos.qty, near(a.pos.avg, 100)); });
t('EXE-02', 'Half-spread + slippage worsen the fill', () => { const a = IA.exec.newAccount(1e5); IA.exec.place(a, { side: 1, qty: 1, type: 'market' }); IA.exec.processBar(a, B(100, 101, 99, 100), { ...ins, spreadTicks: 2 }, () => 0.99, { slipTicks: 1 }); return near(a.pos.avg, 100 + 0.05 + 0.05); });
t('EXE-03', 'Stop gapped through fills at the open, not the stop', () => { const a = IA.exec.newAccount(1e5); IA.exec.place(a, { side: 1, qty: 10, type: 'market', stop: 98, target: 105 }); IA.exec.processBar(a, B(100, 100.5, 99.5, 100), ins, zero); IA.exec.processBar(a, B(96, 97, 95, 96.5), ins, zero); const tr = a.trades[0]; return all(near(tr.exit, 96), tr.why === 'stop-loss' || tr.why, near(tr.gross, -40)); });
t('EXE-04', 'Stop and target in same bar → stop assumed first', () => { const a = IA.exec.newAccount(1e5); IA.exec.place(a, { side: 1, qty: 1, type: 'market', stop: 99, target: 101 }); IA.exec.processBar(a, B(100, 100.2, 99.8, 100), ins, zero); IA.exec.processBar(a, B(100, 102, 98, 100), ins, zero); return a.trades[0].why === 'stop-loss' && a.pos.qty === 0; });
t('EXE-05', 'Target fill cancels the OCO stop', () => { const a = IA.exec.newAccount(1e5); IA.exec.place(a, { side: 1, qty: 1, type: 'market', stop: 99, target: 101 }); IA.exec.processBar(a, B(100, 100.2, 99.8, 100), ins, zero); IA.exec.processBar(a, B(100.5, 101.5, 100.4, 101.2), ins, zero); const st = a.orders.find((o) => o.parent && o.type === 'stop'); return a.trades[0].why === 'target' && st.status === 'cancelled'; });
t('EXE-06', 'Liquidity cap produces partial fills', () => { const a = IA.exec.newAccount(1e7); const o = IA.exec.place(a, { side: 1, qty: 500, type: 'market' }); IA.exec.processBar(a, B(100, 101, 99, 100, 2000), ins, zero, { liquidityPct: 0.1 }); return o.status === 'partial' && o.filled === 200 || [o.status, o.filled]; });
t('EXE-07', 'Short trade P&L sign correct', () => { const a = IA.exec.newAccount(1e5); IA.exec.place(a, { side: -1, qty: 10, type: 'market' }); IA.exec.processBar(a, B(100, 100, 100, 100), ins, zero); IA.exec.place(a, { side: 1, qty: 10, type: 'market' }); IA.exec.processBar(a, B(95, 95, 95, 95), ins, zero); return near(a.trades[0].gross, 50); });
t('EXE-08', 'Limit buy fills at better open on a gap down', () => { const a = IA.exec.newAccount(1e5); IA.exec.place(a, { side: 1, qty: 1, type: 'limit', price: 99 }); IA.exec.processBar(a, B(97, 98, 96, 97.5), ins, zero); return near(a.pos.avg, 97); });
t('EXE-09', 'End-of-day square-off closes position and cancels orders', () => { const a = IA.exec.newAccount(1e5); IA.exec.place(a, { side: 1, qty: 5, type: 'market', stop: 90 }); IA.exec.processBar(a, B(100, 100, 100, 100), ins, zero); IA.exec.squareOff(a, B(101, 101, 101, 101), ins); return a.pos.qty === 0 && a.orders.every((o) => o.status !== 'open') && near(a.trades[0].gross, 5) === true; });
t('EXE-10', 'India futures charges applied on close (cash = start + gross − charges)', () => { const a = IA.exec.newAccount(1e6); const f = IA.exec.INSTR.NIFTY; IA.exec.place(a, { side: 1, qty: 65, type: 'market' }); IA.exec.processBar(a, B(25800, 25800, 25800, 25800), { ...f, spreadTicks: 0 }, zero); IA.exec.place(a, { side: -1, qty: 65, type: 'market' }); IA.exec.processBar(a, B(25820, 25820, 25820, 25820), { ...f, spreadTicks: 0 }, zero); const exp = IA.risk.indiaCharges({ segment: 'futures', buyValue: 25800 * 65, sellValue: 25820 * 65 }).total; return all(near(a.trades[0].gross, 1300), near(a.charges, exp), near(a.cash, 1e6 + 1300 - exp)); });


// ---- Phase 2 additions ----
t('RSK-26', 'Streak probability: k=1 equals 1 − (1−q)^n', () => near(IA.risk.streakProb(10, 1, 0.5).p, 1 - 0.5 ** 10));
t('RSK-27', 'Streak probability: n=k equals q^k', () => near(IA.risk.streakProb(5, 5, 0.6).p, 0.6 ** 5));
t('RSK-28', 'Streak probability matches brute-force enumeration (n=12, k=3, q=0.55)', () => { let tot = 0; for (let m = 0; m < 1 << 12; m++) { let run = 0, hit = false, p = 1; for (let b = 0; b < 12; b++) { const L = (m >> b) & 1; p *= L ? 0.55 : 0.45; run = L ? run + 1 : 0; if (run >= 3) hit = true; } if (hit) tot += p; } return near(IA.risk.streakProb(12, 3, 0.55).p, tot, 1e-12); });
t('RSK-29', 'Options scenario: long call at unchanged spot/IV after 0 days ≈ 0 P&L; spot up helps', () => { const S = 25800, legs = [{ type: 'call', side: 1, K: 25800, qty: 65, premium: IA.opt.bs({ S, K: 25800, T: 7 / 365, r: 0.065, sigma: 0.13, type: 'call' }).price }]; const g = IA.risk.optionsScenario(legs, { S, ivPct: 13, days: 7 }); const row0 = g.grid.find((x) => x.dv === 0).row; return Math.abs(row0.find((c) => c.ds === 0).pnl) < 1e-6 && row0.find((c) => c.ds === 2).pnl > 0 && row0.find((c) => c.ds === -2).pnl < 0; });
t('RSK-30', 'Options scenario: short straddle loses on large moves and on IV rise', () => { const S = 25800, pr = (type) => IA.opt.bs({ S, K: S, T: 7 / 365, r: 0.065, sigma: 0.13, type }).price; const legs = [{ type: 'call', side: -1, K: S, qty: 65, premium: pr('call') }, { type: 'put', side: -1, K: S, qty: 65, premium: pr('put') }]; const g = IA.risk.optionsScenario(legs, { S, ivPct: 13, days: 7 }); const r0 = g.grid.find((x) => x.dv === 0).row, r10 = g.grid.find((x) => x.dv === 10).row; return r0.find((c) => c.ds === 5).pnl < 0 && r0.find((c) => c.ds === -5).pnl < 0 && r10.find((c) => c.ds === 0).pnl < 0; });

t('SPC-01', 'Verified NSE 2026 holidays present (16 dates incl. 26 Jan and 2 Oct); clock reports Holiday on 24 Nov 2026', () => { const H = IA.specsDefault.holidays.NSE; return H.length === 16 && H.includes('2026-01-26') && H.includes('2026-10-02') && IA.clock.sessionStatus(IA.specsDefault.sessions[0], new Date('2026-11-24T05:00:00Z'), H).label === 'Holiday' || H; });
t('SPC-02', 'NSE index-futures tick by level: 14,000→0.05, 25,800→0.10, 57,500→0.20', () => IA.risk.indexFutTick(14000) === 0.05 && IA.risk.indexFutTick(25800) === 0.1 && IA.risk.indexFutTick(57500) === 0.2);
t('SPC-03', 'FINRA TAF: $0 for trades in Oct–Dec 2026, standard rate from 1 Jan 2027', () => IA.risk.usCharges({ shares: 1000, buyPrice: 10, sellPrice: 10, date: '2026-11-04' }).taf === 0 && near(IA.risk.usCharges({ shares: 1000, buyPrice: 10, sellPrice: 10, date: '2027-01-04' }).taf, 0.195) === true);
t('SPC-04', 'NSE sessions: post-close 15:50–16:00, closing auction 15:15–15:35; SGX has no lunch break', () => { const n = IA.specsDefault.sessions.find((x) => x.id === 'NSE'), g = IA.specsDefault.sessions.find((x) => x.id === 'SGX'); return n.post.join() === '15:50,16:00' && n.auction.join() === '15:15,15:35' && g.main.length === 1; });
t('SPC-05', 'Every holiday list is keyed to an existing session id', () => Object.keys(IA.specsDefault.holidays).every((k) => IA.specsDefault.sessions.some((s) => s.id === k) || k === 'NASDAQ') || Object.keys(IA.specsDefault.holidays));

module.exports = { results, pass, fail };
if (require.main === module) {
  results.forEach((r) => console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.id} ${r.name}${r.ok ? '' : ' → ' + r.detail}`));
  console.log(`\n${pass} passed, ${fail} failed, ${pass + fail} total`);
  process.exit(fail ? 1 : 0);
}
