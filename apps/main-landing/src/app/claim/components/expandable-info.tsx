import { Icon } from '@idriss-xyz/ui/icon';

type Properties = {
  title: string;
};

export const ExpandableInfo = ({ title }: Properties) => {
  return (
    <div className="flex flex-row">
      <Icon name="Check" size={24} className="mr-2 text-mint-400" />
      <span className="text-body3 text-neutralGreen-700">{title}</span>
      <Icon name="Plus" size={24} className="ml-4 text-neutral-800" />
    </div>
  );
};
