import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ReactNode } from 'react';
import { headers } from 'next/headers';
import { GoogleAnalytics } from '@next/third-parties/google';

import { CreatorsProviders } from './creators-providers';
import { PrivyModalHider } from './components/privy-modal-hider';

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
  ? new URL(
      `https://${process.env.RAILWAY_PUBLIC_DOMAIN.replace(/^www\./, '')}`,
    )
  : new URL('https://idriss.xyz');

// ts-unused-exports:disable-next-line
export const metadata: Metadata = {
  title: 'IDRISS - Instant donations for Twitch & YouTube streamers',
  description:
    'Accept donations on Twitch and YouTube with instant payouts, no chargebacks, and only 1% fees. A modern and secure donation tool for streamers who want to keep more of their earnings.',
  openGraph: {
    title: 'IDRISS - Instant donations for streamers',
    description:
      'Accept donations on Twitch and YouTube with instant payouts, no chargebacks, and only 1% fees.',
    type: 'website',
    siteName: 'IDRISS',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'IDRISS - Streamer monetization platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IDRISS - Instant donations for streamers',
    description:
      'Accept donations on Twitch and YouTube with instant payouts, no chargebacks, and only 1% fees.',
    images: ['/og.png'],
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
  other: {
    'base:app_id': '693b3e008a7c4e55fec73eb6',
  },
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://idriss.xyz/#organization',
        'name': 'IDRISS',
        'url': 'https://idriss.xyz',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://idriss.xyz/og.png',
        },
        'sameAs': [
          'https://x.com/idriss_xyz',
          'https://discord.com/invite/RJhJKamjw5',
          'https://github.com/idriss-xyz',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://idriss.xyz/#website',
        'url': 'https://idriss.xyz',
        'name': 'IDRISS',
        'description':
          'Accept donations on Twitch and YouTube with instant payouts, no chargebacks, and only 1% fees.',
        'publisher': { '@id': 'https://idriss.xyz/#organization' },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://idriss.xyz/#faq',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How do I accept donations on Twitch?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text':
                'With IDRISS, you can accept donations on Twitch by creating a free account and adding our browser source to OBS. Donations appear as alerts on your stream and you get instant payouts.',
            },
          },
          {
            '@type': 'Question',
            'name': 'What are the fees for IDRISS donations?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text':
                'IDRISS charges a flat 1% fee on donations. This is significantly lower than traditional platforms like Streamlabs or PayPal that take 3-5% cuts.',
            },
          },
          {
            '@type': 'Question',
            'name': 'How fast are payouts compared to Twitch?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text':
                'IDRISS payouts are instant. Unlike Twitch which holds your money for 15-45 days, donations are available immediately. No waiting periods, no payout thresholds.',
            },
          },
          {
            '@type': 'Question',
            'name': 'Can I get chargebacks on IDRISS donations?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text':
                'No. IDRISS donations are final and cannot be charged back. This protects streamers from fraudulent chargebacks that are common with PayPal and credit card donations.',
            },
          },
          {
            '@type': 'Question',
            'name': 'Is IDRISS a good alternative to Streamlabs?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text':
                'Yes. IDRISS offers lower fees (1% vs 3-5%), instant payouts, and no chargebacks compared to Streamlabs. It works alongside your existing setup - you can use both and let viewers choose.',
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <body
        className={`${aeonikPro.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PrivyModalHider />
        <CreatorsProviders>{children}</CreatorsProviders>
        <GoogleAnalytics gaId="G-YM1B80KWY4" />
      </body>
    </html>
  );
}
