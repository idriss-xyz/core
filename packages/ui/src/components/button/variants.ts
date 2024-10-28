import { FullyRequired } from '@idriss-xyz/utils';
import { cva, VariantProps } from 'class-variance-authority';

export const button = cva(
  [
    'group relative z-1 flex items-center space-x-2 overflow-hidden rounded-xl',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-mint-400 text-neutralGreen-900 shadow-input',
          'hover:bg-mint-500',
          'active:bg-mint-600',
        ],
        tertiary: [
          'bg-transparent text-neutralGreen-900 shadow-input2',
          'hover:text-mint-600',
          'active:text-mint-600',
        ],
      },
      size: {
        large: ['px-5 py-4.5 text-button1'],
      },
      withPrefixIcon: {
        true: ['pl-3'],
      },
      withSuffixIcon: {
        true: ['pr-3'],
      },
    },
  },
);

type ComputedVariants = 'withPrefixIcon' | 'withSuffixIcon';

export type ButtonVariants = FullyRequired<
  Omit<VariantProps<typeof button>, ComputedVariants>
>;

export const glow = cva(
  [
    'absolute left-1/2 top-[36px] -z-1 size-full -translate-x-1/2 overflow-hidden rounded-[100%]',
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
        tertiary: ['hidden'],
      },
      size: {
        large: ['h-10'],
      },
    },
  },
);

export type GlowVariants = FullyRequired<VariantProps<typeof glow>>;
