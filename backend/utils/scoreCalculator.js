/**
 * Mathematical operations and data parsing for Github Profiles
 */

/**
 * Calculates aggregate stats from repository listings
 * @param {Array} repos - GitHub repository JSON array
 * @returns {Object} { totalStars, totalForks, mostStarredRepo, mostStarredRepoStars }
 */
const calculateRepoInsights = (repos = []) => {
  let totalStars = 0;
  let totalForks = 0;
  let mostStarredRepo = '';
  let mostStarredRepoStars = 0;

  if (Array.isArray(repos) && repos.length > 0) {
    repos.forEach((repo) => {
      const stars = repo.stargazers_count || 0;
      const forks = repo.forks_count || 0;

      totalStars += stars;
      totalForks += forks;

      if (stars >= mostStarredRepoStars) {
        mostStarredRepoStars = stars;
        mostStarredRepo = repo.name || '';
      }
    });
  }

  return {
    totalStars,
    totalForks,
    mostStarredRepo,
    mostStarredRepoStars
  };
};

/**
 * Custom Developer Score Formula:
 * score = followers + (public_repos * 5) + (total_stars * 2) + total_forks
 * 
 * @param {number} followers
 * @param {number} publicRepos
 * @param {number} totalStars
 * @param {number} totalForks
 * @returns {number} developerScore
 */
const calculateDeveloperScore = (followers = 0, publicRepos = 0, totalStars = 0, totalForks = 0) => {
  const score = 
    (followers || 0) + 
    ((publicRepos || 0) * 5) + 
    ((totalStars || 0) * 2) + 
    (totalForks || 0);
  
  return score;
};

module.exports = {
  calculateRepoInsights,
  calculateDeveloperScore
};
