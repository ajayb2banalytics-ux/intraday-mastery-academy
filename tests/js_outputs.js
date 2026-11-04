/* Emits the app engines' outputs for the cross-check data set (used by tests/crosscheck.py). */
const path = require('path'), fs = require('fs');
['specs', 'indicators', 'risk', 'options', 'marketgen', 'backtest', 'clock'].forEach((f) => require(path.join(__dirname, '..', 'js', 'engines', f + '.js')));
const IA = globalThis.IA; const D = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const c = D.o.map((_, i) => ({ o: D.o[i], h: D.h[i], l: D.l[i], c: D.c[i], v: D.v[i], d: D.d[i], t: i * 3e5 })); const cl = D.c;
const I = IA.ind, out = {};
out.sma20 = I.sma(cl, 20); out.ema20 = I.ema(cl, 20); out.wma10 = I.wma(cl, 10); out.vwma20 = I.vwma(c, 20); out.rsi14 = I.rsi(cl, 14); out.atr14 = I.atr(c, 14);
const m = I.macd(cl); out.macd = m.line; out.macds = m.signal; out.macdh = m.hist;
const bb = I.bollinger(cl, 20, 2); out.bbu = bb.upper; out.bbl = bb.lower; out.bbm = bb.mid;
const st = I.stochastic(c, 14, 3); out.stk = st.k; out.std = st.d; out.cci20 = I.cci(c, 20); out.wr14 = I.williamsR(c, 14); out.mfi14 = I.mfi(c, 14); out.obv = I.obv(c); out.cmf20 = I.cmf(c, 20); out.adl = I.adl(c);
const a = I.adx(c, 14); out.adx = a.adx; out.pdi = a.pdi; out.ndi = a.ndi; out.vwap = I.vwap(c); const dc = I.donchian(c, 20); out.dcu = dc.upper; out.dcl = dc.lower;
const kc = I.keltner(c, 20, 2, 10); out.kcu = kc.upper; out.kcl = kc.lower; out.psar = I.psar(c); out.roc10 = I.roc(cl, 10); out.mom10 = I.momentum(cl, 10);
const sr = I.stochRsi(cl); out.srk = sr.k; const ich = I.ichimoku(c); out.tenkan = ich.tenkan; out.kijun = ich.kijun; out.spanB = ich.spanB;
const stt = I.supertrend(c, 10, 3); out.st = stt.line; out.stdir = stt.dir;
// options
out.bs = D.bs.map((x) => { const r = IA.opt.bs(x); return [r.price, r.delta, r.gamma, r.theta, r.vega, r.rho]; });
out.iv = D.bs.slice(0, 40).map((x) => IA.opt.impliedVol({ ...x, price: IA.opt.bs(x).price }));
// risk & money
out.pos = D.pos.map((x) => { const r = IA.risk.positionSize(x); return r.error ? null : [r.units, r.actualRisk]; });
out.charges = D.chg.map((x) => IA.risk.indiaCharges(x).total);
out.exp = D.exp.map((x) => { const r = IA.risk.expectancy(x); return [r.ev, r.profitFactor]; });
out.dd = D.eq.map((e) => { const r = IA.risk.maxDrawdown(e); return [r.maxDD, r.maxDDPct]; });
out.streak = D.streak.map(([n, k, q]) => IA.risk.streakProb(n, k, q).p);
out.payoff = D.pay.map((p) => { const a = IA.opt.analyse(p.legs, p.S); return [a.maxGain === Infinity ? 1e99 : a.maxGain, a.maxLoss === -Infinity ? -1e99 : a.maxLoss, a.breakevens]; });
out.kelly = D.kelly.map(([w, b]) => IA.risk.kelly({ winRate: w, payoff: b }).full);
out.comp = D.comp.map((x) => IA.risk.compounding(x).final);
out.fut = D.fut.map((x) => { const r = IA.risk.futuresExposure(x); return [r.notional, r.margin]; });
process.stdout.write(JSON.stringify(out));
