"""End-to-end tests for v2.2: strategy bot, strategy code export, algo-rules lesson, and the futures sizing fix.
Usage: python3 tests/e2e_v22.py URL OUT_JSON"""
import asyncio, sys, json
from playwright.async_api import async_playwright
BASE, OUT = sys.argv[1], sys.argv[2]
R = []
def rec(id, name, ok, detail=''): R.append(dict(id=id, name=name, ok=bool(ok), detail=str(detail)[:400])); print('PASS' if ok else 'FAIL', id, name, '' if ok else '→ ' + str(detail)[:300], flush=True)
async def go(pg, r, w=700): await pg.evaluate(f"IA.go('#/{r}')"); await pg.wait_for_timeout(w)
async def click(pg, text): await pg.evaluate(f"[...document.querySelectorAll('#view button, #view a.btn')].find(b => b.textContent.trim() === {json.dumps(text)}).click()")
async def view(pg): return await pg.evaluate("document.querySelector('#view').innerText")
async def download(pg, text):
    async with pg.expect_download() as d: await click(pg, text)
    dl = await d.value; path = await dl.path(); return dl.suggested_filename, open(path, encoding='utf-8').read()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        ctx = await b.new_context(viewport={'width': 1366, 'height': 900}, accept_downloads=True); pg = await ctx.new_page(); errors = []
        pg.on('pageerror', lambda e: errors.append(str(e)[:200]))
        await pg.goto(BASE); await pg.wait_for_selector('#view > *'); await pg.evaluate('IA.db.wipe()'); await pg.reload(); await pg.wait_for_selector('#view > *')

        # ---------- Backtester: futures sizing fix + automate panel ----------
        await go(pg, 'quant/backtest', 800); await click(pg, 'Run backtest'); await pg.wait_for_timeout(3500); t = await view(pg)
        n = await pg.evaluate("(() => { const k = [...document.querySelectorAll('#view .kpi')].find(e => e.querySelector('.l').textContent.trim().toLowerCase() === 'trades'); return k ? +k.querySelector('.v').textContent : -1; })()")
        rec('V22-01', 'Backtester defaults on Nifty futures now produce trades (was 0: one lot exceeded unleveraged capital) and show the "Automate these rules" panel', n > 0 and 'Automate these rules' in t, [n, 'Automate these rules' in t])
        name, py = await download(pg, 'Export as Python')
        same = await pg.evaluate("(src) => { const m = src.match(/CONFIG = ([\\s\\S]*?)\\n\\n# ---/); return !!m; }", py)
        rec('V22-02', 'Export as Python downloads a .py file with the embedded CONFIG, the indicator code and no order-placement code', name.endswith('.py') and same and 'def backtest(' in py and 'def supertrend_dir(' in py and 'place_order(' not in py and '"lot": 65' in py, [name, len(py)])
        name2, pine = await download(pg, 'Export as Pine Script')
        rec('V22-03', 'Export as Pine Script downloads a .pine file: //@version=5 strategy with entry, exit and square-off', name2.endswith('.pine') and pine.startswith('//@version=5') and 'strategy.entry(' in pine and 'strategy.exit(' in pine and 'strategy.close_all' in pine, [name2, pine[:60]])
        name3, bars = await download(pg, 'Download these bars (CSV)')
        nb = await pg.evaluate("IA.gen.generate({ preset: 'NIFTY', seed: 11, days: 60, tfMin: 5 }).candles.length")
        rec('V22-04', 'Download these bars (CSV) exports exactly the bars the backtest used, in the format the Python script reads', name3.endswith('.csv') and bars.startswith('datetime,open,high,low,close,volume') and len(bars.strip().split('\n')) == nb + 1, [len(bars.strip().split('\n')), nb])

        # small capital → explicit warning instead of a silent zero
        await pg.evaluate("(() => { const ins = [...document.querySelectorAll('#view label.f')]; const set = (lbl, v) => { const l = ins.find(x => x.firstChild && x.firstChild.textContent.trim() === lbl); const i = l.querySelector('input'); i.value = v; i.dispatchEvent(new Event('input')); }; set('Capital', 300000); set('Risk per trade %', 0.5); })()")
        await click(pg, 'Run backtest'); await pg.wait_for_timeout(3500); t = await view(pg)
        rec('V22-05', 'With capital too small for one Nifty lot at the chosen risk %, the backtest says how many signals were skipped and why', 'could not be traded because one lot needs more risk' in t, t[t.find('Trades'):][:200])
        await pg.evaluate("(() => { const ins = [...document.querySelectorAll('#view label.f')]; const l = ins.find(x => x.firstChild && x.firstChild.textContent.trim() === 'Capital'); const i = l.querySelector('input'); i.value = 2000000; i.dispatchEvent(new Event('input')); })()")
        await click(pg, 'Run backtest'); await pg.wait_for_timeout(3500)

        # ---------- Strategy bot ----------
        await click(pg, 'Send to Strategy bot'); await pg.wait_for_timeout(2000); t = await view(pg)
        cfg = await pg.evaluate("IA.db.get('botcfg')")
        rec('V22-06', 'Send to Strategy bot opens Simulator → Strategy bot with the backtest rules, data source and costs', 'Strategy bot' in await pg.inner_text('#view .tabs .on') and 'Opening-range breakout' in t and 'SYNTHETIC' in t and cfg and cfg['data']['seed'] == 11 and cfg['cfg']['capital'] == 2000000, [t[:200], cfg and cfg['data']])
        lbl0 = await pg.inner_text('#bot-day'); await click(pg, 'Advance 1 bar'); await pg.wait_for_timeout(300); lbl1 = await pg.inner_text('#bot-day')
        await click(pg, 'To session close'); await pg.wait_for_timeout(600)
        eod = await pg.evaluate("IA.db.get('botstate').then(s => s.i)")
        rec('V22-07', 'Advance 1 bar moves the bot one bar; To session close stops after the last bar of that session', lbl0.startswith('Bar 0 ') and lbl1.startswith('Bar 1 ') and eod > 1, [lbl0, lbl1, eod])
        await click(pg, 'Run to the end'); await pg.wait_for_function("document.querySelector('#bot-day').textContent.includes('End of data')", timeout=60000)
        chk = await pg.evaluate("""(async () => { const spec = await IA.db.get('botcfg'); const ins = IA.exec.INSTR[spec.data.preset];
            const perDay = Math.ceil(IA.gen.PRESETS[spec.data.preset].minutes / spec.data.tf); const days = Math.max(3, Math.min(spec.data.days, Math.floor(1500 / perDay)));
            const c = IA.gen.generate({ preset: spec.data.preset, seed: spec.data.seed, days, tfMin: spec.data.tf }).candles; const s2 = c.findIndex(b => b.d !== c[0].d);
            const cfg = { ...spec.cfg, tick: ins.tick, lot: ins.lot }; const bot = IA.bot.create(c, cfg, { startI: s2 }); IA.bot.advance(bot, c, 'all');
            const k = [...document.querySelectorAll('#view .kpi')].find(e => e.querySelector('.l').textContent.trim().toLowerCase() === 'closed trades');
            return { shown: +k.querySelector('.v').textContent, engine: bot.S.trades.length, log: document.querySelectorAll('#view .card .small > div').length }; })()""")
        rec('V22-08', 'Run to the end: the trade count on screen equals an independent bot run in the page on the same bars and rules; the decision log is filled', chk['shown'] == chk['engine'] and chk['shown'] > 0 and chk['log'] > chk['shown'], chk)
        await click(pg, 'Send new trades to journal'); await pg.wait_for_timeout(800)
        j = await pg.evaluate("IA.db.rows('journal').then(r => { const b = r.filter(x => x.source === 'strategy-bot'); return { n: b.length, syn: b.every(x => x.synthetic === true), charges: b.every(x => x.charges > 0) }; })")
        await click(pg, 'Send new trades to journal'); await pg.wait_for_timeout(500)
        j2 = await pg.evaluate("IA.db.rows('journal').then(r => r.filter(x => x.source === 'strategy-bot').length)")
        rec('V22-09', 'Bot trades go to the journal once (marked synthetic, with costs); pressing again adds nothing', j['n'] == chk['shown'] and j['syn'] and j['charges'] and j2 == j['n'], [j, j2])
        await pg.reload(); await pg.wait_for_selector('#view > *'); await pg.wait_for_timeout(2500)
        rec('V22-10', 'The bot\'s progress survives a page reload', 'End of data' in await pg.inner_text('#bot-day'), await pg.inner_text('#bot-day'))

        # ---------- Lesson ----------
        await go(pg, 'lesson/l4-algo-india', 1200); t = ''; widget = False
        for sec in ['India', 'The maths', 'Check & complete']:
            await pg.evaluate(f"[...document.querySelectorAll('#view button, #view a')].find(e => e.textContent.trim() === {json.dumps(sec)}).click()"); await pg.wait_for_timeout(500)
            t += await view(pg)
            if sec == 'The maths': widget = await pg.evaluate("[...document.querySelectorAll('#view input')].length >= 3")
        rec('V22-11', 'Algo-rules lesson renders: SEBI framework table, 10 orders/second threshold, 1 Apr 2026 compliance date, cost maths with the live charges calculator, and the quiz', all(s in t for s in ['Broker is the principal', '10 orders per second', '1 Apr 2026', 'Net expectancy', 'white-box']) and widget, [s for s in ['Broker is the principal', '10 orders per second', '1 Apr 2026', 'Net expectancy', 'white-box'] if s not in t] + [widget])
        await go(pg, 'module/L4-M2', 800)
        rec('V22-12', 'The lesson is listed in Level 4 → Quantitative foundations', 'From backtest to live algo' in await view(pg))
        rec('V22-13', 'No page errors during the v2.2 flows', not errors, errors[:3])
        await b.close()
    json.dump(R, open(OUT, 'w'), indent=1); print(f"\n{sum(r['ok'] for r in R)} passed, {sum(not r['ok'] for r in R)} failed")
asyncio.run(main())
