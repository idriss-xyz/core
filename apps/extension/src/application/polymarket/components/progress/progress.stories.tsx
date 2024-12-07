import type { Meta, StoryObj } from '@storybook/react';

import { Progress } from './progress';

const meta: Meta<typeof Progress> = {
  title: 'application/polymarket/progress',
  component: Progress,
  argTypes: {
    value: { control: { type: 'number', step: 0.01, min: 0, max: 1 } },
  },
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const Primary: Story = {
  args: {
    value: 0.5,
  },
};
