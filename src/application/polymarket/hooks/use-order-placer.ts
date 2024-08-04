import { useCallback } from 'react';

import { createSigner } from 'shared/web3';

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
    async (parameters: PlaceOrderParameters) => {
      const signer = createSigner(parameters.wallet);
      const credentials = await authorizer.authorize(signer);

      await postOrder.mutateAsync({
        funderAddress: parameters.funderAddress,
        tickSize: parameters.orderDetails.minimumTickSize,
        negRisk: parameters.orderDetails.negRisk,
        tokenID: parameters.orderDetails.tokenId,
        amount: parameters.orderDetails.amount,
        credentials: {
          passphrase: credentials.passphrase,
          secret: credentials.secret,
          key: credentials.apiKey,
        },
        signer,
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
