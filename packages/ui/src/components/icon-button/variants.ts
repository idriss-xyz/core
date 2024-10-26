import { FullyRequired } from '@idriss-xyz/utils';
import { cva, VariantProps } from 'class-variance-authority';

export const iconButton = cva([], {
  variants: {
    size: {
      large: ['p-4.5'],
    },
  },
});

export type IconButtonVariants = FullyRequired<VariantProps<typeof iconButton>>;
