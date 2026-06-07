const githubService = require('../services/githubService');
const profileModel = require('../models/profileModel');
const aiService = require('../services/aiService');
const { calculateRepoInsights, calculateProfileCompleteness, calculateDeveloperScore } = require('../utils/scoreCalculator');
const { pool } = require('../config/db');

class ProfileController {
  /**
   * Triggers fetching, metrics calculation, AI insight generation, and DB upsert of a GitHub profile.
   * POST /api/analyze/:username
   */
  async analyzeProfile(req, res, next) {
    try {
      let { username } = req.params;

      if (!username || !username.trim()) {
        const err = new Error('Username parameter is required.');
        err.status = 400;
        return next(err);
      }

      username = username.trim().toLowerCase();

      // GitHub usernames can only contain alphanumeric characters or hyphens, no spaces
      const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
      if (!githubUsernameRegex.test(username)) {
        const err = new Error('Invalid GitHub username format.');
        err.status = 400;
        return next(err);
      }

      console.log(`🔍 Starting user-specific analysis for: "${username}" (User ID: ${req.user.id})`);

      // 1. Fetch raw data from GitHub concurrently
      let rawProfile;
      let rawRepos = [];

      try {
        const [profileResponse, reposResponse] = await Promise.all([
          githubService.getUserProfile(username),
          githubService.getUserRepos(username)
        ]);

        rawProfile = profileResponse;
        rawRepos = reposResponse;
      } catch (apiError) {
        return next(apiError);
      }

      // 2. Compute Insights
      const insights = calculateRepoInsights(rawRepos);
      const completeness = calculateProfileCompleteness(rawProfile);
      const developerScore = calculateDeveloperScore(
        rawProfile.followers,
        rawRepos.length,
        insights.totalStars,
        insights.totalForks,
        completeness
      );

      // Check if profile was already analyzed by this user
      const existingProfile = await profileModel.getByUsername(username, req.user.id);

      let aiSummary = null;
      let aiStrengths = null;
      let aiImprovements = null;
      let aiSkillAssessment = null;
      let aiCareerPath = null;
      let aiGeneratedAt = null;

      // Create a temporary data payload for prompt creation
      const profilePayloadForAI = {
        username: rawProfile.login.toLowerCase(),
        name: rawProfile.name,
        bio: rawProfile.bio,
        location: rawProfile.location,
        followers: rawProfile.followers,
        following: rawProfile.following,
        public_repos: rawProfile.public_repos,
        public_gists: rawProfile.public_gists,
        total_stars: insights.totalStars,
        total_forks: insights.totalForks,
        average_stars_per_repo: insights.averageStarsPerRepo,
        average_forks_per_repo: insights.averageForksPerRepo,
        top_languages: insights.topLanguages,
        language_distribution: insights.languageDistribution,
        most_starred_repo: insights.mostStarredRepo,
        most_starred_repo_stars: insights.mostStarredRepoStars,
        most_forked_repo: insights.mostForkedRepo,
        most_forked_repo_forks: insights.mostForkedRepoForks,
        developer_score: developerScore,
        profile_completeness_score: completeness
      };

      // 3. AI analysis triggering
      if (existingProfile && existingProfile.ai_summary) {
        // Reuse cached AI insights
        aiSummary = existingProfile.ai_summary;
        aiStrengths = existingProfile.ai_strengths;
        aiImprovements = existingProfile.ai_improvements;
        aiSkillAssessment = existingProfile.ai_skill_assessment;
        aiCareerPath = existingProfile.ai_career_path;
        aiGeneratedAt = existingProfile.ai_generated_at;
        console.log(`♻️ Reusing cached AI insights for profile: ${username}`);
      } else {
        // Generate new AI insights
        console.log(`🤖 Generating fresh AI insights for profile: ${username}`);
        const aiInsights = await aiService.generateProfileInsights(profilePayloadForAI);
        
        aiSummary = aiInsights.summary;
        aiStrengths = aiInsights.strengths;
        aiImprovements = aiInsights.improvements;
        aiSkillAssessment = aiInsights.skill_assessment;
        aiCareerPath = aiInsights.career_path;
        aiGeneratedAt = new Date();
      }

      // 4. Construct payload for database upsert
      const profileData = {
        user_id: req.user.id,
        username: rawProfile.login.toLowerCase(),
        name: rawProfile.name || null,
        bio: rawProfile.bio || null,
        location: rawProfile.location || null,
        followers: rawProfile.followers || 0,
        following: rawProfile.following || 0,
        public_repos: rawProfile.public_repos || 0,
        public_gists: rawProfile.public_gists || 0,
        account_created_at: rawProfile.created_at ? rawProfile.created_at.substring(0, 19).replace('T', ' ') : null,
        profile_url: rawProfile.html_url || null,
        avatar_url: rawProfile.avatar_url || null,
        
        total_stars: insights.totalStars,
        total_forks: insights.totalForks,
        most_starred_repo: insights.mostStarredRepo,
        most_starred_repo_stars: insights.mostStarredRepoStars,
        most_forked_repo: insights.mostForkedRepo,
        most_forked_repo_forks: insights.mostForkedRepoForks,
        average_stars_per_repo: insights.averageStarsPerRepo,
        average_forks_per_repo: insights.averageForksPerRepo,
        profile_completeness_score: completeness,
        top_languages: insights.topLanguages,
        language_distribution: insights.languageDistribution,
        developer_score: developerScore,

        ai_summary: aiSummary,
        ai_strengths: aiStrengths,
        ai_improvements: aiImprovements,
        ai_skill_assessment: aiSkillAssessment,
        ai_career_path: aiCareerPath,
        ai_generated_at: aiGeneratedAt ? (typeof aiGeneratedAt === 'string' ? aiGeneratedAt : aiGeneratedAt.toISOString().slice(0, 19).replace('T', ' ')) : null
      };

      // 5. Store / Upsert in database
      await profileModel.upsertProfile(profileData);

      // 6. Automatically log this to search history
      const logSearchQuery = 'INSERT INTO search_history (user_id, username) VALUES (?, ?);';
      await pool.execute(logSearchQuery, [req.user.id, rawProfile.login.toLowerCase()]);

      // 7. Fetch finalized saved record
      const savedRecord = await profileModel.getByUsername(username, req.user.id);

      console.log(`✨ Successfully analyzed and saved profile: "${username}"`);

      return res.status(201).json({
        success: true,
        message: 'Profile analyzed and saved successfully.',
        data: savedRecord
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves all analyzed profiles in the user's workspace
   * GET /api/profiles
   */
  async getAllProfiles(req, res, next) {
    try {
      const { page, limit, sortBy, order, search } = req.query;

      const results = await profileModel.getAllProfiles({
        page,
        limit,
        sortBy,
        order,
        search,
        userId: req.user.id
      });

      return res.status(200).json({
        success: true,
        data: results.profiles,
        pagination: results.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves a single analyzed profile from user's workspace
   * GET /api/profiles/:username
   */
  async getProfileByUsername(req, res, next) {
    try {
      const { username } = req.params;

      if (!username || !username.trim()) {
        const err = new Error('Username parameter is required.');
        err.status = 400;
        return next(err);
      }

      const profile = await profileModel.getByUsername(username.trim(), req.user.id);

      if (!profile) {
        const err = new Error(`Profile for "${username}" has not been analyzed yet.`);
        err.status = 404;
        return next(err);
      }

      return res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes an analyzed profile record from user's workspace
   * DELETE /api/profiles/:username
   */
  async deleteProfile(req, res, next) {
    try {
      const { username } = req.params;

      if (!username || !username.trim()) {
        const err = new Error('Username parameter is required.');
        err.status = 400;
        return next(err);
      }

      const wasDeleted = await profileModel.deleteByUsername(username.trim(), req.user.id);

      if (!wasDeleted) {
        const err = new Error(`Profile for "${username}" not found in your records.`);
        err.status = 404;
        return next(err);
      }

      return res.status(200).json({
        success: true,
        message: `Profile "${username}" deleted successfully.`
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
