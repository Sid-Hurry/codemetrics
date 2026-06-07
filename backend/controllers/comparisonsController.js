const { pool } = require('../config/db');

class ComparisonsController {
  /**
   * Logs a comparative analysis session for the logged-in user.
   * POST /api/comparisons
   */
  async saveComparison(req, res, next) {
    try {
      const { profileId1, profileId2, aiSummary } = req.body;

      if (!profileId1 || !profileId2) {
        const err = new Error('Both profileId1 and profileId2 are required.');
        err.status = 400;
        return next(err);
      }

      // Check if both profiles exist and belong to the user
      const [pCheck] = await pool.query(
        'SELECT id FROM github_profiles WHERE id IN (?, ?) AND user_id = ?',
        [profileId1, profileId2, req.user.id]
      );

      if (pCheck.length < 2 && profileId1 !== profileId2) {
        const err = new Error('One or both profiles were not found in your workspace.');
        err.status = 404;
        return next(err);
      }

      // Insert comparison
      const insertQuery = `
        INSERT INTO comparisons (user_id, profile_id_1, profile_id_2, ai_summary)
        VALUES (?, ?, ?, ?);
      `;
      const [result] = await pool.execute(insertQuery, [
        req.user.id,
        profileId1,
        profileId2,
        aiSummary || null
      ]);

      return res.status(201).json({
        success: true,
        message: 'Comparison logged successfully.',
        data: {
          comparisonId: result.insertId
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves comparison history logs for the logged-in user.
   * GET /api/comparisons
   */
  async getComparisons(req, res, next) {
    try {
      const query = `
        SELECT c.id AS comparison_id, c.ai_summary, c.created_at AS compared_at,
               p1.id AS profile_id_1, p1.username AS username1, p1.name AS name1, p1.avatar_url AS avatar_url1, p1.developer_score AS score1,
               p2.id AS profile_id_2, p2.username AS username2, p2.name AS name2, p2.avatar_url AS avatar_url2, p2.developer_score AS score2
        FROM comparisons c
        INNER JOIN github_profiles p1 ON c.profile_id_1 = p1.id
        INNER JOIN github_profiles p2 ON c.profile_id_2 = p2.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC;
      `;
      const [rows] = await pool.execute(query, [req.user.id]);

      return res.status(200).json({
        success: true,
        data: rows
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes a comparison log.
   * DELETE /api/comparisons/:id
   */
  async deleteComparison(req, res, next) {
    try {
      const { id } = req.params;
      const query = 'DELETE FROM comparisons WHERE id = ? AND user_id = ?';
      const [result] = await pool.execute(query, [id, req.user.id]);

      if (result.affectedRows === 0) {
        const err = new Error('Comparison log not found or unauthorized.');
        err.status = 404;
        return next(err);
      }

      return res.status(200).json({
        success: true,
        message: 'Comparison log removed.'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ComparisonsController();
