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
import { useGetTokenPrice } from './use-get-token-price';
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

export type SenderReturnType = {
  send: ({
    sendPayload,
    recipientAddress,
  }: {
    recipientAddress: `0x${string}`;
    sendPayload: SendPayload;
  }) => Promise<void>;
  data:
    | {
        transactionHash: `0x${string}`;
      }
    | undefined;
  reset: () => void;
  isIdle: boolean;
  isError: boolean;
  isSending: boolean;
  isSuccess: boolean;
  resetBalance: () => void;
  tokensToSend: bigint | undefined;
  haveEnoughBalance: boolean;
};

export const useSender = ({ walletClient, callbackOnSend }: Properties) => {
  const switchChain = useSwitchChain();
  const nativeTransaction = useNativeTransaction();
  const erc20Transaction = useErc20Transaction();
  const erc721Transaction = useErc721Transaction();
  const erc1155Transaction = useErc1155Transaction();
  const getTokenPriceMutation = useGetTokenPrice();
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

      // Send flow for ERC721 tokens
      if (sendPayload.type === 'erc721') {
        if (!sendPayload.contract || !sendPayload.tokenId) {
          throw new Error('Missing contract or tokenId');
        }
        erc721Transaction.mutate({
          walletClient,
          chainId: sendPayload.chainId,
          recipientAddress,
          message: sendPayload.message,
          tokenId: BigInt(sendPayload.tokenId),
          collectionAddress: sendPayload.contract,
          callbackOnSend,
        });
        return;
      }

      // Send flow for ERC1155 tokens
      if (sendPayload.type === 'erc1155') {
        if (
          !sendPayload.contract ||
          !sendPayload.tokenId ||
          !sendPayload.amount
        ) {
          throw new Error('Missing contract or tokenId');
        }

        const bal1155 = await client.readContract({
          abi: erc1155Abi,
          address: sendPayload.contract,
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
          contractAddress: sendPayload.contract,
          tokenId: BigInt(sendPayload.tokenId),
          amount: amount1155,
          callbackOnSend,
        });
        return;
      }

      // Normal ERC20 send flow
      if (!sendPayload.tokenAddress || !sendPayload.amount) {
        console.error('Missing token address or amount');
        return;
      }

      const isNativeToken = isNativeTokenAddress(sendPayload.tokenAddress);

      const usdcToken = CHAIN_ID_TO_TOKENS[sendPayload.chainId]?.find((t) => {
        return t.symbol === 'USDC';
      });

      const tokenPrice = await getTokenPriceMutation.mutateAsync({
        chainId: sendPayload.chainId,
        buyToken: sendPayload.tokenAddress,
        sellToken: usdcToken?.address ?? '',
      });

      const tokenPerDollarNormalised = 1 / Number(tokenPrice.price);

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
      getTokenPriceMutation,
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
    getTokenPriceMutation.isError;

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
    getTokenPriceMutation.reset();
    setHaveEnoughBalance(true);
  }, [
    switchChain,
    erc20Transaction,
    nativeTransaction,
    erc721Transaction,
    erc1155Transaction,
    getTokenPriceMutation,
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
