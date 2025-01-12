import { MutableRefObject } from 'react';

import { Wallet } from 'shared/web3';

export interface Properties {
  isTabChangedListenerAdded: MutableRefObject<boolean>;
}

export interface ContentProperties extends Properties {
  subscriberId: string;
  wallet: Wallet;
}
