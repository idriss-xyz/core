import { ReactNode, createContext, useMemo } from 'react';

import { createContextHook, usePooling } from 'shared/ui';
import { ScrapingResults } from 'shared/scraping';

import { useLocationInfo } from './hooks';
import { Scraper } from './scraper';

const TwitterScrapingContext = createContext<ScrapingResults | undefined>(
  undefined,
);

interface Properties {
  children: ReactNode;
}

export const TwitterScrapingContextProvider = ({ children }: Properties) => {
  const { isHost } = useLocationInfo();

  const users = usePooling({
    defaultValue: [],
    callback: Scraper.getUsers,
    enabled: isHost,
  });

  const posts = usePooling({
    defaultValue: [],
    callback: Scraper.getPosts,
    enabled: isHost,
  });

  const externalLinks = usePooling({
    defaultValue: [],
    callback: Scraper.getExternalLinks,
    enabled: isHost,
  });

  const contextValue = useMemo(() => {
    return {
      users,
      posts,
      externalLinks,
    };
  }, [posts, users, externalLinks]);

  return (
    <TwitterScrapingContext.Provider value={contextValue}>
      {children}
    </TwitterScrapingContext.Provider>
  );
};

export const useTwitterScraping = createContextHook(TwitterScrapingContext);
