/* Backtesting validation data: every mechanical strategy × 8 synthetic regimes, plus a random-entry
   overfitting test on a mixed-regime sample. Output: tests/regime-results.json. Run: node tools/regime_report.js */
const path = require('path'), fs = require('fs'); const R = path.join(__dirname, '..');
['specs', 'indicators', 'risk', 'marketgen', 'backtest', 'execution'].forEach((f) => require(path.join(R, 'js', 'engines', f + '.js')));
require(path.join(R, 'js', 'content', 'strategies.js'));
const IA = globalThis.IA; const S = IA.content.strategies.filter((s) => s.btConfig);
const REG = ['trend-up', 'trend-down', 'range', 'volatile', 'low-vol', 'gap-up', 'gap-down', 'news'];
const ins = IA.exec.INSTR.NIFTY; const base = { lot: ins.lot, tick: ins.tick, capital: 5e6, riskPct: 0.5, costBps: 3, slippageTicks: 1 };
const sets = Object.fromEntries(REG.map((r) => [r, IA.gen.generate({ preset: 'NIFTY', seed: 2026, days: 60, tfMin: 5, regimes: Array(60).fill(r) }).candles]));
const mixed = IA.gen.generate({ preset: 'NIFTY', seed: 77, days: 120, tfMin: 5 }).candles;
const rows = S.map((s) => {
  const row = { id: s.id, name: s.name, regimes: {} };
  REG.forEach((r) => { const x = IA.bt.run(sets[r], { ...s.btConfig, ...base }); row.regimes[r] = x.stats ? { n: x.stats.n, avgR: x.stats.avgR, pf: x.stats.profitFactor, net: x.stats.net } : { error: x.error }; });
  const m = IA.bt.run(mixed, { ...s.btConfig, ...base }); row.mixed = m.stats ? { n: m.stats.n, avgR: m.stats.avgR, pf: m.stats.profitFactor, net: m.stats.net, costs: m.stats.totalCosts } : null;
  const rt = IA.bt.randomEntryTest(mixed, { ...s.btConfig, ...base }, { runs: 200, seed: 3 }); row.randomEntry = rt.error ? { error: rt.error } : { p: rt.p, strategyNet: rt.strategyNet, randomMedian: rt.randomMedian };
  process.stderr.write('.'); return row;
});
const pos = rows.filter((r) => r.mixed && r.mixed.avgR > 0).length, sig = rows.filter((r) => r.randomEntry.p !== undefined && r.randomEntry.p < 0.05).length;
fs.writeFileSync(path.join(R, 'tests', 'regime-results.json'), JSON.stringify({ generated: new Date().toISOString(), note: 'SYNTHETIC data only (seeded generator). Not evidence about real markets.', regimes: REG, strategies: rows.length, positiveOnMixed: pos, significantVsRandom: sig, rows }, null, 1));
console.log(`\n${rows.length} strategies; positive avg R on mixed synthetic sample: ${pos}; beat random entries at p<0.05: ${sig}`);
