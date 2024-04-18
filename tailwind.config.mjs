import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        polymarket: {
          gray: '#1D2B39',
        },
        idriss: {
          primary: {
            500: '#11dd74',
            400: '#11cc74'
          },
        },
        twitter: {
          primary: '#1D9BF0',
        },
      },
    },
  },
  plugins: [
    '@tailwindcss/forms',
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.fill-rule-non-zero': {
          'fill-rule': 'nonzero',
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
