import { useQuery } from '@tanstack/react-query';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

type Payload = {
  names: string[];
};

type Options = {
  enabled?: boolean;
};

type StreamStatusResponse = {
  liveStatuses: Record<string, boolean>;
};

const getBatchTwitchStreamStatus = async (payload: Payload) => {
  if (!payload.names || payload.names.length === 0) {
    return { liveStatuses: {} };
  }

  const response = await fetch(
    `${CREATOR_API_URL}/twitch-stream-status/batch`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ names: payload.names }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch batch stream status');
  }

  const streamStatus = await response.json();

  return streamStatus as StreamStatusResponse;
};

export const useGetBatchTwitchStreamStatus = (
  payload: Payload,
  options?: Options,
) => {
  return useQuery({
    queryKey: ['batchTwitchStreamStatus', payload.names],
    queryFn: () => {
      return getBatchTwitchStreamStatus({ names: payload.names });
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60, // Refetch every 1 minute
    retry: 2,
    retryDelay: 5000,
    ...options,
  });
};
