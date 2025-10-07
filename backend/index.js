const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const fs = require('fs');
const usersFile = path.join(__dirname, 'users.json');

// helper to read/write users
const readUsers = () => {
  try {
    if (!fs.existsSync(usersFile)) return [];
    const txt = fs.readFileSync(usersFile, 'utf8') || '[]';
    return JSON.parse(txt);
  } catch (err) {
    console.error('readUsers error', err);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('writeUsers error', err);
  }
};

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// API Routes
// =========================
app.get('/api/cars', (req, res) => {
  const cars = [
    { id: 1, name: "Toyota Camry", price: 1000, seats: 5, fuel: "เบนซิน", image: "/img/toyota.jpg", desc: "รถสวย นั่งสบาย", features: ["แอร์", "ABS"] },
    { id: 2, name: "Honda Civic", price: 900, seats: 5, fuel: "เบนซิน", image: "/img/honda.jpg", desc: "ประหยัดน้ำมัน", features: ["GPS", "Bluetooth"] },
    { id: 3, name: "Tesla Model 3", price: 2500, seats: 5, fuel: "ไฟฟ้า", image: "/img/tesla.jpg", desc: "รถไฟฟ้า ทันสมัย", features: ["Autopilot", "Touchscreen"] },
  ];
  res.json(cars);
});

app.get('/api', (req, res) => {
  res.send('เช่ารถกับแคทตี้ Backend API พร้อมใช้งาน');
});

// Simple registration endpoint for demo purposes
const crypto = require('crypto');
app.post('/api/register', (req, res) => {
  const { username, email, password, name, phone } = req.body || {};
  if (!username || !email || !password) return res.status(400).json({ success: false, message: 'username, email and password required' });

  const users = readUsers();
  if (users.find(u => u.username === username)) return res.status(400).json({ success: false, message: 'username already exists' });
  if (users.find(u => u.email === email)) return res.status(400).json({ success: false, message: 'email already registered' });

  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const newUser = { id: Date.now(), username, email, passwordHash: hash, name: name || '', phone: phone || '', createdAt: new Date().toISOString() };
  users.push(newUser);
  writeUsers(users);

  res.json({ success: true, message: 'Registered (demo).', userId: newUser.id });
});

// =========================
// Serve React Frontend
// =========================
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

// SPA Fallback: ทุก route ที่ไม่ใช่ /api/... ให้ React handle
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// =========================
// Start Server
// =========================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
