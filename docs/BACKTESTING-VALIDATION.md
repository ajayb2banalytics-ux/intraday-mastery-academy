# Backtesting validation report

Generated 2026-11-04.

| Suite | Result |
|---|---|
| Backtest audit (hand-built bars, invariance, OOS, overfitting, regimes) | 33/33 |
| Execution engine (paper/replay fills) | 10/10 |
| Original backtester tests | 10/10 |

## What is verified
- **No look-ahead:** for each of the 12 entry signals, every bar after a cut-off was altered; every trade closed before the cut-off was identical (BTA-13.x). Signals on bar i fill at bar i+1's open (BTA-01). Signals on a session's last bar are never filled next morning (BTA-11).
- **Execution sequencing:** stop measured from ATR of the bar before entry (BTA-02); gap through stop exits at the open (BTA-03); stop and target in one bar → stop first (BTA-04); target exact (BTA-05); end-of-day exit at the close (BTA-10).
- **Frictions:** slippage applied to entry and exit with the target measured from the slipped fill (BTA-06); bps costs exact on both legs (BTA-07); liquidity-capped partial fills (BTA-09, EXE-06).
- **Out-of-sample:** the optimiser's choice is unchanged when only OOS bars are altered — it never sees them (BTA-14).
- **Overfitting detection:** a random-entry benchmark with identical exits detects a deliberately cheating (perfect-foresight) signal at p ≤ 0.02 (BTA-15) and does not flag random signals (mean p 0.25–0.75 over 6 runs, BTA-16).
- **Walk-forward and Monte Carlo** reproducible and correctly segmented (BTA-17, BTA-18).
- **Regimes:** the generator's trending, sideways, high/low volatility, gap and news regimes behave as labelled (BTA-19…22).

## Regime matrix — all mechanical strategies (SYNTHETIC data, seed 2026, 60 sessions per regime, Nifty-futures-like, 3 bps costs + 1 tick slippage)

25 strategies. On a mixed 120-session synthetic sample, **6** had positive average R, and **1** beat random entries at p < 0.05 — about what chance alone predicts (≈ 1.25 of 25). That is the correct outcome on data generated as a random process, and it is the main lesson: a rule must beat random entries out-of-sample on real data before it is worth trading, and most will not.

