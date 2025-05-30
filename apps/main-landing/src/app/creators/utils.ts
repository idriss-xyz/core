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
  displayName: string;
  profilePictureUrl: string;
  donationUrl: string;
  obsUrl: string;
  minimumAlertAmount: number;
  minimumTTSAmount: number;
  minimumSfxAmount: number;
  voiceId: number;
  alertMuted: boolean;
  ttsMuted: boolean;
  sfxMuted: boolean;
  networks: string[];
  tokens: string[];
  dynamicId: string;
  oauthAccountId?: string;
};

type TwitchAccountInfo = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
};

export const getCreatorProfile = async (
  name?: string | null,
  address?: Hex | null,
): Promise<CreatorProfile | undefined> => {
  if (!name && !address) {
    console.error('No name or address to get creator');
    return;
  }

  const lookPath = address ? `address/${address}` : `${name}`;

  const response = await fetch(
    `${CREATOR_API_URL}/creator-profile/${lookPath}`,
  );
  if (!response.ok) {
    return;
  }
  const data = (await response.json()) as CreatorProfile;
  return data;
};

export const saveCreatorProfile = async (
  address: Hex,
  name?: string | null,
  displayName?: string | null,
  profilePictureUrl?: string | null,
  oauthAccountId?: string | null,
  dynamicId?: string | null,
  authToken?: string,
): Promise<void> => {
  try {
    if (!address || !name || !dynamicId) {
      console.error('No wallet address, name or dynamicId to create creator');
      return;
    }

    if (!authToken) {
      console.error('No auth token provided');
      return;
    }

    const response = await fetch(`${CREATOR_API_URL}/creator-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        address: address,
        primaryAddress: address,
        displayName,
        profilePictureUrl,
        name,
        dynamicId,
        oauthAccountId,
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
  authToken?: string,
): Promise<boolean> => {
  try {
    if (!name) {
      console.error('No name provided to edit creator profile');
      return false;
    }

    if (!authToken) {
      console.error('No auth token provided');
      return false;
    }

    const response = await fetch(`${CREATOR_API_URL}/creator-profile/${name}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        ...profile,
      }),
    });

    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error updating creator profile:', error);
    return false;
  }
};

export const getTwitchAccountInfo = async (oauthAccountId: string) => {
  const response = await fetch(
    `${CREATOR_API_URL}/twitch-account-info?oauthAccountId=${oauthAccountId}`,
  );
  if (!response.ok) {
    return;
  }
  const data = (await response.json()) as TwitchAccountInfo;
  return data;
};

export const getChainShortNamesFromIds = (chainsIds: number[]) => {
  return (
    chainsIds
      //eslint-disable-next-line unicorn/no-array-reduce
      .reduce((previous, chainId) => {
        return [
          ...previous,
          Object.values(CHAIN).find((chain) => {
            return chain.id === chainId;
          })?.shortName ?? '',
        ];
      }, [] as string[])
      .filter(Boolean)
  );
};

export const getChainIdsFromShortNames = (shortNames: string[]) => {
  return shortNames.map((shortName) => {
    return (
      Object.values(CHAIN).find((chain) => {
        return chain.shortName === shortName;
      })?.id ?? 0
    );
  });
};
