import { getAddress } from 'viem';
import { CHAIN, CREATOR_API_URL } from '@idriss-xyz/constants';

import { CreatorProfileResponse } from './types';

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

export const getCreatorNameAndPicOrAnon = async (
  address: string,
): Promise<{ profilePicUrl: string | undefined; name: string }> => {
  const formattedAddress = getAddress(address);
  try {
    const response = await fetch(
      `${CREATOR_API_URL}/creator-profile/address/${formattedAddress}`,
    );
    if (response.ok) {
      const profile = (await response.json()) as CreatorProfileResponse;
      return {
        profilePicUrl: profile.profilePictureUrl ?? undefined,
        name: profile.name ?? 'anon',
      };
    }
    return { profilePicUrl: undefined, name: 'anon' };
  } catch (error) {
    console.error('Error fetching creator profile by address.', error);
    return { profilePicUrl: undefined, name: 'anon' };
  }
};

export const getTimeRemaining = (endDate: number): string => {
  const now = new Date();
  const end = new Date(Number(endDate));

  const diffInMs = end.getTime() - now.getTime();

  if (diffInMs <= 0) {
    return 'Goal ended';
  }

  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 1) {
    return '1 day left';
  }

  return `${diffInDays} days left`;
};

export const isHomeCallback = (u: string) => {
  try {
    const url = new URL(u, window.location.origin);
    // Only treat it as home when it's exactly "/" with no query parameters
    return url.pathname === '/' && url.search === '';
  } catch {
    // Fallback when u is already just a pathname
    return u === '/';
  }
};

export {
  setCreatorIfSessionPresent,
  getCreatorProfile,
  saveCreatorProfile,
  editCreatorProfile,
  deleteCreatorAccount,
} from './session';
export {
  getPublicCreatorProfile,
  getPublicCreatorProfileBySlug,
} from './server-session';
export { useStartEarningNavigation } from './navigation';
export { createDonationGoal } from './donation-goals';
