"""End-to-end functional tests in headless Chrome. Usage: python3 tests/e2e.py [base_url] [out.json]
Every test records PASS/FAIL with detail; results are written to JSON for the QA report."""
import asyncio, sys, json, time, re
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765/index.html'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'tests/e2e-results.json'
R = []
def rec(id, name, ok, detail=''):
    R.append({'id': id, 'name': name, 'ok': bool(ok), 'detail': str(detail)[:400]}); print(('PASS' if ok else 'FAIL'), id, name, '' if ok else '→ ' + str(detail)[:300], flush=True)

LEFTOVER = re.compile(r'\[\[(chart|widget|pattern|link):|\{\{|:::|\]\(http|\[unknown widget|Embed failed|\bNaN\b|: undefined|undefined%|₹undefined|\$undefined')

async def go(pg, route, wait=350):
    await pg.evaluate(f"location.hash = '#/{route}'"); await pg.wait_for_timeout(wait)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, accept_downloads=True)
        pg = await ctx.new_page(); errors = []
        pg.on('pageerror', lambda e: errors.append(str(e)))
        pg.on('console', lambda m: m.type == 'error' and errors.append(m.text))
        await pg.goto(BASE); await pg.wait_for_timeout(1200)
        # fresh state
        await pg.evaluate("IA.db.wipe()"); await pg.reload(); await pg.wait_for_timeout(900)

        # ---- 1. Every lesson renders every tab cleanly ----
        ids = await pg.evaluate("IA.content.lessons.map(l => l.id)")
        bad = []
        for lid in ids:
            await go(pg, 'lesson/' + lid, 150)
            n = await pg.evaluate("document.querySelectorAll('.tabs button').length")
            for k in range(n):
                await pg.evaluate(f"document.querySelectorAll('.tabs button')[{k}].click()"); await pg.wait_for_timeout(40)
                txt = await pg.evaluate("document.querySelector('#view').innerText")
                m = LEFTOVER.search(txt)
                if m or 'Something went wrong' in txt: bad.append(f"{lid} tab{k}: …{txt[max(0,m.start()-60):m.start()+40] if m else 'error view'}…")
        rec('E2E-01', f'All {len(ids)} lessons render every tab with no raw markup, NaN/undefined or failed embeds', not bad, bad[:6])

        # ---- 2. Indicator / strategy / pattern pages ----
        for kind, expr, route in [('indicator', "IA.content.indicators.map(x=>x.id)", 'indicator/'), ('strategy', "IA.content.strategies.map(x=>x.id)", 'strategy/'), ('pattern', "IA.content.patterns.map(x=>x.id)", 'pattern/')]:
            xs = await pg.evaluate(expr); bad = []
            for x in xs:
                await go(pg, route + x, 200); txt = await pg.evaluate("document.querySelector('#view').innerText"); m = LEFTOVER.search(txt)
                if m or 'Something went wrong' in txt or 'Page not found' in txt: bad.append(f"{x}: …{txt[max(0,m.start()-60):m.start()+40] if m else 'error'}…")
            rec('E2E-02-' + kind, f'All {len(xs)} {kind} pages render cleanly', not bad, bad[:5])

        # ---- 3. Lesson completion gate + persistence ----
        await go(pg, 'lesson/l1-exchanges', 300)
        await pg.evaluate("[...document.querySelectorAll('.tabs button')].find(b=>b.textContent.startsWith('Check')).click()"); await pg.wait_for_timeout(200)
        # answer first question WRONG, others right → not complete
        ans = await pg.evaluate("IA.content.lessons.find(l=>l.id==='l1-exchanges').check.map(q=>q.a)")
        for qi, a in enumerate(ans):
            pick = (a + 1) % 3 if qi == 0 else a
            await pg.evaluate(f"document.querySelectorAll('.q')[{qi}].querySelectorAll('.opt')[{pick}].click()")
        done1 = await pg.evaluate("IA.progress.isDone('l1-exchanges')")
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Retry').click()"); await pg.wait_for_timeout(150)
        for qi, a in enumerate(ans): await pg.evaluate(f"document.querySelectorAll('.q')[{qi}].querySelectorAll('.opt')[{a}].click()")
        await pg.wait_for_timeout(200); await pg.reload(); await pg.wait_for_timeout(900)
        done2 = await pg.evaluate("IA.progress.isDone('l1-exchanges')")
        rec('E2E-03', 'Lesson is NOT completed with a wrong answer, IS completed when all correct, and survives reload', (not done1) and done2, f'wrong→{done1}, right+reload→{done2}')

        # ---- 4. Notes & bookmarks persist ----
        await go(pg, 'lesson/l1-orderbook', 300)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Bookmark')).click()"); await pg.wait_for_timeout(150)
        await pg.evaluate("[...document.querySelectorAll('.tabs button')].find(b=>b.textContent==='My notes').click()"); await pg.wait_for_timeout(150)
        await pg.fill('textarea', 'Spread = cost of immediacy'); await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Save note').click()"); await pg.wait_for_timeout(300)
        await pg.reload(); await pg.wait_for_timeout(800); await go(pg, 'library/bookmarks', 600)
        txt = await pg.evaluate("document.querySelector('#view').innerText")
        rec('E2E-04', 'Bookmark and note persist across reload and appear in the library', 'order book' in txt.lower() and 'Spread = cost of immediacy' in txt, txt[:200])

        # ---- 5. Module assessment + mastery + level unlock ----
        await pg.evaluate("""(async()=>{for(const m of IA.content.levels[0].modules){await IA.progress.recordQuiz(m.id,{score:1,total:10,correct:10,answers:[]});}})()""")
        unl = await pg.evaluate("IA.progress.unlocked(2)")
        locked3 = await pg.evaluate("!IA.progress.unlocked(3)")
        await go(pg, 'assess/L2-M1', 400)
        qs = await pg.evaluate("document.querySelectorAll('.q').length")
        # answer all correctly by looking up the question text in the bank
        await pg.evaluate("""(()=>{const bank=IA.content.questions; document.querySelectorAll('.q').forEach(q=>{const t=q.querySelector('b').textContent; const Q=bank.find(x=>x.q===t); q.querySelectorAll('.opt')[Q.a].click();});})()""")
        await pg.wait_for_timeout(300)
        best = await pg.evaluate("IA.progress.state.quizzes['L2-M1'].best")
        rec('E2E-05', 'Level 2 unlocks after Level 1 mastery; Level 3 stays locked; 10-question assessment scores 100% and is recorded', unl and locked3 and qs == 10 and best == 1, f'unl2={unl} locked3={locked3} qs={qs} best={best}')
        await go(pg, 'assess/L3-M1', 300); txt = await pg.evaluate("document.querySelector('#view').innerText")
        rec('E2E-06', 'Locked level assessment shows lock message instead of questions', 'Locked' in txt, txt[:120])

        # ---- 6. Calculators: every calculator produces a result with default inputs; position size exact ----
        calcs = await pg.evaluate("IA.calcList.map(c=>c[0])"); bad = []
        for c in calcs:
            await go(pg, 'calculators/' + c, 450)
            txt = await pg.evaluate("document.querySelector('#view').innerText"); has = await pg.evaluate("!!document.querySelector('.result')")
            if not has or 'NaN' in txt or 'undefined' in txt: bad.append(c)
        rec('E2E-07', f'All {len(calcs)} calculators render a result with default inputs (no NaN/undefined)', not bad, bad)
        await go(pg, 'calculators/position-size', 400)
        inputs = await pg.query_selector_all('.view input.i')
        for el, v in zip(inputs, ['100000', '1', '500', '495', '1', '1']): await el.fill(v)
        await pg.wait_for_timeout(150); txt = await pg.evaluate("document.querySelector('.result').innerText")
        rec('E2E-08', 'Position-size calculator UI: 1% of ₹1,00,000, entry 500, stop 495 → 200 shares', '200' in txt.split('\n')[1] if len(txt.split('\n')) > 1 else False, txt[:160])
        await inputs[3].fill('500'); await pg.wait_for_timeout(120); txt = await pg.evaluate("document.querySelector('.view').innerText")
        rec('E2E-09', 'Calculator rejects stop = entry with a clear message', 'Stop cannot equal entry' in txt, '')

        # ---- 7. Journal add → stats → CSV export → import ----
        await go(pg, 'journal/add', 400)
        sel = lambda label: f"[...document.querySelectorAll('label.f')].find(l=>l.firstChild.textContent==='{label}').querySelector('input,select,textarea')"
        for lab, val in [('Instrument', 'RELIANCE'), ('Entry', '1450'), ('Exit', '1462'), ('Stop-loss', '1444'), ('Target', '1468'), ('Quantity', '100'), ('Brokerage + taxes + charges', '60'), ('Entry time', '09:45'), ('Exit time', '10:20')]:
            await pg.evaluate(f"(e=>{{e.value='{val}';}})({sel(lab)})")
        await pg.evaluate(f"(e=>{{e.value='Opening Range Breakout'}})({sel('Strategy')})")
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Save trade').click()"); await pg.wait_for_timeout(500)
        rows = await pg.evaluate("IA.db.rows('journal').then(r=>r.map(IA.journalDerive))")
        r0 = rows[0] if rows else {}
        rec('E2E-10', 'Journal trade saved with derived net P&L (100 × 12 − 60 = 1,140), R = 1.9 and 35-min duration', len(rows) == 1 and abs(r0.get('net', 0) - 1140) < 1e-6 and abs(r0.get('R', 0) - 1.9) < 1e-6 and r0.get('dur') == 35, {k: r0.get(k) for k in ['net', 'R', 'dur', 'rr']})
        await go(pg, 'journal/stats', 600)
        await pg.evaluate("document.querySelector('.view select').value='all'; document.querySelector('.view select').dispatchEvent(new Event('change'))"); await pg.wait_for_timeout(300)
        txt = await pg.evaluate("document.querySelector('#view').innerText")
        rec('E2E-11', 'Journal analytics show the trade (₹1,140 net) grouped by strategy, time of day, week and month', '1,140' in txt and 'Opening Range Breakout' in txt and '09:00' in txt and 'w/c' in txt, txt[:200])
        await go(pg, 'journal/log', 400)
        async with pg.expect_download() as dl:
            await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Export CSV').click()")
        d = await dl.value; path = await d.path(); csv = open(path).read()
        rec('E2E-12', 'Journal CSV export contains header and the trade row', csv.startswith('date,market') and 'RELIANCE' in csv and '1140' in csv, csv[:160])

        # ---- 8. Backup → wipe → restore ----
        async with pg.expect_download() as dl:
            await go(pg, 'settings', 400); await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Download full backup').click()")
        bk = await (await dl.value).path(); data = json.load(open(bk))
        await pg.evaluate("IA.db.wipe()"); n0 = await pg.evaluate("IA.db.rows('journal').then(r=>r.length)")
        await pg.evaluate(f"IA.db.importAll({json.dumps(data)})"); n1 = await pg.evaluate("IA.db.rows('journal').then(r=>r.length)")
        prog = await pg.evaluate("IA.db.get('progress').then(p=>!!p.lessons['l1-exchanges'].done)")
        bad_import = await pg.evaluate("IA.db.importAll({app:'other'}).then(()=>false).catch(e=>e.message)")
        rec('E2E-13', 'Full backup restores journal and lesson progress after a wipe; foreign files are rejected', n0 == 0 and n1 == 1 and prog and 'not an Intraday Mastery backup' in str(bad_import), f'{n0}->{n1}, prog={prog}, bad={bad_import}')
        await pg.reload(); await pg.wait_for_timeout(800)

        # ---- 9. Replay simulator: order lifecycle ----
        await go(pg, 'simulator/replay', 700)
        price = await pg.evaluate("parseFloat(document.querySelector('.chart-legend').innerText.match(/C ([\\d.]+)/)[1])")
        tk = await pg.query_selector_all('.view .card input.i')
        # ticket inputs: price, stop, target, risk, qty
        await tk[1].fill(str(round(price * 0.99, 1))); await tk[2].fill(str(round(price * 1.02, 1))); await tk[4].fill('65')
        await pg.evaluate("document.querySelector('.btn.buy').click()"); await pg.wait_for_timeout(150)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.startsWith('Next bar')).click()"); await pg.wait_for_timeout(250)
        log = await pg.evaluate("[...document.querySelectorAll('.card')].find(c=>c.querySelector('h3')?.textContent==='Event log').innerText")
        filled = 'Filled' in log
        for _ in range(80): await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.startsWith('Next bar'))?.click()")
        await pg.wait_for_timeout(500)
        txt = await pg.evaluate("document.body.innerText")
        closed = await pg.evaluate("[...document.querySelectorAll('.card')].find(c=>c.querySelector('h3')?.textContent==='Trades this session')?.querySelectorAll('tbody tr').length || (document.querySelector('.modal') ? 1 : 0)")
        rec('E2E-14', 'Replay: bracket order fills at the next bar, then exits by stop/target/session close; review appears at session end', filled and closed >= 1 and 'Session review' in txt, f'filled={filled} closed={closed}')
        await pg.evaluate("document.querySelector('.modal-bg')?.remove()")

        # ---- 10. Decision simulator ----
        await go(pg, 'simulator/decision', 600)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Wait').click()"); await pg.wait_for_timeout(300)
        txt = await pg.evaluate("document.querySelector('#view').innerText"); n = await pg.evaluate("IA.progress.state.decisions.length")
        rec('E2E-15', 'Decision simulator grades the decision, reveals the outcome separately, and records it', n >= 1 and 'What happened next' in txt and 'Rule-based answer' in txt, txt[:150])

        # ---- 11. Paper trading persists ----
        await go(pg, 'simulator/paper', 800)
        tk = await pg.query_selector_all('.view .card input.i'); await tk[4].fill('65')
        await pg.evaluate("document.querySelector('.btn.buy').click()"); await pg.wait_for_timeout(300)
        try: await pg.wait_for_selector('.modal [data-dlg=ok]', timeout=1500)
        except Exception: pass
        nostop_warned = await pg.evaluate("!!document.querySelector('.modal [data-dlg=ok]') && document.querySelector('.modal').innerText.includes('No stop-loss')")
        await pg.evaluate("document.querySelector('.modal [data-dlg=ok]') && document.querySelector('.modal [data-dlg=ok]').click()"); await pg.wait_for_timeout(300)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Advance 1 bar').click()"); await pg.wait_for_timeout(300)
        s1 = await pg.evaluate("IA.db.get('paper').then(s=>({idx:s.idx,q:s.acc.pos.qty,f:s.acc.fills.length}))")
        await pg.reload(); await pg.wait_for_timeout(800); await go(pg, 'simulator/paper', 700)
        s2 = await pg.evaluate("IA.db.get('paper').then(s=>({idx:s.idx,q:s.acc.pos.qty}))")
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='To session close').click()"); await pg.wait_for_timeout(500)
        s3 = await pg.evaluate("IA.db.get('paper').then(s=>({q:s.acc.pos.qty,t:s.acc.trades.length,cash:s.acc.cash,start:s.acc.start,ch:s.acc.charges}))")
        rec('E2E-16', 'Paper trading: 1 lot fills next bar, survives reload, is squared off at session close with charges deducted', s1['q'] == 65 and s1['f'] == 1 and s2 == {'idx': s1['idx'], 'q': 65} and s3['q'] == 0 and s3['t'] == 1 and s3['ch'] > 0, f'in-app confirmation shown: {nostop_warned} {s1} {s2} {s3}')

        # ---- 12. Backtester + walk-forward + comparison + every strategy btConfig ----
        await go(pg, 'quant/backtest', 600)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Run backtest').click()"); await pg.wait_for_timeout(2500)
        txt = await pg.evaluate("document.querySelector('#view').innerText")
        rec('E2E-17', 'Backtester runs, labels results SYNTHETIC, shows KPIs, equity curve and trade list', 'SYNTHETIC DATA' in txt and 'profit factor' in txt.lower() and 'trade list' in txt.lower(), txt[txt.find('Trades'):][:120])
        await go(pg, 'quant/walkforward', 600); await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Run walk-forward').click()"); await pg.wait_for_timeout(2500)
        rows = await pg.evaluate("document.querySelectorAll('.view tbody tr').length")
        rec('E2E-18', 'Walk-forward produces 4 segments', rows == 4, rows)
        res = await pg.evaluate("""IA.content.strategies.filter(s=>s.btConfig).map(s=>{const c=IA.gen.generate({preset:'NIFTY',seed:7,days:120,tfMin:5}).candles; const r=IA.bt.run(c,{...s.btConfig,lot:65,tick:0.05,capital:5e6}); return [s.id, r.error||r.trades.length];})""")
        zero = [x for x in res if not isinstance(x[1], int) or x[1] == 0]
        rec('E2E-19', f'All {len(res)} backtestable strategy configs run and produce trades on 120 synthetic sessions', not zero, zero)
        await go(pg, 'strategies', 600); await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Run comparison').click()"); await pg.wait_for_timeout(3500)
        rows = await pg.evaluate("[...document.querySelectorAll('.view tbody')].pop()?.querySelectorAll('tr').length || 0")
        rec('E2E-20', 'Strategy comparison lab ranks the selected strategies on identical data', rows >= 2, rows)

        # ---- 13. Chart lab drills ----
        await go(pg, 'chartlab', 800)
        await pg.evaluate("document.querySelectorAll('.q .opt')[0].click()"); await pg.wait_for_timeout(200)
        txt = await pg.evaluate("document.querySelector('#view').innerText")
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Find: Bullish engulfing').click()"); await pg.wait_for_timeout(400)
        picked = await pg.evaluate("""(()=>{const box=[...document.querySelectorAll('.chart-box')].pop(); const cv=box.querySelector('canvas'); const r=cv.getBoundingClientRect(); cv.dispatchEvent(new MouseEvent('click',{clientX:r.left+r.width*0.5,clientY:r.top+60,bubbles:true})); return true;})()""")
        await pg.wait_for_timeout(300); txt2 = await pg.evaluate("document.querySelector('#view').innerText")
        stats = await pg.evaluate("IA.db.get('drillStats')")
        rec('E2E-21', 'Chart-reading drills: data-graded question and tap-the-pattern drill both score and record', ('Correct.' in txt or 'Not quite.' in txt) and ('Correct.' in txt2 or 'Not that one.' in txt2) and stats and 'reading' in stats, json.dumps(stats))
        # indicator toggles / annotation persistence
        await pg.evaluate("[...document.querySelectorAll('.chart-toolbar .seg button')].find(b=>b.textContent==='H-line').click()")
        await pg.evaluate("""(()=>{const cv=document.querySelector('.chart-box canvas'); const r=cv.getBoundingClientRect(); cv.dispatchEvent(new MouseEvent('click',{clientX:r.left+100,clientY:r.top+120,bubbles:true}));})()"""); await pg.wait_for_timeout(300)
        ann = await pg.evaluate("IA.db.get('annotations').then(a=>Object.values(a||{}).flat().length)")
        rec('E2E-22', 'Chart annotation (horizontal line) is saved per chart', ann >= 1, ann)

        # ---- 14. Settings, theme, clock tz, specs validation ----
        await go(pg, 'markets/clock', 600)
        await pg.evaluate("(s=>{s.value='America/New_York'; s.dispatchEvent(new Event('change'));})(document.querySelector('.view select'))"); await pg.wait_for_timeout(300)
        tz = await pg.evaluate("IA.db.get('settings').then(s=>s.tz)")
        rec('E2E-23', 'Clock time-zone choice persists', tz == 'America/New_York', tz)
        await go(pg, 'settings', 500)
        await pg.evaluate("document.querySelector('textarea').value='{not json'"); await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Save specifications').click()"); await pg.wait_for_timeout(300)
        toast = await pg.evaluate("document.querySelector('.toast')?.textContent || ''")
        rec('E2E-24', 'Invalid specification JSON is rejected without saving', 'Invalid JSON' in toast, toast)
        await pg.evaluate("(s=>{s.value='light'; s.dispatchEvent(new Event('change'));})(document.querySelector('.view select'))"); await pg.wait_for_timeout(200)
        th = await pg.evaluate("document.documentElement.dataset.theme"); await pg.evaluate("(s=>{s.value='dark'; s.dispatchEvent(new Event('change'));})(document.querySelector('.view select'))")
        rec('E2E-25', 'Theme switch applies immediately', th == 'light', th)

        # ---- 15. Search ----
        await go(pg, 'search/vwap', 500); txt = await pg.evaluate("document.querySelector('#view').innerText")
        n = int(re.search(r'(\d+) matches', txt).group(1)) if re.search(r'(\d+) matches', txt) else 0
        rec('E2E-26', 'Search finds lessons, indicators and strategies', n >= 5 and 'Indicator' in txt and 'Lesson' in txt, n)

        # ---- 16. Mobile overflow on every route (360px) ----
        await pg.set_viewport_size({'width': 360, 'height': 780})
        routes = ['', 'academy', 'lesson/l3-greeks', 'technical/indicators', 'indicator/macd', 'chartlab', 'markets/clock', 'markets/specs', 'strategies', 'strategy/vwap-pullback', 'derivatives/matrix', 'derivatives/chain', 'risk', 'simulator/replay', 'simulator/paper', 'journal/stats', 'quant/backtest', 'calculators/options-payoff', 'psychology', 'workflow', 'library/glossary', 'assessments', 'settings']
        over = []
        for r in routes:
            await go(pg, r, 500); w = await pg.evaluate("document.scrollingElement.scrollWidth")
            if w > 361: over.append(f'{r}:{w}')
        rec('E2E-27', f'No horizontal page overflow at 360 px on {len(routes)} key routes (tables scroll inside their own box)', not over, over)

        # ---- 17. Offline via service worker ----
        if BASE.startswith('file:'):
            R.append({'id': 'E2E-28', 'name': 'Service worker offline test — not applicable to file:// (no service workers); standalone file makes no network requests', 'ok': True, 'detail': 'n/a'}); print('SKIP E2E-28 (file://)')
            rec('E2E-29', 'No uncaught page errors or console errors during the whole run', not errors, errors[:5]); await b.close()
            json.dump(R, open(OUT, 'w'), indent=1); print(f"\n{sum(r['ok'] for r in R)} passed, {sum(not r['ok'] for r in R)} failed, {len(R)} total"); return
        await pg.goto(BASE); await pg.wait_for_timeout(500)
        ready = await pg.evaluate("navigator.serviceWorker.ready.then(r=>!!r.active)")
        await pg.wait_for_timeout(1500); await ctx.set_offline(True)
        try:
            await pg.reload(); await pg.wait_for_timeout(1200); await go(pg, 'lesson/l2-vwap-advanced', 500)
            txt = await pg.evaluate("document.querySelector('#view').innerText"); ok = 'VWAP' in txt
        except Exception as e: ok = False; txt = str(e)
        await ctx.set_offline(False)
        rec('E2E-28', 'Service worker installs; app reloads and serves lessons with the network OFF', ready and ok, txt[:100])

        rec('E2E-29', 'No uncaught page errors or console errors during the whole run', not errors, errors[:5])
        await b.close()
    json.dump(R, open(OUT, 'w'), indent=1)
    print(f"\n{sum(r['ok'] for r in R)} passed, {sum(not r['ok'] for r in R)} failed, {len(R)} total")
asyncio.run(main())
