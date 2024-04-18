import { useCallback } from 'react';

import { createEthersProvider } from 'shared/web3';

import { OrderPlacer, PlaceOrderParameters } from '../../polymarket.types';
import { useRequestAuth } from '../use-request-auth';
import { usePostOrder } from '../use-post-order';

import { UseOrderPlacerParameters } from './use-order.types';

export const useOrderPlacer = ({
  onSuccess,
}: UseOrderPlacerParameters): OrderPlacer => {
  const requestAuth = useRequestAuth();
  const postOrder = usePostOrder();

  const isPlacing = requestAuth.isPending || postOrder.isPending;
  const isPlaced = postOrder.isSuccess;
  const isError = requestAuth.isError || postOrder.isError;

  const place = useCallback(
    async (parameters: PlaceOrderParameters) => {
      const ethersProvider = createEthersProvider(parameters.wallet.provider);
      const signer = ethersProvider.getSigner(parameters.wallet.account);
      const credentials = await requestAuth.mutateAsync(signer);

      await postOrder.mutateAsync(
        {
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
        },
        {
          onSuccess: () => {
            return onSuccess?.(parameters);
          },
        },
      );
    },
    [postOrder, requestAuth, onSuccess],
  );

  const reset = useCallback(() => {
    requestAuth.reset();
    postOrder.reset();
  }, [postOrder, requestAuth]);

  return {
    reset,
    place,
    isError,
    isPlaced,
    isPlacing,
  };
};
