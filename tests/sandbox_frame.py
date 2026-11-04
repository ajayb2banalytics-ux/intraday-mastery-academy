import sys
# Regression test: the standalone file must work inside a sandboxed srcdoc iframe (how chat apps preview files).
# Usage: python3 tests/sandbox_frame.py dist/intraday-academy-standalone.html [OUT.json]
import json, threading, tempfile, os, http.server, functools
from playwright.sync_api import sync_playwright
src=open(sys.argv[1],encoding='utf-8').read()
_d=tempfile.mkdtemp(); open(os.path.join(_d,'host.html'),'w').write('<html><body></body></html>')
_srv=http.server.ThreadingHTTPServer(('127.0.0.1',8799),functools.partial(http.server.SimpleHTTPRequestHandler,directory=_d))
_srv.RequestHandlerClass.log_message=lambda *a:None
threading.Thread(target=_srv.serve_forever,daemon=True).start()
results=[]
ok=fail=0
def chk(name,cond,detail=''):
    global ok,fail
    print(('PASS ' if cond else 'FAIL ')+name+(' — '+detail if detail else '')); results.append({'id':'SBX-%02d'%(len(results)+1),'name':name,'ok':bool(cond),'detail':detail})
    if cond: ok+=1
    else: fail+=1
with sync_playwright() as p:
    b=p.chromium.launch()
    for sb in ['allow-scripts','allow-scripts allow-same-origin']:
        pg=b.new_page(viewport={'width':1300,'height':900}); errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.goto('http://localhost:8799/host.html')
        pg.evaluate("([s,sb])=>{const f=document.createElement('iframe');f.id='f';f.style='width:1250px;height:850px';f.setAttribute('sandbox',sb);f.srcdoc=s;document.body.appendChild(f)}",[src,sb])
        pg.wait_for_timeout(2500)
        fl=pg.frame_locator('#f'); fr=lambda:[f for f in pg.frames if f!=pg.main_frame][0]
        title=lambda: fr().evaluate("document.querySelector('#title')?.textContent||'NONE'")
        for href,exp in [('#/academy','Learning Academy'),('#/simulator','Trading Simulator'),('#/calculators','Calculators'),('#/journal','Trading Journal'),('#/dashboard','Dashboard')]:
            fl.locator(f'aside a[href="{href}"]').click(timeout=4000); pg.wait_for_timeout(500)
            chk(f'[{sb}] sidebar {href}', title()==exp and pg.url.endswith('host.html'), title())
        # tab button
        fl.locator('aside a[href="#/simulator"]').click(); pg.wait_for_timeout(500)
        fl.locator('.tabs button', has_text='Options paper').click(); pg.wait_for_timeout(800)
        chk(f'[{sb}] tab button Options paper', fr().evaluate("!!document.querySelector('#view').innerText.match(/chain/i)"))
        # in-content link (lesson card on academy)
        fl.locator('aside a[href="#/academy"]').click(); pg.wait_for_timeout(500)
        fl.locator('#view a[href^="#/module/"]').first.click(); pg.wait_for_timeout(600)
        chk(f'[{sb}] in-page link to module', fr().evaluate("document.querySelectorAll('#view a[href^=\"#/lesson/\"]').length>0"))
        # Strategy bot inside the preview frame (storage may be in-memory here)
        fl.locator('aside a[href="#/simulator"]').click(); pg.wait_for_timeout(500)
        fl.locator('.tabs button', has_text='Strategy bot').click(); pg.wait_for_timeout(1500)
        fl.locator('#view button', has_text='Advance 1 bar').click(); pg.wait_for_timeout(500)
        chk(f'[{sb}] Strategy bot advances inside the frame', fr().evaluate("(document.querySelector('#bot-day')||{}).textContent||''").startswith('Bar 1 '))
        # dialog: journal delete flow requires a trade; use settings reset specs dialog
        fl.locator('aside a[href="#/settings"]').click(); pg.wait_for_timeout(600)
        fr().evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)"); fl.locator('button', has_text='Reset to defaults').click(); pg.wait_for_timeout(300)
        shown=fl.locator('.modal [data-dlg="ok"]').count()
        chk(f'[{sb}] in-app confirm dialog appears', shown==1)
        if shown: fl.locator('.modal [data-dlg="ok"]').click(); pg.wait_for_timeout(400)
        chk(f'[{sb}] dialog OK runs action', fl.locator('.modal').count()==0 and True)
        chk(f'[{sb}] no page errors', not errs, '; '.join(errs[:3]))
        pg.close()
    b.close()
print(f'{ok} passed, {fail} failed')
if len(sys.argv)>2: json.dump(results,open(sys.argv[2],'w'),indent=1)
_srv.shutdown(); sys.exit(1 if fail else 0)
