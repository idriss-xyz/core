import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Toggle } from './toggle.component';

const WrappedToggle = () => {
  const [value, setValue] = useState(true);
  return <Toggle value={value} onChange={setValue} />;
};

const meta: Meta<typeof WrappedToggle> = {
  title: 'shared/ui/toggle',
  component: WrappedToggle,
};

export default meta;

type Story = StoryObj<typeof WrappedToggle>;

export const Primary: Story = {};
