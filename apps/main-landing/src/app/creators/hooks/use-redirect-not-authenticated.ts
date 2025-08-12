import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

import { useAuth } from '../context/auth-context';
import { setCreatorIfSessionPresent } from '../utils';

const useRedirectIfNotAuthenticated = () => {
  const router = useRouter();
  const { creator, creatorLoading, isLoggingOut, setCreator } = useAuth();
  const { ready, user } = usePrivy();

  useEffect(() => {
    if (creatorLoading || isLoggingOut || !ready) {
      return;
    }

    if (user && !creator) {
      void setCreatorIfSessionPresent(user, setCreator);
    }

    if (!user && !creator) {
      console.log('NOT AUTHENTICATED');
      router.replace('/creators?login=true');
    }
  }, [creator, creatorLoading, router, isLoggingOut, ready, user, setCreator]);
};

export default useRedirectIfNotAuthenticated;
