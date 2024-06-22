import { Hex } from 'shared/web3';

import { IconType } from './schema';

export interface Recipient {
  top: number;
  node: Element;
  username: string;
  availableNetworks: number[];
  widgetOverrides?: {
    headerCopy: string;
    sendButtonCopy: string;
    iconType: IconType;
  };
  walletAddress: Hex;
}
