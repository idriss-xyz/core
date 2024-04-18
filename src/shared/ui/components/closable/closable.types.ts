import { ReactNode } from 'react';

export interface ClosableProperties {
  children: ReactNode;
  className?: string;
  top?: number;
  left?: number;
  onClose?: () => void;
  closeButtonClassName?: string;
  closeButtonIconClassName?: string;
  closeOnClickAway?: boolean;
}
