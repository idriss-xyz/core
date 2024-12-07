import { useCallback } from 'react';
import { useWallet } from '@idriss-xyz/wallet-connect';

import { CHAIN, useSwitchChain, Wallet } from 'shared/web3';

import { PolymarketUser } from '../types';

import { useSafeWallet } from './use-safe-wallet';
import { useIsUsdcAllowed } from './use-is-usdc-allowed';

export const useUser = (): PolymarketUser => {
  const { wallet, openConnectionModal } = useWallet();

  const safeWalletQuery = useSafeWallet();
  const safeWalletDetails = safeWalletQuery.data;
  const isUsdcAllowedQuery = useIsUsdcAllowed();

  const switchChain = useSwitchChain();

  const switchToPolygon = useCallback(
    (wallet: Wallet) => {
      return switchChain.mutateAsync({
        wallet,
        chainId: CHAIN.POLYGON.id,
      });
    },
    [switchChain],
  );

  const signIn = useCallback(async () => {
    const connectedWallet = await openConnectionModal();
    await switchToPolygon(connectedWallet);
  }, [openConnectionModal, switchToPolygon]);

  const isSigning =
    safeWalletQuery.isLoading ||
    switchChain.isPending ||
    isUsdcAllowedQuery.isLoading;
  const isSigningError = switchChain.isError;
  const hasPolymarketAccount = safeWalletQuery.isSuccess;
  const hasUsdcAllowed = Boolean(isUsdcAllowedQuery.data);

  return {
    wallet,
    signIn,
    isSigning,
    switchToPolygon,
    hasUsdcAllowed,
    isSigningError,
    safeWalletDetails,
    hasPolymarketAccount,
  };
};
