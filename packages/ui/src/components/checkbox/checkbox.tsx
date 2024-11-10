import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { forwardRef, ReactNode } from 'react';

import { classes } from '../../utils';

import { CheckIcon } from './assets';

type Properties = {
  label?: ReactNode;
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
};

export const Checkbox = forwardRef<HTMLButtonElement, Properties>(
  ({ label, value, onChange, className }, reference) => {
    return (
      <label className={classes('block', className)}>
        <div className="flex items-center">
          <RadixCheckbox.Root
            ref={reference}
            className="flex size-5 items-center justify-center rounded border-2 border-neutral-400 hover:border-mint-500 focus:border-mint-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:border-mint-600 disabled:border-neutral-200 data-[state=checked]:border-none data-[state=checked]:bg-mint-400"
            checked={value}
            onCheckedChange={onChange}
          >
            <RadixCheckbox.Indicator className="text-mint-900">
              <CheckIcon />
            </RadixCheckbox.Indicator>
          </RadixCheckbox.Root>
          {label && (
            <span className="pl-2 text-body6 text-neutralGreen-900 disabled:text-neutral-500 lg:text-body5">
              {label}
            </span>
          )}
        </div>
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
