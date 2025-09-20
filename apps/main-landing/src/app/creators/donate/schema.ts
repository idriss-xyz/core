import { hexSchema } from '@idriss-xyz/constants';
import { z } from 'zod';

const MIN_SEND_AMOUNT = 0.001;

const _createSendPayloadSchema = (allowedChainIds: number[]) => {
  return z.object({
    tokenAddress: hexSchema.optional(),
    message: z.string().max(90, 'Max 90 characters allowed.'),
    chainId: z.union(createPossibleChainIdsSchema(allowedChainIds)),
    amount: z
      .number()
      .gte(MIN_SEND_AMOUNT, `Value must be at least $${MIN_SEND_AMOUNT}`)
      .optional(),
    sfx: z.string().max(30, 'Max 30 characters allowed.'),
    type: z.string().optional(),
    tokenId: z.string().optional(),
    contract: hexSchema.optional(),
  });
};

export type SendPayload = z.infer<ReturnType<typeof _createSendPayloadSchema>>;

export const createFormPayloadSchema = (allowedChainIds: number[]) => {
  return z.object({
    tokenSymbol: z.string().optional(),
    message: z.string().max(90, 'Max 90 characters allowed.'),
    chainId: z.union(createPossibleChainIdsSchema(allowedChainIds)),
    amount: z
      .number()
      .gte(MIN_SEND_AMOUNT, `Value must be at least $${MIN_SEND_AMOUNT}`)
      .optional(),
    sfx: z.string().max(30, 'Max 30 characters allowed.'),
    type: z.string().optional(),
    tokenId: z.string().optional(),
    contract: hexSchema.optional(),
  });
};

export type FormPayload = z.infer<ReturnType<typeof createFormPayloadSchema>>;

const createPossibleChainIdsSchema = (chainIds: number[]) => {
  return chainIds.map((id) => {
    return z.literal(id);
  }) as [z.ZodLiteral<number>, z.ZodLiteral<number>, ...z.ZodLiteral<number>[]];
};
