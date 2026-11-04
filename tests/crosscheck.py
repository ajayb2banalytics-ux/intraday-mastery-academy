"""Independent calculation validation.
Compares the app's JavaScript engines with (a) independent Python implementations written from the published
definitions (numpy/pandas), (b) the third-party open-source `ta` library and (c) SciPy's normal distribution,
on randomised inputs. Writes tests/crosscheck-results.json. Run: python3 tests/crosscheck.py"""
import json, os, subprocess, math, random, tempfile
import numpy as np, pandas as pd
from scipy.stats import norm
import ta
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rng = np.random.default_rng(2026); N = 900
ret = rng.normal(0, 0.004, N); c = 1000 * np.exp(np.cumsum(ret)); o = np.r_[1000, c[:-1]] * (1 + rng.normal(0, 0.001, N))
h = np.maximum(o, c) * (1 + np.abs(rng.normal(0, 0.002, N))); l = np.minimum(o, c) * (1 - np.abs(rng.normal(0, 0.002, N))); v = rng.integers(1000, 50000, N).astype(float)
days = [f'2026-01-{5 + i // 75:02d}' for i in range(N)]
R = random.Random(9)
bs = [dict(S=R.uniform(50, 30000), K=0, T=R.uniform(1 / 365, 1), r=R.uniform(0, 0.08), sigma=R.uniform(0.05, 0.8), type=R.choice(['call', 'put'])) for _ in range(300)]
for x in bs: x['K'] = x['S'] * R.uniform(0.8, 1.2)
pos = [dict(capital=R.uniform(1e4, 1e7), riskPct=R.uniform(0.1, 3), entry=R.uniform(10, 30000), stop=0, lot=R.choice([1, 1, 30, 65, 75]), leverage=R.choice([1, 5, 8])) for _ in range(300)]
for p in pos: p['stop'] = p['entry'] * (1 + R.choice([-1, 1]) * R.uniform(0.001, 0.05))
chg = [dict(segment=R.choice(['eqIntraday', 'eqDelivery', 'futures', 'options']), buyValue=R.uniform(0, 5e6), sellValue=R.uniform(0, 5e6)) for _ in range(300)]
exp = [dict(winRate=R.uniform(0.05, 0.95), avgWin=R.uniform(1, 5000), avgLoss=R.uniform(1, 5000)) for _ in range(200)]
eq = [list(np.cumsum(rng.normal(5, 100, 200)) + 10000) for _ in range(100)]
streak = [(R.randint(5, 300), R.randint(2, 12), R.uniform(0.3, 0.7)) for _ in range(40)]
kelly = [(R.uniform(0.2, 0.8), R.uniform(0.5, 3)) for _ in range(100)]
comp = [dict(start=R.uniform(1e3, 1e6), ratePct=R.uniform(-5, 10), periods=R.randint(0, 60), contribution=R.uniform(0, 1e4)) for _ in range(100)]
fut = [dict(price=R.uniform(100, 60000), lotSize=R.choice([30, 65, 120, 20]), lots=R.randint(1, 10), marginPct=R.uniform(8, 20)) for _ in range(100)]
def bsprice(S, K, T, r, s, t):
    d1 = (math.log(S / K) + (r + s * s / 2) * T) / (s * math.sqrt(T)); d2 = d1 - s * math.sqrt(T)
    return S * norm.cdf(d1) - K * math.exp(-r * T) * norm.cdf(d2) if t == 'call' else K * math.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
pay = []
for _ in range(60):
    S = R.uniform(100, 30000); tpl = R.choice(['bull', 'bear', 'condor', 'fly', 'strangle', 'longcall', 'shortput']); w = S * R.uniform(0.01, 0.05)
    P = lambda t, K: bsprice(S, K, 7 / 365, 0.065, 0.15, t)
    legs = {'bull': [('call', 1, S), ('call', -1, S + w)], 'bear': [('put', 1, S), ('put', -1, S - w)], 'condor': [('put', 1, S - 2 * w), ('put', -1, S - w), ('call', -1, S + w), ('call', 1, S + 2 * w)], 'fly': [('call', 1, S - w), ('call', -2, S), ('call', 1, S + w)], 'strangle': [('call', 1, S + w), ('put', 1, S - w)], 'longcall': [('call', 1, S)], 'shortput': [('put', -1, S)]}[tpl]
    pay.append(dict(S=S, legs=[dict(type=t, side=1 if s > 0 else -1, K=K, qty=abs(s), premium=P(t, K)) for t, s, K in legs]))
