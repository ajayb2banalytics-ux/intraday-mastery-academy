# Audit: js/content/lessons-l2b.js

Date: 4 Nov 2026. Brief: docs/AUDIT-SPEC.md, with CONTENT-SPEC.md rules applied.

## Scope
- I read all 18 lessons (L2-M5 psychology, L2-M6 US, L2-M7 global sessions, L3-M8 other asset classes, L4-M4 advanced analysis), their 52 inline check questions and the 60 module-bank questions (12 each for L2-M5, L2-M6, L2-M7, L3-M8 and L4-M4).
- **Numbers:** I recomputed 151 numeric claims in node (scratch script), covering every worked example, formula, table value and calculation question. I checked the Nifty-futures charge example against `IA.risk.indiaCharges` and `IA.specsDefault`, and the US cost example against `IA.risk.usCharges`. I checked the recovery maths against `IA.risk.lossesToRecover`, and the variance claims with a 100,000-run Monte Carlo.
- **Time zones and DST:** I checked every session table against UTC offsets and the US, EU and AU daylight-saving rules, and against the sessions in `js/engines/specs.js`.
- **Time-sensitive regulatory facts:** I checked these with a small number of web searches and fetches, listed under Sources. They cover the PDT effective and implementation dates, the Rule 605 compliance date, the Rule 610(c)/612 relief, the proposed rescission of Rule 611, the June 2025 withdrawal of the Order Competition Rule and Reg Best Ex, RBI's 2024 ETCD directions, and VDA tax under the Income-tax Act, 2025.
- **Psychology:** I checked every psychology claim for pop-psychology presented as science.
- **Validator:** `node tests/validate-content.js js/content/lessons-l2b.js` reports 0 errors and 0 warnings after the edits. All lessons are 1,025–1,523 words.

## Findings

