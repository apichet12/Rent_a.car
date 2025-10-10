const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;
let ready = false;

async function init() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '10062549A';
  const database = process.env.DB_NAME || 'rentacar';

  try {
    pool = mysql.createPool({ host, user, password, database, waitForConnections: true, connectionLimit: 10 });
    // simple test
    await pool.query('SELECT 1');
    ready = true;
    console.log('DB: connected to MySQL at', host);
    await ensureTables();
  } catch (err) {
    ready = false;
    console.error('DB: connection failed', err.message || err);
  }
}

async function ensureTables() {
  if (!ready) return;
  // Create minimal tables if they don't exist
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(191) UNIQUE,
      email VARCHAR(191),
      passwordHash VARCHAR(255),
      name VARCHAR(255),
      phone VARCHAR(64),
      role VARCHAR(32) DEFAULT 'user'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS cars (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      price DECIMAL(10,2),
      img VARCHAR(512),
      meta JSON DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(191),
      carId INT,
      startDate DATETIME,
      endDate DATETIME,
      total DECIMAL(10,2) DEFAULT 0,
      status VARCHAR(32) DEFAULT 'pending',
      createdAt DATETIME,
      paidAt DATETIME
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS notifications (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(64),
      message TEXT,
      time DATETIME,
      username VARCHAR(191) DEFAULT NULL,
      bookingId INT DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

async function query(sql, params) {
  if (!ready) throw new Error('DB not ready');
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function getUserByUsername(username) {
  if (!ready) return null;
  const rows = await query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0] || null;
}

async function getAllUsers() {
  if (!ready) return null;
  return await query('SELECT * FROM users');
}

async function createUser({ username, email, passwordHash, name, phone, role = 'user' }) {
  if (!ready) throw new Error('DB not ready');
  const res = await query('INSERT INTO users (username, email, passwordHash, name, phone, role) VALUES (?,?,?,?,?,?)', [username, email, passwordHash, name || null, phone || null, role]);
  return { id: res.insertId, username, email, name, phone, role };
}

async function getCars() {
  if (!ready) return null;
  return await query('SELECT * FROM cars');
}

async function addCar(car) {
  if (!ready) throw new Error('DB not ready');
  const res = await query('INSERT INTO cars (name, price, img, meta) VALUES (?,?,?,?)', [car.name, car.price || 0, car.img || null, car.meta ? JSON.stringify(car.meta) : null]);
  return { id: res.insertId, ...car };
}

async function removeCar(id) {
  if (!ready) throw new Error('DB not ready');
  await query('DELETE FROM cars WHERE id=?', [id]);
}

async function getNotifications(forUser) {
  if (!ready) return null;
  if (forUser) return await query('SELECT * FROM notifications WHERE username = ? OR username IS NULL', [forUser]);
  return await query('SELECT * FROM notifications');
}

async function addNotification(note) {
  if (!ready) throw new Error('DB not ready');
  const res = await query('INSERT INTO notifications (type, message, time, username, bookingId) VALUES (?,?,?,?,?)', [note.type, note.message, note.time || new Date(), note.username || null, note.bookingId || null]);
  return { id: res.insertId, ...note };
}

module.exports = { init, query, getUserByUsername, getAllUsers, createUser, getCars, addCar, removeCar, getNotifications, addNotification, isReady: () => ready };
