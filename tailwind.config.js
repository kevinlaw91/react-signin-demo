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
          DEFAULT: '#BD5B3E',
          50: '#F0D7D0',
          100: '#E9C5BB',
          200: '#DBA190',
          300: '#CD7E66',
          400: '#BD5B3E',
          500: '#934730',
          600: '#693222',
          700: '#3E1E14',
          800: '#140A07',
          900: '#0b0606',
          950: '#000000',
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
    },
  },
};
