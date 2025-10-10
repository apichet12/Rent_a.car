const pool = require('./db');

async function init() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(191) NOT NULL UNIQUE,
        passwordHash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(64),
        role VARCHAR(50) DEFAULT 'user'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure email and phone columns exist for older deployments
    try {
      await conn.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) NULL');
    } catch (e) { /* ignore */ }
    try {
      await conn.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(64) NULL');
    } catch (e) { /* ignore */ }

    await conn.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price INT DEFAULT 0,
        image VARCHAR(1024),
        
        year INT,
        seats INT,
        fuel VARCHAR(64),
        
        
        description TEXT,
        features JSON,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(191) NOT NULL,
        carId INT NOT NULL,
        startDate DATETIME NOT NULL,
        endDate DATETIME NOT NULL,
        total INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paidAt DATETIME NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(100),
        message TEXT,
        time DATETIME DEFAULT CURRENT_TIMESTAMP,
        username VARCHAR(191),
        bookingId INT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        comment TEXT,
        rating INT DEFAULT 5,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('DB initialized');
  } catch (err) {
    console.error('init_db error', err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

init();
