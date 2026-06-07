const { pool } = require('../config/db');
const aiService = require('../services/aiService');

class AIController {
  /**
   * Generates a narrative summary comparison between two developers.
   * POST /api/ai/compare
   */
  async compareDevelopers(req, res, next) {
    try {
      const { usernameA, usernameB } = req.body;

      if (!usernameA || !usernameB) {
        const err = new Error('Both usernameA and usernameB parameters are required.');
        err.status = 400;
        return next(err);
      }

      // Look up profiles in the user's workspace
      const query = `
        SELECT * FROM github_profiles 
        WHERE user_id = ? AND username IN (?, ?);
      `;
      const [rows] = await pool.execute(query, [req.user.id, usernameA.toLowerCase().trim(), usernameB.toLowerCase().trim()]);

      if (rows.length < 2 && usernameA.toLowerCase().trim() !== usernameB.toLowerCase().trim()) {
        const err = new Error('One or both profiles were not found in your analyzed workspace.');
        err.status = 404;
        return next(err);
      }

      const pA = rows.find(r => r.username === usernameA.toLowerCase().trim()) || rows[0];
      const pB = rows.find(r => r.username === usernameB.toLowerCase().trim()) || rows[0];

      // Invoke Gemini API for narrative comparison
      const comparisonSummary = await aiService.generateComparisonInsights(pA, pB);

      // Log comparison in database
      const insertQuery = `
        INSERT INTO comparisons (user_id, profile_id_1, profile_id_2, ai_summary)
        VALUES (?, ?, ?, ?);
      `;
      const [insertResult] = await pool.execute(insertQuery, [req.user.id, pA.id, pB.id, comparisonSummary]);

      return res.status(200).json({
        success: true,
        data: {
          comparisonId: insertResult.insertId,
          profileA: pA.username,
          profileB: pB.username,
          summary: comparisonSummary
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Force regenerates Gemini API insights for an existing profile.
   * POST /api/ai/regenerate/:username
   */
  async regenerateInsights(req, res, next) {
    try {
      const { username } = req.params;

      if (!username) {
        const err = new Error('Username parameter is required.');
        err.status = 400;
        return next(err);
      }

      // Check if profile exists under this user
      const selectQuery = 'SELECT * FROM github_profiles WHERE user_id = ? AND username = ?';
      const [rows] = await pool.execute(selectQuery, [req.user.id, username.toLowerCase().trim()]);

      if (rows.length === 0) {
        const err = new Error('Profile not found in your workspace database. Run analysis first.');
        err.status = 404;
        return next(err);
      }

      const profile = rows[0];

      // Re-trigger insights generation
      console.log(`🤖 Regenerating AI insights for developer: ${profile.username}`);
      const aiInsights = await aiService.generateProfileInsights(profile);

      // Update in MySQL
      const updateQuery = `
        UPDATE github_profiles
        SET 
          ai_summary = ?,
          ai_strengths = ?,
          ai_improvements = ?,
          ai_skill_assessment = ?,
          ai_career_path = ?,
          ai_generated_at = NOW()
        WHERE id = ?;
      `;
      await pool.execute(updateQuery, [
        aiInsights.summary,
        JSON.stringify(aiInsights.strengths),
        JSON.stringify(aiInsights.improvements),
        JSON.stringify(aiInsights.skill_assessment),
        aiInsights.career_path,
        profile.id
      ]);

      // Return updated profile details
      const [updatedRows] = await pool.execute('SELECT * FROM github_profiles WHERE id = ?', [profile.id]);
      const updatedProfile = updatedRows[0];

      // Parse JSON columns
      if (updatedProfile.language_distribution && typeof updatedProfile.language_distribution === 'string') {
        try { updatedProfile.language_distribution = JSON.parse(updatedProfile.language_distribution); } catch (_) {}
      }
      if (updatedProfile.ai_strengths && typeof updatedProfile.ai_strengths === 'string') {
        try { updatedProfile.ai_strengths = JSON.parse(updatedProfile.ai_strengths); } catch (_) {}
      }
      if (updatedProfile.ai_improvements && typeof updatedProfile.ai_improvements === 'string') {
        try { updatedProfile.ai_improvements = JSON.parse(updatedProfile.ai_improvements); } catch (_) {}
      }
      if (updatedProfile.ai_skill_assessment && typeof updatedProfile.ai_skill_assessment === 'string') {
        try { updatedProfile.ai_skill_assessment = JSON.parse(updatedProfile.ai_skill_assessment); } catch (_) {}
      }

      return res.status(200).json({
        success: true,
        message: 'AI insights regenerated successfully.',
        data: updatedProfile
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
