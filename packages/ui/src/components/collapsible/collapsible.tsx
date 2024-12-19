import React, { ReactNode } from 'react';
import * as RadixCollapsible from '@radix-ui/react-collapsible';
import { Icon } from '@idriss-xyz/ui/icon';

type Properties = {
  header: ReactNode;
  content: ReactNode;
};

export const Collapsible = ({ header, content }: Properties) => {
  const [open, setOpen] = React.useState(false);
  return (
    <RadixCollapsible.Root open={open} onOpenChange={setOpen}>
      <div className="flex flex-row items-center justify-between gap-4">
        {header}
        <RadixCollapsible.Trigger asChild>
          <button>
            {open ? (
              <Icon name="Minus" size={24} className="text-neutral-800" />
            ) : (
              <Icon name="Plus" size={24} className="text-neutral-800" />
            )}
          </button>
        </RadixCollapsible.Trigger>
      </div>

      <RadixCollapsible.Content>{content}</RadixCollapsible.Content>
    </RadixCollapsible.Root>
  );
};
