// import { MAIN_LANDING_LINK } from '@idriss-xyz/constants';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ReactNode } from 'react';

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

const DEPLOYMENT_URL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? new URL(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`)
  : undefined;

// ts-unused-exports:disable-next-line
export const metadata: Metadata = {
  title: 'Superpowers for your internet',
  description:
    'Our apps bring the power of crypto and AI to your browsing experience, empower creators through digital ownership, and help find what’s true on the internet.',
  // TODO: uncomment before final release
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
  metadataBase: DEPLOYMENT_URL,
  openGraph: {
    type: 'website',
    url: DEPLOYMENT_URL,
    title: 'Superpowers for your internet',
    description:
      'Our apps bring the power of crypto and AI to your browsing experience, empower creators through digital ownership, and help find what’s true on the internet.',
    images: [
      {
        url: '/og.png',
      },
    ],
  },
};

// ts-unused-exports:disable-next-line
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${aeonikPro.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
