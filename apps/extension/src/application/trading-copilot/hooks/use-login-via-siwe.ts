import { useCallback } from 'react';
import { SolanaWallet, Wallet } from '@idriss-xyz/wallet-connect';

import { useTradingCopilot, useWallet } from 'shared/extension';
import { useCommandMutation } from 'shared/messaging';
import { createWalletClient } from 'shared/web3';

import {
  GetSiweMessageCommand,
  VerifySiweSignatureCommand,
  VerifyTokenCommand,
} from '../commands';
import { SiweMessagePayload, VerifySiweSignaturePayload } from '../types';
import { isAddress } from 'viem';
import { SolanaProvider } from 'node_modules/@idriss-xyz/wallet-connect/src/ethereum';

export const useLoginViaSiwe = () => {
  const { verifyWalletProvider } = useWallet();
  const { getAuthToken, saveAuthToken } = useTradingCopilot();
  const getSiweMessage = useCommandMutation(GetSiweMessageCommand);
  const verifySiweSignature = useCommandMutation(VerifySiweSignatureCommand);
  const verifyAuthTokenMutation = useCommandMutation(VerifyTokenCommand);

  const login = useCallback(
    async (wallet: Wallet | SolanaWallet) => {
      if (!wallet) {
        return;
      }

      const isEvmWallet = isAddress(wallet.account) && 'chainId' in wallet;

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

      const walletClient = isEvmWallet ? createWalletClient(wallet): null;

      const siweMessage = isEvmWallet
        ? await handleGetSiweMessage({
          walletAddress: wallet.account,
          chainId: wallet.chainId,
          domain: window.location.hostname,
        })
        : await handleGetSiweMessage({
          walletAddress: wallet.account,
          domain: window.location.hostname,
        });

      const siweSignature = isEvmWallet
        ? await walletClient?.signMessage({
          account: wallet.account,
          message: siweMessage.message,
        })
        : new TextDecoder().decode(await (wallet.provider as SolanaProvider).signMessage?.(
          new TextEncoder().encode(siweMessage.message)));

      if (!siweSignature) {
        return;
      }

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

  const isPending = getSiweMessage.isPending || verifySiweSignature.isPending;

  const isError = getSiweMessage.isError || verifySiweSignature.isError;

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
