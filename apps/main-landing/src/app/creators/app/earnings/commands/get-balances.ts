import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';
import { CREATOR_API_URL, TokenBalance } from '@idriss-xyz/constants';

interface BalancesResponse {
  tokenResult: {
    balances: TokenBalance[];
    summary: {
      totalUsdBalance: number;
    };
  };
}

type Payload = {
  address?: Hex;
};

type Options = {
  enabled?: boolean;
};

const getTokenBalances = async (
  payload: Payload,
): Promise<BalancesResponse> => {
  if (!payload.address) {
    throw new Error('Address is required to fetch balances');
  }
  const response = await fetch(
    `${CREATOR_API_URL}/get-balances/${payload.address}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch balances');
  }

  const balances = await response.json();

  return balances as BalancesResponse;
};

export const useGetTokenBalances = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['balances', payload.address],
    queryFn: () => {
      return getTokenBalances(payload);
    },
    ...options,
  });
};
