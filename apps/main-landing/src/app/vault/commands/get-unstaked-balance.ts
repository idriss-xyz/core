import { useQuery } from '@tanstack/react-query';
import { createPublicClient, formatEther, http } from 'viem';
import { base } from 'viem/chains';

import { ERC20_ABI } from '@/app/creators/donate/constants';
import { IDRISS_TOKEN_ADDRESS } from '@/components/token-section/constants';
import { Hex } from '@/app/creators/donate/types';

type Payload = {
  address: Hex;
};

const getUnstakedBalance = async (payload: Payload) => {
  const client = createPublicClient({
    chain: base,
    transport: http(),
  });

  const balance = await client.readContract({
    abi: ERC20_ABI,
    address: IDRISS_TOKEN_ADDRESS,
    functionName: 'balanceOf',
    args: [payload.address],
  });

  return formatEther(balance) ?? '0';
};

export const useGetUnstakedBalance = (payload: Payload) => {
  return useQuery({
    queryKey: ['unstakedBalance', payload.address],
    queryFn: () => {
      return getUnstakedBalance({ address: payload.address });
    },
  });
};
