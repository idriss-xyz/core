import { hexSchema } from '@idriss-xyz/constants';
import { z } from 'zod';

const MIN_SEND_AMOUNT = 0.001;

const _createSendPayloadSchema = (allowedChainIds: number[]) => {
  return z.object({
    amount: z
      .number()
      .gte(MIN_SEND_AMOUNT, `Value must be at least $${MIN_SEND_AMOUNT}`),
    tokenAddress: hexSchema,
    chainId: z.union(createPossibleChainIdsSchema(allowedChainIds)),
    message: z.string().max(90),
  });
};

export const createFormPayloadSchema = (allowedChainIds: number[]) => {
  return z.object({
    amount: z
      .number()
      .gte(MIN_SEND_AMOUNT, `Value must be at least $${MIN_SEND_AMOUNT}`),
    tokenSymbol: z.string(),
    chainId: z.union(createPossibleChainIdsSchema(allowedChainIds)),
    message: z.string().max(90),
  });
};

const createPossibleChainIdsSchema = (chainIds: number[]) => {
  return chainIds.map((id) => {
    return z.literal(id);
  }) as [z.ZodLiteral<number>, z.ZodLiteral<number>, ...z.ZodLiteral<number>[]];
};

export type SendPayload = z.infer<ReturnType<typeof _createSendPayloadSchema>>;
export type FormPayload = z.infer<ReturnType<typeof createFormPayloadSchema>>;
