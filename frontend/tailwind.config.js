/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#1A1A1A',
        'charcoal-light': '#2A2A2A',
        'warm-sand': '#D4C5B2',
        'warm-sand-light': '#E8DDD0',
        gold: '#C9A96E',
        'gold-light': '#E0C99A',
      }
    },
  },
  plugins: [],
}
