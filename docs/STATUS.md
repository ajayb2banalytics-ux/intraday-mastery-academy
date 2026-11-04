# Project status

Version 1.0.0 · 4 Nov 2026 · read this first when resuming work.

## Completed (all seven phases of the brief)

| Phase | Delivered |
|---|---|
| 1 Architecture & curriculum | `ARCHITECTURE.md`, `CURRICULUM.md` (generated), `CONTENT-SPEC.md`, requirements register |
| 2 Core application | Shell, router, sidebar/bottom-nav/drawer, dashboard, academy, lesson reader, search, IndexedDB, progress, bookmarks, notes |
| 3 Technical analysis | Canvas chart engine, 30+ indicator computations, annotations, chart-type gallery, structure view, data-graded chart drills, pattern-tap drills |
| 4 Market environments | India / US / Europe-Asia / other-asset pages, DST-safe global clock with overlaps, dated specs page, derivatives academy |
| 5 Trading & risk engines | Strategy academy (30) + comparison lab, risk plan with live limit status, 22 calculators, options payoff builder, Greeks lab, option chain, futures and basis labs, India/US charges |
| 6 Simulation & research | Chart replay, decision simulator (10 scenarios), persistent paper trading with execution realism, backtester, walk-forward, Monte Carlo, risk of ruin, trading journal + analytics |
| 7 Mastery & QA | Module assessments, level unlocking, readiness evaluation, gap analysis, self-assessment, backup/restore, CSV, offline verification, mobile overflow checks, functional tests, QA report |

Content: 99/99 lessons, 357 questions (incl. 29 readiness), 38 indicators, 30 strategies, 22 patterns, 19 psychology topics, 24-item self-assessment, 20 books, 18 resources, 219 glossary terms.

## Pending / next steps (in priority order)
1. Test once on a real phone (iOS Safari and Android Chrome): open the standalone file, then host `pwa/` on HTTPS and install it.
2. Expert review of lesson worked examples; log corrections in `REQUIREMENTS.md`.
3. Update `specs.js` defaults (or Settings) whenever SEBI/NSE/SEC change rates or lot sizes; refresh FX rates.
4. Feature extensions listed under "Incomplete features" in `REQUIREMENTS.md` (multi-expiry payoff, options paper trading, TPO chart, more backtest signals, holiday calendars).

## Current implementation state
Stable. All automated suites pass (see `QA-REPORT.md`). No open known bugs.

## File structure
See `README.md` → Project layout. Script load order is defined once in `js/files.js`.

## How to resume
```
cd intraday-academy
node tests/engines.test.js && node tests/validate-content.js
python3 -m http.server 8765 &   then   python3 tests/smoke.py http://localhost:8765/index.html
python3 tests/e2e.py            # functional suite
python3 tools/build.py          # rebuild dist/
python3 tools/report.py         # regenerate REQUIREMENTS.md and QA-REPORT.md from results
```
Rules: add content by following `CONTENT-SPEC.md`; keep engines pure and covered by known-answer tests; never mark a requirement verified by hand — `tools/report.py` derives status from test results.
