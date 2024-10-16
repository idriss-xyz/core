import { UserScrapingResult } from 'shared/scraping';
import { EMPTY_HEX } from 'shared/web3';

export const fromScrapedUser = (properties: { user: UserScrapingResult }) => {
  const { user } = properties;

  return {
    type: 'idrissSend',
    walletAddress: EMPTY_HEX,
    top: user.top,
    username: user.data.username,
    nodeToInject: user.node as HTMLElement,
    isHandleUser: false,
  } as const;
};
