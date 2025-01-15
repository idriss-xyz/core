import { useCallback } from 'react';
import { getAddress, hexToNumber } from 'viem';

import { useWallet, useAuthToken } from 'shared/extension';
import { useCommandMutation } from 'shared/messaging';
import { createWalletClient, Wallet } from 'shared/web3';

import { GetSiweMessageCommand, VerifySiweSignatureCommand } from '../commands';
import { SiweMessageRequest, VerifySiweSignatureRequest } from '../types';

export const useLoginViaSiwe = () => {
  const { setWalletInfo } = useWallet();
  const { getAuthToken, saveAuthToken } = useAuthToken();
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

      const provider = wallet.provider;
      const providerRdns = wallet.providerRdns;

      const accounts = await provider.request({
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
          providerRdns: providerRdns,
        });
      } else {
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
    [getSiweMessage, saveAuthToken, setWalletInfo, verifySiweSignature],
  );

  const loggedIn = getAuthToken;

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
