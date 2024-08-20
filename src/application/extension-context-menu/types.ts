import { z } from 'zod';

import { twitterIdSchema } from './schema';

export type TwitterIdsResponse = z.infer<typeof twitterIdSchema>;
