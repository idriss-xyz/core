import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Select } from './select.component';

const meta: Meta<typeof Select> = {
  title: 'shared/ui/select',
  component: Select,
  argTypes: {
    label: { table: { disable: true } },
    className: { table: { disable: true } },
    renderLabel: { table: { disable: true } },
    options: { control: { type: 'object' } },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    optionsContainerClassName: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Primary: Story = {
  render: (properties) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(properties.value);

    return <Select {...properties} value={value} onChange={setValue} />;
  },
  args: {
    options: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' },
      { label: 'Option 4', value: '4' },
      { label: 'Option 5', value: '5' },
      { label: 'Option 6', value: '6' },
      { label: 'Option 7', value: '7' },
      { label: 'Option 8', value: '8' },
      { label: 'Option 9', value: '9' },
      { label: 'Option 10', value: '10' },
    ],
    value: '1',
  },
};
