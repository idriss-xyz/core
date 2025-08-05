'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { DonationData } from '@idriss-xyz/constants';
import {
  usePrivy,
  User,
  useSubscribeToJwtAuthWithFlag,
} from '@privy-io/react-auth';
import { Hex } from 'viem';
import { useRouter } from 'next/navigation';

import {
  CreatorProfileResponse,
  getCreatorProfile,
  saveCreatorProfile,
} from '../utils';

type AuthContextType = {
  donations: DonationData[];
  addDonation: (donation: DonationData) => void;
  newDonationsCount: number;
  markDonationsAsSeen: () => void;
  oauthError: string | null;
  isLoginModalOpen: boolean;
  creator: CreatorProfileResponse | null;
  creatorLoading: boolean;
  setCreatorLoading: (loading: boolean) => void;
  setOauthError: (error: string | null) => void;
  clearOauthError: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setCreator: (creator: CreatorProfileResponse | null) => void;
  setCustomAuthToken: (token: string | null) => void;
  isLoggingOut: boolean;
  setIsLoggingOut: (isLoggingOut: boolean) => void;
  handleCreatorsAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [customAuthToken, setCustomAuthToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('custom-auth-token');
  });
  const [creator, setCreator] = useState<CreatorProfileResponse | null>(null);
  const [creatorLoading, setCreatorLoading] = useState(false);
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [newDonationsCount, setNewDonationsCount] = useState(0);
  const { user, getAccessToken, logout } = usePrivy();
  const router = useRouter();

  useSubscribeToJwtAuthWithFlag({
    isAuthenticated: !!customAuthToken,
    isLoading: false,
    getExternalJwt: () => {
      return Promise.resolve(customAuthToken ?? undefined);
    },
  });

  const handleCreatorsAuth = useCallback(async () => {
    setCreatorLoading(true);
    try {
      const authToken = await getAccessToken();
      if (!user) {
        throw new Error('handleAuth called but user is not available.');
      }

      if (!user.wallet?.address) {
        throw new Error('Wallet not available yet');
      }

      const walletAddress = user.wallet.address as Hex;

      if (!authToken || !user.id) {
        throw new Error('Could not get auth token or user ID for new user.');
      }

      const existingCreator = await getCreatorProfile(authToken);

      if (existingCreator) {
        setCreator(existingCreator);
        setCreatorLoading(false);
        if (existingCreator.doneSetup) {
          router.replace('/creators/app/earnings/stats-and-history');
        } else {
          router.replace('/creators/app/setup/payment-methods');
        }
      } else {
        // NEW USER ONBOARDING LOGIC
        let newCreatorName: string;
        let newCreatorDisplayName: string | null = null;
        let newCreatorProfilePic: string | null = null;
        let newCreatorEmail: string | null = null;

        const twitchInfoRaw = localStorage.getItem('twitch_new_user_info');

        // Check if we have Twitch info from the custom login flow
        if (twitchInfoRaw) {
          const twitchInfo = JSON.parse(twitchInfoRaw);
          newCreatorName = twitchInfo.name;
          newCreatorDisplayName = twitchInfo.displayName;
          newCreatorProfilePic = twitchInfo.pfp;
          newCreatorEmail = twitchInfo.email;
        } else {
          // User logged in with email or wallet, generate a random name
          // newCreatorName = `user-${user.id.slice(-8)}`;
          // newCreatorDisplayName = newCreatorName;
          throw new Error('Unsupported login method');
        }
        await saveCreatorProfile(
          walletAddress,
          newCreatorName,
          newCreatorDisplayName,
          newCreatorProfilePic,
          newCreatorEmail,
          user.id, // This is the Privy ID
          authToken,
        );

        const newCreator = await getCreatorProfile(authToken);

        if (!newCreator) {
          throw new Error('Failed to fetch newly created profile.');
        }

        setCreator(newCreator);
        router.replace('/creators/app/setup/payment-methods');
      }
    } catch (error) {
      console.error('Failed to authenticate creator:', error);
      void logout();
      // TODO: Check if we need to remove localstorage twitch_new_user_info here
      setCreator(null);
    } finally {
      setCreatorLoading(false);
    }
  }, [user, router, getAccessToken, logout]);

  const addDonation = (donation: DonationData) => {
    setDonations((previous) => {
      return [donation, ...previous];
    });
    setNewDonationsCount((previous) => {
      return previous + 1;
    });
  };

  const markDonationsAsSeen = () => {
    setNewDonationsCount(0);
  };

  const clearOauthError = () => {
    return setOauthError(null);
  };

  const handleSetCustomAuthToken = (token: string | null) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('custom-auth-token', token);
      } else {
        localStorage.removeItem('custom-auth-token');
      }
    }
    setCustomAuthToken(token);
  };

  return (
    <AuthContext.Provider
      value={{
        oauthError,
        isLoginModalOpen,
        creator,
        creatorLoading,
        setCreatorLoading,
        setOauthError,
        clearOauthError,
        setIsModalOpen,
        setCreator,
        donations,
        setCustomAuthToken: handleSetCustomAuthToken,
        addDonation,
        newDonationsCount,
        markDonationsAsSeen,
        isLoggingOut,
        setIsLoggingOut,
        handleCreatorsAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
