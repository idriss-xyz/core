import { Icon } from '@idriss-xyz/ui/icon';
import { Collapsible } from '@idriss-xyz/ui/collapsible';
import { EligibilityCriteriaTitle } from '../constants';
import { ReactNode } from 'react';

type Properties = {
  open: boolean;
  title: EligibilityCriteriaTitle;
  subTitle: string;
  positive: boolean
  description: ReactNode;
  onOpenChange: (open: boolean) => void;
};

export const ExpandableInfo = ({
  open,
  title,
  subTitle,
  positive,
  description,
  onOpenChange,
}: Properties) => {
  return (
    <Collapsible
      controlled
      open={open}
      onOpenChange={onOpenChange}
      header={
        <div className="flex grow flex-row gap-2">
          {positive ? <Icon name="Check" size={24} className="mr-2 text-mint-600" /> : <Icon name="X" size={24} className="mr-2 text-red-500" />}
          <div className="flex w-full items-center justify-between">
            <span className="text-body4 text-neutralGreen-700">{title}</span>
            <span className="text-body5 text-neutralGreen-500">{subTitle}</span>
          </div>
        </div>
      }
      content={
        <div className="flex flex-row">
          <span className="mt-1 pl-10 text-body5 text-neutralGreen-500">
            {description}
          </span>
        </div>
      }
    />
  );
};
