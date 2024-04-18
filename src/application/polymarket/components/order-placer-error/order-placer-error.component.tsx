import { match } from 'ts-pattern';

import { SomethingWentWrongMessage } from '../something-went-wrong-message';

import { OrderPlacerErrorProperties } from './order-placer-error.types';

export const OrderPlacerError = ({
  orderPlacer,
  onRetry,
  onSwitchWallet,
}: OrderPlacerErrorProperties) => {
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
