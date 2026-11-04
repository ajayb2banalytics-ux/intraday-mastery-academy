/* Market specifications — dated, sourced, user-overridable in Settings.
   Rates change. Every block carries asOf + note. Verify before relying on any number. */
(function (root) {
  const IA = (root.IA = root.IA || {});

  IA.specsDefault = {
    version: 1,
    india: {
      asOf: '2026-11-04',
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
        { sym: 'NIFTY', name: 'Nifty 50 index', lot: 65, tick: 0.05, expiry: 'Weekly (Tuesday) + monthly (last Tuesday)', asOf: '2026-01' },
        { sym: 'BANKNIFTY', name: 'Nifty Bank index', lot: 30, tick: 0.05, expiry: 'Monthly only (last Tuesday)', asOf: '2026-01' },
        { sym: 'FINNIFTY', name: 'Nifty Financial Services', lot: 60, tick: 0.05, expiry: 'Monthly (last Tuesday)', asOf: '2026-01' },
        { sym: 'MIDCPNIFTY', name: 'Nifty Midcap Select', lot: 120, tick: 0.05, expiry: 'Monthly (last Tuesday)', asOf: '2026-01' },
        { sym: 'SENSEX', name: 'BSE Sensex (BSE)', lot: 20, tick: 0.05, expiry: 'Weekly (Thursday) + monthly', asOf: '2026-01' },
      ],
      expiryNote: 'Expiry weekdays were moved by SEBI/exchange decisions in 2025. Confirm the current calendar on nseindia.com before trading.',
    },
    us: {
      asOf: '2026-11-04',
      note: 'Commission-free equity trading is common; options typically carry a per-contract fee. SEC Section 31 fee and FINRA TAF rates are reset periodically — the defaults here are placeholders to edit, not authoritative values. PDT rule: SEC approved FINRA\'s removal of the $25,000 pattern-day-trader minimum in April 2026, replaced by risk-based intraday margin standards; broker implementation timing varies — confirm with your broker.',
      commissionPerShare: 0, commissionMin: 0, optionPerContract: 0.65,
      secFeeRate: 0.0000206, finraTafPerShare: 0.000195, finraTafMax: 9.79,
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
      { id: 'NSE', country: 'India', name: 'NSE / BSE', tz: 'Asia/Kolkata', pre: ['09:00', '09:08'], main: [['09:15', '15:30']], post: ['15:40', '16:00'], note: 'Pre-open call auction 09:00–09:08; closing session 15:40–16:00.' },
      { id: 'NYSE', country: 'United States', name: 'NYSE / NASDAQ', tz: 'America/New_York', pre: ['04:00', '09:30'], main: [['09:30', '16:00']], post: ['16:00', '20:00'], note: 'Extended-hours windows vary by broker.' },
      { id: 'LSE', country: 'United Kingdom', name: 'London Stock Exchange', tz: 'Europe/London', pre: ['07:50', '08:00'], main: [['08:00', '16:30']], post: ['16:30', '16:35'], note: 'Opening and closing auctions.' },
      { id: 'XETRA', country: 'Germany', name: 'Deutsche Börse Xetra', tz: 'Europe/Berlin', pre: ['08:50', '09:00'], main: [['09:00', '17:30']], post: ['17:30', '17:35'], note: 'DAX futures trade nearly 22h on Eurex.' },
      { id: 'EPA', country: 'France', name: 'Euronext Paris', tz: 'Europe/Paris', pre: ['07:15', '09:00'], main: [['09:00', '17:30']], post: ['17:30', '17:35'], note: '' },
      { id: 'TSE', country: 'Japan', name: 'Tokyo Stock Exchange', tz: 'Asia/Tokyo', pre: ['08:00', '09:00'], main: [['09:00', '11:30'], ['12:30', '15:30']], post: null, note: 'Lunch break 11:30–12:30; afternoon close extended to 15:30 in Nov 2024.' },
      { id: 'HKEX', country: 'Hong Kong', name: 'Hong Kong Exchange', tz: 'Asia/Hong_Kong', pre: ['09:00', '09:30'], main: [['09:30', '12:00'], ['13:00', '16:00']], post: ['16:00', '16:10'], note: 'Closing auction session 16:00–16:10.' },
      { id: 'SGX', country: 'Singapore', name: 'Singapore Exchange', tz: 'Asia/Singapore', pre: ['08:30', '09:00'], main: [['09:00', '12:00'], ['13:00', '17:00']], post: ['17:00', '17:06'], note: '' },
      { id: 'ASX', country: 'Australia', name: 'ASX', tz: 'Australia/Sydney', pre: ['07:00', '10:00'], main: [['10:00', '16:00']], post: ['16:00', '16:12'], note: 'Staggered open 10:00–10:09 by ticker.' },
      { id: 'TSX', country: 'Canada', name: 'Toronto Stock Exchange', tz: 'America/Toronto', pre: ['07:00', '09:30'], main: [['09:30', '16:00']], post: ['16:15', '17:00'], note: '' },
    ],
    // Indicative FX rates for the converter only — edit in Settings; no live feed.
    fx: { asOf: 'edit me', base: 'USD', rates: { USD: 1, INR: 88.5, EUR: 0.86, GBP: 0.76, JPY: 152, SGD: 1.30, HKD: 7.78, AUD: 1.53, CAD: 1.40 } },
  };
})(typeof window !== 'undefined' ? window : globalThis);
