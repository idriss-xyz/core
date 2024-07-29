import { z } from 'zod';

import { applicationSchema, createDonationPayloadSchema } from './schema';

export type Application = z.infer<typeof applicationSchema>;

export type DonationPayload = z.infer<
  ReturnType<typeof createDonationPayloadSchema>
>;

export interface DonateParameters {
  options: DonationPayload;
  application: Application;
  ethPerDollar: number;
}

export interface Recipient {
  top: number;
  username: string;
  nodeToInject: HTMLElement;
  isHandleUser: boolean;
  application: Application;
}
export interface CrossChainDonationData {
  chainId: number;
  roundId: number;
  donor: string;
  voteParams: string;
  nonce: number;
  validUntil: number;
  verifyingContract: string;
}
