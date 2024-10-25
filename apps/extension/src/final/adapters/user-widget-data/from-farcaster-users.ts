import { UserScrapingResult } from 'shared/scraping';
import { Hex } from 'shared/web3';

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
