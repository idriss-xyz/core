import plugin from 'tailwindcss/plugin';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.resolve(__dirname, '../ui/src/**/*.{ts,tsx}'),
    path.resolve(__dirname, '../wallet-connect/src/**/*.{ts,tsx}'),
    path.resolve(__dirname, '../../apps/extension/src/**/*.{ts,tsx}'),
    path.resolve(__dirname, '../../apps/main-landing/src/**/*.{ts,tsx}'),
    path.resolve(__dirname, '../../apps/twitch-extension/src/**/*.{ts,tsx}'),
    path.resolve(__dirname, '../../apps/ponder-indexer/src/**/*.{ts,tsx}'),
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
      blue: {
        200: '#F2F6FF',
        300: '#E5EBFF',
        400: '#004DE5',
        500: '#003FCC',
        600: '#0032A8',
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
      gray: {
        200: '#E5E5E5',
        300: '#757575',
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
      padding: {
        'DEFAULT': '1rem',
        'xs': '1rem',
        'sm': 0,
        'lg': 0,
        'xl': 0,
        '2xl': 0,
        '3xl': 0,
        '4xl': 0,
      },
    },
    extend: {
      screens: {
        'xs': '400px',
        'sm': '576px',
        'md': '768px',
        '2xl': '1440px',
        '3xl': '1536px',
        '4xl': '1696px',
      },
      boxShadow: {
        'xs': '0px 1px 4px 0px #1018280D',
        'sm': '0px 1px 2px 0px #1018280F, 0px 1px 10px 0px #1018281A',
        'md': '0px 2px 8px -2px #1018280A, 0px 4px 14px -2px #1018281A',
        'lg': '0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814',
        'xl': '0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814',
        '2xl': '0px 24px 48px -12px #1018282E',
        '3xl': '0px 32px 64px -12px #1018283D',
        'input': '0px 0px 0px 4px #F2F2F224',
        'card': '0px 0px 0px 6px #FFFFFF14',
      },
      blur: {
        md: '10px',
      },
      zIndex: {
        1: '1',
        topBar: '10',
        dialog: '20',
        alert: '99999',
        notification: '99999',
        extensionPopup: '100000',
        portal: '100001',
        scrollbar: '100010',
        stickyNavbar: '100011',
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
          '2rem',
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
        button1: [
          '1rem',
          { lineHeight: '1.25em', letterSpacing: '0.05em', fontWeight: '500' },
        ],
        button2: [
          '0.875rem',
          { lineHeight: '1rem', letterSpacing: '0.05em', fontWeight: '500' },
        ],
      },
      animation: {
        'collapsible-slide-down': 'collapsibleSlideDown 200ms ease-out',
        'collapsible-slide-up': 'collapsibleSlideUp 200ms ease-out',
        'marquee': 'marquee 35s linear infinite',
        'marquee2': 'marquee2 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'marquee2-reverse': 'marquee2-reverse 35s linear infinite',
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 200ms ease-in',
        'slide-in-from-top': 'slide-in-from-top 200ms ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 200ms ease-out',
        'slide-in-from-left': 'slide-in-from-left 200ms ease-out',
        'slide-in-from-right': 'slide-in-from-right 200ms ease-out',
        'progress-glow': 'progress-glow 1s ease-in-out infinite alternate',
        'progress-complete': 'progress-complete 500ms ease-in-out',
      },
      keyframes: {
        'collapsibleSlideDown': {
          '0%': { height: 0, opacity: 0 },
          '90%': {
            opacity: 0.7,
          },
          '100%': {
            height: 'var(--radix-collapsible-content-height)',
            opacity: 1,
          },
        },
        'collapsibleSlideUp': {
          '0%': {
            height: 'var(--radix-collapsible-content-height)',
            opacity: 1,
          },
          '10%': {
            opacity: 0.5,
          },
          '100%': { height: 0, opacity: 0 },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee2': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'marquee2-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'swipeRight': {
          '0%': { translate: '0 0' },
          '100%': { translate: '100% 0' },
        },
        'swipeLeft': {
          '0%': { translate: '100% 0' },
          '100%': { translate: '0 0' },
        },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'fade-out': { '0%': { opacity: 1 }, '100%': { opacity: 0 } },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-4px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(4px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          '0%': { transform: 'translateX(-4px)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          '0%': { transform: 'translateX(4px)' },
          '100%': { transform: 'translateX(0)' },
        },
        'progress-glow': {
          '0%': {
            opacity: '0.4',
            transform: 'scale(1)',
          },
          '100%': {
            opacity: '0.7',
            transform: 'scale(1.05)',
          },
        },
        'progress-complete': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    '@tailwindcss/forms',
    plugin(function ({ addUtilities, addComponents }) {
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
        '.gradient-text-2': {
          'background-image':
            'linear-gradient(205.71deg, #022B1E 18.92%, #079165 78.9%)',
          'background-clip': 'text',
          'color': 'transparent',
          'position': 'relative',
        },
        '.gradient-text-2::after': {
          'display': 'block',
          'content': "''",
          'background':
            'radial-gradient(65.65% 168.51% at 47.77% 27.64%, #000A05 0%, #176410 100%)',
          'width': '100%',
          'height': '100%',
          'mix-blend-mode': 'color',
          'position': 'absolute',
          'top': '0',
          'left': '0',
        },
        '.gradient-text-blue': {
          'background-image':
            'linear-gradient(94deg, #FFF 47.38%, #004DE5 118.14%)',
          'background-clip': 'text',
          'color': 'transparent',
        },
        '.side-blur': {
          'mask-image':
            'linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)',
        },
        '.side-blur-2': {
          'mask-image':
            'linear-gradient(to right, rgba(2, 43, 30, 0), rgba(2, 44, 31, 0.6) 80px, #056244 calc(100% - 80px), rgba(3, 75, 52, 0))',
        },
        '.paused-animation': {
          'animation-play-state': 'paused',
        },
        '.p-safe': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingRight: 'env(safe-area-inset-right)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.px-safe': {
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.py-safe': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
      };
      addUtilities(newUtilities);
      addComponents({
        '.container': {
          '@screen xs': {
            maxWidth: 'none',
          },
          '@screen sm': {
            maxWidth: '544px',
          },
          '@screen md': {
            maxWidth: '704px',
          },
          '@screen lg': {
            maxWidth: '968px',
          },
          '@screen xl': {
            maxWidth: '1168px',
          },
          '@screen 2xl': {
            maxWidth: '1216px',
          },
          '@screen 3xl': {
            maxWidth: '1312px',
          },
          '@screen 4xl': {
            maxWidth: '1600px',
          },
        },
      });
    }),
  ],
};
