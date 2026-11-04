# Project status

Version 2.0.0 · 4 Nov 2026. Read this first when resuming work.

## State
**Complete and stable.** Phase 1 (build), Phase 2 (audit, validation, enhancement) and the Final Completion Directive have all been delivered. The automated suites pass on both builds; see `QA-REPORT.md`. No known open defects.

## Contents
| Item | Count |
|---|---|
| Lessons (4 levels, 25 modules) | 102 / 102 written |
| Assessment questions (incl. 29-question readiness exam) | 373 |
| Indicators / strategies / candlestick patterns | 38 / 30 / 22 |
| Concepts Lab exercise topics | 15 |
| Calculators (each shows formula and working) | 24 |
| Psychology topics / self-assessment items | 19 / 24 |
| Books / resources / glossary terms | 21 / 18 / 225 |
| Market specification items with provenance | 102 (75 verified, 11 corrected, 16 unverified and labelled) |

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
- 16 unverified spec items; MCX commodity charges are not modelled; single-expiry payoff builder.
- The educational review is AI-assisted. It is not an expert or regulatory certification.

## Next steps (if continuing)
1. Do a one-off check on a real iPhone (Safari) and Android phone (Chrome): standalone file and hosted PWA.
2. Import one real NSE file and one real US file, and compare the validation report with the source.
3. Refresh `specs.js` when SEBI, NSE, SEC or FINRA change rates (FINRA TAF resumes 1 Jan 2027), and when the 2027 NSE holiday list is published.

## How to resume
See README.md → Development. Rules:
- follow `CONTENT-SPEC.md` for content;
- keep engines pure and covered by known-answer tests;
- never mark a requirement verified by hand, because `tools/report.py` derives status from saved results;
- rebuild with `python3 tools/build.py`.
