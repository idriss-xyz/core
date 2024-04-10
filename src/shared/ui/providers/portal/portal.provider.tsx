import { ReactNode, useMemo, useState } from 'react';

import { PortalContext, PortalContextValue } from './portal.context';

interface Properties {
  children: ReactNode;
}

export const PortalContextProvider = ({ children }: Properties) => {
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
      <div ref={setPortal} />
    </PortalContext.Provider>
  );
};
