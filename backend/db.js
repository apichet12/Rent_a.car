const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rentacar',
  waitForConnections: true,
  connectionLimit: process.env.DB_CONN_LIMIT ? parseInt(process.env.DB_CONN_LIMIT, 10) : 10,
  queueLimit: 0
});

module.exports = pool;
