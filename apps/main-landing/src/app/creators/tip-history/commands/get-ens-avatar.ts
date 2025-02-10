import { normalize } from 'viem/ens';
import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

type Payload = {
  name: string;
};

type Options = {
  enabled?: boolean;
};

const getEnsAvatar = async (payload: Payload) => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://eth.llamarpc.com'),
  });

  return await client.getEnsAvatar({
    name: normalize(payload.name),
  });
};

export const useGetEnsAvatar = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['ensAvatar', payload.name],
    queryFn: () => {
      return getEnsAvatar({ name: payload.name });
    },
    ...options,
  });
};
