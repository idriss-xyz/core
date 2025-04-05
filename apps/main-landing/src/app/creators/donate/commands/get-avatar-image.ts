import { useQuery } from '@tanstack/react-query';

import { IDRISS_LEGACY_API_URL, WHITELISTED_URLS } from '../constants';

type Payload = {
  url: string;
};

type Options = {
  enabled?: boolean;
};

const getAvatarImage = async (payload: Payload): Promise<string> => {
  // Check if the URL is in the whitelist
  const isWhitelisted = WHITELISTED_URLS.some((baseUrl) => {
    return payload.url.startsWith(baseUrl);
  });

  if (isWhitelisted) {
    return payload.url;
  }

  const avatarImage = await fetch(
    `${IDRISS_LEGACY_API_URL}/fetch-image?url=${payload.url}`,
  );

  if (!avatarImage.ok) {
    throw new Error('Failed to fetch avatar image');
  }

  const avatar = await avatarImage.json();

  return avatar.image as string;
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
