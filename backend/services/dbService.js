const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Bootstraps the database and required tables on server startup.
 * Automatically handles migrations if schema updates are detected.
 */
const initializeDatabase = async () => {
  const host = process.env.DB_HOST || process.env.MYSQLHOST || '127.0.0.1';
  const user = process.env.DB_USER || process.env.MYSQLUSER || 'root';
  const password = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '';
  const port = parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10);
  const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'codemetrics';

  let connection;
  try {
    console.log('🔄 Checking database and provisioning tables...');

    // 1. Connect directly to database first (for cloud hosts)
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
      console.log(`Database "${dbName}" not found or direct connection failed. Attempting bootstrap...`);
      connection = await mysql.createConnection({
        host,
        user,
        password,
        port
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
      console.log(`✅ Database "${dbName}" verified/created.`);
      await connection.query(`USE \`${dbName}\`;`);
    }

    // 2. Perform Schema Migration Check
    // If the github_profiles table exists but does not have the user_id column, drop it to rebuild relationships safely.
    let rebuildProfiles = false;
    try {
      const [columns] = await connection.query(`SHOW COLUMNS FROM \`github_profiles\`;`);
      const hasUserId = columns.some(col => col.Field === 'user_id');
      const hasAISummary = columns.some(col => col.Field === 'ai_summary');
      if (!hasUserId || !hasAISummary) {
        console.log('⚠️ Old github_profiles table schema detected (missing user_id or AI columns). Rebuilding database relationships...');
        rebuildProfiles = true;
      }
    } catch (err) {
      // Table doesn't exist yet, which is fine
    }

    if (rebuildProfiles) {
      console.log('🗑️ Dropping old tables to recreate clean relationships...');
      await connection.query(`DROP TABLE IF EXISTS \`favorites\`;`);
      await connection.query(`DROP TABLE IF EXISTS \`comparisons\`;`);
      await connection.query(`DROP TABLE IF EXISTS \`search_history\`;`);
      await connection.query(`DROP TABLE IF EXISTS \`github_profiles\`;`);
    }

    // 3. Create users table
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150),
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NULL,
        provider VARCHAR(50) DEFAULT 'local',
        provider_id VARCHAR(255) NULL,
        avatar_url VARCHAR(255) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createUsersTableQuery);
    console.log('✅ "users" table verified.');

    // 4. Create github_profiles table
    const createProfilesTableQuery = `
      CREATE TABLE IF NOT EXISTS github_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        username VARCHAR(100) NOT NULL,
        name VARCHAR(150) NULL,
        bio TEXT NULL,
        location VARCHAR(150) NULL,
        followers INT DEFAULT 0,
        following INT DEFAULT 0,
        public_repos INT DEFAULT 0,
        public_gists INT DEFAULT 0,
        account_created_at DATETIME NULL,
        profile_url VARCHAR(255) NULL,
        avatar_url VARCHAR(255) NULL,
        
        -- Calculated repository metrics
        total_stars INT DEFAULT 0,
        total_forks INT DEFAULT 0,
        most_starred_repo VARCHAR(255) DEFAULT '',
        most_starred_repo_stars INT DEFAULT 0,
        most_forked_repo VARCHAR(255) DEFAULT '',
        most_forked_repo_forks INT DEFAULT 0,
        average_stars_per_repo DECIMAL(10, 2) DEFAULT 0.00,
        average_forks_per_repo DECIMAL(10, 2) DEFAULT 0.00,
        profile_completeness_score INT DEFAULT 0,
        top_languages VARCHAR(255) DEFAULT '',
        language_distribution JSON NULL,

        -- Score
        developer_score INT DEFAULT 0,

        -- AI Generated cache
        ai_summary TEXT NULL,
        ai_strengths JSON NULL,
        ai_improvements JSON NULL,
        ai_skill_assessment JSON NULL,
        ai_career_path VARCHAR(255) NULL,
        ai_generated_at DATETIME NULL,
        
        -- Timestamps
        analysis_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_username (user_id, username),
        INDEX idx_username (username),
        INDEX idx_developer_score (developer_score)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createProfilesTableQuery);
    console.log('✅ "github_profiles" table verified.');

    // 5. Create search_history table
    const createHistoryTableQuery = `
      CREATE TABLE IF NOT EXISTS search_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        username VARCHAR(100) NOT NULL,
        searched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createHistoryTableQuery);
    console.log('✅ "search_history" table verified.');

    // 6. Create favorites table
    const createFavoritesTableQuery = `
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        github_profile_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (github_profile_id) REFERENCES github_profiles(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_favorite (user_id, github_profile_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createFavoritesTableQuery);
    console.log('✅ "favorites" table verified.');

    // 7. Create comparisons table
    const createComparisonsTableQuery = `
      CREATE TABLE IF NOT EXISTS comparisons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        profile_id_1 INT NOT NULL,
        profile_id_2 INT NOT NULL,
        ai_summary TEXT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (profile_id_1) REFERENCES github_profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (profile_id_2) REFERENCES github_profiles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createComparisonsTableQuery);
    console.log('✅ "comparisons" table verified.');

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
