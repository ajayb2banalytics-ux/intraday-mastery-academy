"""Build: (1) dist/intraday-academy-standalone.html — every CSS/JS file inlined, works from file://
(2) dist/intraday-academy-pwa/ — multi-file PWA copy  (3) dist/intraday-academy.zip — both + docs + tests.
Also regenerates docs/CURRICULUM.md from js/content/curriculum.js (single source of truth)."""
import re, os, shutil, zipfile, base64, json, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
DIST = 'dist'; shutil.rmtree(DIST, ignore_errors=True); os.makedirs(DIST)
files = re.findall(r"'(js/[^']+)'", open('js/files.js').read())

# 1. Standalone single file
css = open('css/app.css', encoding='utf-8').read()
icon = 'data:image/svg+xml;base64,' + base64.b64encode(open('icons/icon.svg', 'rb').read()).decode()
js = '\n'.join(f'/* ==== {f} ==== */\n' + open(f, encoding='utf-8').read().replace('</script', '<\\/script') for f in files)
html = open('index.html', encoding='utf-8').read()
html = re.sub(r'\s*<script src="js/[^"]+"></script>', '', html)
html = html.replace('<link rel="stylesheet" href="css/app.css">', f'<style>\n{css}\n</style>')
html = html.replace('<link rel="manifest" href="manifest.webmanifest">', '').replace('href="icons/icon.svg"', f'href="{icon}"').replace('<link rel="apple-touch-icon" href="icons/icon-192.png">', '')
html = html.replace("<script>IA.VERSION", f"<script>\n{js}\n</script>\n  <script>IA.VERSION")
open(f'{DIST}/intraday-academy-standalone.html', 'w', encoding='utf-8').write(html)

# 2. PWA copy
pwa = f'{DIST}/intraday-academy-pwa'
for d in ['css', 'js', 'icons']: shutil.copytree(d, f'{pwa}/{d}')
for f in ['index.html', 'manifest.webmanifest', 'sw.js']: shutil.copy(f, pwa)

# 3. Curriculum doc from the source of truth
node = r"""require('./js/content/curriculum.js'); ['lessons-l1','lessons-l2a','lessons-l2b','lessons-l3a','lessons-l3b','lessons-l4','indicators-lib','strategies','patterns'].forEach(f=>require('./js/content/'+f+'.js'));
const C=globalThis.IA.content; const out=['# Curriculum map','', 'Generated from js/content/curriculum.js. Evidence label per lesson: established / mixed / subjective / speculative.',''];
C.levels.forEach(L=>{out.push(`## Level ${L.n} — ${L.name}`,'',L.goal,'');L.modules.forEach(m=>{const nq=C.questions.filter(q=>q.module===m.id).length;out.push(`### ${m.id} · ${m.title} (${C.tracks[m.track]}; ${nq} assessment questions)`,'');m.lessons.forEach((l,i)=>{const x=C.lessons.find(y=>y.id===l.id);const w=x?x.sections.reduce((a,s)=>a+s.md.split(/\s+/).length,0):0;out.push(`${i+1}. **${l.title}** — \`${l.id}\` · ${x?x.evidence:'MISSING'} · ~${w} words · ${x?x.sections.map(s=>s.h).join(', '):''}`);});out.push('');});});
out.push('## Reference libraries','',`- Indicators: ${C.indicators.length} — ${C.indicators.map(i=>i.name).join(', ')}`,`- Strategies: ${C.strategies.length} — ${C.strategies.map(s=>s.name).join(', ')}`,`- Candlestick patterns: ${C.patterns.length} — ${C.patterns.map(p=>p.name).join(', ')}`,`- Readiness exam bank: ${C.questions.filter(q=>q.module==='READINESS').length} questions`);
process.stdout.write(out.join('\n'));"""
open('docs/CURRICULUM.md', 'w', encoding='utf-8').write(subprocess.check_output(['node', '-e', node]).decode())

# 4. ZIP
z = zipfile.ZipFile(f'{DIST}/intraday-academy.zip', 'w', zipfile.ZIP_DEFLATED)
z.write(f'{DIST}/intraday-academy-standalone.html', 'intraday-academy-standalone.html')
for base, _, fs in os.walk(pwa):
    for f in fs: z.write(os.path.join(base, f), os.path.join('pwa', os.path.relpath(os.path.join(base, f), pwa)))
for d in ['docs', 'tests', 'tools']:
    for base, _, fs in os.walk(d):
        for f in fs:
            if f.endswith(('.md', '.js', '.py', '.json')): z.write(os.path.join(base, f))
z.write('README.md'); z.close()
for f in ['intraday-academy-standalone.html', 'intraday-academy.zip']: print(f, round(os.path.getsize(f'{DIST}/{f}') / 1024), 'KB')
