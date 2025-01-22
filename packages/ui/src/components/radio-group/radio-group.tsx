import * as RadixRadioGroup from '@radix-ui/react-radio-group';

import { classes } from '../../utils';

export type RadioItem = {
  value: string;
  label: string;
};

type Properties = {
  items: RadioItem[];
  className?: string;
  value: string;
  onChange: (value: string) => void;
};

export const RadioGroup = ({
  items,
  onChange,
  value,
  className,
}: Properties) => {
  return (
    <RadixRadioGroup.Root value={value} onValueChange={onChange}>
      <div className={classes('flex flex-col gap-4', className)}>
        {items.map((item) => {
          return (
            <div key={item.value}>
              <RadixRadioGroup.Item
                className="size-[20px] cursor-default rounded-full border-2 border-neutral-200 bg-transparent outline-none hover:border-neutral-100 data-[state=checked]:border-mint-500"
                value={item.value}
                id={item.value}
              >
                <RadixRadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[16px] after:rounded-full after:border-2 after:border-neutral-100 after:bg-mint-500" />
              </RadixRadioGroup.Item>
              <label
                className="pl-[15px] text-body5 text-neutral-900"
                htmlFor={item.value}
              >
                {item.label}
              </label>
            </div>
          );
        })}
      </div>
    </RadixRadioGroup.Root>
  );
};
