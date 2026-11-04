/* Time-zone maths using the browser's IANA database (DST-safe; no fixed offsets). */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const fmtCache = {};
  function parts(date, tz) {
    const f = fmtCache[tz] || (fmtCache[tz] = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short' }));
    const o = {}; f.formatToParts(date).forEach((p) => (o[p.type] = p.value));
    return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour, mi: +o.minute, s: +o.second, wd: o.weekday };
  }
  function offsetMin(date, tz) { // tz offset from UTC in minutes at this instant
    const p = parts(date, tz); const asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s);
    return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
  }
  // UTC instant for wall-clock "YYYY-MM-DD HH:MM" in tz (iterative, handles DST)
  function zonedToUtc(ymd, hm, tz) {
    const [y, m, d] = ymd.split('-').map(Number), [h, mi] = hm.split(':').map(Number);
    let guess = Date.UTC(y, m - 1, d, h, mi);
    for (let i = 0; i < 3; i++) guess = Date.UTC(y, m - 1, d, h, mi) - offsetMin(new Date(guess), tz) * 60000;
    return new Date(guess);
  }
  function localYmd(date, tz) { const p = parts(date, tz); return `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`; }
  function fmt(date, tz, opts = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) { return new Intl.DateTimeFormat('en-GB', { timeZone: tz, ...opts }).format(date); }

  // Status of an exchange session at instant `now`
  function sessionStatus(sess, now = new Date(), holidays = []) {
    const ymd = localYmd(now, sess.tz), wd = parts(now, sess.tz).wd;
    const weekend = wd === 'Sat' || wd === 'Sun', holiday = holidays.includes(ymd);
    const at = (hm) => zonedToUtc(ymd, hm, sess.tz).getTime(), t = now.getTime();
    let state = 'closed', label = weekend ? 'Weekend' : holiday ? 'Holiday' : 'Closed';
    if (!weekend && !holiday) {
      if (sess.pre && t >= at(sess.pre[0]) && t < at(sess.pre[1])) { state = 'pre'; label = 'Pre-market'; }
      sess.main.forEach(([a, b], k) => { if (t >= at(a) && t < at(b)) { state = 'open'; label = 'Open'; } else if (k > 0 && t >= at(sess.main[k - 1][1]) && t < at(a)) { state = 'break'; label = 'Lunch break'; } });
      if (sess.post && t >= at(sess.post[0]) && t < at(sess.post[1]) && state === 'closed') { state = 'post'; label = 'Post-market'; }
    }
    return { state, label, localTime: fmt(now, sess.tz), localDate: ymd, weekday: wd };
  }
  // Main-session intervals (UTC ms) for a given local date — used for overlap bars
  function sessionWindowsUtc(sess, ymd) {
    return sess.main.map(([a, b]) => [zonedToUtc(ymd, a, sess.tz).getTime(), zonedToUtc(ymd, b, sess.tz).getTime()]);
  }
  IA.clock = { parts, offsetMin, zonedToUtc, localYmd, fmt, sessionStatus, sessionWindowsUtc };
})(typeof window !== 'undefined' ? window : globalThis);
