/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        olivePrimary: '#4C6A56',
        oliveSecondary: '#9DBBAE',
        oliveAccent: '#F3F6ED',
        oliveText: '#1F3124'
      },
      fontFamily: {
        heading: ['"Helvetica Neue"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      }
    }
  },
  plugins: []
};
