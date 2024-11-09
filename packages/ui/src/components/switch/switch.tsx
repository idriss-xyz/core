import * as RadixSwitch from '@radix-ui/react-switch';

type Properties = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export const Switch = ({ value, onChange }: Properties) => {
  return (
    <RadixSwitch.Root
      className="group p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      checked={value}
      onCheckedChange={onChange}
    >
      <div className="h-5 w-8 rounded-full bg-neutral-300 p-0.5 group-data-[state=checked]:bg-mint-500">
        <RadixSwitch.Thumb className="block size-4 rounded-[100%] bg-white shadow-sm transition-transform data-[state=checked]:translate-x-3" />
      </div>
    </RadixSwitch.Root>
  );
};
