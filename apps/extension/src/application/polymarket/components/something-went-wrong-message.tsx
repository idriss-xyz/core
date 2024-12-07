import { ErrorMessage } from 'shared/ui';

interface Properties {
  onRetry: () => void;
  onSwitchWallet: () => void;
}

export const SomethingWentWrongMessage = ({
  onSwitchWallet,
  onRetry,
}: Properties) => {
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
