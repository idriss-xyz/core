'use client';
import { useWallet, WalletContextProvider } from '@idriss-xyz/wallet-connect';
import NiceModal from '@ebay/nice-modal-react';
import { Button } from '@idriss-xyz/ui/button';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { Form } from '@idriss-xyz/ui/form';

// ts-unused-exports:disable-next-line
export default function Donors() {
  return (
    <WithPortal>
      <NiceModal.Provider>
        <WalletContextProvider>
          <main className="p-10 pt-[104px]">
            <OpenWalletShowcase />
            <Form>
              <Form.Field
                error
                helperText="some helper text"
                className="w-[300px]"
                name="Foo"
                value="foo"
                onChange={() => {}}
              />
            </Form>
          </main>
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
