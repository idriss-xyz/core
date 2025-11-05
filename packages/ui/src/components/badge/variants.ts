import { FullyRequired } from '@idriss-xyz/utils';
import { cva, VariantProps } from 'class-variance-authority';

export const badge = cva(
  ['rounded-sm px-1 py-0.5 text-label7 uppercase text-white'],
  {
    variants: {
      type: {
        default: '',
        neutral: '',
        info: '',
        success: '',
        danger: '',
      },
      variant: {
        solid: '',
        subtle: '',
      },
    },
    compoundVariants: [
      { type: 'default', variant: 'solid', className: 'bg-neutralGreen-900' },
      {
        type: 'default',
        variant: 'subtle',
        className:
          'border border-neutral-300 bg-white px-[3px] py-px text-neutralGreen-900',
      },
      { type: 'neutral', variant: 'solid', className: 'bg-neutral-600' },
      {
        type: 'neutral',
        variant: 'subtle',
        className: 'bg-neutral-200 text-neutralGreen-900',
      },
      { type: 'info', variant: 'solid', className: 'bg-indigo-500' },
      {
        type: 'info',
        variant: 'subtle',
        className: 'bg-indigo-200 text-indigo-500',
      },
      { type: 'success', variant: 'solid', className: 'bg-mint-600' },
      {
        type: 'success',
        variant: 'subtle',
        className: 'bg-mint-200 text-mint-700',
      },
      { type: 'danger', variant: 'solid', className: 'bg-red-500' },
      {
        type: 'danger',
        variant: 'subtle',
        className: 'bg-red-200 text-red-600',
      },
    ],
    defaultVariants: {
      type: 'default',
      variant: 'solid',
    },
  },
);

export type BadgeVariants = FullyRequired<VariantProps<typeof badge>>;
