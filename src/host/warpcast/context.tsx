import { ReactNode, createContext, useMemo } from 'react';

import { ScrapingResult } from 'shared/scraping';
import { createContextHook, usePooling } from 'shared/ui';

import { useWarpcastLocationInfo } from './hooks';
import { Warpcast } from './warpcast';

interface WarpcastScrapingContextValue {
  externalLinks: ScrapingResult[];
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
    callback: Warpcast.getExternalLinks,
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
