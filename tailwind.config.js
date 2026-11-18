/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f4f6f4',
          100: '#e5ebe5',
          200: '#cbd7cb',
          300: '#a5bda5',
          400: '#7a9f7a',
          500: '#588258',
          600: '#436843',
          700: '#355335',
          800: '#2b422b',
          900: '#253725',
          950: '#131e13',
        },
        forest: {
          dark: '#0d1510',
          base: '#131e17',
          surface: '#1b2a21',
          card: '#22352a',
          hover: '#2a4134',
          border: '#324e3e',
          accent: '#4ade80',
          sage: '#9dc2a8',
          muted: '#849c8d'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
