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
    `https://api.idriss.xyz/token-price?${new URLSearchParams({
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
};
