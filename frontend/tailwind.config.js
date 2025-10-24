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
          DEFAULT: '#1e3a8a', // Professional Deep Blue
          dark: '#1e40af',
          light: '#3b82f6',
        },
        secondary: {
          DEFAULT: '#059669', // Professional Green
          dark: '#047857',
          light: '#10b981',
        },
        accent: {
          DEFAULT: '#0891b2', // Cyan Accent
          dark: '#0e7490',
          light: '#06b6d4',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'hindi': ['Noto Sans Devanagari', 'sans-serif'],
      },
      backgroundImage: {
        'madhubani': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M30 30m-20, 0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0\" fill=\"none\" stroke=\"%234CAF50\" stroke-width=\"1\" opacity=\"0.1\"/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}

