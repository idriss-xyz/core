import { useCallback, useState } from 'react';
import { Hex, WalletClient } from 'viem';
import { getSafeNumber, isNativeTokenAddress } from '@idriss-xyz/utils';
import { CHAIN_ID_TO_TOKENS, EMPTY_HEX } from '@idriss-xyz/constants';

import { clients } from '@/app/creators/obs/constants/blockchain-clients';

import { SendPayload } from '../schema';
import { ERC20_ABI } from '../constants';

import { useSwitchChain } from './use-switch-chain';
import { useGetTokenPerDollar } from './use-get-token-per-dollar';
import { useNativeTransaction } from './use-native-transaction';
import { useErc20Transaction } from './use-erc20-transaction';

type Properties = {
  walletClient?: WalletClient;
};

export const useSender = ({ walletClient }: Properties) => {
  const [haveEnoughBalance, setHaveEnoughBalance] = useState<boolean>(true);
  const switchChain = useSwitchChain();

  const getTokenPerDollarMutation = useGetTokenPerDollar();
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
      if (!walletClient?.account?.address) {
        console.error('walletClient not defined');
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
        (valueAsBigNumber * BigInt(10) ** BigInt(tokenToSend?.decimals ?? 0)) /
        BigInt(10) ** BigInt(decimals);

      const isNativeToken = isNativeTokenAddress(sendPayload.tokenAddress);

      await switchChain.mutateAsync({
        chainId: sendPayload.chainId,
        walletClient,
      });

      const getUserBalance = async (userAddress: Hex) => {
        const clientDetails = clients.find((client) => {
          return client.chain === sendPayload.chainId;
        });

        if (!clientDetails) {
          return;
        }

        const { client } = clientDetails;

        if (isNativeToken) {
          const userBalance = await client.getBalance({
            address: userAddress,
          });

          return userBalance;
        } else {
          const userBalance = await client.readContract({
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [userAddress],
            address: tokenToSend?.address ?? EMPTY_HEX,
          });

          return userBalance;
        }
      };

      const userBalance = await getUserBalance(walletClient.account.address);

      if (userBalance && tokensToSend <= userBalance) {
        setHaveEnoughBalance(true);
      } else {
        setHaveEnoughBalance(false);

        return;
      }

      if (isNativeTokenAddress(sendPayload.tokenAddress)) {
        nativeTransaction.mutate({
          tokensToSend,
          recipientAddress,
          walletClient,
          chainId: sendPayload.chainId,
          message: sendPayload.message,
        });
      } else {
        erc20Transaction.mutate({
          recipientAddress,
          tokenAddress: sendPayload.tokenAddress,
          walletClient,
          tokensToSend,
          chainId: sendPayload.chainId,
          message: sendPayload.message,
        });
      }
    },
    [
      erc20Transaction,
      getTokenPerDollarMutation,
      nativeTransaction,
      switchChain,
      walletClient,
    ],
  );

  const isSending = nativeTransaction.isPending || erc20Transaction.isPending;

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

  const reset = useCallback(() => {
    getTokenPerDollarMutation.reset();
    nativeTransaction.reset();
    erc20Transaction.reset();
    switchChain.reset();
    setHaveEnoughBalance(true);
  }, [
    erc20Transaction,
    getTokenPerDollarMutation,
    nativeTransaction,
    switchChain,
  ]);

  const resetBalance = useCallback(() => {
    setHaveEnoughBalance(true);
  }, []);

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
    resetBalance,
  };
};
