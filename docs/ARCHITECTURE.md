# Intraday Mastery Academy — Architecture

Version 2.2.0 · 4 Nov 2026

## 1. Principles

| Principle | How it is met |
|---|---|
| Offline-first | All content, engines and data generators ship inside the app. Service worker pre-caches every asset. No network call is ever required. |
| No backend, no account | Everything lives in the browser's IndexedDB. Export/import is a single JSON file. |
| Standalone | Two forms: (a) multi-file PWA (`index.html` + `js/` + `css/` + `sw.js`), (b) a single self-contained `intraday-academy-standalone.html` built by inlining every file. |
| Testable maths | Every calculation lives in a pure engine file (no DOM). The same files run in Node for known-answer unit tests. |
| Dated, configurable market specs | Lot sizes, tax rates, exchange fees and session times are data, each with an `asOf` date and source note, editable in Settings. |
| Honesty | Synthetic data is labelled on every chart. No live signals, no profit claims, no invented statistics. |

## 2. Layers

```
┌───────────────────────── UI (js/modules/*.js) ─────────────────────────┐
│ Dashboard · Academy · Technical · Chart Lab · Markets · Strategies ·   │
│ Derivatives · Risk · Simulator · Journal · Quant Lab · Calculators ·   │
│ Psychology · Library · Assessments · Settings · Historical Data ·      │
│ Concepts Lab · Workflow · Search                                       │
├──────────────── App core (js/core) ────────────────────────────────────┤
│ app.js (hash router, nav, shell) · ui.js (DOM helpers, forms, tables)  │
│ db.js (IndexedDB key-value + collections, export/import)               │
│ chart.js (canvas candlestick renderer, overlays, pan/zoom, drawings)   │
│ progress.js (mastery, unlock rules, gap analysis)                      │
├──────────────── Content (js/content) ──────────────────────────────────┤
│ curriculum.js (levels → modules → lessons) · lessons-*.js (bodies and  │
│ question banks) · indicators-lib.js · strategies.js · patterns.js ·    │
│ psychology.js · library.js                                             │
├──────────────── Engines (js/engines) — pure, no DOM ───────────────────┤
│ indicators.js · risk.js · costs.js · options.js · marketgen.js ·       │
│ backtest.js (+ Monte Carlo, ruin, OOS, random-entry) · clock.js ·      │
│ execution.js · specs.js · specs-sources.js · dataimport.js ·           │
│ structure.js                                                           │
└────────────────────────────────────────────────────────────────────────┘
```

Scripts are classic (non-module) scripts attached to one global namespace `IA`, so the app runs from `file://` on a phone as well as from a web server. Load order: engines → content → core → modules → `js/boot.js` (calls `IA.start()`). The list lives once in `js/files.js`; `tools/build.py` writes it into `index.html`, and `sw.js` reads it for the pre-cache.

## 3. Data model (IndexedDB `ia-db`, store `kv` + store `rows`)

| Key / collection | Shape |
|---|---|
| `progress` | `{lessons:{id:{done,ts}}, quizzes:{id:{best,attempts,last}}, track:{india,us,global,ta,deriv,risk,strategy}}` |
| `notes` (rows) | `{id, lessonId, text, ts}` |
| `bookmarks` | `[lessonId]` |
| `journal` (rows) | trade record — 26 fields per §13 of brief |
| `paper` | `{cash, positions[], orders[], history[], settings}` |
| `checklists` | `{date:{pre[],during[],post[]}}` + editable templates |
| `specs` | user overrides of market specs |
| `settings` | `{currency, tz, theme, dailyGoal}` |
| `datasets` (rows) | imported historical OHLCV: `{name, file, exchange, symbol, tfMin, from, to, quality, report, candles[]}` |
| `conceptStats` | Concepts Lab attempts/accuracy per topic |
| `optpaper` | options paper account: `{under, seed, idx, book:{cash, pos{key:{qty,avg}}, orders, trades, fills}}` |
| `progress.srs` | spaced-repetition items `{id:{box, due, lapses, reviews, graduated}}` |

Export = all keys + all rows → one JSON file with schema version and a SHA-256 checksum. Import verifies the checksum (warns on mismatch), validates the schema and every row **before** writing anything, and strips prototype-pollution keys.

## 4. Engines

