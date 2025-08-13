import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '../context/auth-context';

const useRedirectIfNotAuthenticated = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { creator, creatorLoading, isLoggingOut } = useAuth();

  useEffect(() => {
    if (creatorLoading || isLoggingOut) {
      return;
    }

    if (!creator && !pathname.startsWith('/creators')) {
      router.replace('/creators?login=true');
    }
  }, [creator, creatorLoading, router, isLoggingOut, pathname]);
};

export default useRedirectIfNotAuthenticated;
