CREATE DATABASE IF NOT EXISTS codemetrics;
USE codemetrics;

-- 1. Users table (supports local email/password and OAuth provider profiles)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NULL, -- Nullable for OAuth accounts
  provider VARCHAR(50) DEFAULT 'local', -- 'local', 'google', 'github'
  provider_id VARCHAR(255) NULL,
  avatar_url VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Github Profiles table (holds analyzed stats, user ownership, and AI analytics cache)
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
  language_distribution JSON NULL, -- Store counts and percentages of languages

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

-- 3. Search History table
CREATE TABLE IF NOT EXISTS search_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  username VARCHAR(100) NOT NULL,
  searched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  github_profile_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (github_profile_id) REFERENCES github_profiles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_favorite (user_id, github_profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Comparisons table
CREATE TABLE IF NOT EXISTS comparisons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  profile_id_1 INT NOT NULL,
  profile_id_2 INT NOT NULL,
  ai_summary TEXT NULL, -- Cached Gemini summary comparison
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (profile_id_1) REFERENCES github_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (profile_id_2) REFERENCES github_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
