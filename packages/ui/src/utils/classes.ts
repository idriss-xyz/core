import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const classes = (...arguments_: ClassValue[]) => {
  return twMerge(clsx(arguments_));
};
