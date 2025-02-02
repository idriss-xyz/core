import { useQuery } from '@tanstack/react-query';
import { createPublicClient, formatEther, http } from 'viem';
import { base } from 'viem/chains';

import { Hex } from '@/app/creators/donate/types';
import { STAKER_ADDRESS, StakingABI } from '@/app/vault/constants';

type Payload = {
  address: Hex;
};

const getStakedBalance = async (payload: Payload) => {
  const client = createPublicClient({
    chain: base,
    transport: http(),
  });

  const balance = await client.readContract({
    abi: StakingABI,
    address: STAKER_ADDRESS,
    functionName: 'getStakedBalance',
    args: [payload.address],
  });

  return formatEther(balance as bigint);
};

export const useGetStakedBalance = (payload: Payload) => {
  return useQuery({
    queryKey: ['stakedBalance', payload.address],
    queryFn: () => {
      return getStakedBalance({ address: payload.address });
    },
  });
};
