import type { Metadata } from 'next';
import '../globals.css';
import { ReactNode } from 'react';

const DEPLOYMENT_URL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? new URL(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`)
  : undefined;

// ts-unused-exports:disable-next-line
export const metadata: Metadata = {
  title: 'IDRISS DAO',
  description:
    'The decentralized organization overseeing the economy and governance of the IDRISS app.',
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
      'The decentralized organization overseeing the economy and governance of the IDRISS app.',
    images: [
      {
        url: '/og-dao.png',
      },
    ],
  },
  other: {
    'base:app_id': '693b3e008a7c4e55fec73eb6',
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
