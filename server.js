const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 3000;

let pool = null;
if(process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  console.log('Using DATABASE_URL for Postgres');
} else {
  console.warn('No DATABASE_URL found — server will run but persistence will be disabled');
}

async function getState() {
  if(!pool) return null;
  const res = await pool.query('SELECT value FROM kv WHERE key=$1 LIMIT 1', ['state']);
  if(res.rows.length===0) return null;
  return res.rows[0].value;
}

async function setState(obj) {
  if(!pool) throw new Error('no database');
  // upsert into kv (assumes table kv(key text primary key, value jsonb))
  await pool.query(
    'INSERT INTO kv(key,value) VALUES($1,$2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
    ['state', obj]
  );
}

app.get('/api/ping', (req, res) => res.json({ ok: true }));

app.get('/api/data', async (req, res) => {
  try {
    const s = await getState();
    if(!s) return res.status(204).json(null);
    res.json(s);
  } catch(err) {
    console.error(err); res.status(500).json({ error: err.message });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    if(!pool) return res.status(503).json({ error: 'no database configured' });
    const obj = req.body;
    await setState(obj);
    res.json({ ok: true });
  } catch(err) {
    console.error(err); res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, ()=>console.log('Server listening on', PORT));
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
