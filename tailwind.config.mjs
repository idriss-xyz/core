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
            400: '#11cc74',
          },
        },
        twitter: {
          primary: '#1D9BF0',
        },
        tally: {
          purple: {
            100: '#EBE5FF',
            500: '#725BFF',
          },
          gray: {
            500: '#667085',
            600: '#475467',
            700: '#344054',
            900: '#101828',
          },
          teal: {
            50: '#D9FFFB',
            600: '#00BFAF',
          },
          red: {
            500: '#F44061',
            100: '#FFE6E7'
          },
          border: {
            primary: '#EAECF0',
            gray: { 700: '#2D3748' },
          },
          text: {
            primary: '#1D2939'
          }
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
