import * as RadixForm from '@radix-ui/react-form';
import {
  ComponentProps,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useRef,
} from 'react';
import { format } from 'date-fns';

import { classes } from '../../utils';
import { Icon } from '../icon';
import { Input } from '../input';
import { NumericInput } from '../numeric-input';
import { DatePicker } from '../date-picker';

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
  datePicker?: boolean;
  dateValue?: Date;
  disableBeforeToday?: boolean;
  onDateChange?: (date: Date | undefined) => void;
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
      datePicker,
      dateValue,
      disableBeforeToday,
      onDateChange,
      placeholderTooltip,
      onChange,
      ...inputProperties
    }: Properties,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {
    const suffixReference = useRef<HTMLDivElement>(null);
    const calendarSuffix = datePicker ? (
      <div
        ref={suffixReference}
        className="flex h-full shrink-0 cursor-pointer items-center self-stretch border-l border-gray-200 pl-3 hover:text-mint-600"
        onClick={() => {
          // forward the click to the input so DatePicker opens
          const input = suffixReference.current
            ?.closest('label')
            ?.querySelector('input');
          input?.focus();
          input?.click();
        }}
      >
        <Icon name="CalendarDays" size={16} />
      </div>
    ) : undefined;
    return (
      <RadixForm.Field name={name} ref={reference} className={className}>
        {label && (
          <RadixForm.Label className="mb-2 block text-label4 text-neutralGreen-700">
            {label}
          </RadixForm.Label>
        )}
        <RadixForm.Control asChild>
          {datePicker ? (
            <DatePicker
              date={dateValue}
              onSelect={onDateChange}
              disableBeforeToday={disableBeforeToday}
            >
              <div>
                <Input
                  {...inputProperties}
                  suffixElement={
                    inputProperties.suffixElement ?? calendarSuffix
                  }
                  value={dateValue ? format(dateValue, 'dd/MM/yyyy') : ''}
                  placeholder="DD/MM/YYYY"
                  asTextArea={false}
                  onChange={() => {}} // Prevent direct input
                />
              </div>
            </DatePicker>
          ) : numeric ? (
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
