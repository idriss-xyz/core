import { useCallback, useEffect, useState } from 'react';
import { ExternalLink } from '@idriss-xyz/ui/external-link';
import { Icon as IdrissIcon } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useWallet } from '@idriss-xyz/wallet-connect';

import { useCommandQuery } from 'shared/messaging';
import { Icon, LazyImage, Spinner, getGithubUserLink } from 'shared/ui';
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
  const [loading, setLoading] = useState(true);

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
      ensName: ensNameQuery.data ?? subscription.address,
      infoKey: 'avatar',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!ensNameQuery.data,
  });

  useEffect(() => {
    if (!ensNameQuery.isLoading && !avatarQuery.isLoading) {
      setLoading(false);
    }
  }, [ensNameQuery.isLoading, avatarQuery.isLoading]);

  return (
    !loading && (
      <SubscriptionItemContent
        onRemove={onRemove}
        subscription={subscription}
        loading={loading}
        ensName={ensNameQuery.data ?? subscription.address}
        farcasterSubscriptionDetails={farcasterUserQuery.data}
        avatar={avatarQuery.data}
      />
    )
  );
};

const SubscriptionItemContent = ({
  ensName,
  onRemove,
  loading,
  subscription,
  farcasterSubscriptionDetails,
  avatar,
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
    enabled: !loading,
  });

  const twitterQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: ensName,
      infoKey: 'com.twitter',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !loading,
  });

  const githubQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: ensName,
      infoKey: 'com.github',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !loading,
  });

  const discordQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: ensName,
      infoKey: 'com.discord',
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !loading,
  });

  return (
    <li className="flex items-center justify-between">
      {!loading && (
        <>
          <div className="flex items-center">
            <LazyImage
              src={
                farcasterSubscriptionDetails?.result?.user?.pfp
                  ? farcasterSubscriptionDetails.result.user.pfp.url
                  : avatar
              }
              className="size-8 rounded-full border border-neutral-400 bg-neutral-200"
              fallbackComponent={
                !loading && (
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
              <>
                {ensName ? (
                  <>
                    {isFarcasterSubscription &&
                    farcasterSubscriptionDetails?.result?.user
                      ? farcasterSubscriptionDetails.result.user.displayName
                      : ensName}
                    {twitterQuery.data && (
                      <ExternalLink
                        href={getTwitterUserLink(twitterQuery.data)}
                      >
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
                  </>
                ) : (
                  <span>{subscription.address}</span>
                )}
              </>
            </p>
          </div>
          <IconButton
            intent="tertiary"
            size="small"
            iconName="X"
            onClick={remove}
            className="text-red-500"
          />
        </>
      )}
    </li>
  );
};
