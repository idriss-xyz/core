import { z } from 'zod';

export const proposalSchema = z.object({
  id: z.string(),
  end: z.object({
    timestamp: z.string().datetime(),
  }),
  metadata: z.object({
    title: z.string(),
    description: z.string(),
  }),
  status: z.string(),
  organization: z.object({
    slug: z.string(),
  }),
  creator: z.object({
    address: z.string(),
    name: z.string(),
    ens: z.string(),
  }),
});

const proposalsPageInfoSchema = z.object({
  firstCursor: z.string(),
});

export const proposalsResponseObjectSchema = z.object({
  nodes: z.array(proposalSchema),
  pageInfo: proposalsPageInfoSchema,
});

export const getProposalsResponseSchema = z.object({
  data: z.object({
    proposalsV2: proposalsResponseObjectSchema,
  }),
});
