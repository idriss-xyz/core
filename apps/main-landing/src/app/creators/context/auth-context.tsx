'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

import { CreatorProfileResponse } from '../utils';

type AuthContextType = {
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

  const clearOauthError = () => {
    return setOauthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        oauthError,
        isLoginModalOpen,
        creator,
        setOauthError,
        clearOauthError,
        setIsModalOpen,
        setCreator,
        creatorLoading,
        setCreatorLoading,
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
