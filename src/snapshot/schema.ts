import { z } from 'zod';

export const proposalSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  end: z.number(),
  author: z.string(),
  space: z.object({
    id: z.string(),
  }),
});

export const getProposalsResponseSchema = z.object({
  data: z.object({
    proposals: z.array(proposalSchema),
  }),
});
