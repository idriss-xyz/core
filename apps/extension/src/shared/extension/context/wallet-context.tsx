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
import { Hex, Wallet, WalletConnectModal } from '@idriss-xyz/wallet-connect';

import { onWindowMessage } from '../../messaging';

import { useAuthToken } from './auth-token-context';

type WalletContextValue = {
  wallet?: Wallet;
  isConnectionModalOpened: boolean;
  openConnectionModal: () => Promise<Wallet>;
  removeWalletInfo: () => void;
  setWalletInfo: (wallet: Wallet) => void;
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
  const { onClearWallet, onGetWallet, onSaveWallet, disabledWalletsRdns } =
    properties;
  const [tabChangedListenerInitialized, setTabChangedListenerInitialized] =
    useState(false);
  const { clearAuthToken } = useAuthToken();
  const [wallet, setWallet] = useState<Wallet>();
  const walletConnectModal = useModal(WalletConnectModal, {
    disabledWalletsRdns: disabledWalletsRdns ?? [],
  });

  const removeWalletInfo = useCallback(() => {
    onClearWallet?.();
    setWallet(undefined);
    clearAuthToken();
  }, [clearAuthToken, onClearWallet]);

  const setWalletInfo = useCallback(
    (wallet: Wallet) => {
      setWallet(wallet);
      onSaveWallet?.({
        account: wallet.account,
        providerRdns: wallet.providerRdns,
      });
    },
    [onSaveWallet],
  );

  const walletProvidersStore = useMemo(() => {
    return createStore();
  }, []);

  const availableWalletProviders = useSyncExternalStore(
    walletProvidersStore.subscribe,
    walletProvidersStore.getProviders,
    getProvidersServerSnapshot,
  );

  const getWallet = useCallback(async () => {
    if (availableWalletProviders.length === 0) {
      return;
    }

    const storedWallet = await onGetWallet?.();

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

    const chainId = await connectedProvider.request({
      method: 'eth_chainId',
    });

    return {
      providerRdns: foundProvider.info.rdns,
      provider: connectedProvider,
      account: storedWallet.account,
      chainId: hexToNumber(chainId),
    };
  }, [availableWalletProviders, onGetWallet]);

  if (!tabChangedListenerInitialized) {
    onWindowMessage('TAB_CHANGED', async () => {
      const latestWallet = await getWallet();

      setWallet(latestWallet);
    });
    setTabChangedListenerInitialized(true);
  }

  useEffect(() => {
    const callback = async () => {
      if (wallet ?? availableWalletProviders.length === 0) {
        return;
      }

      const latestWallet = await getWallet();

      setWallet(latestWallet);
    };

    void callback();
  }, [
    availableWalletProviders,
    availableWalletProviders.length,
    getWallet,
    onGetWallet,
    properties,
    wallet,
  ]);

  useEffect(() => {
    wallet?.provider.on('accountsChanged', (accounts) => {
      if (accounts[0]) {
        const loggedInToCurrentWallet = getAddress(accounts[0]).includes(
          wallet.account,
        );

        if (!loggedInToCurrentWallet) {
          removeWalletInfo();
        }
      } else {
        removeWalletInfo();
      }
    });

    return () => {
      wallet?.provider.removeListener('accountsChanged', removeWalletInfo);
    };
  }, [properties, removeWalletInfo, wallet?.account, wallet?.provider]);

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
  }, [properties, wallet?.provider]);

  const openConnectionModal = useCallback(async () => {
    try {
      const resolvedWallet = (await walletConnectModal.show({
        disabledWalletsRdns: disabledWalletsRdns ?? [],
      })) as Wallet;
      setWalletInfo(resolvedWallet);
      return resolvedWallet;
    } catch (error) {
      removeWalletInfo();
      throw error;
    }
  }, [
    walletConnectModal,
    disabledWalletsRdns,
    setWalletInfo,
    removeWalletInfo,
  ]);

  const contextValue: WalletContextValue = useMemo(() => {
    return {
      wallet,
      setWalletInfo,
      removeWalletInfo,
      openConnectionModal,
      isConnectionModalOpened: walletConnectModal.visible,
    };
  }, [
    wallet,
    setWalletInfo,
    removeWalletInfo,
    openConnectionModal,
    walletConnectModal.visible,
  ]);

  return (
    <WalletContext.Provider value={contextValue}>
      {properties.children}
    </WalletContext.Provider>
  );
};

export const useWallet = createContextHook(WalletContext);
