'use client';
import { useWallet, WalletContextProvider } from '@idriss-xyz/wallet-connect';
import NiceModal from '@ebay/nice-modal-react';
import { Button } from '@idriss-xyz/ui/button';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';

// ts-unused-exports:disable-next-line
export default function Donors() {
  return (
    <WithPortal>
      <NiceModal.Provider>
        <WalletContextProvider>
          <OpenWalletShowcase />
        </WalletContextProvider>
      </NiceModal.Provider>
    </WithPortal>
  );
}

const OpenWalletShowcase = () => {
  const { openConnectionModal } = useWallet();

  return (
    <Button intent="primary" size="large" onClick={openConnectionModal}>
      Login
    </Button>
  );
};
