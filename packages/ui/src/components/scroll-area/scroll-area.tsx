'use client';
import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import { ReactNode } from 'react';

import { classes } from '../../utils';

interface ScrollAreaProperties extends RadixScrollArea.ScrollAreaProps {
  children: ReactNode;
  className?: string;
  scrollBarClassName?: string;
  customScrollEventName?: string;
}

const handleScroll = (
  event: React.UIEvent<HTMLDivElement>,
  customEventName: string,
) => {
  const target = event.currentTarget;
  const customEvent = new CustomEvent(customEventName, {
    detail: { scrollTop: target.scrollTop, scrollLeft: target.scrollLeft },
  });
  window.dispatchEvent(customEvent);
};

export const ScrollArea = ({
  children,
  className,
  scrollBarClassName,
  customScrollEventName,
  ...properties
}: ScrollAreaProperties) => {
  return (
    <RadixScrollArea.Root className="h-full overflow-hidden" {...properties}>
      <RadixScrollArea.Viewport
        onScroll={(event) => {
          if (customScrollEventName) {
            handleScroll(event, customScrollEventName);
          }
        }}
        className={classes('size-full rounded', className)}
      >
        {children}
      </RadixScrollArea.Viewport>
      <RadixScrollArea.Scrollbar
        className={classes(
          'z-scrollbar flex touch-none select-none bg-transparent p-[5px] transition-colors duration-150 ease-out data-[orientation=horizontal]:h-[16px] data-[orientation=vertical]:w-[16px] data-[orientation=horizontal]:flex-col',
          scrollBarClassName,
        )}
        orientation="vertical"
      >
        <RadixScrollArea.Thumb className="relative w-2 flex-1 rounded-full bg-neutral-300 transition-colors duration-150 ease-out hover:bg-neutral-400 active:bg-neutral-500" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Scrollbar
        className={classes(
          'z-scrollbar flex touch-none select-none bg-transparent p-[5px] transition-colors duration-150 ease-out data-[orientation=horizontal]:h-[16px] data-[orientation=vertical]:w-[16px] data-[orientation=horizontal]:flex-col',
          scrollBarClassName,
        )}
        orientation="horizontal"
      >
        <RadixScrollArea.Thumb className="relative w-2 flex-1 rounded-full bg-neutral-300 transition-colors duration-150 ease-out hover:bg-neutral-400 active:bg-neutral-500" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Corner className="bg-neutral-300" />
    </RadixScrollArea.Root>
  );
};