D = dict(o=o.tolist(), h=h.tolist(), l=l.tolist(), c=c.tolist(), v=v.tolist(), d=days, bs=bs, pos=pos, chg=chg, exp=exp, eq=eq, streak=streak, pay=pay, kelly=kelly, comp=comp, fut=fut)
tmp = tempfile.NamedTemporaryFile('w', suffix='.json', delete=False); json.dump(D, tmp); tmp.close()
J = json.loads(subprocess.check_output(['node', os.path.join(ROOT, 'tests', 'js_outputs.js'), tmp.name]))
arr = lambda k: np.array([np.nan if x is None else x for x in J[k]], dtype=float)
C, H, L, O, V = pd.Series(c), pd.Series(h), pd.Series(l), pd.Series(o), pd.Series(v)
RES = []
def cmp(id, what, js, ref, refname, start=0, tol=1e-9, note=''):
    js = np.asarray(js, float)[start:]; ref = np.asarray(ref, float)[start:]; mask = ~(np.isnan(js) | np.isnan(ref))
    nan_mismatch = int(np.sum(np.isnan(js) != np.isnan(ref)))
    if mask.sum() == 0: RES.append(dict(id=id, what=what, ref=refname, n=0, ok=False, maxAbs=None, maxRel=None, tol=tol, note='no comparable values')); return
    d = np.abs(js[mask] - ref[mask]); rel = d / np.maximum(1e-12, np.abs(ref[mask]))
    ok = bool(np.max(np.minimum(d, rel)) <= tol and nan_mismatch == 0)
    RES.append(dict(id=id, what=what, ref=refname, n=int(mask.sum()), ok=ok, maxAbs=float(d.max()), maxRel=float(rel.max()), tol=tol, note=note + (f' NaN-position mismatches: {nan_mismatch}' if nan_mismatch else '')))
# ---------- (a) independent implementations from definitions ----------
def wilder(x, n):
    x = np.asarray(x, float); out = np.full(len(x), np.nan); first = np.where(~np.isnan(x))[0][0]
    out[first + n - 1] = np.nanmean(x[first:first + n])
    for i in range(first + n, len(x)): out[i] = (out[i - 1] * (n - 1) + x[i]) / n
    return out
def ema_sma_seed(x, n):
    x = np.asarray(x, float); out = np.full(len(x), np.nan); idx = np.where(~np.isnan(x))[0]; f = idx[0]; k = 2 / (n + 1)
    out[f + n - 1] = x[f:f + n].mean()
    for i in range(f + n, len(x)): out[i] = x[i] * k + out[i - 1] * (1 - k)
    return out
