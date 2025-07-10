import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

interface TokenBalance {
  address: Hex;
  symbol: string;
  imageUrl?: string;
  network: string;
  decimals: number;
  balance: string;
  usdValue: number;
}

export interface BalancesResponse {
  balances: TokenBalance[];
  summary: {
    totalUsdBalance: number;
  };
}

type Payload = {
  address?: Hex;
};

type Options = {
  enabled?: boolean;
};

const getBalances = async (payload: Payload): Promise<BalancesResponse> => {
  if (!payload.address) {
    throw new Error('Address is required to fetch balances');
  }
  const response = await fetch(
    // `${CREATOR_API_URL}/get-balances/${payload.address}`,
    `${CREATOR_API_URL}/get-balances/0x7D716741D2c37925e5E15123025400Be80ec796d`, // todo: change to upper line
  );

  if (!response.ok) {
    throw new Error('Failed to fetch balances');
  }

  const balances = await response.json();

  return balances as BalancesResponse;
};

export const useGetBalances = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['balances', payload.address],
    queryFn: () => {
      return getBalances(payload);
    },
    ...options,
  });
};
