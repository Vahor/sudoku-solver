/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'secondary': {
          DEFAULT: '#0E1219',
          '400': '#242E40',
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
