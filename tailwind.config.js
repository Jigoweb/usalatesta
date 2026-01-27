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
          blue: '#1e3a8a', // Navy Blue
          'light-blue': '#3b82f6', // Light Blue
          gray: '#64748b',
        },
        secondary: {
          orange: '#f97316',
          bordeaux: '#9f1239',
        },
        tertiary: {
          ochre: '#d97706',
          petrol: '#0e7490',
          green: '#15803d',
          purple: '#7e22ce',
        }
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}