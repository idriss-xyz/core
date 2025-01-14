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

import { onWindowMessage } from '../../../apps/extension/src/shared/messaging';

import { Hex, Wallet } from './types';
import { WalletConnectModal } from './modal';

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
  const [wallet, setWallet] = useState<Wallet>();
  const walletConnectModal = useModal(WalletConnectModal, {
    disabledWalletsRdns: disabledWalletsRdns ?? [],
  });

  const removeWalletInfo = useCallback(() => {
    onClearWallet?.();
    setWallet(undefined);
  }, [onClearWallet]);

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
      const loggedInToCurrentWallet = getAddress(accounts[0] ?? '0x').includes(
        wallet.account,
      );

      if (!loggedInToCurrentWallet) {
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
