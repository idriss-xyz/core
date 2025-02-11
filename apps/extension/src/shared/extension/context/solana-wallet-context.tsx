'use client';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useModal } from '@ebay/nice-modal-react';
import { createContextHook } from '@idriss-xyz/ui/utils';
import { SolanaWalletConnectModal } from '@idriss-xyz/wallet-connect';

import { useAuthToken } from './auth-token-context';
import { SolanaProvider } from 'src/types/ethereum';

type SolanaWallet = {
  account: string;
  provider: SolanaProvider
};

type StoredSolanaWallet = {
  account: string;
  providerName: string;
};

type SolanaWalletContextValue = {
  wallet?: SolanaWallet;
  isConnectionModalOpened: boolean;
  openConnectionModal: () => Promise<SolanaWallet>;
  removeWalletInfo: () => void;
  setWalletInfo: (wallet: SolanaWallet) => void;
};

const SolanaWalletContext = createContext<SolanaWalletContextValue | undefined>(undefined);

export const SolanaWalletContextProvider = (properties: {
  children: ReactNode;
  onClearWallet?: () => void;
  onGetWallet?: () => Promise<StoredSolanaWallet | undefined>;
  onSaveWallet?: (wallet: StoredSolanaWallet) => void;
}) => {
  const { onClearWallet, onGetWallet, onSaveWallet } = properties;
  const [wallet, setWallet] = useState<SolanaWallet>();
  const { clearAuthToken } = useAuthToken();
  const walletConnectModal = useModal(SolanaWalletConnectModal);

  const removeWalletInfo = useCallback(() => {
    onClearWallet?.();
    setWallet(undefined);
    clearAuthToken();
  }, [clearAuthToken, onClearWallet]);

  const onAccountChange = useCallback(async () => {
    const newPublicKey = window.solana?.publicKey;
    if (newPublicKey && newPublicKey !== wallet?.account) {
      removeWalletInfo();
    }
  }, [wallet]);

  const setWalletInfo = useCallback((wallet: SolanaWallet) => {
    console.log("Set wallet info", wallet);
    setWallet(wallet);
    onSaveWallet?.({
      account: wallet.account,
      providerName: wallet.provider.isPhantom? 'Phantom' : 'Other',
    });
  }, [onSaveWallet]);

  useEffect(() => {
    const initializeStoredWallet = async () => {
      const storedWallet = await onGetWallet?.();
      console.log("Init storted wallet", storedWallet);
      if (storedWallet) {
        try {
          const provider = window.solana;
          if (provider) {
            await provider.connect();
            const wallet: SolanaWallet = {
              account: storedWallet.account,
              provider
            };
            setWallet(wallet);
          }
        } catch (error) {
          removeWalletInfo();
        }
      }
    };

    void initializeStoredWallet();
  }, [onGetWallet, removeWalletInfo]);

  useEffect(() => {
    if (wallet && window.solana) {
      window.solana.on('disconnect', removeWalletInfo);
      window.solana.on('accountChanged', onAccountChange);
    }

    return () => {
      if (window.solana) {
        window.solana.removeListener('disconnect', removeWalletInfo);
        window.solana.removeListener('accountChanged', onAccountChange);
      }
    };
  }, [wallet, removeWalletInfo]);

  const openConnectionModal = useCallback(async () => {
    try {
      const resolvedWallet = (await walletConnectModal.show()) as SolanaWallet;
      console.log("Resolved wallet after modal open", resolvedWallet);
      setWalletInfo(resolvedWallet);
      return resolvedWallet;
    } catch (error) {
      removeWalletInfo();
      throw error;
    }
  }, [walletConnectModal, setWalletInfo, removeWalletInfo]);

  const contextValue: SolanaWalletContextValue = useMemo(() => {
    return {
      wallet,
      setWalletInfo,
      removeWalletInfo,
      openConnectionModal,
      isConnectionModalOpened: walletConnectModal.visible,
    };
  }, [wallet, setWalletInfo, removeWalletInfo, openConnectionModal, walletConnectModal.visible]);

  return (
    <SolanaWalletContext.Provider value={contextValue}>
      {properties.children}
    </SolanaWalletContext.Provider>
  );
};

export const useSolanaWallet = createContextHook(SolanaWalletContext);
