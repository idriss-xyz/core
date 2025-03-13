import { useQuery } from '@tanstack/react-query';

type Payload = {
  url: string;
};

type Options = {
  enabled?: boolean;
};

const WHITELISTED_URLS = [
  'https://imagedelivery.net/',
  'https://i.imgur.com/',
  'https://ik.imagekit.io/',
  'https://euc.li/',
];

const getAvatarImage = async (payload: Payload): Promise<string> => {
  // Check if the URL is in the whitelist
  const isWhitelisted = WHITELISTED_URLS.some((baseUrl) => {
    return payload.url.startsWith(baseUrl);
  });
  if (isWhitelisted) {
    return payload.url;
  }
  const response = await fetch(
    `https://api.idriss.xyz/fetch-image?url=${payload.url}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch avatar image');
  }
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
