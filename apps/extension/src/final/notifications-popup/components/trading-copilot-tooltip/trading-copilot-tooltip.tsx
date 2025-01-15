import { useState } from 'react';

import { TradingCopilotTooltipProperties } from './trading-copilot-tooltip.types';

export const TradingCopilotTooltip = ({
  content,
  children,
  className,
}: TradingCopilotTooltipProperties) => {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => {
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={showModal}
      onMouseLeave={hideModal}
    >
      <span className="inline-block cursor-default">{children}</span>
      <span
        className={`custom-transition absolute left-1/2 z-10 w-max -translate-x-1/2 -translate-y-12 rounded-lg bg-black px-2 py-0.5 text-xs text-white ease-in-out ${isVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} ${className}`}
      >
        {content}
      </span>
    </span>
  );
};
