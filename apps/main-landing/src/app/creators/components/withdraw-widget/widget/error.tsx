import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';
import { ReactNode } from 'react';

interface Properties {
  heading: ReactNode;
  children: ReactNode;
  onClose: () => void;
}

export const Error = ({ heading, children, onClose }: Properties) => {
  return (
    <div className="flex flex-col items-center text-center">
      <Icon name="X" className="text-[#D1D5DB]" size={112} />
      <p className="mt-4 text-lg font-medium leading-6 text-[#111827]">
        {heading}
      </p>
      {children}
      <Button
        size="small"
        onClick={onClose}
        intent="primary"
        className="mt-5 w-full rounded-md bg-[#11DD74] py-2 text-base font-medium text-white shadow-sm hover:bg-[#11DD74]"
      >
        Close
      </Button>
    </div>
  );
};
