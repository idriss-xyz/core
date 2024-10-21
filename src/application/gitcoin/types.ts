import { z } from 'zod';

import { applicationSchema, createDonationPayloadSchema } from './schema';

export type Application = z.infer<typeof applicationSchema>;

export type DonationPayload = z.infer<
  ReturnType<typeof createDonationPayloadSchema>
>;

export interface WidgetData {
  top: number;
  username: string;
  node: HTMLElement;
  nodeId: string;
  isHandleUser: boolean;
  application: Application;
  type: 'gitcoin';
}
