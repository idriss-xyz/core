import { EIP1193Provider } from 'mipd';

import { Hex } from '../web3.types';

export interface Wallet {
  provider: EIP1193Provider;
  account: Hex;
  chainId: number;
}
