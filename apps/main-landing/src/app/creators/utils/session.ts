'use client';
import { getAccessToken, User } from '@privy-io/react-auth';
import { SetStateAction } from 'react';
import { Hex } from 'viem';

import { CreatorProfileResponse, getCreatorProfile } from '.';

export const setCreatorIfSessionPresent = async (
  user: User,
  setCreator: (value: SetStateAction<CreatorProfileResponse | null>) => void,
) => {
  const walletAddress = user.wallet?.address as Hex | undefined;
  const authToken = await getAccessToken();
  if (!authToken || !user.id) {
    throw new Error('Could not get auth token or user ID for new user.');
  }
  const fetchedCreator = await getCreatorProfile(authToken);
  if (fetchedCreator == null || fetchedCreator === undefined) {
    console.error(
      `Could not find creator with address ${walletAddress}, this may be a new user.`,
    );
    return;
  }
  setCreator(fetchedCreator);
};
