import { ExternalLink } from '@idriss-xyz/ui/external-link';

import { ErrorMessage } from 'shared/ui';

import { POLYMARKET_WEBSITE } from '../constants';

interface AccountNotFoundMessageProperties {
  onSwitchWallet: () => void;
}

export const AccountNotFoundMessage = ({
  onSwitchWallet,
}: AccountNotFoundMessageProperties) => {
  return (
    <ErrorMessage className="mt-4">
      Account not found. Create{' '}
      <ExternalLink
        href={POLYMARKET_WEBSITE}
        className="font-semibold underline"
      >
        Polymarket
      </ExternalLink>{' '}
      account and enable trading or{' '}
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
