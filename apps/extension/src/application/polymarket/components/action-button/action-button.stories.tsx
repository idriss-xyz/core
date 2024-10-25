import type { Meta, StoryObj } from '@storybook/react';

import { ActionButton } from './action-button';

const meta: Meta<typeof ActionButton> = {
  title: 'application/polymarket/action-button',
  component: ActionButton,
  argTypes: {
    children: { control: 'text' },
    onClick: { table: { disable: true } },
    className: { table: { disable: true } },
    type: { table: { disable: true } },
  },
  render: (parameters) => {
    return (
      <div className="grid">
        <ActionButton {...parameters} />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof ActionButton>;

export const Primary: Story = {
  args: {
    loading: false,
    disabled: false,
    children: 'Buy',
  },
};
