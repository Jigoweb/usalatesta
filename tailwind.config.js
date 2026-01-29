/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#0B2A57', // Navy Blue
          lightblue: '#65ADDE', // Light Blue
          gray: '#9EA4AD',
        },
        secondary: {
          orange: '#DA642C',
          bordeaux: '#9D2050',
        },
        tertiary: {
          ochre: '#ECAA45',
          petrol: '#4195A4',
          green: '#6AAB46',
          purple: '#7A7FAD',
        }
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        'custom-timer': ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}