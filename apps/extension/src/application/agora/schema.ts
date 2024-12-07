import { z } from 'zod';

export const proposalSchema = z.object({
  id: z.string(),
  proposer: z.string(),
  description: z.string(),
  markdowntitle: z.string(),
  endTime: z.string().datetime(),
  status: z.string(),
});

export const proposalsMetadata = z.object({
  has_next: z.boolean(),
});

export const getProposalsResponseSchema = z.object({
  meta: proposalsMetadata,
  data: z.array(proposalSchema),
});
