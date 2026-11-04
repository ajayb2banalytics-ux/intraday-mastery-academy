# Mobile, laptop and offline compatibility report

Generated 2026-11-04.

## What could and could not be tested
| Target | Status | How |
|---|---|---|
| Google Chrome (desktop, headless) | **Tested** | Every suite runs in Chrome |
| Laptop 1366×768 and desktop 1920×1080 | **Tested** | Layout, sidebar, keyboard focus, replay shortcuts, axe-core |
| Android phone (Pixel 7 viewport) | **Emulated** | Chromium mobile emulation: viewport, DPR 2.6, touch, Android UA. Not a physical device. |
| iPhone 14 viewport | **Emulated (Chromium, not Safari)** | Viewport/UA/touch only — WebKit rendering and Safari storage rules NOT exercised |
| iOS Safari / WebKit | **Not tested** | WebKit could not be downloaded here; no Apple device |
| Firefox | **Not tested** | Firefox download host blocked here |
| PWA install prompt UI | **Partly** | Chrome installability API reports the app installable with an active service worker; the prompt itself needs a real device |
| Screen readers | **Not tested** | Automated WCAG rules only |

## Results
| Check | Result |
|---|---|
| Android phone (Pixel 7 emulation): 41 routes — horizontal overflow | none |
| iPhone 14 viewport (Chromium emulation, not Safari): 41 routes — horizontal overflow | none |
| Small phone 360×740: 41 routes — horizontal overflow | none |
| Tablet 820×1180: 41 routes — horizontal overflow | none |
| Laptop 1366×768: 41 routes — horizontal overflow | none |
| Desktop 1920×1080: 41 routes — horizontal overflow | none |
| Navigation correct per screen size (bottom bar/drawer on phones, sidebar on laptops) | pass |
| Touch tap on chart graded (Android emulation) | pass |
| Keyboard focus visible / replay shortcuts | 12/12 focus steps visible; shortcuts work |
| axe-core WCAG 2.1 A/AA violations (16 routes × phone + laptop) | 0 |
| Chrome installability (manifest, icons, SW) | installable, service worker active |
| Data survives full browser restart | pass |
| Offline reload with network disabled (hosted PWA) | pass |
| Standalone file makes no network requests (CSP connect-src none) | pass |
| Backup → wipe → restore | pass |

## Accessibility fixes made in Phase 2
- Text contrast raised (muted/dim tokens), primary button darkened to ≥ 4.5:1.
- "More" button accessible name matches its visible label.
- Automatic accessible names for every form control (label, column header, placeholder); scrollable tables keyboard-focusable.
- Visible `:focus-visible` ring; 24 px checkboxes.

## Recommended manual checks on your devices
1. iPhone: open the standalone file in Safari; complete one lesson; reload; confirm progress kept. Then Add to Home Screen from the hosted PWA and repeat offline (Airplane mode).
2. Android: same steps in Chrome.
3. Laptop: Settings → Download full backup, restore on the phone.