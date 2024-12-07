import React from 'react';
import type { Preview } from '@storybook/react';
import { Providers } from '../src/infrastructure/application/providers';

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <Providers>
          <Story />
        </Providers>
      );
    },
  ],
};

export default preview;
