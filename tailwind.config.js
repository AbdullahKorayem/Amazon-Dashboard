/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      rotate: {
        '20': '20deg',
      }
    },
  },
  plugins: [],
}

