import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { ReactNode, useCallback, useState } from 'react';

type TriggerRenderProperties = {
  isOpened: boolean;
};
type ChildrenRenderProperties = { close: () => void };

type Properties = {
  trigger: (properties: TriggerRenderProperties) => ReactNode;
  children: (properties: ChildrenRenderProperties) => ReactNode;
  className?: string;
  contentAlign?: 'start' | 'center' | 'end';
  onChange?: (opened: boolean) => void;
};

const DropdownBase = ({
  trigger,
  children,
  className,
  contentAlign,
  onChange,
}: Properties) => {
  const [isOpened, setIsOpened] = useState(false);

  const onOpenChange = useCallback(
    (opened: boolean) => {
      setIsOpened(opened);
      onChange?.(opened);
    },
    [onChange],
  );

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <RadixDropdown.Root open={isOpened} onOpenChange={onOpenChange}>
      <RadixDropdown.Trigger asChild>
        {trigger({ isOpened })}
      </RadixDropdown.Trigger>
      <RadixDropdown.Portal>
        <RadixDropdown.Content className={className} align={contentAlign}>
          {children({ close })}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
};

export const Dropdown = Object.assign(DropdownBase, {
  Item: RadixDropdown.Item,
});
