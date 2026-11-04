/* Spaced-repetition review (Leitner boxes). Pure engine — no DOM, no storage.
   A question enters the queue the first time you answer it wrongly (box 0, due in 1 day).
   Each correct review moves it up one box: due again after 3, 7, 16, then 35 days; a correct answer in the last box
   graduates it. A wrong answer at any point sends it back to box 0. Questions you have never missed are not queued. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const DAY = 86400000, INTERVALS = [1, 3, 7, 16, 35];
  const empty = () => ({ items: {} });
  function record(state, id, ok, now = Date.now()) {
    const s = state || empty(), it = s.items[id];
    if (!ok) { s.items[id] = { box: 0, due: now + INTERVALS[0] * DAY, lapses: (it?.lapses || 0) + 1, reviews: (it?.reviews || 0) + 1, last: now, graduated: false }; return s; }
    if (!it || it.graduated) return s; // never missed (or already learnt): nothing to schedule
    const box = it.box + 1;
    if (box >= INTERVALS.length) s.items[id] = { ...it, box, graduated: true, due: null, reviews: it.reviews + 1, last: now };
    else s.items[id] = { ...it, box, due: now + INTERVALS[box] * DAY, reviews: it.reviews + 1, last: now };
    return s;
  }
  function due(state, now = Date.now()) { return Object.entries((state || empty()).items).filter(([, v]) => !v.graduated && v.due <= now).sort((a, b) => a[1].due - b[1].due).map(([id]) => id); }
  function stats(state, now = Date.now()) {
    const v = Object.values((state || empty()).items), active = v.filter((x) => !x.graduated);
    const nextDue = active.filter((x) => x.due > now).reduce((m, x) => Math.min(m, x.due), Infinity);
    return { queued: active.length, due: active.filter((x) => x.due <= now).length, graduated: v.length - active.length, byBox: INTERVALS.map((_, b) => active.filter((x) => x.box === b).length), nextDue: isFinite(nextDue) ? nextDue : null };
  }
  // Resolve an id to a question: module-bank ids (L1-M2-q03) or lesson-check ids (<lessonId>-c<index>).
  function resolve(id) {
    const C = IA.content || {}; const q = (C.questions || []).find((x) => x.id === id); if (q) return { ...q, source: q.module };
    const m = /^(.+)-c(\d+)$/.exec(id); if (!m) return null; const l = (C.lessons || []).find((x) => x.id === m[1]); const c = l?.check?.[+m[2]];
    return c ? { ...c, id, source: l.title, lessonId: l.id } : null;
  }
  IA.srs = { INTERVALS, DAY, empty, record, due, stats, resolve };
})(typeof window !== 'undefined' ? window : globalThis);
