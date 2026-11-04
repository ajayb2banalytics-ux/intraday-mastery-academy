/* App shell: hash router, navigation, search, settings bootstrap, service worker. */
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.views = IA.views || {};
  const { h, $, $$ } = IA.ui;
  const I = { // stroke icons (24x24)
    dash: 'M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z', book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5', ta: 'M3 3v18h18M7 15l4-4 3 3 5-6', chart: 'M7 3v4M7 17v4M7 7h0M5 7h4v10H5zM17 5v3M17 16v3M15 8h4v8h-4z', globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20', target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', layers: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', play: 'M5 3l14 9-14 9V3z', journal: 'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5', flask: 'M9 3h6M10 3v6L4 20h16L14 9V3', calc: 'M5 2h14v20H5zM8 6h8M8 10h2M12 10h2M16 10h0M8 14h2M12 14h2M8 18h2M12 18h2M16 14v4', brain: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V4a3 3 0 0 0-3 0zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1', lib: 'M4 3h4v18H4zM10 3h4v18h-4zM16 4l4 1-3 16-4-1z', check: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2', list: 'M8 6h13M8 12h13M8 18h13M3 6h0M3 12h0M3 18h0', gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z', more: 'M4 6h16M4 12h16M4 18h16', search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  };
  const icon = (k) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', I[k] || I.dash); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round'); s.append(p); return s; };
  IA.icon = icon;
  const NAV = [
    ['dashboard', 'Dashboard', 'dash'], ['academy', 'Learning Academy', 'book'], ['technical', 'Technical Analysis', 'ta'], ['chartlab', 'Chart Laboratory', 'chart'], ['data', 'Historical Data', 'journal'], ['concepts', 'Concepts Lab', 'ta'],
    ['markets', 'Market Intelligence', 'globe'], ['strategies', 'Strategy Academy', 'target'], ['derivatives', 'Derivatives Academy', 'layers'], ['risk', 'Risk Management', 'shield'],
    ['simulator', 'Trading Simulator', 'play'], ['journal', 'Trading Journal', 'journal'], ['quant', 'Quantitative Research', 'flask'], ['calculators', 'Calculators', 'calc'],
    ['psychology', 'Psychology', 'brain'], ['workflow', 'Daily Workflow', 'list'], ['library', 'Research Library', 'lib'], ['assessments', 'Assessments', 'check'], ['settings', 'Settings & Data', 'gear'],
  ];
  const BOTTOM = ['dashboard', 'academy', 'chartlab', 'simulator'];
  IA.NAV = NAV;

  function shell() {
    const side = h('aside', { class: 'sidebar' }, h('div', { class: 'brand' }, logo(), h('div', null, 'Intraday Mastery', h('small', null, 'Global Trading Academy'))), h('nav', { class: 'nav' }, NAV.map(([k, l, ic], i) => [i === 6 || i === 11 || i === 16 ? h('div', { class: 'sep' }) : null, h('a', { href: '#/' + k, 'data-nav': k }, icon(ic), l)])));
    const search = h('input', { type: 'search', placeholder: 'Search lessons, indicators, strategies…', 'aria-label': 'Search', id: 'gsearch' });
    search.addEventListener('keydown', (e) => { if (e.key === 'Enter' && search.value.trim()) { location.hash = '#/search/' + encodeURIComponent(search.value.trim()); search.blur(); } });
    const top = h('header', { class: 'topbar' }, h('h1', { id: 'title' }, ''), h('div', { class: 'search' }, icon('search'), search), h('span', { class: 'offline-pill', id: 'netpill' }, 'offline-ready'));
    const bottom = h('nav', { class: 'bottomnav' }, BOTTOM.map((k) => { const n = NAV.find((x) => x[0] === k); return h('a', { href: '#/' + k, 'data-nav': k }, icon(n[2]), n[1].split(' ')[0]); }), h('button', { type: 'button', onclick: drawer, 'aria-label': 'All sections' }, icon('more'), 'More'));
    const main = h('div', { class: 'main' }, top, h('main', { class: 'view', id: 'view' }), h('footer', { class: 'disclaimer' }, 'Educational tool, not financial advice. Charts and simulations use synthetic data unless you import your own. Trading can lose all of your capital. Market specifications are dated — verify with your exchange and broker.'));
    document.body.innerHTML = ''; document.body.append(h('div', { class: 'app' }, side, main), bottom);
  }
  function logo() { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 32 32'); s.setAttribute('width', '28'); s.innerHTML = '<rect width="32" height="32" rx="7" fill="#141b23" stroke="#2f3d4b"/><path d="M7 21v-6M7 15h0" stroke="#ef5361" stroke-width="2"/><rect x="5.5" y="13" width="3" height="6" fill="#ef5361"/><path d="M14 23V9" stroke="#26c281" stroke-width="1.5"/><rect x="12.5" y="11" width="3" height="9" fill="#26c281"/><path d="M21 19V6" stroke="#26c281" stroke-width="1.5"/><rect x="19.5" y="8" width="3" height="8" fill="#26c281"/><path d="M5 24l7-6 6 3 9-12" stroke="#4fb3ff" stroke-width="1.6" fill="none"/>'; return s; }
  function drawer() { const m = IA.ui.modal(h('div', null, h('h3', null, 'All sections'), h('div', { class: 'drawer-grid' }, NAV.map(([k, l, ic]) => h('a', { href: '#/' + k, onclick: () => m.close() }, icon(ic), l))))); }

  const ROUTES = [
    [/^$/, 'dashboard'], [/^dashboard$/, 'dashboard'], [/^academy$/, 'academy'], [/^module\/(.+)$/, 'module'], [/^lesson\/(.+)$/, 'lesson'],
    [/^technical(?:\/(\w+))?$/, 'technical'], [/^indicator\/(.+)$/, 'indicator'], [/^pattern\/(.+)$/, 'pattern'], [/^chartlab$/, 'chartlab'], [/^data$/, 'data'], [/^concepts(?:\/([\w-]+))?$/, 'concepts'],
    [/^markets(?:\/(\w+))?$/, 'markets'], [/^strategies$/, 'strategies'], [/^strategy\/(.+)$/, 'strategy'], [/^derivatives(?:\/(\w+))?$/, 'derivatives'],
    [/^risk$/, 'risk'], [/^simulator(?:\/(\w+))?$/, 'simulator'], [/^journal(?:\/(\w+))?$/, 'journal'], [/^quant(?:\/(\w+))?$/, 'quant'], [/^calculators(?:\/([\w-]+))?$/, 'calculators'],
    [/^psychology(?:\/([\w-]+))?$/, 'psychology'], [/^workflow$/, 'workflow'], [/^library(?:\/(\w+))?$/, 'library'], [/^assessments$/, 'assessments'], [/^assess\/(.+)$/, 'assess'],
    [/^settings$/, 'settings'], [/^search\/(.*)$/, 'search'],
  ];
  let current = null;
  async function route() {
    const full = decodeURIComponent(location.hash.replace(/^#\/?/, '')); const qi = full.indexOf('?');
    const path = qi >= 0 && !full.startsWith('search/') ? full.slice(0, qi) : full, query = qi >= 0 ? new URLSearchParams(full.slice(qi + 1)) : new URLSearchParams();
    IA.query = query;
    let name = 'notfound', arg = null; for (const [re, n] of ROUTES) { const m = path.match(re); if (m) { name = n; arg = m[1]; break; } }
    const el = $('#view'); if (current && current.cleanup) try { current.cleanup(); } catch (e) {}
    el.innerHTML = ''; root.scrollTo(0, 0);
    const navKey = { notfound: '', module: 'academy', lesson: 'academy', indicator: 'technical', pattern: 'technical', strategy: 'strategies', assess: 'assessments', search: '' }[name] ?? name;
    $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === navKey));
    const v = IA.views[name] || IA.views.notfound;
    const nav = NAV.find((x) => x[0] === navKey); setTitle(nav ? nav[1] : 'Intraday Mastery');
    try { current = (await v(el, arg)) || null; } catch (e) { console.error(e); el.append(h('div', { class: 'card' }, h('h3', null, 'Something went wrong'), h('p', { class: 'err' }, e.message), h('p', { class: 'muted small' }, 'Your data is safe. Try another section, then report this in the Known issues list.'))); }
  }
  function setTitle(t) { const e = $('#title'); if (e) e.textContent = t; document.title = t + ' · Intraday Mastery'; }
  IA.setTitle = setTitle;

  IA.views.notfound = (el) => el.append(h('div', { class: 'card' }, h('h3', null, 'Page not found'), h('a', { href: '#/' }, 'Back to dashboard')));
  IA.views.search = (el, q) => {
    setTitle('Search'); q = (q || '').toLowerCase(); const C = IA.content, res = [];
    const hit = (s) => String(s || '').toLowerCase().includes(q);
    C.lessons.forEach((l) => { if (hit(l.title) || hit(l.summary) || l.sections.some((s) => hit(s.md))) res.push({ href: '#/lesson/' + l.id, t: l.title, s: 'Lesson · ' + l.module, w: hit(l.title) ? 2 : 1 }); });
    (C.indicators || []).forEach((x) => { if (hit(x.name) || hit(x.definition)) res.push({ href: '#/indicator/' + x.id, t: x.name, s: 'Indicator', w: hit(x.name) ? 3 : 1 }); });
    (C.strategies || []).forEach((x) => { if (hit(x.name) || hit(x.concept)) res.push({ href: '#/strategy/' + x.id, t: x.name, s: 'Strategy', w: hit(x.name) ? 3 : 1 }); });
    (C.patterns || []).forEach((x) => { if (hit(x.name)) res.push({ href: '#/pattern/' + x.id, t: x.name, s: 'Candlestick pattern', w: 3 }); });
    (C.library?.glossary || []).forEach((g) => { if (hit(g.term)) res.push({ href: '#/library/glossary', t: g.term, s: g.def.slice(0, 110), w: 2 }); });
    (C.psych?.topics || []).forEach((x) => { if (hit(x.name)) res.push({ href: '#/psychology/' + x.id, t: x.name, s: 'Psychology', w: 2 }); });
    res.sort((a, b) => b.w - a.w);
    el.append(h('h2', null, `Results for “${q}”`), h('p', { class: 'muted small' }, `${res.length} matches`), h('div', { class: 'search-results card' }, res.length ? res.slice(0, 120).map((r) => h('a', { href: r.href }, r.t, h('small', null, r.s))) : h('p', { class: 'muted' }, 'No matches.')));
  };

  async function start() {
    shell();
    const s = await IA.db.get('settings', {}); IA.settings = Object.assign({ currency: 'INR', theme: 'dark', dailyGoal: 2 }, s);
    document.documentElement.dataset.theme = IA.settings.theme;
    const ov = await IA.db.get('specs', null); IA.specs = ov ? deepMerge(structuredClone(IA.specsDefault), ov) : structuredClone(IA.specsDefault);
    await IA.progress.load();
    const pill = $('#netpill'); const net = () => { pill.textContent = navigator.onLine ? 'online · works offline' : 'offline'; pill.classList.toggle('ok', true); }; net(); addEventListener('online', net); addEventListener('offline', net);
    if (!(await IA.db.persistent())) IA.ui.toast('Storage unavailable — progress will not be saved in this browser mode.', 6000);
    addEventListener('hashchange', route); await route();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  function deepMerge(a, b) { for (const k in b) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k]) deepMerge(a[k], b[k]); else a[k] = b[k]; } return a; }
  IA.deepMerge = deepMerge;
  IA.start = start;
})(typeof window !== 'undefined' ? window : globalThis);
