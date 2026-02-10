import axios from 'axios';

// Get API base URL from environment variable, default to localhost for development
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

console.log(`🔧 API Base URL: ${baseURL}`);

// Create axios instance with base URL
const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // Set to true if using cookies for auth
});

// Log all requests for debugging
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
        console.log(`🟢 API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message || 'Something went wrong';

        console.error(`🔴 API Error (${status}): ${message}`);
        console.error('Full Error:', error);

        if (status === 401) {
            // Clear token and redirect to login if needed
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Check if we are already on login page to avoid loops
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
