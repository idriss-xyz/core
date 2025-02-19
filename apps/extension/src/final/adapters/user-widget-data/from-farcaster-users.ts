import { Hex } from 'viem';

import { UserScrapingResult } from 'shared/scraping';

import { UserWidgetData } from '../../types';

import { fromScrapedUser } from './from-scraped-users';

type FarcasterScrapingResult = UserScrapingResult & {
  data: UserScrapingResult['data'] & { walletAddress: Hex };
};

interface Properties {
  users: FarcasterScrapingResult[];
}

export const fromFarcasterUsers = ({ users }: Properties): UserWidgetData[] => {
  return users.map((user) => {
    return {
      ...fromScrapedUser({ user }),
      walletAddress: user.data.walletAddress,
    };
  });
};
