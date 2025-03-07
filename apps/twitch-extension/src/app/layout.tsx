import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ReactNode } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

const aeonikPro = localFont({
  src: [
    {
      path: './fonts/AeonikPro-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    { path: './fonts/AeonikPro-Regular.woff2', weight: '400', style: 'normal' },
    {
      path: './fonts/AeonikPro-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/AeonikPro-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-aeonikpro',
});

// ts-unused-exports:disable-next-line
export const metadata: Metadata = {
  title: 'IDRISS',
  description:
    'Our apps bring the power of crypto and AI to your browsing experience, empower creators through digital ownership, and help find what’s true on the internet.',
  icons: [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      sizes: '32x32',
      type: 'image/png',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      sizes: '16x16',
      type: 'image/png',
      url: '/favicon-16x16.png',
    },
  ],
  openGraph: {
    type: 'website',
    title: 'Superpowers for your internet',
    description:
      'Our apps bring the power of crypto and AI to your browsing experience, empower creators through digital ownership, and help find what’s true on the internet.',
  },
};

// ts-unused-exports:disable-next-line
export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: 'cover',
  width: 'device-width',
};

// ts-unused-exports:disable-next-line
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${aeonikPro.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        {children}

        <GoogleAnalytics gaId="G-YM1B80KWY4" />
      </body>
    </html>
  );
}
