# Audit: psychology.js and library.js

Auditor: AI-assisted review, 4 Nov 2026. Files: `js/content/psychology.js`, `js/content/library.js`.

## Scope and method
- **Psychology:** read all 19 topics, the 24-item self-assessment, its note, and the 42 checklist items. Checked claims against the primary behavioural-finance literature: Kahneman & Tversky (1979, prospect theory; 1974, heuristics; 1971, law of small numbers; Tversky & Kahneman 1992, loss-aversion ratio), Shefrin & Statman (1985, disposition effect), Odean (1998), Barber & Odean (2000, 2001), Nickerson (1998, confirmation bias). These citations are standard and well known to me. I did not fetch the papers here.
- **Numbers:** I recomputed every numeric statement in node (`scratchpad/psych-check.js` plus an inline DP script). That covers the expectancy examples, the 50% drawdown recovery, the "2 × −3R vs 6 × 1R" example, binomial 95% ranges for win rate at n = 20/50/100, and losing-streak probabilities over 100 trades. All original figures were correct. All new figures come from those scripts.
- **Self-assessment scoring:** I simulated an "ideal" respondent through the same scoring logic as `js/modules/misc.js`. Before the fix, that respondent scored 1 on "discipline" and "patience", which reads as *low discipline*, so the result was inverted (see findings).
- **Library:** checked all 20 books for title, author and core description against my knowledge plus web search for the doubtful ones (Passarelli title variants, Shefrin). Checked all 18 resource URLs with WebFetch, or with WebSearch followed by WebFetch of a result link on the same official domain. Checked all 219 glossary terms. I researched the Indian terms on the web (NSE circulars and FAQs, SEBI study coverage, broker and support pages that quote circulars).
- `node tests/validate-content.js` reports 0 errors and 0 warnings for both files. `tests/engines.test.js` shows 121/121 passed (engines untouched).

## Resource URL status
Direct curl from the build environment was blocked by the proxy (403 on CONNECT) for every host. WebFetch has a domain allowlist, so where the bare URL could not be fetched I used WebSearch and fetched a result link on the same official domain.

| Resource | URL in file (after audit) | Status |
|---|---|---|
| SEBI Investor website | https://investor.sebi.gov.in/ | Verified: investor.sebi.gov.in/about.html fetched, "About Us, SEBI Investor", run by SEBI OIAE. Root not fetched directly (allowlist). |
| SEBI | https://www.sebi.gov.in/ | Verified via a fetched SEBI press-release page on www.sebi.gov.in. Root not fetched directly. |
| SEBI SCORES | https://scores.sebi.gov.in/scores-home (was `/`) | Verified: "Scores Home", owned and managed by SEBI. Replaced with the canonical home page. |
| NSE | https://www.nseindia.com/ | Verified directly (NSE home page). |
| BSE | https://www.bseindia.com/ | Verified via a fetched bseindia.com derivatives page run by BSE Ltd. Root not fetched directly. |
| NSE Academy | https://www.nseindia.com/learn/overview-about-nse-academy (was https://www.nseacademy.com/) | **Changed.** NSE's page says the entity is now NAL Academy Limited (formerly NSE Academy Limited). nseacademy.com is now only its NCFM login and testing portal (/ncfm/). The listing points to NSE's official overview page and was renamed. |
| NISM | https://www.nism.ac.in/ | Verified via nism.ac.in/certifications: run by NISM, "public trust established in 2006 by SEBI". |
| RBI | https://www.rbi.org.in/ | Verified via a fetched rbi.org.in page: "Website owned and managed by Reserve Bank of India". |
| SEC Investor.gov | https://www.investor.gov/ | Verified via the fetched Investor.gov page "Margin Rules for Day Trading" (SEC OIEA). |
| SEC | https://www.sec.gov/ | Verified directly ("SEC.gov, Home"). |
| FINRA | https://www.finra.org/investors | Verified directly ("For Investors", FINRA). |
| CME Group Education | https://www.cmegroup.com/education (was …/education.html) | Verified: "Education, CME Group". The canonical URL is /education, so I updated it. |
| Options Industry Council | https://www.optionseducation.org/ | Verified via optionseducation.org/…/about-oic: provided by The Options Clearing Corporation. |
| Federal Reserve | https://www.federalreserve.gov/ | Verified via the fetched FOMC calendars page (Board of Governors). |
| BIS | https://www.bis.org/ | Verified via the fetched bis.org statistics page. |
| CFA Institute | https://www.cfainstitute.org/ | Partially verified: the fetched Research Foundation page is on rpc.cfainstitute.org (CFA Institute Research and Policy Center). Root not fetched; the domain is CFA Institute's. |
| CFTC | https://www.cftc.gov/ | Verified via cftc.gov "Commitments of Traders" page; weekly Friday release confirmed. |
| IOSCO | https://www.iosco.org/ | Verified via the fetched iosco.org/about page (OICV-IOSCO). |

