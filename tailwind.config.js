/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      'xxxs': '330px',
      'xxs': '380px',
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      rotate: {
        '20': '20deg',
      }
    },
  },
  plugins: [],
}

