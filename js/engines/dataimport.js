/* Historical OHLCV import + validation. Pure (needs IA.clock and IA.specsDefault/IA.specs for sessions).
   Output candles follow the app convention: t = exchange-local wall-clock time encoded as a UTC epoch,
   d = exchange-local date (YYYY-MM-DD). Every row-level decision is recorded in the report. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };
  const SYN = {
    datetime: ['datetime', 'timestamp', 'date time', 'date_time', 'time stamp'],
    date: ['date', 'date1', 'trade date', 'tradedate', 'day', 'timestamp_date'],
    time: ['time', 'trade time', 'bar time'],
    open: ['open', 'open price', 'open_price', 'o'],
    high: ['high', 'high price', 'high_price', 'h'],
    low: ['low', 'low price', 'low_price', 'l'],
    close: ['close', 'close price', 'close_price', 'c', 'last', 'ltp', 'last price'],
    adjclose: ['adj close', 'adj_close', 'adjusted close', 'adjclose'],
    volume: ['volume', 'vol', 'v', 'shares traded', 'ttl_trd_qnty', 'total traded quantity', 'qty', 'quantity', 'tottrdqty'],
    symbol: ['symbol', 'ticker', 'instrument', 'tradingsymbol', 'sc_name'],
    series: ['series'],
  };
  function splitCsv(text) {
    text = text.replace(/^﻿/, '');
    const first = text.split(/\r?\n/).find((l) => l.trim()) || '';
    const delim = [',', ';', '\t', '|'].sort((a, b) => first.split(b).length - first.split(a).length)[0];
    const rows = []; let row = [], f = '', q = false;
    for (let i = 0; i < text.length; i++) { const ch = text[i]; if (q) { if (ch === '"' && text[i + 1] === '"') { f += '"'; i++; } else if (ch === '"') q = false; else f += ch; } else if (ch === '"') q = true; else if (ch === delim) { row.push(f); f = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; } else f += ch; }
    if (f !== '' || row.length) { row.push(f); rows.push(row); }
    return { rows: rows.filter((r) => r.some((c) => String(c).trim() !== '')), delim };
  }
  function mapHeader(hd) {
    const norm = hd.map((x) => String(x).trim().toLowerCase().replace(/\s+/g, ' ').replace(/[."]/g, ''));
    const idx = {}; for (const [k, names] of Object.entries(SYN)) { for (const nm of names) { const i = norm.indexOf(nm); if (i >= 0 && !Object.values(idx).includes(i)) { idx[k] = i; break; } } }
    if (idx.datetime === undefined && idx.date === undefined && norm.includes('time')) { idx.datetime = norm.indexOf('time'); delete idx.time; }
    if (idx.date !== undefined && idx.time === idx.date) delete idx.time;
    return { idx, norm };
  }
  const num = (s) => { if (s === undefined || s === null) return NaN; const t = String(s).trim().replace(/[,₹$\s]/g, ''); if (t === '' || t === '-' || /^n\/?a$/i.test(t) || /^null$/i.test(t)) return NaN; return Number(t); };
  // Parse date (+optional time) → {y,m,d,h,mi,s, instant?:ms, offsetKnown:boolean}
  function parseDateTime(ds, ts, order) {
    let s = String(ds).trim(); if (ts) s += ' ' + String(ts).trim();
    if (/^\d{10}(\.\d+)?$/.test(s)) return { instant: Math.round(+s * 1000) };
    if (/^\d{13}$/.test(s)) return { instant: +s };
    let m;
    const time = (rest) => { const tm = String(rest || '').trim().match(/^(?:T|\s)?(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?\s*(am|pm)?\s*(Z|[+-]\d{2}:?\d{2})?$/i); if (!rest || !String(rest).trim()) return { h: 0, mi: 0, s: 0 }; if (!tm) return null; let h = +tm[1]; if (tm[4]) { const pm = tm[4].toLowerCase() === 'pm'; if (h === 12) h = pm ? 12 : 0; else if (pm) h += 12; } let off = null; if (tm[5]) off = tm[5].toUpperCase() === 'Z' ? 0 : (tm[5][0] === '-' ? -1 : 1) * (+tm[5].slice(1, 3) * 60 + +tm[5].slice(-2)); return { h, mi: +tm[2], s: +(tm[3] || 0), off }; };
    if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(.*)$/))) { const t = time(m[4]); if (!t) return null; return fin(+m[1], +m[2], +m[3], t); }
    if ((m = s.match(/^(\d{1,2})[-\s/]([A-Za-z]{3,4})[-\s/,]+(\d{2,4})(.*)$/))) { const mo = MON[m[2].toLowerCase()]; if (!mo) return null; const t = time(m[4]); if (!t) return null; return fin(yr(m[3]), mo, +m[1], t); }
    if ((m = s.match(/^([A-Za-z]{3,4})\s+(\d{1,2}),?\s+(\d{4})(.*)$/))) { const mo = MON[m[1].toLowerCase()]; if (!mo) return null; const t = time(m[4]); if (!t) return null; return fin(+m[3], mo, +m[2], t); }
    if ((m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})(.*)$/))) { const t = time(m[4]); if (!t) return null; const a = +m[1], b = +m[2]; const dm = order === 'mdy' ? [b, a] : [a, b]; return fin(yr(m[3]), dm[1], dm[0], t); }
    if ((m = s.match(/^(\d{4})(\d{2})(\d{2})(.*)$/))) { const t = time(m[4]); if (!t) return null; return fin(+m[1], +m[2], +m[3], t); }
    return null;
    function yr(y) { y = +y; return y < 100 ? (y < 70 ? 2000 + y : 1900 + y) : y; }
    function fin(y, mo, d, t) { if (mo < 1 || mo > 12 || d < 1 || d > 31 || t.h > 23 || t.mi > 59) return null; const chk = new Date(Date.UTC(y, mo - 1, d)); if (chk.getUTCDate() !== d) return null; const r = { y, m: mo, d, h: t.h, mi: t.mi, s: t.s }; if (t.off !== null && t.off !== undefined) r.instant = Date.UTC(y, mo - 1, d, t.h, t.mi, t.s) - t.off * 60000; return r; }
  }
  function detectOrder(samples) { // dmy vs mdy for numeric dates
    let a12 = false, b12 = false; samples.forEach((s) => { const m = String(s).trim().match(/^(\d{1,2})[-/.](\d{1,2})[-/.]\d{2,4}/); if (m) { if (+m[1] > 12) a12 = true; if (+m[2] > 12) b12 = true; } });
    if (b12 && !a12) return { order: 'mdy', ambiguous: false }; if (a12 && !b12) return { order: 'dmy', ambiguous: false };
    return { order: 'dmy', ambiguous: samples.some((s) => /^\d{1,2}[-/.]\d{1,2}[-/.]/.test(String(s).trim())) };
  }
  const pad = (n) => String(n).padStart(2, '0');
  function toLocal(p, sourceTz, exTz) {
    // returns {t (wall-clock as UTC epoch), d}
    let inst = p.instant;
    if (inst === undefined) inst = sourceTz === 'UTC' ? Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) : IA.clock.zonedToUtc(`${p.y}-${pad(p.m)}-${pad(p.d)}`, `${pad(p.h)}:${pad(p.mi)}`, sourceTz).getTime() + p.s * 1000;
    const q = IA.clock.parts(new Date(inst), exTz);
    return { t: Date.UTC(q.y, q.m - 1, q.d, q.h, q.mi, q.s), d: `${q.y}-${pad(q.m)}-${pad(q.d)}`, inst };
  }
  const minOfDay = (t) => { const d = new Date(t); return d.getUTCHours() * 60 + d.getUTCMinutes(); };
  const hm2m = (s) => +s.slice(0, 2) * 60 + +s.slice(3, 5);

  function importCsv(text, opt = {}) {
    const specs = IA.specs || IA.specsDefault;
    const O = Object.assign({ exchange: 'NSE', sourceTz: null, ohlcPolicy: 'drop', symbol: null, outsideSession: 'keep', jumpPct: 15, dateOrder: 'auto' }, opt);
    const sess = specs.sessions.find((s) => s.id === O.exchange) || null; const exTz = sess ? sess.tz : (O.exchangeTz || 'UTC');
    const srcTz = O.sourceTz || exTz;
    const R = { exchange: O.exchange, exchangeTz: exTz, sourceTz: srcTz, issues: [], counts: { rows: 0, kept: 0, badDate: 0, badPrice: 0, badOHLC: 0, repairedOHLC: 0, negVolume: 0, noVolume: 0, dupIdentical: 0, dupConflict: 0, outOfOrder: 0, outsideSession: 0, droppedOutside: 0, zeroRange: 0, jumps: 0, otherSymbols: 0, otherSeries: 0 }, warnings: [] };
    const issue = (sev, row, msg) => { if (R.issues.length < 400) R.issues.push({ sev, row, msg }); };
    const { rows, delim } = splitCsv(text); R.delimiter = delim === '\t' ? 'tab' : delim;
    if (rows.length < 2) return { error: 'File has no data rows.', report: R };
    const { idx, norm } = mapHeader(rows[0]); R.columns = norm;
    if (idx.datetime === undefined && idx.date === undefined) return { error: 'No date/datetime column found. Expected a header such as Date, Datetime, Timestamp or time.', report: R };
    for (const k of ['open', 'high', 'low', 'close']) if (idx[k] === undefined) return { error: `Missing required column: ${k}. Found: ${norm.join(', ')}`, report: R };
    if (idx.volume === undefined) { R.warnings.push('No volume column — volume set to 0; VWAP, volume profile and volume-based signals will not work.'); }
    if (idx.adjclose !== undefined) R.warnings.push('File contains an adjusted close. OHLC used as given (unadjusted); adjusted and unadjusted series differ around dividends and splits.');
    const body = rows.slice(1);
    // symbol / series filtering
    if (idx.symbol !== undefined) { const syms = [...new Set(body.map((r) => String(r[idx.symbol] || '').trim()).filter(Boolean))]; R.symbols = syms; if (syms.length > 1) { const pick = O.symbol && syms.includes(O.symbol) ? O.symbol : syms[0]; R.warnings.push(`File has ${syms.length} symbols; imported ${pick} only. Others: ${syms.filter((s) => s !== pick).slice(0, 8).join(', ')}${syms.length > 9 ? '…' : ''}`); R.symbol = pick; } else R.symbol = syms[0]; }
    const dateCol = idx.datetime !== undefined ? idx.datetime : idx.date;
    const ord = O.dateOrder === 'auto' ? detectOrder(body.slice(0, 500).map((r) => r[dateCol])) : { order: O.dateOrder, ambiguous: false };
    R.dateOrder = ord.order; if (ord.ambiguous) R.warnings.push('Numeric dates are ambiguous (no day > 12 seen). Assumed DD-MM-YYYY (Indian convention). Change "Date order" if your file is MM-DD-YYYY.');
    let out = [], explicitTz = 0, naive = 0;
    body.forEach((r, k) => {
      const rowNo = k + 2; R.counts.rows++;
      if (R.symbol && idx.symbol !== undefined && String(r[idx.symbol] || '').trim() !== R.symbol) { R.counts.otherSymbols++; return; }
      if (idx.series !== undefined) { const s = String(r[idx.series] || '').trim().toUpperCase(); if (s && !['EQ', 'BE', 'BZ', 'SM', 'ST'].includes(s) && s !== (O.series || 'EQ')) { R.counts.otherSeries++; return; } }
      const p = parseDateTime(r[dateCol], idx.time !== undefined && idx.datetime === undefined ? r[idx.time] : '', ord.order);
      if (!p) { R.counts.badDate++; issue('error', rowNo, `Unreadable date/time "${r[dateCol]}${idx.time !== undefined ? ' ' + r[idx.time] : ''}" — row dropped`); return; }
      if (p.instant !== undefined) explicitTz++; else naive++;
      let o = num(r[idx.open]), h = num(r[idx.high]), l = num(r[idx.low]), c = num(r[idx.close]);
      let v = idx.volume !== undefined ? num(r[idx.volume]) : 0;
      if (![o, h, l, c].every((x) => Number.isFinite(x) && x > 0)) { R.counts.badPrice++; issue('error', rowNo, `Missing, zero or negative price (O ${r[idx.open]} H ${r[idx.high]} L ${r[idx.low]} C ${r[idx.close]}) — row dropped`); return; }
      if (h < Math.max(o, c) || l > Math.min(o, c) || h < l) {
        if (O.ohlcPolicy === 'repair') { const H = Math.max(o, h, l, c), L = Math.min(o, h, l, c); h = H; l = L; R.counts.repairedOHLC++; issue('warn', rowNo, 'High/low inconsistent with open/close — repaired to max/min of the four prices'); }
        else { R.counts.badOHLC++; issue('error', rowNo, `OHLC inconsistent (H ${h} < max(O,C) or L ${l} > min(O,C)) — row dropped`); return; }
      }
      if (idx.volume !== undefined && !Number.isFinite(v)) { R.counts.noVolume++; v = 0; }
      if (v < 0) { R.counts.negVolume++; issue('error', rowNo, `Negative volume ${v} — set to 0`); v = 0; }
      if (h === l) R.counts.zeroRange++;
      const loc = toLocal(p, srcTz, exTz);
      out.push({ t: loc.t, d: loc.d, o, h, l, c, v, _row: rowNo });
    });
    if (explicitTz && naive) R.warnings.push('Mixed timestamps: some rows carry a time-zone offset or epoch, others are naive. Naive rows were read in ' + srcTz + '.');
    R.timestampKind = explicitTz && !naive ? 'absolute (epoch/offset)' : naive && !explicitTz ? `naive local, interpreted as ${srcTz}` : 'mixed';
    // order
    for (let i = 1; i < out.length; i++) if (out[i].t < out[i - 1].t) { R.counts.outOfOrder++; }
    if (R.counts.outOfOrder) { R.warnings.push(`${R.counts.outOfOrder} row(s) out of chronological order — data sorted ascending.`); out.sort((a, b) => a.t - b.t || a._row - b._row); }
    // duplicates
    const dd = []; for (const b of out) { const prev = dd[dd.length - 1]; if (prev && prev.t === b.t) { if (prev.o === b.o && prev.h === b.h && prev.l === b.l && prev.c === b.c && prev.v === b.v) { R.counts.dupIdentical++; issue('info', b._row, `Exact duplicate of row ${prev._row} — removed`); } else { R.counts.dupConflict++; issue('warn', b._row, `Same timestamp as row ${prev._row} with different values — kept the first, dropped this one`); } continue; } dd.push(b); }
    out = dd;
    if (!out.length) return { error: 'No valid rows after validation.', report: R };
    // timeframe inference
    const intra = out.some((b) => minOfDay(b.t) !== 0) && new Set(out.map((b) => b.d)).size < out.length;
    const diffs = []; for (let i = 1; i < out.length; i++) if (out[i].d === out[i - 1].d) diffs.push((out[i].t - out[i - 1].t) / 60000);
    let tf; if (!intra || !diffs.length) tf = 1440; else { const cnt = {}; diffs.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1)); tf = +Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0]; }
    R.tfMin = tf; R.tfLabel = tf >= 1440 ? 'Daily' : tf >= 60 ? `${tf / 60}h` : `${tf} min`;
    if (tf < 1440) { const off = diffs.filter((x) => x % tf !== 0).length; if (off) { R.mixedTf = off; R.warnings.push(`${off} intraday interval(s) are not a multiple of the inferred ${tf}-minute timeframe — the file may mix timeframes.`); } }
    // session checks (intraday only)
    R.missing = []; R.missingCount = 0;
    if (tf < 1440 && sess) {
      const open = hm2m(sess.main[0][0]), close = hm2m(sess.main[sess.main.length - 1][1]); const pre = sess.pre ? hm2m(sess.pre[0]) : open, post = sess.post ? hm2m(sess.post[1]) : close;
      const outside = out.filter((b) => { const m = minOfDay(b.t); return m < open || m >= close; });
      R.counts.outsideSession = outside.length;
      if (outside.length) {
        const frac = outside.length / out.length;
        if (frac > 0.5) { // likely wrong time zone — try candidate shifts
          R.warnings.push(`${Math.round(frac * 100)}% of bars fall outside ${sess.name} regular hours (${sess.main.map((x) => x.join('–')).join(', ')} ${exTz}). The source time zone is probably wrong — re-import with the correct "Timestamps are in" setting (e.g. UTC).`);
          R.tzSuspect = true;
        } else R.warnings.push(`${outside.length} bar(s) fall outside regular hours (pre/post-market or auction prints).${O.outsideSession === 'drop' ? ' Dropped.' : ' Kept.'}`);
        if (O.outsideSession === 'drop') { const set = new Set(outside); out = out.filter((b) => !set.has(b)); R.counts.droppedOutside = outside.length; }
      }
      // missing candles inside the regular session, per day
      const byDay = {}; out.forEach((b) => (byDay[b.d] = byDay[b.d] || []).push(b));
      const breaks = sess.main.slice(1).map((m, k) => [hm2m(sess.main[k][1]), hm2m(m[0])]);
      const inBreak = (m) => breaks.some(([a, b]) => m >= a && m < b);
      Object.entries(byDay).forEach(([d, bs]) => {
        const have = new Set(bs.map((b) => minOfDay(b.t)));
        const firstM = Math.min(...have), lastM = Math.max(...have);
        // Only check between the first and last bar actually present that day (partial days are reported separately)
        let miss = 0; for (let m = Math.max(open, firstM); m <= Math.min(close - tf, lastM); m += tf) if (!have.has(m) && !inBreak(m)) { miss++; if (R.missing.length < 50) R.missing.push(`${d} ${pad(Math.floor(m / 60))}:${pad(m % 60)}`); }
        R.missingCount += miss;
        const expected = Math.floor((close - open) / tf) - breaks.reduce((a, [x, y]) => a + Math.floor((y - x) / tf), 0);
        const inSess = bs.filter((b) => { const m = minOfDay(b.t); return m >= open && m < close; }).length;
        if (inSess < expected * 0.6) issue('warn', null, `${d}: only ${inSess} of ~${expected} regular-session bars (partial day, half-day or data gap)`);
      });
      if (R.missingCount) R.warnings.push(`${R.missingCount} missing candle(s) inside sessions (first: ${R.missing.slice(0, 3).join(', ')}). Indicators and replay will treat adjacent bars as consecutive; no candles were invented.`);
    }
    if (tf >= 1440) { const ds = out.map((b) => b.d); let gaps = 0; for (let i = 1; i < ds.length; i++) { let x = new Date(ds[i - 1] + 'T00:00:00Z'); const y = new Date(ds[i] + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + 1); while (x < y) { const w = x.getUTCDay(); if (w !== 0 && w !== 6) { gaps++; if (R.missing.length < 50) R.missing.push(x.toISOString().slice(0, 10)); } x.setUTCDate(x.getUTCDate() + 1); } } R.missingCount = gaps; if (gaps) R.warnings.push(`${gaps} weekday(s) with no bar (first: ${R.missing.slice(0, 3).join(', ')}). Most are exchange holidays — check against your exchange calendar.`); out.forEach((b) => { b.t = Date.UTC(+b.d.slice(0, 4), +b.d.slice(5, 7) - 1, +b.d.slice(8, 10)); }); }
    // suspicious jumps
    for (let i = 1; i < out.length; i++) { const j = Math.abs(out[i].o / out[i - 1].c - 1) * 100; if (j >= O.jumpPct) { R.counts.jumps++; issue('warn', out[i]._row, `${j.toFixed(1)}% jump from previous close ${out[i - 1].c} to open ${out[i].o} — split/bonus, wrong symbol, or a genuine gap. Check before trusting indicators across it.`); } }
    if (R.counts.zeroRange > out.length * 0.2) R.warnings.push(`${R.counts.zeroRange} bars have high = low — the instrument may be illiquid or the file may contain only closes.`);
    if (R.counts.badDate + R.counts.badPrice + R.counts.badOHLC > 0) R.warnings.push(`${R.counts.badDate + R.counts.badPrice + R.counts.badOHLC} row(s) dropped for invalid date, price or OHLC.`);
    out.forEach((b) => delete b._row);
    R.counts.kept = out.length; R.from = out[0].d; R.to = out[out.length - 1].d; R.sessions = new Set(out.map((b) => b.d)).size;
    R.quality = R.counts.badOHLC + R.counts.badPrice + R.counts.badDate + R.counts.dupConflict === 0 && !R.tzSuspect && R.missingCount <= Math.max(2, out.length * 0.01) ? 'good' : R.tzSuspect ? 'check time zone' : 'usable with issues';
    return { candles: out, report: R };
  }
  // Resample to a higher timeframe within sessions (for MTF and for importing 1-min data)
  function resample(c, tfMin) {
    if (tfMin >= 1440) return IA.gen.aggregate(c, 1e9).map((b) => ({ ...b, t: Date.UTC(+b.d.slice(0, 4), +b.d.slice(5, 7) - 1, +b.d.slice(8, 10)) }));
    const out = []; let cur = null, key = null;
    for (const b of c) { const m = Math.floor(minOfDay(b.t) / tfMin) * tfMin; const k = b.d + '|' + m; if (k !== key) { if (cur) out.push(cur); key = k; cur = { t: Date.UTC(+b.d.slice(0, 4), +b.d.slice(5, 7) - 1, +b.d.slice(8, 10), 0, m), d: b.d, o: b.o, h: b.h, l: b.l, c: b.c, v: b.v }; } else { cur.h = Math.max(cur.h, b.h); cur.l = Math.min(cur.l, b.l); cur.c = b.c; cur.v += b.v; } }
    if (cur) out.push(cur); return out;
  }
  IA.dataimport = { importCsv, parseDateTime, splitCsv, mapHeader, detectOrder, resample };
})(typeof window !== 'undefined' ? window : globalThis);
