import type { Meta, StoryObj } from '@storybook/react';

import { LookUpWalletAddress } from '.';

const meta: Meta<typeof LookUpWalletAddress> = {
  title: 'application/look-up-wallet-address',
  component: LookUpWalletAddress,
};

export default meta;

type Story = StoryObj<typeof LookUpWalletAddress>;

export const Primary: Story = {};
