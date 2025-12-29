import * as RadixForm from '@radix-ui/react-form';
import { ComponentProps, ForwardedRef, forwardRef, ReactNode } from 'react';

import { classes } from '../../utils';
import { Icon } from '../icon';
import { Input } from '../input';
import { NumericInput } from '../numeric-input';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

type InputProperties = ComponentProps<typeof Input>;
type InputUnion = InputProperties extends infer T
  ? T extends never
    ? never
    : Omit<T, 'onChange'>
  : never;

type Properties = InputUnion & {
  name: string;
  label?: ReactNode;
  helperText?: string;
  numeric?: boolean;
  decimalScale?: number;
  labelHelper?: string;
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
      decimalScale,
      placeholderTooltip,
      labelHelper,
      onChange,
      ...inputProperties
    }: Properties,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <RadixForm.Field name={name} ref={reference} className={className}>
        {label && (
          <div className="mb-2 flex items-center gap-1">
            <RadixForm.Label className="text-label4 text-neutralGreen-900">
              {label}
            </RadixForm.Label>
            {labelHelper && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icon
                    name="HelpCircle"
                    size={16}
                    className="text-neutral-600"
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="z-portal max-w-72 bg-black text-left text-white"
                >
                  <p className="text-label6">{labelHelper}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
        <RadixForm.Control asChild>
          {numeric ? (
            <NumericInput
              {...inputProperties}
              decimalScale={decimalScale}
              placeholderTooltip={placeholderTooltip}
              onChange={(value) => {
                onChange(value);
              }}
            />
          ) : (
            <Input
              {...inputProperties}
              placeholderTooltip={placeholderTooltip}
              onChange={(event) => {
                onChange(event.target.value);
              }}
            />
          )}
        </RadixForm.Control>
        {helperText && (
          <span
            className={classes(
              'flex items-center space-x-1 pt-1 text-label6 text-neutral-600 lg:text-label7',
              inputProperties.error && 'text-red-500',
            )}
          >
            {inputProperties.error && (
              <Icon name="AlertCircle" size={16} className="p-0.5" />
            )}
            {helperText}
            {!inputProperties.error && (
              <Icon name="HelpCircle" size={16} className="p-0.5" />
            )}
          </span>
        )}
      </RadixForm.Field>
    );
  },
);

Field.displayName = 'Field';
