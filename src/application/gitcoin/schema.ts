import { z } from 'zod';

import { Hex, hexSchema } from 'shared/web3';

import {
  GITCOIN_DONATION_CHAINS_IDS,
  MIN_CROSS_CHAIN_DONATION_AMOUNT,
  MIN_DONATION_AMOUNT,
} from './constants';

const possibleChainIdsSchema = GITCOIN_DONATION_CHAINS_IDS.map((id) => {
  return z.literal(id);
}) as [z.ZodLiteral<number>, z.ZodLiteral<number>, ...z.ZodLiteral<number>[]];

export const createDonationPayloadSchema = (isCrossChain: boolean) => {
  return z.object({
    tokenAddress: z.string().regex(/^0x/) as unknown as z.ZodLiteral<Hex>,
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

export const applicationSchema = z.object({
  roundId: z.string(),
  chainId: z.number(),
  project: z.object({
    id: z.string(),
    name: z.string(),
    anchorAddress: hexSchema,
    registryAddress: z.string(),
    metadata: z.object({
      projectTwitter: z.string().optional(),
    }),
  }),
});
