import { forwardRef } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

import { classes } from 'shared/ui/utils';

import { CheckboxProperties } from './checkbox.types';

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProperties>(
  (
    {
      indicator,
      label,
      disabled,
      value,
      className,
      disabledTooltipText,
      onChange,
    },
    reference,
  ) => {
    return (
      <label className="flex items-center">
        <RadixCheckbox.Root
          ref={reference}
          title={disabled ? disabledTooltipText : undefined}
          className={classes(
            'flex size-[22px] appearance-none items-center justify-center rounded-[4px] bg-gray-100 shadow-[0_0_0_1px_black] outline-none hover:bg-gray-200 focus:shadow-[0_0_0_1px_gray]',
            className,
            disabled && 'cursor-not-allowed opacity-60 brightness-90 grayscale',
          )}
          disabled={disabled}
          checked={value}
          onCheckedChange={onChange}
        >
          <RadixCheckbox.Indicator
            className="flex items-center text-green-500"
            forceMount={indicator ? true : undefined}
          >
            {indicator ?? <CheckIcon />}
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>
        <span className="pl-[15px] text-[15px] leading-none">{label}</span>
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
