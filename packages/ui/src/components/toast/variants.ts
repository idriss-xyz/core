import { FullyRequired } from '@idriss-xyz/utils';
import { cva } from 'class-variance-authority';

import { IconName } from '../icon';

export const toast = cva(
  'grid max-h-[500px] w-fit grid-cols-[40px,1fr] items-center gap-x-4 rounded-xl border border-neutral-300 bg-white p-4 shadow-sm',
  {
    variants: {
      type: {
        default: '',
        success: 'border-mint-400',
        error: 'border-red-400',
      },
    },
  },
);

export const icon: Record<'default' | 'success' | 'error', IconName> = {
  default: 'InfoCircle',
  success: 'CheckCircle2',
  error: 'X',
};

export const iconClass = cva('rounded-full p-2.5', {
  variants: {
    type: {
      default: 'bg-neutral-200 text-neutral-600',
      success: 'bg-mint-200 text-mint-600',
      error: 'bg-red-200 text-red-500',
    },
  },
});

export type ToastVariants = FullyRequired<{
  type: 'default' | 'success' | 'error';
}>;
