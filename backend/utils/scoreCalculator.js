/**
   * Calculates aggregate stats from repository listings in a single loop
   * @param {Array} repos - GitHub repository JSON array
   * @returns {Object} Analytical insights
   */
const calculateRepoInsights = (repos = []) => {
  let totalStars = 0;
  let totalForks = 0;
  let mostStarredRepo = '';
  let mostStarredRepoStars = 0;
  let mostForkedRepo = '';
  let mostForkedRepoForks = 0;

  // Language count accumulator
  const langCounts = {};

  if (Array.isArray(repos) && repos.length > 0) {
    repos.forEach((repo) => {
      const stars = repo.stargazers_count || 0;
      const forks = repo.forks_count || 0;
      const lang = repo.language;

      totalStars += stars;
      totalForks += forks;

      if (stars >= mostStarredRepoStars) {
        mostStarredRepoStars = stars;
        mostStarredRepo = repo.name || '';
      }

      if (forks >= mostForkedRepoForks) {
        mostForkedRepoForks = forks;
        mostForkedRepo = repo.name || '';
      }

      if (lang && lang.trim()) {
        langCounts[lang] = (langCounts[lang] || 0) + 1;
      }
    });
  }

  const repoCount = repos.length;
  const averageStarsPerRepo = repoCount > 0 ? parseFloat((totalStars / repoCount).toFixed(2)) : 0;
  const averageForksPerRepo = repoCount > 0 ? parseFloat((totalForks / repoCount).toFixed(2)) : 0;

  // Extract top languages sorted by repository count
  const sortedLangs = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);

  const topLanguages = sortedLangs.slice(0, 3).join(', ');

  return {
    totalStars,
    totalForks,
    mostStarredRepo,
    mostStarredRepoStars,
    mostForkedRepo,
    mostForkedRepoForks,
    averageStarsPerRepo,
    averageForksPerRepo,
    topLanguages,
    languageDistribution: langCounts
  };
};

/**
 * Calculates a profile completeness score out of 100 based on public profile info
 * @param {Object} rawProfile - GitHub API profile response
 * @returns {number} 0-100 score
 */
const calculateProfileCompleteness = (rawProfile = {}) => {
  let score = 0;
  
  if (rawProfile.avatar_url) score += 10;
  if (rawProfile.bio && rawProfile.bio.trim()) score += 20;
  if (rawProfile.location && rawProfile.location.trim()) score += 15;
  if (rawProfile.name && rawProfile.name.trim()) score += 15;
  if (rawProfile.company && rawProfile.company.trim()) score += 10;
  if (rawProfile.blog && rawProfile.blog.trim()) score += 10;
  if (rawProfile.email && rawProfile.email.trim()) score += 10;
  if (rawProfile.twitter_username && rawProfile.twitter_username.trim()) score += 10;

  return score;
};

/**
 * Professional Developer Score Formula:
 * A normalized, logarithmic score out of 100 based on popularity, contribution, and completeness.
 * 
 * - Followers weight: log10(followers + 1) * 20 pts (requires ~100 followers for max)
 * - Stars weight: log10(stars + 1) * 25 pts (requires ~100 stars for max)
 * - Forks weight: log10(forks + 1) * 15 pts (requires ~10 forks for max)
 * - Repository usage: publicRepos > 0 ? 10 pts
 * - Completeness weight: profileCompleteness * 0.3 (up to 30 pts)
 * 
 * Max score is 100.
 */
const calculateDeveloperScore = (followers = 0, publicRepos = 0, totalStars = 0, totalForks = 0, completeness = 0) => {
  const followersScore = Math.log10(followers + 1) * 20;
  const starsScore = Math.log10(totalStars + 1) * 25;
  const forksScore = Math.log10(totalForks + 1) * 15;
  const reposBonus = publicRepos > 0 ? 10 : 0;
  const completenessBonus = completeness * 0.3;

  const total = followersScore + starsScore + forksScore + reposBonus + completenessBonus;
  
  return Math.round(Math.min(100, Math.max(0, total)));
};

module.exports = {
  calculateRepoInsights,
  calculateProfileCompleteness,
  calculateDeveloperScore
};