| Item | Issue | Severity | Action taken |
|---|---|---|---|
| l2-us-vs-india, The maths | The Nifty futures cost example left out the SEBI fee and GST and gave total costs as about ₹960 / net about ₹1,640. The engine gives ₹967.57 / ₹1,632.43. | error | Added the SEBI fee and GST lines. Costs now about ₹968, net about ₹1,632, and the text notes this matches the engine. |
| l2-us-vs-india, The maths | The US example said the SEC fee and TAF are "a few cents". At the engine's placeholder rate the SEC fee on a $25,100 sale is about $0.52. Net corrected from about $97 to about $97.50. | error | Corrected, and noted that the SEC rate is reset periodically. |
| l2-emotions, The maths | "Roughly 32 trades" to recover is inconsistent: at 1% risk on the reduced account and +0.3R, recovery takes about 29–31 trades. "0.088 ÷ 0.912" was rounded. | error | Corrected to "roughly 30 trades", with the steps shown (₹43,858 drawdown, about ₹4,560 risk per trade). |
| l2-us-sessions, When it fails | The trade is entered at 21:30 ET, which is after the 20:00 ET close of after-hours trading. | error | Changed to a 16:40 ET entry, with guidance arriving on the 17:00 ET call. |
| l2-asia, The maths | Said 09:00 IST is "just before NSE's pre-open ends". It is when pre-open order entry *begins*. | error | Corrected. |
| l2-overnight, GIFT Nifty | Said "about 21 hours" of trading. The stated sessions, 06:30–15:40 and 16:35–02:45, add up to about 19h20m. Also said it is "not open to most Indian residents" with no source. | error / misleading | Corrected to "a little over 19 hours" (verify on nseix.com). Resident access now reads "restricted (verify current RBI and IFSCA rules)". |
| l3-rates, When it fails | The IRF DV01 of "₹400 per lot" does not fit the lesson's own maths: a ₹2 lakh lot with duration about 7 gives about ₹140. | error | Recomputed. Loss changed from ₹48,000 to ₹16,800, with the steps shown and "verify lot on NSE". |
| l3-commodities, Advanced view | April 2020: said MCX contracts "faced settlement questions". In fact MCX's April 2020 crude contract settled at a negative price. | shallow / misleading | Corrected, with "verify in MCX circulars of April 2020". |
| l3-commodities, The maths | 18,600 ÷ 49,600 = 37.5%, not 37%. | error (minor) | Corrected. |
| l3-crypto, When it fails | Said "you lose the full $1,550". On many venues the leftover maintenance margin goes to a liquidation fee or the insurance fund, so this needed qualifying. | shallow | Clarified (verify per venue). |
| l2-us-structure, Reg NMS | The half-cent tick status was "verify" only. The SEC adopted half-cent ticks and a 10-mil access-fee cap in Sept 2024, then extended relief to Nov 2027 in June 2026. The June 2026 proposal to rescind Rule 611 and Rule 610(e) was missing. The 30-mil access-fee cap and the lock/cross ban were not explained. | missing (time-sensitive) | Added a dated `[!us]` callout and the refs. |
| l2-us-structure, Rule 605 | Compliance date unstated. | missing | Added: extended to 1 Aug 2026, with further limited exemptions in Apr 2026 (verify). |
| l2-us-structure, Policy | Said "some proposals were later withdrawn", which is vague. | shallow | Now states that the Order Competition Rule and Reg Best Execution were withdrawn in June 2025. |
| l2-us-structure | No global context on PFOF. | missing | Added a note on the UK FCA position and the EU MiFIR PFOF ban (transitional opt-out to 30 Jun 2026), flagged "verify". |
| l2-us-sessions, LULD/MWCB | Only the 7/13/20% levels were mentioned. No band sizes, 15-second / 5-minute pause, 15:25 ET rule or Level 3 rule. | shallow | Added a table of mechanisms, dated and with "verify". Added refs to the LULD Plan and NYSE Rule 7.12. |
| l2-us-sessions | The MOC cut-off was given as "a few minutes before 16:00". | shallow | Changed to about 15:50 ET (verify; brokers may set earlier cut-offs). |
| l2-us-rules, PDT | Had the approval month only. No effective date, phase-in deadline or explanation of how the new framework works. | missing (time-sensitive) | Added the approval date (14 Apr 2026), the effective date (4 Jun 2026) and the phase-in deadline (20 Oct 2027) from FINRA Notice 26-10. Added an outline of the intraday margin deficit rules (prompt cover, 15 business days, 90-day restriction). Added the Notice to refs. Updated the explanation in bank question L2-M6-q06. |
| l2-us-rules, regulators | Said "options and futures on indices traded on futures exchanges fall under the CFTC", which blurs the line: SPX options are SEC-regulated securities. | misleading | Restated the SEC/CFTC split (cash-index options under the SEC; futures and options on futures under the CFTC). |
| l2-us-vs-india, table | The India tick size "₹0.05 for most stocks" is outdated: NSE moved to ₹0.01 below ₹250 under its price-band framework. The India row had no market-wide circuit breakers. The US half-cent tick status was not given. | error / missing | Rewritten with "verify". Added India's 10/15/20% index circuit breakers and the US Nov 2027 delay. |
| l3-fx, ETCD | The underlying-exposure rule was vague ("expected to have", "de minimis"). | shallow (regulatory) | Now states the RBI directions effective 3 May 2024: hedging only, a USD 100 million limit across exchanges without documentation, but the exposure must exist. Sourced to the RBI press release. |
| l3-fx, leverage | "30:1 to 50:1 common". | shallow | Stated the caps by jurisdiction: 50:1 under CFTC/NFA, 30:1 retail under FCA/ESMA. |
| l3-fx, The maths | No tick-value link. | missing | Added ₹2.50 per tick per lot (34 ticks in the example). |
| l3-crypto, India | VDA tax was cited only under the 1961 Act. The Income-tax Act, 2025 took effect on 1 Apr 2026. Loss carry-forward was not mentioned. FIU-registered crypto futures were not distinguished clearly. | missing / time-sensitive | Added the 2025 Act carry-forward (verify section numbers), the ban on carrying losses forward, and an explicit "verify" on how derivatives are taxed and on LRS use. Stated plainly what FIU-registered platforms are not (not SEBI-regulated F&O, no clearing guarantee). |
| l4-regimes, VIX maths | √252 was presented as the only convention. India VIX uses calendar time, which supports √365 (about 209 points vs about 252). | shallow | Added a note on the two conventions and the one-standard-deviation interpretation. |
| l4-gex, Intermediate view | The dealer-positioning convention was stated without the reasoning behind it (customers sell calls, buy puts). | shallow | Explained the convention and the vendor variation. |
| l4-gex, SEBI measures | The list of measures was incomplete. | shallow | Added the expiry-day extra ELM and intraday position-limit monitoring, worded as "one weekly expiry per exchange" (verify on sebi.gov.in). |
| l2-europe | The winter/summer IST labels read "Nov–Mar / Mar–Oct". Europe changes clocks on the last Sundays of March and October. The India callout read "Nov–Mar" and "April–Oct". | error (DST) | Corrected to late Oct–late Mar and late Mar–late Oct. Clarified the hours remaining before the NSE close. |
| l2-biases | Evolutionary "kept our ancestors alive" story presented as fact (pop-psychology). | unsupported | Replaced with a neutral statement, noting that the origin of these shortcuts is debated. |
| l2-biases | The evidence callout cited only prospect theory. The claim "knowledge alone helps little" was unsourced. | reference / unsupported | Added Shefrin & Statman (1985) and Odean (1998), plus a note on effect size and replication. Softened the debiasing claim to "evidence … is limited and mixed". |
| l2-biases, table | "Each trade's odds are independent of your streak" overstates the case: trades can be serially correlated through regime. | misleading | Reworded to "do not improve because of your streak". |
| l2-emotions | `evidence: 'established'` for practitioner constructs (FOMO, tilt, revenge trading, specific circuit-breaker rules). "Consecutive-loss rules work better" was an unsupported comparative claim. "Emotion signals peak after price moved" was stated as fact. "Biggest driver" and "many chased moves would have reversed" were unsupported. | unsupported | Evidence changed to `mixed`. Added an evidence callout separating research (Lo & Repin 2002, added to refs) from practitioner heuristics. Softened all five claims. |
| l2-process | "This separation is how professional desks review traders" — unsupported generalisation. | unsupported | Softened. |
| l2-process, The maths | "A 20-trade losing stretch is entirely possible" was not quantified. The "runs of six or more losses are normal" claim was not shown. | shallow | Added simulated figures: about 13% of 20-trade runs finish below zero, and about 91% of 300-trade sequences contain a run of six or more losses. |
| l2-routine | `evidence: 'established'` for a mostly practitioner framework. Implementation-intentions research was stretched to trading. The rumination/sleep claim was stated as fact. Failure rehearsal was presented as proven. "Many traders stop by 14:30" was unsourced. | unsupported | Evidence changed to `mixed`. Added the Gollwitzer & Sheeran (2006) meta-analysis with the caveat that those studies were not about trading. Added Klein's premortem as the source for failure rehearsal, labelled a practitioner technique. Softened the sleep and "many traders" claims. |
| l2-routine, US & global | "Many Indian traders … focus only on the first 60–90 minutes" — unsourced. | unsupported | Reframed as "one common approach". |
| All 52 lesson check questions | The correct answer was option B in 41 of 52 (79%), contrary to the "vary the correct index" rule, so learners could guess the pattern. | misleading (assessment design) | I reordered the options by a scripted rotation, which keeps each correct answer and its explanation unchanged. The answers are now spread 13/13/13/13. No explanation refers to an option letter. |
| Module bank, 60 questions | All recomputed and correct; correct indices already balanced 15/15/15/15. | — | Only q06 (PDT dates) and the explanation for L3-M8-q11 (2025 Act) were updated. |

