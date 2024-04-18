import { ReactNode } from 'react';

export interface ChainSelectProperties {
  value: number;
  label?: string;
  renderLabel?: () => ReactNode;
  className?: string;
  onChange: (value: number) => void;
  allowedChainsIds?: number[];
  renderSuffix?: (chainId: number) => ReactNode;
}
