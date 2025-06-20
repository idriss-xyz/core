'use client';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { CreatorProfileResponse } from '../utils';

interface AuthContextType {
  isLoginModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  oauthError: string | null;
  setOauthError: (error: string | null) => void;
  clearOauthError: () => void;
  creator: CreatorProfileResponse | null;
  setCreator: (creator: CreatorProfileResponse | null) => void;
  getToken: () => string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a PrivyAuthProvider');
  }
  return context;
};

export const PrivyAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginModalOpen, setIsModalOpen] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [creator, setCreator] = useState<CreatorProfileResponse | null>(null);

  const clearOauthError = useCallback(() => {
    setOauthError(null);
  }, []);

  const getToken = useCallback(() => {
    // TODO: Implement token retrieval logic here
    try {
      // Retrieve token from localStorage, a cookie, or an API call. Example:
      return localStorage.getItem('auth_token') ?? undefined;
    } catch (error) {
      console.error('Error getting token:', error);
      return;
    }
  }, []);

  const contextValue: AuthContextType = {
    isLoginModalOpen,
    setIsModalOpen,
    oauthError,
    setOauthError,
    clearOauthError,
    creator,
    setCreator,
    getToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
