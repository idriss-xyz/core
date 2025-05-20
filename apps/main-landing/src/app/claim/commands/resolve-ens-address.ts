import { useMutation } from '@tanstack/react-query';
import { normalize } from 'viem/ens';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

type Payload = {
  name: string;
};

const resolveEnsAddress = async (payload: Payload) => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://1rpc.io/eth'),
  });

  return await client.getEnsAddress({
    name: normalize(payload.name),
  });
};

export const useResolveEnsAddress = () => {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      return await resolveEnsAddress({ name: payload.name });
    },
  });
};
