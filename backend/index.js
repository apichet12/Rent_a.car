const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// initialize DB (async, best-effort)
db.init().catch(err => console.error('DB init error', err));

const fs = require('fs');
const usersFile = path.join(__dirname, 'users.json');

const carsFile = path.join(__dirname, 'cars.json');
const bookingsFile = path.join(__dirname, 'bookings.json');
const notificationsFile = path.join(__dirname, 'notifications.json');

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

const readJSON = (file, fallback = []) => {
  try {
    if (!fs.existsSync(file)) return fallback;
    const txt = fs.readFileSync(file, 'utf8') || '[]';
    return JSON.parse(txt);
  } catch (err) {
    console.error('readJSON error', file, err);
    return fallback;
  }
};

const writeJSON = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('writeJSON error', file, err);
  }
};

// helpers for domain data
const readCars = () => readJSON(carsFile, []);
const writeCars = (arr) => writeJSON(carsFile, arr);
const readBookings = () => readJSON(bookingsFile, []);
const writeBookings = (arr) => writeJSON(bookingsFile, arr);
const readNotifications = () => readJSON(notificationsFile, []);
const writeNotifications = (arr) => writeJSON(notificationsFile, arr);

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// API Routes
// =========================
app.get('/api/cars', async (req, res) => {
  if (db.isReady()) {
    try {
      const rows = await db.getCars();
      return res.json(rows);
    } catch (e) {
      console.error('db.getCars error', e);
    }
  }
  const cars = readCars();
  res.json(cars);
});

// Admin: add a car (expects body { adminUsername, car: { name, price, seats, fuel, image, desc, features } })
app.post('/api/admin/cars', (req, res) => {
  const { adminUsername, car } = req.body || {};
  if (!adminUsername) return res.status(400).json({ success: false, message: 'ต้องระบุ adminUsername' });

  const users = readUsers();
  const admin = users.find(u => u.username === adminUsername);
  if (!admin || admin.role !== 'admin') return res.status(403).json({ success: false, message: 'ต้องเป็นผู้ดูแลระบบ' });

  if (!car || !car.name) return res.status(400).json({ success: false, message: 'ข้อมูลรถไม่ถูกต้อง' });
  // If DB available, persist there
  if (db.isReady()) {
    (async () => {
      try {
        const added = await db.addCar(car);
        await db.addNotification({ type: 'car-added', message: `เพิ่มรถใหม่: ${car.name}`, time: new Date().toISOString() });
        return res.json({ success: true, car: added });
      } catch (e) {
        console.error('db.addCar error', e);
        return res.status(500).json({ success: false, message: 'DB error' });
      }
    })();
    return;
  }

  const cars = readCars();
  const id = cars.length ? Math.max(...cars.map(c => c.id)) + 1 : 1;
  const newCar = { id, ...car };
  cars.push(newCar);
  writeCars(cars);

  // notification to admin area (info)
  const notifications = readNotifications();
  notifications.push({ id: Date.now(), type: 'car-added', message: `เพิ่มรถใหม่: ${newCar.name}`, time: new Date().toISOString() });
  writeNotifications(notifications);

  res.json({ success: true, car: newCar });
});

// Admin: delete car
app.delete('/api/admin/cars/:id', (req, res) => {
  const { id } = req.params;
  const { adminUsername } = req.body || {};
  if (!adminUsername) return res.status(400).json({ success: false, message: 'ต้องระบุ adminUsername' });

  const users = readUsers();
  const admin = users.find(u => u.username === adminUsername);
  if (!admin || admin.role !== 'admin') return res.status(403).json({ success: false, message: 'ต้องเป็นผู้ดูแลระบบ' });

  if (db.isReady()) {
    (async () => {
      try {
        await db.removeCar(id);
        await db.addNotification({ type: 'car-removed', message: `ลบรถ id=${id}`, time: new Date().toISOString() });
        return res.json({ success: true });
      } catch (e) {
        console.error('db.removeCar error', e);
        return res.status(500).json({ success: false, message: 'DB error' });
      }
    })();
    return;
  }

  let cars = readCars();
  const before = cars.length;
  cars = cars.filter(c => String(c.id) !== String(id));
  writeCars(cars);
  if (cars.length === before) return res.status(404).json({ success: false, message: 'ไม่พบรถ' });

  const notifications = readNotifications();
  notifications.push({ id: Date.now(), type: 'car-removed', message: `ลบรถ id=${id}`, time: new Date().toISOString() });
  writeNotifications(notifications);

  res.json({ success: true });
});

