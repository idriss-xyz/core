import { useCallback } from 'react';

import {
  CHAIN_ID_TO_TOKENS,
  GetTokenPriceCommand,
  Hex,
  Wallet,
  isNativeTokenAddress,
  useSwitchChain,
} from 'shared/web3';
import { useCommandMutation } from 'shared/messaging';

import { SendPayload } from '../schema';
import { getSafeNumber } from '../utils';

import { useNativeTransaction } from './use-native-transaction';
import { useErc20Transaction } from './use-erc20-transaction';

interface Properties {
  wallet?: Wallet;
}

export const useSender = ({ wallet }: Properties) => {
  const switchChain = useSwitchChain();

  const getTokenPerDollarMutation = useCommandMutation(GetTokenPriceCommand);
  const nativeTransaction = useNativeTransaction();
  const erc20Transaction = useErc20Transaction();

  const send = useCallback(
    async ({
      sendPayload,
      recipientAddress,
    }: {
      recipientAddress: Hex;
      sendPayload: SendPayload;
    }) => {
      if (!wallet) {
        return;
      }

      const usdcToken = CHAIN_ID_TO_TOKENS[sendPayload.chainId]?.find(
        (token) => {
          return token.symbol === 'USDC';
        },
      );

      const tokenPerDollar = await getTokenPerDollarMutation.mutateAsync({
        chainId: sendPayload.chainId,
        amount: 10 ** (usdcToken?.decimals ?? 0),
        buyToken: sendPayload.tokenAddress,
        sellToken: usdcToken?.address ?? '',
      });
      const tokenPerDollarNormalised = Number(tokenPerDollar.price);

      const tokenToSend = CHAIN_ID_TO_TOKENS[sendPayload.chainId]?.find(
        (token) => {
          return token.address === sendPayload.tokenAddress;
        },
      );

      const { decimals, value } = getSafeNumber(
        tokenPerDollarNormalised * sendPayload.amount,
      );

      const valueAsBigNumber = BigInt(value.toString());
      const tokensToSend =
        (valueAsBigNumber *
          BigInt((10 ** (tokenToSend?.decimals ?? 0)).toString())) /
        BigInt((10 ** decimals).toString());

      await switchChain.mutateAsync({
        chainId: sendPayload.chainId,
        wallet,
      });

      if (isNativeTokenAddress(sendPayload.tokenAddress)) {
        nativeTransaction.mutate({
          tokensToSend,
          recipientAddress,
          wallet,
          chainId: sendPayload.chainId,
        });
      } else {
        erc20Transaction.mutate({
          recipientAddress,
          tokenAddress: sendPayload.tokenAddress,
          wallet,
          tokensToSend,
          chainId: sendPayload.chainId,
        });
      }
    },
    [
      erc20Transaction,
      getTokenPerDollarMutation,
      nativeTransaction,
      switchChain,
      wallet,
    ],
  );

  const isSending =
    switchChain.isPending ||
    nativeTransaction.isPending ||
    erc20Transaction.isPending ||
    getTokenPerDollarMutation.isPending;

  const isError =
    switchChain.isError ||
    getTokenPerDollarMutation.isError ||
    nativeTransaction.isError ||
    erc20Transaction.isError;

  const isSuccess = nativeTransaction.isSuccess || erc20Transaction.isSuccess;

  const data = nativeTransaction.data ?? erc20Transaction.data;

  const tokensToSend = nativeTransaction.isPending
    ? nativeTransaction.variables?.tokensToSend
    : erc20Transaction.isPending
      ? erc20Transaction.variables.tokensToSend
      : undefined;

  const isIdle = !isSending && !isError && !isSuccess;

  return { send, isSending, isError, isSuccess, isIdle, data, tokensToSend };
};
