import { useQuery } from '@tanstack/react-query';

import { IDRISS_API_URL } from '../constants';

type Payload = {
  name: string;
};

type Options = {
  enabled?: boolean;
};

interface EnsAvatarResponse {
  image: string;
}

const getEnsAvatar = async (payload: Payload): Promise<string> => {
  const response = await fetch(
    `${IDRISS_API_URL}/ens-avatar?ens=${payload.name}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch ENS avatar');
  }
  const data: EnsAvatarResponse = await response.json();
  return data.image;
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
