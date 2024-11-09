import { useWallet } from '@idriss-xyz/wallet-connect';
import { useCallback } from 'react';

import { Button } from 'shared/ui';

interface Properties {
  onClick?: () => void;
}

export const ConnectWalletButton = ({ onClick }: Properties) => {
  const { isConnectionModalOpened, openConnectionModal } = useWallet();

  const handleClick = useCallback(() => {
    void openConnectionModal();
    onClick?.();
  }, [onClick, openConnectionModal]);

  return (
    <Button
      className="w-full rounded-md bg-[#11DD74] py-2 text-base font-medium text-white shadow-sm hover:bg-[#11DD74]"
      loading={isConnectionModalOpened}
      onClick={handleClick}
    >
      Log In
    </Button>
  );
};
