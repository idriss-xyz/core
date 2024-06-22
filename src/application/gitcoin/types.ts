import { z } from 'zod';

import { createDonationPayloadSchema } from './schema';

export interface ProjectMetadata {
  projectTwitter?: string;
}

export interface Project {
  id: string;
  name: string;
  metadata: ProjectMetadata;
  anchorAddress: string;
  registryAddress: string;
}

export interface Application {
  roundId: string;
  chainId: number;
  project: Project;
}

export interface GetApplicationsResponse {
  arbitrum: Application[];
  optimism: Application[];
}

export type DonationPayload = z.infer<
  ReturnType<typeof createDonationPayloadSchema>
>;

export interface DonateParameters {
  options: DonationPayload;
  application: Application;
  ethPerDollar: number;
}
