import { Wallet } from 'shared/web3';

import { Application } from '../../donation.types';

export interface UseDonateTransactionProperties {
  wallet: Wallet;
  application: Application;
  userAmountInWei: number;
}
