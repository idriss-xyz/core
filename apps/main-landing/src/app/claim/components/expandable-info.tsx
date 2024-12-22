import { Icon } from '@idriss-xyz/ui/icon';
import { Collapsible } from '@idriss-xyz/ui/collapsible';

type Properties = {
  title: string;
  subTitle: string;
  describtion: string;
};

export const ExpandableInfo = ({
  title,
  subTitle,
  describtion,
}: Properties) => {
  return (
    <Collapsible
      header={
        <div className="flex grow flex-row gap-2">
          <Icon name="Check" size={24} className="mr-2 text-mint-400" />
          <div className="flex w-full items-center justify-between">
            <span className="text-body4 text-neutralGreen-700">{title}</span>
            <span className="text-body5 text-neutralGreen-500">{subTitle}</span>
          </div>
        </div>
      }
      content={
        <div className="flex flex-row">
          <span className="mt-1 pl-10 text-body5 text-neutralGreen-500">
            {describtion}
          </span>
        </div>
      }
     />
  );
};
