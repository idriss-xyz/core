import { Metadata } from 'next';

import { CreatorProfile } from './types';
import { DonateContent } from './donate-content';
import { RainbowKitProviders } from './providers';
import { DonateOptionsModal } from './donate-options-modal';
import { TopBar } from '../[name]/topbar';

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
  return (
    <RainbowKitProviders>
      <TopBar />
      <DonateOptionsModal />
      <DonateContent creatorProfile={creatorProfile} />
    </RainbowKitProviders>
  );
}
