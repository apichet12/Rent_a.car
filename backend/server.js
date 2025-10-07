require('dotenv').config();
const express = require('express'); // <-- ต้องมี
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt'); // สำหรับ hashing password

const app = express(); // <-- ต้องสร้าง app ก่อนใช้
app.use(cors());
app.use(express.json());

// สร้าง connection pool ของ MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ===== Route =====

// ตัวอย่าง route /api/register
app.post('/api/register', async (req, res) => {
  const { username, email, password, name, phone } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบ' });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE username=? OR email=?', [username, email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username หรือ Email มีคนใช้แล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, email, password, name, phone) VALUES (?,?,?,?,?)',
      [username, email, hashedPassword, name || null, phone || null]
    );

    res.json({ success: true, message: 'สมัครสมาชิกสำเร็จ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดใน server' });
  }
});

// ตัวอย่าง route อื่นๆ
app.get('/api/cars', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cars');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'กรุณากรอก username และ password' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    res.json({ success: true, user: { username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดใน server' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

