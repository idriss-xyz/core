import { ReactNode } from 'react';

export interface IdrissMoneyInputProperties {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  errorMessage?: string;
}

export interface IdrissMoneyButtonProperties {
  onClick: () => void;
  children: ReactNode;
  isActive: boolean;
  className?: string;
}
