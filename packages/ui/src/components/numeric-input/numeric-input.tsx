import { ComponentProps, ForwardedRef, forwardRef } from 'react';
import { NumericFormat } from 'react-number-format';

import { Input } from '../input';

type Properties = Omit<ComponentProps<typeof Input>, 'onChange'> & {
  onChange: (value: string) => void;
  placeholder?: string;
};

export const NumericInput = forwardRef(
  (
    inputProperties: Properties,
    reference: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    return (
      <NumericFormat
        getInputRef={reference}
        allowNegative={false}
        decimalScale={3}
        thousandSeparator=","
        customInput={Input}
        {...inputProperties}
        onChange={(event) => {
          inputProperties.onChange(event.target.value.replaceAll(',', ''));
        }}
      />
    );
  },
);

NumericInput.displayName = 'NumericInput';
