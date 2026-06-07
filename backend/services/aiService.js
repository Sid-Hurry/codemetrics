const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = 'gemini-1.5-flash';
  }

  /**
   * Helper to determine if Gemini API is available
   */
  isConfigured() {
    return !!this.apiKey && this.apiKey !== 'placeholder_key_replace_me';
  }

  /**
   * Generates profile developer insights using Gemini API
   * @param {Object} profile - Analyzed github profile record
   * @returns {Object} Structured insights
   */
  async generateProfileInsights(profile) {
    if (!this.isConfigured()) {
      console.warn('⚠️ GEMINI_API_KEY is not set. Generating fallback developer insights...');
      return this.getFallbackInsights(profile);
    }

    const prompt = `
      You are an expert technical recruiter and developer assessment engine.
      Analyze the following GitHub developer profile metrics and repository data:
      
      Developer Info:
      - Username: ${profile.username}
      - Name: ${profile.name || 'N/A'}
      - Bio: ${profile.bio || 'N/A'}
      - Location: ${profile.location || 'N/A'}
      - Followers: ${profile.followers}
      - Following: ${profile.following}
      - Public Repos: ${profile.public_repos}
      - Public Gists: ${profile.public_gists}
      
      Repository Statistics:
      - Total Stars: ${profile.total_stars}
      - Total Forks: ${profile.total_forks}
      - Average Stars per Repo: ${profile.average_stars_per_repo}
      - Average Forks per Repo: ${profile.average_forks_per_repo}
      - Top Languages: ${profile.top_languages}
      - Language Distribution: ${JSON.stringify(profile.language_distribution)}
      - Most Starred Repository: ${profile.most_starred_repo} (with ${profile.most_starred_repo_stars} stars)
      - Most Forked Repository: ${profile.most_forked_repo} (with ${profile.most_forked_repo_forks} forks)
      - Developer Score: ${profile.developer_score}
      - Profile Completeness: ${profile.profile_completeness_score}%
      
      Based on this data, provide:
      1. A concise, professional summary (exactly 3-4 sentences, strictly professional, no emojis, no markdown formatting).
      2. A skill rating out of 100 (integer) for the following categories: frontend, backend, mobile, devops, dataScience, openSource.
      3. A list of 3-5 concrete strengths.
      4. A list of 3-5 actionable improvement areas.
      5. A career path recommendation (must be exactly one of: 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Open Source Contributor', 'Mobile Developer').
      
      You MUST return the response in the following JSON schema:
      {
        "summary": "String",
        "skill_assessment": {
          "frontend": Integer,
          "backend": Integer,
          "mobile": Integer,
          "devops": Integer,
          "dataScience": Integer,
          "openSource": Integer
        },
        "strengths": ["String", ...],
        "improvements": ["String", ...],
        "career_path": "String"
      }
    `;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      };

      const response = await axios.post(url, payload, { timeout: 15000 });
      
      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates[0] &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts[0]
      ) {
        const jsonText = response.data.candidates[0].content.parts[0].text;
        const insights = JSON.parse(jsonText);
        
        // Basic schema verification
        if (
          insights.summary &&
          insights.skill_assessment &&
          Array.isArray(insights.strengths) &&
          Array.isArray(insights.improvements) &&
          insights.career_path
        ) {
          return insights;
        }
      }

      throw new Error('Gemini API returned an invalid response structure.');
    } catch (error) {
      console.error(`❌ Gemini Profile Insights API request failed: ${error.message}`);
      console.log('Generating fallback insights to ensure uninterrupted service...');
      return this.getFallbackInsights(profile);
    }
  }

  /**
   * Generates comparison insights for two developers using Gemini
   * @param {Object} p1 - Profile 1
   * @param {Object} p2 - Profile 2
   */
  async generateComparisonInsights(p1, p2) {
    if (!this.isConfigured()) {
      return `Developer @${p1.username} (Score: ${p1.developer_score}) and Developer @${p2.username} (Score: ${p2.developer_score}) have been compared. @${p1.username} specializes in ${p1.top_languages || 'general tech'} while @${p2.username} specializes in ${p2.top_languages || 'general tech'}. Please configure GEMINI_API_KEY in the environment settings to unlock premium comparison summaries.`;
    }

    const prompt = `
      You are an expert technical interviewer. Compare the engineering profiles of these two developers:
      
      Developer A:
      - Username: @${p1.username}
      - Public Repos: ${p1.public_repos}
      - Followers: ${p1.followers}
      - Total Stars: ${p1.total_stars}
      - Total Forks: ${p1.total_forks}
      - Top Languages: ${p1.top_languages}
      - Developer Score: ${p1.developer_score}
      - Career Path: ${p1.ai_career_path || 'N/A'}
      
      Developer B:
      - Username: @${p2.username}
      - Public Repos: ${p2.public_repos}
      - Followers: ${p2.followers}
      - Total Stars: ${p2.total_stars}
      - Total Forks: ${p2.total_forks}
      - Top Languages: ${p2.top_languages}
      - Developer Score: ${p2.developer_score}
      - Career Path: ${p2.ai_career_path || 'N/A'}

      Write a comparative review summary (strictly 3-4 sentences, no markdown formatting, no emojis, no bullet points).
      Highlight which developer demonstrates stronger community outreach (followers/stars), who has greater repository contribution volume, and compare their technical focus based on language usage. Keep it objective, professional, and insightful.

      Return a JSON object:
      {
        "summary": "The comparative narrative summary text..."
      }
    `;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      };

      const response = await axios.post(url, payload, { timeout: 15000 });
      
      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates[0].content.parts[0]
      ) {
        const result = JSON.parse(response.data.candidates[0].content.parts[0].text);
        if (result.summary) {
          return result.summary;
        }
      }
      throw new Error('Invalid comparison JSON response');
    } catch (error) {
      console.error(`❌ Gemini Comparison API failed: ${error.message}`);
      return `${p1.name || p1.username} shows strong capabilities in ${p1.top_languages || 'their stack'} with a developer score of ${p1.developer_score}. In comparison, ${p2.name || p2.username} features a score of ${p2.developer_score} focusing heavily on ${p2.top_languages || 'their stack'}. both show solid contribution patterns.`;
    }
  }

  /**
   * Generates a smart fallback structure when the API is offline
   */
  getFallbackInsights(profile) {
    const langs = (profile.top_languages || '').toLowerCase();
    const isFrontend = langs.includes('javascript') || langs.includes('typescript') || langs.includes('html') || langs.includes('css');
    const isBackend = langs.includes('python') || langs.includes('go') || langs.includes('rust') || langs.includes('java') || langs.includes('c#') || langs.includes('php') || langs.includes('ruby');
    const isMobile = langs.includes('swift') || langs.includes('kotlin') || langs.includes('dart');
    const isData = langs.includes('python') || langs.includes('r') || langs.includes('julia');

    let career_path = 'Full Stack Developer';
    if (isFrontend && !isBackend) career_path = 'Frontend Developer';
    else if (isBackend && !isFrontend) career_path = 'Backend Developer';
    else if (isMobile) career_path = 'Mobile Developer';
    else if (isData) career_path = 'Data Scientist';

    const frontendRating = isFrontend ? Math.min(95, 60 + (profile.public_repos * 2)) : 30;
    const backendRating = isBackend ? Math.min(95, 65 + (profile.public_repos * 2)) : 40;
    const mobileRating = isMobile ? 85 : 15;
    const dataRating = isData ? 80 : 10;
    const devopsRating = Math.min(80, 20 + (profile.total_forks * 3));
    const openSourceRating = Math.min(98, 40 + (profile.followers * 2) + (profile.total_stars * 3));

    return {
      summary: `This developer profile shows solid activity on GitHub with a primary focus on ${profile.top_languages || 'general software engineering'}. They have analyzed ${profile.public_repos} public repositories, gathering a total of ${profile.total_stars} stars. Their profile indicates steady contribution habits and active engagement in their selected technologies.`,
      skill_assessment: {
        frontend: Math.round(frontendRating),
        backend: Math.round(backendRating),
        mobile: Math.round(mobileRating),
        devops: Math.round(devopsRating),
        dataScience: Math.round(dataRating),
        openSource: Math.round(openSourceRating)
      },
      strengths: [
        `Active repository builder with ${profile.public_repos} repositories`,
        profile.total_stars > 10 ? `Solid repository reception with ${profile.total_stars} stars` : 'Consistent version control contributions',
        profile.top_languages ? `Skilled developer in ${profile.top_languages}` : 'Diverse tool usage'
      ].filter(Boolean),
      improvements: [
        'Expand open source engagement by contributing to high-impact external repositories',
        'Incorporate unit testing structures in secondary projects',
        'Enhance code documentation and repository README layouts'
      ],
      career_path
    };
  }
}

module.exports = new AIService();
