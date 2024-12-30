'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { classes } from '../../utils';

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = TooltipPrimitive.Root;

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...properties }, reference) => {return (
  <TooltipPrimitive.Content
    ref={reference}
    sideOffset={sideOffset}
    className={classes(
      'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 overflow-hidden rounded-lg px-3 py-2 text-xs font-medium',
      className,
    )}
    {...properties}
  >
    {children}
    <TooltipPrimitive.Arrow width={12} height={6} />
  </TooltipPrimitive.Content>
)});

TooltipContent.displayName = TooltipPrimitive.Content.displayName;
