'use client';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { createStore } from 'mipd';
import { useModal } from '@ebay/nice-modal-react';
import { createContextHook } from '@idriss-xyz/ui/utils';
import { getAddress, hexToNumber } from 'viem';

import { Hex, Wallet } from './types';
import { WalletConnectModal } from './modal';

type WalletContextValue = {
  wallet?: Wallet;
  isConnectionModalOpened: boolean;
  openConnectionModal: () => Promise<Wallet>;
  removeWalletInfo: () => void;
};

type StoredWallet = {
  account: Hex;
  providerRdns: string;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const SERVER_SIDE_SNAPSHOT: [] = [];
const getProvidersServerSnapshot = () => {
  return SERVER_SIDE_SNAPSHOT;
};

export const WalletContextProvider = (properties: {
  children: ReactNode;
  disabledWalletsRdns?: string[];
  onClearWallet?: () => void;
  onGetWallet?: () => Promise<StoredWallet | undefined>;
  onSaveWallet?: (wallet: StoredWallet) => void;
}) => {
  const walletConnectModal = useModal(WalletConnectModal, {
    disabledWalletsRdns: properties.disabledWalletsRdns ?? [],
  });

  const [wallet, setWallet] = useState<Wallet>();

  const walletProvidersStore = useMemo(() => {
    return createStore();
  }, []);

  const availableWalletProviders = useSyncExternalStore(
    walletProvidersStore.subscribe,
    walletProvidersStore.getProviders,
    getProvidersServerSnapshot,
  );

  const removeWalletInfo = useCallback(() => {
    setWallet(undefined);
    properties.onClearWallet?.();
  }, [properties]);

  useEffect(() => {
    const callback = async () => {
      if (wallet ?? availableWalletProviders.length === 0) {
        return;
      }

      const storedWallet = await properties.onGetWallet?.();
      if (!storedWallet) {
        return;
      }

      const foundProvider =
        storedWallet.providerRdns === 'browser'
          ? { provider: window.ethereum, info: { rdns: 'browser' } }
          : availableWalletProviders.find((provider) => {
            return provider.info.rdns === storedWallet.providerRdns;
          });

      const connectedProvider = foundProvider?.provider;
      if (!foundProvider || !connectedProvider) {
        return;
      }

      const connectToStoredWallet = async () => {
        const accounts = await connectedProvider.request({
          method: 'eth_accounts',
        });

        if (
          !accounts
            .map((account: Hex) => {
              return getAddress(account);
            })
            .includes(storedWallet.account)
        ) {
          return;
        }

        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        const chainId = await connectedProvider.request({
          method: 'eth_chainId',
        });

        setWallet({
          providerRdns: foundProvider.info.rdns,
          provider: connectedProvider,
          account: storedWallet.account,
          chainId: hexToNumber(chainId),
        });
      };

      void connectToStoredWallet();
    };
    void callback();
  }, [
    availableWalletProviders,
    availableWalletProviders.length,
    properties,
    wallet,
  ]);

  useEffect(() => {
    wallet?.provider.on('accountsChanged', removeWalletInfo);

    return () => {
      wallet?.provider.removeListener('accountsChanged', removeWalletInfo);
    };
  }, [removeWalletInfo, wallet?.provider]);

  useEffect(() => {
    const onChainChanged = (chainId: Hex) => {
      setWallet((previous) => {
        if (!previous) {
          return;
        }

        return { ...previous, chainId: hexToNumber(chainId) };
      });
    };
    wallet?.provider.on('chainChanged', onChainChanged);

    return () => {
      wallet?.provider.removeListener('chainChanged', onChainChanged);
    };
  }, [wallet?.provider]);

  const openConnectionModal = useCallback(async () => {
    try {
      const resolvedWallet = (await walletConnectModal.show({
        disabledWalletsRdns: properties.disabledWalletsRdns ?? [],
      })) as Wallet;
      setWallet(resolvedWallet);
      properties.onSaveWallet?.({
        account: resolvedWallet.account,
        providerRdns: resolvedWallet.providerRdns,
      });
      return resolvedWallet;
    } catch (error) {
      setWallet(undefined);
      throw error;
    }
  }, [properties, walletConnectModal]);

  const contextValue: WalletContextValue = useMemo(() => {
    return {
      wallet,
      isConnectionModalOpened: walletConnectModal.visible,
      openConnectionModal,
      removeWalletInfo,
    };
  }, [
    openConnectionModal,
    removeWalletInfo,
    wallet,
    walletConnectModal.visible,
  ]);

  return (
    <WalletContext.Provider value={contextValue}>
      {properties.children}
    </WalletContext.Provider>
  );
};

export const useWallet = createContextHook(WalletContext);