cmp('XC-01', 'SMA(20)', arr('sma20'), C.rolling(20).mean(), 'pandas rolling mean')
cmp('XC-02', 'EMA(20), SMA-seeded', arr('ema20'), ema_sma_seed(c, 20), 'definition (Python)')
w = np.arange(1, 11); cmp('XC-03', 'WMA(10)', arr('wma10'), C.rolling(10).apply(lambda s: (s * w).sum() / w.sum(), raw=True), 'definition (Python)')
cmp('XC-04', 'VWMA(20)', arr('vwma20'), (C * V).rolling(20).sum() / V.rolling(20).sum(), 'definition (Python)')
dlt = np.diff(c, prepend=np.nan); g = wilder(np.where(np.isnan(dlt), np.nan, np.maximum(dlt, 0)), 14); ls = wilder(np.where(np.isnan(dlt), np.nan, np.maximum(-dlt, 0)), 14)
cmp('XC-05', 'RSI(14) Wilder', arr('rsi14'), 100 - 100 / (1 + g / ls), 'Wilder definition (Python)')
tr = np.maximum(h - l, np.maximum(np.abs(h - np.r_[np.nan, c[:-1]]), np.abs(l - np.r_[np.nan, c[:-1]]))); tr[0] = h[0] - l[0]
cmp('XC-06', 'ATR(14) Wilder', arr('atr14'), wilder(tr, 14), 'Wilder definition (Python)')
e12, e26 = ema_sma_seed(c, 12), ema_sma_seed(c, 26); mline = e12 - e26; msig = ema_sma_seed(mline, 9)
cmp('XC-07', 'MACD line', arr('macd'), mline, 'definition (Python)'); cmp('XC-08', 'MACD signal', arr('macds'), msig, 'definition (Python)')
sd = C.rolling(20).std(ddof=0); cmp('XC-09', 'Bollinger upper (20,2, population SD)', arr('bbu'), C.rolling(20).mean() + 2 * sd, 'definition (Python)')
k_raw = 100 * (C - L.rolling(14).min()) / (H.rolling(14).max() - L.rolling(14).min()); cmp('XC-10', 'Stochastic %K(14)', arr('stk'), k_raw, 'Lane definition (Python)'); cmp('XC-11', 'Stochastic %D(3)', arr('std'), k_raw.rolling(3).mean(), 'definition (Python)')
tp = (H + L + C) / 3; md = tp.rolling(20).apply(lambda s: np.mean(np.abs(s - s.mean())), raw=True); cmp('XC-12', 'CCI(20)', arr('cci20'), (tp - tp.rolling(20).mean()) / (0.015 * md), 'Lambert definition (Python)')
cmp('XC-13', 'Williams %R(14)', arr('wr14'), -100 * (H.rolling(14).max() - C) / (H.rolling(14).max() - L.rolling(14).min()), 'definition (Python)')
rmf = tp * V; pos_ = rmf.where(tp > tp.shift(1), 0.0); neg_ = rmf.where(tp < tp.shift(1), 0.0); mfi = 100 - 100 / (1 + pos_.rolling(14).sum() / neg_.rolling(14).sum()); mfi.iloc[:14] = np.nan
cmp('XC-14', 'MFI(14)', arr('mfi14'), mfi, 'definition (Python)')
cmp('XC-15', 'OBV', arr('obv'), np.r_[0, np.cumsum(np.sign(np.diff(c)) * v[1:])], 'Granville definition (Python)')
mfm = ((C - L) - (H - C)) / (H - L); cmp('XC-16', 'Chaikin Money Flow(20)', arr('cmf20'), (mfm * V).rolling(20).sum() / V.rolling(20).sum(), 'definition (Python)'); cmp('XC-17', 'Accumulation/Distribution', arr('adl'), (mfm * V).cumsum(), 'definition (Python)')
up = np.r_[np.nan, h[1:] - h[:-1]]; dn = np.r_[np.nan, l[:-1] - l[1:]]; pdm = np.where((up > dn) & (up > 0), up, 0.0); ndm = np.where((dn > up) & (dn > 0), dn, 0.0); pdm[0] = np.nan; ndm[0] = np.nan; tr2 = tr.copy(); tr2[0] = np.nan
str_, sp, sn = wilder(tr2, 14), wilder(pdm, 14), wilder(ndm, 14); pdi = 100 * sp / str_; ndi = 100 * sn / str_; dx = 100 * np.abs(pdi - ndi) / (pdi + ndi)
cmp('XC-18', '+DI(14)', arr('pdi'), pdi, 'Wilder definition (Python)'); cmp('XC-19', 'ADX(14)', arr('adx'), wilder(dx, 14), 'Wilder definition (Python)')
df = pd.DataFrame(dict(tp=tp, v=V, d=days)); df['pv'] = df.tp * df.v; vw = df.groupby('d').pv.cumsum() / df.groupby('d').v.cumsum(); cmp('XC-20', 'Session VWAP (resets daily)', arr('vwap'), vw, 'definition (Python)')
cmp('XC-21', 'Donchian upper(20)', arr('dcu'), H.rolling(20).max(), 'definition (Python)')
cmp('XC-22', 'Keltner upper (EMA20 + 2×ATR10)', arr('kcu'), ema_sma_seed(c, 20) + 2 * wilder(tr, 10), 'Raschke/modern definition (Python)')
cmp('XC-23', 'ROC(10)', arr('roc10'), 100 * (C / C.shift(10) - 1), 'definition (Python)'); cmp('XC-24', 'Momentum(10)', arr('mom10'), C - C.shift(10), 'definition (Python)')
cmp('XC-25', 'Ichimoku Tenkan(9)', arr('tenkan'), (H.rolling(9).max() + L.rolling(9).min()) / 2, 'Hosoda definition (Python)'); cmp('XC-26', 'Ichimoku Senkou B(52, unshifted)', arr('spanB'), (H.rolling(52).max() + L.rolling(52).min()) / 2, 'Hosoda definition (Python)')
# ---------- (b) third-party library `ta` (convention differences explained in notes) ----------
cmp('XC-30', 'RSI(14) vs ta', arr('rsi14'), ta.momentum.RSIIndicator(C, 14).rsi(), 'ta library', start=300, tol=1e-6, note='ta seeds Wilder smoothing from the first value; identical after warm-up (compared from bar 300).')
cmp('XC-31', 'ATR(14) vs ta', arr('atr14'), ta.volatility.AverageTrueRange(H, L, C, 14).average_true_range().replace(0, np.nan), 'ta library', start=300, tol=1e-6, note='Seeding differs; compared after warm-up.')
cmp('XC-32', 'Bollinger upper vs ta', arr('bbu'), ta.volatility.BollingerBands(C, 20, 2).bollinger_hband(), 'ta library', start=20, tol=1e-9, note='Both use population SD (ddof=0).')
cmp('XC-33', 'MACD vs ta', arr('macd'), ta.trend.MACD(C).macd(), 'ta library', start=300, tol=1e-6, note='ta seeds EMA with the first value; converges after warm-up.')
cmp('XC-34', 'Williams %R vs ta', arr('wr14'), ta.momentum.WilliamsRIndicator(H, L, C, 14).williams_r(), 'ta library', start=14, tol=1e-9)
cmp('XC-35', 'CCI vs ta', arr('cci20'), ta.trend.CCIIndicator(H, L, C, 20).cci(), 'ta library', start=20, tol=1e-9)
cmp('XC-36', 'OBV bar-to-bar change vs ta', np.diff(arr('obv')), np.diff(ta.volume.OnBalanceVolumeIndicator(C, V).on_balance_volume().to_numpy()), 'ta library', tol=1e-9, note='Starting value differs by convention (app starts at 0); increments compared.')
cmp('XC-37', 'CMF vs ta', arr('cmf20'), ta.volume.ChaikinMoneyFlowIndicator(H, L, C, V, 20).chaikin_money_flow(), 'ta library', start=20, tol=1e-9)
cmp('XC-38', 'ADX vs ta', arr('adx'), ta.trend.ADXIndicator(H, L, C, 14).adx().replace(0, np.nan), 'ta library', start=300, tol=1e-6, note='ta seeds with a sum rather than a mean; converges after warm-up.')
cmp('XC-39', 'Stochastic %K vs ta', arr('stk'), ta.momentum.StochasticOscillator(H, L, C, 14, 3).stoch(), 'ta library', start=14, tol=1e-9)
cmp('XC-40', 'MFI vs ta', arr('mfi14'), ta.volume.MFIIndicator(H, L, C, V, 14).money_flow_index(), 'ta library', start=14, tol=1e-6)
def wilder_psar(h, l, c, step=0.02, mx=0.2):
    # Independent implementation of Wilder (1978): SAR(t+1) = SAR + AF*(EP - SAR), never inside the prior two bars' range; reversal when price penetrates that SAR.
    out = [np.nan]; up = c[1] >= c[0]; af = step; ep = h[0] if up else l[0]; sar = l[0] if up else h[0]
    for i in range(1, len(c)):
        sar = sar + af * (ep - sar)
        if up:
            sar = min(sar, l[i - 1], l[i - 2] if i > 1 else l[i - 1])
            if l[i] < sar: up = False; sar = ep; ep = l[i]; af = step
            elif h[i] > ep: ep = h[i]; af = min(af + step, mx)
        else:
            sar = max(sar, h[i - 1], h[i - 2] if i > 1 else h[i - 1])
            if h[i] > sar: up = True; sar = ep; ep = h[i]; af = step
            elif l[i] < ep: ep = l[i]; af = min(af + step, mx)
        out.append(sar)
    return np.array(out)
