/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'secondary': {
          DEFAULT: '#0E1219',
          '50': '#95A6C4',
          '100': '#889BBC',
          '200': '#6E85AE',
          '300': '#57709C',
          '400': '#495D82',
          '500': '#3A4A67',
          '600': '#2B384D',
          '700': '#1D2533',
          '800': '#0E1219',
          '900': '#000000'
          },
      },
    },
  },
  plugins: [],
};
