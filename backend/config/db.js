const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST || '127.0.0.1',
  user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'codemetrics',
  port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true // Preserve datetime formatting as strings
});

// Test connection helper
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully.');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed. Please check your MySQL server and .env settings.');
    console.error(`Error Details: ${error.message}`);
    return false;
  }
};

module.exports = {
  pool,
  testConnection
};
