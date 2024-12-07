import { ReactNode } from 'react';

export interface WidgetBaseProperties {
  children: ReactNode;
  className?: string;
  onClose?: () => void;
  closeButtonClassName?: string;
}
