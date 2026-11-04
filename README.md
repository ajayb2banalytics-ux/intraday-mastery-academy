# Intraday Mastery — Global Professional Trading Academy (v2.1.0)

An offline, mobile-first personal trading academy for phones and laptops. It includes:
- 102 lessons across four levels, 373 assessment questions and a readiness exam;
- reference libraries of 38 indicators, 30 strategies and 22 candlestick patterns;
- a chart laboratory and a Concepts Lab of 15 graded chart-reading exercise types;
- historical CSV import with validation;
- chart replay, a decision simulator, futures/stock paper trading and **options paper trading** (Nifty/Bank Nifty weekly chain, Greeks, margin, expiry settlement);
- a backtester with out-of-sample and overfitting tests;
- a trading journal with analytics and a **coach** that finds your weak setups and rule breaches;
- **spaced-repetition review** of every question you miss;
- 24 calculators that each show their formula (the payoff builder handles **calendars and diagonals**; charges include **MCX commodities**), a market comparison lab and a DST-safe global market clock.

There is no backend, no account, no paid API and no live data.

> Educational software only. It is not investment advice or a broker, and it does not route orders. Charts and simulations use **SYNTHETIC** data unless you import your own (**HISTORICAL**). Trading can lose all of your capital.

**Start here:** `INSTALL.md` (phone and laptop, two minutes).

## Two ways to run it
1. **Single file.** Open `intraday-academy-standalone.html` in a browser. Everything is inside the one file, and it makes no network requests.
2. **Installable PWA.** Host the `pwa/` folder on any HTTPS static host and open it once. Then use *Install app* (laptop Chrome/Edge) or *Add to Home Screen* (phone). It then works fully offline.

## Your data
Your data is stored only on your device, in the browser's IndexedDB. To move it between phone and laptop:
1. Open **Settings → Download full backup** on one device. This creates one JSON file with a SHA-256 checksum.
2. Open **Restore** on the other device and load that file.

## Keeping market specifications current
Lot sizes, taxes, exchange charges, session times, holidays and FX rates are stored as dated data. Each changing value shows its source and effective date in **Markets → Specifications**, and you can edit them in **Settings**. Items not verified against an official source are labelled UNVERIFIED.

## Project layout
```
index.html, sw.js, manifest.webmanifest, icons/   multi-file PWA
css/app.css                 design system (dark default, light optional)
js/files.js                 ordered script list (index, service worker and build all use it)
js/engines/                 pure maths: indicators, risk and costs, options (+ multi-expiry), options paper,
                            generator, backtest, clock, execution, specs (+ sources), dataimport, structure,
                            srs (spaced repetition), coach (journal insights)
js/content/                 curriculum, 102 lessons, question banks, indicators, strategies, patterns,
                            psychology, library
js/core/                    db (IndexedDB), ui, chart (canvas), progress, app (router), boot
js/modules/                 the sections (dashboard … historical data, concepts lab, settings)
tests/                      Node unit suites, Python cross-validation, Playwright e2e/security/mobile suites
tools/                      build.py (dist/), report.py (reports from test results), fixtures, regime report
docs/                       architecture, curriculum, requirements, QA and validation reports, audit/
```

## Development
```
node tests/engines.test.js && node tests/dataimport.test.js && node tests/structure.test.js && node tests/backtest-audit.test.js
node tests/optpaper.test.js && node tests/srs.test.js && node tests/coach.test.js
node tests/validate-content.js
python3 tests/crosscheck.py                       # independent validation vs numpy/pandas, ta, SciPy
python3 tools/build.py                            # build dist/
cd dist/intraday-academy-pwa && python3 -m http.server 8765 &
python3 tests/smoke.py http://localhost:8765/ file://$PWD/dist/intraday-academy-standalone.html
python3 tests/e2e.py URL OUT.json ; python3 tests/e2e_phase2.py URL OUT.json ; python3 tests/e2e_phase3.py URL OUT.json
python3 tests/security.py SERVED FILE OUT.json ; python3 tests/mobile_a11y.py SERVED AXE_JS OUT.json
python3 tools/report.py                           # regenerate all reports from saved results
```
To work on it you need Node 18+, plus Python 3 with Playwright, numpy, pandas, scipy and `ta` for the test suites. To use the app you only need a browser.
