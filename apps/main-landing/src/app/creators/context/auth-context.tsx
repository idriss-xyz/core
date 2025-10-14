'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { StoredDonationData } from '@idriss-xyz/constants';

import { CreatorProfileResponse } from '../utils/types';

type AuthContextType = {
  donations: StoredDonationData[];
  addDonation: (donation: StoredDonationData) => void;
  newDonationsCount: number;
  markDonationsAsSeen: () => void;
  error: boolean;
  isLoginModalOpen: boolean;
  isDonateOptionsModalOpen: boolean;
  creator: CreatorProfileResponse | null;
  donor: CreatorProfileResponse | null;
  donorLoading: boolean;
  creatorLoading: boolean;
  setCreatorLoading: (loading: boolean) => void;
  setDonorLoading: (loading: boolean) => void;
  setDonor: Dispatch<SetStateAction<CreatorProfileResponse | null>>;
  setOauthError: (error: boolean) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setIsDonateOptionsModalOpen: (isOpen: boolean) => void;
  setCreator: Dispatch<SetStateAction<CreatorProfileResponse | null>>;
  setCustomAuthToken: (token: string | null) => void;
  isLoggingOut: boolean;
  setIsLoggingOut: (isLoggingOut: boolean) => void;
  customAuthToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  setLoginError: (loginError: boolean) => void;
  callbackUrl: string | null;
  setCallbackUrl: (callbackUrl: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [oauthError, setOauthError] = useState(false);
  const [loginError, setLoginError] = useState(false);
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
  const [donorLoading, setDonorLoading] = useState(false);
  const [donor, setDonor] = useState<CreatorProfileResponse | null>(null);
  const [donations, setDonations] = useState<StoredDonationData[]>([]);
  const [newDonationsCount, setNewDonationsCount] = useState(0);
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const [loading, setIsLoading] = useState(false);
  const isAuthenticated = customAuthToken != null && !loading;
  const [isDonateOptionsModalOpen, setIsDonateOptionsModalOpen] =
    useState(false);

  const error = loginError || oauthError;

  const addDonation = (donation: StoredDonationData) => {
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
        setIsDonateOptionsModalOpen,
        isDonateOptionsModalOpen,
        creator,
        creatorLoading,
        setCreatorLoading,
        donor,
        donorLoading,
        setDonor,
        setDonorLoading,
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
        loading,
        isAuthenticated,
        error,
        setLoginError,
        callbackUrl,
        setCallbackUrl,
        setIsLoading,
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
