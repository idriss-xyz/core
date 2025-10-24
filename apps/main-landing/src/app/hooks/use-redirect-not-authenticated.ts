import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

import { useAuth } from '../context/auth-context';
import { isHomeCallback, setCreatorIfSessionPresent } from '../utils';

const useRedirectIfNotAuthenticated = () => {
  const router = useRouter();
  const { creator, creatorLoading, isLoggingOut, setCreator } = useAuth();
  const { ready, user } = usePrivy();
  const pathname = usePathname();

  useEffect(() => {
    if (creatorLoading || isLoggingOut || !ready) {
      return;
    }

    if (user && !creator) {
      void setCreatorIfSessionPresent(user, setCreator);
    }
    if (!user && !creator) {
      if (pathname.startsWith('/app')) {
        router.replace('/?login=true');
      } else if (isHomeCallback(pathname)) {
        return;
      } else {
        router.replace('/');
      }
    }
  }, [
    creator,
    creatorLoading,
    router,
    isLoggingOut,
    ready,
    user,
    pathname,
    setCreator,
  ]);
};

export default useRedirectIfNotAuthenticated;
