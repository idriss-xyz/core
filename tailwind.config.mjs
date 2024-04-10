/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        polymarket: {
          gray: '#1D2B39'
        }
      }
    },
  },
  plugins: ['@tailwindcss/forms'],
};
