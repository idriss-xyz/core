/* eslint-disable tailwindcss/no-custom-classname */
import { FullyRequired } from '@idriss-xyz/utils';
import { cva, VariantProps } from 'class-variance-authority';

export const button = cva(
  [
    'group/button relative z-1 flex w-max items-center justify-center overflow-hidden rounded-xl',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
  ],
  {
    defaultVariants: { colorScheme: 'green' },
    variants: {
      intent: {
        primary: [
          'uppercase text-neutralGreen-900 shadow-input',
          'disabled:text-white',
        ],
        secondary: [
          'text-neutralGreen-900 shadow-input outline outline-1 outline-offset-[-1px]',
          'disabled:text-white disabled:outline-none',
        ],
        tertiary: [
          'bg-transparent text-neutralGreen-900',
          'hover:text-mint-600',
          'active:text-mint-600',
          'disabled:text-neutral-500',
        ],
        negative: [
          'bg-neutralGreen-900 text-white',
          'hover:bg-neutralGreen-700',
          'active:bg-neutralGreen-500',
          'disabled:bg-neutral-400 disabled:text-white',
        ],
      },
      size: {
        extra: ['px-5 py-4.5 text-button1'],
        large: ['px-5 py-4.5 text-button1'],
        medium: ['px-5 py-3.5 text-button2'],
        small: ['px-5 py-2 text-button2'],
      },

      colorScheme: {
        green: [],
        blue: [],
      },

      withPrefixIcon: {
        true: ['pl-3'],
      },
      withSuffixIcon: {
        true: ['pr-3'],
      },
      isLoading: {
        true: [''],
        false: [''],
      },
    },
    compoundVariants: [
      {
        intent: 'primary',
        colorScheme: 'green',
        className: [
          'bg-mint-400',
          'hover:bg-mint-500',
          'active:bg-mint-600',
          'disabled:bg-neutral-400',
        ],
      },
      {
        intent: 'secondary',
        colorScheme: 'green',
        className: [
          'bg-white',
          'outline-mint-400',
          'hover:bg-mint-200 hover:outline-mint-500',
          'active:bg-mint-300 active:outline-mint-600',
          'disabled:bg-neutral-400',
        ],
      },
      {
        intent: 'primary',
        colorScheme: 'blue',
        className: ['bg-[#004DE5]'],
      },
      {
        intent: 'secondary',
        colorScheme: 'blue',
        className: [
          'outline-blue-400',
          'hover:outline-blue-500 hover:bg-blue-100',
          'active:outline-blue-600 active:bg-blue-200',
        ],
      },
      //icon
      {
        size: 'medium',
        withPrefixIcon: true,
        className: 'py-3',
      },
      {
        size: 'medium',
        withSuffixIcon: true,
        className: 'py-3',
      },
      //loading
      {
        isLoading: true,
        intent: 'primary',
        className: 'disabled:bg-mint-400 disabled:text-neutralGreen-900',
      },
      {
        isLoading: true,
        intent: 'secondary',
        className:
          'disabled:bg-white disabled:text-neutralGreen-900 disabled:outline disabled:outline-1 disabled:outline-offset-[-1px] disabled:outline-mint-400',
      },
      {
        isLoading: true,
        intent: 'tertiary',
        className: 'disabled:text-neutralGreen-900',
      },
      {
        isLoading: true,
        intent: 'negative',
        className: 'disabled:bg-neutralGreen-900 disabled:text-white',
      },
    ],
  },
);

type ComputedVariants =
  | 'withPrefixIcon'
  | 'withSuffixIcon'
  | 'isLoading'
  | 'colorScheme';

export type ButtonVariants = FullyRequired<
  Omit<VariantProps<typeof button>, ComputedVariants>
>;

export const glow = cva(
  [
    'absolute left-1/2 z-0 size-full -translate-x-1/2 transform-gpu overflow-visible rounded-[100%]',
  ],
  {
    defaultVariants: { colorScheme: 'green' },
    variants: {
      intent: {
        primary: [
          'opacity-70 blur-md',
          'group-hover/button:opacity-0',
          'group-active/button:opacity-0',
          'group-disabled/button:hidden',
        ],
        secondary: ['opacity-40 blur-md', 'group-disabled/button:hidden'],
        tertiary: ['hidden'],
        negative: ['hidden'],
        disabled: ['hidden'],
      },
      size: {
        extra: ['top-[36px] h-10'],
        large: ['top-[36px] h-10'],
        medium: ['top-[28px] h-8'],
        small: ['top-[28px] h-8'],
      },
      colorScheme: {
        green: [],
        blue: [],
      },
      loading: {
        true: [''],
        false: [''],
      },
    },
    compoundVariants: [
      //loading
      {
        loading: true,
        intent: 'primary',
        className: 'group-disabled/button:block',
      },
      {
        loading: true,
        intent: 'secondary',
        className: 'group-disabled/button:block',
      },
      // ─── GREEN (default) ────────────────────────────
      {
        intent: 'primary',
        colorScheme: 'green',
        className: ['bg-lime-400'],
      },
      {
        intent: 'secondary',
        colorScheme: 'green',
        className: ['bg-mint-400'],
      },

      // existing BLUE variants stay unchanged
      {
        intent: 'primary',
        colorScheme: 'blue',
        className: ['bg-blue-400'],
      },
      {
        intent: 'secondary',
        colorScheme: 'blue',
        className: ['bg-blue-300'],
      },
    ],
  },
);

type GlowComputed = 'colorScheme';

export type GlowVariants = FullyRequired<
  Omit<VariantProps<typeof glow>, GlowComputed>
>;
