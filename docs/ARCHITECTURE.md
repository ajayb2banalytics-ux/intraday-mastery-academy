# Intraday Mastery Academy — Architecture

Version 0.1 · 4 Nov 2026

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
│ Psychology · Library · Assessments · Settings                          │
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
│ backtest.js (+ Monte Carlo, ruin, analytics) · clock.js · execution.js │
└────────────────────────────────────────────────────────────────────────┘
```

Scripts are classic (non-module) scripts attached to one global namespace `IA`, so the app runs from `file://` on a phone as well as from a web server. Load order: engines → content → core → modules → `app.start()`.

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

Export = all keys + all rows → one JSON file with schema version. Import validates the version and asks before overwriting.

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
* **specs.js** — dated market specifications (charges, lots, sessions, FX), overridable in Settings.

## 5. Offline & PWA

`sw.js` uses cache-first for app assets with a versioned cache name; a new version replaces the old cache on activate. `manifest.webmanifest` declares standalone display, dark theme colour and SVG icons. On `file://` the service worker is skipped (browsers do not allow it) and the app still works because nothing is fetched.

## 6. Time zones

The market clock uses `Intl.DateTimeFormat` with IANA zones (`Asia/Kolkata`, `America/New_York`, `Europe/London`…). Session times are stored in exchange-local time and converted on the fly, so daylight-saving changes are handled by the browser's time-zone database — no hard-coded offsets.

## 7. Extensibility

* New lesson: add an object to a `lessons-*.js` file — the academy, search and progress pick it up automatically.
* New question: push to `IA.content.questions` (any content file) with its `module` id. `node tests/validate-content.js` checks schema and coverage.
* Optional live data: `IA.adapters` interface (`getCandles(symbol, tf)`) — none required; a CSV import adapter is included so real data you download yourself can be charted and backtested.

## 8. Unlock & mastery rules

* A lesson counts as complete only when its end-of-lesson check is answered correctly.
* A module is mastered at ≥ 80 % on its assessment.
* Level N+1 assessments unlock when Level N's module assessments average ≥ 80 % with no module below 60 %. Lessons themselves are always readable.
* Trading-readiness assessment requires Level 1–3 mastery, ≥ 100 logged paper trades and a passed readiness exam — and still states plainly that passing proves nothing about future profitability.
