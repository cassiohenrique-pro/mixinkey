/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          'brand-background': '#121212',
          'brand-surface': '#1e1e1e',
          'brand-primary': '#1DB954',
          'brand-secondary': '#282828',
          'brand-text-primary': '#FFFFFF',
          'brand-text-secondary': '#b3b3b3',
          'brand-accent': '#535353',
      },
      animation: {
          'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
          'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
          fadeInUp: {
              '0%': { opacity: '0', transform: 'translateY(20px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
          }
      }
    },
  },
  plugins: [],
}