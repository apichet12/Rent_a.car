require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const path = require('path');

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
  queueLimit: 0
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

    // ตรวจสอบ username ซ้ำ
    const [existing] = await pool.query('SELECT * FROM users WHERE username=?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username มีคนใช้แล้ว' });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // insert ลงฐานข้อมูล
    const sql = 'INSERT INTO users (username, email, name, phone, passwordHash) VALUES (?, ?, ?, ?, ?)';
    await pool.query(sql, [username, email || null, name || null, phone || null, passwordHash]);

    res.json({ success: true, message: 'สมัครสมาชิกสำเร็จ' });
  } catch (err) {
    console.error('Register error:', err);
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
    const stored = user.password || user.passwordHash || '';

    // ตรวจสอบรหัสผ่าน
    let match = await bcrypt.compare(password, stored);
    if (!match && stored.length === 64) {
      const sha = crypto.createHash('sha256').update(password).digest('hex');
      match = sha === stored;
    }

    if (!match)
      return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });

    // ✅ แปลง role เป็น lowercase ก่อนส่ง
    const role = (user.role || 'user').toLowerCase();

    res.json({
      success: true,
      user: {
        username: user.username,
        role,      // <<< สำคัญมาก สำหรับ frontend ตรวจสอบ isAdmin()
        name: user.name
      }
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
      features: r.features ? JSON.parse(r.features) : []
    }));
    res.json(cars);
  } catch (err) {
    console.error('GET /api/cars error:', err.sqlMessage || err.message || err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- Debug GET สำหรับทดสอบ Register ---
app.get('/api/debug/register-test', (req, res) => {
  res.json({
    ok: true,
    message: 'Register endpoint works (GET test). ใช้ POST สำหรับสมัครจริง'
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

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
