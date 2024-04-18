import { Wallet } from 'shared/web3';

import { Application } from '../../donation.types';

export interface UseAcrossDonateTransactionProperties {
  wallet: Wallet;
  application: Application;
  userAmountInWei: number;
  chainId: number;
}
