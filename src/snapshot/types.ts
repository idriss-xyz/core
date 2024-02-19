import { z } from 'zod';

import { proposalSchema } from './schema';

export type GetProposalsOptions = {
  first: number;
};

export type RawProposal = z.infer<typeof proposalSchema>;

export type Proposal = Omit<RawProposal, 'author'> & {
  author: {
    address: string;
    resolvedAddress?: string;
  };
};
