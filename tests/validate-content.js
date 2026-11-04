/* Content schema validator. Run: node tests/validate-content.js [file ...]
   With no args validates every js/content/*.js file and curriculum coverage. */
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'js', 'content');
const args = process.argv.slice(2);
require(path.join(dir, 'curriculum.js'));
const files = args.length ? args : fs.readdirSync(dir).filter((f) => f.endsWith('.js') && f !== 'curriculum.js').map((f) => path.join(dir, f));
const errs = [], warns = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  if (/\$\{/.test(src.replace(/\\\$\{/g, ''))) warns.push(`${path.basename(f)}: contains "\${" — template interpolation risk`);
  try { require(path.resolve(f)); } catch (e) { errs.push(`${path.basename(f)}: does not load → ${e.message}`); }
}
const C = globalThis.IA.content;
const idx = C.lessonIndex(), ids = new Set(idx.map((l) => l.id));
const REQ = ['Beginner view', 'Intermediate view', 'Advanced view', 'Common misconceptions', 'When it fails', 'Exercise'];
const seen = new Set();
C.lessons.forEach((l) => {
  const p = `lesson ${l.id}`;
  if (seen.has(l.id)) errs.push(`${p}: duplicate id`); seen.add(l.id);
  if (!ids.has(l.id)) errs.push(`${p}: id not in curriculum`);
  const meta = idx.find((x) => x.id === l.id);
  if (meta && l.module !== meta.module) errs.push(`${p}: module ${l.module} ≠ curriculum ${meta.module}`);
  ['title', 'summary'].forEach((k) => { if (!l[k]) errs.push(`${p}: missing ${k}`); });
  if (!Array.isArray(l.sections)) { errs.push(`${p}: sections missing`); return; }
  const hs = l.sections.map((s) => s.h);
  REQ.forEach((h) => { if (!hs.includes(h)) errs.push(`${p}: missing section "${h}"`); });
  const words = l.sections.reduce((a, s) => a + String(s.md || '').split(/\s+/).length, 0);
  if (words < 450) errs.push(`${p}: only ${words} words (min 450)`);
  if (!Array.isArray(l.check) || l.check.length < 2) errs.push(`${p}: needs ≥2 check questions`);
  (l.check || []).forEach((q, i) => { if (!Array.isArray(q.o) || q.o.length < 3 || !(q.a >= 0 && q.a < q.o.length) || !q.why) errs.push(`${p}: check[${i}] malformed`); });
  if (!['established', 'mixed', 'subjective', 'speculative'].includes(l.evidence)) errs.push(`${p}: evidence label invalid (${l.evidence})`);
  if (/`/.test(JSON.stringify(l))) errs.push(`${p}: contains a backtick (use {{code}})`);
});
const qids = new Set();
C.questions.forEach((q) => {
  const p = `question ${q.id}`;
  if (qids.has(q.id)) errs.push(`${p}: duplicate`); qids.add(q.id);
  if (!C.modulesFlat().some((m) => m.id === q.module) && q.module !== 'READINESS') errs.push(`${p}: unknown module ${q.module}`);
  if (!Array.isArray(q.o) || q.o.length < 3 || !(q.a >= 0 && q.a < q.o.length) || !q.why) errs.push(`${p}: malformed`);
});
// Coverage report
const byMod = {}; C.questions.forEach((q) => (byMod[q.module] = (byMod[q.module] || 0) + 1));
const written = new Set(C.lessons.map((l) => l.id));
const missingLessons = idx.filter((l) => !written.has(l.id));
const thinModules = C.modulesFlat().filter((m) => (byMod[m.id] || 0) < 10);
if (C.indicators) C.indicators.forEach((x) => { ['definition', 'purpose', 'formula', 'calc', 'interpretation', 'bullish', 'bearish', 'example', 'entryExit', 'bestConditions', 'weaknesses', 'mistakes', 'timeframes', 'combinations', 'practice'].forEach((k) => { if (!x[k]) errs.push(`indicator ${x.id}: missing ${k}`); }); });
if (C.strategies) C.strategies.forEach((x) => { ['concept', 'logic', 'markets', 'timeframes', 'indicators', 'setup', 'entry', 'confirmation', 'stop', 'target', 'sizing', 'rr', 'exits', 'management', 'winExample', 'loseExample', 'failure', 'mistakes', 'backtest'].forEach((k) => { if (!x[k]) errs.push(`strategy ${x.id}: missing ${k}`); }); });
if (C.patterns) C.patterns.forEach((x) => { ['formation', 'psychology', 'context', 'confirmation', 'entry', 'stop', 'target', 'failure'].forEach((k) => { if (!x[k]) errs.push(`pattern ${x.id}: missing ${k}`); }); if (!Array.isArray(x.bars) || !x.bars.length) errs.push(`pattern ${x.id}: bars missing`); (x.bars || []).forEach((b, i) => { if (b.length !== 4 || b[1] < Math.max(b[0], b[3]) || b[2] > Math.min(b[0], b[3])) errs.push(`pattern ${x.id}: bar ${i} invalid OHLC ${b}`); }); });
const out = { errors: errs, warnings: warns, lessonsWritten: written.size, lessonsPlanned: idx.length, missingLessons: missingLessons.map((l) => l.id), questions: C.questions.length, thinModules: thinModules.map((m) => `${m.id}(${byMod[m.id] || 0})`), indicators: (C.indicators || []).length, strategies: (C.strategies || []).length, patterns: (C.patterns || []).length };
if (require.main === module) {
  errs.forEach((e) => console.log('ERROR', e)); warns.forEach((w) => console.log('WARN ', w));
  console.log(JSON.stringify({ ...out, errors: errs.length, warnings: warns.length, missingLessons: args.length ? '(n/a)' : out.missingLessons.length }, null, 1));
  process.exit(errs.length ? 1 : 0);
}
module.exports = out;
