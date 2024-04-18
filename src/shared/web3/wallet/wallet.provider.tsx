import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useModal } from '@ebay/nice-modal-react';

import { Hex } from '../web3.types';
import { hexToDecimal } from '../web3.utils';

import { WalletContext, WalletContextValue } from './wallet.context';
import { WalletConnectModal } from './wallet-connect-modal.component';
import { Wallet } from './wallet.types';

interface Properties {
  children: ReactNode;
}

export const WalletContextProvider = ({ children }: Properties) => {
  const walletConnectModal = useModal(WalletConnectModal);

  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    const onAccountsChanged = () => {
      setWallet(undefined);
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
