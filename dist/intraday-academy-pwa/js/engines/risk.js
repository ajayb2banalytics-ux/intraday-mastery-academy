/* Risk, sizing, cost and performance maths — pure functions. Every function
   returns {result fields..., steps:[strings]} where useful so the UI can show working. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const r2 = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
  const fail = (msg) => ({ error: msg });
  const pos = (x) => typeof x === 'number' && isFinite(x) && x > 0;

  // ---------- Position sizing ----------
  // Cash equity: shares = floor(capital*risk% / |entry-stop|), capped by buying power
  function positionSize({ capital, riskPct, entry, stop, leverage = 1, lot = 1 }) {
    if (!pos(capital)) return fail('Capital must be greater than zero.');
    if (!pos(riskPct) || riskPct > 100) return fail('Risk % must be between 0 and 100.');
    if (!pos(entry) || !pos(stop)) return fail('Entry and stop must be positive prices.');
    if (entry === stop) return fail('Stop cannot equal entry — risk per unit would be zero.');
    if (!pos(lot)) return fail('Lot size must be at least 1.');
    const riskAmt = (capital * riskPct) / 100, perUnit = Math.abs(entry - stop);
    const unitsByRisk = Math.floor(riskAmt / perUnit / lot) * lot;
    const unitsByCapital = Math.floor((capital * leverage) / entry / lot) * lot;
    const units = Math.max(0, Math.min(unitsByRisk, unitsByCapital));
    const side = entry > stop ? 'long' : 'short';
    const steps = [
      `Risk amount = capital × risk% = ${capital} × ${riskPct}% = ${r2(riskAmt)}`,
      `Risk per unit = |entry − stop| = |${entry} − ${stop}| = ${r2(perUnit, 4)}`,
      `Units by risk = floor(${r2(riskAmt)} ÷ ${r2(perUnit, 4)}${lot > 1 ? ' ÷ lot ' + lot + ') × lot' : ')'} = ${unitsByRisk}`,
      `Units affordable = floor(capital × leverage ÷ entry) = floor(${capital} × ${leverage} ÷ ${entry}) = ${unitsByCapital}`,
      `Position = min of the two = ${units}${lot > 1 ? ' (' + units / lot + ' lots)' : ''}`,
    ];
    const warnings = [];
    if (units === 0) warnings.push(unitsByRisk === 0 ? 'Risk budget is smaller than one unit/lot of risk — the trade cannot be taken at this risk level. Widen nothing: skip the trade or use a smaller instrument.' : 'Insufficient capital for even one unit/lot.');
    if (unitsByCapital < unitsByRisk) warnings.push('Capital, not risk, is the binding limit. Actual risk is below your target.');
    if (riskPct > 2) warnings.push('Risk above 2% per trade sharply raises drawdown and ruin probability — see the Risk of Ruin calculator.');
    return { side, riskAmt, perUnit, units, lots: units / lot, notional: units * entry, actualRisk: units * perUnit, capitalUsed: (units * entry) / leverage, steps, warnings };
  }

  function rrTargets({ entry, stop, rr = [1, 2, 3] }) {
    if (!pos(entry) || !pos(stop) || entry === stop) return fail('Enter valid, distinct entry and stop.');
    const R = entry - stop; // positive long, negative short
    return { R: Math.abs(R), side: R > 0 ? 'long' : 'short', targets: rr.map((m) => ({ rr: m, price: entry + m * R })) };
  }
  function riskReward({ entry, stop, target }) {
    if (![entry, stop, target].every(pos)) return fail('All prices must be positive.');
    const risk = Math.abs(entry - stop), reward = Math.abs(target - entry);
    if (risk === 0) return fail('Stop equals entry.');
    const long = entry > stop;
    if ((long && target <= entry) || (!long && target >= entry)) return fail('Target is on the wrong side of entry for this stop.');
    const ratio = reward / risk;
    return { risk, reward, ratio, breakevenWinRate: 1 / (1 + ratio), steps: [`Risk = ${r2(risk, 4)}`, `Reward = ${r2(reward, 4)}`, `R:R = ${r2(ratio)} : 1`, `Break-even win rate (before costs) = 1 ÷ (1 + R:R) = ${r2(100 / (1 + ratio))}%`] };
  }
  function atrStop({ entry, atr, mult = 1.5, side = 'long' }) {
    if (!pos(entry) || !pos(atr)) return fail('Entry and ATR must be positive.');
    return { stop: side === 'long' ? entry - mult * atr : entry + mult * atr, distance: mult * atr };
  }

  // ---------- Expectancy & performance ----------
  function expectancy({ winRate, avgWin, avgLoss }) {
    if (!(winRate >= 0 && winRate <= 1)) return fail('Win rate must be between 0 and 1 (e.g. 0.45).');
    if (!(avgWin >= 0) || !(avgLoss >= 0)) return fail('Average win and loss are entered as positive amounts.');
    const ev = winRate * avgWin - (1 - winRate) * avgLoss;
    const pf = avgLoss === 0 || winRate === 1 ? Infinity : (winRate * avgWin) / ((1 - winRate) * avgLoss);
    return { ev, profitFactor: pf, evR: avgLoss ? ev / avgLoss : null, steps: [`EV = W×AvgWin − (1−W)×AvgLoss = ${winRate}×${avgWin} − ${r2(1 - winRate, 4)}×${avgLoss} = ${r2(ev, 4)}`, `Profit factor = W×AvgWin ÷ ((1−W)×AvgLoss) = ${pf === Infinity ? '∞' : r2(pf, 3)}`] };
  }
  function tradeStats(pnls) {
    const n = pnls.length; if (!n) return { n: 0 };
    const wins = pnls.filter((x) => x > 0), losses = pnls.filter((x) => x < 0);
    const gw = wins.reduce((a, b) => a + b, 0), gl = -losses.reduce((a, b) => a + b, 0);
    const dd = maxDrawdown(cumulative(pnls, 0));
    let mw = 0, ml = 0, cw = 0, cl = 0;
    pnls.forEach((p) => { if (p > 0) { cw++; cl = 0; } else if (p < 0) { cl++; cw = 0; } else { cw = 0; cl = 0; } mw = Math.max(mw, cw); ml = Math.max(ml, cl); });
    return { n, wins: wins.length, losses: losses.length, winRate: wins.length / n, net: gw - gl, grossWin: gw, grossLoss: gl, avgWin: wins.length ? gw / wins.length : 0, avgLoss: losses.length ? gl / losses.length : 0, profitFactor: gl ? gw / gl : gw > 0 ? Infinity : 0, expectancy: (gw - gl) / n, maxDD: dd.maxDD, maxConsecWins: mw, maxConsecLosses: ml };
  }
  function cumulative(pnls, start = 0) { let s = start; return [start, ...pnls.map((p) => (s += p))]; }
  function maxDrawdown(equity) {
    let peak = -Infinity, maxDD = 0, maxDDPct = 0, peakI = 0, from = 0, to = 0;
    equity.forEach((v, i) => {
      if (v > peak) { peak = v; peakI = i; }
      const dd = peak - v;
      if (dd > maxDD) { maxDD = dd; from = peakI; to = i; maxDDPct = peak > 0 ? dd / peak : 0; }
    });
    return { maxDD, maxDDPct, from, to };
  }
  function lossesToRecover(ddPct) { return ddPct >= 1 ? Infinity : ddPct / (1 - ddPct); }

  // Analytic risk of ruin (fixed-fraction approximation, Balsara-style) + simulation in stats
  function riskOfRuinFormula({ winRate, payoff, riskPct, ruinPct = 50 }) {
    // Uses the classic approximation for equal-sized bets in R units: ((1-edge)/(1+edge))^units
    const edge = winRate * payoff - (1 - winRate);
    if (edge <= 0) return { ror: 1, edge, note: 'Negative or zero expectancy: ruin is certain given enough trades.' };
    const units = Math.log(1 - ruinPct / 100) / Math.log(1 - riskPct / 100); // trades of losses to hit ruin level
    const base = (1 - edge) / (1 + edge);
    return { ror: Math.min(1, Math.max(0, base ** Math.abs(units))), edge, unitsToRuin: Math.abs(units), note: 'Closed-form approximation. Use the Monte Carlo version for a distribution-based estimate.' };
  }

  function compounding({ start, ratePct, periods, contribution = 0 }) {
    if (!(start >= 0) || !(periods >= 0)) return fail('Start and periods must be non-negative.');
    const r = ratePct / 100, path = [start]; let v = start;
    for (let i = 0; i < periods; i++) { v = v * (1 + r) + contribution; path.push(v); }
    return { final: v, path, note: 'Mathematical illustration only. No trading method produces a fixed rate per period; returns are variable and can be negative.' };
  }
  function leverageMargin({ notional, marginPct, capital }) {
    if (!pos(notional) || !pos(marginPct) || !pos(capital)) return fail('All inputs must be positive.');
    const margin = (notional * marginPct) / 100, lev = notional / capital;
    return { margin, effectiveLeverage: lev, movePctToLoseCapital: 100 / lev, steps: [`Margin blocked = notional × margin% = ${r2(margin)}`, `Effective leverage = notional ÷ capital = ${r2(lev, 2)}×`, `An adverse move of ${r2(100 / lev, 2)}% wipes out the whole capital`] };
  }
  function futuresExposure({ price, lotSize, lots, marginPct = 12, capital }) {
    if (!pos(price) || !pos(lotSize) || !pos(lots)) return fail('Price, lot size and lots must be positive.');
    const notional = price * lotSize * lots, pointValue = lotSize * lots;
    const out = { notional, pointValue, margin: (notional * marginPct) / 100, pnlPer1Pct: notional / 100 };
    if (pos(capital)) out.leverage = notional / capital;
    return out;
  }
  function portfolioRisk(positions, corr) {
    // positions: [{risk}] (currency at risk, signed for direction); corr: matrix
    const n = positions.length; let v = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) v += positions[i].risk * positions[j].risk * (i === j ? 1 : corr?.[i]?.[j] ?? 0);
    const sumAbs = positions.reduce((a, p) => a + Math.abs(p.risk), 0);
    return { combined: Math.sqrt(Math.max(0, v)), sumOfRisks: sumAbs, note: 'Combined risk treats per-position risk as a 1-sigma loss. Correlation near 1 means positions behave as one big position.' };
  }
  function kelly({ winRate, payoff }) {
    const f = winRate - (1 - winRate) / payoff;
    return { full: f, half: f / 2, note: 'Kelly assumes you know the true win rate and payoff — you never do. Treat it as a theoretical ceiling, not a sizing rule.' };
  }
  function convert(amount, from, to, fx) {
    const rates = fx.rates; if (!rates[from] || !rates[to]) return fail('Unknown currency.');
    return { value: (amount / rates[from]) * rates[to] };
  }

  // ---------- Transaction costs ----------
  function indiaCharges({ segment, buyValue, sellValue, orders = 2, specs }) {
    const S = specs || IA.specsDefault.india, g = S.segments[segment];
    if (!g) return fail('Unknown segment.');
    if (!(buyValue >= 0) || !(sellValue >= 0)) return fail('Turnover cannot be negative.');
    const brokerageLeg = (val) => g.brokerage.type === 'flat' ? (val > 0 ? g.brokerage.flat : 0) : g.brokerage.type === 'minOf' ? (val > 0 ? Math.min(g.brokerage.flat, val * g.brokerage.pct) : 0) : 0;
    const brokerage = brokerageLeg(buyValue) + brokerageLeg(sellValue);
    const turnover = buyValue + sellValue;
    const stt = buyValue * g.sttBuy + sellValue * g.sttSell;
    const txn = turnover * g.txn, sebi = turnover * S.sebiFeeRate, stamp = buyValue * g.stampBuy;
    const gst = S.gstRate * (brokerage + txn + sebi);
    const total = brokerage + stt + txn + sebi + stamp + gst;
    return { segment: g.label, turnover, brokerage, stt, txn, sebi, stamp, gst, total, gross: sellValue - buyValue, net: sellValue - buyValue - total, asOf: S.asOf,
      steps: [`Turnover = ${r2(turnover)}`, `Brokerage = ${r2(brokerage)}`, `STT = buy×${g.sttBuy * 100}% + sell×${g.sttSell * 100}% = ${r2(stt)}`, `Exchange txn = turnover × ${r2(g.txn * 100, 5)}% = ${r2(txn)}`, `SEBI fee = turnover × ₹10/crore = ${r2(sebi)}`, `Stamp duty = buy × ${g.stampBuy * 100}% = ${r2(stamp)}`, `GST = 18% × (brokerage + txn + SEBI) = ${r2(gst)}`, `Total charges = ${r2(total)}`] };
  }
  function usCharges({ shares, buyPrice, sellPrice, contracts = 0, specs, date }) {
    const S = specs || (IA.specs || IA.specsDefault).us;
    const sellValue = shares * sellPrice; const day = (date || new Date().toISOString()).slice(0, 10); const tafRule = (S.tafSchedule || []).find((r) => day >= r.from && day <= r.to); const tafPS = tafRule ? tafRule.perShare : S.finraTafPerShare, tafMax = tafRule ? tafRule.max : S.finraTafMax;
    const commission = Math.max(S.commissionMin, shares * S.commissionPerShare * 2) + contracts * S.optionPerContract * 2;
    const sec = sellValue * S.secFeeRate, taf = Math.min(tafMax, shares * tafPS);
    const total = commission + sec + taf, gross = shares * (sellPrice - buyPrice);
    return { commission, sec, taf, total, gross, net: gross - total, asOf: S.asOf };
  }
  function indexFutTick(level, specs) { const t = (specs || (IA.specs || IA.specsDefault).india).indexFutTick || [[Infinity, 0.05]]; return t.find(([lim]) => level <= lim)[1]; }
  function breakevenMove(chargesTotal, qty) { return qty > 0 ? chargesTotal / qty : null; }

  // Exact probability of at least one run of >= k consecutive losses in n independent trades (loss prob q). DP on current run length.
  function streakProb(n, k, q) {
    if (!(n >= 0) || !(k >= 1) || !(q >= 0 && q <= 1)) return fail('Need n ≥ 0, k ≥ 1, loss probability 0–1.');
    let st = new Array(k).fill(0); st[0] = 1; let hit = 0;
    for (let t = 0; t < n; t++) { const nx = new Array(k).fill(0); for (let r = 0; r < k; r++) { const p = st[r]; if (!p) continue; nx[0] += p * (1 - q); if (r + 1 >= k) hit += p * q; else nx[r + 1] += p * q; } st = nx; }
    return { p: hit };
  }
  function expectedMaxStreak(n, q) { let e = 0; for (let k = 1; k <= n; k++) { const pk = streakProb(n, k, q).p; if (pk < 1e-12) break; e += pk; } return e; } // E[max run] = Σ_k P(max ≥ k)
  // Option position scenario grid: P&L for spot moves × IV shifts, now (after `daysPassed`) — Black–Scholes repricing.
  function optionsScenario(legs, { S, ivPct, days, r = 6.5, spotSteps = [-5, -3, -2, -1, 0, 1, 2, 3, 5], ivSteps = [-5, 0, 5, 10], daysPassed = 0 } = {}) {
    const T = Math.max(1e-6, (days - daysPassed) / 365);
    const val = (Sx, iv) => legs.reduce((a, l) => a + (l.type === 'stock' || l.type === 'future' ? l.side * (Sx - l.K) * l.qty : l.side * (IA.opt.bs({ S: Sx, K: l.K, T, r: r / 100, sigma: Math.max(0.01, iv) / 100, type: l.type }).price - l.premium) * l.qty), 0);
    const grid = ivSteps.map((dv) => ({ dv, row: spotSteps.map((ds) => ({ ds, pnl: val(S * (1 + ds / 100), ivPct + dv) })) }));
    let worst = Infinity, best = -Infinity; grid.forEach((g) => g.row.forEach((c) => { worst = Math.min(worst, c.pnl); best = Math.max(best, c.pnl); }));
    return { grid, worst, best };
  }
  IA.risk = { indexFutTick, streakProb, expectedMaxStreak, optionsScenario, positionSize, rrTargets, riskReward, atrStop, expectancy, tradeStats, cumulative, maxDrawdown, lossesToRecover, riskOfRuinFormula, compounding, leverageMargin, futuresExposure, portfolioRisk, kelly, convert, indiaCharges, usCharges, breakevenMove, r2 };
})(typeof window !== 'undefined' ? window : globalThis);
