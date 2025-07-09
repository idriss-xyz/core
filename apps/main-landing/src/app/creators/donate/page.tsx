'use-client';
import { Metadata } from 'next';

import { DonateContent } from './donate-content';
import { RainbowKitProviders } from './providers';

// ts-unused-exports:disable-next-line
export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

interface Properties {
  creatorName?: string;
}

// ts-unused-exports:disable-next-line
export default function Donate({ creatorName }: Properties) {
  return (
    <RainbowKitProviders>
      <DonateContent creatorName={creatorName} />
    </RainbowKitProviders>
  );
}
