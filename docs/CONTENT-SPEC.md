# Content authoring spec (binding for every content file)

App: offline educational Intraday Trading Mastery Academy for a beginner → professional learner in India (primary), US and global markets. Content is shown in a dark mobile UI. Today is 4 Nov 2026.

## File format
Each file is a classic script that pushes into a global:

```js
(function (root) {
  const IA = (root.IA = root.IA || {}); IA.content = IA.content || {};
  IA.content.lessons = IA.content.lessons || []; IA.content.questions = IA.content.questions || [];
  IA.content.lessons.push({ ... }, { ... });
  IA.content.questions.push({ ... });
})(typeof window !== 'undefined' ? window : globalThis);
```

Strings: use JS template literals for long text. **Never use backticks inside text** (they end the string) and **never write `${`**. For inline code or short formulas use `{{ ... }}`; for a formula block use a line `:::formula` then lines then `:::`.

## Markdown subset the renderer supports
`## h2`, `### h3`, paragraphs, `**bold**`, `*italic*`, `- bullets`, `1. numbered`, pipe tables (`| a | b |` with `|---|---|` row), `{{inline code}}`, `:::formula … :::`, callouts as a paragraph starting `> [!warn] `, `> [!note] `, `> [!evidence] ` (use evidence callouts to label claims), `> [!india] `, `> [!us] `.

Embeds (each on its own line):
- `[[chart:PRESET:SEED:IND1,IND2]]` — synthetic candlestick chart. PRESET ∈ NIFTY, BANKNIFTY, RELIANCE, MIDCAP, SPY, NVDA, DAX, GOLD, BTC. IND ∈ ema9, ema20, ema50, sma20, sma50, wma20, vwma20, vwap, bb, kc, dc, st (supertrend), psar, ichimoku, vol, rsi, macd, atr, adx, stoch (slow), stochf (fast), stochrsi, obv, adl, cmf, mfi, cci, willr, roc, mom, sd, vp (volume profile). Example `[[chart:NIFTY:42:vwap,ema20,vol]]`.
- `[[pattern:ID]]` — diagram of a candlestick/chart pattern from patterns.js (ids: doji, hammer, inverted-hammer, shooting-star, hanging-man, bullish-engulfing, bearish-engulfing, morning-star, evening-star, piercing, dark-cloud, bullish-harami, bearish-harami, tweezer-top, tweezer-bottom, three-white-soldiers, three-black-crows, marubozu-bull, marubozu-bear, inside-bar, outside-bar, pin-bar).
- `[[widget:NAME]]` — live calculator. NAME ∈ position-size, rr, expectancy, charges-india, charges-us, options-payoff, greeks, ror, drawdown, futures-exposure, leverage, compounding, monte-carlo, fx.
- `[[link:lesson-id]]` — link to another lesson.

## Lesson object
```js
{
  id: 'l1-rsi', module: 'L1-M4', level: 1, track: 'ta', title: 'RSI from first principles', mins: 15,
  summary: 'One sentence of what the learner will be able to do.',
  evidence: 'established' | 'mixed' | 'subjective' | 'speculative',   // overall status of the core idea
  sections: [
    { h: 'Beginner view', md: `...` },          // REQUIRED — plain language, analogy, why it matters
    { h: 'Intermediate view', md: `...` },      // REQUIRED — mechanics, how to identify on a chart, how to execute
    { h: 'Advanced view', md: `...` },          // REQUIRED — nuance, how professionals use it, edge cases
    { h: 'The maths', md: `...` },              // where applicable — formula + a fully worked numeric example
    { h: 'India', md: `...` },                  // where applicable — Nifty/Bank Nifty/NSE stock example, ₹
    { h: 'US & global', md: `...` },            // where applicable
    { h: 'Common misconceptions', md: `...` },  // REQUIRED
    { h: 'When it fails', md: `...` },          // REQUIRED — failure conditions, a realistic losing example
    { h: 'Exercise', md: `...` },               // REQUIRED — something to do in the app (chart lab, simulator, calculators, journal)
  ],
  check: [ { q: '...', o: ['A','B','C','D'], a: 1, why: 'why B is right and the others are not' }, ... ],  // ≥2, test understanding not recall
  refs: ['Author — Title (book)', 'NSE — page name (nseindia.com)', ...]  // real sources only
}
```
Minimum 650 words per lesson across sections; target 800–1,300. Be specific and concrete: worked numbers, chart descriptions, step-by-step execution, the WHY/HOW/WHEN-works/WHEN-fails framing.

