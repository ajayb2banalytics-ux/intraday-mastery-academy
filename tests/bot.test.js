/* Strategy bot + code export tests. Run: node tests/bot.test.js
   BOT-*: the paper bot (prefix-only signals) must reproduce the backtester exactly and be causal.
   CG-*:  the exported Python script, run by a real Python interpreter on the same bars, must produce the
          same trades as the app; the Pine export must be well-formed (it cannot be executed here). */
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
['specs', 'indicators', 'risk', 'marketgen', 'backtest', 'bot', 'codegen'].forEach((f) => require(path.join(__dirname, '..', 'js', 'engines', f + '.js')));
const IA = globalThis.IA; IA.VERSION = IA.VERSION || 'test';
const results = []; let pass = 0, fail = 0;
function t(id, name, fn) { try { const r = fn(); if (r === true) { pass++; results.push({ id, name, ok: true }); } else { fail++; results.push({ id, name, ok: false, detail: JSON.stringify(r).slice(0, 400) }); } } catch (e) { fail++; results.push({ id, name, ok: false, detail: 'threw ' + e.message }); } }
const near = (a, b, e = 1e-6) => Math.abs(a - b) <= e * Math.max(1, Math.abs(a), Math.abs(b));

const data = IA.gen.generate({ preset: 'NIFTY', seed: 23, days: 8, tfMin: 5 }).candles;
const base = { capital: 2000000, maxLeverage: 5, riskPct: 1, costBps: 3, slippageTicks: 1, tick: 0.05, lot: 65, maxTradesPerDay: 3 };
const SIG = Object.keys(IA.bt.SIGNALS);
// Every signal on both sides, plus combinations and the stop/target variants.
const CONFIGS = [];
SIG.forEach((id) => [1, -1].forEach((side) => CONFIGS.push({ name: `${id} ${side > 0 ? 'long' : 'short'}`, cfg: { ...base, side, entry: [{ id }], stop: { type: 'atr', mult: 1.5 }, target: { rr: 2 } } })));
CONFIGS.push({ name: 'orb+vwap_side long, pct stop, no target', cfg: { ...base, side: 1, entry: [{ id: 'orb' }, { id: 'vwap_side' }], stop: { type: 'pct', pct: 0.4 }, target: { rr: null } } });
CONFIGS.push({ name: 'ema_cross(5,13)+adx(14,18) short, custom params', cfg: { ...base, side: -1, entry: [{ id: 'ema_cross', params: { fast: 5, slow: 13 } }, { id: 'adx_trend', params: { n: 14, min: 18 } }], stop: { type: 'atr', mult: 1 }, target: { rr: 1.5 } } });
CONFIGS.push({ name: 'rsi_extreme long, 1 trade/day, partial-fill cap', cfg: { ...base, side: 1, entry: [{ id: 'rsi_extreme', params: { n: 7, lo: 25, hi: 75 } }], stop: { type: 'atr', mult: 2 }, target: { rr: 3 }, maxTradesPerDay: 1, maxVolPct: 0.0001 } });
const same = (a, b) => a.length === b.length && a.every((x, k) => x.entryI === b[k].entryI && x.exitI === b[k].exitI && x.qty === b[k].qty && near(x.net, b[k].net) && x.why === b[k].why);

