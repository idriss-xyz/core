import { z } from 'zod';

import { Hex, hexSchema } from 'shared/web3';

const MIN_SEND_AMOUNT = 0.001;

export const createSendPayloadSchema = (allowedChainIds: number[]) => {
  return z.object({
    amount: z
      .number()
      .gte(MIN_SEND_AMOUNT, `Value must be at least $${MIN_SEND_AMOUNT}`),
    tokenAddress: hexSchema,
    chainId: z.union(createPossibleChainIdsSchema(allowedChainIds)),
  });
};

const createPossibleChainIdsSchema = (chainIds: number[]) => {
  return chainIds.map((id) => {
    return z.literal(id);
  }) as [z.ZodLiteral<number>, z.ZodLiteral<number>, ...z.ZodLiteral<number>[]];
};

export type SendPayload = z.infer<ReturnType<typeof createSendPayloadSchema>>;

const iconTypeSchema = z.union([z.literal('redBadge'), z.literal('default')]);

export type IconType = z.infer<typeof iconTypeSchema>;

export const customRecipientSchema = z.object({
  walletAddress: z.string().regex(/^0x/) as unknown as z.ZodLiteral<Hex>,
  availableNetworks: z.array(z.number()),
  sendWidgetOverrides: z.object({
    headerCopy: z.string(),
    sendButtonCopy: z.string(),
    iconType: iconTypeSchema,
  }),
});
