import { useQuery } from '@tanstack/react-query';
import { createPublicClient, formatEther, Hex, http } from 'viem';
import { base } from 'viem/chains';
import { REWARDS_ADDRESS, REWARDS_ABI } from '@idriss-xyz/constants';

type Payload = {
  address: Hex;
};

const getRewards = async (payload: Payload) => {
  const client = createPublicClient({
    chain: base,
    transport: http(),
  });

  const rewards = await client.readContract({
    abi: REWARDS_ABI,
    address: REWARDS_ADDRESS,
    functionName: 'rewards',
    args: [payload.address],
  });

  return formatEther(rewards) ?? '0';
};

export const useGetRewards = (payload: Payload) => {
  return useQuery({
    queryKey: ['Rewards', payload.address],
    queryFn: () => {
      return getRewards({ address: payload.address });
    },
  });
};
