import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

// Get API URL from environment or use default
const API_BASE_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : 'http://localhost:5000/api/v1';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error('An error occurred:', error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - please check your connection');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
