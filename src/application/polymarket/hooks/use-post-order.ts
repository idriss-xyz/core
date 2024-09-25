import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createWalletClient, useWallet, Wallet } from 'shared/web3';
import { useCommandMutation } from 'shared/messaging';

import { L2Headers, SafeWallet, TickSize } from '../types';
import {
  buildMarketBuyOrderCreationArguments,
  buildOrder,
  buildOrderSignaturePayload,
  buildPolyHmacSignature,
  orderToJson,
} from '../utils';
import { PostOrderCommand } from '../commands';

import { getSafeWalletQueryKey } from './use-safe-wallet';

interface PostOrderMutationProperties {
  wallet: Wallet;
  funderAddress: string;
  tokenID: string;
  amount: number;
  tickSize: TickSize;
  negRisk: boolean;
  credentials: {
    key: string;
    secret: string;
    passphrase: string;
  };
  timestamp: string;
}

export const usePostOrder = () => {
  const queryClient = useQueryClient();
  const { wallet } = useWallet();

  const postOrderMutation = useCommandMutation(PostOrderCommand);

  return useMutation({
    onSuccess: (_, { amount }) => {
      if (wallet?.account) {
        queryClient.setQueryData<SafeWallet>(
          getSafeWalletQueryKey(wallet),
          (currentData) => {
            if (!currentData) {
              return;
            }
            return {
              ...currentData,
              balance: currentData.balance - amount,
            };
          },
        );
      }
    },
    mutationFn: async (properties: PostOrderMutationProperties) => {
      const {
        amount,
        funderAddress,
        tickSize,
        tokenID,
        wallet,
        negRisk,
        credentials,
        timestamp,
      } = properties;
      const walletClient = createWalletClient(wallet);
      const orderData = buildMarketBuyOrderCreationArguments({
        address: wallet.account,
        tokenId: tokenID,
        tickSize,
        funderAddress,
        amount,
      });

      const order = buildOrder({
        orderData,
      });

      const orderSignaturePayload = buildOrderSignaturePayload({
        order,
        negRisk,
      });

      const orderSignature = await walletClient.signTypedData(
        orderSignaturePayload,
      );

      const orderJson = orderToJson(order, orderSignature, credentials.key);

      const sig = buildPolyHmacSignature(
        credentials.secret,
        timestamp,
        'POST',
        '/order',
        JSON.stringify(orderJson),
      );

      const headers: L2Headers = {
        POLY_ADDRESS: wallet.account,
        POLY_SIGNATURE: sig,
        POLY_TIMESTAMP: timestamp,
        POLY_API_KEY: credentials.key,
        POLY_PASSPHRASE: credentials.passphrase,
      };

      return postOrderMutation.mutate({ order: orderJson, headers });
    },
  });
};
