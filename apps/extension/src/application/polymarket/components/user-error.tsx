import { match, P } from 'ts-pattern';

import { CHAIN } from 'shared/web3';

import { PolymarketUser } from '../types';

import { UsdcNotAllowedMessage } from './usdc-not-allowed-message';
import { AccountNotFoundMessage } from './account-not-found-message';
import { SomethingWentWrongMessage } from './something-went-wrong-message';

interface Properties {
  user: PolymarketUser;
  onRetry: () => void;
}

export const UserError = ({ user, onRetry }: Properties) => {
  return match(user)
    .with({ wallet: undefined }, () => {
      return null;
    })
    .with(
      {
        isSigning: true,
      },
      () => {
        return null;
      },
    )
    .with(
      {
        wallet: P.when((wallet) => {
          return wallet?.chainId !== CHAIN.POLYGON.id;
        }),
      },
      () => {
        return null;
      },
    )
    .with({ hasPolymarketAccount: true, hasUsdcAllowed: false }, () => {
      return <UsdcNotAllowedMessage onSwitchWallet={user.signIn} />;
    })
    .with({ hasPolymarketAccount: false }, () => {
      return <AccountNotFoundMessage onSwitchWallet={user.signIn} />;
    })
    .with({ isSigningError: true }, () => {
      return (
        <SomethingWentWrongMessage
          onRetry={onRetry}
          onSwitchWallet={user.signIn}
        />
      );
    })
    .otherwise(() => {
      return null;
    });
};
