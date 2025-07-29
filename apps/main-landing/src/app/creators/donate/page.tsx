import { Metadata } from 'next';

import { CreatorProfile } from './types';
import { DonateContent } from './donate-content';
import { RainbowKitProviders } from './providers';

// ts-unused-exports:disable-next-line
export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

interface Properties {
  creatorProfile?: CreatorProfile;
}

// ts-unused-exports:disable-next-line
export default function Donate({ creatorProfile }: Properties) {
  console.log(creatorProfile);
  return (
    <RainbowKitProviders>
      <DonateContent creatorProfile={creatorProfile} />
    </RainbowKitProviders>
  );
}
