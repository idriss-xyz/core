import { z } from 'zod';

import { proposalSchema, proposalsMetadata } from './schema';

export type ProposalData = z.infer<typeof proposalSchema>;
export type ProposalMetadata = z.infer<typeof proposalsMetadata>;
