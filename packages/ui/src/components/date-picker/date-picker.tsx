import { ReactNode } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/style.css';

interface DatePickerProperties {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  children: ReactNode;
  disableBeforeToday?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DatePicker = ({
  date,
  onSelect,
  children,
  disableBeforeToday = false,
  open,
  onOpenChange,
}: DatePickerProperties) => {
  const defaultClassNames = getDefaultClassNames();

  // Compute disabled days conditionally
  const disabledDays = disableBeforeToday
    ? [{ before: new Date() }]
    : undefined;

  const setToEndOfDay = (date: Date) => {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (!onSelect) return;
    if (selectedDate) {
      onSelect(setToEndOfDay(selectedDate));
    }
    onOpenChange?.(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          className="w-auto rounded-md border border-gray-200 bg-white p-2 shadow-md"
        >
          <DayPicker
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={disabledDays}
            classNames={{
              today: `$bg-mint-500 rounded-full text-mint-500`,
              selected: `bg-mint-500 rounded-full text-white`,
              root: `${defaultClassNames.root} shadow-none`,
              chevron: `fill-black`,
            }}
          />
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
