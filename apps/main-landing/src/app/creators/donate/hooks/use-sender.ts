import { useCallback, useState } from 'react';
import { Hex, WalletClient } from 'viem';
import { getSafeNumber, isNativeTokenAddress } from '@idriss-xyz/utils';
import {
  CHAIN_ID_TO_TOKENS,
  EMPTY_HEX,
  ERC20_ABI,
} from '@idriss-xyz/constants';
import { clients } from '@idriss-xyz/blockchain-clients';

import { SendPayload } from '../schema';

import { useSwitchChain } from './use-switch-chain';
import { useGetTokenPerDollar } from './use-get-token-per-dollar';
import { useNativeTransaction } from './use-native-transaction';
import { useErc20Transaction } from './use-erc20-transaction';
// import { useErc721Transaction } from './use-erc721-transaction';
// import { useErc1155Transaction } from './use-erc1155-transaction';

type Properties = {
  walletClient?: WalletClient;
  callbackOnSend?: (txHash: string) => void;
};

export const useSender = ({ walletClient, callbackOnSend }: Properties) => {
  const switchChain = useSwitchChain();
  const nativeTransaction = useNativeTransaction();
  const erc20Transaction = useErc20Transaction();
  // const erc721Transaction = useErc721Transaction();
  // const erc1155Transaction = useErc1155Transaction();
  const getTokenPerDollarMutation = useGetTokenPerDollar();
  const [haveEnoughBalance, setHaveEnoughBalance] = useState<boolean>(true);

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
        buyToken: sendPayload.tokenAddress,
        sellToken: usdcToken?.address ?? '',
        amount: 10 ** (usdcToken?.decimals ?? 0),
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
        walletClient,
        chainId: sendPayload.chainId,
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
            args: [userAddress],
            functionName: 'balanceOf',
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
          walletClient,
          tokensToSend,
          recipientAddress,
          message: sendPayload.message,
          chainId: sendPayload.chainId,
          callbackOnSend,
        });
      } else {
        erc20Transaction.mutate({
          walletClient,
          tokensToSend,
          recipientAddress,
          message: sendPayload.message,
          chainId: sendPayload.chainId,
          tokenAddress: sendPayload.tokenAddress,
          callbackOnSend,
        });
      }
    },
    [
      switchChain,
      walletClient,
      erc20Transaction,
      nativeTransaction,
      getTokenPerDollarMutation,
      callbackOnSend,
    ],
  );

  const isSending = nativeTransaction.isPending || erc20Transaction.isPending;

  const isError =
    switchChain.isError ||
    erc20Transaction.isError ||
    nativeTransaction.isError ||
    getTokenPerDollarMutation.isError;

  const isSuccess = nativeTransaction.isSuccess || erc20Transaction.isSuccess;

  const data = nativeTransaction.data ?? erc20Transaction.data;

  const tokensToSend = nativeTransaction.isPending
    ? nativeTransaction.variables?.tokensToSend
    : erc20Transaction.isPending
      ? erc20Transaction.variables.tokensToSend
      : undefined;

  const isIdle = !isSending && !isError && !isSuccess;

  const reset = useCallback(() => {
    switchChain.reset();
    erc20Transaction.reset();
    nativeTransaction.reset();
    getTokenPerDollarMutation.reset();

    setHaveEnoughBalance(true);
  }, [
    switchChain,
    erc20Transaction,
    nativeTransaction,
    getTokenPerDollarMutation,
  ]);

  const resetBalance = useCallback(() => {
    setHaveEnoughBalance(true);
  }, []);

  return {
    send,
    data,
    reset,
    isIdle,
    isError,
    isSending,
    isSuccess,
    resetBalance,
    tokensToSend,
    haveEnoughBalance,
  };
};
