const { pool } = require('../config/db');
const aiService = require('../services/aiService');
const careerInsightsService = require('../services/careerInsightsService');

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

  /**
   * Retrieves or generates career insights for a developer.
   * POST /api/ai/career/:username
   */
  async getCareerInsights(req, res, next) {
    try {
      const { username } = req.params;

      if (!username) {
        const err = new Error('Username parameter is required.');
        err.status = 400;
        return next(err);
      }

      // Check if profile exists in user's workspace
      const selectQuery = 'SELECT * FROM github_profiles WHERE user_id = ? AND username = ?';
      const [rows] = await pool.execute(selectQuery, [req.user.id, username.toLowerCase().trim()]);

      if (rows.length === 0) {
        const err = new Error('Profile not found in your workspace database. Run analysis first.');
        err.status = 404;
        return next(err);
      }

      const profile = rows[0];

      // Check if insights are already cached
      const insightQuery = 'SELECT * FROM career_insights WHERE user_id = ? AND github_profile_id = ?';
      const [insightRows] = await pool.execute(insightQuery, [req.user.id, profile.id]);

      if (insightRows.length > 0) {
        const cachedInsight = insightRows[0];
        // Parse JSON fields
        try { cachedInsight.skill_gaps = JSON.parse(cachedInsight.skill_gaps); } catch (_) {}
        try { cachedInsight.learning_roadmap = JSON.parse(cachedInsight.learning_roadmap); } catch (_) {}
        try { cachedInsight.recommended_projects = JSON.parse(cachedInsight.recommended_projects); } catch (_) {}
        try { cachedInsight.career_recommendations = JSON.parse(cachedInsight.career_recommendations); } catch (_) {}

        return res.status(200).json({
          success: true,
          data: cachedInsight
        });
      }

      // Generate new insights
      console.log(`🤖 Generating Career Insights for developer: ${profile.username}`);
      const insights = await careerInsightsService.generateCareerInsights(profile);

      // Save to database
      const insertQuery = `
        INSERT INTO career_insights (
          user_id, github_profile_id, current_level, career_path, 
          skill_gaps, learning_roadmap, recommended_projects, career_recommendations, generated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW());
      `;
      await pool.execute(insertQuery, [
        req.user.id,
        profile.id,
        insights.current_level,
        insights.career_path,
        JSON.stringify(insights.skill_gaps),
        JSON.stringify(insights.learning_roadmap),
        JSON.stringify(insights.recommended_projects),
        JSON.stringify(insights.career_recommendations)
      ]);

      // Return generated details
      return res.status(200).json({
        success: true,
        data: {
          user_id: req.user.id,
          github_profile_id: profile.id,
          ...insights
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Force regenerates career insights for a developer.
   * POST /api/ai/career/regenerate/:username
   */
  async regenerateCareerInsights(req, res, next) {
    try {
      const { username } = req.params;

      if (!username) {
        const err = new Error('Username parameter is required.');
        err.status = 400;
        return next(err);
      }

      // Check if profile exists in user's workspace
      const selectQuery = 'SELECT * FROM github_profiles WHERE user_id = ? AND username = ?';
      const [rows] = await pool.execute(selectQuery, [req.user.id, username.toLowerCase().trim()]);

      if (rows.length === 0) {
        const err = new Error('Profile not found in your workspace database. Run analysis first.');
        err.status = 404;
        return next(err);
      }

      const profile = rows[0];

      // Force generate new insights
      console.log(`🤖 Regenerating Career Insights for developer: ${profile.username}`);
      const insights = await careerInsightsService.generateCareerInsights(profile);

      // Update in database using UPSERT or UPDATE/INSERT
      const checkQuery = 'SELECT id FROM career_insights WHERE user_id = ? AND github_profile_id = ?';
      const [checkRows] = await pool.execute(checkQuery, [req.user.id, profile.id]);

      if (checkRows.length > 0) {
        // Update existing record
        const updateQuery = `
          UPDATE career_insights
          SET 
            current_level = ?,
            career_path = ?,
            skill_gaps = ?,
            learning_roadmap = ?,
            recommended_projects = ?,
            career_recommendations = ?,
            generated_at = NOW()
          WHERE user_id = ? AND github_profile_id = ?;
        `;
        await pool.execute(updateQuery, [
          insights.current_level,
          insights.career_path,
          JSON.stringify(insights.skill_gaps),
          JSON.stringify(insights.learning_roadmap),
          JSON.stringify(insights.recommended_projects),
          JSON.stringify(insights.career_recommendations),
          req.user.id,
          profile.id
        ]);
      } else {
        // Insert new record
        const insertQuery = `
          INSERT INTO career_insights (
            user_id, github_profile_id, current_level, career_path, 
            skill_gaps, learning_roadmap, recommended_projects, career_recommendations, generated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW());
        `;
        await pool.execute(insertQuery, [
          req.user.id,
          profile.id,
          insights.current_level,
          insights.career_path,
          JSON.stringify(insights.skill_gaps),
          JSON.stringify(insights.learning_roadmap),
          JSON.stringify(insights.recommended_projects),
          JSON.stringify(insights.career_recommendations)
        ]);
      }

      return res.status(200).json({
        success: true,
        message: 'Career insights regenerated successfully.',
        data: {
          user_id: req.user.id,
          github_profile_id: profile.id,
          ...insights
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();

