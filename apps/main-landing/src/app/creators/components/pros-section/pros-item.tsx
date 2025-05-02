import { Icon, IconName } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { ReactNode } from 'react';

type Properties = {
  heading: string;
  iconName: IconName;
  className?: string;
  innerClassName?: string;
  description: string;
  children?: ReactNode;
};

export const ProsItem = ({
  heading,
  iconName,
  children,
  className,
  description,
  innerClassName,
}: Properties) => {
  return (
    <div
      className={classes('flex w-full flex-col items-start gap-y-2', className)}
    >
      <div
        className={classes('flex max-w-[510px] flex-col gap-3', innerClassName)}
      >
        <Icon
          size={32}
          name={iconName}
          className="size-6 text-mint-400 md:size-8"
        />

        <h3
          className={classes(
            'text-heading4 text-midnightGreen-100',
            'md:text-heading3',
            'lg:text-heading2',
          )}
        >
          {heading}
        </h3>

        <p
          className={classes('text-body4 text-midnightGreen-200 lg:text-wrap')}
        >
          {description}
        </p>
      </div>

      {children}
    </div>
  );
};
