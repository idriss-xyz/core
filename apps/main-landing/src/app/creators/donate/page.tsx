import { Metadata } from 'next';

import { DonatePageTopBar } from '../[name]/topbar';
import { OAuthCallbackHandler } from '../components/oauth-callback-handler';

import { DonateContent } from './donate-content';
import { RainbowKitProviders } from './providers';

// ts-unused-exports:disable-next-line
export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

// ts-unused-exports:disable-next-line
export default function Donate() {
  return (
    <RainbowKitProviders>
      <OAuthCallbackHandler />
      <DonatePageTopBar />
      <DonateContent />
    </RainbowKitProviders>
  );
}
