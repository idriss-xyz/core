import { useCallback } from 'react';
import { formatEther, parseEther } from 'viem';

import { Wallet, CHAIN } from 'shared/web3';
import { useCommandMutation } from 'shared/messaging';

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
  const quoteQuery = useCommandMutation(GetQuoteCommand);
  const copilotTransaction = useCopilotTransaction();

  const exchange = useCallback(
    async ({ formValues, dialog }: CallbackProperties) => {
      if (!wallet || Number(formValues.amount) === 0) {
        return;
      }

      const handleQuoteQuery = async (payload: QuotePayload) => {
        return await quoteQuery.mutateAsync(payload);
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

      copilotTransaction.mutate({
        wallet: wallet,
        transactionData,
      });
    },
    [copilotTransaction, quoteQuery, wallet],
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
