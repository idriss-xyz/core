import * as RadixCheckbox from '@radix-ui/react-checkbox';

import { classes } from 'shared/ui/utils';

import { Icon } from '../icon';

import { CheckboxProperties } from './checkbox.types';

/**
 * @param checked - if null is passed checkbox  will be checked with the DividerHorizontal icon indicating intermediate state
 */
export const Checkbox = ({
  checked,
  onChange,
  label,
  className,
  disabled,
  disabledTooltipText,
  additionalClassNameWhenChecked,
}: CheckboxProperties) => {
  return (
    <div className="flex items-center">
      <RadixCheckbox.Root
        title={disabled ? disabledTooltipText : undefined}
        className={classes(
          'flex size-[22px] appearance-none items-center justify-center rounded-[4px] bg-gray-100 shadow-[0_0_0_1px_black] outline-none hover:bg-gray-200 focus:shadow-[0_0_0_1px_gray]',
          checked && additionalClassNameWhenChecked,
          className,
          disabled && 'cursor-not-allowed opacity-60 brightness-90 grayscale',
        )}
        id="c1"
        checked={checked ?? checked === null}
        onCheckedChange={onChange}
        disabled={disabled}
      >
        <RadixCheckbox.Indicator className="flex items-center text-green-500">
          <Icon
            name={checked === null ? 'DividerHorizontalIcon' : 'CheckIcon'}
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
