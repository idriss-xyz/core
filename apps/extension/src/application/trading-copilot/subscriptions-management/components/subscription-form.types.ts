import { SubscribePayload } from '../../types';

export interface FormValues {
  subscription: string;
}

export interface Properties {
  canSubscribe: boolean;
  onSubmit: (payload: SubscribePayload) => Promise<void>;
}
