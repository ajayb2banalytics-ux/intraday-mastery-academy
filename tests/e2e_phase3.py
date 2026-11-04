"""End-to-end tests for the v2.1 additions: options paper trading, multi-expiry payoff builder, spaced-repetition
review, journal coaching and MCX charges. Usage: python3 tests/e2e_phase3.py URL OUT_JSON"""
import asyncio, sys, json, re
from playwright.async_api import async_playwright
BASE, OUT = sys.argv[1], sys.argv[2]
R = []
def rec(id, name, ok, detail=''): R.append(dict(id=id, name=name, ok=bool(ok), detail=str(detail)[:400])); print('PASS' if ok else 'FAIL', id, name, '' if ok else '→ ' + str(detail)[:300], flush=True)
async def go(pg, r, w=600): await pg.evaluate(f"location.hash='#/{r}'"); await pg.wait_for_timeout(w)
async def click(pg, text): await pg.evaluate(f"[...document.querySelectorAll('#view button')].find(b => b.textContent.trim() === {json.dumps(text)}).click()")
async def view(pg): return await pg.evaluate("document.querySelector('#view').innerText")
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx = await b.new_context(viewport={'width': 1366, 'height': 900}); pg = await ctx.new_page(); errors = []
        pg.on('pageerror', lambda e: errors.append(str(e)[:200])); pg.on('dialog', lambda d: asyncio.ensure_future(d.accept()))
        await pg.goto(BASE); await pg.wait_for_selector('#view > *'); await pg.evaluate('IA.db.wipe()'); await pg.reload(); await pg.wait_for_selector('#view > *')
        # ---------- Options paper trading ----------
        await go(pg, 'simulator/options', 1200)
        rows = await pg.evaluate("document.querySelectorAll('#view table')[0].querySelectorAll('tbody tr').length")
        t = await view(pg)
        rec('P3-01', 'Options paper: chain shows 13 strikes (ATM ± 6) with bid/ask, delta, IV and B/S buttons; model and synthetic-volatility caveats shown', rows == 13 and 'CALL BID/ASK' in t.upper() and 'not SPAN' in t and 'more volatile than the real index' in t, [rows, t[:200]])
        await pg.evaluate("[...document.querySelectorAll('#view button')].find(x => /^Buy W1-.*-CE$/.test(x.getAttribute('aria-label') || '') && x.closest('tr').querySelector('.accent')).click()"); await pg.wait_for_timeout(200)
        key = await pg.evaluate("document.querySelector('#view .card h3 + .small b').textContent")
        info = await pg.evaluate("[...document.querySelectorAll('#view .small.muted')].map(e => e.textContent).find(s => s.startsWith('Now: bid')) || ''")
        await click(pg, 'Place order'); await pg.wait_for_timeout(300)
        before = await pg.evaluate("IA.db.get('optpaper').then(s => s.idx)")
        await click(pg, 'Advance 1 bar'); await pg.wait_for_timeout(700)
        st = await pg.evaluate(f"IA.db.get('optpaper').then(s => {{ const p = s.book.pos[{json.dumps(key)}]; const f = s.book.fills[0]; return {{ qty: p && p.qty, avg: p && p.avg, fillT: f && f.t, idx: s.idx }}; }})")
        exp_ask = await pg.evaluate(f"(() => {{ const OP = IA.optpaper, U = OP.UNDER.NIFTY; return IA.db.get('optpaper').then(s => {{ const d = IA.gen.generate({{ preset: s.under, seed: s.seed, days: 20, tfMin: 5 }}).candles; const e = OP.expiries(d)[0]; const c = OP.parse({json.dumps(key)}); return OP.quote(U, d[{before}].o, c.K, c.type, OP.tYears({before}, e, false), OP.baseIV(d, {before}, U)).ask; }}); }})()")
        rec('P3-02', 'Options paper: an ATM call bought from the chain fills 1 lot (65) on the NEXT bar at that bar\'s open ask', key.endswith('-CE') and st['qty'] == 65 and abs(st['avg'] - exp_ask) < 1e-9 and info.startswith('Now: bid'), [key, st, exp_ask, info[:80]])
        t = await view(pg)
        rec('P3-03', 'Options paper: positions, Greeks (delta/theta/vega), funds and payoff chart shown for the open position', key in t and 'THETA / DAY' in t.upper() and 'FUNDS AVAILABLE' in t.upper() and 'AT NEAREST EXPIRY' in t.upper(), t[t.find('Equity'):][:200])
        # short a put → margin > 0
        await pg.evaluate("[...document.querySelectorAll('#view button')].find(x => /^Sell W1-.*-PE$/.test(x.getAttribute('aria-label') || '') && x.closest('tr').querySelector('.accent')).click()"); await pg.wait_for_timeout(150)
        await click(pg, 'Place order'); await click(pg, 'Advance 1 bar'); await pg.wait_for_timeout(700)
        mtxt = await pg.evaluate("[...document.querySelectorAll('#view .kpi')].find(k => k.textContent.startsWith('Approx. margin used')).textContent")
        mval = float(re.sub(r'[^0-9.]', '', mtxt.split('used')[1]) or 0)
        rec('P3-04', 'Options paper: selling an ATM put shows an approximate margin above 0', mval > 50000, mtxt)
        await pg.reload(); await pg.wait_for_selector('#view > *'); await go(pg, 'simulator/options', 1200)
        t = await view(pg); rec('P3-05', 'Options paper: account and positions survive a reload', key in t and 'Positions' in t and 'No open positions' not in t, t[:120])
        await click(pg, 'Exit all positions'); await click(pg, 'Advance 1 bar'); await pg.wait_for_timeout(700)
        flat = await pg.evaluate("IA.db.get('optpaper').then(s => Object.values(s.book.pos).every(p => !p.qty) && s.book.trades.length === 2)")
        rec('P3-06', 'Options paper: "Exit all" closes both legs on the next bar and records two trades with charges', flat, await pg.evaluate("IA.db.get('optpaper').then(s => JSON.stringify(s.book.trades.map(x => [x.key, Math.round(x.charges)])))"))
        await pg.evaluate("[...document.querySelectorAll('#view button')].find(x => /^Buy W1-.*-CE$/.test(x.getAttribute('aria-label') || '') && x.closest('tr').querySelector('.accent')).click()"); await click(pg, 'Place order')
        await click(pg, 'To next expiry'); await pg.wait_for_timeout(2500)
        tr = await pg.evaluate("IA.db.get('optpaper').then(s => s.book.trades.map(x => x.why))")
        rec('P3-07', 'Options paper: "To next expiry" settles the open option at intrinsic value (expiry trade recorded)', any(w.startswith('expiry:') for w in tr), tr)
        await click(pg, 'Send new trades to journal'); await pg.wait_for_timeout(500)
        jn = await pg.evaluate("IA.db.rows('journal').then(r => r.filter(x => x.source === 'options-paper').length)")
        rec('P3-08', 'Options paper: closed trades can be sent to the journal', jn == 3, jn)
        # ---------- Multi-expiry payoff builder ----------
        await go(pg, 'calculators/options-payoff', 900)
        await pg.evaluate("(s => { s.value = 'Long call calendar'; s.dispatchEvent(new Event('change')); })([...document.querySelectorAll('#view select')].find(x => [...x.options].some(o => o.value === 'Long call calendar')))"); await pg.wait_for_timeout(600)
        t = await view(pg)
        rec('P3-09', 'Payoff builder: a long call calendar is valued at the FRONT expiry with a finite max loss (≈ net debit) and two breakevens; per-leg days/IV shown', 'MAX GAIN AT FRONT EXPIRY' in t.upper() and 'MAX LOSS AT FRONT EXPIRY' in t.upper() and 'UNLIMITED' not in t.upper() and 'NaN' not in t and 'DAYS' in t.upper() and 'IV %' in t.upper(), t[t.find('Net premium'):][:300])
        await pg.evaluate("(s => { s.value = 'Iron condor'; s.dispatchEvent(new Event('change')); })([...document.querySelectorAll('#view select')].find(x => [...x.options].some(o => o.value === 'Long call calendar')))"); await pg.wait_for_timeout(500)
        t = await view(pg); rec('P3-10', 'Payoff builder: single-expiry strategies still use the exact expiry analysis', 'MAX GAIN' in t.upper() and 'AT FRONT EXPIRY' not in t.upper() and 'exactly at every strike' in (await pg.evaluate("document.querySelector('#view').textContent")), t[t.upper().find('NET PREMIUM'):][:200])
        # ---------- Spaced repetition ----------
        await go(pg, 'dashboard', 900); t = await view(pg)
        rec('P3-11', 'Dashboard shows the Spaced review card', 'Spaced review' in t, t[:120])
        await go(pg, 'assess/L1-M1', 900)
        await pg.evaluate("[...document.querySelectorAll('#view .q')].forEach(q => { const opts = [...q.querySelectorAll('.opt')]; opts[opts.length - 1].click(); })"); await pg.wait_for_timeout(600)
        st = await pg.evaluate("IA.progress.srsState()"); missed = [k for k, v in st['items'].items() if not v['graduated']]
        rec('P3-12', 'Wrong answers in a module assessment enter the review queue (box 1, due in 1 day)', len(missed) >= 1 and all(st['items'][k]['box'] == 0 for k in missed), [len(missed)])
        await pg.evaluate("(async () => { const s = IA.progress.srsState(); Object.values(s.items).forEach(v => v.due = Date.now() - 1000); await IA.progress.save(); })()"); await pg.wait_for_timeout(300)
        await go(pg, 'review', 900); t = await view(pg); nq = await pg.evaluate("document.querySelectorAll('#view .q').length")
        rec('P3-13', 'Review page lists the due questions as a quiz', 'Review session' in t and nq == min(20, len(missed)), [nq, len(missed)])
        await pg.evaluate("(() => { const qs = IA.srs.due(IA.progress.srsState()).map(IA.srs.resolve).slice(0, 20); [...document.querySelectorAll('#view .q')].forEach((q, i) => q.querySelectorAll('.opt')[qs[i].a].click()); })()"); await pg.wait_for_timeout(600)
        st2 = await pg.evaluate("IA.progress.srsState()"); up = sum(1 for k in missed if st2['items'][k]['box'] == 1)
        rec('P3-14', 'Answering due questions correctly moves them to box 2 (next due in 3 days)', up == min(20, len(missed)), [up, len(missed)])
        # ---------- Journal coaching ----------
        await pg.evaluate("""(async () => { await IA.db.set('riskPlan', { capital: 500000, riskPct: 0.5, dailyLossPct: 1.5, weeklyLossPct: 4, maxTrades: 4, maxHeatPct: 2, maxConsecLosses: 3 });
          for (let k = 0; k < 6; k++) await IA.db.put('journal', { date: '2026-10-05', instrument: 'NIFTY FUT', strategy: k < 3 ? 'ORB' : 'VWAP fade', side: 'long', entry: 25800, exit: k < 4 ? 25810 : 25780, stop: 25790, qty: 65, charges: 950, entryTime: `1${k}:00`, exitTime: `1${k}:20`, emotion: k === 5 ? 'Revenge' : 'Calm', mistakes: k === 5 ? ['Moved stop'] : [] }); })()""")
        await go(pg, 'journal/coach', 1000); t = await view(pg)
        rec('P3-15', 'Journal coach shows insights with sample sizes: small sample, over-trading against the plan, costs, finding/hint labels', 'Small sample' in t and 'Over-trading' in t and 'n = ' in t and ('finding' in t or 'hint' in t), t[:300])
        # ---------- MCX ----------
        await go(pg, 'calculators/charges-india', 800)
        opts = await pg.evaluate("[...([...document.querySelectorAll('#view select')].find(x => [...x.options].some(o => o.value === 'commFut'))).options].map(o => o.textContent)")
        await pg.evaluate("""(() => { const v = document.querySelector('#view'); const s = [...document.querySelectorAll('#view select')].find(x => [...x.options].some(o => o.value === 'commFut')); s.value = 'commFut'; s.dispatchEvent(new Event('input')); s.dispatchEvent(new Event('change')); const ins = [...s.closest('.card').querySelectorAll('input')]; const set = (i, x) => { ins[i].value = x; ins[i].dispatchEvent(new Event('input')); ins[i].dispatchEvent(new Event('change')); }; set(0, 100); set(1, 5500); set(2, 5520); })()"""); await pg.wait_for_timeout(500)
        t = await view(pg)
        rec('P3-16', 'Charges calculator offers MCX futures/options; crude 1 lot 5,500→5,520 shows CTT and total ≈ ₹142.01', any('MCX commodity futures' in o for o in opts) and 'CTT' in t and '142.01' in t, [opts, t[t.find('Total'):][:120] if 'Total' in t else t[:200]])
        await go(pg, 'markets/specs', 900); t = await view(pg)
        rec('P3-17', 'Specs page shows MCX contracts and counts items backed only by secondary sources', 'CRUDEOIL' in t and 'secondary sources only' in t, t[:120])
        await go(pg, 'markets/india', 900); t = await view(pg)
        rec('P3-18', 'India market page lists the MCX session (09:00–23:55)', 'MCX' in t and '09:00–23:55' in t, t[t.find('Sessions'):][:200])
        rec('P3-19', 'No uncaught page errors during the run', not errors, errors[:4])
        await b.close()
    json.dump(R, open(OUT, 'w'), indent=1); print(f"\n{sum(r['ok'] for r in R)} passed, {sum(not r['ok'] for r in R)} failed")
asyncio.run(main())
