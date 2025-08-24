// API service for Rise Gum backend integration
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Waitlist API functions
export const waitlistAPI = {
  // Add new entry to waitlist
  addEntry: async (entryData) => {
    try {
      const response = await apiClient.post('/waitlist', entryData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail ||
                          'Failed to join waitlist. Please try again.';
      
      return {
        success: false,
        error: errorMessage,
        details: error.response?.data?.details || []
      };
    }
  },

  // Get all waitlist entries (for admin)
  getEntries: async (skip = 0, limit = 100) => {
    try {
      const response = await apiClient.get('/waitlist', {
        params: { skip, limit }
      });
      return {
        success: true,
        data: response.data.data,
        count: response.data.count
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch waitlist entries'
      };
    }
  }
};

// Content API functions
export const contentAPI = {
  // Get static content (testimonials, stats, etc.)
  getContent: async () => {
    try {
      const response = await apiClient.get('/content');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to load content',
        // Fallback to mock data if API fails
        fallback: true
      };
    }
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    try {
      const response = await apiClient.get('/');
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: 'Backend unavailable'
      };
    }
  }
};

export default apiClient;