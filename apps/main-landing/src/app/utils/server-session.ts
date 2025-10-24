/* Server util functions */
import { Hex } from 'viem';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

import { CreatorProfileResponse } from './types';

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
    `${CREATOR_API_URL}/creator-profile/alert-overlay/${slug}`,
  );
  if (!response.ok) {
    return;
  }
  const data = (await response.json()) as CreatorProfileResponse;
  return data;
};