| Strategy | trend-up | trend-down | range | volatile | low-vol | gap-up | gap-down | news | Mixed avg R (n) | Random-entry p |
|---|---|---|---|---|---|---|---|---|---|---|
| Opening Range Breakout | 0.34 (54) | -0.28 (43) | -0.82 (60) | -0.13 (46) | -0.18 (51) | 0.03 (45) | -0.19 (49) | -0.08 (50) | -0.21 (111) | 0.841 |
| VWAP trading | 0.16 (89) | -0.24 (90) | -0.51 (145) | -0.12 (93) | -0.35 (89) | -0.11 (85) | -0.25 (93) | -0.08 (79) | -0.17 (199) | 0.846 |
| VWAP pullback | 0.14 (104) | -0.25 (74) | -0.68 (138) | -0.05 (96) | -0.27 (98) | -0.03 (87) | -0.30 (95) | 0.22 (91) | -0.14 (217) | 0.522 |
| EMA pullback | 0.27 (13) | 0.26 (11) | 0.88 (6) | 0.40 (16) | 0.44 (14) | -0.24 (7) | -0.00 (26) | -0.00 (19) | -0.33 (23) | 0.771 |
| Moving average crossover | 0.05 (23) | -0.49 (20) | -0.20 (13) | -0.32 (22) | -0.52 (23) | -0.57 (22) | -0.36 (26) | -0.25 (41) | 0.04 (58) | 0.104 |
| Supertrend strategy | 0.51 (30) | -0.46 (30) | -0.37 (15) | -0.02 (25) | -0.30 (25) | -0.02 (21) | 0.12 (34) | 0.17 (41) | 0.01 (62) | 0.234 |
| RSI strategies | 0.11 (22) | -0.06 (62) | 0.71 (16) | 0.18 (48) | -0.15 (46) | -0.05 (26) | -0.14 (68) | -0.19 (49) | -0.22 (78) | 0.806 |
| MACD strategies | 0.39 (100) | -0.25 (57) | -0.64 (108) | 0.10 (73) | 0.01 (68) | 0.05 (84) | -0.08 (55) | -0.06 (67) | -0.40 (174) | 1.000 |
| Bollinger Band strategies | 0.22 (88) | -0.31 (125) | 0.24 (112) | -0.09 (109) | -0.38 (107) | -0.16 (86) | -0.17 (118) | -0.14 (112) | -0.04 (214) | 0.070 |
| Trend following | -0.02 (13) | -0.66 (16) | 0.47 (5) | 0.01 (18) | -0.58 (19) | -0.27 (12) | 0.20 (22) | -0.08 (27) | -0.08 (29) | 0.294 |
| Momentum trading | -0.03 (54) | -0.50 (31) | -0.70 (40) | -0.22 (43) | -0.51 (42) | -0.41 (42) | -0.35 (30) | 0.48 (38) | -0.25 (87) | 0.930 |
| Scalping | -0.03 (137) | -0.49 (105) | -0.44 (163) | -0.39 (122) | -0.63 (127) | -0.40 (119) | -0.24 (129) | -0.24 (118) | -0.22 (278) | 0.876 |
| Volume breakout | -0.01 (47) | -0.65 (24) | -0.63 (10) | -0.25 (35) | -0.60 (36) | -0.19 (33) | -0.30 (32) | 0.21 (26) | -0.12 (59) | 0.537 |
| Gap-up trading | 0.34 (54) | -0.28 (43) | -0.82 (60) | -0.13 (46) | -0.18 (51) | 0.03 (45) | -0.19 (49) | -0.08 (50) | -0.21 (111) | 0.841 |
| Gap-down trading | -0.24 (48) | 0.25 (53) | -0.74 (58) | -0.08 (47) | -0.15 (48) | -0.15 (44) | 0.06 (49) | -0.27 (56) | -0.34 (107) | 0.980 |
| Previous-day high breakout | -0.28 (7) | -1.13 (4) | -1.14 (7) | 0.87 (6) | -0.10 (5) | -0.59 (17) | — (0) | 1.87 (2) | -0.25 (15) | 0.687 |
| Previous-day low breakdown | -0.53 (5) | -0.62 (6) | 0.08 (5) | -0.84 (6) | -0.73 (5) | — (0) | -0.42 (13) | -1.13 (2) | 0.16 (7) | 0.189 |
| Support and resistance reversal | 0.15 (52) | -0.26 (109) | 0.32 (55) | 0.01 (80) | -0.33 (76) | -0.14 (49) | -0.06 (112) | -0.23 (89) | -0.04 (158) | 0.080 |
| Mean reversion | 0.11 (88) | -0.22 (125) | 0.13 (112) | -0.13 (109) | -0.33 (107) | -0.14 (88) | -0.12 (118) | -0.19 (112) | -0.06 (215) | 0.065 |
| Range-bound trading | -0.52 (134) | -0.20 (92) | 0.15 (107) | -0.31 (117) | -0.51 (117) | -0.23 (131) | -0.16 (97) | -0.19 (123) | -0.01 (235) | 0.005 |
| Multi-timeframe confluence | -0.06 (16) | -0.88 (11) | -0.37 (12) | -0.18 (13) | -0.28 (12) | -0.61 (12) | -0.38 (19) | -0.35 (29) | 0.17 (42) | 0.055 |
| Market structure continuation | 0.22 (51) | -0.41 (42) | -0.83 (73) | 0.05 (47) | 0.13 (43) | 0.05 (33) | 0.04 (45) | 0.25 (49) | -0.24 (129) | 0.930 |
| Options momentum strategies | 0.18 (33) | -0.49 (24) | -0.80 (19) | -0.07 (29) | -0.16 (30) | -0.03 (28) | -0.11 (30) | -0.58 (29) | 0.03 (54) | 0.308 |
| Futures trend strategies | 0.65 (10) | -1.00 (8) | 0.20 (3) | 0.82 (6) | -0.08 (6) | 1.04 (5) | 0.70 (10) | -0.20 (14) | 0.10 (19) | 0.070 |
| Sector-relative strength strategies | 0.36 (49) | 0.12 (29) | -0.85 (46) | 0.13 (41) | 0.12 (45) | 0.30 (43) | 0.10 (42) | -0.21 (45) | -0.15 (95) | 0.498 |

