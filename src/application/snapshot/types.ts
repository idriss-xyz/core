import { z } from 'zod';

import { proposalSchema } from './schema';

export interface GetProposalsOptions {
  first: number;
}

export type RawProposal = z.infer<typeof proposalSchema>;

export type ProposalData = Omit<RawProposal, 'author'> & {
  author: {
    address: string;
    resolvedAddress?: string;
  };
};
