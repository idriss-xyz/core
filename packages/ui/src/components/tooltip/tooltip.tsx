'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import './tooltip.css';

import { classes } from '../../utils';

/**
 * TooltipProvider - Global configuration for tooltips
 */
export const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip - Root wrapper for tooltip
 */
export const Tooltip = TooltipPrimitive.Root;

/**
 * TooltipTrigger - Element that triggers the tooltip
 */
export const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * TooltipContent - Displays the tooltip content with animations and styles
 */
export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...properties }, reference) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={reference}
        sideOffset={sideOffset}
        aria-live="polite"
        className={classes(
          'z-50 text-balance rounded-lg px-3 py-2 text-xs font-medium transition-all',
          'data-[state=closed]:animate-fade-out data-[state=delayed-open]:animate-fade-in',
          'data-[side=bottom]:animate-slide-in-from-top data-[side=top]:animate-slide-in-from-bottom',
          'data-[side=left]:animate-slide-in-from-right data-[side=right]:animate-slide-in-from-left',
          className,
        )}
        {...properties}
      >
        {children}
        <TooltipPrimitive.Arrow width={12} height={6} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});

TooltipContent.displayName = TooltipPrimitive.Content.displayName;
