import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f13f0a',
          50: '#fff5ed',
          100: '#ffe8d5',
          200: '#ffcda9',
          300: '#feaa73',
          400: '#fd7c3a',
          500: '#fb5914',
          600: '#f13f0a',
          700: '#c42b0a',
          800: '#9b2311',
          900: '#7d2011',
          950: '#440d06',
        },
        secondary: {
          DEFAULT: '#00EFFA',
          50: '#C9FFF7',
          100: '#B3FFF6',
          200: '#85FFF5',
          300: '#57FFF9',
          400: '#29FEFF',
          500: '#00EFFA',
          600: '#00B6C7',
          700: '#008194',
          800: '#005061',
          900: '#00242E',
          950: '#001014',
        },
      },
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
