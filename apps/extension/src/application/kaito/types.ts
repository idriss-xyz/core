import { z } from 'zod';

import { yapSchema } from './schema';

export type YapResponse = z.infer<typeof yapSchema>;
