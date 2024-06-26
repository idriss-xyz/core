import type { Meta, StoryObj } from '@storybook/react';

import { WalletConnectModal } from './wallet-connect-modal';

const meta: Meta<typeof WalletConnectModal> = {
  title: 'web3/wallet-connect-modal',
  component: WalletConnectModal,
  argTypes: {
    disabledWalletsRdns: { table: { disable: true } },
  },
  render: () => {
    return (
      // this component is normally mounted via useModal(WalletConnectModal) and passing id is not needed
      <WalletConnectModal disabledWalletsRdns={[]} id="x" defaultVisible />
    );
  },
};

export default meta;

type Story = StoryObj<typeof WalletConnectModal>;

export const Primary: Story = {};