// ---------------- bot
t('BOT-01', `Bot started at bar 1 and run to the end reproduces the backtester trade for trade (${CONFIGS.length} configurations, all ${SIG.length} signals × both sides)`, () => {
  const bad = []; let total = 0;
  CONFIGS.forEach(({ name, cfg }) => { const r = IA.bt.run(data, cfg); const b = IA.bot.create(data, cfg, { startI: 1 }); IA.bot.advance(b, data, 'all'); total += r.trades.length; if (!same(r.trades, b.S.trades) || !near(r.stats.finalEquity, b.S.equity)) bad.push([name, r.trades.length, b.S.trades.length]); });
  return (bad.length === 0 && total > 40) || { bad, total };
});
t('BOT-02', 'Causality: every signal computed on bars 0..i equals the full-series signal at i (no look-ahead in any signal)', () => {
  const bad = [];
  CONFIGS.slice(0, SIG.length * 2).forEach(({ name, cfg }) => { const C = IA.bt.config(cfg), full = IA.bt.entrySignal(data, C); for (let i = 30; i < data.length; i += 7) { if (IA.bot.signalAt(data, C, i) !== full[i]) { bad.push([name, i]); break; } } });
  return bad.length === 0 || bad;
});
t('BOT-03', 'Changing every bar after i leaves all bot decisions up to i unchanged', () => {
  const cfg = CONFIGS.find((c) => c.name === 'orb+vwap_side long, pct stop, no target').cfg; const cut = 300;
  const alt = data.map((b, i) => (i > cut ? { ...b, o: b.o * 1.03, h: b.h * 1.03, l: b.l * 1.03, c: b.c * 1.03, v: b.v * 2 } : b));
  const A = IA.bot.create(data, cfg), B = IA.bot.create(alt, cfg); IA.bot.advance(A, data, cut); IA.bot.advance(B, alt, cut);
  return (JSON.stringify(A.log) === JSON.stringify(B.log) && A.S.equity === B.S.equity) || { a: A.log.length, b: B.log.length };
});
t('BOT-04', '"To session close" stops exactly after the last bar of the current session', () => {
  const b = IA.bot.create(data, CONFIGS[0].cfg, { startI: 80 }); const d = data[80].d; IA.bot.advance(b, data, 'eod');
  return (data[b.i - 1].d === d && data[b.i].d !== d) || [b.i, data[b.i - 1].d, d];
});
t('BOT-05', 'Every closed trade has an entry and an exit event in the log, and each signal event precedes its fill by exactly one bar', () => {
  const cfg = CONFIGS.find((c) => c.name.startsWith('orb long')).cfg; const b = IA.bot.create(data, cfg); IA.bot.advance(b, data, 'all');
  const en = b.log.filter((e) => e.type === 'entry'), ex = b.log.filter((e) => e.type === 'exit'), sg = b.log.filter((e) => e.type === 'signal');
  const okPairs = en.every((e) => sg.some((s) => s.i === e.i - 1));
  return (b.S.trades.length > 0 && ex.length === b.S.trades.length && en.length >= ex.length && okPairs) || { en: en.length, ex: ex.length, tr: b.S.trades.length, okPairs };
});
t('BOT-06', 'Equity = realised equity + open P&L marked at the last processed close', () => {
  const cfg = CONFIGS.find((c) => c.name.startsWith('orb long')).cfg; const b = IA.bot.create(data, cfg); let checked = 0;
  while (!b.done) { IA.bot.step(b, data); if (b.S.pos) { const exp = b.S.equity + (data[b.i - 1].c - b.S.pos.entry) * b.S.pos.qty; if (!near(IA.bot.equity(b, data), exp)) return [b.i]; checked++; } }
  return checked > 0 || 'no open positions seen';
});
t('BOT-07', 'A bot started on session 2 places no trade before its start bar and still uses session 1 as indicator history', () => {
  const s2 = data.findIndex((x) => x.d !== data[0].d); const b = IA.bot.create(data, CONFIGS[0].cfg, { startI: s2 }); IA.bot.advance(b, data, 'all');
  return (b.S.trades.every((x) => x.entryI > s2) && b.log.every((e) => e.i >= s2)) || b.S.trades[0];
});
t('BOT-08', 'Decision log text names the action, price and reason (signal ignored: daily trade limit)', () => {
  const cfg = { ...CONFIGS.find((c) => c.name.startsWith('volume_spike long')).cfg, maxTradesPerDay: 1, target: { rr: 0.3 } }; const b = IA.bot.create(data, cfg); IA.bot.advance(b, data, 'all');
  const txt = b.log.map((e) => IA.bot.describe(e, data, b.C));
  return (txt.some((s) => /bought \d+ @/.test(s)) && txt.some((s) => /exit by (stop|target|end of day)/.test(s)) && txt.some((s) => /signal ignored: daily trade limit/.test(s))) || txt.slice(0, 6);
});

