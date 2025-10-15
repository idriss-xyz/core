import { ReactNode } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

interface DatePickerProperties {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  children: ReactNode;
}

export const DatePicker = ({
  date,
  onSelect,
  children,
}: DatePickerProperties) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          className="w-auto rounded-md border border-gray-200 bg-white p-2 shadow-md"
        >
          <DayPicker mode="single" selected={date} onSelect={onSelect} />
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
