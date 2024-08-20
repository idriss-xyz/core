import * as RadixCheckbox from '@radix-ui/react-checkbox';

import { classes } from 'shared/ui/utils';

import { Icon } from '../icon';

import { CheckboxProperties } from './checkbox.types';

export const Checkbox = ({
  value,
  onChange,
  label,
  type = 'binary',
  className,
  additionalClassNameWhenChecked,
}: CheckboxProperties) => {
  const checked = type === 'binary' ? Boolean(value) : value !== 'unchecked';

  return (
    <div className="flex items-center">
      <RadixCheckbox.Root
        className={classes(
          'flex size-[22px] appearance-none items-center justify-center rounded-[4px] bg-gray-100 shadow-[0_0_0_1px_black] outline-none hover:bg-gray-200 focus:shadow-[0_0_0_1px_gray]',
          checked && additionalClassNameWhenChecked,
          className,
        )}
        id="c1"
        checked={checked}
        onCheckedChange={onChange}
      >
        <RadixCheckbox.Indicator className="flex items-center text-green-500">
          <Icon
            name={
              value === 'checked' || value === true
                ? 'CheckIcon'
                : 'DividerHorizontalIcon'
            }
            size={18}
          />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && (
        <label
          className="pl-[15px] text-[15px] leading-none text-white"
          htmlFor="c1"
        >
          {label}
        </label>
      )}
    </div>
  );
};
