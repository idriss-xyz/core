import { Metadata } from 'next';

import { TopBar } from '../[name]/topbar';
import { OAuthCallbackHandler } from '../components/oauth-callback-handler';

import { CreatorProfile } from './types';
import { DonateContent } from './donate-content';
import { RainbowKitProviders } from './providers';
import { DonateOptionsModal } from './donate-options-modal';

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
      <OAuthCallbackHandler />
      <TopBar />
      <DonateOptionsModal />
      <DonateContent creatorProfile={creatorProfile} />
    </RainbowKitProviders>
  );
}
