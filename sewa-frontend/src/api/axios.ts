import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const baseURL = API_BASE_URL;
const isDev = import.meta.env.DEV;

if (isDev) {
    console.log(`🔧 API Base URL: ${baseURL}`);
}

// Create axios instance with base URL
const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // Set to true if using cookies for auth
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (isDev) {
            console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        }
        return config;
    },
    (error) => {
        if (isDev) {
            console.error('❌ Request Error:', error);
        }
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
        if (isDev) {
            console.log(`🟢 API Response: ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message || 'Something went wrong';

        if (isDev) {
            console.error(`🔴 API Error (${status}): ${message}`);
            console.error('Full Error:', error);
        }

        if (status === 401) {
            const isLoginRequest = error.config?.url?.includes('/auth/login');
            const isPublicContactRequest = error.config?.url?.includes('/contact');
            if (!isLoginRequest && !isPublicContactRequest) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
