import * as RadixRadioGroup from '@radix-ui/react-radio-group';

import { classes } from '../../utils';

type RadioItem = {
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
    <RadixRadioGroup.Root
      className={classes('flex flex-col gap-2.5', className)}
      value={value}
      onValueChange={onChange}
    >
      <div className="flex items-center">
        {items.map((item) => {
          return (
            <div key={item.value}>
              <RadixRadioGroup.Item
                className="size-[25px] cursor-default rounded-full border-2 border-neutral-200 bg-transparent shadow-[0_2px_10px] outline-none hover:border-neutral-400 focus:shadow-[0_0_0_2px] focus:shadow-black"
                value={item.value}
                id={item.value}
              >
                <RadixRadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-full after:bg-mint-500" />
              </RadixRadioGroup.Item>
              <label
                className="pl-[15px] text-[15px] leading-none text-white"
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
