import { useQuery } from '@tanstack/react-query';

type Payload = {
  name: string;
};

type Options = {
  enabled?: boolean;
};

const getEnsAvatarFromApi = async (payload: Payload) => {
  const response = await fetch(
    `https://idriss.xyz/api/ens-avatar?ens=${payload.name}`,
  );

  const avatarImage = await response.json();

  return avatarImage.image as string;
};

export const useGetEnsAvatarFromApi = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['avatarImageFromApi', payload.name],
    queryFn: () => {
      return getEnsAvatarFromApi({ name: payload.name });
    },
    ...options,
  });
};
