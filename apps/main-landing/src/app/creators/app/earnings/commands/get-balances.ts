import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';
import {
  CREATOR_API_URL,
  TokenBalance,
  NftBalance,
} from '@idriss-xyz/constants';

interface BalancesResponse {
  tokenResult: {
    balances: TokenBalance[];
    summary: {
      totalUsdBalance: number;
    };
  };
}

interface CollectiblesResponse {
  nftResult: {
    balances: NftBalance[];
    summary: { totalUsdBalance: number };
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
    queryKey: ['token-balances', payload.address],
    queryFn: () => {
      return getTokenBalances(payload);
    },
    ...options,
  });
};

const getCollectibleBalances = async (
  payload: Payload,
): Promise<CollectiblesResponse> => {
  if (!payload.address) {
    throw new Error('Address is required to fetch balances');
  }
  const response = await fetch(
    `${CREATOR_API_URL}/get-balances/nft/${payload.address}?includePrices=true`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch balances');
  }

  const balances = await response.json();

  return balances as CollectiblesResponse;
};

export const useGetCollectibleBalances = (
  payload: Payload,
  options?: Options,
) => {
  return useQuery({
    queryKey: ['collectible-balances', payload.address],
    queryFn: () => {
      return getCollectibleBalances(payload);
    },
    ...options,
  });
};
