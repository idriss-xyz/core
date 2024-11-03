import { FullyRequired } from '@idriss-xyz/utils';
import { cva, VariantProps } from 'class-variance-authority';

export const link = cva(
  [
    'border-b border-b-mint-600 px-0.5 text-mint-600',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
    'hover:border-b-mint-700',
    'active:border-b-mint-800',
  ],
  {
    variants: {
      size: {
        medium: ['text-body5 lg:text-body4'],
      },
    },
  },
);

export type LinkVariants = FullyRequired<VariantProps<typeof link>>;
