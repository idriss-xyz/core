import { useEffect, useState } from 'react';
import { getFormattedTimeDifference } from '@idriss-xyz/utils';

export const TimeDifferenceCounter = ({
  timestamp,
  text,
  variant,
}: {
  timestamp: string;
  text: string;
  variant: 'long' | 'short';
}) => {
  const [timeDifference, setTimeDifference] = useState(
    getFormattedTimeDifference(timestamp, variant),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDifference(getFormattedTimeDifference(timestamp, variant));
    }, 1000);

    return () => {
      return clearInterval(interval);
    };
  }, [timestamp, variant]);

  return text ? `${timeDifference} ${text}` : timeDifference;
};
