# Install and use — Intraday Mastery Academy

## Fastest: the single file (laptop or phone)
1. Get `intraday-academy-standalone.html` (also inside `intraday-mastery-final.zip`).
2. **Laptop (Windows/Mac/Linux):** double-click it — it opens in your browser (Chrome or Edge recommended). Bookmark it.
3. **Android:** save it to Downloads → open the Files app → tap the file → choose **Chrome**.
4. **iPhone/iPad:** save it to the Files app → tap it → Share → **Open in Safari** (or use a file viewer that opens HTML in Safari). Behaviour on iOS was not tested on a real device — see `docs/MOBILE-OFFLINE-REPORT.md`.
5. It works fully offline. Your progress is stored in that browser on that device.

## Best on phone: install as an app (PWA)
The `pwa/` folder in the ZIP is a static website. Host it on any HTTPS static host (for example GitHub Pages, Netlify, AWS S3 + CloudFront):
1. Upload the **contents** of `pwa/` (index.html, sw.js, manifest.webmanifest, css/, js/, icons/).
2. Open the URL once while online.
3. **Android Chrome:** menu ⋮ → **Install app** (or "Add to Home screen"). **iPhone Safari:** Share → **Add to Home Screen**.
4. After the first load it works with no internet.

For a quick test on your own laptop: open a terminal in the `pwa` folder and run `python -m http.server 8000`, then visit http://localhost:8000.

## Phone and laptop together
Each browser keeps its own data. To move progress: **Settings & Data → Download full backup** on one device, send the file to the other device, then **Restore from backup** there. Restore replaces that device's data, so restore onto the device that is behind.

## Your own market data
**Historical Data** (in the menu) imports CSV files from NSE/BSE downloads, bhavcopies, broker exports, TradingView or Yahoo-style files. Every import gets a validation report. Imported data is labelled HISTORICAL; generated data is SYNTHETIC. There is no live or delayed data in this app.

## New in v2.1
- **Options paper trading:** Trading Simulator → Options paper. Tap B or S in the chain, set lots, place the order, then advance time. Positions settle automatically at the weekly expiry.
- **Spaced review:** questions you miss come back on the Review page (link on the Dashboard and Assessments).
- **Journal coach:** Trading Journal → Coach, after you have logged trades.

## Laptop shortcuts (Chart replay)
→ or N: next bar · Shift+→: six bars · Space: play/pause · B: buy · S: sell · X: close position.
