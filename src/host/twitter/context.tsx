import { ReactNode, createContext, useMemo } from 'react';

import { createContextHook, usePooling } from 'shared/ui';
import {
  ExternalLinksScrapingResult,
  PostScrapingResult,
  UserScrapingResult,
} from 'shared/scraping';

import { useTwitterLocationInfo } from './hooks';
import { Scraper } from './scraper';

interface TwitterScrapingContextValue {
  users: UserScrapingResult[];
  posts: PostScrapingResult[];
  externalLinks: ExternalLinksScrapingResult[]; // TODO: external link is probably subset of post
}

const TwitterScrapingContext = createContext<
  TwitterScrapingContextValue | undefined
>(undefined);

interface Properties {
  children: ReactNode;
}

export const TwitterScrapingContextProvider = ({ children }: Properties) => {
  const { isTwitter } = useTwitterLocationInfo();

  const users = usePooling({
    defaultValue: [],
    callback: Scraper.getUsers,
    enabled: isTwitter,
  });

  const posts = usePooling({
    defaultValue: [],
    callback: Scraper.getPosts,
    enabled: isTwitter,
  });

  const externalLinks = usePooling({
    defaultValue: [],
    callback: Scraper.getExternalLinks,
    enabled: isTwitter,
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
