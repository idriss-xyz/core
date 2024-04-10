import { ReactNode } from 'react';

export interface WidgetBaseProperties {
  children: ReactNode;
  className?: string;
  top?: number;
  onHide?: () => void;
  closeButtonClassName?: string;
}