cmp('XC-41a', 'Parabolic SAR (Wilder rules)', arr('psar'), wilder_psar(h, l, c), 'independent Wilder implementation (Python)')
INFO = True
cmp('XC-41', 'Parabolic SAR vs ta (informational)', arr('psar'), ta.trend.PSARIndicator(H, L, C, 0.02, 0.2).psar(), 'ta library', start=50, tol=1e-6, note='CONVENTION DIFFERENCE, not an error: ta checks for reversal BEFORE applying Wilder\'s "not inside the prior two bars" rule and picks low[i-2] before low[i-1]; the app follows Wilder (validated in XC-41a).')
RES[-1]['info'] = True
cmp('XC-42', 'Donchian upper vs ta', arr('dcu'), ta.volatility.DonchianChannel(H, L, C, 20).donchian_channel_hband(), 'ta library', start=20, tol=1e-9)
# ---------- (c) options vs SciPy ----------
B = np.array(J['bs']); ref = []
for x in bs:
    S, K, T, r, s, t = x['S'], x['K'], x['T'], x['r'], x['sigma'], x['type']; d1 = (math.log(S / K) + (r + s * s / 2) * T) / (s * math.sqrt(T)); d2 = d1 - s * math.sqrt(T)
    price = bsprice(S, K, T, r, s, t); delta = norm.cdf(d1) if t == 'call' else norm.cdf(d1) - 1; gamma = norm.pdf(d1) / (S * s * math.sqrt(T)); vega = S * norm.pdf(d1) * math.sqrt(T) / 100
    theta = (-(S * norm.pdf(d1) * s) / (2 * math.sqrt(T)) - r * K * math.exp(-r * T) * norm.cdf(d2)) / 365 if t == 'call' else (-(S * norm.pdf(d1) * s) / (2 * math.sqrt(T)) + r * K * math.exp(-r * T) * norm.cdf(-d2)) / 365
    rho = (K * T * math.exp(-r * T) * norm.cdf(d2) if t == 'call' else -K * T * math.exp(-r * T) * norm.cdf(-d2)) / 100
    ref.append([price, delta, gamma, theta, vega, rho])
