import { ReactNode, useState } from 'react';
import * as RadixCollapsible from '@radix-ui/react-collapsible';

import { Icon } from '@idriss-xyz/ui/icon';

type Properties = {
  header: ReactNode;
  content: ReactNode;
} & (
  | { controlled: true; open: boolean; onOpenChange: (open: boolean) => void }
  | { controlled?: false }
);

export const Collapsible = (properties: Properties) => {
  const { header, content, controlled } = properties;
  const [_open, _setOpen] = useState(false);

  const isOpen = controlled ? properties.open : _open;

  const handleOpenChange = (open: boolean) => {
    controlled ? properties.onOpenChange(open) : _setOpen(open);
  };

  return (
    <RadixCollapsible.Root open={isOpen} onOpenChange={handleOpenChange}>
      <div className="flex flex-row items-center justify-between gap-4">
        {header}
        <RadixCollapsible.Trigger asChild>
          <button>
            {isOpen ? (
              <Icon name="Minus" size={24} className="text-neutral-800" />
            ) : (
              <Icon name="Plus" size={24} className="text-neutral-800" />
            )}
          </button>
        </RadixCollapsible.Trigger>
      </div>

      <RadixCollapsible.Content className="overflow-hidden data-[state=closed]:animate-collapsible-slide-up data-[state=open]:animate-collapsible-slide-down">
        {content}
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
  );
};
