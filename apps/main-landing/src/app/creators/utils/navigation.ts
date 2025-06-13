import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ProviderEnum } from '@dynamic-labs/sdk-api-core';

import { useAuth } from '../context/auth-context';

import { getCreatorProfile } from '.';

export const useStartEarningNavigation = () => {
  const router = useRouter();
  const { user } = useDynamicContext();
  const { setIsModalOpen, creator, setCreator } = useAuth();

  const handleStartEarningClick = useCallback(async () => {
    // If user is logged in, redirect to app
    if (user && creator) {
      router.push('/creators/app');
    } else if (user) {
      const twitchName = user.verifiedCredentials.find((credential) => {
        return credential.oauthProvider === ProviderEnum.Twitch;
      })?.oauthUsername;
      const fetchedCreator = await getCreatorProfile(twitchName);
      if (fetchedCreator == null || fetchedCreator === undefined) {
        console.error(
          `Could not find creator with name ${twitchName}, clear localStorage and try again`,
        );
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
