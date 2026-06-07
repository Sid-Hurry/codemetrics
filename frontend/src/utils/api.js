import axios from 'axios';

// 1. Resolve backend target endpoint base URL
let baseURL = import.meta.env.VITE_API_URL || '/api';

if (baseURL && !baseURL.startsWith('/') && !baseURL.startsWith('http://') && !baseURL.startsWith('https://')) {
  baseURL = 'https://' + baseURL;
}

if (baseURL && baseURL.startsWith('http') && !baseURL.endsWith('/api') && !baseURL.includes('/api/')) {
  baseURL = baseURL.endsWith('/') ? baseURL + 'api' : baseURL + '/api';
}

// 2. Instantiate Axios client
const client = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 3. Attach token interceptor
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to format Axios errors
const parseError = (err) => {
  const message = err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message || 'Request failed';
  const status = err.response ? err.response.status : null;
  
  const errorObj = new Error(message);
  errorObj.status = status;
  return errorObj;
};

// 4. API Endpoints Map
export const api = {
  // Authentication
  async register(name, email, password) {
    try {
      const res = await client.post('/auth/register', { name, email, password });
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async login(email, password) {
    try {
      const res = await client.post('/auth/login', { email, password });
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async logout() {
    try {
      const res = await client.post('/auth/logout');
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async getMe() {
    try {
      const res = await client.get('/auth/me');
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  // GitHub Profiles
  async analyzeProfile(username) {
    try {
      const res = await client.post(`/analyze/${encodeURIComponent(username)}`);
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async getProfiles({ page = 1, limit = 10, sortBy = 'created_at', order = 'DESC', search = '' }) {
    try {
      const res = await client.get('/profiles', {
        params: { page, limit, sortBy, order, search }
      });
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async getProfile(username) {
    try {
      const res = await client.get(`/profiles/${encodeURIComponent(username)}`);
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async deleteProfile(username) {
    try {
      const res = await client.delete(`/profiles/${encodeURIComponent(username)}`);
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  // Search History
  async getHistory() {
    try {
      const res = await client.get('/history');
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async deleteHistoryItem(id) {
    try {
      const res = await client.delete(`/history/${id}`);
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async clearHistory() {
    try {
      const res = await client.delete('/history');
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  // Favorites (Bookmarks)
  async addFavorite(githubProfileId, username) {
    try {
      const res = await client.post('/favorites', { githubProfileId, username });
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async getFavorites() {
    try {
      const res = await client.get('/favorites');
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async removeFavorite(id) {
    try {
      const res = await client.delete(`/favorites/${id}`);
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  // Comparisons
  async saveComparison(profileId1, profileId2, aiSummary) {
    try {
      const res = await client.post('/comparisons', { profileId1, profileId2, aiSummary });
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async getComparisons() {
    try {
      const res = await client.get('/comparisons');
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async deleteComparison(id) {
    try {
      const res = await client.delete(`/comparisons/${id}`);
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  // Dashboard API
  async getDashboard() {
    try {
      const res = await client.get('/dashboard');
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  // AI Insights
  async aiCompare(usernameA, usernameB) {
    try {
      const res = await client.post('/ai/compare', { usernameA, usernameB });
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  },

  async aiRegenerate(username) {
    try {
      const res = await client.post(`/ai/regenerate/${encodeURIComponent(username)}`);
      return res.data;
    } catch (err) {
      throw parseError(err);
    }
  }
};
