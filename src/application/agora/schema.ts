import { z } from 'zod';

export const proposalSchema = z.object({
  proposalId: z.string(),
  proposerAddress: z.string(),
  description: z.string(),
  endBlock: z.string(),
  proposalData: z.object({
    title: z.string(),
    endTimestamp: z.string().datetime(),
    state: z.string(),
  }),
});

const proposalsMetadata = z.object({
  has_next: z.boolean(),
});

export const getProposalsResponseSchema = z.object({
  data: z.object({
    metadata: proposalsMetadata,
    proposals: z.array(proposalSchema),
  }),
});
