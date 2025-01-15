import { useCallback } from 'react';
import { formatEther, getAddress, hexToNumber, parseEther } from 'viem';
import { useWallet } from '@idriss-xyz/wallet-connect';

import { Wallet, CHAIN, useSwitchChain } from 'shared/web3';
import { useCommandMutation } from 'shared/messaging';
import { useAuthToken } from 'shared/extension';

import { useLoginViaSiwe } from '../hooks/use-login-via-siwe';
import { SwapData, FormValues, QuotePayload } from '../types';
import { GetQuoteCommand } from '../commands/get-quote';

import { useCopilotTransaction } from './use-copilot-transaction';

interface Properties {
  wallet?: Wallet;
}

interface CallbackProperties {
  formValues: FormValues;
  dialog: SwapData;
}

export const useExchanger = ({ wallet }: Properties) => {
  const { setWalletInfo } = useWallet();
  const { getAuthToken } = useAuthToken();
  const siwe = useLoginViaSiwe();
  const switchChain = useSwitchChain();
  const copilotTransaction = useCopilotTransaction();
  const quoteQuery = useCommandMutation(GetQuoteCommand);

  const exchange = useCallback(
    async ({ formValues, dialog }: CallbackProperties) => {
      if (!wallet || Number(formValues.amount) === 0) {
        return;
      }

      const siweLoggedIn = await siwe.loggedIn();

      if (!siweLoggedIn) {
        await siwe.login(wallet);
      }

      const authToken = await getAuthToken();

      if (!authToken) {
        return;
      }

      const handleQuoteQuery = async (payload: QuotePayload) => {
        return await quoteQuery.mutateAsync(payload);
      };

      const amountInEth = formValues.amount;
      const amountInWei = parseEther(amountInEth).toString();

      const quotePayload = {
        quote: {
          amount: amountInWei,
          destinationChain: CHAIN[dialog.tokenOut.network].id,
          fromAddress: wallet.account,
          destinationToken: dialog.tokenIn.address,
          originChain: CHAIN[dialog.tokenIn.network].id,
          originToken: '0x0000000000000000000000000000000000000000',
        },
        authToken: authToken ?? '',
      };

      const quoteData = await handleQuoteQuery(quotePayload);

      const transactionData = {
        gas: quoteData.estimate.gasCosts[0]
          ? BigInt(quoteData.estimate.gasCosts[0].estimate)
          : undefined,
        data: quoteData.transactionData.data,
        chain: quoteData.transactionData.chainId,
        value: parseEther(amountInEth),
        to: quoteData.transactionData.to,
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

      await switchChain.mutateAsync({
        chainId: quoteData.transactionData.chainId,
        wallet,
      });

      copilotTransaction.mutate({
        wallet: wallet,
        transactionData,
      });
    },
    [
      wallet,
      siwe,
      getAuthToken,
      switchChain,
      copilotTransaction,
      quoteQuery,
      setWalletInfo,
    ],
  );

  const isSending = quoteQuery.isPending || copilotTransaction.isPending;

  const isError = quoteQuery.isError || copilotTransaction.isError;

  const isSuccess = quoteQuery.isSuccess && copilotTransaction.isSuccess;

  const quoteData = quoteQuery.data;

  const transactionData = copilotTransaction.data;

  const isIdle = !isSending && !isError && !isSuccess;

  const details = {
    from: {
      amount: Number(
        formatEther(BigInt(quoteQuery.data?.estimate.fromAmount ?? 0)),
      ),
      symbol: quoteQuery.data?.includedSteps[0]?.action.fromToken.symbol,
    },
    to: {
      amount: Number(
        formatEther(BigInt(quoteQuery.data?.estimate.toAmount ?? 0)),
      ),
      symbol: quoteQuery.data?.includedSteps[0]?.action.toToken.symbol,
    },
  };

  const reset = useCallback(() => {
    quoteQuery.reset();
    copilotTransaction.reset();
  }, [copilotTransaction, quoteQuery]);

  return {
    exchange,
    isSending,
    isError,
    isSuccess,
    isIdle,
    quoteData,
    transactionData,
    reset,
    details,
  };
};
