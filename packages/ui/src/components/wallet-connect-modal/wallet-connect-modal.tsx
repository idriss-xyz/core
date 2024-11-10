import { useCallback, useState } from 'react';
import { TERMS_OF_SERVICE_LINK } from '@idriss-xyz/constants';

import { classes } from '../../utils';
import { Button } from '../button';
import { Modal } from '../modal';
import { ExternalLink } from '../external-link';

type WalletProvider = {
  uuid: string;
  rdns: string;
  icon: `data:image/${string}`;
  name: string;
};

type Properties = {
  onClose: () => void;
  isOpened: boolean;
  walletProviders: WalletProvider[];
  isConnecting?: boolean;
  onConnect?: (provider: WalletProvider) => void;
};

export const WalletConnectModal = ({
  isOpened,
  walletProviders,
  isConnecting = false,
  onClose,
  onConnect,
}: Properties) => {
  const [chosenProvider, setChosenProvider] = useState<WalletProvider>();
  const [termsOfUseAccepted] = useState(true);

  const connectProvider = useCallback(() => {
    if (!chosenProvider) {
      return;
    }

    onConnect?.(chosenProvider);
  }, [chosenProvider, onConnect]);

  const hasSomeProvider = walletProviders.length > 0;

  const hasNotSatisfyAllRequirementsYet =
    hasSomeProvider && (!termsOfUseAccepted || !chosenProvider);

  return (
    <Modal
      className="p-4"
      header={
        <div>
          <h2 className="text-heading5 text-neutral-900">Log in</h2>
          {hasSomeProvider && (
            <p className="mt-2 text-body5 text-neutral-600">
              Select a wallet bellow to log in to your account
            </p>
          )}
        </div>
      }
      width={400}
      onClose={onClose}
      isOpened={isOpened}
    >
      <div className="mt-6">
        {hasSomeProvider ? (
          <>
            <p className="text-label6 text-neutral-600">Installed wallets</p>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {walletProviders.map((provider) => {
                return (
                  <button
                    className={classes(
                      'flex flex-col items-center gap-2 rounded-xl bg-neutral-100 p-4 disabled:opacity-50',
                      chosenProvider?.rdns === provider.rdns && 'bg-black/10',
                    )}
                    key={provider.uuid}
                    onClick={() => {
                      setChosenProvider(provider);
                    }}
                    disabled={isConnecting}
                  >
                    <img
                      src={provider.icon}
                      className="h-12"
                      alt={`Connect with ${provider.name}`}
                    />
                    <span className="text-label6 text-neutral-900">
                      {provider.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-label4 text-neutral-600">
            No wallet provider found. Enable your wallet extension and try
            again.
          </p>
        )}

        <p className="mt-6 text-body5 text-neutralGreen-900">
          <span>{`By connecting your wallet you're accepting `}</span>
          <ExternalLink className="text-mint-600" href={TERMS_OF_SERVICE_LINK}>
            Terms of service
          </ExternalLink>
        </p>

        <Button
          className="mt-6 w-full"
          intent="primary"
          size="large"
          onClick={hasSomeProvider ? connectProvider : onClose}
          disabled={hasNotSatisfyAllRequirementsYet || isConnecting}
        >
          {hasSomeProvider ? 'CONTINUE' : 'CLOSE'}
        </Button>
      </div>
    </Modal>
  );
};
