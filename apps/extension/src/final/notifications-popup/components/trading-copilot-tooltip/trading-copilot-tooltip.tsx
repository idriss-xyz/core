import { useState } from 'react';

import { TradingCopilotTooltipProperties } from './trading-copilot-tooltip.types';

export const TradingCopilotTooltip = ({
  content,
  children,
}: TradingCopilotTooltipProperties) => {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => {
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showModal}
      onMouseLeave={hideModal}
    >
      <div className="inline-block cursor-default">{children}</div>
      <div
        className={`absolute left-1/2 w-max -translate-x-1/2 -translate-y-12 rounded-lg bg-black px-2 py-0.5 text-xs text-white transition-opacity delay-500 ease-in-out ${isVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        {content}
      </div>
    </div>
  );
};
