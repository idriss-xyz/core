import { ExternalLink } from '@idriss-xyz/ui/external-link';

import { ErrorMessage } from 'shared/ui';

import { POLYMARKET_WEBSITE } from '../constants';

interface UsdcNotAllowedMessageProperties {
  onSwitchWallet: () => void;
}

export const UsdcNotAllowedMessage = ({
  onSwitchWallet,
}: UsdcNotAllowedMessageProperties) => {
  return (
    <ErrorMessage className="mt-4">
      Please enable USDC at{' '}
      <ExternalLink
        href={POLYMARKET_WEBSITE}
        className="font-semibold underline"
      >
        Polymarket
      </ExternalLink>{' '}
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
