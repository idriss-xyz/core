'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { DonationData } from '@idriss-xyz/constants';

import { CreatorProfileResponse } from '../utils';

type AuthContextType = {
  donations: DonationData[];
  addDonation: (donation: DonationData) => void;
  newDonationsCount: number;
  markDonationsAsSeen: () => void;
  oauthError: string | null;
  isLoginModalOpen: boolean;
  isPasswordModalOpen: boolean;
  earlyAccessToken: string | null;
  creator: CreatorProfileResponse | null;
  creatorLoading: boolean;
  setCreatorLoading: (loading: boolean) => void;
  setOauthError: (error: string | null) => void;
  clearOauthError: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setIsPasswordModalOpen: (isOpen: boolean) => void;
  setEarlyAccessToken: (token: string | null) => void;
  setCreator: (creator: CreatorProfileResponse | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [earlyAccessToken, setEarlyAccessToken] = useState<string | null>(null);
  const [creator, setCreator] = useState<CreatorProfileResponse | null>(null);
  const [creatorLoading, setCreatorLoading] = useState(true);
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [newDonationsCount, setNewDonationsCount] = useState(0);

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
        isPasswordModalOpen,
        earlyAccessToken,
        creator,
        creatorLoading,
        setCreatorLoading,
        setOauthError,
        clearOauthError,
        setIsModalOpen,
        setIsPasswordModalOpen,
        setEarlyAccessToken,
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
