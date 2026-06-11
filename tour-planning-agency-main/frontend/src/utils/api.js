import axios from 'axios';

/**
 * Centralized Axios instance with environment-aware base URL
 */
const getBaseURL = () => {
  // For mobile access, use computer's local IP
  const hostname = window.location.hostname;
  
  // If accessing from mobile (not localhost), construct IP-based URL
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // Use the current hostname (which will be the computer's IP when accessing from mobile)
    return `http://${hostname}:5000/api`;
  }
  
  // Localhost development
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor — attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tg_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log API requests in development
    if (window.location.hostname === 'localhost') {
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (window.location.hostname === 'localhost') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Request failed';
    
    // Log errors in development
    if (window.location.hostname === 'localhost') {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status,
        message,
        data: error.response?.data
      });
    }

    // Handle authentication errors
    if (status === 401) {
      const token = localStorage.getItem('tg_token');
      if (token && !token.startsWith('demo_') && !token.startsWith('local_')) {
        localStorage.removeItem('tg_token');
        localStorage.removeItem('tg_user');
        // Don't redirect here - let AuthContext handle it
      }
    }

    // Handle network errors
    if (!error.response) {
      const networkError = new Error('Network error - Cannot connect to server. Please check if backend is running.');
      networkError.status = 0;
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    // Return error with full response data
    const err = new Error(message);
    err.status = status;
    err.isApiError = true;
    err.response = error.response; // Keep full response for data access
    err.data = error.response?.data;
    return Promise.reject(err);
  }
);

export default api;
