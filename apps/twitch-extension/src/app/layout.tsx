import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import { ReactNode } from 'react';

const aeonikPro = localFont({
  src: [
    {
      path: '/fonts/AeonikPro-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    { path: '/fonts/AeonikPro-Regular.woff2', weight: '400', style: 'normal' },
    {
      path: '/fonts/AeonikPro-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '/fonts/AeonikPro-Medium.woff2',
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
      <head>
        <Script
          src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${aeonikPro.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
