import { ReactNode, createContext, useMemo } from 'react';

import { createContextHook, usePooling } from 'shared/ui';
import { ScrapingResult } from 'shared/scraping';

import { useTwitterLocationInfo } from './hooks';
import { Twitter } from './twitter';

interface TwitterScrapingContextValue {
  users: ScrapingResult[];
  tweetAuthors: ScrapingResult[];
  externalLinks: ScrapingResult[];
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
    callback: Twitter.getUsers,
    enabled: isTwitter,
  });

  const tweetAuthors = usePooling({
    defaultValue: [],
    callback: Twitter.getTweetAuthors,
    enabled: isTwitter,
  });

  const externalLinks = usePooling({
    defaultValue: [],
    callback: Twitter.getExternalLinks,
    enabled: isTwitter,
  });

  const contextValue = useMemo(() => {
    return {
      users,
      tweetAuthors,
      externalLinks,
    };
  }, [tweetAuthors, users, externalLinks]);

  return (
    <TwitterScrapingContext.Provider value={contextValue}>
      {children}
    </TwitterScrapingContext.Provider>
  );
};

export const useTwitterScraping = createContextHook(TwitterScrapingContext);
