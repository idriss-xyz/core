import { Hex } from 'viem';
import { z } from 'zod';

export const hexSchema = z
  .string()
  .regex(/^0x/) as unknown as z.ZodLiteral<Hex>;
