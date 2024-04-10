import { ErrorMessage } from 'shared/ui/components';

import { POLYMARKET_WEBSITE } from '../../polymarket.constants';

import { UsdcNotAllowedMessageProperties } from './usdc-not-allowed-message.types';

export const UsdcNotAllowedMessage = ({
  onSwitchWallet,
}: UsdcNotAllowedMessageProperties) => {
  return (
    <ErrorMessage className="mt-4">
      Please enable USDC at{' '}
      <a
        href={POLYMARKET_WEBSITE}
        target="_blank"
        rel="noreferrer"
        className="font-semibold underline"
      >
        Polymarket
      </a>{' '}
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
