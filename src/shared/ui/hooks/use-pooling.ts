import { useEffect, useState } from 'react';
import isEqual from 'lodash.isequal';

interface Properties<T> {
  defaultValue: T;
  interval?: number;
  callback: () => T;
  enabled?: boolean;
}

export const usePooling = <T>({
  defaultValue,
  callback,
  enabled = true,
  interval = 1000,
}: Properties<T>) => {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const intervalId = setInterval(() => {
      const newValue = callback();
      setValue((previous) => {
        return isEqual(previous, newValue) ? previous : newValue;
      });
    }, interval);

    return () => {
      return clearInterval(intervalId);
    };
  }, [interval, callback, enabled]);

  return value;
};
