import { match } from 'ts-pattern';

import { OrderPlacer } from '../types';

import { SomethingWentWrongMessage } from './something-went-wrong-message';

interface Properties {
  orderPlacer: OrderPlacer;
  onRetry: () => void;
  onSwitchWallet: () => void;
}

export const OrderPlacerError = ({
  orderPlacer,
  onRetry,
  onSwitchWallet,
}: Properties) => {
  return match(orderPlacer)
    .with({ isError: true }, () => {
      return (
        <SomethingWentWrongMessage
          onRetry={onRetry}
          onSwitchWallet={onSwitchWallet}
        />
      );
    })
    .otherwise(() => {
      return null;
    });
};
