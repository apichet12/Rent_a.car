const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d3nla0be5dus73ediopg-a.oregon-postgres.render.com',
  port: 5432,
  user: 'carrental_db_4c72_user',
  password: 'MSOH7w2ZkRCLNmwFTqBQpwjQGncxZjHl',
  database: 'carrental_db_4c72',
  ssl: { rejectUnauthorized: false },
});

pool.query('SELECT 1', (err, res) => {
  if (err) {
    console.error('DB ERROR:', err);
  } else {
    console.log('DB OK:', res.rows);
  }
  pool.end();
});
