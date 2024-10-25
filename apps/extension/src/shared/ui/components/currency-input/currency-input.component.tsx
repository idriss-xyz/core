import { forwardRef, useCallback, useMemo } from 'react';
import { NumericFormat } from 'react-number-format';

import { IconButton } from '../icon-button';
import { InputBase } from '../input-base';

import type { CurrencyInputProperties } from './currency-input.types';

export const CurrencyInput = forwardRef<
  HTMLInputElement,
  CurrencyInputProperties
>(
  (
    {
      value,
      onChange,
      placeholder,
      inputBaseProps,
      iconButtonClassName,
      decimalScale = 2,
      prefix = '$',
      disabled = false,
      changeBy = 1,
      min = 0,
    },
    reference,
  ) => {
    const canDecrement = useMemo(() => {
      if (value === undefined) {
        return true;
      }

      return value > min;
    }, [min, value]);

    const decrement = useCallback(() => {
      if (!value) {
        onChange(min);
        return;
      }

      onChange(Math.max(min, value - changeBy));
    }, [changeBy, min, onChange, value]);

    const increment = useCallback(() => {
      if (!value) {
        onChange(changeBy);
        return;
      }

      onChange(value + changeBy);
    }, [changeBy, onChange, value]);

    const change = useCallback(
      (newValue: string) => {
        const newValueAsNumber = Number(newValue.replace(prefix, ''));
        onChange(newValueAsNumber);
      },
      [onChange, prefix],
    );

    return (
      <InputBase
        as="div"
        {...inputBaseProps}
        prefix={
          <IconButton
            iconProps={{
              name: 'MinusIcon',
            }}
            className={iconButtonClassName}
            onClick={decrement}
            disabled={!canDecrement}
          />
        }
        suffix={
          <IconButton
            iconProps={{
              name: 'PlusIcon',
            }}
            onClick={increment}
            className={iconButtonClassName}
          />
        }
        disabled={disabled}
      >
        <div className="flex flex-col items-center">
          <NumericFormat
            getInputRef={reference}
            allowNegative={false}
            onChange={(event) => {
              change(event.target.value);
            }}
            value={value}
            disabled={disabled}
            prefix={prefix}
            decimalScale={decimalScale}
            className="w-full bg-transparent text-center font-normal leading-[1.2] outline-none placeholder:text-zinc-100 disabled:bg-zinc-600 disabled:text-zinc-300"
            placeholder={placeholder}
          />
        </div>
      </InputBase>
    );
  },
);

CurrencyInput.displayName = 'CurrencyInput';
