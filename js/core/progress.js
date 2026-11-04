/* Progress, mastery and unlock rules (see docs/ARCHITECTURE.md §8). */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const PASS = 0.8;
  let P = null;
  const today = () => new Date().toISOString().slice(0, 10);
  async function load() { P = await IA.db.get('progress', null); if (!P) P = { lessons: {}, quizzes: {}, missed: {}, activity: {}, readiness: null, decisions: [] }; return P; }
  const save = () => IA.db.set('progress', P);
  function act(kind, n = 1) { const d = today(); P.activity[d] = P.activity[d] || {}; P.activity[d][kind] = (P.activity[d][kind] || 0) + n; }
  async function lessonCheck(id, correct, total) {
    const ok = correct === total; const prev = P.lessons[id];
    P.lessons[id] = { done: ok || !!prev?.done, ts: prev?.done ? prev.ts : ok ? Date.now() : null, last: correct / total, tries: (prev?.tries || 0) + 1 };
    if (ok && !prev?.done) act('lessons'); act('questions', total); await save(); return ok;
  }
  async function recordQuiz(moduleId, res) {
    const q = P.quizzes[moduleId] || { best: 0, attempts: 0, history: [] };
    q.best = Math.max(q.best, res.score); q.attempts++; q.last = res.score; q.history.push({ ts: Date.now(), score: res.score }); q.history = q.history.slice(-20);
    P.quizzes[moduleId] = q;
    res.answers.forEach((a) => { if (!a.ok) P.missed[a.id] = (P.missed[a.id] || 0) + 1; else if (P.missed[a.id]) P.missed[a.id] = Math.max(0, P.missed[a.id] - 1); });
    act('questions', res.total); await save();
  }
  const isDone = (id) => !!P?.lessons[id]?.done;
  function moduleState(m) {
    const total = m.lessons.length, done = m.lessons.filter((l) => isDone(l.id)).length, q = P.quizzes[m.id];
    return { total, done, best: q?.best || 0, attempts: q?.attempts || 0, mastered: (q?.best || 0) >= PASS, lessonPct: total ? done / total : 0 };
  }
  function levelState(n) {
    const lv = IA.content.levels.find((l) => l.n === n); const ms = lv.modules.map(moduleState);
    const avgBest = ms.reduce((a, m) => a + m.best, 0) / ms.length;
    return { n, mastered: ms.every((m) => m.mastered), avgBest, modules: ms, lessonsDone: ms.reduce((a, m) => a + m.done, 0), lessons: ms.reduce((a, m) => a + m.total, 0) };
  }
  function unlocked(n) { if (n <= 1) return true; const prev = levelState(n - 1); return prev.avgBest >= PASS && prev.modules.every((m) => m.best >= 0.6); }
  function currentLevel() { let lv = 1; for (const L of IA.content.levels) if (unlocked(L.n)) lv = L.n; return lv; }
  function trackState() {
    const out = {}; Object.keys(IA.content.tracks).forEach((t) => (out[t] = { lessons: 0, done: 0, quizSum: 0, quizN: 0 }));
    IA.content.lessonIndex().forEach((l) => { const o = out[l.track]; if (!o) return; o.lessons++; if (isDone(l.id)) o.done++; });
    IA.content.modulesFlat().forEach((m) => { const o = out[m.track]; if (o) { o.quizN++; o.quizSum += P.quizzes[m.id]?.best || 0; } });
    Object.values(out).forEach((o) => (o.score = o.lessons ? 0.5 * (o.done / o.lessons) + 0.5 * (o.quizN ? o.quizSum / o.quizN : 0) : 0));
    return out;
  }
  function overall() { const idx = IA.content.lessonIndex(), mods = IA.content.modulesFlat(); const ld = idx.filter((l) => isDone(l.id)).length; const qm = mods.reduce((a, m) => a + (P.quizzes[m.id]?.best || 0), 0) / mods.length; return { lessonsDone: ld, lessons: idx.length, quizAvg: qm, mastery: 0.5 * (ld / idx.length) + 0.5 * qm, mastered: mods.filter((m) => (P.quizzes[m.id]?.best || 0) >= PASS).length, modules: mods.length }; }
  function gaps() {
    const out = [];
    IA.content.modulesFlat().forEach((m) => { const q = P.quizzes[m.id]; if (q && q.best < PASS) out.push({ module: m, reason: `Best assessment ${Math.round(q.best * 100)}% (needs 80%)` }); });
    const missedQ = Object.entries(P.missed).filter(([, n]) => n > 0).map(([id]) => IA.content.questions.find((q) => q.id === id)).filter(Boolean);
    const byMod = {}; missedQ.forEach((q) => (byMod[q.module] = (byMod[q.module] || 0) + 1));
    Object.entries(byMod).sort((a, b) => b[1] - a[1]).forEach(([mid, n]) => { if (!out.some((g) => g.module.id === mid)) { const m = IA.content.modulesFlat().find((x) => x.id === mid); if (m) out.push({ module: m, reason: `${n} question(s) still answered wrongly` }); } });
    return out;
  }
  function nextLessons(k = 3) {
    const idx = IA.content.lessonIndex(), written = new Set(IA.content.lessons.map((l) => l.id)), lv = currentLevel();
    return idx.filter((l) => l.level <= lv && written.has(l.id) && !isDone(l.id)).slice(0, k);
  }
  function streak() { let s = 0; const d = new Date(); for (;;) { const k = d.toISOString().slice(0, 10); if (P.activity[k]) { s++; d.setUTCDate(d.getUTCDate() - 1); } else break; } return s; }
  async function setReadiness(r) { P.readiness = r; await save(); }
  // Spaced repetition: every answered bank / lesson-check question updates the review schedule (see engines/srs.js).
  async function answer(id, ok) { if (!P || !id || !IA.srs || !IA.srs.resolve(id)) return; P.srs = IA.srs.record(P.srs || IA.srs.empty(), id, ok); await save(); }
  const srsState = () => P?.srs || (IA.srs ? IA.srs.empty() : { items: {} });
  async function addDecision(d) { P.decisions.push(d); P.decisions = P.decisions.slice(-500); act('decisions'); await save(); }
  IA.progress = { answer, srsState, load, save, lessonCheck, recordQuiz, isDone, moduleState, levelState, unlocked, currentLevel, trackState, overall, gaps, nextLessons, streak, setReadiness, addDecision, PASS, get state() { return P; }, today };
})(typeof window !== 'undefined' ? window : globalThis);
