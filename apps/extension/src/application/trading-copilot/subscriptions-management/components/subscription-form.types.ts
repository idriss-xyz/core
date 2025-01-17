import { SubscribePayload } from '../../types';

export interface FormValues {
  subscription: string;
}

export interface Properties {
  subscriptionsAmount: number | undefined;
  onSubmit: (payload: SubscribePayload) => void;
}
