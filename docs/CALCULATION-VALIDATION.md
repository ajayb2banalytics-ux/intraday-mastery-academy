# Calculation validation report

Generated 2026-11-04. Three independent layers of evidence:

1. **Known-answer unit tests** (`tests/engines.test.js`) — hand-calculable cases and published reference values.
2. **Independent cross-validation** (`tests/crosscheck.py`) — the JavaScript engines compared on randomised inputs with (a) separate Python implementations written from the published definitions, (b) the open-source `ta` library, (c) SciPy's normal distribution, (d) brute-force and Monte Carlo checks.
3. **Backtest/execution audits** — see BACKTESTING-VALIDATION.md.

| Suite | Result |
|---|---|
| Engine known-answer tests | 124/124 |
| Options paper / multi-expiry engine tests (put–call parity, BS agreement, settlement, margin, no look-ahead) | 27/27 |
| Independent cross-validation (excl. informational) | 59/59 |

## Defects found and fixed by this validation
- **Black–Scholes precision:** the original normal-CDF approximation (Abramowitz–Stegun 7.1.26, |ε|≈1.5e-7) produced up to ₹0.004 error on high-priced underlyings. Replaced with Hart/West double precision; now agrees with SciPy to 1e-9 on 300 random contracts.
- **Option max gain / max loss:** read from a 4,000-point grid, so a butterfly peak exactly at a strike could be understated by ~₹5–100. Rewritten to evaluate exactly at every strike (payoff is piecewise linear); breakevens solved exactly per segment. Independently found by both the cross-check (XC-68) and the derivatives content audit.
- **Volume profile / TPO bin edges:** a bar whose high fell exactly on a bin edge was counted in the bin above. Fixed in both engines.
- **OOS optimiser:** failed when a config omitted stop/target. Defaults applied.

