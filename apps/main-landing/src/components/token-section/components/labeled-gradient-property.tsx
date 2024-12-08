import { ReactNode } from 'react';

type Properties = {
  label: string;
  content: string;
  additionalContent?: ReactNode;
};

export const LabeledGradientProperty = ({
  label,
  content,
  additionalContent,
}: Properties) => {
  return (
    <div className="flex flex-col items-center gap-3 lg:min-w-56">
      <span className="text-body3 text-neutralGreen-900 lg:text-body2">
        {label}
      </span>
      <span className="mt-3 text-display3 text-neutralGreen-900 gradient-text lg:text-display2">
        {content}
      </span>
      {additionalContent}
    </div>
  );
};
