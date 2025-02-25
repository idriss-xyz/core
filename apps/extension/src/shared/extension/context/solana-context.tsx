import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { useModal } from '@ebay/nice-modal-react';
import {
  SolanaWallet,
  SolanaWalletConnectModal,
} from '@idriss-xyz/wallet-connect';
import { Wallet as SolanaWalletWeb3js } from '@solana/wallet-adapter-react';
import { createContextHook } from '@idriss-xyz/ui/utils';

import { onWindowMessage } from '../../messaging';

type SolanaWalletContextValue = {
  wallet?: SolanaWallet;
  isConnectionModalOpened: boolean;
  openConnectionModal: () => Promise<SolanaWallet>;
  removeWalletInfo: () => void;
  setWalletInfo: (wallet: SolanaWallet) => void;
};

type StoredWallet = {
  account: string;
  providerName: string;
};

const SolanaWalletContext = createContext<SolanaWalletContextValue | undefined>(
  undefined,
);

// Simple store implementation
function createSolanaWalletStore() {
  let wallets: SolanaWalletWeb3js[] = [];
  let listeners = new Set<() => void>();

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getProviders() {
      return wallets;
    },
    addProvider(provider: SolanaWalletWeb3js) {
      wallets.push(provider);
      listeners.forEach((listener) => listener());
    },
    clear() {
      wallets = [];
      listeners.forEach((listener) => listener());
    },
  };
}
// Server-side snapshot
const SERVER_SIDE_SNAPSHOT: [] = [];
const getProvidersServerSnapshot = () => SERVER_SIDE_SNAPSHOT;

export const SolanaContextProvider = (properties: {
  children: ReactNode;
  onClearWallet?: () => void;
  onGetWallet?: () => Promise<StoredWallet | undefined>;
  onSaveWallet?: (wallet: StoredWallet) => void;
}) => {
  const { onClearWallet, onGetWallet, onSaveWallet } = properties;
  const [tabChangedListenerInitialized, setTabChangedListenerInitialized] =
    useState(false);
  const [wallet, setWallet] = useState<SolanaWallet>();
  // TODO: Refactor SolanaWalletConnectModal and add properties here
  const walletConnectModal = useModal(SolanaWalletConnectModal, {});

  const removeWalletInfo = useCallback(() => {
    onClearWallet?.();
    setWallet(undefined);
  }, [onClearWallet]);

  const setWalletInfo = useCallback(
    (wallet: SolanaWallet) => {
      if (!wallet.account) {
        return;
      }
      setWallet(wallet);
      onSaveWallet?.({
        account: wallet.account,
        providerName: wallet.provider.name,
      });
    },
    [onSaveWallet],
  );

  const solanaWalletProvidersStore = useMemo(
    () => createSolanaWalletStore(),
    [],
  );

  const availableWalletProviders = useSyncExternalStore(
    solanaWalletProvidersStore.subscribe,
    solanaWalletProvidersStore.getProviders,
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

    const foundProvider = availableWalletProviders.find((provider) => {
      return provider.adapter.name === storedWallet.providerName;
    });

    const connectedProvider = foundProvider?.adapter;

    if (!foundProvider || !connectedProvider) {
      return;
    }

    return {
      account: storedWallet.account,
      provider: connectedProvider,
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
      if (accounts && accounts[0]) {
        const loggedInToCurrentWallet = accounts[0].includes(wallet.account);

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

  const openConnectionModal = useCallback(async () => {
    try {
      const resolvedWallet = (await walletConnectModal.show(
        {},
      )) as SolanaWallet;
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
  }, [
    wallet,
    setWalletInfo,
    removeWalletInfo,
    openConnectionModal,
    walletConnectModal.visible,
  ]);

  return (
    <SolanaWalletContext.Provider value={contextValue}>
      {properties.children}
    </SolanaWalletContext.Provider>
  );
};

export const useSolanaWallet = createContextHook(SolanaWalletContext);
