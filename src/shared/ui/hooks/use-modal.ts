import { useCallback, useState } from 'react';

export const useModal = () => {
  const [isOpened, setIsOpened] = useState(false);

  const open = useCallback(() => {
    return setIsOpened(true);
  }, [setIsOpened]);
  const close = useCallback(() => {
    return setIsOpened(false);
  }, [setIsOpened]);

  return {
    isOpened,
    open,
    close,
  };
};
