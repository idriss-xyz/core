import { z } from 'zod';

import { getProposalsResponseSchema, proposalSchema } from './schema';

export type ProposalData = z.infer<typeof proposalSchema>;

export type ProposalsResponse = z.infer<typeof getProposalsResponseSchema>;
export type ProposalsResponseData = ProposalsResponse['data'];
