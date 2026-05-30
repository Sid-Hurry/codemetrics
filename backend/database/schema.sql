-- Active: 2026-05-30
-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS github_profile_analyzer;
USE github_profile_analyzer;

-- Create GitHub Profiles Table
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
  
  -- Calculated Insights
  total_stars INT DEFAULT 0,
  total_forks INT DEFAULT 0,
  most_starred_repo VARCHAR(255) DEFAULT '',
  most_starred_repo_stars INT DEFAULT 0,
  
  -- Custom Evaluation Metrics
  developer_score INT DEFAULT 0,
  
  -- Timestamps
  analysis_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Optimization Indexes
  INDEX idx_username (username),
  INDEX idx_developer_score (developer_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
