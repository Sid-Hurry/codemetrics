const { pool } = require('../config/db');

class DashboardController {
  /**
   * Retrieves dashboard statistics and recent activities for the logged-in user.
   * GET /api/dashboard
   */
  async getDashboardData(req, res, next) {
    try {
      const userId = req.user.id;

      // 1. Run count queries concurrently
      const profileCountQuery = 'SELECT COUNT(*) AS total FROM github_profiles WHERE user_id = ?';
      const favoriteCountQuery = 'SELECT COUNT(*) AS total FROM favorites WHERE user_id = ?';
      const comparisonCountQuery = 'SELECT COUNT(*) AS total FROM comparisons WHERE user_id = ?';

      // 2. Run activity queries concurrently
      const recentSearchesQuery = `
        SELECT id, username, searched_at 
        FROM search_history 
        WHERE user_id = ? 
        ORDER BY searched_at DESC 
        LIMIT 5;
      `;
      const recentAnalysesQuery = `
        SELECT id, username, name, avatar_url, developer_score, analysis_date 
        FROM github_profiles 
        WHERE user_id = ? 
        ORDER BY analysis_date DESC 
        LIMIT 5;
      `;

      const [
        [profileCountRes],
        [favoriteCountRes],
        [comparisonCountRes],
        [recentSearches],
        [recentAnalyses]
      ] = await Promise.all([
        pool.execute(profileCountQuery, [userId]),
        pool.execute(favoriteCountQuery, [userId]),
        pool.execute(comparisonCountQuery, [userId]),
        pool.execute(recentSearchesQuery, [userId]),
        pool.execute(recentAnalysesQuery, [userId])
      ]);

      return res.status(200).json({
        success: true,
        data: {
          metrics: {
            totalProfiles: profileCountRes[0].total,
            totalFavorites: favoriteCountRes[0].total,
            totalComparisons: comparisonCountRes[0].total
          },
          recentSearches,
          recentAnalyses
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
