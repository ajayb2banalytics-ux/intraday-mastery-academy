/* Learning Academy: levels → modules → lessons; lesson reader; notes; bookmarks; embeds for charts & patterns. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const { h, prose, quiz, toast } = IA.ui; const P = () => IA.progress;

  // ---- embeds shared by all content ----
  IA.embeds.chart = (el, [preset = 'NIFTY', seed = '42', inds = 'vol']) => {
    const g = IA.gen.generate({ preset, seed: +seed || 42, days: 3, tfMin: 5 });
    const ch = new IA.Chart(el, { height: 280, paneH: 80 }); ch.setTokens(g.candles, inds.split(',').filter(Boolean));
    el.append(h('div', { class: 'tiny dim', style: { marginTop: '4px' } }, `${g.meta.name} · 5-min · seed ${seed} · drag to pan, pinch/scroll to zoom · open in `, h('a', { href: `#/chartlab?preset=${preset}&seed=${seed}&ind=${inds}` }, 'Chart Lab')));
  };
  IA.patternSvg = (p, w = 300, hgt = 170) => {
    const bars = p.bars, n = bars.length; let lo = Infinity, hi = -Infinity; bars.forEach((b) => { lo = Math.min(lo, b[2]); hi = Math.max(hi, b[1]); });
    const pad = (hi - lo) * 0.1, Y = (v) => 10 + (hi + pad - v) / (hi - lo + 2 * pad) * (hgt - 20), bw = w / n;
    let s = `<svg class="pattern-svg" viewBox="0 0 ${w} ${hgt}" role="img" aria-label="${IA.ui.esc(p.name)} diagram">`;
    const k = p.patternBars || 1; s += `<rect x="${(n - k) * bw}" y="2" width="${k * bw}" height="${hgt - 4}" fill="rgba(79,179,255,.09)" rx="4"/>`;
    bars.forEach((b, i) => { const [o, hh, l, c] = b, up = c >= o, col = up ? '#26c281' : '#ef5361', x = i * bw + bw / 2, bwid = bw * 0.55; s += `<line x1="${x}" x2="${x}" y1="${Y(hh)}" y2="${Y(l)}" stroke="${col}" stroke-width="1.5"/>`; const y1 = Y(Math.max(o, c)), y2 = Y(Math.min(o, c)); s += `<rect x="${x - bwid / 2}" y="${y1}" width="${bwid}" height="${Math.max(1.5, y2 - y1)}" fill="${up ? 'none' : col}" stroke="${col}" stroke-width="1.5"/>`; });
    return s + '</svg>';
  };
  IA.embeds.pattern = (el, [id]) => { const p = (IA.content.patterns || []).find((x) => x.id === id); if (!p) { el.append(h('span', { class: 'muted small' }, `[pattern ${id}]`)); return; } el.append(h('div', { class: 'row' }, h('div', { html: IA.patternSvg(p) }), h('div', null, h('b', null, p.name), h('div', { class: 'small muted' }, `${p.kind} · ${p.bias}`), h('a', { href: '#/pattern/' + id, class: 'small' }, 'Full pattern notes →')))); };

  // ---- Academy home ----
  IA.views.academy = (el) => {
    const lv = P().currentLevel(), written = new Set(IA.content.lessons.map((l) => l.id));
    el.append(h('p', { class: 'muted' }, 'Four levels. A lesson is complete only when you answer its check questions correctly; a module is mastered at 80% on its assessment; the next level\'s assessments unlock when the previous level averages 80%. You can read any lesson at any time.'));
    IA.content.levels.forEach((L) => {
      const st = P().levelState(L.n), open = P().unlocked(L.n);
      const card = h('div', { class: 'card', style: { marginTop: '14px' } }, h('div', { class: 'spread' }, h('div', null, h('h2', null, `Level ${L.n} — ${L.name}`, ' ', open ? (L.n === lv ? h('span', { class: 'tag acc' }, 'current') : h('span', { class: 'tag up' }, 'unlocked')) : h('span', { class: 'tag' }, 'assessments locked')), h('p', { class: 'muted small' }, L.goal)), h('div', { class: 'kpi right' }, h('span', { class: 'v' }, `${st.lessonsDone}/${st.lessons}`), h('span', { class: 'l' }, 'lessons'))));
      const g = h('div', { class: 'grid gauto' });
      L.modules.forEach((m) => { const s = P().moduleState(m); const avail = m.lessons.filter((l) => written.has(l.id)).length;
        g.append(h('a', { class: 'card card-link', href: '#/module/' + m.id }, h('div', { class: 'spread' }, h('span', { class: 'tag' }, m.id), s.mastered ? h('span', { class: 'tag up' }, 'mastered') : s.attempts ? h('span', { class: 'tag warn' }, `best ${Math.round(s.best * 100)}%`) : null), h('h3', { style: { marginTop: '6px' } }, m.title), h('div', { class: 'small muted' }, `${IA.content.tracks[m.track]} · ${s.done}/${s.total} done${avail < s.total ? ` · ${s.total - avail} not yet written` : ''}`), h('div', { class: 'bar up', style: { marginTop: '8px' } }, h('i', { style: { width: Math.round(s.lessonPct * 100) + '%' } })))); });
      card.append(g); el.append(card);
    });
  };
  IA.views.module = (el, id) => {
    const m = IA.content.modulesFlat().find((x) => x.id === id); if (!m) return IA.views.notfound(el);
    IA.setTitle(m.title); const s = P().moduleState(m), written = new Set(IA.content.lessons.map((l) => l.id));
    el.append(h('a', { href: '#/academy', class: 'small' }, '← Academy'), h('h2', { style: { marginTop: '8px' } }, `${m.id} · ${m.title}`), h('p', { class: 'muted' }, `Level ${m.level} · ${IA.content.tracks[m.track]} · ${s.done}/${s.total} lessons complete`));
    el.append(h('div', { class: 'card lesson-list' }, m.lessons.map((l, i) => h('a', { href: written.has(l.id) ? '#/lesson/' + l.id : null, style: written.has(l.id) ? null : { opacity: 0.5, pointerEvents: 'none' } }, h('span', { class: 'dot' + (P().isDone(l.id) ? ' done' : '') }), h('span', { style: { flex: 1 } }, `${i + 1}. ${l.title}`), written.has(l.id) ? h('span', { class: 'tiny dim' }, (IA.content.lessons.find((x) => x.id === l.id)?.mins || 12) + ' min') : h('span', { class: 'tag' }, 'not yet written')))));
    const nq = IA.content.questions.filter((q) => q.module === m.id).length;
    el.append(h('div', { class: 'card', style: { marginTop: '14px' } }, h('div', { class: 'spread' }, h('div', null, h('h3', null, 'Module assessment'), h('p', { class: 'muted small' }, `${nq} questions in bank · best ${Math.round(s.best * 100)}% · ${s.attempts} attempt(s) · pass mark 80%`)), P().unlocked(m.level) ? h('a', { class: 'btn primary', href: '#/assess/' + m.id }, 'Take assessment') : h('span', { class: 'tag' }, `Unlocks when Level ${m.level - 1} averages 80%`))));
  };

  // ---- Lesson reader ----
  IA.views.lesson = async (el, id) => {
    const l = IA.content.lessons.find((x) => x.id === id), meta = IA.content.lessonIndex().find((x) => x.id === id);
    if (!l) return el.append(h('div', { class: 'card' }, h('h3', null, meta ? meta.title : 'Lesson not found'), h('p', { class: 'muted' }, meta ? 'This lesson is planned in the curriculum but its content has not been written yet. It is listed in the requirements register as missing content.' : ''), h('a', { href: '#/academy' }, '← Academy')));
    IA.setTitle(l.title);
    const idx = IA.content.lessonIndex(), pos = idx.findIndex((x) => x.id === id), prev = idx[pos - 1], next = idx[pos + 1];
    const bm = await IA.db.get('bookmarks', []); let marked = bm.includes(id);
    const bmBtn = h('button', { class: 'btn sm ' + (marked ? 'sel' : 'ghost'), type: 'button', onclick: async () => { const b = await IA.db.get('bookmarks', []); marked = !marked; await IA.db.set('bookmarks', marked ? [...new Set([...b, id])] : b.filter((x) => x !== id)); bmBtn.classList.toggle('sel', marked); bmBtn.textContent = marked ? '★ Bookmarked' : '☆ Bookmark'; } }, marked ? '★ Bookmarked' : '☆ Bookmark');
    el.append(h('div', { class: 'lesson-head' }, h('div', { class: 'row small' }, h('a', { href: '#/module/' + l.module }, '← ' + (meta?.moduleTitle || l.module)), h('span', { class: 'dim' }, `Level ${l.level}`), h('span', { class: 'tag' }, IA.content.tracks[l.track] || l.track), IA.ui.evTag(l.evidence), P().isDone(id) ? h('span', { class: 'tag up' }, 'complete') : null), h('h2', null, l.title), h('p', { class: 'muted', style: { margin: 0 } }, l.summary), h('div', { class: 'row' }, h('span', { class: 'small dim' }, `${l.mins || 12} min`), bmBtn)));
    const tabs = h('div', { class: 'tabs', role: 'tablist' }), body = h('div');
    const secs = [...l.sections.map((s) => ({ h: s.h, render: () => prose(`## ${s.h}\n\n${s.md}`) })), { h: 'Check & complete', render: check }, { h: 'My notes', render: notes }];
    const show = (i) => { [...tabs.children].forEach((b, k) => b.classList.toggle('on', k === i)); body.innerHTML = ''; body.append(secs[i].render()); if (i < secs.length - 1) body.append(h('div', { class: 'row', style: { marginTop: '18px' } }, i > 0 ? h('button', { class: 'btn', type: 'button', onclick: () => { show(i - 1); el.scrollIntoView(); } }, '← ' + secs[i - 1].h) : null, h('button', { class: 'btn primary', type: 'button', onclick: () => { show(i + 1); el.scrollIntoView(); } }, secs[i + 1].h + ' →'))); };
    secs.forEach((s, i) => tabs.append(h('button', { type: 'button', role: 'tab', onclick: () => show(i) }, s.h)));
    el.append(tabs, body); show(0);
    function check() {
      const box = h('div', { class: 'prose' }, h('h2', null, 'Check your understanding'), h('p', { class: 'muted' }, 'Answer all questions correctly to complete the lesson. You can retry.'));
      const qs = l.check.map((q, i) => ({ ...q, id: id + '-c' + i }));
      const holder = h('div'); const go = () => { holder.innerHTML = ''; holder.append(quiz(qs, { onDone: async (r) => { const ok = await P().lessonCheck(id, r.correct, r.total); holder.append(h('div', { class: 'result' }, ok ? h('b', { class: 'up' }, `All correct — lesson complete.`) : h('span', null, h('b', { class: 'warn' }, `${r.correct}/${r.total} correct. `), 'Re-read the relevant section and try again. ', h('button', { class: 'btn sm', type: 'button', onclick: go }, 'Retry')), next ? h('div', { style: { marginTop: '8px' } }, h('a', { class: 'btn primary', href: '#/lesson/' + next.id }, 'Next: ' + next.title)) : null)); } })); };
      go(); box.append(holder);
      if (l.refs?.length) box.append(h('h3', null, 'References & further reading'), h('ul', null, l.refs.map((r) => h('li', { html: IA.ui.inline(r) }))));
      return box;
    }
    function notes() {
      const box = h('div', { class: 'prose' }, h('h2', null, 'My notes'));
      const ta = h('textarea', { class: 'i', rows: 7, placeholder: 'Your own summary, questions, and how you will apply this…' }); const list = h('div');
      const load = async () => { const rows = (await IA.db.rows('notes')).filter((n) => n.lessonId === id).sort((a, b) => b.created - a.created); list.innerHTML = ''; rows.forEach((n) => list.append(h('div', { class: 'card', style: { marginTop: '8px' } }, h('div', { class: 'tiny dim' }, new Date(n.created).toLocaleString()), h('div', { style: { whiteSpace: 'pre-wrap' } }, n.text), h('button', { class: 'btn sm ghost', type: 'button', onclick: async () => { await IA.db.remove(n.id); load(); } }, 'Delete')))); };
      box.append(ta, h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn primary', type: 'button', onclick: async () => { if (!ta.value.trim()) return; await IA.db.put('notes', { lessonId: id, text: ta.value.trim() }); ta.value = ''; toast('Note saved'); load(); } }, 'Save note')), list); load(); return box;
    }
    el.append(h('div', { class: 'spread', style: { marginTop: '24px', borderTop: '1px solid var(--line)', paddingTop: '12px' } }, prev ? h('a', { href: '#/lesson/' + prev.id, class: 'small' }, '← ' + prev.title) : h('span'), next ? h('a', { href: '#/lesson/' + next.id, class: 'small' }, next.title + ' →') : h('span')));
  };
})(typeof window !== 'undefined' ? window : globalThis);
