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

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'กรุณากรอก username และ password' });
  }

  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้' });
  }

  
  const hash = crypto.createHash('sha256').update(password).digest('hex');

  if (hash !== user.passwordHash) {
    return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
  }

  // Login สำเร็จ
  res.json({
    success: true,
    user: { id: user.id, username: user.username, name: user.name }
  });
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


app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ success: false, message: 'username และ password ต้องระบุ' });

  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้' });

  const hash = crypto.createHash('sha256').update(password).digest('hex');
  if (hash !== user.passwordHash)
    return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });

  res.json({ success: true, user: { username: user.username, name: user.name, id: user.id } });
});
