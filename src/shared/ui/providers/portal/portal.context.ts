import { createContext } from 'react';

export interface PortalContextValue {
  portal: HTMLDivElement | null;
}

export const PortalContext = createContext<PortalContextValue | undefined>(
  undefined,
);
