import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

import { useAuth } from '../context/auth-context';

const useRedirectIfNotAuthenticated = () => {
  const router = useRouter();
  const { creatorLoading, creator } = useAuth();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (!ready || creatorLoading) {
      return;
    }
    if (!authenticated || !creator) {
      router.replace('/creators?login=true');
    }
  }, [ready, authenticated, creatorLoading, router, creator]);
};

export default useRedirectIfNotAuthenticated;
