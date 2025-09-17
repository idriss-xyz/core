import { useCallback, useState } from 'react';
import { Hex, WalletClient, erc1155Abi } from 'viem';
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
import { useErc721Transaction } from './use-erc721-transaction';
import { useErc1155Transaction } from './use-erc1155-transaction';

type Properties = {
  walletClient?: WalletClient;
  callbackOnSend?: (txHash: string) => void;
};

const utf8Bytes = (s: string) => {
  return new TextEncoder().encode(s).length;
};

export const useSender = ({ walletClient, callbackOnSend }: Properties) => {
  const switchChain = useSwitchChain();
  const nativeTransaction = useNativeTransaction();
  const erc20Transaction = useErc20Transaction();
  const erc721Transaction = useErc721Transaction();
  const erc1155Transaction = useErc1155Transaction();
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

      // message byte limit (280)
      if (utf8Bytes(sendPayload.message) > 280) {
        setHaveEnoughBalance(true);
        throw new Error('Message exceeds 280 bytes');
      }

      await switchChain.mutateAsync({
        walletClient,
        chainId: sendPayload.chainId,
      });

      const clientDetails = clients.find((c) => {
        return c.chain === sendPayload.chainId;
      });
      if (!clientDetails) return;
      const { client } = clientDetails;

      if (sendPayload.type === 'erc721') {
        erc721Transaction.mutate({
          walletClient,
          chainId: sendPayload.chainId,
          recipientAddress,
          message: sendPayload.message,
          collectionAddress: sendPayload.tokenAddress,
          tokenId: BigInt(sendPayload.tokenId),
          callbackOnSend,
        });
        return;
      }

      if (sendPayload.type === 'erc1155') {
        // balance check for ERC1155
        const bal1155 = await client.readContract({
          abi: erc1155Abi,
          address: sendPayload.tokenAddress,
          functionName: 'balanceOf',
          args: [walletClient.account.address, BigInt(sendPayload.tokenId)],
        });

        const amount1155 = BigInt(sendPayload.amount);
        if (bal1155 && amount1155 <= bal1155) {
          setHaveEnoughBalance(true);
        } else {
          setHaveEnoughBalance(false);
          return;
        }

        erc1155Transaction.mutate({
          walletClient,
          chainId: sendPayload.chainId,
          recipientAddress,
          message: sendPayload.message,
          contractAddress: sendPayload.tokenAddress,
          tokenId: BigInt(sendPayload.tokenId),
          amount: amount1155,
          callbackOnSend,
        });
        return;
      }

      const isNativeToken = isNativeTokenAddress(sendPayload.tokenAddress);

      const usdcToken = CHAIN_ID_TO_TOKENS[sendPayload.chainId]?.find((t) => {
        return t.symbol === 'USDC';
      });

      const tokenPerDollar = await getTokenPerDollarMutation.mutateAsync({
        chainId: sendPayload.chainId,
        buyToken: sendPayload.tokenAddress,
        sellToken: usdcToken?.address ?? '',
        amount: 10 ** (usdcToken?.decimals ?? 0),
      });

      const tokenPerDollarNormalised = Number(tokenPerDollar.price);

      const tokenToSend = CHAIN_ID_TO_TOKENS[sendPayload.chainId]?.find((t) => {
        return t.address === sendPayload.tokenAddress;
      });

      const { decimals, value } = getSafeNumber(
        tokenPerDollarNormalised * sendPayload.amount,
      );

      const valueAsBigNumber = BigInt(value.toString());

      const tokensToSend =
        (valueAsBigNumber * BigInt(10) ** BigInt(tokenToSend?.decimals ?? 0)) /
        BigInt(10) ** BigInt(decimals);

      const getUserBalance = async (userAddress: Hex) => {
        if (isNativeToken) {
          const [bal, gasPrice] = await Promise.all([
            client.getBalance({ address: userAddress }),
            client.getGasPrice(),
          ]);
          const buffer = gasPrice * 120_000n;
          return bal > buffer ? bal - buffer : 0n;
        } else {
          const bal = await client.readContract({
            abi: ERC20_ABI,
            args: [userAddress],
            functionName: 'balanceOf',
            address: tokenToSend?.address ?? EMPTY_HEX,
          });
          return bal;
        }
      };

      const userBalance = await getUserBalance(walletClient.account.address);

      if (userBalance && tokensToSend <= userBalance) {
        setHaveEnoughBalance(true);
      } else {
        setHaveEnoughBalance(false);
        return;
      }

      if (isNativeToken) {
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
      erc721Transaction,
      erc1155Transaction,
      getTokenPerDollarMutation,
      callbackOnSend,
    ],
  );

  const isSending =
    nativeTransaction.isPending ||
    erc20Transaction.isPending ||
    erc721Transaction.isPending ||
    erc1155Transaction.isPending;

  const isError =
    switchChain.isError ||
    erc20Transaction.isError ||
    nativeTransaction.isError ||
    erc721Transaction.isError ||
    erc1155Transaction.isError ||
    getTokenPerDollarMutation.isError;

  const isSuccess =
    nativeTransaction.isSuccess ||
    erc20Transaction.isSuccess ||
    erc721Transaction.isSuccess ||
    erc1155Transaction.isSuccess;

  const data =
    nativeTransaction.data ??
    erc20Transaction.data ??
    erc721Transaction.data ??
    erc1155Transaction.data;

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
    erc721Transaction.reset();
    erc1155Transaction.reset();
    getTokenPerDollarMutation.reset();
    setHaveEnoughBalance(true);
  }, [
    switchChain,
    erc20Transaction,
    nativeTransaction,
    erc721Transaction,
    erc1155Transaction,
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
