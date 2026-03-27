const fallbackApiBaseUrl = 'http://localhost:8080/api/v1';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? fallbackApiBaseUrl;
