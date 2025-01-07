import { useCallback } from 'react';

import {
  GetSiweMessageCommand,
  VerifySiweSignatureCommand,
  VerifySiweSignatureRequest,
} from 'application/trading-copilot';
import { useCommandMutation } from 'shared/messaging';
import { SiweMessageRequest } from 'application/trading-copilot/types';
import { createWalletClient, Wallet } from 'shared/web3';

export const useLoginViaSiwe = () => {
  const getSiweMessage = useCommandMutation(GetSiweMessageCommand);
  const verifySiweSignature = useCommandMutation(VerifySiweSignatureCommand);

  const login = useCallback(
    async (wallet: Wallet) => {
      if (!wallet) {
        return;
      }

      const handleGetSiweMessage = async (payload: SiweMessageRequest) => {
        return await getSiweMessage.mutateAsync(payload);
      };

      const handleVerifySiweSignature = async (
        payload: VerifySiweSignatureRequest,
      ) => {
        return await verifySiweSignature.mutateAsync(payload);
      };

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

      localStorage.setItem('authToken', verifiedSiweSignature.token);
    },
    [getSiweMessage, verifySiweSignature],
  );

  const loggedIn = useCallback(() => {
    const authToken = localStorage.getItem('authToken');

    return !!authToken;
  }, []);

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
