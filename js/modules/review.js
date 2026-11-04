/* Spaced-repetition review page (#/review). Questions you missed come back after 1, 3, 7, 16 and 35 days. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const { h, table } = IA.ui;
  const fmtDue = (t) => { if (!t) return '—'; const d = Math.round((t - Date.now()) / 3600000); return d <= 0 ? 'now' : d < 24 ? `in ${d} h` : `in ${Math.round(d / 24)} day(s)`; };
  // Small card reused on the dashboard and the Assessments page.
  IA.reviewCard = function () {
    const st = IA.srs.stats(IA.progress.srsState());
    return h('a', { class: 'card card-link', href: '#/review' }, h('h3', null, 'Spaced review'), st.queued || st.graduated ? h('p', { class: 'small' }, h('b', { class: st.due ? 'warn' : 'up' }, `${st.due} due now`), ` · ${st.queued} in the queue · ${st.graduated} learnt${st.nextDue && !st.due ? ` · next ${fmtDue(st.nextDue)}` : ''}`) : h('p', { class: 'small muted' }, 'Questions you get wrong in lessons and assessments come back here after 1, 3, 7, 16 and 35 days until you know them.'));
  };
  IA.views.review = (el) => {
    const S = () => IA.progress.srsState(), st = IA.srs.stats(S());
    el.append(h('p', { class: 'muted' }, 'Every question you answer wrongly — in a lesson check or a module assessment — enters this queue. Answer it correctly when it is due and it moves up a box: back in 3, 7, 16, then 35 days, after which it counts as learnt. A wrong answer sends it back to the start. Short, regular reviews beat long cramming sessions.'));
    el.append(h('div', { class: 'grid g4 kpis' }, [['Due now', st.due], ['In the queue', st.queued], ['Learnt', st.graduated], ['Next due', st.due ? 'now' : fmtDue(st.nextDue)]].map(([l, v]) => h('div', { class: 'card kpi' }, h('span', { class: 'l' }, l), h('span', { class: 'v' }, String(v))))));
    el.append(h('div', { class: 'card', style: { marginTop: '12px' } }, h('h3', null, 'Boxes'), table([{ label: 'Box', get: (r) => `Box ${r.b + 1}` }, { label: 'Next interval', get: (r) => `${IA.srs.INTERVALS[r.b]} day(s)`, n: 1 }, { label: 'Questions', get: (r) => r.n, n: 1 }], st.byBox.map((n, b) => ({ b, n })))));
    const area = h('div', { class: 'card', style: { marginTop: '12px' } }); el.append(area);
    const ids = IA.srs.due(S()), qs = ids.map(IA.srs.resolve).filter(Boolean).slice(0, 20);
    if (!qs.length) { area.append(h('h3', null, 'Nothing due'), h('p', { class: 'small muted' }, st.queued ? `Your next review is ${fmtDue(st.nextDue)}. Come back then.` : 'No missed questions yet. Take a module assessment or lesson check; anything you miss will appear here.'), h('a', { class: 'btn', href: '#/assessments' }, 'Go to assessments')); return; }
    area.append(h('h3', null, `Review session · ${qs.length} question${qs.length > 1 ? 's' : ''}`), h('p', { class: 'small muted' }, 'Sources: ' + [...new Set(qs.map((q) => q.source))].join(', ')));
    const res = h('div');
    area.append(IA.ui.quiz(qs, { onDone: (r) => { const after = IA.srs.stats(S()); res.append(h('div', { class: 'result', style: { marginTop: '10px' } }, h('b', { class: r.correct === r.total ? 'up' : 'warn' }, `${r.correct}/${r.total} correct.`), ` Correct answers moved up a box; missed ones restart tomorrow. ${after.due ? `${after.due} still due.` : 'Nothing else due now.'} `, h('button', { class: 'btn sm', type: 'button', onclick: () => { el.replaceChildren(); IA.views.review(el); } }, after.due ? 'Continue' : 'Refresh'))); } }), res);
  };
})(typeof window !== 'undefined' ? window : globalThis);
