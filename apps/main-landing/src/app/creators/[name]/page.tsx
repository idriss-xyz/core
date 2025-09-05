import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isAddress } from 'viem';

import { getPublicCreatorProfile } from '../utils';
import { type CreatorProfile } from '../donate/types';
import { OAuthCallbackHandler } from '../components/oauth-callback-handler';
import { DonateContent } from '../donate/donate-content';
import { DonateOptionsModal } from '../donate/donate-options-modal';
import { RainbowKitProviders } from '../donate/providers';

type Properties = {
  params: Promise<{ name: string }>;
};

// ts-unused-exports:disable-next-line
export async function generateMetadata({
  params,
}: Properties): Promise<Metadata> {
  const { name } = await params;
  const profile = await getPublicCreatorProfile(name);
  if (!profile) {
    return { robots: { index: false, follow: false } };
  }
  return {};
}

// ts-unused-exports:disable-next-line
export default async function CreatorProfile({ params }: Properties) {
  const { name } = await params;
  const rawProfile = await getPublicCreatorProfile(name);
  if (!rawProfile) notFound();

  const minimumAlertAmount = Number(rawProfile.minimumAlertAmount);
  const minimumTTSAmount = Number(rawProfile.minimumTTSAmount);
  const minimumSfxAmount = Number(rawProfile.minimumSfxAmount);

  const creatorProfile: CreatorProfile = {
    ...rawProfile,
    address: {
      data: rawProfile.primaryAddress,
      isValid: isAddress(rawProfile.primaryAddress),
      isFetching: false,
    },
    network: rawProfile.networks.join(','),
    token: rawProfile.tokens.join(','),
    minimumAlertAmount: Number.isNaN(minimumAlertAmount)
      ? 0
      : minimumAlertAmount,
    minimumTTSAmount: Number.isNaN(minimumTTSAmount) ? 0 : minimumTTSAmount,
    minimumSfxAmount: Number.isNaN(minimumSfxAmount) ? 0 : minimumSfxAmount,
  };

  return (
    <RainbowKitProviders>
      <OAuthCallbackHandler />
      <DonateOptionsModal />
      <DonateContent creatorProfile={creatorProfile} />
    </RainbowKitProviders>
  );
}
