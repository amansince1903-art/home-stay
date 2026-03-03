// API Configuration
// In development: uses Vite proxy to localhost:5000
// In production: uses VITE_API_URL environment variable

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// If VITE_API_URL is set, use it. Otherwise, use relative URLs (proxy in dev)
export const getApiUrl = (path) => {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
};
