import { UserWidgetData } from 'final/types';
import { UserScrapingResult } from 'shared/scraping';
import { EMPTY_HEX } from 'shared/web3';

interface Properties {
  users: UserScrapingResult[];
}

/** Adapter which takes scraped users and adapts them to UserWidgetData,
 * it doesn't know about user walletAddress so it uses EMPTY_HEX to satisfy interface.
 * Wallet address should be resolved later on.
 *
 * Example: to resolve Farcaster (Supercast or Warpcast) users wallet addresses we have to
 * either make a call to farcaster api or rpc url. Both can rate limit us so we resolve single user wallet
 * later on after user decided to make an action (for example decided to send tip via IDrissSend).*/
export const fromScrapedUsers = ({ users }: Properties): UserWidgetData[] => {
  return users.map((user) => {
    return {
      type: 'idrissSend',
      walletAddress: EMPTY_HEX,
      top: user.top,
      username: user.data.username,
      nodeToInject: user.node as HTMLElement,
      isHandleUser: false,
    } as const;
  });
};
