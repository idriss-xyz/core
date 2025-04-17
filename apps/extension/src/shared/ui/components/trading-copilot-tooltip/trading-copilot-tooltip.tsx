import { useState } from 'react';

import { classes } from 'shared/ui';

import { TradingCopilotTooltipProperties } from './trading-copilot-tooltip.types';

export const TradingCopilotTooltip = ({
  content,
  children,
  className,
  onMouseEnter,
  disableTooltip,
  triggerClassName,
  wrapperClassName,
}: TradingCopilotTooltipProperties) => {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => {
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  const onEnter = () => {
    if (disableTooltip) {
      return;
    }

    if (onMouseEnter) {
      onMouseEnter();
    }

    showModal();
  };

  const onLeave = () => {
    if (disableTooltip) {
      return;
    }

    hideModal();
  };

  return (
    <span
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={classes('relative inline-block', wrapperClassName)}
    >
      <span
        className={classes('inline-block cursor-default', triggerClassName)}
      >
        {children}
      </span>
      <span
        className={classes(
          'custom-transition absolute left-1/2 z-10 w-max -translate-x-1/2 -translate-y-4 rounded-lg bg-black px-2 py-0.5 text-xs text-white ease-in-out',
          isVisible
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
          className,
        )}
      >
        {content}
      </span>
    </span>
  );
};
