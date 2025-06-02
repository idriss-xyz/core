import { Metadata } from 'next';
import { metadata as landingMetadata } from '@/app/layout';

export const metadata: Metadata = {
  ...landingMetadata,
  description:
    'Creator monetization app that helps you earn more with instant payouts and near-zero platform cuts.',
  openGraph: {
    title: 'Make more, grow faster, take control',
    description:
      'Creator monetization app that helps you earn more with instant payouts and near-zero platform cuts.',
    images: [
      {
        url: '/og-creators.png',
      },
    ],
  },
};

export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
