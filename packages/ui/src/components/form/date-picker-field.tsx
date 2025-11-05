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
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/style.css';

import { classes } from '../../utils';
import { Icon } from '../icon';
import { Input } from '../input';
import { IconButton } from '../icon-button';

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

function Chevron(properties: {
  className?: string;
  /**
   * The size of the chevron.
   *
   * @defaultValue 24
   */
  size?: number;
  /** Set to `true` to disable the chevron. */
  disabled?: boolean;
  /** The orientation of the chevron. */
  orientation?: 'up' | 'down' | 'left' | 'right';
}) {
  const { orientation = 'left', className } = properties;

  return (
    <>
      {orientation === 'left' && (
        <IconButton
          iconName="IdrissArrowLeft"
          intent="tertiary"
          size="small"
          className={classes(
            'rounded-xl border shadow-[0_0_0_4px_rgba(242,242,242,0.14)]',
            className,
          )}
        />
      )}
      {orientation === 'right' && (
        <IconButton
          iconName="IdrissArrowRight"
          intent="tertiary"
          size="small"
          className={classes(
            'rounded-xl border shadow-[0_0_0_4px_rgba(242,242,242,0.14)]',
            className,
          )}
        />
      )}
    </>
  );
}

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

    const handleCalendarSelect = (selectedDate: Date | undefined) => {
      if (!onDateChange) return;
      if (selectedDate) {
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        onDateChange(endOfDay);
        setInputValue(format(selectedDate, 'dd/MM/yyyy'));
      } else {
        setInputValue('');
      }
      setIsDatePickerOpen(false);
    };

    const defaultClassNames = getDefaultClassNames();
    const disabledDays = disableBeforeToday
      ? [{ before: new Date() }]
      : undefined;

    const calendarSuffix = (
      <Popover.Root open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <Popover.Trigger asChild>
          <div
            className="flex h-full shrink-0 cursor-pointer items-center self-stretch border-l border-gray-200 pl-3 hover:text-mint-600"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDatePickerOpen(true);
            }}
          >
            <Icon name="CalendarDays" size={16} />
          </div>
        </Popover.Trigger>
        <Popover.Content
          sideOffset={8}
          className="relative z-10 w-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-md"
          side="bottom"
          align="center"
          avoidCollisions={false}
        >
          <DayPicker
            mode="single"
            selected={dateValue}
            onSelect={handleCalendarSelect}
            disabled={disabledDays}
            classNames={{
              today: `rounded-full text-mint-500`,
              selected: `bg-mint-500 rounded-full text-white`,
              root: `${defaultClassNames.root} shadow-none`,
              chevron: `fill-black`,
              caption_label: 'text-label1',
              month: 'flex flex-col gap-4',
              month_caption: 'flex items-center h-[40px]',
              nav: `${defaultClassNames.nav} gap-3`,
              weekday: 'text-label3',
              day: 'text-label4 text-neutral-700',
            }}
            components={{
              Chevron: Chevron,
            }}
          />
        </Popover.Content>
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
              handleDateInputChange(event.target.value);
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
