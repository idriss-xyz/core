import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './dao/globals.css';
import { ReactNode } from 'react';
import { headers } from 'next/headers';
import { GoogleAnalytics } from '@next/third-parties/google';

import { CreatorsProviders } from './creators-providers';
import { PrivyModalHider } from './dao/components/privy-modal-hider';

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
    'Creator monetization app that helps you earn more with instant payouts and near-zero platform cuts.',
  openGraph: {
    title: 'Make more, grow faster, take control',
    description:
      'Creator monetization app that helps you earn more with instant payouts and near-zero platform cuts.',
    images: [
      {
        url: '/og.png',
      },
    ],
  },
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
};

// ts-unused-exports:disable-next-line
export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: 'cover',
  width: 'device-width',
};

// ts-unused-exports:disable-next-line
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
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
        <PrivyModalHider />
        <CreatorsProviders>{children}</CreatorsProviders>
        <GoogleAnalytics gaId="G-YM1B80KWY4" />
      </body>
    </html>
  );
}
