import { useState, useEffect } from 'react';
import { getTimeDifferenceString } from '@idriss-xyz/utils';

type UseTimeAgoProperties = {
  timestamp?: string | number;
  text?: string;
  variant?: 'long' | 'short';
};

export const useTimeAgo = ({
  timestamp,
  text = 'ago',
  variant = 'short',
}: UseTimeAgoProperties) => {
  const [timeAgo, setTimeAgo] = useState(() => {
    return timestamp
      ? getTimeDifferenceString({
          text,
          variant,
          timestamp,
        })
      : '-';
  });

  useEffect(() => {
    if (!timestamp) return;

    const interval = setInterval(() => {
      setTimeAgo(
        getTimeDifferenceString({
          text,
          variant,
          timestamp,
        }),
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timestamp, text, variant]);

  return timeAgo;
};
