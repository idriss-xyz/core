import { Application } from '../../donation.types';

export interface UseFeesProperties {
  application: Application;
  amountInWei: number;
  enabled: boolean;
}
