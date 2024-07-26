import { GitcoinDonationRecipient } from 'application/gitcoin';
import { IdrissSendRecipient } from 'application/idriss-send';

export type Recipient =
  | ({ type: 'gitcoin' } & GitcoinDonationRecipient)
  | ({ type: 'idrissSend' } & IdrissSendRecipient);