## Question bank (module assessments)
At least 12 per module, mixing recall (few), concept, calculation and scenario ("You are long Bank Nifty futures 1 lot at …; what …?"). Difficulty d: 1–3.
```js
{ id: 'L1-M4-q01', module: 'L1-M4', d: 2, q: '...', o: ['...','...','...','...'], a: 0, why: '...' }
```
Vary the correct index.

## Honesty rules (non-negotiable)
- Never guarantee profits or imply a method "works". No invented statistics, success rates, backtest results, studies or quotes. If citing a regulator finding (e.g. SEBI's F&O loss studies), state it in general terms with source name and year only if you are sure; otherwise omit.
- Label status: established principle (mechanics, maths, regulations), empirical-mixed (evidence exists both ways, e.g. momentum, mean reversion), subjective framework (Elliott, Gann, harmonics, SMC order blocks, most candlestick lore), speculative.
- Institutional jargon is not proof of institutional activity.
- Time-sensitive facts carry "as of <month year> — verify on <source>". Verified facts as of Nov 2026 you may use:
  - India STT from 1 Apr 2026 (Budget 2026): futures 0.05% on sell; options 0.15% of premium on sell; options exercised 0.15%. Equity intraday 0.025% sell; delivery 0.1% both sides.
  - NSE transaction charges from 1 Mar 2026 (incl. IPFT): cash ₹307/crore, futures ₹183/crore, options ₹3,553/crore of premium. SEBI fee ₹10/crore. GST 18% on brokerage + exchange + SEBI fees. Stamp duty (buy side): intraday 0.003%, delivery 0.015%, futures 0.002%, options 0.003%.
  - Index lot sizes for contracts from Jan 2026: Nifty 65, Bank Nifty 30, Fin Nifty 60, Midcap Select 120; Sensex 20. Nifty weekly options expire Tuesday; Bank Nifty has monthly contracts only (weekly discontinued Nov 2024). Verify current expiry days on NSE.
  - NSE normal market 09:15–15:30 IST. Pre-open 09:00–09:15 (order entry to 09:10, matching 09:10–09:12, from 7 Sep 2026). Stocks with F&O trade continuously to 15:15, then a Closing Auction Session 15:15–15:35 sets the closing price (from 3 Aug 2026). Post-close 15:50–16:00. Equity F&O closes 15:40. Index futures tick depends on index level (0.05 / 0.10 / 0.20; index options 0.05) since 15 Apr 2025.
  - US: SEC fee $20.60 per million of sales from 4 Apr 2026; FINRA TAF paused at $0 for 1 Oct–31 Dec 2026. PDT replacement effective 4 Jun 2026, firms may phase in until 20 Oct 2027.
  - Realistic round-trip cost of ONE Nifty futures lot (65) near 25,800 with ₹20/order brokerage: about ₹950–1,000 (≈15 index points). Never assume ₹300.
  - US: SEC approved (Apr 2026) FINRA's proposal to eliminate the pattern-day-trader definition and the $25,000 minimum, replacing it with risk-based intraday margin standards; broker implementation timing varies.
  - US regular session 09:30–16:00 ET. Tokyo extended its close to 15:30 JST in Nov 2024.
- Copyright: do not quote books; paraphrase ideas and attribute to author/title.
- Not personal advice. Encourage paper trading; capital preservation first.

## Style
British/Indian English spelling. Clear, direct, second person. Short paragraphs, tables where they compare. ₹ for India with lakh/crore where natural; $ for US. No emojis. No filler.
