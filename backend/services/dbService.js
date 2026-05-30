const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Bootstraps the database and required tables on server startup.
 * Helps prevent startup crashes if tables or databases are not present.
 */
const initializeDatabase = async () => {
  const host = process.env.DB_HOST || '127.0.0.1';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const dbName = process.env.DB_NAME || 'github_profile_analyzer';

  let connection;
  try {
    console.log('🔄 Checking database and provisioning tables...');

    // 1. Try to connect directly to the database first (supports cloud environments like Railway)
    try {
      connection = await mysql.createConnection({
        host,
        user,
        password,
        port,
        database: dbName
      });
      console.log(`✅ Connected directly to database "${dbName}".`);
    } catch (directError) {
      // 2. Fallback: Connect without database and try to create it (for local setups)
      console.log(`Database "${dbName}" not found or direct connection failed. Attempting bootstrap...`);
      connection = await mysql.createConnection({
        host,
        user,
        password,
        port
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
      console.log(`✅ Database "${dbName}" created.`);
      await connection.query(`USE \`${dbName}\`;`);
    }

    // 4. Create profiles table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS github_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(150),
        bio TEXT,
        location VARCHAR(150),
        followers INT DEFAULT 0,
        following INT DEFAULT 0,
        public_repos INT DEFAULT 0,
        public_gists INT DEFAULT 0,
        account_created_at DATETIME,
        profile_url VARCHAR(255),
        avatar_url VARCHAR(255),
        
        -- Calculated insights
        total_stars INT DEFAULT 0,
        total_forks INT DEFAULT 0,
        most_starred_repo VARCHAR(255) DEFAULT '',
        most_starred_repo_stars INT DEFAULT 0,
        
        -- Custom evaluation metrics
        developer_score INT DEFAULT 0,
        
        -- Timestamps
        analysis_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Optimization Indexes
        INDEX idx_username (username),
        INDEX idx_developer_score (developer_score)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createTableQuery);
    console.log('✅ "github_profiles" table verified or created successfully.');

    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Database bootstrapping failed. Check MySQL status.');
    console.error(`Error Details: ${error.message}`);
    if (connection) {
      try {
        await connection.end();
      } catch (_) {}
    }
    return false;
  }
};

module.exports = {
  initializeDatabase
};
