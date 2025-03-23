import { Icon, IconName } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { ReactNode } from 'react';

type Properties = {
  heading: string;
  iconName: IconName;
  className?: string;
  description: string;
  children?: ReactNode;
  headingClassName?: string;
  descriptionClassName?: string;
};

export const ProsItem = ({
  heading,
  iconName,
  children,
  className,
  description,
  headingClassName,
  descriptionClassName,
}: Properties) => {
  return (
    <div className={classes('flex w-full flex-col', className)}>
      <Icon
        name={iconName}
        size={32}
        className="size-6 text-mint-400 md:size-8"
      />

      <h3
        className={classes(
          'mt-4 text-heading6 text-midnightGreen-100',
          'md:text-heading5',
          'lg:text-heading4',
          headingClassName,
        )}
      >
        {heading}
      </h3>

      <p
        className={classes(
          'mt-2 text-balance text-body6 text-midnightGreen-200',
          'md:text-body5',
          'lg:text-body4',
          descriptionClassName,
        )}
      >
        {description}
      </p>

      {children}
    </div>
  );
};