* **indicators.js** — SMA, EMA, WMA, VWMA, RSI (Wilder), Stoch, StochRSI, MACD, BB, ATR (Wilder), ADX/DMI, Supertrend, PSAR, CCI, ROC, Williams %R, Momentum, OBV, A/D, CMF, MFI, VWAP (session-anchored), anchored VWAP, Keltner, Donchian, StdDev, Ichimoku, classic & Camarilla pivots, Fibonacci levels, Volume Profile (POC/VAH/VAL). Arrays in, arrays out, `null` during warm-up.
* **risk.js** — position size (cash, futures lots, options lots), R:R, expectancy, profit factor, max drawdown, compounding, leverage/margin, futures exposure, portfolio risk with correlation, Kelly (taught as a ceiling, never a target).
* **costs.js** — Indian charges (brokerage, STT, exchange txn, SEBI fee, stamp duty, GST, IPFT) by segment; US (SEC fee, FINRA TAF, commission, options per-contract). Rates come from `markets.js` and are dated.
* **options.js** — Black-Scholes price and Greeks, multi-leg payoff at expiry, breakevens, max gain/loss.
* **marketgen.js** — seeded synthetic OHLCV with regimes (trend, range, breakout, gap, news shock, liquidity sweep), intraday U-shaped volume, tick-size rounding.
* **backtest.js** — bar-by-bar rule engine (no look-ahead: signals on bar *i* close fill at bar *i+1* open), stop/target/time exits, slippage and costs, trade list and equity curve.
* **backtest.js** also holds Monte Carlo trade resampling, risk-of-ruin simulation, walk-forward segmentation and grouped analytics used by the journal.
* **clock.js** — IANA time-zone conversion (`zonedToUtc`), session status, overlaps.
* **execution.js** — simulated order execution for replay and paper trading: next-bar fills, half-spread, slippage, gap-through stops, liquidity-capped partial fills, OCO brackets, end-of-day square-off, India/US/bps charges.
* **specs.js** — dated market specifications (charges, lots, sessions with auctions, index-futures tick by level, FINRA TAF schedule, exchange holidays), overridable in Settings. **specs-sources.js** holds the provenance (source URL, effective date, verified / corrected / unverified) for 102 items, shown in Markets → Specifications.
* **options.js** additions — `horizonPnl` / `horizonAnalyse` value multi-leg positions with different expiries at any horizon (calendars, diagonals); `templatesMulti`.
* **optpaper.js** — options paper-trading engine: weekly expiries on the synthetic path, causal base IV from realised volatility + smile, BS quotes with bid/ask, next-bar fills (market/limit/stop/bracket on premium), NSE option charges, approximate margin capped at defined max loss for hedged expiry groups, Greeks, expiry settlement with STT on exercise.
* **srs.js** — Leitner spaced repetition (1/3/7/16/35 days); state stored in `progress.srs`, so it is included in backups.
* **coach.js** — journal insights (group comparisons with Welch t and sample sizes, plan breaches, revenge/disposition patterns, cost drag).
* **dataimport.js** — CSV parsing and validation for NSE/BSE/US/broker/TradingView/Yahoo layouts; time-zone conversion to exchange-local time; OHLC, volume, duplicate, order, gap, session and jump checks; timeframe inference; upward resampling. Produces a validation report; never fills or invents candles.
* **structure.js** — causal detectors used by the Concepts Lab: fractal swing points (confirmed *w* bars later), BOS/CHoCH, liquidity sweeps, order blocks, fair-value gaps, S/R clusters, supply/demand zones, TPO profile, relative strength, relative volume, opening range. Definitions are the app's stated rules for subjective concepts.
* **backtest.js** additions — liquidity-capped partial fills, signal overrides, `optimiseOOS` (grid on the first 60 % of sessions, one untouched out-of-sample run) and `randomEntryTest` (same exits, random entries, p-value).

## 5. Offline & PWA

`sw.js` uses cache-first for app assets with a versioned cache name; a new version replaces the old cache on activate. `manifest.webmanifest` declares standalone display, dark theme colour and SVG icons. On `file://` the service worker is skipped (browsers do not allow it) and the app still works because nothing is fetched.

## 5b. Security

* Served PWA: meta CSP `default-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'` — no inline script.
* Standalone file: one inline script allowed only by its SHA-256 hash; `connect-src 'none'` so the file cannot make network requests.
* Backtester, strategy bot and code export share one rule definition: `IA.bt.stepBar` is the only per-bar logic (used by `IA.bt.run` and `IA.bot`), the bot computes signals on a prefix of the bars (causal by construction), and `IA.codegen.python` mirrors the indicator and step code line by line — `tests/bot.test.js` runs the generated Python and compares trades.
* Routing does not depend on the page URL: `IA.go(hash)` keeps the current route internally and a document-level click handler routes every `#/…` link, so the app works inside sandboxed preview iframes (where `#` links resolve against the parent page). Native `confirm()`/`prompt()` are not used; `IA.ui.ask`/`askText` render in-app dialogs instead.
* All user text inserted as text; markdown renderer escapes first. CSV export neutralises formula injection. See SECURITY-REPORT.md.

## 6. Time zones

The market clock uses `Intl.DateTimeFormat` with IANA zones (`Asia/Kolkata`, `America/New_York`, `Europe/London`…). Session times are stored in exchange-local time and converted on the fly, so daylight-saving changes are handled by the browser's time-zone database — no hard-coded offsets.

## 7. Extensibility

* New lesson: add an object to a `lessons-*.js` file — the academy, search and progress pick it up automatically.
* New question: push to `IA.content.questions` (any content file) with its `module` id. `node tests/validate-content.js` checks schema and coverage.
* Real data: the **Historical Data** section imports CSV files you download yourself; datasets are labelled HISTORICAL and can be charted, resampled, replayed, used in the Concepts Lab and backtested. The app has no live or delayed feed.

## 8. Unlock & mastery rules

* A lesson counts as complete only when its end-of-lesson check is answered correctly.
* A module is mastered at ≥ 80 % on its assessment.
* Level N+1 assessments unlock when Level N's module assessments average ≥ 80 % with no module below 60 %. Lessons themselves are always readable.
* Trading-readiness assessment requires Level 1–3 mastery, ≥ 100 logged paper trades and a passed readiness exam — and still states plainly that passing proves nothing about future profitability.
