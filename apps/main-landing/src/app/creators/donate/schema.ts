import { hexSchema } from '@idriss-xyz/constants';
import { z } from 'zod';

const MIN_SEND_AMOUNT = 0.001;

const _createSendPayloadSchema = (allowedChainIds: number[]) => {
  return z.object({
    tokenAddress: hexSchema,
    message: z.string().max(90),
    chainId: z.union(createPossibleChainIdsSchema(allowedChainIds)),
    amount: z
      .number()
      .gte(MIN_SEND_AMOUNT, `Value must be at least $${MIN_SEND_AMOUNT}`),
  });
};

export type SendPayload = z.infer<ReturnType<typeof _createSendPayloadSchema>>;

export const createFormPayloadSchema = (allowedChainIds: number[]) => {
  return z.object({
    tokenSymbol: z.string(),
    message: z.string().max(90),
    chainId: z.union(createPossibleChainIdsSchema(allowedChainIds)),
    amount: z
      .number()
      .gte(MIN_SEND_AMOUNT, `Value must be at least $${MIN_SEND_AMOUNT}`),
  });
};

export type FormPayload = z.infer<ReturnType<typeof createFormPayloadSchema>>;

const createPossibleChainIdsSchema = (chainIds: number[]) => {
  return chainIds.map((id) => {
    return z.literal(id);
  }) as [z.ZodLiteral<number>, z.ZodLiteral<number>, ...z.ZodLiteral<number>[]];
};