Arithmetic verified correct with no change needed: all expectancy, SD and √n, PFOF/effective-spread, spread-in-R, leverage and liquidation, time-zone, GIFT basis/carry, correlation (ρ = 0.7999), MCX parity, gold conversion, FX forward (87.43; 6-month 86.84), funding (incl. 10.95% annualised), liquidation prices (54,271 / 65,672 / 57,889 / 59,196 / 40,404 / 63,317 / 3,134), duration/DV01, SOFR, beta-adjusted RS, ATR sizing, VIX moves (252/394/302/289), GEX (₹3,250 / 2,600 / 1,015.6 crore) and price–OI examples.

## Counts
- Items checked: 18 lessons, 52 lesson check questions, 60 bank questions, 151 numeric claims and 37 references.
- Errors fixed: 13 (8 numeric or consistency, 2 time/DST, 1 tick-size, 1 after-hours timing, 1 pre-open timing).
- Claims softened or relabelled: 16. This includes 2 lesson `evidence` fields changed from established to mixed.
- Additions made: 17 (new tables or paragraphs on Reg NMS status, Rule 605, the policy withdrawals, global PFOF, LULD/MWCB, the PDT framework and dates, the SEC/CFTC split, India circuit breakers, ETCD limits, FX caps and tick value, VDA under the 2025 Act, the VIX convention, the GEX convention, SEBI measures and the variance simulation).
- Assessment fixes: 41 lesson check questions had their options reordered.
- References: 0 removed (all existing references are real works or official pages as far as I can confirm). 13 added: Shefrin & Statman 1985, Odean 1998, Lo & Repin 2002, Gollwitzer & Sheeran 2006, Klein 2007, SEC Rule 611/610(e) proposal (June 2026), SEC June 2025 withdrawals, SEC Rule 610(c)/612 relief, the LULD Plan, NYSE Rule 7.12, the SEC investor bulletin, FINRA Notice 26-10, and the RBI ETCD press release (April 2024). Two were corrected: the Gollwitzer title was completed, and the VDA tax reference was updated to the 2025 Act.

