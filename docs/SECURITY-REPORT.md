# Security and data-integrity report

Generated 2026-11-04. All tests run with the Content-Security-Policy enforced (no bypass), on both builds.

| Suite | Result |
|---|---|
| Security & integrity tests | 20/20 |

## Threat model
A single-user offline app holding personal trading records. Main risks: script injection via imported or typed text (CSV, journal, notes, dataset names, backups), malicious backup files, data leaving the device, spreadsheet formula injection in exports, data loss.

## Controls
| Control | Implementation |
|---|---|
| Output encoding | All user text inserted as DOM text; markdown renderer escapes before formatting; no `eval`/`Function` |
| Content-Security-Policy (PWA) | `script-src 'self'`, `connect-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`; boot code moved out of inline script |
| Content-Security-Policy (standalone) | Single inline script allowed only by its SHA-256 hash; `connect-src 'none'` — the file cannot make any network request |
| Backup integrity | SHA-256 checksum on export; verified on restore (tamper warning); schema/row validation before any write; prototype-pollution keys stripped |
| CSV export | Cells starting with = + - @ prefixed with ' (formula-injection guard) |
| Links | External links `rel="noopener noreferrer"`; `referrer` policy no-referrer |
| Storage | Persistent-storage request; quota errors surfaced to the user |
| Privacy | No analytics, no accounts, no network calls except optional external reading links you click |

## Tests

| ID | Test | Result |
|---|---|---|
| SEC-01-served | Stored XSS: script/event-handler payloads in journal, notes, dataset names, checklists and bookmarks never execute (served) | PASS |
| SEC-02-served | User text is rendered as text, not HTML (no injected <b> element) (served) | PASS |
| SEC-03-served | Content-Security-Policy blocks inline event handlers and injected <script> (served) | PASS |
| SEC-04-served | Served PWA cannot send data to other origins (connect-src self): cross-origin fetch blocked | PASS |
| SEC-05-served | Prototype pollution via backup restore / spec merge is neutralised (served) | PASS |
| SEC-06-served | Backups carry a SHA-256 checksum; a tampered backup is detected; malformed rows and newer schemas are rejected (served) | PASS |
| SEC-07-served | A rejected backup does not wipe existing data (validation happens before any write) (served) | PASS |
| SEC-08-served | Every external link opens with rel=noopener (served) | PASS |
| SEC-09-served | CSV export neutralises spreadsheet formula injection (cells starting = + - @ are prefixed) (served) | PASS |
| SEC-10-served | No CSP violations while rendering stored hostile text during normal use (served) | PASS |
| SEC-01-standalone | Stored XSS: script/event-handler payloads in journal, notes, dataset names, checklists and bookmarks never execute (standalone) | PASS |
| SEC-02-standalone | User text is rendered as text, not HTML (no injected <b> element) (standalone) | PASS |
| SEC-03-standalone | Content-Security-Policy blocks inline event handlers and injected <script> (standalone) | PASS |
| SEC-04-standalone | Standalone build cannot make network requests (connect-src none): fetch to an external URL is blocked | PASS |
| SEC-05-standalone | Prototype pollution via backup restore / spec merge is neutralised (standalone) | PASS |
| SEC-06-standalone | Backups carry a SHA-256 checksum; a tampered backup is detected; malformed rows and newer schemas are rejected (standalone) | PASS |
| SEC-07-standalone | A rejected backup does not wipe existing data (validation happens before any write) (standalone) | PASS |
| SEC-08-standalone | Every external link opens with rel=noopener (standalone) | PASS |
| SEC-09-standalone | CSV export neutralises spreadsheet formula injection (cells starting = + - @ are prefixed) (standalone) | PASS |
| SEC-10-standalone | No CSP violations while rendering stored hostile text during normal use (standalone) | PASS |