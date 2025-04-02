import { Icon, IconName } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { ReactNode } from 'react';

type Properties = {
  heading: string;
  iconName: IconName;
  className?: string;
  description: string;
  children?: ReactNode;
};

export const ProsItem = ({
  heading,
  iconName,
  children,
  className,
  description,
}: Properties) => {
  return (
    <div className={classes('flex w-full flex-col items-start', className)}>
      <Icon
        size={32}
        name={iconName}
        className="size-6 text-mint-400 md:size-8"
      />

      <h3
        className={classes(
          'mt-4 max-w-[500px] text-heading4 text-midnightGreen-100',
          'md:text-heading3',
          'lg:text-heading2',
        )}
      >
        {heading}
      </h3>

      <p
        className={classes(
          'mt-2 max-w-[500px] text-balance text-body6 text-midnightGreen-200',
          'md:text-body5',
          'lg:text-body4',
        )}
      >
        {description}
      </p>

      {children}
    </div>
  );
};
