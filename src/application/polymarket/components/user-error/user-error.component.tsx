import { match, P } from 'ts-pattern';

import { CHAIN } from 'shared/web3';

import { UsdcNotAllowedMessage } from '../usdc-not-allowed-message';
import { AccountNotFoundMessage } from '../account-not-found-message';
import { SomethingWentWrongMessage } from '../something-went-wrong-message';

import { UserErrorProperties } from './user-error.types';

export const UserError = ({ user, onRetry }: UserErrorProperties) => {
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
