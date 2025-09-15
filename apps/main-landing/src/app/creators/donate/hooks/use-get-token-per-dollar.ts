import { IDRISS_LEGACY_API_URL } from '@idriss-xyz/constants';
import { useMutation } from '@tanstack/react-query';

type Payload = {
  amount: number;
  chainId: number;
  buyToken: string;
  sellToken: string;
};

type Response = {
  price: string;
};

export const useGetTokenPerDollar = () => {
  return useMutation({
    mutationFn: async (payload: Payload): Promise<Response> => {
      if (payload.buyToken === payload.sellToken) {
        return { price: '1' };
      }

      const response = await fetch(
        `${IDRISS_LEGACY_API_URL}/token-price?${new URLSearchParams({
          buyToken: payload.buyToken,
          sellToken: payload.sellToken,
          network: payload.chainId.toString(),
          sellAmount: payload.amount.toString(),
        }).toString()}`,
      );

      if (!response.ok) {
        throw new Error('Error');
      }

      const json = (await response.json()) as Response;

      return json;
    },
  });
};
