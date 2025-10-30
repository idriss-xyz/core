import { CREATOR_API_URL } from '../../constants/src';

type Payload = {
  amount: number;
  chainId: number;
  buyToken: string;
  sellToken: string;
};

type Response = {
  price: string;
};

export const getTokenPerDollar = async (
  payload: Payload,
): Promise<Response> => {
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
};
