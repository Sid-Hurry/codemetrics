const { pool } = require('../config/db');

class UserModel {
  /**
   * Creates a user in the database.
   * @param {Object} userData 
   * @returns {Object} Saved user record
   */
  async createUser({ name, email, password = null, provider = 'local', provider_id = null, avatar_url = null }) {
    const query = `
      INSERT INTO users (name, email, password, provider, provider_id, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const [result] = await pool.execute(query, [name, email, password, provider, provider_id, avatar_url]);
    
    return this.findById(result.insertId);
  }

  /**
   * Finds a user by ID.
   * @param {number} id 
   * @returns {Object|null}
   */
  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Finds a user by email.
   * @param {string} email 
   * @returns {Object|null}
   */
  async findByEmail(email) {
    if (!email) return null;
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(query, [email.toLowerCase().trim()]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Finds a user by OAuth provider settings.
   * @param {string} provider 
   * @param {string} providerId 
   * @returns {Object|null}
   */
  async findByProvider(provider, providerId) {
    const query = 'SELECT * FROM users WHERE provider = ? AND provider_id = ?';
    const [rows] = await pool.execute(query, [provider, providerId]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Links OAuth credentials to an existing email account.
   * @param {number} userId 
   * @param {string} provider 
   * @param {string} providerId 
   * @param {string} avatarUrl 
   */
  async linkProvider(userId, provider, providerId, avatarUrl) {
    const query = `
      UPDATE users 
      SET provider = ?, provider_id = ?, avatar_url = COALESCE(avatar_url, ?)
      WHERE id = ?;
    `;
    await pool.execute(query, [provider, providerId, avatarUrl, userId]);
    return this.findById(userId);
  }
}

module.exports = new UserModel();
