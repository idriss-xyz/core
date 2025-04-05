import { useCallback } from 'react';
import { formatEther, parseEther } from 'viem';
import { Wallet, SolanaWallet } from '@idriss-xyz/wallet-connect';

import { useWallet } from 'shared/extension';
import {
  CHAIN,
  formatSol,
  NATIVE_ETH_ADDRESS,
  NATIVE_SOL_ADDRESS,
  useSwitchChain,
} from 'shared/web3';
import { useCommandMutation } from 'shared/messaging';

import { SwapData, FormValues, QuotePayload } from '../types';
import { GetQuoteCommand } from '../commands/get-quote';

import { useCopilotTransaction } from './use-copilot-transaction';
import { useCopilotSolanaTransaction } from './use-copilot-solana-transaction';

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
        originToken: NATIVE_ETH_ADDRESS,
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

interface SolanaExchangerProperties {
  wallet?: SolanaWallet;
}

export const useSolanaExchanger = ({ wallet }: SolanaExchangerProperties) => {
  const copilotTransaction = useCopilotSolanaTransaction();
  const getQuoteMutation = useCommandMutation(GetQuoteCommand);

  const exchange = useCallback(
    async ({ formValues, dialog }: CallbackProperties) => {
      if (!wallet || Number(formValues.amount) === 0) {
        return;
      }

      const handleGetQuoteMutation = async (payload: QuotePayload) => {
        return await getQuoteMutation.mutateAsync(payload);
      };

      const amountInLamports = BigInt(
        Math.round(Number.parseFloat(formValues.amount) * 1e9),
      );

      const quotePayload = {
        amount: amountInLamports.toString(),
        destinationChain: CHAIN[dialog.tokenOut.network].id,
        fromAddress: wallet.account,
        destinationToken: dialog.tokenIn.address,
        originChain: CHAIN[dialog.tokenIn.network].id,
        originToken: NATIVE_SOL_ADDRESS,
      };

      const quoteData = await handleGetQuoteMutation(quotePayload);

      const transactionData = {
        gas: quoteData.estimate.gasCosts[0]
          ? BigInt(quoteData.estimate.gasCosts[0].estimate)
          : undefined,
        data: quoteData.transactionData.data,
        chain: quoteData.transactionData.chainId,
        value: amountInLamports,
        to: quoteData.transactionData.to,
        routeOptions: {
          slippage: '0.02', // TODO: Get slippage from form (optionally)
        },
      };

      copilotTransaction.mutate({
        transactionData,
        wallet,
      });
    },
    [copilotTransaction, getQuoteMutation, wallet],
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
        formatSol(getQuoteMutation.data?.estimate.fromAmount ?? '0'),
      ),
      symbol: getQuoteMutation.data?.includedSteps[0]?.action.fromToken.symbol,
    },
    to: {
      amount: Number(
        formatSol(
          getQuoteMutation.data?.estimate.toAmount ?? '0',
          getQuoteMutation.data?.includedSteps[0]?.action.toToken.decimals,
        ),
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
