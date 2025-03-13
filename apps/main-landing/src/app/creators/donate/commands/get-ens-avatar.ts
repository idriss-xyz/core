import { useQuery } from '@tanstack/react-query';

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
  const apiBaseUrl =
    typeof window !== 'undefined' &&
    window.location.origin === 'https://idriss.yz'
      ? ''
      : 'https://idriss.xyz';
  const response = await fetch(`${apiBaseUrl}/ens-avatar?ens=${payload.name}`, {
    method: 'GET',
  });
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
