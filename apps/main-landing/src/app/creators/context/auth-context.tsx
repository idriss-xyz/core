'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { DonationData, CREATOR_API_URL } from '@idriss-xyz/constants';
import { useQueryClient } from '@tanstack/react-query';
import { default as io } from 'socket.io-client';

import { CreatorProfileResponse } from '../utils';

type AuthContextType = {
  donations: DonationData[];
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

const CreatorSocketManager = ({
  creator,
  setDonations,
}: {
  creator: CreatorProfileResponse;
  setDonations: React.Dispatch<React.SetStateAction<DonationData[]>>;
}) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!creator.primaryAddress) return;

    const socket = io(CREATOR_API_URL);

    socket.on('connect', () => {
      socket.emit('register', creator.primaryAddress);
    });

    socket.on('newDonation', (donation: DonationData) => {
      setDonations((previous) => {
        return [donation, ...previous];
      });
      void queryClient.invalidateQueries({
        queryKey: ['balances', creator.primaryAddress],
      });
      void queryClient.invalidateQueries({
        queryKey: ['tipHistory', creator.primaryAddress],
      });
      void queryClient.invalidateQueries({
        queryKey: ['recipient-stats', creator.primaryAddress],
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [creator, queryClient, setDonations]);

  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsModalOpen] = useState(false);
  const [creator, setCreator] = useState<CreatorProfileResponse | null>(null);
  const [creatorLoading, setCreatorLoading] = useState(true);
  const [donations, setDonations] = useState<DonationData[]>([]);

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
      }}
    >
      {creator && (
        <CreatorSocketManager creator={creator} setDonations={setDonations} />
      )}
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
