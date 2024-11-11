import { useMutation } from '@tanstack/react-query';

type Payload = {
  buyToken: string;
  sellToken: string;
  chainId: number;
  amount: number;
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
        `https://api.idriss.xyz/token-price?${new URLSearchParams({
          sellToken: payload.sellToken,
          buyToken: payload.buyToken,
          sellAmount: payload.amount.toString(),
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
