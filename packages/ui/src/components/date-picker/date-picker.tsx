import { DayPicker, getDefaultClassNames } from 'react-day-picker';

import 'react-day-picker/style.css';
import { IconButton } from '../icon-button';
import { classes } from '../../utils';

function Chevron(properties: {
  className?: string;
  size?: number;
  disabled?: boolean;
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

interface DatePickerProperties {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  disableBeforeToday?: boolean;
}

export const DatePicker = ({
  date,
  onSelect,
  disableBeforeToday = false,
}: DatePickerProperties) => {
  const defaultClassNames = getDefaultClassNames();
  const disabledDays = disableBeforeToday
    ? [{ before: new Date() }]
    : undefined;

  return (
    <DayPicker
      mode="single"
      selected={date}
      onSelect={onSelect}
      disabled={disabledDays}
      classNames={{
        today: 'rounded-full text-mint-500',
        selected: 'bg-mint-500 rounded-full text-white',
        root: `${defaultClassNames.root} shadow-none`,
        chevron: 'fill-black',
        caption_label: 'text-label1',
        month: 'flex flex-col gap-4',
        month_caption: 'flex items-center h-[40px]',
        nav: `${defaultClassNames.nav} gap-3`,
        weekday: 'text-label3',
        day: 'text-label4 text-neutral-700',
      }}
      components={{ Chevron }}
    />
  );
};
