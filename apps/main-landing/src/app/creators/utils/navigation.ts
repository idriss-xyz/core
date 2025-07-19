import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
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
      router.push('/creators/app');
    } else if (user) {
      const walletAddress = user.wallet?.address as Hex | undefined;
      const fetchedCreator = await getCreatorProfile(undefined, walletAddress);
      if (fetchedCreator == null || fetchedCreator === undefined) {
        console.error(
          `Could not find creator with address ${walletAddress}, this may be a new user.`,
        );
        // TODO: Handle new user onboarding flow (e.g., redirect to a create profile page)
        return;
      }
      setCreator(fetchedCreator);
      router.push('/creators/app');
    } else {
      setIsModalOpen(true);
    }
  }, [user, router, creator, setIsModalOpen, setCreator]);

  return handleStartEarningClick;
};
