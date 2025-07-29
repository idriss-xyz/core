'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, usePrivy } from '@privy-io/react-auth';
import { Hex } from 'viem';

import { useAuth } from '../context/auth-context';

import { getCreatorProfile } from '.';

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
    } else if (user) {
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
      router.push('/creators/app/setup/payment-methods');
    } else {
      setIsModalOpen(true);
    }
  }, [user, router, creator, setIsModalOpen, setCreator]);

  return handleStartEarningClick;
};
