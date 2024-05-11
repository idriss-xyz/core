import { ErrorMessage } from 'shared/ui/components';

interface Properties {
  onRetry: () => void;
}

export const SomethingWentWrongMessage = ({ onRetry }: Properties) => {
  return (
    <ErrorMessage className="mt-4">
      Something went wrong.{' '}
      <span
        onClick={onRetry}
        className="cursor-pointer font-semibold underline"
      >
        Try again
      </span>
      .
    </ErrorMessage>
  );
};
