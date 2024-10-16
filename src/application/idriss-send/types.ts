import { Hex } from 'shared/web3';

import { IconType } from './schema';

export interface WidgetData {
  top: number;
  username: string;
  availableNetworks?: number[];
  widgetOverrides?: {
    headerCopy: string;
    sendButtonCopy: string;
    iconType: IconType;
  };
  walletAddress: Hex;
  nodeToInject: HTMLElement;
  isHandleUser: boolean;
  type: 'idrissSend';
}
