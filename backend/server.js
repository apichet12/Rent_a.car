require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'carrental'
});

db.connect(err => {
  if (err) console.log('DB error', err);
  else console.log('DB connected');
});

// ===== API =====

// Get all cars
app.get('/api/cars', (req, res) => {
  db.query('SELECT * FROM cars', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

// Get car by ID
app.get('/api/cars/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM cars WHERE id=?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(404).json({ message: 'Car not found' });
    res.json(results[0]);
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username=? AND password=?', [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length > 0) res.json({ success: true, user: results[0] });
    else res.json({ success: false, message: 'Username or password incorrect' });
  });
});

// ===== Serve React build =====
app.use(express.static(path.join(__dirname, 'build')));

// All other routes => React SPA
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
