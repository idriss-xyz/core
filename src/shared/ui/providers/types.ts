import { ReactNode } from 'react';

export interface ProviderProperties {
  children: ReactNode;
}

export type OnWindowMessageFunction = <T>(
  type: string,
  callback: (data: T, removeListener: () => void) => void,
) => void;
