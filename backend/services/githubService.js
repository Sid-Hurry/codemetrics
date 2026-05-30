const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Service to fetch user profile and repositories directly from GitHub REST API
 */
class GitHubService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Profile-Analyzer-API'
      }
    });

    // Proactively attach Github PAT token if set in .env to increase rate limits
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `token ${token}`;
      console.log('🔑 GitHub service configured using authentication token.');
    }
  }

  /**
   * Fetches profile details of a GitHub user
   * @param {string} username 
   * @returns {Object} User details
   */
  async getUserProfile(username) {
    try {
      const response = await this.client.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          const err = new Error('GitHub user not found');
          err.status = 404;
          throw err;
        }
        if (error.response.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
          const err = new Error('GitHub API rate limit exceeded. Please configure GITHUB_TOKEN in your backend .env file to extend limits.');
          err.status = 403;
          throw err;
        }
      }
      throw new Error(`GitHub API profile request failed: ${error.message}`);
    }
  }

  /**
   * Fetches all public repositories of a GitHub user (returns up to 100)
   * @param {string} username 
   * @returns {Array} List of repositories
   */
  async getUserRepos(username) {
    try {
      // Fetch up to 100 repositories on the first page to get rich stats
      const response = await this.client.get(`/users/${username}/repos`, {
        params: {
          per_page: 100,
          type: 'owner',
          sort: 'updated'
        }
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
        const err = new Error('GitHub API rate limit exceeded fetching repositories.');
        err.status = 403;
        throw err;
      }
      throw new Error(`GitHub API repository request failed: ${error.message}`);
    }
  }
}

module.exports = new GitHubService();
