"""Route smoke test + load-time measurement. Usage: python3 tests/smoke.py URL [URL ...]
Writes tests/smoke-results.json when given more than one URL (served + file://)."""
import asyncio, sys, json, time
from playwright.async_api import async_playwright
URLS = sys.argv[1:] or ['http://localhost:8765/index.html']
ROUTES = ['simulator/bot', 'lesson/l4-algo-india', 'simulator/options', 'review', 'journal/coach', 'calculators/charges-india', '', 'academy', 'module/L1-M1', 'lesson/l1-exchanges', 'lesson/l3-greeks', 'technical/indicators', 'indicator/rsi', 'technical/patterns', 'pattern/hammer', 'technical/charttypes', 'technical/structure', 'chartlab', 'markets/clock', 'markets/india', 'markets/us', 'markets/global', 'markets/assets', 'markets/specs', 'strategies', 'strategy/opening-range-breakout', 'derivatives/overview', 'derivatives/payoff', 'derivatives/matrix', 'derivatives/greeks', 'derivatives/chain', 'derivatives/futures', 'risk', 'simulator/replay', 'simulator/decision', 'simulator/paper', 'journal/log', 'journal/add', 'journal/stats', 'quant/backtest', 'quant/walkforward', 'quant/montecarlo', 'quant/ruin', 'quant/method', 'calculators', 'psychology', 'psychology/self', 'workflow', 'library/books', 'library/resources', 'library/glossary', 'library/reading', 'library/bookmarks', 'assessments', 'assess/L1-M1', 'settings', 'search/vwap']
async def run(url):
    errs = {}; perf = None
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width': 390, 'height': 844}); cur = {'r': ''}
        pg.on('console', lambda m: m.type == 'error' and errs.setdefault(cur['r'], []).append(m.text))
        pg.on('pageerror', lambda e: errs.setdefault(cur['r'], []).append('PAGEERROR ' + str(e)))
        t0 = time.time(); await pg.goto(url); await pg.wait_for_selector('#view > *', timeout=20000); perf = round((time.time() - t0) * 1000)
        for r in ROUTES:
            cur['r'] = r; await pg.evaluate(f"location.hash = '#/{r}'"); await pg.wait_for_timeout(450)
            txt = await pg.evaluate("document.querySelector('#view').innerText.slice(0,300)")
            if 'Something went wrong' in txt or 'Page not found' in txt: errs.setdefault(r, []).append('VIEW: ' + txt[:200])
        await b.close()
    return errs, perf
async def main():
    out = {'ok': True, 'routes': len(ROUTES), 'perf': ''}
    for u in URLS:
        errs, perf = await run(u)
        label = 'file:// standalone' if u.startswith('file:') else 'served PWA'
        print(json.dumps(errs, indent=1) if errs else f'NO ERRORS on {len(ROUTES)} routes ({label}); first render {perf} ms')
        out['ok'] = out['ok'] and not errs; out['perf'] += f"- {label}: dashboard first render {perf} ms (cold load, headless Chrome, local disk).\n"
    if len(URLS) > 1: json.dump(out, open('tests/smoke-results.json', 'w'), indent=1)
asyncio.run(main())
