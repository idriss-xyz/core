import { FullyRequired } from '@idriss-xyz/utils';
import { cva, VariantProps } from 'class-variance-authority';

export const button = cva(
  [
    'rounded-xl tracking-wider relative overflow-hidden group z-1 font-medium',
    'focus-visible:ring-borderfocus focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-brand-primary text-onsurface-primary shadow-input',
          'hover:bg-brand-secondary',
          'active:bg-brand-tertiary',
        ],
      },
      size: {
        large: ['text-button1 px-5 py-4.5'],
      },
    },
  },
);

export type ButtonVariants = FullyRequired<VariantProps<typeof button>>;

export const glow = cva(
  [
    'absolute left-1/2 top-[36px] size-full -translate-x-1/2 overflow-hidden rounded-[100%] -z-1',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-lime-400 opacity-70 blur-md',
          'group-focus-visible:bg-lime-400',
          'group-hover:opacity-0',
          'group-active:opacity-0',
        ],
      },
      size: {
        large: ['h-10'],
      },
    },
  },
);

export type GlowVariants = FullyRequired<VariantProps<typeof glow>>;
