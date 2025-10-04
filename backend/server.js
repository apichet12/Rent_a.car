// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // ถ้าไม่มี password ให้ใส่ '' 
  password: '',         // root ของ XAMPP
  database: 'carrental'
});

db.connect(err => {
  if(err) console.log('DB error', err);
  else console.log('DB connected');
});

// Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username=? AND password=?', [username, password], (err, results) => {
    if(err) return res.status(500).json({ error: 'DB error' });
    if(results.length > 0) res.json({ success: true, user: results[0] });
    else res.json({ success: false, message: 'Username or password incorrect' });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
