import { useQuery } from '@tanstack/react-query';
import { createPublicClient, Hex, http } from 'viem';
import { mainnet } from 'viem/chains';

type Payload = {
  address: Hex;
};

type Options = {
  enabled?: boolean;
};

const getEnsName = async (payload: Payload) => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://eth.llamarpc.com'),
  });

  return await client.getEnsName({
    address: payload.address,
  });
};

export const useGetEnsName = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['ensName', payload.address],
    queryFn: () => {
      return getEnsName({ address: payload.address });
    },
    ...options,
  });
};
