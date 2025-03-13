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
  // ToDo: change localhost to https://idriss.xyz
  const response = await fetch(
    `http://localhost:3000/api/ens-avatar?ens=${payload.name}`,
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
