import { z } from 'zod';

import { Hex } from './types';

export const hexSchema = z
  .string()
  .regex(/^0x/) as unknown as z.ZodLiteral<Hex>;

const MIN_SEND_AMOUNT = 0.001;

export const createSendPayloadSchema = (allowedChainIds: number[]) => {
  return z.object({
    amount: z
      .number()
      .gte(MIN_SEND_AMOUNT, `Value must be at least $${MIN_SEND_AMOUNT}`),
    tokenAddress: hexSchema,
    chainId: z.union(createPossibleChainIdsSchema(allowedChainIds)),
    message: z.string().max(70),
  });
};

const createPossibleChainIdsSchema = (chainIds: number[]) => {
  return chainIds.map((id) => {
    return z.literal(id);
  }) as [z.ZodLiteral<number>, z.ZodLiteral<number>, ...z.ZodLiteral<number>[]];
};

export type SendPayload = z.infer<ReturnType<typeof createSendPayloadSchema>>;
