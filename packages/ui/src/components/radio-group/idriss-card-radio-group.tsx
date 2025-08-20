import * as RadixRadioGroup from '@radix-ui/react-radio-group';

import { Card, CardHeader, CardBody } from '../card';
import { classes } from '../../utils';

export type CardRadioItem = {
  value: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

type Properties = {
  items: CardRadioItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export const IdrissCardRadioGroup = ({
  items,
  value,
  onChange,
  className,
}: Properties) => {
  return (
    <RadixRadioGroup.Root value={value} onValueChange={onChange}>
      <div className={classes('grid grid-cols-2 gap-4', className)}>
        {items.map((item) => {
          return (
            <Card
              key={item.value}
              className={classes(
                'cursor-pointer border p-0 shadow-none transition-colors hover:border-mint-500',
                value === item.value
                  ? 'border-[1.5px] border-mint-500'
                  : 'border-gray-200',
              )}
              onClick={() => {
                return onChange(item.value);
              }}
            >
              <div className="p-1">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="h-[200px] w-full rounded-lg object-cover"
                />
              </div>

              <div className="flex flex-col gap-1 p-4">
                <div className="flex items-center justify-between">
                  <CardHeader>
                    <h4 className="text-heading4 text-neutral-900">
                      {item.title}
                    </h4>
                  </CardHeader>
                  <RadixRadioGroup.Item
                    className="size-[20px] cursor-default rounded-full border-2 border-neutral-400 data-[state=checked]:border-mint-500"
                    value={item.value}
                  >
                    <RadixRadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[16px] after:rounded-full after:border-2 after:border-neutral-100 after:bg-mint-500" />
                  </RadixRadioGroup.Item>
                </div>

                <CardBody>
                  <p className="text-body2 text-neutral-600">
                    {item.description}
                  </p>
                </CardBody>
              </div>
            </Card>
          );
        })}
      </div>
    </RadixRadioGroup.Root>
  );
};
