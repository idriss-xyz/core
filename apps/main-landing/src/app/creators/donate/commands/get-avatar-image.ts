import { useQuery } from '@tanstack/react-query';

type Payload = {
  url: string;
};

type Options = {
  enabled?: boolean;
};

const getAvatarImage = async (payload: Payload) => {
  const response = await fetch(
    `https://api.idriss.xyz/fetch-image?url=${payload.url}`,
  );

  const avatarImage = await response.json();

  return avatarImage.image as string;
};

export const useGetAvatarImage = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['avatarImage', payload.url],
    queryFn: () => {
      return getAvatarImage({ url: payload.url });
    },
    ...options,
  });
};
