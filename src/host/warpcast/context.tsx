import { ReactNode, createContext, useMemo } from 'react';

import { ExternalLinksScrapingResult } from 'shared/scraping';
import { createContextHook, usePooling } from 'shared/ui';

import { useWarpcastLocationInfo } from './hooks';
import { Scraper } from './scraper';

interface WarpcastScrapingContextValue {
  externalLinks: ExternalLinksScrapingResult[];
}

const WarpcastScrapingContext = createContext<
  WarpcastScrapingContextValue | undefined
>(undefined);

interface Properties {
  children: ReactNode;
}

export const WarpcastScrapingContextProvider = ({ children }: Properties) => {
  const { isWarpcast } = useWarpcastLocationInfo();

  const externalLinks = usePooling({
    defaultValue: [],
    callback: Scraper.getExternalLinks,
    enabled: isWarpcast,
  });

  const contextValue = useMemo(() => {
    return {
      externalLinks,
    };
  }, [externalLinks]);

  return (
    <WarpcastScrapingContext.Provider value={contextValue}>
      {children}
    </WarpcastScrapingContext.Provider>
  );
};

export const useWarpcastScraping = createContextHook(WarpcastScrapingContext);
