import { classes } from '@idriss-xyz/ui/utils';
import { ReactNode } from 'react';

type Properties = {
  label: string;
  content: string;
  className?: string;
  additionalContent?: ReactNode;
};

export const LabeledGradientProperty = ({
  label,
  content,
  className,
  additionalContent,
}: Properties) => {
  return (
    <div
      className={classes(
        'flex flex-grow flex-col items-center self-stretch lg:min-w-36',
        className,
      )}
    >
      <span
        className={classes(
          'text-body4 text-neutralGreen-900',
          'lg:text-body2',
          '2xl:text-body2"',
        )}
      >
        {label}
      </span>
      <span
        className={classes(
          'mt-1 text-heading3 text-neutralGreen-900 gradient-text',
          'lg:mt-2 lg:text-heading2',
          '2xl:text-heading2',
        )}
      >
        {content}
      </span>
      {additionalContent}
    </div>
  );
};