// ---------------- code export
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ima-cg-'));
const csvPath = path.join(dir, 'bars.csv');
const hm = (t) => new Date(t).toISOString().slice(11, 16);
fs.writeFileSync(csvPath, 'datetime,open,high,low,close,volume\n' + data.map((b) => `${b.d} ${hm(b.t)},${b.o},${b.h},${b.l},${b.c},${b.v}`).join('\n') + '\n');
let py = null; try { execFileSync('python3', ['--version']); py = 'python3'; } catch (e) {}
t('CG-01', `Exported Python, run by ${py || 'python (not found)'} on the same bars, reproduces the app's trades (entry/exit time, qty, exit reason, net within ₹0.01) for all ${CONFIGS.length} configurations`, () => {
  if (!py) return 'python3 not available';
  const bad = []; let total = 0;
  CONFIGS.forEach(({ name, cfg }, k) => {
    const file = path.join(dir, `s${k}.py`), out = path.join(dir, `t${k}.csv`); fs.writeFileSync(file, IA.codegen.python(cfg, { name }));
    const stdout = execFileSync(py, ['-I', file, csvPath, out], { encoding: 'utf8' });
    const r = IA.bt.run(data, cfg); total += r.trades.length;
    const rows = fs.existsSync(out) ? fs.readFileSync(out, 'utf8').trim().split('\n').slice(1).filter(Boolean).map((l) => l.split(',')) : [];
    const hdr = fs.existsSync(out) ? fs.readFileSync(out, 'utf8').split('\n')[0].split(',') : []; const col = (n) => hdr.indexOf(n);
    const okN = rows.length === r.trades.length;
    const okRows = okN && r.trades.every((tr, j) => { const row = rows[j]; return row[col('entry_time')] === `${data[tr.entryI].d} ${hm(tr.entryT)}` && row[col('exit_time')] === `${data[tr.exitI].d} ${hm(tr.exitT)}` && +row[col('qty')] === tr.qty && row[col('why')] === tr.why && Math.abs(+row[col('net')] - tr.net) <= 0.011; });
    if (!okRows || !/trades \d+/.test(stdout)) bad.push([name, r.trades.length, rows.length]);
  });
  return (bad.length === 0 && total > 40) || { bad: bad.slice(0, 6), total };
});
t('CG-02', 'Python export uses only the standard library and contains no order-placement code', () => {
  const s = IA.codegen.python(CONFIGS[0].cfg); const imports = (s.match(/^import .+$/gm) || []).join(' ');
  return (imports === 'import csv import math import sys' && !/requests|kiteconnect|place_order\(|urllib|socket/.test(s)) || imports;
});
t('CG-03', 'Python export embeds the exact configuration (side, stop, target, risk, costs, lot, signal params)', () => {
  const cfg = CONFIGS.find((c) => c.name.startsWith('ema_cross(5,13)')).cfg, s = IA.codegen.python(cfg);
  return (/"side": -1/.test(s) && /"fast": 5/.test(s) && /"min": 18/.test(s) && /"mult": 1\b/.test(s) && /"rr": 1.5/.test(s) && /"lot": 65/.test(s) && /"costBps": 3/.test(s)) || 'missing';
});
t('CG-04', `Pine export is well-formed for every configuration: //@version=5, one strategy() call, a condition per entry rule, entry + exit + square-off, no undefined/NaN`, () => {
  const bad = [];
  CONFIGS.forEach(({ name, cfg }) => { const s = IA.codegen.pine(cfg, { name, tfMin: 5, sessionEnd: '15:30' }); const n = IA.bt.config(cfg).entry.length; const conds = [...Array(n).keys()].every((k) => s.includes(`c${k + 1} =`)); const ok = s.startsWith('//@version=5') && (s.match(/^strategy\(/gm) || []).length === 1 && conds && /strategy\.entry\(/.test(s) && /strategy\.exit\(/.test(s) && /strategy\.close_all/.test(s) && !/undefined|NaN/.test(s); if (!ok) bad.push(name); });
  return bad.length === 0 || bad;
});
t('CG-05', 'Pine export: entry cut-off and square-off times are derived from the session end and bar size (NSE 15:30, 5-min, 3 bars → 15:10 / 15:25)', () => {
  const s = IA.codegen.pine({ ...base, entry: [{ id: 'orb' }], noEntryLastBars: 3 }, { tfMin: 5, sessionEnd: '15:30' });
  return (/input\.int\(1510, "No new entries after/.test(s) && /input\.int\(1525, "Square off at/.test(s)) || s.match(/input\.int\(\d+, "(No new|Square)[^"]*"/g);
});
t('CG-06', 'Pine export maps Supertrend direction correctly (Pine uses −1 for an uptrend)', () => {
  const L = IA.codegen.pine({ ...base, side: 1, entry: [{ id: 'supertrend_flip' }] }), S = IA.codegen.pine({ ...base, side: -1, entry: [{ id: 'supertrend_flip' }] });
  return (/c1 = stDir0 == -1 and stDir0\[1\] == 1/.test(L) && /c1 = stDir0 == 1 and stDir0\[1\] == -1/.test(S)) || 'mapping wrong';
});

module.exports = { results, pass, fail };
if (require.main === module) { results.forEach((r) => console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.id} ${r.name}${r.ok ? '' : ' → ' + r.detail}`)); console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0); }
