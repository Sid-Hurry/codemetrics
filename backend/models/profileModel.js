const { pool } = require('../config/db');

class ProfileModel {
  /**
   * Upserts (insert or update on duplicate key) an analyzed profile record.
   * @param {Object} profile 
   * @returns {Object} Database insertion result metadata
   */
  async upsertProfile(profile) {
    const query = `
      INSERT INTO github_profiles (
        user_id, username, name, bio, location, followers, following, 
        public_repos, public_gists, account_created_at, profile_url, avatar_url,
        total_stars, total_forks, most_starred_repo, most_starred_repo_stars,
        most_forked_repo, most_forked_repo_forks, average_stars_per_repo,
        average_forks_per_repo, profile_completeness_score, top_languages,
        language_distribution, developer_score, ai_summary, ai_strengths,
        ai_improvements, ai_skill_assessment, ai_career_path, ai_generated_at,
        analysis_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        bio = VALUES(bio),
        location = VALUES(location),
        followers = VALUES(followers),
        following = VALUES(following),
        public_repos = VALUES(public_repos),
        public_gists = VALUES(public_gists),
        account_created_at = VALUES(account_created_at),
        profile_url = VALUES(profile_url),
        avatar_url = VALUES(avatar_url),
        total_stars = VALUES(total_stars),
        total_forks = VALUES(total_forks),
        most_starred_repo = VALUES(most_starred_repo),
        most_starred_repo_stars = VALUES(most_starred_repo_stars),
        most_forked_repo = VALUES(most_forked_repo),
        most_forked_repo_forks = VALUES(most_forked_repo_forks),
        average_stars_per_repo = VALUES(average_stars_per_repo),
        average_forks_per_repo = VALUES(average_forks_per_repo),
        profile_completeness_score = VALUES(profile_completeness_score),
        top_languages = VALUES(top_languages),
        language_distribution = VALUES(language_distribution),
        developer_score = VALUES(developer_score),
        ai_summary = VALUES(ai_summary),
        ai_strengths = VALUES(ai_strengths),
        ai_improvements = VALUES(ai_improvements),
        ai_skill_assessment = VALUES(ai_skill_assessment),
        ai_career_path = VALUES(ai_career_path),
        ai_generated_at = VALUES(ai_generated_at),
        analysis_date = NOW();
    `;

    const values = [
      profile.user_id,
      profile.username.toLowerCase(),
      profile.name || null,
      profile.bio || null,
      profile.location || null,
      profile.followers || 0,
      profile.following || 0,
      profile.public_repos || 0,
      profile.public_gists || 0,
      profile.account_created_at || null,
      profile.profile_url || null,
      profile.avatar_url || null,
      profile.total_stars || 0,
      profile.total_forks || 0,
      profile.most_starred_repo || '',
      profile.most_starred_repo_stars || 0,
      profile.most_forked_repo || '',
      profile.most_forked_repo_forks || 0,
      profile.average_stars_per_repo || 0.00,
      profile.average_forks_per_repo || 0.00,
      profile.profile_completeness_score || 0,
      profile.top_languages || '',
      profile.language_distribution ? JSON.stringify(profile.language_distribution) : null,
      profile.developer_score || 0,
      profile.ai_summary || null,
      profile.ai_strengths ? JSON.stringify(profile.ai_strengths) : null,
      profile.ai_improvements ? JSON.stringify(profile.ai_improvements) : null,
      profile.ai_skill_assessment ? JSON.stringify(profile.ai_skill_assessment) : null,
      profile.ai_career_path || null,
      profile.ai_generated_at || null
    ];

    const [result] = await pool.execute(query, values);
    return result;
  }

  /**
   * Fetches paginated, sorted, and filtered profiles for a specific user.
   */
  async getAllProfiles({ page = 1, limit = 10, sortBy = 'created_at', order = 'DESC', search = '', userId }) {
    const allowedSortFields = [
      'id', 'username', 'name', 'followers', 'following', 
      'public_repos', 'total_stars', 'total_forks', 
      'developer_score', 'created_at', 'analysis_date'
    ];
    const allowedOrderDirs = ['ASC', 'DESC'];

    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = allowedOrderDirs.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const offset = (parsedPage - 1) * parsedLimit;

    let query = 'SELECT * FROM github_profiles WHERE user_id = ?';
    let countQuery = 'SELECT COUNT(*) as total FROM github_profiles WHERE user_id = ?';
    const queryParams = [userId];
    const countParams = [userId];

    if (search.trim()) {
      const searchPattern = `%${search.trim().toLowerCase()}%`;
      const searchFilter = ' AND (username LIKE ? OR name LIKE ? OR location LIKE ?)';
      query += searchFilter;
      countQuery += searchFilter;
      queryParams.push(searchPattern, searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    query += ` ORDER BY ${safeSortBy} ${safeOrder} LIMIT ? OFFSET ?`;
    queryParams.push(parsedLimit, offset);

    const [
      [countRows],
      [rows]
    ] = await Promise.all([
      pool.query(countQuery, countParams),
      pool.query(query, queryParams)
    ]);

    const totalCount = countRows[0].total;
    const totalPages = Math.ceil(totalCount / parsedLimit);

    // Parse JSON columns
    const parsedProfiles = rows.map(row => {
      if (row.language_distribution && typeof row.language_distribution === 'string') {
        try { row.language_distribution = JSON.parse(row.language_distribution); } catch (_) {}
      }
      if (row.ai_strengths && typeof row.ai_strengths === 'string') {
        try { row.ai_strengths = JSON.parse(row.ai_strengths); } catch (_) {}
      }
      if (row.ai_improvements && typeof row.ai_improvements === 'string') {
        try { row.ai_improvements = JSON.parse(row.ai_improvements); } catch (_) {}
      }
      if (row.ai_skill_assessment && typeof row.ai_skill_assessment === 'string') {
        try { row.ai_skill_assessment = JSON.parse(row.ai_skill_assessment); } catch (_) {}
      }
      return row;
    });

    return {
      profiles: parsedProfiles,
      pagination: {
        totalCount,
        totalPages,
        currentPage: parsedPage,
        limit: parsedLimit
      }
    };
  }

  /**
   * Retrieves an analyzed profile by username and user ID.
   */
  async getByUsername(username, userId) {
    const query = 'SELECT * FROM github_profiles WHERE user_id = ? AND username = ?';
    const [rows] = await pool.execute(query, [userId, username.toLowerCase().trim()]);
    
    if (rows.length === 0) return null;

    const row = rows[0];
    if (row.language_distribution && typeof row.language_distribution === 'string') {
      try { row.language_distribution = JSON.parse(row.language_distribution); } catch (_) {}
    }
    if (row.ai_strengths && typeof row.ai_strengths === 'string') {
      try { row.ai_strengths = JSON.parse(row.ai_strengths); } catch (_) {}
    }
    if (row.ai_improvements && typeof row.ai_improvements === 'string') {
      try { row.ai_improvements = JSON.parse(row.ai_improvements); } catch (_) {}
    }
    if (row.ai_skill_assessment && typeof row.ai_skill_assessment === 'string') {
      try { row.ai_skill_assessment = JSON.parse(row.ai_skill_assessment); } catch (_) {}
    }
    return row;
  }

  /**
   * Deletes an analyzed profile record from a user's workspace.
   */
  async deleteByUsername(username, userId) {
    const query = 'DELETE FROM github_profiles WHERE user_id = ? AND username = ?';
    const [result] = await pool.execute(query, [userId, username.toLowerCase().trim()]);
    return result.affectedRows > 0;
  }
}

module.exports = new ProfileModel();
