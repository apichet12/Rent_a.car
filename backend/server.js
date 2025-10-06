require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');  // ใช้ PostgreSQL
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log("DB connected ✅"))
  .catch(err => console.error("DB error:", err));

// ===== API =====
app.get('/api/cars', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cars');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/cars/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM cars WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Car not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username=$1 AND password=$2',
      [username, password]
    );
    if (result.rows.length > 0) res.json({ success: true, user: result.rows[0] });
    else res.json({ success: false, message: 'Username or password incorrect' });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// ===== Serve React build =====
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
