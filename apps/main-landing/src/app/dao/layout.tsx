import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';

const DEPLOYMENT_URL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? new URL(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`)
  : undefined;

// ts-unused-exports:disable-next-line
export const metadata: Metadata = {
  title: 'IDRISS DAO',
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
export default function DaoLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="dao-page-container">{children}</div>;
}
