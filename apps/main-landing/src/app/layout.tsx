import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ReactNode } from 'react';
import { headers } from 'next/headers';
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

const DEPLOYMENT_URL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? new URL(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`)
  : undefined;

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
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 0.9,
};

// ts-unused-exports:disable-next-line
export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const headersList = await headers();

  const withMaintenance = headersList.get('x-with-maintenance');
  if (withMaintenance === 'true') {
    return (
      <html lang="en">
        <body className={`${aeonikPro.variable} font-sans antialiased`}>
          <div className="flex h-screen items-center justify-center bg-mint-400 text-mint-100">
            <h1 className="text-heading1">SOON...</h1>
          </div>
        </body>
      </html>
    );
  }

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