// Register (DB preferred, fallback to JSON users)
app.post('/api/register', async (req, res) => {
  const { username, email, password, name, phone } = req.body || {};
  if (!username || !email || !password) return res.status(400).json({ success: false, message: 'username, email and password are required' });

  if (db.isReady()) {
    try {
      const existing = await db.query('SELECT * FROM users WHERE username=? OR email=?', [username, email]);
      if (existing.length > 0) return res.status(400).json({ success: false, message: 'Username or Email already exists' });
      const hash = await bcrypt.hash(password, 10);
      const u = await db.createUser({ username, email, passwordHash: hash, name, phone });
      return res.json({ success: true, message: 'Registered', user: u });
    } catch (e) {
      console.error('register db error', e);
      return res.status(500).json({ success: false, message: 'DB error' });
    }
  }

  // fallback to file-based users
  const users = readUsers();
  if (users.find(u => u.username === username || u.email === email)) return res.status(400).json({ success: false, message: 'Username or Email already exists' });
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id, username, email, passwordHash: hash, name, phone, role: 'user' };
  users.push(newUser);
  writeUsers(users);
  res.json({ success: true, message: 'Registered (fallback)', user: { id: newUser.id, username: newUser.username } });
});

// Create booking (customer)
app.post('/api/bookings', (req, res) => {
  const { username, carId, startDate, endDate, total } = req.body || {};
  if (!username || !carId || !startDate || !endDate) return res.status(400).json({ success: false, message: 'ข้อมูลการจองไม่ครบ' });

  const bookings = readBookings();
  const id = bookings.length ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
  const booking = { id, username, carId, startDate, endDate, total: total || 0, status: 'pending', createdAt: new Date().toISOString() };
  bookings.push(booking);
  writeBookings(bookings);

  // notify admin about new booking
  const notifications = readNotifications();
  notifications.push({ id: Date.now(), type: 'new-booking', message: `มีการจองใหม่ โดย ${username} สำหรับรถ id=${carId}`, time: new Date().toISOString(), bookingId: id });
  writeNotifications(notifications);

  // schedule a simple reminder to customer 24h before endDate (best-effort in-memory timer)
  try {
    const end = new Date(endDate);
    const remindAt = new Date(end.getTime() - 24 * 60 * 60 * 1000);
    const delay = Math.max(0, remindAt.getTime() - Date.now());
    if (delay > 0 && delay < 1000 * 60 * 60 * 24 * 30) { // only schedule reasonable timers
      setTimeout(() => {
        const notes = readNotifications();
        notes.push({ id: Date.now(), type: 'rental-ending-soon', message: `เตือน: การเช่าของ ${username} สำหรับ booking=${id} จะหมดใน 24 ชั่วโมง`, time: new Date().toISOString(), username });
        writeNotifications(notes);
      }, delay);
    }
  } catch (e) {
    console.error('schedule reminder error', e);
  }

  res.json({ success: true, booking });
});

// Mark booking as paid (simulate payment callback)
app.post('/api/bookings/:id/pay', (req, res) => {
  const { id } = req.params;
  const { username } = req.body || {}; // who paid
  const bookings = readBookings();
  const booking = bookings.find(b => String(b.id) === String(id));
  if (!booking) return res.status(404).json({ success: false, message: 'ไม่พบ booking' });
  booking.status = 'paid';
  booking.paidAt = new Date().toISOString();
  writeBookings(bookings);

  const notifications = readNotifications();
  notifications.push({ id: Date.now(), type: 'payment', message: `ลูกค้า ${username || booking.username} ชำระเงินเรียบร้อยสำหรับ booking=${id}`, time: new Date().toISOString(), bookingId: id });
  writeNotifications(notifications);

  res.json({ success: true, booking });
});

// Get notifications (admin or user can filter)
app.get('/api/notifications', (req, res) => {
  const { forUser } = req.query; // optional filter
  let notes = readNotifications();
  if (forUser) notes = notes.filter(n => n.username === forUser || !n.username);
  res.json(notes);
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
  (async () => {
    if (db.isReady()) {
      try {
        const rows = await db.query('SELECT * FROM users WHERE username=?', [username]);
        if (rows.length === 0) return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้' });
        const user = rows[0];
        const match = await bcrypt.compare(password, user.passwordHash || user.password);
        if (!match) return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
        return res.json({ success: true, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
      } catch (e) {
        console.error('login db error', e);
        return res.status(500).json({ success: false, message: 'DB error' });
      }
    }

    // fallback to file users
    const users = readUsers();
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้' });
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    if (hash !== user.passwordHash) return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    return res.json({ success: true, user: { id: user.id, username: user.username, name: user.name } });
  })();
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


// (duplicate login handler removed - consolidated above)
