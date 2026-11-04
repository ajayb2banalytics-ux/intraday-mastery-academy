/* UI helpers: DOM builder, markdown renderer, embeds, forms, quiz, toast, modal, formatting. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') el.className = v; else if (k === 'html') el.innerHTML = v; else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v);
    }
    kids.flat(Infinity).forEach((k) => { if (k === null || k === undefined || k === false) return; el.appendChild(k instanceof Node ? k : document.createTextNode(String(k))); });
    return el;
  }
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ---------- Formatting ----------
  const CUR = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', SGD: 'S$', HKD: 'HK$', AUD: 'A$', CAD: 'C$' };
  function num(x, d = 2) { if (x === null || x === undefined || Number.isNaN(x)) return '—'; if (x === Infinity) return '∞'; if (x === -Infinity) return '−∞'; return Number(x).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function money(x, cur = 'INR', d = 2) { if (x === Infinity) return 'Unlimited'; if (x === -Infinity) return 'Unlimited loss'; return (x < 0 ? '−' : '') + (CUR[cur] || cur + ' ') + num(Math.abs(x), d); }
  const pct = (x, d = 2) => (x === null || x === undefined || Number.isNaN(x) ? '—' : num(x * 100, d) + '%');
  const signCls = (x) => (x > 0 ? 'up' : x < 0 ? 'down' : '');

  // ---------- Markdown (subset defined in docs/CONTENT-SPEC.md) ----------
  function inline(s) {
    let t = esc(s);
    t = t.replace(/\{\{(.+?)\}\}/g, (_, c) => `<code>${c}</code>`);
    t = t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<i>$2</i>');
    t = t.replace(/\[\[link:([\w-]+)\]\]/g, (_, id) => { const l = IA.content?.lessonIndex?.().find((x) => x.id === id); return `<a href="#/lesson/${id}">${esc(l ? l.title : id)}</a>`; });
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return t;
  }
  const CALLOUT = { warn: 'Risk warning', note: 'Note', evidence: 'Evidence status', india: 'India', us: 'US & global', tip: 'Tip' };
  function md(src) {
    if (!src) return '';
    // Embeds written mid-sentence are lifted onto their own line so they render as blocks
    // (except inside table rows, where they become a link-style mention).
    src = String(src).replace(/\r/g, '').split('\n').map((ln) => /^\s*\|/.test(ln) ? ln.replace(/\[\[(?:widget|chart|pattern):([^\]]+)\]\]/g, '{{$1}}') : ln.replace(/[ \t]*(\[\[(?:chart|pattern|widget):[^\]]+\]\])[ \t]*/g, '\n$1\n')).join('\n');
    const lines = src.split('\n'); const out = []; let i = 0;
    const isTable = (l) => /^\s*\|.*\|\s*$/.test(l);
    while (i < lines.length) {
      let l = lines[i];
      if (/^\s*$/.test(l)) { i++; continue; }
      if (/^\s*:::formula/.test(l)) { const buf = []; i++; while (i < lines.length && !/^\s*:::\s*$/.test(lines[i])) buf.push(lines[i++]); i++; out.push(`<div class="formula">${inline(buf.join('\n')).replace(/<\/?code>/g, '')}</div>`); continue; }
      const em = l.match(/^\s*\[\[(chart|pattern|widget):([^\]]+)\]\]\s*$/); if (em) { out.push(`<div class="embed" data-embed="${esc(em[1] + ':' + em[2])}"></div>`); i++; continue; }
      const hm = l.match(/^(#{2,4})\s+(.*)$/); if (hm) { const n = Math.min(4, hm[1].length + 1); out.push(`<h${n}>${inline(hm[2])}</h${n}>`); i++; continue; }
      const cm = l.match(/^\s*>\s*\[!(\w+)\]\s*(.*)$/);
      if (cm) { const buf = [cm[2]]; i++; while (i < lines.length && /^\s*>\s?/.test(lines[i]) && !/^\s*>\s*\[!/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, '')); const k = cm[1].toLowerCase(); out.push(`<div class="callout ${esc(k)}"><b class="h">${esc(CALLOUT[k] || k)}</b>${buf.map(inline).join('<br>')}</div>`); continue; }
      if (/^\s*>\s?/.test(l)) { const buf = []; while (i < lines.length && /^\s*>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, '')); out.push(`<div class="callout note">${buf.map(inline).join('<br>')}</div>`); continue; }
      if (isTable(l)) {
        const rows = []; while (i < lines.length && isTable(lines[i])) rows.push(lines[i++]);
        const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        const sepIdx = rows.findIndex((r) => /^\s*\|?\s*:?-{2,}/.test(r.replace(/\|/g, '|')) && /-{2,}/.test(r) && !/[a-z0-9]/i.test(r.replace(/[-:|\s]/g, '')));
        let head = null, body = rows; if (sepIdx === 1) { head = cells(rows[0]); body = rows.slice(2); }
        out.push(`<table>${head ? `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>` : ''}<tbody>${body.map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
        continue;
      }
      if (/^\s*[-*]\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { let item = lines[i++].replace(/^\s*[-*]\s+/, ''); while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i])) item += ' ' + lines[i++].trim(); buf.push(`<li>${inline(item)}</li>`); } out.push(`<ul>${buf.join('')}</ul>`); continue; }
      if (/^\s*\d+[.)]\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { let item = lines[i++].replace(/^\s*\d+[.)]\s+/, ''); while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i])) item += ' ' + lines[i++].trim(); buf.push(`<li>${inline(item)}</li>`); } out.push(`<ol>${buf.join('')}</ol>`); continue; }
      const buf = [l]; i++;
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{2,4}\s|\s*[-*]\s+|\s*\d+[.)]\s+|\s*>|\s*\||\s*:::|\s*\[\[(chart|pattern|widget):)/.test(lines[i])) buf.push(lines[i++]);
      out.push(`<p>${inline(buf.join(' '))}</p>`);
    }
    return out.join('\n');
  }
  IA.embeds = IA.embeds || {};
  function hydrate(rootEl) {
    $$('.embed[data-embed]', rootEl).forEach((el) => {
      if (el.dataset.done) return; el.dataset.done = '1';
      const [type, ...args] = el.dataset.embed.split(':');
      const fn = IA.embeds[type]; if (!fn) { el.innerHTML = `<div class="muted small">[${esc(el.dataset.embed)}]</div>`; return; }
      try { fn(el, args); } catch (e) { el.innerHTML = `<div class="err">Embed failed: ${esc(e.message)}</div>`; console.error(e); }
    });
  }
  function prose(src) { const d = h('div', { class: 'prose', html: md(src) }); setTimeout(() => hydrate(d), 0); return d; }

  // ---------- Forms (calculator builder) ----------
  // fields: [{k,label,type:'num'|'sel'|'text', v, opts:[[v,l]], step, min}], compute(values) → Node|string
  function calcForm({ fields, compute, title, note }) {
    const box = h('div', { class: 'card' }); if (title) box.append(h('h3', null, title)); if (note) box.append(h('p', { class: 'muted small' }, note));
    const form = h('div', { class: 'form' }), res = h('div');
    const inputs = {};
    fields.forEach((f) => {
      let inp;
      if (f.type === 'sel') { inp = h('select', { class: 'i' }, (f.opts || []).map(([v, l]) => h('option', { value: v, selected: String(v) === String(f.v) }, l))); }
      else inp = h('input', { class: 'i' + (f.type === 'text' ? '' : ' num'), type: f.type === 'text' ? 'text' : 'number', inputmode: 'decimal', value: f.v ?? '', step: f.step || 'any', min: f.min });
      inp.addEventListener('input', run); inputs[f.k] = inp;
      form.append(h('label', { class: 'f' }, f.label, inp));
    });
    function run() {
      const vals = {}; fields.forEach((f) => { const raw = inputs[f.k].value; vals[f.k] = f.type === 'sel' || f.type === 'text' ? raw : raw === '' ? undefined : Number(raw); });
      res.innerHTML = '';
      try { const out = compute(vals); if (out) res.append(out instanceof Node ? out : h('div', null, String(out))); } catch (e) { res.append(h('div', { class: 'err' }, e.message)); }
    }
    box.append(form, res); setTimeout(run, 0); box._inputs = inputs; box._run = run;
    return box;
  }
  function resultBlock(rows, steps, warnings) {
    const b = h('div', { class: 'result' });
    const g = h('div', { class: 'grid gauto' }); rows.forEach(([l, v, cls]) => g.append(h('div', { class: 'kpi' }, h('span', { class: 'l' }, l), h('span', { class: 'v ' + (cls || '') }, v))));
    b.append(g);
    if (steps && steps.length) { const det = h('details', null, h('summary', { class: 'small muted' }, 'Show the working'), h('ol', { class: 'steps' }, steps.map((s) => h('li', null, s)))); b.append(det); }
    (warnings || []).forEach((w) => b.append(h('div', { class: 'warnbox' }, w)));
    return b;
  }
  const errBlock = (msg) => h('div', { class: 'err result' }, msg);

  // ---------- Quiz component ----------
  function quiz(questions, { onDone, shuffle = false, showWhy = true, srs = true } = {}) {
    const qs = shuffle ? questions.slice().sort(() => Math.random() - 0.5) : questions;
    const wrap = h('div'); let answered = 0, correct = 0; const answers = [];
    qs.forEach((q, qi) => {
      const box = h('div', { class: 'q' }, h('div', null, h('span', { class: 'muted small' }, `Q${qi + 1}. `), h('b', null, q.q)));
      const opts = h('div', { class: 'opts' }), why = h('div', { class: 'why hidden' });
      q.o.forEach((o, oi) => opts.append(h('button', { class: 'opt', type: 'button', onclick: () => {
        if (box.dataset.done) return; box.dataset.done = '1'; answered++;
        const ok = oi === q.a; if (ok) correct++; answers.push({ id: q.id, ok });
        if (srs && q.id && IA.progress && IA.progress.answer) IA.progress.answer(q.id, ok);
        $$('.opt', opts).forEach((b, bi) => { if (bi === q.a) b.classList.add('right'); else if (bi === oi) b.classList.add('wrong'); });
        if (showWhy) { why.innerHTML = `<b class="${ok ? 'up' : 'down'}">${ok ? 'Correct.' : 'Not quite.'}</b> ${inline(q.why || '')}`; why.classList.remove('hidden'); }
        if (answered === qs.length && onDone) onDone({ correct, total: qs.length, score: correct / qs.length, answers });
      } }, h('span', { html: inline(o) }))));
      box.append(opts, why); wrap.append(box);
    });
    return wrap;
  }

  // ---------- Toast, modal, download, file pick ----------
  function toast(msg, ms = 2600) { const t = h('div', { class: 'toast', role: 'status' }, msg); document.body.append(t); setTimeout(() => t.remove(), ms); }
  function modal(content, { onClose } = {}) {
    const bg = h('div', { class: 'modal-bg', onclick: (e) => { if (e.target === bg) close(); } });
    const m = h('div', { class: 'modal', role: 'dialog' }, content); bg.append(m); document.body.append(bg);
    let closed = false; function close() { if (closed) return; closed = true; bg.remove(); document.removeEventListener('keydown', esc2); onClose && onClose(); }
    const esc2 = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc2); } }; document.addEventListener('keydown', esc2);
    return { close, el: m };
  }
  function download(name, text, type = 'application/json') { const a = h('a', { href: URL.createObjectURL(new Blob([text], { type })), download: name }); document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function pickFile(accept) { return new Promise((res) => { const i = h('input', { type: 'file', accept, style: { display: 'none' } }); i.onchange = () => { const f = i.files[0]; if (!f) return res(null); const r = new FileReader(); r.onload = () => res({ name: f.name, text: r.result }); r.readAsText(f); i.remove(); }; document.body.append(i); i.click(); }); }
  function csv(rows, cols) { const q = (v) => { let s = v === null || v === undefined ? '' : String(v); if (typeof v === 'string' && /^[=+\-@\t\r]/.test(s) && !Number.isFinite(Number(s))) s = "'" + s; /* neutralise spreadsheet formula injection */ return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }; return [cols.map((c) => q(c.label || c.k)).join(','), ...rows.map((r) => cols.map((c) => q(typeof c.get === 'function' ? c.get(r) : r[c.k])).join(','))].join('\n'); }
  function parseCsv(text) { const rows = []; let row = [], f = '', q = false; for (let i = 0; i < text.length; i++) { const ch = text[i]; if (q) { if (ch === '"' && text[i + 1] === '"') { f += '"'; i++; } else if (ch === '"') q = false; else f += ch; } else if (ch === '"') q = true; else if (ch === ',') { row.push(f); f = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; } else f += ch; } if (f !== '' || row.length) { row.push(f); rows.push(row); } return rows.filter((r) => r.some((c) => c !== '')); }
  function table(cols, rows, { empty = 'Nothing yet.' } = {}) {
    if (!rows.length) return h('p', { class: 'muted' }, empty);
    return h('div', { class: 'tbl-wrap' }, h('table', { class: 't' }, h('thead', null, h('tr', null, cols.map((c) => h('th', { class: c.n ? 'n' : '' }, c.label)))), h('tbody', null, rows.map((r) => h('tr', null, cols.map((c) => { const v = c.get ? c.get(r) : r[c.k]; return h('td', { class: (c.n ? 'n ' : '') + (c.cls ? c.cls(r) : '') }, v instanceof Node ? v : v ?? '—'); }))))));
  }
  function seg(options, value, onChange) { const s = h('div', { class: 'seg' }); options.forEach(([v, l]) => { const b = h('button', { type: 'button', class: String(v) === String(value) ? 'on' : '', onclick: () => { $$('button', s).forEach((x) => x.classList.remove('on')); b.classList.add('on'); onChange(v); } }, l); s.append(b); }); return s; }
  function evTag(ev) { const m = { established: 'Established', mixed: 'Mixed evidence', subjective: 'Subjective framework', speculative: 'Speculative' }; return h('span', { class: 'tag ev-' + ev, title: 'Evidence status' }, m[ev] || ev || '—'); }


  // In-app replacements for confirm()/prompt(). Native dialogs are silently blocked in sandboxed
  // previews (e.g. a chat app's file viewer), which made buttons appear dead. These always work.
  function dialog(message, withInput, def) {
    return new Promise((res) => {
      let done = false, m = null; const fin = (v) => { if (done) return; done = true; if (m) m.close(); res(v); };
      const input = withInput ? h('input', { class: 'i', type: 'text', value: def == null ? '' : String(def), 'aria-label': 'Answer', style: { width: '100%', marginTop: '8px' } }) : null;
      const ok = h('button', { class: 'btn', type: 'button', 'data-dlg': 'ok', onclick: () => fin(withInput ? input.value : true) }, 'OK');
      const cancel = h('button', { class: 'btn ghost', type: 'button', 'data-dlg': 'cancel', onclick: () => fin(withInput ? null : false) }, 'Cancel');
      const body = h('div', { class: 'dlg' }, h('p', { style: { whiteSpace: 'pre-line', margin: '0 0 6px' } }, String(message)), input, h('div', { class: 'row', style: { marginTop: '14px', justifyContent: 'flex-end', gap: '8px' } }, cancel, ok));
      m = modal(body, { onClose: () => fin(withInput ? null : false) });
      if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') fin(input.value); });
      setTimeout(() => (input || ok).focus(), 0);
    });
  }
  const ask = (message) => dialog(message, false);
  const askText = (message, def) => dialog(message, true, def);
  IA.ui = { h, $, $$, esc, md, inline, hydrate, prose, calcForm, resultBlock, errBlock, quiz, toast, modal, ask, askText, download, pickFile, csv, parseCsv, table, seg, evTag, num, money, pct, signCls, CUR };
})(typeof window !== 'undefined' ? window : globalThis);
