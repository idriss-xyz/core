import { z } from 'zod';

import { smartFollowersSchema, yapSchema } from './schema';

export type YapResponse = z.infer<typeof yapSchema>;

export type SmartFollowersResponse = z.infer<typeof smartFollowersSchema>;
