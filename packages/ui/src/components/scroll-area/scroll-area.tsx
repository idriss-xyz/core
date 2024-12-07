import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import { ReactNode } from 'react';

import { classes } from '../../utils';

interface ScrollAreaProperties extends RadixScrollArea.ScrollAreaProps {
  children: ReactNode;
  scrollBarClassName?: string;
  className?: string;
}

export const ScrollArea = ({
  children,
  className,
  scrollBarClassName,
  ...properties
}: ScrollAreaProperties) => {
  return (
    <RadixScrollArea.Root className="h-full overflow-hidden" {...properties}>
      <RadixScrollArea.Viewport
        className={classes('size-full rounded', className)}
      >
        {children}
      </RadixScrollArea.Viewport>
      <RadixScrollArea.Scrollbar
        className={classes(
          'flex touch-none select-none bg-black/10 p-0.5 transition-colors duration-150 ease-out hover:bg-black/20 data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col',
          scrollBarClassName,
        )}
        orientation="vertical"
      >
        <RadixScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-black/20 transition-colors duration-150 ease-out before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-[44px] before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:bg-black/40 active:bg-black/90" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Scrollbar
        className="flex touch-none select-none bg-black/10 p-0.5 transition-colors duration-150 ease-out hover:bg-black/20 data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col"
        orientation="horizontal"
      >
        <RadixScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-black/20 transition-colors duration-150 ease-out before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-[44px] before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:bg-black/40 active:bg-black/90" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Corner className="bg-black/10" />
    </RadixScrollArea.Root>
  );
};
