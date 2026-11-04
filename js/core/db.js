/* IndexedDB persistence: key-value store + row collections. Falls back to an
   in-memory store (with a visible warning) if IndexedDB is unavailable. */
(function (root) {
  const IA = (root.IA = root.IA || {});
  const DB_NAME = 'ia-db', VER = 1, SCHEMA = 1;
  let dbp = null, mem = null;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise((res) => {
      try {
        if (!root.indexedDB) throw new Error('no idb');
        const rq = indexedDB.open(DB_NAME, VER);
        rq.onupgradeneeded = () => { const d = rq.result; if (!d.objectStoreNames.contains('kv')) d.createObjectStore('kv'); if (!d.objectStoreNames.contains('rows')) { const s = d.createObjectStore('rows', { keyPath: 'id' }); s.createIndex('coll', 'coll'); } };
        rq.onsuccess = () => res(rq.result);
        rq.onerror = () => { mem = { kv: {}, rows: {} }; res(null); };
        rq.onblocked = () => { mem = { kv: {}, rows: {} }; res(null); };
      } catch (e) { mem = { kv: {}, rows: {} }; res(null); }
    });
    return dbp;
  }
  const tx = (d, store, mode, fn) => new Promise((res, rej) => { const t = d.transaction(store, mode); const s = t.objectStore(store); const out = fn(s); t.oncomplete = () => res(out instanceof IDBRequest ? out.result : out); t.onerror = () => rej(t.error); });
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  async function get(key, def) {
    const d = await open(); if (!d) return key in mem.kv ? structuredClone(mem.kv[key]) : def;
    const v = await tx(d, 'kv', 'readonly', (s) => s.get(key)); return v === undefined ? def : v;
  }
  async function set(key, val) { const d = await open(); if (!d) { mem.kv[key] = structuredClone(val); return; } await tx(d, 'kv', 'readwrite', (s) => s.put(val, key)); }
  async function del(key) { const d = await open(); if (!d) { delete mem.kv[key]; return; } await tx(d, 'kv', 'readwrite', (s) => s.delete(key)); }
  async function rows(coll) {
    const d = await open(); if (!d) return Object.values(mem.rows).filter((r) => r.coll === coll).map((r) => structuredClone(r));
    return tx(d, 'rows', 'readonly', (s) => s.index('coll').getAll(coll));
  }
  async function put(coll, row) {
    const r = { ...row, coll, id: row.id || uid(), updated: Date.now() }; if (!r.created) r.created = r.updated;
    const d = await open(); if (!d) { mem.rows[r.id] = structuredClone(r); return r; }
    await tx(d, 'rows', 'readwrite', (s) => s.put(r)); return r;
  }
  async function remove(id) { const d = await open(); if (!d) { delete mem.rows[id]; return; } await tx(d, 'rows', 'readwrite', (s) => s.delete(id)); }
  async function exportAll() {
    const d = await open(); let kv = {}, rs = [];
    if (!d) { kv = structuredClone(mem.kv); rs = Object.values(mem.rows); }
    else {
      const keys = await tx(d, 'kv', 'readonly', (s) => s.getAllKeys()), vals = await tx(d, 'kv', 'readonly', (s) => s.getAll());
      keys.forEach((k, i) => (kv[k] = vals[i])); rs = await tx(d, 'rows', 'readonly', (s) => s.getAll());
    }
    return { app: 'intraday-mastery-academy', schema: SCHEMA, exported: new Date().toISOString(), kv, rows: rs };
  }
  async function importAll(obj, { replace = true } = {}) {
    if (!obj || obj.app !== 'intraday-mastery-academy') throw new Error('This file is not an Intraday Mastery backup.');
    if (obj.schema > SCHEMA) throw new Error(`Backup schema ${obj.schema} is newer than this app (${SCHEMA}).`);
    if (!Array.isArray(obj.rows) || typeof obj.kv !== 'object') throw new Error('Backup is malformed.');
    const d = await open();
    if (!d) { if (replace) mem = { kv: {}, rows: {} }; Object.assign(mem.kv, obj.kv); obj.rows.forEach((r) => (mem.rows[r.id] = r)); return; }
    if (replace) { await tx(d, 'kv', 'readwrite', (s) => s.clear()); await tx(d, 'rows', 'readwrite', (s) => s.clear()); }
    await tx(d, 'kv', 'readwrite', (s) => { Object.entries(obj.kv).forEach(([k, v]) => s.put(v, k)); });
    await tx(d, 'rows', 'readwrite', (s) => { obj.rows.forEach((r) => s.put(r)); });
  }
  async function wipe() { const d = await open(); if (!d) { mem = { kv: {}, rows: {} }; return; } await tx(d, 'kv', 'readwrite', (s) => s.clear()); await tx(d, 'rows', 'readwrite', (s) => s.clear()); }
  async function persistent() { await open(); return !mem; }
  IA.db = { get, set, del, rows, put, remove, exportAll, importAll, wipe, persistent, uid };
})(typeof window !== 'undefined' ? window : globalThis);
