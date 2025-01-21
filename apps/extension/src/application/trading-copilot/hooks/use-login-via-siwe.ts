import { useCallback } from 'react';

import { useTradingCopilot, useWallet } from 'shared/extension';
import { useCommandMutation } from 'shared/messaging';
import { createWalletClient, Wallet } from 'shared/web3';

import {
  GetSiweMessageCommand,
  VerifySiweSignatureCommand,
  VerifyTokenCommand,
} from '../commands';
import { SiweMessagePayload, VerifySiweSignaturePayload } from '../types';

export const useLoginViaSiwe = () => {
  const { verifyWalletProvider } = useWallet();
  const { getAuthToken, saveAuthToken } = useTradingCopilot();
  const getSiweMessage = useCommandMutation(GetSiweMessageCommand);
  const verifySiweSignature = useCommandMutation(VerifySiweSignatureCommand);
  const verifyAuthTokenMutation = useCommandMutation(VerifyTokenCommand);

  const login = useCallback(
    async (wallet: Wallet) => {
      if (!wallet) {
        return;
      }

      const handleGetSiweMessage = async (payload: SiweMessagePayload) => {
        return await getSiweMessage.mutateAsync(payload);
      };

      const handleVerifySiweSignature = async (
        payload: VerifySiweSignaturePayload,
      ) => {
        return await verifySiweSignature.mutateAsync(payload);
      };

      const isWalletProviderValid = await verifyWalletProvider(wallet);

      if (!isWalletProviderValid) {
        return;
      }

      const walletClient = createWalletClient(wallet);

      const siweMessage = await handleGetSiweMessage({
        walletAddress: wallet.account,
        chainId: wallet.chainId,
        domain: window.location.hostname,
      });

      const siweSignature = await walletClient.signMessage({
        account: wallet.account,
        message: siweMessage.message,
      });

      const verifiedSiweSignature = await handleVerifySiweSignature({
        walletAddress: wallet.account,
        message: siweMessage.message,
        signature: siweSignature,
      });

      saveAuthToken(verifiedSiweSignature.token);
    },
    [getSiweMessage, saveAuthToken, verifySiweSignature, verifyWalletProvider],
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

  const isSending = getSiweMessage.isPending || verifySiweSignature.isPending;

  const isError = getSiweMessage.isError || verifySiweSignature.isError;

  const isSuccess = getSiweMessage.isSuccess && verifySiweSignature.isSuccess;

  const isIdle = !isSending && !isError && !isSuccess;

  const reset = useCallback(() => {
    getSiweMessage.reset();
    verifySiweSignature.reset();
  }, [getSiweMessage, verifySiweSignature]);

  return {
    login,
    loggedIn,
    isSending,
    isError,
    isSuccess,
    isIdle,
    reset,
  };
};
