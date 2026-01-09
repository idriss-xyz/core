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

  const displayName = profile.displayName ?? profile.name;
  const title = `${displayName} - IDRISS`;
  const description = `Support ${displayName} with crypto donations on IDRISS`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: profile.profilePictureUrl ? [profile.profilePictureUrl] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: profile.profilePictureUrl ? [profile.profilePictureUrl] : [],
    },
  };
}

// ts-unused-exports:disable-next-line
export default async function CreatorProfile({ params }: Properties) {
  const { name } = await params;
  const rawProfile = await getPublicCreatorProfile(name);
  if (!rawProfile || rawProfile.isDonor) notFound();

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

  const displayName = rawProfile.displayName ?? rawProfile.name;
  const profileUrl = `https://idriss.xyz/${rawProfile.name}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: displayName,
      url: profileUrl,
      ...(rawProfile.profilePictureUrl && {
        image: rawProfile.profilePictureUrl,
      }),
    },
    isPartOf: { '@id': 'https://idriss.xyz/#website' },
  };

  return (
    <RainbowKitProviders>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OAuthCallbackHandler />
      <DonateOptionsModal />
      <DonateContent creatorProfile={creatorProfile} />
    </RainbowKitProviders>
  );
}
