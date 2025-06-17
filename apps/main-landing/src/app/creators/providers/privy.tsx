'use client';
import { useCallback, ReactNode } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

import { useAuth } from '../context/privy-auth-context';

interface PrivyAuthWrapperProperties {
  children: ReactNode;
}

export const PrivyAuthWrapper: React.FC<PrivyAuthWrapperProperties> = ({
  children,
}) => {
  const { getToken } = useAuth();

  // Create a callback to get the token for Privy
  const getCustomToken = useCallback(async () => {
    try {
      const token = await getToken();
      return token;
    } catch (error) {
      console.error('Error retrieving token for Privy:', error);
      return;
    }
  }, [getToken]);

  return (
    <PrivyProvider
      appId={process.env.PRIVY_APP_ID ?? ''}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#76C282',
        },
        customAuth: {
          isLoading: false, // TODO: Implement loading state
          getCustomAccessToken: getCustomToken,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};
