import * as RadixForm from '@radix-ui/react-form';
import { ComponentProps, ForwardedRef, forwardRef } from 'react';

import { classes } from '../../utils';
import { Icon } from '../icon';
import { Input } from '../input';
import { NumericInput } from '../numeric-input';

type Properties = Omit<ComponentProps<typeof Input>, 'onChange'> & {
  name: string;
  label?: string;
  helperText?: string;
  numeric?: boolean;
  onChange: (value: string) => void;
};

export const Field = forwardRef(
  (
    {
      name,
      label,
      helperText,
      className,
      numeric,
      onChange,
      ...inputProperties
    }: Properties,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <RadixForm.Field name={name} ref={reference} className={className}>
        {label && (
          <RadixForm.Label className="mb-2 block text-label4 text-neutral-700">
            {label}
          </RadixForm.Label>
        )}
        <RadixForm.Control asChild>
          {numeric ? (
            <NumericInput
              {...inputProperties}
              onChange={(value) => {
                onChange(value);
              }}
            />
          ) : (
            <Input
              {...inputProperties}
              onChange={(event) => {
                onChange(event.target.value);
              }}
            />
          )}
        </RadixForm.Control>
        {helperText && (
          <span
            className={classes(
              'flex items-center space-x-1 pt-1 text-label7 text-neutral-600 lg:text-label6',
              inputProperties.error && 'text-red-500',
            )}
          >
            {inputProperties.error && (
              <Icon name="AlertCircle" size={12} className="p-0.5" />
            )}
            {helperText}
            {!inputProperties.error && (
              <Icon name="HelpCircle" size={12} className="p-0.5" />
            )}
          </span>
        )}
      </RadixForm.Field>
    );
  },
);

Field.displayName = 'Field';
