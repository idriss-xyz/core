import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isAddress } from 'viem';

import Donate from '../donate/page';
import { getPublicCreatorProfile } from '../utils';
import { type CreatorProfile } from '../donate/types';


type Properties = {
  params: { name:string };
};

export async function generateMetadata({
  params,
}: Properties): Promise<Metadata> {
  const profile = await getPublicCreatorProfile(params.name);

  if (!profile) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {};
}

// ts-unused-exports:disable-next-line
export default async function CreatorProfile({ params }: Properties) {
  const { name } = params;
  const rawProfile = await getPublicCreatorProfile(name);

  if (!rawProfile) {
    notFound();
  }

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

  return <Donate creatorProfile={creatorProfile} />;
}
