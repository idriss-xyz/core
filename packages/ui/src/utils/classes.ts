import { ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-display1',
        'text-display2',
        'text-display3',
        'text-display4',
        'text-display5',
        'text-display6',
        'text-heading1',
        'text-heading2',
        'text-heading3',
        'text-heading4',
        'text-heading5',
        'text-heading6',
        'text-body1',
        'text-body2',
        'text-body3',
        'text-body4',
        'text-body5',
        'text-body6',
        'text-body7',
        'text-label1',
        'text-label2',
        'text-label3',
        'text-label4',
        'text-label5',
        'text-label6',
        'text-label7',
        'text-label8',
        'text-button1',
        'text-button2',
      ],
    },
  },
});

export const classes = (...arguments_: ClassValue[]) => {
  return customTwMerge(clsx(arguments_));
};
