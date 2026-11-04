/* Market specifications — dated, sourced, user-overridable in Settings.
   Rates change. Every block carries asOf + note. Verify before relying on any number. */
(function (root) {
  const IA = (root.IA = root.IA || {});

  IA.specsDefault = {
    version: 1,
    india: {
      asOf: '2026-11-04',
      verified: '2026-11-04',
      note: 'STT revised by Union Budget 2026 (effective 1 Apr 2026). NSE transaction charges per circular dated 27 Feb 2026 (effective 1 Mar 2026), IPFT included. Index lot sizes revised for contracts from Jan 2026. Brokerage is a typical discount-broker plan — set your own broker\'s.',
      gstRate: 0.18,
      sebiFeeRate: 10 / 1e7,           // ₹10 per crore
      segments: {
        eqIntraday: { label: 'Equity intraday (MIS)', sttBuy: 0, sttSell: 0.00025, txn: 307 / 1e7, stampBuy: 0.00003, brokerage: { type: 'minOf', flat: 20, pct: 0.0003 } },
        eqDelivery: { label: 'Equity delivery (CNC)', sttBuy: 0.001, sttSell: 0.001, txn: 307 / 1e7, stampBuy: 0.00015, brokerage: { type: 'flat', flat: 0 } },
        futures: { label: 'Equity/index futures', sttBuy: 0, sttSell: 0.0005, txn: 183 / 1e7, stampBuy: 0.00002, brokerage: { type: 'minOf', flat: 20, pct: 0.0003 } },
        options: { label: 'Equity/index options (on premium)', sttBuy: 0, sttSell: 0.0015, txn: 3553 / 1e7, stampBuy: 0.00003, brokerage: { type: 'flat', flat: 20 } },
      },
      contracts: [
        { sym: 'NIFTY', name: 'Nifty 50 index', lot: 65, tick: 'Options 0.05; futures 0.05/0.10/0.20 by index level', expiry: 'Weekly Tuesday (4 weekly) + monthly last Tuesday; quarterly & half-yearly options', asOf: '2026-01 (lot) · 2025-09-01 (expiry)' },
        { sym: 'BANKNIFTY', name: 'Nifty Bank index', lot: 30, tick: 'Options 0.05; futures 0.05/0.10/0.20 by index level', expiry: 'Monthly only (last Tuesday) + quarterly options', asOf: '2026-01 · 2025-09-01' },
        { sym: 'FINNIFTY', name: 'Nifty Financial Services', lot: 60, tick: 'Options 0.05; futures 0.05/0.10/0.20 by index level', expiry: 'Monthly (last Tuesday)', asOf: '2026-01 · 2025-09-01' },
        { sym: 'MIDCPNIFTY', name: 'Nifty Midcap Select', lot: 120, tick: 'Options 0.05; futures 0.05/0.10/0.20 by index level', expiry: 'Monthly (last Tuesday)', asOf: '2026-01 · 2025-09-01' },
        { sym: 'SENSEX', name: 'BSE Sensex (BSE)', lot: 20, tick: '0.05 (UNVERIFIED — no official BSE source found)', expiry: 'Weekly Thursday + monthly last Thursday (secondary sources)', asOf: '2026-01' },
      ],
      // NSE index futures tick by index level, effective 15 Apr 2025 (reviewed monthly by NSE): ≤15,000 → 0.05; ≤30,000 → 0.10; above → 0.20.
      indexFutTick: [[15000, 0.05], [30000, 0.10], [Infinity, 0.20]],
      expiryNote: 'If an expiry Tuesday/Thursday is a holiday, expiry moves to the previous trading day. Source: SEBI/HO/MRD/TPD-1/P/CIR/2025/76, NSE circular 103/2025 (effective 1 Sep 2025).',
    },
    us: {
      asOf: '2026-11-04',
      verified: '2026-11-04',
      note: 'SEC Section 31 fee $20.60 per million of sales from 4 Apr 2026 (SEC Fee Rate Advisory 2026-2). FINRA TAF is PAUSED at $0 for trades 1 Oct–31 Dec 2026 (SR-FINRA-2026-021) and returns to $0.000195/share, max $9.79 per trade, on 1 Jan 2027 — the app switches automatically by trade date. Commissions are BROKER ASSUMPTIONS (edit to your broker). PDT: SEC approved FINRA\'s replacement of the pattern-day-trader rule with intraday margin standards on 14 Apr 2026 (Rel. 34-105226); effective 4 Jun 2026; firms may phase in until 20 Oct 2027 (FINRA Regulatory Notice 26-10) — your broker may still apply the old rule.',
      commissionPerShare: 0, commissionMin: 0, optionPerContract: 0.65, assumptions: ['commissionPerShare', 'commissionMin', 'optionPerContract'],
      secFeeRate: 0.0000206, finraTafPerShare: 0.000195, finraTafMax: 9.79,
      tafSchedule: [{ from: '2026-10-01', to: '2026-12-31', perShare: 0, max: 0, source: 'SR-FINRA-2026-021' }],
      contracts: [
        { sym: 'ES', name: 'E-mini S&P 500 futures (CME)', multiplier: 50, tick: 0.25, tickValue: 12.5 },
        { sym: 'MES', name: 'Micro E-mini S&P 500', multiplier: 5, tick: 0.25, tickValue: 1.25 },
        { sym: 'NQ', name: 'E-mini Nasdaq-100', multiplier: 20, tick: 0.25, tickValue: 5 },
        { sym: 'MNQ', name: 'Micro E-mini Nasdaq-100', multiplier: 2, tick: 0.25, tickValue: 0.5 },
        { sym: 'SPY/QQQ options', name: 'Equity/ETF options', multiplier: 100, tick: 0.01, tickValue: 1 },
      ],
    },
    // Session times in exchange-local time; converted with IANA zones (DST-safe)
    sessions: [
      { id: 'NSE', country: 'India', name: 'NSE / BSE', tz: 'Asia/Kolkata', pre: ['09:00', '09:15'], main: [['09:15', '15:30']], post: ['15:50', '16:00'], auction: ['15:15', '15:35'], note: 'Pre-open 09:00–09:15 (order entry to 09:10, matching 09:10–09:12, from 7 Sep 2026). Normal market 09:15–15:30; stocks with F&O contracts trade continuously to 15:15, then the Closing Auction Session 15:15–15:35 (from 3 Aug 2026). Post-close 15:50–16:00. Equity F&O closes 15:40. Block-deal windows 08:45–09:00 and 14:05–14:20. Sources: NSE market timings; SEBI circular on the Closing Auction Session (Jan 2026).' },
      { id: 'NYSE', country: 'United States', name: 'NYSE / NASDAQ', tz: 'America/New_York', pre: ['04:00', '09:30'], main: [['09:30', '16:00']], post: ['16:00', '20:00'], note: 'Extended-hours windows vary by broker.' },
      { id: 'LSE', country: 'United Kingdom', name: 'London Stock Exchange', tz: 'Europe/London', pre: ['07:50', '08:00'], main: [['08:00', '16:30']], post: ['16:30', '16:35'], note: 'Opening and closing auctions.' },
      { id: 'XETRA', country: 'Germany', name: 'Deutsche Börse Xetra', tz: 'Europe/Berlin', pre: ['08:50', '09:00'], main: [['09:00', '17:30']], post: ['17:30', '17:35'], note: 'DAX futures trade nearly 22h on Eurex.' },
      { id: 'EPA', country: 'France', name: 'Euronext Paris', tz: 'Europe/Paris', pre: ['07:15', '09:00'], main: [['09:00', '17:30']], post: ['17:30', '17:35'], note: '' },
      { id: 'TSE', country: 'Japan', name: 'Tokyo Stock Exchange', tz: 'Asia/Tokyo', pre: ['08:00', '09:00'], main: [['09:00', '11:30'], ['12:30', '15:30']], post: null, note: 'Lunch break 11:30–12:30; afternoon close extended to 15:30 in Nov 2024.' },
      { id: 'HKEX', country: 'Hong Kong', name: 'Hong Kong Exchange', tz: 'Asia/Hong_Kong', pre: ['09:00', '09:30'], main: [['09:30', '12:00'], ['13:00', '16:00']], post: ['16:00', '16:10'], note: 'Closing auction session 16:00–16:10.' },
      { id: 'SGX', country: 'Singapore', name: 'Singapore Exchange', tz: 'Asia/Singapore', pre: ['08:30', '09:00'], main: [['09:00', '17:00']], post: ['17:00', '17:06'], note: 'Continuous 09:00–17:00 with no lunch break since 2011 (SGX release, 18 Jan 2011). Pre-open and closing-auction times UNVERIFIED.' },
      { id: 'ASX', country: 'Australia', name: 'ASX', tz: 'Australia/Sydney', pre: ['07:00', '10:00'], main: [['10:00', '16:00']], post: ['16:00', '16:11'], note: 'Staggered open 10:00–10:09 by ticker. Closing single-price auction 16:10–16:11.' },
      { id: 'TSX', country: 'Canada', name: 'Toronto Stock Exchange', tz: 'America/Toronto', pre: ['07:00', '09:30'], main: [['09:30', '16:00']], post: ['16:15', '17:00'], note: '' },
    ],
    // Exchange holidays (weekday non-trading days). Verified lists only; see IA.specsSources for sources.
    holidays: {"NSE": ["2026-01-15", "2026-01-26", "2026-03-03", "2026-03-26", "2026-03-31", "2026-04-03", "2026-04-14", "2026-05-01", "2026-05-28", "2026-06-26", "2026-09-14", "2026-10-02", "2026-10-20", "2026-11-10", "2026-11-24", "2026-12-25"], "NYSE": ["2026-01-01", "2026-01-19", "2026-02-16", "2026-04-03", "2026-05-25", "2026-06-19", "2026-07-03", "2026-09-07", "2026-11-26", "2026-12-25", "2027-01-01", "2027-01-18", "2027-02-15", "2027-03-26", "2027-05-31", "2027-06-18", "2027-07-05", "2027-09-06", "2027-11-25", "2027-12-24"], "NASDAQ": ["2026-01-01", "2026-01-19", "2026-02-16", "2026-04-03", "2026-05-25", "2026-06-19", "2026-07-03", "2026-09-07", "2026-11-26", "2026-12-25"], "XETRA": ["2026-01-01", "2026-04-03", "2026-04-06", "2026-05-01", "2026-12-24", "2026-12-25", "2026-12-31", "2027-01-01", "2027-03-26", "2027-03-29", "2027-12-24", "2027-12-31"], "EPA": ["2026-01-01", "2026-04-03", "2026-04-06", "2026-05-01", "2026-12-25"]},
    // Indicative FX rates for the converter only — edit in Settings; no live feed.
    fx: { asOf: 'edit me', base: 'USD', rates: { USD: 1, INR: 88.5, EUR: 0.86, GBP: 0.76, JPY: 152, SGD: 1.30, HKD: 7.78, AUD: 1.53, CAD: 1.40 } },
  };
})(typeof window !== 'undefined' ? window : globalThis);
