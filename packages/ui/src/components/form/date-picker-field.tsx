import * as RadixForm from '@radix-ui/react-form';
import {
  ComponentProps,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useRef,
  useState,
  useEffect,
} from 'react';
import { format, parse, isValid } from 'date-fns';

import { classes } from '../../utils';
import { Icon } from '../icon';
import { Input } from '../input';
import { DatePicker } from '../date-picker';

type InputProperties = ComponentProps<typeof Input>;
type InputUnion = InputProperties extends infer T
  ? T extends never
    ? never
    : Omit<T, 'onChange'>
  : never;

type Properties = Omit<InputUnion, 'value'> & {
  name: string;
  label?: ReactNode;
  helperText?: string;
  dateValue?: Date;
  disableBeforeToday?: boolean;
  onDateChange?: (date: Date | undefined) => void;
};

const formatDateInput = (value: string) => {
  // Remove all non-numeric characters
  const numbers = value.replaceAll(/\D/g, '');

  // Add slashes at appropriate positions
  let formatted = numbers;
  if (numbers.length >= 3) {
    formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
  }
  if (numbers.length >= 5) {
    formatted =
      numbers.slice(0, 2) +
      '/' +
      numbers.slice(2, 4) +
      '/' +
      numbers.slice(4, 8);
  }

  return formatted;
};

export const DatePickerField = forwardRef(
  (
    {
      name,
      label,
      helperText,
      className,
      dateValue,
      disableBeforeToday,
      onDateChange,
      placeholderTooltip,
      ...inputProperties
    }: Properties,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {
    const suffixReference = useRef<HTMLDivElement>(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [inputValue, setInputValue] = useState(
      dateValue ? format(dateValue, 'dd/MM/yyyy') : '',
    );

    // Update input value when dateValue prop changes
    useEffect(() => {
      setInputValue(dateValue ? format(dateValue, 'dd/MM/yyyy') : '');
    }, [dateValue]);

    const handleDateInputChange = (value: string) => {
      const formatted = formatDateInput(value);
      setInputValue(formatted);

      // Try to parse the date if we have a complete format
      if (formatted.length === 10) {
        const parsedDate = parse(formatted, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
          onDateChange?.(parsedDate);
        }
      }
    };

    const calendarSuffix = (
      <div
        ref={suffixReference}
        className="flex h-full shrink-0 cursor-pointer items-center self-stretch border-l border-gray-200 pl-3 hover:text-mint-600"
        onClick={() => {
          setIsDatePickerOpen(true);
        }}
      >
        <Icon name="CalendarDays" size={16} />
      </div>
    );

    return (
      <RadixForm.Field name={name} ref={reference} className={className}>
        {label && (
          <RadixForm.Label className="mb-2 block text-label4 text-neutralGreen-700">
            {label}
          </RadixForm.Label>
        )}
        <RadixForm.Control asChild>
          <DatePicker
            date={dateValue}
            onSelect={(date) => {
              onDateChange?.(date);
              if (date) {
                setInputValue(format(date, 'dd/MM/yyyy'));
              } else {
                setInputValue('');
              }
            }}
            disableBeforeToday={disableBeforeToday}
            open={isDatePickerOpen}
            onOpenChange={setIsDatePickerOpen}
          >
            <div>
              <Input
                {...inputProperties}
                suffixElement={inputProperties.suffixElement ?? calendarSuffix}
                value={inputValue}
                placeholder="DD/MM/YYYY"
                asTextArea={false}
                onChange={(event) => {
                  handleDateInputChange(event.target.value);
                }}
              />
            </div>
          </DatePicker>
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

DatePickerField.displayName = 'DatePickerField';
