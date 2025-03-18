import { FullyRequired } from '@idriss-xyz/utils';
import { cva } from 'class-variance-authority';

export const alert = cva(
  'grid max-h-max grid-cols-[40px,1fr] items-start gap-x-4 rounded-xl border border-neutral-300 bg-white p-4 shadow-sm',
  {
    variants: {
      type: {
        default: '',
      },
    },
  },
);

export const icon: Record<'default', 'InfoCircle'> = {
  default: 'InfoCircle',
};

export const iconClass = cva('rounded-full p-2.5', {
  variants: {
    type: {
      default: 'bg-neutral-200 text-neutral-600',
    },
  },
});

export type AlertVariants = FullyRequired<{
  type: 'default';
}>;
