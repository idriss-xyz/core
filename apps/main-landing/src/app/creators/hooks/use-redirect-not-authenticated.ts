import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '../context/auth-context';

const useRedirectIfNotAuthenticated = () => {
  const router = useRouter();
  const { creator, creatorLoading, isLoggingOut } = useAuth();

  useEffect(() => {
    if (creatorLoading || isLoggingOut) {
      return;
    }

    if (!creator) {
      router.replace('/creators?login=true');
    }
  }, [creator, creatorLoading, router, isLoggingOut]);
};

export default useRedirectIfNotAuthenticated;
