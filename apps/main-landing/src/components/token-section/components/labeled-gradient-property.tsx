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
    <div className="w-full flex flex-col items-center lg:min-w-36">
      <span className="text-body3 text-neutralGreen-900 lg:text-body2">
        {label}
      </span>
      <span className="mt-1 lg:mt-2 text-heading3 text-neutralGreen-900 gradient-text lg:text-heading2">
        {content}
      </span>
      {additionalContent}
    </div>
  );
};
