import { classes } from '@idriss-xyz/ui/utils';
import { ReactNode } from 'react';

type Properties = {
  label: string;
  content: string;
  className?: string
  additionalContent?: ReactNode;
};

export const LabeledGradientProperty = ({
  label,
  content,
  className,
  additionalContent,
}: Properties) => {
  return (
    <div className={classes("self-stretch flex flex-col items-center lg:min-w-36 flex-grow", className)}>
      <span className="text-body4  text-neutralGreen-900 lg:text-body2">
        {label}
      </span>
      <span className="mt-1 lg:mt-2 text-heading3 text-neutralGreen-900 gradient-text lg:text-heading2">
        {content}
      </span>
      {additionalContent}
    </div>
  );
};
