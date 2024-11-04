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
      screens: {
        '2xl': '1608px',
      },
      padding: {
        'DEFAULT': '1rem',
        'sm': 0,
        'lg': 0,
        'xl': 0,
        '2xl': 0,
      },
    },
    extend: {
      screens: {
        '2xl': '1608px',
      },
      boxShadow: {
        input: '0px 0px 0px 4px #F2F2F224',
      },
      blur: {
        md: '10px',
      },
      zIndex: {
        1: '1',
        topBar: '10',
        dialog: '20',
      },
      fontFamily: {
        sans: ['var(--font-aeonikpro)'],
      },
      spacing: {
        4.5: '18px',
        5.5: '22px',
      },
      fontSize: {
        display1: [
          '7.25rem',
          { lineHeight: '7.25rem', letterSpacing: '0', fontWeight: '400' },
        ],
        display2: [
          '4.5rem',
          { lineHeight: '4.5rem', letterSpacing: '0', fontWeight: '400' },
        ],
        display3: [
          '3.5rem',
          { lineHeight: '3.5rem', letterSpacing: '0', fontWeight: '400' },
        ],
        display4: [
          '2.375rem',
          { lineHeight: '2.375rem', letterSpacing: '0', fontWeight: '400' },
        ],
        display5: [
          '1.875rem',
          { lineHeight: '1.875rem', letterSpacing: '0', fontWeight: '400' },
        ],
        display6: [
          '1.5rem',
          { lineHeight: '1.5rem', letterSpacing: '0', fontWeight: '400' },
        ],
        heading1: [
          '3.5rem',
          {
            lineHeight: '4rem',
            letterSpacing: '0',
            fontWeight: '500',
          },
        ],
        heading2: [
          '2.625rem',
          {
            lineHeight: '3rem',
            letterSpacing: '0',
            fontWeight: '500',
          },
        ],
        heading3: [
          '2',
          {
            lineHeight: '2.5rem',
            letterSpacing: '0',
            fontWeight: '500',
          },
        ],
        heading4: [
          '1.5rem',
          {
            lineHeight: '1.75rem',
            letterSpacing: '0',
            fontWeight: '500',
          },
        ],
        heading5: [
          '1.25rem',
          {
            lineHeight: '1.5rem',
            letterSpacing: '0',
            fontWeight: '500',
          },
        ],
        heading6: [
          '1.125rem',
          {
            lineHeight: '1.25rem',
            letterSpacing: '0',
            fontWeight: '500',
          },
        ],
        body1: [
          '1.5rem',
          { lineHeight: '2.25rem', letterSpacing: '0', fontWeight: '400' },
        ],
        body2: [
          '1.25rem',
          { lineHeight: '1.875rem', letterSpacing: '0', fontWeight: '400' },
        ],
        body3: [
          '1.125rem',
          { lineHeight: '1.75rem', letterSpacing: '0', fontWeight: '400' },
        ],
        body4: [
          '1rem',
          { lineHeight: '1.5rem', letterSpacing: '0', fontWeight: '400' },
        ],
        body5: [
          '0.875rem',
          { lineHeight: '1.25rem', letterSpacing: '0', fontWeight: '400' },
        ],
        body6: [
          '0.75rem',
          { lineHeight: '1.125rem', letterSpacing: '0', fontWeight: '400' },
        ],
        body7: [
          '0.625rem',
          { lineHeight: '0.875rem', letterSpacing: '0', fontWeight: '400' },
        ],
        label1: [
          '1.5rem',
          { lineHeight: '1.75rem', letterSpacing: '0', fontWeight: '500' },
        ],
        label2: [
          '1.25rem',
          { lineHeight: '1.5rem', letterSpacing: '0', fontWeight: '500' },
        ],
        label3: [
          '1.125rem',
          { lineHeight: '1.375rem', letterSpacing: '0', fontWeight: '500' },
        ],
        label4: [
          '1rem',
          { lineHeight: '1.125rem', letterSpacing: '0', fontWeight: '500' },
        ],
        label5: [
          '0.875rem',
          { lineHeight: '1rem', letterSpacing: '0', fontWeight: '500' },
        ],
        label6: [
          '0.75rem',
          { lineHeight: '1rem', letterSpacing: '0', fontWeight: '500' },
        ],
        label7: [
          '0.75rem',
          { lineHeight: '0.875rem', letterSpacing: '0', fontWeight: '500' },
        ],
        label8: [
          '0.625rem',
          { lineHeight: '0.75rem', letterSpacing: '0', fontWeight: '500' },
        ],
        body5: [
          '0.875rem',
          { lineHeight: '1.25em', letterSpacing: '0', fontWeight: '400' },
        ],
        button1: [
          '1rem',
          { lineHeight: '1.25em', letterSpacing: '0.05em', fontWeight: '500' },
        ],
        button2: [
          '0.875rem',
          { lineHeight: '1rem', letterSpacing: '0.05em', fontWeight: '500' },
        ],
        display1: [
          '7.25rem',
          { lineHeight: '1em', letterSpacing: '0', fontWeight: '400' },
        ],
        display4: [
          '2.375rem',
          { lineHeight: '1em', letterSpacing: '0', fontWeight: '400' },
        ],
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        marquee2: 'marquee2 35s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
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
        '.gradient-text': {
          'background-image':
            'linear-gradient(130deg, theme(colors.mint.700) 0%, theme(colors.mint.700) 20%, theme(colors.neutralGreen.900) 45%, theme(colors.mint.700) 65%, theme(colors.mint.700) 100%)',
          'background-clip': 'text',
          'color': 'transparent',
          '@screen lg': {
            'background-image':
              'linear-gradient(160deg, theme(colors.mint.700) 0%, theme(colors.mint.700) 20%, theme(colors.neutralGreen.900) 45%, theme(colors.mint.700) 60%, theme(colors.mint.700) 100%)',
          },
        },
        '.side-blur': {
          'mask-image':
            'linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)',
        },
        '.paused-animation': {
          'animation-play-state': 'paused',
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
