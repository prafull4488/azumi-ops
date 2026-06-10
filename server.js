require('dotenv').config();
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const DB_FILE = path.join(__dirname, 'db.sqlite');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// serve static frontend (index.html + assets)
app.use(express.static(__dirname));

// Optional Postgres (e.g. Supabase) if DATABASE_URL exists
let usePg = false;
let pool = null;
if (process.env.DATABASE_URL) {
  usePg = true;
  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  // ensure table exists
  (async () => {
    try {
      await pool.query("CREATE TABLE IF NOT EXISTS kv (key text PRIMARY KEY, value jsonb)");
      console.log('Using Postgres (DATABASE_URL) for storage');
    } catch (e) { console.error('Postgres init error', e); }
  })();
}

// init sqlite (fallback)
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) return console.error('DB open error', err);
  db.run(`CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)`);
});

function getState(callback) {
  if (usePg && pool) {
    pool.query("SELECT value FROM kv WHERE key = $1", ['state']).then(r => {
      if (!r.rows[0]) return callback(null, null);
      return callback(null, r.rows[0].value);
    }).catch(err => callback(err));
    return;
  }
  db.get("SELECT value FROM kv WHERE key = 'state'", (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null);
    try { return callback(null, JSON.parse(row.value)); }
    catch (e) { return callback(e); }
  });
}

function setState(obj, callback) {
  if (usePg && pool) {
    const v = obj; // store as JSONB via parameter
    pool.query("INSERT INTO kv(key,value) VALUES($1,$2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", ['state', v])
      .then(() => callback && callback(null))
      .catch(err => callback && callback(err));
    return;
  }
  const v = JSON.stringify(obj);
  db.run("INSERT INTO kv(key,value) VALUES('state',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", v, callback);
}

app.get('/api/ping', (req, res) => res.json({ ok: true }));

app.get('/api/data', (req, res) => {
  getState((err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!data) return res.json({ projects:[], clients:[], moodItems:[], links:[], linkCats: ['Tile Shops','Plumbing & Sanitaryware','Paint Brands','Hardware & Handles','Furniture Vendors','Lighting Suppliers','Wallpaper & Fabric','Contractors','Inspiration'], kitData: {} });
    res.json(data);
  });
});

app.post('/api/data', (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });
  setState(body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`azumi-ops backend listening on http://localhost:${PORT}`));
