import { useCallback } from 'react';
import { ExternalLink } from '@idriss-xyz/ui/external-link';
import { Icon as IdrissIcon } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useWallet } from '@idriss-xyz/wallet-connect';

import { useCommandQuery } from 'shared/messaging';
import { Icon, LazyImage, getGithubUserLink } from 'shared/ui';
import { getTwitterUserLink } from 'host/twitter';

import {
  GetEnsNameCommand,
  GetEnsInfoCommand,
  GetFarcasterUserCommand,
} from '../../../commands';
import { useLoginViaSiwe } from '../../../hooks';

import {
  ItemProperties,
  ItemContentProperties,
} from './subscription-list.types';

export const SubscriptionItem = ({
  onRemove,
  subscription,
}: ItemProperties) => {
  const farcasterUserQuery = useCommandQuery({
    command: new GetFarcasterUserCommand({
      id: subscription?.fid ?? Number(),
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!subscription.fid,
  });

  const ensNameQuery = useCommandQuery({
    command: new GetEnsNameCommand({
      address: subscription.address,
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <SubscriptionItemContent
      onRemove={onRemove}
      subscription={subscription}
      isFallback={ensNameQuery.isFetched && ensNameQuery.data === null}
      ensName={ensNameQuery.data ?? subscription.address}
      farcasterSubscriptionDetails={farcasterUserQuery.data}
    />
  );
};

const SubscriptionItemContent = ({
  ensName,
  onRemove,
  isFallback,
  subscription,
  farcasterSubscriptionDetails,
}: ItemContentProperties) => {
  const { wallet } = useWallet();
  const siwe = useLoginViaSiwe();
  const isFarcasterSubscription = !!farcasterSubscriptionDetails;

  const remove = useCallback(async () => {
    const siweLoggedIn = siwe.loggedIn();

    if (!wallet) {
      return;
    }

    if (!siweLoggedIn) {
      await siwe.login(wallet);
    }

    onRemove(subscription.address);
  }, [onRemove, siwe, subscription, wallet]);

  const emailQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: ensName,
      infoKey: 'email',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !isFallback,
  });

  const twitterQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: ensName,
      infoKey: 'com.twitter',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !isFallback,
  });

  const githubQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: ensName,
      infoKey: 'com.github',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !isFallback,
  });

  const discordQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: ensName,
      infoKey: 'com.discord',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !isFallback,
  });

  const avatarQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: ensName,
      infoKey: 'avatar',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !isFallback && !isFarcasterSubscription,
  });

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center">
        <LazyImage
          src={
            isFarcasterSubscription
              ? farcasterSubscriptionDetails?.result.user.pfp.url
              : avatarQuery.data
          }
          className="size-8 rounded-full border border-neutral-400 bg-neutral-200"
          fallbackComponent={
            <div className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
              <IdrissIcon
                size={20}
                name="CircleUserRound"
                className="text-neutral-500"
              />
            </div>
          }
        />

        <p className="ml-1.5 flex items-center gap-1.5 text-label5 text-neutral-600">
          {isFarcasterSubscription
            ? farcasterSubscriptionDetails?.result.user.displayName
            : ensName}

          {twitterQuery.data && (
            <ExternalLink href={getTwitterUserLink(twitterQuery.data)}>
              <IdrissIcon
                name="TwitterX"
                size={16}
                className="text-[#757575]"
              />
            </ExternalLink>
          )}
          {githubQuery.data && (
            <ExternalLink href={getGithubUserLink(githubQuery.data)}>
              <Icon
                size={16}
                name="GitHubLogoIcon"
                className="text-[#757575]"
              />
            </ExternalLink>
          )}
          {discordQuery.data && (
            <span title={discordQuery.data}>
              <Icon
                size={16}
                name="DiscordLogoIcon"
                className="text-[#757575]"
              />
            </span>
          )}
          {emailQuery.data && (
            <ExternalLink href={`mailto:${emailQuery.data}`}>
              <Icon
                size={16}
                name="EnvelopeClosedIcon"
                className="text-[#757575]"
              />
            </ExternalLink>
          )}
        </p>
      </div>
      <IconButton
        intent="tertiary"
        size="small"
        iconName="Trash2"
        onClick={remove}
        className="text-red-500"
      />
    </li>
  );
};
