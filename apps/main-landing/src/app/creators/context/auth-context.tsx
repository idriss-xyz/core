'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { DonationData } from '@idriss-xyz/constants';

import { CreatorProfileResponse } from '../utils';

type AuthContextType = {
  donations: DonationData[];
  addDonation: (donation: DonationData) => void;
  newDonationsCount: number;
  markDonationsAsSeen: () => void;
  error: boolean;
  isLoginModalOpen: boolean;
  creator: CreatorProfileResponse | null;
  creatorLoading: boolean;
  setCreatorLoading: (loading: boolean) => void;
  setOauthError: (error: boolean) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setCreator: Dispatch<SetStateAction<CreatorProfileResponse | null>>;
  setCustomAuthToken: (token: string | null) => void;
  isLoggingOut: boolean;
  setIsLoggingOut: (isLoggingOut: boolean) => void;
  customAuthToken: string | null;
  oauthLoading: boolean;
  setOauthLoading: (oauthLoading: boolean) => void;
  isAuthenticated: boolean;
  setLoginError: (loginError: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [oauthError, setOauthError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
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
  const isAuthenticated = customAuthToken != null && !oauthLoading;

  const error = loginError || oauthError;

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
        isLoginModalOpen,
        creator,
        creatorLoading,
        setCreatorLoading,
        setOauthError,
        setIsModalOpen,
        setCreator,
        donations,
        customAuthToken,
        setCustomAuthToken: handleSetCustomAuthToken,
        addDonation,
        newDonationsCount,
        markDonationsAsSeen,
        isLoggingOut,
        setIsLoggingOut,
        oauthLoading,
        setOauthLoading,
        isAuthenticated,
        error,
        setLoginError,
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
