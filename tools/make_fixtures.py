"""FORMAT FIXTURES for the historical-data importer tests.
Prices are INVENTED by a seeded random walk — these files reproduce real export LAYOUTS
(NSE quote download, NSE bhavcopy, Yahoo, TradingView, broker 1-min) and deliberate defects.
They are NOT market data and must never be presented as such."""
import random, datetime as dt, csv, os
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'tests', 'fixtures'); os.makedirs(OUT, exist_ok=True); os.chdir(OUT)
random.seed(7)
def walk(n, p0, sd):
    out = []; p = p0
    for _ in range(n):
        o = p; c = o * (1 + random.gauss(0, sd)); h = max(o, c) * (1 + abs(random.gauss(0, sd / 2))); l = min(o, c) * (1 - abs(random.gauss(0, sd / 2))); v = random.randint(200000, 900000)
        out.append((round(o, 2), round(h, 2), round(l, 2), round(c, 2), v)); p = c
    return out
days = []; d = dt.date(2026, 9, 1)
while len(days) < 40:
    if d.weekday() < 5 and d != dt.date(2026, 10, 2): days.append(d)   # 2 Oct skipped on purpose (holiday-like gap)
    d += dt.timedelta(1)
# 1. NSE equity quote "historical data" layout (newest first, comma thousands, trailing spaces in headers)
rows = []
for day, (o, h, l, c, v) in zip(days, walk(40, 1450, 0.012)):
    rows.append([day.strftime('%d-%b-%Y').upper(), 'EQ', f'{o:,.2f}', f'{h:,.2f}', f'{l:,.2f}', '0', f'{c + 0.05:,.2f}', f'{c:,.2f}', f'{(o + h + l + c) / 4:,.2f}', '1,600.00', '1,200.00', f'{v:,}', f'{v * c:,.2f}', '45210'])
with open('nse-quote-daily.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['Date ', 'series ', 'OPEN ', 'HIGH ', 'LOW ', 'PREV. CLOSE ', 'ltp ', 'close ', 'vwap ', '52W H ', '52W L ', 'VOLUME ', 'VALUE ', 'No of trades ']); [w.writerow(r) for r in reversed(rows)]
# 2. Yahoo-style US daily
with open('yahoo-us-daily.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['Date', 'Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume'])
    for day, (o, h, l, c, v) in zip(days, walk(40, 190, 0.02)): w.writerow([day.isoformat(), o, h, l, c, round(c * 0.99, 2), v * 10])
# 3. TradingView 5-min NSE, unix-seconds (absolute instants)
b = walk(75 * 3, 25800, 0.0008); i = 0
with open('tradingview-nse-5m.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['time', 'open', 'high', 'low', 'close', 'Volume'])
    for day in days[:3]:
        for k in range(75):
            o, h, l, c, v = b[i]; i += 1
            utc = dt.datetime(day.year, day.month, day.day, 3, 45, tzinfo=dt.timezone.utc) + dt.timedelta(minutes=5 * k)
            w.writerow([int(utc.timestamp()), o, h, l, c, v // 10])
# 4. Broker 1-min IST naive, DD/MM/YYYY
b = walk(375 * 2, 640, 0.0007); i = 0
with open('broker-nse-1m-ist.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['date', 'time', 'open', 'high', 'low', 'close', 'volume'])
    for day in [dt.date(2026, 10, 14), dt.date(2026, 10, 15)]:
        for k in range(375):
            o, h, l, c, v = b[i]; i += 1; t = dt.datetime(2026, 1, 1, 9, 15) + dt.timedelta(minutes=k)
            w.writerow([day.strftime('%d/%m/%Y'), t.strftime('%H:%M'), o, h, l, c, v // 100])
# 5. Defects (5-min NSE, naive IST, ISO)
b = walk(75, 1450, 0.001); lines = []
for k in range(75):
    o, h, l, c, v = b[k]; t = dt.datetime(2026, 10, 14, 9, 15) + dt.timedelta(minutes=5 * k); lines.append([t.strftime('%Y-%m-%d %H:%M'), o, h, l, c, v])
del lines[20:23]                                   # 3 missing candles: 10:55, 11:00, 11:05
lines.insert(10, list(lines[10]))                  # exact duplicate
dup = list(lines[30]); dup[5] = dup[5] + 777; lines.insert(31, dup)   # conflicting duplicate (different volume, valid OHLC)
lines[40][2] = round(lines[40][4] - 5, 2)          # high below close
lines[45][1] = -5                                  # negative open
lines[50][0] = '2026-13-40 10:00'                  # impossible date
lines[55][5] = -100                                # negative volume
lines[60], lines[61] = lines[61], lines[60]        # out of order
lines.append(['2026-10-14 16:05', 1450, 1451, 1449, 1450.5, 100])   # outside session
lines.append(['2026-10-15 09:15', 1700, 1702, 1698, 1701, 5000])    # >15% gap
with open('defects-nse-5m.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['Datetime', 'Open', 'High', 'Low', 'Close', 'Volume']); [w.writerow(r) for r in lines]
# 6. NSE 5-min with naive UTC timestamps (should be flagged when read as IST)
with open('nse-5m-naive-utc.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['Datetime', 'Open', 'High', 'Low', 'Close', 'Volume'])
    for k, (o, h, l, c, v) in enumerate(walk(75, 1450, 0.001)):
        t = dt.datetime(2026, 10, 14, 3, 45) + dt.timedelta(minutes=5 * k); w.writerow([t.strftime('%Y-%m-%d %H:%M'), o, h, l, c, v])
# 7. Bhavcopy-like multi-symbol, multi-series
with open('nse-bhavcopy-multi.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['SYMBOL', 'SERIES', 'OPEN', 'HIGH', 'LOW', 'CLOSE', 'LAST', 'PREVCLOSE', 'TOTTRDQTY', 'TOTTRDVAL', 'TIMESTAMP'])
    for sym, p0 in [('ALPHA', 1000), ('BETA', 250)]:
        for day, (o, h, l, c, v) in zip(days[:10], walk(10, p0, 0.01)):
            w.writerow([sym, 'EQ', o, h, l, c, c, o, v, round(v * c, 2), day.strftime('%d-%b-%Y').upper()])
            if sym == 'ALPHA': w.writerow([sym, 'BL', o, o, o, o, o, o, 100, 100 * o, day.strftime('%d-%b-%Y').upper()])
# 8. US 5-min with ISO offsets across the DST change (2 Nov 2026: EDT→EST)
b = walk(78 * 2, 680, 0.0008); i = 0
with open('us-5m-iso-offset-dst.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    for day, off in [(dt.date(2026, 10, 30), '-04:00'), (dt.date(2026, 11, 2), '-05:00')]:
        for k in range(78):
            o, h, l, c, v = b[i]; i += 1; t = dt.datetime(day.year, day.month, day.day, 9, 30) + dt.timedelta(minutes=5 * k)
            w.writerow([t.strftime('%Y-%m-%dT%H:%M:00') + off, o, h, l, c, v])
print('fixtures:', sorted(os.listdir('.')))
