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
  isTwitchExtension?: boolean;
};

const getEnsAvatar = async (payload: Payload, isTwitchExtension?: boolean) => {
  if (isTwitchExtension) {
    const response = await fetch(
      `${IDRISS_BASE_URL}/api/ens-avatar?ens=${payload.name}`,
    );

    const avatarImage = await response.json();

    return avatarImage.image as string;
  } else {
    const client = createPublicClient({
      chain: mainnet,
      transport: http('https://eth.llamarpc.com'),
    });

    return await client.getEnsAvatar({
      name: normalize(payload.name),
    });
  }
};

export const useGetEnsAvatar = (payload: Payload, options?: Options) => {
  const { isTwitchExtension, ...queryOptions } = options ?? {};

  return useQuery({
    queryKey: ['ensAvatar', payload.name],
    queryFn: () => {
      return getEnsAvatar({ name: payload.name }, isTwitchExtension);
    },
    ...queryOptions,
  });
};
