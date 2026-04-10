export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        agreen: {
          50: '#f1f8f4',
          100: '#def0e4',
          200: '#bee0cd',
          300: '#90c9ab',
          400: '#5dae84',
          500: '#3a9166',
          600: '#2b7450',
          700: '#245a40',
          800: '#1f4835',
          900: '#1b3c2d',
          950: '#0f221a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
