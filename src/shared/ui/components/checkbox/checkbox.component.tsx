import { forwardRef } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

import { classes } from '../../utils';

import { CheckboxProperties } from './checkbox.types';
import { CheckboxLabel } from './checkbox-label.component';

const Base = forwardRef<HTMLButtonElement, CheckboxProperties>(
  (
    {
      indicator,
      label,
      disabled,
      value,
      className,
      wrapperClassName,
      title,
      onChange,
    },
    reference,
  ) => {
    return (
      <label className={classes('flex items-center', wrapperClassName)}>
        <RadixCheckbox.Root
          ref={reference}
          title={title}
          className={classes(
            'flex size-[22px] appearance-none items-center justify-center rounded-[4px] bg-gray-100 shadow-[0_0_0_1px_black] outline-none hover:bg-gray-200 focus:shadow-[0_0_0_1px_gray]',
            'disabled:cursor-not-allowed disabled:opacity-60 disabled:brightness-90 disabled:grayscale',
            label && 'mr-2',
            className,
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
        {label}
      </label>
    );
  },
);

Base.displayName = 'Checkbox';

export const Checkbox = Object.assign(Base, {
  Label: CheckboxLabel,
  displayName: 'Checkbox',
});
