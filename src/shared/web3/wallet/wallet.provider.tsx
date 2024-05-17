import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { useModal } from '@ebay/nice-modal-react';
import { createStore } from 'mipd';

import { Hex } from '../web3.types';
import { hexToDecimal, toAddressWithValidChecksum } from '../web3.utils';

import { WalletContext, WalletContextValue } from './wallet.context';
import { WalletConnectModal } from './wallet-connect-modal.component';
import { Wallet } from './wallet.types';
import { WalletStorage } from './storage';

interface Properties {
  children: ReactNode;
}

export const WalletContextProvider = ({ children }: Properties) => {
  const walletConnectModal = useModal(WalletConnectModal);

  const [wallet, setWallet] = useState<Wallet>();
  const walletProvidersStore = useMemo(() => {
    return createStore();
  }, []);

  const availableWalletProviders = useSyncExternalStore(
    walletProvidersStore.subscribe,
    walletProvidersStore.getProviders,
  );

  useEffect(() => {
    if (wallet ?? availableWalletProviders.length === 0) {
      return;
    }

    const storedWallet = WalletStorage.get();
    if (!storedWallet) {
      return;
    }

    const foundProvider = availableWalletProviders.find((provider) => {
      return provider.info.rdns === storedWallet.providerRdns;
    });
    if (!foundProvider) {
      return;
    }

    const connectToStoredWallet = async () => {
      const accounts = await foundProvider.provider.request({
        method: 'eth_requestAccounts',
      });

      if (
        !accounts
          .map((account) => {
            return toAddressWithValidChecksum(account);
          })
          .includes(storedWallet.account)
      ) {
        return;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      const chainId = await foundProvider.provider.request({
        method: 'eth_chainId',
      });

      setWallet({
        providerRdns: foundProvider.info.rdns,
        provider: foundProvider.provider,
        account: storedWallet.account,
        chainId: hexToDecimal(chainId),
      });
    };

    void connectToStoredWallet();
  }, [availableWalletProviders, availableWalletProviders.length, wallet]);

  useEffect(() => {
    const onAccountsChanged = () => {
      setWallet(undefined);
      WalletStorage.clear();
    };
    wallet?.provider.on('accountsChanged', onAccountsChanged);

    return () => {
      wallet?.provider.removeListener('accountsChanged', onAccountsChanged);
    };
  }, [wallet?.provider]);

  useEffect(() => {
    const onChainChanged = (chainId: Hex) => {
      setWallet((previous) => {
        if (!previous) {
          return;
        }

        return { ...previous, chainId: hexToDecimal(chainId) };
      });
    };
    wallet?.provider.on('chainChanged', onChainChanged);

    return () => {
      wallet?.provider.removeListener('chainChanged', onChainChanged);
    };
  }, [wallet?.provider]);

  const openConnectionModal = useCallback(async () => {
    try {
      const resolvedWallet = (await walletConnectModal.show()) as Wallet;
      setWallet(resolvedWallet);
      return resolvedWallet;
    } catch (error) {
      setWallet(undefined);
      throw error;
    }
  }, [walletConnectModal]);

  const contextValue: WalletContextValue = useMemo(() => {
    return {
      wallet,
      openConnectionModal,
      isConnectionModalOpened: walletConnectModal.visible,
    };
  }, [openConnectionModal, wallet, walletConnectModal.visible]);

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};