ref = np.array(ref)
for j, nm in enumerate(['price', 'delta', 'gamma', 'theta/day', 'vega/1pt', 'rho/1%']): cmp(f'XC-5{j}', f'Black–Scholes {nm} (300 random contracts)', B[:, j], ref[:, j], 'SciPy norm', tol=1e-9, note='Normal CDF: Hart/West double-precision algorithm.')
cmp('XC-56', 'Implied vol round-trip (40 contracts)', J['iv'], [x['sigma'] for x in bs[:40]], 'input σ', tol=1e-4, note='Bisection to 1e-6 price tolerance.')
# ---------- (d) risk & money maths ----------
refp = []
for p in pos:
    risk = p['capital'] * p['riskPct'] / 100; per = abs(p['entry'] - p['stop']); lot = p['lot']
    u = max(0, min(math.floor(risk / per / lot) * lot, math.floor(p['capital'] * p['leverage'] / p['entry'] / lot) * lot)); refp.append([u, u * per])
P_ = np.array([x if x else [np.nan, np.nan] for x in J['pos']]); refp = np.array(refp)
cmp('XC-60', 'Position size units (300 random cases)', P_[:, 0], refp[:, 0], 'definition (Python)'); cmp('XC-61', 'Actual risk amount', P_[:, 1], refp[:, 1], 'definition (Python)', tol=1e-9)
S = json.load(open(os.path.join(ROOT, 'docs', 'audit', 'specs-for-crosscheck.json'))) if os.path.exists(os.path.join(ROOT, 'docs', 'audit', 'specs-for-crosscheck.json')) else None
seg = {'eqIntraday': (0, 0.00025, 307e-7, 0.00003, ('min', 20, 0.0003)), 'eqDelivery': (0.001, 0.001, 307e-7, 0.00015, ('flat', 0)), 'futures': (0, 0.0005, 183e-7, 0.00002, ('min', 20, 0.0003)), 'options': (0, 0.0015, 3553e-7, 0.00003, ('flat', 20))}
refc = []
for x in chg:
    sb, ss, tx, st, br = seg[x['segment']]; B_, S_ = x['buyValue'], x['sellValue']
    leg = lambda val: (0 if val <= 0 else (min(br[1], val * br[2]) if br[0] == 'min' else br[1]))
    brk = leg(B_) + leg(S_); txn = (B_ + S_) * tx; sebi = (B_ + S_) * 1e-6; gst = 0.18 * (brk + txn + sebi); refc.append(brk + B_ * sb + S_ * ss + txn + sebi + B_ * st + gst)
cmp('XC-62', 'India charges total (300 random trades, 4 segments)', J['charges'], refc, 'rates from NSE circular / Budget 2026 (Python)', tol=1e-9)
E = np.array(J['exp']); cmp('XC-63', 'Expectancy', E[:, 0], [x['winRate'] * x['avgWin'] - (1 - x['winRate']) * x['avgLoss'] for x in exp], 'definition (Python)'); cmp('XC-64', 'Profit factor', E[:, 1], [x['winRate'] * x['avgWin'] / ((1 - x['winRate']) * x['avgLoss']) for x in exp], 'definition (Python)')
dd = np.array(J['dd']); refdd = [];
for e in eq:
    e = np.array(e); peak = np.maximum.accumulate(e); d = peak - e; i = int(np.argmax(d)); refdd.append([d.max(), d.max() / peak[i]])
