import type { Meta, StoryObj } from '@storybook/react';

import { OUTCOME } from '../../constants';

import { VoteButton } from './vote-button';

const meta: Meta<typeof VoteButton> = {
  title: 'application/polymarket/vote-button',
  component: VoteButton,
  argTypes: {
    children: { table: { disable: true } },
    onClick: { table: { disable: true } },
    className: { table: { disable: true } },
    outcome: { control: 'select', options: Object.values(OUTCOME) },
  },
  render: (parameters) => {
    return (
      <div className="grid">
        <VoteButton {...parameters}>{parameters.outcome}</VoteButton>
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof VoteButton>;

export const Primary: Story = {
  args: {
    isActive: true,
    outcome: OUTCOME.YES,
    disabled: false,
  },
};
