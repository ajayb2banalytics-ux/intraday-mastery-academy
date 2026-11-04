# Project status

Version 2.2.0 · 4 Nov 2026. Read this first when resuming work.

## State
**Complete and stable.** Phase 1 (build), Phase 2 (audit, validation, enhancement) and the Final Completion Directive have all been delivered. The automated suites pass on both builds; see `QA-REPORT.md`. No known open defects.

## Contents
| Item | Count |
|---|---|
| Lessons (4 levels, 25 modules) | 103 / 103 written |
| Assessment questions (incl. 29-question readiness exam) | 377 |
| Indicators / strategies / candlestick patterns | 38 / 30 / 22 |
| Concepts Lab exercise topics | 15 |
| Calculators (each shows formula and working) | 24 |
| Psychology topics / self-assessment items | 19 / 24 |
| Books / resources / glossary terms | 21 / 18 / 225 |
| Market specification items with provenance | 110 (75 verified, 11 corrected, 8 secondary-source only, 16 unverified — all labelled) |

## v2.2 additions (4 Nov 2026, night)
- **Strategy bot** (Simulator → Strategy bot): runs Backtester rules bar by bar on unseen bars. Every signal is recomputed from past bars only (prefix), and the per-bar logic is the backtester's own `IA.bt.stepBar`, so bot = backtest (tests BOT-01/02/03). Decision log, chart with stop/target, KPIs, journal export, survives reload. Max 1,500 bars per run (O(n²) honesty cost).
- **Strategy code export** (Backtester → Automate these rules, also on the bot screen): standalone Python (standard library only) that re-implements the indicators and rules; a test runs it with python3 on the same bars and matches the app's trades on 27 configurations (CG-01). Pine Script v5 strategy, structure-checked only (TradingView not available here). "Download these bars (CSV)" for running the Python on identical data. No order-placement code.
- **Lesson** l4-algo-india: backtest → paper bot → code → broker; SEBI retail algo framework as of Nov 2026 (4 Feb 2025 circular, 30 Sep 2025 glide path, full compliance 1 Apr 2026, 10 orders/second threshold, static IP/OAuth/2FA, white vs black box, 2022 ban on return claims); SEBI FY25–FY26 F&O study (≈88% of individuals lost money in FY26). 4 new module questions.
- **Fixed:** the default Nifty/Bank Nifty backtest made 0 trades (size capped at unleveraged capital). New `maxLeverage` exposure cap (Backtester: auto 5× futures, 1× cash) and an explicit "N signals could not be traded" warning. Bollinger-fade and VWAP-cross signals now require both bars' indicator values (a stray short signal was possible on one warm-up bar).

## v2.1.1 fix (4 Nov 2026, night)
- **Buttons and links did nothing when the file was opened inside a preview window** (e.g. a chat app's file viewer, which shows the page in a sandboxed `srcdoc` iframe). Cause: `#/…` links resolve against the *parent* page's URL there, and native `confirm()`/`prompt()` are silently blocked. Fix: the router now keeps its own route and intercepts every in-app link (`IA.go`), the address bar is updated only where allowed, and all native dialogs were replaced by in-app dialogs (`IA.ui.ask` / `IA.ui.askText`). New regression suite `tests/sandbox_frame.py` (20 checks, two sandbox modes).
- Still limited inside a preview window: file downloads (backup, CSV export) and data saving may be blocked by the viewer. Use a normal browser tab for real use.

## v2.1 additions (4 Nov 2026, evening)
- **Options paper trading** (Simulator → Options paper): synthetic Nifty/Bank Nifty weekly chain priced by Black–Scholes with a smile and bid/ask, next-bar fills, limit/stop/bracket orders on premium, NSE option charges, approximate margin with spread recognition, portfolio Greeks, position payoff, expiry settlement with STT on exercise, journal export.
- **Multi-expiry payoff builder:** calendars and diagonals with per-leg expiry and IV, valued at the front expiry.
- **Spaced-repetition review** (#/review): missed questions return after 1, 3, 7, 16 and 35 days; dashboard card.
- **Journal coach** (Journal → Coach): weak setups/times/emotions with sample sizes and Welch t, plan breaches, losses beyond the stop, revenge pattern, disposition effect, cost drag.
- **MCX:** commodity futures/options charges (CTT etc.), 8 MCX contracts with multipliers, MCX session in the clock; provenance marked *secondary sources*.

## Phase 2 / final additions
- **Historical Data:** CSV import (NSE, bhavcopy, broker, TradingView, Yahoo, ISO), validation report, dataset library, resampling, historical replay, HISTORICAL / SYNTHETIC labels.
- **Concepts Lab:** graded exercises for MTF, VWAP/AVWAP, volume profile, TPO, S/R, S/D, structure, BOS/CHoCH, sweeps, order blocks, FVG, relative volume, divergence, relative strength and opening range. The detectors are causal.
- **Backtesting:** out-of-sample optimisation, a random-entry overfitting test, partial fills, an 8-regime matrix and an audit suite.
- **Risk:** exact losing-streak probability, an options scenario grid, and the US TAF schedule. The FINRA TAF is $0 from 1 Oct to 31 Dec 2026.
- **Markets:**
  - verified 2026 NSE session changes;
  - index-futures tick by level;
  - holiday calendars;
  - provenance table;
  - market comparison laboratory.
- **New lessons:** price action; Elliott/Gann/harmonics (labelled subjective); scalping and momentum.
- **Integrity and security:**
  - SHA-256 backup checksum, with validation before writing;
  - CSP on both builds;
  - prototype-pollution and CSV-injection guards.
- **Accessibility and devices:**
  - 0 axe-core WCAG A/AA violations;
  - laptop keyboard shortcuts;
  - phone↔laptop transfer guide.
- **Educational audit:** an AI-assisted audit of every content file, with corrections applied. See `EDUCATIONAL-AUDIT.md`.

## Not done / limitations
- Not tested on iOS Safari/WebKit, Firefox or physical devices. Only Chromium was available, using emulated phone viewports.
- No real exchange CSV has been imported in testing. Testing used layout fixtures with invented prices.
- No live or delayed data, by design.
- 16 unverified spec items; MCX rates are corroborated by secondary sources only; options paper trading uses a synthetic path more volatile than the real index and an approximate (non-SPAN) margin.
- The educational review is AI-assisted. It is not an expert or regulatory certification.

## Next steps (if continuing)
1. Do a one-off check on a real iPhone (Safari) and Android phone (Chrome): standalone file and hosted PWA.
2. Import one real NSE file and one real US file, and compare the validation report with the source.
3. Refresh `specs.js` when SEBI, NSE, SEC or FINRA change rates (FINRA TAF resumes 1 Jan 2027), and when the 2027 NSE holiday list is published.
4. Open NSE circular NSE/INVG/67858 (5 May 2025) to confirm whether the 10 orders/second threshold is per exchange or per segment, and update the algo lesson.
5. Open the MCX circulars listed in Markets → Specifications in a normal browser to upgrade the MCX items from *secondary* to *verified*.

## How to resume
See README.md → Development. Rules:
- follow `CONTENT-SPEC.md` for content;
- keep engines pure and covered by known-answer tests;
- never mark a requirement verified by hand, because `tools/report.py` derives status from saved results;
- rebuild with `python3 tools/build.py`.
