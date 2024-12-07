import { ReactNode, createContext, useMemo, useState } from 'react';

import { createContextHook } from '../utils';

type PortalContextValue = {
  portal: HTMLDivElement | null;
};

const PortalContext = createContext<PortalContextValue | undefined>(undefined);

export const usePortal = createContextHook(PortalContext);

interface Properties {
  children: ReactNode;
}

export const WithPortal = ({ children }: Properties) => {
  // eslint-disable-next-line unicorn/no-null
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);

  const contextValue: PortalContextValue = useMemo(() => {
    return {
      portal,
    };
  }, [portal]);

  return (
    <PortalContext.Provider value={contextValue}>
      {children}
      <div ref={setPortal} className="relative z-portal" />
    </PortalContext.Provider>
  );
};
