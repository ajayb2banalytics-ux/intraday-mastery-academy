/* Paper-trading bot: runs a backtester rule set live, one bar at a time.
   Causal by construction — at bar i the entry signal is computed from candles[0..i] only (a prefix), and the
   per-bar logic is the backtester's own IA.bt.stepBar, so the bot and the backtester apply identical rules.
   The only forward-looking input is the session calendar (which bar closes the day), i.e. timestamps, never prices. */
(function (root) {
  const IA = (root.IA = root.IA || {});

  function create(candles, cfg, { startI = 1 } = {}) {
    const C = IA.bt.config(cfg);
    return { C, i: Math.max(1, startI), startI: Math.max(1, startI), S: IA.bt.newState(candles, C), log: [], done: false };
  }
  // Signal on bar i's close using only bars 0..i.
  function signalAt(candles, C, i) {
    if (C.signal) return !!C.signal[i];
    const pre = candles.slice(0, i + 1);
    return IA.bt.entrySignal(pre, C)[i];
  }
  function step(bot, candles) {
    if (bot.i >= candles.length) { bot.done = true; return []; }
    const i = bot.i, sig = signalAt(candles, bot.C, i);
    const ev = IA.bt.stepBar(bot.S, candles, bot.C, i, sig);
    ev.forEach((e) => bot.log.push(e));
    bot.i++; if (bot.i >= candles.length) bot.done = true;
    return ev;
  }
  // Advance n bars, or to the end of the current session with n = 'eod', or to the end with n = 'all'.
  function advance(bot, candles, n) {
    const out = []; if (bot.done) return out;
    const day = candles[bot.i] && candles[bot.i].d; let k = 0;
    while (!bot.done && (n === 'all' ? true : n === 'eod' ? candles[bot.i].d === day : k < n)) { out.push(...step(bot, candles)); k++; }
    return out;
  }
  function lastClose(bot, candles) { return candles[Math.max(0, bot.i - 1)].c; }
  function unrealised(bot, candles) { const p = bot.S.pos; if (!p) return 0; return bot.C.side * (lastClose(bot, candles) - p.entry) * p.qty; }
  function equity(bot, candles) { return bot.S.equity + unrealised(bot, candles); }
  function summary(bot) { return IA.bt.summarise(bot.S, bot.C); }

  const hm = (t) => new Date(t).toISOString().slice(11, 16);
  function describe(e, candles, C, fmt = (x) => x.toFixed(2)) {
    const b = candles[e.i], at = `${b.d} ${hm(b.t)}`, side = C.side > 0 ? 'BUY' : 'SELL SHORT';
    if (e.type === 'signal') return `${at} · entry conditions all true on the close → ${side} at the next bar's open`;
    if (e.type === 'entry') return `${at} · ${C.side > 0 ? 'bought' : 'shorted'} ${e.qty} @ ${fmt(e.price)} · stop ${fmt(e.stop)}${e.target != null ? ' · target ' + fmt(e.target) : ''}${e.partial ? ' (partial: volume cap)' : ''}`;
    if (e.type === 'exit') { const t = e.trade; return `${at} · exit by ${t.why} @ ${fmt(t.exit)} · net ${t.net >= 0 ? '+' : ''}${fmt(t.net)} (${t.R >= 0 ? '+' : ''}${t.R.toFixed(2)}R, costs ${fmt(t.costs)})`; }
    if (e.type === 'skip') return `${at} · signal ignored: ${e.why}`;
    return at;
  }
  IA.bot = { create, step, advance, signalAt, unrealised, equity, summary, describe, lastClose };
})(typeof window !== 'undefined' ? window : globalThis);
