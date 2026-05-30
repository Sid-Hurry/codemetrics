const githubService = require('../services/githubService');
const profileModel = require('../models/profileModel');
const { calculateRepoInsights, calculateDeveloperScore } = require('../utils/scoreCalculator');

/**
 * Controller to handle all profile analysis and retrieval actions
 */
class ProfileController {
  /**
   * Triggers fetching, metrics calculation, and DB upsert of a GitHub profile
   * POST /api/analyze/:username
   */
  async analyzeProfile(req, res, next) {
    try {
      let { username } = req.params;

      // 1. Basic validation
      if (!username || !username.trim()) {
        const err = new Error('Username parameter is required and cannot be empty.');
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

      console.log(`🔍 Starting analysis for GitHub username: "${username}"`);

      // 2. Fetch data from GitHub concurrently to minimize API round-trip times
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
        // Pass standard GitHub API failures directly (404 not found, 403 rate limit)
        return next(apiError);
      }

      // 3. Compute Insights
      const insights = calculateRepoInsights(rawRepos);
      const developerScore = calculateDeveloperScore(
        rawProfile.followers,
        rawProfile.public_repos,
        insights.totalStars,
        insights.totalForks
      );

      // 4. Construct payload for database
      const profileData = {
        username: rawProfile.login.toLowerCase(),
        name: rawProfile.name || null,
        bio: rawProfile.bio || null,
        location: rawProfile.location || null,
        followers: rawProfile.followers || 0,
        following: rawProfile.following || 0,
        public_repos: rawProfile.public_repos || 0,
        public_gists: rawProfile.public_gists || 0,
        account_created_at: rawProfile.created_at ? rawProfile.created_at.substring(0, 19).replace('T', ' ') : null, // Convert ISO to MySQL DATETIME
        profile_url: rawProfile.html_url || null,
        avatar_url: rawProfile.avatar_url || null,
        total_stars: insights.totalStars,
        total_forks: insights.totalForks,
        most_starred_repo: insights.mostStarredRepo,
        most_starred_repo_stars: insights.mostStarredRepoStars,
        developer_score: developerScore
      };

      // 5. Store / Upsert in MySQL database
      await profileModel.upsertProfile(profileData);

      // 6. Fetch final saved record from DB to verify structure
      const savedRecord = await profileModel.getByUsername(username);

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
   * Retrieves all analyzed profiles with search, pagination, and sorting
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
        search
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
   * Retrieves a single analyzed profile from the local DB
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

      const profile = await profileModel.getByUsername(username.trim());

      if (!profile) {
        const err = new Error(`Profile for "${username}" has not been analyzed yet. Run analysis first.`);
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
   * Deletes an analyzed profile record from local DB
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

      const wasDeleted = await profileModel.deleteByUsername(username.trim());

      if (!wasDeleted) {
        const err = new Error(`Profile for "${username}" not found in our records.`);
        err.status = 404;
        return next(err);
      }

      return res.status(200).json({
        success: true,
        message: `Profile "${username}" was deleted successfully.`
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
