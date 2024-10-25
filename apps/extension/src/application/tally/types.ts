import { z } from 'zod';

import { proposalSchema, proposalsResponseObjectSchema } from './schema';

export type ProposalData = z.infer<typeof proposalSchema>;

export type ProposalsResponse = z.infer<typeof proposalsResponseObjectSchema>;
