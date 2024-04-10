import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useModal } from '@ebay/nice-modal-react';

import { Hex, Wallet } from '../web3.types';
import { hexStringToNumber } from '../web3.utils';

import { WalletContext, WalletContextValue } from './wallet.context';
import { WalletConnectModal } from './wallet-connect-modal.component';

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

        return { ...previous, chainId: hexStringToNumber(chainId) };
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
    };
  }, [openConnectionModal, wallet]);

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};
