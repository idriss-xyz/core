import { z } from 'zod';

export const yapSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  yaps_all: z.number(),
  yaps_l24h: z.number(),
  yaps_l48h: z.number(),
  yaps_l7d: z.number(),
  yaps_l30d: z.number(),
  yaps_l3m: z.number(),
  yaps_l6m: z.number(),
  yaps_l12m: z.number(),
});
