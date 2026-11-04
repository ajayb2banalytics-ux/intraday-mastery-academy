"""Build: (1) dist/intraday-academy-standalone.html — every CSS/JS file inlined, works from file://
(2) dist/intraday-academy-pwa/ — multi-file PWA copy  (3) dist/intraday-academy.zip — both + docs + tests.
Also regenerates docs/CURRICULUM.md from js/content/curriculum.js (single source of truth)."""
import re, os, shutil, zipfile, base64, json, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
DIST = 'dist'; shutil.rmtree(DIST, ignore_errors=True); os.makedirs(DIST)
files = re.findall(r"'(js/[^']+)'", open('js/files.js').read())
missing = [f for f in files + ['js/boot.js'] if not os.path.exists(f)]
assert not missing, f'missing script files: {missing}'
# keep index.html in sync with js/files.js (single source of truth)
idx = open('index.html', encoding='utf-8').read()
idx = re.sub(r'(  <script src="js/[^"]+"></script>\n)+', ''.join(f'  <script src="{f}"></script>\n' for f in files + ['js/boot.js']), idx)
open('index.html', 'w', encoding='utf-8').write(idx)

# 1. Standalone single file — one inline script, locked down by a hash-based CSP (no network access at all)
import hashlib
css = open('css/app.css', encoding='utf-8').read()
icon = 'data:image/svg+xml;base64,' + base64.b64encode(open('icons/icon.svg', 'rb').read()).decode()
js = '\n'.join(f'/* ==== {f} ==== */\n' + open(f, encoding='utf-8').read() for f in files + ['js/boot.js']).replace('</script', '<\\/script')
h256 = base64.b64encode(hashlib.sha256(js.encode('utf-8')).digest()).decode()
csp = f"default-src 'none'; script-src 'sha256-{h256}'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'"
html = open('index.html', encoding='utf-8').read()
html = re.sub(r'\s*<script src="js/[^"]+"></script>', '', html)
html = re.sub(r'<meta http-equiv="Content-Security-Policy" content="[^"]*">', f'<meta http-equiv="Content-Security-Policy" content="{csp}">', html)
html = html.replace('<link rel="stylesheet" href="css/app.css">', f'<style>\n{css}\n</style>')
html = html.replace('<link rel="manifest" href="manifest.webmanifest">', '').replace('href="icons/icon.svg"', f'href="{icon}"').replace('<link rel="apple-touch-icon" href="icons/icon-192.png">', '')
html = html.replace('</body>', f'<script>{js}</script>\n</body>')
assert html.count('<script') == 1, 'standalone must contain exactly one script'
open(f'{DIST}/intraday-academy-standalone.html', 'w', encoding='utf-8').write(html)

# 2. PWA copy
pwa = f'{DIST}/intraday-academy-pwa'
for d in ['css', 'js', 'icons']: shutil.copytree(d, f'{pwa}/{d}')
for f in ['index.html', 'manifest.webmanifest', 'sw.js']: shutil.copy(f, pwa)

# 3. Curriculum doc from the source of truth
node = r"""require('./js/content/curriculum.js'); require('fs').readdirSync('./js/content').filter(f=>/^lessons-.*\.js$/.test(f)||['indicators-lib.js','strategies.js','patterns.js'].includes(f)).forEach(f=>require('./js/content/'+f));
const C=globalThis.IA.content; const out=['# Curriculum map','', 'Generated from js/content/curriculum.js. Evidence label per lesson: established / mixed / subjective / speculative.',''];
C.levels.forEach(L=>{out.push(`## Level ${L.n} — ${L.name}`,'',L.goal,'');L.modules.forEach(m=>{const nq=C.questions.filter(q=>q.module===m.id).length;out.push(`### ${m.id} · ${m.title} (${C.tracks[m.track]}; ${nq} assessment questions)`,'');m.lessons.forEach((l,i)=>{const x=C.lessons.find(y=>y.id===l.id);const w=x?x.sections.reduce((a,s)=>a+s.md.split(/\s+/).length,0):0;out.push(`${i+1}. **${l.title}** — \`${l.id}\` · ${x?x.evidence:'MISSING'} · ~${w} words · ${x?x.sections.map(s=>s.h).join(', '):''}`);});out.push('');});});
out.push('## Reference libraries','',`- Indicators: ${C.indicators.length} — ${C.indicators.map(i=>i.name).join(', ')}`,`- Strategies: ${C.strategies.length} — ${C.strategies.map(s=>s.name).join(', ')}`,`- Candlestick patterns: ${C.patterns.length} — ${C.patterns.map(p=>p.name).join(', ')}`,`- Readiness exam bank: ${C.questions.filter(q=>q.module==='READINESS').length} questions`);
process.stdout.write(out.join('\n'));"""
open('docs/CURRICULUM.md', 'w', encoding='utf-8').write(subprocess.check_output(['node', '-e', node]).decode())

# 4. ZIP
z = zipfile.ZipFile(f'{DIST}/intraday-mastery-final.zip', 'w', zipfile.ZIP_DEFLATED)
z.write(f'{DIST}/intraday-academy-standalone.html', 'intraday-academy-standalone.html')
for base, _, fs in os.walk(pwa):
    for f in fs: z.write(os.path.join(base, f), os.path.join('pwa', os.path.relpath(os.path.join(base, f), pwa)))
for base, _, fs in os.walk('docs'):  # reports at top level for reading
    for f in fs:
        if f.endswith(('.md', '.json')): z.write(os.path.join(base, f))
for d in ['docs', 'tests', 'tools']:  # source/ is a complete, runnable project tree
    for base, _, fs in os.walk(d):
        for f in fs:
            if f.endswith(('.md', '.js', '.py', '.json', '.csv')): z.write(os.path.join(base, f), os.path.join('source', base, f))
for f in ['README.md', 'INSTALL.md']:
    if os.path.exists(f): z.write(f, os.path.join('source', f))
for base, _, fs in os.walk('js'):
    for f in fs: z.write(os.path.join(base, f), os.path.join('source', base, f))
for f in ['index.html', 'sw.js', 'manifest.webmanifest', 'css/app.css', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png']: z.write(f, os.path.join('source', f))
for f in ['INSTALL.md']:
    if os.path.exists(f): z.write(f)
z.write('README.md'); z.close()
for f in ['intraday-academy-standalone.html', 'intraday-mastery-final.zip']: print(f, round(os.path.getsize(f'{DIST}/{f}') / 1024), 'KB')
