/**
 * Frontend API Utility to communicate with the Backend Express Service.
 * Leverages Vite's built-in proxy in dev mode to avoid CORS errors.
 */

let rawApiUrl = import.meta.env.VITE_API_URL || '/api';

// 1. If absolute URL lacks protocol, prepend https://
if (rawApiUrl && !rawApiUrl.startsWith('/') && !rawApiUrl.startsWith('http://') && !rawApiUrl.startsWith('https://')) {
  rawApiUrl = 'https://' + rawApiUrl;
}

// 2. If the user provided the base domain only (missing the '/api' suffix), append it automatically
if (rawApiUrl && rawApiUrl.startsWith('http') && !rawApiUrl.endsWith('/api') && !rawApiUrl.includes('/api/')) {
  rawApiUrl = rawApiUrl.endsWith('/') ? rawApiUrl + 'api' : rawApiUrl + '/api';
}

const BASE_API_URL = rawApiUrl;

/**
 * Custom error handler for API responses
 */
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    throw error;
  }
  
  return data;
};

export const api = {
  /**
   * Dispatches username to backend to run analytics
   * @param {string} username 
   * @returns {Promise<Object>} Analyzed record data
   */
  async analyzeProfile(username) {
    const response = await fetch(`${BASE_API_URL}/analyze/${encodeURIComponent(username)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  /**
   * Fetches paginated history list from local database
   */
  async getProfiles({ page = 1, limit = 10, sortBy = 'created_at', order = 'DESC', search = '' }) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      order,
      search: search.trim()
    });

    const response = await fetch(`${BASE_API_URL}/profiles?${params.toString()}`);
    return handleResponse(response);
  },

  /**
   * Gets specific profile from database
   */
  async getProfile(username) {
    const response = await fetch(`${BASE_API_URL}/profiles/${encodeURIComponent(username)}`);
    return handleResponse(response);
  },

  /**
   * Removes profile from database
   */
  async deleteProfile(username) {
    const response = await fetch(`${BASE_API_URL}/profiles/${encodeURIComponent(username)}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};
