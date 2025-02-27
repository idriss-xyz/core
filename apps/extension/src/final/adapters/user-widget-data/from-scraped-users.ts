import { EMPTY_HEX } from '@idriss-xyz/constants';

import { UserScrapingResult } from 'shared/scraping';

import { UserWidgetData } from '../../types';

export const fromScrapedUser = (properties: {
  user: UserScrapingResult;
}): UserWidgetData => {
  const { user } = properties;

  return {
    type: 'idrissSend',
    walletAddress: EMPTY_HEX,
    top: user.top,
    username: user.data.username,
    node: user.node as HTMLElement,
    nodeId: user.nodeId,
    isHandleUser: false,
  } as const;
};
