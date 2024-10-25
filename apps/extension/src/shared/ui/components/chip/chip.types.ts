import { ReactNode } from 'react';

export interface ChipProperties {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  width?: 'short' | 'long';
  variant?: 'success' | 'info';
}
