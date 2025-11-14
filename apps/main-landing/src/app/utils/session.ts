'use client';
import { getAccessToken, User } from '@privy-io/react-auth';
import { SetStateAction } from 'react';
import { Hex } from 'viem';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

import { CreatorProfileResponse } from './types';

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
  isDonor?: boolean,
  referrerAddress?: string | null,
): Promise<void> => {
  if (!address || !name || !privyId) {
    throw new Error('No wallet address, name or privyId to create creator');
  }

  if (!authToken) {
    throw new Error('No auth token provided');
  }

  const stringifiedBody = JSON.stringify({
    address: address,
    primaryAddress: address,
    displayName,
    profilePictureUrl,
    name,
    email,
    privyId,
    isDonor,
  });

  const creatorProfileBackendEndpoint = referrerAddress
    ? `creator-profile-from-referral/${referrerAddress}`
    : 'creator-profile';

  const response = await fetch(
    `${CREATOR_API_URL}/${creatorProfileBackendEndpoint}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: stringifiedBody,
    },
  );

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

export const deleteCreatorAccount = async (authToken: string) => {
  const response = await fetch(`${CREATOR_API_URL}/creator-profile/me`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Deletion failed');
  }
};

// If user is donor, remove donor status (become creator with page)
export const removeDonorStatus = async (
  isDonor: boolean,
  creatorName: string,
  getAccessToken: () => Promise<string | null>,
) => {
  if (isDonor) {
    const authToken = await getAccessToken();
    if (!authToken) {
      console.error('No auth token to edit creator profile');
      return;
    }
    await editCreatorProfile(creatorName, { isDonor: false }, authToken);
  }
};

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
  await removeDonorStatus(
    fetchedCreator.isDonor,
    fetchedCreator.name,
    getAccessToken,
  );
  setCreator(fetchedCreator);
};
