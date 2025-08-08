import { Hex } from 'viem';
import { CHAIN, CREATOR_API_URL } from '@idriss-xyz/constants';

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
export type CreatorProfileResponse = {
  id: number;
  address: Hex;
  primaryAddress: Hex;
  name: string;
  displayName?: string;
  profilePictureUrl?: string;
  email?: string;
  receiveEmails?: boolean;
  donationUrl: string;
  obsUrl?: string;
  joinedAt: string;
  doneSetup: boolean;
  minimumAlertAmount: number;
  minimumTTSAmount: number;
  minimumSfxAmount: number;
  voiceId: string;
  alertEnabled: boolean;
  ttsEnabled: boolean;
  sfxEnabled: boolean;
  networks: string[];
  tokens: string[];
  privyId: string;
  customBadWords: string[];
  alertSound: string;
};

export const getPublicCreatorProfile = async (
  name?: string | null,
  address?: Hex | null,
): Promise<CreatorProfileResponse | undefined> => {
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
  const data = (await response.json()) as CreatorProfileResponse;
  return data;
};

export const getPublicCreatorProfileBySlug = async (
  slug: string | null,
): Promise<CreatorProfileResponse | undefined> => {
  if (!slug) {
    console.error('No slug to get creator');
    return;
  }

  const response = await fetch(
    `${CREATOR_API_URL}/creator-profile/donation-overlay/${slug}`,
  );
  if (!response.ok) {
    return;
  }
  const data = (await response.json()) as CreatorProfileResponse;
  return data;
};

export const getCreatorProfile = async (
  authToken: string,
): Promise<CreatorProfileResponse | undefined> => {
  if (!authToken) {
    console.error('No slug to get creator');
    return;
  }

  const response = await fetch(`${CREATOR_API_URL}/creator-profile/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    return;
  }
  const data = (await response.json()) as CreatorProfileResponse;
  return data;
};

export const saveCreatorProfile = async (
  address: Hex,
  name?: string | null,
  displayName?: string | null,
  profilePictureUrl?: string | null,
  email?: string | null,
  privyId?: string | null,
  authToken?: string,
): Promise<void> => {
  if (!address || !name || !privyId) {
    throw new Error('No wallet address, name or privyId to create creator');
  }

  if (!authToken) {
    throw new Error('No auth token provided');
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
      email,
      privyId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to register creator');
  }
};

export const editCreatorProfile = async (
  name: string,
  profile: Partial<CreatorProfileResponse>,
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

// TODO remove
// ts-unused-exports:disable-next-line
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

// TODO remove
// ts-unused-exports:disable-next-line
export const getChainIdsFromShortNames = (shortNames: string[]) => {
  return shortNames.map((shortName) => {
    return (
      Object.values(CHAIN).find((chain) => {
        return chain.shortName === shortName;
      })?.id ?? 0
    );
  });
};

export { useStartEarningNavigation } from './navigation';
