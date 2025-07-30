import { ComponentProps, ForwardedRef, forwardRef } from 'react';
import { NumericFormat } from 'react-number-format';

import { Input } from '../input';

type Properties = Omit<ComponentProps<typeof Input>, 'onChange'> & {
  onChange: (value: string) => void;
  placeholder?: string;
  decimalScale?: number;
};

export const NumericInput = forwardRef(
  (
    inputProperties: Properties,
    reference: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value, ...rest } = inputProperties;

    const displayValue = value === '0' ? '' : value;

    return (
      <NumericFormat
        getInputRef={reference}
        allowNegative={false}
        decimalScale={inputProperties.decimalScale ?? 3}
        thousandSeparator=","
        customInput={Input}
        {...rest}
        value={displayValue}
        onChange={(event) => {
          inputProperties.onChange(event.target.value.replaceAll(',', ''));
        }}
      />
    );
  },
);

NumericInput.displayName = 'NumericInput';
