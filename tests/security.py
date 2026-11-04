"""Security & data-integrity tests (headless Chromium, CSP ENFORCED — no bypass).
Usage: python3 tests/security.py SERVED_URL STANDALONE_FILE_URL OUT_JSON"""
import asyncio, sys, json, os
from playwright.async_api import async_playwright
SERVED, STAND, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
R = []
def rec(id, name, ok, detail=''): R.append(dict(id=id, name=name, ok=bool(ok), detail=str(detail)[:300])); print('PASS' if ok else 'FAIL', id, name, '' if ok else '→ ' + str(detail)[:200], flush=True)
XSS = '<img src=x onerror="window.__pwned=1"><script>window.__pwned=2</script><svg onload="window.__pwned=3"></svg>"\'><b>bold</b>'
async def go(pg, r, w=500): await pg.evaluate(f"location.hash='#/{r}'"); await pg.wait_for_timeout(w)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        for label, url in [('served', SERVED), ('standalone', STAND)]:
            ctx = await b.new_context(accept_downloads=True); pg = await ctx.new_page(); viol = []
            pg.on('console', lambda m: 'Content Security Policy' in m.text and viol.append(m.text[:160]))
            await pg.goto(url); await pg.wait_for_timeout(1000); await pg.evaluate("IA.db.wipe()"); await pg.reload(); await pg.wait_for_timeout(900)
            # 1. stored XSS through every user-text entry point
            payload = json.dumps(XSS)
            await pg.evaluate(f"""(async()=>{{const x={payload};
              await IA.db.put('journal',{{date:'2026-11-04',market:'India',instrument:x,strategy:x,entry:100,exit:101,qty:1,side:'long',lessons:x,emotion:x,mistakes:[x]}});
              await IA.db.put('notes',{{lessonId:'l1-exchanges',text:x}});
              const r=IA.dataimport.importCsv('Date,Open,High,Low,Close,Volume,Symbol\\n2026-10-14,100,101,99,100.5,10,'+JSON.stringify(x).replace(/,/g,' ')+'\\n2026-10-15,100,101,99,100.5,10,X');
              await IA.datasets.save({{name:x,file:x,exchange:'NSE',tfMin:1440,tfLabel:'Daily',from:'2026-10-14',to:'2026-10-15',quality:'good',instrType:'other',report:r.report,candles:r.candles||[]}});
              await IA.db.set('bookmarks',[x]); await IA.db.set('checklistTpl',{{pre:[x],during:[x],post:[x]}});
            }})()""")
            for r in ['journal/log', 'journal/stats', 'library/bookmarks', 'data', 'workflow', 'psychology', 'lesson/l1-exchanges', 'quant/backtest', 'chartlab', 'markets/compare', 'search/' + 'img', 'dashboard']:
                await go(pg, r, 700)
            pw = await pg.evaluate("window.__pwned || 0"); bold = await pg.evaluate("[...document.querySelectorAll('#view b')].some(e => e.textContent === 'bold' && e.closest('td'))")
            rec(f'SEC-01-{label}', f'Stored XSS: script/event-handler payloads in journal, notes, dataset names, checklists and bookmarks never execute ({label})', pw == 0, f'__pwned={pw}')
            rec(f'SEC-02-{label}', f'User text is rendered as text, not HTML (no injected <b> element) ({label})', not bold, bold)
            normal_use_violations = list(viol)  # snapshot BEFORE the deliberate attack below
            # 2. CSP blocks injected inline scripts even if markup got in
            r2 = await pg.evaluate("(()=>{const d=document.createElement('div'); d.innerHTML='<img src=x onerror=\"window.__csp=1\">'; document.body.append(d); const s=document.createElement('script'); s.textContent='window.__csp2=1'; document.body.append(s); return new Promise(r=>setTimeout(()=>r([window.__csp||0, window.__csp2||0]),400));})()")
            rec(f'SEC-03-{label}', f'Content-Security-Policy blocks inline event handlers and injected <script> ({label})', r2 == [0, 0], r2)
            # 3. network lockdown
            if label == 'standalone':
                f = await pg.evaluate("fetch('https://example.com/').then(()=> 'fetched').catch(e => 'blocked')")
                rec('SEC-04-standalone', 'Standalone build cannot make network requests (connect-src none): fetch to an external URL is blocked', f == 'blocked', f)
            else:
                f = await pg.evaluate("fetch('https://example.com/').then(()=> 'fetched').catch(e => 'blocked')")
                rec('SEC-04-served', 'Served PWA cannot send data to other origins (connect-src self): cross-origin fetch blocked', f == 'blocked', f)
            # 4. prototype pollution via backup / specs
            evil = '{"app":"intraday-mastery-academy","schema":1,"kv":{"settings":{"__proto__":{"polluted":"yes"},"theme":"dark"},"specs":{"constructor":{"prototype":{"polluted2":"yes"}}}},"rows":[]}'
            res = await pg.evaluate(f"(async()=>{{await IA.db.importAll(JSON.parse({json.dumps(evil)})); const s=await IA.db.get('settings'); IA.deepMerge({{}}, JSON.parse('{{\"__proto__\":{{\"p3\":1}}}}')); return [({{}}).polluted||null, ({{}}).polluted2||null, ({{}}).p3||null, Object.getPrototypeOf(s)===Object.prototype];}})()")
            rec(f'SEC-05-{label}', f'Prototype pollution via backup restore / spec merge is neutralised ({label})', res == [None, None, None, True], res)
            # 5. backup integrity: checksum present, tamper detected, malformed rejected
            res = await pg.evaluate("""(async()=>{ await IA.db.wipe(); await IA.db.put('journal',{date:'2026-11-04',instrument:'A',entry:1,exit:2,qty:1}); const b=await IA.db.exportAll(); const ok=await IA.db.verify(b); const t=JSON.parse(JSON.stringify(b)); t.rows[0].instrument='TAMPERED'; const bad=await IA.db.verify(t);
              let m1='', m2=''; try{ await IA.db.importAll({app:'intraday-mastery-academy',schema:1,kv:{},rows:[{nope:1}]}); }catch(e){m1=e.message} try{ await IA.db.importAll({app:'intraday-mastery-academy',schema:99,kv:{},rows:[]}); }catch(e){m2=e.message}
              return [!!b.sha256 && b.sha256.length===64, ok.status, bad.status, m1, m2]; })()""")
            rec(f'SEC-06-{label}', f'Backups carry a SHA-256 checksum; a tampered backup is detected; malformed rows and newer schemas are rejected ({label})', res[0] and res[1] == 'ok' and res[2] == 'mismatch' and 'malformed' in res[3] and 'newer' in res[4], res)
            # 6. restore is atomic-ish: failed import leaves existing data untouched
            res = await pg.evaluate("""(async()=>{ await IA.db.wipe(); await IA.db.put('journal',{date:'2026-11-04',instrument:'KEEP',entry:1,exit:2,qty:1}); try{ await IA.db.importAll({app:'intraday-mastery-academy',schema:1,kv:{},rows:[{id:'x'}]}); }catch(e){} return (await IA.db.rows('journal')).map(r=>r.instrument); })()""")
            rec(f'SEC-07-{label}', f'A rejected backup does not wipe existing data (validation happens before any write) ({label})', res == ['KEEP'], res)
            # 7. external links are isolated
            await go(pg, 'library/resources', 600)
            ln = await pg.evaluate("[...document.querySelectorAll('#view a[target=_blank]')].every(a => /noopener/.test(a.rel))")
            rec(f'SEC-08-{label}', f'Every external link opens with rel=noopener ({label})', ln, ln)
            # 8. CSV injection on export: formula-leading cells are neutralised
            await pg.evaluate("(async()=>{await IA.db.wipe(); await IA.db.put('journal',{date:'2026-11-04',instrument:'=HYPERLINK(\"http://evil\")',strategy:'+1+1',lessons:'@SUM(A1)',entry:1,exit:2,qty:1,side:'long'});})()")
            await go(pg, 'journal/log', 600)
            async with pg.expect_download() as dl: await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Export CSV').click()")
            csv = open(await (await dl.value).path()).read()
            rec(f'SEC-09-{label}', f'CSV export neutralises spreadsheet formula injection (cells starting = + - @ are prefixed) ({label})', "'=HYPERLINK" in csv and "'+1+1" in csv and "'@SUM" in csv, csv[-200:])
            rec(f'SEC-10-{label}', f'No CSP violations while rendering stored hostile text during normal use ({label})', not normal_use_violations, normal_use_violations[:3])
            await ctx.close()
        await b.close()
    json.dump(R, open(OUT, 'w'), indent=1); print(f"\n{sum(r['ok'] for r in R)} passed, {sum(not r['ok'] for r in R)} failed")
asyncio.run(main())
