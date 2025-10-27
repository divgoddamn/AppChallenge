/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'news-blue': '#3b82f6',
        'news-green': '#10b981',
        'news-red': '#ef4444',
        'news-yellow': '#f59e0b',
        'news-purple': '#8b5cf6',
      }
    },
  },
  plugins: [],
}
