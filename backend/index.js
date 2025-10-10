const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const pool = require('./db');
const crypto = require('crypto');

// DB helpers (simple)
const readUsers = async () => {
  const [rows] = await pool.query('SELECT id, username, passwordHash, name, role FROM users');
  return rows;
};

const findUserByUsername = async (username) => {
  const [rows] = await pool.query('SELECT id, username, passwordHash, name, role FROM users WHERE username = ?', [username]);
  return rows[0];
};

const getCars = async () => {
  const [rows] = await pool.query('SELECT id, name, price, image, year, seats, fuel, description, features FROM cars ORDER BY id ASC');
  return rows.map(r => ({ ...r, features: r.features ? JSON.parse(r.features) : [] }));
};

const addCar = async (car) => {
  const features = car.features ? JSON.stringify(car.features) : null;
  const [result] = await pool.query('INSERT INTO cars (name, price, image, year, seats, fuel, description, features) VALUES (?,?,?,?,?,?,?,?)', [car.name, car.price || 0, car.image || car.img || null, car.year || null, car.seats || null, car.fuel || null, car.description || car.desc || null, features]);
  const [rows] = await pool.query('SELECT id, name, price, image, year, seats, fuel, description, features FROM cars WHERE id = ?', [result.insertId]);
  const r = rows[0]; r.features = r.features ? JSON.parse(r.features) : [];
  return r;
};

const removeCar = async (id) => {
  const [result] = await pool.query('DELETE FROM cars WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

const getBookings = async () => {
  const [rows] = await pool.query('SELECT * FROM bookings ORDER BY id ASC');
  return rows;
};

const addBooking = async (b) => {
  const [res] = await pool.query('INSERT INTO bookings (username, carId, startDate, endDate, total, status) VALUES (?,?,?,?,?,?)', [b.username, b.carId, b.startDate, b.endDate, b.total || 0, b.status || 'pending']);
  const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [res.insertId]);
  return rows[0];
};

const updateBookingPaid = async (id) => {
  await pool.query('UPDATE bookings SET status = ?, paidAt = ? WHERE id = ?', ['paid', new Date(), id]);
  const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
  return rows[0];
};

const getNotifications = async (forUser) => {
  if (forUser) {
    const [rows] = await pool.query('SELECT * FROM notifications WHERE username = ? OR username IS NULL ORDER BY id DESC', [forUser]);
    return rows;
  }
  const [rows] = await pool.query('SELECT * FROM notifications ORDER BY id DESC');
  return rows;
};

const addNotification = async (note) => {
  const [res] = await pool.query('INSERT INTO notifications (type, message, time, username, bookingId) VALUES (?,?,?,?,?)', [note.type, note.message, note.time || new Date(), note.username || null, note.bookingId || null]);
  const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ?', [res.insertId]);
  return rows[0];
};

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// API Routes
// =========================
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await getCars();
    res.json(cars);
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'DB error' }); }
});

// Admin: add a car (expects body { adminUsername, car: { name, price, seats, fuel, image, desc, features } })
app.post('/api/admin/cars', async (req, res) => {
  const { adminUsername, car } = req.body || {};
  if (!adminUsername) return res.status(400).json({ success: false, message: 'ต้องระบุ adminUsername' });
  try {
    const admin = await findUserByUsername(adminUsername);
    if (!admin || admin.role !== 'admin') return res.status(403).json({ success: false, message: 'ต้องเป็นผู้ดูแลระบบ' });
    if (!car || !car.name) return res.status(400).json({ success: false, message: 'ข้อมูลรถไม่ถูกต้อง' });
    const newCar = await addCar(car);
    await addNotification({ type: 'car-added', message: `เพิ่มรถใหม่: ${newCar.name}` });
    res.json({ success: true, car: newCar });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'DB error' }); }
});

// Admin: delete car
app.delete('/api/admin/cars/:id', async (req, res) => {
  const { id } = req.params;
  const { adminUsername } = req.body || {};
  if (!adminUsername) return res.status(400).json({ success: false, message: 'ต้องระบุ adminUsername' });
  try {
    const admin = await findUserByUsername(adminUsername);
    if (!admin || admin.role !== 'admin') return res.status(403).json({ success: false, message: 'ต้องเป็นผู้ดูแลระบบ' });
    const ok = await removeCar(id);
    if (!ok) return res.status(404).json({ success: false, message: 'ไม่พบรถ' });
    await addNotification({ type: 'car-removed', message: `ลบรถ id=${id}` });
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'DB error' }); }
});

// Create booking (customer)
app.post('/api/bookings', async (req, res) => {
  const { username, carId, startDate, endDate, total } = req.body || {};
  if (!username || !carId || !startDate || !endDate) return res.status(400).json({ success: false, message: 'ข้อมูลการจองไม่ครบ' });
  try {
    const booking = await addBooking({ username, carId, startDate, endDate, total });
    await addNotification({ type: 'new-booking', message: `มีการจองใหม่ โดย ${username} สำหรับรถ id=${carId}`, bookingId: booking.id });

    // schedule in-memory reminder (best-effort)
    try {
      const end = new Date(endDate);
      const remindAt = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      const delay = Math.max(0, remindAt.getTime() - Date.now());
      if (delay > 0 && delay < 1000 * 60 * 60 * 24 * 30) {
        setTimeout(async () => {
          await addNotification({ type: 'rental-ending-soon', message: `เตือน: การเช่าของ ${username} สำหรับ booking=${booking.id} จะหมดใน 24 ชั่วโมง`, username, bookingId: booking.id });
        }, delay);
      }
    } catch (e) { console.error('schedule reminder error', e); }

    res.json({ success: true, booking });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'DB error' }); }
});

// Mark booking as paid (simulate payment callback)
app.post('/api/bookings/:id/pay', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body || {};
  try {
    const booking = await updateBookingPaid(id);
    if (!booking) return res.status(404).json({ success: false, message: 'ไม่พบ booking' });
    await addNotification({ type: 'payment', message: `ลูกค้า ${username || booking.username} ชำระเงินเรียบร้อยสำหรับ booking=${id}`, bookingId: id });
    res.json({ success: true, booking });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'DB error' }); }
});

// Get notifications (admin or user can filter)
app.get('/api/notifications', async (req, res) => {
  const { forUser } = req.query;
  try {
    const notes = await getNotifications(forUser);
    res.json(notes);
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'DB error' }); }
});

app.get('/api', (req, res) => {
  res.send('เช่ารถกับแคทตี้ Backend API พร้อมใช้งาน');
});

// Simple registration endpoint for demo purposes

// --- Register ---
app.post('/api/register', async (req, res) => {
  const { username, password, name } = req.body || {};
  if (!username || !password) return res.status(400).json({ success: false, message: 'กรุณากรอก username และ password' });
  try {
    const existing = await findUserByUsername(username);
    if (existing) return res.status(400).json({ success: false, message: 'Username มีอยู่แล้ว' });
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    await pool.query('INSERT INTO users (username, passwordHash, name, role) VALUES (?,?,?,?)', [username, passwordHash, name || null, 'user']);
    res.json({ success: true, message: 'สมัครสมาชิกสำเร็จ' });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'DB error' }); }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ success: false, message: 'กรุณากรอก username และ password' });
  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้' });
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    if (hash !== user.passwordHash) return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    res.json({ success: true, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'DB error' }); }
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


// (duplicate legacy login removed — single /api/login handler above)
