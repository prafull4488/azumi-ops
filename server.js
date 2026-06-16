// server.js
// Azumi Designs - App Server
// Run with: node server.js  (or: npm start)

const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'azumi-designs-change-this-secret-in-production';
const DB_FILE = path.join(__dirname, 'azumi.db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
// DATABASE SETUP
// ---------------------------------------------------------------------------
const db = new Database(DB_FILE);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS scope_sheet (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'Pending',
  notes TEXT,
  created_by INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact TEXT,
  project TEXT,
  notes TEXT,
  created_by INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  notes TEXT,
  created_by INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
`);

// Seed an initial admin account if no users exist yet
const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
if (userCount === 0) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)')
    .run('admin', hash, 'admin');
  console.log('Seeded default admin account -> username: admin / password: admin123');
  console.log('IMPORTANT: change this password after first login!');
}

// ---------------------------------------------------------------------------
// AUTH HELPERS / MIDDLEWARE
// ---------------------------------------------------------------------------
function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// ---------------------------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------------------------

// Signup. First account ever becomes admin automatically (handled by seed above
// for the very first run); subsequent signups default to 'member'.
// Admins can be promoted later directly via the admin user-management endpoint.
app.post('/api/auth/signup', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  // Only allow 'admin' role at signup if explicitly requested AND no admin exists yet.
  // Otherwise force role to 'member' for safety.
  let finalRole = 'member';
  if (role === 'admin') {
    const adminExists = db.prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'admin'").get().c;
    if (adminExists === 0) finalRole = 'admin';
  }

  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)')
    .run(username, hash, finalRole);

  const user = { id: info.lastInsertRowid, username, role: finalRole };
  const token = signToken(user);
  res.json({ token, user });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!row || !bcrypt.compareSync(password, row.password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const user = { id: row.id, username: row.username, role: row.role };
  const token = signToken(user);
  res.json({ token, user });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ---------------------------------------------------------------------------
// USER MANAGEMENT (admin only) - optional helper to promote/list users
// ---------------------------------------------------------------------------
app.get('/api/users', authMiddleware, requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT id, username, role, created_at FROM users').all();
  res.json(rows);
});

app.patch('/api/users/:id/role', authMiddleware, requireAdmin, (req, res) => {
  const { role } = req.body;
  if (!['admin', 'member'].includes(role)) {
    return res.status(400).json({ error: "Role must be 'admin' or 'member'" });
  }
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// SCOPE SHEET CRUD  (read: any logged-in user, write: any logged-in user)
// ---------------------------------------------------------------------------
app.get('/api/scope', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM scope_sheet ORDER BY id DESC').all();
  res.json(rows);
});

app.post('/api/scope', authMiddleware, (req, res) => {
  const { item, category, status, notes } = req.body;
  if (!item) return res.status(400).json({ error: 'Item is required' });
  const info = db.prepare(
    'INSERT INTO scope_sheet (item, category, status, notes, created_by) VALUES (?, ?, ?, ?, ?)'
  ).run(item, category || '', status || 'Pending', notes || '', req.user.id);
  const row = db.prepare('SELECT * FROM scope_sheet WHERE id = ?').get(info.lastInsertRowid);
  res.json(row);
});

app.put('/api/scope/:id', authMiddleware, (req, res) => {
  const { item, category, status, notes } = req.body;
  const existing = db.prepare('SELECT * FROM scope_sheet WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE scope_sheet SET item=?, category=?, status=?, notes=? WHERE id=?')
    .run(
      item ?? existing.item,
      category ?? existing.category,
      status ?? existing.status,
      notes ?? existing.notes,
      req.params.id
    );
  const row = db.prepare('SELECT * FROM scope_sheet WHERE id = ?').get(req.params.id);
  res.json(row);
});

app.delete('/api/scope/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT * FROM scope_sheet WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  // Members may delete only their own rows; admins can delete any.
  if (req.user.role !== 'admin' && existing.created_by !== req.user.id) {
    return res.status(403).json({ error: 'Not permitted to delete this item' });
  }
  db.prepare('DELETE FROM scope_sheet WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// CLIENTS CRUD
// ---------------------------------------------------------------------------
app.get('/api/clients', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM clients ORDER BY id DESC').all();
  res.json(rows);
});

app.post('/api/clients', authMiddleware, (req, res) => {
  const { name, contact, project, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const info = db.prepare(
    'INSERT INTO clients (name, contact, project, notes, created_by) VALUES (?, ?, ?, ?, ?)'
  ).run(name, contact || '', project || '', notes || '', req.user.id);
  const row = db.prepare('SELECT * FROM clients WHERE id = ?').get(info.lastInsertRowid);
  res.json(row);
});

app.put('/api/clients/:id', authMiddleware, (req, res) => {
  const { name, contact, project, notes } = req.body;
  const existing = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE clients SET name=?, contact=?, project=?, notes=? WHERE id=?')
    .run(
      name ?? existing.name,
      contact ?? existing.contact,
      project ?? existing.project,
      notes ?? existing.notes,
      req.params.id
    );
  const row = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  res.json(row);
});

app.delete('/api/clients/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  if (req.user.role !== 'admin' && existing.created_by !== req.user.id) {
    return res.status(403).json({ error: 'Not permitted to delete this item' });
  }
  db.prepare('DELETE FROM clients WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// LINKS CRUD
// ---------------------------------------------------------------------------
app.get('/api/links', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM links ORDER BY id DESC').all();
  res.json(rows);
});

app.post('/api/links', authMiddleware, (req, res) => {
  const { title, url, notes } = req.body;
  if (!title || !url) return res.status(400).json({ error: 'Title and URL are required' });
  const info = db.prepare(
    'INSERT INTO links (title, url, notes, created_by) VALUES (?, ?, ?, ?)'
  ).run(title, url, notes || '', req.user.id);
  const row = db.prepare('SELECT * FROM links WHERE id = ?').get(info.lastInsertRowid);
  res.json(row);
});

app.put('/api/links/:id', authMiddleware, (req, res) => {
  const { title, url, notes } = req.body;
  const existing = db.prepare('SELECT * FROM links WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE links SET title=?, url=?, notes=? WHERE id=?')
    .run(
      title ?? existing.title,
      url ?? existing.url,
      notes ?? existing.notes,
      req.params.id
    );
  const row = db.prepare('SELECT * FROM links WHERE id = ?').get(req.params.id);
  res.json(row);
});

app.delete('/api/links/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT * FROM links WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  if (req.user.role !== 'admin' && existing.created_by !== req.user.id) {
    return res.status(403).json({ error: 'Not permitted to delete this item' });
  }
  db.prepare('DELETE FROM links WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// FALLBACK -> serve frontend
// ---------------------------------------------------------------------------
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\nAzumi Designs app running!`);
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Network: http://<your-device-ip>:${PORT}`);
  console.log(`\nDefault admin login (if first run): admin / admin123\n`);
});
