# Phase 2 content audit brief (binding for every auditor)

You are auditing existing content of the Intraday Mastery Academy (offline trading-education app, India first, then US/global). Today is 4 Nov 2026. Read `docs/CONTENT-SPEC.md` first — every rule there still applies (no backticks, no `${`, markdown subset, schema, honesty rules).

## What to do
1. Read the assigned file(s) completely.
2. **Verify every number.** Re-compute every worked example, formula and table with a script (node or python3) — never by eye. Check formulas against `js/engines/*.js` where the app implements them (the engine is tested; if the content disagrees with the engine, the content is wrong unless you can show the engine is wrong — then report it, do not edit engines).
3. Check concepts for accuracy: indicator definitions, TA explanations, entry/exit methods, futures/options mechanics (settlement, exercise style, margin, STT on exercise, assignment), R:R maths, India vs US differences, strategy limitations, fundamentals, psychology.
4. Flag **unsupported claims**: invented statistics, success rates, "this works", studies without a real source, overstated certainty, institutional jargon presented as fact. Fix them (soften, label, or remove).
5. Flag **shallow** treatment and **missing concepts** a professional curriculum would expect for that topic. Fix by adding concise, accurate text to the existing lesson/entry (a new paragraph, table, worked example or a new section `{ h: 'Professional notes', md: ... }`). Do not create new lesson ids.
6. Check **references**: real books/authors/titles, real official sources. Remove or correct anything you cannot confirm exists. Prefer official sources (SEBI, NSE, BSE, RBI, SEC, FINRA, CME, OCC/OIC, exchange rulebooks).
7. Time-sensitive facts must say "as of <month year> — verify on <source>". Verified facts you may rely on are listed in CONTENT-SPEC.md. Do not present anything else as current fact without a source.

## Edit rules
- Edit in place with minimal, surgical changes (Edit tool). Preserve ids, schema and everything that is correct.
- After editing run `node tests/validate-content.js <your file>` → must report 0 errors.
- Do not edit engines, core, modules, tests or other content files.

## Deliverable
Write `docs/audit/<name>.md` with:
- Scope (what you checked, how — e.g. "all 73 numeric examples recomputed in node").
- A findings table: | Item | Issue | Severity (error / misleading / shallow / missing / reference) | Action taken |
- Counts: items checked, errors fixed, claims softened, additions made, references removed/corrected.
- Remaining concerns you could not resolve.
- A statement that this is an AI-assisted review, not an independent expert or regulatory certification.
Reply with a 4-line summary.
