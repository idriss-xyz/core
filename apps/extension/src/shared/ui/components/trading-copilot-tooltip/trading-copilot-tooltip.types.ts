import { ReactNode } from 'react';

export interface TradingCopilotTooltipProperties {
  content: ReactNode;
  className?: string;
  children: ReactNode;
  disableTooltip?: boolean;
  onMouseEnter?: () => void;
  triggerClassName?: string;
  wrapperClassName?: string;
}
