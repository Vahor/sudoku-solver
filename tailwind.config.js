/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'secondary': {
          DEFAULT: '#0E1219',
          '50': '#374763',
          '100': '#34435E',
          '200': '#2F3C54',
          '300': '#29354A',
          '400': '#242E40',
          '500': '#1E2736',
          '600': '#19202D',
          '700': '#131923',
          '800': '#0E1219',
          '900': '#000000'
        },
      },
    },
  },
  plugins: [],
};
