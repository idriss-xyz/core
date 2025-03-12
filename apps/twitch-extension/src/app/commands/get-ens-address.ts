import { normalize } from 'viem/ens';
import { useMutation } from '@tanstack/react-query';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

type Payload = {
  ensName: string;
};

type Options = {
  enabled?: boolean;
};

const getEnsAddress = async (payload: Payload) => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://eth.llamarpc.com'),
  });

  return await client.getEnsAddress({
    name: normalize(payload.ensName),
  });
};

export const useGetEnsAddress = (options?: Options) => {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      return await getEnsAddress({ ensName: payload.ensName });
    },
    ...options,
  });
};