## Remaining concerns (not resolved)
- **GIFT Nifty access for Indian residents.** I could not source the current position under RBI and IFSCA rules, so it is marked "verify". The session hours (06:30–15:40 and 16:35–02:45 IST) are consistent across broker pages but were not confirmed on nseix.com.
- **Hours not confirmed against primary sources:** MCX (23:30/23:55 IST), NSE currency derivatives (09:00–17:00, crosses to 19:30), Eurex index futures (from about 01:10 CET), and the CME ES maintenance break. All are already marked "verify".
- **From memory, flagged "verify":** the EU PFOF ban and its opt-out date, the LULD band percentages and end-of-day doubling, the MOC cut-offs, and India's 10/15/20% index circuit breakers.
- **India VDA.** The new section numbers under the Income-tax Act, 2025, and how crypto derivatives and perpetuals are taxed, are not stated. The text points learners to a professional.
- **LRS.** Whether residents may remit for leveraged crypto products is not stated. The lesson says it cannot confirm this.
- **US fee rates.** The engine's SEC fee and FINRA TAF values are placeholders, as `specs.js` itself notes. Dollar figures based on them are illustrative.
- **India tick sizes.** NSE's price-band tick framework (₹0.01 below ₹250) has been revised several times in 2024–2025. I did not confirm the exact current bands.
- **Possible engine/content mismatch (not edited):** the engine's GST base is brokerage + exchange + SEBI fees. This matches CONTENT-SPEC, so no engine issue.

## Statement
This is an AI-assisted review (Claude). It is not an independent expert review, legal or tax opinion, or regulatory certification. Time-sensitive facts carry "as of / verify" labels and should be re-checked against the primary sources before relying on them.

## Sources consulted for time-sensitive facts
- FINRA Regulatory Notice 26-10 — https://www.finra.org/rules-guidance/notices/26-10/
- Charles Schwab, SEC Approves Scrapping $25,000 Day Trader Minimum — https://international.schwab.com/story/sec-approves-scrapping-25000-day-trader-minimum
- Sidley Austin, SEC Proposes Rescission of the Order Protection Rule (June 2026) — https://www.sidley.com/en/insights/newsupdates/2026/06/sec-proposes-rescission-of-the-order-protection-rule
- FlexTrade, SEC's broader Reg NMS overhaul could delay access fee, tick sizes — https://flextrade.com/resources/secs-broader-reg-nms-overhaul-could-delay-access-fee-tick-sizes/
- Proskauer, SEC Withdraws Fourteen Rule Proposals (June 2025) — https://www.proskauer.com/alert/sec-withdraws-fourteen-rule-proposals
- Federal Register 2026-06569 (Rule 605 exemptions; compliance date history) — https://www.govinfo.gov/content/pkg/FR-2026-04-06/pdf/2026-06569.pdf
- RBI press release on ETCD participation (April 2024) — https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=57628
- Patron Accounting, Crypto VDA taxation under Income-tax Act 2025 — https://www.patronaccounting.com/blog/crypto-vda-taxation-income-tax-act-2025-rules
