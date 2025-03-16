import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

import { IDRISS_BASE_URL } from '../constants';

type Payload = {
  name: string;
};

type Options = {
  enabled?: boolean;
};

const getEnsAvatar = async (payload: Payload) => {
  if (window.location.hostname === IDRISS_BASE_URL) {
    const client = createPublicClient({
      chain: mainnet,
      transport: http('https://eth.llamarpc.com'),
    });

    return await client.getEnsAvatar({
      name: normalize(payload.name),
    });
  } else {
    const response = await fetch(
      `${IDRISS_BASE_URL}/api/ens-avatar?ens=${payload.name}`,
    );

    const avatarImage = await response.json();

    return avatarImage.image as string;
  }
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
