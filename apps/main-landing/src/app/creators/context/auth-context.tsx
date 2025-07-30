'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { DonationData } from '@idriss-xyz/constants';
import { getAccessToken, usePrivy } from '@privy-io/react-auth';

import { CreatorProfileResponse, getCreatorProfile } from '../utils';

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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsModalOpen] = useState(false);
  const [creator, setCreator] = useState<CreatorProfileResponse | null>(null);
  const [creatorLoading, setCreatorLoading] = useState(true);
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [newDonationsCount, setNewDonationsCount] = useState(0);
  const { ready, authenticated, user } = usePrivy();

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!authenticated) {
      setCreator(null);
      setCreatorLoading(false);
      return;
    }

    if (creator) {
      setCreatorLoading(false);
      return;
    }

    const fetchCreatorProfile = async () => {
      if (!user?.wallet?.address) {
        return;
      }
      setCreatorLoading(true);
      try {
        const authToken = await getAccessToken();
        if (!authToken || !user.id) {
          throw new Error('Could not get auth token or user ID for new user.');
        }

        const existingCreator = await getCreatorProfile(authToken);

        console.log('existingCreator', existingCreator);
        setCreator(existingCreator ?? null);
      } catch (error) {
        console.error('Failed to fetch creator profile:', error);
        setCreator(null);
      } finally {
        setCreatorLoading(false);
      }
    };

    if (authenticated && !creator) {
      void fetchCreatorProfile();
    }
  }, [ready, authenticated, user, creator]);

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
        addDonation,
        newDonationsCount,
        markDonationsAsSeen,
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
