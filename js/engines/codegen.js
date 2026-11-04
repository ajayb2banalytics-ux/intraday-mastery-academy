/* Strategy code export: turns a backtester configuration into
   - a standalone Python 3 script (standard library only) that re-implements the app's indicators, signals
     and bar-by-bar rules exactly, so its trades match the app on the same CSV (verified by tests), and
   - a TradingView Pine Script v5 strategy that follows the same rules using Pine's built-in functions
     (close, but not identical: Pine's fills, warm-up and session handling differ; not executed here). */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const RULE_TEXT = (C) => C.entry.map((e) => { const S = IA.bt.SIGNALS[e.id]; const p = Object.assign({}, S.params, e.params || {}); const ps = Object.entries(p).map(([k, v]) => `${k}=${v}`).join(', '); return `${S.label}${ps ? ' (' + ps + ')' : ''}`; });
  const clean = (C) => { const o = {}; ['side', 'entry', 'stop', 'target', 'capital', 'riskPct', 'slippageTicks', 'tick', 'costBps', 'eodExit', 'noEntryLastBars', 'maxTradesPerDay', 'lot', 'maxVolPct', 'maxLeverage'].forEach((k) => { if (C[k] !== undefined) o[k] = C[k]; }); o.entry = (o.entry || []).map((e) => ({ id: e.id, params: Object.assign({}, IA.bt.SIGNALS[e.id].params, e.params || {}) })); if (!o.target) o.target = { rr: null }; return o; };
  const pyLit = (v) => JSON.stringify(v, null, 2).replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False').replace(/\bnull\b/g, 'None');

  function python(cfg, meta = {}) {
    const C = clean(IA.bt.config(cfg)), rules = RULE_TEXT(C);
    return `#!/usr/bin/env python3
"""
${meta.name || 'Strategy'} - exported from Intraday Mastery Academy v${IA.VERSION || ''} on ${meta.date || new Date().toISOString().slice(0, 10)}

Rules (${C.side > 0 ? 'LONG' : 'SHORT'} only; ALL entry conditions must be true on a bar's close, entry at the NEXT bar's open):
${rules.map((r) => '  - ' + r).join('\n')}
Stop: ${C.stop.type === 'atr' ? C.stop.mult + ' x ATR(14) of the signal bar' : C.stop.pct + '% of the entry bar open'}; target: ${C.target.rr ? C.target.rr + 'R' : 'none'}; exit at session close: ${C.eodExit ? 'yes' : 'no'}
Risk ${C.riskPct}% of equity per trade (exposure capped at ${C.maxLeverage}× equity), max ${C.maxTradesPerDay} trades/day, no entries in the last ${C.noEntryLastBars} bars of a session.
Costs ${C.costBps} bps per side, slippage ${C.slippageTicks} tick(s) of ${C.tick}. If stop and target are both inside one bar, the stop is assumed hit first.

This script re-implements the app's indicators and rules exactly, using only the Python standard library.
On the same bars it should reproduce the app's backtest trade for trade.

Usage:   python3 ${meta.file || 'strategy.py'} bars.csv [trades_out.csv]
CSV:     header row, oldest bar first, one row per bar, exchange-local time:
         datetime,open,high,low,close,volume      e.g. 2026-11-02 09:15,25810.5,25840,25795.2,25832.1,182500
         (also accepted: separate date,time columns; column names are case-insensitive)

EDUCATIONAL USE ONLY. Not investment advice. A backtest describes the past on the data you supply; it does not
predict future results. Read the "Going live" notes at the end before connecting anything to a broker.
"""
import csv
import math
import sys

CONFIG = ${pyLit(C)}

# ---------------------------------------------------------------- data
def load_bars(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        rd = csv.DictReader(f)
        cols = {k.strip().lower(): k for k in rd.fieldnames}
        def col(*names):
            for n in names:
                if n in cols:
                    return cols[n]
            return None
        cdt, cd, ct = col("datetime", "timestamp", "date_time"), col("date"), col("time")
        co, ch, cl, cc, cv = col("open", "o"), col("high", "h"), col("low", "l"), col("close", "c"), col("volume", "vol", "v")
        if not (co and ch and cl and cc) or not (cdt or cd):
            sys.exit("CSV needs datetime (or date[,time]), open, high, low, close[, volume] columns")
        bars = []
        for r in rd:
            stamp = r[cdt].strip() if cdt else (r[cd].strip() + (" " + r[ct].strip() if ct else ""))
            stamp = stamp.replace("T", " ")
            bars.append({"d": stamp[:10], "t": stamp, "o": float(r[co]), "h": float(r[ch]), "l": float(r[cl]),
                         "c": float(r[cc]), "v": float(r[cv]) if cv and r[cv].strip() else 0.0})
    return bars

# ---------------------------------------------------------------- indicators (same definitions as the app)
def sma(src, n):
    out, s = [None] * len(src), 0.0
    for i, x in enumerate(src):
        s += x
        if i >= n:
            s -= src[i - n]
        if i >= n - 1:
            out[i] = s / n
    return out

def ema(src, n):  # seeded with the SMA of the first n values
    out, k, prev, start = [None] * len(src), 2 / (n + 1), None, -1
    for i, x in enumerate(src):
        if x is None:
            continue
        if start < 0:
            start = i
        if i - start == n - 1:
            prev = sum(src[start:i + 1]) / n
            out[i] = prev
        elif prev is not None:
            prev = x * k + prev * (1 - k)
            out[i] = prev
    return out

def rma(src, n):  # Wilder smoothing, seeded by the SMA
    out, prev, cnt, s = [None] * len(src), None, 0, 0.0
    for i, x in enumerate(src):
        if x is None:
            continue
        if prev is None:
            s += x
            cnt += 1
            if cnt == n:
                prev = s / n
                out[i] = prev
        else:
            prev = (prev * (n - 1) + x) / n
            out[i] = prev
    return out

def stdev(src, n):  # population SD (Bollinger convention)
    out = [None] * len(src)
    for i in range(n - 1, len(src)):
        w = src[i - n + 1:i + 1]
        m = 0.0
        for x in w:
            m += x
        m /= n
        v = 0.0
        for x in w:
            v += (x - m) ** 2
        out[i] = math.sqrt(v / n)
    return out

def rsi(src, n=14):
    g, l = [None], [None]
    for i in range(1, len(src)):
        d = src[i] - src[i - 1]
        g.append(max(d, 0))
        l.append(max(-d, 0))
    ag, al = rma(g, n), rma(l, n)
    out = []
    for i in range(len(src)):
        if ag[i] is None or al[i] is None:
            out.append(None)
        elif al[i] == 0:
            out.append(50 if ag[i] == 0 else 100)
        else:
            out.append(100 - 100 / (1 + ag[i] / al[i]))
    return out

def true_range(c):
    return [b["h"] - b["l"] if i == 0 else max(b["h"] - b["l"], abs(b["h"] - c[i - 1]["c"]), abs(b["l"] - c[i - 1]["c"]))
            for i, b in enumerate(c)]

def atr(c, n=14):
    return rma(true_range(c), n)

def macd_hist(src, f, s, sig):
    ef, es = ema(src, f), ema(src, s)
    line = [ef[i] - es[i] if ef[i] is not None and es[i] is not None else None for i in range(len(src))]
    sg = ema(line, sig)
    return [line[i] - sg[i] if line[i] is not None and sg[i] is not None else None for i in range(len(src))]

def bollinger(src, n, k):
    m, sd = sma(src, n), stdev(src, n)
    up = [None if m[i] is None else m[i] + k * sd[i] for i in range(len(src))]
    lo = [None if m[i] is None else m[i] - k * sd[i] for i in range(len(src))]
    return up, lo

def vwap(c):  # session VWAP, resets each calendar day
    pv = v = 0.0
    last, out = None, []
    for b in c:
        if b["d"] != last:
            pv = v = 0.0
            last = b["d"]
        tp = (b["h"] + b["l"] + b["c"]) / 3
        pv += tp * b["v"]
        v += b["v"]
        out.append(pv / v if v else None)
    return out

def adx(c, n=14):
    pdm, ndm = [0.0], [0.0]
    for i in range(1, len(c)):
        up, dn = c[i]["h"] - c[i - 1]["h"], c[i - 1]["l"] - c[i]["l"]
        pdm.append(up if up > dn and up > 0 else 0.0)
        ndm.append(dn if dn > up and dn > 0 else 0.0)
    tr = true_range(c)
    tr[0] = pdm[0] = ndm[0] = None
    st, sp, sn = rma(tr, n), rma(pdm, n), rma(ndm, n)
    pdi = [100 * sp[i] / t if t else None for i, t in enumerate(st)]
    ndi = [100 * sn[i] / t if t else None for i, t in enumerate(st)]
    dx = [None if p is None else (0 if p + ndi[i] == 0 else 100 * abs(p - ndi[i]) / (p + ndi[i])) for i, p in enumerate(pdi)]
    return rma(dx, n)

def supertrend_dir(c, n=10, m=3):
    a = atr(c, n)
    out, fu, fl, d = [], None, None, 1
    for i, b in enumerate(c):
        if a[i] is None:
            out.append(None)
            continue
        hl2 = (b["h"] + b["l"]) / 2
        bu, bl = hl2 + m * a[i], hl2 - m * a[i]
        pc = c[i - 1]["c"] if i > 0 else b["c"]
        fu = bu if (fu is None or bu < fu or pc > fu) else fu
        fl = bl if (fl is None or bl > fl or pc < fl) else fl
        if d == 1 and b["c"] < fl:
            d = -1
        elif d == -1 and b["c"] > fu:
            d = 1
        out.append(d)
    return out

# ---------------------------------------------------------------- signals (side: +1 long, -1 short)
def sig_ema_cross(c, p, side):
    cl = [b["c"] for b in c]
    f, s = ema(cl, p["fast"]), ema(cl, p["slow"])
    return [i > 0 and None not in (f[i], s[i], f[i - 1], s[i - 1]) and
            ((f[i - 1] <= s[i - 1] and f[i] > s[i]) if side > 0 else (f[i - 1] >= s[i - 1] and f[i] < s[i])) for i in range(len(c))]

def sig_vwap_side(c, p, side):
    v = vwap(c)
    return [v[i] is not None and (b["c"] > v[i] if side > 0 else b["c"] < v[i]) for i, b in enumerate(c)]

def sig_vwap_reclaim(c, p, side):
    v = vwap(c)
    return [i > 0 and c[i - 1]["d"] == b["d"] and v[i] is not None and v[i - 1] is not None and
            ((c[i - 1]["c"] <= v[i - 1] and b["c"] > v[i]) if side > 0 else (c[i - 1]["c"] >= v[i - 1] and b["c"] < v[i])) for i, b in enumerate(c)]

def sig_rsi_extreme(c, p, side):
    r = rsi([b["c"] for b in c], p["n"])
    return [i > 0 and r[i] is not None and r[i - 1] is not None and
            ((r[i - 1] < p["lo"] and r[i] >= p["lo"]) if side > 0 else (r[i - 1] > p["hi"] and r[i] <= p["hi"])) for i in range(len(c))]

def sig_rsi_trend(c, p, side):
    r = rsi([b["c"] for b in c], p["n"])
    return [x is not None and (x > 50 if side > 0 else x < 50) for x in r]

def sig_macd_cross(c, p, side):
    h = macd_hist([b["c"] for b in c], p["f"], p["s"], p["sig"])
    return [i > 0 and h[i] is not None and h[i - 1] is not None and
            ((h[i - 1] <= 0 and h[i] > 0) if side > 0 else (h[i - 1] >= 0 and h[i] < 0)) for i in range(len(c))]

def sig_supertrend_flip(c, p, side):
    d = supertrend_dir(c, p["n"], p["m"])
    return [i > 0 and d[i] is not None and d[i - 1] is not None and d[i] == side and d[i - 1] == -side for i in range(len(c))]

def sig_bb_reentry(c, p, side):
    up, lo = bollinger([b["c"] for b in c], p["n"], p["k"])
    return [i > 0 and lo[i] is not None and lo[i - 1] is not None and
            ((c[i - 1]["c"] < lo[i - 1] and b["c"] > lo[i]) if side > 0 else (c[i - 1]["c"] > up[i - 1] and b["c"] < up[i])) for i, b in enumerate(c)]

def sig_orb(c, p, side):
    out, day, k, hi, lo, fired = [False] * len(c), None, 0, 0.0, 0.0, False
    for i, b in enumerate(c):
        if b["d"] != day:
            day, k, hi, lo, fired = b["d"], 0, -math.inf, math.inf, False
        k += 1
        if k <= p["bars"]:
            hi, lo = max(hi, b["h"]), min(lo, b["l"])
            continue
        if not fired and (b["c"] > hi if side > 0 else b["c"] < lo):
            out[i] = fired = True
    return out

def sig_pdh_break(c, p, side):
    out, day, ph, pl, ch, clo, fired = [False] * len(c), None, None, None, -math.inf, math.inf, False
    for i, b in enumerate(c):
        if b["d"] != day:
            if day is not None:
                ph, pl = ch, clo
            day, ch, clo, fired = b["d"], -math.inf, math.inf, False
        if ph is not None and not fired and ((b["c"] > ph and c[i - 1]["c"] <= ph) if side > 0 else (b["c"] < pl and c[i - 1]["c"] >= pl)):
            out[i] = fired = True
        ch, clo = max(ch, b["h"]), min(clo, b["l"])
    return out

def sig_volume_spike(c, p, side):
    av = sma([b["v"] for b in c], 20)
    return [av[i] is not None and b["v"] >= p["k"] * av[i] for i, b in enumerate(c)]

def sig_adx_trend(c, p, side):
    a = adx(c, p["n"])
    return [x is not None and x >= p["min"] for x in a]

SIGNALS = {name[4:]: fn for name, fn in globals().items() if name.startswith("sig_")}

def entry_signal(c, cfg):
    sigs = [SIGNALS[e["id"]](c, e["params"], cfg["side"]) for e in cfg["entry"]]
    return [all(s[i] for s in sigs) for i in range(len(c))]

# ---------------------------------------------------------------- bar-by-bar backtest (same rules as the app)
def backtest(c, cfg):
    side, slip = cfg["side"], cfg["slippageTicks"] * cfg["tick"]
    cost = lambda val: val * cfg["costBps"] / 1e4
    sig, a = entry_signal(c, cfg), atr(c, 14)
    last_of_day = [i == len(c) - 1 or c[i + 1]["d"] != b["d"] for i, b in enumerate(c)]
    bars_left, k = [0] * len(c), 0
    for i in range(len(c) - 1, -1, -1):
        k = 0 if last_of_day[i] else k + 1
        bars_left[i] = k
    equity, pos, pending, trades, day_count, curve = cfg["capital"], None, False, [], {}, [cfg["capital"]]
    for i in range(1, len(c)):
        b = c[i]
        if pending and pos is None:
            pending = False
            fill = b["o"] + side * slip
            stop_dist = (a[i - 1] or b["o"] * 0.003) * cfg["stop"]["mult"] if cfg["stop"]["type"] == "atr" else b["o"] * cfg["stop"]["pct"] / 100
            stop = fill - side * stop_dist
            target = fill + side * stop_dist * cfg["target"]["rr"] if cfg["target"].get("rr") else None
            qty = math.floor(equity * cfg["riskPct"] / 100 / stop_dist / cfg["lot"]) * cfg["lot"]
            qty = min(qty, math.floor(equity * cfg.get("maxLeverage", 1) / fill / cfg["lot"]) * cfg["lot"])  # exposure cap
            partial = False
            if cfg.get("maxVolPct", 0) > 0:
                cap = math.floor(b["v"] * cfg["maxVolPct"] / cfg["lot"]) * cfg["lot"]
                if qty > cap:
                    qty, partial = cap, True
            if qty > 0:
                pos = {"i": i, "entry": fill, "stop": stop, "target": target, "qty": qty, "dist": stop_dist}
                day_count[b["d"]] = day_count.get(b["d"], 0) + 1
        if pos is not None:
            exit_px = why = None
            hit_stop = b["l"] <= pos["stop"] if side > 0 else b["h"] >= pos["stop"]
            hit_tgt = pos["target"] is not None and (b["h"] >= pos["target"] if side > 0 else b["l"] <= pos["target"])
            if hit_stop:
                gap = b["o"] < pos["stop"] if side > 0 else b["o"] > pos["stop"]
                exit_px, why = (b["o"] if gap else pos["stop"]) - side * slip, "stop (gapped)" if gap else "stop"
            elif hit_tgt:
                exit_px, why = pos["target"] - side * slip, "target"
            elif cfg["eodExit"] and last_of_day[i]:
                exit_px, why = b["c"] - side * slip, "end of day"
            if exit_px is not None:
                gross = side * (exit_px - pos["entry"]) * pos["qty"]
                costs = cost(pos["entry"] * pos["qty"]) + cost(exit_px * pos["qty"])
                net = gross - costs
                equity += net
                trades.append({"entry_time": c[pos["i"]]["t"], "exit_time": b["t"], "side": "long" if side > 0 else "short",
                               "qty": pos["qty"], "entry": round(pos["entry"], 4), "exit": round(exit_px, 4), "why": why,
                               "gross": round(gross, 2), "costs": round(costs, 2), "net": round(net, 2),
                               "R": round(net / (pos["dist"] * pos["qty"]), 4)})
                curve.append(equity)
                pos = None
        if pos is None and not pending and sig[i] and bars_left[i] >= cfg["noEntryLastBars"] \\
                and day_count.get(b["d"], 0) < cfg["maxTradesPerDay"] and i < len(c) - 1:
            pending = True
        if pending and last_of_day[i]:
            pending = False
    peak, mdd = curve[0], 0.0
    for e in curve:
        peak = max(peak, e)
        mdd = max(mdd, (peak - e) / peak if peak else 0)
    return trades, equity, mdd

def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    bars = load_bars(sys.argv[1])
    if len(bars) < 30:
        sys.exit("Need at least 30 bars.")
    trades, final, mdd = backtest(bars, CONFIG)
    n, wins = len(trades), sum(1 for t in trades if t["net"] > 0)
    net = sum(t["net"] for t in trades)
    print(f"bars {len(bars)}  trades {n}  win rate {100 * wins / n if n else 0:.1f}%  net {net:,.2f}  "
          f"final equity {final:,.2f}  avg R {sum(t['R'] for t in trades) / n if n else 0:.3f}  max DD {100 * mdd:.2f}%")
    if n < 30:
        print(f"Only {n} trades - far too few to judge anything.")
    if len(sys.argv) > 2:
        with open(sys.argv[2], "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=list(trades[0].keys()) if trades else ["entry_time"])
            w.writeheader()
            w.writerows(trades)
        print("trades written to", sys.argv[2])

if __name__ == "__main__":
    main()

# ---------------------------------------------------------------- Going live (read before connecting a broker)
# 1. Paper-trade first. Run the same rules forward on new data (the app's Strategy bot does this) and compare with
#    the backtest. Live fills, gaps, outages and costs are usually worse than any backtest.
# 2. In India, automated orders from your own code go through your broker's API, under SEBI's framework for retail
#    algorithmic trading (see the app lesson "Algo trading rules in India"): the broker is responsible for the algo,
#    orders carry an exchange algo ID, API access needs the broker's controls (e.g. static IP, 2FA), and above an
#    order-rate threshold a self-built algo must be registered through the broker. Check your broker's current rules.
# 3. Build a kill switch, a daily loss limit and position limits into the live code, and log every order.
# 4. This file deliberately contains no order-placement code.
`;
  }

  function pine(cfg, meta = {}) {
    const C = clean(IA.bt.config(cfg)), long = C.side > 0, rules = RULE_TEXT(C);
    const tf = meta.tfMin || 5, end = meta.sessionEnd || '15:30';
    const [eh, em] = end.split(':').map(Number), endMin = eh * 60 + em;
    const fmt = (m) => String(Math.floor(m / 60)).padStart(2, '0') + String(m % 60).padStart(2, '0');
    const lastEntryMin = endMin - (C.noEntryLastBars + 1) * tf, squareMin = endMin - tf;
    const S = (id) => C.entry.find((e) => e.id === id);
    const lines = [], conds = [];
    C.entry.forEach((e, k) => {
      const p = e.params, v = `c${k + 1}`;
      switch (e.id) {
        case 'ema_cross': lines.push(`emaF${k} = ta.ema(close, ${p.fast})`, `emaS${k} = ta.ema(close, ${p.slow})`, `${v} = ${long ? `ta.crossover(emaF${k}, emaS${k})` : `ta.crossunder(emaF${k}, emaS${k})`}`); break;
        case 'vwap_side': lines.push(`vw${k} = ta.vwap(hlc3)`, `${v} = close ${long ? '>' : '<'} vw${k}`); break;
        case 'vwap_reclaim': lines.push(`vw${k} = ta.vwap(hlc3)`, `${v} = not session.isfirstbar and ${long ? `close[1] <= vw${k}[1] and close > vw${k}` : `close[1] >= vw${k}[1] and close < vw${k}`}`); break;
        case 'rsi_extreme': lines.push(`r${k} = ta.rsi(close, ${p.n})`, `${v} = ${long ? `r${k}[1] < ${p.lo} and r${k} >= ${p.lo}` : `r${k}[1] > ${p.hi} and r${k} <= ${p.hi}`}`); break;
        case 'rsi_trend': lines.push(`r${k} = ta.rsi(close, ${p.n})`, `${v} = r${k} ${long ? '> 50' : '< 50'}`); break;
        case 'macd_cross': lines.push(`[m${k}, s${k}, h${k}] = ta.macd(close, ${p.f}, ${p.s}, ${p.sig})`, `${v} = ${long ? `h${k}[1] <= 0 and h${k} > 0` : `h${k}[1] >= 0 and h${k} < 0`}`); break;
        case 'supertrend_flip': lines.push(`[st${k}, stDir${k}] = ta.supertrend(${p.m}, ${p.n})`, `// Pine's direction is -1 in an uptrend and +1 in a downtrend`, `${v} = ${long ? `stDir${k} == -1 and stDir${k}[1] == 1` : `stDir${k} == 1 and stDir${k}[1] == -1`}`); break;
        case 'bb_reentry': lines.push(`[bbM${k}, bbU${k}, bbL${k}] = ta.bb(close, ${p.n}, ${p.k})`, `${v} = ${long ? `close[1] < bbL${k}[1] and close > bbL${k}` : `close[1] > bbU${k}[1] and close < bbU${k}`}`); break;
        case 'orb': lines.push(`var int orbN${k} = 0`, `var float orbH${k} = na`, `var float orbL${k} = na`, `var bool orbDone${k} = false`, `if session.isfirstbar`, `    orbN${k} := 0`, `    orbH${k} := high`, `    orbL${k} := low`, `    orbDone${k} := false`, `orbN${k} += 1`, `if orbN${k} <= ${p.bars}`, `    orbH${k} := math.max(orbH${k}, high)`, `    orbL${k} := math.min(orbL${k}, low)`, `${v} = orbN${k} > ${p.bars} and not orbDone${k} and close ${long ? `> orbH${k}` : `< orbL${k}`}`, `if ${v}`, `    orbDone${k} := true`); break;
        case 'pdh_break': lines.push(`var float pdH${k} = na`, `var float pdL${k} = na`, `var float dH${k} = na`, `var float dL${k} = na`, `var bool pdDone${k} = false`, `if session.isfirstbar`, `    pdH${k} := dH${k}`, `    pdL${k} := dL${k}`, `    dH${k} := high`, `    dL${k} := low`, `    pdDone${k} := false`, `${v} = not na(pdH${k}) and not pdDone${k} and ${long ? `close > pdH${k} and close[1] <= pdH${k}` : `close < pdL${k} and close[1] >= pdL${k}`}`, `if ${v}`, `    pdDone${k} := true`, `dH${k} := math.max(dH${k}, high)`, `dL${k} := math.min(dL${k}, low)`); break;
        case 'volume_spike': lines.push(`${v} = volume >= ${p.k} * ta.sma(volume, 20)`); break;
        case 'adx_trend': lines.push(`[diP${k}, diM${k}, adx${k}] = ta.dmi(${p.n}, ${p.n})`, `${v} = adx${k} >= ${p.min}`); break;
      }
      conds.push(v);
    });
    const stopExpr = C.stop.type === 'atr' ? `ta.atr(14) * ${C.stop.mult}` : `close * ${C.stop.pct} / 100  // app uses the entry bar's open; Pine uses the signal bar's close`;
    return `//@version=5
// ${meta.name || 'Strategy'} - exported from Intraday Mastery Academy v${IA.VERSION || ''} on ${meta.date || new Date().toISOString().slice(0, 10)}
// Rules (${long ? 'LONG' : 'SHORT'} only, ALL true on a bar's close, entry at the next bar's open):
${rules.map((r) => '//   - ' + r).join('\n')}
// Stop ${C.stop.type === 'atr' ? C.stop.mult + ' x ATR(14)' : C.stop.pct + '%'}, target ${C.target.rr ? C.target.rr + 'R' : 'none'}, risk ${C.riskPct}% of equity, max ${C.maxTradesPerDay} trades/day,
// square-off before the session close (${end}, ${tf}-minute bars assumed).
// Results in TradingView will be CLOSE TO, NOT IDENTICAL WITH, the app: Pine's indicator warm-up, intrabar
// stop/target ordering and session handling differ. This script was generated but not run in TradingView here.
// EDUCATIONAL USE ONLY - not investment advice.
strategy("${(meta.name || 'IMA strategy').replace(/"/g, "'")}", overlay = true, initial_capital = ${C.capital}, commission_type = strategy.commission.percent, commission_value = ${(C.costBps / 100).toFixed(4)}, slippage = ${C.slippageTicks}, process_orders_on_close = false)

riskPct      = input.float(${C.riskPct}, "Risk per trade %", step = 0.1)
lotSize      = input.int(${C.lot}, "Lot size", minval = 1)
maxPerDay    = input.int(${C.maxTradesPerDay}, "Max trades per day", minval = 1)
lastEntryHHMM = input.int(${+fmt(lastEntryMin)}, "No new entries after (HHMM, exchange time)")
squareHHMM   = input.int(${+fmt(squareMin)}, "Square off at (HHMM, exchange time)")
rr           = input.float(${C.target.rr || 0}, "Target in R (0 = none)", step = 0.5)

${lines.join('\n')}

entrySig = ${conds.join(' and ')}

hhmm = hour(time, syminfo.timezone) * 100 + minute(time, syminfo.timezone)
var int tradesToday = 0
if session.isfirstbar
    tradesToday := 0

stopDist = ${stopExpr}
qtyRaw = math.floor(strategy.equity * riskPct / 100 / stopDist / lotSize) * lotSize
maxLev = input.float(${C.maxLeverage}, "Max exposure (x equity)", step = 0.5)
qty = math.min(qtyRaw, math.floor(strategy.equity * maxLev / close / lotSize) * lotSize)

if entrySig and strategy.position_size == 0 and tradesToday < maxPerDay and hhmm <= lastEntryHHMM and qty > 0
    strategy.entry("E", ${long ? 'strategy.long' : 'strategy.short'}, qty = qty)
    strategy.exit("X", "E", loss = stopDist / syminfo.mintick, profit = rr > 0 ? stopDist * rr / syminfo.mintick : na)
    tradesToday += 1
${C.eodExit ? `
if hhmm >= squareHHMM
    strategy.close_all(comment = "end of day")
` : ''}
plotshape(entrySig, "Signal", ${long ? 'shape.triangleup, location.belowbar, color.new(color.blue, 0)' : 'shape.triangledown, location.abovebar, color.new(color.orange, 0)'})
`;
  }
  IA.codegen = { python, pine, rules: RULE_TEXT, clean };
})(typeof window !== 'undefined' ? window : globalThis);
