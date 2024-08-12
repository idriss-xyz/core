import { ReactNode, createContext, useMemo } from 'react';

import { ScrapingResults } from 'shared/scraping';
import { createContextHook, usePooling } from 'shared/ui';

import { useLocationInfo } from './hooks';
import { Scraper } from './scraper';

const WarpcastScrapingContext = createContext<ScrapingResults | undefined>(
  undefined,
);

interface Properties {
  children: ReactNode;
}

export const WarpcastScrapingContextProvider = ({ children }: Properties) => {
  const { isHost } = useLocationInfo();

  const externalLinks = usePooling({
    defaultValue: [],
    callback: Scraper.getExternalLinks,
    enabled: isHost,
  });

  const posts = usePooling({
    defaultValue: [],
    callback: Scraper.getPosts,
    enabled: isHost,
  });

  const contextValue: ScrapingResults = useMemo(() => {
    return {
      externalLinks,
      users: [],
      posts,
    };
  }, [externalLinks, posts]);

  return (
    <WarpcastScrapingContext.Provider value={contextValue}>
      {children}
    </WarpcastScrapingContext.Provider>
  );
};

export const useWarpcastScraping = createContextHook(WarpcastScrapingContext);
