import type { Meta, StoryObj } from '@storybook/react';

import { VoteButton } from './vote-button';

const meta: Meta<typeof VoteButton> = {
  title: 'application/polymarket/vote-button',
  component: VoteButton,
  argTypes: {
    children: { table: { disable: true } },
    onClick: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (parameters) => {
    return (
      <div className="grid">
        <VoteButton {...parameters}>Outcome</VoteButton>
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof VoteButton>;

export const Primary: Story = {
  args: {
    isActive: true,
    tokenIndex: 0,
    disabled: false,
  },
};
