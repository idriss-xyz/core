import { z } from 'zod';

export const twitterIdSchema = z.object({
  twitterIDs: z.record(z.string(), z.string()),
});