## Convention differences (documented, not errors)
- Wilder-smoothed indicators (RSI, ATR, ADX) and EMAs are seeded with a simple average; `ta` seeds from the first value. Values converge after warm-up and are compared from bar 300.
- Parabolic SAR: the app follows Wilder (SAR clamped to the prior two bars before testing for reversal). `ta` tests first; difference reported as informational (XC-41). The app matches an independent Wilder implementation (XC-41a).
- OBV starts at 0 (some libraries start at the first bar's volume); increments are identical.

## Cross-validation detail

| ID | Quantity | Reference | n | max abs error | tolerance | Result | Note |
|---|---|---|---|---|---|---|---|
| XC-01 | SMA(20) | pandas rolling mean | 881 | 2.5e-12 | 1e-09 | PASS |  |
| XC-02 | EMA(20), SMA-seeded | definition (Python) | 881 | 1.14e-13 | 1e-09 | PASS |  |
| XC-03 | WMA(10) | definition (Python) | 891 | 4.55e-13 | 1e-09 | PASS |  |
| XC-04 | VWMA(20) | definition (Python) | 881 | 4.55e-13 | 1e-09 | PASS |  |
| XC-05 | RSI(14) Wilder | Wilder definition (Python) | 886 | 0 | 1e-09 | PASS |  |
| XC-06 | ATR(14) Wilder | Wilder definition (Python) | 887 | 0 | 1e-09 | PASS |  |
| XC-07 | MACD line | definition (Python) | 875 | 2.27e-13 | 1e-09 | PASS |  |
| XC-08 | MACD signal | definition (Python) | 867 | 2.27e-13 | 1e-09 | PASS |  |
| XC-09 | Bollinger upper (20,2, population SD) | definition (Python) | 881 | 6.71e-11 | 1e-09 | PASS |  |
| XC-10 | Stochastic %K(14) | Lane definition (Python) | 887 | 0 | 1e-09 | PASS |  |
| XC-11 | Stochastic %D(3) | definition (Python) | 885 | 4.26e-14 | 1e-09 | PASS |  |
| XC-12 | CCI(20) | Lambert definition (Python) | 881 | 4.91e-11 | 1e-09 | PASS |  |
| XC-13 | Williams %R(14) | definition (Python) | 887 | 0 | 1e-09 | PASS |  |
| XC-14 | MFI(14) | definition (Python) | 886 | 2.84e-14 | 1e-09 | PASS |  |
| XC-15 | OBV | Granville definition (Python) | 900 | 0 | 1e-09 | PASS |  |
| XC-16 | Chaikin Money Flow(20) | definition (Python) | 881 | 2.22e-16 | 1e-09 | PASS |  |
| XC-17 | Accumulation/Distribution | definition (Python) | 900 | 0 | 1e-09 | PASS |  |
| XC-18 | +DI(14) | Wilder definition (Python) | 886 | 0 | 1e-09 | PASS |  |
| XC-19 | ADX(14) | Wilder definition (Python) | 873 | 0 | 1e-09 | PASS |  |
| XC-20 | Session VWAP (resets daily) | definition (Python) | 900 | 6.82e-13 | 1e-09 | PASS |  |
| XC-21 | Donchian upper(20) | definition (Python) | 881 | 0 | 1e-09 | PASS |  |
| XC-22 | Keltner upper (EMA20 + 2×ATR10) | Raschke/modern definition (Python) | 881 | 1.14e-13 | 1e-09 | PASS |  |
| XC-23 | ROC(10) | definition (Python) | 890 | 1.11e-14 | 1e-09 | PASS |  |
| XC-24 | Momentum(10) | definition (Python) | 890 | 0 | 1e-09 | PASS |  |
| XC-25 | Ichimoku Tenkan(9) | Hosoda definition (Python) | 892 | 0 | 1e-09 | PASS |  |
| XC-26 | Ichimoku Senkou B(52, unshifted) | Hosoda definition (Python) | 849 | 0 | 1e-09 | PASS |  |
| XC-30 | RSI(14) vs ta | ta library | 600 | 3.89e-09 | 1e-06 | PASS | ta seeds Wilder smoothing from the first value; identical after warm-up (compared from bar 300). |
| XC-31 | ATR(14) vs ta | ta library | 600 | 0 | 1e-06 | PASS | Seeding differs; compared after warm-up. |
| XC-32 | Bollinger upper vs ta | ta library | 880 | 6.71e-11 | 1e-09 | PASS | Both use population SD (ddof=0). |
| XC-33 | MACD vs ta | ta library | 600 | 1.85e-10 | 1e-06 | PASS | ta seeds EMA with the first value; converges after warm-up. |
| XC-34 | Williams %R vs ta | ta library | 886 | 0 | 1e-09 | PASS |  |
| XC-35 | CCI vs ta | ta library | 880 | 4.91e-11 | 1e-09 | PASS |  |
| XC-36 | OBV bar-to-bar change vs ta | ta library | 899 | 0 | 1e-09 | PASS | Starting value differs by convention (app starts at 0); increments compared. |
| XC-37 | CMF vs ta | ta library | 880 | 2.22e-16 | 1e-09 | PASS |  |
| XC-38 | ADX vs ta | ta library | 600 | 2.84e-14 | 1e-06 | PASS | ta seeds with a sum rather than a mean; converges after warm-up. |
| XC-39 | Stochastic %K vs ta | ta library | 886 | 0 | 1e-09 | PASS |  |
| XC-40 | MFI vs ta | ta library | 886 | 2.13e-14 | 1e-06 | PASS |  |
| XC-41a | Parabolic SAR (Wilder rules) | independent Wilder implementation (Python) | 899 | 0 | 1e-09 | PASS |  |
| XC-41 | Parabolic SAR vs ta (informational) | ta library | 850 | 19.7 | 1e-06 | INFO | CONVENTION DIFFERENCE, not an error: ta checks for reversal BEFORE applying Wilder's "not inside the prior two bars" rule and picks low[i-2] |
| XC-42 | Donchian upper vs ta | ta library | 880 | 0 | 1e-09 | PASS |  |
| XC-50 | Black–Scholes price (300 random contracts) | SciPy norm | 300 | 5.46e-12 | 1e-09 | PASS | Normal CDF: Hart/West double-precision algorithm. |
| XC-51 | Black–Scholes delta (300 random contracts) | SciPy norm | 300 | 2.22e-16 | 1e-09 | PASS | Normal CDF: Hart/West double-precision algorithm. |
| XC-52 | Black–Scholes gamma (300 random contracts) | SciPy norm | 300 | 2.17e-19 | 1e-09 | PASS | Normal CDF: Hart/West double-precision algorithm. |
| XC-53 | Black–Scholes theta/day (300 random contracts) | SciPy norm | 300 | 4.44e-15 | 1e-09 | PASS | Normal CDF: Hart/West double-precision algorithm. |
| XC-54 | Black–Scholes vega/1pt (300 random contracts) | SciPy norm | 300 | 1.42e-14 | 1e-09 | PASS | Normal CDF: Hart/West double-precision algorithm. |
| XC-55 | Black–Scholes rho/1% (300 random contracts) | SciPy norm | 300 | 4.26e-14 | 1e-09 | PASS | Normal CDF: Hart/West double-precision algorithm. |
| XC-56 | Implied vol round-trip (40 contracts) | input σ | 40 | 2.84e-06 | 0.0001 | PASS | Bisection to 1e-6 price tolerance. |
| XC-60 | Position size units (300 random cases) | definition (Python) | 300 | 0 | 1e-09 | PASS |  |
| XC-61 | Actual risk amount | definition (Python) | 300 | 0 | 1e-09 | PASS |  |
| XC-62 | India charges total (300 random trades, 4 segments) | rates from NSE circular / Budget 2026 (Python) | 300 | 0 | 1e-09 | PASS |  |
| XC-63 | Expectancy | definition (Python) | 200 | 0 | 1e-09 | PASS |  |
| XC-64 | Profit factor | definition (Python) | 200 | 0 | 1e-09 | PASS |  |
| XC-65 | Max drawdown (100 random equity curves) | numpy running max | 100 | 0 | 1e-09 | PASS |  |
| XC-66 | Max drawdown % | numpy running max | 100 | 0 | 1e-09 | PASS |  |
| XC-67 | Losing-streak probability (40 random cases) | Monte Carlo, 20,000 sims each (numpy) | 40 | 0.00737 | 3 standard errors | PASS | Exact DP vs simulation; tolerance is sampling error. |
| XC-68 | Option strategy max gain / max loss (60 random positions, 7 structures) | brute-force payoff grid incl. strikes (Python) | 60 | 5e-12 | 1e-06 | PASS | Unbounded cases compared as ±∞. |
| XC-69 | Kelly fraction | definition (Python) | 100 | 0 | 1e-09 | PASS |  |
| XC-70 | Compounding final value | definition (Python) | 100 | 0 | 1e-09 | PASS |  |
| XC-71 | Futures notional | definition (Python) | 100 | 0 | 1e-09 | PASS |  |
| XC-72 | Futures margin estimate | definition (Python) | 100 | 0 | 1e-09 | PASS |  |

## Engine known-answer tests

| ID | Test | Result |
|---|---|---|
| IND-01 | SMA(3) of 1..5 | PASS |
| IND-02 | EMA(3) SMA-seeded of 1..5 = [-,-,2,3,4] | PASS |
| IND-03 | EMA recursion (10,11,12,20; n=3) last = 15.5 | PASS |
| IND-04 | WMA(3) of 1,2,3 = 14/6 | PASS |
| IND-05 | Population SD of 2,4,4,4,5,5,7,9 = 2 | PASS |
| IND-06 | Bollinger(8,2) upper=9 lower=1 | PASS |
| IND-07 | RSI(14) Wilder reference series: exact 70.4641; matches StockCharts table within rounding | PASS |
| IND-08 | RSI is null during warm-up and within 0..100 | PASS |
| IND-09 | RSI of monotonically rising series = 100 | PASS |
| IND-10 | True range uses previous close gaps | PASS |
| IND-11 | ATR(3) Wilder of constant TR=2 is 2 | PASS |
| IND-12 | MACD line = EMA12 − EMA26 | PASS |
| IND-13 | Classic pivots H110 L90 C100 | PASS |
| IND-14 | Camarilla R3 = C + 1.1×range/4 | PASS |
| IND-15 | Fibonacci 61.8% retracement of 100→200 = 138.2 | PASS |
| IND-16 | Session VWAP resets each day and equals typical price for one bar | PASS |
| IND-17 | OBV adds/subtracts volume by close direction | PASS |
| IND-18 | Stochastic %K = 100 at highest close | PASS |
| IND-19 | Williams %R = 0 at highest close | PASS |
| IND-20 | ROC(1) of 100→110 = 10% | PASS |
| IND-21 | CCI of constant series = 0 | PASS |
| IND-22 | MFI = 100 when typical price only rises | PASS |
| IND-23 | CMF = +1 when every close is at the high | PASS |
| IND-24 | Donchian upper/lower = highest high / lowest low | PASS |
| IND-25 | ADX/DI produced in 0..100 on a trend | PASS |
| IND-26 | Supertrend direction is up in a steady uptrend | PASS |
| IND-27 | Parabolic SAR stays below price in an uptrend | PASS |
| IND-28 | Volume profile POC is the most-traded bin; VA holds ≥70% | PASS |
| IND-29 | Ichimoku Tenkan = (9-high + 9-low)/2 | PASS |
| IND-30 | VWMA weights by volume | PASS |
| IND-31 | Anchored VWAP is null before anchor | PASS |
| IND-32 | Keltner = EMA ± m×ATR | PASS |
| IND-33 | Divergence detector finds bearish divergence | PASS |
| RSK-01 | Position size 1% of 1,00,000, entry 500 stop 495 → 200 shares | PASS |
| RSK-02 | Position size capped by capital | PASS |
| RSK-03 | Futures sizing rounds down to whole lots (lot 65) | PASS |
| RSK-04 | Zero-risk edge: stop = entry is rejected | PASS |
| RSK-05 | Invalid inputs rejected (negative capital, missing price) | PASS |
| RSK-06 | Very small budget → 0 units with warning | PASS |
| RSK-07 | Short side detected when stop > entry | PASS |
| RSK-08 | R:R 100/95/110 = 2:1, break-even WR 33.33% | PASS |
| RSK-09 | R:R rejects target on wrong side | PASS |
| RSK-10 | Expectancy W=0.5, +200/−100 → EV 50, PF 2 | PASS |
| RSK-11 | Max drawdown of 100,120,90,130,100 = 30 (25%) | PASS |
| RSK-12 | Recovering 50% drawdown needs +100% | PASS |
| RSK-13 | Trade stats on [100,-50,-50,200] | PASS |
| RSK-14 | Compounding 1000 at 10% for 2 periods = 1210 | PASS |
| RSK-15 | Leverage: notional 5L on 1L capital = 5×, 20% move wipes out | PASS |
| RSK-16 | Futures exposure Nifty 25800 × 65 × 2 = 33,54,000 | PASS |
| RSK-17 | Portfolio risk: two perfectly correlated = sum; uncorrelated = √2 | PASS |
| RSK-18 | Kelly W=0.6 b=1 → 0.2 | PASS |
| RSK-19 | Currency conversion INR→USD via table | PASS |
| RSK-20 | India intraday charges: buy 1,00,000 sell 1,01,000 | PASS |
| RSK-21 | India options STT 0.15% of sell premium (post-Apr-2026) | PASS |
| RSK-22 | India futures STT 0.05% of sell value | PASS |
| RSK-23 | Zero turnover → zero charges | PASS |
| RSK-24 | ATR stop long = entry − 1.5×ATR | PASS |
| RSK-25 | Risk-of-ruin formula: negative edge → 1 | PASS |
| OPT-01 | BS call(100,100,1y,5%,20%) = 10.4506 | PASS |
| OPT-02 | BS put = 5.5735 | PASS |
| OPT-03 | Put–call parity C − P = S − K·e^(−rT) | PASS |
| OPT-04 | Call delta 0.6368, put delta −0.3632 | PASS |
| OPT-05 | Gamma 0.01876 (same for call and put) | PASS |
| OPT-06 | Vega per 1 vol point = 0.3752 | PASS |
| OPT-07 | Call theta per day ≈ −0.01757 | PASS |
| OPT-08 | Implied vol recovers 20% from price | PASS |
| OPT-09 | At expiry price = intrinsic | PASS |
| OPT-10 | Bull call spread 100/110 @5/2: max +7, max −3, BE 103 | PASS |
| OPT-11 | Long call has unlimited gain, loss = premium | PASS |
| OPT-12 | Short call has unlimited loss | PASS |
| OPT-13 | Iron condor: credit = max gain, wings bound the loss | PASS |
| OPT-14 | Long put max gain = K − premium at S=0 | PASS |
| GEN-00 | Realism: median |daily open→close move| within 0.3–2.5 × configured daily vol (Nifty preset, 200 days) | PASS |
| GEN-00b | Realism: 200-day drift stays within ±40% (no runaway trend) | PASS |
| GEN-01 | Same seed → identical data (reproducible) | PASS |
| GEN-02 | OHLC consistency h ≥ max(o,c), l ≤ min(o,c), v ≥ 0 | PASS |
| GEN-03 | 5-min aggregation: 375-min session → 75 bars/day | PASS |
| GEN-04 | Weekends skipped for exchange sessions | PASS |
| GEN-05 | Prices rounded to tick | PASS |
| GEN-06 | Heikin-Ashi close = (o+h+l+c)/4 | PASS |
| GEN-07 | Renko bricks are exact box size | PASS |
| GEN-08 | All 10 decision scenarios generate history + future | PASS |
| BT-01 | No look-ahead: entry fills at NEXT bar open + slippage | PASS |
| BT-02 | No position is carried overnight | PASS |
| BT-03 | Equity = capital + Σ net P&L | PASS |
| BT-04 | Costs reduce P&L (net < gross) | PASS |
| BT-05 | Short side works | PASS |
| BT-06 | Stop-loss loss ≈ −1R before costs/slippage | PASS |
| BT-07 | Every signal combination in catalogue runs without error | PASS |
| BT-08 | Too few bars rejected | PASS |
| BT-09 | Monte Carlo percentiles ordered p5 ≤ p50 ≤ p95 | PASS |
| BT-10 | Risk-of-ruin sim: negative edge ≈ 1, strong edge ≈ 0 | PASS |
| CLK-01 | NYSE open 2026-07-01 = 13:30 UTC (EDT) | PASS |
| CLK-02 | NYSE open 2026-12-01 = 14:30 UTC (EST) | PASS |
| CLK-03 | NSE open = 03:45 UTC year-round (no DST in India) | PASS |
| CLK-04 | London open in BST (Jul) = 07:00 UTC, GMT (Jan) = 08:00 UTC | PASS |
| CLK-05 | Sydney DST (Jan) open 10:00 = 23:00 UTC previous day | PASS |
| CLK-06 | Session status: NSE open at 10:00 IST on a Wednesday | PASS |
| CLK-07 | Session status: weekend closed | PASS |
| CLK-08 | Tokyo lunch break detected | PASS |
| CLK-09 | Holiday list respected | PASS |
| EXE-01 | Market order fills at NEXT bar open (no look-ahead) | PASS |
| EXE-02 | Half-spread + slippage worsen the fill | PASS |
| EXE-03 | Stop gapped through fills at the open, not the stop | PASS |
| EXE-04 | Stop and target in same bar → stop assumed first | PASS |
| EXE-05 | Target fill cancels the OCO stop | PASS |
| EXE-06 | Liquidity cap produces partial fills | PASS |
| EXE-07 | Short trade P&L sign correct | PASS |
| EXE-08 | Limit buy fills at better open on a gap down | PASS |
| EXE-09 | End-of-day square-off closes position and cancels orders | PASS |
| EXE-10 | India futures charges applied on close (cash = start + gross − charges) | PASS |
| RSK-26 | Streak probability: k=1 equals 1 − (1−q)^n | PASS |
| RSK-27 | Streak probability: n=k equals q^k | PASS |
| RSK-28 | Streak probability matches brute-force enumeration (n=12, k=3, q=0.55) | PASS |
| RSK-29 | Options scenario: long call at unchanged spot/IV after 0 days ≈ 0 P&L; spot up helps | PASS |
| RSK-30 | Options scenario: short straddle loses on large moves and on IV rise | PASS |
| SPC-01 | Verified NSE 2026 holidays present (16 dates incl. 26 Jan and 2 Oct); clock reports Holiday on 24 Nov 2026 | PASS |
| SPC-02 | NSE index-futures tick by level: 14,000→0.05, 25,800→0.10, 57,500→0.20 | PASS |
| SPC-03 | FINRA TAF: $0 for trades in Oct–Dec 2026, standard rate from 1 Jan 2027 | PASS |
| SPC-04 | NSE sessions: post-close 15:50–16:00, closing auction 15:15–15:35; SGX has no lunch break | PASS |
| SPC-05 | Every holiday list is keyed to an existing session id | PASS |
| MCX-01 | MCX crude futures, 1 lot (100 bbl) 5,500 → 5,520: charges match a hand calculation (CTT 0.01% sell, txn ₹2.10/lakh, SEBI ₹10/crore, stamp 0.002% buy, GST 18%) | PASS |
| MCX-02 | MCX options (on premium) buy 120 sell 150 × 100 units: CTT 0.05% on sell premium, txn ₹41.80/lakh | PASS |
| MCX-03 | MCX session 09:00–23:55 IST is open at 22:00 IST on a weekday and has provenance marked secondary | PASS |