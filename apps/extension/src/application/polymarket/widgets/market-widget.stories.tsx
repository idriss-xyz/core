import type { Meta, StoryObj } from '@storybook/react';

import { Market } from './market-widget';

const meta: Meta<typeof Market> = {
  title: 'application/polymarket/market',
  component: Market,
  argTypes: {
    top: { table: { disable: true } },
    data: { table: { disable: true } },
    tokens: { table: { disable: true } },
    imageUrl: { table: { disable: true } },
    defaultValues: { table: { disable: true } },
    onRefresh: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof Market>;

export const Primary: Story = {
  args: {
    isAvailable: true,
    top: 0,
    data: {
      neg_risk: true,
      question: 'Some question here',
      minimum_tick_size: '0.01',
    },
    tokens: [
      {
        outcome: 'Yes',
        token_id: '1',
        book: { asks: [], bids: [] },
        price: 1,
      },
      {
        outcome: 'No',
        token_id: '2',
        book: { asks: [], bids: [] },
        price: 1,
      },
    ],
    chance: 0.5,
    imageUrl: '',
  },
};
