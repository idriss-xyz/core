import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  NewOrder,
  OrderBuilder,
  OrderType,
  TickSize,
} from '@polymarket/clob-client';
import { orderToJson } from '@polymarket/clob-client/dist/utilities';
import { createL2Headers } from '@polymarket/clob-client/dist/headers';
import { JsonRpcSigner } from '@ethersproject/providers';

import { CHAIN, Hex, useWallet } from 'shared/web3';

import { PostOrderCommand } from '../commands';
import { POLYMARKET_GNOSIS_SAFE_SIGNATURE } from '../constants';
import { L2Headers } from '../types';

import { getSafeWalletQueryKey } from './use-safe-wallet';

export interface PostOrderProperties {
  orderPayload: NewOrder<OrderType.FOK>;
  l2Headers: L2Headers;
}

export interface PostOrderMutationProperties {
  signer: JsonRpcSigner;
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
}

const postOrder = async ({ l2Headers, orderPayload }: PostOrderProperties) => {
  const command = new PostOrderCommand({ orderPayload, headers: l2Headers });
  return command.send();
};

export const usePostOrder = () => {
  const queryClient = useQueryClient();
  const { wallet } = useWallet();

  return useMutation({
    onSuccess: (_, { amount }) => {
      if (wallet?.account) {
        queryClient.setQueryData<{ address: Hex; balance: number }>(
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
    mutationFn: async ({
      signer,
      funderAddress,
      amount,
      negRisk,
      tokenID,
      tickSize,
      credentials,
    }: PostOrderMutationProperties) => {
      const orderBuilder = new OrderBuilder(
        signer,
        CHAIN.POLYGON.id,
        POLYMARKET_GNOSIS_SAFE_SIGNATURE,
        funderAddress,
      );
      const order = await orderBuilder.buildMarketOrder(
        {
          tokenID,
          amount,
        },
        { tickSize, negRisk },
      );
      const orderPayload = orderToJson(order, credentials.key, OrderType.FOK);
      const l2Headers = await createL2Headers(signer, credentials, {
        method: 'POST',
        requestPath: `/order`,
        body: JSON.stringify(orderPayload),
      });

      return postOrder({ orderPayload, l2Headers });
    },
  });
};
