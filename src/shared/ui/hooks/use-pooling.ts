import { useEffect, useState } from 'react';

interface Properties<T> {
  defaultValue: T;
  interval?: number;
  callback: () => T;
}

export const usePooling = <T>({
  defaultValue,
  callback,
  interval = 1000,
}: Properties<T>) => {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setValue(callback());
    }, interval);

    return () => {
      return clearInterval(intervalId);
    };
  }, [interval, callback]);

  return { value };
};
