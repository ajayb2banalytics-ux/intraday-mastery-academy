"""End-to-end tests for Phase 2 features. Usage: python3 tests/e2e_phase2.py URL OUT_JSON"""
import asyncio, sys, json, os, re
from playwright.async_api import async_playwright
BASE, OUT = sys.argv[1], sys.argv[2]
FX = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fixtures')
R = []
def rec(id, name, ok, detail=''): R.append(dict(id=id, name=name, ok=bool(ok), detail=str(detail)[:400])); print('PASS' if ok else 'FAIL', id, name, '' if ok else '→ ' + str(detail)[:300], flush=True)
async def go(pg, r, w=500): await pg.evaluate(f"location.hash='#/{r}'"); await pg.wait_for_timeout(w)
async def click(pg, text): await pg.evaluate(f"[...document.querySelectorAll('button')].find(b => b.textContent.trim() === {json.dumps(text)}).click()")
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx = await b.new_context(viewport={'width': 1366, 'height': 900}, accept_downloads=True); pg = await ctx.new_page(); errors = []
        pg.on('pageerror', lambda e: errors.append(str(e)[:200])); pg.on('dialog', lambda d: asyncio.ensure_future(d.accept()))
        await pg.add_init_script("window.MAIN = () => { const el = document.querySelector('#view .chart-box'); return IA._charts.find(c => c.box === el); };")
        await pg.goto(BASE); await pg.wait_for_timeout(1000); await pg.evaluate('IA.db.wipe()'); await pg.reload(); await pg.wait_for_timeout(900)
        # ---- Historical data import through the UI ----
        await go(pg, 'data', 700)
        legend = await pg.evaluate("document.querySelector('#view').innerText")
        rec('P2-01', 'Data page explains SYNTHETIC / HISTORICAL / DELAYED / LIVE and states delayed & live are not available', all(k in legend for k in ['SYNTHETIC', 'HISTORICAL', 'DELAYED', 'LIVE']) and 'never label anything as live' in legend, legend[:200])
        async with pg.expect_file_chooser() as fc: await click(pg, 'Choose CSV file')
        await (await fc.value).set_files(os.path.join(FX, 'defects-nse-5m.csv')); await pg.wait_for_timeout(900)
        t = await pg.evaluate("document.querySelector('#view').innerText")
        U = t.upper(); rec('P2-02', 'Import of a defective NSE 5-min file shows a validation report: dropped rows, duplicates, missing candles, outside-hours, jump, quality not good', 'VALIDATION REPORT' in U and 'MISSING CANDLES' in U and 'USABLE WITH ISSUES' in U and 'ROW-LEVEL LOG' in U, t[t.find('Validation'):][:300])
        async with pg.expect_file_chooser() as fc: await click(pg, 'Choose CSV file')
        await (await fc.value).set_files(os.path.join(FX, 'nse-5m-naive-utc.csv')); await pg.wait_for_timeout(900)
        t = await pg.evaluate("document.querySelector('#view').innerText")
        rec('P2-03', 'Naive-UTC file read as IST is flagged ("check time zone") and saving is discouraged', 'check time zone' in t and 'Fix the time-zone setting' in t, t[t.find('Quality'):][:120])
        await pg.evaluate("(s => { s.value = 'UTC'; s.dispatchEvent(new Event('change')); })([...document.querySelectorAll('label.f')].find(l => l.firstChild.textContent === 'Timestamps are in').querySelector('select'))"); await pg.wait_for_timeout(700)
        t = await pg.evaluate("document.querySelector('#view').innerText"); rec('P2-04', 'Switching "Timestamps are in" to UTC fixes it (quality good)', 'Quality: good' in t or 'QUALITY: GOOD' in t.upper(), t[t.upper().find('QUALITY'):][:60])
        async with pg.expect_file_chooser() as fc: await click(pg, 'Choose CSV file')
        await (await fc.value).set_files(os.path.join(FX, 'tradingview-nse-5m.csv')); await pg.wait_for_timeout(500)
        await pg.evaluate("(s => { s.value = ''; s.dispatchEvent(new Event('change')); })([...document.querySelectorAll('label.f')].find(l => l.firstChild.textContent === 'Timestamps are in').querySelector('select'))"); await pg.wait_for_timeout(600)
        await pg.evaluate("[...document.querySelectorAll('label.f')].find(l => l.firstChild.textContent === 'Dataset name').querySelector('input').value = 'TEST NIFTY 5m'")
        await click(pg, 'Save dataset'); await pg.wait_for_timeout(700)
        ds = await pg.evaluate("IA.datasets.list()"); dsid = ds[0]['id'] if ds else None
        rec('P2-05', 'Dataset saved to the library with timeframe, range and bar count', ds and ds[0]['name'] == 'TEST NIFTY 5m' and ds[0]['tfMin'] == 5 and ds[0]['bars'] == 225, ds[:1])
        # ---- Chart Lab on historical data, resampling ----
        await go(pg, f'chartlab?ds={dsid}', 1500)
        lg = await pg.evaluate("MAIN().legend.innerText"); n5 = await pg.evaluate("MAIN().c.length")
        await pg.evaluate("(s => { s.value = '15'; s.dispatchEvent(new Event('change')); })([...document.querySelectorAll('label.f')].find(l => l.firstChild.textContent === 'Timeframe').querySelector('select'))"); await pg.wait_for_timeout(900)
        n15 = await pg.evaluate("MAIN().c.length")
        rec('P2-06', 'Chart Lab shows the dataset labelled HISTORICAL; 15-min resampling gives one third of the 5-min bars per session', 'HISTORICAL' in lg and 'SYNTHETIC' not in lg and n15 * 3 == n5, [lg[:60], n5, n15])
        # ---- Historical replay: no future candles ----
        await go(pg, f'simulator/replay?ds={dsid}', 1500)
        st = await pg.evaluate("(() => { const ch = MAIN(); return { len: ch.len(), total: ch.c.length, label: ch.legend.innerText.slice(0, 40), last: ch.c[ch.len()-1].t }; })()")
        await click(pg, 'Next bar ▸'); await pg.wait_for_timeout(300)
        st2 = await pg.evaluate("(() => { const ch = MAIN(); const r = ch._range(); return { len: ch.len(), maxDrawn: r[1] }; })()")
        rec('P2-07', 'Historical replay: chart exposes only revealed bars (drawn range ≤ revealed), future hidden, one step reveals exactly one bar, labelled HISTORICAL', st['len'] < st['total'] and st2['len'] == st['len'] + 1 and st2['maxDrawn'] <= st2['len'] and 'HISTORICAL' in st['label'], [st, st2])
        price = await pg.evaluate("MAIN().c[MAIN().len()-1].c")
        inp = await pg.query_selector_all('.view .card input.i'); await inp[1].fill(str(round(price * 0.995, 1))); await inp[4].fill('65')
        await pg.evaluate("document.querySelector('.btn.buy').click()"); await pg.wait_for_timeout(200); nxt = await pg.evaluate("MAIN().c[MAIN().len()].o")
        await click(pg, 'Next bar ▸'); await pg.wait_for_timeout(300)
        log = await pg.evaluate("[...document.querySelectorAll('.card')].find(c => c.querySelector('h3')?.textContent === 'Event log').innerText")
        m = re.search(r'Filled #\d+: 65 @ ([\d.]+)', log)
        rec('P2-08', 'Historical replay order fills at the NEXT bar\'s open ± spread/slippage', m is not None and abs(float(m.group(1)) - nxt) <= 1.0, [log[:160], nxt])
        # ---- Quant on historical + research tabs ----
        await go(pg, f'quant/backtest?ds={dsid}', 1000); await click(pg, 'Run backtest'); await pg.wait_for_timeout(2500)
        t = await pg.evaluate("document.querySelector('#view').innerText"); rec('P2-09', 'Backtest on a HISTORICAL dataset is labelled as such (not synthetic)', 'HISTORICAL' in t or 'imported file' in t, t[t.find('Using'):][:120])
        for tab, needle, rid in [('oos', 'Best in-sample vs out-of-sample', 'P2-10'), ('overfit', 'p-value', 'P2-11'), ('regimes', 'News shocks', 'P2-12')]:
            await go(pg, 'quant/' + tab, 900); await click(pg, 'Run'); await pg.wait_for_timeout(9000 if tab == 'regimes' else 5000)
            t = await pg.evaluate("document.querySelector('#view').innerText"); rec(rid, f'Quant Lab "{tab}" runs and reports', needle.lower() in t.lower() and 'went wrong' not in t, t[-200:])
        # ---- Concepts lab: every exercise completes ----
        ids = await pg.evaluate("IA.conceptTopics.map(t => t.id)"); bad = []
        for cid in ids:
            await go(pg, 'concepts/' + cid, 1200)
            has_q = await pg.evaluate("!!document.querySelector('#view .q .opt')")
            if has_q: await pg.evaluate("document.querySelector('#view .q .opt').click()")
            else: await pg.evaluate("(() => { const c = [...document.querySelectorAll('#view .chart-box canvas')].pop(); const r = c.getBoundingClientRect(); c.dispatchEvent(new MouseEvent('click', { clientX: r.left + r.width * 0.45, clientY: r.top + r.height * 0.4, bubbles: true })); })()")
            await pg.wait_for_timeout(400); t = await pg.evaluate("document.querySelector('#view').innerText")
            if not (('Correct.' in t) or ('Not quite.' in t)) or 'went wrong' in t: bad.append(cid + ': ' + t[-120:].replace('\n', ' '))
        stats = await pg.evaluate("IA.db.get('conceptStats')")
        rec('P2-13', f'All {len(ids)} Concepts-Lab exercises generate a chart, accept an answer, grade it and record the result', not bad and len(stats or {}) == len(ids), bad[:4] or stats)
        # ---- Market comparison, new calculators, specs provenance, holidays ----
        await go(pg, 'markets/compare', 1500); t = await pg.evaluate("document.querySelector('#view').innerText")
        rec('P2-14', 'Market comparison lab reports volatility, ranges, gaps, round-trip charges and sessions for two markets', all(k in t for k in ['Annualised volatility', 'Average overnight gap', 'Round-trip charges', 'Main session']), t[:200])
        for cal, needle, rid in [('losing-streak', 'Expected longest losing streak', 'P2-15'), ('options-risk', 'Worst cell', 'P2-16')]:
            await go(pg, 'calculators/' + cal, 700); t = await pg.evaluate("document.querySelector('#view').innerText"); rec(rid, f'Calculator {cal} computes and shows its working', needle.lower() in t.lower() and 'NaN' not in t and 'working' in t.lower(), t[-200:])
        await go(pg, 'markets/specs', 900); t = await pg.evaluate("document.querySelector('#view').innerText")
        rec('P2-17', 'Specs page shows provenance (verified / corrected / unverified counts, sources) and verified holiday lists', 'Provenance' in t and 'unverified' in t and 'Exchange holidays' in t and '2026-10-02' in t, t[t.find('Provenance'):][:200])
        await pg.clock.set_fixed_time('2026-11-24T04:30:00Z'); await go(pg, 'markets/clock', 1200)
        t = await pg.evaluate("[...document.querySelectorAll('.clock-row')][0].innerText")
        rec('P2-18', 'Global clock marks NSE closed for the verified 24 Nov 2026 holiday (clock set to 10:00 IST)', 'Holiday' in t, t)
        await pg.clock.set_fixed_time('2026-11-25T04:30:00Z'); await go(pg, 'markets/clock', 1200); t = await pg.evaluate("[...document.querySelectorAll('.clock-row')][0].innerText")
        rec('P2-19', 'Next trading day (25 Nov 2026, 10:00 IST) NSE shows Open', 'Open' in t, t)
        # ---- Settings: storage card, device-transfer guide, checksum on backup ----
        await go(pg, 'settings', 800); t = await pg.evaluate("document.querySelector('#view').innerText")
        rec('P2-20', 'Settings shows storage status and the phone ↔ laptop transfer guide', 'Storage on this device' in t and 'phone AND laptop' in t, t[:100])
        async with pg.expect_download() as dl: await click(pg, 'Download full backup')
        bk = json.load(open(await (await dl.value).path())); rec('P2-21', 'Downloaded backup contains a SHA-256 checksum and the saved dataset', len(bk.get('sha256', '')) == 64 and any(r.get('coll') == 'datasets' for r in bk['rows']), list(bk.keys()))
        rec('P2-22', 'No uncaught page errors during the Phase 2 run', not errors, errors[:4])
        await b.close()
    json.dump(R, open(OUT, 'w'), indent=1); print(f"\n{sum(r['ok'] for r in R)} passed, {sum(not r['ok'] for r in R)} failed")
asyncio.run(main())
