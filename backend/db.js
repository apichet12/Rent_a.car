// db.js
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rentacar',
  max: process.env.DB_CONN_LIMIT ? parseInt(process.env.DB_CONN_LIMIT, 10) : 10, // connection pool
});

export default pool;
