import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { useMutation } from '@tanstack/react-query';

type Payload = {
  chainId: number;
  buyToken: string;
  sellToken: string;
};

type Response = {
  price: string;
};

export const useGetTokenPrice = () => {
  return useMutation({
    mutationFn: async (payload: Payload): Promise<Response> => {
      if (payload.buyToken === payload.sellToken) {
        return { price: '1' };
      }

      const response = await fetch(
        `${CREATOR_API_URL}/token-price?${new URLSearchParams({
          buyToken: payload.buyToken,
          network: payload.chainId.toString(),
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
