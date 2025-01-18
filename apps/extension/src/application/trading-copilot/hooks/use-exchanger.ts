import { useCallback } from 'react';
import { formatEther, parseEther } from 'viem';

import { useWallet } from 'shared/extension';
import { Wallet, CHAIN, useSwitchChain } from 'shared/web3';
import { useCommandMutation } from 'shared/messaging';

import { SwapData, FormValues, QuotePayload } from '../types';
import { GetQuoteCommand } from '../commands/get-quote';

import { useCopilotTransaction } from './use-copilot-transaction';

interface Properties {
  wallet?: Wallet;
}

interface CallbackProperties {
  dialog: SwapData;
  formValues: FormValues;
}

export const useExchanger = ({ wallet }: Properties) => {
  const { verifyWalletProvider } = useWallet();
  const switchChain = useSwitchChain();
  const copilotTransaction = useCopilotTransaction();
  const getQuoteMutation = useCommandMutation(GetQuoteCommand);

  const exchange = useCallback(
    async ({ formValues, dialog }: CallbackProperties) => {
      if (!wallet || Number(formValues.amount) === 0) {
        return;
      }

      const isWalletProviderValid = await verifyWalletProvider(wallet);

      if (!isWalletProviderValid) {
        return;
      }

      const handleGetQuoteMutation = async (payload: QuotePayload) => {
        return await getQuoteMutation.mutateAsync(payload);
      };

      const amountInEth = formValues.amount;
      const amountInWei = parseEther(amountInEth).toString();

      const quotePayload = {
        amount: amountInWei,
        destinationChain: CHAIN[dialog.tokenOut.network].id,
        fromAddress: wallet.account,
        destinationToken: dialog.tokenIn.address,
        originChain: CHAIN[dialog.tokenIn.network].id,
        originToken: '0x0000000000000000000000000000000000000000',
      };

      const quoteData = await handleGetQuoteMutation(quotePayload);

      const transactionData = {
        gas: quoteData.estimate.gasCosts[0]
          ? BigInt(quoteData.estimate.gasCosts[0].estimate)
          : undefined,
        data: quoteData.transactionData.data,
        chain: quoteData.transactionData.chainId,
        value: parseEther(amountInEth),
        to: quoteData.transactionData.to,
      };

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
      verifyWalletProvider,
      switchChain,
      copilotTransaction,
      getQuoteMutation,
    ],
  );

  const isSending = getQuoteMutation.isPending || copilotTransaction.isPending;

  const isError = getQuoteMutation.isError || copilotTransaction.isError;

  const isSuccess = getQuoteMutation.isSuccess && copilotTransaction.isSuccess;

  const quoteData = getQuoteMutation.data;

  const transactionData = copilotTransaction.data;

  const isIdle = !isSending && !isError && !isSuccess;

  const details = {
    from: {
      amount: Number(
        formatEther(BigInt(getQuoteMutation.data?.estimate.fromAmount ?? 0)),
      ),
      symbol: getQuoteMutation.data?.includedSteps[0]?.action.fromToken.symbol,
    },
    to: {
      amount: Number(
        formatEther(BigInt(getQuoteMutation.data?.estimate.toAmount ?? 0)),
      ),
      symbol: getQuoteMutation.data?.includedSteps[0]?.action.toToken.symbol,
    },
  };

  const reset = useCallback(() => {
    getQuoteMutation.reset();
    copilotTransaction.reset();
  }, [copilotTransaction, getQuoteMutation]);

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
