import * as RadixDialog from '@radix-ui/react-dialog';
import { ReactNode, useCallback, useState } from 'react';

import { classes } from '../../utils';

type TriggerRenderProperties = { isOpened: boolean };
type ChildrenRenderProperties = { close: () => void };

type Properties = {
  trigger: (properties: TriggerRenderProperties) => ReactNode;
  children: (properties: ChildrenRenderProperties) => ReactNode;
  className?: string;
};

const DialogBase = ({ trigger, children, className }: Properties) => {
  const [isOpened, setIsOpened] = useState(false);

  const close = useCallback(() => {
    setIsOpened(false);
  }, []);

  return (
    <RadixDialog.Root open={isOpened} onOpenChange={setIsOpened}>
      <RadixDialog.Trigger asChild>{trigger({ isOpened })}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0" />
        <RadixDialog.Content
          aria-describedby=""
          className={classes('z-dialog', className)}
        >
          {children({ close })}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export const Dialog = Object.assign(DialogBase, { Title: RadixDialog.Title });
