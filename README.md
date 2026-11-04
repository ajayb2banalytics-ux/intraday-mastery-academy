# Intraday Mastery — Global Professional Trading Academy

An offline, mobile-first personal trading university: 99 lessons across four levels, 357 assessment questions, 38 indicators, 30 strategies, 22 candlestick patterns, a chart laboratory, three simulators, a backtester, a trading journal with analytics, 22 calculators and a DST-safe global market clock. No backend, no account, no paid APIs, no live data.

> Educational software only. Not investment advice, not a broker, no order routing. All charts and simulations use synthetic data unless you import your own. Trading can lose all of your capital.

## Two ways to run it

**1. Single file (simplest).** Open `intraday-academy-standalone.html` in Chrome, Edge, Safari or Firefox — on a laptop or phone. Everything is inside the one file. Your progress is stored in that browser's IndexedDB.
*Phone tip:* save the file to your phone, open it in Chrome (Android) or Files → Safari (iOS). Keep using the same browser so your data stays in one place.

**2. Installable PWA (best on mobile).** Host the `pwa/` folder on any static web host with HTTPS (GitHub Pages, Netlify, S3 + CloudFront, or `python3 -m http.server` on your own machine for testing). Open it once online, then use *Add to Home Screen* / *Install app*. The service worker caches every file; it then works fully offline.

Service workers are not allowed on `file://`, so the single-file version has no install prompt — but it still works offline because it never fetches anything.

## Your data
Stored only on your device (IndexedDB). **Settings → Download full backup** exports everything (progress, notes, bookmarks, journal, paper account, checklists, settings, custom specs) as one JSON file; **Restore** brings it back on any device. The journal also exports/imports CSV.

## Keeping market specifications current
Lot sizes, STT, exchange charges, stamp duty, session times and FX rates are data with an `asOf` date (defaults as of 4 Nov 2026). Edit them in **Settings → Market specifications** when SEBI, NSE, the SEC or your broker change something. Add exchange holidays there too.

## Using real data
Chart Lab and the Quant Lab backtester import OHLCV CSV files (`date[,time],open,high,low,close[,volume]`). Imported data is labelled as yours; synthetic data is always labelled **SYNTHETIC**.

## Project layout
```
index.html              entry (multi-file PWA)
sw.js, manifest.webmanifest, icons/
css/app.css             design system (dark terminal default, light optional)
js/files.js             ordered script list (used by index, service worker, build)
js/engines/             pure maths — indicators, risk & costs, options, generator, backtest, clock, execution
js/content/             curriculum, 99 lessons, question banks, indicators, strategies, patterns, psychology, library
js/core/                db (IndexedDB), ui (markdown, forms, quiz), chart (canvas), progress, app (router)
js/modules/             the 16 sections
tests/                  engines.test.js (Node), validate-content.js (Node), e2e.py + smoke.py (Playwright)
tools/build.py          builds dist/ (standalone HTML, PWA copy, ZIP)
docs/                   architecture, curriculum, requirements register, QA report, status, content spec
```

## Development
```
node tests/engines.test.js          # 111 known-answer tests of every calculation engine
node tests/validate-content.js      # schema + coverage check for all content
python3 -m http.server 8765 &       # serve
python3 tests/smoke.py              # every route loads without errors
python3 tests/e2e.py                # 31 end-to-end functional tests (headless Chrome)
python3 tools/build.py              # build dist/
```
Requires Node 18+ and Python 3 with Playwright for the browser tests; the app itself needs only a browser.
