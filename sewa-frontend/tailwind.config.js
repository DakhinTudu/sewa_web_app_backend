/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f2fcf5',
                    100: '#e1f8e8',
                    200: '#c3efd2',
                    300: '#94e0b3',
                    400: '#5cc990',
                    500: '#34ae73',
                    600: '#238c5b',
                    700: '#1d704b',
                    800: '#1a593e',
                    900: '#164a35', // Deep Green
                    950: '#0b281d',
                },
                secondary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
                accent: {
                    gold: '#D4AF37',
                    teal: '#0d9488',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
