import { ReactNode } from 'react';

export interface WidgetBaseProperties {
  children: ReactNode;
  className?: string;
  top?: number;
  onClose?: () => void;
  closeButtonClassName?: string;
}
