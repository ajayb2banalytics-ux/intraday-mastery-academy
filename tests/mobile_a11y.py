"""Mobile, laptop, accessibility, installability and persistence tests (headless Chromium with device emulation).
Usage: python3 tests/mobile_a11y.py BASE_URL AXE_JS_PATH OUT_JSON
Honest scope: Chromium only. 'iPhone' and 'Android' profiles emulate viewport, pixel ratio, touch and user agent
in Chromium — they are NOT Safari/WebKit or a real device."""
import asyncio, sys, json, tempfile, shutil
from playwright.async_api import async_playwright
BASE, AXE, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
SERVED = BASE.startswith('http')
PROFILES = [
 ('Android phone (Pixel 7 emulation)', dict(viewport={'width': 412, 'height': 915}, device_scale_factor=2.625, is_mobile=True, has_touch=True, user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36')),
 ('iPhone 14 viewport (Chromium emulation, not Safari)', dict(viewport={'width': 390, 'height': 844}, device_scale_factor=3, is_mobile=True, has_touch=True, user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')),
 ('Small phone 360×740', dict(viewport={'width': 360, 'height': 740}, device_scale_factor=2, is_mobile=True, has_touch=True)),
 ('Tablet 820×1180', dict(viewport={'width': 820, 'height': 1180}, device_scale_factor=2, is_mobile=True, has_touch=True)),
 ('Laptop 1366×768', dict(viewport={'width': 1366, 'height': 768})),
 ('Desktop 1920×1080', dict(viewport={'width': 1920, 'height': 1080})),
]
ROUTES = ['simulator/options', 'review', 'journal/coach', 'calculators/charges-india', '', 'academy', 'module/L2-M1', 'lesson/l1-position-sizing', 'lesson/l3-greeks', 'technical/indicators', 'indicator/vwap', 'pattern/bullish-engulfing', 'chartlab', 'data', 'concepts', 'concepts/fvg', 'concepts/tpo', 'markets/clock', 'markets/compare', 'markets/specs', 'strategies', 'strategy/vwap-pullback', 'derivatives/payoff', 'derivatives/risk', 'derivatives/chain', 'risk', 'simulator/replay', 'simulator/decision', 'simulator/paper', 'journal/stats', 'journal/add', 'quant/backtest', 'quant/oos', 'quant/regimes', 'calculators/position-size', 'calculators/losing-streak', 'psychology', 'workflow', 'library/glossary', 'assessments', 'settings']
AXE_ROUTES = ['simulator/options', 'review', 'journal/coach', 'calculators/charges-india', '', 'academy', 'lesson/l1-position-sizing', 'chartlab', 'data', 'concepts/ob', 'markets/clock', 'derivatives/payoff', 'risk', 'simulator/replay', 'simulator/paper', 'journal/add', 'quant/backtest', 'calculators/position-size', 'assessments', 'settings']
R = {'base': BASE, 'profiles': [], 'axe': {}, 'install': None, 'persistence': None, 'touch': None, 'keyboard': None, 'errors': []}
async def go(pg, r, w=450): await pg.evaluate(f"location.hash='#/{r}'"); await pg.wait_for_timeout(w)
async def main():
    axe_src = open(AXE).read()
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        for name, opts in PROFILES:
            ctx = await b.new_context(**opts, bypass_csp=True); pg = await ctx.new_page(); errs = []  # bypass only so axe can be injected; CSP itself is verified in tests/security.py
            pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
            await pg.goto(BASE); await pg.wait_for_timeout(900)
            over, small, navOK = [], 0, True
            for r in ROUTES:
                await go(pg, r)
                w = await pg.evaluate('document.scrollingElement.scrollWidth'); vw = opts['viewport']['width']
                if w > vw + 1: over.append(f'{r or "dashboard"}: {w}px')
                small += await pg.evaluate("""[...document.querySelectorAll('button, a.btn, .bottomnav a, select, input')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 24 && getComputedStyle(e).visibility !== 'hidden'; }).length""")
            mobile = opts['viewport']['width'] <= 900
            nav = await pg.evaluate("({bottom: getComputedStyle(document.querySelector('.bottomnav')).display !== 'none', side: getComputedStyle(document.querySelector('.sidebar')).display !== 'none'})")
            navOK = nav['bottom'] if mobile else nav['side']
            # drawer reachable on mobile: every section reachable
            reach = None
            if mobile:
                await go(pg, ''); await pg.evaluate("document.querySelector('.bottomnav button').click()"); await pg.wait_for_timeout(200)
                reach = await pg.evaluate("document.querySelectorAll('.drawer-grid a').length"); await pg.evaluate("document.querySelector('.modal-bg')?.remove()")
            R['profiles'].append(dict(name=name, routes=len(ROUTES), overflow=over, smallTargets=small, navOK=navOK, drawerSections=reach, errors=errs[:5], ok=not over and navOK and not errs))
            print(name, '| overflow', len(over), '| nav ok', navOK, '| tiny targets', small, '| errors', len(errs), flush=True)
            if name.startswith('Android'):
                # touch interaction on a chart: tap-to-pick in a concept exercise
                await go(pg, 'concepts/orb', 900)
                box = await pg.evaluate("(()=>{const c=[...document.querySelectorAll('.chart-box canvas')].pop(); const r=c.getBoundingClientRect(); return [r.left+r.width*0.5, r.top+r.height*0.3];})()")
                await pg.touchscreen.tap(box[0], box[1]); await pg.wait_for_timeout(400)
                t = await pg.evaluate("document.querySelector('#view').innerText")
                R['touch'] = dict(ok=('Correct.' in t or 'Not quite.' in t), detail='Tap on chart canvas registered and graded' if ('Correct.' in t or 'Not quite.' in t) else t[:200])
                print('touch', R['touch'], flush=True)
            if name.startswith('Laptop'):
                # keyboard: Tab moves focus through interactive elements with a visible focus indicator
                await go(pg, 'calculators/position-size', 600); await pg.keyboard.press('Tab'); vis = 0
                for _ in range(12):
                    await pg.keyboard.press('Tab'); vis += await pg.evaluate("(()=>{const e=document.activeElement; if(!e||e===document.body) return 0; const s=getComputedStyle(e); return (s.outlineStyle!=='none' && parseFloat(s.outlineWidth)>0) || s.boxShadow!=='none' || e.matches(':focus-visible') ? 1 : 0;})()")
                await go(pg, 'simulator/replay', 900); before = await pg.evaluate("document.querySelector('.chart-legend').innerText")
                await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(300); after = await pg.evaluate("document.querySelector('.chart-legend').innerText")
                R['keyboard'] = dict(focusVisible=f'{vis}/12', replayShortcut=before != after, ok=vis >= 10 and before != after)
                print('keyboard', R['keyboard'], flush=True)
            if name.startswith('Laptop') or name.startswith('Android'):
                for r in AXE_ROUTES:
                    await go(pg, r, 700); await pg.add_script_tag(content=axe_src) if not await pg.evaluate('!!window.axe') else None
                    res = await pg.evaluate("axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa']}, resultTypes: ['violations']}).then(r => r.violations.map(v => ({id: v.id, impact: v.impact, n: v.nodes.length, help: v.help, sample: v.nodes[0] && v.nodes[0].target.join(' ')})))")
                    R['axe'].setdefault(name, {})[r or 'dashboard'] = res
            await ctx.close()
        if SERVED:
            d0 = tempfile.mkdtemp()
            try:
                ctx = await p.chromium.launch_persistent_context(d0, executable_path='/usr/bin/google-chrome'); pg = ctx.pages[0] if ctx.pages else await ctx.new_page()
                await pg.goto(BASE); await pg.wait_for_timeout(2500); cdp = await ctx.new_cdp_session(pg)
                inst = await cdp.send('Page.getInstallabilityErrors'); m = await cdp.send('Page.getAppManifest')
                sw = await pg.evaluate("navigator.serviceWorker.getRegistration().then(r => !!(r && r.active))")
                R['install'] = dict(errors=inst.get('installabilityErrors', []), manifestUrl=m.get('url'), manifestErrors=m.get('errors', []), serviceWorkerActive=sw, ok=not inst.get('installabilityErrors') and sw)
                await ctx.close()
            except Exception as e: R['install'] = dict(ok=False, error=str(e))
            finally: shutil.rmtree(d0, ignore_errors=True)
            print('install', R['install'], flush=True)
        await b.close()
        # persistence across a full browser restart (same profile directory)
        d = tempfile.mkdtemp()
        try:
            c1 = await p.chromium.launch_persistent_context(d, executable_path='/usr/bin/google-chrome'); pg = c1.pages[0] if c1.pages else await c1.new_page()
            await pg.goto(BASE); await pg.wait_for_timeout(1000); await pg.evaluate("IA.db.put('journal', {date:'2026-11-04', instrument:'PERSIST-TEST', entry:100, exit:101, qty:1, side:'long'})"); await pg.wait_for_timeout(300); await c1.close()
            c2 = await p.chromium.launch_persistent_context(d, executable_path='/usr/bin/google-chrome'); pg = c2.pages[0] if c2.pages else await c2.new_page()
            await pg.goto(BASE); await pg.wait_for_timeout(1000); n = await pg.evaluate("IA.db.rows('journal').then(r => r.filter(x => x.instrument === 'PERSIST-TEST').length)"); await c2.close()
            R['persistence'] = dict(ok=n == 1, detail=f'journal row present after browser restart: {n}')
        finally: shutil.rmtree(d, ignore_errors=True)
        print('persistence', R['persistence'], flush=True)
    json.dump(R, open(OUT, 'w'), indent=1)
asyncio.run(main())
