require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ===== API =====

// ดึงรถทั้งหมด
app.get('/api/cars', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cars');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// จองรถ
app.post('/api/book/:id', async (req, res) => {
  const carId = req.params.id;
  const { name, phone, date } = req.body;
  try {
    // เช็ค availability
    const [cars] = await pool.query('SELECT * FROM cars WHERE id=?', [carId]);
    if (cars.length === 0) return res.status(404).json({ error: 'Car not found' });
    if (!cars[0].available) return res.status(400).json({ error: 'Car not available' });

    // เพิ่ม booking
    await pool.query('INSERT INTO bookings (car_id, user_name, phone, date) VALUES (?,?,?,?)', [carId, name, phone, date]);

    // อัปเดต availability
    await pool.query('UPDATE cars SET available=0 WHERE id=?', [carId]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
