const { pool } = require('../config/db');

class FavoritesController {
  /**
   * Bookmarks an analyzed GitHub profile for the logged-in user.
   * POST /api/favorites
   */
  async addFavorite(req, res, next) {
    try {
      const { githubProfileId, username } = req.body;
      let profileId = githubProfileId;

      // If username is provided instead, look up the profile ID in this user's workspace
      if (!profileId && username) {
        const query = 'SELECT id FROM github_profiles WHERE user_id = ? AND username = ?';
        const [rows] = await pool.execute(query, [req.user.id, username.toLowerCase().trim()]);
        
        if (rows.length === 0) {
          const err = new Error('You must analyze this profile before saving it to favorites.');
          err.status = 404;
          return next(err);
        }
        profileId = rows[0].id;
      }

      if (!profileId) {
        const err = new Error('Profile identifier (githubProfileId or username) is required.');
        err.status = 400;
        return next(err);
      }

      // Check if profile exists and belongs to the user
      const [pCheck] = await pool.execute('SELECT id FROM github_profiles WHERE id = ? AND user_id = ?', [profileId, req.user.id]);
      if (pCheck.length === 0) {
        const err = new Error('Profile not found in your workspace.');
        err.status = 404;
        return next(err);
      }

      // Insert into favorites
      const insertQuery = `
        INSERT INTO favorites (user_id, github_profile_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP;
      `;
      await pool.execute(insertQuery, [req.user.id, profileId]);

      return res.status(201).json({
        success: true,
        message: 'Profile added to favorites.'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves all favorited profiles for the logged-in user.
   * GET /api/favorites
   */
  async getFavorites(req, res, next) {
    try {
      const query = `
        SELECT f.id AS favorite_id, f.created_at AS favorited_at, p.*
        FROM favorites f
        INNER JOIN github_profiles p ON f.github_profile_id = p.id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC;
      `;
      const [rows] = await pool.execute(query, [req.user.id]);

      // Parse JSON columns since MySQL driver returns them as string/JSON depending on setup
      const parsedRows = rows.map(row => {
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

      return res.status(200).json({
        success: true,
        data: parsedRows
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Removes a profile from favorites.
   * DELETE /api/favorites/:id
   */
  async removeFavorite(req, res, next) {
    try {
      const { id } = req.params;
      
      // Allow deleting by favorite ID or github_profile_id depending on context
      const query = `
        DELETE FROM favorites 
        WHERE user_id = ? AND (id = ? OR github_profile_id = ?);
      `;
      const [result] = await pool.execute(query, [req.user.id, id, id]);

      if (result.affectedRows === 0) {
        const err = new Error('Favorite record not found.');
        err.status = 404;
        return next(err);
      }

      return res.status(200).json({
        success: true,
        message: 'Profile removed from favorites.'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FavoritesController();
