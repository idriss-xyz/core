import { useEffect, useState } from 'react';

import { TooltipProperties } from './tooltip.types';

export const Tooltip = ({ children, tooltipMessage }: TooltipProperties) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (visible) {
      interval = setInterval(() => {
        setVisible(false);
      }, 750);
    }

    return () => {
      if (interval) {
        return clearInterval(interval);
      }
    };
  }, [visible]);

  return (
    <div
      className="relative"
      onClick={() => {
        return setVisible(true);
      }}
    >
      {children}
      {visible && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse select-none rounded-sm bg-black p-2 text-white duration-700 ease-in-out">
          {tooltipMessage}
        </div>
      )}
    </div>
  );
};
