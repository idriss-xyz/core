import { ReactNode } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
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
  const defaultClassNames = getDefaultClassNames();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          className="w-auto rounded-md border border-gray-200 bg-white p-2 shadow-md"
        >
          <DayPicker
            mode="single"
            selected={date}
            onSelect={onSelect}
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
