import { z } from 'zod';

import { Hex } from './types';

export const hexSchema = z
  .string()
  .regex(/^0x/) as unknown as z.ZodLiteral<Hex>;
