import { useCallback, useEffect, useState } from 'react';
import { ExternalLink } from '@idriss-xyz/ui/external-link';
import { Icon as IdrissIcon } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { isSolanaAddress, getShortWalletHex } from '@idriss-xyz/utils';
import { isAddress } from 'viem';

import { useCommandQuery } from 'shared/messaging';
import {
  Icon,
  LazyImage,
  getGithubUserLink,
  TradingCopilotTooltip,
} from 'shared/ui';
import { getTwitterUserLink } from 'host/twitter';

import {
  GetEnsNameCommand,
  GetEnsInfoCommand,
  GetFarcasterUserCommand,
} from '../../../../../commands';

import { ContentProperties, Properties } from './subscription-item.types';

export const SubscriptionItem = ({ onRemove, subscription }: Properties) => {
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

  const avatarQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: ensNameQuery.data ?? '',
      infoKey: 'avatar',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!ensNameQuery.data,
  });

  const loadingDetails =
    farcasterUserQuery.isLoading ||
    ensNameQuery.isLoading ||
    avatarQuery.isLoading;

  return loadingDetails ? null : (
    <SubscriptionItemContent
      onRemove={onRemove}
      avatar={avatarQuery.data}
      subscription={subscription}
      farcasterDetails={farcasterUserQuery.data?.user}
      name={ensNameQuery.data ?? subscription.address}
    />
  );
};

const SubscriptionItemContent = ({
  name,
  avatar,
  onRemove,
  subscription,
  farcasterDetails,
}: ContentProperties) => {
  const ensNameNotFound = isAddress(name);
  const isFarcasterSubscription = !!farcasterDetails;
  const [showError, setShowError] = useState(false);

  const removeSubscription = useCallback(async () => {
    try {
      await onRemove({
        address: subscription.address,
        fid: subscription.fid,
        chainType: isSolanaAddress(subscription.address) ? 'SOLANA' : 'EVM',
      });
    } catch {
      setShowError(true);
    }
  }, [onRemove, subscription]);

  const emailQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: name,
      infoKey: 'email',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !ensNameNotFound,
  });

  const twitterQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: name,
      infoKey: 'com.twitter',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !ensNameNotFound,
  });

  const githubQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: name,
      infoKey: 'com.github',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !ensNameNotFound,
  });

  const discordQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: name,
      infoKey: 'com.discord',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !ensNameNotFound,
  });

  useEffect(() => {
      if (showError) {
        const timer = setTimeout(() => {
          setShowError(false);
        }, 2000);
        return () => {return clearTimeout(timer)};
      }
      return undefined;
    }, [showError]);


  const shortenedName =
    isAddress(name) || isSolanaAddress(name) ? getShortWalletHex(name) : name;

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center">
        <LazyImage
          src={isFarcasterSubscription ? farcasterDetails.pfp.url : avatar}
          className="size-8 rounded-full border border-neutral-400 bg-neutral-200"
          fallbackComponent={
            !isFarcasterSubscription &&
            !avatar && (
              <div className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
                <IdrissIcon
                  size={20}
                  name="CircleUserRound"
                  className="text-neutral-500"
                />
              </div>
            )
          }
        />
        <p className="ml-1.5 flex items-center gap-1.5 text-label5 text-neutral-600">
          {isFarcasterSubscription ? (
            farcasterDetails.displayName
          ) : (
            <TradingCopilotTooltip
              content={name}
              className="absolute start-0 translate-x-0"
            >
              {shortenedName}
            </TradingCopilotTooltip>
          )}
          {twitterQuery.data && (
            <ExternalLink href={getTwitterUserLink(twitterQuery.data)}>
              <IdrissIcon
                size={16}
                name="TwitterX"
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
      {showError ? (
        <IconButton
          size="small"
          iconName="AlertCircle"
          intent="tertiary"
          className="text-neutral-400"
        />
      ) : (
        <IconButton
          size="small"
          iconName="X"
          intent="tertiary"
          className="text-red-500"
          onClick={removeSubscription}
        />
      )}
    </li>
  );
};
