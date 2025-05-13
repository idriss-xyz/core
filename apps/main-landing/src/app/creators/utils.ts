import { Hex } from 'viem';
import { CHAIN } from '@idriss-xyz/constants';

import { CREATOR_API_URL } from './donate/constants';

type BrowserBasedImageProperties = {
  svgSrc: string;
  pngSrc: string;
};

const isAppleBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent;

  return (
    /Macintosh|iPhone|iPad|iPod/.test(ua) &&
    ua.includes('Safari') &&
    !/Chrome|CriOS|FxiOS/.test(ua)
  );
};

export const browserBasedSource = ({
  svgSrc,
  pngSrc,
}: BrowserBasedImageProperties) => {
  if (isAppleBrowser()) {
    return pngSrc;
  }

  return svgSrc;
};

// TODO: check location and use zod
type CreatorProfile = {
  id: number;
  address: Hex;
  primaryAddress: Hex;
  name: string;
  profilePictureUrl: string;
  donationUrl: string;
  obsUrl: string;
  minimumAlertAmount: number;
  minimumTTSAmount: number;
  minimumSfxAmount: number;
  voiceId: number;
  voiceMuted: boolean;
  networks: string[];
  tokens: string[];
};

// TODO: Check location of all following functions
export const getCreatorProfile = async (
  name?: string | null,
): Promise<CreatorProfile | undefined> => {
  if (!name) {
    console.error('No name to get creator');
    return;
  }

  const response = await fetch(`${CREATOR_API_URL}/creator-profile/${name}`);
  if (!response.ok) {
    return;
  }
  const data = (await response.json()) as CreatorProfile;
  return data;
};

export const saveCreatorProfile = async (
  address: Hex,
  name?: string | null,
): Promise<void> => {
  try {
    if (!address || !name) {
      console.error('No wallet address or name to create creator');
    }

    const response = await fetch(`${CREATOR_API_URL}/creator-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        primaryAddress: address,
        name,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to register creator');
    }
  } catch (error) {
    console.error('Error registering creator:', error);
  }
};

export const editCreatorProfile = async (
  name: string,
  profile: Partial<CreatorProfile>,
): Promise<void> => {
  try {
    if (!name) {
      console.error('No name provided to edit creator profile');
      return;
    }

    const response = await fetch(`${CREATOR_API_URL}/creator-profile/${name}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...profile,
      }),
    });

    if (!response.ok) {
      return;
    }
  } catch (error) {
    console.error('Error updating creator profile:', error);
  }
};

export const saveDonationParameters = async (
  address: Hex,
  minimumAlertAmount: number,
  minimumTTSAmount: number,
  minimumSfxAmount: number,
): Promise<void> => {
  try {
    if (
      !address ||
      !minimumAlertAmount ||
      !minimumTTSAmount ||
      !minimumSfxAmount
    ) {
      console.error('Missing donation parameters');
    }
    const response = await fetch(`${CREATOR_API_URL}/donation-parameters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        minimumAlertAmount,
        minimumTTSAmount,
        minimumSfxAmount,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to register donation parameters');
    }
  } catch (error) {
    console.error('Error registering donation parameters:', error);
  }
};

export const getChainShortNamesFromIds = (chainsIds: number[]) => {
  //eslint-disable-next-line unicorn/no-array-reduce
  return chainsIds
    .reduce((previous, chainId) => {
      return [
        ...previous,
        Object.values(CHAIN).find((chain) => {
          return chain.id === chainId;
        })?.shortName ?? '',
      ];
    }, [] as string[])
    .filter(Boolean);
};

export const getChainIdsFromShortNames = (shortNames: string[]) => {
  return shortNames.map((shortName) => {
    return (
      Object.values(CHAIN).find((chain) => {return chain.shortName === shortName})?.id ??
      0
    );
  });
};
