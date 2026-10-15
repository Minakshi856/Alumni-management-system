import axios from 'axios';

// Use environment variable if provided, otherwise default to relative '/api' or localhost:5000
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('alumniconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      if (localStorage.getItem('alumniconnect_token')) {
        console.warn('Session expired or unauthorized. Logging out.');
        localStorage.removeItem('alumniconnect_token');
        localStorage.removeItem('alumniconnect_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
