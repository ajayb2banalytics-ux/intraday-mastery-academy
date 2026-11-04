/* Boot (kept out of index.html so the Content-Security-Policy can forbid inline scripts). */
IA.VERSION = '2.1.0';
IA.start();
if (IA.db && IA.db.requestPersist) IA.db.requestPersist();