> These numbers describe the synthetic generator, not any real market, and must not be read as evidence that any strategy works or fails in practice.

## Audit tests

| ID | Test | Result |
|---|---|---|
| BTA-01 | Signal on bar i fills at bar i+1 OPEN (not bar i close) | PASS |
| BTA-02 | Stop distance = 1 × ATR(14) of the bar BEFORE entry (ATR = 2 on warm-up) | PASS |
| BTA-03 | Stop gapped through: exit at the OPEN (worse than stop), labelled | PASS |
| BTA-04 | Stop and target both inside one bar → stop assumed first (conservative) | PASS |
| BTA-05 | Target hit → exit exactly at entry + 2R | PASS |
| BTA-06 | Slippage: entry +k ticks, exit −k ticks (long) | PASS |
| BTA-07 | Costs: bps on both legs, exactly | PASS |
| BTA-08 | Position size = floor(1% × capital ÷ stop distance) | PASS |
| BTA-09 | Partial fill: size capped at maxVolPct × bar volume and flagged | PASS |
| BTA-10 | End-of-day exit at the session close; nothing carried overnight | PASS |
| BTA-11 | Signal on the last bar of a day is NOT filled next morning | PASS |
| BTA-12 | Short side mirrors: stop above, target below, P&L sign correct | PASS |
| BTA-13.1 | No look-ahead (ema_cross): changing all future bars leaves every earlier trade identical | PASS |
| BTA-13.2 | No look-ahead (vwap_side): changing all future bars leaves every earlier trade identical | PASS |
| BTA-13.3 | No look-ahead (vwap_reclaim): changing all future bars leaves every earlier trade identical | PASS |
| BTA-13.4 | No look-ahead (rsi_extreme): changing all future bars leaves every earlier trade identical | PASS |
| BTA-13.5 | No look-ahead (rsi_trend): changing all future bars leaves every earlier trade identical | PASS |
| BTA-13.6 | No look-ahead (macd_cross): changing all future bars leaves every earlier trade identical | PASS |
| BTA-13.7 | No look-ahead (supertrend_flip): changing all future bars leaves every earlier trade identical | PASS |
| BTA-13.8 | No look-ahead (bb_reentry): changing all future bars leaves every earlier trade identical | PASS |
| BTA-13.9 | No look-ahead (orb): changing all future bars leaves every earlier trade identical | PASS |
| BTA-13.10 | No look-ahead (pdh_break): changing all future bars leaves every earlier trade identical | PASS |
| BTA-13.11 | No look-ahead (volume_spike): changing all future bars leaves every earlier trade identical | PASS |
| BTA-13.12 | No look-ahead (adx_trend): changing all future bars leaves every earlier trade identical | PASS |
| BTA-14 | OOS optimisation: the optimiser never sees OOS bars (perturbing OOS changes nothing chosen) | PASS |
| BTA-15 | Random-entry test detects a cheating (perfect-foresight) signal: p ≤ 0.02 | PASS |
| BTA-16 | Random-entry test does not flag random signals: mean p over 6 random strategies between 0.25 and 0.75 | PASS |
| BTA-17 | Walk-forward segments are disjoint, consecutive and cover the data | PASS |
| BTA-18 | Monte Carlo is reproducible for a fixed seed and its median ≈ start + N × mean P&L | PASS |
| BTA-19 | Regimes: low-vol days have < 60% of the range of volatile days | PASS |
| BTA-20 | Regimes: trend-up days close above open more often than trend-down days | PASS |
| BTA-21 | Regimes: gap-up sessions open above the previous close on average | PASS |
| BTA-22 | Regimes: news days contain a single-bar move ≥ 1 daily sigma | PASS |