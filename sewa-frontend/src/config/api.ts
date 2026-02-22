// Use VITE_API_BASE_URL in production (set in Render/Vercel/Netlify env). Default: localhost for dev.
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';
