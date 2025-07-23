import * as RadixSwitch from '@radix-ui/react-switch';
import { forwardRef } from 'react';

type Properties = {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export const Switch = forwardRef<HTMLButtonElement, Properties>(
  ({ value, onChange, disabled }, reference) => {
    return (
      <RadixSwitch.Root
        ref={reference}
        className="group p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
      >
        <div className="h-6 w-[42px] rounded-full bg-neutral-300 p-0.5 group-data-[state=checked]:bg-mint-500">
          <RadixSwitch.Thumb className="block size-5 rounded-[100%] bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4.5" />
        </div>
      </RadixSwitch.Root>
    );
  },
);

Switch.displayName = 'Switch';
