'use client';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

import { useAuth } from '../context/auth-context';

import { removeDonorStatus, setCreatorIfSessionPresent } from './session';

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