refdd = np.array(refdd); cmp('XC-65', 'Max drawdown (100 random equity curves)', dd[:, 0], refdd[:, 0], 'numpy running max'); cmp('XC-66', 'Max drawdown %', dd[:, 1], refdd[:, 1], 'numpy running max')
mc = []
for n, k, q in streak:
    sims = rng.random((20000, n)) < q; hit = 0
    run = np.zeros(20000, int); best = np.zeros(20000, int)
    for col in range(n): run = np.where(sims[:, col], run + 1, 0); best = np.maximum(best, run)
    mc.append(float(np.mean(best >= k)))
se = [max(1e-3, 3 * math.sqrt(p * (1 - p) / 20000)) for p in mc]
ok = all(abs(a - b) <= s for a, b, s in zip(J['streak'], mc, se))
RES.append(dict(id='XC-67', what='Losing-streak probability (40 random cases)', ref='Monte Carlo, 20,000 sims each (numpy)', n=len(mc), ok=ok, maxAbs=float(max(abs(a - b) for a, b in zip(J['streak'], mc))), maxRel=None, tol='3 standard errors', note='Exact DP vs simulation; tolerance is sampling error.'))
# payoff max gain/loss vs brute-force grid
def pay_at(legs, s): return sum(l['side'] * l['qty'] * ((max(s - l['K'], 0) if l['type'] == 'call' else max(l['K'] - s, 0)) - l['premium']) for l in legs)
bad = 0; mx = 0
for p, js in zip(pay, J['payoff']):
    ks = [l['K'] for l in p['legs']]; grid = sorted(set([0.0] + ks + list(np.linspace(0, max(ks) * 2, 20001))))
    vals = [pay_at(p['legs'], s) for s in grid]; slope = sum(l['side'] * l['qty'] for l in p['legs'] if l['type'] == 'call')
    mg = 1e99 if slope > 0 else max(vals); ml = -1e99 if slope < 0 else min(vals)
    err = max(abs(js[0] - mg) if mg < 1e98 else (0 if js[0] > 1e98 else 1e9), abs(js[1] - ml) if ml > -1e98 else (0 if js[1] < -1e98 else 1e9)); mx = max(mx, err); bad += err > 1e-6 * max(1, abs(mg) if mg < 1e98 else 1)
RES.append(dict(id='XC-68', what='Option strategy max gain / max loss (60 random positions, 7 structures)', ref='brute-force payoff grid incl. strikes (Python)', n=len(pay), ok=bad == 0, maxAbs=mx, maxRel=None, tol=1e-6, note='Unbounded cases compared as ±∞.'))
cmp('XC-69', 'Kelly fraction', J['kelly'], [w_ - (1 - w_) / b for w_, b in kelly], 'definition (Python)')
cmp('XC-70', 'Compounding final value', J['comp'], [(lambda x: [x.__setitem__('v', x['v'] * (1 + x['r']) + x['c']) for _ in range(x['n'])] and x['v'] or x['v'])({'v': p['start'], 'r': p['ratePct'] / 100, 'c': p['contribution'], 'n': p['periods']}) for p in comp], 'definition (Python)', tol=1e-9)
F = np.array(J['fut']); cmp('XC-71', 'Futures notional', F[:, 0], [f['price'] * f['lotSize'] * f['lots'] for f in fut], 'definition (Python)'); cmp('XC-72', 'Futures margin estimate', F[:, 1], [f['price'] * f['lotSize'] * f['lots'] * f['marginPct'] / 100 for f in fut], 'definition (Python)')
json.dump(RES, open(os.path.join(ROOT, 'tests', 'crosscheck-results.json'), 'w'), indent=1, default=lambda x: x.item() if hasattr(x, 'item') else str(x))
for r in RES: print(('PASS' if r['ok'] else 'FAIL'), r['id'], r['what'], '| ref:', r['ref'], '| max abs err', r['maxAbs'], '' if r['ok'] else '| ' + r['note'])
print(f"\n{sum(r['ok'] for r in RES if not r.get('info'))} passed, {sum((not r['ok']) for r in RES if not r.get('info'))} failed, {sum(1 for r in RES if r.get('info'))} informational")
