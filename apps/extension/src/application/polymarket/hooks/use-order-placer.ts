import { useCallback } from 'react';

import { OrderPlacer, PlaceOrderParameters } from '../types';

import { useAuthorizer } from './use-authorizer';
import { usePostOrder } from './use-post-order';

export const useOrderPlacer = (): OrderPlacer => {
  const authorizer = useAuthorizer();
  const postOrder = usePostOrder();

  const isPlacing = authorizer.isAuthorizing || postOrder.isPending;
  const isPlaced = postOrder.isSuccess;
  const isError = authorizer.isFailed || postOrder.isError;

  const place = useCallback(
    async (properties: PlaceOrderParameters) => {
      const { funderAddress, orderDetails, wallet } = properties;
      const timestamp = `${Math.floor(Date.now() / 1000)}`;
      const credentials = await authorizer.authorize({
        wallet,
        timestamp,
      });

      await postOrder.mutateAsync({
        funderAddress: funderAddress,
        tickSize: orderDetails.minimumTickSize,
        negRisk: orderDetails.negRisk,
        tokenID: orderDetails.tokenId,
        amount: orderDetails.amount,
        credentials: {
          passphrase: credentials.passphrase,
          secret: credentials.secret,
          key: credentials.apiKey,
        },
        wallet,
        timestamp,
      });
    },
    [authorizer, postOrder],
  );

  const reset = useCallback(() => {
    authorizer.reset();
    postOrder.reset();
  }, [postOrder, authorizer]);

  return {
    reset,
    place,
    isError,
    isPlaced,
    isPlacing,
  };
};
