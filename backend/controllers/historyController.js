const { pool } = require('../config/db');

class HistoryController {
  /**
   * Retrieves the search history of the logged-in user.
   * GET /api/history
   */
  async getHistory(req, res, next) {
    try {
      const query = `
        SELECT * FROM search_history 
        WHERE user_id = ? 
        ORDER BY searched_at DESC;
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
   * Deletes a single history record.
   * DELETE /api/history/:id
   */
  async deleteHistoryItem(req, res, next) {
    try {
      const { id } = req.params;
      const query = 'DELETE FROM search_history WHERE id = ? AND user_id = ?';
      const [result] = await pool.execute(query, [id, req.user.id]);

      if (result.affectedRows === 0) {
        const err = new Error('History record not found or unauthorized.');
        err.status = 404;
        return next(err);
      }

      return res.status(200).json({
        success: true,
        message: 'History item removed successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clears all history for the logged-in user.
   * DELETE /api/history
   */
  async clearHistory(req, res, next) {
    try {
      const query = 'DELETE FROM search_history WHERE user_id = ?';
      await pool.execute(query, [req.user.id]);

      return res.status(200).json({
        success: true,
        message: 'Search history cleared successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HistoryController();
