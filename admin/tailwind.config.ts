import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        olivePrimary: '#4C6A56',
        oliveSecondary: '#9DBBAE',
        oliveAccent: '#F3F6ED',
        oliveText: '#1F3124'
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        card: '0 10px 30px rgba(76, 106, 86, 0.15)'
      }
    }
  },
  plugins: []
} satisfies Config;
