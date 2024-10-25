import { ReactNode } from 'react';

import { Icon, Spinner } from 'shared/ui';

interface Properties {
  recipient: string;
  heading: ReactNode;
  children: ReactNode;
}

export const Loading = ({ recipient, heading, children }: Properties) => {
  return (
    <div className="flex flex-col items-center text-center">
      <Spinner className="size-24 text-[#11DD74]" />
      <p className="mt-8 text-lg font-medium leading-6 text-[#111827]">
        Waiting for Confirmation
      </p>
      <p className="mt-1 leading-6 text-[#111827]">{heading}</p>
      <p className="flex items-center space-x-1">
        <span>to </span>
        <span
          className="block max-w-40 truncate whitespace-nowrap"
          title={recipient}
        >
          @{recipient}
        </span>{' '}
        <Icon
          size={16}
          name="TwitterLogoIcon"
          className="text-[#1D9BF0] [&>path]:fill-rule-non-zero"
        />
      </p>
      <p className="mt-1 text-xs font-medium leading-6 text-[#64748B]">
        {children}
      </p>
    </div>
  );
};
