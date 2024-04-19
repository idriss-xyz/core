import { z } from 'zod';

import {
  GITCOIN_DONATION_CHAINS_IDS,
  MIN_CROSS_CHAIN_DONATION_AMOUNT,
  MIN_DONATION_AMOUNT,
} from './donation.constants';

const possibleChainIdsSchema = GITCOIN_DONATION_CHAINS_IDS.map((id) => {
  return z.literal(id);
}) as [z.ZodLiteral<number>, z.ZodLiteral<number>, ...z.ZodLiteral<number>[]];

export const createDonationOptionsSchema = (isCrossChain: boolean) => {
  return z.object({
    amount: isCrossChain
      ? z
          .number()
          .gte(
            MIN_CROSS_CHAIN_DONATION_AMOUNT,
            `Value must be at least $${MIN_CROSS_CHAIN_DONATION_AMOUNT}`,
          )
      : z
          .number()
          .gte(
            MIN_DONATION_AMOUNT,
            `Value must be at least $${MIN_DONATION_AMOUNT}`,
          ),
    chainId: z.union(possibleChainIdsSchema),
  });
};
