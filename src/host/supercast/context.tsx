import { ReactNode, createContext, useMemo } from 'react';

import { ScrapingResults } from 'shared/scraping';
import { createContextHook, usePooling } from 'shared/ui';

import { useLocationInfo } from './hooks';
import { Scraper } from './scraper';

const SupercastScrapingContext = createContext<ScrapingResults | undefined>(
  undefined,
);

interface Properties {
  children: ReactNode;
}

export const SupercastScrapingContextProvider = ({ children }: Properties) => {
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

  const users = usePooling({
    defaultValue: [],
    callback: Scraper.getUsers,
    enabled: isHost,
  });

  const contextValue: ScrapingResults = useMemo(() => {
    return {
      externalLinks,
      users,
      posts,
    };
  }, [externalLinks, posts, users]);

  return (
    <SupercastScrapingContext.Provider value={contextValue}>
      {children}
    </SupercastScrapingContext.Provider>
  );
};

export const useSupercastScraping = createContextHook(SupercastScrapingContext);
