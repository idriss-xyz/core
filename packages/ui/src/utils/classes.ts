import { ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-button1', 'text-button2', 'text-body4'],
    },
  },
});

export const classes = (...arguments_: ClassValue[]) => {
  return customTwMerge(clsx(arguments_));
};
