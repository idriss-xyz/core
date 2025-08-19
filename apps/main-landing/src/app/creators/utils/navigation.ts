'use client';

import { SetStateAction, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, usePrivy, User } from '@privy-io/react-auth';
import { Hex } from 'viem';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

import { useAuth } from '../context/auth-context';

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

export const useStartEarningNavigation = () => {
  const router = useRouter();
  const { user } = usePrivy();
  const { setIsModalOpen, creator, setCreator } = useAuth();

  const handleStartEarningClick = useCallback(async () => {
    // If user is logged in, redirect to app
    if (user && creator) {
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
  }, [user, router, creator, setIsModalOpen, setCreator]);

  return handleStartEarningClick;
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
  setCreator(fetchedCreator);
};