No URL was marked "not verified (unreachable)": every domain was confirmed through at least one fetched page on that official domain. Root pages fetched indirectly are noted as such above.

## Findings

| Item | Issue | Severity | Action taken |
|---|---|---|---|
| Self-assessment: traits "discipline" and "patience" | The scoring inverts these traits. A highly disciplined, patient respondent scored 1/5 on "discipline" and "patience", which the UI shows as a low score. | error | Renamed traits to "discipline gaps" and "impatience" so that higher means "area to work on" on all six traits. Item ids and reverse flags unchanged. |
| Self-assessment note | Said "1 (never) to 5 (always)", but the UI scale is Strongly disagree to Strongly agree. Did not say the tool is unvalidated or norm-free, and did not explain the direction of scores. | misleading | Rewrote the note: reflection tool only, not clinical, diagnostic or validated, no norms, says nothing about mental health or trading success. Correct scale wording, how reverse items work, compare only with yourself and your journal, and a pointer to seek help if trading causes serious distress. |
| Fear: "Losses hurt more than equal gains feel good" | Stated as a universal fact, with no attribution. | misleading | Reworded as a tendency and attributed it to prospect theory. |
| Fear: "Fear often disappears at the right size" | Pop-psychology certainty. | misleading | Softened to "for many traders… test this on yourself". |
| Fear cost | No worked numbers. | shallow | Added an expectancy example (−0.10R at 60% win) and the 66.7% breakeven win rate. Both computed in node. |
| Greed: "activates reward pathways" | Neuroscience claim presented as fact. | misleading | Replaced with a plain description of reinforcement and stated that it is not a neuroscience claim. |
| Greed: "near a mean reversion of results" | Misused term. | misleading | Replaced with regression to the mean, correctly explained. |
| FOMO: "fail because early participants are taking profits" | Unsupported causal claim about other participants. | misleading | Replaced with a structural reason (stop sits inside a normal pullback). |
| Revenge trading: "one of the most common ways…" | Unsupported frequency claim. | misleading | Softened, and pointed to the journal as the evidence that matters. |
| Overtrading: "lunch hour and hours before the US open are typical periods of low participation" | Overstated, and the US-open part is unsupported. | misleading | Replaced with the U-shaped intraday volume pattern and an instruction to check your own instruments. |
| Overtrading | No evidence base. | missing | Added an evidence callout: Barber & Odean (2000), and SEBI's July 2024 intraday study (about 7 in 10 individual intraday traders in equity cash lost money in FY2022-23, with a higher loss share above 500 trades a year), labelled as group findings. Source year and figures confirmed via Business Standard coverage of the SEBI study. |
| Loss aversion: definition | Did not mention the reference point. Conflated loss aversion with the disposition effect. Did not attribute the disposition effect. | error | Added the reference-point framing (Kahneman & Tversky 1979) and the ~2× ratio as an experimental average (Tversky & Kahneman 1992). Separated loss aversion from the disposition effect and attributed the latter to Shefrin & Statman (1985), with its explanation (prospect theory, mental accounting, regret). |
| Loss aversion | No empirical evidence cited. | missing | Added an evidence callout on Odean (1998). Labelled the behaviour as established and the explanation as still debated. |
| Loss aversion cost | No numbers. | shallow | Added expectancy maths: +0.20R planned vs −1.00R distorted, and the 80% breakeven win rate. Computed in node. |
| Anchoring: "The brain uses reference points" | No source. "Market neither knows nor cares" anthropomorphises the market. | shallow | Attributed to Tversky & Kahneman (1974), with the insufficient-adjustment finding. Linked it to the prospect-theory reference point. Reworded the market phrase. |
| Recency bias | No mechanism or source. | shallow | Added the availability heuristic (1974), belief in the law of small numbers (1971), win-rate sampling ranges and losing-streak probabilities, all computed in node. |
| Confirmation bias | Fact without source. | reference | Added an evidence callout citing Nickerson (1998) and labelled the trading cost as an inference. |
| Confidence / overconfidence | Barber & Odean not cited. Self-attribution bias missing. | missing | Added self-attribution, and an evidence callout on Barber & Odean (2000; 2001 "Boys Will Be Boys", QJE), labelled as group evidence. |
| Emotional decisions: "poor sleep and hunger lower your capacity" | Stated as fact. | misleading | Softened to "can make it harder", with a suggestion to log them. |
| Decision fatigue: session hours | "09:15 to 15:30" is incomplete since equity derivatives moved to 15:40 on 3 Aug 2026. | error (time-sensitive) | Updated with "as of Nov 2026, verify on NSE". The existing replication-crisis callout was already good and is kept. |
| Discipline, consistency, process thinking, accepting losses | Douglas, Duke and drawdown maths are correctly attributed. 50% drawdown → 100% recovery recomputed. The "2 × −3R erases 6 × 1R" example checks out. | none | No change. |
| Book: Passarelli | The title in the file is the 2nd edition ("Trading Options Greeks", 2012). The 1st edition (2008) is "Trading Option Greeks". | reference | Added an edition note. Title and author are correct. |
| Book: Kahneman | Replication caveat covered only priming. | shallow | Added ego depletion and noted that the prospect-theory and heuristics work has held up better. |
| Books: other 18 | Titles and authors verified: Murphy, Nison, Douglas ×2, Schwager, Tharp, Bellafiore, Lefèvre, Grimes, Harris, McMillan, Chan, Carver, Natenberg, Steenbarger, Aronson, Taleb, Duke. Descriptions are accurate paraphrases. | none | No change. |
| Books: behavioural finance | No finance-specific behavioural text, even though the brief centres on Shefrin & Statman. | missing | Added Hersh Shefrin, *Beyond Greed and Fear* (verified via OUP listing). |
| Resource: NSE Academy | Entity renamed to NAL Academy; nseacademy.com is now only the NCFM portal. | reference | Renamed, re-described and re-pointed to NSE's official page. |
| Resource: RBI "FX reference rates" | RBI stopped publishing the reference rate; FBIL has done so since July 2018. | error | Corrected. |
| Resource: OIC "exchange-funded" | Its own site says it is provided by OCC. | reference | Corrected. |
| Resource: SCORES, CME | Non-canonical paths. | reference | Updated to the verified canonical pages. Added the "raise with entity first" step to the SCORES description. |
| Glossary: MIS | Missing leverage and peak-margin context; broker naming varies. | shallow | Rewritten. |
| Glossary: CNC | Did not say full payment and T+1 credit. | shallow | Rewritten. |
| Glossary: NRML | Did not mention full SPAN + exposure margin or daily MTM. | shallow | Rewritten. |
| Glossary: SPAN margin | Name not expanded; origin missing. | shallow | Expanded (Standard Portfolio Analysis of Risk, CME origin, scenario revaluation). Web search found no circular replacing SPAN; Nov 2026 NSE circulars still refer to SPAN parameters. |
| Glossary: Peak margin | Mechanism missing (random snapshots, phased to 100% from Sep 2021, penalties). | shallow | Rewritten. |
| Glossary: Exposure margin | Did not say how it is set in India. | shallow | Added: percentage of notional, set by the clearing corporation. |
| Glossary: ASM, GSM, SLB | **Missing** although they are Indian terms a trader meets. | missing | Added from NSE's Aug 2026 ASM FAQ and exchange framework descriptions: LT-ASM I–IV and ST-ASM I–II; GSM stages with trade-for-trade and ASD. Added SLB, with the Indian retail no-overnight-naked-short rule. |
| Glossary: CTT | **Missing.** | missing | Added: 0.01% futures, 0.05% options premium, seller pays, agri exempt, unchanged in Budget 2026 (per Business Today Feb 2026 coverage), with a verify note. |
| Glossary: MWPL, Closing auction session | Missing. Both are needed to understand the updated ban and closing-price entries. | missing | Added. |
| Glossary: F&O ban period | Did not give the 95% / 80% thresholds, used "falls" without saying to what, and did not mention FutEq OI (Oct 2025). | error (outdated) | Rewritten with the 95% entry and 80% exit thresholds, delta-based FutEq, and a verify note. |
| Glossary: Closing price (NSE) | Outdated: CAS sets the close for F&O stocks from 3 Aug 2026 (NSE circular 38/2026 and Aug 2026 coverage). | error (outdated) | Rewritten with "as of Nov 2026". |
| Glossary: T+1 | No history; did not mention optional T+0. | shallow | Added the full move in Jan 2023 and the limited optional T+0 cycle. |
| Glossary: GIFT Nifty | Did not mention NSE IX, USD denomination, ~21 h trading or the July 2023 replacement of SGX Nifty. "Early indicator" stated too strongly. | shallow | Rewritten, adding "not a guarantee". |
| Glossary: India VIX | "Derived from Nifty option prices" was too vague. | shallow | Rewritten: near- and next-month Nifty option order book, 30 calendar days, annualised. |
| Glossary: STT | No rates. | shallow | Added the verified 1 Apr 2026 rates from CONTENT-SPEC, with a verify note. |
| Glossary: Stamp duty | "State-levied" is misleading: uniform national rates are collected centrally since July 2020. | misleading | Corrected and added the rates from CONTENT-SPEC. |
| Glossary: Weekly expiry | Did not state the one-weekly-per-exchange rule or that Bank Nifty is monthly only. | shallow | Rewritten with "as of Nov 2026". |
| Glossary: Pattern day trader | Missing the effective date (4 Jun 2026) and the transition to 20 Oct 2027. | shallow | Added both, as confirmed on Investor.gov. |
| Glossary: Market-wide circuit breaker | No thresholds. | shallow | Added the India 10/15/20% (Nifty or Sensex) and US 7/13/20% (S&P 500) levels, with a verify note. |
| Glossary: Circuit limit | Wrong for F&O stocks, which have no fixed band (dynamic bands instead). | error | Corrected. |
| Glossary: NSE | "Largest by equity derivatives volume" is no longer safe given BSE's growth in options. | misleading | Softened, with a verify note. |
| Glossary: Uptick rule (Rule 201) | Incomplete: missing "above the national best bid" and the rest-of-day-plus-next-day duration. | error | Corrected. |
| Glossary: Wash sale | Missing the before-and-after (61-day) window and basis adjustment. | shallow | Corrected. |
| Glossary: Vega | "One-point" is ambiguous. | shallow | Changed to one percentage point of IV. |
| Glossary: Max pain | The definition was loose. | shallow | Restated precisely (minimum total intrinsic value payable). |
| Glossary: Momentum | The cross-sectional 3–12 month evidence is well established; "mixed" undersold it. | misleading | Distinguished the documented medium-horizon evidence from mixed intraday evidence. |
| Glossary: FII/FPI, Dark pool, Clearing corporation, Market depth, Bracket/Cover order | Outdated naming (FPI since 2014), missing ATS reporting, missing ICCL, 20-depth variation, and brokers withdrawing bracket orders. | shallow | Updated. Broker-specific points are hedged. |
| Glossary: remaining ~185 terms | Order types, derivatives, TA, risk and quant definitions checked; correct. | none | No change. |

