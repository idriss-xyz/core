import { ReactNode, useMemo } from 'react';

import { useLocationPolling } from 'shared/ui/hooks';

import { Twitter } from '../twitter';

import { TwitterPageContext } from './page.context';

interface Properties {
  children: ReactNode;
}

export const TwitterPageProvider = ({ children }: Properties) => {
  const { location } = useLocationPolling();

  const page = useMemo(() => {
    return Twitter.getPage(location);
  }, [location]);

  return (
    <TwitterPageContext.Provider value={page}>
      {children}
    </TwitterPageContext.Provider>
  );
};
