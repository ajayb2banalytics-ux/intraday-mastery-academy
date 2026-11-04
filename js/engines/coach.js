/* Journal coaching: rule-based insights from your own journal (pure, no DOM).
   Input: trades already passed through IA.journalDerive ({net, gross, charges, R, risk, dur, date, entryTime, side, qty,
   strategy, emotion, mistakes[], conditions, quality, ...}) and the saved risk plan.
   Every insight carries its sample size. Group differences are tested with Welch's t; anything below |t| = 2 or with
   fewer than 5 trades in a group is labelled a HINT, not a finding. Nothing here predicts future results. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
  const sd = (a) => { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
  function welch(a, b) { if (a.length < 2 || b.length < 2) return 0; const va = sd(a) ** 2 / a.length, vb = sd(b) ** 2 / b.length; return va + vb > 0 ? (mean(a) - mean(b)) / Math.sqrt(va + vb) : 0; }
  const minutes = (s) => { if (s == null || s === '') return null; if (typeof s === 'number') { const d = new Date(s); return d.getUTCHours() * 60 + d.getUTCMinutes(); } const m = /^(\d{1,2}):(\d{2})/.exec(String(s)); return m ? +m[1] * 60 + +m[2] : null; };
  const hourBucket = (t) => { const m = minutes(t.entryTime); if (m == null) return null; const h = Math.floor(m / 60); return `${String(h).padStart(2, '0')}:00–${String(h + 1).padStart(2, '0')}:00`; };
  const weekday = (t) => { const d = new Date(String(t.date) + 'T12:00:00Z'); return isNaN(d) ? null : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()]; };
  const DIMS = [['strategy', 'Strategy', (t) => t.strategy || null], ['hour', 'Entry hour', hourBucket], ['weekday', 'Weekday', weekday], ['emotion', 'Emotional state', (t) => t.emotion || null], ['conditions', 'Market conditions', (t) => t.conditions || null], ['quality', 'Setup quality', (t) => (t.quality ? `quality ${t.quality}` : null)], ['side', 'Direction', (t) => t.side || null]];
  const fmt = (x) => Math.round(x).toLocaleString('en-IN');
  const order = (a) => a.slice().sort((x, y) => String(x.date).localeCompare(String(y.date)) || (minutes(x.entryTime) ?? 0) - (minutes(y.entryTime) ?? 0));

  function insights(trades, plan = {}, { minGroup = 5 } = {}) {
    const T = order(trades.filter((t) => isFinite(t.net))), n = T.length, out = [];
    const add = (o) => out.push({ severity: 'info', strength: 'hint', ...o });
    if (!n) return { n: 0, insights: [{ severity: 'info', strength: 'hint', title: 'No trades yet', detail: 'Journal at least 20 trades (paper or real) for coaching. Use the simulators and send trades to the journal.', evidence: 'n = 0' }], groups: {} };
    const nets = T.map((t) => t.net), Rs = T.filter((t) => t.R != null && isFinite(t.R)).map((t) => t.R);
    const useR = Rs.length >= n * 0.8, metric = (t) => (useR ? t.R : t.net), unit = useR ? 'R' : '₹';
    if (n < 20) add({ title: 'Small sample', detail: `Only ${n} trade(s). Patterns below are hints; most traders need 50–100+ trades of one setup before its statistics mean much.`, evidence: `n = ${n}` });
    // 1. Overall edge
    const m = mean(nets), se = sd(nets) / Math.sqrt(n), tt = se > 0 ? m / se : 0;
    add({ severity: m < 0 ? 'high' : 'info', strength: Math.abs(tt) >= 2 ? 'finding' : 'hint', title: m < 0 ? 'Negative expectancy so far' : Math.abs(tt) >= 2 ? 'Positive expectancy so far' : 'Edge not yet distinguishable from zero', detail: `Average net per trade ₹${fmt(m)} (t = ${tt.toFixed(2)}).${Math.abs(tt) < 2 ? ' With this much variation the true average could plausibly be zero or the opposite sign — keep sizes small and keep collecting data.' : ''}${useR ? ` Average R ${mean(Rs).toFixed(2)}.` : ''}`, evidence: `n = ${n}; mean ₹${fmt(m)}; standard error ₹${fmt(se)}` });
    // 2. Costs
    const gross = T.reduce((s, t) => s + t.gross, 0), ch = T.reduce((s, t) => s + (+t.charges || 0), 0), absG = T.reduce((s, t) => s + Math.abs(t.gross), 0);
    if (ch > 0 && gross > 0 && gross - ch <= 0) add({ severity: 'high', strength: 'finding', title: 'Costs turned a gross profit into a net loss', detail: `Gross P&L ₹${fmt(gross)}, charges ₹${fmt(ch)}. Fewer, larger-target trades or cheaper instruments are the usual fixes.`, evidence: `n = ${n}` });
    else if (ch > 0 && absG > 0 && ch / absG > 0.15) add({ severity: 'medium', strength: 'finding', title: 'Charges are a large share of your P&L', detail: `Charges equal ${(100 * ch / absG).toFixed(0)}% of the absolute gross P&L. Small targets on futures/options are hit hardest by STT and spreads.`, evidence: `charges ₹${fmt(ch)} over ${n} trades` });
    // 3. Weakest / strongest groups
    const groups = {}; const flagged = [];
    for (const [k, label, fn] of DIMS) {
      const g = {}; T.forEach((t) => { const v = fn(t); if (v == null) return; (g[v] = g[v] || []).push(t); }); groups[k] = g;
      const keys = Object.keys(g); if (keys.length < 2) continue;
      for (const v of keys) { const inG = g[v].map(metric), rest = T.filter((t) => !g[v].includes(t)).map(metric); if (g[v].length < 3) continue; const w = welch(inG, rest), mg = mean(inG); flagged.push({ k, label, v, n: g[v].length, mean: mg, rest: mean(rest), t: w, total: g[v].reduce((s, t) => s + t.net, 0) }); }
    }
    const worst = flagged.filter((f) => f.mean < 0 && f.mean < f.rest).sort((a, b) => a.total - b.total).slice(0, 3);
    worst.forEach((f) => add({ severity: f.n >= minGroup && f.t <= -2 ? 'high' : 'medium', strength: f.n >= minGroup && f.t <= -2 ? 'finding' : 'hint', title: `Weak spot — ${f.label}: ${f.v}`, detail: `These trades averaged ${unit === 'R' ? f.mean.toFixed(2) + 'R' : '₹' + fmt(f.mean)} versus ${unit === 'R' ? f.rest.toFixed(2) + 'R' : '₹' + fmt(f.rest)} for everything else, and cost ₹${fmt(-f.total)} in total. ${f.n >= minGroup && f.t <= -2 ? 'Consider pausing this until you can say why it fails.' : 'Not statistically clear yet — watch it.'}`, evidence: `n = ${f.n}; Welch t = ${f.t.toFixed(2)}` }));
    const best = flagged.filter((f) => f.mean > 0 && f.mean > f.rest && f.n >= minGroup).sort((a, b) => b.t - a.t)[0];
    if (best) add({ severity: 'info', strength: best.t >= 2 ? 'finding' : 'hint', title: `Relative strength — ${best.label}: ${best.v}`, detail: `Averaged ${unit === 'R' ? best.mean.toFixed(2) + 'R' : '₹' + fmt(best.mean)} versus ${unit === 'R' ? best.rest.toFixed(2) + 'R' : '₹' + fmt(best.rest)} elsewhere. Do not size up on this until it holds over many more trades.`, evidence: `n = ${best.n}; Welch t = ${best.t.toFixed(2)}` });
    // 4. Mistakes and their cost
    const mk = {}; T.forEach((t) => (Array.isArray(t.mistakes) ? t.mistakes : String(t.mistakes || '').split(/;\s*/)).filter((x) => x && x !== 'None').forEach((x) => (mk[x] = mk[x] || []).push(t)));
    Object.entries(mk).sort((a, b) => a[1].reduce((s, t) => s + t.net, 0) - b[1].reduce((s, t) => s + t.net, 0)).slice(0, 3).forEach(([x, ts]) => { const tot = ts.reduce((s, t) => s + t.net, 0); if (tot < 0) add({ severity: ts.length >= 3 ? 'high' : 'medium', strength: ts.length >= minGroup ? 'finding' : 'hint', title: `Costly mistake: ${x}`, detail: `Tagged on ${ts.length} trade(s) (${(100 * ts.length / n).toFixed(0)}% of all), net ₹${fmt(tot)}. Write one concrete rule that prevents it and put it on your pre-trade checklist.`, evidence: `n = ${ts.length}` }); });
    // 5. Plan breaches
    const cap = +plan.capital || 0, byDay = {}; T.forEach((t) => (byDay[t.date] = byDay[t.date] || []).push(t));
    if (plan.maxTrades) { const over = Object.entries(byDay).filter(([, ts]) => ts.length > plan.maxTrades); if (over.length) { const extra = over.flatMap(([, ts]) => ts.slice(plan.maxTrades)); add({ severity: 'high', strength: 'finding', title: 'Over-trading: daily trade limit exceeded', detail: `${over.length} day(s) with more than ${plan.maxTrades} trades. Trades beyond the limit netted ₹${fmt(extra.reduce((s, t) => s + t.net, 0))}.`, evidence: `${extra.length} extra trade(s)` }); } }
    if (cap && plan.dailyLossPct) { const lim = -cap * plan.dailyLossPct / 100; let after = []; Object.values(byDay).forEach((ts) => { let run = 0; ts.forEach((t) => { if (run <= lim) after.push(t); run += t.net; }); }); if (after.length) add({ severity: 'high', strength: 'finding', title: 'Trading after the daily loss limit was hit', detail: `${after.length} trade(s) were taken after the day was already down ₹${fmt(-lim)} or more. They netted ₹${fmt(after.reduce((s, t) => s + t.net, 0))}. The limit only protects you if you stop.`, evidence: `n = ${after.length}` }); }
    if (cap && plan.riskPct) { const big = T.filter((t) => t.risk != null && t.risk > cap * plan.riskPct / 100 * 1.1); if (big.length) add({ severity: 'high', strength: 'finding', title: 'Position risk above your plan', detail: `${big.length} trade(s) risked more than ${plan.riskPct}% of capital (₹${fmt(cap * plan.riskPct / 100)}) at the stop. Size from the stop distance before every entry.`, evidence: `n = ${big.length}` }); }
    // 6. Losses bigger than the stop
    const blown = T.filter((t) => t.R != null && t.R < -1.2); if (blown.length) add({ severity: blown.length >= 3 ? 'high' : 'medium', strength: blown.length >= 3 ? 'finding' : 'hint', title: 'Losses larger than the planned stop', detail: `${blown.length} loss(es) worse than −1.2R (worst ${Math.min(...blown.map((t) => t.R)).toFixed(2)}R). Causes: moving or not placing the stop, gaps, or slippage in illiquid contracts.`, evidence: `n = ${blown.length}` });
    // 7. Revenge / quick re-entry after a loss
    const quick = []; Object.values(byDay).forEach((ts) => { for (let i = 1; i < ts.length; i++) { const a = ts[i - 1], b = ts[i], ea = minutes(a.exitTime), eb = minutes(b.entryTime); if (a.net < 0 && ea != null && eb != null && eb - ea >= 0 && eb - ea <= 15) quick.push({ b, bigger: +b.qty > +a.qty }); } });
    const emoR = T.filter((t) => ['Revenge', 'Frustrated', 'FOMO'].includes(t.emotion));
    if (quick.length || emoR.length) { const set = [...new Set([...quick.map((q) => q.b), ...emoR])]; const tot = set.reduce((s, t) => s + t.net, 0); add({ severity: tot < 0 ? 'high' : 'medium', strength: set.length >= minGroup ? 'finding' : 'hint', title: 'Possible revenge trading', detail: `${quick.length} trade(s) entered within 15 minutes of a loss (${quick.filter((q) => q.bigger).length} with a larger size) and ${emoR.length} tagged Revenge/Frustrated/FOMO. Together they netted ₹${fmt(tot)}. A fixed 15–30 minute pause after any loss is a common rule.`, evidence: `n = ${set.length}` }); }
    // 8. Holding winners vs losers (disposition effect)
    const wd = T.filter((t) => t.net > 0 && t.dur != null).map((t) => t.dur), ld = T.filter((t) => t.net < 0 && t.dur != null).map((t) => t.dur);
    if (wd.length >= minGroup && ld.length >= minGroup && mean(ld) > mean(wd) * 1.3) add({ severity: 'medium', strength: welch(ld, wd) >= 2 ? 'finding' : 'hint', title: 'Holding losers longer than winners', detail: `Losing trades lasted ${mean(ld).toFixed(0)} min on average versus ${mean(wd).toFixed(0)} min for winners — the classic pattern of cutting winners early and hoping on losers (disposition effect; Shefrin & Statman, 1985).`, evidence: `winners n = ${wd.length}, losers n = ${ld.length}; Welch t = ${welch(ld, wd).toFixed(2)}` });
    // 9. Losing streak vs plan
    let run = 0, maxRun = 0; T.forEach((t) => { run = t.net < 0 ? run + 1 : 0; maxRun = Math.max(maxRun, run); });
    if (plan.maxConsecLosses && maxRun > plan.maxConsecLosses) add({ severity: 'medium', strength: 'finding', title: 'Losing streak longer than your stop-trading rule', detail: `Longest run: ${maxRun} consecutive losses; your plan says stop after ${plan.maxConsecLosses}. Streaks are normal even with an edge — the rule exists to stop tilt, so honour it.`, evidence: `${n} trades` });
    const rank = { high: 0, medium: 1, info: 2 }; out.sort((a, b) => rank[a.severity] - rank[b.severity]);
    return { n, insights: out, groups, metric: unit };
  }
  IA.coach = { insights, welch, mean, sd, hourBucket, weekday };
})(typeof window !== 'undefined' ? window : globalThis);
