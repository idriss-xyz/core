import { useCallback } from 'react';
import { formatEther, getAddress, hexToNumber, parseEther } from 'viem';

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
  formValues: FormValues;
  dialog: SwapData;
}

const getChainId = (network: keyof typeof CHAIN | 'SOLANA') => {
  return network === 'SOLANA' ? Number('1151111081099710') : CHAIN[network].id;
};

export const useExchanger = ({ wallet }: Properties) => {
  const { setWalletInfo } = useWallet();
  const switchChain = useSwitchChain();
  const copilotTransaction = useCopilotTransaction();
  const getQuoteMutation = useCommandMutation(GetQuoteCommand);

  const exchange = useCallback(
    async ({ formValues, dialog }: CallbackProperties) => {
      if (!wallet || Number(formValues.amount) === 0) {
        return;
      }

      const handleGetQuoteMutation = async (payload: QuotePayload) => {
        return await getQuoteMutation.mutateAsync(payload);
      };

      const amountInEth = formValues.amount;
      const amountInWei = parseEther(amountInEth).toString();

      const quotePayload = {
        amount: amountInWei,
        destinationChain: getChainId(dialog.tokenOut.network),
        fromAddress: wallet.account,
        destinationToken: dialog.tokenIn.address,
        originChain: getChainId(dialog.tokenIn.network),
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
    [wallet, switchChain, copilotTransaction, getQuoteMutation, setWalletInfo],
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
