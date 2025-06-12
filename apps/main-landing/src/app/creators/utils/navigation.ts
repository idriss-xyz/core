import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

import { useAuth } from '../context/auth-context';

export const useStartEarningNavigation = () => {
  const router = useRouter();
  const { user } = useDynamicContext();
  const { setIsModalOpen } = useAuth();

  const handleStartEarningClick = useCallback(() => {
    // If user is logged in, redirect to app
    if (user) {
      router.push('/creators/app');
    } else {
      setIsModalOpen(true);
    }
  }, [user, router, setIsModalOpen]);

  return handleStartEarningClick;
};
