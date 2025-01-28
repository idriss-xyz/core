import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { ReactNode, useCallback, useState } from 'react';

type TriggerRenderProperties = {
  isOpened: boolean;
};

type Properties = {
  trigger: (properties: TriggerRenderProperties) => ReactNode;
  children: ReactNode;
  className?: string;
  contentAlign?: 'start' | 'center' | 'end';
};

const DropdownBase = ({
  trigger,
  children,
  className,
  contentAlign,
}: Properties) => {
  const [isOpened, setIsOpened] = useState(false);

  const onOpenChange = useCallback((opened: boolean) => {
    setIsOpened(opened);
  }, []);

  return (
    <RadixDropdown.Root open={isOpened} onOpenChange={onOpenChange}>
      <RadixDropdown.Trigger asChild>
        {trigger({ isOpened })}
      </RadixDropdown.Trigger>
      <RadixDropdown.Portal>
        <RadixDropdown.Content className={className} align={contentAlign}>
          {children}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
};

export const Dropdown = Object.assign(DropdownBase, {
  Item: RadixDropdown.Item,
});
