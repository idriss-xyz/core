import { useMutation } from '@tanstack/react-query';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

import { CLAIM_ABI, CLAIMER_ADDRESS } from '@/app/claim/constants';
import { ClaimData } from '@/app/claim/types';

type Payload = {
  claimData: ClaimData;
};

const checkClaimStatus = async (payload: Payload) => {
  const client = createPublicClient({
    chain: base,
    transport: http(),
  });

  return await client.readContract({
    abi: CLAIM_ABI,
    address: CLAIMER_ADDRESS,
    functionName: 'isClaimed',
    args: [payload.claimData.claimIndices[0]],
  });
};

export const useCheckClaimStatus = () => {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      return checkClaimStatus({ claimData: payload.claimData });
    },
  });
};
