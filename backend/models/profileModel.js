const { pool } = require('../config/db');

class ProfileModel {
  /**
   * Upserts (insert or update on duplicate key) a analyzed profile record.
   * @param {Object} profile 
   * @returns {Object} Database insertion result metadata
   */
  async upsertProfile(profile) {
    const query = `
      INSERT INTO github_profiles (
        username, name, bio, location, followers, following, 
        public_repos, public_gists, account_created_at, profile_url, avatar_url,
        total_stars, total_forks, most_starred_repo, most_starred_repo_stars,
        developer_score, analysis_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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
        developer_score = VALUES(developer_score),
        analysis_date = NOW();
    `;

    const values = [
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
      profile.developer_score || 0
    ];

    const [result] = await pool.execute(query, values);
    return result;
  }

  /**
   * Fetches paginated, sorted, and filtered profiles.
   * Prevents SQL injection by whitelisting fields.
   */
  async getAllProfiles({ page = 1, limit = 10, sortBy = 'created_at', order = 'DESC', search = '' }) {
    // 1. Whitelist sorting columns and directions to secure against SQL injection
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

    let query = 'SELECT * FROM github_profiles';
    let countQuery = 'SELECT COUNT(*) as total FROM github_profiles';
    const queryParams = [];
    const countParams = [];

    // 2. Append search filter if present
    if (search.trim()) {
      const searchPattern = `%${search.trim().toLowerCase()}%`;
      query += ' WHERE username LIKE ? OR name LIKE ? OR location LIKE ?';
      countQuery += ' WHERE username LIKE ? OR name LIKE ? OR location LIKE ?';
      queryParams.push(searchPattern, searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    // 3. Append order and pagination limits
    query += ` ORDER BY ${safeSortBy} ${safeOrder} LIMIT ? OFFSET ?`;
    queryParams.push(parsedLimit, offset);

    // 4. Run queries concurrently for efficiency
    const [
      [countRows],
      [rows]
    ] = await Promise.all([
      pool.query(countQuery, countParams),
      pool.query(query, queryParams)
    ]);

    const totalCount = countRows[0].total;
    const totalPages = Math.ceil(totalCount / parsedLimit);

    return {
      profiles: rows,
      pagination: {
        totalCount,
        totalPages,
        currentPage: parsedPage,
        limit: parsedLimit
      }
    };
  }

  /**
   * Retrieves an analyzed profile by username.
   * @param {string} username 
   * @returns {Object|null}
   */
  async getByUsername(username) {
    const query = 'SELECT * FROM github_profiles WHERE username = ?';
    const [rows] = await pool.execute(query, [username.toLowerCase()]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Deletes an analyzed profile by username.
   * @param {string} username 
   * @returns {boolean} True if successfully deleted
   */
  async deleteByUsername(username) {
    const query = 'DELETE FROM github_profiles WHERE username = ?';
    const [result] = await pool.execute(query, [username.toLowerCase()]);
    return result.affectedRows > 0;
  }
}

module.exports = new ProfileModel();
