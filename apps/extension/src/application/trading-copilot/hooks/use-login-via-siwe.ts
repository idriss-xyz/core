import { useCallback } from 'react';
import { getAddress, hexToNumber } from 'viem';

import { useAuthToken, useWallet } from 'shared/extension';
import { useCommandMutation } from 'shared/messaging';
import { createWalletClient, Wallet } from 'shared/web3';

import {
  GetSiweMessageCommand,
  VerifySiweSignatureCommand,
  VerifyTokenCommand,
} from '../commands';

export const useLoginViaSiwe = () => {
  const { setWalletInfo } = useWallet();
  const { getAuthToken, saveAuthToken } = useAuthToken();
  const getSiweMessage = useCommandMutation(GetSiweMessageCommand);
  const verifySiweSignature = useCommandMutation(VerifySiweSignatureCommand);
  const verifyAuthTokenMutation = useCommandMutation(VerifyTokenCommand);

  const login = useCallback(
    async (wallet: Wallet) => {
      if (!wallet) {
        return;
      }
      const provider = wallet.provider;

      const accounts = await wallet.provider.request({
        method: 'eth_requestAccounts',
      });

      const chainId = await provider.request({ method: 'eth_chainId' });

      const loggedInToCurrentWallet = getAddress(accounts[0] ?? '0x').includes(
        wallet.account,
      );

      if (loggedInToCurrentWallet && accounts[0]) {
        setWalletInfo({
          account: getAddress(accounts[0]),
          provider,
          chainId: hexToNumber(chainId),
          providerRdns: wallet.providerRdns,
        });
      } else {
        return;
      }

      const walletClient = createWalletClient(wallet);

      const siweMessage = await getSiweMessage.mutateAsync({
        walletAddress: wallet.account,
        chainId: wallet.chainId,
        domain: window.location.hostname,
      });

      try {
        const siweSignature = await walletClient.signMessage({
          account: wallet.account,
          message: siweMessage.message,
        });

        const verifiedSiweSignature = await verifySiweSignature.mutateAsync({
          walletAddress: wallet.account,
          message: siweMessage.message,
          signature: siweSignature,
        });
        saveAuthToken(verifiedSiweSignature.token);
      }
      catch (error: any) {
        console.error('Error signing in with wallet. ', error);
        return;
      }

    },
    [getSiweMessage, saveAuthToken, setWalletInfo, verifySiweSignature],
  );

  const loggedIn = useCallback(async () => {
    const authToken = await getAuthToken();

    if (!authToken) {
      return false;
    }

    return await verifyAuthTokenMutation.mutateAsync({
      token: authToken,
    });
  }, [getAuthToken, verifyAuthTokenMutation]);

  const isPending = getSiweMessage.isPending || verifySiweSignature.isPending || isSigning;

  const isError = getSiweMessage.isError || verifySiweSignature.isError || error !== '';

  const isSuccess = getSiweMessage.isSuccess && verifySiweSignature.isSuccess;

  const isIdle = !isPending && !isError && !isSuccess;

  const reset = useCallback(() => {
    getSiweMessage.reset();
    verifySiweSignature.reset();
  }, [getSiweMessage, verifySiweSignature]);

  return {
    login,
    loggedIn,
    isPending,
    isError,
    isSuccess,
    isIdle,
    reset,
  };
};
