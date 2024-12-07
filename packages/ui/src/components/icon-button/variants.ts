import { FullyRequired } from '@idriss-xyz/utils';
import { cva, VariantProps } from 'class-variance-authority';

export const iconButton = cva([], {
  variants: {
    size: {
      small: ['p-2'],
      medium: ['p-3'],
      large: ['p-4.5'],
    },
  },
});

export type IconButtonVariants = FullyRequired<VariantProps<typeof iconButton>>;