## Counts
- Items checked: 19 topics (about 114 fields), 24 self-assessment items plus the note, 42 checklist items, 20 books, 18 resources, 219 glossary terms. Total about 440.
- Errors fixed: 8 (inverted self-assessment traits; loss aversion conflated with the disposition effect; RBI reference rate; session hours; F&O ban; NSE closing price; circuit limit for F&O stocks; Rule 201).
- Claims softened or corrected as misleading: 12.
- Additions: 7 evidence callouts or research paragraphs in psychology, 3 worked numeric examples, 1 book, 7 glossary terms (CTT, MWPL, ASM, GSM, SLB, CAS, plus expansions), and about 30 glossary definitions rewritten or expanded.
- References removed or corrected: 5 resource entries corrected (NSE Academy, RBI, OIC, SCORES URL, CME URL), 1 book edition note. Nothing removed: every book and organisation exists.
- Glossary size: 219 → 225 terms. Books: 20 → 21. Resources: 18 (unchanged).

## Remaining concerns (not resolved, outside my edit scope)
1. **`js/modules/misc.js` (not edited, per the rules):** the result caption says "Higher scores on impulsivity, loss aversion, overconfidence or tilt mark areas to build rules around". After the trait rename, higher means "work on this" for all six traits, so the caption should read "Higher scores on any trait mark areas to build rules around". Self-assessment history saved before this change stores the old labels "discipline" and "patience", whose scores mean the same as the new "discipline gaps" and "impatience". Old and new entries will appear under different names in the history.
2. `docs/STATUS.md` still says 20 books and 219 glossary terms. Now 21 and 225.
3. `docs/CONTENT-SPEC.md` lists "NSE normal market 09:15–15:30 IST". Since 3 Aug 2026, equity derivatives trade until 15:40 and the cash market has a closing auction for F&O stocks. Other auditors relying on the spec may repeat the outdated hours. The spec's "closing session 15:40–16:00" should also be re-checked against the CAS circulars.
4. Exact CAS timings (sources differ slightly: 15:15–15:35 versus a 15:20–15:30 random close), the current MWPL multiple, and GSM stage details come from secondary coverage of NSE circulars, not from the circular texts themselves. I wrote them only at the level of detail the sources agree on, with verify notes.
5. The bare root pages of investor.sebi.gov.in, sebi.gov.in, bseindia.com, nism.ac.in, rbi.org.in, investor.gov, optionseducation.org, federalreserve.gov, bis.org, cfainstitute.org, cftc.gov and iosco.org could not be fetched directly (WebFetch allowlist; curl proxy 403). I verified each through another fetched page on the same official domain.
6. The research citations (journal and year) are standard references I am confident of, but I did not fetch the papers in this session.

## Statement
This is an AI-assisted content review. It is not an independent expert review, a regulatory certification, or legal or tax advice. Time-sensitive facts are marked "as of Nov 2026" and must be re-verified on the named official sources.
