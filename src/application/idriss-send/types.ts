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

export interface ResolveAddressProperties {
  walletAddress: Hex;
  username: string;
}

export interface AddressResolver {
  resolve: (properties: ResolveAddressProperties) => Promise<`0x${string}`>;
  hasError: boolean;
  isResolving: boolean;
  reset: () => void;
}
