'use client';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

import { useAuth } from '../context/auth-context';

import { CreatorProfileResponse } from './types';
import { setCreatorIfSessionPresent } from './session';

import { editCreatorProfile } from '.';

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

export const useStartEarningNavigation = () => {
  const router = useRouter();
  const { user, getAccessToken } = usePrivy();
  const { setIsModalOpen, creator, setCreator } = useAuth();

  const handleStartEarningClick = useCallback(async () => {
    // If user is logged in, redirect to app
    if (user && creator) {
      await removeDonorStatus(creator.isDonor, creator.name, getAccessToken);
      if (creator.doneSetup) {
        router.push('/creators/app/earnings/stats-and-history');
      } else {
        router.push('/creators/app/setup/payment-methods');
      }
    } else if (user && !creator) {
      await setCreatorIfSessionPresent(user, setCreator);
      router.push('/creators/app/setup/payment-methods');
    } else {
      setIsModalOpen(true);
    }
  }, [user, router, creator, setIsModalOpen, setCreator, getAccessToken]);

  return handleStartEarningClick;
};
