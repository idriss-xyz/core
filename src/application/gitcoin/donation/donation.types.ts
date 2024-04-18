import { z } from 'zod';

import { createDonationOptionsSchema } from './donation.schema';

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

export type DonationOptions = z.infer<
  ReturnType<typeof createDonationOptionsSchema>
>;

export interface DonateParameters {
  options: DonationOptions;
  application: Application;
  oneDollarPriceInEth: number;
}
