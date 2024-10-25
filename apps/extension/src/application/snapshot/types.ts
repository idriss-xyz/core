import { z } from 'zod';

import { proposalSchema } from './schema';

type RawProposal = z.infer<typeof proposalSchema>;

export type ProposalData = Omit<RawProposal, 'author'> & {
  author: {
    address: string;
    resolvedAddress?: string;
  };
};
