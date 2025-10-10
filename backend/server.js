require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());


const path = require('path');
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));


app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendBuildPath, 'index.html'), err => {
    if (err) return next();
  });
});


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '10062549A',
  database: process.env.DB_NAME || 'rentacar',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ===== Routes =====

// --- Register ---
app.post('/api/register', async (req, res) => {
  const { username, email, password, name, phone } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบ' });
  }

  try {
    // check existing username
    const [existing] = await pool.query('SELECT * FROM users WHERE username=?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username มีคนใช้แล้ว' });
    }

    // hash with bcrypt and store in passwordHash column
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, passwordHash, name, role) VALUES (?,?,?,?)',
      [username, hashedPassword, name || null, 'user']
    );

    res.json({ success: true, message: 'สมัครสมาชิกสำเร็จ' });
  } catch (err) {
    console.error('Register error', err && err.message ? err.message : err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดใน server' });
  }
});

// --- Login ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'กรุณากรอก username และ password' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username=?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้' });
    }

    const user = rows[0];
    const stored = user.password || user.passwordHash || '';

    // try bcrypt first
    let match = false;
    try {
      match = await bcrypt.compare(password, stored);
    } catch (e) { match = false; }

    // fallback: if stored looks like sha256 hex (64 chars) compare
    if (!match && stored && typeof stored === 'string' && stored.length === 64) {
      const sha = crypto.createHash('sha256').update(password).digest('hex');
      match = (sha === stored);
    }

    if (!match) {
      return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    res.json({ success: true, user: { username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดใน server' });
  }
});

// --- Cars: GET list ---
app.get('/api/cars', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cars ORDER BY id');
    // parse features JSON if present
    const cars = rows.map(r => ({ ...r, features: r.features ? JSON.parse(r.features) : [] }));
    res.json(cars);
  } catch (err) {
    console.error('GET /api/cars error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- Reviews: GET list ---
app.get('/api/reviews', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reviews ORDER BY createdAt DESC LIMIT 100');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/reviews error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- Reviews: POST new review ---
app.post('/api/reviews', async (req, res) => {
  const { name, comment, rating } = req.body;
  if (!name || !comment) return res.status(400).json({ success: false, message: 'Missing fields' });
  try {
    const [result] = await pool.query('INSERT INTO reviews (name, comment, rating) VALUES (?,?,?)', [name, comment, rating || 5]);
    const [rows] = await pool.query('SELECT * FROM reviews WHERE id=?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /api/reviews error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
