// =======================
// Setup & Imports
// =======================
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// MySQL Pool
// =======================
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'carrental',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// =======================
// API Routes
// =======================

// --- DB Debug ---
app.get('/api/debug/db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, db: rows });
  } catch (err) {
    console.error('DB debug error:', err.sqlMessage || err.message || err);
    res.status(500).json({ ok: false, message: 'Database connection failed', error: err.message });
  }
});

// --- Register ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email, name, phone } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'กรุณากรอก username และ password' });
    }

    const [existing] = await pool.query('SELECT * FROM users WHERE username=?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username มีคนใช้แล้ว' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, email, name, phone, passwordHash) VALUES (?, ?, ?, ?, ?)';
    await pool.query(sql, [username, email || null, name || null, phone || null, passwordHash]);

    res.json({ success: true, message: 'สมัครสมาชิกสำเร็จ' });
  } catch (err) {
    console.error('Register error:', err.sqlMessage || err.message || err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// --- Login ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, message: 'กรุณากรอก username และ password' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username=?', [username]);
    if (rows.length === 0)
      return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้' });

    const user = rows[0];
    const stored = user.passwordHash || '';
    let match = false;

    if (stored.startsWith('$2b$') || stored.startsWith('$2a$')) {
      match = await bcrypt.compare(password, stored);
    } else if (stored.length === 64) {
      const sha = crypto.createHash('sha256').update(password).digest('hex');
      match = sha === stored;
    }

    if (!match)
      return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });

    const role = (user.role || 'user').toLowerCase();

    res.json({
      success: true,
      user: {
        username: user.username,
        role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Login error:', err.sqlMessage || err.message || err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดใน server' });
  }
});

// --- Cars List ---
app.get('/api/cars', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cars ORDER BY id');
    const cars = rows.map(r => ({
      ...r,
      features: r.features ? JSON.parse(r.features) : [],
    }));
    res.json(cars);
  } catch (err) {
    console.error('GET /api/cars error:', err.sqlMessage || err.message || err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- Debug Register Test ---
app.get('/api/debug/register-test', (req, res) => {
  res.json({
    ok: true,
    message: 'Register endpoint works (GET test). ใช้ POST สำหรับสมัครจริง',
  });
});

// =======================
// Serve React Frontend
// =======================
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendBuildPath, 'index.html'), err => {
    if (err) return next(err);
  });
});

// --- Admin Add Car ---
app.post('/api/admin/cars', async (req, res) => {
  const { adminUsername, car } = req.body;
  if (!adminUsername || !car)
    return res.status(400).json({ success: false, message: 'ข้อมูลไม่ครบ' });

  try {
    const [users] = await pool.query('SELECT role FROM users WHERE username=?', [adminUsername]);
    if (!users.length || users[0].role !== 'admin') {
      return res.status(403).json({ success: false, message: 'ต้องเป็นผู้ดูแลระบบ' });
    }

    const { name, price, seats, fuel, desc } = car;
    if (!name || !price)
      return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อและราคา' });

    const sql = 'INSERT INTO cars (name, price, seats, fuel, description) VALUES (?, ?, ?, ?, ?)';
    await pool.query(sql, [name, price, seats || 4, fuel || 'เบนซิน', desc || '']);
    res.json({ success: true, message: 'เพิ่มรถสำเร็จ' });
  } catch (err) {
    console.error('POST /api/admin/cars error:', err.sqlMessage || err.message || err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- Admin Delete Car ---
app.delete('/api/admin/cars/:id', async (req, res) => {
  const { adminUsername } = req.body;
  const { id } = req.params;

  if (!adminUsername)
    return res.status(400).json({ success: false, message: 'ต้องระบุผู้ดูแลระบบ' });

  try {
    const [users] = await pool.query('SELECT role FROM users WHERE username=?', [adminUsername]);
    if (!users.length || users[0].role !== 'admin') {
      return res.status(403).json({ success: false, message: 'ต้องเป็นผู้ดูแลระบบ' });
    }

    await pool.query('DELETE FROM cars WHERE id=?', [id]);
    res.json({ success: true, message: 'ลบรถสำเร็จ' });
  } catch (err) {
    console.error('DELETE /api/admin/cars/:id error:', err.sqlMessage || err.message || err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
