import { ErrorMessage } from 'shared/ui/components';

import { SomethingWentWrongMessageProperties } from './something-went-wrong-message.types';

export const SomethingWentWrongMessage = ({
  onSwitchWallet,
  onRetry,
}: SomethingWentWrongMessageProperties) => {
  return (
    <ErrorMessage className="mt-4">
      Something went wrong.{' '}
      <span
        onClick={onRetry}
        className="cursor-pointer font-semibold underline"
      >
        Try again
      </span>{' '}
      or{' '}
      <span
        className="cursor-pointer font-semibold underline"
        onClick={onSwitchWallet}
      >
        switch wallet
      </span>
      .
    </ErrorMessage>
  );
};
