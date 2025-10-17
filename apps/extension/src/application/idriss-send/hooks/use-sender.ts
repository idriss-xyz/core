import { useCallback, useState } from 'react';
import { getSafeNumber, isNativeTokenAddress } from '@idriss-xyz/utils';
import { Hex, parseEther } from 'viem';
import { Wallet } from '@idriss-xyz/wallet-connect';

import {
  CHAIN_ID_TO_TOKENS,
  GetEthBalanceCommand,
  GetTokenBalanceCommand,
  GetTokenPriceCommand,
  useSwitchChain,
} from 'shared/web3';
import { useCommandMutation } from 'shared/messaging';

import { SendPayload } from '../schema';

import { useNativeTransaction } from './use-native-transaction';
import { useErc20Transaction } from './use-erc20-transaction';

interface Properties {
  wallet?: Wallet;
}

export const useSender = ({ wallet }: Properties) => {
  const [haveEnoughBalance, setHaveEnoughBalance] = useState<boolean>(true);
  const switchChain = useSwitchChain();
  const getTokenPriceMutation = useCommandMutation(GetTokenPriceCommand);
  const getEthBalaceMutation = useCommandMutation(GetEthBalanceCommand);
  const getTokenBalanceMutation = useCommandMutation(GetTokenBalanceCommand);
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

      const tokenUsd = await getTokenPriceMutation.mutateAsync({
        chainId: sendPayload.chainId,
        amount: 10 ** (usdcToken?.decimals ?? 0),
        buyToken: sendPayload.tokenAddress,
        sellToken: usdcToken?.address ?? '',
      });
      const tokenPerDollarNormalised = 1 / Number(tokenUsd.price);

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

      const isNativeToken = isNativeTokenAddress(sendPayload.tokenAddress);

      await switchChain.mutateAsync({
        chainId: sendPayload.chainId,
        wallet,
      });

      const getUserBalance = async () => {
        if (isNativeToken) {
          const userBalance = await getEthBalaceMutation.mutateAsync({
            address: wallet.account,
            blockTag: 'safe',
            chainId: sendPayload.chainId,
          });
          return userBalance;
        } else {
          const userBalance = await getTokenBalanceMutation.mutateAsync({
            userAddress: wallet.account,
            tokenAddress: sendPayload.tokenAddress,
            chainId: sendPayload.chainId,
          });

          return userBalance;
        }
      };

      const userBalance = await getUserBalance();

      if (userBalance && tokensToSend <= parseEther(userBalance)) {
        setHaveEnoughBalance(true);
      } else {
        setHaveEnoughBalance(false);
        nativeTransaction.reset();
        erc20Transaction.reset();
        return;
      }

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
      getTokenPriceMutation,
      getEthBalaceMutation,
      getTokenBalanceMutation,
      nativeTransaction,
      switchChain,
      wallet,
    ],
  );

  const isSending =
    switchChain.isPending ||
    nativeTransaction.isPending ||
    erc20Transaction.isPending ||
    getTokenPriceMutation.isPending ||
    getEthBalaceMutation.isPending ||
    getTokenBalanceMutation.isPending;

  const isError =
    switchChain.isError ||
    getTokenPriceMutation.isError ||
    nativeTransaction.isError ||
    erc20Transaction.isError ||
    getEthBalaceMutation.isError ||
    getTokenBalanceMutation.isError;

  const isSuccess = nativeTransaction.isSuccess || erc20Transaction.isSuccess;

  const data = nativeTransaction.data ?? erc20Transaction.data;

  const tokensToSend = nativeTransaction.isPending
    ? nativeTransaction.variables?.tokensToSend
    : erc20Transaction.isPending
      ? erc20Transaction.variables.tokensToSend
      : undefined;

  const isIdle = !isSending && !isError && !isSuccess;

  const reset = useCallback(() => {
    getTokenPriceMutation.reset();
    nativeTransaction.reset();
    erc20Transaction.reset();
    switchChain.reset();
    setHaveEnoughBalance(true);
  }, [erc20Transaction, getTokenPriceMutation, nativeTransaction, switchChain]);

  return {
    send,
    isSending,
    isError,
    isSuccess,
    isIdle,
    data,
    tokensToSend,
    reset,
    haveEnoughBalance,
  };
};
