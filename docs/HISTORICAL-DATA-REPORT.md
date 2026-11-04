# Historical data testing report

Generated 2026-11-04.

**What was tested:** the importer engine (`js/engines/dataimport.js`) with 26 unit tests over 8 format fixtures, and the full UI flow (import → report → save → chart → resample → replay → backtest) in both builds.

> The fixtures in `tests/fixtures/` reproduce real export **layouts** (NSE equity historical-data download, NSE bhavcopy, broker 1-minute export, TradingView epoch export, Yahoo-style daily, ISO-8601 with offsets across the US DST change) with **invented prices** and deliberate defects. No real exchange file could be downloaded in this environment, so a real NSE/BSE/US file has not been run through the importer. Please import one of your own files and check the validation report.

| Suite | Result |
|---|---|
| Importer unit tests | 26/26 |
| UI flow, served PWA (P2-01…P2-09) | 9/9 |
| UI flow, standalone (P2-01…P2-09) | 9/9 |

## Checks performed on every import
| Check | Behaviour |
|---|---|
| Header detection | Synonyms incl. NSE trailing-space headers; priority picks `close` over `ltp` |
| Delimiter | comma, semicolon, tab, pipe |
| Dates | ISO, DD-MON-YYYY, Mon DD YYYY, DD/MM/YYYY vs MM/DD/YYYY (auto-detect, ambiguity warning), YYYYMMDD, epoch s/ms, 12-hour times, offsets |
| Time zone | Naive timestamps read in a chosen source zone; offsets/epochs absolute; converted to exchange-local wall time via IANA zones (DST-safe); >50% outside-session bars → "check time zone" |
| OHLC | Non-positive/missing prices dropped; H < max(O,C) or L > min(O,C) dropped (or repaired on request) |
| Volume | Missing → 0 with warning; negative → 0 with error |
| Duplicates | Identical removed; conflicting → first kept, flagged |
| Order | Out-of-order detected and sorted |
| Timeframe | Inferred from modal intraday spacing; mixed-timeframe warning |
| Missing candles | Per session within regular hours (lunch breaks respected); daily: missing weekdays listed as likely holidays; never filled or invented |
| Outside session | Flagged; optional drop |
| Jumps | ≥15% gap flagged (split/bonus/wrong symbol) |
| Multi-symbol / series | First (or chosen) symbol; non-equity series filtered |

## Importer tests

| ID | Test | Result |
|---|---|---|
| DAT-01 | NSE quote download: trailing-space headers, DD-MON-YYYY, comma thousands, newest-first → 40 daily bars sorted ascending | PASS |
| DAT-02 | NSE quote download: "close" column used, not "ltp" (ltp is 0.05 higher in fixture) | PASS |
| DAT-03 | Daily data: weekday gap (2 Oct) reported as a likely holiday, no candles invented | PASS |
| DAT-04 | Yahoo daily (ISO dates, Adj Close present) → adj-close warning, volume read | PASS |
| DAT-05 | TradingView unix seconds (absolute) → NSE wall-clock 09:15 first bar, 5-min tf, 75 bars/day, no missing | PASS |
| DAT-06 | Broker 1-min naive IST with DD/MM/YYYY detected (day 14 > 12) → 750 bars, 1-min tf, 15:29 last bar | PASS |
| DAT-07 | Defects: exact duplicate removed (1), conflicting duplicate flagged and dropped (1) | PASS |
| DAT-08 | Defects: high-below-close row dropped under default policy | PASS |
| DAT-09 | Defects: negative price row dropped; impossible date row dropped | PASS |
| DAT-10 | Defects: negative volume set to 0 and reported | PASS |
| DAT-11 | Defects: out-of-order rows detected and sorted | PASS |
| DAT-12 | Defects: the 3 deliberately missing candles (10:55, 11:00, 11:05) are reported, and every row dropped as invalid also shows as a gap (none invented) | PASS |
| DAT-13 | Defects: post-session bar (16:05) flagged; jump ≥15% flagged | PASS |
| DAT-14 | Defects: quality grade is not "good" | PASS |
| DAT-15 | OHLC repair policy keeps the row and fixes high/low | PASS |
| DAT-16 | Outside-session "drop" option removes the 16:05 bar | PASS |
| DAT-17 | Naive UTC timestamps read as IST → time-zone suspicion raised | PASS |
| DAT-18 | Same file with "Timestamps are in UTC" → bars land 09:15–15:25 IST, no suspicion | PASS |
| DAT-19 | Bhavcopy multi-symbol: imports first symbol only, filters non-EQ series, warns | PASS |
| DAT-20 | Bhavcopy: choose BETA explicitly | PASS |
| DAT-21 | US ISO offsets across DST change (EDT → EST): both days start 09:30 New York time | PASS |
| DAT-22 | Date parser: formats and rejections | PASS |
| DAT-23 | Rejects files without OHLC columns / without dates, with a clear message | PASS |
| DAT-24 | Semicolon- and tab-delimited files parse | PASS |
| DAT-25 | Resample 1-min → 5-min within sessions preserves OHLCV (first open, max high, min low, last close, sum volume) | PASS |
| DAT-26 | Imported data drives the indicator engine (VWAP resets per session; no NaN) | PASS |

## UI tests

| ID | Test | Result |
|---|---|---|
| P2-01 | Data page explains SYNTHETIC / HISTORICAL / DELAYED / LIVE and states delayed & live are not available | PASS |
| P2-02 | Import of a defective NSE 5-min file shows a validation report: dropped rows, duplicates, missing candles, outside-hours, jump, quality not good | PASS |
| P2-03 | Naive-UTC file read as IST is flagged ("check time zone") and saving is discouraged | PASS |
| P2-04 | Switching "Timestamps are in" to UTC fixes it (quality good) | PASS |
| P2-05 | Dataset saved to the library with timeframe, range and bar count | PASS |
| P2-06 | Chart Lab shows the dataset labelled HISTORICAL; 15-min resampling gives one third of the 5-min bars per session | PASS |
| P2-07 | Historical replay: chart exposes only revealed bars (drawn range ≤ revealed), future hidden, one step reveals exactly one bar, labelled HISTORICAL | PASS |
| P2-08 | Historical replay order fills at the NEXT bar's open ± spread/slippage | PASS |
| P2-09 | Backtest on a HISTORICAL dataset is labelled as such (not synthetic) | PASS |