import plugin from 'tailwindcss/plugin';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.resolve(__dirname, '../ui/src/**/*.{ts,tsx}'),
    path.resolve(__dirname, '../../apps/extension/src/**/*.{ts,tsx}'),
    path.resolve(__dirname, '../../apps/main-landing/src/**/*.{ts,tsx}'),
  ],
  theme: {
    colors: {
      white: '#FFFFFF',
      black: '#000000',
      transparent: 'transparent',
      current: 'currentColor',
      neutral: {
        100: '#F6F7F8',
        200: '#EBECEE',
        300: '#DBDDE2',
        400: '#AAAFB9',
        500: '#8F94A2',
        600: '#717484',
        700: '#5F616E',
        800: '#4E505A',
        900: '#323339',
      },
      neutralGreen: {
        500: '#656D69',
        700: '#323D37',
        900: '#000A05',
      },
      mint: {
        100: '#FAFFF5',
        200: '#E7FED8',
        300: '#B8FB9B',
        400: '#5FEB3C',
        500: '#2AD012',
        600: '#05AB13',
        700: '#176410',
        800: '#175413',
        900: '#052F04',
      },
      midnightGreen: {
        100: '#EBFEF3',
        200: '#CFFCE1',
        300: '#A3F7C8',
        400: '#2CDB8A',
        500: '#08C172',
        600: '#007E4D',
        700: '#02633F',
        800: '#035136',
        900: '#002D1E',
      },
      lime: {
        100: '#FBFFE6',
        200: '#F5FEC9',
        300: '#E9FD99',
        400: '#C8F041',
        500: '#A4D50D',
        600: '#60810A',
        700: '#4C660E',
        800: '#405611',
        900: '#213003',
      },
      red: {
        100: '#FEF2F2',
        200: '#FEE3E2',
        300: '#FFCBC9',
        400: '#F97470',
        500: '#F03E38',
        600: '#BB1F1A',
        700: '#9A1E1A',
        800: '#801F1C',
        900: '#460B09',
      },
      indigo: {
        200: '#E9E7FE',
        500: '#4C3DF2',
      },
    },
    container: {
      center: true,
      padding: '16px',
    },
    extend: {
      boxShadow: {
        input: '0px 0px 0px 4px #F2F2F224',
      },
      blur: {
        md: '10px',
      },
      zIndex: {
        1: '1',
      },
      fontFamily: {
        sans: ['var(--font-aeonikpro)'],
      },
      spacing: {
        4.5: '18px',
      },
      fontSize: {
        body4: [
          '1rem',
          { lineHeight: '1.5em', letterSpacing: '0', fontWeight: '400' },
        ],
        button1: [
          '1rem',
          { lineHeight: '1.25em', letterSpacing: '0.05em', fontWeight: '500' },
        ],
        button2: [
          '0.875rem',
          { lineHeight: '1rem', letterSpacing: '0.05em', fontWeight: '500' },
        ],
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
