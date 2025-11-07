import * as RadixForm from '@radix-ui/react-form';
import {
  ComponentProps,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { format, parse, isValid } from 'date-fns';
import * as Popover from '@radix-ui/react-popover';

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
  const numbers = value.replaceAll(/\D/g, '');
  let formatted = numbers;
  if (numbers.length >= 3)
    formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
  if (numbers.length >= 5)
    formatted =
      numbers.slice(0, 2) +
      '/' +
      numbers.slice(2, 4) +
      '/' +
      numbers.slice(4, 8);
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
      ...inputProperties
    }: Properties,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(
      dateValue ? format(dateValue, 'dd/MM/yyyy') : '',
    );

    useEffect(() => {
      setInputValue(dateValue ? format(dateValue, 'dd/MM/yyyy') : '');
    }, [dateValue]);

    const handleInputChange = (value: string) => {
      const formatted = formatDateInput(value);
      setInputValue(formatted);

      if (formatted.length === 10) {
        const parsedDate = parse(formatted, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) onDateChange?.(parsedDate);
      }
    };

    const handleSelect = (selectedDate: Date | undefined) => {
      if (!onDateChange) return;
      if (selectedDate) {
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        onDateChange(endOfDay);
        setInputValue(format(selectedDate, 'dd/MM/yyyy'));
      } else setInputValue('');
      setIsOpen(false);
    };

    const calendarSuffix = (
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <div
            className="flex h-full shrink-0 cursor-pointer items-center self-stretch border-l border-gray-200 pl-3 hover:text-mint-600"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsOpen(true);
            }}
          >
            <Icon name="CalendarDays" size={16} />
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            side="right"
            align="start"
            avoidCollisions={false}
            sideOffset={30}
            alignOffset={-270}
            className="z-50 w-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-md will-change-auto"
          >
            <DatePicker
              date={dateValue}
              onSelect={handleSelect}
              disableBeforeToday={disableBeforeToday}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );

    return (
      <RadixForm.Field name={name} ref={reference} className={className}>
        {label && (
          <RadixForm.Label className="mb-2 block text-label4 text-neutralGreen-700">
            {label}
          </RadixForm.Label>
        )}
        <RadixForm.Control asChild>
          <Input
            {...inputProperties}
            suffixElement={inputProperties.suffixElement ?? calendarSuffix}
            value={inputValue}
            placeholder="DD/MM/YYYY"
            asTextArea={false}
            onChange={(event) => {
              return handleInputChange(event.target.value);
            }}
          />
        </RadixForm.Control>
        {helperText && (
          <span
            className={classes(
              'flex items-center space-x-1 pt-1 text-label6 text-neutral-600 lg:text-label7',
              inputProperties.error && 'text-red-500',
            )}
          >
            {helperText}
          </span>
        )}
      </RadixForm.Field>
    );
  },
);

DatePickerField.displayName = 'DatePickerField';
