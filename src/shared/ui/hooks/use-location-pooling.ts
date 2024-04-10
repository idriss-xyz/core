import { useCallback } from 'react';

import { usePooling } from './use-pooling';

export const useLocationPolling = () => {
  const poolLocation = useCallback(() => {
    return window.location.href;
  }, []);

  const { value } = usePooling({
    defaultValue: window.location.href,
    callback: poolLocation,
  });

  return { location: value };
};
